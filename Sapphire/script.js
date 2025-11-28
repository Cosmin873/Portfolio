"use strict";
import { products, categories } from "./db.js";
import { renderHighlight } from "./general-functions.js";

const productsDOM = document.querySelector(".products");
const categoriesDOM = document.querySelector(".categories");
const navContainer = document.querySelector(".nav__menu");
const cta = document.querySelector(".cta");
const newsletterInputField = document.querySelector(".newsletter__input");
const newsletterSubmitBtn = document.querySelector(".newsletter__submit");
const error = document.querySelector(".error");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector(".close__modal");
const submitContactForm = document.querySelector(".contact__submit");
// IntersectionObserver API // Sticky nav
const navBar = document.querySelector(".nav__bar");
const hero = document.querySelector(".hero");
const textIn = document.querySelectorAll(".text-in");

const navTriggerBtn = document.querySelector(".nav__handler");

let emailList = [];
let formHTML;
const getEmails = function () {
  const data = JSON.parse(localStorage.getItem("emails"));
  if (!data) return;
  emailList = data;
};
getEmails();
console.log(emailList);

// HELPER FUNCTIONS
const capitalize = function (input) {
  return input.at(0).toUpperCase() + input.slice(1);
};

// SLIDESHOW
const slideshow = document.querySelector(".slideshow");
const sliders = document.querySelectorAll(".hero");

// **NAV BUTTONS: SMOOTH SCROLLING + CONTACT FORM MODAL** //

navContainer.addEventListener("click", function (e) {
  e.preventDefault();
  if (e.target.classList.contains("link__scroll")) {
    const id = e.target.getAttribute("href").slice(1);
    const toTarget = document.querySelector(`.${id}`);

    if (
      navBar.classList.contains("nav__fixed") &&
      !navBar.classList.contains("nav__hide")
    ) {
      navBar.classList.toggle("nav__hide");
      navBar.classList.toggle("nav__fixed");
    }

    toTarget.scrollIntoView({ behavior: "smooth" });
  }

  if (e.target.classList.contains("contact")) {
    modal.classList.remove("fade-in");
    overlay.classList.remove("hidden");
    formHTML = ` <input type="text" class="contact__input fs" placeholder="Your Name" />
        <input type="email" class="contact__input" placeholder="Your Email" />
        <input type="text" class="contact__input" placeholder="Subject" />
        <textarea
          name="message"
          id="message"
          placeholder="Message (180 characters)"
          maxlength="180"
          class="contact__input"
        ></textarea>
      `;
    document.querySelector(".contact__form").innerHTML = formHTML;
  }
});
// CLOSE BUTTON
closeModal.addEventListener("click", function () {
  modal.classList.add("fade-in");
  overlay.classList.add("hidden");
  document.querySelector(".modal__error").classList.add("hidden");
});

// SUBMIT BUTTON

submitContactForm.addEventListener("click", function (e) {
  e.preventDefault();
  const elemente = this.closest(".modal")
    .querySelector(".contact__form")
    .querySelectorAll(".contact__input");

  elemente.forEach((el) => {
    if (el.value === "") {
      el.style.backgroundColor = "rgba(255, 0, 72, 0.2)";
      document.querySelector(".modal__error").classList.remove("hidden");
      return;
    }
    if (el.value !== "") {
      el.style.background = "none";
    }
  });
  if ([...elemente].every((el) => el.value !== "")) {
    document.querySelector(
      ".contact__form"
    ).innerHTML = `<p class="form__ok">We received your enquire and we will answer in the shortest time possible. Have a great day!</p>`;
    document.querySelector(".modal__error").classList.add("hidden");
    setTimeout(function () {
      modal.classList.add("fade-in");
      overlay.classList.add("hidden");
      document.querySelector(".modal__error").classList.add("hidden");
    }, 10000);
  }
});
// **NEWSLETTER** //
const newsletterPopup = function (situation) {
  let html = "";
  error.textContent = html;
  if (situation === "pass") {
    html = `<h6 class="error__title">You subscribed to our newsletter!</h6>`;
    error.style.backgroundColor = "rgba(0, 255, 94, 0.2)";
    error.style.border = "1px solid green";
    error.classList.remove("fade-in");
    error.insertAdjacentHTML("beforeend", html);
  }
  if (situation === "err") {
    html = `<h6 class="error__title">Email form incorrect. Try again!</h6>`;
    error.style.backgroundColor = "rgba(255, 0, 72, 0.2)";
    error.style.border = "1px solid brown";
    error.classList.remove("fade-in");
    error.insertAdjacentHTML("beforeend", html);
  }
  if (situation === "existingMail") {
    html = `<h6 class="error__title">The email already exist in our database!</h6>`;
    error.style.backgroundColor = "rgba(238, 255, 0, 0.2)";
    error.style.border = "1px solid yellow";
    error.classList.remove("fade-in");
    error.insertAdjacentHTML("beforeend", html);
  }
  setTimeout(function () {
    error.classList.add("fade-in");
  }, 5000);
};

