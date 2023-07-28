const { getLogger } = require("your-module-path"); // Replace 'your-module-path' with the actual module path

export class TVLocalStorage {
  constructor() {
    try {
      this.isAvailable = true;
      this.localStorage = window.localStorage;
      this.localStorage.setItem("tvlocalstorage.available", "true");
    } catch (e) {
      delete this.isAvailable;
      delete this.localStorage;
    }
    this._updateLength();
    try {
      this._report();
    } catch (e) {}
  }

  _report() {
    if (this.isAvailable) {
      const maxKeys = 10;
      const longestValueKeys = [];
      for (let i = 0; i < this.localStorage.length; i++) {
        const key = this.key(i);
        longestValueKeys.push({
          key: key,
          length: String(this.getItem(key)).length,
        });
      }
      longestValueKeys.sort((a, b) => b.length - a.length);
      const topLongestValues = longestValueKeys.slice(0, maxKeys);
      longestValueKeys.sort((a, b) => b.key.length - a.key.length);
      const topLongestKeys = longestValueKeys.slice(0, maxKeys);
      getLogger("TVLocalStorage").logNormal(
        `Total amount of keys in Local Storage: ${this.length}`
      );
      getLogger("TVLocalStorage").logNormal(
        `Top ${maxKeys} keys with longest values: ${JSON.stringify(
          topLongestValues
        )}`
      );
      getLogger("TVLocalStorage").logNormal(
        `Top ${maxKeys} longest key names: ${JSON.stringify(topLongestKeys)}`
      );
      try {
        if (navigator.storage && navigator.storage.estimate) {
          navigator.storage.estimate().then((estimate) => {
            getLogger("TVLocalStorage").logNormal(
              `Storage estimate: ${JSON.stringify(estimate)}`
            );
          });
        }
      } catch (e) {}
    }
  }

  _updateLength() {
    if (this.isAvailable) {
      this.length = this.localStorage.length;
    } else {
      let count = 0;
      for (const key in this.localStorage) {
        if (this.localStorage.hasOwnProperty(key)) {
          count++;
        }
      }
      this.length = count;
    }
  }

  key(index) {
    return this.isAvailable
      ? this.localStorage.key(index)
      : Object.keys(this.localStorage)[index];
  }

  getItem(key) {
    return this.isAvailable
      ? this.localStorage.getItem(key)
      : this.localStorage[key] === undefined
      ? null
      : this.localStorage[key];
  }

  setItem(key, value) {
    if (this.isAvailable) {
      this.localStorage.setItem(key, value);
    } else {
      this.localStorage[key] = value;
    }
    this._updateLength();
  }

  removeItem(key) {
    if (this.isAvailable) {
      this.localStorage.removeItem(key);
    } else {
      delete this.localStorage[key];
    }
    this._updateLength();
  }

  clear() {
    if (this.isAvailable) {
      this.localStorage.clear();
    } else {
      this.localStorage = {};
    }
    this._updateLength();
  }
}

class TVLocalStorageAsync {
  constructor(storage) {
    this.storage = storage;
  }

  getItem(key) {
    return Promise.resolve(this.storage.getItem(key));
  }

  setItem(key, value) {
    return Promise.resolve(this.storage.setItem(key, value));
  }
}

window.TVLocalStorage = new TVLocalStorage();
window.TVLocalStorageAsync = new TVLocalStorageAsync(window.TVLocalStorage);
