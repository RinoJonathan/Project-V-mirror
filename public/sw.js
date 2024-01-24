// Define a version for your cache (update this when you make changes).
const CACHE_VERSION = 'vt0.016';

// Define a cache name based on the version.
const CACHE_NAME = `Project-V-cache-${CACHE_VERSION}`;


// Define an array of static resources to cache.

//development
// const APP_STATIC_RESOURCES = [
//   '/',
//   '/css/style.css',
//   '/javascript/script.js',

//   '/javascript/validateForms.js',
//   '/info/offline',
//   '/info/about',

//   '/images/trim.png',
//   '/images/split.png',
//   '/images/getaudio.png',
//   '/images/mute.png',
//   '/images/convert.png',
//   '/images/merge.avif',
//   '/images/resize.png',


//   '/icons/icon-512x512.png',
//   '/manifest.json',
//   // '',


//   'https://fonts.googleapis.com/css2?family=Keania+One&display=swap',
//   'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.4/tiny-slider.css',
//   'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
//   'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
//   'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js',
//   'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',

//   '/images/slide_1.png',
//   '/images/slide_2.png',
//   '/icons/icon-192x192.png',
//   // '/icons/icon-256x256.png',
//   // '/icons/icon-384x384.png',

//   // '',
//   // '',
//   '/javascript/feature_script.js',
//   // '/offline.html',
//   // 'offlineLogin.html',
//   // Add more static resources here as needed.
// ];

//production

const APP_STATIC_RESOURCES = [
  '/',
  '/css/style.css',
  '/javascript/script.js',

  '/javascript/validateForms.js',
  '/info/offline',
  '/info/about',

  'https://cdn.jsdelivr.net/gh/ProjectV103/Project-V-Public/public/images/trim.png',
  'https://cdn.jsdelivr.net/gh/ProjectV103/Project-V-Public/public/images/split.png',
  'https://cdn.jsdelivr.net/gh/ProjectV103/Project-V-Public/public/images/getaudio.png',
  'https://cdn.jsdelivr.net/gh/ProjectV103/Project-V-Public/public/images/mute.png',
  'https://cdn.jsdelivr.net/gh/ProjectV103/Project-V-Public/public/images/convert.png',
  'https://cdn.jsdelivr.net/gh/ProjectV103/Project-V-Public/public/images/merge.avif',
  'https://cdn.jsdelivr.net/gh/ProjectV103/Project-V-Public/public/images/resize.png',


  '/icons/icon-512x512.png',
  '/manifest.json',
  // '',


  'https://fonts.googleapis.com/css2?family=Keania+One&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.4/tiny-slider.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/tiny-slider/2.9.2/min/tiny-slider.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',

  '/icons/icon-192x192.png',
  'https://cdn.jsdelivr.net/gh/ProjectV103/Project-V-Public/public/images/slide_1.jpg',
  'https://cdn.jsdelivr.net/gh/ProjectV103/Project-V-Public/public/images/slide_2.jpg',
  
  // '/icons/icon-256x256.png',
  // '/icons/icon-384x384.png',

  // '',
  // '',
  '/javascript/feature_script.js',
  // '/offline.html',
  // 'offlineLogin.html',
  // Add more static resources here as needed.
  
];

//internal feature resources
// const FEATURE_RESOURCES = [
//   // '/temp.js',
//   "/javascript/ffmpeg/core/ffmpeg-core.js",
//   "/javascript/ffmpeg/core/ffmpeg-core.wasm",
//   "/javascript/ffmpeg/ffmpeg/index.js",
//   "/javascript/ffmpeg/utils/index.js",
//   "/javascript/ffmpeg/ffmpeg/classes.js",
//   "/javascript/ffmpeg/utils/errors.js",
//   "/javascript/ffmpeg/utils/const.js",
//   "/javascript/ffmpeg/ffmpeg/const.js",
//   "/javascript/ffmpeg/ffmpeg/utils.js",
//   "/javascript/ffmpeg/ffmpeg/errors.js",
//   "/javascript/ffmpeg/ffmpeg/worker.js",

//   //multithreading
//   // "/javascript/ffmpeg/multi-thread/ffmpeg-core.js",
//   // "/javascript/ffmpeg/multi-thread/ffmpeg-core.wasm",
//   // "/javascript/ffmpeg/multi-thread/ffmpeg-core.worker.js",
//   // "/javascript/ffmpeg/multi-thread/ffmpeg-core.js",


