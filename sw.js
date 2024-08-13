const CACHE_NAME = "my-cache-v1";
const FILES_TO_CACHE = [
  "./",
  "./background.png",
  "./icon144.png",
  "./icon192.png",
  "./icon512.png",
  "./screenshot.jpeg",
  "./index.php",
  "./quiz.php",
  "./site.webmanifest",
  "./sw.js"
];

self.addEventListener("install", event => {
  console.log("[ServiceWorker] Install");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", event => {
  console.log("[ServiceWorker] Activate");
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[ServiceWorker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener("fetch", event => {
  console.log("[ServiceWorker] Fetch", event.request.url);
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
