// HELPER FUNCTIONS
const capitalize = function (input) {
  return input.at(0).toUpperCase() + input.slice(1);
};

// HOME PAGE / MAIN SCRIPT

const renderProducts = function (source, target, insertOrder, optClass = "") {
  source.forEach((el, id) => {
    const html = `<div class="product ${optClass}" data-id = "${id++}"> 
   <a href="./product-page.html#${el.code}">
     <figure class="product__img-container">
<img
            src="${el.url[0]}"
            class="product__img img img-slider"
            alt="Wedding rings made of gold"
            data-code="${el.code}"
            
          />
  </figure>
          <div class="product__information">
          <h4 class="product__title">${el.title}</h4>
          <h5 class="product__material-title">Colors:</h5>
          <ul class="product__material">${el.material
            .map((type) => `<li>${capitalize(type)}</li>`)
            .join("")}</ul>
          <p class="product__price">${el.price} EUR</p>
          </div>
  </a>
        </div>`;

    target.insertAdjacentHTML(insertOrder, html);
  });
};
let i = 0;
let interval;
const cardImgSlider = function (source) {
  return function (e) {
    if (!e.target.classList.contains("img-slider")) return;

    const code = e.target.dataset.code;

    const prod = source.find((x) => x.code === code);
    if (prod.url.length === 1) return;
    if (i >= prod.url.length) i = 0;
    console.log(e.target);
    console.log(prod);
    i++;
    e.target.src = prod.url[i];
    interval = setInterval(function () {
      if (i >= prod.url.length - 1) i = -1;
      i++;
      e.target.src = prod.url[i];
    }, 1500);
  };
};

const cardImgSliderReset = function (source) {
  return function (e) {
    if (!e.target.classList.contains("img-slider")) return;

    const code = e.target.dataset.code;
    const prod = source.find((x) => x.code === code);

    i = 0;

    e.target.src = prod.url[0];
    clearInterval(interval);
  };
};

const renderSlider = function (
  source,
  btnTarget,
  currentSlide,
  sliderContainer,
  translate = 120,
  min = 0,
  max = 1,
  animation = true
) {
  // let currentSlide = currentSl;
  const slidesAnimation = function () {
    // Removing large shadow for the products adjacent to main one
    if (animation) {
      [...source]
        .filter((slide) => slide.dataset.id !== currentSlide)
        .forEach((item) => {
          item.classList.remove("shadow");
        });
      //
      source[currentSlide].classList.remove("shadow-1");
      source[currentSlide].classList.add("shadow");
      source[currentSlide].style.transform = "scale(1.1)";
    }
  };

  // Adding buttons and dots
  const btnHtml = ` <button class="slider__btn slider__btn-left slider__btn-top">
              &#10094;
            </button>
            <button class="slider__btn slider__btn-right slider__btn-top">
              &#10095;
            </button>
            <div class="dots"></div>`;

  btnTarget.insertAdjacentHTML("beforeend", btnHtml);

  // Capturing the buttons into variables

  const sliderRightBtn = document.querySelector(".slider__btn-right");
  const sliderLeftBtn = document.querySelector(".slider__btn-left");
  const dotsContainer = document.querySelector(".dots");
  (function () {
    if (window.innerWidth < 576) {
      // document.querySelector(".container-L").style.width = "100%";
      // document.querySelector(".container-L").style.padding = "0";
      // document.querySelector(".slider__btn").style.fontSize = "2rem";
      sliderContainer.style.width = "100%";
      sliderContainer.style.padding = "0";

      sliderLeftBtn.style.fontSize = "8rem";
      sliderRightBtn.style.fontSize = "8rem";
      sliderLeftBtn.classList.remove("slider__btn-top");
      sliderLeftBtn.classList.add("slider__btn-bottom");
      sliderRightBtn.classList.remove("slider__btn-top");
      sliderRightBtn.classList.add("slider__btn-bottom");
      sliderLeftBtn.style.transform = "translate(0, 30%)";
      sliderRightBtn.style.transform = "translate(0, 30%)";
    }
  })();

  source.forEach((el, i) => {
    dotsContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dot" data-id = "${i}"></button>`
    );
  });

  const activateDot = function () {
    document.querySelectorAll(".dot").forEach((dot) => {
      if (+dot.dataset.id !== currentSlide)
        dot.style.backgroundColor = "#64b4c5";
      if (+dot.dataset.id === currentSlide)
        dot.style.backgroundColor = "#50909e";
    });
  };
  activateDot();

  dotsContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains("dot")) return;

    currentSlide = +e.target.dataset.id;
    activateDot();
    sliding(currentSlide);
  });
  const sliding = function (slide) {
    source.forEach((el, i, arr) => {
      el.style.transform = `translateX(${translate * (i - slide)}%) scale(0.9)`;
      el.classList.add("shadow-1");
    });
    if (window.innerWidth >= 880) slidesAnimation();
    activateDot();
  };

  dotsContainer.addEventListener("mouseover", (e) => {
    if (!e.target.classList.contains("dot")) return;
    e.target.style.backgroundColor = "#50909e";
  });

  dotsContainer.addEventListener("mouseout", (e) => {
    const id = +e.target.dataset.id;
    if (!e.target.classList.contains("dot") || id === currentSlide) return;

    e.target.style.backgroundColor = "#64b4c5";
  });
  // BRINGING 3 PRODUCTS PER WAVE IN SLIDER
  // let a = 0;
  // let b = 3;
  // console.log([...slides].slice(a, b));
  // const test = function (slide) {
  //   a += 3;
  //   b += 3;
  //   console.log([...slides].slice(a, b));
  // };
  // test();
  // test();
  sliding(currentSlide);

  const slidingRight = function () {
    // let max = 1;
    // let min = 0;
    // Larger screen size
    // if (window.innerWidth > 1300) {
    //   max = 2;
    //   min = 1;
    // }
    currentSlide >= source.length - max ? (currentSlide = min) : currentSlide++;
    sliding(currentSlide);

    // slides[
    //   currentSlide >= slides.length ? slides.length - max : currentSlide - 1
    // ].style.background = "none";
    //
  };

  const slidingLeft = function () {
    // let max = 1;
    // let min = 0;
    // Larger screen size
    // if (window.innerWidth > 1300) {
    //   max = 2;
    //   min = 1;
    // }
    currentSlide <= min ? (currentSlide = source.length - max) : currentSlide--;
    sliding(currentSlide);
  };

  sliderRightBtn.addEventListener("click", slidingRight);
  sliderLeftBtn.addEventListener("click", slidingLeft);
};

// PRODUCT PAGE //

// Render highlight img in the gallery from the product object
const renderHighlight = function (source, target, insertOrder) {
  target.insertAdjacentHTML(
    insertOrder,
    `<div class="gallery__container gallery__img gallery__container-highlight">
                  <img
                    class="img gallery-highlight"
                    alt="${source.tag}"
                    src="${source.url.at(0)}"
                  />
                </div>`
  );
};

// Render thumbnails imgs in the gallery from the product object

const renderThumbnails = function (source, target, insertOrder) {
  source.url.forEach((img, i) =>
    target.insertAdjacentHTML(
      insertOrder,
      `<div
                    class="gallery__container-thumbnail gallery__img gallery__thumbnail-${
                      i + 1
                    }"
                  >
                    <img
                      class="img gallery-thumbnail thumbnail-${i + 1}"
                      alt="${source.tag}"
                      src="${img}"
                    />
                  </div>`
    )
  );
};

export {
  renderHighlight,
  renderThumbnails,
  renderProducts,
  capitalize,
  cardImgSlider,
  cardImgSliderReset,
  renderSlider,
};
