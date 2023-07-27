
"use strict";

const utils = (e, t, i) => {
  i.d(t, {
    getChartWidgetApiTimeConverter: () => TimeConverter,
  });

  const { createDwmAligner } = i(77475);
  const { ensureNotNull } = i(50151);

  class TimeConverter {
    constructor(e, t) {
      this._dwmAligner = e;
      this._chartModel = t;
    }

    convertPublicTimeToInternalTime(e) {
      return this._dwmAligner ? this._dwmAligner.timeToSessionStart(1000 * e) / 1000 : e;
    }

    convertInternalTimeToPublicTime(e) {
      return this._dwmAligner ? this._dwmAligner.timeToExchangeTradingDay(1000 * e) / 1000 : e;
    }

    convertTimePointIndexToPublicTime(e) {
      let t = this.convertTimePointIndexToInternalTime(e);
      return t !== null && (t = this.convertInternalTimeToPublicTime(t)), t;
    }

    convertTimePointIndexToInternalTime(e) {
      const t = this._chartModel.timeScale();
      if (t.isEmpty()) return null;
      const i = t.points();
      const { firstIndex: r, lastIndex: n } = ensureNotNull(i.range().value());
      let o = null;
      if (r <= e && e <= n) {
        o = i.valueAt(e);
      } else if (e > n) {
        const i = this._chartModel.mainSeries().syncModel();
        if (i !== null) {
          const r = ensureNotNull(t.indexToTimePoint(n));
          o = i.projectTime(r, e - n);
        }
      }
      return o;
    }
  }

  return {
    TimeConverter,
  };
};