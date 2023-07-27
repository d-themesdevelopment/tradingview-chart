
class AreaBackgroundItem {
    constructor() {
      super();
      this.points1 = new CachedContainer();
      this.points2 = new CachedContainer();
      this.push(this.points1);
      this.push(this.points2);
    }
  
    addPoints1Point(x, y) {
      let item = this.points1.newItem();
      if (item === null) {
        item = { x, y };
      } else {
        item.x = x;
        item.y = y;
      }
      this.points1.push(item);
    }
  
    addPoints2Point(x, y) {
      let item = this.points2.newItem();
      if (item === null) {
        item = { x, y };
      } else {
        item.x = x;
        item.y = y;
      }
      this.points2.push(item);
    }
  
    invalidateCache() {
      this.points1.invalidateCache();
      this.points2.invalidateCache();
    }
  }
  
  class AreaBackgroundItemsGroup extends CachedContainer {
    constructor(color) {
      super();
      this.color = color;
    }
  }
  
  class AreaBackgroundRenderer extends BitmapCoordinatesPaneRenderer {
    constructor(data) {
      super();
      this._data = data !== null ? data : null;
    }
  
    setData(data) {
      this._data = data;
    }
  
    hitTest(x, y) {
      return null;
    }
  
    _drawImpl(context) {
      if (this._data === null) {
        return;
      }
  
      const { context, horizontalPixelRatio, verticalPixelRatio } = context;
      const barSpacing = 0.25 * this._data.barSpacing;
  
      this._data.colorAreas.forEach((area) => {
        context.beginPath();
  
        for (let i = 0; i < area.length(); i++) {
          const item = area.at(i);
          if (item.points1.length() === 0 || item.points2.length() === 0) {
            continue;
          }
  
          const x = item.points1.at(0).x;
          const y = item.points1.at(0).y;
  
          context.moveTo(Math.round(x * horizontalPixelRatio), y * verticalPixelRatio);
  
          if (item.points1.length() !== 1 && item.points2.length() !== 1) {
            for (let j = 1; j < item.points1.length(); j++) {
              context.lineTo(Math.round(item.points1.at(j).x * horizontalPixelRatio), item.points1.at(j).y * verticalPixelRatio);
            }
  
            for (let j = item.points2.length() - 1; j >= 0; j--) {
              context.lineTo(Math.round(item.points2.at(j).x * horizontalPixelRatio), item.points2.at(j).y * verticalPixelRatio);
            }
          } else {
            const endX = item.points2.at(0).x;
            const endY = item.points2.at(0).y;
  
            context.lineTo(Math.round((x + barSpacing) * horizontalPixelRatio), y * verticalPixelRatio);
            context.lineTo(Math.round((endX + barSpacing) * horizontalPixelRatio), endY * verticalPixelRatio);
            context.lineTo(Math.round((endX - barSpacing) * horizontalPixelRatio), endY * verticalPixelRatio);
            context.lineTo(Math.round((x - barSpacing) * horizontalPixelRatio), y * verticalPixelRatio);
          }
        }
  
        context.closePath();
  
        if (area.color.type === 0) {
          context.fillStyle = area.color.color;
        } else {
          const gradient = context.createLinearGradient(0, area.color.value1 * verticalPixelRatio, 0, area.color.value2 * verticalPixelRatio);
          gradient.addColorStop(0, area.color.color1 ?? "transparent");
          gradient.addColorStop(1, area.color.color2 ?? "transparent");
          context.fillStyle = gradient;
        }
  
        context.fill();
      });
    }
  }
  
  class CachedMap {
    constructor() {
      this._map = new Map();
      this._usedKeys = new Set();
      this._invalidations = 0;
    }
  
    invalidateCache() {
      this._invalidations += 1;
      if (this._invalidations === 50) {
        this._deleteUnused();
        this._invalidations = 0;
      }
      this._usedKeys.clear();
      this._map.forEach((item, key) => {
        item.invalidateCache();
      });
    }
  
    get(key) {
      const item = this._map.get(key);
      if (item !== undefined) {
        this._usedKeys.add(key);
      }
      return item;
    }
  
    set(key, value) {
      this._usedKeys.add(key);
      this._map.set(key, value);
    }
  
    forEach(callback) {
      this._map.forEach((item, key) => {
        if (this._usedKeys.has(key)) {
          callback(item, key);
        }
      });
    }
  
    delete(key) {
      const item = this._map.get(key);
      if (item !== undefined) {
        item.invalidateCache();
      }
      this._usedKeys.delete(key);
    }
  
    _deleteUnused() {
      const unusedKeys = [];
      this._map.forEach((item, key) => {
        if (!this._usedKeys.has(key)) {
          unusedKeys.push(key);
        }
      });
      for (const key of unusedKeys) {
        this._map.delete(key);
      }
    }
  }
  
  export { AreaBackgroundItem, AreaBackgroundItemsGroup, AreaBackgroundRenderer, CachedMap };