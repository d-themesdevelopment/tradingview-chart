

import isAbortError from "./45884";

class ChunkLoader {
  constructor() {
    this._retries = 5;
    this._cache = null;
    this._tryLoad = (url, callback) => {
      this._retries = this._retries - 1;
      this._startLoading(url)
        .then(callback)
        .catch(error => {
          if (!isAbortError(error) && this._retries !== 0) {
            setTimeout(() => this._tryLoad(url, callback), 3000);
          }
        });
    };
  }

  load(url) {
    if (!this._cache) {
      this._cache = new Promise(this._tryLoad.bind(this, url || null));
    }
    return this._cache;
  }
}

module.exports = ChunkLoader;