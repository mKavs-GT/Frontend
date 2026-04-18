import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download, Bell, BellOff, X } from 'lucide-react';

const PWAControls: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    'serviceWorker' in navigator ? Notification.permission : 'denied'
  );
  const [showStatus, setShowStatus] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // Check if we already have a subscription on mount
    const checkSubscription = async () => {
      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            // If permission is granted but no subscription, try to resubscribe silently
            handlePushSubscription(true);
        }
      }
    };
    checkSubscription();
    
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const handlePushSubscription = async (silent = false) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        if (!silent) alert('Push notifications are not supported in this browser.');
        return;
    }

    try {
      let permission = Notification.permission;
      
      if (permission === 'default' && !silent) {
        permission = await Notification.requestPermission();
        setNotificationPermission(permission);
      }
      
      if (permission === 'granted') {
        setIsSubscribing(true);
        const registration = await navigator.serviceWorker.ready;
        
        // --- THE FIX: Clean up any old, broken subscriptions first ---
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
            console.log('[PWA] Found existing subscription, cleaning up...');
            await existingSub.unsubscribe();
        }
        // -------------------------------------------------------------

        const publicVapidKey = 'BCIx6QgWUCAP5Dce_gNwW7vqfCw3AhU_WRoBFClOIqJZlJtIFNMZaZQC_q8jLZnl1H2zkYvDE6YOoitbbn1XEsQ';
        
        console.log('[PWA] Creating fresh subscription...');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        console.log('[PWA] Subscription created:', JSON.stringify(subscription));

        const token = sessionStorage.getItem('adminToken');
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

        console.log('[PWA] Sending subscription to backend:', `${API_BASE}/api/push/subscribe`);
        const response = await fetch(`${API_BASE}/api/push/subscribe`, {
          method: 'POST',
          body: JSON.stringify({
            subscription,
            deviceLabel: `${navigator.platform} (${navigator.language})`
          }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
            console.log('[PWA] Subscription successfully saved on backend');
        } else {
            const errorText = await response.text();
            console.error('[PWA] Backend failed to save subscription:', response.status, errorText);
        }
      }
    } catch (error) {
      console.error('[PWA] End-to-end subscription error:', error);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleTestPush = async () => {
    try {
        const token = sessionStorage.getItem('adminToken');
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        
        console.log('[PWA] Requesting test push...');
        const response = await fetch(`${API_BASE}/api/push/test`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            console.log('[PWA] Test push request sent successfully');
        } else {
            console.error('[PWA] Test push request failed');
        }
    } catch (error) {
        console.error('[PWA] Error triggering test push:', error);
    }
  };

  const handleUnsubscribe = async () => {
      try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
              const token = sessionStorage.getItem('adminToken');
              const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

              await fetch(`${API_BASE}/api/push/unsubscribe`, {
                  method: 'POST',
                  body: JSON.stringify({ endpoint: subscription.endpoint }),
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  }
              });
              await subscription.unsubscribe();
              console.log('Unsubscribed successfully');
          }
      } catch (error) {
          console.error('Unsubscribe error:', error);
      }
  };

  // Helper function for VAPID key conversion
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <>
      {/* Network Status Banner */}
      <AnimatePresence>
        {(showStatus || !isOnline) && (
          <motion.div
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            exit={{ y: -100 }}
            className={`fixed top-0 left-0 right-0 z-[1000] p-3 flex items-center justify-center gap-2 text-sm font-medium ${
              isOnline ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
            } backdrop-blur-md`}
          >
            {isOnline ? (
              <><Wifi size={16} /> You are back online</>
            ) : (
              <><WifiOff size={16} /> You are currently offline. Using cached data.</>
            )}
            {isOnline && (
              <button onClick={() => setShowStatus(false)} className="absolute right-4">
                <X size={16} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating PWA Controls */}
      <div className="fixed bottom-6 right-6 z-[500] flex flex-col items-end gap-3">
        {/* Install Button */}
        {installPrompt && (
          <motion.button
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstall}
            className="p-3 rounded-full bg-[#c7f908] text-black shadow-lg shadow-[#c7f908]/20 flex items-center gap-2 font-bold text-sm"
          >
            <Download size={18} />
            <span>Install MKAVS Admin</span>
          </motion.button>
        )}

        {/* Push Notification Controls */}
        <div className="flex flex-col items-end gap-2">
            {notificationPermission === 'denied' ? (
                <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md p-3 rounded-2xl text-[10px] text-red-400 font-bold max-w-[200px] text-center">
                    Notifications blocked. Please enable them in site settings to receive alerts.
                </div>
            ) : (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubscribing}
                    onClick={() => notificationPermission === 'granted' ? handleUnsubscribe() : handlePushSubscription(false)}
                    className={`p-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm transition-all ${
                        notificationPermission === 'granted' 
                        ? 'bg-blue-600 text-white shadow-blue-600/20' 
                        : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'
                    }`}
                >
                    {isSubscribing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : notificationPermission === 'granted' ? (
                        <Bell size={18} />
                    ) : (
                        <BellOff size={18} />
                    )}
                    <span>
                        {notificationPermission === 'granted' 
                            ? 'Notifications Enabled' 
                            : 'Enable Notifications'}
                    </span>
                </motion.button>
            )}

            {notificationPermission === 'granted' && (
                <motion.button
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTestPush}
                    className="p-2 px-4 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold hover:bg-white/10 transition-all"
                >
                    Send Test Push
                </motion.button>
            )}
        </div>
      </div>
    </>
  );
};

export default PWAControls;
