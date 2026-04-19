import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download, Bell, BellOff, X } from 'lucide-react';
import { usePushNotifications } from '../hooks/usePushNotifications';

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

  const { permission: pushPermission, isSubscribed, isLoading, error: pushError, subscribe, unsubscribe, sendTestNotification } = usePushNotifications();

  const handlePushToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

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
            {pushPermission === 'denied' ? (
                <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-md p-3 rounded-2xl text-[10px] text-red-400 font-bold max-w-[200px] text-center">
                    Notifications blocked. Please enable them in site settings to receive alerts.
                </div>
            ) : (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePushToggle}
                    disabled={isLoading}
                    className={`p-3 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm transition-all ${
                        isSubscribed 
                        ? 'bg-blue-600 text-white shadow-blue-600/20' 
                        : 'bg-white/10 text-white backdrop-blur-md border border-white/20 hover:bg-white/20'
                    }`}
                >
                    {isSubscribed ? <Bell size={18} /> : <BellOff size={18} />}
                    <span>
                        {isLoading ? '...' : (isSubscribed ? 'Alerts On' : 'Enable Alerts')}
                    </span>
                </motion.button>
            )}

            {isSubscribed && (
                <motion.button
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendTestNotification}
                    disabled={isLoading}
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
