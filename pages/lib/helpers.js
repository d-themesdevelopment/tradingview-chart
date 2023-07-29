export function cal_to_utc(e, t) {
  var i = t.getTime();
  return i - e.offset_loc(i);
}

export function get_timezone(e) {
  return new o(e);
}

export function utc_to_cal_ts(e, t) {
  return t + e.offset_utc(t);
}

export function declareClassAsPureInterface(e, t) {
  for (var n in e.prototype)
    "function" == typeof e.prototype[n] &&
      e.prototype.hasOwnProperty(n) &&
      (e.prototype[n] = function () {
        throw new Error(
          t +
            "::" +
            n +
            " is an interface member declaration and must be overloaded in order to be called"
        );
      });
}
// export function getLogger(e, t = {}) {
//   const i = [];
//   c.push(i);
//   const s = Object.assign(t, {
//     id: e,
//   });

//   function r(e) {
//     return (t) => w(e, String(t), i, s);
//   }

//   return {
//     logDebug: r(n.DEBUG),
//     logError: r(n.ERROR),
//     logInfo: r(n.INFO),
//     logNormal: r(n.NORMAL),
//     logWarn: r(n.WARNING),
//   };
// }

export function enabled(e) {
  const t = o.get(e);
  if (void 0 !== t) return t;
  const n = d.get(e);
  return !!n && n.some(a);
}

export function rotationMatrix(e) {
  var t = Math.cos(e),
    n = Math.sin(e);
  return [
    [t, -n, 0],
    [n, t, 0],
    [0, 0, 1],
  ];
}

export function transformPoint(e, t) {
  for (var n = [t.x, t.y, 1], u = [0, 0, 0], o = 0; o < 3; o++)
    for (var d = 0; d < 3; d++) u[o] += n[d] * e[o][d];
  return new r.Point(u[0], u[1]);
}

export function symbolCurrency(e, t, i) {
  if (null === e) return null;
  const s = !t || i ? e.currency_id : e.currency_code;
  return void 0 === s || "" === s ? null : s;
}

export function symbolUnit(e, t) {
  if (null === e || !t) return null;
  const i = e.unit_id;
  return void 0 === i || "" === i ? null : i;
}

export function createSeriesFormatter(e, t, i = !1) {
  if ("default" === t && null != e) {
    const t = e.formatter || e.format;
    if ("volume" === t) return new h.VolumeFormatter(2);
    if ("percent" === t) return new d.PercentageFormatter(e.pricescale);
  }
  const {
    priceScale: s,
    minMove: r,
    fractional: n,
    minMove2: o,
    variableMinTick: l,
  } = z(e, t, i);
  return new a.PriceFormatter(s, r, n, o, l, i);
}

