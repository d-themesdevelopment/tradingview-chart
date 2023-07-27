


import { isNaNable } from '76958';
import { GraphicsObj } from '29779';

class GraphicsList {
  constructor() {
    this._items = [];
    this._owner = null;
  }

  primitivesData(renderer) {
    const data = [];
    for (const item of this._items) {
      if (!renderer.isIgnoredObj(item)) {
        data.push(item.primitiveData());
      }
    }
    return data;
  }

  get(index) {
    return this._items[index];
  }

  set(index, item) {
    this.dirty();
    item.setOwner(this);
    this._items[index] = item;
    return item;
  }

  addAtIndex(index, item) {
    this.dirty();
    item.setOwner(this);
    this._items[index] = item;
  }

  clear() {
    this._unsetOwner(this._items);
    this._items = [];
    this.dirty();
  }

  addAllFromNumber(index, list) {
    this.setOwner(list);
    this._items.splice(index, 0, ...list._items);
    this._setCachedDataValid(false);
    return true;
  }

  addAll(list) {
    this.setOwner(list);
    this._items.push(...list._items);
    this._setCachedDataValid(false);
    return true;
  }

  remove(index) {
    const item = this._items[index];
    this._items.splice(index, 1);
    item.unsetOwner(this);
    this.dirty();
    return item;
  }

  getItems() {
    return this._items;
  }

  size() {
    return this._items.length;
  }

  add(item) {
    item.setOwner(this);
    this._items.push(item);
    this._setCachedDataValid(false);
    return true;
  }

  deleteErasedItems() {
    this._items = this._items.filter(item => !item.isErased());
  }

  markPostedItems() {
    for (const item of this._items) {
      item.markAsPosted();
    }
  }

  isNaN() {
    if (this._items.length === 0) {
      return true;
    }
    for (const item of this._items) {
      if (!isNaNable(item)) {
        return false;
      }
      if (!item.isNaN()) {
        return false;
      }
    }
    return true;
  }

  setOwner(owner) {
    this._owner = owner;
  }

  dirty() {
    if (this._owner !== null) {
      this._owner.dirty();
    }
  }

  _unsetOwner(items) {
    for (const item of items) {
      if (item instanceof GraphicsObj) {
        item.unsetOwner(this);
      }
    }
  }

  _setCachedDataValid(value) {
    if (!value) {
      this.dirty();
    }
  }
}

export { GraphicsList };