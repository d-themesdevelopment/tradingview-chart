import { getHexColorByName } from 'module1';
import { module2, module3, module4, module5, module6, module7, module8, module9 } from 'module2';

"use strict";

const getColor = getHexColorByName;
const { pivotPointsStandardStudyItem } = module3;
const { volumeProfileVisibleRangeStudyItem } = module4;
const { volumeProfileFixedRangeVbPStudyItem } = module5;
const { volumeProfileFixedRangeBSStudyItem } = module5;
const { spreadStudyItem } = module6;
const { ratioStudyItem } = module7;
const { regressionTrendStudyItem } = module8;
const { anchoredVWAPStudyItem } = module9;

const ripeRedColor = getColor("color-ripe-red-400");
const mintyGreenColor = getColor("color-minty-green-400");

JSServer.studyLibrary = JSServer.studyLibrary.concat([
  {
    name: "Compare",
    metainfo: {
      _metainfoVersion: 52,
      isTVScript: false,
      isTVScriptStub: false,
      is_hidden_study: true,
      defaults: {
        styles: {
          compare: {
            linestyle: 0,
            linewidth: 2,
            plottype: 0,
            trackPrice: false,
            transparency: 0,
            visible: true,
            color: "#9C27B0"
          }
        },
        inputs: {
          source: "close",
          symbol: ""
        }
      },
      plots: [
        {
          id: "compare",
          type: "line"
        }
      ],
      styles: {
        compare: {
          title: "Plot",
          histogramBase: 0
        }
      },
      description: "Compare",
      shortDescription: "Compare",
      is_price_study: true,
      inputs: [
        {
          defval: "close",
          id: "source",
          name: "Source",
          options: ["open", "high", "low", "close", "hl2", "hlc3", "ohlc4"],
          type: "text"
        },
        {
          id: "symbol",
          name: "Symbol",
          type: "symbol",
          isHidden: true
        }
      ],
      id: "Compare@tv-basicstudies-1",
      format: {
        type: "inherit"
      }
    },
    constructor: function() {
      this.init = function(context, dependencies) {
        this._context = context;
        this._context.new_sym(dependencies.symbol, module2.Std.period(this._context));
      };

      this.main = function(context, dependencies) {
        this._context = context;
        var source = dependencies.source;
        var symbolIndex = 1;
        var symbolTime = this._context.symbol.time;

        this._context.select_sym(symbolIndex);
        var symbolTimeVar = this._context.new_unlimited_var(symbolTime);
        var indicator = module2.Std[source](this._context);
        var indicatorValue = this._context.new_unlimited_var(indicator);

        this._context.select_sym(0);
        return [indicatorValue.adopt(symbolTimeVar, symbolTime, 0)];
      };
    }
  },


  			
  {
    name: "Overlay",
    metainfo: {
        _metainfoVersion: 52,
        isTVScript: !1,
        isTVScriptStub: !1,
        is_hidden_study: !0,
        defaults: {
            styles: {},
            inputs: {
                symbol: "",
                extendTimeScale: !1
            }
        },
        plots: [{
            id: "open",
            type: "line"
        }, {
            id: "high",
            type: "line"
        }, {
            id: "low",
            type: "line"
        }, {
            id: "close",
            type: "line"
        }],
        styles: {
            open: {
                title: "Open"
            },
            high: {
                title: "High"
            },
            low: {
                title: "Low"
            },
            close: {
                title: "Close"
            }
        },
        description: "Overlay",
        shortDescription: "Overlay",
        is_price_study: !1,
        inputs: [{
            id: "symbol",
            name: "symbol",
            defval: "",
            type: "symbol",
            isHidden: !0
        }, {
            id: "extendTimeScale",
            name: "extendTimeScale",
            defval: !1,
            type: "boolean",
            isHidden: !0
        }],
        id: "Overlay@tv-basicstudies-1",
        format: {
            type: "price",
            precision: 4
        },
        canExtendTimeScale: !0
    },
    constructor: function() {
        this.init = function(e, t) {
            this._context = e, this._context.new_sym(t(0), r.Std.period(this._context))
        }, this.main = function(e, t) {
            this._context = e;
            var i = !1 === t(1),
                s = this._context.new_unlimited_var(this._context.symbol.time);
            this._context.select_sym(1);
            var n = this._context.new_unlimited_var(this._context.symbol.time),
                o = this._context.new_unlimited_var(r.Std.open(this._context)),
                a = this._context.new_unlimited_var(r.Std.high(this._context)),
                l = this._context.new_unlimited_var(r.Std.low(this._context)),
                c = this._context.new_unlimited_var(r.Std.close(this._context));
            return i ? (this._context.select_sym(0), [o.adopt(n, s, 1), a.adopt(n, s, 1), l.adopt(n, s, 1), c.adopt(n, s, 1)]) : [o.get(0), a.get(0), l.get(0), c.get(0)]
        }
    }
}, {
    name: "Volume",
    metainfo: {
        _metainfoVersion: 52,
        isTVScript: !1,
        isTVScriptStub: !1,
        is_hidden_study: !1,
        defaults: {
            styles: {
                vol: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 5,
                    trackPrice: !1,
                    transparency: 50,
                    visible: !0,
                    color: "#000080"
                },
                vol_ma: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 0,
                    trackPrice: !1,
                    transparency: 0,
                    visible: !1,
                    color: "#2196F3"
                },
                smoothedMA: {
                    linestyle: 0,
                    linewidth: 1,
                    plottype: 0,
                    trackPrice: !1,
                    transparency: 0,
                    visible: !1,
                    color: "#2196F3"
                }
            },
            palettes: {
                volumePalette: {
                    colors: {
                        0: {
                            color: p,
                            width: 1,
                            style: 0
                        },
                        1: {
                            color: _,
                            width: 1,
                            style: 0
                        }
                    }
                }
            },
            inputs: {
                showMA: !1,
                length: 20,
                col_prev_close: !1,
                symbol: "",
                smoothingLine: "SMA",
                smoothingLength: 9
            }
        },
        plots: [{
            id: "vol",
            type: "line"
        }, {
            id: "volumePalette",
            palette: "volumePalette",
            target: "vol",
            type: "colorer"
        }, {
            id: "vol_ma",
            type: "line"
        }, {
            id: "smoothedMA",
            type: "line"
        }],
        styles: {
            vol: {
                title: "Volume",
                histogramBase: 0
            },
            vol_ma: {
                title: "Volume MA",
                histogramBase: 0
            },
            smoothedMA: {
                title: "Smoothed MA",
                histogramBase: 0
            }
        },
        description: "Volume",
        shortDescription: "Volume",
        is_price_study: !1,
        palettes: {
            volumePalette: {
                colors: {
                    0: {
                        name: "Falling"
                    },
                    1: {
                        name: "Growing"
                    }
                }
            }
        },
        inputs: [{
            id: "symbol",
            name: "Other Symbol",
            defval: "",
            type: "symbol",
            optional: !0,
            isHidden: !1
        }, {
            id: "showMA",
            name: "show MA",
            defval: !1,
            type: "bool",
            isHidden: !0
        }, {
            id: "length",
            name: "MA Length",
            defval: 20,
            type: "integer",
            min: 1,
            max: 2e3
        }, {
            defval: !1,
            id: "col_prev_close",
            name: "Color based on previous close",
            type: "bool"
        }, {
            id: "smoothingLine",
            name: "Smoothing Line",
            defval: "SMA",
            type: "text",
            options: ["SMA", "EMA", "WMA"]
        }, {
            id: "smoothingLength",
            name: "Smoothing Length",
            defval: 9,
            type: "integer",
            min: 1,
            max: 1e4
        }],
        id: "Volume@tv-basicstudies-1",
        format: {
            type: "volume"
        }
    },
    constructor: function() {
        this.init = function(e, t) {
            this._context = e, "" !== t(0) && this._context.new_sym(t(0), r.Std.period(this._context))
        }, this.f_0 = function(e, t) {
            return r.Std.gt(e, t) ? 0 : 1
        }, this.main = function(e, t) {
            this._context = e, this._input = t;
            var i = r.Std.volume(this._context),
                s = r.Std.open(this._context),
                n = r.Std.close(this._context),
                o = this._context.new_var(this._context.symbol.time),
                a = this._input(4),
                l = this._input(5);
            if (this._context.setMinimumAdditionalDepth(this._input(2) + l), "" !== this._input(0)) {
                this._context.select_sym(1);
                var c = this._context.new_var(this._context.symbol.time),
                    h = this._context.new_var(r.Std.volume(this._context)),
                    d = this._context.new_var(r.Std.open(this._context)),
                    u = this._context.new_var(r.Std.close(this._context));
                i = h.adopt(c, o, 1), s = d.adopt(c, o, 1), n = u.adopt(c, o, 1), this._context.select_sym(0)
            }
            var p, _, m = this._context.new_var(i),
                g = r.Std.sma(m, this._input(2), this._context),
                f = this._context.new_var(g),
                v = this._context.new_var(n);
            return p = v.get(1) && this._input(3) ? this.f_0(v.get(1), n) : this.f_0(s, n), "EMA" === a ? _ = r.Std.ema(f, l, this._context) : "WMA" === a ? _ = r.Std.wma(f, l, this._context) : "SMA" === a && (_ = r.Std.sma(f, l, this._context)), [i, p, g, _]
        }
    }
}, {
    name: "ZigZag",
    metainfo: {
        _metainfoVersion: 52,
        isTVScript: !1,
        isTVScriptStub: !1,
        is_hidden_study: !1,
        defaults: {
            styles: {
                plot_0: {
                    linestyle: 0,
                    linewidth: 2,
                    plottype: 0,
                    trackPrice: !1,
                    transparency: 0,
                    visible: !0,
                    color: "#2196F3"
                }
            },
            inputs: {
                in_0: 5,
                in_1: 10
            }
        },
        plots: [{
            id: "plot_0",
            type: "line"
        }, {
            id: "plot_1",
            target: "plot_0",
            type: "dataoffset"
        }],
        styles: {
            plot_0: {
                title: "Plot",
                histogramBase: 0,
                joinPoints: !1
            }
        },
        description: "Zig Zag",
        shortDescription: "ZigZag",
        is_price_study: !0,
        classId: "ScriptWithDataOffset",
        inputs: [{
            id: "in_0",
            name: "deviation",
            defval: 5,
            type: "float",
            min: .001,
            max: 100
        }, {
            id: "in_1",
            name: "depth",
            defval: 10,
            type: "integer",
            min: 2,
            max: 1e3
        }],
        id: "ZigZag@tv-basicstudies-1",
        format: {
            type: "inherit"
        }
    },
    constructor: function() {
        this.main = function(e, t) {
            this._context = e, this._input = t;
            var i = this._input(0),
                s = this._input(1),
                n = i / 100,
                o = Math.ceil(s / 2);
            return [r.Std.zigzag(n, o, this._context), r.Std.zigzagbars(n, o, this._context)]
        }
    }
}, {
    name: "Sessions",
    metainfo: {
        _metainfoVersion: 52,
        defaults: {
            graphics: {
                vertlines: {
                    sessBreaks: {
                        color: "#4985e7",
                        style: 2,
                        visible: !1,
                        width: 1
                    }
                },
                backgrounds: {
                    preMarket: {
                        color: "#FF9800",
                        transparency: 92,
                        visible: !0
                    },
                    postMarket: {
                        color: "#2196F3",
                        transparency: 92,
                        visible: !0
                    }
                }
            },
            linkedToSeries: !0
        },
        description: "Sessions",
        graphics: {
            vertlines: {
                sessBreaks: {
                    name: "Session Break",
                    halign: "left"
                }
            },
            backgrounds: {
                preMarket: {
                    name: "Pre market"
                },
                postMarket: {
                    name: "Post market"
                }
            }
        },
        id: "Sessions@tv-basicstudies-1",
        inputs: [],
        is_hidden_study: !0,
        is_price_study: !0,
        name: "Sessions@tv-basicstudies",
        palettes: {},
        plots: [],
        shortDescription: "Sessions",
        format: {
            type: "inherit"
        }
    },
    constructor: function() {
        function e(e, t) {
            return {
                id: e,
                index: e,
                extendBottom: !0,
                extendTop: !0
            }
        }

        function t(e) {
            return {
                id: e.start,
                start: e.start,
                stop: e.stop
            }
        }
        this.init = function() {
            this._times = []
        }, this._getVerticalLineData = function(t) {
            return r.Std.selectSessionBreaks(t, this._times).map(e)
        }, this._getPreAndPostMarketBackgroundsData = function(e) {
            const i = r.Std.selectPreAndPostMarketTimes(e, this._times);
            return {
                preMarket: i.preMarket.map(t),
                postMarket: i.postMarket.map(t)
            }
        }, this.main = function(e, t) {
            if (r.Std.isdwm(e)) return null;
            var i = r.Std.time(e);
            if (isNaN(i)) return null;
            var s = this._times.length;
            if (0 !== s && this._times[s - 1] === i || this._times.push(i), !e.symbol.isLastBar || !e.symbol.isNewBar) return null;
            var n = this._getVerticalLineData(e),
                o = this._getPreAndPostMarketBackgroundsData(e);
            return 0 === n.length && 0 === o.preMarket.length && 0 === o.postMarket ? null : {
                nonseries: !0,
                type: "study_graphics",
                data: {
                    graphicsCmds: {
                        create: {
                            vertlines: [{
                                styleId: "sessBreaks",
                                data: n
                            }],
                            backgrounds: [{
                                styleId: "preMarket",
                                data: o.preMarket
                            }, {
                                styleId: "postMarket",
                                data: o.postMarket
                            }]
                        },
                        erase: [{
                            action: "all"
                        }]
                    }
                }
            }
        }
    }
}, {
    name: "SuperTrend",
    metainfo: {
        _metainfoVersion: 52,
        isTVScript: !1,
        isTVScriptStub: !1,
        is_hidden_study: !1,
        defaults: {
            styles: {
                plot_0: {
                    linestyle: 0,
                    linewidth: 3,
                    plottype: 0,
                    trackPrice: !1,
                    transparency: 35,
                    visible: !0,
                    color: "#000080"
                },
                plot_2: {
                    linestyle: 0,
                    linewidth: 3,
                    plottype: "shape_arrow_up",
                    trackPrice: !1,
                    location: "BelowBar",
                    transparency: 35,
                    visible: !0,
                    color: "#00FF00"
                },
                plot_3: {
                    linestyle: 0,
                    linewidth: 3,
                    plottype: "shape_arrow_down",
                    trackPrice: !1,
                    location: "AboveBar",
                    transparency: 35,
                    visible: !0,
                    color: "#FF0000"
                }
            },
            palettes: {
                palette_0: {
                    colors: {
                        0: {
                            color: "#008000",
                            width: 3,
                            style: 0
                        },
                        1: {
                            color: "#800000",
                            width: 3,
                            style: 0
                        }
                    }
                }
            },
            inputs: {
                in_0: 10,
                in_1: 3
            }
        },
        plots: [{
            id: "plot_0",
            type: "line"
        }, {
            id: "plot_1",
            palette: "palette_0",
            target: "plot_0",
            type: "colorer"
        }, {
            id: "plot_2",
            type: "shapes"
        }, {
            id: "plot_3",
            type: "shapes"
        }],
        styles: {
            plot_0: {
                title: "SuperTrend",
                histogramBase: 0,
                joinPoints: !1,
                isHidden: !1
            },
            plot_2: {
                title: "Up Arrow",
                histogramBase: 0,
                joinPoints: !1,
                isHidden: !1
            },
            plot_3: {
                title: "Down Arrow",
                histogramBase: 0,
                joinPoints: !1,
                isHidden: !1
            }
        },
        description: "SuperTrend",
        shortDescription: "SuperTrend",
        is_price_study: !0,
        palettes: {
            palette_0: {
                colors: {
                    0: {
                        name: "Color 0"
                    },
                    1: {
                        name: "Color 1"
                    }
                },
                valToIndex: {
                    0: 0,
                    1: 1
                }
            }
        },
        inputs: [{
            id: "in_0",
            name: "Length",
            defval: 10,
            type: "integer",
            min: 1,
            max: 100
        }, {
            id: "in_1",
            name: "Factor",
            defval: 3,
            type: "float",
            min: 1,
            max: 100
        }],
        id: "SuperTrend@tv-basicstudies-1",
        scriptIdPart: "",
        name: "SuperTrend",
        isCustomIndicator: !0,
        format: {
            type: "inherit"
        }
    },
    constructor: function() {
        this.main = function(e, t) {
            var i = t(0),
                s = t(1),
                [n, o] = r.Std.supertrend(s, i, e),
                a = e.new_var(o).get(1);
            return [n, -1 === o ? 0 : 1, -1 === o && a !== o ? 1 : NaN, 1 === o && a !== o ? 1 : NaN]
        }
    }
}, n, o, a, l, c, h, d, u])

  // Other objects can be added here
]);
