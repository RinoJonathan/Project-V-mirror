// Define a version for your cache (update this when you make changes).
const CACHE_VERSION = 'vt0.014';

// Define a cache name based on the version.
const CACHE_NAME = `Project-V-cache-${CACHE_VERSION}`;


// Define an array of static resources to cache.
const APP_STATIC_RESOURCES = [
  '/',
  '/css/style.css',
  '/javascript/script.js',
  '/javascript/feature_script.js',
  '/offline.html',
  'offlineLogin.html',
  // Add more static resources here as needed.
];

const FEATURE_RESOURCES = [
  '/temp.js',
  "/javascript/ffmpeg/core/ffmpeg-core.js",
  "/javascript/ffmpeg/core/ffmpeg-core.wasm",
  "/javascript/ffmpeg/ffmpeg/index.js",
  "/javascript/ffmpeg/utils/index.js",
  "/javascript/ffmpeg/ffmpeg/classes.js",
  "/javascript/ffmpeg/utils/errors.js",
  "/javascript/ffmpeg/utils/const.js",
  "/javascript/ffmpeg/ffmpeg/const.js",
  "/javascript/ffmpeg/ffmpeg/utils.js",
  "/javascript/ffmpeg/ffmpeg/errors.js",
  "/javascript/ffmpeg/ffmpeg/worker.js",


]

//function to check if user had logged in online
const checkAuth = () => {
    

  // const jwtToken = document.cookie.split('; ').find((cookie) => cookie.startsWith('jwt='));
  const jwtToken = true
  
  if (jwtToken) {
    
    console.log("jwt available")
    return true;

  } else {
    
    console.log("no jwt available")
    return false;

  }
}

// Function to clean up old caches when activating a new service worker.
// const cleanUpCaches= () => {
//   return caches.keys().then((cacheNames) => {
//     console.log(cacheNames)
//     return Promise.all(
      
//       cacheNames.map((cache) => {
//         console.log("iteration1")
//         if (cache !== CACHE_NAME)
//          {
//           console.log(`${cache} deleted`)
//           return caches.delete(cache);
//         }
//       })
//     );
//   });
// }

// On install, cache the static resources
self.addEventListener("install", (event) => {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        cache.addAll(APP_STATIC_RESOURCES);
        console.log("base caches cached")

        // if(checkAuth()){}
          cache.addAll(FEATURE_RESOURCES);
          console.log("feature caches cached")
        
      })()
    );
  });


  
// delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      console.log(names)
      await Promise.all(
        names.map((name) => {
          console.log("iteration1")
          if (name !== CACHE_NAME) {
            console.log(`${name} deleted`)
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const urlObj = new URL(request.url);
  const url = urlObj.pathname.toLowerCase()

  // console.log(url)
  // Handle homepage caching 
  if (url === '/') {
    // Check if the user is online.
    if (navigator.onLine) {
      // If online, fetch the resource from the network (do not cache).
      console.log("online home")
      event.respondWith(fetch(request));
      return;
    } else {
      // If offline, respond with the cached page.
      console.log("offline home")
      event.respondWith(caches.match(request));
      return;
    }
  }

  // Handle static resource caching (always cache).
  if (APP_STATIC_RESOURCES.includes(url)) {
    console.log("offline static caches")
    event.respondWith(caches.match(request));
    return;
  }

  // Check user authentication (implement your authentication logic here).
  // For example, you can check if the user is authenticated by verifying
  // the presence and validity of a JWT token stored on the client.

   
  // Handle authenticated feature pages.


  if (url.startsWith('/feature')) {

    console.log("inside /fetch")
    if (checkAuth()) {
      // Handle authenticated feature pages.
      
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // If cached resource is present, use it.
            console.log("Cached resource present.");
            return cachedResponse;
          } 
          else {
            if(navigator.onLine){
              
              // If cached resource is not present, fetch it from the network.
            console.log("Cached resource not present. Fetching from network...");
            return fetch(request).then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                // Clone the response before caching it.
                const responseToCache = fetchResponse.clone();

                // Cache the fetched response for future use.
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(request, responseToCache);
                });
              }

              console.log("Fetched feature page from the network.");
              return fetchResponse;
            }).catch((e) => {
              console.log("Error while fetching feature page:", e);
            });
            }
            else{
              console.log("turn on the network to see the feature")
              return caches.match('/offline.html');
            }
          }
        })
      );
      return;
      
    }
    else {
      // Display a custom message or prompt the user to log in when offline.
      // You can show a modal, a custom HTML element, or navigate to a login page.
      console.log("Please log in using the internet.");
      // If offline, respond with the cached offline.html page.
      window.location.href = '/user/login';
      return;
    }

    
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