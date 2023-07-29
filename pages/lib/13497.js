"use strict";
var s;
function(e) {
  e[e.FromLeft = -1] = "FromLeft", e[e.FromRight = 1] = "FromRight"
}(s || (s = {}));
import {ensureDefined, ensureNotNull} from "./assertions.js";

class SeriesData {
  constructor() {
    this._pressedChunks = {
      chunks: new Map(),
      priceSource: "uninitialized",
    };
    this.m_bars = new t.PlotList(c(), d);
    this.m_nsBars = new t.PlotList(c(), d);
    this._clearPressedChunks();
  }

  bars() {
    return this.m_bars;
  }

  nsBars() {
    return this.m_nsBars;
  }

  pressedChunks(e, t) {
    if (t !== this._pressedChunks.priceSource) {
      this._pressedChunks.priceSource = t;
      const i = this.m_bars.first();
      if (i) {
        this._clearPressedChunks();
        this._rebuildPressedChunks(i);
      }
    }
    const n = ensureDefined(
      u.find((t) => t.forBarspacingLargerThen <= e)
    );
    return ensureDefined(this._pressedChunks.chunks.get(n.barsToMerge));
  }

  mergeRegularBars(e) {
    const t = this.m_bars.size();
    const i = this.m_bars.merge(e);
    if (i && "uninitialized" !== this._pressedChunks.priceSource) {
      if (t === this.m_bars.size() && i.index === this.m_bars.lastIndex()) {
        this._updateLatestChunks();
      } else {
        this._rebuildPressedChunks(i);
      }
    }
    return i;
  }

  size() {
    return this.m_bars.size() + this.m_nsBars.size();
  }

  each(e) {
    this.m_bars.each(e);
    this.m_nsBars.each(e);
  }

  clear() {
    this.m_bars.clear();
    this.m_nsBars.clear();
    this.lastProjectionPrice = undefined;
    this._clearPressedChunks();
  }

  isEmpty() {
    return this.m_bars.isEmpty() && this.m_nsBars.isEmpty();
  }

  first() {
    return this.m_bars.isEmpty() ? this.m_nsBars.first() : this.m_bars.first();
  }

  last() {
    return this.m_nsBars.isEmpty() ? this.m_bars.last() : this.m_nsBars.last();
  }

  search(e, t) {
    if (this.nsBars().isEmpty()) {
      return this.bars().search(e, t);
    } else if (
      this.bars().isEmpty() ||
      ensureNotNull(this.nsBars().firstIndex()) <= e
    ) {
      return this.nsBars().search(e, t);
    } else {
      return this.bars().search(e, t);
    }
  }

  valueAt(e) {
    const t = this.search(e);
    return t !== null ? t.value : null;
  }

  plotValueToTimePointIndex(e, t, i) {
    if (i === s.FromRight) {
      const i = (i, s) => {
        const r = s[t];
        return r !== null && e >= r;
      };
      const s = this.m_bars.findLast(i);
      if (s !== null) {
        return s.index;
      }
      const r = this.m_nsBars.findLast(i);
      return r !== null ? r.index : this.m_bars.firstIndex();
    }
    if (i === s.FromLeft) {
      const i = (i, s) => {
        const r = s[t];
        return r !== null && e <= r;
      };
      const s = this.m_bars.findFirst(i);
      if (s !== null) {
        return s.index;
      }
      const r = this.m_nsBars.findFirst(i);
      return r !== null ? r.index : this.m_bars.lastIndex();
    }
    throw new Error("plotValueToTimePointIndex: unsupported search mode");
  }

  moveData(e) {
    this.m_bars.move(e);
    this.m_nsBars.move(e);
    if (this.m_bars.size() > 0) {
      this._rebuildPressedChunks(ensureNotNull(this.m_bars.first()));
    }
  }

  _rebuildPressedChunks(e) {
    const t = this._pressedChunks.priceSource;
    if (t === "uninitialized") {
      return;
    }
    const i = e.index;
    const n = a[t];
    const o = (e, t, i) => {
      let r = null;
      for (; e.hasNext(); ) {
        const n = e.next();
        const o = n.value[t];
        if (r && n.index - r.startTime >= i.barsToMerge) {
          t.push(r);
          r = null;
        }
        if (r) {
          r.endTime = n.index;
          r.high = Math.max(r.high, o);
          r.low = Math.min(r.low, o);
          r.close = o;
        } else {
          r = {
            startTime: n.index,
            endTime: n.index,
            open: o,
            high: o,
            low: o,
            close: o,
          };
        }
      }
      if (r) {
        t.push(r);
      }
    };
    u.forEach((e) => {
      const t = ensureDefined(
        this._pressedChunks.chunks.get(e.barsToMerge)
      );
      const a = (0, o.lowerbound)(t, i, (e, t) => e.endTime < t);
      if (a === 0 && t.length > 0) {
        const i = t[0].startTime - 1;
        const a = ensureNotNull(this.m_bars.firstIndex());
        const l = this.m_bars.rangeIterator(a, i);
        const c = [];
        o(l, c, e);
        const h = c.concat(t);
        this._pressedChunks.chunks.set(e.barsToMerge, h);
      } else {
        t.splice(a);
        let o = ensureNotNull(this.m_bars.firstIndex());
        if (t.length) {
          o = t[t.length - 1].endTime + 1;
        }
        const l = this.m_bars.rangeIterator(o, i);
        o(l, t, e);
      }
    });
  }

  _updateLatestChunks() {
    const e = ensureNotNull(this.m_bars.lastIndex());
    u.forEach((t) => {
      const i = ensureDefined(
        this._pressedChunks.chunks.get(t.barsToMerge)
      );
      const s = this.m_bars.rangeIterator(e, e).next();
      const n = s.value[4];
      const o = i[i.length - 1];
      o.high = Math.max(o.high, n);
      o.low = Math.min(o.low, n);
      o.close = n;
      o.endTime = s.index;
    });
  }

  _clearPressedChunks() {
    u.forEach((e) => this._pressedChunks.chunks.set(e.barsToMerge, []));
  }
};

const a = {
  open: (e) => e[1],
  high: (e) => e[2],
  low: (e) => e[3],
  close: (e) => e[4],
  hl2: (e) => (e[2] + e[3]) / 2,
  hlc3: (e) => (e[2] + e[3] + e[4]) / 3,
  ohlc4: (e) => (e[1] + e[2] + e[3] + e[4]) / 4,
};

const l = ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"];

function c() {
  const e = new Map();
  l.forEach((t, i) => {
    e.set(t, h(t));
  });
  return e;
}

function h(e, t, i) {
  const s = a[t != null ? t : e];
  const r = a[e];
  const n = a[i != null ? i : e];
  return (e, t) => {
    switch (t) {
      case 0:
        return s(e);
      case 2:
        return n(e);
      default:
        return r(e);
    }
  };
}

function d(e, t) {
  return e[t] == null;
}

const u = [
  { barsToMerge: 10, forBarspacingLargerThen: 0.03 },
  { barsToMerge: 30, forBarspacingLargerThen: 0.01 },
  { barsToMerge: 100, forBarspacingLargerThen: 0.003 },
  { barsToMerge: 500, forBarspacingLargerThen: 0 },
];

export {
  SeriesData,
  // barFunction: h,
  // seriesPlotFunctionMap: c,
};
