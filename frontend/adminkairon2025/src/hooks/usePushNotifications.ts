import { useState, useEffect, useCallback } from 'react';

export const usePushNotifications = () => {
    const [permission, setPermission] = useState<NotificationPermission>(Notification.permission);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkSubscription = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (err) {
            console.error('Error checking push subscription:', err);
        }
    }, []);

    useEffect(() => {
        checkSubscription();
    }, [checkSubscription]);

    const urlBase64ToUint8Array = (base64String: string) => {
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
    };

    const subscribe = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let currentPermission = Notification.permission;
            if (currentPermission === 'default') {
                currentPermission = await Notification.requestPermission();
                setPermission(currentPermission);
            }

            if (currentPermission !== 'granted') {
                throw new Error('Permission not granted');
            }

            const registration = await navigator.serviceWorker.ready;
            
            // Cleanup existing
            const existingSub = await registration.pushManager.getSubscription();
            if (existingSub) await existingSub.unsubscribe();

            const publicVapidKey = 'BCIx6QgWUCAP5Dce_gNwW7vqfCw3AhU_WRoBFClOIqJZlJtIFNMZaZQC_q8jLZnl1H2zkYvDE6YOoitbbn1XEsQ';
            const convertedKey = urlBase64ToUint8Array(publicVapidKey);

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey
            });

            const token = sessionStorage.getItem('adminToken');
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.mkavs.com';
            
            console.log('[PUSH] Syncing with backend:', API_BASE);
            const response = await fetch(`${API_BASE}/api/push/subscribe`, {
                method: 'POST',
                body: JSON.stringify({
                    subscription,
                    deviceLabel: `${navigator.platform} (${navigator.language})`
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to sync with backend');

            setIsSubscribed(true);
        } catch (err: any) {
            console.error('Push subscription error:', err);
            if (err.name === 'AbortError') {
                setError('Push service error. If you are using Brave, please enable "Google Services for Push Messaging" in settings and restart.');
            } else {
                setError(err.message || 'Failed to subscribe to notifications');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async () => {
        setIsLoading(true);
        setError(null);
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
                    },
                    credentials: 'include'
                });
                await subscription.unsubscribe();
            }
            setIsSubscribed(false);
        } catch (err: any) {
            setError(err.message || 'Failed to unsubscribe');
        } finally {
            setIsLoading(false);
        }
    };

    const sendTestNotification = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('adminToken');
            const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.mkavs.com';
            const response = await fetch(`${API_BASE}/api/push/test`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Test failed');
        } catch (err: any) {
            setError(err.message || 'Test notification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        permission,
        isSubscribed,
        isLoading,
        error,
        subscribe,
        unsubscribe,
        sendTestNotification
    };
};
