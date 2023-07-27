const { NumericFormatter } = require("87663");
const { isNumber } = require("lodash");
const { t } = require("44352");

class VolumeFormatter {
  constructor(e) {
    this.type = "volume";
    this._numericFormatter = new NumericFormatter();
    this._fractionalValues = e !== undefined && e > 0;
    this._precision = e;
  }

  state() {
    return {
      precision: this._precision,
    };
  }

  format(e, t) {
    if (!isNumber(e)) {
      return "---";
    }

    let r = "";
    if (e < 0) {
      r = "−";
      e = -e;
    } else if (e > 0 && t) {
      r = "+";
    }

    if (e >= 1e100) {
      return t ? t(null, undefined, require(43088)) : "---";
    }

    if (!this._fractionalValues || e >= 995) {
      e = Math.round(e);
    } else if (this._fractionalValues) {
      e = +e.toFixed(this._precision);
    }

    if (e < 995) {
      return r + this._formatNumber(e);
    } else if (e < 999995) {
      return r + this._formatNumber(e / 1e3) + "K";
    } else if (e < 999999995) {
      e = 1e3 * Math.round(e / 1e3);
      return r + this._formatNumber(e / 1e6) + "M";
    } else if (e < 999999999995) {
      e = 1e6 * Math.round(e / 1e6);
      return r + this._formatNumber(e / 1e9) + "B";
    } else {
      e = 1e9 * Math.round(e / 1e9);
      return r + this._formatNumber(e / 1e12) + "T";
    }
  }

  parse(e) {
    if (e === "---") {
      return {
        error: "not a number",
        res: false,
        value: NaN,
      };
    }

    const t = {
      K: 1e3,
      M: 1e6,
      B: 1e9,
      T: 1e12,
    };

    const i = e.slice(-1);
    if (t.hasOwnProperty(i)) {
      const s = this._numericFormatter.parse(e.slice(0, -1));
      if (isNumber(s)) {
        return {
          res: true,
          value: s * t[i],
        };
      } else {
        return {
          error: "not a number",
          res: false,
          value: NaN,
        };
      }
    } else {
      const t = this._numericFormatter.parse(e);
      if (isNumber(t)) {
        return {
          res: true,
          value: t,
        };
      } else {
        return {
          error: "not a number",
          res: false,
          value: NaN,
        };
      }
    }
  }

  static serialize(e) {
    return e.state();
  }

  static deserialize(e) {
    return new VolumeFormatter(e.precision);
  }

  _formatNumber(e) {
    if (this._fractionalValues && e !== 0) {
      const t = 14 - Math.ceil(Math.log10(e));
      const i = Math.pow(10, t);
      e = Math.round(e * i) / i;
    }
    return this._numericFormatter
      .format(e)
      .replace(/(\.[1-9]*)0+$/, (e, t) => t);
  }
}

module.exports = {
  VolumeFormatter,
};
