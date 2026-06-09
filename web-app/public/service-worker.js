const CACHE_NAME = "agrohub-cache-v1";

// Asset inti (shell app)
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// ========================
// INSTALL
// ========================
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

// ========================
// ACTIVATE
// ========================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// ========================
// FETCH STRATEGY
// ========================

// Network First untuk API
// Cache First untuk asset
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // API request → network first
  if (request.url.includes("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static asset → cache first
  event.respondWith(cacheFirst(request));
});

// ========================
// STRATEGIES
// ========================

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const fresh = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    return cachedFallback();
  }
}

async function networkFirst(request) {
  try {
    const fresh = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (err) {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({
      success: false,
      message: "Offline mode - no cached data"
    }));
  }
}

function cachedFallback() {
  return caches.match("/index.html");
}