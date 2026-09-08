const CACHE_NAME = 'glassmartin-aroma-v2';
const CORE_ASSETS = [
  './',
  'manifest.webmanifest',
  'data/products.json',
  'icons/app-icon-192.png',
  'icons/app-icon-512.png',
  'icons/app-icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'images/glassmartin-logo.jpg',
  'images/machines/gas-501f.jpg',
].map((path) => new URL(path, self.registration.scope).toString());

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)),
  );
});
