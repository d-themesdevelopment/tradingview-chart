"use strict";

const imageCache = new Map();

function setCrossOriginAttribute(img) {
  img.crossOrigin = "anonymous";
}

function getImage(key, src, configure = setCrossOriginAttribute) {
  let promise = imageCache.get(key);

  if (typeof promise === "undefined") {
    promise = new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve(img);
        img.onload = null;
        img.onerror = null;
      };

      img.onerror = () => {
        reject();
        img.onload = null;
        img.onerror = null;
      };

      configure(img);
      img.src = src;
    });

    imageCache.set(key, promise);
  }

  return promise;
}

export { getImage };
