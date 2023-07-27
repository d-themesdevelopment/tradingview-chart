import { getOrDefault, getDefaultLazy, getDefault3 } from 'utils/mapUtils';

class AbstractMapContainer {
  constructor() {
    this._map = new Map();
    this._size = 0;
  }

  size() {
    return this._size;
  }

  clear() {
    this._map.clear();
    this._size = 0;
  }
}

export {
  AbstractMapContainer,
  getDefault2Lazy,
  getDefault3
};