import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download, Bell, BellOff, X } from 'lucide-react';

const PWAControls: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const logDebug = (msg: string) => {
    console.log(`[DEBUG-PWA] ${msg}`);
    setDebugLog(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const handleInstall = async () => {
    if (!installPrompt) return;
    try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
            setInstallPrompt(null);
        }
    } catch (err) {
        logDebug('Install error: ' + err);
    }
  };

  useEffect(() => {
    logDebug(`Permission on mount: ${Notification.permission}`);
    if ('serviceWorker' in navigator) {
        logDebug(`SW Controller: ${navigator.serviceWorker.controller ? 'Present' : 'Missing'}`);
        navigator.serviceWorker.ready.then(reg => {
            logDebug(`SW Ready: ${reg.active ? 'Active' : 'Inactive'} (Scope: ${reg.scope})`);
        });
    }

    const checkSubscription = async () => {
      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            logDebug('Granted but no subscription found. Attempting silent recovery...');
            handlePushSubscription(true);
        } else {
            logDebug('Active subscription found on mount');
        }
      }
    };
    checkSubscription();
    // ... rest of useEffect
    
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

  const handlePushSubscription = async (silent = false) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        logDebug('Push not supported by browser');
        return;
    }

    try {
      let permission = Notification.permission;
      logDebug(`Starting subscription flow. Permission: ${permission}`);
      
      if (permission === 'default' && !silent) {
        permission = await Notification.requestPermission();
        logDebug(`Requested permission. Result: ${permission}`);
      }
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        logDebug(`SW ready for subscribe. Active: ${registration.active ? 'Yes' : 'No'}`);
        
        // --- Clean up ---
        const existingSub = await registration.pushManager.getSubscription();
        if (existingSub) {
            logDebug('Found existing sub, cleaning up...');
            await existingSub.unsubscribe();
        }

        const publicVapidKey = 'BCIx6QgWUCAP5Dce_gNwW7vqfCw3AhU_WRoBFClOIqJZlJtIFNMZaZQC_q8jLZnl1H2zkYvDE6YOoitbbn1XEsQ';
        logDebug(`VAPID Key Length: ${publicVapidKey.length}`);
        
        const convertedKey = urlBase64ToUint8Array(publicVapidKey);
        logDebug(`Converted Key (Uint8Array) Length: ${convertedKey.byteLength}`);

        logDebug('Calling pushManager.subscribe()...');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedKey
        });

        logDebug(`Subscribe success! Endpoint: ${subscription.endpoint.substring(0, 30)}...`);

        const token = sessionStorage.getItem('adminToken');
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.mkavs.com';

        logDebug(`Syncing with backend: ${API_BASE}`);
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
            logDebug('Backend sync complete');
        } else {
            logDebug(`Backend sync FAILED: ${response.status}`);
        }
      }
    } catch (error: any) {
      logDebug(`CRITICAL ERROR: ${error.name} - ${error.message}`);
      console.error('[DEBUG-PWA] Full error:', error);
    }
  };

  const handleTestPush = async () => {
    try {
        const token = sessionStorage.getItem('adminToken');
        const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.mkavs.com';
        
        logDebug('Triggering test push...');
        const response = await fetch(`${API_BASE}/api/push/test`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            logDebug('Test push requested');
        } else {
            logDebug(`Test push failed: ${response.status}`);
        }
    } catch (error: any) {
        logDebug(`Test push error: ${error.message}`);
    }
  };

  const handleUnsubscribe = async () => {
      try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
              const token = sessionStorage.getItem('adminToken');
              const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.mkavs.com';

              await fetch(`${API_BASE}/api/push/unsubscribe`, {
                  method: 'POST',
                  body: JSON.stringify({ endpoint: subscription.endpoint }),
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`
                  }
              });
              await subscription.unsubscribe();
              logDebug('Unsubscribed');
          }
      } catch (error: any) {
          logDebug(`Unsubscribe error: ${error.message}`);
      }
  };

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
      {/* Debug Panel Overlay */}
      {showDebug && (
        <div className="fixed inset-0 bg-black/90 z-[9999] p-6 font-mono text-[10px] text-green-400 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold">PWA DEBUG LOG</h2>
            <button onClick={() => setShowDebug(false)} className="p-2 bg-white/10 rounded">CLOSE</button>
          </div>
          <div className="space-y-1">
            {debugLog.map((log, i) => <div key={i} className="border-b border-white/5 pb-1">{log}</div>)}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <button onClick={() => handlePushSubscription(false)} className="p-2 bg-blue-600 text-white rounded">Retry Subscribe</button>
            <button 
                onClick={async () => {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for(let registration of registrations) { await registration.unregister(); }
                    logDebug('SW Unregistered. Please refresh the page.');
                }} 
                className="p-2 bg-red-600 text-white rounded"
            >
                Reset Service Worker
            </button>
            <button onClick={() => setDebugLog([])} className="p-2 bg-white/10 rounded">Clear Log</button>
          </div>
        </div>
      )}

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
        {/* Debug Toggle */}
        <button 
          onClick={() => setShowDebug(true)}
          className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
        >
          <X size={14} className="rotate-45" />
        </button>

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
            {Notification.permission === 'denied' ? (
                <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md p-3 rounded-2xl text-[10px] text-red-400 font-bold max-w-[200px] text-center">
                    Notifications blocked. Please enable them in site settings to receive alerts.
                </div>
            ) : (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => Notification.permission === 'granted' ? handleUnsubscribe() : handlePushSubscription(false)}
                    className={`p-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm transition-all ${
                        Notification.permission === 'granted' 
                        ? 'bg-blue-600 text-white shadow-blue-600/20' 
                        : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'
                    }`}
                >
                    {Notification.permission === 'granted' ? <Bell size={18} /> : <BellOff size={18} />}
                    <span>
                        {Notification.permission === 'granted' 
                            ? 'Notifications Enabled' 
                            : 'Enable Notifications'}
                    </span>
                </motion.button>
            )}

            {Notification.permission === 'granted' && (
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