// ]

const FEATURE_RESOURCES = [
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/esm/index.min.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/esm/index.min.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/esm/worker.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/esm/classes.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/esm/errors.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/util@0.12.1/dist/esm/const.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/esm/const.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/esm/utils.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.7/dist/esm/errors.js',
  'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/esm/ffmpeg-core.wasm',
  "/javascript/ffmpeg/ffmpeg/index.js",
  '/javascript/ffmpeg/multi-thread/ffmpeg-core.worker.js',

  "/javascript/ffmpeg/ffmpeg/worker.js",
  "/javascript/ffmpeg/ffmpeg/classes.js",
  "/javascript/ffmpeg/ffmpeg/const.js ",
  "/javascript/ffmpeg/ffmpeg/utils.js",
  "/javascript/ffmpeg/ffmpeg/errors.js",
  
  
]

let loadFlag = 0 ;


//function to check if user had logged in online
//This is no longer required - can acess if logged in atleast once - vestigial feature
const checkAuth = () => {
  // const jwtToken = document.cookie.split('; ').find((cookie) => cookie.startsWith('jwt='));
  // const jwtToken = true
  // if (jwtToken) {
  //   console.log("jwt available")
  //   return true;
  // } else {  
  //   console.log("no jwt available")
  //   return false;
  // }
  return true
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


const testPrint = () => {

  console.log("delayed message")
}


self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      cache.addAll(APP_STATIC_RESOURCES);
      console.log("base caches cached");

      
      
      await cache.addAll(FEATURE_RESOURCES);
      await console.log("feature caches cached");
      
      // If (checkAuth()) {}
      // await cache.addAll(FEATURE_RESOURCES);
      // await console.log("feature caches cached");


      // Send a message to the main thread to indicate that feature assets are loaded
      // self.clients.matchAll().then(clients => {
      //   clients.forEach(client => {
      //     client.postMessage({ assetsLoaded: true });
      //   });
      // });
      

      // Ensure that the new service worker activates immediately
      //self.skipWaiting();
    })()
  );
});



  
// delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
      // Send a message directly to the main thread to indicate activation
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ activationEvent: true });
        });
      });
    })()
  );
  self.skipWaiting(); // Ensure that the new service worker activates immediately
});


self.addEventListener('fetch', (event) => {
  const request = event.request;
  const urlObj = new URL(request.url);
  const url = urlObj.pathname;

  console.log(url);

  // if(loadFlag == 0) {

  //   self.clients.matchAll().then(clients => {
  //     clients.forEach(client => client.postMessage({ assetsLoaded: true }));
  // })
  // console.log("sent message, load flag changed")
  // loadFlag =1;
  // }

  // Handle homepage caching
  if (url === '/') {
    // Check if the user is online.
    if (navigator.onLine) {
      // If online, fetch the resource from the network (do not cache).
      console.log("online home");
      event.respondWith(fetch(request));
      return;
    } else {
      // If offline, respond with the cached page.
      console.log("offline home");
      event.respondWith(caches.match(request));
      return;
    }
  }

  // Handle static resource caching (always cache).
  if (APP_STATIC_RESOURCES.includes(url)) {
    console.log("offline static caches");
    event.respondWith(caches.match(request));
    return;
  }

  if (FEATURE_RESOURCES.includes(url)) {
    console.log("offline static caches - features");
    event.respondWith(caches.match(request));
    return;
  }

  // Check user authentication (implement your authentication logic here).
  // like check if the user is authenticated by verifying
  // the presence and validity of a JWT token stored on the client. but for now its removed

  // Handle authenticated feature pages.
  if (url.startsWith('/feature')) {
    console.log("inside /fetch");
    if (checkAuth()) {
      // Handle authenticated feature pages.
      event.respondWith(
        caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // If cached resource is present, use it.
            console.log("Cached resource present.");
            return cachedResponse;
          } else {
            if (navigator.onLine) {
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
            } else {
              console.log("turn on the network to see the feature");
              return caches.match('/info/offline');
            }
          }
        })
      );
      return;
    } else {
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
      event.respondWith(caches.match('info/offline'));
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