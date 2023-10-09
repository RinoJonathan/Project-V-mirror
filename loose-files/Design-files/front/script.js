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



  function toggleAnimation() {
    const letter = document.querySelector('.letter');
    const list = document.querySelector('.list');

    // Toggle classes to trigger the animation
    letter.classList.toggle('letter-out');
    list.classList.toggle('letter-in');
}

// Run the animation every 3 seconds
setInterval(toggleAnimation, 3000);
