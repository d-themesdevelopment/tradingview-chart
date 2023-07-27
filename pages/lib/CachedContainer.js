  
  class CachedContainer {
    constructor() {
      this._items = [];
      this._actualLength = 0;
      this._invalidations = 0;
    }
  
    push(item) {
      if (this._items.length === this._actualLength) {
        this._items.push(item);
      } else {
        if (this._items[this._actualLength] !== item) {
          this._items[this._actualLength] = item;
        }
      }
      this._actualLength += 1;
    }
  
    newItem() {
      const item = this._items.length > this._actualLength ? this._items[this._actualLength] : null;
      if (item !== null && typeof item.invalidateCache === "function") {
        item.invalidateCache();
      }
      return item;
    }
  
    invalidateCache() {
      this._invalidations += 1;
      if (this._invalidations === 3000) {
        this._items.splice(this._actualLength);
        this._invalidations = 0;
      }
      this._actualLength = 0;
    }
  
    at(index) {
      return this._items[index];
    }
  
    data() {
      return this._items;
    }
  
    length() {
      return this._actualLength;
    }
  }
  
  class ObjectValuesCache extends CachedContainer {
    constructor() {
      super();
      this._startIndex = 0;
    }
  
    setStartIndex(startIndex) {
      this._startIndex = startIndex;
    }
  
    isValidIndex(index) {
      return index >= this._startIndex;
    }
  
    at(index) {
      const adjustedIndex = index - this._startIndex;
      while (adjustedIndex >= this._actualLength) {
        if (this._items.length <= adjustedIndex) {
          this._items.push(this._newObject());
        } else {
          this._clearObject(this._items[this._actualLength]);
        }
        this._actualLength += 1;
      }
      return this._items[adjustedIndex];
    }
  }
  
  export { CachedContainer, ObjectValuesCache };

  