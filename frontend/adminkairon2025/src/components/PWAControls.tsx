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

  useEffect(() => {
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

  const handlePushSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        alert('Push notifications are not supported in this browser.');
        return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        
        // Subscription logic
        const publicVapidKey = 'BEDvTRHa3VABRMWaaSfyHbOaK7-GA_7Cd9ycWs2LhBozFqkI-u-7LCdh6QEp39j8dwutujrHjyKokECuD6rcRSg';
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });

        const token = sessionStorage.getItem('adminToken');
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

        await fetch(`${API_BASE}/api/push/subscribe`, {
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

        console.log('Push subscription successful');
      }
    } catch (error) {
      console.error('Error requesting notification permission or subscribing:', error);
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
      <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-3">
        {/* Install Button */}
        {installPrompt && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleInstall}
            className="p-3 rounded-full bg-[#c7f908] text-black shadow-lg shadow-[#c7f908]/20 flex items-center gap-2 font-bold text-sm"
          >
            <Download size={18} />
            <span>Install App</span>
          </motion.button>
        )}

        {/* Push Notification Toggle */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePushSubscription}
          className={`p-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm transition-colors ${
            notificationPermission === 'granted' 
              ? 'bg-blue-600 text-white shadow-blue-600/20' 
              : 'bg-white/10 text-white backdrop-blur-md border border-white/20'
          }`}
        >
          {notificationPermission === 'granted' ? <Bell size={18} /> : <BellOff size={18} />}
          <span>{notificationPermission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}</span>
        </motion.button>
      </div>
    </>
  );
};

export default PWAControls;
