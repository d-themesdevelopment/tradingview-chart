import {Std} from "./74649.js";
import {Interval, ResolutionKind} from "./36274.js";
import {findSuitableResolutionToBuildFrom} from "./findSuitableResolutionToBuildFrom.js"

class PriceData  {
  constructor() {
      this.p = NaN, this.r1 = NaN, this.s1 = NaN, this.r2 = NaN, this.s2 = NaN, this.r3 = NaN, this.s3 = NaN, this.r4 = NaN, this.s4 = NaN, this.r5 = NaN, this.s5 = NaN, this.startIndex__t = NaN, this.endIndex__t = NaN
  }
}
class Pivots  {
  constructor() {
      this.pivots = []
  }
}

function addMonthsToDate(e, t) {
  e.setUTCMonth(e.getUTCMonth() + t)
}

function calculateNextBarTimestamp(e, t) {
  if (Std.ismonthly(e)) {
      let i = new Date(t);
      return i.getUTCDay() < function(e, t) {
          return new Date(t, e, 0).getDate()
      }(i.getUTCMonth(), i.getUTCFullYear()) ? (addMonthsToDate(i, Std.interval(e)), i = Std.add_days_considering_dst("Etc/UTC", i, 1 - i.getUTCDay())) : (i = Std.add_days_considering_dst("Etc/UTC", i, 1), addMonthsToDate(i, Std.interval(e))), i.valueOf()
  }
  return t + r.Interval.parse(e.symbol.resolution).inMilliseconds(t)
}

