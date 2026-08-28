const CACHE_NAME = 'bwmi-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation fallback to cache / offline-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        // Cache static assets dynamically
        if (response.status === 200 && event.request.method === 'GET' && (
          event.request.url.endsWith('.js') ||
          event.request.url.endsWith('.css') ||
          event.request.url.endsWith('.svg') ||
          event.request.url.includes('fonts.gstatic.com') ||
          event.request.url.includes('fonts.googleapis.com')
        )) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // offline fallback
        return cached;
      });
    })
  );
});

// Background sync simulation listener
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-government-claims') {
    console.log('[ServiceWorker] Background Sync event triggered for queued claims');
  }
});