export class PriceFormatter {
  constructor(e, t, o, l, c, h) {
    if (
      ((this.type = "price"),
      (this._formatterErrors = {
        custom: s.t(null, void 0, i(32061)),
        fraction: s.t(null, void 0, i(42015)),
        secondFraction: s.t(null, void 0, i(43247)),
      }),
      (t && !h) || (t = 1),
      ((0, n.isNumber)(e) && (0, n.isInteger)(e)) || (e = 100),
      e < 0)
    )
      throw new TypeError("invalid base");
    (this._priceScale = e),
      (this._minMove = t),
      (this._minMove2 = l),
      (this._variableMinTick = c),
      (this._variableMinTickData =
        o || void 0 === c
          ? void 0
          : (function (e, t) {
              var i, s, o, a, l;
              const c = t.split(" ").map(Number);
              if ((0, n.isEven)(c.length) || c.some(Number.isNaN))
                return [
                  {
                    minTick: e,
                    price: 1 / 0,
                    maxIndex: 1 / 0,
                  },
                ];
              const h = [];
              for (let e = 0; e < c.length; e += 2) {
                const t = null !== (i = c[e + 1]) && void 0 !== i ? i : 1 / 0,
                  n =
                    null !==
                      (o =
                        null === (s = h[h.length - 1]) || void 0 === s
                          ? void 0
                          : s.price) && void 0 !== o
                      ? o
                      : 0,
                  d =
                    null !==
                      (l =
                        null === (a = h[h.length - 1]) || void 0 === a
                          ? void 0
                          : a.maxIndex) && void 0 !== l
                      ? l
                      : 0,
                  u =
                    t === 1 / 0
                      ? 1 / 0
                      : new r.Big(t).minus(n).div(c[e]).plus(d).toNumber();
                h.push({
                  minTick: c[e],
                  price: t,
                  maxIndex: u,
                });
              }
              return h;
            })(NaN, c)),
      o && void 0 !== l && l > 0 && 2 !== l && 4 !== l && 8 !== l
        ? a.logDebug("invalid minmove2")
        : ((this._fractional = o),
          (this._fractionalLength = u(
            this._priceScale,
            this._minMove,
            this._fractional,
            this._minMove2
          )),
          (this._ignoreMinMove = h));
  }
  isFractional() {
    return !!this._fractional;
  }
  state() {
    return {
      fractional: this._fractional,
      fractionalLength: this._fractionalLength,
      minMove: this._minMove,
      minMove2: this._minMove2,
      priceScale: this._priceScale,
      variableMinTick: this._variableMinTick,
      ignoreMinMove: this._ignoreMinMove,
    };
  }
  formatChange(e, t, i) {
    return this._formatImpl(
      e - t,
      i,
      void 0,
      void 0,
      void 0,
      void 0,
      Math.min(Math.abs(e), Math.abs(t))
    );
  }
  format(e, t, i, s = !0, r = !0, n = !1) {
    return this._formatImpl(e, t, i, s, r, n);
  }
  parse(e) {
    return (
      "+" === (e = (e = (0, o.stripLTRMarks)(e)).replace("−", "-"))[0] &&
        (e = e.substring(1)),
      this._fractional
        ? this._minMove2
          ? this._parseAsDoubleFractional(e)
          : this._parseAsSingleFractional(e)
        : this._parseAsDecimal(e)
    );
  }
  hasForexAdditionalPrecision() {
    return !this._fractional && 10 === this._minMove2;
  }
  static serialize(e) {
    return e.state();
  }
  static deserialize(e) {
    return new m(
      e.priceScale,
      e.minMove,
      e.fractional,
      e.minMove2,
      e.variableMinTick,
      e.ignoreMinMove
    );
  }
  _formatImpl(e, t, i, s = !0, r = !0, n = !1, a) {
    const l = {
      price: e,
      priceScale: this._priceScale,
      minMove: this._minMove,
      fractionalLength: this._fractionalLength,
      tailSize: i,
      cutFractionalByPrecision: n,
    };
    let c,
      h = "";
    return (
      e < 0
        ? ((h = !1 === s ? "" : "−"), (l.price = -e))
        : e && !0 === t && (h = "+"),
      void 0 !== this._variableMinTickData &&
        (Object.assign(
          l,
          _(this._variableMinTickData, null != a ? a : l.price)
        ),
        this._ignoreMinMove && (l.minMove = 1)),
      (c = this._fractional
        ? h + this._formatAsFractional(l.price, l.tailSize)
        : h + this._formatAsDecimal(l)),
      r ? (0, o.forceLTRStr)(c) : c
    );
  }
  _formatAsExponential(e) {
    const t = Math.floor(0.75 * Math.log10(this._priceScale)),
      i = e * Math.pow(10, t),
      s = `e-${t}`,
      r = Math.log10(this._priceScale) - t;
    return `${i.toFixed(r).replace(".", c.decimalSign)}${s}`;
  }
  _formatAsDecimal(e) {
    const {
      price: t,
      priceScale: i,
      minMove: s,
      fractionalLength: n = 0,
      tailSize: o = 0,
      cutFractionalByPrecision: a,
    } = e;
    if (i > 1e15) return this._formatAsExponential(t);
    let l;
    l = this._fractional
      ? Math.pow(10, n)
      : (Math.pow(10, o) * i) / (a ? 1 : s);
    const h = 1 / l;
    let d;
    if (l > 1) d = Math.floor(t);
    else {
      const e = Math.floor(Math.round(t / h) * h);
      d = 0 === Math.round((t - e) / h) ? e : e + h;
    }
    let u = "";
    if (l > 1) {
      let e = a
        ? new r.Big(t)
            .mul(l)
            .round(void 0, 0)
            .minus(new r.Big(d).mul(l))
            .toNumber()
        : parseFloat((Math.round(t * l) - d * l).toFixed(n));
      e >= l && ((e -= l), (d += 1));
      const i = a
        ? new r.Big(e).round(n, 0).toNumber()
        : parseFloat(e.toFixed(n)) * s;
      (u = c.decimalSign + p(i, n + o)), (u = this._removeEndingZeros(u, o));
    }
    return d.toString() + u;
  }
  _getFractPart(e, t, i) {
    const s = [0, 5],
      r = [0, 2, 5, 7],
      n = [0, 1, 2, 3, 5, 6, 7, 8];
    return 2 === i
      ? void 0 === s[e]
        ? -1
        : s[e]
      : 4 === i
      ? void 0 === r[e]
        ? -1
        : r[e]
      : 8 === i && 2 === t
      ? void 0 === n[e]
        ? -1
        : n[e]
      : e;
  }
  _formatAsFractional(e, t) {
    const i = this._priceScale / this._minMove;
    let s = Math.floor(e),
      r = t ? Math.floor(e * i) - s * i : Math.round(e * i) - s * i;
    r === i && ((r = 0), (s += 1));
    let n = "";
    if (t) {
      let o = (e - s - r / i) * i;
      (o = Math.round(o * Math.pow(10, t))),
        (n = p(o, t)),
        (n = this._removeEndingZeros(n, t));
    }
    if (!this._fractionalLength)
      throw new Error("_fractionalLength is not calculated");
    let o = "";
    if (this._minMove2) {
      const e = r % this._minMove2;
      r = (r - e) / this._minMove2;
      const t = p(r, this._fractionalLength),
        i = this._getFractPart(e, 2, this._minMove2);
      o = t + c.decimalSignFractional + i;
    } else
      (r = this._getFractPart(r, 1, this._priceScale)),
        (o = p(r * this._minMove, this._fractionalLength));
    return s.toString() + c.decimalSignFractional + o + n;
  }
  _removeEndingZeros(e, t) {
    for (let i = 0; i < t && "0" === e[e.length - 1]; i++)
      e = e.substring(0, e.length - 1);
    return e;
  }
  _parseAsDecimal(e) {
    if (e.includes("e")) {
      if (
        (function (e) {
          let t = h.get(e);
          return (
            t ||
              ((t = new RegExp("^(-?)[0-9]+\\" + e + "[0-9]*e(-?)[0-9]+$")),
              h.set(e, t)),
            t
          );
        })(c.decimalSign).exec(e)
      ) {
        const t = parseFloat(e.replace(c.decimalSign, "."));
        return {
          value: t,
          res: !0,
          suggest: this.format(t),
        };
      }
      return {
        error: this._formatterErrors.custom,
        res: !1,
      };
    }
    let t = l.exec(e);
    if (t) {
      const t = parseFloat(e);
      return {
        value: t,
        res: !0,
        suggest: this.format(t),
      };
    }
    if (
      ((t = (function (e) {
        let t = d.get(e);
        return (
          t ||
            ((t = new RegExp("^(-?)[0-9]+\\" + c.decimalSign + "[0-9]*$")),
            d.set(e, t)),
          t
        );
      })(c.decimalSign).exec(e)),
      t)
    ) {
      const t = parseFloat(e.replace(c.decimalSign, "."));
      return {
        value: t,
        res: !0,
        suggest: this.format(t),
      };
    }
    return {
      error: this._formatterErrors.custom,
      res: !1,
    };
  }
  _patchFractPart(e, t, i) {
    const s = {
        0: 0,
        5: 1,
      },
      r = {
        0: 0,
        2: 1,
        5: 2,
        7: 3,
      },
      n = {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        5: 4,
        6: 5,
        7: 6,
        8: 7,
      };
    return 2 === i
      ? void 0 === s[e]
        ? -1
        : s[e]
      : 4 === i
      ? void 0 === r[e]
        ? -1
        : r[e]
      : 8 === i && 2 === t
      ? void 0 === n[e]
        ? -1
        : n[e]
      : e;
  }
  _parseAsSingleFractional(e) {
    let t = l.exec(e);
    if (t) {
      const t = parseFloat(e);
      return {
        value: t,
        res: !0,
        suggest: this.format(t),
      };
    }
    if (
      ((t = new RegExp(
        "^(-?)([0-9]+)\\" + c.decimalSignFractional + "([0-9]+)$"
      ).exec(e)),
      t)
    ) {
      const e = !!t[1],
        i = parseInt(t[2]),
        s = this._priceScale,
        r = this._patchFractPart(parseInt(t[3]), 1, s);
      if (r >= s || r < 0)
        return {
          error: this._formatterErrors.fraction,
          res: !1,
        };
      let n = i + r / s;
      return (
        e && (n = -n),
        {
          value: n,
          res: !0,
          suggest: this.format(n),
        }
      );
    }
    return {
      error: this._formatterErrors.custom,
      res: !1,
    };
  }
  _parseAsDoubleFractional(e) {
    let t = l.exec(e);
    if (t) {
      const t = parseFloat(e);
      return {
        value: t,
        res: !0,
        suggest: this.format(t),
      };
    }
    if (
      ((t = new RegExp(
        "^(-?)([0-9]+)\\" +
          c.decimalSignFractional +
          "([0-9]+)\\" +
          c.decimalSignFractional +
          "([0-9]+)$"
      ).exec(e)),
      t)
    ) {
      const e = !!t[1],
        i = parseInt(t[2]),
        s = void 0 !== this._minMove2 ? this._minMove2 : NaN,
        r = this._priceScale / s,
        n = this._minMove2,
        o = this._patchFractPart(parseInt(t[3]), 1, r),
        a = this._patchFractPart(parseInt(t[4]), 2, n);
      if (o >= r || o < 0)
        return {
          error: this._formatterErrors.fraction,
          res: !1,
        };
      if ((void 0 !== n && a >= n) || a < 0)
        return {
          error: this._formatterErrors.secondFraction,
          res: !1,
        };
      let l = void 0 !== n ? i + o / r + a / (r * n) : NaN;
      return (
        e && (l = -l),
        {
          value: l,
          res: !0,
          suggest: this.format(l),
        }
      );
    }
    return {
      error: this._formatterErrors.custom,
      res: !1,
    };
  }
}

