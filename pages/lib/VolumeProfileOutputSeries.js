


import { assert as _assert } from '50151';
import { upperbound as _upperbound } from '78071';

class VolumeProfileOutputSeries {
  constructor() {
    this._histPos = -1;
    this._hist = new Float64Array(2000);
    this._times = new Float64Array(2000);
  }

  addHist(time) {
    if (this._histPos >= 0) {
      const lastTime = this._times[this._histPos];
      _assert(lastTime <= time, "History order violation");
      this._histPos += lastTime === time ? 0 : 1;
    } else {
      this._histPos += 1;
    }

    if (this._histPos === this._hist.length) {
      const newHist = new Float64Array(2 * this._hist.length);
      newHist.set(this._hist);
      this._hist = newHist;

      const newTimes = new Float64Array(this._hist.length);
      newTimes.set(this._times);
      this._times = newTimes;
    }

    this._hist[this._histPos] = NaN;
    this._times[this._histPos] = time;
  }

  removeLastIfNaN() {
    if (Number.isNaN(this.get(0))) {
      this._histPos -= 1;
    }
  }

  get(index) {
    _assert(index === 0);
    const pos = this._histPos - index;
    return this._hist[pos];
  }

  getLeftOrEqual(time) {
    const pos = _upperbound(this._times, time, (a, b) => a < b, 0, this._histPos + 1);
    return pos === 0 ? NaN : this._hist[pos - 1];
  }

  set(value) {
    this._hist[this._histPos] = value;
  }

  indexOf(value) {
    throw new Error("Not implemented");
  }
}

export { VolumeProfileOutputSeries };