cta.addEventListener("click", () =>
  document.querySelector(".section__2").scrollIntoView({ behavior: "smooth" })
);
let id = 0;
products.rings.forEach((el) => {
  const html = `<div class="product" data-id = "${id++}"> 
  <div class="product__img-container">
<img
            src="${el.url[0]}"
            class="product__img img"
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

  productsDOM.insertAdjacentHTML("afterbegin", html);
});

let i = 0;
let interval;
const increment = function (e) {
  if (!e.target.classList.contains("product__img")) return;

  const code = e.target.dataset.code;

  const prod = products.rings.find((x) => x.code === code);
  if (i >= prod.url.length) i = 0;

  i++;
  e.target.src = prod.url[i];
  interval = setInterval(function () {
    i++;
    e.target.src = prod.url[i];
    if (i >= prod.url.length - 1) i = -1;
  }, 1500);
};

productsDOM.addEventListener("mouseover", increment);

productsDOM.addEventListener("mouseout", function (e) {
  if (!e.target.classList.contains("product__img")) return;

  const code = e.target.dataset.code;
  const prod = products.rings.find((x) => x.code === code);

  i = 0;

  e.target.src = prod.url[0];
  clearInterval(interval);
});

Object.entries(categories).forEach((el) => {
  const html = `  <div class="category">
          <img
            src="${el[1]}"
            class="category__img img"
            alt="Ring category"
          />
          <div class="category__information">
            <h3 class="category__title">${
              el[0].at(0).toUpperCase() + el[0].slice(1)
            }s</h3>
          </div>
        </div>`;
  categoriesDOM.insertAdjacentHTML("beforeend", html);
});

const category = document.querySelectorAll(".category");

category.forEach((el) => {
  el.addEventListener("mouseover", function (e) {
    const info = e.target
      .closest(".category")
      .querySelector(".category__information");
    // if (!e.target.classList.contains("category__img")) return;
    info.style.height = "100%";
  });
});

category.forEach((el) => {
  el.addEventListener("mouseout", function (e) {
    const info = e.target
      .closest(".category")
      .querySelector(".category__information");
    //  if (!e.target.classList.contains("category__img")) return;
    info.style.height = "10rem";
  });
});

// newsletterInputField
// newsletterSubmitBtn

newsletterSubmitBtn.addEventListener("click", function (e) {
  e.preventDefault();
  getEmails();
  const email = newsletterInputField.value;

  if (!email.includes("@") || !email.includes(".") || !email)
    return newsletterPopup("err");

  if (emailList.some((em) => em === email))
    return newsletterPopup("existingMail");
  newsletterPopup("pass");
  emailList.push(email);
  newsletterInputField.value = "";
  localStorage.setItem("emails", JSON.stringify(emailList));
});

// **INTERSECTION OBSERVER API** //
// **STICKY NAV** //

// Callback Functions
const obsNavCB = function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navBar.classList.remove("nav__fixed");
      navBar.classList.remove("nav__hide");
      navTriggerBtn.classList.add("hidden");
    }
    if (!entry.isIntersecting && entry.rootBounds.width < 576) {
      navBar.classList.add("nav__hide");
    }
    if (!entry.isIntersecting && entry.rootBounds.width >= 576)
      navBar.classList.add("nav__fixed");
    if (!entry.isIntersecting && entry.rootBounds.width <= 921)
      navTriggerBtn.classList.remove("hidden");
  });
};

const obstextInCB = function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove("text-in");
    }
  });
};

// IO Instances

const headerObserver = new IntersectionObserver(obsNavCB, {
  root: null,
  threshold: 0,
});

const textObserver = new IntersectionObserver(obstextInCB, {
  root: null,
  threshold: 0,
});

headerObserver.observe(hero);
textIn.forEach((el) => textObserver.observe(el));
document
  .querySelector(".header__logo")
  .addEventListener("click", () => hero.scrollIntoView({ behavior: "smooth" }));

navTriggerBtn.addEventListener("click", function (e) {
  navBar.classList.toggle("nav__hide");
  navBar.classList.toggle("nav__fixed");
});

// **Bestseller slider** //

// productsDOM = slider
const slides = document.querySelectorAll(".product");
const sliderRightBtn = document.querySelector(".slider__btn-right");
const sliderLeftBtn = document.querySelector(".slider__btn-left");
const dotsContainer = document.querySelector(".dots");
let currentSlide = 2;

const slidesAnimation = function () {
  [...slides]
    .filter((slide) => slide.dataset.id !== currentSlide)
    .forEach((item) => {
      item.classList.remove("shadow");
    });
  //
  slides[currentSlide].classList.remove("shadow-1");
  slides[currentSlide].classList.add("shadow");
  slides[currentSlide].style.transform = "scale(1.1)";
};
(function () {
  if (window.innerWidth < 576) {
    document.querySelector(".container-L").style.width = "100%";
    document.querySelector(".container-L").style.padding = "0";
    // document.querySelector(".slider__btn").style.fontSize = "2rem";

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

slides.forEach((el, i) => {
  dotsContainer.insertAdjacentHTML(
    "beforeend",
    `<button class="dot" data-id = "${i}"></button>`
  );
});

const activateDot = function () {
  document.querySelectorAll(".dot").forEach((dot) => {
    if (+dot.dataset.id !== currentSlide) dot.style.backgroundColor = "#64b4c5";
    if (+dot.dataset.id === currentSlide) dot.style.backgroundColor = "#50909e";
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
  slides.forEach((el, i, arr) => {
    el.style.transform = `translateX(${120 * (i - slide)}%) scale(0.9)`;
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
  let max = 1;
  let min = 0;
  // Larger screen size
  // if (window.innerWidth > 1300) {
  //   max = 2;
  //   min = 1;
  // }
  currentSlide >= slides.length - max ? (currentSlide = min) : currentSlide++;
  sliding(currentSlide);

  // slides[
  //   currentSlide >= slides.length ? slides.length - max : currentSlide - 1
  // ].style.background = "none";
  //
};

const slidingLeft = function () {
  let max = 1;
  let min = 0;
  // Larger screen size
  // if (window.innerWidth > 1300) {
  //   max = 2;
  //   min = 1;
  // }
  currentSlide <= min ? (currentSlide = slides.length - max) : currentSlide--;
  sliding(currentSlide);
};

sliderRightBtn.addEventListener("click", slidingRight);
sliderLeftBtn.addEventListener("click", slidingLeft);

// (function () {
//   if (window.innerWidth <= 365) {
//     // navTriggerBtn.classList.remove("hidden");
//     // navBar.classList.add("pos__fixed");
//   }
//   // if (window.innerWidth > 921) {
//   //   navTriggerBtn.classList.add("hidden");
//   // }
// })();

// Sending product information to another file
productsDOM.addEventListener("click", function (e) {
  // Get the product code
  const code = e.target.closest(".product").querySelector(".product__img")
    .dataset.code;

  // Find the product in the database
  const product = Object.values(products)[0].find((el) => el.code === code);
  console.log(product);

  // Delete the localStorage
  localStorage.removeItem("product");

  // Add the product to the localStorage
  localStorage.setItem("product", JSON.stringify(product));

  // Redirect to the product page
  window.location.pathname = "/product-page.html";
});
