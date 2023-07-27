const { assert } = require("./assertions");

class BarsRange {
  constructor(firstBar, lastBar) {
    assert(
      firstBar <= lastBar,
      "The last bar in the bars range should be greater than or equal to the first bar"
    );
    this._firstBar = firstBar;
    this._lastBar = lastBar;
  }

  firstBar() {
    return this._firstBar;
  }

  lastBar() {
    return this._lastBar;
  }

  count() {
    return this._lastBar - this._firstBar + 1;
  }

  contains(bar) {
    return this._firstBar <= bar && bar <= this._lastBar;
  }

  equals(range) {
    return (
      this._firstBar === range.firstBar() && this._lastBar === range.lastBar()
    );
  }

  static compare(range1, range2) {
    if (range1 === null || range2 === null) {
      return range1 === range2;
    }
    return range1.equals(range2);
  }
}

export { BarsRange };
