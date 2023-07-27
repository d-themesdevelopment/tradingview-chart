import { ensureDefined, ensureNotNull, assert } from "./assertions";
import { sortSources } from "./98517";

class Container {
  constructor() {
    this._horizlines = [];
    this._hhists = [];
    this._polygons = [];
    this._vertlines = [];
    this._containersCache = [];
    this._containerNamesCache = [];
    this._containersMapCache = new Map();

    this._addToCache("horizlines", this._horizlines);
    this._addToCache("hhists", this._hhists);
    this._addToCache("polygons", this._polygons);
    this._addToCache("vertlines", this._vertlines);
  }

  primitiveData(mode) {
    const data = {};
    let hasData = false;

    for (const containerName of this._containerNamesCache) {
      const primitivesData = [];
      const container = this.getObjsContainer(containerName);

      for (const item of container) {
        if (item.isNaN()) continue;

        const primitiveData = item.primitiveData(mode);
        if (primitiveData.data.length > 0) {
          primitivesData.push(primitiveData);
        }
      }

      if (primitivesData.length > 0) {
        data[containerName] = primitivesData;
        hasData = true;
      }
    }

    return hasData ? data : null;
  }

  deleteErasedAndMarkPostedObjs() {
    this.forEachList((list) => {
      list.deleteErasedItems();
      list.markPostedItems();
    });
  }

  deleteErasedObjs() {
    this.forEachList((list) => {
      list.deleteErasedItems();
    });
  }

  getObjsContainer(name) {
    return ensureDefined(this._containersMapCache.get(name));
  }

  forEachList(callback) {
    for (const container of this._containersCache) {
      for (const item of container) {
        callback(item.data);
      }
    }
  }

  _addToCache(name, list) {
    this._containersCache.push(list);
    this._containerNamesCache.push(name);
    this._containersMapCache.set(name, list);
  }
}

class StudyGraphicsData {
  constructor(styleId, data) {
    this.styleId = styleId;
    this.data = data;
  }

  isNaN() {
    return this.data.isNaN();
  }

  primitiveData(mode) {
    return {
      styleId: this.styleId,
      data: this.data.primitivesData(mode),
    };
  }
}

export { Container, StudyGraphicsData };