function determinePivTimeFrame(e, t) {
  switch (t) {
      case "Auto":
          return function(e) {
              const t = r.Interval.parse(e.symbol.interval + e.symbol.resolution);
              switch (t.kind()) {
                  case r.ResolutionKind.Weeks:
                  case r.ResolutionKind.Months:
                      return "12M";
                  case r.ResolutionKind.Days:
                      return "1M";
                  case r.ResolutionKind.Minutes:
                      return t.multiplier() >= 1 && t.multiplier() <= 15 ? "1D" : "1W";
                  case r.ResolutionKind.Seconds:
                  case r.ResolutionKind.Ticks:
                      return "1D"
              }
              throw new Error("Unexpected resolution type: " + e.symbol.resolution)
          }(e);
      case "Daily":
          return "1D";
      case "Weekly":
          return "1W";
      case "Monthly":
          return "1M";
      case "Yearly":
          return "12M";
      default:
          throw new Error("No such pivTimeFrame: " + t)
  }
}
const pivotPointsStandardStudyItem = {
  name: "Pivot Points Standard",
  metainfo: {
      _metainfoVersion: 44,
      defaults: {
          inputs: {
              kind: "Traditional",
              lookBack: 15,
              pivTimeFrame: "Auto",
              showHistoricalPivots: !0
          },
          precision: "4"
      },
      description: "Pivot Points Standard",
      id: "PivotPointsStandard@tv-basicstudies-80",
      inputs: [{
          defval: "Traditional",
          id: "kind",
          name: "Type",
          options: ["Traditional", "Fibonacci", "Woodie", "Classic", "DeMark", "Camarilla"],
          type: "text"
      }, {
          defval: !0,
          id: "showHistoricalPivots",
          name: "Show historical pivots",
          type: "bool"
      }, {
          defval: "Auto",
          id: "pivTimeFrame",
          name: "Pivots Timeframe",
          options: ["Auto", "Daily", "Weekly", "Monthly", "Yearly"],
          type: "text"
      }, {
          defval: 15,
          id: "lookBack",
          max: 5e3,
          min: 1,
          name: "Number of Pivots Back",
          type: "integer"
      }],
      is_price_study: !0,
      linkedToSeries: !0,
      shortDescription: "Pivots",
      format: {
          type: "price",
          precision: 4
      }
  },
  constructor: class {
      constructor() {
          this._secondaryRes = "1D", this._firstMainSeriesBarTime = NaN
      }
      init(e, t) {
          const i = t(0),
              r = t(1),
              o = t(2),
              l = t(3);
          this._data = new Pivots , this._firstMainSeriesBarTime = NaN, this._kindPP = function(e) {
              switch (e) {
                  case "Traditional":
                      return 0;
                  case "Fibonacci":
                      return 1;
                  case "Woodie":
                      return 2;
                  case "Classic":
                      return 3;
                  case "DeMark":
                      return 4;
                  case "Camarilla":
                      return 5;
                  default:
                      throw new Error("Unknown kind " + e)
              }
          }(i), this._showHistoricalPivots = r, this._historicalPivotsToKeep = l, this._pivTimeFrame = o, this._isValidResolution = function(e, t) {
              return !(Std.isdaily(e) && "Daily" === t || Std.isweekly(e) && ("Daily" === t || "Weekly" === t) || Std.ismonthly(e) && ("Daily" === t || "Weekly" === t || "Monthly" === t))
          }(e, this._pivTimeFrame), this._isValidResolution || Std.error("You cannot see this pivot timeframe on this resolution"), this._isValidResolution && (this._secondaryRes = determinePivTimeFrame(e, this._pivTimeFrame), void 0 !== e.symbol.info && findSuitableResolutionToBuildFrom(this._secondaryRes, e.symbol.info).error && (this._isValidResolution = !1, Std.error(`Resolution ${this._secondaryRes} is not supported for this symbol`))), e.new_sym(e.symbol.tickerid, this._secondaryRes)
      }
      main(e, t, i) {
          if (!this._isValidResolution) return null;
          if (e.is_main_symbol(i)) return isNaN(this._firstMainSeriesBarTime) && (this._firstMainSeriesBarTime = e.symbol.time, this._removeUnusedPivots()), e.symbol.isLastBar && e.symbol.isNewBar ? this._createResponse() : null;
          e.select_sym(1);
          const r = e.new_var(Std.open(e)),
              n = e.new_var(Std.high(e)),
              a = e.new_var(Std.low(e)),
              l = e.new_var(Std.close(e)),
              h = e.new_var(Std.time(e)),
              d = this._data,
              u = r.get(0),
              p = h.get(0),
              _ = r.get(1),
              m = n.get(1),
              g = a.get(1),
              f = l.get(1),
              v = e.symbol.isLastBar;
          if (0 !== d.pivots.length && e.symbol.isNewBar) {
              const e = d.pivots[d.pivots.length - 1];
              e.endIndex__t !== p && (e.endIndex__t = p)
          }
          if (0 === e.symbol.index || !e.symbol.isNewBar) return e.select_sym(0), null;
          const S = function(e, t, i, r, n, a, l, c) {
              const h = new PriceData ;
              let d = NaN;
              const u = i - r;
              switch (c) {
                  case 0:
                      d = (i + r + n) / 3, h.p = d, h.r1 = 2 * d - r, h.s1 = 2 * d - i, h.r2 = d + (i - r), h.s2 = d - (i - r), h.r3 = 2 * d + (i - 2 * r), h.s3 = 2 * d - (2 * i - r), h.r4 = 3 * d + (i - 3 * r), h.s4 = 3 * d - (3 * i - r), h.r5 = 4 * d + (i - 4 * r), h.s5 = 4 * d - (4 * i - r);
                      break;
                  case 1:
                      d = (i + r + n) / 3, h.p = d, h.r1 = d + .382 * u, h.s1 = d - .382 * u, h.r2 = d + .618 * u, h.s2 = d - .618 * u, h.r3 = d + u, h.s3 = d - u;
                      break;
                  case 2:
                      d = (i + r + 2 * e) / 4, h.p = d, h.r1 = 2 * d - r, h.s1 = 2 * d - i, h.r2 = d + u, h.s2 = d - u, h.r3 = i + 2 * (d - r), h.s3 = r - 2 * (i - d), h.r4 = h.r3 + u, h.s4 = h.s3 - u;
                      break;
                  case 3:
                      d = (i + r + n) / 3, h.p = d, h.r1 = 2 * d - r, h.s1 = 2 * d - i, h.r2 = d + u, h.s2 = d - u, h.r3 = d + 2 * u, h.s3 = d - 2 * u, h.r4 = d + 3 * u, h.s4 = d - 3 * u;
                      break;
                  case 4:
                      let o = NaN;
                      o = Std.equal(t, n) ? i + r + 2 * n : Std.greater(n, t) ? 2 * i + r + n : 2 * r + i + n, d = o / 4, h.p = d, h.r1 = o / 2 - r, h.s1 = o / 2 - i;
                      break;
                  case 5:
                      d = (i + r + n) / 3, h.p = d, h.r1 = n + 1.1 * u / 12, h.s1 = n - 1.1 * u / 12, h.r2 = n + 1.1 * u / 6, h.s2 = n - 1.1 * u / 6, h.r3 = n + 1.1 * u / 4, h.s3 = n - 1.1 * u / 4, h.r4 = n + 1.1 * u / 2, h.s4 = n - 1.1 * u / 2;
                      break;
                  default:
                      throw new Error("Unknown kind")
              }
              return h.startIndex__t = a, h.endIndex__t = l, h
          }(u, _, m, g, f, p, calculateNextBarTimestamp(e, p), this._kindPP);
          return e.select_sym(0), this._showHistoricalPivots || (d.pivots = []), d.pivots.push(S), d.pivots.length > this._historicalPivotsToKeep && d.pivots.shift(), v ? this._createResponse() : null
      }
      _createResponse() {
          return 0 === this._data.pivots.length ? null : {
              nonseries: !0,
              type: "non_series_data",
              data: {
                  data: this._data
              }
          }
      }
      _removeUnusedPivots() {
          const e = Math.max(this._data.pivots.findIndex((e => e.startIndex__t > this._firstMainSeriesBarTime)) - 1, 0);
          e > 0 && this._data.pivots.splice(0, e)
      }
  }
}