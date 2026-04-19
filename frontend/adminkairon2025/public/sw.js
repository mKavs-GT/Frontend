const CACHE_NAME = 'mkavs-admin-shell-v2';
const RUNTIME_CACHE = 'mkavs-admin-runtime';
const IMAGE_CACHE = 'mkavs-admin-images';

// App Shell Resources
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './style.css',
  './admin.js',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './mkavs-logo.png',
  './mkavs-sidebar-logo.png',
  './offline.html'
];

// Install Event - Precache App Shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Cleanup Old Caches
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Hybrid Strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // 1. App Shell assets (excluding index.html which should be checked for updates)
  const isShellAsset = SHELL_ASSETS.some(asset => 
    asset !== './' && 
    asset !== './index.html' && 
    event.request.url.includes(asset.replace('./', ''))
  );

  if (isShellAsset) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
    return;
  }

  // 2. Navigation requests (index.html) - Network-First with Offline Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match('./offline.html');
          });
        })
    );
    return;
  }

  // 3. Stale-While-Revalidate for other assets and safe API calls
  if (
    url.origin === self.location.origin || 
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    // Avoid caching sensitive/auth endpoints
    const sensitiveEndpoints = ['/api/admin/login', '/api/admin/logout', '/api/push/subscribe'];
    if (sensitiveEndpoints.some(endpoint => url.pathname.includes(endpoint))) {
      return;
    }

    event.respondWith(
      caches.open(url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ? IMAGE_CACHE : RUNTIME_CACHE).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          const fetchedResponse = fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
              // Return cached response if network fails
              if (cachedResponse) return cachedResponse;
              
              // If it's a navigation request and no cache, return offline fallback
              if (event.request.mode === 'navigate') {
                return caches.match('./offline.html');
              }
              return null;
          });

          return cachedResponse || fetchedResponse;
        });
      })
    );
    return;
  }
});

// Push Event - Show Notifications
self.addEventListener('push', event => {
  console.log('[SW] Push received:', event);
  
  let data = { title: 'MKAVS Admin', body: 'New notification' };
  try {
    data = event.data.json();
    console.log('[SW] Push data parsed:', data);
  } catch (e) {
    console.warn('[SW] Push event without JSON data or parse error:', e);
  }

  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: {
      url: data.url || '/'
    },
    tag: data.tag || 'mkavs-notification',
    renotify: true,
    vibrate: [100, 50, 100]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Get the URL from notification data or default to dashboard
  const relativeUrl = event.notification.data.url || '/';
  const urlToOpen = new URL(relativeUrl, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Check if there is already a window open with this URL
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window is open with the exact URL, check for any admin panel window
      for (let client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          // Navigate existing window to the specific consultation
          if ('navigate' in client) {
            return client.navigate(urlToOpen).then(c => c.focus());
          }
          return client.focus();
        }
      }

      // If no admin window at all, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
