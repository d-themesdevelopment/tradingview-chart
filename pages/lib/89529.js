import { GraphicsObj, GraphicsList } from 'some-library';

class VolumeByPriceExpr extends GraphicsObj {
  constructor(model, chartApi, series, startIndex, endIndex, level) {
    super(model);
    this._startIndex = this._mixinJSONObject.createTimeField(startIndex, 'startIndex');
    this._endIndex = this._mixinJSONObject.createTimeField(endIndex, 'endIndex');
    this._level = this._mixinJSONObject.createDoubleField(level, 'level');
    this._series = series;
  }

  isNaN() {
    return (
      super.isNaN() ||
      Number.isNaN(this._startIndex.get()) ||
      Number.isNaN(this._endIndex.get()) ||
      Number.isNaN(this._level.get())
    );
  }

  jsonName() {
    return 'hhists';
  }

  primitiveData() {
    return {
      id: this.id(),
      startIndex: this._startIndex.get(),
      endIndex: this._endIndex.get(),
      level: this._level.get(),
    };
  }

  getStartIndex() {
    return this._startIndex.get();
  }

  setStartIndex(startIndex) {
    if (this._startIndex.set(startIndex)) {
      this._processObjUpdate();
    }
  }

  getEndIndex() {
    return this._endIndex.get();
  }

  setEndIndex(endIndex) {
    if (this._endIndex.set(endIndex)) {
      this._processObjUpdate();
    }
  }

  getLevel() {
    return this._level.get();
  }

  setLevel(level) {
    if (this._level.set(level)) {
      this._processObjUpdate();
    }
  }

  getSeries() {
    return this._series;
  }
}

class PriceLevel {
  constructor(index, level, offset) {
    this.index = index;
    this.level = level;
    this.offset = offset;
  }

  isNaN() {
    return Number.isNaN(this.level);
  }

  equals(level) {
    if (!(level instanceof PriceLevel)) return false;
    if (this.isNaN() || level.isNaN()) return false;
    return this.index === level.index && this.offset === level.offset && this.level === level.level;
  }

  getLevel() {
    return this.level;
  }

  getIndex() {
    return this.index;
  }
}

class Polygons extends GraphicsObj {
  constructor(model, points) {
    super(model);
    this._points = points || [];
  }

  addPoint(point) {
    this._processObjUpdate();
    this._points.push(point);
  }

  addPoints(points) {
    this._processObjUpdate();
    this._points.push(...points);
  }

  setPoint(index, point) {
    const existingPoint = this._points[index];
    if (!point.equals(existingPoint)) {
      this._processObjUpdate();
      this._points[index] = point;
    }
  }

  getPoint(index) {
    const point = this._points[index];
    return new PriceLevel(point.index, point.level, point.offset);
  }

  getPoints() {
    return this._points.map((point) => new PriceLevel(point.index, point.level, point.offset));
  }

  getPointsCount() {
    return this._points.length;
  }

  setPoints(points) {
    if (points.length === this._points.length) {
      let isSame = true;
      for (let i = 0; i < points.length; i++) {
        if (!points[i].equals(this._points[i])) {
          isSame = false;
          break;
        }
      }
      if (isSame) return;
    }
    this._processObjUpdate();
    this._points = [];
    this._points.push(...points);
  }

  clearPoints() {
    this._processObjUpdate();
    this._points = [];
  }

  isNaN() {
    return super.isNaN() || this._points.length < 3;
  }

  jsonName() {
    return 'polygons';
  }

  primitiveData() {
    return {
      id: this.id(),
      points: this._points.map((point) => ({
        index: point.index,
        offset: point.offset,
        level: point.level,
      })),
    };
  }
}

class HorizLines {
  constructor(model, startIndex, endIndex, level, extendLeft, extendRight) {
    super(model);
    this._startIndex = this._mixinJSONObject.createTimeField(startIndex, 'startIndex');
    this._endIndex = this._mixinJSONObject.createTimeField(endIndex, 'endIndex');
    this._level = this._mixinJSONObject.createDoubleField(level, 'level');
    this._extendLeft = this._mixinJSONObject.createField(extendLeft, 'extendLeft');
    this._extendRight = this._mixinJSONObject.createField(extendRight, 'extendRight');
  }

  isNaN() {
    return (
      super.isNaN() ||
      Number.isNaN(this._level.get()) ||
      this._startIndex.get() < 0 ||
      this._endIndex.get() < 0 ||
      (this._startIndex.get() === this._endIndex.get() && !this._extendLeft.get() && !this._extendRight.get())
    );
  }

  jsonName() {
    return 'horizlines';
  }

  primitiveData() {
    return {
      id: this.id(),
      startIndex: this._startIndex.get(),
      endIndex: this._endIndex.get(),
      extendLeft: this._extendLeft.get(),
      extendRight: this._extendRight.get(),
      level: this._level.get(),
    };
  }

  getStartIndex() {
    return this._startIndex.get();
  }

  setStartIndex(startIndex) {
    if (this._startIndex.set(startIndex)) {
      this._processObjUpdate();
    }
  }

  getEndIndex() {
    return this._endIndex.get();
  }

  setEndIndex(endIndex) {
    if (this._endIndex.set(endIndex)) {
      this._processObjUpdate();
    }
  }

  getLevel() {
    return this._level.get();
  }

  setLevel(level) {
    if (this._level.set(level)) {
      this._processObjUpdate();
    }
  }

  isExtendLeft() {
    return this._extendLeft.get();
  }

  setExtendLeft(extendLeft) {
    if (this._extendLeft.set(extendLeft)) {
      this._processObjUpdate();
    }
  }

  isExtendRight() {
    return this._

