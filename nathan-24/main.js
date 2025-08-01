// Animation
var scrollElements = document.querySelectorAll('section');

const elementInView = (el, percentageScroll = 100) => {
  const elementTop = el.getBoundingClientRect().top;

  return (
    elementTop <= 
      ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
  );
};

const displayScrollElement = (element) => {
  element.classList.add('is-visible');
};

const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 75)) {
      displayScrollElement(el);
    }
  })
}

window.addEventListener('scroll', () => {
  handleScrollAnimation();
})

// Kaos
var aboutImg = document.getElementById('about-img');

function kaos() {
  aboutImg.classList.add('kaos');

  setTimeout(function() {
    aboutImg.classList.remove('kaos');
  }, 3000);
}