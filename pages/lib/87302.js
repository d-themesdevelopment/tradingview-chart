  import {Std} from "./74649.js";

  class SpreadRatioBase {
      init(e, t) {
          e.new_sym(t(1), Std.period(e)), this._source = t(0), this._scaleFactor1 = 1, this._scaleFactor2 = 1
      }
      main(e, t) {
          const i = e.symbol.time,
              r = Std[this._source](e);
          e.select_sym(1);
          const n = Std[this._source](e),
              o = e.new_unlimited_var(n),
              a = e.new_unlimited_var(e.symbol.time);
          if (e.select_sym(0), isNaN(i)) return null;
          let l = a.indexOf(i); - 1 !== l && a.get(l) !== i && (l = -1);
          const c = l < 0 ? NaN : o.get(l);
          return [this._doCalculation(this._scaleFactor1, r, this._scaleFactor2, c)]
      }
  }
  const spreadRatioDefaults = {
          styles: {
              plot1: {
                  linestyle: 0,
                  linewidth: 2,
                  plottype: 0,
                  trackPrice: !1,
                  transparency: 35,
                  color: "#800080",
                  display: 15
              }
          },
          precision: 2,
          inputs: {
              source: "close",
              symbol2: ""
          }
      },
      spreadRatioInputs = [{
          defval: "close",
          id: "source",
          name: "Source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
          type: "text"
      }, {
          id: "symbol2",
          name: "Symbol",
          type: "symbol",
          confirm: !0
      }],
      spreadRatioPlots = [{
          id: "plot1",
          type: "line"
      }],
      spreadRatioStyles = {
          plot1: {
              title: "Plot",
              histogramBase: 0
          }
      }
