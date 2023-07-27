(e, t, i) => {
    "use strict";
    var s = i(67980).PlDisplay;
    const {
        getHexColorByName: r
    } = i(48891), {
        generateColor: n
    } = i(87095);
    var o = i(67980).TradedGroupHorizontalAlignment,
        a = i(88732),
        l = i(90095).LineToolPitchforkStyle,
        c = i(99987).LineToolBarsPatternMode,
        h = i(72877),
        d = h.LineStudyPlotStyle,
        u = h.STUDYPLOTDISPLAYTARGET,
        p = i(42609),
        _ = i(74304).PriceAxisLastValueMode,
        m = i(9482).StoriesTimeLineItemType,
        g = i(36147).MagnetMode,
        f = i(73436).LineEnd,
        v = i(93613).ColorType,
        S = i(62615).RangeBarStyle,
        y = i(9155).StatsPosition,
        b = i(16776).sessionsPreferencesDefault,
        w = i(81580).axisLabelBackgroundColor;
    const {
        LINESTYLE_SOLID: P,
        LINESTYLE_DOTTED: C,
        LINESTYLE_DASHED: x
    } = i(79849);
    var T = i(59224).getLogger("Chart.Defaults");
    const I = r("color-black"),
        M = r("color-white"),
        A = n(M, 75),
        L = r("color-tv-blue-50"),
        k = r("color-tv-blue-500"),
        E = n(k, 30),
        D = n(k, 70),
        V = n(k, 72),
        B = n(k, 75),
        R = n(k, 80),
        N = r("color-tv-blue-600"),
        O = r("color-deep-blue-200"),
        F = r("color-deep-blue-300"),
        W = r("color-deep-blue-500"),
        z = n(W, 80),
        H = r("color-sky-blue-500"),
        U = n(H, 80),
        j = r("color-sky-blue-700"),
        G = n(j, 30),
        q = r("color-youtube"),
        $ = r("color-ripe-red-200"),
        Y = r("color-ripe-red-300"),
        K = r("color-ripe-red-400"),
        Z = r("color-ripe-red-500"),
        X = n(Z, 70),
        J = n(Z, 80),
        Q = n(Z, 72),
        ee = n(Z, 95),
        te = r("color-ripe-red-600"),
        ie = r("color-grapes-purple-500"),
        se = n(ie, 100),
        re = n(ie, 80),
        ne = n(ie, 30),
        oe = r("color-berry-pink-500"),
        ae = n(oe, 80),
        le = r("color-minty-green-100"),
        ce = r("color-minty-green-500"),
        he = n(ce, 80),
        de = n(ce, 72),
        ue = n(ce, 95),
        pe = r("color-iguana-green-300"),
        _e = r("color-iguana-green-500"),
        me = n(_e, 80),
        ge = r("color-tan-orange-300"),
        fe = r("color-tan-orange-500"),
        ve = n(fe, 80),
        Se = r("color-tan-orange-600"),
        ye = r("color-tan-orange-700"),
        be = r("color-cold-gray-150"),
        we = r("color-cold-gray-300"),
        Pe = r("color-cold-gray-400"),
        Ce = r("color-cold-gray-450"),
        xe = r("color-cold-gray-500"),
        Te = r("color-cold-gray-800"),
        Ie = n(Te, 94),
        Me = n(Te, 100),
        Ae = r("color-cold-gray-900"),
        Le = r("color-cold-gray-750"),
        ke = r("color-slate-gray"),
        Ee = r("color-silver-tree"),
        De = n(Ee, 95),
        Ve = r("color-mandy"),
        Be = n(Ve, 95);
    var Re = function(e) {
        var t = function(e, t) {
                return {
                    color: e,
                    visible: t
                }
            },
            i = function(e, t, i) {
                return {
                    coeff: e,
                    color: t,
                    visible: i
                }
            },
            r = function(e, t, i, s, r) {
                return {
                    coeff: e,
                    color: t,
                    visible: i,
                    linestyle: void 0 === s ? P : s,
                    linewidth: void 0 === r ? 1 : r
                }
            },
            h = function(e, t, i) {
                return {
                    color: e,
                    width: i,
                    visible: t
                }
            },
            T = function(e, t, i, s, r) {
                return {
                    color: e,
                    visible: t,
                    width: i,
                    x: s,
                    y: r
                }
            },
            Te = function(e, t, i, s, r, n) {
                return {
                    coeff1: e,
                    coeff2: t,
                    color: i,
                    visible: s,
                    linestyle: void 0 === r ? P : r,
                    linewidth: void 0 === n ? 1 : n
                }
            };
        if (void 0 === TradingView.defaultProperties) {
            var Re;
            switch (window.locale) {
                case "ar_AE":
                    Re = "Asia/Dubai";
                    break;
                case "au":
                    Re = "Australia/Sydney";
                    break;
                case "br":
                    Re = "America/Sao_Paulo";
                    break;
                case "ca":
                    Re = "America/Toronto";
                    break;
                case "de_DE":
                case "it":
                    Re = "Europe/Berlin";
                    break;
                case "es":
                    Re = "Europe/Madrid";
                    break;
                case "fa_IR":
                    Re = "Asia/Tehran";
                    break;
                case "fr":
                case "sv_SE":
                    Re = "Europe/Paris";
                    break;
                case "he_IL":
                case "tr":
                    Re = "Europe/Athens";
                    break;
                case "hu_HU":
                case "pl":
                    Re = "Europe/Warsaw";
                    break;
                case "id":
                case "th_TH":
                case "vi_VN":
                    Re = "Asia/Bangkok";
                    break;
                case "in":
                    Re = "Asia/Kolkata";
                    break;
                case "ja":
                case "kr":
                    Re = "Asia/Tokyo";
                    break;
                case "ms_MY":
                    Re = "Asia/Singapore";
                    break;
                case "ru":
                    Re = "Europe/Moscow";
                    break;
                case "uk":
                    Re = "Europe/London";
                    break;
                case "zh_CN":
                case "zh_TW":
                    Re = "Asia/Shanghai";
                    break;
                default:
                    Re = "Etc/UTC"
            }
            TradingView.defaultProperties = {
                chartproperties: {
                    timezone: Re,
                    priceScaleSelectionStrategyName: "auto",
                    paneProperties: {
                        backgroundType: v.Solid,
                        background: M,
                        backgroundGradientStartColor: M,
                        backgroundGradientEndColor: M,
                        gridLinesMode: "both",
                        vertGridProperties: {
                            color: Ie,
                            style: P
                        },
                        horzGridProperties: {
                            color: Ie,
                            style: P
                        },
                        crossHairProperties: {
                            color: Pe,
                            style: x,
                            transparency: 0,
                            width: 1
                        },
                        topMargin: 10,
                        bottomMargin: 8,
                        axisProperties: {
                            autoScale: !0,
                            autoScaleDisabled: !1,
                            lockScale: !1,
                            percentage: !1,
                            percentageDisabled: !1,
                            indexedTo100: !1,
                            log: !1,
                            logDisabled: !1,
                            alignLabels: !0,
                            isInverted: !1
                        },
                        legendProperties: {
                            showStudyArguments: !0,
                            showStudyTitles: !0,
                            showStudyValues: !0,
                            showSeriesTitle: !0,
                            showSeriesOHLC: !0,
                            showLegend: !0,
                            showBarChange: !0,
                            showVolume: !1,
                            showBackground: !0,
                            showPriceSource: !0,
                            backgroundTransparency: 50
                        },
                        separatorColor: be
                    },
                    scalesProperties: {
                        backgroundColor: M,
                        lineColor: Me,
                        textColor: Ae,
                        fontSize: 12,
                        scaleSeriesOnly: !1,
                        showSeriesLastValue: !0,
                        seriesLastValueMode: _.LastValueAccordingToScale,
                        showSeriesPrevCloseValue: !1,
                        showStudyLastValue: !0,
                        showSymbolLabels: !1,
                        showStudyPlotLabels: !1,
                        showBidAskLabels: !1,
                        showPrePostMarketPriceLabel: !0,
                        showFundamentalNameLabel: !1,
                        showFundamentalLastValue: !0,
                        barSpacing: p.DEFAULT_BAR_SPACING,
                        axisHighlightColor: B,
                        axisLineToolLabelBackgroundColorCommon: w.common,
                        axisLineToolLabelBackgroundColorActive: w.active,
                        showPriceScaleCrosshairLabel: !0,
                        showTimeScaleCrosshairLabel: !0,
                        crosshairLabelBgColorLight: Ae,
                        crosshairLabelBgColorDark: Le
                    },
                    mainSeriesProperties: {
                        style: a.STYLE_CANDLES,
                        esdShowDividends: !0,
                        esdShowSplits: !0,
                        esdShowEarnings: !0,
                        esdShowBreaks: !1,
                        esdFlagSize: 2,
                        showContinuousContractSwitches: !0,
                        showContinuousContractSwitchesBreaks: !1,
                        showFuturesContractExpiration: !0,
                        showLastNews: !0,
                        showCountdown: !0,
                        bidAsk: {
                            visible: !1,
                            lineStyle: C,
                            lineWidth: 1,
                            bidLineColor: k,
                            askLineColor: K
                        },
                        prePostMarket: {
                            visible: !0,
                            lineStyle: C,
                            lineWidth: 1,
                            preMarketColor: Se,
                            postMarketColor: k
                        },
                        highLowAvgPrice: {
                            highLowPriceLinesVisible: !1,
                            highLowPriceLabelsVisible: !1,
                            averageClosePriceLineVisible: !1,
                            averageClosePriceLabelVisible: !1,
                            highLowPriceLinesColor: "",
                            highLowPriceLinesWidth: 1,
                            averagePriceLineColor: "",
                            averagePriceLineWidth: 1
                        },
                        visible: !0,
                        showPriceLine: !0,
                        priceLineWidth: 1,
                        priceLineColor: "",
                        baseLineColor: we,
                        showPrevClosePriceLine: !1,
                        prevClosePriceLineWidth: 1,
                        prevClosePriceLineColor: "#555555",
                        minTick: "default",
                        dividendsAdjustment: void 0,
                        backAdjustment: !1,
                        settlementAsClose: !0,
                        sessionId: "regular",
                        sessVis: !1,
                        statusViewStyle: {
                            fontSize: 16,
                            showExchange: !0,
                            showInterval: !0,
                            symbolTextSource: "description"
                        },
                        candleStyle: {
                            upColor: ce,
                            downColor: Z,
                            drawWick: !0,
                            drawBorder: !0,
                            borderColor: "#378658",
                            borderUpColor: ce,
                            borderDownColor: Z,
                            wickColor: "#737375",
                            wickUpColor: ce,
                            wickDownColor: Z,
                            barColorsOnPrevClose: !1,
                            drawBody: !0
                        },
                        hollowCandleStyle: {
                            upColor: ce,
                            downColor: Z,
                            drawWick: !0,
                            drawBorder: !0,
                            borderColor: "#378658",
                            borderUpColor: ce,
                            borderDownColor: Z,
                            wickColor: "#737375",
                            wickUpColor: ce,
                            wickDownColor: Z,
                            drawBody: !0
                        },
                        haStyle: {
                            upColor: ce,
                            downColor: Z,
                            drawWick: !0,
                            drawBorder: !0,
                            borderColor: "#378658",
                            borderUpColor: ce,
                            borderDownColor: Z,
                            wickColor: "#737375",
                            wickUpColor: ce,
                            wickDownColor: Z,
                            showRealLastPrice: !1,
                            barColorsOnPrevClose: !1,
                            inputs: {},
                            inputInfo: {},
                            drawBody: !0
                        },
                        barStyle: {
                            upColor: ce,
                            downColor: Z,
                            barColorsOnPrevClose: !1,
                            dontDrawOpen: !1,
                            thinBars: !0
                        },
                        hiloStyle: {
                            color: k,
                            showBorders: !0,
                            borderColor: k,
                            showLabels: !0,
                            labelColor: k,
                            drawBody: !0
                        },
                        columnStyle: {
                            upColor: n(ce, 50),
                            downColor: n(Z, 50),
                            barColorsOnPrevClose: !0,
                            priceSource: "close"
                        },
                        lineStyle: {
                            color: k,
                            linestyle: P,
                            linewidth: 2,
                            priceSource: "close"
                        },
                        lineWithMarkersStyle: {
                            color: k,
                            linestyle: P,
                            linewidth: 2,
                            priceSource: "close"
                        },
                        steplineStyle: {
                            color: k,
                            linestyle: P,
                            linewidth: 2,
                            priceSource: "close"
                        },
                        areaStyle: {
                            color1: V,
                            color2: k,
                            linecolor: k,
                            linestyle: P,
                            linewidth: 2,
                            priceSource: "close",
                            transparency: 100
                        },
                        hlcAreaStyle: {
                            highLineColor: ce,
                            highLineStyle: P,
                            highLineWidth: 2,
                            lowLineColor: Z,
                            lowLineStyle: P,
                            lowLineWidth: 2,
                            closeLineColor: Ce,
                            closeLineStyle: P,
                            closeLineWidth: 2,
                            highCloseFillColor: he,
                            closeLowFillColor: J
                        },
                        priceAxisProperties: {
                            autoScale: !0,
                            autoScaleDisabled: !1,
                            lockScale: !1,
                            percentage: !1,
                            percentageDisabled: !1,
                            indexedTo100: !1,
                            log: !1,
                            logDisabled: !1,
                            isInverted: !1,
                            alignLabels: !0
                        },
                        renkoStyle: {
                            upColor: ce,
                            downColor: Z,
                            borderUpColor: ce,
                            borderDownColor: Z,
                            upColorProjection: "#a9dcc3",
                            downColorProjection: "#f5a6ae",
                            borderUpColorProjection: "#a9dcc3",
                            borderDownColorProjection: "#f5a6ae",
                            wickUpColor: ce,
                            wickDownColor: Z,
                            inputs: {
                                source: "close",
                                sources: "Close",
                                boxSize: 3,
                                style: "ATR",
                                atrLength: 14,
                                wicks: !0
                            },
                            inputInfo: {
                                source: {
                                    name: "Source"
                                },
                                sources: {
                                    name: "Source"
                                },
                                boxSize: {
                                    name: "Box size"
                                },
                                style: {
                                    name: "Style"
                                },
                                atrLength: {
                                    name: "ATR length"
                                },
                                wicks: {
                                    name: "Wicks"
                                }
                            }
                        },
                        pbStyle: {
                            upColor: ce,
                            downColor: Z,
                            borderUpColor: ce,
                            borderDownColor: Z,
                            upColorProjection: "#a9dcc3",
                            downColorProjection: "#f5a6ae",
                            borderUpColorProjection: "#a9dcc3",
                            borderDownColorProjection: "#f5a6ae",
                            inputs: {
                                source: "close",
                                lb: 3
                            },
                            inputInfo: {
                                source: {
                                    name: "Source"
                                },
                                lb: {
                                    name: "Number of line"
                                }
                            }
                        },
                        kagiStyle: {
                            upColor: ce,
                            downColor: Z,
                            upColorProjection: "#a9dcc3",
                            downColorProjection: "#f5a6ae",
                            inputs: {
                                source: "close",
                                style: "ATR",
                                atrLength: 14,
                                reversalAmount: 1
                            },
                            inputInfo: {
                                source: {
                                    name: "Source"
                                },
                                style: {
                                    name: "Style"
                                },
                                atrLength: {
                                    name: "ATR length"
                                },
                                reversalAmount: {
                                    name: "Reversal amount"
                                }
                            }
                        },
                        pnfStyle: {
                            upColor: ce,
                            downColor: Z,
                            upColorProjection: "#a9dcc3",
                            downColorProjection: "#f5a6ae",
                            inputs: {
                                sources: "Close",
                                reversalAmount: 3,
                                boxSize: 1,
                                style: "ATR",
                                atrLength: 14,
                                oneStepBackBuilding: !1
                            },
                            inputInfo: {
                                sources: {
                                    name: "Source"
                                },
                                boxSize: {
                                    name: "Box size"
                                },
                                reversalAmount: {
                                    name: "Reversal amount"
                                },
                                style: {
                                    name: "Style"
                                },
                                atrLength: {
                                    name: "ATR length"
                                },
                                oneStepBackBuilding: {
                                    name: "One step back building"
                                }
                            }
                        },
                        baselineStyle: {
                            baselineColor: ke,
                            topFillColor1: de,
                            topFillColor2: ue,
                            bottomFillColor1: ee,
                            bottomFillColor2: Q,
                            topLineColor: ce,
                            bottomLineColor: Z,
                            topLineWidth: 2,
                            bottomLineWidth: 2,
                            priceSource: "close",
                            transparency: 50,
                            baseLevelPercentage: 50
                        },
                        rangeStyle: {
                            barStyle: S.Bars,
                            upColor: ce,
                            downColor: Z,
                            upColorProjection: "#a9dcc3",
                            downColorProjection: "#f5a6ae",
                            thinBars: !0,
                            candlesUpColor: ce,
                            candlesDownColor: Z,
                            candlesBorderUpColor: ce,
                            candlesBorderDownColor: Z,
                            candlesWickUpColor: ce,
                            candlesWickDownColor: Z,
                            inputs: {
                                range: 10,
                                phantomBars: !1
                            },
                            inputInfo: {
                                range: {
                                    name: "Range"
                                },
                                phantomBars: {
                                    name: "Phantom bars"
                                }
                            }
                        }
                    },
                    chartEventsSourceProperties: {
                        visible: !0,
                        futureOnly: !0,
                        breaks: {
                            color: "#555555",
                            visible: !1,
                            style: x,
                            width: 1
                        }
                    },
                    tradingProperties: {
                        showPositions: !0,
                        positionPL: {
                            visibility: !0,
                            display: s.Money
                        },
                        bracketsPL: {
                            visibility: !0,
                            display: s.Money
                        },
                        showOrders: !0,
                        showExecutions: !0,
                        showExecutionsLabels: !1,
                        showReverse: !0,
                        horizontalAlignment: o.Right,
                        extendLeft: !0,
                        lineLength: 5,
                        lineWidth: 1,
                        lineStyle: P
                    },
                    editorFontsList: ["Verdana", "Courier New", "Times New Roman", "Arial"],
                    volumePaneSize: "large"
                },
                sessions: b,
                drawings: {
                    magnet: !1,
                    magnetMode: g.WeakMagnet,
                    stayInDrawingMode: !1,
                    drawOnAllCharts: !0,
                    drawOnAllChartsMode: 1
                },
                linetoolorder: {
                    extendLeft: "inherit",
                    lineLength: "inherit",
                    lineColor: q,
                    lineActiveBuyColor: "#4094e8",
                    lineInactiveBuyColor: "rgba(64, 148, 232, 0.5)",
                    lineActiveSellColor: "#e75656",
                    lineInactiveSellColor: "rgba(231, 86, 86, 0.5)",
                    lineStyle: "inherit",
                    lineWidth: "inherit",
                    bodyBorderActiveBuyColor: "#4094e8",
                    bodyBorderInactiveBuyColor: "rgba(64, 148, 232, 0.5)",
                    bodyBorderActiveSellColor: "#e75656",
                    bodyBorderInactiveSellColor: "rgba(231, 86, 86, 0.5)",
                    bodyBackgroundColor: A,
                    bodyBackgroundTransparency: 25,
                    bodyTextInactiveLimitColor: "rgba(38, 140, 2, 0.5)",
                    bodyTextActiveLimitColor: "#268c02",
                    bodyTextInactiveStopColor: "rgba(231, 86, 86, 0.5)",
                    bodyTextActiveStopColor: "#e75656",
                    bodyTextInactiveBuyColor: "rgba(64, 148, 232, 0.5)",
                    bodyTextActiveBuyColor: "#4094e8",
                    bodyTextInactiveSellColor: "rgba(231, 86, 86, 0.5)",
                    bodyTextActiveSellColor: "#e75656",
                    bodyFontFamily: "Verdana",
                    bodyFontSize: 9,
                    bodyFontBold: !0,
                    bodyFontItalic: !1,
                    quantityBorderActiveBuyColor: "#4094e8",
                    quantityBorderInactiveBuyColor: "rgba(64, 148, 232, 0.5)",
                    quantityBorderActiveSellColor: "#e75656",
                    quantityBorderInactiveSellColor: "rgba(231, 86, 86, 0.5)",
                    quantityBackgroundInactiveBuyColor: "rgba(64, 148, 232, 0.5)",
                    quantityBackgroundActiveBuyColor: "#4094e8",
                    quantityBackgroundInactiveSellColor: "rgba(231, 86, 86, 0.5)",
                    quantityBackgroundActiveSellColor: "#e75656",
                    quantityTextColor: M,
                    quantityTextTransparency: 0,
                    quantityFontFamily: "Verdana",
                    quantityFontSize: 9,
                    quantityFontBold: !0,
                    quantityFontItalic: !1,
                    cancelButtonBorderActiveBuyColor: "#4094e8",
                    cancelButtonBorderInactiveBuyColor: "rgba(64, 148, 232, 0.5)",
                    cancelButtonBorderActiveSellColor: "#e75656",
                    cancelButtonBorderInactiveSellColor: "rgba(231, 86, 86, 0.5)",
                    cancelButtonBackgroundColor: A,
                    cancelButtonBackgroundTransparency: 25,
                    cancelButtonIconActiveBuyColor: "#4094e8",
                    cancelButtonIconInactiveBuyColor: "rgba(64, 148, 232, 0.5)",
                    cancelButtonIconActiveSellColor: "#e75656",
                    cancelButtonIconInactiveSellColor: "rgba(231, 86, 86, 0.5)",
                    tooltip: "",
                    modifyTooltip: "",
                    cancelTooltip: ""
                },
                linetoolposition: {
                    extendLeft: "inherit",
                    lineLength: "inherit",
                    lineBuyColor: "#4094e8",
                    lineSellColor: "#e75656",
                    lineStyle: "inherit",
                    lineWidth: "inherit",
                    bodyBorderBuyColor: "#4094e8",
                    bodyBorderSellColor: "#e75656",
                    bodyBackgroundColor: A,
                    bodyBackgroundTransparency: 25,
                    bodyTextPositiveColor: "#268c02",
                    bodyTextNeutralColor: "#646464",
                    bodyTextNegativeColor: "#e75656",
                    bodyFontFamily: "Verdana",
                    bodyFontSize: 9,
                    bodyFontBold: !0,
                    bodyFontItalic: !1,
                    quantityBorderBuyColor: "#4094e8",
                    quantityBorderSellColor: "#e75656",
                    quantityBackgroundBuyColor: "#4094e8",
                    quantityBackgroundSellColor: "#e75656",
                    quantityTextColor: M,
                    quantityTextTransparency: 0,
                    quantityFontFamily: "Verdana",
                    quantityFontSize: 9,
                    quantityFontBold: !0,
                    quantityFontItalic: !1,
                    reverseButtonBorderBuyColor: "#4094e8",
                    reverseButtonBorderSellColor: "#e75656",
                    reverseButtonBackgroundColor: A,
                    reverseButtonBackgroundTransparency: 25,
                    reverseButtonIconBuyColor: "#4094e8",
                    reverseButtonIconSellColor: "#e75656",
                    closeButtonBorderBuyColor: "#4094e8",
                    closeButtonBorderSellColor: "#e75656",
                    closeButtonBackgroundColor: A,
                    closeButtonBackgroundTransparency: 25,
                    closeButtonIconBuyColor: "#4094e8",
                    closeButtonIconSellColor: "#e75656",
                    tooltip: "",
                    protectTooltip: "",
                    closeTooltip: "",
                    reverseTooltip: ""
                },
                linetoolexecution: {
                    direction: "buy",
                    arrowHeight: 8,
                    arrowSpacing: 1,
                    arrowBuyColor: "#4094e8",
                    arrowSellColor: "#e75656",
                    text: "",
                    textColor: I,
                    textTransparency: 0,
                    fontFamily: "Verdana",
                    fontSize: 10,
                    fontBold: !1,
                    fontItalic: !1,
                    tooltip: ""
                },
                linetoolicon: {
                    color: k,
                    size: 40,
                    icon: 61720,
                    angle: .5 * Math.PI
                },
                linetoolemoji: {
                    size: 40,
                    emoji: "😀",
                    angle: .5 * Math.PI
                },
                linetoolsticker: {
                    size: 110,
                    sticker: "bitcoin",
                    angle: .5 * Math.PI
                },
                linetoolimage: {
                    transparency: 0,
                    cssWidth: 0,
                    cssHeight: 0,
                    angle: 0
                },
                linetoolbezierquadro: {
                    linecolor: k,
                    linewidth: 1,
                    fillBackground: !1,
                    backgroundColor: R,
                    transparency: 50,
                    linestyle: P,
                    extendLeft: !1,
                    extendRight: !1,
                    leftEnd: f.Normal,
                    rightEnd: f.Normal
                },
                linetoolbeziercubic: {
                    linecolor: W,
                    linewidth: 1,
                    fillBackground: !1,
                    backgroundColor: z,
                    transparency: 80,
                    linestyle: P,
                    extendLeft: !1,
                    extendRight: !1,
                    leftEnd: f.Normal,
                    rightEnd: f.Normal
                },
                linetooltrendline: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    extendLeft: !1,
                    extendRight: !1,
                    leftEnd: f.Normal,
                    rightEnd: f.Normal,
                    showLabel: !1,
                    horzLabelsAlign: "center",
                    vertLabelsAlign: "bottom",
                    textcolor: k,
                    fontsize: 14,
                    bold: !1,
                    italic: !1,
                    alwaysShowStats: !1,
                    showMiddlePoint: !1,
                    showPriceLabels: !1,
                    showPriceRange: !1,
                    showPercentPriceRange: !1,
                    showPipsPriceRange: !1,
                    showBarsRange: !1,
                    showDateTimeRange: !1,
                    showDistance: !1,
                    showAngle: !1,
                    statsPosition: y.Right
                },
                linetoolinfoline: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    extendLeft: !1,
                    extendRight: !1,
                    leftEnd: f.Normal,
                    rightEnd: f.Normal,
                    showLabel: !1,
                    horzLabelsAlign: "center",
                    vertLabelsAlign: "bottom",
                    textcolor: k,
                    fontsize: 14,
                    bold: !1,
                    italic: !1,
                    alwaysShowStats: !0,
                    showMiddlePoint: !1,
                    showPriceLabels: !1,
                    showPriceRange: !0,
                    showPercentPriceRange: !0,
                    showPipsPriceRange: !0,
                    showBarsRange: !0,
                    showDateTimeRange: !0,
                    showDistance: !0,
                    showAngle: !0,
                    statsPosition: y.Center
                },
                linetooltimecycles: {
                    linecolor: "#159980",
                    linewidth: 1,
                    fillBackground: !0,
                    backgroundColor: "rgba(106, 168, 79, 0.5)",
                    transparency: 50,
                    linestyle: P
                },
                linetoolsineline: {
                    linecolor: "#159980",
                    linewidth: 1,
                    linestyle: P
                },
                linetooltrendangle: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    textcolor: k,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    alwaysShowStats: !1,
                    showMiddlePoint: !1,
                    showPriceLabels: !1,
                    showPriceRange: !1,
                    showPercentPriceRange: !1,
                    showPipsPriceRange: !1,
                    showBarsRange: !1,
                    extendRight: !1,
                    extendLeft: !1,
                    statsPosition: y.Right
                },
                linetooldisjointangle: {
                    linecolor: ce,
                    linewidth: 2,
                    linestyle: P,
                    fillBackground: !0,
                    backgroundColor: he,
                    transparency: 20,
                    extendLeft: !1,
                    extendRight: !1,
                    leftEnd: f.Normal,
                    rightEnd: f.Normal,
                    textcolor: ce,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    showPrices: !1,
                    showPriceRange: !1,
                    showDateTimeRange: !1,
                    showBarsRange: !1
                },
                linetoolflatbottom: {
                    linecolor: fe,
                    linewidth: 2,
                    linestyle: P,
                    fillBackground: !0,
                    backgroundColor: ve,
                    transparency: 20,
                    extendLeft: !1,
                    extendRight: !1,
                    leftEnd: f.Normal,
                    rightEnd: f.Normal,
                    textcolor: fe,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    showPrices: !1,
                    showPriceRange: !1,
                    showDateTimeRange: !1,
                    showBarsRange: !1
                },
                linetoolfibspiral: {
                    counterclockwise: !1,
                    linecolor: H,
                    linewidth: 1,
                    linestyle: P
                },
                linetoolriskrewardshort: {
                    linecolor: xe,
                    linewidth: 1,
                    textcolor: M,
                    fontsize: 12,
                    fillLabelBackground: !0,
                    labelBackgroundColor: "#585858",
                    fillBackground: !0,
                    stopBackground: J,
                    profitBackground: he,
                    stopBackgroundTransparency: 80,
                    profitBackgroundTransparency: 80,
                    drawBorder: !1,
                    borderColor: "#667b8b",
                    compact: !1,
                    riskDisplayMode: "percents",
                    accountSize: 1e3,
                    lotSize: 1,
                    risk: 25,
                    alwaysShowStats: !1,
                    showPriceLabels: !0
                },
                linetoolriskrewardlong: {
                    linecolor: xe,
                    linewidth: 1,
                    textcolor: M,
                    fontsize: 12,
                    fillLabelBackground: !0,
                    labelBackgroundColor: "#585858",
                    fillBackground: !0,
                    stopBackground: J,
                    profitBackground: he,
                    stopBackgroundTransparency: 80,
                    profitBackgroundTransparency: 80,
                    drawBorder: !1,
                    borderColor: "#667b8b",
                    compact: !1,
                    riskDisplayMode: "percents",
                    accountSize: 1e3,
                    lotSize: 1,
                    risk: 25,
                    alwaysShowStats: !1,
                    showPriceLabels: !0
                },
                linetoolarrow: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    extendLeft: !1,
                    extendRight: !1,
                    leftEnd: f.Normal,
                    rightEnd: f.Arrow,
                    showLabel: !1,
                    horzLabelsAlign: "center",
                    vertLabelsAlign: "bottom",
                    textcolor: k,
                    fontsize: 14,
                    bold: !1,
                    italic: !1,
                    alwaysShowStats: !1,
                    showMiddlePoint: !1,
                    showPriceLabels: !1,
                    showPriceRange: !1,
                    showPercentPriceRange: !1,
                    showPipsPriceRange: !1,
                    showBarsRange: !1,
                    showDateTimeRange: !1,
                    showDistance: !1,
                    showAngle: !1,
                    statsPosition: y.Right
                },
                linetoolray: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    extendLeft: !1,
                    extendRight: !0,
                    leftEnd: f.Normal,
                    rightEnd: f.Normal,
                    showLabel: !1,
                    horzLabelsAlign: "center",
                    vertLabelsAlign: "bottom",
                    textcolor: k,
                    fontsize: 14,
                    bold: !1,
                    italic: !1,
                    alwaysShowStats: !1,
                    showMiddlePoint: !1,
                    showPriceLabels: !1,
                    showPriceRange: !1,
                    showPercentPriceRange: !1,
                    showPipsPriceRange: !1,
                    showBarsRange: !1,
                    showDateTimeRange: !1,
                    showDistance: !1,
                    showAngle: !1,
                    statsPosition: y.Right
                },
                linetoolextended: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    extendLeft: !0,
                    extendRight: !0,
                    leftEnd: f.Normal,
                    rightEnd: f.Normal,
                    showLabel: !1,
                    horzLabelsAlign: "center",
                    vertLabelsAlign: "bottom",
                    textcolor: k,
                    fontsize: 14,
                    bold: !1,
                    italic: !1,
                    alwaysShowStats: !1,
                    showMiddlePoint: !1,
                    showPriceLabels: !1,
                    showPriceRange: !1,
                    showPercentPriceRange: !1,
                    showPipsPriceRange: !1,
                    showBarsRange: !1,
                    showDateTimeRange: !1,
                    showDistance: !1,
                    showAngle: !1,
                    statsPosition: y.Right
                },
                linetoolhorzline: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    showPrice: !0,
                    showLabel: !1,
                    textcolor: k,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    horzLabelsAlign: "center",
                    vertLabelsAlign: "top"
                },
                linetoolhorzray: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    showPrice: !0,
                    showLabel: !1,
                    textcolor: k,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    horzLabelsAlign: "center",
                    vertLabelsAlign: "top"
                },
                linetoolvertline: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    extendLine: !0,
                    showTime: !0,
                    showLabel: !1,
                    horzLabelsAlign: "right",
                    vertLabelsAlign: "top",
                    textcolor: k,
                    textOrientation: "vertical",
                    fontsize: 14,
                    bold: !1,
                    italic: !1
                },
                linetoolcrossline: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    showPrice: !0,
                    showTime: !0
                },
                linetoolcirclelines: {
                    trendline: {
                        visible: !0,
                        color: "#808080",
                        linewidth: 1,
                        linestyle: x
                    },
                    linecolor: "#80ccdb",
                    linewidth: 1,
                    linestyle: P
                },
                linetoolfibtimezone: {
                    horzLabelsAlign: "right",
                    vertLabelsAlign: "bottom",
                    baselinecolor: "#808080",
                    linecolor: "#0055db",
                    linewidth: 1,
                    linestyle: P,
                    showLabels: !0,
                    fillBackground: !1,
                    transparency: 80,
                    trendline: {
                        visible: !0,
                        color: "#808080",
                        linewidth: 1,
                        linestyle: x
                    },
                    level1: r(0, xe, !0),
                    level2: r(1, k, !0),
                    level3: r(2, k, !0),
                    level4: r(3, k, !0),
                    level5: r(5, k, !0),
                    level6: r(8, k, !0),
                    level7: r(13, k, !0),
                    level8: r(21, k, !0),
                    level9: r(34, k, !0),
                    level10: r(55, k, !0),
                    level11: r(89, k, !0)
                },
                linetooltext: {
                    color: k,
                    fontsize: 14,
                    fillBackground: !1,
                    backgroundColor: "rgba(91, 133, 191, 0.3)",
                    backgroundTransparency: 70,
                    drawBorder: !1,
                    borderColor: "#667b8b",
                    bold: !1,
                    italic: !1,
                    fixedSize: !0,
                    wordWrap: !1,
                    wordWrapWidth: 200
                },
                linetooltextabsolute: {
                    color: k,
                    fontsize: 14,
                    fillBackground: !1,
                    backgroundColor: "rgba(155, 190, 213, 0.3)",
                    backgroundTransparency: 70,
                    drawBorder: !1,
                    borderColor: "#667b8b",
                    bold: !1,
                    italic: !1,
                    fixedSize: !1,
                    wordWrap: !1,
                    wordWrapWidth: 200
                },
                linetoolballoon: {
                    color: M,
                    backgroundColor: ne,
                    borderColor: se,
                    fontsize: 14,
                    transparency: 30
                },
                linetoolcomment: {
                    color: M,
                    backgroundColor: k,
                    borderColor: k,
                    fontsize: 16,
                    transparency: 0
                },
                linetoolbrush: {
                    linecolor: H,
                    linewidth: 1,
                    linestyle: P,
                    smooth: 5,
                    fillBackground: !1,
                    backgroundColor: H,
                    transparency: 50,
                    leftEnd: f.Normal,
                    rightEnd: f.Normal
                },
                linetoolhighlighter: {
                    linecolor: J,
                    smooth: 5,
                    transparency: 80
                },
                linetoolpolyline: {
                    linecolor: H,
                    linewidth: 1,
                    linestyle: P,
                    fillBackground: !0,
                    backgroundColor: U,
                    transparency: 80,
                    filled: !1
                },
                linetoolsignpost: {
                    itemType: m.Emoji,
                    emoji: "🙂",
                    showImage: !1,
                    plateColor: k,
                    fontSize: 12,
                    bold: !1,
                    italic: !1
                },
                linetoolpath: {
                    lineColor: k,
                    lineWidth: 2,
                    lineStyle: P,
                    leftEnd: f.Normal,
                    rightEnd: f.Arrow
                },
                linetoolarrowmarkleft: {
                    color: k,
                    arrowColor: k,
                    fontsize: 14,
                    bold: !1,
                    italic: !1,
                    showLabel: !0
                },
                linetoolarrowmarkup: {
                    color: ce,
                    arrowColor: ce,
                    fontsize: 14,
                    bold: !1,
                    italic: !1,
                    showLabel: !0
                },
                linetoolarrowmarkright: {
                    color: k,
                    arrowColor: k,
                    fontsize: 14,
                    bold: !1,
                    italic: !1,
                    showLabel: !0
                },
                linetoolarrowmarkdown: {
                    color: te,
                    arrowColor: te,
                    fontsize: 14,
                    bold: !1,
                    italic: !1,
                    showLabel: !0
                },
                linetoolflagmark: {
                    flagColor: k
                },
                linetoolnote: {
                    markerColor: k,
                    textColor: M,
                    backgroundColor: E,
                    backgroundTransparency: 0,
                    borderColor: k,
                    fontSize: 14,
                    bold: !1,
                    italic: !1,
                    fixedSize: !0
                },
                linetoolnoteabsolute: {
                    markerColor: k,
                    textColor: M,
                    backgroundColor: E,
                    backgroundTransparency: 0,
                    borderColor: k,
                    fontSize: 14,
                    bold: !1,
                    italic: !1,
                    fixedSize: !0
                },
                linetoolpricelabel: {
                    color: M,
                    backgroundColor: k,
                    borderColor: k,
                    fontWeight: "bold",
                    fontsize: 14,
                    transparency: 0
                },
                linetoolarrowmarker: {
                    backgroundColor: N,
                    textColor: N,
                    bold: !0,
                    italic: !1,
                    fontsize: 16,
                    showLabel: !0
                },
                linetoolrectangle: {
                    color: ie,
                    fillBackground: !0,
                    backgroundColor: re,
                    linewidth: 1,
                    transparency: 50,
                    showLabel: !1,
                    horzLabelsAlign: "left",
                    vertLabelsAlign: "bottom",
                    textColor: ie,
                    fontSize: 14,
                    bold: !1,
                    italic: !1,
                    extendLeft: !1,
                    extendRight: !1
                },
                linetoolrotatedrectangle: {
                    color: _e,
                    fillBackground: !0,
                    backgroundColor: me,
                    transparency: 50,
                    linewidth: 1
                },
                linetoolcircle: {
                    color: fe,
                    backgroundColor: ve,
                    fillBackground: !0,
                    linewidth: 1,
                    showLabel: !1,
                    textColor: fe,
                    fontSize: 14,
                    bold: !1,
                    italic: !1
                },
                linetoolellipse: {
                    color: Z,
                    fillBackground: !0,
                    backgroundColor: J,
                    transparency: 50,
                    linewidth: 1,
                    showLabel: !1,
                    textColor: Z,
                    fontSize: 14,
                    bold: !1,
                    italic: !1
                },
                linetoolarc: {
                    color: oe,
                    fillBackground: !0,
                    backgroundColor: ae,
                    transparency: 80,
                    linewidth: 1
                },
                linetoolprediction: {
                    linecolor: k,
                    linewidth: 1,
                    sourceBackColor: k,
                    sourceTextColor: M,
                    sourceStrokeColor: k,
                    targetStrokeColor: k,
                    targetBackColor: k,
                    targetTextColor: M,
                    successBackground: _e,
                    successTextColor: M,
                    failureBackground: Z,
                    failureTextColor: M,
                    intermediateBackColor: "#ead289",
                    intermediateTextColor: "#6d4d22",
                    transparency: 10,
                    centersColor: "#202020"
                },
                linetooltriangle: {
                    color: ce,
                    fillBackground: !0,
                    backgroundColor: he,
                    transparency: 80,
                    linewidth: 1
                },
                linetoolcallout: {
                    color: M,
                    backgroundColor: G,
                    transparency: 50,
                    linewidth: 1,
                    fontsize: 14,
                    bordercolor: j,
                    bold: !1,
                    italic: !1,
                    wordWrap: !1,
                    wordWrapWidth: 200
                },
                linetoolparallelchannel: {
                    linecolor: k,
                    linewidth: 2,
                    linestyle: P,
                    extendLeft: !1,
                    extendRight: !1,
                    fillBackground: !0,
                    backgroundColor: R,
                    transparency: 20,
                    showMidline: !0,
                    midlinecolor: k,
                    midlinewidth: 1,
                    midlinestyle: x
                },
                linetoolelliottimpulse: {
                    degree: 7,
                    showWave: !0,
                    color: "#3d85c6",
                    linewidth: 1
                },
                linetoolelliotttriangle: {
                    degree: 7,
                    showWave: !0,
                    color: fe,
                    linewidth: 1
                },
                linetoolelliotttriplecombo: {
                    degree: 7,
                    showWave: !0,
                    color: "#6aa84f",
                    linewidth: 1
                },
                linetoolelliottcorrection: {
                    degree: 7,
                    showWave: !0,
                    color: "#3d85c6",
                    linewidth: 1
                },
                linetoolelliottdoublecombo: {
                    degree: 7,
                    showWave: !0,
                    color: "#6aa84f",
                    linewidth: 1
                },
                linetoolbarspattern: {
                    color: k,
                    mode: c.Bars,
                    mirrored: !1,
                    flipped: !1
                },
                linetoolghostfeed: {
                    averageHL: 20,
                    variance: 50,
                    candleStyle: {
                        upColor: le,
                        downColor: $,
                        drawWick: !0,
                        drawBorder: !0,
                        borderColor: "#378658",
                        borderUpColor: ce,
                        borderDownColor: Z,
                        wickColor: xe
                    },
                    transparency: 50
                },
                study: {
                    inputs: {},
                    styles: {},
                    bands: {},
                    graphics: {},
                    ohlcPlots: {},
                    palettes: {},
                    filledAreasStyle: {},
                    filledAreas: {},
                    visible: !0,
                    showLegendValues: !0,
                    showLabelsOnPriceScale: !0,
                    precision: "default"
                },
                linetoolpitchfork: {
                    fillBackground: !0,
                    transparency: 80,
                    style: l.Original,
                    median: {
                        visible: !0,
                        color: Z,
                        linewidth: 1,
                        linestyle: P
                    },
                    extendLines: !1,
                    level0: r(.25, ge, !1),
                    level1: r(.382, pe, !1),
                    level2: r(.5, ce, !0),
                    level3: r(.618, ce, !1),
                    level4: r(.75, H, !1),
                    level5: r(1, k, !0),
                    level6: r(1.5, ie, !1),
                    level7: r(1.75, oe, !1),
                    level8: r(2, Y, !1)
                },
                linetoolpitchfan: {
                    fillBackground: !0,
                    transparency: 80,
                    median: {
                        visible: !0,
                        color: Z,
                        linewidth: 1,
                        linestyle: P
                    },
                    level0: r(.25, ge, !1),
                    level1: r(.382, pe, !1),
                    level2: r(.5, H, !0),
                    level3: r(.618, ce, !1),
                    level4: r(.75, H, !1),
                    level5: r(1, k, !0),
                    level6: r(1.5, ie, !1),
                    level7: r(1.75, oe, !1),
                    level8: r(2, Y, !1)
                },
                linetoolgannfan: {
                    showLabels: !0,
                    fillBackground: !0,
                    transparency: 80,
                    level1: Te(1, 8, fe, !0),
                    level2: Te(1, 4, ce, !0),
                    level3: Te(1, 3, _e, !0),
                    level4: Te(1, 2, ce, !0),
                    level5: Te(1, 1, H, !0),
                    level6: Te(2, 1, k, !0),
                    level7: Te(3, 1, ie, !0),
                    level8: Te(4, 1, oe, !0),
                    level9: Te(8, 1, Z, !0)
                },
                linetoolganncomplex: {
                    fillBackground: !1,
                    arcsBackground: {
                        fillBackground: !0,
                        transparency: 80
                    },
                    reverse: !1,
                    scaleRatio: "",
                    showLabels: !0,
                    labelsStyle: {
                        fontSize: 12,
                        bold: !1,
                        italic: !1
                    },
                    levels: [h(xe, !0, 1), h(fe, !0, 1), h(H, !0, 1), h(_e, !0, 1), h(ce, !0, 1), h(xe, !0, 1)],
                    fanlines: [T(O, !1, 1, 8, 1), T(Z, !1, 1, 5, 1), T(xe, !1, 1, 4, 1), T(fe, !1, 1, 3, 1), T(H, !0, 1, 2, 1), T(_e, !0, 1, 1, 1), T(ce, !0, 1, 1, 2), T(ce, !1, 1, 1, 3), T(k, !1, 1, 1, 4), T(F, !1, 1, 1, 5), T(O, !1, 1, 1, 8)],
                    arcs: [T(fe, !0, 1, 1, 0), T(fe, !0, 1, 1, 1), T(fe, !0, 1, 1.5, 0), T(H, !0, 1, 2, 0), T(H, !0, 1, 2, 1), T(_e, !0, 1, 3, 0), T(_e, !0, 1, 3, 1), T(ce, !0, 1, 4, 0), T(ce, !0, 1, 4, 1), T(k, !0, 1, 5, 0), T(k, !0, 1, 5, 1)]
                },
                linetoolgannfixed: {
                    fillBackground: !1,
                    arcsBackground: {
                        fillBackground: !0,
                        transparency: 80
                    },
                    reverse: !1,
                    levels: [h(xe, !0, 1), h(fe, !0, 1), h(H, !0, 1), h(_e, !0, 1), h(ce, !0, 1), h(xe, !0, 1)],
                    fanlines: [T(O, !1, 1, 8, 1), T(Z, !1, 1, 5, 1), T(xe, !1, 1, 4, 1), T(fe, !1, 1, 3, 1), T(H, !0, 1, 2, 1), T(_e, !0, 1, 1, 1), T(ce, !0, 1, 1, 2), T(ce, !1, 1, 1, 3), T(k, !1, 1, 1, 4), T(F, !1, 1, 1, 5), T(O, !1, 1, 1, 8)],
                    arcs: [T(fe, !0, 1, 1, 0), T(fe, !0, 1, 1, 1), T(fe, !0, 1, 1.5, 0), T(H, !0, 1, 2, 0), T(H, !0, 1, 2, 1), T(_e, !0, 1, 3, 0), T(_e, !0, 1, 3, 1), T(ce, !0, 1, 4, 0), T(ce, !0, 1, 4, 1), T(k, !0, 1, 5, 0), T(k, !0, 1, 5, 1)]
                },
                linetoolgannsquare: {
                    color: "rgba(21, 56, 153, 0.8)",
                    linewidth: 1,
                    linestyle: P,
                    showTopLabels: !0,
                    showBottomLabels: !0,
                    showLeftLabels: !0,
                    showRightLabels: !0,
                    fillHorzBackground: !0,
                    horzTransparency: 80,
                    fillVertBackground: !0,
                    vertTransparency: 80,
                    reverse: !1,
                    fans: t(Pe, !1),
                    hlevel1: i(0, xe, !0),
                    hlevel2: i(.25, fe, !0),
                    hlevel3: i(.382, H, !0),
                    hlevel4: i(.5, _e, !0),
                    hlevel5: i(.618, ce, !0),
                    hlevel6: i(.75, k, !0),
                    hlevel7: i(1, xe, !0),
                    vlevel1: i(0, xe, !0),
                    vlevel2: i(.25, fe, !0),
                    vlevel3: i(.382, H, !0),
                    vlevel4: i(.5, _e, !0),
                    vlevel5: i(.618, ce, !0),
                    vlevel6: i(.75, k, !0),
                    vlevel7: i(1, xe, !0)
                },
                linetoolfibspeedresistancefan: {
                    fillBackground: !0,
                    transparency: 80,
                    grid: {
                        color: "rgba(21, 56, 153, 0.8)",
                        linewidth: 1,
                        linestyle: P,
                        visible: !0
                    },
                    linewidth: 1,
                    linestyle: P,
                    showTopLabels: !0,
                    showBottomLabels: !0,
                    showLeftLabels: !0,
                    showRightLabels: !0,
                    reverse: !1,
                    hlevel1: i(0, xe, !0),
                    hlevel2: i(.25, fe, !0),
                    hlevel3: i(.382, H, !0),
                    hlevel4: i(.5, _e, !0),
                    hlevel5: i(.618, ce, !0),
                    hlevel6: i(.75, k, !0),
                    hlevel7: i(1, xe, !0),
                    vlevel1: i(0, xe, !0),
                    vlevel2: i(.25, fe, !0),
                    vlevel3: i(.382, H, !0),
                    vlevel4: i(.5, _e, !0),
                    vlevel5: i(.618, ce, !0),
                    vlevel6: i(.75, k, !0),
                    vlevel7: i(1, xe, !0)
                },
                linetoolfibretracement: {
                    showCoeffs: !0,
                    showPrices: !0,
                    fillBackground: !0,
                    transparency: 80,
                    extendLines: !1,
                    extendLinesLeft: !1,
                    horzLabelsAlign: "left",
                    vertLabelsAlign: "bottom",
                    reverse: !1,
                    coeffsAsPercents: !1,
                    fibLevelsBasedOnLogScale: !1,
                    labelFontSize: 12,
                    trendline: {
                        visible: !0,
                        color: xe,
                        linewidth: 1,
                        linestyle: x
                    },
                    levelsStyle: {
                        linewidth: 1,
                        linestyle: P
                    },
                    level1: i(0, xe, !0),
                    level2: i(.236, Z, !0),
                    level3: i(.382, fe, !0),
                    level4: i(.5, _e, !0),
                    level5: i(.618, ce, !0),
                    level6: i(.786, H, !0),
                    level7: i(1, xe, !0),
                    level8: i(1.618, k, !0),
                    level9: i(2.618, Z, !0),
                    level10: i(3.618, ie, !0),
                    level11: i(4.236, oe, !0),
                    level12: i(1.272, fe, !1),
                    level13: i(1.414, Z, !1),
                    level16: i(2, ce, !1),
                    level14: i(2.272, fe, !1),
                    level15: i(2.414, _e, !1),
                    level17: i(3, H, !1),
                    level18: i(3.272, xe, !1),
                    level19: i(3.414, k, !1),
                    level20: i(4, Z, !1),
                    level21: i(4.272, ie, !1),
                    level22: i(4.414, oe, !1),
                    level23: i(4.618, fe, !1),
                    level24: i(4.764, ce, !1)
                },
                linetoolfibchannel: {
                    showCoeffs: !0,
                    showPrices: !0,
                    fillBackground: !0,
                    transparency: 80,
                    extendLeft: !1,
                    extendRight: !1,
                    horzLabelsAlign: "left",
                    vertLabelsAlign: "middle",
                    coeffsAsPercents: !1,
                    labelFontSize: 12,
                    levelsStyle: {
                        linewidth: 1,
                        linestyle: P
                    },
                    level1: i(0, xe, !0),
                    level2: i(.236, Z, !0),
                    level3: i(.382, fe, !0),
                    level4: i(.5, _e, !0),
                    level5: i(.618, ce, !0),
                    level6: i(.786, H, !0),
                    level7: i(1, xe, !0),
                    level8: i(1.618, k, !0),
                    level9: i(2.618, Z, !0),
                    level10: i(3.618, ie, !0),
                    level11: i(4.236, oe, !0),
                    level12: i(1.272, fe, !1),
                    level13: i(1.414, Z, !1),
                    level16: i(2, ce, !1),
                    level14: i(2.272, fe, !1),
                    level15: i(2.414, _e, !1),
                    level17: i(3, H, !1),
                    level18: i(3.272, xe, !1),
                    level19: i(3.414, k, !1),
                    level20: i(4, Z, !1),
                    level21: i(4.272, ie, !1),
                    level22: i(4.414, oe, !1),
                    level23: i(4.618, fe, !1),
                    level24: i(4.764, ce, !1)
                },
                linetoolprojection: {
                    showCoeffs: !0,
                    fillBackground: !0,
                    transparency: 80,
                    color1: R,
                    color2: re,
                    linewidth: 1,
                    trendline: {
                        visible: !0,
                        color: Pe,
                        linestyle: P
                    },
                    level1: r(1, "#808080", !0)
                },
                linetool5pointspattern: {
                    color: k,
                    textcolor: M,
                    fillBackground: !0,
                    backgroundColor: k,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    transparency: 85,
                    linewidth: 1
                },
                linetoolcypherpattern: {
                    color: k,
                    textcolor: M,
                    fillBackground: !0,
                    backgroundColor: k,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    transparency: 85,
                    linewidth: 1
                },
                linetooltrianglepattern: {
                    color: W,
                    textcolor: M,
                    fillBackground: !0,
                    backgroundColor: W,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    transparency: 85,
                    linewidth: 1
                },
                linetoolabcd: {
                    color: ce,
                    textcolor: M,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    linewidth: 1
                },
                linetoolthreedrivers: {
                    color: W,
                    textcolor: M,
                    fillBackground: !0,
                    backgroundColor: "rgba(149, 40, 204, 0.5)",
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    transparency: 50,
                    linewidth: 1
                },
                linetoolheadandshoulders: {
                    color: ce,
                    textcolor: M,
                    fillBackground: !0,
                    backgroundColor: ce,
                    fontsize: 12,
                    bold: !1,
                    italic: !1,
                    transparency: 85,
                    linewidth: 1
                },
                linetoolfibwedge: {
                    showCoeffs: !0,
                    fillBackground: !0,
                    transparency: 80,
                    trendline: {
                        visible: !0,
                        color: "#808080",
                        linewidth: 1,
                        linestyle: P
                    },
                    level1: r(.236, Z, !0),
                    level2: r(.382, fe, !0),
                    level3: r(.5, _e, !0),
                    level4: r(.618, ce, !0),
                    level5: r(.786, H, !0),
                    level6: r(1, xe, !0),
                    level7: r(1.618, k, !1),
                    level8: r(2.618, Z, !1),
                    level9: r(3.618, W, !1),
                    level10: r(4.236, oe, !1),
                    level11: r(4.618, oe, !1)
                },
                linetoolfibcircles: {
                    showCoeffs: !0,
                    fillBackground: !0,
                    transparency: 80,
                    coeffsAsPercents: !1,
                    trendline: {
                        visible: !0,
                        color: xe,
                        linewidth: 1,
                        linestyle: x
                    },
                    level1: r(.236, Z, !0),
                    level2: r(.382, fe, !0),
                    level3: r(.5, ce, !0),
                    level4: r(.618, _e, !0),
                    level5: r(.786, H, !0),
                    level6: r(1, xe, !0),
                    level7: r(1.618, k, !0),
                    level8: r(2.618, oe, !0),
                    level9: r(3.618, k, !0),
                    level10: r(4.236, oe, !0),
                    level11: r(4.618, Z, !0)
                },
                linetoolfibspeedresistancearcs: {
                    showCoeffs: !0,
                    fillBackground: !0,
                    transparency: 80,
                    fullCircles: !1,
                    trendline: {
                        visible: !0,
                        color: xe,
                        linewidth: 1,
                        linestyle: x
                    },
                    level1: r(.236, Z, !0),
                    level2: r(.382, fe, !0),
                    level3: r(.5, ce, !0),
                    level4: r(.618, _e, !0),
                    level5: r(.786, H, !0),
                    level6: r(1, xe, !0),
                    level7: r(1.618, k, !0),
                    level8: r(2.618, oe, !0),
                    level9: r(3.618, k, !0),
                    level10: r(4.236, oe, !0),
                    level11: r(4.618, Z, !0)
                },
                linetooltrendbasedfibextension: {
                    showCoeffs: !0,
                    showPrices: !0,
                    fillBackground: !0,
                    transparency: 80,
                    extendLines: !1,
                    extendLinesLeft: !1,
                    horzLabelsAlign: "left",
                    vertLabelsAlign: "bottom",
                    reverse: !1,
                    coeffsAsPercents: !1,
                    fibLevelsBasedOnLogScale: !1,
                    labelFontSize: 12,
                    trendline: {
                        visible: !0,
                        color: xe,
                        linewidth: 1,
                        linestyle: x
                    },
                    levelsStyle: {
                        linewidth: 1,
                        linestyle: P
                    },
                    level1: i(0, xe, !0),
                    level2: i(.236, Z, !0),
                    level3: i(.382, fe, !0),
                    level4: i(.5, _e, !0),
                    level5: i(.618, ce, !0),
                    level6: i(.786, H, !0),
                    level7: i(1, xe, !0),
                    level8: i(1.618, k, !0),
                    level9: i(2.618, Z, !0),
                    level10: i(3.618, ie, !0),
                    level11: i(4.236, oe, !0),
                    level12: i(1.272, fe, !1),
                    level13: i(1.414, Z, !1),
                    level16: i(2, ce, !1),
                    level14: i(2.272, fe, !1),
                    level15: i(2.414, _e, !1),
                    level17: i(3, H, !1),
                    level18: i(3.272, xe, !1),
                    level19: i(3.414, k, !1),
                    level20: i(4, Z, !1),
                    level21: i(4.272, ie, !1),
                    level22: i(4.414, oe, !1),
                    level23: i(4.618, fe, !1),
                    level24: i(4.764, ce, !1)
                },
                linetooltrendbasedfibtime: {
                    showCoeffs: !0,
                    fillBackground: !0,
                    transparency: 80,
                    horzLabelsAlign: "right",
                    vertLabelsAlign: "bottom",
                    trendline: {
                        visible: !0,
                        color: xe,
                        linewidth: 1,
                        linestyle: x
                    },
                    level1: r(0, xe, !0),
                    level2: r(.382, Z, !0),
                    level3: r(.5, pe, !1),
                    level4: r(.618, _e, !0),
                    level5: r(1, ce, !0),
                    level6: r(1.382, H, !0),
                    level7: r(1.618, xe, !0),
                    level8: r(2, k, !0),
                    level9: r(2.382, oe, !0),
                    level10: r(2.618, ie, !0),
                    level11: r(3, W, !0)
                },
                linetoolschiffpitchfork: {
                    fillBackground: !0,
                    transparency: 80,
                    style: l.Schiff,
                    median: {
                        visible: !0,
                        color: Z,
                        linewidth: 1,
                        linestyle: P
                    },
                    extendLines: !1,
                    level0: r(.25, ge, !1),
                    level1: r(.382, pe, !1),
                    level2: r(.5, ce, !0),
                    level3: r(.618, ce, !1),
                    level4: r(.75, H, !1),
                    level5: r(1, k, !0),
                    level6: r(1.5, ie, !1),
                    level7: r(1.75, oe, !1),
                    level8: r(2, Y, !1)
                },
                linetoolschiffpitchfork2: {
                    fillBackground: !0,
                    transparency: 80,
                    style: l.Schiff2,
                    median: {
                        visible: !0,
                        color: Z,
                        linewidth: 1,
                        linestyle: P
                    },
                    extendLines: !1,
                    level0: r(.25, ge, !1),
                    level1: r(.382, pe, !1),
                    level2: r(.5, ce, !0),
                    level3: r(.618, ce, !1),
                    level4: r(.75, H, !1),
                    level5: r(1, k, !0),
                    level6: r(1.5, ie, !1),
                    level7: r(1.75, oe, !1),
                    level8: r(2, Y, !1)
                },
                linetoolinsidepitchfork: {
                    fillBackground: !0,
                    transparency: 80,
                    style: l.Inside,
                    median: {
                        visible: !0,
                        color: Z,
                        linewidth: 1,
                        linestyle: P
                    },
                    extendLines: !1,
                    level0: r(.25, ge, !1),
                    level1: r(.382, pe, !1),
                    level2: r(.5, ce, !0),
                    level3: r(.618, ce, !1),
                    level4: r(.75, H, !1),
                    level5: r(1, k, !0),
                    level6: r(1.5, ie, !1),
                    level7: r(1.75, oe, !1),
                    level8: r(2, Y, !1)
                },
                linetoolregressiontrend: {
                    linewidth: 1,
                    linestyle: P,
                    styles: {
                        upLine: {
                            display: u.All,
                            color: D,
                            linestyle: P,
                            linewidth: 2
                        },
                        downLine: {
                            display: u.All,
                            color: D,
                            linestyle: P,
                            linewidth: 2
                        },
                        baseLine: {
                            display: u.All,
                            color: X,
                            linestyle: x,
                            linewidth: 1
                        },
                        extendLines: !1,
                        showPearsons: !0,
                        transparency: 70
                    }
                }
            }, Oe(TradingView.defaultProperties.chartproperties), We()
        }
        if (void 0 === TradingView.defaultProperties["study_MA@tv-basicstudies"] && (TradingView.defaultProperties["study_MA@tv-basicstudies"] = {
                description: "Moving Average",
                shortDescription: "MA",
                inputs: {
                    length: 9,
                    source: "close"
                },
                styles: {
                    MovAvg: {
                        display: u.All,
                        color: k,
                        linestyle: P,
                        linewidth: 1,
                        plottype: d.Line,
                        histogramBase: 0,
                        title: "MA"
                    }
                }
            }), void 0 === TradingView.defaultProperties["study_PivotPointsHighLow@tv-basicstudies"] && (TradingView.defaultProperties["study_PivotPointsHighLow@tv-basicstudies"] = {
                fontsize: 10,
                borderColor: k,
                backColor: L,
                textColor: Ae
            }), void 0 === TradingView.defaultProperties["study_PivotPointsStandard@tv-basicstudies"]) {
            var Ne = !0;
            TradingView.defaultProperties["study_PivotPointsStandard@tv-basicstudies"] = {
                _hardCodedDefaultsVersion: 1,
                fontsize: 11,
                levelsStyle: {
                    showLabels: !0,
                    visibility: {
                        P: Ne,
                        "S1/R1": Ne,
                        "S2/R2": Ne,
                        "S3/R3": Ne,
                        "S4/R4": Ne,
                        "S5/R5": Ne
                    },
                    colors: {
                        P: Se,
                        "S1/R1": Se,
                        "S2/R2": Se,
                        "S3/R3": Se,
                        "S4/R4": Se,
                        "S5/R5": Se
                    },
                    widths: {
                        P: 1,
                        "S1/R1": 1,
                        "S2/R2": 1,
                        "S3/R3": 1,
                        "S4/R4": 1,
                        "S5/R5": 1
                    }
                }
            }
        }
        if (void 0 === TradingView.defaultProperties["study_ZigZag@tv-basicstudies"] && (TradingView.defaultProperties["study_ZigZag@tv-basicstudies"] = {
                color: k,
                linewidth: 2
            }), void 0 === TradingView.defaultProperties["study_ElliottWave@tv-basicstudies"] && (TradingView.defaultProperties["study_ElliottWave@tv-basicstudies"] = {
                inputs: {},
                level0: t(q, !1),
                level1: t("#008000", !1),
                level2: t("#0000ff", !1),
                level3: t("#ff00ff", !1),
                level4: t("#0080ff", !0),
                level5: t(q, !0),
                level6: t("#008000", !0),
                level7: t("#0000ff", !0),
                level8: t("#ff00ff", !0)
            }), void 0 === TradingView.defaultProperties["study_LinearRegression@tv-basicstudies"] && (TradingView.defaultProperties["study_LinearRegression@tv-basicstudies"] = {
                styles: {
                    upLine: {
                        display: u.All,
                        color: D,
                        linestyle: P,
                        linewidth: 1
                    },
                    downLine: {
                        display: u.All,
                        color: D,
                        linestyle: P,
                        linewidth: 1
                    },
                    baseLine: {
                        display: u.All,
                        color: X,
                        linestyle: P,
                        linewidth: 1
                    },
                    extendLines: !0,
                    showPearsons: !0,
                    backgroundColor: "rgba(153, 21, 21, 0.3)",
                    transparency: 70
                }
            }), void 0 === TradingView.defaultProperties["study_Compare@tv-basicstudies"] && (TradingView.defaultProperties["study_Compare@tv-basicstudies"] = {
                minTick: "default"
            }), void 0 === TradingView.defaultProperties["study_Overlay@tv-basicstudies"]) {
            TradingView.defaultProperties["study_Overlay@tv-basicstudies"] = {
                style: a.STYLE_LINE,
                allowExtendTimeScale: !1,
                showPriceLine: !1,
                minTick: "default",
                candleStyle: {
                    upColor: "#6ba583",
                    downColor: "#d75442",
                    drawWick: !0,
                    drawBorder: !0,
                    drawBody: !0,
                    borderColor: "#378658",
                    borderUpColor: "#225437",
                    borderDownColor: "#5b1a13",
                    wickColor: "#737375",
                    wickUpColor: "#737375",
                    wickDownColor: "#737375",
                    barColorsOnPrevClose: !1
                },
                hollowCandleStyle: {
                    upColor: "#6ba583",
                    downColor: "#d75442",
                    drawWick: !0,
                    drawBorder: !0,
                    drawBody: !0,
                    borderColor: "#378658",
                    borderUpColor: "#225437",
                    borderDownColor: "#5b1a13",
                    wickColor: "#737375",
                    wickUpColor: "#737375",
                    wickDownColor: "#737375",
                    barColorsOnPrevClose: !1
                },
                barStyle: {
                    upColor: "#6ba583",
                    downColor: "#d75442",
                    barColorsOnPrevClose: !1,
                    dontDrawOpen: !1,
                    thinBars: !0
                },
                lineStyle: {
                    color: ye,
                    linestyle: P,
                    linewidth: 2,
                    priceSource: "close"
                },
                lineWithMarkersStyle: {
                    color: ye,
                    linestyle: P,
                    linewidth: 2,
                    priceSource: "close"
                },
                steplineStyle: {
                    color: ye,
                    linestyle: P,
                    linewidth: 2,
                    priceSource: "close"
                },
                areaStyle: {
                    color1: k,
                    color2: k,
                    linecolor: k,
                    linestyle: P,
                    linewidth: 2,
                    priceSource: "close",
                    transparency: 95
                },
                baselineStyle: {
                    baselineColor: ke,
                    topFillColor1: De,
                    topFillColor2: De,
                    bottomFillColor1: Be,
                    bottomFillColor2: Be,
                    topLineColor: Ee,
                    bottomLineColor: Ve,
                    topLineWidth: 2,
                    bottomLineWidth: 2,
                    priceSource: "close",
                    transparency: 50,
                    baseLevelPercentage: 50
                },
                hiloStyle: {
                    color: k,
                    showBorders: !0,
                    borderColor: k,
                    showLabels: !0,
                    labelColor: k,
                    drawBody: !0
                },
                columnStyle: {
                    upColor: n(ce, 50),
                    downColor: n(Z, 50),
                    barColorsOnPrevClose: !0,
                    priceSource: "close"
                },
                hlcAreaStyle: {
                    highLineColor: ce,
                    highLineStyle: P,
                    highLineWidth: 2,
                    lowLineColor: Z,
                    lowLineStyle: P,
                    lowLineWidth: 2,
                    closeLineColor: Ce,
                    closeLineStyle: P,
                    closeLineWidth: 2,
                    highCloseFillColor: he,
                    closeLowFillColor: J
                },
                styles: {
                    open: {
                        display: u.All,
                        color: q,
                        linestyle: P,
                        linewidth: 1,
                        plottype: d.Line,
                        histogramBase: 0
                    },
                    high: {
                        display: u.All,
                        color: q,
                        linestyle: P,
                        linewidth: 1,
                        plottype: d.Line,
                        histogramBase: 0
                    },
                    low: {
                        display: u.All,
                        color: q,
                        linestyle: P,
                        linewidth: 1,
                        plottype: d.Line,
                        histogramBase: 0
                    },
                    close: {
                        display: u.All,
                        color: q,
                        linestyle: P,
                        linewidth: 1,
                        plottype: d.Line,
                        histogramBase: 0
                    }
                }
            }
        }
        for (var Fe = e.split("."), ze = TradingView.defaultProperties, He = 0; He < Fe.length; He++) ze && (ze = ze[Fe[He]]);
        return null != ze ? TradingView.clone(ze) : {}
    };

    function Ne(e, t, i, s, r) {
        if (s)
            for (var n in s) {
                var o = n.split("."),
                    a = c(o[0]),
                    l = void 0 !== r && r === o[0];
                0 !== o.length && l && (a = c((o = o.slice(1))[0])), 0 !== o.length && e.hasOwnProperty(a) ? h(e, o, s[n]) || d(n) : l && d(n)
            }

        function c(e) {
            return t && t[e] ? t[e] : e
        }

        function h(e, t, i, s) {
            var r = c(t[0]);
            return !!e.hasOwnProperty(r) && (t.length > 1 ? h(e[r], t.slice(1), i) : (e[r] && e[r].setValue ? e[r].setValue(i) : e[r] = i, !0))
        }

        function d(e) {
            i || T.logWarn("Path `" + e + "` does not exist.")
        }
    }

    function Oe(e, t, i, s) {
        window.__defaultsOverrides && Ne(e, t, i, window.__defaultsOverrides, s)
    }

    function Fe(e, t) {
        window.__settingsOverrides && Ne(e, null, !1, window.__settingsOverrides, t)
    }

    function We() {
        var e = /^linetool.+/;
        Object.keys(TradingView.defaultProperties).forEach((function(t) {
            e.test(t) && Oe(TradingView.defaultProperties[t], null, !1, t)
        }))
    }

    function ze(e, t) {
        return t ? function(e, t) {
            var i = Re(e);
            if (!window._UNIT_TESTS) {
                var s = TradingView.clone(TVSettings.getJSON(e, null));
                if (function(e) {
                        var t = new Set(["linetoolregressiontrend"]);
                        return e.startsWith("study_") || t.has(e)
                    }(e) && s && function(e) {
                        if (!e) return !1;
                        e = e.toString();
                        var t = new RegExp("\\d+").exec(e);
                        return null !== t && t[0] === e
                    }(s.version)) {
                    var r = s.inputs,
                        n = t.updateStudyInputs(s.id, s.version, "last", r, null);
                    s.inputs = n, s = t.updateStudyState(s, s)
                }
                TradingView.merge(i, s), Fe(i, e)
            }
            return i
        }(e, t) : function(e) {
            var t = Re(e);
            if (!window._UNIT_TESTS) {
                var i = TradingView.clone(TVSettings.getJSON(e, null));
                if (i) {
                    TradingView.merge(t, i);
                    const s = e.split(".");
                    Fe(t, void 0 === s[1] ? e : s[1])
                }
            }
            return t
        }(e)
    }
    ze.create = function(e, t) {
        if (t) {
            var i = Re(e);
            TradingView.defaultProperties[e] = Object.assign(t, i)
        }
    }, ze.remove = function(e) {
        TradingView.defaultProperties[e] = void 0
    }, TradingView.saveDefaults = function(e, t) {
        void 0 === t ? TVSettings.remove(e) : TVSettings.setJSON(e, t)
    }, TradingView.factoryDefaults = Re, window.applyDefaultOverridesToLinetools = We, window.applyDefaultsOverrides = Oe, window.applyPropertiesOverrides = Ne, window.defaults = ze, t.applyDefaultOverridesToLinetools = We, t.applyDefaultsOverrides = Oe, t.applyPropertiesOverrides = Ne, t.defaults = ze, t.factoryDefaults = Re, t.saveDefaults = TradingView.saveDefaults
}