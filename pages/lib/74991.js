"use strict";

// Exported easing functions with more descriptive names
export const dur = 350;
export const easingFunc = {
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : (4 - 2 * t) * t - 1,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t) => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
};

// CubicBezier class definition with more readable methods and constructor
class CubicBezier {
  constructor(x1, y1, x2, y2) {
    this._mX1 = x1;
    this._mY1 = y1;
    this._mX2 = x2;
    this._mY2 = y2;
  }

  // Calculate the easing value based on the provided time fraction
  easingFunc(timeFraction) {
    return (this._mX1 === this._mY1 && this._mX2 === this._mY2)
      ? timeFraction
      : this._calcBezier(this._getTForX(timeFraction));
  }

  // Helper methods to calculate cubic bezier values
  _a(x1, x2) {
    return 1 - 3 * x2 + 3 * x1;
  }

  _b(x1, x2) {
    return 3 * x2 - 6 * x1;
  }

  _c(x) {
    return 3 * x;
  }

  _calcBezier(timeFraction) {
    return ((this._a(this._mY1, this._mY2) * timeFraction + this._b(this._mY1, this._mY2)) * timeFraction + this._c(this._mY1)) * timeFraction;
  }

  _getSlope(timeFraction) {
    return 3 * this._a(this._mX1, this._mX2) * timeFraction * timeFraction + 2 * this._b(this._mX1, this._mX2) * timeFraction + this._c(this._mX1);
  }

  _getTForX(timeFraction) {
    let t = timeFraction;
    for (let i = 0; i < 4; ++i) {
      const slope = this._getSlope(t);
      if (slope === 0) return t;
      t -= (this._calcBezier(t) - timeFraction) / slope;
    }
    return t;
  }
}

// Export the CubicBezier class
export { CubicBezier };
