import {
  renderHighlight,
  renderThumbnails,
  capitalize,
  renderSlider,
} from "./general-functions.js";
import { data } from "./db.js";
const db = data.load();
console.log(db);
const product = JSON.parse(localStorage.getItem("product"));
console.log(product);

const activeProduct = db[product.category].products.find(
  (prod) => prod.code === product.code
);
console.log(activeProduct);
if (!product) throw new Error("Error 404: Not found!");
window.location.hash = product.code;

const injectProductSchema = function (product) {
  const script = document.createElement("script");
  script.type = "application/ld+json";

  const data = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.url.map(
      (img) => new URL(img, "https://sapphire-jewelries.netlify.app/").href
    ),
    description: product.description || product.tag || "",
    sku: product.code,
    brand: {
      "@type": "Brand",
      name: "Sapphire",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      url: "https://sapphire-jewelries.netlify.app/product-page.html",
      priceCurrency: "EUR",
      price: String(product.price).replace(",", "."),
      availability: "https://schema.org/InStock",
    },
  };
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

injectProductSchema(product);

// NAVIGATION
const logo = document.querySelector(".logo");

// PRODUCT ELEMENTS
const productPresentation = document.querySelector(
  ".product__page-presentation"
);
const productTitle = document.querySelector(".product__page-title");
const productCategory = document.querySelector(".category");
const productPrice = document.querySelector(".price");

// GALLERY
const gallery = document.querySelector(".gallery");
const galleryGrid = document.querySelector(".gallery-grid");
const galleryModal = document.querySelector(".gallery__modal");
const closeModal = document.querySelector(".close__modal");
const imgModal = document.querySelector(".img__modal");
// PRODUCT INFORMATION
const quantityIncrement = document.querySelector(".quantity__increment");
const quantity = document.querySelector(".quatity__number");
const quantityDecrement = document.querySelector(".quantity__decrement");

// TABS
const tabsContainer = document.querySelector(".tabs__list");
const tabContent = document.querySelector(".tab__content");
const gallerySliderContainer = document.querySelector(".gallery-slider");

let gallerySlide;
// Product initialization
(function () {
  productTitle.textContent = product.title;
  document.title = `${product.title} | Sapphire Jewelries`;
  productPrice.textContent = product.price;
  productCategory.textContent = capitalize(product.category);
  tabContent.innerHTML = product.description;
  if (window.innerWidth >= 768) {
    renderHighlight(product, galleryGrid, "beforebegin");
    renderThumbnails(product, galleryGrid, "beforeend");
  } else {
    renderThumbnails(product, gallerySliderContainer, "beforeend");
    gallerySlide = document.querySelectorAll(".gallery__img");
    renderSlider(gallerySlide, gallery, 0, productPresentation, 120, 0, 1);
    productPresentation.classList.add("product__page-presentation-S");
    gallery.classList.add("gallery-S");
    gallerySliderContainer.classList.add("gallery-slider-S");
    document
      .querySelectorAll(".gallery__img")
      .forEach((el) => el.classList.add("gallery__img-S"));
    document
      .querySelectorAll(".gallery-thumbnail")
      .forEach((el) => el.classList.add("gallery-thumbnail-S"));
  }
})();

const imgs = document.querySelectorAll(".gallery-thumbnail");
const highlightImg = document.querySelector(".gallery-highlight");
//imgModal.src = highlightImg.src;
logo.addEventListener("click", () => (window.location.pathname = ""));
galleryGrid.addEventListener("click", function (e) {
  if (!e.target.classList.contains("gallery-thumbnail")) return;
  highlightImg.src = e.target.src;
  imgModal.src = highlightImg.src;
});

quantityIncrement.addEventListener("click", () => {
  if (quantity.value === 0) quantity.value = 1;
  if (quantity.value >= 9) return;
  quantity.value++;
});

quantityDecrement.addEventListener("click", () => {
  if (quantity.value <= 1) return;
  quantity.value--;
});

closeModal.addEventListener("click", () =>
  galleryModal.classList.add("fade-in")
);
// IMG ZOOM AND PAN
// Source - https://stackoverflow.com/q
// Posted by budgiebeaks
// Retrieved 2025-11-27, License - CC BY-SA 4.0

const container = document.querySelector(".gallery__container-highlight");
const img = document.querySelector(".gallery-highlight");

function imageZoom(container, img) {
  container.addEventListener("mousemove", onZoom);
  container.addEventListener("mouseover", onZoom);
  container.addEventListener("mouseleave", offZoom);
  function onZoom(e) {
    let offset = container.getBoundingClientRect();
    const x = e.clientX - offset.left;
    const y = e.clientY - offset.top;
    img.style.transformOrigin = `${x}px ${y}px`;
    img.style.transform = "scale(2.5)";
  }
  function offZoom(e) {
    img.style.transformOrigin = `center center`;
    img.style.transform = "scale(1)";
  }
}

if (window.innerWidth >= 576) {
  highlightImg.addEventListener("click", () =>
    galleryModal.classList.remove("fade-in")
  );
  imageZoom(container, img);
}

// TABS

tabsContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("tab__btn")) return;
  const type = e.target.dataset.type;
  const category = product.category;

  const content = product[type]
    ? product[type]
    : data[category]["category_info"][type];

  document
    .querySelectorAll(".tab__item")
    .forEach((el) => el.classList.remove("tab-active"));
  e.target.closest(".tab__item").classList.add("tab-active");
  tabContent.innerHTML = content;
});

// REVIEW SYSTEM //

const starsContainer = document.querySelector(".stars");
const stars = document.querySelectorAll(".star");
const reviewInfo = document.querySelector(".review__ratings");

class Reviews {
  #product;
  #rating = 0;
  #madeReview = false;

  constructor() {
    this.#getData();
    this.#passiveState();
    starsContainer.addEventListener(
      "mouseenter",
      this.#mouseOver.bind(this),
      true
    );
    starsContainer.addEventListener(
      "mouseleave",
      this.#passiveState.bind(this)
    );
    starsContainer.addEventListener("click", this.#addReview.bind(this));
  }

  #getData() {
    this.#product = activeProduct;
    const averageRating = this.#product.reviews.length
      ? (
          this.#product.reviews?.reduce((acc, val) => acc + val, 0) /
          this.#product.reviews.length
        ).toFixed(1)
      : 0;
    this.#rating = +averageRating;
    reviewInfo.textContent = `(${averageRating} / 5, ${
      this.#product.reviews.length
    } ${this.#product.reviews.length === 1 ? "review" : "reviews"})`;
  }

  #handleStars(id) {
    [...stars].forEach((star) => {
      +star.dataset.star <= id
        ? (star.style.fill = "#64b4c5")
        : (star.style.fill = "none");
    });
  }

  #passiveState() {
    this.#handleStars(this.#rating);
  }

  #mouseOver(e) {
    const id = +e.target.dataset.star;
    const selectedStar = e.target.classList.contains("star");
    if (!selectedStar) return;
    this.#handleStars(id);
  }

  #addReview(e) {
    // Check if a previous review is made
    if (this.#product.madeReview) return;

    // Get the id
    const ids = +e.target.closest(".star").dataset.star;
    if (!ids) return;

    // Push the new review to the db
    this.#product.reviews.push(ids);

    // Get the new data and parse it
    this.#getData();

    data.save();
    console.log(this.#product);
    this.#product.madeReview = true;
  }
}

new Reviews();
