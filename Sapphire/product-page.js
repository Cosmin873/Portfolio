const product = JSON.parse(localStorage.getItem("product"));
console.log(product);

// Navigation
const logo = document.querySelector(".logo");

// PRODUCT ELEMENTS
const productTitle = document.querySelector(".product__page-title");
const productCategory = document.querySelector(".category");
const productPrice = document.querySelector(".price");

const imgs = document.querySelectorAll(".gallery-img");
// IMG ZOOM AND PAN
const container = document.querySelector(".gallery__container-1");
const img = document.querySelector(".gallery__img-1");

product.url.forEach((el, i, arr) => {
  document.querySelector(`.gallery__img-${i + 1}`).src = el;
});
// Product initialization
(function () {
  productTitle.textContent = product.title;
  productPrice.textContent = product.price;
})();

logo.addEventListener("click", () => (window.location.pathname = ""));

// IMG ZOOM AND PAN
// Source - https://stackoverflow.com/q
// Posted by budgiebeaks
// Retrieved 2025-11-27, License - CC BY-SA 4.0

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

imageZoom(container, img);
