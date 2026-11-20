const CACHE_NAME = 'masjid-assalam-shell-v1';
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Jangan cache request ke Google Apps Script agar update GAS selalu langsung tampil
  if (event.request.url.indexOf('script.google.com') > -1 || event.request.url.indexOf('script.googleusercontent.com') > -1) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});