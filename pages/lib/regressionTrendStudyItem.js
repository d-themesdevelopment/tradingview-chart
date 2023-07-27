export const regressionTrendStudyItem = {
    name: "Regression Trend",
    metainfo: {
      _metainfoVersion: 51,
      description: "Regression Trend",
      format: {
        type: "inherit"
      },
      id: "RegressionTrend@tv-basicstudies-144",
      is_hidden_study: true,
      is_price_study: true,
      shortDescription: "Reg Trend",
      defaults: {
        inputs: {
          "first bar time": 0,
          "last bar time": 0,
          "lower diviation": -2,
          source: "close",
          "upper diviation": 2,
          "use lower diviation": true,
          "use upper diviation": true
        },
        styles: {}
      },
      inputs: [
        {
          defval: 2,
          id: "upper diviation",
          max: 500,
          min: -500,
          name: "Upper Deviation",
          type: "float"
        },
        {
          defval: -2,
          id: "lower diviation",
          max: 500,
          min: -500,
          name: "Lower Deviation",
          type: "float"
        },
        {
          defval: true,
          id: "use upper diviation",
          name: "Use Upper Deviation",
          type: "bool"
        },
        {
          defval: true,
          id: "use lower diviation",
          name: "Use Lower Deviation",
          type: "bool"
        },
        {
          defval: 0,
          id: "first bar time",
          isHidden: true,
          max: 253370764800,
          min: -253370764800,
          name: "First bar time",
          type: "time"
        },
        {
          defval: 0,
          id: "last bar time",
          isHidden: true,
          max: 253370764800,
          min: -253370764800,
          name: "Last bar time",
          type: "time"
        },
        {
          defval: "close",
          id: "source",
          name: "Source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
          type: "source"
        }
      ],
      plots: []
    },
    constructor: class {
      constructor() {
        this._resultSent = false;
      }
      init(e, t) {
        this._resultSent = false;
        this._data = {
          baseLine: {
            startPrice: NaN,
            endPrice: NaN
          },
          upLine: {
            startPrice: NaN,
            endPrice: NaN
          },
          downLine: {
            startPrice: NaN,
            endPrice: NaN
          },
          pearsons: NaN,
          startIndex__t: NaN,
          endIndex__t: NaN
        };
      }
      main(e, t) {
        const i = t(6);
        const n = e.new_unlimited_var(s.Std.time(e));
        const o = e.new_unlimited_var(s.Std.high(e));
        const a = e.new_unlimited_var(s.Std.low(e));
        const l = e.new_unlimited_var(s.Std[i](e));
        
        if (!e.symbol.isLastBar) {
          return null;
        }
        
        if (this._resultSent) {
          return null;
        }
        
        const c = t(0);
        const h = t(1);
        const d = t(2);
        const u = t(3);
        const p = t(4);
        const _ = t(5);
        const m = n.indexOf(p);
        const g = n.indexOf(_);
        
        const f = [];
        const v = [];
        const S = [];
        const y = [];
        
        for (let e = m; e >= g; --e) {
          f.push(n.get(e));
          v.push(o.get(e));
          S.push(a.get(e));
          y.push(l.get(e));
        }
        
        this._updateData(f, d, c, u, h, p, _, r(y, v, S));
        this._resultSent = true;
        
        return {
          type: "non_series_data",
          nonseries: true,
          data: {
            data: this._data
          }
        };
      }
      _updateData(e, t, i, s, r, n, o, a) {
        const l = e.length - 1;
        this._data.baseLine.startPrice = a.intercept;
        this._data.baseLine.endPrice = a.intercept + a.slope * l;
        
        const c = a.intercept + (t ? a.stdDev * i : a.upDev);
        this._data.upLine.startPrice = c;
        this._data.upLine.endPrice = c + a.slope * l;
        
        const h = a.intercept + (s ? a.stdDev * r : -a.downDev);
        this._data.downLine.startPrice = h;
        this._data.downLine.endPrice = h + a.slope * l;
        
        this._data.pearsons = a.pearsons;
        this._data.startIndex__t = n;
        this._data.endIndex__t = o;
      }
    }
  };
  