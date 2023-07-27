import { enabled } from "./helpers";
import { getVolumeProfileResolutionForPeriod, Std } from "./helpers"; // ! not correct
import { Interval } from "IntervalLibraryName"; // ! not correct

class VolumeProfileBase {
  constructor(rowSize, type) {
    this._minTick = NaN;
    this._minPrice = NaN;
    this._maxPrice = NaN;
    this._low = NaN;
    this._high = NaN;
    this._startPrice = NaN;
    this._indexLowVbP = NaN;
    this._indexHighVbP = NaN;
    this._rowSize = rowSize;
    this._type = type;
  }

  init(minTick, minPrice, maxPrice, low, high) {
    this._minTick = minTick;
    this._minPrice = minPrice;
    this._maxPrice = maxPrice;
    this._low = low;
    this._high = high;
  }

  getStartPrice() {
    return this._startPrice;
  }

  setStartPrice(startPrice) {
    this._startPrice = startPrice;
  }

  getIndexLowVbP() {
    return this._indexLowVbP;
  }

  setIndexLowVbP(indexLowVbP) {
    this._indexLowVbP = indexLowVbP;
  }

  getIndexHighVbP() {
    return this._indexHighVbP;
  }

  setIndexHighVbP(indexHighVbP) {
    this._indexHighVbP = indexHighVbP;
  }

  type() {
    return this._type;
  }
}

class BasicVolumeProfile extends VolumeProfileBase {
  constructor(rowSize) {
    super(rowSize, 0);
  }

  calculate() {
    this.setStartPrice(this._minPrice);
    const rowWidth = this.getRowWidth();
    let indexLowVbP = Math.floor((this._low - this._minPrice) / rowWidth);
    let indexHighVbP = Math.ceil((this._high - this._minPrice) / rowWidth) - 1;
    indexLowVbP = Math.max(indexLowVbP, 0);
    indexHighVbP = Math.max(indexHighVbP, 0);
    indexHighVbP = Math.min(indexHighVbP, this._rowSize - 1);
    indexLowVbP = Math.min(indexLowVbP, indexHighVbP);
    this.setIndexLowVbP(indexLowVbP);
    this.setIndexHighVbP(indexHighVbP);
  }

  getRowWidth() {
    return Math.max(
      (this._maxPrice - this._minPrice) / this._rowSize,
      this._minTick
    );
  }
}

class TimeVolumeProfile extends VolumeProfileBase {
  constructor(rowSize) {
    super(rowSize, 1);
  }

  calculate() {
    this.setStartPrice(0);
    const rowWidth = this.getRowWidth();
    let indexLowVbP = Math.floor(this._low / rowWidth);
    const indexHighVbP = Math.ceil(this._high / rowWidth) - 1;
    indexLowVbP = Math.min(indexLowVbP, indexHighVbP);
    this.setIndexLowVbP(indexLowVbP);
    this.setIndexHighVbP(indexHighVbP);
  }

  getRowWidth() {
    return this._minTick * this._rowSize;
  }
}

function maxHHistItems() {
  return 6000;
}

function numOfSubHists(type) {
  switch (type) {
    case "Delta":
    case "Up/Down":
      return 2;
    case "Total":
      return 1;
    default:
      Std.error(`Invalid study argument value: ${type}`);
  }
}

class VolumeProfile {
  findBasicResolutionForFromTo(e, t, i, n) {
    const volumeProfileResolution = getVolumeProfileResolutionForPeriod(
      e.value(),
      t,
      i,
      n
    );
    const interval = Interval.parse(volumeProfileResolution);
    if (enabled("charting_library_debug_mode")) {
      console.log(
        `Selected resolution ${interval.value()} for (${e.value()}, ${t}, ${i})`
      );
    }
    return interval;
  }

  verifyRowSizeInput(rowSize, inputType) {
    if (inputType === "Number Of Rows" && rowSize > maxHHistItems()) {
      Std.error('Histogram is too large, please reduce "Row Size" input.');
    }
  }

  getRowsLayout(layoutType, rowSize) {
    return layoutType === "Number Of Rows"
      ? new BasicVolumeProfile(rowSize)
      : new TimeVolumeProfile(rowSize);
  }
}

export {
  VolumeProfile as default,
  VolumeProfileBase,
  maxHHistItems,
  numOfSubHists,
};
