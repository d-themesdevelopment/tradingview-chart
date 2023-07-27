"use strict";

const characters =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const randomNumber = (16 * Math.random()) | 0;
    return ("x" === char ? randomNumber : (3 & randomNumber) | 8).toString(16);
  });
}

export function randomHash() {
  return randomHashN(12);
}

export function randomHashN(length) {
  let hash = "";
  for (let i = 0; i < length; ++i) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hash += characters[randomIndex];
  }
  return hash;
}
