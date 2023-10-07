// Define a version for your cache (update this when you make changes).
const CACHE_VERSION = 'v1';

// Define a cache name based on the version.
const CACHE_NAME = `Project-V-cache-${CACHE_VERSION}`;

// Define an array of static resources to cache.
const APP_STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/script.js',
  '/style.css',
  '/icons/wheel.svg',
  // Add more static resources here as needed.
];

// Function to clean up old caches when activating a new service worker.
function cleanUpCaches() {
  return caches.keys().then((cacheNames) => {
    return Promise.all(
      cacheNames.map((cache) => {
        if (cache !== CACHE_NAME) {
          return caches.delete(cache);
        }
      })
    );
  });
}

// On install, cache the static resources
self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(APP_STATIC_RESOURCES);
        console.log("installed caches")
      })()
    );
  });


  
self.addEventListener('activate', (event) => {
  // Clean up old caches when activating a new service worker.
  event.waitUntil(cleanUpCaches());

  // Ensure the service worker takes control of the pages immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle homepage caching (always cache).
  if (url.pathname === '/') {
    event.respondWith(caches.match('/'));
    return;
  }

  // Handle static resource caching (always cache).
  if (STATIC_RESOURCES.includes(url.pathname)) {
    event.respondWith(caches.match(request));
    return;
  }

  // Check user authentication (implement your authentication logic here).
  // For example, you can check if the user is authenticated by verifying
  // the presence and validity of a JWT token stored on the client.

  // Handle authenticated feature pages.
  if (url.pathname.startsWith('/features/')) {
    // Implement caching strategy for authenticated feature pages.
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((fetchResponse) => {
          // Cache the fetched response for future use.
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, fetchResponse.clone());
          });
          return fetchResponse;
        });
      })
    );
    return;
  }

  // For all other requests, go to the network first, then cache.
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});
