import { isNumber } from "lodash";
import { getLogger } from "59224";

const logger = getLogger("Chart.PriceRange");

class PriceRange {
  constructor(minValue, maxValue) {
    if (minValue !== null && typeof minValue === "object") {
      const { m_minValue, m_maxValue } = minValue;
      this._minValue = m_minValue;
      this._maxValue = m_maxValue;
    } else {
      this._minValue = minValue;
      if (typeof maxValue !== "undefined") {
        this._maxValue = maxValue;
      }
    }
  }

  equals(other) {
    return (
      this._minValue === other._minValue && this._maxValue === other._maxValue
    );
  }

  clone() {
    return new PriceRange(this._minValue, this._maxValue);
  }

  minValue() {
    return this._minValue;
  }

  setMinValue(value) {
    this._minValue = value;
  }

  maxValue() {
    return this._maxValue;
  }

  setMaxValue(value) {
    this._maxValue = value;
  }

  length() {
    return this._maxValue - this._minValue;
  }

  isEmpty() {
    return (
      this._maxValue === this._minValue ||
      this._maxValue !== this._maxValue ||
      this._minValue !== this._minValue
    );
  }

  serialize() {
    return {
      m_maxValue: this._maxValue,
      m_minValue: this._minValue,
    };
  }

  state() {
    return {
      max: this._maxValue,
      min: this._minValue,
    };
  }

  merge(other) {
    return new PriceRange(
      Math.min(this.minValue(), other.minValue()),
      Math.max(this.maxValue(), other.maxValue())
    );
  }

  apply(min, max) {
    this._minValue = Math.min(this._minValue, min);
    this._maxValue = Math.max(this._maxValue, max);
  }

  set(min, max) {
    this._minValue = min;
    this._maxValue = max;
  }

  scaleAroundCenter(coeff) {
    if (!isNumber(coeff)) {
      return logger.logDebug("PriceRange.scaleAroundCenter: invalid coeff");
    }
    if (this._maxValue - this._minValue === 0) {
      return;
    }
    const center = 0.5 * (this._maxValue + this._minValue);
    let upperDiff = this._maxValue - center;
    let lowerDiff = this._minValue - center;
    upperDiff *= coeff;
    lowerDiff *= coeff;
    this._maxValue = center + upperDiff;
    this._minValue = center + lowerDiff;
  }

  shift(coeff) {
    if (!isNumber(coeff)) {
      return logger.logDebug("PriceRange.shift: invalid coeff");
    }
    this._maxValue += coeff;
    this._minValue += coeff;
  }

  containsStrictly(other) {
    return (
      other.minValue() > this._minValue && other.maxValue() < this._maxValue
    );
  }

  static compare(a, b) {
    if (a === null || b === null) {
      return a === b;
    }
    return a.equals(b);
  }
}

export { PriceRange };
