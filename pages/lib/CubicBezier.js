
class CubicBezier {
    constructor(x1, y1, x2, y2) {
      this._mX1 = x1;
      this._mY1 = y1;
      this._mX2 = x2;
      this._mY2 = y2;
    }
  
    easingFunc(e) {
      if (this._mX1 === this._mY1 && this._mX2 === this._mY2) {
        return e;
      } else {
        return this._calcBezier(this._getTForX(e));
      }
    }
  
    _a(e, t) {
      return 1 - 3 * t + 3 * e;
    }
  
    _b(e, t) {
      return 3 * t - 6 * e;
    }
  
    _c(e) {
      return 3 * e;
    }
  
    _calcBezier(e) {
      return (
        (this._a(this._mY1, this._mY2) * e + this._b(this._mY1, this._mY2)) * e +
        this._c(this._mY1)
      );
    }
  
    _getSlope(e) {
      return (
        3 * this._a(this._mX1, this._mX2) * e * e +
        2 * this._b(this._mX1, this._mX2) * e +
        this._c(this._mX1)
      );
    }
  
    _getTForX(e) {
      let t = e;
      for (let i = 0; i < 4; ++i) {
        const slope = this._getSlope(t);
        if (slope === 0) {
          return t;
        }
        t -= (this._calcBezier(t) - e) / slope;
      }
      return t;
    }
  }
  
  const dur = 350;
  
  const easingFunc = {
    linear: (e) => e,
    easeInQuad: (e) => e * e,
    easeOutQuad: (e) => e * (2 - e),
    easeInOutQuad: (e) =>
      e < 0.5 ? 2 * e * e : (4 - 2 * e) * e - 1,
    easeInCubic: (e) => e * e * e,
    easeOutCubic: (e) => --e * e * e + 1,
    easeInOutCubic: (e) =>
      e < 0.5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1,
    easeInQuart: (e) => e * e * e * e,
    easeOutQuart: (e) => 1 - --e * e * e * e,
    easeInOutQuart: (e) =>
      e < 0.5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e,
    easeInQuint: (e) => e * e * e * e * e,
    easeOutQuint: (e) => 1 + --e * e * e * e * e,
    easeInOutQuint: (e) =>
      e < 0.5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e,
  };
