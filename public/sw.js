const CACHE_NAME = 'capstone-two-v2';

// ✅ Cache only essential static assets
const urlsToCache = [
  '/',
  '/login',
  '/dashboard',
  '/globals.css',
  '/manifest.json',
  '/favicon.ico'
];

// Install event — cache static resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache).catch(error => {
          console.log('⚠️ Failed to cache some resources:', error);
        });
      })
  );
  self.skipWaiting(); // Activate new SW immediately
});

// Fetch event — use cache-first for static assets, network-first for dynamic routes
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // ✅ For API calls or dynamic routes (e.g. /strand, /api)
  if (
    requestUrl.pathname.startsWith('/strand') ||
    requestUrl.pathname.startsWith('/api')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the latest version
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match(event.request)) // fallback to cache if offline
    );
    return;
  }

  // ✅ For static files (CSS, manifest, etc.)
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Activate event — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of open pages
});
