
import { HitTestResult, HitTarget } from 'path/to/HitTestResult';

class PaneRendererSeriesBase {
  constructor() {
    this._bars = [];
  }

  hitTest(e) {
    const t = this._bars;
    const i = this._getBarSpacing();
    const s = i / 2;
    if (t.length === 0) {
      return null;
    }
    const r = this._getTolerance();
    const n = t[0];
    const o = t[t.length - 1];
    if (e.x < n.time - s - r || e.x > o.time + s + r) {
      return null;
    }
    let a = 0;
    let l = t.length - 1;
    let c = -1;
    while (a <= l) {
      const i = Math.floor((a + l) / 2);
      const h = t[i];
      let d = s;
      if (h !== n && h !== o) {
        d += r;
      }
      if (Math.abs(h.time - e.x) <= d) {
        c = i;
        break;
      }
      if (e.x - h.time > s) {
        a = i + 1;
      } else {
        l = i - 1;
      }
    }
    if (c !== -1) {
      const n = Math.ceil(r / i);
      if (n !== 0) {
        const i = Math.max(0, c - n);
        const o = Math.min(t.length - 1, c + n);
        for (let n = i; n <= o; n++) {
          if (
            Math.abs(e.x - t[n].time) <= s + r &&
            this._isPointAtBar(t[n], e.y, r)
          ) {
            return this._getHitTest();
          }
        }
      } else if (this._isPointAtBar(t[c], e.y, r)) {
        return this._getHitTest();
      }
    }
    return null;
  }

  _getHitTest() {
    return new HitTestResult(HitTarget.Regular);
  }

  _isPointAtBar(e, t, i) {
    const s = Math.min(e.high, e.low);
    const r = Math.max(e.high, e.low);
    return s - i <= t && t <= r + i;
  }
}
