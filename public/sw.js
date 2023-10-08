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

const FEATURE_RESOURCES = [
  '/javascript/ffmpeg/'
]

//function to check if user had logged in online
const checkAuth = () => {
    

  const jwtToken = document.cookie.split('; ').find((cookie) => cookie.startsWith('jwt='));
  
  if (jwtToken) {
    
    return true;

  } else {
    
    return false;

  }
}

// Function to clean up old caches when activating a new service worker.
const cleanUpCaches= () => {
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
        console.log("base caches cached")

        if(checkAuth()){
          cache.addAll(FEATURE_RESOURCES);
          console.log("feature caches cached")
        }
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
  const urlObj = new URL(request.url);
  const url = urlObj.pathname.toLowerCase()

  // Handle homepage caching 
  if (url === '/') {
    // Check if the user is online.
    if (navigator.onLine) {
      // If online, fetch the resource from the network (do not cache).
      event.respondWith(fetch(request));
      return;
    } else {
      // If offline, respond with the cached page.
      event.respondWith(caches.match(request));
      return;
    }
  }

  // Handle static resource caching (always cache).
  if (APP_STATIC_RESOURCES.includes(url)) {
    event.respondWith(caches.match(request));
    return;
  }

  // Check user authentication (implement your authentication logic here).
  // For example, you can check if the user is authenticated by verifying
  // the presence and validity of a JWT token stored on the client.

  if (checkAuth()) {
    // Handle authenticated feature pages.
    if (url.startsWith('/features/')) {
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          return cachedResponse || fetch(request).then((fetchResponse) => {
            // Cache the fetched response for future use.
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, fetchResponse.clone());
            });
            return fetchResponse;
          }).catch((e) => {
            console.log("error while fetching feature page")
          });
        })
      );
      return;
    }
  } else {
    // Display a custom message or prompt the user to log in when offline.
    // You can show a modal, a custom HTML element, or navigate to a login page.
    console.log("Please log in using the internet.");
    // If offline, respond with the cached offline.html page.
    window.location.href = '/user/login';
    return;
  }

  if (url.startsWith('/user')) {
    // Check if the user is online.
    if (navigator.onLine) {
      // If online, fetch the resource from the network (do not cache).
      event.respondWith(fetch(request));
      return;
    } else {
      // If offline, respond with the cached offline.html page.
      event.respondWith(caches.match('/offlineLogin.html'));
      return;
    }
  }
  
  // For all other requests, go to the network first, then cache.
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
}); 


//legacy fetch
// self.addEventListener("fetch", (event) => {
//     // As a single page app, direct app to always go to cached home page.
//     if (event.request.mode === "navigate") {
//       event.respondWith(caches.match("/Menarche_Tracker/"));
//       return;
//     }
  
//     // For all other requests, go to the cache first, and then the network.
//     event.respondWith(
//       (async () => {
//         const cache = await caches.open(CACHE_NAME);
//         const cachedResponse = await cache.match(event.request);
//         if (cachedResponse) {
//           // Return the cached response if it's available.
//           return cachedResponse;
//         }
//         // If resource isn't in the cache, return a 404.
//         return new Response(null, { status: 404 });
//       })()
//     );
//   });