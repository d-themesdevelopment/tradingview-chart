"use strict";

function isAbortError(error) {
  return error instanceof Error && error.name === "AbortError";
}

function skipAbortError(error) {
  if (!isAbortError(error)) {
    throw error;
  }
}

function createAbortPromise(signal) {
  return signal.aborted
    ? Promise.reject(new DOMException("Aborted", "AbortError"))
    : new Promise((resolve, reject) => {
        signal.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")), {
          once: true
        });
      });
}

function respectAbort(signal, promise) {
  return Promise.race([createAbortPromise(signal), promise]);
}