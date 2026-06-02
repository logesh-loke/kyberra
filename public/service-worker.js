/* eslint-disable no-restricted-globals */
// public/service-worker.js
const CACHE_NAME = "encmail-static-v1";
const DATA_CACHE_NAME = "encmail-data-v1";

const FILES_TO_CACHE = [
  "/signin",
  "/index.html",
  "/offline.html"
];

// install - cache core files
self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// activate - clean old caches
self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// fetch - handle requests
self.addEventListener("fetch", (evt) => {
  const { request } = evt;

  // Network-first for API calls
  if (request.url.includes("/api/")) {
    evt.respondWith(
      caches.open(DATA_CACHE_NAME).then(async (cache) => {
        try {
          const response = await fetch(request);
          if (response && response.status === 200) {
            cache.put(request.url, response.clone());
          }
          return response;
        } catch (err) {
          return caches.match(request);
        }
      })
    );
    return;
  }

  // HTML navigation: try network, fallback to cache or offline page
  if (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept")?.includes("text/html"))
  ) {
    evt.respondWith(
      fetch(request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() =>
          caches
            .match(request)
            .then((r) => r || caches.match("/offline.html"))
        )
    );
    return;
  }

  // For other assets: cache-first
  evt.respondWith(
    caches.match(request).then((response) => response || fetch(request))
  );
});