export class VolumeFormatter {
  constructor(e) {
    (this.type = "volume"),
      (this._numericFormatter = new r.NumericFormatter()),
      (this._fractionalValues = void 0 !== e && e > 0),
      (this._precision = e);
  }
  state() {
    return {
      precision: this._precision,
    };
  }
  format(e, t) {
    if (!(0, n.isNumber)(e)) return "---";
    let r = "";
    return (
      e < 0 ? ((r = "−"), (e = -e)) : e > 0 && t && (r = "+"),
      e >= 1e100
        ? s.t(null, void 0, i(43088))
        : (!this._fractionalValues || e >= 995
            ? (e = Math.round(e))
            : this._fractionalValues && (e = +e.toFixed(this._precision)),
          e < 995
            ? r + this._formatNumber(e)
            : e < 999995
            ? r + this._formatNumber(e / 1e3) + "K"
            : e < 999999995
            ? ((e = 1e3 * Math.round(e / 1e3)),
              r + this._formatNumber(e / 1e6) + "M")
            : e < 999999999995
            ? ((e = 1e6 * Math.round(e / 1e6)),
              r + this._formatNumber(e / 1e9) + "B")
            : ((e = 1e9 * Math.round(e / 1e9)),
              r + this._formatNumber(e / 1e12) + "T"))
    );
  }
  parse(e) {
    if ("---" === e)
      return {
        error: "not a number",
        res: !1,
        value: NaN,
      };
    const t = {
        K: 1e3,
        M: 1e6,
        B: 1e9,
        T: 1e12,
      },
      i = e.slice(-1);
    if (t.hasOwnProperty(i)) {
      const s = this._numericFormatter.parse(e.slice(0, -1));
      return (0, n.isNumber)(s)
        ? {
            res: !0,
            value: s * t[i],
          }
        : {
            error: "not a number",
            res: !1,
            value: NaN,
          };
    }
    {
      const t = this._numericFormatter.parse(e);
      return (0, n.isNumber)(t)
        ? {
            res: !0,
            value: t,
          }
        : {
            error: "not a number",
            res: !1,
            value: NaN,
          };
    }
  }
  static serialize(e) {
    return e.state();
  }
  static deserialize(e) {
    return new o(e.precision);
  }
  _formatNumber(e) {
    if (this._fractionalValues && 0 !== e) {
      const t = 14 - Math.ceil(Math.log10(e)),
        i = Math.pow(10, t);
      e = Math.round(e * i) / i;
    }
    return this._numericFormatter
      .format(e)
      .replace(/(\.[1-9]*)0+$/, (e, t) => t);
  }
}




// Define the exported function directly
function defaultFunc(e) {
    // Check if the argument is a string or an object with the tag "[object String]"
    return typeof e === "string" || (!isObject(e) && toStringTag(e) === "[object String]");
}
