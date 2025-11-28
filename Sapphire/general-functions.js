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

export { renderHighlight, renderThumbnails };
