let overlayElements = document.querySelectorAll('.loading-overlay');


//in production, service worker gets registered and login overlay is shown
if(envMode === 'production'){

// service worker registration
if ('serviceWorker' in navigator) {



  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js') // comrade, dont forget to change service worker's path if needed
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });

if (overlayElements && overlayElements.length > 0) {
  
  navigator.serviceWorker.addEventListener('message', (event) => {
    const { data } = event;

    if (data && data.activationEvent) {
      for (let overlayElement of overlayElements) {
        overlayElement.style.display = 'none';
      }
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

  }
}

} else if(envMode === 'development'){

for (let overlayElement of overlayElements) {
  overlayElement.style.display = 'none';
}

console.log("env mode is: ")
console.log(envMode)
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
});


}


