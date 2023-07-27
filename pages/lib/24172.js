import { getHexColorByName } from "./48891";
import { Std, cum, close, high, low, volume } from "some-library"; // ! not correct

const hexColorByName = getHexColorByName;
const colorRipeRed100 = hexColorByName("color-ripe-red-100");
const colorRipeRed200 = hexColorByName("color-ripe-red-200");
const colorRipeRed500 = hexColorByName("color-ripe-red-500");
const colorRipeRed900 = hexColorByName("color-ripe-red-900");
const colorRipeRedA200 = hexColorByName("color-ripe-red-a200");
const colorMintyGreen100 = hexColorByName("color-minty-green-100");
const colorMintyGreen400 = hexColorByName("color-minty-green-400");
const colorMintyGreen500 = hexColorByName("color-minty-green-500");

JSServer.studyLibrary = [
  {
    name: "Accumulation/Distribution",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: false,
      isTVScriptStub: false,
      is_hidden_study: false,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
            visible: true,
            color: "#2196F3",
          },
        },
        inputs: {},
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: false,
        },
      },
      description: "Accumulation/Distribution",
      shortDescription: "Accum/Dist",
      is_price_study: false,
      inputs: [],
      id: "Accumulation/Distribution@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Accumulation/Distribution",
      format: {
        type: "volume",
      },
    },
    constructor: function () {
      this.calculateValue = function (
        closeValue,
        highValue,
        lowValue,
        volumeValue
      ) {
        return Std.or(
          Std.and(Std.eq(closeValue, highValue), Std.eq(closeValue, lowValue)),
          Std.eq(highValue, lowValue)
        )
          ? 0
          : ((2 * closeValue - lowValue - highValue) / (highValue - lowValue)) *
              volumeValue;
      };
      this.main = function (context, input) {
        this._context = context;
        this._input = input;
        var value = this.calculateValue(
          close(this._context),
          high(this._context),
          low(this._context),
          volume(this._context)
        );
        return [cum(value, this._context)];
      };
    },
  },

  {
    name: "Accumulative Swing Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 10,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "ASI",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Accumulative Swing Index",
      shortDescription: "ASI",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "Limit Move Value",
          defval: 10,
          type: "float",
          min: 0.1,
          max: 1e5,
        },
      ],
      id: "Accumulative Swing Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Accumulative Swing Index",
      format: {
        type: "volume",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        var i = t.new_var(r.Std.open(t)),
          s = t.new_var(r.Std.high(t)),
          n = t.new_var(r.Std.low(t)),
          o = t.new_var(r.Std.close(t)),
          a = r.Std.abs(s - o.get(1)),
          l = r.Std.abs(n - o.get(1)),
          c = r.Std.abs(s - n),
          h = r.Std.abs(o.get(1) - i.get(1)),
          d = r.Std.max(a, l),
          u = r.Std.iff(
            a >= r.Std.max(l, c),
            a - 0.5 * l + 0.25 * h,
            r.Std.iff(
              l >= r.Std.max(a, c),
              l - 0.5 * a + 0.25 * h,
              c + 0.25 * h
            )
          );
        return r.Std.iff(
          0 === u,
          0,
          ((((o - o.get(1) + 0.5 * (o - i) + 0.25 * (o.get(1) - i.get(1))) /
            u) *
            d) /
            e) *
            50
        );
      }),
        (this.f_1 = function (e, t) {
          var i = this.f_0(e, t);
          return r.Std.cum(i, t);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0);
          return [this.f_1(i, this._context)];
        });
    },
  },
  {
    name: "Advance/Decline",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 10,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Advance/Decline",
      shortDescription: "AD",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Advance/Decline@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Advance/Decline",
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return r.Std.gt(e, t);
      }),
        (this.f_1 = function (e, t) {
          return r.Std.lt(e, t);
        }),
        (this.f_2 = function (e, t) {
          return 0 === t ? e : e / t;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this.f_0(r.Std.close(this._context), r.Std.open(this._context)),
            n = this._context.new_var(s),
            o = r.Std.sum(n, i, this._context),
            a = this.f_1(r.Std.close(this._context), r.Std.open(this._context)),
            l = this._context.new_var(a),
            c = r.Std.sum(l, i, this._context);
          return [this.f_2(o, c)];
        });
    },
  },
  {
    name: "Arnaud Legoux Moving Average",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 9,
          in_1: 0.85,
          in_2: 6,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Arnaud Legoux Moving Average",
      shortDescription: "ALMA",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Window Size",
          defval: 9,
          type: "integer",
          min: 0,
          max: 5e3,
        },
        {
          id: "in_1",
          name: "Offset",
          defval: 0.85,
          type: "float",
          min: -1e12,
          max: 1e12,
        },
        {
          id: "in_2",
          name: "Sigma",
          defval: 6,
          type: "float",
          min: -1e12,
          max: 1e12,
        },
      ],
      id: "Arnaud Legoux Moving Average@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Arnaud Legoux Moving Average",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = r.Std.close(this._context),
          s = this._input(0),
          n = this._input(1),
          o = this._input(2),
          a = this._context.new_var(i);
        return [r.Std.alma(a, s, n, o)];
      };
    },
  },
  {
    name: "Aroon",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FB8C00",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Upper",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Lower",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Aroon",
      shortDescription: "Aroon",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Aroon@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Aroon",
      format: {
        precision: 2,
        type: "percent",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return (100 * (e + t)) / t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = r.Std.high(this._context),
            n = i + 1,
            o = this._context.new_var(s),
            a = r.Std.highestbars(o, n, this._context),
            l = this.f_0(a, i),
            c = r.Std.low(this._context),
            h = this._context.new_var(c),
            d = r.Std.lowestbars(h, n, this._context);
          return [l, this.f_0(d, i)];
        });
    },
  },
  {
    name: "Average Price",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      id: "AveragePrice@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Average Price",
      description: "Average Price",
      shortDescription: "Average Price",
      is_price_study: !0,
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#2196F3",
          },
        },
        inputs: {},
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        return (
          (this._context = e), (this._input = t), [r.Std.ohlc4(this._context)]
        );
      };
    },
  },
  {
    name: "Average Directional Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: c,
          },
        },
        inputs: {
          in_0: 14,
          in_1: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "ADX",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "Average Directional Index",
      shortDescription: "ADX",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "ADX Smoothing",
          defval: 14,
          type: "integer",
          min: -1e12,
          max: 1e12,
        },
        {
          id: "in_1",
          name: "DI Length",
          defval: 14,
          type: "integer",
          min: -1e12,
          max: 1e12,
        },
      ],
      id: "average_directional_Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Average Directional Index",
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function (e) {
        var t = this._context.new_var(r.Std.high(this._context)),
          i = r.Std.change(t),
          s = this._context.new_var(r.Std.low(this._context)),
          n = -r.Std.change(s),
          o = this._context.new_var(r.Std.tr(void 0, this._context)),
          a = r.Std.rma(o, e, this._context),
          l = this._context.new_var(
            r.Std.and(r.Std.gt(i, n), r.Std.gt(i, 0)) ? i : 0
          ),
          c = r.Std.fixnan(
            (100 * r.Std.rma(l, e, this._context)) / a,
            this._context
          ),
          h = this._context.new_var(
            r.Std.and(r.Std.gt(n, i), r.Std.gt(n, 0)) ? n : 0
          );
        return [
          c,
          r.Std.fixnan(
            (100 * r.Std.rma(h, e, this._context)) / a,
            this._context
          ),
        ];
      }),
        (this.f_1 = function (e, t) {
          var i = this.f_0(e),
            s = i[0],
            n = i[1],
            o = s + n,
            a = this._context.new_var(
              r.Std.abs(s - n) / (r.Std.eq(o, 0) ? 1 : o)
            );
          return [100 * r.Std.rma(a, t, this._context)];
        }),
        (this.main = function (e, t) {
          return (
            (this._context = e),
            (this._input = t),
            this._context.setMinimumAdditionalDepth(
              this._input(0) + this._input(1)
            ),
            this.f_1(this._input(1), this._input(0))
          );
        });
    },
  },
  {
    name: "Average True Range",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: l,
          },
        },
        inputs: {
          in_0: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Average True Range",
      shortDescription: "ATR",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Average True Range@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Average True Range",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        var i = t(0);
        return [r.Std.atr(i, e)];
      };
    },
  },
  {
    name: "Awesome Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 1,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#000080",
          },
        },
        palettes: {
          palette_0: {
            colors: {
              0: {
                color: a,
                width: 1,
                style: 0,
              },
              1: {
                color: u,
                width: 1,
                style: 0,
              },
            },
          },
        },
        inputs: {},
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          palette: "palette_0",
          target: "plot_0",
          type: "colorer",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Awesome Oscillator",
      shortDescription: "AO",
      is_price_study: !1,
      palettes: {
        palette_0: {
          colors: {
            0: {
              name: "Color 0",
            },
            1: {
              name: "Color 1",
            },
          },
        },
      },
      inputs: [],
      id: "Awesome Oscillator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Awesome Oscillator",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e - t;
      }),
        (this.f_1 = function (e) {
          return r.Std.le(e, 0) ? 0 : 1;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.hl2(this._context),
            s = this._context.new_var(i),
            n = r.Std.sma(s, 5, this._context),
            o = this._context.new_var(i),
            a = r.Std.sma(o, 34, this._context),
            l = this.f_0(n, a),
            c = l,
            h = this._context.new_var(l),
            d = r.Std.change(h);
          return [c, this.f_1(d)];
        });
    },
  },
  {
    name: "Accelerator Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 1,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#000080",
          },
        },
        palettes: {
          palette_0: {
            colors: {
              0: {
                color: a,
                width: 1,
                style: 0,
              },
              1: {
                color: u,
                width: 1,
                style: 0,
              },
            },
          },
        },
        inputs: {},
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          palette: "palette_0",
          target: "plot_0",
          type: "colorer",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Accelerator Oscillator",
      shortDescription: "AO",
      is_price_study: !1,
      palettes: {
        palette_0: {
          colors: {
            0: {
              name: "Color 0",
            },
            1: {
              name: "Color 1",
            },
          },
        },
      },
      inputs: [],
      id: "Accelerator Oscillator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Accelerator Oscillator",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e - t;
      }),
        (this.f_1 = function (e) {
          return r.Std.le(e, 0) ? 0 : 1;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.hl2(this._context),
            s = this._context.new_var(i),
            n = r.Std.sma(s, 5, this._context),
            o = this._context.new_var(i),
            a = r.Std.sma(o, 34, this._context),
            l = this.f_0(n, a),
            c = this._context.new_var(l),
            h = r.Std.sma(c, 5, this._context),
            d = this.f_0(l, h),
            u = this._context.new_var(d),
            p = r.Std.change(u);
          return [d, this.f_1(p)];
        });
    },
  },
  {
    name: "Balance of Power",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: c,
          },
        },
        inputs: {},
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Balance of Power",
      shortDescription: "Balance of Power",
      is_price_study: !1,
      inputs: [],
      id: "Balance of Power@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Balance of Power",
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t, i, s) {
        return (e - t) / (i - s);
      }),
        (this.main = function (e, t) {
          return (
            (this._context = e),
            (this._input = t),
            [
              this.f_0(
                r.Std.close(this._context),
                r.Std.open(this._context),
                r.Std.high(this._context),
                r.Std.low(this._context)
              ),
            ]
          );
        });
    },
  },
  {
    name: "Bollinger Bands",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 95,
            visible: !0,
          },
        },
        inputs: {
          in_0: 20,
          in_1: 2,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Median",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Upper",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Lower",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Bollinger Bands",
      shortDescription: "BB",
      is_price_study: !0,
      filledAreas: [
        {
          id: "fill_0",
          objAId: "plot_1",
          objBId: "plot_2",
          type: "plot_plot",
          title: "Plots Background",
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_1",
          name: "mult",
          defval: 2,
          type: "float",
          min: 0.001,
          max: 50,
        },
      ],
      id: "Bollinger Bands@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Bollinger Bands",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e * t;
      }),
        (this.f_1 = function (e, t) {
          return e + t;
        }),
        (this.f_2 = function (e, t) {
          return e - t;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._input(0),
            n = this._input(1),
            o = this._context.new_var(i),
            a = r.Std.sma(o, s, this._context),
            l = this._context.new_var(i),
            c = r.Std.stdev(l, s, this._context),
            h = this.f_0(n, c);
          return [a, this.f_1(a, h), this.f_2(a, h)];
        });
    },
  },
  {
    name: "Bollinger Bands %B",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: d,
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 1,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#26A69A",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 20,
          in_1: 2,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Bollinger Bands %B",
      shortDescription: "BB %B",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.11,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_1",
          name: "mult",
          defval: 2,
          type: "float",
          min: 0.001,
          max: 50,
        },
      ],
      id: "Bollinger Bands %B@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Bollinger Bands %B",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e * t;
      }),
        (this.f_1 = function (e, t) {
          return e + t;
        }),
        (this.f_2 = function (e, t) {
          return e - t;
        }),
        (this.f_3 = function (e, t, i) {
          return (e - t) / (i - t);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._input(0),
            n = this._input(1),
            o = this._context.new_var(i),
            a = r.Std.sma(o, s, this._context),
            l = this._context.new_var(i),
            c = r.Std.stdev(l, s, this._context),
            h = this.f_0(n, c),
            d = this.f_1(a, h),
            u = this.f_2(a, h);
          return [this.f_3(i, u, d)];
        });
    },
  },
  {
    name: "Bollinger Bands Width",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
        },
        inputs: {
          in_0: 20,
          in_1: 2,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Bollinger Bands Width",
      shortDescription: "BBW",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_1",
          name: "mult",
          defval: 2,
          type: "float",
          min: 0.001,
          max: 50,
        },
      ],
      id: "Bollinger Bands Width@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Bollinger Bands Width",
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e * t;
      }),
        (this.f_1 = function (e, t) {
          return e + t;
        }),
        (this.f_2 = function (e, t) {
          return e - t;
        }),
        (this.f_3 = function (e, t, i) {
          return (e - t) / i;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._input(0),
            n = this._input(1),
            o = this._context.new_var(i),
            a = r.Std.sma(o, s, this._context),
            l = this._context.new_var(i),
            c = r.Std.stdev(l, s, this._context),
            h = this.f_0(n, c),
            d = this.f_1(a, h),
            u = this.f_2(a, h);
          return [this.f_3(d, u, a)];
        });
    },
  },
  {
    name: "Chaikin Money Flow",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#43A047",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 20,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Chaikin Money Flow",
      shortDescription: "CMF",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Chaikin Money Flow@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Chaikin Money Flow",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t, i, s) {
        return r.Std.or(
          r.Std.and(r.Std.eq(e, t), r.Std.eq(e, i)),
          r.Std.eq(t, i)
        )
          ? 0
          : ((2 * e - i - t) / (t - i)) * s;
      }),
        (this.f_1 = function (e, t) {
          return e / t;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this.f_0(
              r.Std.close(this._context),
              r.Std.high(this._context),
              r.Std.low(this._context),
              r.Std.volume(this._context)
            ),
            n = this._context.new_var(s),
            o = r.Std.sum(n, i, this._context),
            a = r.Std.volume(this._context),
            l = this._context.new_var(a),
            c = r.Std.sum(l, i, this._context);
          return [this.f_1(o, c)];
        });
    },
  },
  {
    name: "Chaikin Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#EC407A",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 3,
          in_1: 10,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Chaikin Oscillator",
      shortDescription: "Chaikin Osc",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "short",
          defval: 3,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "long",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Chaikin Oscillator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Chaikin Oscillator",
      format: {
        type: "volume",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e - t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = r.Std.accdist(this._context),
            o = this._context.new_var(n),
            a = r.Std.ema(o, i, this._context),
            l = this._context.new_var(n),
            c = r.Std.ema(l, s, this._context);
          return [this.f_0(a, c)];
        });
    },
  },
  {
    name: "Chaikin Volatility",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !1,
      id: "Chaikin Volatility@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Chaikin Volatility",
      description: "Chaikin Volatility",
      shortDescription: "Chaikin Volatility",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#AB47BC",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          periods: 10,
          rocLookback: 10,
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
          zorder: 1,
        },
      },
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "periods",
          type: "integer",
          name: "Periods",
        },
        {
          id: "rocLookback",
          type: "integer",
          name: "Rate of Change Lookback",
        },
      ],
      format: {
        type: "volume",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          (this.period = this._input(0)),
          (this.rocLookback = this._input(1));
      }),
        (this.main = function (e, t) {
          (this._context = e),
            (this._input = t),
            this._context.setMinimumAdditionalDepth(
              this.period + this.rocLookback
            );
          var i = this._context.new_var(
              r.Std.high(this._context) - r.Std.low(this._context)
            ),
            s = this._context.new_var(r.Std.ema(i, this.period, this._context));
          return [r.Std.roc(s, this.rocLookback)];
        });
    },
  },
  {
    name: "Chande Kroll Stop",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
        },
        inputs: {
          in_0: 10,
          in_1: 1,
          in_2: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Long",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Short",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Chande Kroll Stop",
      shortDescription: "Chande Kroll Stop",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "p",
          defval: 10,
          type: "integer",
          min: 1,
          max: 4999,
        },
        {
          id: "in_1",
          name: "x",
          defval: 1,
          type: "integer",
          min: 1,
          max: 1e12,
        },
        {
          id: "in_2",
          name: "q",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e12,
        },
      ],
      id: "Chande Kroll Stop@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Chande Kroll Stop",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t, i) {
        return e - t * i;
      }),
        (this.f_1 = function (e, t, i) {
          return e + t * i;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = this._input(2),
            o = r.Std.high(this._context),
            a = this._context.new_var(o),
            l = r.Std.highest(a, i, this._context),
            c = r.Std.atr(i, this._context),
            h = this.f_0(l, s, c),
            d = this._context.new_var(o),
            u = r.Std.lowest(d, i, this._context),
            p = this.f_1(u, s, c),
            _ = this._context.new_var(h),
            m = r.Std.highest(_, n, this._context),
            g = this._context.new_var(p);
          return [r.Std.lowest(g, n, this._context), m];
        });
    },
  },
  {
    name: "Chande Momentum Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Chande Momentum Oscillator",
      shortDescription: "ChandeMO",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Chande Momentum Oscillator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Chande Momentum Oscillator",
      format: {
        type: "price",
        precision: 2,
      },
    },
    constructor: function () {
      (this.f_0 = function (e) {
        return r.Std.ge(e, 0) ? e : 0;
      }),
        (this.f_1 = function (e) {
          return r.Std.ge(e, 0) ? 0 : -e;
        }),
        (this.f_2 = function (e, t) {
          return (100 * e) / t;
        }),
        (this.f_3 = function (e, t) {
          return this.f_2(e - t, e + t);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = r.Std.close(this._context),
            n = this._context.new_var(s),
            o = r.Std.change(n),
            a = this.f_0(o),
            l = this.f_1(o),
            c = this._context.new_var(a),
            h = r.Std.sum(c, i, this._context),
            d = this._context.new_var(l),
            u = r.Std.sum(d, i, this._context);
          return [this.f_3(h, u)];
        });
    },
  },
  {
    name: "Chop Zone",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 5,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#000080",
          },
        },
        palettes: {
          palette_0: {
            colors: {
              0: {
                color: "#26C6DA",
                width: 1,
                style: 0,
              },
              1: {
                color: "#43A047",
                width: 1,
                style: 0,
              },
              2: {
                color: "#A5D6A7",
                width: 1,
                style: 0,
              },
              3: {
                color: u,
                width: 1,
                style: 0,
              },
              4: {
                color: "#D50000",
                width: 1,
                style: 0,
              },
              5: {
                color: "#E91E63",
                width: 1,
                style: 0,
              },
              6: {
                color: "#FF6D00",
                width: 1,
                style: 0,
              },
              7: {
                color: "#FFB74D",
                width: 1,
                style: 0,
              },
              8: {
                color: "#FDD835",
                width: 1,
                style: 0,
              },
            },
          },
        },
        inputs: {},
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          palette: "palette_0",
          target: "plot_0",
          type: "colorer",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "Chop Zone",
      shortDescription: "Chop Zone",
      is_price_study: !1,
      palettes: {
        palette_0: {
          colors: {
            0: {
              name: "Color 0",
            },
            1: {
              name: "Color 1",
            },
            2: {
              name: "Color 2",
            },
            3: {
              name: "Color 3",
            },
            4: {
              name: "Color 4",
            },
            5: {
              name: "Color 5",
            },
            6: {
              name: "Color 6",
            },
            7: {
              name: "Color 7",
            },
            8: {
              name: "Color 8",
            },
          },
          valToIndex: {
            0: 0,
            1: 1,
            2: 2,
            3: 3,
            4: 4,
            5: 5,
            6: 6,
            7: 7,
            8: 8,
          },
        },
      },
      inputs: [],
      id: "chop_zone@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Chop Zone",
      format: {
        precision: 0,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function () {
        var e = r.Std.close(this._context),
          t = r.Std.hlc3(this._context),
          i = this._context.new_var(r.Std.high(this._context)),
          s = r.Std.highest(i, 30, this._context),
          n = r.Std.lowest(i, 30, this._context),
          o = (25 / (s - n)) * n,
          a = this._context.new_var(e),
          l = this._context.new_var(r.Std.ema(a, 34, this._context)),
          c = ((l.get(1) - l.get(0)) / t) * o,
          h = r.Std.sqrt(1 + c * c),
          d = r.Std.round((180 * r.Std.acos(1 / h)) / 3.141592653589793),
          u = r.Std.iff(r.Std.gt(c, 0), -d, d),
          p = r.Std.and(r.Std.gt(u, -2.14), r.Std.le(u, -0.71)) ? 7 : 8,
          _ = r.Std.and(r.Std.gt(u, -3.57), r.Std.le(u, -2.14)) ? 6 : p,
          m = r.Std.and(r.Std.gt(u, -5), r.Std.le(u, -3.57)) ? 5 : _,
          g = r.Std.le(u, -5) ? 4 : m,
          f = r.Std.and(r.Std.lt(u, 2.14), r.Std.ge(u, 0.71)) ? 3 : g,
          v = r.Std.and(r.Std.lt(u, 3.57), r.Std.ge(u, 2.14)) ? 2 : f,
          S = r.Std.and(r.Std.lt(u, 5), r.Std.ge(u, 3.57)) ? 1 : v;
        return [1, r.Std.ge(u, 5) ? 0 : S];
      }),
        (this.main = function (e, t) {
          return (this._context = e), (this._input = t), this.f_0();
        });
    },
  },
  {
    name: "Choppiness Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 61.8,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 38.2,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Choppiness Index",
      shortDescription: "CHOP",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.11,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Choppiness Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Choppiness Index",
      format: {
        type: "price",
        precision: 2,
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t, i, s) {
        return (100 * r.Std.log10(e / (t - i))) / s;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = r.Std.atr(1, this._context),
            n = this._context.new_var(s),
            o = r.Std.sum(n, i, this._context),
            a = r.Std.high(this._context),
            l = this._context.new_var(a),
            c = r.Std.highest(l, i, this._context),
            h = r.Std.low(this._context),
            d = this._context.new_var(h),
            u = r.Std.lowest(d, i, this._context),
            p = r.Std.log10(i);
          return [this.f_0(o, c, u, p)];
        });
    },
  },
  {
    name: "Commodity Channel Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          smoothedMA: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !1,
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 100,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: -100,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 20,
          smoothingLine: "SMA",
          smoothingLength: 20,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "smoothedMA",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 2,
        },
        smoothedMA: {
          title: "Smoothed MA",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Commodity Channel Index",
      shortDescription: "CCI",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.11,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "smoothingLine",
          name: "Smoothing Line",
          defval: "SMA",
          type: "text",
          options: ["SMA", "EMA", "WMA"],
        },
        {
          id: "smoothingLength",
          name: "Smoothing Length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "Commodity Channel Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Commodity Channel Index",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t, i) {
        return (e - t) / (0.015 * i);
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.hlc3(this._context),
            s = this._input(0),
            n = this._input(1),
            o = this._input(2);
          this._context.setMinimumAdditionalDepth(s + o);
          var a,
            l = this._context.new_var(i),
            c = r.Std.sma(l, s, this._context),
            h = this._context.new_var(i),
            d = r.Std.dev(h, s, this._context),
            u = this.f_0(i, c, d),
            p = this._context.new_var(u);
          return (
            "EMA" === n
              ? (a = r.Std.ema(p, o, this._context))
              : "WMA" === n
              ? (a = r.Std.wma(p, o, this._context))
              : "SMA" === n && (a = r.Std.sma(p, o, this._context)),
            [u, a]
          );
        });
    },
  },
  {
    name: "Connors RSI",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 70,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 30,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 3,
          in_1: 2,
          in_2: 100,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "CRSI",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Connors RSI",
      shortDescription: "CRSI",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.11,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "RSI Length",
          defval: 3,
          type: "integer",
          min: 1,
        },
        {
          id: "in_1",
          name: "UpDown Length",
          defval: 2,
          type: "integer",
          min: 1,
        },
        {
          id: "in_2",
          name: "ROC Length",
          defval: 100,
          type: "integer",
          min: 1,
        },
      ],
      id: "Connors RSI@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Connors RSI",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      var e;
      (this.f_1 = function (e, t, i) {
        var s = i.new_var(r.Std.max(r.Std.change(e), 0));
        return r.Std.rma(s, t, i);
      }),
        (this.f_2 = function (e, t, i) {
          var s = i.new_var(-r.Std.min(r.Std.change(e), 0));
          return r.Std.rma(s, t, i);
        }),
        (this.f_3 =
          ((e = 0),
          function (t) {
            var i = t.get(0),
              s = t.get(1);
            return (
              (e =
                i === s
                  ? 0
                  : i > s
                  ? r.Std.nz(e) <= 0
                    ? 1
                    : r.Std.nz(e) + 1
                  : r.Std.nz(e) >= 0
                  ? -1
                  : r.Std.nz(e) - 1),
              this._context.new_var(e)
            );
          })),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._context.new_var(i),
            n = this._input(0),
            o = this._input(1),
            a = this._input(2);
          this._context.setMinimumAdditionalDepth(a);
          var l = r.Std.rsi(
              this.f_1(s, n, this._context),
              this.f_2(s, n, this._context)
            ),
            c = this.f_3(s),
            h = r.Std.rsi(
              this.f_1(c, o, this._context),
              this.f_2(c, o, this._context)
            ),
            d = this._context.new_var(r.Std.roc(s, 1)),
            u = r.Std.percentrank(d, a);
          return [r.Std.avg(l, h, u)];
        });
    },
  },
  {
    name: "Coppock Curve",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 10,
          in_1: 14,
          in_2: 11,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Coppock Curve",
      shortDescription: "Coppock Curve",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "WMA Length",
          defval: 10,
          type: "integer",
          min: -1e12,
          max: 5e3,
        },
        {
          id: "in_1",
          name: "Long RoC Length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 4999,
        },
        {
          id: "in_2",
          name: "Short RoC Length",
          defval: 11,
          type: "integer",
          min: 1,
          max: 4999,
        },
      ],
      id: "Coppock Curve@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Coppock Curve",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e + t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = this._input(2);
          this._context.setMinimumAdditionalDepth(i + Math.max(s, n));
          var o = r.Std.close(this._context),
            a = this._context.new_var(o),
            l = r.Std.roc(a, s),
            c = this._context.new_var(o),
            h = r.Std.roc(c, n),
            d = this.f_0(l, h),
            u = this._context.new_var(d);
          return [r.Std.wma(u, i, this._context)];
        });
    },
  },
  {
    name: "Correlation Coeff",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 4,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: "",
          in_1: 20,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Correlation Coefficient",
      shortDescription: "CC",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "sym",
          defval: "",
          type: "symbol",
        },
        {
          id: "in_1",
          name: "length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Correlation Coeff@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Correlation Coeff",
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          this._context.new_sym(this._input(0), r.Std.period(this._context));
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._context.new_unlimited_var(this._context.symbol.time),
            s =
              (this._input(0),
              r.Std.period(this._context),
              r.Std.close(this._context)),
            n = this._input(1);
          this._context.select_sym(1);
          var o = this._context.new_unlimited_var(this._context.symbol.time),
            a = r.Std.close(this._context),
            l = this._context.new_unlimited_var(a);
          this._context.select_sym(0);
          var c = l.adopt(o, i, 0),
            h = this._context.new_var(s),
            d = this._context.new_var(c);
          return [r.Std.correlation(h, d, n, this._context)];
        });
    },
  },
  {
    name: "Correlation - Log",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !1,
      id: "Correlation - Log@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Correlation - Log",
      description: "Correlation - Log",
      shortDescription: "Correlation - Log",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#2196F3",
          },
        },
        inputs: {
          instrument: "",
          instrument2: "",
          periods: 25,
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "instrument",
          name: "Instrument 1",
          type: "symbol",
          defval: "",
          confirm: !0,
        },
        {
          id: "instrument2",
          name: "Instrument 2",
          type: "symbol",
          defval: "",
          confirm: !0,
        },
        {
          id: "periods",
          name: "Periods",
          type: "integer",
          defval: 25,
        },
      ],
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          this._context.new_sym(this._input(0), r.Std.period(this._context)),
          this._context.new_sym(this._input(1), r.Std.period(this._context)),
          (this.period = this._input(2));
      }),
        (this.correlationLog = function (e, t, i, s) {
          var n = r.Std.sma(e, i, s),
            o = r.Std.sma(t, i, s),
            a = s.new_var(e.get() * t.get());
          return (
            (r.Std.sma(a, i, s) - n * o) /
            Math.sqrt(r.Std.variance2(e, n, i) * r.Std.variance2(t, o, i))
          );
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._context.new_var(this._context.symbol.time);
          this._context.select_sym(2);
          var s = this._context.new_var(r.Std.close(this._context)),
            n = this._context.new_var(r.Std.log(s.get() / s.get(1))),
            o = this._context.new_var(this._context.symbol.time);
          this._context.select_sym(1);
          var a = this._context.new_var(this._context.symbol.time),
            l = this._context.new_var(r.Std.close(this._context)),
            c = this._context.new_var(r.Std.log(l.get() / l.get(1))),
            h = this._context.new_var(n.adopt(o, a, 0)),
            d = this._context.new_var(
              this.correlationLog(c, h, this.period, this._context)
            ),
            u = this._context.new_var(d.adopt(a, i, 0)).get(),
            p = r.Std.round(1e3 * u) / 1e3;
          return this._context.select_sym(0), [p];
        });
    },
  },
  {
    name: "Detrended Price Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#43A047",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 21,
          in_1: !1,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "DPO",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
          zorder: 1,
        },
      },
      description: "Detrended Price Oscillator",
      shortDescription: "DPO",
      is_price_study: !1,
      is_hidden_study: !1,
      id: "detrended_price_oscillator@tv-basicstudies-1",
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          isHidden: !1,
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "Period",
          defval: 21,
          type: "integer",
          min: 1,
          max: 1e12,
        },
        {
          id: "in_1",
          name: "isCentered",
          defval: !1,
          type: "bool",
        },
      ],
      scriptIdPart: "",
      name: "Detrended Price Oscillator",
      format: {
        type: "price",
        precision: 2,
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function () {
        var e = this._input(0),
          t = this._input(1),
          i = Math.floor(e / 2 + 1);
        this._context.setMinimumAdditionalDepth(e + i);
        var s = this._context.new_var(r.Std.close(this._context)),
          n = this._context.new_var(r.Std.sma(s, e, this._context)),
          o = this._context.new_var(r.Std.close(this._context)).get(i) - n,
          a = r.Std.close(this._context) - n.get(i);
        return [t ? o : a, t ? -i : 0];
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this.f_0();
          return [
            {
              value: i[0],
              offset: i[1],
            },
          ];
        });
    },
  },
  {
    name: "Directional Movement Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
          plot_3: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#F50057",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FFA726",
          },
          plot_4: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#ab47bc",
          },
        },
        inputs: {
          in_0: 14,
          in_1: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
        {
          id: "plot_3",
          type: "line",
        },
        {
          id: "plot_4",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "+DI",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "-DI",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "DX",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_3: {
          title: "ADX",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_4: {
          title: "ADXR",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Directional Movement",
      shortDescription: "DMI",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "DI Length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "ADX Smoothing",
          defval: 14,
          type: "integer",
          min: 1,
          max: 50,
        },
      ],
      id: "Directional Movement Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Directional Movement Index",
      format: {
        precision: 4,
        type: "price",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._input(0),
          s = this._input(1);
        return (
          this._context.setMinimumAdditionalDepth(2 * i + s),
          r.Std.dmi(i, s, this._context)
        );
      };
    },
  },
  {
    name: "Donchian Channels",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
        },
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 95,
            visible: !0,
          },
        },
        inputs: {
          in_0: 20,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Lower",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Upper",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Basis",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Donchian Channels",
      shortDescription: "DC",
      is_price_study: !0,
      filledAreas: [
        {
          id: "fill_0",
          objAId: "plot_1",
          objBId: "plot_0",
          type: "plot_plot",
          title: "Plots Background",
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Donchian Channels@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Donchian Channels",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._input(0),
          s = r.Std.low(this._context),
          n = this._context.new_var(s),
          o = r.Std.lowest(n, i, this._context),
          a = r.Std.high(this._context),
          l = this._context.new_var(a),
          c = r.Std.highest(l, i, this._context);
        return [o, c, r.Std.avg(c, o)];
      };
    },
  },
  {
    name: "Double Exponential Moving Average",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#43A047",
          },
        },
        inputs: {
          in_0: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Double EMA",
      shortDescription: "DEMA",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "Double Exponential Moving Average@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Double Exponential Moving Average",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return 2 * e - t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0);
          this._context.setMinimumAdditionalDepth(2 * i);
          var s = r.Std.close(this._context),
            n = this._context.new_var(s),
            o = r.Std.ema(n, i, this._context),
            a = this._context.new_var(o),
            l = r.Std.ema(a, i, this._context);
          return [this.f_0(o, l)];
        });
    },
  },
  {
    name: "Ease of Movement",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#43A047",
          },
        },
        inputs: {
          in_0: 1e4,
          in_1: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Ease Of Movement",
      shortDescription: "EOM",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "Divisor",
          defval: 1e4,
          type: "integer",
          min: 1,
          max: 1e9,
        },
        {
          id: "in_1",
          name: "length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Ease of Movement@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Ease of Movement",
      format: {
        type: "volume",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t, i, s, r) {
        return (e * t * (i - s)) / r;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = r.Std.hl2(this._context),
            o = this._context.new_var(n),
            a = r.Std.change(o),
            l = this.f_0(
              i,
              a,
              r.Std.high(this._context),
              r.Std.low(this._context),
              r.Std.volume(this._context)
            ),
            c = this._context.new_var(l);
          return [r.Std.sma(c, s, this._context)];
        });
    },
  },
  {
    name: "Elders Force Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: a,
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 13,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Elder's Force Index",
      shortDescription: "EFI",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 13,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Elders Force Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Elders Force Index",
      format: {
        type: "volume",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e * t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = r.Std.close(this._context),
            n = this._context.new_var(s),
            o = r.Std.change(n),
            a = this.f_0(o, r.Std.volume(this._context)),
            l = this._context.new_var(a);
          return [r.Std.ema(l, i, this._context)];
        });
    },
  },
  {
    name: "EMA Cross",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#43A047",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 4,
            plottype: 3,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 9,
          in_1: 26,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Short",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Long",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Crosses",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "EMA Cross",
      shortDescription: "EMA Cross",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Short",
          defval: 9,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "Long",
          defval: 26,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "EMA Cross@tv-basicstudies-1",
      scriptIdPart: "",
      name: "EMA Cross",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e ? t : r.Std.na();
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = r.Std.close(this._context),
            o = this._context.new_var(n),
            a = r.Std.ema(o, i, this._context),
            l = this._context.new_var(n),
            c = r.Std.ema(l, s, this._context),
            h = a,
            d = c,
            u = r.Std.cross(a, c, this._context);
          return [h, d, this.f_0(u, a)];
        });
    },
  },
  {
    name: "Envelopes",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 95,
            visible: !0,
          },
        },
        inputs: {
          in_0: 20,
          in_1: 10,
          in_2: 10,
          in_3: "Simple",
          in_4: "close",
        },
      },
      plots: [
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Average",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Upper",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Lower",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Envelopes",
      shortDescription: "Envelopes",
      is_price_study: !0,
      filledAreas: [
        {
          id: "fill_0",
          objAId: "plot_1",
          objBId: "plot_2",
          type: "plot_plot",
          title: "Plots Background",
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "Upper Percentage",
          defval: 2,
          type: "float",
          min: 0,
        },
        {
          id: "in_2",
          name: "Lower Percentage",
          defval: 2,
          type: "float",
          min: 0,
        },
        {
          id: "in_3",
          name: "Method",
          type: "text",
          defval: "Simple",
          options: ["Simple", "Exponential", "Weighted"],
        },
        {
          id: "in_4",
          name: "Source",
          defval: "close",
          type: "source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
        },
      ],
      id: "Envelope@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Envelopes",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e * (1 + t);
      }),
        (this.f_1 = function (e, t) {
          return e * (1 - t);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._context.new_var(r.Std[this._input(4)](this._context)),
            s = r.Std.sma(i, this._input(0), this._context);
          return (
            "Exponential" === this._input(3)
              ? (s = r.Std.ema(i, this._input(0), this._context))
              : "Weighted" === this._input(3) &&
                (s = r.Std.wma(i, this._input(0), this._context)),
            [
              this.f_0(s, this._input(1) / 100),
              s,
              this.f_1(s, this._input(2) / 100),
            ]
          );
        });
    },
  },
  {
    name: "Standard Error",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !1,
      id: "Standard Error@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Standard Error",
      description: "Standard Error",
      shortDescription: "Standard Error",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#FF6D00",
          },
        },
        inputs: {
          length: 14,
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "length",
          type: "integer",
          name: "Length",
          min: 3,
        },
      ],
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e), (this._input = t), (this.period = this._input(0));
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          for (
            var i,
              s,
              n = this._context.new_var(r.Std.close(this._context)),
              o = 0,
              a = 0,
              l = 0;
            l < this.period;
            l++
          )
            (o += l + 1), (a += n.get(l));
          (i = o / this.period), (s = a / this.period);
          var c = 0,
            h = 0,
            d = 0;
          for (l = 0; l < this.period; l++)
            (d += Math.pow(s - n.get(l), 2)),
              (h += (i - l - 1) * (s - n.get(l))),
              (c += Math.pow(i - l - 1, 2));
          return (
            (h = Math.pow(h, 2)), [Math.sqrt((d - h / c) / (this.period - 2))]
          );
        });
    },
  },
  {
    name: "Standard Error Bands",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !0,
      id: "Standard Error Bands@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Standard Error Bands",
      description: "Standard Error Bands",
      shortDescription: "Standard Error Bands",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            transparency: 0,
            trackPrice: !1,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            transparency: 0,
            plottype: 0,
            trackPrice: !1,
            color: "#FF6D00",
          },
          plot_2: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            transparency: 0,
            plottype: 0,
            trackPrice: !1,
            color: "#2196F3",
          },
        },
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 95,
            visible: !0,
          },
        },
        inputs: {
          periods: 21,
          errors: 2,
          method: "Simple",
          averagePeriods: 3,
        },
      },
      styles: {
        plot_0: {
          title: "Plot 1",
        },
        plot_1: {
          title: "Plot 2",
        },
        plot_2: {
          title: "Plot 3",
        },
      },
      filledAreas: [
        {
          id: "fill_0",
          objAId: "plot_0",
          objBId: "plot_2",
          type: "plot_plot",
          title: "Background",
        },
      ],
      inputs: [
        {
          id: "periods",
          type: "integer",
          name: "Periods",
        },
        {
          id: "errors",
          type: "float",
          name: "Standard Errors",
        },
        {
          id: "method",
          name: "Method",
          type: "text",
          defval: "Simple",
          options: ["Simple", "Exponential", "Weighted"],
        },
        {
          id: "averagePeriods",
          type: "integer",
          name: "Averaging Periods",
        },
      ],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          (this.period = this._input(0)),
          (this.errorDeviation = this._input(1)),
          (this.maMethod = this._input(2)),
          (this.averagePeriod = this._input(3));
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          for (
            var i,
              s,
              n = this._context.new_var(r.Std.close(this._context)),
              o = 0,
              a = 0,
              l = 0;
            l < this.period;
            l++
          )
            (o += l + 1), (a += n.get(l));
          (i = o / this.period), (s = a / this.period);
          var c = 0,
            h = 0,
            d = 0;
          for (l = 0; l < this.period; l++)
            (d += Math.pow(s - n.get(l), 2)),
              (h += (i - l - 1) * (s - n.get(l))),
              (c += Math.pow(i - l - 1, 2));
          h = Math.pow(h, 2);
          var u,
            p,
            _,
            m = Math.sqrt((d - h / c) / (this.period - 2)),
            g = r.Std.linreg(n, this.period, 0),
            f = this._context.new_var(g + this.errorDeviation * m),
            v = this._context.new_var(g),
            S = this._context.new_var(g - this.errorDeviation * m);
          return (
            "Simple" === this.maMethod
              ? ((u = r.Std.sma(f, this.averagePeriod, this._context)),
                (p = r.Std.sma(v, this.averagePeriod, this._context)),
                (_ = r.Std.sma(S, this.averagePeriod, this._context)))
              : "Exponential" === this.maMethod
              ? ((u = r.Std.ema(f, this.averagePeriod, this._context)),
                (p = r.Std.ema(v, this.averagePeriod, this._context)),
                (_ = r.Std.ema(S, this.averagePeriod, this._context)))
              : ((u = r.Std.wma(f, this.averagePeriod, this._context)),
                (p = r.Std.wma(v, this.averagePeriod, this._context)),
                (_ = r.Std.wma(S, this.averagePeriod, this._context))),
            [u, p, _]
          );
        });
    },
  },
  {
    name: "Fisher Transform",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
        },
        bands: [
          {
            color: "#E91E63",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 1.5,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0.75,
          },
          {
            color: "#E91E63",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: -0.75,
          },
          {
            color: "#E91E63",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: -1.5,
          },
        ],
        inputs: {
          in_0: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Fisher",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
          zorder: 1,
        },
        plot_1: {
          title: "Trigger",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
          zorder: 1.1,
        },
      },
      description: "Fisher Transform",
      shortDescription: "Fisher",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Level",
          isHidden: !1,
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "Level",
          isHidden: !1,
          zorder: -1.11,
        },
        {
          id: "hline_2",
          name: "Level",
          isHidden: !1,
          zorder: -1.111,
        },
        {
          id: "hline_3",
          name: "Level",
          isHidden: !1,
          zorder: -1.1111,
        },
        {
          id: "hline_4",
          name: "Level",
          isHidden: !1,
          zorder: -1.11111,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e12,
        },
      ],
      id: "fisher_transform@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Fisher Transform",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e) {
        var t = r.Std.lt(e, -0.99) ? -0.999 : e;
        return [r.Std.gt(e, 0.99) ? 0.999 : t];
      }),
        (this.f_1 = function () {
          var e = this._input(0),
            t = this._context.new_var(r.Std.hl2(this._context)),
            i = r.Std.highest(t, e, this._context),
            s = this._context.new_var(r.Std.hl2(this._context)),
            n = r.Std.lowest(s, e, this._context),
            o = this._context.new_var(),
            a = this.f_0(
              0.66 *
                ((r.Std.hl2(this._context) - n) / r.Std.max(i - n, 0.001) -
                  0.5) +
                0.67 * r.Std.nz(o.get(1))
            );
          o.set(a[0]);
          var l = this._context.new_var();
          l.set(
            0.5 * r.Std.log((1 + o.get(0)) / r.Std.max(1 - o.get(0), 0.001)) +
              0.5 * r.Std.nz(l.get(1))
          );
          var c = l.get(1);
          return [l.get(0), c];
        }),
        (this.main = function (e, t) {
          return (this._context = e), (this._input = t), this.f_1();
        });
    },
  },
  {
    name: "Historical Volatility",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 10,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "Historical Volatility",
      shortDescription: "HV",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 10,
          type: "integer",
          min: 1,
          max: 1e12,
        },
      ],
      id: "historical_volatility@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Historical Volatility",
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function () {
        var e = this._input(0),
          t = r.Std.or(
            r.Std.isintraday(this._context),
            r.Std.and(
              r.Std.isdaily(this._context),
              r.Std.eq(r.Std.interval(this._context), 1)
            )
          )
            ? 1
            : 7,
          i = this._context.new_var(r.Std.close(this._context)),
          s = this._context.new_var(
            r.Std.log(r.Std.close(this._context) / i.get(1))
          );
        return [100 * r.Std.stdev(s, e, this._context) * r.Std.sqrt(365 / t)];
      }),
        (this.main = function (e, t) {
          return (this._context = e), (this._input = t), this.f_0();
        });
    },
  },
  {
    name: "Hull MA",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Hull Moving Average",
      shortDescription: "HMA",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "Hull MA@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Hull MA",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return 2 * e - t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._input(0),
            n = s / 2;
          this._context.setMinimumAdditionalDepth(Math.ceil(s + n));
          var o = this._context.new_var(i),
            a = r.Std.wma(o, n, this._context),
            l = this._context.new_var(i),
            c = r.Std.wma(l, s, this._context),
            h = this.f_0(a, c),
            d = r.Std.sqrt(s),
            u = r.Std.round(d),
            p = this._context.new_var(h);
          return [r.Std.wma(p, u, this._context)];
        });
    },
  },
  {
    name: "Ichimoku Cloud",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: l,
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#43A047",
          },
          plot_3: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#A5D6A7",
          },
          plot_4: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: o,
          },
        },
        palettes: {
          palette_0: {
            colors: {
              0: {
                color: "#43A047",
                width: 1,
                style: 0,
              },
              1: {
                color: a,
                width: 1,
                style: 0,
              },
            },
          },
        },
        filledAreasStyle: {
          fill_0: {
            color: "#000080",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 9,
          in_1: 26,
          in_2: 52,
          in_3: 26,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
        {
          id: "plot_3",
          type: "line",
        },
        {
          id: "plot_4",
          type: "line",
        },
        {
          id: "plot_5",
          palette: "palette_0",
          target: "fill_0",
          type: "colorer",
        },
      ],
      styles: {
        plot_0: {
          title: "Conversion Line",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
        plot_1: {
          title: "Base Line",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
        plot_2: {
          title: "Lagging Span",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
        plot_3: {
          title: "Leading Span A",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
        plot_4: {
          title: "Leading Span B",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "Ichimoku Cloud",
      shortDescription: "Ichimoku",
      is_price_study: !0,
      is_hidden_study: !1,
      id: "Ichimoku Cloud@tv-basicstudies-1",
      palettes: {
        palette_0: {
          colors: {
            0: {
              name: "Color 0",
            },
            1: {
              name: "Color 1",
            },
          },
          valToIndex: {
            0: 0,
            1: 1,
          },
        },
      },
      filledAreas: [
        {
          id: "fill_0",
          objAId: "plot_3",
          objBId: "plot_4",
          type: "plot_plot",
          title: "Plots Background",
          isHidden: !1,
          palette: "palette_0",
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "Conversion Line Periods",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e12,
        },
        {
          id: "in_1",
          name: "Base Line Periods",
          defval: 26,
          type: "integer",
          min: 1,
          max: 1e12,
        },
        {
          id: "in_2",
          name: "Leading Span B",
          defval: 52,
          type: "integer",
          min: 1,
          max: 1e12,
        },
        {
          id: "in_3",
          name: "Lagging Span",
          defval: 26,
          type: "integer",
          min: 1,
          max: 1e12,
        },
      ],
      scriptIdPart: "",
      name: "Ichimoku Cloud",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.donchian = function (e) {
        var t = this._context.new_var(r.Std.low(this._context)),
          i = this._context.new_var(r.Std.high(this._context));
        return r.Std.avg(
          r.Std.lowest(t, e, this._context),
          r.Std.highest(i, e, this._context)
        );
      }),
        (this.f_1 = function () {
          var e = this._input(0),
            t = this._input(1),
            i = this._input(2),
            s = this._input(3),
            n = this.donchian(e),
            o = this.donchian(t),
            a = r.Std.avg(n, o),
            l = this.donchian(i);
          return [
            n,
            o,
            r.Std.close(this._context),
            a,
            l,
            1 - s,
            s - 1,
            s - 1,
            r.Std.gt(a, l) ? 0 : 1,
          ];
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this.f_1();
          return [
            i[0],
            i[1],
            {
              value: i[2],
              offset: i[5],
            },
            {
              value: i[3],
              offset: i[6],
            },
            {
              value: i[4],
              offset: i[7],
            },
            i[8],
          ];
        });
    },
  },
  {
    name: "Keltner Channels",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 95,
            visible: !0,
          },
        },
        inputs: {
          in_0: !0,
          in_1: 20,
          in_2: 1,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Upper",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Middle",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Lower",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Keltner Channels",
      shortDescription: "KC",
      is_price_study: !0,
      filledAreas: [
        {
          id: "fill_0",
          objAId: "plot_0",
          objBId: "plot_2",
          type: "plot_plot",
          title: "Plots Background",
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "useTrueRange",
          defval: !0,
          type: "bool",
        },
        {
          id: "in_1",
          name: "length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_2",
          name: "mult",
          defval: 1,
          type: "float",
          min: -1e12,
          max: 1e12,
        },
      ],
      id: "Keltner Channels@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Keltner Channels",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t, i, s) {
        return e ? t : i - s;
      }),
        (this.f_1 = function (e, t, i) {
          return e + t * i;
        }),
        (this.f_2 = function (e, t, i) {
          return e - t * i;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._input(0),
            n = this._input(1),
            o = this._input(2),
            a = this._context.new_var(i),
            l = r.Std.ema(a, n, this._context),
            c = this.f_0(
              s,
              r.Std.tr(this._context),
              r.Std.high(this._context),
              r.Std.low(this._context)
            ),
            h = this._context.new_var(c),
            d = r.Std.ema(h, n, this._context);
          return [this.f_1(l, d, o), l, this.f_2(l, d, o)];
        });
    },
  },
  {
    name: "Klinger Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#43A047",
          },
        },
        inputs: {},
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Signal",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Klinger Oscillator",
      shortDescription: "Klinger Oscillator",
      is_price_study: !1,
      inputs: [],
      id: "Klinger Oscillator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Klinger Oscillator",
      format: {
        type: "volume",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return r.Std.ge(e, 0) ? t : -t;
      }),
        (this.f_1 = function (e, t) {
          return e - t;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.hlc3(this._context);
          this._context.setMinimumAdditionalDepth(66);
          var s = this._context.new_var(i),
            n = r.Std.change(s),
            o = this.f_0(n, r.Std.volume(this._context)),
            a = this._context.new_var(o),
            l = r.Std.ema(a, 34, this._context),
            c = this._context.new_var(o),
            h = r.Std.ema(c, 55, this._context),
            d = this.f_1(l, h),
            u = this._context.new_var(d);
          return [d, r.Std.ema(u, 13, this._context)];
        });
    },
  },
  {
    name: "Know Sure Thing",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: u,
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: a,
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 10,
          in_1: 15,
          in_2: 20,
          in_3: 30,
          in_4: 10,
          in_5: 10,
          in_6: 10,
          in_7: 15,
          in_8: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "KST",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1.1,
        },
        plot_1: {
          title: "Signal",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1.11,
        },
      },
      description: "Know Sure Thing",
      shortDescription: "KST",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "roclen1",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "roclen2",
          defval: 15,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_2",
          name: "roclen3",
          defval: 20,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_3",
          name: "roclen4",
          defval: 30,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_4",
          name: "smalen1",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_5",
          name: "smalen2",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_6",
          name: "smalen3",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_7",
          name: "smalen4",
          defval: 15,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_8",
          name: "siglen",
          defval: 9,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Know Sure Thing@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Know Sure Thing",
      format: {
        type: "price",
        precision: 4,
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t, i, s) {
        return e + 2 * t + 3 * i + 4 * s;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = this._input(2),
            o = this._input(3),
            a = this._input(4),
            l = this._input(5),
            c = this._input(6),
            h = this._input(7),
            d = this._input(8);
          this._context.setMinimumAdditionalDepth(
            Math.max(a + i, l + s, c + n, h + o) + d
          );
          var u = r.Std.close(this._context),
            p = i,
            _ = this._context.new_var(u),
            m = r.Std.roc(_, p),
            g = a,
            f = this._context.new_var(m),
            v = r.Std.sma(f, g, this._context),
            S = s,
            y = this._context.new_var(u),
            b = r.Std.roc(y, S),
            w = l,
            P = this._context.new_var(b),
            C = r.Std.sma(P, w, this._context),
            x = n,
            T = this._context.new_var(u),
            I = r.Std.roc(T, x),
            M = c,
            A = this._context.new_var(I),
            L = r.Std.sma(A, M, this._context),
            k = o,
            E = this._context.new_var(u),
            D = r.Std.roc(E, k),
            V = h,
            B = this._context.new_var(D),
            R = r.Std.sma(B, V, this._context),
            N = this.f_0(v, C, L, R),
            O = this._context.new_var(N);
          return [N, r.Std.sma(O, d, this._context)];
        });
    },
  },
  {
    name: "Least Squares Moving Average",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 25,
          in_1: 0,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Least Squares Moving Average",
      shortDescription: "LSMA",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 25,
          type: "integer",
          min: 1,
          max: 1e12,
        },
        {
          id: "in_1",
          name: "Offset",
          defval: 0,
          type: "integer",
          min: -1e12,
          max: 1e12,
        },
      ],
      id: "Least Squares Moving Average@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Least Squares Moving Average",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._input(0),
          s = this._input(1),
          n = r.Std.close(this._context),
          o = this._context.new_var(n);
        return [r.Std.linreg(o, i, s)];
      };
    },
  },
  {
    name: "Linear Regression Curve",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Linear Regression Curve",
      shortDescription: "LRC",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Linear Regression Curve@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Linear Regression Curve",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = r.Std.close(this._context),
          s = this._input(0),
          n = this._context.new_var(i);
        return [r.Std.linreg(n, s, 0)];
      };
    },
  },
  {
    name: "Linear Regression Slope",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !1,
      id: "Linear Regression Slope@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Linear Regression Slope",
      description: "Linear Regression Slope",
      shortDescription: "Linear Regression Slope",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: c,
          },
        },
        inputs: {
          periods: 14,
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "periods",
          type: "integer",
          name: "Periods",
          min: 2,
        },
      ],
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e), (this._input = t), (this.period = this._input(0));
      }),
        (this.linregSlope = function (e, t, i) {
          var s,
            r,
            n,
            o = 0,
            a = 0,
            l = 0,
            c = 0;
          for (s = 0; s < t; ++s)
            (o += n = t - 1 - s + 1),
              (a += r = e.get(s)),
              (l += n * n),
              (c += r * n);
          return (t * c - o * a) / (t * l - o * o);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._context.new_var(r.Std.close(this._context));
          return [this.linregSlope(i, this.period, 0)];
        });
    },
  },
  {
    name: "MA Cross",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#43A047",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 4,
            plottype: 3,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 9,
          in_1: 26,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Short",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Long",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Crosses",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "MA Cross",
      shortDescription: "MA Cross",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Short",
          defval: 9,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "Long",
          defval: 26,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "MA Cross@tv-basicstudies-1",
      scriptIdPart: "",
      name: "MA Cross",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e ? t : r.Std.na();
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = r.Std.close(this._context),
            o = this._context.new_var(n),
            a = r.Std.sma(o, i, this._context),
            l = this._context.new_var(n),
            c = r.Std.sma(l, s, this._context),
            h = a,
            d = c,
            u = r.Std.cross(a, c, this._context);
          return [h, d, this.f_0(u, a)];
        });
    },
  },
  {
    name: "MA with EMA Cross",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#43A047",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 4,
            plottype: 3,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 10,
          in_1: 10,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "MA",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "EMA",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Crosses",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "MA with EMA Cross",
      shortDescription: "MA/EMA Cross",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Length MA",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "Length EMA",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "MA with EMA Cross@tv-basicstudies-1",
      scriptIdPart: "",
      name: "MA with EMA Cross",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e ? t : r.Std.na();
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = r.Std.close(this._context),
            o = this._context.new_var(n),
            a = r.Std.sma(o, i, this._context),
            l = this._context.new_var(n),
            c = r.Std.ema(l, s, this._context),
            h = a,
            d = c,
            u = r.Std.cross(a, c, this._context);
          return [h, d, this.f_0(u, a)];
        });
    },
  },
  {
    name: "Mass Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 10,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Mass Index",
      shortDescription: "Mass Index",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Mass Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Mass Index",
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e - t;
      }),
        (this.f_1 = function (e, t) {
          return e / t;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this.f_0(r.Std.high(this._context), r.Std.low(this._context)),
            n = this._context.new_var(s),
            o = r.Std.ema(n, 9, this._context),
            a = this._context.new_var(o),
            l = r.Std.ema(a, 9, this._context),
            c = this.f_1(o, l),
            h = this._context.new_var(c);
          return [r.Std.sum(h, i, this._context)];
        });
    },
  },
  {
    name: "McGinley Dynamic",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "McGinley Dynamic",
      shortDescription: "McGinley Dynamic",
      is_price_study: !0,
      is_hidden_study: !1,
      id: "mcginley_dynamic@tv-basicstudies-1",
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 1e12,
        },
      ],
      scriptIdPart: "",
      name: "McGinley Dynamic",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function () {
        var e = this._input(0),
          t = r.Std.close(this._context),
          i = this._context.new_var(t),
          s = r.Std.ema(i, e, this._context),
          n = this._context.new_var(),
          o = n.get(1) + (t - n.get(1)) / (e * r.Std.pow(t / n.get(1), 4));
        return n.set(r.Std.na(n.get(1)) ? s : o), [n.get(0)];
      }),
        (this.main = function (e, t) {
          return (this._context = e), (this._input = t), this.f_0();
        });
    },
  },
  {
    name: "Median Price",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      id: "Median Price@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Median Price",
      description: "Median Price",
      shortDescription: "Median Price",
      is_price_study: !0,
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#FF6D00",
          },
        },
        inputs: {},
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        return (
          (this._context = e), (this._input = t), [r.Std.hl2(this._context)]
        );
      };
    },
  },
  {
    name: "Momentum",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 10,
          in_1: "close",
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Mom",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
          zorder: 0,
        },
      },
      description: "Momentum",
      shortDescription: "Mom",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "Source",
          defval: "close",
          type: "source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
        },
      ],
      id: "Momentum@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Momentum",
      format: {
        type: "inherit",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._input(0),
          s = r.Std[this._input(1)](this._context),
          n = this._context.new_var(s).get(i);
        return [n ? s - n : null];
      };
    },
  },
  {
    name: "Money Flow Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#7E57C2",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 80,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 20,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#7E57C2",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Money Flow Index",
      shortDescription: "MFI",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.11,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Money Flow@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Money Flow Index",
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t, i) {
        return e * (r.Std.le(t, 0) ? 0 : i);
      }),
        (this.f_1 = function (e, t, i) {
          return e * (r.Std.ge(t, 0) ? 0 : i);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = r.Std.hlc3(this._context),
            n = this._context.new_var(s),
            o = r.Std.change(n),
            a = this.f_0(r.Std.volume(this._context), o, s),
            l = this._context.new_var(a),
            c = r.Std.sum(l, i, this._context),
            h = this.f_1(r.Std.volume(this._context), o, s),
            d = this._context.new_var(h),
            u = r.Std.sum(d, i, this._context);
          return [r.Std.rsi(c, u)];
        });
    },
  },
  {
    name: "Moving Average",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          smoothedMA: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !1,
          },
        },
        inputs: {
          symbol: "",
          length: 9,
          source: "close",
          offset: 0,
          smoothingLine: "SMA",
          smoothingLength: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "smoothedMA",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
        smoothedMA: {
          title: "Smoothed MA",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Moving Average",
      shortDescription: "MA",
      is_price_study: !0,
      inputs: [
        {
          id: "symbol",
          name: "Other Symbol",
          defval: "",
          type: "symbol",
          optional: !0,
          isHidden: !1,
        },
        {
          id: "length",
          name: "Length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "source",
          name: "Source",
          defval: "close",
          type: "source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
        },
        {
          id: "offset",
          name: "Offset",
          defval: 0,
          type: "integer",
          min: -1e4,
          max: 1e4,
        },
        {
          id: "smoothingLine",
          name: "Smoothing Line",
          defval: "SMA",
          type: "text",
          options: ["SMA", "EMA", "WMA"],
        },
        {
          id: "smoothingLength",
          name: "Smoothing Length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "Moving Average@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Moving Average",
      format: {
        type: "inherit",
      },
      symbolSource: {
        type: "symbolInputSymbolSource",
        inputId: "symbol",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          "" !== t(0) &&
            this._context.new_sym(t(0), r.Std.period(this._context));
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._context.new_var(this._context.symbol.time),
            s = r.Std[this._input(2)](this._context),
            n = this._input(1),
            o = this._input(3),
            a = this._input(4),
            l = this._input(5);
          if (
            (this._context.setMinimumAdditionalDepth(n + l),
            "" !== this._input(0))
          ) {
            this._context.select_sym(1);
            var c = this._context.new_var(this._context.symbol.time),
              h = r.Std[this._input(2)](this._context);
            (s = this._context.new_var(h).adopt(c, i, 1)),
              this._context.select_sym(0);
          }
          var d,
            u = this._context.new_var(s),
            p = r.Std.sma(u, n, this._context),
            _ = this._context.new_var(p);
          return (
            "EMA" === a
              ? (d = r.Std.ema(_, l, this._context))
              : "WMA" === a
              ? (d = r.Std.wma(_, l, this._context))
              : "SMA" === a && (d = r.Std.sma(_, l, this._context)),
            [
              {
                value: p,
                offset: o,
              },
              {
                value: d,
                offset: o,
              },
            ]
          );
        });
    },
  },
  {
    name: "Moving Average Channel",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
        },
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 20,
          in_1: 20,
          in_2: 0,
          in_3: 0,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Upper",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Lower",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      filledAreas: [
        {
          id: "fill_0",
          objAId: "plot_0",
          objBId: "plot_1",
          type: "plot_plot",
          title: "Plots Background",
        },
      ],
      description: "Moving Average Channel",
      shortDescription: "MAC",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Upper Length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_1",
          name: "Lower Length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_2",
          name: "Upper Offset",
          defval: 0,
          type: "integer",
          min: -1e4,
          max: 1e4,
        },
        {
          id: "in_3",
          name: "Lower Offset",
          defval: 0,
          type: "integer",
          min: -1e4,
          max: 1e4,
        },
      ],
      id: "Moving Average Channel@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Moving Average Channel",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = r.Std.high(this._context),
          s = r.Std.low(this._context),
          n = this._input(0),
          o = this._input(1),
          a = this._input(2),
          l = this._input(3),
          c = this._context.new_var(i),
          h = this._context.new_var(s);
        return [
          {
            value: r.Std.sma(c, n, this._context),
            offset: a,
          },
          {
            value: r.Std.sma(h, o, this._context),
            offset: l,
          },
        ];
      };
    },
  },
  {
    name: "Moving Average Convergence/Divergence",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 5,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: c,
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
        },
        palettes: {
          palette_0: {
            colors: {
              0: {
                color: d,
                width: 1,
                style: 0,
              },
              1: {
                color: h,
                width: 1,
                style: 0,
              },
              2: {
                color: n,
                width: 1,
                style: 0,
              },
              3: {
                color: "#FF5252",
                width: 1,
                style: 0,
              },
            },
          },
        },
        inputs: {
          in_0: 12,
          in_1: 26,
          in_3: "close",
          in_2: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
        {
          id: "plot_3",
          palette: "palette_0",
          target: "plot_0",
          type: "colorer",
        },
      ],
      styles: {
        plot_0: {
          title: "Histogram",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "MACD",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Signal",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "MACD",
      shortDescription: "MACD",
      is_price_study: !1,
      palettes: {
        palette_0: {
          colors: {
            0: {
              name: "Color 0",
            },
            1: {
              name: "Color 1",
            },
            2: {
              name: "Color 2",
            },
            3: {
              name: "Color 3",
            },
          },
        },
      },
      inputs: [
        {
          id: "in_0",
          name: "fastLength",
          defval: 12,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "slowLength",
          defval: 26,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_3",
          name: "Source",
          defval: "close",
          type: "source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
        },
        {
          id: "in_2",
          name: "signalLength",
          defval: 9,
          type: "integer",
          min: 1,
          max: 50,
        },
      ],
      id: "Moving Average Convergence/Divergence@tv-basicstudies-1",
      scriptIdPart: "",
      name: "MACD",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e - t;
      }),
        (this.f_1 = function (e) {
          var t = e > 0 ? 1 : 3,
            i = r.Std.change(this._context.new_var(e));
          return t - (r.Std.le(i, 0) ? 0 : 1);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std[this._input(2)](this._context),
            s = this._input(0),
            n = this._input(1),
            o = this._input(3);
          this._context.setMinimumAdditionalDepth(Math.max(s, n) + o);
          var a = this._context.new_var(i),
            l = r.Std.ema(a, s, this._context),
            c = this._context.new_var(i),
            h = r.Std.ema(c, n, this._context),
            d = this.f_0(l, h),
            u = this._context.new_var(d),
            p = r.Std.ema(u, o, this._context),
            _ = this.f_0(d, p);
          return [_, d, p, this.f_1(_)];
        });
    },
  },
  {
    name: "Moving Average Exponential",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          smoothedMA: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !1,
          },
        },
        inputs: {
          length: 9,
          source: "close",
          offset: 0,
          smoothingLine: "SMA",
          smoothingLength: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "smoothedMA",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
        smoothedMA: {
          title: "Smoothed MA",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Moving Average Exponential",
      shortDescription: "EMA",
      is_price_study: !0,
      inputs: [
        {
          id: "length",
          name: "Length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "source",
          name: "Source",
          defval: "close",
          type: "source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
        },
        {
          id: "offset",
          name: "Offset",
          defval: 0,
          type: "integer",
          min: -1e4,
          max: 1e4,
        },
        {
          id: "smoothingLine",
          name: "Smoothing Line",
          defval: "SMA",
          type: "text",
          options: ["SMA", "EMA", "WMA"],
        },
        {
          id: "smoothingLength",
          name: "Smoothing Length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "Moving Average Exponential@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Moving Average Exponential",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = r.Std[this._input(1)](this._context),
          s = this._input(0),
          n = this._input(2),
          o = this._input(3),
          a = this._input(4);
        this._context.setMinimumAdditionalDepth(s + a);
        var l,
          c = this._context.new_var(i),
          h = r.Std.ema(c, s, this._context),
          d = this._context.new_var(h);
        return (
          "EMA" === o
            ? (l = r.Std.ema(d, a, this._context))
            : "WMA" === o
            ? (l = r.Std.wma(d, a, this._context))
            : "SMA" === o && (l = r.Std.sma(d, a, this._context)),
          [
            {
              value: h,
              offset: n,
            },
            {
              value: l,
              offset: n,
            },
          ]
        );
      };
    },
  },
  {
    name: "Moving Average Weighted",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 9,
          in_1: "close",
          in_2: 0,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Moving Average Weighted",
      shortDescription: "WMA",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "Source",
          defval: "close",
          type: "source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
        },
        {
          id: "in_2",
          name: "Offset",
          defval: 0,
          type: "integer",
          min: -1e4,
          max: 1e4,
        },
      ],
      id: "Moving Average Weighted@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Moving Average Weighted",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = r.Std[this._input(1)](this._context),
          s = this._input(0),
          n = this._input(2),
          o = this._context.new_var(i);
        return [
          {
            value: r.Std.wma(o, s, this._context),
            offset: n,
          },
        ];
      };
    },
  },
  {
    name: "Moving Average Double",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      id: "Moving Average Double@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Moving Average Double",
      description: "Moving Average Double",
      shortDescription: "Moving Average Double",
      is_price_study: !0,
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#FF6D00",
          },
          plot_1: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#2196F3",
          },
        },
        inputs: {
          firstPeriods: 14,
          secondPeriods: 21,
          method: "Simple",
        },
      },
      styles: {
        plot_0: {
          title: "Plot 1",
        },
        plot_1: {
          title: "Plot 2",
        },
      },
      inputs: [
        {
          id: "firstPeriods",
          name: "1st Period",
          type: "integer",
          defval: 14,
          min: 1,
          max: 1e4,
        },
        {
          id: "secondPeriods",
          name: "2nd Period",
          type: "integer",
          defval: 21,
          min: 1,
          max: 1e4,
        },
        {
          id: "method",
          name: "Method",
          type: "text",
          defval: "Simple",
          options: ["Simple", "Exponential", "Weighted"],
        },
      ],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i,
          s,
          n = this._context.new_var(r.Std.close(this._context));
        return (
          "Exponential" === this._input(2)
            ? ((i = r.Std.ema(n, this._input(0), this._context)),
              (s = r.Std.ema(n, this._input(1), this._context)))
            : "Weighted" === this._input(2)
            ? ((i = r.Std.wma(n, this._input(0), this._context)),
              (s = r.Std.wma(n, this._input(1), this._context)))
            : ((i = r.Std.sma(n, this._input(0), this._context)),
              (s = r.Std.sma(n, this._input(1), this._context))),
          [i, s]
        );
      };
    },
  },
  {
    name: "Moving Average Triple",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !0,
      id: "Moving Average Triple@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Moving Average Triple",
      description: "Moving Average Triple",
      shortDescription: "Moving Average Triple",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            transparency: 0,
            trackPrice: !1,
            color: "#FF6D00",
          },
          plot_1: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            transparency: 0,
            plottype: 0,
            trackPrice: !1,
            color: "#2196F3",
          },
          plot_2: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            transparency: 0,
            plottype: 0,
            trackPrice: !1,
            color: "#26C6DA",
          },
        },
        inputs: {
          firstPeriods: 14,
          secondPeriods: 21,
          thirdPeriods: 35,
          method: "Simple",
        },
      },
      styles: {
        plot_0: {
          title: "Plot 1",
        },
        plot_1: {
          title: "Plot 2",
        },
        plot_2: {
          title: "Plot 3",
        },
      },
      inputs: [
        {
          id: "firstPeriods",
          name: "1st Period",
          type: "integer",
          defval: 14,
          min: 1,
          max: 1e4,
        },
        {
          id: "secondPeriods",
          name: "2nd Period",
          type: "integer",
          defval: 21,
          min: 1,
          max: 1e4,
        },
        {
          id: "thirdPeriods",
          name: "3rd Period",
          type: "integer",
          defval: 35,
          min: 1,
          max: 1e4,
        },
        {
          id: "method",
          name: "Method",
          type: "text",
          defval: "Simple",
          options: ["Simple", "Exponential", "Weighted"],
        },
      ],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i,
          s,
          n,
          o = this._context.new_var(r.Std.close(this._context));
        return (
          "Exponential" === this._input(3)
            ? ((i = r.Std.ema(o, this._input(0), this._context)),
              (s = r.Std.ema(o, this._input(1), this._context)),
              (n = r.Std.ema(o, this._input(2), this._context)))
            : "Weighted" === this._input(3)
            ? ((i = r.Std.wma(o, this._input(0), this._context)),
              (s = r.Std.wma(o, this._input(1), this._context)),
              (n = r.Std.wma(o, this._input(2), this._context)))
            : ((i = r.Std.sma(o, this._input(0), this._context)),
              (s = r.Std.sma(o, this._input(1), this._context)),
              (n = r.Std.sma(o, this._input(2), this._context))),
          [i, s, n]
        );
      };
    },
  },
  {
    name: "Moving Average Adaptive",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !0,
      id: "Moving Average Adaptive@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Moving Average Adaptive",
      description: "Moving Average Adaptive",
      shortDescription: "Moving Average Adaptive",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            transparency: 0,
            trackPrice: !1,
            color: "#AB47BC",
          },
        },
        inputs: {
          periods: 10,
        },
      },
      styles: {
        plot_0: {
          title: "Plot 1",
        },
      },
      inputs: [
        {
          id: "periods",
          name: "Period",
          type: "integer",
          defval: 10,
          min: 2,
          max: 1e4,
        },
      ],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e), (this._input = t), (this.periods = this._input(0));
      }),
        (this.ama = function (e, t) {
          var i = this.periods,
            s = this._context.new_var(),
            n = e.get(),
            o = r.Std.stdev(t, i, this._context),
            a = r.Std.log(n / e.get(i)) / (o * Math.sqrt(i)),
            l = 0.1 * Math.abs(a),
            c = (n - s.get(1)) * l + s.get(1);
          return s.set(isNaN(c) ? n : c), c;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._context.new_var(r.Std.close(this._context)),
            s = this._context.new_var(r.Std.log(i.get() / i.get(1)));
          return [this.ama(i, s)];
        });
    },
  },
  {
    name: "Moving Average Hamming",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !0,
      id: "Moving Average Hamming@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Moving Average Hamming",
      description: "Moving Average Hamming",
      shortDescription: "Moving Average Hamming",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            transparency: 0,
            trackPrice: !1,
            color: "#4CAF50",
          },
        },
        inputs: {
          periods: 10,
        },
      },
      styles: {
        plot_0: {
          title: "Plot 1",
        },
      },
      inputs: [
        {
          id: "periods",
          name: "Period",
          type: "integer",
          defval: 10,
          min: 1,
          max: 1e4,
        },
      ],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e), (this._input = t), (this.periods = this._input(0));
        for (var i = [], s = 0, r = 1; r <= this.periods; ++r) {
          var n = Math.sin((((1 + r) / this.periods) * Math.PI) / 2);
          i.unshift(n), (s += n);
        }
        (this.hmaFactors = i), (this.hmaFactorsSum = s);
      }),
        (this.hma = function (e) {
          for (var t = this.periods, i = 0, s = 0; s < t; ++s)
            i += e.get(t - s - 1) * this.hmaFactors[s];
          return (i /= this.hmaFactorsSum);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._context.new_var(r.Std.close(this._context));
          return [this.hma(i)];
        });
    },
  },
  {
    name: "Moving Average Multiple",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !0,
      id: "Moving Average Multiple@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Moving Average Multiple",
      description: "Moving Average Multiple",
      shortDescription: "Moving Average Multiple",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
        {
          id: "plot_3",
          type: "line",
        },
        {
          id: "plot_4",
          type: "line",
        },
        {
          id: "plot_5",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            transparency: 0,
            trackPrice: !1,
            color: "#9C27B0",
          },
          plot_1: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            transparency: 0,
            plottype: 0,
            trackPrice: !1,
            color: "#FF6D00",
          },
          plot_2: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            transparency: 0,
            plottype: 0,
            trackPrice: !1,
            color: "#43A047",
          },
          plot_3: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            transparency: 0,
            plottype: 0,
            trackPrice: !1,
            color: "#26C6DA",
          },
          plot_4: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            transparency: 0,
            plottype: 0,
            trackPrice: !1,
            color: "#F50057",
          },
          plot_5: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            transparency: 0,
            plottype: 0,
            trackPrice: !1,
            color: "#2196F3",
          },
        },
        inputs: {
          firstPeriods: 14,
          secondPeriods: 21,
          thirdPeriods: 35,
          fourthPeriods: 50,
          fifthPeriods: 100,
          sixthPeriods: 200,
          method: "Simple",
        },
      },
      styles: {
        plot_0: {
          title: "Plot 1",
        },
        plot_1: {
          title: "Plot 2",
        },
        plot_2: {
          title: "Plot 3",
        },
        plot_3: {
          title: "Plot 4",
        },
        plot_4: {
          title: "Plot 5",
        },
        plot_5: {
          title: "Plot 6",
        },
      },
      inputs: [
        {
          id: "firstPeriods",
          name: "1st Period",
          type: "integer",
          defval: 14,
          min: 1,
          max: 1e4,
        },
        {
          id: "secondPeriods",
          name: "2nd Period",
          type: "integer",
          defval: 21,
          min: 1,
          max: 1e4,
        },
        {
          id: "thirdPeriods",
          name: "3rd Period",
          type: "integer",
          defval: 35,
          min: 1,
          max: 1e4,
        },
        {
          id: "fourthPeriods",
          name: "4th Period",
          type: "integer",
          defval: 50,
          min: 1,
          max: 1e4,
        },
        {
          id: "fifthPeriods",
          name: "5th Period",
          type: "integer",
          defval: 100,
          min: 1,
          max: 1e4,
        },
        {
          id: "sixthPeriods",
          name: "6th Period",
          type: "integer",
          defval: 200,
          min: 1,
          max: 1e4,
        },
        {
          id: "method",
          name: "Method",
          type: "text",
          defval: "Simple",
          options: ["Simple", "Exponential", "Weighted"],
        },
      ],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i,
          s,
          n,
          o,
          a,
          l,
          c = this._context.new_var(r.Std.close(this._context));
        return (
          "Exponential" === this._input(6)
            ? ((i = r.Std.ema(c, this._input(0), this._context)),
              (s = r.Std.ema(c, this._input(1), this._context)),
              (n = r.Std.ema(c, this._input(2), this._context)),
              (o = r.Std.ema(c, this._input(3), this._context)),
              (a = r.Std.ema(c, this._input(4), this._context)),
              (l = r.Std.ema(c, this._input(5), this._context)))
            : "Weighted" === this._input(6)
            ? ((i = r.Std.wma(c, this._input(0), this._context)),
              (s = r.Std.wma(c, this._input(1), this._context)),
              (n = r.Std.wma(c, this._input(2), this._context)),
              (o = r.Std.wma(c, this._input(3), this._context)),
              (a = r.Std.wma(c, this._input(4), this._context)),
              (l = r.Std.wma(c, this._input(5), this._context)))
            : ((i = r.Std.sma(c, this._input(0), this._context)),
              (s = r.Std.sma(c, this._input(1), this._context)),
              (n = r.Std.sma(c, this._input(2), this._context)),
              (o = r.Std.sma(c, this._input(3), this._context)),
              (a = r.Std.sma(c, this._input(4), this._context)),
              (l = r.Std.sma(c, this._input(5), this._context))),
          [i, s, n, o, a, l]
        );
      };
    },
  },
  {
    name: "Majority Rule",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !1,
      id: "Majority Rule@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Majority Rule",
      description: "Majority Rule",
      shortDescription: "Majority Rule",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: c,
          },
        },
        inputs: {
          rollingPeriod: 14,
        },
      },
      styles: {
        plot_0: {
          title: "Majority Rule",
        },
      },
      inputs: [
        {
          id: "rollingPeriod",
          type: "integer",
          name: "Rolling Period",
          min: 1,
        },
      ],
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          (this.rollingPeriod = this._input(0));
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i,
            s = r.Std.close(this._context);
          return (
            (i = s > this._context.new_var(s).get(1) ? 1 : 0),
            [
              100 *
                r.Std.sma(
                  this._context.new_var(i),
                  this.rollingPeriod,
                  this._context
                ),
            ]
          );
        });
    },
  },
  {
    name: "Net Volume",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {},
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Net Volume",
      shortDescription: "Net Volume",
      is_price_study: !1,
      inputs: [],
      id: "Net Volume@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Net Volume",
      format: {
        type: "volume",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t, i) {
        return r.Std.gt(e, 0) ? t : r.Std.lt(i, 0) ? -t : 0 * t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._context.new_var(i),
            n = r.Std.change(s);
          return [this.f_0(n, r.Std.volume(this._context), n)];
        });
    },
  },
  {
    name: "On Balance Volume",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          smoothedMA: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !1,
          },
        },
        inputs: {
          smoothingLine: "SMA",
          smoothingLength: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "smoothedMA",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
        smoothedMA: {
          title: "Smoothed MA",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "On Balance Volume",
      shortDescription: "OBV",
      is_price_study: !1,
      inputs: [
        {
          id: "smoothingLine",
          name: "Smoothing Line",
          defval: "SMA",
          type: "text",
          options: ["SMA", "EMA", "WMA"],
        },
        {
          id: "smoothingLength",
          name: "Smoothing Length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "On Balance Volume@tv-basicstudies-1",
      scriptIdPart: "",
      name: "On Balance Volume",
      format: {
        type: "volume",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t, i) {
        return r.Std.gt(e, 0) ? t : r.Std.lt(i, 0) ? -t : 0 * t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = r.Std.close(this._context),
            o = this._context.new_var(n),
            a = r.Std.change(o),
            l = this.f_0(a, r.Std.volume(this._context), a),
            c = r.Std.cum(l, this._context);
          this._context.setMinimumAdditionalDepth(s);
          var h,
            d = this._context.new_var(c);
          return (
            "EMA" === i
              ? (h = r.Std.ema(d, s, this._context))
              : "WMA" === i
              ? (h = r.Std.wma(d, s, this._context))
              : "SMA" === i && (h = r.Std.sma(d, s, this._context)),
            [c, h]
          );
        });
    },
  },
  {
    name: "Parabolic SAR",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 3,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 0.02,
          in_1: 0.02,
          in_2: 0.2,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Parabolic SAR",
      shortDescription: "SAR",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "start",
          defval: 0.02,
          type: "float",
          min: -1e12,
          max: 1e12,
        },
        {
          id: "in_1",
          name: "increment",
          defval: 0.02,
          type: "float",
          min: -1e12,
          max: 1e12,
        },
        {
          id: "in_2",
          name: "maximum",
          defval: 0.2,
          type: "float",
          min: -1e12,
          max: 1e12,
        },
      ],
      id: "Parabolic SAR@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Parabolic SAR",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._input(0),
          s = this._input(1),
          n = this._input(2);
        return [r.Std.sar(i, s, n, this._context)];
      };
    },
  },
  {
    name: "Price Channel",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#F50057",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#F50057",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 20,
          in_1: 0,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Highprice Line",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Lowprice Line",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Centerprice Line",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Price Channel",
      shortDescription: "PC",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 20,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "Offset Length",
          defval: 0,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Price Channel@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Price Channel",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = r.Std.high(this._context),
          s = this._context.new_var(i),
          n = r.Std.low(this._context),
          o = this._context.new_var(n),
          a = this._input(0),
          l = this._input(1),
          c = r.Std.highest(s, a, this._context),
          h = r.Std.lowest(o, a, this._context);
        return [
          {
            value: c,
            offset: l,
          },
          {
            value: h,
            offset: l,
          },
          {
            value: r.Std.avg(c, h),
            offset: l,
          },
        ];
      };
    },
  },
  {
    name: "Price Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: u,
          },
        },
        inputs: {
          in_0: 10,
          in_1: 21,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Price Oscillator",
      shortDescription: "PPO",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "shortlen",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "longlen",
          defval: 21,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Price Oscillator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Price Oscillator",
      format: {
        type: "price",
        precision: 2,
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return ((e - t) / t) * 100;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._input(0),
            n = this._input(1),
            o = this._context.new_var(i),
            a = r.Std.sma(o, s, this._context),
            l = this._context.new_var(i),
            c = r.Std.sma(l, n, this._context);
          return [this.f_0(a, c)];
        });
    },
  },
  {
    name: "Price Volume Trend",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {},
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "PVT",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "Price Volume Trend",
      shortDescription: "PVT",
      is_price_study: !1,
      is_hidden_study: !1,
      id: "price_volume_trend@tv-basicstudies-1",
      inputs: [],
      scriptIdPart: "",
      name: "Price Volume Trend",
      format: {
        type: "volume",
      },
    },
    constructor: function () {
      (this.f_0 = function () {
        var e = this._context.new_var(r.Std.close(this._context));
        return [
          r.Std.cum(
            (r.Std.change(e) / e.get(1)) * r.Std.volume(this._context),
            this._context
          ),
        ];
      }),
        (this.main = function (e, t) {
          return (this._context = e), (this._input = t), [this.f_0()[0]];
        });
    },
  },
  {
    name: "Rate Of Change",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "ROC",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
          zorder: 1,
        },
      },
      description: "Rate Of Change",
      shortDescription: "ROC",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Zero Line",
          isHidden: !1,
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e12,
        },
      ],
      id: "rate_of_change@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Rate Of Change",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._context.new_var(r.Std.close(this._context)),
          s = this._input(0);
        return [(100 * (i.get(0) - i.get(s))) / i.get(s)];
      };
    },
  },
  {
    name: "Relative Strength Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#7E57C2",
          },
          smoothedMA: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !1,
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 70,
            zorder: -1.1,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 50,
            zorder: -1.11,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 30,
            zorder: -1.111,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#7E57C2",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          length: 14,
          smoothingLine: "SMA",
          smoothingLength: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "smoothedMA",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
        smoothedMA: {
          title: "Smoothed MA",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 2,
        },
      },
      description: "Relative Strength Index",
      shortDescription: "RSI",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_2",
          name: "MiddleLimit",
          zorder: -1.11,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.111,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "length",
          name: "Length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "smoothingLine",
          name: "Smoothing Line",
          defval: "SMA",
          type: "text",
          options: ["SMA", "EMA", "WMA"],
        },
        {
          id: "smoothingLength",
          name: "Smoothing Length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "Relative Strength Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Relative Strength Index",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e) {
        return r.Std.max(e, 0);
      }),
        (this.f_1 = function (e) {
          return -r.Std.min(e, 0);
        }),
        (this.f_2 = function (e, t) {
          return r.Std.eq(e, 0)
            ? 100
            : r.Std.eq(t, 0)
            ? 0
            : 100 - 100 / (1 + t / e);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._input(0),
            n = this._input(1),
            o = this._input(2);
          this._context.setMinimumAdditionalDepth(s + o);
          var a,
            l = this._context.new_var(i),
            c = r.Std.change(l),
            h = this.f_0(c),
            d = this._context.new_var(h),
            u = r.Std.rma(d, s, this._context),
            p = this.f_1(c),
            _ = this._context.new_var(p),
            m = r.Std.rma(_, s, this._context),
            g = this.f_2(m, u),
            f = this._context.new_var(g);
          return (
            "EMA" === n
              ? (a = r.Std.ema(f, o, this._context))
              : "WMA" === n
              ? (a = r.Std.wma(f, o, this._context))
              : "SMA" === n && (a = r.Std.sma(f, o, this._context)),
            [
              {
                value: g,
              },
              {
                value: a,
              },
            ]
          );
        });
    },
  },
  {
    name: "Relative Vigor Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: u,
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: a,
          },
        },
        inputs: {
          in_0: 10,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "RVGI",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Signal",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Relative Vigor Index",
      shortDescription: "RVGI",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Relative Vigor Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Relative Vigor Index",
      format: {
        precision: 4,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e - t;
      }),
        (this.f_1 = function (e, t) {
          return e / t;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this.f_0(r.Std.close(this._context), r.Std.open(this._context)),
            n = this._context.new_var(s),
            o = r.Std.swma(n, this._context),
            a = this._context.new_var(o),
            l = r.Std.sum(a, i, this._context),
            c = this.f_0(r.Std.high(this._context), r.Std.low(this._context)),
            h = this._context.new_var(c),
            d = r.Std.swma(h, this._context),
            u = this._context.new_var(d),
            p = r.Std.sum(u, i, this._context),
            _ = this.f_1(l, p),
            m = this._context.new_var(_);
          return [_, r.Std.swma(m, this._context)];
        });
    },
  },
  {
    name: "Relative Volatility Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#7E57C2",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 80,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 20,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#7E57C2",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 10,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Relative Volatility Index",
      shortDescription: "RVI",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.11,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 10,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Relative Volatility Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Relative Volatility Index",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return r.Std.le(e, 0) ? 0 : t;
      }),
        (this.f_1 = function (e, t) {
          return r.Std.gt(e, 0) ? 0 : t;
        }),
        (this.f_2 = function (e, t) {
          return (e / (e + t)) * 100;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0);
          this._context.setMinimumAdditionalDepth(i + 12);
          var s = r.Std.close(this._context),
            n = this._context.new_var(s),
            o = r.Std.stdev(n, i, this._context),
            a = this._context.new_var(s),
            l = r.Std.change(a),
            c = this.f_0(l, o),
            h = this._context.new_var(c),
            d = r.Std.ema(h, 14, this._context),
            u = this.f_1(l, o),
            p = this._context.new_var(u),
            _ = r.Std.ema(p, 14, this._context);
          return [this.f_2(d, _)];
        });
    },
  },
  {
    name: "SMI Ergodic Indicator/Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 1,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: c,
          },
        },
        inputs: {
          in_0: 5,
          in_1: 20,
          in_2: 5,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Indicator",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Signal",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Oscillator",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "SMI Ergodic Indicator/Oscillator",
      shortDescription: "SMIIO",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "shortlen",
          defval: 5,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "longlen",
          defval: 20,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_2",
          name: "siglen",
          defval: 5,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "SMI Ergodic Indicator/Oscillator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "SMI Ergodic Indicator/Oscillator",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return e - t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = this._input(2);
          this._context.setMinimumAdditionalDepth(i + s + n);
          var o = r.Std.close(this._context),
            a = this._context.new_var(o),
            l = r.Std.tsi(a, i, s, this._context),
            c = this._context.new_var(l),
            h = r.Std.ema(c, n, this._context);
          return [l, h, this.f_0(l, h)];
        });
    },
  },
  {
    name: "Smoothed Moving Average",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#673AB7",
          },
        },
        inputs: {
          in_0: 7,
          in_1: "close",
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "Smoothed Moving Average",
      shortDescription: "SMMA",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Length",
          defval: 7,
          type: "integer",
          min: 1,
          max: 1e12,
        },
        {
          id: "in_1",
          name: "Source",
          defval: "close",
          type: "source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
        },
      ],
      id: "smoothed_moving_average@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Smoothed Moving Average",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function () {
        var e = this._input(0),
          t = r.Std[this._input(1)](this._context);
        return [r.Std.smma(t, e, this._context)];
      }),
        (this.main = function (e, t) {
          return (this._context = e), (this._input = t), this.f_0();
        });
    },
  },
  {
    name: "Standard Deviation",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      id: "Standard Deviation@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Standard Deviation",
      description: "Standard Deviation",
      shortDescription: "Standard Deviation",
      is_price_study: !1,
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: u,
          },
        },
        inputs: {
          periods: 5,
          deviations: 1,
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "periods",
          name: "Periods",
          type: "integer",
        },
        {
          id: "deviations",
          name: "Deviations",
          type: "float",
        },
      ],
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._input(0),
          s = this._input(1),
          n = this._context.new_var(r.Std.close(this._context));
        return [r.Std.stdev(n, i, this._context) * s];
      };
    },
  },
  {
    name: "Stochastic",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 80,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 20,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 14,
          in_1: 1,
          in_2: 3,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "%K",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1.1,
        },
        plot_1: {
          title: "%D",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1.11,
        },
      },
      description: "Stochastic",
      shortDescription: "Stoch",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.11,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "K",
          defval: 14,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_1",
          name: "D",
          defval: 1,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_2",
          name: "smooth",
          defval: 3,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "Stochastic@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Stochastic",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._input(0),
          s = this._input(1),
          n = this._input(2);
        this._context.setMinimumAdditionalDepth(i + s + n);
        var o = r.Std.close(this._context),
          a = r.Std.high(this._context),
          l = r.Std.low(this._context),
          c = this._context.new_var(o),
          h = this._context.new_var(a),
          d = this._context.new_var(l),
          u = r.Std.stoch(c, h, d, i, this._context),
          p = this._context.new_var(u),
          _ = r.Std.sma(p, s, this._context),
          m = this._context.new_var(_);
        return [_, r.Std.sma(m, n, this._context)];
      };
    },
  },
  {
    name: "Stochastic RSI",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#FF6D00",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 80,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 20,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#2196F3",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 14,
          in_1: 14,
          in_2: 3,
          in_3: 3,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "%K",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1.1,
        },
        plot_1: {
          title: "%D",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1.11,
        },
      },
      description: "Stochastic RSI",
      shortDescription: "Stoch RSI",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.11,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "lengthRSI",
          defval: 14,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_1",
          name: "lengthStoch",
          defval: 14,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_2",
          name: "smoothK",
          defval: 3,
          type: "integer",
          min: 1,
          max: 1e4,
        },
        {
          id: "in_3",
          name: "smoothD",
          defval: 3,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "Stochastic RSI@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Stochastic RSI",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_1 = function (e, t, i) {
        var s = i.new_var(r.Std.max(r.Std.change(e), 0));
        return r.Std.rma(s, t, i);
      }),
        (this.f_2 = function (e, t, i) {
          var s = i.new_var(-r.Std.min(r.Std.change(e), 0));
          return r.Std.rma(s, t, i);
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = r.Std.close(this._context),
            s = this._input(0),
            n = this._input(1),
            o = this._input(2),
            a = this._input(3);
          e.setMinimumAdditionalDepth(s + n + o + a);
          var l = this._context.new_var(i),
            c = r.Std.rsi(
              this.f_1(l, s, this._context),
              this.f_2(l, s, this._context)
            ),
            h = this._context.new_var(c),
            d = this._context.new_var(c),
            u = this._context.new_var(c),
            p = r.Std.stoch(h, d, u, n, this._context),
            _ = this._context.new_var(p),
            m = r.Std.sma(_, o, this._context),
            g = this._context.new_var(m);
          return [m, r.Std.sma(g, a, this._context)];
        });
    },
  },
  {
    name: "TRIX",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: a,
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 18,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "TRIX",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "TRIX",
      shortDescription: "TRIX",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 18,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "TRIX@tv-basicstudies-1",
      scriptIdPart: "",
      name: "TRIX",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e) {
        return r.Std.log(e);
      }),
        (this.f_1 = function (e) {
          return 1e4 * e;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0);
          e.setMinimumAdditionalDepth(3 * i);
          var s = this.f_0(r.Std.close(this._context)),
            n = this._context.new_var(s),
            o = r.Std.ema(n, i, this._context),
            a = this._context.new_var(o),
            l = r.Std.ema(a, i, this._context),
            c = this._context.new_var(l),
            h = r.Std.ema(c, i, this._context),
            d = this._context.new_var(h),
            u = r.Std.change(d);
          return [this.f_1(u)];
        });
    },
  },
  {
    name: "Triple EMA",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 9,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Triple EMA",
      shortDescription: "TEMA",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 9,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "Triple EMA@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Triple EMA",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t, i) {
        return 3 * (e - t) + i;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0);
          this._context.setMinimumAdditionalDepth(3 * i);
          var s = r.Std.close(this._context),
            n = this._context.new_var(s),
            o = r.Std.ema(n, i, this._context),
            a = this._context.new_var(o),
            l = r.Std.ema(a, i, this._context),
            c = this._context.new_var(l),
            h = r.Std.ema(c, i, this._context);
          return [this.f_0(o, l, h)];
        });
    },
  },
  {
    name: "True Strength Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#E91E63",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 25,
          in_1: 13,
          in_2: 13,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "True Strength Index",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1.1,
        },
        plot_1: {
          title: "Signal",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1.11,
        },
      },
      description: "True Strength Index",
      shortDescription: "True Strength Index",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "long",
          defval: 25,
          type: "integer",
          min: 1,
          max: 4999,
        },
        {
          id: "in_1",
          name: "short",
          defval: 13,
          type: "integer",
          min: 1,
          max: 4999,
        },
        {
          id: "in_2",
          name: "siglen",
          defval: 13,
          type: "integer",
          min: 1,
          max: 4999,
        },
      ],
      id: "True Strength Indicator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "True Strength Index",
      format: {
        precision: 4,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._input(0),
          s = this._input(1),
          n = this._input(2);
        this._context.setMinimumAdditionalDepth(
          this._input(0) + this._input(1) + this._input(2)
        );
        var o = r.Std.close(this._context),
          a = this._context.new_var(o),
          l = r.Std.tsi(a, s, i, this._context),
          c = this._context.new_var(l);
        return [l, r.Std.ema(c, n, this._context)];
      };
    },
  },
  {
    name: "Trend Strength Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !1,
      id: "Trend Strength Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Trend Strength Index",
      description: "Trend Strength Index",
      shortDescription: "Trend Strength Index",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: c,
          },
        },
        inputs: {
          periods: 14,
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "periods",
          type: "integer",
          name: "Periods",
        },
      ],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          (this.period = this._input(0)),
          (this.invertedPeriod = 1 / this.period),
          (this.sumX = ((this.period - 1) * this.period) / 2),
          (this.sumXX =
            ((this.period - 1) * this.period * (2 * this.period - 1)) / 6),
          (this.invertedPeriodSumXSumX =
            this.invertedPeriod * this.sumX * this.sumX);
      }),
        (this.trendStrengthIndex = function () {
          for (
            var e = this._context.new_var(r.Std.close(this._context)),
              t = r.Std.sum(e, this.period, this._context),
              i = 0,
              s = 0,
              n = 0;
            n < this.period;
            n++
          ) {
            var o = e.get(n);
            (s += (this.period - 1 - n) * o), (i += o * o);
          }
          var a = s - this.invertedPeriod * this.sumX * t,
            l =
              (this.sumXX - this.invertedPeriodSumXSumX) *
              (i - this.invertedPeriod * t * t);
          return l < 0 ? (0 == a ? 0 : a > 0 ? 1 : -1) : a / (l = Math.sqrt(l));
        }),
        (this.main = function (e, t) {
          return (
            (this._context = e), (this._input = t), [this.trendStrengthIndex()]
          );
        });
    },
  },
  {
    name: "Typical Price",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      id: "TypicalPrice@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Typical Price",
      description: "Typical Price",
      shortDescription: "Typical Price",
      is_price_study: !0,
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#FF6D00",
          },
        },
        inputs: {},
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        return (
          (this._context = e), (this._input = t), [r.Std.hlc3(this._context)]
        );
      };
    },
  },
  {
    name: "Ultimate Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: a,
          },
        },
        inputs: {
          in_0: 7,
          in_1: 14,
          in_2: 28,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "UO",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "Ultimate Oscillator",
      shortDescription: "UO",
      is_price_study: !1,
      inputs: [
        {
          id: "in_0",
          name: "length7",
          defval: 7,
          type: "integer",
          min: 1,
          max: 1e12,
        },
        {
          id: "in_1",
          name: "length14",
          defval: 14,
          type: "integer",
          min: 1,
          max: 1e12,
        },
        {
          id: "in_2",
          name: "length28",
          defval: 28,
          type: "integer",
          min: 1,
          max: 1e12,
        },
      ],
      id: "ultimate_oscillator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Ultimate Oscillator",
      format: {
        precision: 2,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function (e, t, i) {
        var s = this._context.new_var(e),
          n = this._context.new_var(t);
        return [
          r.Std.sum(s, i, this._context) / r.Std.sum(n, i, this._context),
        ];
      }),
        (this.f_1 = function () {
          var e = this._input(0),
            t = this._input(1),
            i = this._input(2),
            s = this._context.new_var(r.Std.close(this._context)),
            n = r.Std.max(r.Std.high(this._context), s.get(1)),
            o = this._context.new_var(r.Std.close(this._context)),
            a = r.Std.min(r.Std.low(this._context), o.get(1)),
            l = r.Std.close(this._context) - a,
            c = n - a,
            h = this.f_0(l, c, e),
            d = this.f_0(l, c, t),
            u = this.f_0(l, c, i);
          return [(100 * (4 * h[0] + 2 * d[0] + u[0])) / 7];
        }),
        (this.main = function (e, t) {
          return (this._context = e), (this._input = t), this.f_1();
        });
    },
  },
  {
    name: "Volatility Close-to-Close",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !1,
      id: "Volatility Close-to-Close@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Volatility Close-to-Close",
      description: "Volatility Close-to-Close",
      shortDescription: "Volatility Close-to-Close",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#2196F3",
          },
        },
        inputs: {
          periods: 10,
          daysPerYear: 252,
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "periods",
          name: "Periods",
          type: "integer",
          defval: 10,
          min: 2,
        },
        {
          id: "daysPerYear",
          name: "Days Per Year",
          type: "integer",
          defval: 252,
          min: 1,
          max: 366,
        },
      ],
      format: {
        precision: 2,
        type: "percent",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          (this.period = this._input(0)),
          (this.daysPerYear = this._input(1));
      }),
        (this.stdev = function (e, t, i) {
          var s = this.variance(e, t, i);
          return r.Std.sqrt(s);
        }),
        (this.variance = function (e, t, i) {
          var s = r.Std.sma(e, t, i);
          return this.variance2(e, s, t);
        }),
        (this.variance2 = function (e, t, i) {
          var s,
            r,
            n = 0;
          for (s = 0; s < i; s++) n += (r = e.get(s) - t) * r;
          return n / (i - 1);
        }),
        (this.standardHistVol = function () {
          var e = this._context.new_var(r.Std.close(this._context)),
            t = this._context.new_var(r.Std.log(e.get() / e.get(1)));
          return (
            100 *
            this.stdev(t, this.period, this._context) *
            r.Std.sqrt(this.daysPerYear)
          );
        }),
        (this.main = function (e, t) {
          return (
            (this._context = e), (this._input = t), [this.standardHistVol()]
          );
        });
    },
  },
  {
    name: "Volatility Zero Trend Close-to-Close",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !1,
      id: "Volatility Zero Trend Close-to-Close@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Volatility Zero Trend Close-to-Close",
      description: "Volatility Zero Trend Close-to-Close",
      shortDescription: "Volatility Zero Trend Close-to-Close",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: "#2196F3",
          },
        },
        inputs: {
          periods: 10,
          daysPerYear: 252,
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "periods",
          name: "Periods",
          type: "integer",
          min: 0,
          max: 1e4,
        },
        {
          id: "daysPerYear",
          name: "Days Per Year",
          type: "integer",
        },
      ],
      format: {
        precision: 2,
        type: "percent",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          (this.period = this._input(0)),
          (this.daysPerYear = this._input(1));
      }),
        (this.volatliityZTCTC = function () {
          this._context.setMinimumAdditionalDepth(this._input(0) + 1);
          for (
            var e = this._context.new_var(r.Std.close(this._context)),
              t = this._context.new_var(e.symbol.time),
              i = Math.sqrt((t.get(0) - t.get(1)) / 864e5 / this.daysPerYear),
              s = Math.log(r.Std.close(this._context) / e.get(1)),
              n = this._context.new_var(s / i),
              o = this._context.new_var(Math.pow(n, 2)),
              a = 0,
              l = 0;
            l < this.period;
            l++
          )
            a += o.get(l);
          return 100 * Math.sqrt(a / this.period);
        }),
        (this.main = function (e, t) {
          return (
            (this._context = e), (this._input = t), [this.volatliityZTCTC()]
          );
        });
    },
  },
  {
    name: "Volatility O-H-L-C",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !1,
      id: "Volatility O-H-L-C@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Volatility O-H-L-C",
      description: "Volatility O-H-L-C",
      shortDescription: "Volatility O-H-L-C",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: c,
          },
        },
        inputs: {
          periods: 10,
          marketClosedPercentage: 0,
          daysPerYear: 252,
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "periods",
          type: "integer",
          name: "Periods",
        },
        {
          id: "marketClosedPercentage",
          type: "float",
          name: "Market Closed Percentage",
          min: 0,
          max: 0.999,
        },
        {
          id: "daysPerYear",
          type: "integer",
          name: "Days Per Year",
        },
      ],
      format: {
        precision: 2,
        type: "percent",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          (this.period = this._input(0)),
          (this.marketClosedPercentage = this._input(1)),
          (this.daysPerYear = this._input(2)),
          (this.secondsPerYear = 86400 * this.daysPerYear);
      }),
        (this.square = function (e) {
          return e * e;
        }),
        (this.volatilityOHLC = function () {
          var e = this._context.new_var(Math.log(r.Std.open(this._context))),
            t = this._context.new_var(Math.log(r.Std.high(this._context))),
            i = this._context.new_var(Math.log(r.Std.low(this._context))),
            s = this._context.new_var(Math.log(r.Std.close(this._context))),
            n = this._context.new_var(r.Std.close(this._context)),
            o = this._context.new_var(n.symbol.time),
            a = (o.get(0) - o.get(1)) / 1e3,
            l = 0.5 * this.square(t.get() - i.get());
          (l -= (Math.log(4) - 1) * this.square(s.get() - e.get())),
            this.marketClosedPercentage > 0 &&
              (l =
                (0.12 * this.square(e.get() - s.get(1))) /
                  this.marketClosedPercentage +
                (0.88 * l) / (1 - this.marketClosedPercentage)),
            (l /= a),
            (l *= this.secondsPerYear);
          var c = this._context.new_var(l);
          return (
            100 *
            Math.sqrt(r.Std.sum(c, this.period, this._context) / this.period)
          );
        }),
        (this.main = function (e, t) {
          return (
            (this._context = e), (this._input = t), [this.volatilityOHLC()]
          );
        });
    },
  },
  {
    name: "Volatility Index",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      is_price_study: !0,
      id: "Volatility Index@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Volatility Index",
      description: "Volatility Index",
      shortDescription: "Volatility Index",
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: !0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            color: c,
          },
        },
        inputs: {
          periods: 10,
          atrMult: 3,
          method: "Wilder Smoothing",
        },
      },
      styles: {
        plot_0: {
          title: "Plot",
        },
      },
      inputs: [
        {
          id: "periods",
          name: "Periods",
          type: "integer",
        },
        {
          id: "atrMult",
          name: "ATR Mult",
          type: "float",
        },
        {
          id: "method",
          name: "Method",
          type: "text",
          defval: "Exponential",
          options: ["Exponential", "Wilder Smoothing"],
        },
      ],
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.init = function (e, t) {
        (this._context = e),
          (this._input = t),
          (this.period = this._input(0)),
          (this.atrMult = this._input(1)),
          (this.maMethod = this._input(2)),
          (this.nextsar = null),
          (this.position = null),
          (this.sic = null),
          (this.bars = []),
          (this.count = 0),
          (this.lastSar = null),
          this._context.setMinimumAdditionalDepth(
            "Exponential" === this.maMethod ? 2 * this.period + 2 : this.period
          );
      }),
        (this.computeATR = function () {
          var e = r.Std.high(this._context) - r.Std.low(this._context),
            t = r.Std.high(this._context) - this.bars[this.bars.length - 2],
            i = this.bars[this.bars.length - 2] - r.Std.low(this._context);
          return (
            (this.tr = Math.max(e, t, i)),
            "Exponential" === this.maMethod
              ? (this.atr = r.Std.ema(
                  this._context.new_var(this.tr),
                  this.period,
                  this._context
                ))
              : (this.atr =
                  this.tr / this.period + (1 - 1 / this.period) * this.atr),
            this.atr * this.atrMult
          );
        }),
        (this.calculateVolatility = function () {
          if (r.Std.close(this._context) === this.bars[this.bars.length - 1])
            return this.lastSar;
          if ((this.bars.push(r.Std.close(this._context)), 1 === this.count))
            (this.atr = r.Std.high(this._context) - r.Std.low(this._context)),
              (this.sic = r.Std.close(this._context));
          else if (this.count < this.period) {
            var e = r.Std.high(this._context) - r.Std.low(this._context),
              t = r.Std.high(this._context) - this.bars[this.bars.length - 2],
              i = this.bars[this.bars.length - 2] - r.Std.low(this._context);
            (this.atr += Math.max(e, t, i)),
              r.Std.close(this._context) > this.sic &&
                (this.sic = r.Std.close(this._context));
          } else if (this.count === this.period) {
            (e = r.Std.high(this._context) - r.Std.low(this._context)),
              (t = r.Std.high(this._context) - this.bars[this.bars.length - 2]),
              (i = this.bars[this.bars.length - 2] - r.Std.low(this._context));
            (this.atr += Math.max(e, t, i)),
              (this.atr *= 1 / this.period),
              r.Std.close(this._context) > this.sic &&
                (this.sic = r.Std.close(this._context)),
              (this.position = "LONG"),
              (this.nextsar = this.sic - this.atr * this.atrMult);
          } else {
            var s = this.nextsar;
            "LONG" === this.position
              ? r.Std.close(this._context) < s
                ? ((this.position = "SHORT"),
                  (this.sic = r.Std.close(this._context)),
                  (this.nextsar = this.sic + this.computeATR()))
                : ((this.position = "LONG"),
                  (this.sic = Math.max(r.Std.close(this._context), this.sic)),
                  (this.nextsar = this.sic - this.computeATR()))
              : "SHORT" === this.position &&
                (r.Std.close(this._context) > s
                  ? ((this.position = "LONG"),
                    (this.sic = r.Std.close(this._context)),
                    (this.nextsar = this.sic - this.computeATR()))
                  : ((this.position = "SHORT"),
                    (this.sic = Math.min(r.Std.close(this._context), this.sic)),
                    (this.nextsar = this.sic + this.computeATR()))),
              (this.lastSar = s);
          }
          return this.count++, s;
        }),
        (this.main = function (e, t) {
          return (
            (this._context = e),
            (this._input = t),
            this._context.select_sym(0),
            [this.calculateVolatility()]
          );
        });
    },
  },
  {
    name: "VWAP",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: 0,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "VWAP",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "VWAP",
      shortDescription: "VWAP",
      is_price_study: !0,
      inputs: [],
      id: "VWAP@tv-basicstudies-1",
      scriptIdPart: "",
      name: "VWAP",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_1 = function (e) {
        (e.hist = null), e.add_hist();
      }),
        (this.init = function (e, t) {
          this._isNewSession = null;
        }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = e.new_var(),
            s = e.new_var(),
            n = this._context.symbol.time;
          return (
            n &&
              (null === this._isNewSession &&
                (this._isNewSession = r.Std.createNewSessionCheck(e)),
              this._isNewSession(n) && (this.f_1(i), this.f_1(s))),
            i.set(
              r.Std.nz(i.get(1)) +
                r.Std.hlc3(this._context) * r.Std.volume(this._context)
            ),
            s.set(r.Std.nz(s.get(1)) + r.Std.volume(this._context)),
            [i.get(0) / s.get(0)]
          );
        });
    },
  },
  {
    name: "VWMA",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        inputs: {
          in_0: 20,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "VWMA",
      shortDescription: "VWMA",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "len",
          defval: 20,
          type: "integer",
          min: 1,
          max: 1e4,
        },
      ],
      id: "VWMA@tv-basicstudies-1",
      scriptIdPart: "",
      name: "VWMA",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = r.Std.close(this._context),
          s = this._input(0),
          n = this._context.new_var(i);
        return [r.Std.vwma(n, s, this._context)];
      };
    },
  },
  {
    name: "Volume Oscillator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: 0,
          },
        ],
        inputs: {
          in_0: 5,
          in_1: 10,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Volume Oscillator",
      shortDescription: "Volume Osc",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "Zero",
          zorder: -1,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "shortlen",
          defval: 5,
          type: "integer",
          min: 1,
          max: 4999,
        },
        {
          id: "in_1",
          name: "longlen",
          defval: 10,
          type: "integer",
          min: 1,
          max: 4999,
        },
      ],
      id: "Volume Oscillator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Volume Oscillator",
      format: {
        precision: 2,
        type: "percent",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t) {
        return (100 * (e - t)) / t;
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = this._input(1),
            n = r.Std.volume(this._context),
            o = this._context.new_var(n),
            a = r.Std.ema(o, i, this._context),
            l = this._context.new_var(n),
            c = r.Std.ema(l, s, this._context);
          return [this.f_0(a, c)];
        });
    },
  },
  {
    name: "Vortex Indicator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#E91E63",
          },
        },
        inputs: {
          in_0: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "VI +",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
        plot_1: {
          title: "VI -",
          histogramBase: 0,
          joinPoints: !1,
          isHidden: !1,
        },
      },
      description: "Vortex Indicator",
      shortDescription: "VI",
      is_price_study: !1,
      is_hidden_study: !1,
      id: "vortex_indicator@tv-basicstudies-1",
      inputs: [
        {
          id: "in_0",
          name: "Period",
          defval: 14,
          type: "integer",
          min: 2,
          max: 1e12,
        },
      ],
      scriptIdPart: "",
      name: "Vortex Indicator",
      format: {
        precision: 4,
        type: "price",
      },
    },
    constructor: function () {
      (this.f_0 = function () {
        var e = this._input(0),
          t = this._context.new_var(r.Std.low(this._context)),
          i = this._context.new_var(
            r.Std.abs(r.Std.high(this._context) - t.get(1))
          ),
          s = r.Std.sum(i, e, this._context),
          n = this._context.new_var(r.Std.high(this._context)),
          o = this._context.new_var(
            r.Std.abs(r.Std.low(this._context) - n.get(1))
          ),
          a = r.Std.sum(o, e, this._context),
          l = this._context.new_var(r.Std.atr(1, this._context)),
          c = r.Std.sum(l, e, this._context);
        return [s / c, a / c];
      }),
        (this.main = function (e, t) {
          return (this._context = e), (this._input = t), this.f_0();
        });
    },
  },
  {
    name: "Willams %R",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#7E57C2",
          },
        },
        bands: [
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: -20,
          },
          {
            color: "#787B86",
            linestyle: 2,
            linewidth: 1,
            visible: !0,
            value: -80,
          },
        ],
        filledAreasStyle: {
          fill_0: {
            color: "#7E57C2",
            transparency: 90,
            visible: !0,
          },
        },
        inputs: {
          in_0: 14,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Plot",
          histogramBase: 0,
          joinPoints: !1,
          zorder: 1,
        },
      },
      description: "Williams %R",
      shortDescription: "%R",
      is_price_study: !1,
      bands: [
        {
          id: "hline_0",
          name: "UpperLimit",
          zorder: -1.1,
        },
        {
          id: "hline_1",
          name: "LowerLimit",
          zorder: -1.11,
        },
      ],
      filledAreas: [
        {
          id: "fill_0",
          objAId: "hline_0",
          objBId: "hline_1",
          type: "hline_hline",
          title: "Hlines Background",
          zorder: -2,
        },
      ],
      inputs: [
        {
          id: "in_0",
          name: "length",
          defval: 14,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Willams %R@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Willams %R",
      format: {
        precision: 2,
        type: "price",
      },
      usePlotsZOrder: !0,
    },
    constructor: function () {
      (this.f_0 = function (e, t, i) {
        return (100 * (e - t)) / (t - i);
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this._input(0),
            s = r.Std.high(this._context),
            n = this._context.new_var(s),
            o = r.Std.highest(n, i, this._context),
            a = r.Std.low(this._context),
            l = this._context.new_var(a),
            c = r.Std.lowest(l, i, this._context);
          return [this.f_0(r.Std.close(this._context), o, c)];
        });
    },
  },
  {
    name: "Williams Alligator",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#2196F3",
          },
          plot_1: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#E91E63",
          },
          plot_2: {
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
            color: "#66BB6A",
          },
        },
        inputs: {
          in_0: 21,
          in_1: 13,
          in_2: 8,
          in_3: 8,
          in_4: 5,
          in_5: 3,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "line",
        },
        {
          id: "plot_1",
          type: "line",
        },
        {
          id: "plot_2",
          type: "line",
        },
      ],
      styles: {
        plot_0: {
          title: "Jaw",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_1: {
          title: "Teeth",
          histogramBase: 0,
          joinPoints: !1,
        },
        plot_2: {
          title: "Lips",
          histogramBase: 0,
          joinPoints: !1,
        },
      },
      description: "Williams Alligator",
      shortDescription: "Alligator",
      is_price_study: !0,
      inputs: [
        {
          id: "in_0",
          name: "Jaw Length",
          defval: 21,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_1",
          name: "Teeth Length",
          defval: 13,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_2",
          name: "Lips Length",
          defval: 8,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_3",
          name: "Jaw Offset",
          defval: 8,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_4",
          name: "Teeth Offset",
          defval: 5,
          type: "integer",
          min: 1,
          max: 2e3,
        },
        {
          id: "in_5",
          name: "Lips Offset",
          defval: 3,
          type: "integer",
          min: 1,
          max: 2e3,
        },
      ],
      id: "Williams Alligator@tv-basicstudies-1",
      scriptIdPart: "",
      name: "Williams Alligator",
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._input(0),
          s = this._input(1),
          n = this._input(2),
          o = this._input(3),
          a = this._input(4),
          l = this._input(5),
          c = r.Std.hl2(this._context);
        return [
          {
            value: r.Std.smma(c, i, this._context),
            offset: o,
          },
          {
            value: r.Std.smma(c, s, this._context),
            offset: a,
          },
          {
            value: r.Std.smma(c, n, this._context),
            offset: l,
          },
        ];
      };
    },
  },
  {
    name: "Williams Fractals",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: !1,
      isTVScriptStub: !1,
      defaults: {
        styles: {
          plot_0: {
            plottype: "shape_triangle_down",
            visible: !0,
            location: "BelowBar",
            transparency: 0,
            color: a,
          },
          plot_1: {
            plottype: "shape_triangle_up",
            visible: !0,
            location: "AboveBar",
            transparency: 0,
            color: u,
          },
        },
        inputs: {
          in_0: 2,
        },
      },
      plots: [
        {
          id: "plot_0",
          type: "shapes",
        },
        {
          id: "plot_1",
          type: "shapes",
        },
      ],
      styles: {
        plot_0: {
          title: "Down fractals",
          isHidden: !1,
        },
        plot_1: {
          title: "Up fractals",
          isHidden: !1,
        },
      },
      description: "Williams Fractal",
      shortDescription: "Fractals",
      is_price_study: !0,
      is_hidden_study: !1,
      id: "Williams Fractals@tv-basicstudies-1",
      inputs: [
        {
          id: "in_0",
          name: "Periods",
          defval: 2,
          type: "integer",
          min: 2,
          max: 1e12,
        },
      ],
      scriptIdPart: "",
      name: "Williams Fractals",
      isCustomIndicator: !0,
      format: {
        type: "inherit",
      },
    },
    constructor: function () {
      (this.f_0 = function () {
        for (
          var e = this._input(0),
            t = this._context.new_var(r.Std.high(this._context)),
            i = !0,
            s = !0,
            n = !0,
            o = !0,
            a = !0,
            l = !0,
            c = 1;
          c <= e;
          c++
        )
          (i = r.Std.and(i, r.Std.lt(t.get(e - c), t.get(e)))),
            (s = r.Std.and(s, r.Std.lt(t.get(e + c), t.get(e)))),
            (n = r.Std.and(
              n,
              r.Std.and(
                r.Std.le(t.get(e + 1), t.get(e)),
                r.Std.lt(t.get(e + c + 1), t.get(e))
              )
            )),
            (o = r.Std.and(
              o,
              r.Std.and(
                r.Std.le(t.get(e + 1), t.get(e)),
                r.Std.and(
                  r.Std.le(t.get(e + 2), t.get(e)),
                  r.Std.lt(t.get(e + c + 2), t.get(e))
                )
              )
            )),
            (a = r.Std.and(
              a,
              r.Std.and(
                r.Std.le(t.get(e + 1), t.get(e)),
                r.Std.and(
                  r.Std.le(t.get(e + 2), t.get(e)),
                  r.Std.and(
                    r.Std.le(t.get(e + 3), t.get(e)),
                    r.Std.lt(t.get(e + c + 3), t.get(e))
                  )
                )
              )
            )),
            (l = r.Std.and(
              l,
              r.Std.and(
                r.Std.le(t.get(e + 1), t.get(e)),
                r.Std.and(
                  r.Std.le(t.get(e + 2), t.get(e)),
                  r.Std.and(
                    r.Std.le(t.get(e + 3), t.get(e)),
                    r.Std.and(
                      r.Std.le(t.get(e + 4), t.get(e)),
                      r.Std.lt(t.get(e + c + 4), t.get(e))
                    )
                  )
                )
              )
            ));
        var h = r.Std.or(s, r.Std.or(n, r.Std.or(o, r.Std.or(a, l)))),
          d = r.Std.and(i, h),
          u = this._context.new_var(r.Std.low(this._context)),
          p = 1,
          _ = 1,
          m = 1,
          g = 1,
          f = 1,
          v = 1;
        for (c = 1; c <= e; c++)
          (p = r.Std.and(p, r.Std.gt(u.get(e - c), u.get(e)))),
            (_ = r.Std.and(_, r.Std.gt(u.get(e + c), u.get(e)))),
            (m = r.Std.and(
              m,
              r.Std.and(
                r.Std.ge(u.get(e + 1), u.get(e)),
                r.Std.gt(u.get(e + c + 1), u.get(e))
              )
            )),
            (g = r.Std.and(
              g,
              r.Std.and(
                r.Std.ge(u.get(e + 1), u.get(e)),
                r.Std.and(
                  r.Std.ge(u.get(e + 2), u.get(e)),
                  r.Std.gt(u.get(e + c + 2), u.get(e))
                )
              )
            )),
            (f = r.Std.and(
              f,
              r.Std.and(
                r.Std.ge(u.get(e + 1), u.get(e)),
                r.Std.and(
                  r.Std.ge(u.get(e + 2), u.get(e)),
                  r.Std.and(
                    r.Std.ge(u.get(e + 3), u.get(e)),
                    r.Std.gt(u.get(e + c + 3), u.get(e))
                  )
                )
              )
            )),
            (v = r.Std.and(
              v,
              r.Std.and(
                r.Std.ge(u.get(e + 1), u.get(e)),
                r.Std.and(
                  r.Std.ge(u.get(e + 2), u.get(e)),
                  r.Std.and(
                    r.Std.ge(u.get(e + 3), u.get(e)),
                    r.Std.and(
                      r.Std.ge(u.get(e + 4), u.get(e)),
                      r.Std.gt(u.get(e + c + 4), u.get(e))
                    )
                  )
                )
              )
            ));
        var S = r.Std.or(_, r.Std.or(m, r.Std.or(g, r.Std.or(f, v))));
        return [r.Std.and(p, S), d];
      }),
        (this.main = function (e, t) {
          (this._context = e), (this._input = t);
          var i = this.f_0();
          return [
            {
              value: i[0],
              offset: -this._input(0),
            },
            {
              value: i[1],
              offset: -this._input(0),
            },
          ];
        });
    },
  },
  {
    name: "Guppy Multiple Moving Average",
    metainfo: {
      isTVScript: !1,
      isTVScriptStub: !1,
      is_hidden_study: !1,
      description: "Guppy Multiple Moving Average",
      shortDescription: "GMMA",
      is_price_study: !0,
      id: "Guppy Multiple Moving Average@tv-basicstudies-1",
      _metainfoVersion: 52,
      format: {
        type: "inherit",
      },
      defaults: {
        inputs: {
          traderEMA1Length: 3,
          traderEMA2Length: 5,
          traderEMA3Length: 8,
          traderEMA4Length: 10,
          traderEMA5Length: 12,
          traderEMA6Length: 15,
          investorEMA1Length: 30,
          investorEMA2Length: 35,
          investorEMA3Length: 40,
          investorEMA4Length: 45,
          investorEMA5Length: 50,
          investorEMA6Length: 60,
        },
        styles: {
          traderEMA1: {
            color: "#00FFFF",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 15,
            visible: !0,
          },
          traderEMA2: {
            color: "#00FFFF",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 12,
            visible: !0,
          },
          traderEMA3: {
            color: "#00FFFF",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 9,
            visible: !0,
          },
          traderEMA4: {
            color: "#00FFFF",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 6,
            visible: !0,
          },
          traderEMA5: {
            color: "#00FFFF",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 3,
            visible: !0,
          },
          traderEMA6: {
            color: "#00FFFF",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
          },
          investorEMA1: {
            color: "#FF0000",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 15,
            visible: !0,
          },
          investorEMA2: {
            color: "#FF0000",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 12,
            visible: !0,
          },
          investorEMA3: {
            color: "#FF0000",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 9,
            visible: !0,
          },
          investorEMA4: {
            color: "#FF0000",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 6,
            visible: !0,
          },
          investorEMA5: {
            color: "#FF0000",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 3,
            visible: !0,
          },
          investorEMA6: {
            color: "#FF0000",
            linestyle: 0,
            linewidth: 1,
            plottype: 0,
            trackPrice: !1,
            transparency: 0,
            visible: !0,
          },
        },
      },
      inputs: [
        {
          defval: 3,
          id: "traderEMA1Length",
          max: 1e3,
          min: 1,
          name: "Trader EMA 1 length",
          type: "integer",
        },
        {
          defval: 5,
          id: "traderEMA2Length",
          max: 1e3,
          min: 1,
          name: "Trader EMA 2 length",
          type: "integer",
        },
        {
          defval: 8,
          id: "traderEMA3Length",
          max: 1e3,
          min: 1,
          name: "Trader EMA 3 length",
          type: "integer",
        },
        {
          defval: 10,
          id: "traderEMA4Length",
          max: 1e3,
          min: 1,
          name: "Trader EMA 4 length",
          type: "integer",
        },
        {
          defval: 12,
          id: "traderEMA5Length",
          max: 1e3,
          min: 1,
          name: "Trader EMA 5 length",
          type: "integer",
        },
        {
          defval: 15,
          id: "traderEMA6Length",
          max: 1e3,
          min: 1,
          name: "Trader EMA 6 length",
          type: "integer",
        },
        {
          defval: 30,
          id: "investorEMA1Length",
          max: 1e3,
          min: 1,
          name: "Investor EMA 1 length",
          type: "integer",
        },
        {
          defval: 35,
          id: "investorEMA2Length",
          max: 1e3,
          min: 1,
          name: "Investor EMA 2 length",
          type: "integer",
        },
        {
          defval: 40,
          id: "investorEMA3Length",
          max: 1e3,
          min: 1,
          name: "Investor EMA 3 length",
          type: "integer",
        },
        {
          defval: 45,
          id: "investorEMA4Length",
          max: 1e3,
          min: 1,
          name: "Investor EMA 4 length",
          type: "integer",
        },
        {
          defval: 50,
          id: "investorEMA5Length",
          max: 1e3,
          min: 1,
          name: "Investor EMA 5 length",
          type: "integer",
        },
        {
          defval: 60,
          id: "investorEMA6Length",
          max: 1e3,
          min: 1,
          name: "Investor EMA 6 length",
          type: "integer",
        },
      ],
      plots: [
        {
          id: "traderEMA1",
          type: "line",
        },
        {
          id: "traderEMA2",
          type: "line",
        },
        {
          id: "traderEMA3",
          type: "line",
        },
        {
          id: "traderEMA4",
          type: "line",
        },
        {
          id: "traderEMA5",
          type: "line",
        },
        {
          id: "traderEMA6",
          type: "line",
        },
        {
          id: "investorEMA1",
          type: "line",
        },
        {
          id: "investorEMA2",
          type: "line",
        },
        {
          id: "investorEMA3",
          type: "line",
        },
        {
          id: "investorEMA4",
          type: "line",
        },
        {
          id: "investorEMA5",
          type: "line",
        },
        {
          id: "investorEMA6",
          type: "line",
        },
      ],
      styles: {
        traderEMA1: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Trader EMA 1",
        },
        traderEMA2: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Trader EMA 2",
        },
        traderEMA3: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Trader EMA 3",
        },
        traderEMA4: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Trader EMA 4",
        },
        traderEMA5: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Trader EMA 5",
        },
        traderEMA6: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Trader EMA 6",
        },
        investorEMA1: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Investor EMA 1",
        },
        investorEMA2: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Investor EMA 2",
        },
        investorEMA3: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Investor EMA 3",
        },
        investorEMA4: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Investor EMA 4",
        },
        investorEMA5: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Investor EMA 5",
        },
        investorEMA6: {
          histogramBase: 0,
          isHidden: !1,
          joinPoints: !1,
          title: "Investor EMA 6",
        },
      },
    },
    constructor: function () {
      this.main = function (e, t) {
        (this._context = e), (this._input = t);
        var i = this._context.new_var(r.Std.close(this._context)),
          s = this._input(0),
          n = this._input(1),
          o = this._input(2),
          a = this._input(3),
          l = this._input(4),
          c = this._input(5),
          h = r.Std.ema(i, s, this._context),
          d = r.Std.ema(i, n, this._context),
          u = r.Std.ema(i, o, this._context),
          p = r.Std.ema(i, a, this._context),
          _ = r.Std.ema(i, l, this._context),
          m = r.Std.ema(i, c, this._context),
          g = this._input(6),
          f = this._input(7),
          v = this._input(8),
          S = this._input(9),
          y = this._input(10),
          b = this._input(11);
        return [
          h,
          d,
          u,
          p,
          _,
          m,
          r.Std.ema(i, g, this._context),
          r.Std.ema(i, f, this._context),
          r.Std.ema(i, v, this._context),
          r.Std.ema(i, S, this._context),
          r.Std.ema(i, y, this._context),
          r.Std.ema(i, b, this._context),
        ];
      };
    },
  },
];
