"use strict";
import { data } from "./db.js";
import {
  capitalize,
  renderProducts,
  cardImgSlider,
  cardImgSliderReset,
} from "./general-functions.js";

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

// SLIDESHOW
const slideshow = document.querySelector(".slideshow");
const sliders = document.querySelectorAll(".hero");

// **NAV BUTTONS: SMOOTH SCROLLING + CONTACT FORM MODAL** //

const navBarFunc = function (e) {
  e.preventDefault();
  if (e.target.classList.contains("link__scroll")) {
    const id = e.target.getAttribute("href").slice(1);
    const toTarget = document.querySelector(`.${id}`);

    if (
      window.innerWidth <= 576 &&
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
};

navContainer.addEventListener("click", navBarFunc);

// CLOSE BUTTON

const closeModalBtn = function () {
  modal.classList.add("fade-in");
  overlay.classList.add("hidden");
  document.querySelector(".modal__error").classList.add("hidden");
};

closeModal.addEventListener("click", closeModalBtn);

// SUBMIT BUTTON

const submitContactFormFunc = function (e) {
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
};

submitContactForm.addEventListener("click", submitContactFormFunc);

cta.addEventListener("click", () =>
  document.querySelector(".section__2").scrollIntoView({ behavior: "smooth" })
);

// Bestsellers Section
// In production = data.bestsellers!!!
renderProducts(data.allProducts, productsDOM, "afterbegin"); // render the products in the slider (source, target, insertOrder)

// Bestseller changing image at 1.5s based on materials

productsDOM.addEventListener("mouseover", cardImgSlider(data.allProducts));

productsDOM.addEventListener("mouseout", cardImgSliderReset(data.allProducts));

// Product page

// Sending product information to another file

const redirectToProductPage = function (e) {
  // Get the product code
  const code = e.target.closest(".product").querySelector(".product__img")
    .dataset.code;

  // Find the product in the database
  const product = data.allProducts.find((el) => el.code === code);

  // Finding the category
  const findingCategory = function (byProduct) {
    for (const [key, value] of Object.entries(data)) {
      if (!value || !value.products) continue;
      if (value.products.includes(byProduct)) byProduct.category = key;
    }
    console.log(byProduct);
  };
  findingCategory(product);

  // Delete the localStorage
  localStorage.removeItem("product");

  // Add the product to the localStorage
  localStorage.setItem("product", JSON.stringify(product));

  // Redirect to the product page
  window.location.pathname = "/product-page.html";
};

productsDOM.addEventListener("click", redirectToProductPage);

// Our Selection (Catalog)

// Rendering the categories
const getCategories = function () {
  const dataObject = Object.entries(data);
  return [dataObject[0], dataObject[1], dataObject[2]];
};

const renderCategories = function (source, target, insertOrder) {
  source.forEach((el) => {
    const html = `  <div class="category">
          <img
            src="${el[1].img}"
            class="category__img img"
            alt="Ring category"
          />
          <div class="category__information">
            <h3 class="category__title">${capitalize(el[0])}</h3>
          </div>
        </div>`;
    target.insertAdjacentHTML(insertOrder, html);
  });
};

renderCategories(getCategories(), categoriesDOM, "beforeend");

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

// productsDOM === slider
const slides = document.querySelectorAll(".product");
const sliderRightBtn = document.querySelector(".slider__btn-right");
const sliderLeftBtn = document.querySelector(".slider__btn-left");
const dotsContainer = document.querySelector(".dots");
let currentSlide = 2;

const slidesAnimation = function () {
  // Removing large shadow for the products adjacent to main one
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
