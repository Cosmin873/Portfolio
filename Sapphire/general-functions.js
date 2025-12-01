// HELPER FUNCTIONS
const capitalize = function (input) {
  return input.at(0).toUpperCase() + input.slice(1);
};

// HOME PAGE / MAIN SCRIPT

const renderProducts = function (source, target, insertOrder) {
  source.forEach((el, id) => {
    const html = `<div class="product" data-id = "${id++}"> 
  <div class="product__img-container">
<img
            src="${el.url[0]}"
            class="product__img img img-slider"
            alt="Wedding rings made of gold"
            data-code="${el.code}"
            
          />
  </div>
          <div class="product__information">
          <h4 class="product__title">${el.title}</h4>
          <h5 class="product__material-title">Colors:</h5>
          <ul class="product__material">${el.material
            .map((type) => `<li>${capitalize(type)}</li>`)
            .join("")}</ul>
          <p class="product__price">${el.price} EUR</p>
          </div>
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

// PRODUCT PAGE //

// Render highlight img in the gallery from the product object
const renderHighlight = function (source, target) {
  target.insertAdjacentHTML(
    "beforebegin",
    `<div class="gallery__container gallery__container-highlight">
                  <img
                    class="img gallery-highlight"
                    alt="${source.tag}"
                    src="${source.url.at(0)}"
                  />
                </div>`
  );
};

// Render thumbnails imgs in the gallery from the product object

const renderThumbnails = function (source, target) {
  source.url.forEach((img, i) =>
    target.insertAdjacentHTML(
      "beforeend",
      `<div
                    class="gallery__container-thumbnail gallery__thumbnail-${
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
};
