(e, t, i) => {
    "use strict";
    i.d(t, {
        SeriesBase: () => ei
    });
    var s = i(50151),
        r = i(49483),
        n = i(51768),
        o = i(76422),
        a = i(59224),
        l = i(80842),
        c = i(13497),
        h = i(97034),
        d = i(86094),
        u = i(34256),
        p = i(59452),
        _ = i.n(p),
        m = i(42960),
        g = i(66846),
        f = i(61146),
        v = i(88732),
        S = i(79055),
        y = i(44352),
        b = i(14483),
        w = i(58557),
        P = i(11877),
        C = i(11321);

    function x(e) {
        const t = "QUANDL" === (e = e || {}).exchange,
            s = {
                title: "",
                description: "",
                interval: "",
                exchange: "",
                provider: "",
                chartStyle: "",
                sessionDescription: "",
                priceSource: ""
            };
        let r = "";
        if (e.description && t)
            if (2 === e.description.split("/").length) r = e.description.split("/")[1];
            else {
                e.description.split("'").filter((e => e.length)).forEach((e => {
                    let t = [];
                    t = e && ("/" === e[0] || /\d+\/\(?/.test(e)) ? [e] : e.split("/").filter((e => e.length)), r += t[2 === t.length ? 1 : 0]
                }))
            }
        else r = e.description ? e.description : e.symbol;
        if (e.ticker ? (s.title = e.ticker, s.description = T(r)) : s.title = T(r), e.interval && (s.interval = (0, C.translatedIntervalString)(e.interval)), t && e.description) {
            const t = /[\w_]+\/[\w_]+/.exec(e.description);
            t && t[0] ? s.provider = T(t[0].split("/")[0]) : s.provider = T(e.description.split("/")[0])
        }
        return e.exchange && (s.exchange = T(e.exchange)), s.chartStyle = T(function(e) {
            return e.inputs, 8 === e.style ? y.t(null, void 0, i(40530)) : ""
        }(e)), e.sessionDescription && (s.sessionDescription = T(e.sessionDescription)), void 0 !== e.priceSource && (s.priceSource = T(e.priceSource)), s
    }

    function T(e) {
        return e.replace(/'/g, "")
    }
    const I = y.t(null, void 0, i(89659)),
        M = b.enabled("hide_unresolved_symbols_in_legend"),
        A = b.enabled("symbol_info_price_source");
    class L extends P.StatusProviderBase {
        constructor(e, t, i, s) {
            super(t), this._series = e, this._statusViewProperties = i, this._options = s || {}
        }
        text() {
            return function(e) {
                const t = x(e);
                return (e.ticker ? t.description : t.title) + (t.interval ? ", " + t.interval : "") + function(e, t = ", ") {
                    return (e.provider ? `${t}${e.provider}` : "") + (e.exchange ? `${t}${e.exchange}` : "") + (e.chartStyle ? `${t}${e.chartStyle}` : "") + (e.branding ? `${t}${e.branding}` : "") + (e.sessionDescription ? `${t}${e.sessionDescription}` : "")
                }(t)
            }(this._getTitleGenerationOptions())
        }
        getSplitTitle() {
            return x(this._getTitleGenerationOptions())
        }
        bold() {
            return !1
        }
        size() {
            return this._statusViewProperties.childs().fontSize.value() + "px"
        }
        errorStatus() {
            const e = this._series.seriesErrorMessage();
            return null !== e ? {
                error: e,
                title: I
            } : null
        }
        _getTitleGenerationOptions() {
            var e, t, i;
            const s = this._series.symbolInfo(),
                r = this._statusViewProperties.childs(),
                n = this._series.symbolTextSourceProxyProperty().value();
            let o;
            if (r.showExchange.value() && s) {
                const i = (0, m.isEconomicSymbol)(s) && (null !== (t = null === (e = s.source2) || void 0 === e ? void 0 : e.description) && void 0 !== t ? t : s.source);
                o = i || s.exchange
            }
            const a = null !== (i = A && (null == s ? void 0 : s.price_source_id) ? this._series.model().availablePriceSources().name(s.price_source_id) : null) && void 0 !== i ? i : void 0;
            return {
                description: E(n, s),
                exchange: o,
                symbol: M && null === s ? "" : this._series.symbol(),
                interval: r.showInterval.value() && !this._options.hideResolution ? this._series.interval() : void 0,
                style: this._series.properties().childs().style.value(),
                inputs: this._series.getInputsProperties().state(),
                boxSize: this._series.data().boxSize,
                reversalAmount: this._series.data().reversalAmount,
                ticker: k(n, s),
                priceSource: a
            }
        }
    }

    function k(e, t) {
        return "ticker-and-description" !== e ? "" : null !== t ? t.name : void 0
    }

    function E(e, t) {
        if (null !== t) return "ticker" === e ? t.name : "long-description" === e && void 0 !== t.long_description ? t.long_description : (0, w.getTranslatedSymbolDescription)({
            pro_name: t.pro_name || void 0,
            short_name: t.name || void 0,
            description: t.description || void 0,
            short_description: t.short_description || void 0,
            local_description: t.local_description || void 0,
            language: t.language || void 0
        })
    }
    class D extends S.StatusView {
        constructor(e, t, i, s) {
            super(new L(e, t, i, s)), this._invalidated = !0, this._series = e, this._series.onRestarted().subscribe(this, this.update), this._series.dataEvents().symbolResolved().subscribe(this, this.update), this._series.dataEvents().completed().subscribe(this, this.update), this._series.boxSizeValue().subscribe(this.update.bind(this)), i.childs().symbolTextSource.listeners().subscribe(this, this.update)
        }
        getSeriesPrecision() {
            let e = 4;
            const t = this._series.symbolInfo();
            return t && t.pricescale && (e = Math.round(Math.log(t.pricescale) / Math.log(10))), e
        }
        round(e) {
            const t = this.getSeriesPrecision(),
                i = Math.round(e * Math.pow(10, t)) / Math.pow(10, t);
            return i ? i.toString() : ""
        }
        update() {
            this._invalidated = !0
        }
        text() {
            return this._updateImpl(), super.text()
        }
        color() {
            return this._updateImpl(), super.color()
        }
        bold() {
            return this._updateImpl(), super.bold()
        }
        size() {
            return this._updateImpl(), super.size()
        }
        getSplitTitle() {
            return this._updateImpl(), this._statusProvider.getSplitTitle()
        }
        _updateImpl() {
            this._invalidated && (this._bold = this._statusProvider.bold(), this._size = this._statusProvider.size(), this._text = this._statusProvider.text(), this._invalidated = !1)
        }
    }
    var V = i(50335),
        B = i(93835),
        R = i(88348),
        N = i(58333),
        O = i(15367);
    const F = r.CheckMobile.any(),
        W = b.enabled("hide_resolution_in_legend");
    class z extends B.DataWindowView {
        constructor(e, t) {
            super(), this._invalidated = !0, this._series = e, this._model = t, this._valuesProvider = this._createValuesProvider(e, t), this._items = this._valuesProvider.getItems().map((e => new B.DataWindowItem(e.id, e.title, "", e.unimportant))), this.update()
        }
        update() {
            this._invalidated = !0
        }
        items() {
            return this._invalidated && (this._updateImpl(), this._invalidated = !1), this._items
        }
        series() {
            return this._series
        }
        _updateImpl() {
            var e, t;
            const i = this._series.symbolInfo();
            if (i) {
                const e = [i.name];
                W || e.push((0, C.translatedIntervalString)(this._series.interval())), (0, m.isEconomicSymbol)(i) && i.source ? e.push(i.source) : e.push((0, r.onWidget)() || "forex" === i.type ? i.exchange : i.listed_exchange), this._header = e.join(", "), this._title = i.description
            } else this._header = this._series.symbol();
            let s = this._model.crossHairSource().appliedIndex();
            b.enabled("use_last_visible_bar_value_in_legend") && !(0, V.isNumber)(s) && (s = null !== (t = null === (e = this._model.timeScale().visibleBarsStrictRange()) || void 0 === e ? void 0 : e.lastBar()) && void 0 !== t ? t : NaN);
            const n = this._valuesProvider.getValues(s);
            for (let e = 0; e < n.length; ++e) {
                const t = n[e],
                    i = this._items[e];
                i.setValue(t.value), i.setVisible(t.visible), i.setColor(t.color)
            }
        }
        _createValuesProvider(e, t) {
            return new N.SeriesValuesProvider(e, t)
        }
        _showLastPriceAndChangeOnly() {
            return F && (null === this._model.crossHairSource().pane || (0, O.isLineToolName)(R.tool.value()) || null !== this._model.lineBeingEdited())
        }
    }
    const H = {
        open: y.t(null, {
            context: "in_legend"
        }, i(78155)),
        high: y.t(null, {
            context: "in_legend"
        }, i(56723)),
        low: y.t(null, {
            context: "in_legend"
        }, i(4292)),
        close: y.t(null, {
            context: "in_legend"
        }, i(77297)),
        hl2: y.t(null, {
            context: "in_legend"
        }, i(5801)),
        hlc3: y.t(null, {
            context: "in_legend"
        }, i(98865)),
        ohlc4: y.t(null, {
            context: "in_legend"
        }, i(42659))
    };
    class U extends N.SeriesValuesProvider {
        constructor(e, t) {
            super(e, t);
            const i = t.properties().childs().paneProperties.childs().legendProperties.childs();
            this._showBarChange = i.showBarChange, this._showSeriesOHLC = i.showSeriesOHLC, this._showVolume = i.showVolume, this._seriesStyle = e.properties().childs().style;
            const s = this._emptyValues[0],
                r = this._emptyValues[1],
                n = this._emptyValues[2];
            s.title = H.open, r.title = H.high, n.title = H.low, s.unimportant = !0, r.unimportant = !0, n.unimportant = !0, this._emptyValues[3].title = H.close, this._emptyValues[6].title = "", this._emptyValues[4].title = ""
        }
        getValues(e) {
            const t = super.getValues(e),
                i = this._showSeriesOHLC.value(),
                s = this._showBarChange.value(),
                r = t[6];
            if (this._showLastPriceAndChangeOnly()) {
                const e = t[5];
                return e.visible = e.visible && i, r.visible = r.visible && s, t
            }
            const n = this._series.style(),
                o = 12 !== n && 16 !== n,
                a = 12 !== n,
                l = 12 !== n;
            r.visible = r.visible && s && l;
            const c = t[7];
            c.visible = c.visible && this._showVolume.value();
            const h = (0, m.isPriceSourceStyle)(this._seriesStyle.value()),
                d = i && !h,
                u = i && h;
            if (t[0].visible = d && o, t[1].visible = d, t[2].visible = d, t[3].visible = d && a, t[4].visible = u, 16 === n) {
                const e = this._series.properties().childs().hlcAreaStyle.childs();
                t[1].color = e.highLineColor.value(), t[2].color = e.lowLineColor.value(),
                    t[3].color = e.closeLineColor.value()
            }
            return t
        }
    }
    var j = i(49152);
    const G = y.t(null, void 0, i(13468));
    class q extends z {
        constructor(e, t) {
            super(e, t), this._backgroundColorSpawn = t.backgroundTopColor().spawn(), this._backgroundColorSpawn.subscribe(this.update.bind(this));
            const i = t.properties().childs().paneProperties.childs().legendProperties.childs();
            this._visibilityProperty = (0, j.combineProperty)(((e, t, i) => e || t || i), i.showBarChange, i.showSeriesOHLC, i.showVolume), this._visibilityProperty.subscribe(this, this.update)
        }
        areValuesVisible() {
            return this._visibilityProperty.value()
        }
        additional() {
            return null
        }
        marketTitle() {
            const e = this._series.marketStatusModel().status().value();
            return this._showLastPriceAndChangeOnly() && ("pre_market" === e || "post_market" === e) ? `${G}:` : ""
        }
        destroy() {
            this._backgroundColorSpawn.destroy(), this._visibilityProperty.destroy()
        }
        _createValuesProvider(e, t) {
            return new U(e, t)
        }
    }
    var $ = i(58275),
        Y = i.n($),
        K = i(32923),
        Z = i(41249);

    function X() {
        const e = window.ChartApiInstance.serverTimeOffset();
        return Date.now() / 1e3 + e
    }

    function J(e, t, i) {
        return e <= i ? t <= i ? 1 / 0 : t / 1e3 : Math.min(e, t) / 1e3
    }
    class Q {
        constructor(e, t) {
            this._marketStatus = new(Y())(null), this._lastMarketStatus = null, this._sessionsSpec = null, this._nextSessionEdgeInternal = null, this._nextSessionEdge = new(Y())(null), this._recalcNextSessionEdgeTimerId = null, this._futuresContractExpirationTime = null, this._quotesProvider = e, e.quotesUpdate().subscribe(this, this._update.bind(this)), this._resetSubscription = t, this._resetSubscription.subscribe(this, this._resetStatus)
        }
        destroy() {
            this._quotesProvider.quotesUpdate().unsubscribeAll(this), this._quotesProvider.quoteSymbolChanged().unsubscribeAll(this), this._resetSubscription.unsubscribeAll(this), null !== this._recalcNextSessionEdgeTimerId && clearTimeout(this._recalcNextSessionEdgeTimerId)
        }
        futuresContractExpirationTime() {
            return this._futuresContractExpirationTime
        }
        setSymbolInfo(e) {
            var t, i, s, r, n;
            if (this._nextSessionEdgeInternal = null, null === e) return void(this._sessionsSpec = null);
            const o = new K.SessionSpec(e.timezone, null !== (t = e.session_display) && void 0 !== t ? t : e.session, e.session_holidays, e.corrections);
            let a, l;
            const c = null === (i = e.subsessions) || void 0 === i ? void 0 : i.find((e => "premarket" === e.id)),
                h = null === (s = e.subsessions) || void 0 === s ? void 0 : s.find((e => "postmarket" === e.id));
            void 0 !== c && (a = new K.SessionSpec(e.timezone, null !== (r = c["session-display"]) && void 0 !== r ? r : c.session, e.session_holidays, c["session-correction"])), void 0 !== h && (l = new K.SessionSpec(e.timezone, null !== (n = h["session-display"]) && void 0 !== n ? n : h.session, e.session_holidays, h["session-correction"])), this._sessionsSpec = {
                general: o,
                preMarket: a,
                postMarket: l
            }, this._recalculateNextSessionEdge()
        }
        status() {
            return this._marketStatus
        }
        nextSessionEdge() {
            return this._nextSessionEdge
        }
        _resetStatus() {
            this._marketStatus.setValue(null)
        }
        _update(e) {
            void 0 !== e && void 0 !== e.values.current_session && (this._lastMarketStatus = e.values.current_session), null !== this._lastMarketStatus ? this._marketStatus.setValue(this._lastMarketStatus) : this._resetStatus()
        }
        _getNextSessionEdgeInternal() {
            var e;
            if (null === this._sessionsSpec || "24x7" === this._sessionsSpec.general.spec()) return null;
            const t = 1e3 * X();
            if (null === this._nextSessionEdgeInternal || (null !== (e = this._nextSessionEdgeInternal.timestamp) && void 0 !== e ? e : 1 / 0) <= t / 1e3) {
                const {
                    general: e,
                    preMarket: i,
                    postMarket: s
                } = this._sessionsSpec, r = (0, Z.get_timezone)(e.timezone()), n = (0, Z.utc_to_cal)(r, t), o = J((0, Z.cal_to_utc)(r, e.alignToNearestSessionStart(n, 1)), (0, Z.cal_to_utc)(r, e.alignToNearestSessionEnd(n, 1)), t), a = J(void 0 !== i ? (0, Z.cal_to_utc)(r, i.alignToNearestSessionStart(n, 1)) : 1 / 0, void 0 !== i ? (0, Z.cal_to_utc)(r, i.alignToNearestSessionEnd(n, 1)) : 1 / 0, t), l = J(void 0 !== s ? (0, Z.cal_to_utc)(r, s.alignToNearestSessionStart(n, 1)) : 1 / 0, void 0 !== s ? (0, Z.cal_to_utc)(r, s.alignToNearestSessionEnd(n, 1)) : 1 / 0, t);
                let c = Math.min(o, a, l);
                if (c === 1 / 0) {
                    const t = X(),
                        i = 6e4,
                        s = new Date(Math.round(new Date(1e3 * t).getTime() / i) * i).getTime() + i,
                        n = (0, Z.utc_to_cal)(r, s),
                        o = J((0, Z.cal_to_utc)(r, e.alignToNearestSessionStart(n, 1)), (0, Z.cal_to_utc)(r, e.alignToNearestSessionEnd(n, 1)), s),
                        h = Math.min(o, a, l);
                    h !== 1 / 0 ? (this._nextSessionEdgeInternal = {
                        timestamp: c
                    }, c = h) : this._nextSessionEdgeInternal = {
                        timestamp: null
                    }
                }
                this._nextSessionEdgeInternal = c === l ? {
                    timestamp: c,
                    status: "post_market"
                } : c === a ? {
                    timestamp: c,
                    status: "pre_market"
                } : {
                    timestamp: c
                }
            }
            return this._nextSessionEdgeInternal
        }
        _recalculateNextSessionEdge() {
            const e = this._getNextSessionEdgeInternal();
            if (null === e || null === e.timestamp) return void this._nextSessionEdge.setValue(null);
            const t = {
                status: e.status,
                remainingSeconds: Math.max(0, e.timestamp - X())
            };
            if (null === this._recalcNextSessionEdgeTimerId) {
                const e = Number.isFinite(t.remainingSeconds) ? Math.ceil(t.remainingSeconds % 60) : 1;
                this._recalcNextSessionEdgeTimerId = setTimeout((() => this._recalculateNextSessionEdgeByTimer()), 1e3 * e)
            }
            this._nextSessionEdge.setValue(t)
        }
        _recalculateNextSessionEdgeByTimer() {
            this._recalcNextSessionEdgeTimerId = null, this._recalculateNextSessionEdge()
        }
    }
    var ee = i(42226),
        te = i(36274),
        ie = i(60156),
        se = i(94421),
        re = i(36174);
    let ne = 0;
    class oe {
        constructor(e, t) {
            this._extrapolatedData = [], this._cacheForFuture = !1, this._modelId = ne++, this._builderCache = null, this._uniqueId = (0, re.randomHashN)(6), this._resolution = t, this._symbolInfo = e, this._valid = Boolean(e.timezone) && Boolean(e.session), this._session = new ie.SessionInfo(e.timezone, e.session, e.session_holidays, e.corrections)
        }
        syncSourceTarget() {
            return {
                uniqueId: this._uniqueId,
                resolution: this._resolution,
                symbolInfo: this._symbolInfo,
                session: this._session.state()
            }
        }
        getSymbolInfo() {
            return this._symbolInfo
        }
        getSession() {
            return this._session
        }
        getResolution() {
            return this._resolution
        }
        uniqueId() {
            return this._modelId
        }
        distance(e, t) {
            if (!this.isValid()) return {
                success: !1
            };
            if (e > t) return {
                success: !1
            };
            if (e === t) return {
                success: !0,
                result: 0
            };
            let i = this._extrapolatedData.length,
                s = 0 !== i ? this._extrapolatedData[0] : null,
                r = null !== s ? this._extrapolatedData[i - 1] : null;
            const n = e < t;
            if (1e3 * e === s && this._cacheForFuture === n || (this._extrapolatedData = [1e3 * e], i = 1, s = null, r = null), null === s || null !== r && 1e3 * t > r) {
                const s = (0, se.extrapolateBarsFrontToTime)(this._barBuilder(), r || 1e3 * e, 1e3 * t, 2e3, !0);
                this._extrapolatedData = this._extrapolatedData.concat(s.times), i = this._extrapolatedData.length, this._cacheForFuture = n
            }
            if (r = this._extrapolatedData[i - 1], r < 1e3 * t) return {
                success: !1
            };
            const o = this._extrapolatedData.indexOf(1e3 * t);
            return -1 === o ? {
                success: !1
            } : {
                success: !0,
                result: o
            }
        }
        projectTime(e, t) {
            if (!this.isValid()) return e;
            let i = this._extrapolatedData.length,
                s = i > 0 ? this._extrapolatedData[0] : null,
                r = null !== s ? this._extrapolatedData[i - 1] : null;
            const n = t >= 0;
            1e3 * e === s && this._cacheForFuture === n || (this._extrapolatedData = [1e3 * e], i = 1, s = null, r = null);
            const o = Math.abs(t);
            if (null === s || o >= i) {
                const s = (0, se.extrapolateBarsFrontByCount)(this._barBuilder(), r || 1e3 * e, Math.sign(t) * (o - i + 1), !0);
                this._extrapolatedData = this._extrapolatedData.concat(s.times), i = this._extrapolatedData.length, this._cacheForFuture = n
            }
            return i < o ? e : this._extrapolatedData[o] / 1e3
        }
        isValid() {
            return this._valid
        }
        dataSize() {
            return this._extrapolatedData.length
        }
        createNewModelWithResolution(e) {
            return new oe(this._symbolInfo, e)
        }
        _barBuilder() {
            return null === this._builderCache && (this._builderCache = (0, ie.newBarBuilder)(this._resolution, this._session, this._session)), this._builderCache
        }
    }
    var ae = i(83669),
        le = i(28986),
        ce = i(77248);
    i(79982);
    var he = i(93544);
    const de = (0, a.getLogger)("Chart.Definitions.Series");

    function ue(e, t) {
        return "TickByTick" === e ? {
            mode: e,
            updatePeriod: t
        } : {
            mode: e
        }
    }

    function pe(e, t, i) {
        const s = [];
        return (0, ce.isDelay)(e.delay) ? function(e) {
            const t = [];
            return (0, ce.witoutRealtime)(e) ? t.push(ue("DelayNoRealtime")) : t.push(ue("DelayToRealtime")), t
        }(e) : (0, ce.isEod)(e, t) ? (s.push(ue("EOD")), s) : s
    }
    class _e {
        constructor(e, t, i, s) {
            this._dataUpdatedInfoStatus = new ae.WatchedObject(null), this._symbolInfo = (0, le.createWVFromGetterAndSubscription)(e.getter, e.onChange), this._status = (0, le.createWVFromGetterAndSubscription)(t.getter, t.onChange), this._updatePeriod = (0, le.createWVFromGetterAndSubscription)(i.getter, i.onChange), this._symbolInfo.subscribe(this._update.bind(this)), this._status.subscribe(this._update.bind(this)), this._updatePeriod.subscribe(this._update.bind(this)), this._resetSubscription = s, this._resetSubscription.subscribe(this, this._resetStatus)
        }
        destroy() {
            this._symbolInfo.destroy(), this._status.destroy(), this._updatePeriod.destroy(), this._resetSubscription.unsubscribeAll(this)
        }
        status() {
            return this._dataUpdatedInfoStatus.readonly()
        }
        symbolName() {
            const e = this._symbolInfo.value();
            return null !== e ? e.name : ""
        }
        time() {
            const e = this._symbolInfo.value(),
                t = null !== e && e.delay && e.delay > 0 ? e.delay : 900;
            return Math.round(t / 60)
        }
        listedExchange() {
            const e = this._symbolInfo.value();
            return null !== e ? e.listed_exchange : ""
        }
        async description() {
            const e = this._symbolInfo.value();
            if (null === e) return "";
            let t = {};
            try {
                t = (0, s.ensureNotNull)(await (0, ce.getExchange)(e))
            } catch (e) {
                de.logWarn(`Cannot get exchange ${(0,he.errorToString)(e)}`)
            }
            return t.description || e.listed_exchange
        }
        exchange() {
            const e = this._symbolInfo.value();
            return null !== e ? e.exchange : ""
        }
        proName() {
            const e = this._symbolInfo.value();
            return null !== e ? e.pro_name : ""
        }
        proPerm() {
            const e = this._symbolInfo.value();
            return null !== e ? e.pro_perm : ""
        }
        firstReplacedByBatsExchange() {
            const e = this._symbolInfo.value();
            return e && (0, ce.firstReplacedByBatsExchange)(e)
        }
        _resetStatus() {
            this._dataUpdatedInfoStatus.setValue(null)
        }
        _update() {
            const e = this._symbolInfo.value();
            if (null === e) return void this._dataUpdatedInfoStatus.setValue(null);
            const t = this._status.value();
            if ("string" == typeof t) return void this._dataUpdatedInfoStatus.setValue(null);
            if (2 === t || 1 === t) return;
            const i = pe(e, t, this._updatePeriod.value());
            0 !== i.length ? this._dataUpdatedInfoStatus.setValue(i) : this._dataUpdatedInfoStatus.setValue(null)
        }
    }
    i(69798);
    var me = i(1722);
    (0, a.getLogger)("Chart.DataProblemModel");
    class ge {
        constructor(e, t) {
            this._mainDataProblem = new ae.WatchedObject(null), this._supportPortalProblems = new ae.WatchedObject([]), this._allDataProblems = new ae.WatchedObject([]), this._pushStreamHandler = null, this._destroyed = !1, this._quotesProvider = e, this._quotesProvider.quotesUpdate().subscribe(this, this._update.bind(this)), this._resetSubscription = t, this._resetSubscription.subscribe(this, this._resetStatus), this._mainDataProblem.subscribe((() => this._updateAllDataProblems())), this._supportPortalProblems.subscribe((() => this._updateAllDataProblems())), this._requestSupportPortalProblems()
        }
        destroy() {
            this._quotesProvider.quotesUpdate().unsubscribeAll(this), this._resetSubscription.unsubscribeAll(this), this._destroyed = !0
        }
        dataProblems() {
            return this._allDataProblems
        }
        _resetStatus() {
            this._mainDataProblem.setValue(null)
        }
        _update(e) {
            void 0 === e.values || void 0 === e.values.data_problem ? this._resetStatus() : this._mainDataProblem.setValue((0, me.clone)(e.values.data_problem))
        }
        _updateAllDataProblems() {
            const e = this._mainDataProblem.value(),
                t = this._supportPortalProblems.value();
            this._allDataProblems.setValue(null === e ? t : [e, ...t])
        }
        async _requestSupportPortalProblems() {
            0
        }
    }
    var fe = i(71625),
        ve = i(87095),
        Se = i(42275),
        ye = i(74304);

    function be(e) {
        return e < 10 ? `0${e}` : e.toString()
    }
    var we = i(78211),
        Pe = i(28558);
    const Ce = b.enabled("force_exchange_as_title"),
        xe = b.enabled("chart_style_hilo_last_price"),
        Te = [0, 1, 2, 14, 15, 3, 16, 9, 8, 10];
    xe && Te.push(12);
    const Ie = {
        alwaysShowGlobalLast: !1,
        visibleOnHistoryOnly: !1,
        showCountdown: !0,
        showSymbolLabel: !0,
        useSolidBodyColor: !0
    };
    class Me extends Se.PriceAxisView {
        constructor(e, t, i) {
            super(), this._previousCountdown = "", this._source = e, this._model = t, this._options = {
                ...Ie,
                ...i
            }
        }
        updateCountdown() {
            this._countdownText() !== this._previousCountdown && (this.update((0, Pe.sourceChangeEvent)(this._source.id())), this._model.updateSourcePriceScale(this._source))
        }
        _getSource() {
            return this._source
        }
        _getModel() {
            return this._model
        }
        _isCountdownEnabled() {
            return this._options.showCountdown
        }
        _countdownText() {
            const e = te.Interval.parse(this._source.interval());
            if (e.isDWM() || e.isTicks() || e.isSeconds() && 1 === e.multiplier()) return "";
            const t = this._source.data().bars().last();
            if (null === t) return "";
            const i = 1e3 * (0, s.ensure)(t.value[0]),
                r = te.Interval.parse(this._source.interval()).inMilliseconds(),
                n = i.valueOf() + r;
            let o = Math.round((n - this._currentTime()) / 1e3);
            if (o <= 0) return "";
            o = Math.min(o, r / 1e3);
            let a = null;
            o >= 3600 && (a = be(Math.floor(o / 3600))), o %= 3600;
            const l = be(Math.floor(o / 60));
            o %= 60;
            const c = be(Math.floor(o));
            return null !== a ? `${a}:${l}:${c}` : `${l}:${c}`
        }
        _updateRendererData(e, t, i) {
            var r;
            if (e.visible = !1, t.visible = !1, !this._source.isVisible()) return;
            const n = this._source.properties().childs();
            if (!xe && 12 === n.style.value()) return;
            const o = this._model.timeScale().visibleBarsStrictRange(),
                a = this._source.data().last();
            if (null === o || null === a) return;
            if (this._options.visibleOnHistoryOnly && o.contains(a.index)) return;
            const l = this._model.properties().childs().scalesProperties.childs();
            let c = l.showSeriesLastValue.value(),
                h = this._isCountdownEnabled() && n.showCountdown.value() && Te.includes(n.style.value()) && (this._options.alwaysShowGlobalLast || o.contains(a.index)),
                d = this._options.showSymbolLabel && l.showSymbolLabels.value();
            const u = l.seriesLastValueMode.value() === ye.PriceAxisLastValueMode.LastPriceAndPercentageValue,
                p = this._source.lastValueData(void 0, this._options.alwaysShowGlobalLast);
            if (p.noData) return;
            const _ = 8 === n.style.value();
            if ((c || h || d) && _ && n.haStyle.childs().showRealLastPrice.value()) {
                const e = this._source.lastValueData(void 0, !1),
                    t = this._source.lastValueData(void 0, !0);
                e.noData || t.noData || e.index !== t.index || (c = !1, h = !1, d = !1)
            }
            const m = (0, ve.resetTransparency)(this._source.priceLineColor(p.color));
            if (this._options.useSolidBodyColor ? (i.background = m, i.borderColor = void 0) : (i.background = this._model.backgroundColorAtYPercentFromTop((null !== (r = i.fixedCoordinate) && void 0 !== r ? r : i.coordinate) / (0, s.ensureNotNull)(this._model.paneForSource(this._source)).height()), i.borderColor = m), i.coordinate = p.coordinate, i.floatCoordinate = p.floatCoordinate, c || h) {
                const t = this._axisFirstLineText(p, c);
                e.text = t, this._options.useSolidBodyColor ? (i.textColor = this.generateTextColor(i.background), e.borderVisible = !1) : (e.borderVisible = !0, i.textColor = m), e.textColor = i.textColor;
                const s = c && u ? (0, we.getOppositeModePriceText)(this._source.priceScale(), p) : "";
                e.secondLine = s, i.secondLineTextColor = i.textColor;
                const r = h ? this._countdownText() : "";
                this._previousCountdown = r, e.thirdLine = r, i.thirdLineTextColor = (0, ve.generateColor)(i.textColor, 25), 0 === t.length && 0 === s.length && 0 === r.length || (e.visible = !0)
            }
            d && (t.text = this._paneText(d), t.visible = t.text.length > 0)
        }
        _paneText(e) {
            let t = "";
            const i = this._source.symbolInfo();
            return Ce ? t = (0, m.displayedSymbolExchange)(i) : e && (t = (0, m.displayedSymbolName)(i)), t
        }
        _axisFirstLineText(e, t) {
            return t ? (0, we.getCurrentModePriceText)(this._source.priceScale(), e) : ""
        }
        _currentTime() {
            return Date.now() + 1e3 * this._source.serverTimeOffset()
        }
    }
    var Ae = i(11527);
    class Le extends Me {
        lastPrice() {
            return this._getSource().data().lastProjectionPrice
        }
        _updateRendererData(e, t, i) {
            e.visible = !1, t.visible = !1;
            const r = this._getModel(),
                n = this._getSource(),
                o = n.priceScale(),
                a = r.timeScale(),
                l = this.lastPrice();
            if (a.isEmpty() || o.isEmpty() || void 0 === l) return;
            const c = a.visibleBarsStrictRange();
            if (null === c) return;
            const h = c.firstBar(),
                u = c.lastBar(),
                p = n.data(),
                _ = p.search(u, d.PlotRowSearchMode.NearestLeft);
            if (null === _) return;
            const m = n.nearestIndex(h, d.PlotRowSearchMode.NearestRight);
            if (void 0 === m) return;
            const g = n.model().properties().childs().scalesProperties.childs(),
                f = (0,
                    s.ensureNotNull)(p.valueAt(m))[4];
            let v = i.background,
                S = g.showSeriesLastValue.value(),
                y = !1,
                b = !1,
                w = !1;
            const P = n.lastValueData(4, !1),
                C = n.properties().childs();
            if (8 === C.style.value() && C.haStyle.childs().showRealLastPrice.value()) {
                const e = n.lastValueData(4, !0);
                if (e.noData || e.color === i.background || (v = (0, ve.resetTransparency)(e.color)), !e.noData && !P.noData) {
                    const t = e.index === P.index;
                    y = t && g.showSymbolLabels.value(), b = g.seriesLastValueMode.value() === ye.PriceAxisLastValueMode.LastPriceAndPercentageValue, S = S && t, w = t && this._isCountdownEnabled() && C.showCountdown.value()
                }
            } else {
                const e = n.barColorer().barStyle(_.index, !0);
                v = (0, ve.resetTransparency)(e.barColor)
            }
            if (i.background = v, i.textColor = this.generateTextColor(v), i.secondLineTextColor = i.textColor, i.thirdLineTextColor = (0, ve.generateColor)(i.textColor, 25), i.coordinate = o.priceToCoordinate(l, f), e.visible = S || w, !P.noData) {
                const i = n.priceScale().isPercentage();
                P.formattedPriceAbsolute = o.formatPriceAbsolute(l), P.formattedPricePercentage = o.formatPricePercentage(l, f, !0), P.text = i ? P.formattedPricePercentage : P.formattedPriceAbsolute, e.text = this._axisFirstLineText(P, S), e.secondLine = S && b ? i ? P.formattedPriceAbsolute : P.formattedPricePercentage : "", e.thirdLine = w ? this._countdownText() : "", t.text = this._paneText(y)
            }
            t.visible = y
        }
    }
    var ke = i(43493),
        Ee = i(38003),
        De = i(48891),
        Ve = i(79849);
    const Be = {
        light: {
            lineStyle: Ve.LINESTYLE_DOTTED,
            lineWidth: 1,
            textColor: De.colorsPalette["color-cold-gray-900"],
            backgroundColor: De.colorsPalette["color-tv-blue-50"],
            lineColor: De.colorsPalette["color-cold-gray-500"]
        },
        dark: {
            lineStyle: Ve.LINESTYLE_DOTTED,
            lineWidth: 1,
            textColor: De.colorsPalette["color-white"],
            backgroundColor: De.colorsPalette["color-tv-blue-a800"],
            lineColor: De.colorsPalette["color-cold-gray-500"]
        }
    };

    function Re(e) {
        return e ? Be.dark : Be.light
    }
    class Ne extends Ee.HorizontalLinePaneView {
        constructor(e, t, i) {
            super(), this._model = e, this._isVisible = t.lineVisible, this._lineColor = t.lineColor, this._lineWidth = t.lineWidth, this._getValue = i
        }
        _updateImpl() {
            const e = this._lineRendererData;
            if (e.visible = !1, !this._isVisible.value()) return;
            const t = this._model.mainSeries(),
                i = t.priceScale(),
                s = t.firstValue(),
                r = this._getValue();
            if (null === s || null === r) return;
            const n = Re(this._model.dark().value()),
                o = this._lineColor.value() ? this._lineColor.value() : n.lineColor,
                a = this._lineWidth.value() ? this._lineWidth.value() : n.lineWidth;
            e.visible = !0, e.y = i.priceToCoordinate(r, s), e.linestyle = n.lineStyle, e.linewidth = a, e.color = o
        }
    }
    class Oe extends Se.PriceAxisView {
        constructor(e, t, i, s) {
            super(), this._model = e, this._label = t, this._isVisible = i, this._getValue = s
        }
        _updateRendererData(e, t, i) {
            if (e.visible = !1, t.visible = !1, !this._isVisible.value()) return;
            const s = this._model.mainSeries(),
                r = s.priceScale(),
                n = s.firstValue(),
                o = this._getValue();
            if (null === n || null === o) return;
            const a = Re(this._model.dark().value());
            e.visible = !0, t.visible = !0, e.text = r.formatPriceAbsolute(o), t.text = this._label, i.coordinate = r.priceToCoordinate(o, n), i.background = a.backgroundColor, i.textColor = a.textColor
        }
    }
    class Fe extends Ae.PriceLineAxisView {
        constructor(e, t, i) {
            super(), this._model = e, this._isLineVisible = t, this._getValue = i
        }
        _isVisible() {
            return this._isLineVisible.value()
        }
        _lineWidth() {
            return Re(this._model.dark().value()).lineWidth
        }
        _lineStyle() {
            return Re(this._model.dark().value()).lineStyle
        }
        _priceLineColor(e) {
            return Re(this._model.dark().value()).lineColor
        }
        _value() {
            const e = this._model.mainSeries(),
                t = e.priceScale(),
                i = e.firstValue(),
                s = this._getValue();
            if (null === i || null === s) return {
                noData: !0
            };
            const r = t.priceToCoordinate(s, i);
            return {
                noData: !1,
                floatCoordinate: r,
                coordinate: r,
                color: "",
                formattedPricePercentage: "",
                formattedPriceAbsolute: "",
                formattedPriceIndexedTo100: "",
                text: "",
                index: 0
            }
        }
    }
    const We = y.t(null, void 0, i(30777)),
        ze = y.t(null, void 0, i(8136));

    function He(e, t, i, s) {
        const r = new Ne(e, i, s),
            n = new Oe(e, i.label, i.labelVisible, s);
        return {
            paneView: r,
            panePriceAxisView: new ke.PanePriceAxisView(n, t, e),
            priceAxisView: n,
            priceLineAxisView: new Fe(e, i.lineVisible, s)
        }
    }
    const Ue = {
        light: {
            lineStyle: Ve.LINESTYLE_DOTTED,
            lineWidth: 1,
            textColor: (0, De.getHexColorByName)("color-cold-gray-900"),
            backgroundColor: (0, De.getHexColorByName)("color-tv-blue-50"),
            lineColor: (0, De.getHexColorByName)("color-cold-gray-500")
        },
        dark: {
            lineStyle: Ve.LINESTYLE_DOTTED,
            lineWidth: 1,
            textColor: (0, De.getHexColorByName)("color-white"),
            backgroundColor: (0, De.getHexColorByName)("color-tv-blue-a800"),
            lineColor: (0, De.getHexColorByName)("color-cold-gray-500")
        }
    };

    function je(e) {
        return e ? Ue.dark : Ue.light
    }
    class Ge extends Ee.HorizontalLinePaneView {
        constructor(e, t, i) {
            super(), this._model = e, this._isVisible = t.lineVisible, this._lineColor = t.lineColor, this._lineWidth = t.lineWidth, this._getValue = i
        }
        _updateImpl() {
            const e = this._lineRendererData;
            if (e.visible = !1, !this._isVisible.value()) return;
            const t = this._model.mainSeries(),
                i = t.priceScale(),
                s = t.firstValue(),
                r = this._getValue();
            if (null === s || null === r) return;
            const n = je(this._model.dark().value()),
                o = this._lineColor.value() ? this._lineColor.value() : n.lineColor,
                a = this._lineWidth.value() ? this._lineWidth.value() : n.lineWidth;
            e.visible = !0, e.y = i.priceToCoordinate(r, s), e.linestyle = n.lineStyle, e.linewidth = a, e.color = o
        }
    }
    class qe extends Se.PriceAxisView {
        constructor(e, t, i, s) {
            super(), this._model = e, this._label = t, this._isVisible = i, this._getValue = s
        }
        _updateRendererData(e, t, i) {
            if (e.visible = !1, t.visible = !1, !this._isVisible.value()) return;
            const s = this._model.mainSeries(),
                r = s.priceScale(),
                n = s.firstValue(),
                o = this._getValue();
            if (null === n || null === o) return;
            const a = je(this._model.dark().value());
            e.visible = !0, t.visible = !0, e.text = r.formatPriceAbsolute(o), t.text = this._label, i.coordinate = r.priceToCoordinate(o, n), i.background = a.backgroundColor, i.textColor = a.textColor
        }
    }
    class $e extends Ae.PriceLineAxisView {
        constructor(e, t, i) {
            super(), this._model = e, this._isLineVisible = t, this._getValue = i
        }
        _isVisible() {
            return this._isLineVisible.value()
        }
        _lineWidth() {
            return je(this._model.dark().value()).lineWidth
        }
        _lineStyle() {
            return je(this._model.dark().value()).lineStyle
        }
        _priceLineColor(e) {
            return je(this._model.dark().value()).lineColor
        }
        _value() {
            const e = this._model.mainSeries(),
                t = e.priceScale(),
                i = e.firstValue(),
                s = this._getValue();
            if (null === i || null === s) return {
                noData: !0
            };
            const r = t.priceToCoordinate(s, i);
            return {
                noData: !1,
                floatCoordinate: r,
                coordinate: r,
                color: "",
                formattedPricePercentage: "",
                formattedPriceAbsolute: "",
                formattedPriceIndexedTo100: "",
                text: "",
                index: 0
            }
        }
    }
    const Ye = y.t(null, void 0, i(22554));

    function Ke(e, t, i, s) {
        const r = i.childs(),
            n = function(e, t, i, s) {
                const r = new Ge(e, i, s),
                    n = new qe(e, i.label, i.labelVisible, s),
                    o = new ke.PanePriceAxisView(n, t, e),
                    a = new $e(e, i.lineVisible, s);
                return {
                    paneView: r,
                    panePriceAxisView: o,
                    priceAxisView: n,
                    priceLineAxisView: a
                }
            }(e, t, {
                label: Ye,
                labelVisible: r.averageClosePriceLabelVisible,
                lineVisible: r.averageClosePriceLineVisible,
                lineColor: r.averagePriceLineColor,
                lineWidth: r.averagePriceLineWidth
            }, (() => s(0)));
        return {
            paneViews: [n.paneView],
            panePriceAxisViews: [n.panePriceAxisView],
            priceAxisViews: [n.priceAxisView],
            priceLineAxisViews: [n.priceLineAxisView]
        }
    }
    var Ze = i(57898),
        Xe = i.n(Ze),
        Je = i(97121),
        Qe = i(27856),
        et = i(86441);
    class tt {
        constructor() {
            this._data = null
        }
        setData(e) {
            this._data = e
        }
        data() {
            return this._data
        }
        draw(e, t) {
            const i = this._data;
            if (null === i) return;
            const s = t.pixelRatio;
            e.save();
            const r = Math.max(1, Math.floor(s)),
                n = r % 2 / 2,
                o = Math.round(i.center.x * s) + n,
                a = i.center.y * s;
            e.fillStyle = i.seriesLineColor, e.beginPath();
            const l = Math.max(2, 1.5 * i.seriesLineWidth) * s;
            e.arc(o, a, l, 0, 2 * Math.PI, !1), e.fill(), e.fillStyle = i.fillColor, e.beginPath(), e.arc(o, a, i.radius * s, 0, 2 * Math.PI, !1), e.fill(), e.lineWidth = r, e.strokeStyle = i.strokeColor, e.beginPath(), e.arc(o, a, i.radius * s + r / 2, 0, 2 * Math.PI, !1), e.stroke(), e.restore()
        }
        hitTest(e, t) {
            return null
        }
    }

    function it(e) {
        return e
    }
    const st = [{
        start: 0,
        end: .25,
        startRadius: 4,
        endRadius: 10,
        startFillAlpha: .25,
        endFillAlpha: 0,
        startStrokeAlpha: .4,
        endStrokeAlpha: .8,
        easing: it
    }, {
        start: .25,
        end: .525,
        startRadius: 10,
        endRadius: 14,
        startFillAlpha: 0,
        endFillAlpha: 0,
        startStrokeAlpha: .8,
        endStrokeAlpha: 0,
        easing: it
    }, {
        start: .525,
        end: 1,
        startRadius: 14,
        endRadius: 14,
        startFillAlpha: 0,
        endFillAlpha: 0,
        startStrokeAlpha: 0,
        endStrokeAlpha: 0,
        easing: it
    }];

    function rt(e, t, i, s) {
        const r = i + (s - i) * t;
        return (0, ve.applyTransparency)(e, (0, ve.alphaToTransparency)(r))
    }

    function nt(e, t) {
        const i = e % 2600 / 2600;
        let s;
        for (const e of st)
            if (i >= e.start && i <= e.end) {
                s = e;
                break
            } if (void 0 === s) throw new Error("Last price animation internal logic error");
        const r = s.easing((i - s.start) / (s.end - s.start));
        return {
            fillColor: rt(t, r, s.startFillAlpha, s.endFillAlpha),
            strokeColor: rt(t, r, s.startStrokeAlpha, s.endStrokeAlpha),
            radius: (n = r, o = s.startRadius, a = s.endRadius, o + (a - o) * n)
        };
        var n, o, a
    }
    class ot {
        constructor(e) {
            this._renderer = new tt, this._invalidated = !0, this._stageInvalidated = !0, this._startTime = performance.now(), this._endTime = this._startTime - 1, this._series = e
        }
        update(e) {
            if (this._invalidated = !0, "data-source-change" === e.type && e.sourceId === this._series.id() && e.realtime && this._series.seriesLoaded()) {
                const e = performance.now(),
                    t = this._endTime - e;
                if (t > 0) return void(t < 650 && (this._endTime += 2600));
                this._startTime = e, this._endTime = e + 2600
            }
        }
        invalidateStage() {
            this._stageInvalidated = !0
        }
        animationActive() {
            return performance.now() <= this._endTime
        }
        stopAnimation() {
            this._endTime = this._startTime - 1
        }
        renderer(e, t) {
            return this._invalidated ? (this._updateImpl(e, t), this._invalidated = !1,
                this._stageInvalidated = !1) : this._stageInvalidated && (this._updateRendererDataStage(), this._stageInvalidated = !1), this._renderer
        }
        _updateImpl(e, t) {
            this._renderer.setData(null);
            const i = this._series.model().timeScale(),
                s = i.visibleBarsStrictRange(),
                r = this._series.firstValue(),
                n = this._series.lastValueData(void 0, !0, !0);
            if (null === s || null === r || void 0 === n.index || void 0 === n.price || !s.contains(n.index)) return;
            const o = new et.Point(i.indexToCoordinate(n.index), this._series.priceScale().priceToCoordinate(n.price, r)),
                a = n.color,
                l = this._series.properties().childs();
            let c;
            switch (this._series.style()) {
                case 3:
                    c = l.areaStyle.childs().linewidth.value();
                    break;
                case 10:
                    const t = l.baselineStyle,
                        i = Math.round(e * (Math.abs(100 - t.childs().baseLevelPercentage.value()) / 100));
                    c = o.y <= i ? t.childs().topLineWidth.value() : t.childs().bottomLineWidth.value();
                    break;
                case 14:
                    c = l.lineWithMarkersStyle.childs().linewidth.value();
                    break;
                case 15:
                    c = l.steplineStyle.childs().linewidth.value();
                    break;
                default:
                    c = l.lineStyle.childs().linewidth.value()
            }
            const h = nt(this._duration(), a);
            this._renderer.setData({
                seriesLineColor: a,
                seriesLineWidth: c,
                fillColor: h.fillColor,
                strokeColor: h.strokeColor,
                radius: h.radius,
                center: o
            })
        }
        _updateRendererDataStage() {
            const e = this._renderer.data();
            if (null !== e) {
                const t = nt(this._duration(), e.seriesLineColor);
                e.fillColor = t.fillColor, e.strokeColor = t.strokeColor, e.radius = t.radius
            }
        }
        _duration() {
            return this.animationActive() ? performance.now() - this._startTime : 2599
        }
    }
    var at = i(91280),
        lt = i(1115),
        ct = i(1803);
    class ht {
        constructor() {
            this._created = new(Xe()), this._modified = new(Xe()), this._loading = new(Xe()), this._completed = new(Xe()), this._error = new(Xe()), this._symbolError = new(Xe()), this._symbolResolved = new(Xe()), this._seriesError = new(Xe()), this._symbolNotPermitted = new(Xe()), this._symbolInvalid = new(Xe()), this._symbolGroupNotPermitted = new(Xe()), this._chartTypeNotPermitted = new(Xe()), this._intradaySpreadNotPermitted = new(Xe()), this._intradayExchangeNotPermitted = new(Xe()), this._customIntervalNotPermitted = new(Xe()), this._secondsIntervalNotPermitted = new(Xe()), this._tickMarksRangeChanged = new(Xe()), this._barReceived = new(Xe()), this._seriesTimeFrame = new(Xe()), this._dataUpdated = new(Xe())
        }
        destroy() {
            this._created.destroy(), this._modified.destroy(), this._loading.destroy(), this._completed.destroy(), this._error.destroy(), this._symbolError.destroy(), this._symbolResolved.destroy(), this._seriesError.destroy(), this._symbolInvalid.destroy(), this._symbolNotPermitted.destroy(), this._symbolGroupNotPermitted.destroy(), this._chartTypeNotPermitted.destroy(), this._intradaySpreadNotPermitted.destroy(), this._intradayExchangeNotPermitted.destroy(), this._customIntervalNotPermitted.destroy(), this._secondsIntervalNotPermitted.destroy(), this._tickMarksRangeChanged.destroy(), this._barReceived.destroy(), this._seriesTimeFrame.destroy(), this._dataUpdated.destroy()
        }
        created() {
            return this._created
        }
        modified() {
            return this._modified
        }
        loading() {
            return this._loading
        }
        completed() {
            return this._completed
        }
        error() {
            return this._error
        }
        symbolError() {
            return this._symbolError
        }
        symbolResolved() {
            return this._symbolResolved
        }
        seriesError() {
            return this._seriesError
        }
        symbolInvalid() {
            return this._symbolInvalid
        }
        symbolNotPermitted() {
            return this._symbolNotPermitted
        }
        symbolGroupNotPermitted() {
            return this._symbolGroupNotPermitted
        }
        chartTypeNotPermitted() {
            return this._chartTypeNotPermitted
        }
        intradaySpreadNotPermitted() {
            return this._intradaySpreadNotPermitted
        }
        intradayExchangeNotPermitted() {
            return this._intradayExchangeNotPermitted
        }
        customIntervalNotPermitted() {
            return this._customIntervalNotPermitted
        }
        secondsIntervalNotPermitted() {
            return this._secondsIntervalNotPermitted
        }
        tickMarksRangeChanged() {
            return this._tickMarksRangeChanged
        }
        barReceived() {
            return this._barReceived
        }
        seriesTimeFrame() {
            return this._seriesTimeFrame
        }
        dataUpdated() {
            return this._dataUpdated
        }
        fireCompleted(e) {
            this._completed.fire(e)
        }
        fireCreated(e) {
            this._created.fire(e)
        }
        fireModified() {
            this._modified.fire()
        }
        fireLoading(e) {
            this._loading.fire(e)
        }
        fireError() {
            this._error.fire()
        }
        fireSymbolError(e) {
            this._symbolError.fire(e), this.fireError()
        }
        fireSymbolResolved(e) {
            this._symbolResolved.fire(e)
        }
        fireSeriesError(e) {
            this._seriesError.fire(e), this.fireError()
        }
        fireSymbolInvalid() {
            this._symbolInvalid.fire()
        }
        fireSymbolNotPermitted(e) {
            this._symbolNotPermitted.fire(e)
        }
        fireSymbolGroupNotPermitted(e) {
            this._symbolGroupNotPermitted.fire(e)
        }
        fireChartTypeNotPermitted(e) {
            this._chartTypeNotPermitted.fire(e), this.fireError()
        }
        fireIntradaySpreadNotPermitted() {
            this._intradaySpreadNotPermitted.fire(), this.fireError()
        }
        fireIntradayExchangeNotPermitted() {
            this._intradayExchangeNotPermitted.fire(), this.fireError()
        }
        fireCustomIntervalNotPermitted(e) {
            this._customIntervalNotPermitted.fire(e), this.fireError()
        }
        fireSecondsIntervalNotPermitted() {
            this._secondsIntervalNotPermitted.fire(), this.fireError()
        }
        fireTickMarksRangeChanged(e) {
            this._tickMarksRangeChanged.fire(e)
        }
        fireBarReceived(e) {
            this._barReceived.fire(e)
        }
        fireSeriesTimeFrame(e, t, i, s, r) {
            this._seriesTimeFrame.fire(e, t, i, s, r)
        }
        fireDataUpdated(e, t, i) {
            this._dataUpdated.fire(e, t, i)
        }
    }
    const dt = (0, a.getLogger)("Chart.SeriesDataSource");
    var ut;
    ! function(e) {
        e[e.Idle = 0] = "Idle", e[e.AwaitingConnection = 1] = "AwaitingConnection", e[e.AwaitingFirstDataUpdate = 2] = "AwaitingFirstDataUpdate", e[e.Active = 3] = "Active"
    }(ut || (ut = {}));
    let pt = 1;
    let _t = 1;

    function mt(e) {
        return e.startDate ? e.endDate || e.count ? e.endDate ? ["from_to", e.startDate, e.endDate] : ["bar_count", e.startDate, (0, s.ensure)(e.count)] : ["from_to", e.startDate] : e.count || 300
    }
    class gt {
        constructor(e, t, i, s) {
            this._symbol = null, this._resolvedSymbolName = null, this._createSeriesOverriddenParams = 0, this._instanceId = null, this._symbolInstanceId = null, this._resolution = null, this._timeFrame = null, this._data = new c.SeriesData, this._dataEvents = new ht, this._status = ut.Idle, this._turnaroundCounter = 1, this._boundOnGatewayIsConnectedChanged = this._onGatewayIsConnectedChanged.bind(this), this._ongoingDataUpdate = Promise.resolve(), this._gateway = e, this._turnaroundPrefix = t, this._createSeriesParams = mt(null != i ? i : {
                count: 300
            }), this._timeFrame = s || null, this._gateway.isConnected().subscribe(this._boundOnGatewayIsConnectedChanged)
        }
        destroy() {
            this.stop(),
                this._gateway.isConnected().unsubscribe(this._boundOnGatewayIsConnectedChanged)
        }
        modifySeries(e, t, i = null, r = !1) {
            r && (dt.logNormal("Due to force flag clearing symbol & resolution to force re-requesting data."), this._symbol = null, this._resolution = null);
            const n = this._symbol,
                o = this._resolution;
            if (this._symbol = e, this._resolution = t, null === this._instanceId) return void(this._timeFrame = i);
            const a = !(0, me.deepEquals)(n, e)[0] || null !== this._resolvedSymbolName && this._resolvedSymbolName !== this._getSymbolNameString(e),
                l = null === o || !te.Interval.isEqual(o, t);
            (a || l || null !== i) && (this._timeFrame = null, (a || l) && this._turnaroundCounter++, a && this._resolveSymbol(), this._gateway.modifySeries(this._instanceId, this.turnaround(), (0, s.ensureNotNull)(this._symbolInstanceId), this._resolution, i, this._onMessage.bind(this)), this._dataEvents.fireModified())
        }
        requestMoreData(e) {
            null !== this._instanceId && this._gateway.requestMoreData(this._instanceId, e, this._onMessage.bind(this))
        }
        requestMoreTickmarks(e) {
            null !== this._instanceId && this._gateway.requestMoreTickmarks(this._instanceId, e, this._onMessage.bind(this))
        }
        isStarted() {
            return this._status !== ut.Idle
        }
        isActive() {
            return this._status === ut.Active
        }
        resolution() {
            return this._resolution
        }
        start() {
            this.isStarted() ? dt.logNormal("start: data source is already started, nothing to do") : ((0, s.assert)(null !== this._symbol, "symbol must be set before start"), (0, s.assert)(null !== this._resolution, "resolution must be set before start"), this._gateway.isConnected().value() ? this._createSeries() : this._changeStatusTo(ut.AwaitingConnection))
        }
        stop() {
            this.isStarted() ? (null !== this._instanceId && (this._gateway.removeSeries(this._instanceId), this._instanceId = null), this._changeStatusTo(ut.Idle)) : dt.logNormal("stop: data source is already stopped, nothing to do")
        }
        instanceId() {
            return this._instanceId
        }
        data() {
            return this._data
        }
        clearData() {
            this.isStarted() ? this._enqueueUpdate((() => this._clearDataImpl())) : this._clearDataImpl()
        }
        dataEvents() {
            return this._dataEvents
        }
        turnaround() {
            return `${this._turnaroundPrefix}${this._turnaroundCounter}`
        }
        symbolInstanceId() {
            return this._symbolInstanceId
        }
        symbol() {
            return this._symbol
        }
        moveData(e) {
            this._enqueueUpdate((() => this._data.moveData(e)))
        }
        setInitialRequestOptions(e) {
            this._createSeriesOverriddenParams = mt(e)
        }
        _resolveSymbol() {
            null !== this._symbol && (this._symbolInstanceId = this._gateway.resolveSymbol("sds_sym_" + pt++, (0, Qe.encodeExtendedSymbolOrGetSimpleSymbolString)(this._symbol), this._onMessage.bind(this)))
        }
        _clearDataImpl() {
            this._data.clear()
        }
        _changeStatusTo(e) {
            (0, s.assert)(this._status !== e, "Source and destination status should be distinct"), dt.logNormal(`Status changed from ${ut[this._status]} to ${ut[e]}`), this._status = e
        }
        _createSeries() {
            (0, s.assert)(this._status !== ut.Active, 'Status should not be "Active" when creating a study'), this._instanceId = "sds_" + _t++, this._resolveSymbol();
            const e = this._createSeriesOverriddenParams || this._createSeriesParams;
            this._createSeriesOverriddenParams && (this._createSeriesOverriddenParams = 0), this._gateway.createSeries(this._instanceId, this.turnaround(), (0,
                s.ensureNotNull)(this._symbolInstanceId), (0, s.ensureNotNull)(this._resolution), e, this._timeFrame, this._onMessage.bind(this)), this._timeFrame = null, this._changeStatusTo(ut.AwaitingFirstDataUpdate), this._dataEvents.fireCreated(this._instanceId)
        }
        _onGatewayIsConnectedChanged(e) {
            e ? this._onGatewayConnected() : this._onGatewayDisconnected()
        }
        _onGatewayConnected() {
            this._status === ut.AwaitingConnection && this._createSeries()
        }
        _onGatewayDisconnected() {
            this._status !== ut.Idle && this._status !== ut.AwaitingConnection && (this._instanceId = null, this._changeStatusTo(ut.AwaitingConnection)), this._turnaroundCounter = 1
        }
        _onMessage(e) {
            this._enqueueUpdate((() => this._onMessageImpl(e)))
        }
        async _onMessageImpl(e) {
            switch (e.method) {
                case "symbol_resolved": {
                    const [t, i] = e.params;
                    if (t !== this._symbolInstanceId) {
                        dt.logNormal(`Resolve for old symbol, expected: ${this._symbolInstanceId}, actual ${e.params[0]}`);
                        break
                    }
                    this._onSymbolResolved(i);
                    break
                }
                case "symbol_error":
                    if (e.params[0] !== this._symbolInstanceId) {
                        dt.logNormal(`Symbol error for old symbol, expected: ${this._symbolInstanceId}, actual ${e.params[0]}`);
                        break
                    }
                    this._onSymbolError(e);
                    break;
                case "series_timeframe": {
                    const [t, i, s, r, n, o, a] = e.params;
                    if (!this._checkTurnaround(t, i)) {
                        dt.logNormal(`Time frame for old data, expected: ${this._symbolInstanceId} (${this.turnaround()}), actual ${t} (${i})`);
                        break
                    }
                    this._onSeriesTimeFrame(s, r, n, o, a);
                    break
                }
                case "series_error": {
                    const [t, i] = e.params;
                    if (!this._checkTurnaround(t, i)) {
                        dt.logNormal(`Series error for old data, expected: ${this._symbolInstanceId} (${this.turnaround()}), actual ${t} (${i})`);
                        break
                    }
                    this._onSeriesError(e.params[2]);
                    break
                }
                case "series_loading": {
                    const [t, i] = e.params;
                    if (!this._checkTurnaround(t, i)) break;
                    this._onSeriesLoading(e.time);
                    break
                }
                case "series_completed": {
                    const [t, i, s, r] = e.params;
                    if (!this._checkTurnaround(t, s)) {
                        dt.logNormal(`Series completed for old data, expected: ${this._symbolInstanceId} (${this.turnaround()}), actual ${t} (${s})`);
                        break
                    }
                    this._onSeriesCompleted(i, e.time, r);
                    break
                }
                case "data_update":
                    if (!this._checkTurnaround(e.params.customId, e.params.turnaround)) {
                        dt.logNormal(`Data update for old data, expected: ${this._symbolInstanceId} (${this.turnaround()}), actual ${e.params.customId} (${e.params.turnaround})`);
                        break
                    }
                    await this._onDataUpdate(e.params.plots, e.params.nonseries, e.params.lastBar);
                    break;
                case "clear_data":
                    if (e.params.turnaround !== this.turnaround()) {
                        dt.logNormal(`Clear data for old data, expected: ${this.turnaround()}, actual ${e.params.turnaround}`);
                        break
                    }
                    this._clearDataImpl(), this._dataEvents.fireDataUpdated(void 0, !1, null)
            }
        }
        _onSeriesError(e) {
            let t, i;
            if ("string" == typeof e) i = {
                error: e
            }, t = e;
            else if (i = e, e.ctx) {
                const i = {};
                Object.entries(e.ctx).forEach((([e, t]) => {
                    i[e] = t.toString()
                })), t = e.error.format(i)
            } else t = e.error;
            if (t.startsWith("study_not_auth:")) {
                const e = t.split(":", 2)[1].split("@", 2)[0];
                if (["BarSetRenko", "BarSetPriceBreak", "BarSetKagi", "BarSetPnF"].includes(e)) this._dataEvents.fireChartTypeNotPermitted(e);
                else if ("BarSetSpread" === e) this._dataEvents.fireIntradaySpreadNotPermitted();
                else if ("BarSetRange" === e) {
                    const e = `${(0,
s.ensureNotNull)(this._symbol).inputs.range}R`;
                    this._dataEvents.fireCustomIntervalNotPermitted(e)
                }
            } else "resolution_not_entitled" === t ? this._dataEvents.fireIntradayExchangeNotPermitted() : "custom_resolution" === t ? this._dataEvents.fireCustomIntervalNotPermitted((0, s.ensureNotNull)(this._resolution)) : "seconds_not_entitled" === t && this._dataEvents.fireSecondsIntervalNotPermitted();
            this._dataEvents.fireSeriesError(i)
        }
        _onSeriesTimeFrame(e, t, i, s, r) {
            this._dataEvents.fireSeriesTimeFrame(e, t, i, null == s || s, r)
        }
        _onSymbolError(e) {
            if (e.params[1] === ct.permissionDenied) switch (e.params[2]) {
                case ct.SymbolErrorPermissionDeniedReason.Symbol:
                    this._dataEvents.fireSymbolNotPermitted(e.params[3]);
                    break;
                case ct.SymbolErrorPermissionDeniedReason.GroupPermission:
                    this._dataEvents.fireSymbolGroupNotPermitted(e.params[3]);
                    break;
                default:
                    this._dataEvents.fireSymbolNotPermitted(e.params[2])
            } else e.params[1] === ct.invalidSymbol && this._dataEvents.fireSymbolInvalid();
            this._dataEvents.fireSymbolError(e.params[1])
        }
        _onSymbolResolved(e) {
            this._resolvedSymbolName = (0, m.symbolForApi)(e, this._getSymbolNameString((0, s.ensureNotNull)(this._symbol))), this._dataEvents.fireSymbolResolved(e)
        }
        _getSymbolNameString(e) {
            return "string" == typeof e.symbol ? e.symbol : e.symbol.symbol
        }
        async _onDataUpdate(e, t, i) {
            this._onDataUnpacked(e, i, await async function(e) {
                if (void 0 === e) return {
                    projectionPlots: [],
                    boxSize: null
                };
                if ("" === e.d || "nochange" === e.indexes) return null;
                const t = await (0, lt.unpackNonSeriesData)(e.d);
                if (null === t || t.indexes_replace) return null;
                const i = e.indexes,
                    {
                        bars: s,
                        price: r,
                        boxSize: n,
                        reversalAmount: o
                    } = t.data,
                    a = (s || []).map((e => {
                        let t;
                        return "factor" in e ? t = e.factor : "additionalPrice" in e && (t = e.additionalPrice), {
                            index: i[e.time],
                            value: [0, e.open, e.high, e.low, e.close, e.volume, t]
                        }
                    }));
                return {
                    lastPrice: r,
                    projectionPlots: a,
                    reversalAmount: o,
                    boxSize: n
                }
            }(t))
        }
        _enqueueUpdate(e) {
            return this._ongoingDataUpdate = this._ongoingDataUpdate.then(e, e), this._ongoingDataUpdate
        }
        _onDataUnpacked(e, t, i) {
            if (this._status === ut.Idle) return;
            this._status === ut.AwaitingFirstDataUpdate && (this._changeStatusTo(ut.Active), this._clearDataImpl());
            const s = this._data.bars().size(),
                r = this._data.bars().firstIndex(),
                n = this._data.mergeRegularBars(e);
            null !== i && (this._data.nsBars().clear(), this._data.nsBars().merge(i.projectionPlots), this._data.lastProjectionPrice = i.lastPrice, null !== i.boxSize && (this._data.boxSize = i.boxSize), this._data.reversalAmount = i.reversalAmount);
            const o = null === r || null !== n && n.index < r;
            this._dataEvents.fireDataUpdated(t, o, n), s !== this._data.bars().size() && null !== n && this._dataEvents.fireBarReceived(n)
        }
        _onSeriesLoading(e) {
            this._dataEvents.fireLoading(e)
        }
        _onSeriesCompleted(e, t, i) {
            this._dataEvents.fireCompleted({
                updateMode: e,
                time: t,
                flags: i
            })
        }
        _checkTurnaround(e, t) {
            return this._instanceId === e && (void 0 === t || t === this.turnaround())
        }
    }
    var ft = i(94025),
        vt = i(2362);
    const St = b.enabled("chart_style_hilo_last_price");
    class yt extends vt.SeriesHorizontalLinePaneView {
        constructor(e) {
            super(e), this._lineRendererData.linestyle = Ve.LINESTYLE_DOTTED
        }
        _updateImpl() {
            this._lineRendererData.visible = !1;
            const e = this._series.properties().childs();
            if (!e.showPriceLine.value()) return;
            if (!St && 12 === e.style.value()) return;
            const t = this._series.lastValueData(void 0, !0);
            t.noData || (this._lineRendererData.visible = !0, this._lineRendererData.y = t.coordinate, this._lineRendererData.color = this._series.priceLineColor(t.color), this._lineRendererData.linewidth = e.priceLineWidth.value())
        }
    }
    var bt = i(11775),
        wt = i(79586),
        Pt = i(18671),
        Ct = i(7138),
        xt = i(57917),
        Tt = i(41800),
        It = i(8943),
        Mt = i(53275),
        At = i(19266),
        Lt = i(45197),
        kt = i(80101),
        Et = i(836);
    class Dt extends xt.SeriesCandlesPaneView {
        renderer(e, t) {
            this._invalidated && (this._updateImpl(null), this._invalidated = !1);
            const i = this._source.priceScale();
            if (!i) return null;
            const s = this._source.properties().childs().haStyle.childs(),
                r = this._model.timeScale().barSpacing(),
                n = {
                    bars: this._bars,
                    barSpacing: r,
                    bodyVisible: s.drawBody.value(),
                    borderVisible: s.drawBorder.value(),
                    borderColor: s.borderColor.value(),
                    wickColor: s.wickColor.value(),
                    barWidth: (0, Lt.optimalBarWidth)(r),
                    wickVisible: s.drawWick.value(),
                    isPriceScaleInverted: i.isInverted()
                },
                o = new At.CompositeRenderer;
            return o.append(new Et.PaneRendererCandles(n)), this._model.selection().isSelected(this._source) && this._isMarkersEnabled && this._selectionData && o.append(new kt.SelectionRenderer(this._selectionData)), o
        }
    }
    var Vt = i(11740),
        Bt = i(28400),
        Rt = i(81049),
        Nt = i(35994),
        Ot = i(28853),
        Ft = i(1763),
        Wt = (i(62615), i(16410));
    const zt = b.enabled("price_scale_always_last_bar_value"),
        Ht = b.enabled("display_data_mode"),
        Ut = (r.CheckMobile.any(), !b.enabled("hide_series_legend_item")),
        jt = b.enabled("hide_price_scale_global_last_bar_value"),
        Gt = b.enabled("show_average_close_price_line_and_label"),
        qt = b.enabled("no_bars_status"),
        $t = b.enabled("charting_library_debug_mode"),
        Yt = b.enabled("chart_style_hilo_last_price"),
        Kt = (0, a.getLogger)("Chart.Series"),
        Zt = b.enabled("pre_post_market_sessions");
    const Xt = {
        countdownEnabled: !0,
        lastPriceAnimationEnabled: !0
    };

    function Jt(e, t, i) {
        return void 0 === t ? null : `${e}=${t} (${i?"changed":"unchanged"})`
    }

    function Qt(e) {
        const t = e.state();
        return t.data.forEach((e => e.value.splice(7, 1))), t
    }
    class ei extends l.PriceDataSource {
        constructor(e, t, i, r) {
            super(e, "_seriesId"), this.requestingIntradayWhenNotSupported = new(Xe()), this.requestingStyleIsNotSupported = new(Xe()), this.requestingStyleSupportRecovered = new(Xe()), this.requestingResolutionLessThanFrequency = new(Xe()), this._paneView = null, this._futureBarsPaneView = null, this._projectionBarsPaneView = null, this._waterlineView = null, this._priceLineView = null, this._gotoDateView = null, this._baseHorizontalLineView = null, this._priceStep = null, this._symbolInfo = null, this._prevSymbolInfo = null, this._isPrePostMarketPricesAvailableProperty = new(_())(!1), this._isBackAdjustmentForbiddenProperty = new(_())(!0), this._isSettlementAsCloseForbiddenProperty = new(_())(!0), this._highLowPriceCache = new Map, this._averagePriceCache = new Map, this._prevClosePriceAxisView = null, this._priceScaleChanged = new(Xe()), this._priceScaleAboutToBeChanged = new(Xe()), this._onRestarted = new(Xe()), this._onStatusChanged = new(Xe()), this._extendedHoursChanged = new(Xe()), this._tagsChanged = new(Xe()), this._intervalChanged = new(Xe()),
                this._sessionIdChanged = new(Xe()), this._requestMoreDataAvailable = !0, this._lineStyleLastPriceCirclePaneView = new ot(this), this._prevClosePriceLineView = null, this._dataPoweredBy = null, this._loading = !0, this._seriesLoaded = !1, this._status = 0, this._symbolResolvingActive = new(Y())(!1), this._predictBars = 0, this._syncModel = null, this._data = null, this._lastCompleteFlags = null, this._haStyle = {
                    studyId: (0, s.ensureNotNull)((0, m.chartStyleStudyId)(8, !0))
                }, this._renkoStyle = {
                    studyId: (0, s.ensureNotNull)((0, m.chartStyleStudyId)(4, !0))
                }, this._pbStyle = {
                    studyId: (0, s.ensureNotNull)((0, m.chartStyleStudyId)(7, !0))
                }, this._kagiStyle = {
                    studyId: (0, s.ensureNotNull)((0, m.chartStyleStudyId)(5, !0))
                }, this._pnfStyle = {
                    studyId: (0, s.ensureNotNull)((0, m.chartStyleStudyId)(6, !0))
                }, this._rangeStyle = {
                    studyId: (0, s.ensureNotNull)((0, m.chartStyleStudyId)(11, !0))
                }, this._barColorerCache = null, this._boxSizeValue = new(Y()), this._base = 100, this._pointValue = 1, this._formattingDeps = null, this._formatter = new f.PriceFormatter(this._base), this._ignoreMinMoveFormatter = new f.PriceFormatter(this._base), this._ignoreMinMovePriceStep = null, this._lastBarCloseTime = null, this._onSessionIdPropertyChangedBound = this._onSessionIdPropertyChanged.bind(this), this._ignoreSessionIdProxyPropertyChanges = !1, this._textSourceIsAlwaysTickerRestrictionEnabled = !1, this._lastPriceAnimationActive = !1, this._currentSession = "out_of_session", this._onStyleChanged = new(Xe()), this._intervalObj = null, this._obsoleteZOrder = 0, this._seriesErrorMessage = null, this._seriesAlwaysFalseHibernatedVW = new(Y())(!1), this._styleToRecover = null, this._precomputedBarStyles = new WeakMap, this._doNotShowLastAvailableBar = !1, this._gotoDateResultCleared = !1, this._endOfDataPaneView = null, this._pendingTimeRange = null, this._replaySubscriber = null, this._symbolIntervalChanged = new(Xe()), this._isReplayResolutionAvailableForUser = null, this._onInReplayStateChanged = new(Xe()), this._replayExitedDueUnsupportedInterval = new(Xe()), this._replayExitedDueUnavailableForUserInterval = new(Xe()), this._onTimeFrameApplied = new(Xe()), this._prevRequestedInterval = "", this._isActingAsSymbolSource = new(Y())(!0), this._seriesSource = new gt(e.chartApi(), "s", r);
            const n = this._seriesSource.dataEvents();
            n.symbolResolved().subscribe(this, this._onSymbolResolved), n.symbolError().subscribe(this, this._onSymbolError), n.seriesTimeFrame().subscribe(this, this._onSeriesTimeFrame), n.seriesError().subscribe(this, this._onSeriesError), n.loading().subscribe(this, this._onSeriesLoading), n.completed().subscribe(this, this._onSeriesCompleted), n.dataUpdated().subscribe(this, this._onDataUpdated), n.barReceived().subscribe(this, this._onBarReceived), this._quotesProvider = new fe.QuotesProvider, this._quotesProvider.quotesUpdate().subscribe(this, this._onQuotesUpdate);
            const o = t.childs();
            if (t.hasChild("extendedHours")) {
                (0, s.ensureDefined)(o.extendedHours).value() && !t.hasChild("sessionId") && t.addChild("sessionId", new(_())("extended")), t.removeProperty("extendedHours")
            }
            t.hasChild("sessionId") || t.addChild("sessionId", new(_())(g.SubsessionId.Regular)), (0, Wt.allChartStyles)().includes(o.style.value()) || o.style.setValueSilently(2);
            const a = o.lineStyle.childs();
            if (o.lineStyle.hasChild("styleType")) {
                let e;
                const t = a.styleType.value();
                0 === t && (o.style.setValue(14), e = o.lineWithMarkersStyle.childs()), 1 === t && (o.style.setValue(15), e = o.steplineStyle.childs()), e && (e.color.setValueSilently(a.color.value()), e.linestyle.setValueSilently(a.linestyle.value()), e.linewidth.setValueSilently(a.linewidth.value()), e.priceSource.setValueSilently(a.priceSource.value())), o.lineStyle.removeProperty("styleType")
            }
            this._setProperties(t), this._sessionIdProxyProperty = new(_())(o.sessionId.value()), o.sessionId.subscribe(this, (() => this._updateSessionIdProxyProperty())), this._sessionIdProxyProperty.subscribe(this, this._onSessionIdProxyPropertyChanged), this._symbolTextSourceProxyProperty = new(_()), this._recalcSymbolTextSourceProxyProperty(), o.statusViewStyle.childs().symbolTextSource.subscribe(this, this._recalcSymbolTextSourceProxyProperty), this._symbolTextSourceProxyProperty.subscribe(this, (() => e.lightUpdate())), this._options = (0, me.merge)((0, me.clone)(Xt), i), this._prevChartStyle = o.style.value(), this._priceAxisView = new Me(this, e, {
                alwaysShowGlobalLast: !jt,
                showCountdown: i.countdownEnabled
            });
            let l = null;
            zt || jt || (l = new Me(this, e, {
                visibleOnHistoryOnly: !0,
                showSymbolLabel: !1,
                showCountdown: !1,
                alwaysShowGlobalLast: !1,
                useSolidBodyColor: !1
            })), this._priceLinePriceAxisView = new Ae.SeriesPriceLineAxisView(this), this._priceLineAxisViews = [this._priceLinePriceAxisView];
            const c = new Le(this, e, {
                showCountdown: i.countdownEnabled
            });
            this._priceAxisViews = [this._priceAxisView, c], null !== l && this._priceAxisViews.push(l), this._panePriceAxisView = new ke.PanePriceAxisView(this._priceAxisView, this, e), this._historyPricePanePriceAxisView = null !== l ? new ke.PanePriceAxisView(l, this, e) : null, this._projectionPriceAxisView = new ke.PanePriceAxisView(c, this, e), this._labelPaneViews = [this._panePriceAxisView, this._projectionPriceAxisView], null !== this._historyPricePanePriceAxisView && this._labelPaneViews.push(this._historyPricePanePriceAxisView), this._highLowAvgPaneViews = [], this._averagePaneViews = [], Gt && this._createAverageViews(), this._createHighLowAvgViews(), this._subscribeRestartToSessionIdChange(), o.visible.subscribe(this, this._updateLastPriceAnimationActive), this._updateLastPriceAnimationActive(), this._dataWindowView = new z(this, e), this._legendView = new q(this, e), this._statusView = new D(this, this._model.properties().childs().scalesProperties.childs().textColor, o.statusViewStyle), this._marketStatusModel = new Q(this._quotesProvider, o.symbol.listeners()), this._dataUpdatedModeModel = Ht ? new _e({
                getter: this.symbolInfo.bind(this),
                onChange: n.symbolResolved()
            }, {
                getter: this.status.bind(this),
                onChange: this._onStatusChanged
            }, {
                getter: () => {
                    var e;
                    return null === (e = this._lastCompleteFlags) || void 0 === e ? void 0 : e.rt_update_period
                },
                onChange: n.completed()
            }, o.symbol.listeners()) : null, this._dataProblemModel = new ge(this._quotesProvider, o.symbol.listeners()), this._symbolResolvingActive.subscribe((() => e.realignLineTools())), this._intervalChanged.subscribe(this, (() => e.realignLineTools()))
        }
        supportsPressedChunks() {
            return !0
        }
        pressedChunks(e, t) {
            return this.data().pressedChunks(e, t)
        }
        seriesErrorMessage() {
            return this._seriesErrorMessage
        }
        destroy() {
            this._quotesProvider.quotesUpdate().unsubscribeAll(this), this._quotesProvider.destroy(), this._model.timeScale().visibleBarsStrictRangeChanged().unsubscribeAll(this), this._unsubscribeRestartToSessionIdChange(), this._replayExitedDueUnsupportedInterval.destroy(), this._replayExitedDueUnavailableForUserInterval.destroy(), this._onTimeFrameApplied.destroy()
        }
        isActingAsSymbolSource() {
            return this._isActingAsSymbolSource.readonly()
        }
        barColorer() {
            if (this._barColorerCache) return this._barColorerCache;
            let e = null;
            const t = this._model.dataSources();
            for (let i = t.length - 1; i >= 0; i--) {
                const r = t[i];
                if ((0, Ot.isStudy)(r) && r.hasBarColorer() && !r.isSourceHidden()) {
                    const t = (0, s.ensureNotNull)(r.barColorer());
                    null === e ? e = t : e.pushBackBarColorer(t)
                }
            }
            return null === e ? e = new Nt.SeriesBarColorer(this) : e.pushBackBarColorer(new Nt.SeriesBarColorer(this)), this._barColorerCache = e, e
        }
        createPaneView() {
            this._paneView = null, this._projectionBarsPaneView = null, this._waterlineView = null, this._priceLineView = this.hasClosePrice() ? new yt(this) : null;
            const e = this._properties.childs().style.value();
            switch (e) {
                case 0:
                    this._paneView = new Ct.SeriesBarsPaneView(this, this._model);
                    break;
                case 1:
                    this._paneView = new xt.SeriesCandlesPaneView(this, this._model);
                    break;
                case 2:
                case 14:
                case 15:
                    this._paneView = new Tt.SeriesLinePaneView(this, this._model);
                    break;
                case 3:
                    this._paneView = new It.SeriesAreaPaneView(this, this._model);
                    break;
                case 16:
                    this._paneView = new Mt.SeriesHLCAreaPaneView(this, this._model);
                    break;
                case 8:
                    this._paneView = new Dt(this, this._model);
                    break;
                case 9:
                    this._paneView = new Vt.SeriesHollowCandlesPaneView(this, this._model);
                    break;
                case 13:
                    this._paneView = new Pt.SeriesColumnsPaneView(this, this._model);
                    break;
                case 10: {
                    this._paneView = new Bt.SeriesBaselinePaneView(this, this._model);
                    const e = this._properties.childs().baselineStyle.childs();
                    this._waterlineView = new bt.SeriesWaterlinePaneView({
                        paneHeight: () => this.priceScale().height(),
                        color: () => e.baselineColor.value(),
                        baseLevelPercentage: () => e.baseLevelPercentage.value()
                    });
                    break
                }
                case 12:
                    this._paneView = new wt.SeriesHiLoPaneView(this, this._model)
            }
            if (null === this._paneView) throw Error("Unknown chart style assigned: " + e)
        }
        properties() {
            return this._properties
        }
        zorder() {
            return 0
        }
        quotesProvider() {
            return this._quotesProvider
        }
        currentSession() {
            return this._currentSession
        }
        syncModel() {
            if (!this._syncModel) {
                const e = this.symbolInfo(),
                    t = this.interval();
                if (!e || !t) return null;
                this._syncModel = new oe(e, t)
            }
            return this._syncModel
        }
        labelPaneViews() {
            return this._labelPaneViews
        }
        topPaneViews() {
            const e = [];
            if (null !== this._gotoDateView && e.push(this._gotoDateView), this._lastPriceAnimationActive) {
                const t = this._lineStyleLastPriceCirclePaneView;
                t.animationActive() && setTimeout((() => this._model.invalidate(at.InvalidationMask.cursor())), 0), t.invalidateStage(), e.push(t)
            }
            return 0 !== e.length ? e : null
        }
        paneViews() {
            if (!this.properties().childs().visible.value()) return null;
            const e = [(0, s.ensureNotNull)(this._baseHorizontalLineView), (0, s.ensureNotNull)(this._paneView)];
            return this._endOfDataPaneView && e.push(this._endOfDataPaneView), this._futureBarsPaneView && e.push(this._futureBarsPaneView), this._projectionBarsPaneView && e.push(this._projectionBarsPaneView), null !== this._waterlineView && e.push(this._waterlineView), null !== this._priceLineView && e.push(this._priceLineView), e.push(...this._highLowAvgPaneViews), e.push(...this._averagePaneViews), e
        }
        priceAxisViews(e, t) {
            return e.findTargetPriceAxisViews(this, t, this._priceAxisViews, this._priceLineAxisViews)
        }
        clearHighLowPriceCache() {
            this._highLowPriceCache.clear()
        }
        clearAveragePriceCache() {
            this._averagePriceCache.clear()
        }
        priceScaleChanged() {
            return this._priceScaleChanged
        }
        priceScaleAboutToBeChanged() {
            return this._priceScaleAboutToBeChanged
        }
        disconnect() {
            this._seriesSource.stop(), this._predictBars = 0, this._status = 0, this._model.isSnapshot() || (this._prevSymbolInfo = null, this._symbolInfo = null)
        }
        isStarted() {
            return this._seriesSource.isStarted()
        }
        restart(e = !0) {
            if (5 === this._status) return;
            this._loading = !0, this._lastCompleteFlags = null, this._onRestarted.fire(), this._setStatus(1), this._updateSymbolInfo(null, e);
            let t = this._properties.childs().interval.value();
            te.Interval.isEqual(t, this._prevRequestedInterval) && this._notifyIntervalChanged(t);
            let i = null;
            this._pendingTimeRange && (i = this._pendingTimeRange, this._pendingTimeRange = null), this._onBeforeModifySeries(this.getSymbolString(), t), this._onTimeFrameApplied.fire(i), t = (0, ft.getServerInterval)(t), this._data = null, this._seriesSource.modifySeries(this._getResolvingSymbolObject(), t, i), this._seriesSource.isStarted() || this._seriesSource.start(), this._prevRequestedInterval = this.interval(), this.updateAllViews((0, Pe.sourceChangeEvent)(this.id())), this._model.lightUpdate()
        }
        isSymbolInvalid() {
            return 4 === this._status
        }
        getSymbolString() {
            return (0, Qe.encodeExtendedSymbolOrGetSimpleSymbolString)(this._getSymbolObject())
        }
        invalidateBarStylesCache(e) {
            Kt.logDebug("Invalidate style cache starting from " + e), this._clearStylePlot(this.bars(), e), this._clearStylePlot(this.nsBars())
        }
        isFailed() {
            return 12 === this.status() || 4 === this.status() || 10 === this.status()
        }
        isStatusError() {
            return 12 === this.status()
        }
        actualSymbol() {
            return (0, m.actualSymbol)(this.symbolInfo(), this.symbol())
        }
        proSymbol() {
            return (0, m.proSymbol)(this.symbolInfo(), this.symbol())
        }
        onStyleChanged() {
            return this._onStyleChanged
        }
        style() {
            return this.properties().childs().style.value()
        }
        setStyle(e) {
            this.setSymbolParams({
                style: e
            })
        }
        isRangeBasedStyle() {
            return (0, m.isRangeBasedStyle)(this.style())
        }
        symbolSameAsCurrent(e) {
            return (0, Je.symbolSameAsCurrent)(e, this.symbolInfo())
        }
        status() {
            return this._status
        }
        symbol() {
            return this.properties().childs().symbol.value()
        }
        symbolInfo() {
            return this._symbolInfo
        }
        symbolResolved() {
            return this.dataEvents().symbolResolved()
        }
        symbolResolvingActive() {
            return this._symbolResolvingActive
        }
        symbolHibernated() {
            return this._seriesAlwaysFalseHibernatedVW
        }
        firstValue() {
            const e = this.firstBar();
            return null === e ? null : this._barFunction(e, 0)
        }
        firstBar() {
            const e = this.model().timeScale().visibleBarsStrictRange();
            if (null === e) return null;
            const t = e.firstBar(),
                i = this.data().search(t, d.PlotRowSearchMode.NearestRight);
            return null !== i ? i.value : null
        }
        formatter(e = !0) {
            return e ? this._formatter : this._ignoreMinMoveFormatter
        }
        priceStep(e = !0) {
            return e ? this._priceStep : this._ignoreMinMovePriceStep
        }
        bars() {
            return this.data().bars()
        }
        nsBars() {
            return this.data().nsBars()
        }
        interval() {
            return this.properties().childs().interval.value()
        }
        setInterval(e) {
            this.setSymbolParams({
                interval: e
            })
        }
        intervalObj() {
            const e = this.interval();
            if (null !== this._intervalObj && this._intervalObj.resolutionString === e) return this._intervalObj.interval;
            const t = te.Interval.parse(e);
            return this._intervalObj = {
                resolutionString: e,
                interval: t
            }, t
        }
        prevClose() {
            const e = this.priceScale();
            if (e.isEmpty() || this.data().isEmpty()) return null;
            const t = this.quotes(),
                i = this.firstValue();
            if (null === t || null === i) return null;
            const s = t.prev_close_price;
            return void 0 === s ? null : {
                coordinate: e.priceToCoordinate(s, i),
                floatCoordinate: e.priceToCoordinate(s, i),
                formattedPricePercentage: e.formatPricePercentage(s, i, !0),
                formattedPriceAbsolute: e.formatPriceAbsolute(s),
                formattedPriceIndexedTo100: e.formatPriceIndexedTo100(s, i)
            }
        }
        priceLineColor(e) {
            return this.properties().childs().priceLineColor.value() || e
        }
        hasClosePrice() {
            return Yt || 12 !== this.properties().childs().style.value()
        }
        lastValueData(e, t, i) {
            var s;
            const r = {
                    noData: !0
                },
                n = this.priceScale();
            if (this.model().timeScale().isEmpty() || n.isEmpty() || this.data().isEmpty()) return r;
            const o = this.model().timeScale().visibleBarsStrictRange(),
                a = this.firstValue();
            if (null === o || null === a) return r;
            let l, c;
            if (t) {
                const e = this.data().bars().last();
                if (null === e) return r;
                l = e.value, c = e.index
            } else {
                const e = this.data().bars().search(o.lastBar(), d.PlotRowSearchMode.NearestLeft);
                if (null === e) return r;
                l = e.value, c = e.index
            }
            const h = null !== (s = void 0 !== e ? l[e] : this._barFunction(l, 2)) && void 0 !== s ? s : NaN,
                u = this.barColorer().barStyle(c, !1),
                p = n.priceToCoordinate(h, a),
                _ = {
                    ...n.getFormattedValues(h, a, !0),
                    noData: !1,
                    color: u.barColor,
                    floatCoordinate: p,
                    coordinate: p,
                    index: c
                };
            return i && (_.price = h), _
        }
        isDWM() {
            return this.intervalObj().isDWM()
        }
        data() {
            var e;
            return null !== (e = this._data) && void 0 !== e ? e : this._seriesSource.data()
        }
        clearData() {
            (0, s.assert)(null === this._data, "Cannot clear loaded data"), this._seriesSource.clearData()
        }
        nearestValue(e, t, i) {
            var s;
            const r = this.nearestData(e, i);
            return null !== (s = null == r ? void 0 : r.value[t]) && void 0 !== s ? s : void 0
        }
        onSymbolIntervalChanged() {
            return this._symbolIntervalChanged
        }
        onIntervalChanged() {
            return this._intervalChanged
        }
        onStatusChanged() {
            return this._onStatusChanged
        }
        onRestarted() {
            return this._onRestarted
        }
        onExtendedHoursChanged() {
            return this._extendedHoursChanged
        }
        fixLastBar(e) {
            0
        }
        requestMoreData(e) {
            if (3 !== this._status && 7 !== this._status && 8 !== this._status && 9 !== this._status && 6 !== this._status && 11 !== this._status) return;
            if (this._model.timeScale().isEmpty()) return;
            const t = this._model.timeScale().visibleBarsStrictRange();
            if (null === t) return;
            if (0 === this.bars().size()) return;
            const i = t.lastBar() - (0, s.ensureNotNull)(this.data().last()).index;
            if (this._predictBars < i && (this._predictBars = i, this._seriesSource.requestMoreTickmarks(i)),
                !this._requestMoreDataAvailable) return;
            const r = (0, s.ensureNotNull)(this.bars().firstIndex()),
                n = e || r - t.firstBar();
            n <= 0 || (Number.isFinite(n) ? (this._requestMoreDataAvailable = !1, this._loading = !0, this._seriesSource.requestMoreData(n), this._setStatus(2)) : Kt.logWarn("requestMoreData: invalid bar count: " + n + ", visible bars: [" + t.firstBar() + ", " + t.lastBar() + "], last index: " + (0, s.ensureNotNull)(this.data().last()).index + ", predicted bars: " + this._predictBars + ", required bars:" + e))
        }
        isNeedRestart(e) {
            return 5 !== this._status && (void 0 === e && (e = this.properties().childs().style.value()), !(0, m.isRangeStyle)(this._prevChartStyle) && !(0, m.isRangeStyle)(e) && !(this._prevChartStyle === e || !(0, m.isRequiringRestartSeriesStyles)(this._prevChartStyle) && !(0, m.isRequiringRestartSeriesStyles)(e)))
        }
        isStyleSupportedForReplay(e) {
            return 8 !== e && (0, m.isTimeBasedStyle)(e)
        }
        sessionId() {
            return this.properties().childs().sessionId.value()
        }
        sessionIdChanged() {
            return this._sessionIdChanged
        }
        priceRange(e, t) {
            var i, r;
            const n = this.m_priceScale;
            if (this.data().isEmpty() || !n) return null;
            if (n.isLockScale()) {
                const e = this._model.mainSeriesScaleRatio();
                if (null !== e) {
                    const i = n.internalHeight() / (this.model().timeScale().barSpacing() / e),
                        r = (0, s.ensureNotNull)(this.data().search(t, d.PlotRowSearchMode.NearestLeft)).value,
                        o = ((0, s.ensure)(r[2]) + (0, s.ensure)(r[3])) / 2;
                    return new u.PriceRange(o - .5 * i, o + .5 * i)
                }
            }
            const o = this.priceSource();
            let a, l, c;
            if (null !== o ? (a = this.data().bars().minMaxOnRangeCached(e, t, [{
                    name: o,
                    offset: 0
                }]), l = this.data().nsBars().minMaxOnRangeCached(e, t, [{
                    name: o,
                    offset: 0
                }])) : (a = this.data().bars().minMaxOnRangeCached(e, t, [{
                    name: "low",
                    offset: 0
                }, {
                    name: "high",
                    offset: 0
                }]), l = this.data().nsBars().minMaxOnRange(e, t, [{
                    name: "low",
                    offset: 0
                }, {
                    name: "high",
                    offset: 0
                }])), a = (0, h.mergeMinMax)(a, l), null === a) c = new u.PriceRange(-.5, .5);
            else if (a.min === a.max) {
                const e = 5 / (null !== (r = null === (i = this._symbolInfo) || void 0 === i ? void 0 : i.pricescale) && void 0 !== r ? r : 100);
                c = new u.PriceRange(a.min - e, a.max + e)
            } else c = new u.PriceRange(a.min, a.max);
            return n.isLog() ? new u.PriceRange(n.priceToLogical(c.minValue()), n.priceToLogical(c.maxValue())) : c
        }
        autoScaleInfo(e, t) {
            const i = this.priceRange(e, t);
            if (null === this._paneView) return {
                range: i
            };
            const s = this._paneView;
            return {
                range: i,
                topPixelMargin: s.topPixelMargin ? s.topPixelMargin() : void 0,
                bottomPixelMargin: s.bottomPixelMargin ? s.bottomPixelMargin() : void 0
            }
        }
        onChartStyleChanged(e = !0) {
            var t;
            this._updateBarFunction(), this.isNeedRestart() && (this.data().clear(), this.model().timeScale().scrollToRealtime(!1), this.restart(e));
            const i = this.properties();
            this._prevChartStyle = i.childs().style.value(), this._onStyleChanged.fire(i.childs().style.value()), this.invalidateBarStylesCache(), this._updateLastPriceAnimationActive(), (null === (t = this._styleToRecover) || void 0 === t ? void 0 : t.originalStyle) !== this.style() && (this._styleToRecover = null)
        }
        setChartStyleWithIntervalIfNeeded(e, t) {
            const i = this.interval(),
                s = null != t ? t : (0, ft.getResolutionByChartStyle)(e, i, this._model.defaultResolutions()),
                r = te.Interval.isEqual(s, i);
            this.setSymbolParams({
                interval: r ? void 0 : s,
                style: e
            })
        }
        idForAlert() {
            return super.idForAlert()
        }
        alertCreationAvailable() {
            return new(Y())(!1).readonly()
        }
        hasStateForAlert() {
            return !1
        }
        stateForAlert() {
            throw new Error("Not implemented")
        }
        styleStudyInfos() {
            return {
                haStyle: this._haStyle,
                renkoStyle: this._renkoStyle,
                pbStyle: this._pbStyle,
                kagiStyle: this._kagiStyle,
                pnfStyle: this._pnfStyle,
                rangeStyle: this._rangeStyle
            }
        }
        isSpread() {
            var e;
            return "spread" === (null === (e = this._symbolInfo) || void 0 === e ? void 0 : e.type)
        }
        isYield() {
            return null !== this._symbolInfo && (0, ce.isYield)(this._symbolInfo)
        }
        sessionIdProxyProperty() {
            return this._sessionIdProxyProperty
        }
        symbolTextSourceProxyProperty() {
            return this._symbolTextSourceProxyProperty
        }
        setTextSourceIsAlwaysTickerRestrictionEnabled(e) {
            this._textSourceIsAlwaysTickerRestrictionEnabled = e, this._recalcSymbolTextSourceProxyProperty()
        }
        isPrePostMarketPricesAvailableProperty() {
            return this._isPrePostMarketPricesAvailableProperty
        }
        isSettlementAsCloseForbiddenProperty() {
            return this._isSettlementAsCloseForbiddenProperty
        }
        isBackAdjustmentForbiddenProperty() {
            return this._isBackAdjustmentForbiddenProperty
        }
        invalidateBarColorerCache() {
            this._barColorerCache = null, this.invalidateBarStylesCache()
        }
        replayExitedDueUnsupportedInterval() {
            throw new Error("Not implemented")
        }
        replayExitedDueUnavailableForUserInterval() {
            throw new Error("Not implemented")
        }
        onTimeFrameApplied() {
            return this._onTimeFrameApplied
        }
        onInReplayStateChanged() {
            throw new Error("Not implemented")
        }
        dataWindowView() {
            return this._dataWindowView
        }
        statusView() {
            return Ut ? this._statusView : null
        }
        legendView() {
            return this._legendView
        }
        marketStatusModel() {
            return this._marketStatusModel
        }
        isMainSeries() {
            return !0
        }
        dataUpdatedModeModel() {
            return this._dataUpdatedModeModel
        }
        dataProblemModel() {
            return this._dataProblemModel
        }
        setDefaultTimeframe(e) {
            this._pendingTimeRange = e
        }
        loadDataTo(e) {
            const t = this._properties.childs().interval.value();
            this._onTimeFrameApplied.fire(e), this._seriesSource.modifySeries(this._getResolvingSymbolObject(), (0, ft.getServerInterval)(t), e)
        }
        isInReplay() {
            return null !== this._replaySubscriber
        }
        quotes() {
            return this.data().isEmpty() ? null : this._quotesProvider.quotes()
        }
        base() {
            return this._base
        }
        pointValue() {
            return this._pointValue
        }
        barCloseTime() {
            return this._lastBarCloseTime
        }
        priceSource() {
            let e = null;
            const t = this._properties.childs();
            switch (t.style.value()) {
                case 2:
                    e = t.lineStyle.childs().priceSource.value();
                    break;
                case 14:
                    e = t.lineWithMarkersStyle.childs().priceSource.value();
                    break;
                case 15:
                    e = t.steplineStyle.childs().priceSource.value();
                    break;
                case 3:
                    e = t.areaStyle.childs().priceSource.value();
                    break;
                case 10:
                    e = t.baselineStyle.childs().priceSource.value();
                    break;
                case 13:
                    e = t.columnStyle.childs().priceSource.value()
            }
            return e
        }
        updateAllViews(e) {
            var t, i, s, r, n, o, a, l;
            null === (t = this._paneView) || void 0 === t || t.update(e), this._dataWindowView.update(), this._legendView.update(), this._statusView.update(), this._averagePaneViews.forEach((t => t.update(e))), this._highLowAvgPaneViews.forEach((t => t.update(e))), this._labelPaneViews.forEach((t => t.update(e))), this._priceAxisViews.forEach((t => t.update(e))), this._priceLineAxisViews.forEach((t => t.update(e))),
                null === (i = this._futureBarsPaneView) || void 0 === i || i.update(e), null === (s = this._projectionBarsPaneView) || void 0 === s || s.update(e), null === (r = this._waterlineView) || void 0 === r || r.update(e), null === (n = this._priceLineView) || void 0 === n || n.update(e), null === (o = this._gotoDateView) || void 0 === o || o.update(e), null === (a = this._endOfDataPaneView) || void 0 === a || a.update(e), null === (l = this._baseHorizontalLineView) || void 0 === l || l.update(e);
            const c = this._model.activeStrategySource().value();
            null == c || c.updateAllViews(e), this._lineStyleLastPriceCirclePaneView.update(e)
        }
        barFunction() {
            return this._barFunction
        }
        precomputedBarStyle(e) {
            return this._precomputedBarStyles.get(e)
        }
        setPrecomputedBarStyle(e, t) {
            this._precomputedBarStyles.set(e, t)
        }
        setSymbolParams(e) {
            const {
                symbol: t,
                currency: i,
                unit: r,
                style: n
            } = e;
            let o = e.interval;
            const a = this.properties().childs(),
                l = this._symbolInfo;
            let c, h, d;
            if (null !== l ? (c = void 0 !== t && !(0, Je.symbolSameAsCurrent)(t, l), h = void 0 !== i && !(0, Je.currenciesAreSame)(i, l), d = void 0 !== r && !(0, Je.unitsAreSame)(r, l, this._model.unitConversionEnabled())) : (c = void 0 !== t && t !== a.symbol.value(), h = void 0 !== i && i !== a.currencyId.value(), d = void 0 !== r && r !== a.unitId.value()), void 0 !== o && !c) {
                const e = this.getSupportedResolution(o, !1);
                e !== o && (Kt.logWarn(`Change interval value from ${o} to ${e} because first is not supported`), o = e)
            }
            const u = void 0 !== o && !te.Interval.isEqual(a.interval.value(), o),
                p = void 0 !== n && n !== a.style.value(),
                _ = [Jt("symbol", t, c), Jt("interval", o, u), Jt("currency", i, h), Jt("unit", r, d), Jt("style", n, p)].filter((e => null !== e)).join("; ");
            Kt.logInfo(`Applying series symbol params: ${_}`), void 0 !== t && a.symbol.setValue(t), void 0 !== i && a.currencyId.setValue(i), void 0 !== r && a.unitId.setValue(r), u && a.interval.setValue((0, s.ensureDefined)(o)), p && a.style.setValue(n);
            let m = !1;
            if (p) {
                m = this.isNeedRestart();
                const e = !c && (h || d);
                this.onChartStyleChanged(e)
            }!m && (c || u || h || d) && this._applySymbolParamsChanges({
                symbolChanged: c,
                currencyChanged: h,
                unitChanged: d,
                intervalChanged: u,
                styleChanged: p
            }), (c || h || d) && this.model().checkLineToolSelection()
        }
        setSymbol(e) {
            this.setSymbolParams({
                symbol: e
            })
        }
        currency() {
            return this.properties().childs().currencyId.value() || null
        }
        setCurrency(e) {
            this.setSymbolParams({
                currency: e
            })
        }
        isConvertedToOtherCurrency() {
            return (0, m.isConvertedToOtherCurrency)(this.symbolInfo())
        }
        unit() {
            return this.properties().childs().unitId.value() || null
        }
        setUnit(e) {
            this.setSymbolParams({
                unit: e
            })
        }
        measureUnitId() {
            return (0, m.measureUnitId)(this.symbolInfo())
        }
        isConvertedToOtherUnit() {
            return (0, m.isConvertedToOtherUnit)(this.symbolInfo(), this._model.unitConversionEnabled())
        }
        symbolSource() {
            return this
        }
        barsProvider() {
            return this
        }
        title() {
            return this.symbolTitle()
        }
        name() {
            return this.symbolTitle()
        }
        symbolTitle(e, t, i = "exchange") {
            let s = this.properties().childs().symbol.value();
            const r = this.symbolInfo();
            if (null !== r) {
                const {
                    type: t
                } = r;
                s = (0, m.symbolTitle)(r, e, "forex" === t ? "exchange" : i)
            }
            return t ? s : `${s}, ${(0,C.translatedIntervalString)(this.properties().childs().interval.value())}`
        }
        setObsoleteZOrder(e) {
            this._obsoleteZOrder = e
        }
        obsoleteZOrder() {
            return this._obsoleteZOrder
        }
        valuesProvider() {
            return new U(this, this.model())
        }
        statusProvider(e) {
            return new L(this, this._model.properties().childs().scalesProperties.childs().textColor, this.properties().childs().statusViewStyle, e)
        }
        open(e) {
            const t = this.data().valueAt(e);
            return t && t[1]
        }
        high(e) {
            const t = this.data().valueAt(e);
            return t && t[2]
        }
        low(e) {
            const t = this.data().valueAt(e);
            return t && t[3]
        }
        close(e) {
            const t = this.data().valueAt(e);
            return t && t[4]
        }
        moveItem(e, t, i) {
            if (10 === this.style() && 0 === t) {
                const t = this.priceScale(),
                    i = this.properties().childs().baselineStyle,
                    s = t.height(),
                    r = 100 - e.y / s * 100,
                    n = r < 0 ? 0 : Math.round(10 * r) / 10;
                i.childs().baseLevelPercentage.setValue(Math.max(Math.min(n, 100), 0))
            }
        }
        rerequestData() {
            b.enabled("request_only_visible_range_on_reset") ? this._restartSeriesAndRequestVisibleRange() : this._applySymbolParamsChanges({
                force: !0
            })
        }
        switchToReplay(e, t) {
            throw new Error("Not implemented")
        }
        switchToRealtime() {
            throw new Error("Not implemented")
        }
        requestMoreDataAvailable() {
            return this._requestMoreDataAvailable
        }
        seriesLoaded() {
            return this._seriesLoaded
        }
        endOfData() {
            var e;
            return void 0 !== (null === (e = this._lastCompleteFlags) || void 0 === e ? void 0 : e.data_completed)
        }
        endOfDataType() {
            var e, t;
            return null !== (t = null === (e = this._lastCompleteFlags) || void 0 === e ? void 0 : e.data_completed) && void 0 !== t ? t : null
        }
        dataPoweredBy() {
            return null
        }
        boxSizeValue() {
            return this._boxSizeValue
        }
        isUserDeletable() {
            return !1
        }
        changeTimeFrame() {
            (0, n.trackEvent)("GUI", "Change timeframe")
        }
        onTagsChanged() {
            return this._tagsChanged
        }
        state(e) {
            var t;
            const i = this.obsoleteZOrder();
            let s = {
                type: "MainSeries",
                id: this.id(),
                zorder: i,
                haStyle: this._haStyle,
                renkoStyle: this._renkoStyle,
                pbStyle: this._pbStyle,
                kagiStyle: this._kagiStyle,
                pnfStyle: this._pnfStyle,
                rangeStyle: this._rangeStyle,
                formattingDeps: this._formattingDeps
            };
            const r = this.properties().state();
            if ((null === (t = this._symbolInfo) || void 0 === t ? void 0 : t.ticker) && (r.symbol = this._symbolInfo.ticker), this._model.unitConversionEnabled() || (r.unitId = null), s.state = r, e) {
                let e = this.bars();
                const t = this._model.timeScale().visibleExtendedDataRange(e, 0);
                null !== t && (e = e.range(t.firstBar(), t.lastBar())), s = {
                    ...s,
                    bars: Qt(e),
                    nsBars: Qt(this.nsBars()),
                    symbolInfo: this._symbolInfo,
                    rtPrice: this.data().lastProjectionPrice,
                    boxSize: this.data().boxSize,
                    reversalAmount: this.data().reversalAmount
                }
            }
            return s
        }
        restoreState(e, t) {
            if (t && this._setStatus(5), !this._model.unitConversionEnabled() && e.state && delete e.state.unitId, this._properties.mergeAndFire(e.state), this._properties.hasChild("esdBreaksStyle") && this._properties.removeProperty("esdBreaksStyle"), this._prevChartStyle = this.properties().childs().style.value(), this.createPaneView(), t) {
                const t = e;
                this.restoreData(t.bars, t.nsBars, t.symbolInfo, t.rtPrice, t.boxSize, t.reversalAmount)
            }
            e.formattingDeps && (this._formattingDeps = e.formattingDeps, this._recreatePriceFormattingDependencies())
        }
        restoreData(e, t, i, s, r, n) {
            this._status = 5, this._data = new c.SeriesData, this._data.bars().restoreState(e), this._data.nsBars().restoreState(t), this._updateSymbolInfo(i, !1), this._data.lastProjectionPrice = s, this._data.boxSize = r;
            const o = this.properties().childs();
            r || (6 === o.style.value() ? this._data.boxSize = o.pnfStyle.childs().inputs.childs().boxSize.value() : 4 === o.style.value() && (this._data.boxSize = o.renkoStyle.childs().inputs.childs().boxSize.value())), this._data.reversalAmount = n, n || 5 === o.style.value() && (this._data.reversalAmount = o.kagiStyle.childs().inputs.childs().reversalAmount.value()), this._loading = !1
        }
        async setGotoDateResult(e, t) {
            this._gotoDateResultCleared = !1;
            const s = await i.e(4079).then(i.bind(i, 1539));
            this._gotoDateResultCleared || (this._gotoDateView = new s.GotoDateView(this, e, t), this._gotoDateView.doNotShowLastAvailableBar(this._doNotShowLastAvailableBar), this._model.updateSource(this))
        }
        clearGotoDateResult() {
            this._gotoDateView = null, this._gotoDateResultCleared = !0
        }
        doNotShowLastAvailableBar(e) {
            var t;
            this._doNotShowLastAvailableBar = e, null === (t = this._gotoDateView) || void 0 === t || t.doNotShowLastAvailableBar(e)
        }
        dataUpdated() {
            return this.dataEvents().dataUpdated()
        }
        getSupportedResolution(e, t = !0) {
            if (null === this._symbolInfo || !(0, Je.symbolSameAsCurrent)(this.symbol(), this._symbolInfo)) return e;
            if (te.Interval.isRange(e) && (0, m.isCloseBasedSymbol)(this._symbolInfo)) {
                const t = this.interval();
                if (!te.Interval.isRange(t)) return t;
                e = "1D"
            }
            const i = this._symbolInfo.data_frequency;
            if (void 0 !== i) {
                let s = (0, ft.getApplicableIntervalForFrequency)(i, e);
                if (s !== e) {
                    this._model.defaultResolutions();
                    return t && this.requestingResolutionLessThanFrequency.fire(i, s), s
                }
            }
            if (te.Interval.isIntraday(e) && !this._symbolInfo.has_intraday) return t && this.requestingIntradayWhenNotSupported.fire(), "D";
            if (this._symbolInfo.hasOwnProperty("supported_resolutions")) {
                const t = te.Interval.normalize(e),
                    i = this._symbolInfo.supported_resolutions;
                if (null !== t && -1 === i.indexOf(t)) return i[0]
            }
            return e
        }
        startedAndCompleted() {
            return new Promise((e => {
                this.isStarted() && e(), this.dataEvents().completed().subscribe(this, e, !0)
            }))
        }
        _barsState(e) {
            const t = e.state();
            return t.data.forEach((e => e.value.splice(7, 1))), t
        }
        _updateBarFunction() {
            this._barFunction = (0, Rt.barFunctionByStyle)(this.style(), this.priceSource())
        }
        _setProperties(e) {
            e.hasChild("timeframe") || e.merge({
                timeframe: ""
            }), e.hasChild("shortName") || e.merge({
                shortName: ""
            }), e.hasChild("currencyId") || e.addChild("currencyId", new(_())(null)), e.hasChild("unitId") || e.addChild("unitId", new(_())(null)), this._properties = e;
            const t = e.childs();
            t.currencyId.subscribe(this, this._onCurrencyChanged), t.unitId.subscribe(this, this._onUnitChanged), t.timeframe.subscribe(this, this.changeTimeFrame), e.subscribe(this, this._onPropertiesChanged)
        }
        _updateSessionIdProxyProperty(e) {
            const t = this._properties.childs().sessionId.value();
            let i = t;
            if (e) {
                const e = this.symbolInfo();
                null !== e && (i = e.subsession_id || t)
            }
            this._ignoreSessionIdProxyPropertyChanges = !0, this._sessionIdProxyProperty.setValue(i), this._ignoreSessionIdProxyPropertyChanges = !1
        }
        _onSessionIdProxyPropertyChanged() {
            this._ignoreSessionIdProxyPropertyChanges || this._properties.childs().sessionId.setValue(this._sessionIdProxyProperty.value()), this._updateLastPriceAnimationActive()
        }
        _onSymbolResolved(e) {
            this._seriesErrorMessage = null, this._updateSymbolInfo(e, !1),
                this._model.updateSource(this), this._model.onWidget() || ((0, n.trackEvent)("Symbol", e.listed_exchange, e.name), (0, n.trackEvent)("Symbol Type", e.type, e.listed_exchange));
            const t = e.minmov / e.pricescale,
                i = this.properties().childs();
            4 === i.style.value() && i.renkoStyle.childs().inputs.childs().boxSize.value() < t ? i.renkoStyle.childs().inputs.merge({
                boxSize: t
            }) : 6 === i.style.value() && i.pnfStyle.childs().inputs.childs().boxSize.value() < t ? i.pnfStyle.childs().inputs.merge({
                boxSize: t
            }) : 5 === i.style.value() && i.kagiStyle.childs().inputs.childs().reversalAmount.value() < t && i.kagiStyle.childs().inputs.merge({
                reversalAmount: t
            });
            const s = this.interval(),
                r = this.getSupportedResolution(s);
            s !== r && this.setSymbolParams({
                interval: r
            }), this._checkChartStyle(), this._formattingDeps = {
                format: e.format,
                pricescale: e.pricescale,
                minmov: e.minmov,
                fractional: e.fractional,
                minmove2: e.minmove2,
                variable_tick_size: e.variable_tick_size
            }
        }
        _onSymbolError(e) {
            this._setStatus(4), this._loading = !1, this._properties.childs().shortName.setValue(this._properties.childs().symbol.value()), this._model.clearAllStudies(), this.updateAllViews((0, Pe.sourceChangeEvent)(this.id())), this._model.updateSource(this), e !== ct.permissionDenied && this._model.resetTimeScale(), this._symbolResolvingActive.setValue(!1)
        }
        _sendTelemetryCounter(e, t) {}
        _getTelemetryAdditionalData(e, t) {
            return {}
        }
        _onSeriesError(e) {
            this._loading = !1;
            let t = e.error;
            const i = e.ctx;
            if (i) {
                const e = {};
                Object.keys(i).forEach((t => {
                    e[t] = i[t].toString()
                })), t = t.format(e)
            }
            $t && Kt.logNormal("Error reason: " + t), this._seriesErrorMessage = t;
            const s = "unknown_symbol" !== t ? 12 : qt && this._symbolInfo ? 10 : 4;
            this._setStatus(s), this._seriesLoaded = !0, this._enablePriceRangeReady()
        }
        _onSeriesLoading(e) {
            this._loading = !0, this._setStatus(2)
        }
        _onDataUpdated(e, t) {
            t ? this._requestMoreDataAvailable = !0 : this._lastPriceAnimationActive && this._seriesLoaded && this._lineStyleLastPriceCirclePaneView.update((0, Pe.sourceChangeEvent)(this.id())), this._lastBarCloseTime = e && e.closeTime || null, this._boxSizeValue.setValue(this.data().boxSize), this._statusView.update(), this.clearAveragePriceCache(), this.clearHighLowPriceCache();
            const i = this.model(),
                r = (0, s.ensureNotNull)(i.paneForSource(this));
            i.recalculatePane(r, (0, Pe.sourceChangeEvent)({
                sourceId: this.id(),
                realtime: !t
            })), i.updateSource(this)
        }
        _setStatus(e) {
            this._status = e, this._statusView.update(), this.model().updateSource(this), this._onStatusChanged.fire()
        }
        _onBarReceived(e) {
            this.model().recalcVisibleRangeStudies(!0)
        }
        _recreateFormatter() {
            var e, t, i;
            let s = null;
            s = null !== (t = null === (e = null === Ft.customFormatters || void 0 === Ft.customFormatters ? void 0 : Ft.customFormatters.priceFormatterFactory) || void 0 === e ? void 0 : e.call(Ft.customFormatters, this.symbolInfo(), this.properties().childs().minTick.value())) && void 0 !== t ? t : null, null !== s ? (this._formatter = s, this._ignoreMinMoveFormatter = s) : (this._formatter = (0, m.createSeriesFormatter)(null !== (i = this.symbolInfo()) && void 0 !== i ? i : this._formattingDeps, this.properties().childs().minTick.value()), this._ignoreMinMoveFormatter = (0, m.createSeriesFormatter)(this.symbolInfo(), this.properties().childs().minTick.value(), !0)),
                this.priceScale() && this.priceScale().updateFormatter(), this._formatterChanged.fire()
        }
        _recreatePriceStep() {
            const {
                minMove: e,
                priceScale: t
            } = (0, m.getSeriesPriceFormattingState)(this.symbolInfo()), i = e / t;
            this._ignoreMinMovePriceStep = 1 / t, this._priceStep !== i && (this._priceStep = i, this._priceStepChanged.fire())
        }
        _recreatePriceFormattingDependencies() {
            this._recreateFormatter(), this._recreatePriceStep()
        }
        _onQuotesUpdate(e, t) {
            void 0 !== e.values.current_session && e.values.current_session !== this._currentSession && (this._currentSession = e.values.current_session, this._updateLastPriceAnimationActive())
        }
        _updateIsPrePostMarketPricesForbiddenProperty() {
            const e = (0, m.symbolHasPreOrPostMarket)(this._symbolInfo) && (this.isDWM() || (0, m.isRegularSessionId)(this.sessionIdProxyProperty().value()));
            this._isPrePostMarketPricesAvailableProperty.setValue(e)
        }
        _updateSettlementAsCloseForbiddenProperty() {}
        _updateBackAdjustmentForbiddenProperty() {}
        _removeReplaySubscriber() {
            throw new Error("Not implemented")
        }
        _getSymbolForApi() {
            return (0, m.symbolForApi)(this.symbolInfo() || this._prevSymbolInfo, this.symbol())
        }
        _getSymbolObject() {
            const e = this._getExtendedSymbolObject();
            if (v.SYMBOL_STRING_DATA.hasOwnProperty(this.properties().childs().style.value())) {
                return {
                    symbol: e,
                    type: this.styleStudyInfo(this.getStyleShortName() + "Style").studyId + "!",
                    inputs: this.getInputsProperties().state()
                }
            }
            return e
        }
        _getExtendedSymbolObject() {
            const e = {
                    symbol: this._getSymbolForApi()
                },
                t = this.properties().childs();
            null !== this.currency() && (e["currency-id"] = this.currency());
            const i = this.unit();
            return this._model.unitConversionEnabled() && null !== i && (e["unit-id"] = i), !this.isDWM() && Zt && (e.session = t.sessionId.value()), e
        }
        _checkChartStyle() {
            const e = this.style();
            (0, m.isCloseBasedSymbol)(this.symbolInfo()) ? (0, m.isSingleValueBasedStyle)(e) || (this.requestingStyleIsNotSupported.fire(), this._styleToRecover = {
                correctedStyle: this.style(),
                originalStyle: e
            }) : null !== this._styleToRecover && (this.requestingStyleSupportRecovered.fire(this._styleToRecover.originalStyle), this._styleToRecover = null)
        }
        _updateSymbolInfo(e, t) {
            if (this._prevSymbolInfo = t ? this._symbolInfo : null, this._symbolInfo = e, e) {
                const t = this._properties.childs();
                t.shortName.setValue(e.name);
                const i = (0, m.extractSymbolNameFromSymbolInfo)(e, this.symbol());
                i && t.symbol.setValue(i);
                const s = (0, m.symbolCurrency)(e),
                    r = (0, m.symbolUnit)(e, this._model.unitConversionEnabled());
                "alwaysOff" === (0, ee.currencyUnitVisibilityProperty)().value() || s === t.currencyId.value() && r === t.unitId.value() || this._model.fullUpdate(), t.currencyId.setValue(s), t.unitId.setValue(r), this._updateSessionIdProxyProperty(!0)
            }
            this._base = e ? e.pricescale / e.minmov : 100, this._pointValue = e && e.pointvalue || 1;
            const i = this._getSymbolForApi();
            this._quotesProvider.setQuotesSessionSymbol(i), this._marketStatusModel.setSymbolInfo(e), e && this._recreatePriceFormattingDependencies(), this._statusView.update(), this.priceScale().updateFormatter(), this._symbolResolvingActive.setValue(!e), Zt && this._updateIsPrePostMarketPricesForbiddenProperty()
        }
        _createHighLowAvgViews() {
            const e = this.properties().childs().highLowAvgPrice,
                t = this._getHighLowPrice.bind(this),
                i = function(e, t, i, s) {
                    const r = i.childs(),
                        n = He(e, t, {
                            label: We,
                            labelVisible: r.highLowPriceLabelsVisible,
                            lineVisible: r.highLowPriceLinesVisible,
                            lineColor: r.highLowPriceLinesColor,
                            lineWidth: r.highLowPriceLinesWidth
                        }, (() => s(0))),
                        o = He(e, t, {
                            label: ze,
                            labelVisible: r.highLowPriceLabelsVisible,
                            lineVisible: r.highLowPriceLinesVisible,
                            lineColor: r.highLowPriceLinesColor,
                            lineWidth: r.highLowPriceLinesWidth
                        }, (() => s(1)));
                    return {
                        paneViews: [n.paneView, o.paneView],
                        panePriceAxisViews: [n.panePriceAxisView, o.panePriceAxisView],
                        priceAxisViews: [n.priceAxisView, o.priceAxisView],
                        priceLineAxisViews: [n.priceLineAxisView, o.priceLineAxisView]
                    }
                }(this._model, this, e, t);
            this._highLowAvgPaneViews.push(...i.paneViews), this._labelPaneViews.push(...i.panePriceAxisViews), this._priceAxisViews.push(...i.priceAxisViews), this._priceLineAxisViews.push(...i.priceLineAxisViews)
        }
        _createAverageViews() {
            const e = this.properties().childs().highLowAvgPrice,
                t = this._getAveragePrice.bind(this),
                i = Ke(this._model, this, e, t);
            this._averagePaneViews.push(...i.paneViews), this._labelPaneViews.push(...i.panePriceAxisViews), this._priceAxisViews.push(...i.priceAxisViews), this._priceLineAxisViews.push(...i.priceLineAxisViews)
        }
        _getHighLowPrice(e) {
            if (!this._highLowPriceCache.has(e)) {
                const e = this._model.timeScale().visibleBarsStrictRange();
                if (null === e) return null;
                const t = function(e, t, i) {
                    return e.minMaxOnRangeCached(t, i, [{
                        name: "low",
                        offset: 0
                    }, {
                        name: "high",
                        offset: 0
                    }])
                }(this._model.mainSeries().bars(), e.firstBar(), e.lastBar());
                if (null === t) return null;
                this._highLowPriceCache.set(1, t.min), this._highLowPriceCache.set(0, t.max)
            }
            return this._highLowPriceCache.get(e)
        }
        _getAveragePrice(e) {
            if (!this._averagePriceCache.has(e)) {
                const e = this._model.timeScale().visibleBarsStrictRange();
                if (null === e) return null;
                const t = function(e, t, i) {
                    0;
                    const s = (0, c.barFunction)("close");
                    let r = 0,
                        n = 0;
                    for (let o = t; o <= i; o++) {
                        const t = e.valueAt(o);
                        null !== t && (r += s(t), n++)
                    }
                    return n ? r / n : null
                }(this._model.mainSeries().bars(), e.firstBar(), e.lastBar());
                if (null === t) return null;
                this._averagePriceCache.set(0, t)
            }
            return this._averagePriceCache.get(e)
        }
        _onSeriesCompleted(e) {
            var t;
            this._loading = !1, this._seriesErrorMessage = null;
            let i = e.updateMode;
            switch ("pulsed" === i && (i = "delayed"), i) {
                case "streaming":
                    this._setStatus(3);
                    break;
                case "endofday":
                    this._setStatus(6);
                    break;
                case "delayed":
                    this._setStatus(8);
                    break;
                case "replay":
                    this._setStatus(11)
            }
            i.match(/delayed_streaming/) && this._setStatus(9), this._lastCompleteFlags = null !== (t = e.flags) && void 0 !== t ? t : null;
            const r = (0, s.ensureNotNull)(this._model.paneForSource(this));
            r.recalculatePriceScale(this.priceScale(), (0, Pe.sourceChangeEvent)(this.id()));
            const n = at.InvalidationMask.full();
            null !== this._model.appliedTimeFrame().value() && n.lockVisibleTimeRangeOnResize(), this._model.invalidate(n), this.model().recalcVisibleRangeStudies(!0), this.model().recalcStudyBasedLineTools(), !this.priceScale().isLockScale() || this.model().timeScale().isEmpty() || this._seriesLoaded || (this.model().timeScale().correctOffset(),
                this.model().timeScale().correctBarSpacing(), this.model().resetPriceScale(r, this.priceScale())), this._seriesLoaded = !0, this._enablePriceRangeReady()
        }
        _notifyIntervalChanged(e) {
            var t, i;
            const s = {
                timeframe: null !== (t = this._pendingTimeRange) && void 0 !== t ? t : void 0
            };
            this._intervalChanged.fire(e, s), this._pendingTimeRange = null !== (i = s.timeframe) && void 0 !== i ? i : null
        }
        _onCurrencyChanged() {
            this._currencyChanged.fire()
        }
        _onUnitChanged() {
            this._unitChanged.fire()
        }
        _applySymbolParamsChanges(e) {
            this._lastCompleteFlags = null, this.clearGotoDateResult();
            const t = this.interval();
            this.currency(), this.unit();
            te.Interval.isRange(t) && this._properties.childs().rangeStyle.childs().inputs.childs().range.setValue(te.Interval.parse(t).multiplier());
            const {
                symbolChanged: i,
                intervalChanged: s,
                currencyChanged: r,
                unitChanged: n,
                force: o
            } = e, a = Zt && s && te.Interval.parse(t).isDWM() != te.Interval.parse(t).isDWM();
            if (this._syncModel = null, this._prevRequestedInterval = t, 5 !== this._status && (!this._seriesSource.isStarted() || i || r || n || a) && this._updateSymbolInfo(null, !i && (r || n)), 5 === this._status) return void this._model.realignLineTools();
            this._loading = !0, this._setStatus(1), Zt && this._updateIsPrePostMarketPricesForbiddenProperty(), this._symbolIntervalChanged.fire(), s && this._notifyIntervalChanged(t), this._onRestarted.fire(), this._seriesLoaded = !1, this._lineStyleLastPriceCirclePaneView.stopAnimation();
            let l = null;
            this._pendingTimeRange && (l = this._pendingTimeRange, this._pendingTimeRange = null), this._onTimeFrameApplied.fire(l), this._onBeforeModifySeries(this.getSymbolString(), t), this._data = null, this._seriesSource.modifySeries(this._getResolvingSymbolObject(), (0, ft.getServerInterval)(t), l, o), this._seriesSource.isStarted() || (this._predictBars = 0, this._seriesSource.start()), (i || r || n) && this.disablePriceRangeReady(), this.updateAllViews((0, Pe.sourceChangeEvent)(this.id())), this._model.lightUpdate()
        }
        _isIntervalSupported(e) {
            return !0
        }
        _onBeforeModifySeries(e, t) {
            0
        }
        _getResolvingSymbolObject() {
            return this._getSymbolObject()
        }
        _onSessionIdPropertyChanged() {
            this._sessionIdChanged.fire(), this.isDWM() || (this.restart(), this._updateLastPriceAnimationActive())
        }
        _subscribeRestartToSessionIdChange() {
            this.properties().childs().sessionId.subscribe(this, this._onSessionIdPropertyChangedBound)
        }
        _unsubscribeRestartToSessionIdChange() {
            this.properties().childs().sessionId.unsubscribe(this, this._onSessionIdPropertyChangedBound)
        }
        _updateLastPriceAnimationActive() {
            if (!this._options.lastPriceAnimationEnabled) return;
            const e = this._lastPriceAnimationActive,
                t = this.properties().childs(),
                i = t.style.value(),
                s = 3 === i || 10 === i || 2 === i || 14 === i || 15 === i;
            if (!this._model.isSnapshot() && t.visible.value() && s) {
                const e = this.currentSession(),
                    t = !(0, m.isRegularSessionId)(this.sessionIdProxyProperty().value()) && !this.isDWM();
                this._lastPriceAnimationActive = "market" === e || t && ("pre_market" === e || "post_market" === e)
            } else this._lastPriceAnimationActive = !1;
            this._lastPriceAnimationActive && e !== this._lastPriceAnimationActive && this.model().invalidate(at.InvalidationMask.cursor())
        }
        _onPropertiesChanged(e) {
            const t = this._properties.childs();
            e !== t.symbol && e !== t.interval && e !== t.timeframe && (this._tagsChanged.fire(), this.createPaneView(), this.updateAllViews((0, Pe.sourceChangeEvent)(this._id)), this.model().updateSource(this), (0, o.emit)("series_properties_changed", this._id))
        }
        _recalcSymbolTextSourceProxyProperty() {
            this._textSourceIsAlwaysTickerRestrictionEnabled ? this._symbolTextSourceProxyProperty.setValue("ticker") : this._symbolTextSourceProxyProperty.setValue(this._properties.childs().statusViewStyle.childs().symbolTextSource.value())
        }
        _clearStylePlot(e, t) {
            if (0 === e.size()) return;
            if (void 0 === t && e !== this.nsBars()) return void(this._precomputedBarStyles = new WeakMap);
            const i = null != t ? t : (0, s.ensureNotNull)(e.firstIndex()),
                r = (0, s.ensureNotNull)(e.lastIndex()) + 1;
            e.range(i, r).each(((e, t) => (this._precomputedBarStyles.delete(t), !1)))
        }
        _restartSeriesAndRequestVisibleRange() {
            {
                const e = this._model.timeScale().logicalRange(),
                    t = null === e ? this.bars().size() : Math.ceil(e.length());
                this._seriesSource.stop(), this._seriesSource.setInitialRequestOptions({
                    count: t,
                    startDate: null,
                    endDate: null
                }), this._seriesSource.start()
            }
        }
    }
}