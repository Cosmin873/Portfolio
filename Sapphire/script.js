"use strict";
import { data } from "./db.js";
import {
  capitalize,
  renderProducts,
  cardImgSlider,
  cardImgSliderReset,
  renderSlider,
} from "./general-functions.js";

const productsDOM = document.querySelector(".products");
const categoriesDOM = document.querySelector(".categories");
const navContainer = document.querySelector(".nav__menu");
const searchBarDOM = document.querySelector(".search__bar");
const searchBarClose = document.querySelector(".search__bar-close");
const searchInput = document.querySelector(".search-input");
const searchResultBar = document.querySelector(".search__result");
let searchResultList = document.querySelector(".search__result-list");
let searchResultItem;
const searchResultContent = document.querySelector(".search__result-content");
const cta = document.querySelector(".cta");
const newsletterInputField = document.querySelector(".newsletter__input");
const newsletterSubmitBtn = document.querySelector(".newsletter__submit");
const error = document.querySelector(".error");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const closeModal = document.querySelector(".close__modal");
const submitContactForm = document.querySelector(".contact__submit");
const containerL = document.querySelector(".container-L");
// IntersectionObserver API // Sticky nav
const navBar = document.querySelector(".nav__bar");
const hero = document.querySelector(".hero");
const textIn = document.querySelectorAll(".text-in");

const navTriggerBtn = document.querySelector(".nav__handler");

let search = [];
let searchResult = [];
const resetSearchResults = function () {
  if (searchResultList)
    [searchResultBar].forEach((el) =>
      el.querySelectorAll(".slider__btn").forEach((t) => t.remove())
    );
  if (searchResultItem)
    searchResultItem.forEach((el) => {
      el.remove();
    });

  searchResult = [];
};

let emailList = [];
let formHTML;
const getEmails = function () {
  const data = JSON.parse(localStorage.getItem("emails"));
  if (!data) return;
  emailList = data;
};
getEmails();
console.log(emailList);

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
    // document.querySelector(".contact__form").innerHTML = "";
    //     const contactForm = document.querySelector(".contact__form");
    // const contactSubmit = document.querySelector(".contact__submit");
    modal.classList.remove("fade-in");
    overlay.classList.remove("hidden");
    // formHTML = ` <input type="text" class="contact__input fs" placeholder="Your Name" name="name" />
    //     <input type="email" class="contact__input" name="email" placeholder="Your Email" />
    //     <input type="text" class="contact__input" placeholder="Subject" name="subject" />
    //     <textarea
    //       name="message"
    //       id="message"
    //       placeholder="Message (180 characters)"
    //       maxlength="180"
    //       class="contact__input"
    //     ></textarea>

    //   `;
    // document.querySelector(".contact__form").innerHTML = formHTML;
    // document
    // .querySelector(".contact__form")
    // .insertAdjacentHTML("afterbegin", formHTML);
  }

  if (e.target.classList.contains("search-icon")) {
    searchBarDOM.classList.remove("search__fade-in");
    searchInput.value = "";
    setTimeout(() => searchInput.focus(), 1000);
    search = [];
  }
};

navContainer.addEventListener("click", navBarFunc);

// CLOSE BUTTONS

const closeSearchBar = function () {
  searchBarDOM.classList.add("search__fade-in");
  searchResultBar.classList.add("search__fade-in");
  resetSearchResults();
  search = [];
};

const closeModalBtn = function () {
  modal.classList.add("fade-in");
  overlay.classList.add("hidden");
  document.querySelector(".modal__error").classList.add("hidden");
};

searchBarClose.addEventListener("click", closeSearchBar);

closeModal.addEventListener("click", closeModalBtn);

// SEARCH BAR

const searchingDB = function (input) {
  for (const [key, values] of Object.entries(data)) {
    if (!values.products) continue;
    // console.log(values);
    values.products.forEach((el) => {
      if (el.title.toLowerCase().includes(input)) searchResult.push(el);
    });
  }
};
searchInput.addEventListener("keydown", function (e) {
  // if (searchResultList)
  //   [searchResultList].forEach((el) =>
  //     el.querySelectorAll(".product").forEach((t) => t.remove())
  //   );
  // if (searchResultItem)
  //   searchResultItem.forEach((el) => console.log("aici", el));

  resetSearchResults();
  if (e.key === "Backspace") {
    search.pop();
  } else search.push(e.key);
  const searchValue = search.join("");
  searchingDB(searchValue);
  renderProducts(
    searchResult,
    searchResultList,
    "beforeend",
    "search__product"
  );
  searchResultItem = document.querySelectorAll(".search__product");
  searchResultList = document.querySelector(".search__result-list");

  if (searchResultItem.length >= 5) {
    searchResultItem.forEach((item) => item.classList.add("search__product-S"));
    renderSlider(
      searchResultItem,
      searchResultContent,
      0,
      searchResultBar,
      120,
      0,
      4,
      false
    );
  }

  if (searchResultList)
    [searchResultBar].forEach((el) =>
      el.querySelectorAll(".dots").forEach((t) => t.remove())
    );
  if (search.length > 0) searchResultBar.classList.remove("search__fade-in");
  if (search.length < 1 || !searchResultList)
    searchResultBar.classList.add("search__fade-in");
});

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
  const myForm = e.target;
  const formData = new FormData(myForm);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => console.log("Form successfully submitted"))
    .catch((error) => alert(error));
};

submitContactForm.addEventListener("submit", submitContactFormFunc);

cta.addEventListener("click", () =>
  document.querySelector(".section__2").scrollIntoView({ behavior: "smooth" })
);

// Bestsellers Section

renderProducts(data.bestsellers, productsDOM, "beforeend", "product-slider"); // render the products in the slider (source, target, insertOrder)
/////////////////

// Bestseller changing image at 1.5s based on materials

productsDOM.addEventListener("mouseover", cardImgSlider(data.bestsellers));

productsDOM.addEventListener("mouseout", cardImgSliderReset(data.bestsellers));

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
searchResultList.addEventListener("click", redirectToProductPage);

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
    console.log(entry, navBar);
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

const sliderContainer = document.querySelector(".slider");

renderSlider(slides, sliderContainer, 1, containerL);

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

const getAllProducts = async function (url) {
  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
};

getAllProducts("https://dummyjson.com/products/category/womens-jewellery");
