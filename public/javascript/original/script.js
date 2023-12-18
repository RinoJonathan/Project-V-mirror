//******** set as pwa production -  switch-dev
var projectMode = 'pwa';


// set as normal during production
// var projectMode = 'normal';



let overlayElements = document.querySelectorAll('.loading-overlay');

if(projectMode === 'pwa'){

// service worker registration
if ('serviceWorker' in navigator) {



  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js') // Replace with the path to your service worker file
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });

    // Check if .loading-overlay is present in the current page
if (overlayElements && overlayElements.length > 0) {
  
  // Add an event listener to handle messages from the service worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { data } = event;
    // Check if the message indicates activation event
    if (data && data.activationEvent) {
      // Update the UI to hide the loading overlay
      for (let overlayElement of overlayElements) {
        overlayElement.style.display = 'none';
      }

      // Update the local storage flag to indicate that assets are loaded
      localStorage.setItem('assetsLoaded', 'true');
    }
  });
}
}
else{
  alert(" your browser doesnt support offline mode :(")
}





if (overlayElements && overlayElements.length > 0) {

  // Check if assets are already loaded (based on local storage)
  if (localStorage.getItem('assetsLoaded') === 'true') {
    console.log("***layouts local storage")
    for (let overlayElement of overlayElements) {
      overlayElement.style.display = 'none';
    }
  } else {
    console.log("***NO layouts local storage")
    // Add an event listener to handle messages from the service worker
    // navigator.serviceWorker.addEventListener('message', (event) => {
    //   const { data } = event;

      

    //   // Check if the message indicates that assets are loaded
    //   if (data && data.assetsLoaded) {
    //     // Update the UI to hide the loading overlay
    //     for (let overlayElement of overlayElements) {
    //       overlayElement.style.display = 'none';
    //     }
    //     console.log(" ***layouts in local storage set true 2")
    //     // Update the local storage flag to indicate that assets are loaded
    //     localStorage.setItem('assetsLoaded', 'true');
        
    //   }
    // });

    // console.log(" ***Event listener set for message")
  }
}

}
else if(projectMode === 'normal'){

for (let overlayElement of overlayElements) {
  overlayElement.style.display = 'none';
}

}


// Function to get the value of a cookie by name
function getCookie(cookieName) {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return JSON.parse(cookie.substring(name.length+2, cookie.length));
    }
  }

  return null;
}


const userNameCookie = getCookie('UserName');

if (userNameCookie) {
  
  const loginNav = document.querySelector("#loginNav")
  const regNav = document.querySelector("#registerNav")

  loginNav.innerText = userNameCookie.username
  loginNav.href = ""
  regNav.innerText = "LogOut"
  regNav.href = "/user/logout"
  
  
} else {
  console.log('UserName cookie not found or has no value.');
}


// console.log("dev setting")

if(document.querySelector(".my-slider") && tns){

  //tiny slider code

var slider = tns({
  container: ".my-slider",
  items: 3,
  gutter: 20,
  slideBy: 1,
  controlsPosition: "bottom",
  navPosition: "bottom",
  mouseDrag: true,
  autoplay: true,
  autoplayButtonOutput: false,
  controlsContainer: "#custom-control",
  responsive: {
    0: {
      items: 1,
      nav: false
    },
    768: {
      items: 2,
      nav: true
    },
    992: {
      items: 3
    }
  }
  // mode: 'gallery',
  // speed: 2000,
  // animateIn: "scale",
  // controls: false,
  // nav: false,
  // edgePadding: 20,
  // loop: false,
});


}


