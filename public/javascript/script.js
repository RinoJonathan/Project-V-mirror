var e="pwa";let o=document.querySelectorAll(".loading-overlay");if("pwa"===e){if("serviceWorker"in navigator?(window.addEventListener("load",(()=>{navigator.serviceWorker.register("/sw.js").then((e=>{console.log("Service Worker registered with scope:",e.scope)})).catch((e=>{console.error("Service Worker registration failed:",e)}))})),o&&o.length>0&&navigator.serviceWorker.addEventListener("message",(e=>{const{data:t}=e;if(t&&t.activationEvent){for(let e of o)e.style.display="none";localStorage.setItem("assetsLoaded","true")}}))):alert(" your browser doesnt support offline mode :("),o&&o.length>0)if("true"===localStorage.getItem("assetsLoaded")){console.log("***layouts local storage");for(let e of o)e.style.display="none"}else console.log("***NO layouts local storage")}else if("normal"===e)for(let e of o)e.style.display="none";function t(e){const o=`${e}=`,t=decodeURIComponent(document.cookie).split(";");for(let e=0;e<t.length;e++){let r=t[e].trim();if(0===r.indexOf(o))return JSON.parse(r.substring(o.length+2,r.length))}return null}const r=t("UserName");if(r){const e=document.querySelector("#loginNav"),o=document.querySelector("#registerNav");e.innerHTML=r.username,e.href="",o.innerText="LogOut",o.href="/user/logout"}else console.log("UserName cookie not found or has no value.");if(document.querySelector(".my-slider")&&tns)var n=tns({container:".my-slider",items:3,gutter:20,slideBy:1,controlsPosition:"bottom",navPosition:"bottom",mouseDrag:!0,autoplay:!0,autoplayButtonOutput:!1,controlsContainer:"#custom-control",responsive:{0:{items:1,nav:!1},768:{items:2,nav:!0},992:{items:3}}});