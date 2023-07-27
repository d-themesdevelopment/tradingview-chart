(e, t, i) => {
    "use strict";
    i.d(t, {
        ChartModelBase: () => ls
    });
    var s = i(12481),
        r = i(27788),
        n = i(50151),
        o = i(86441),
        a = i(24377),
        l = i(48891),
        c = i(44352),
        h = i(45345),
        d = i(5286),
        u = i(51768),
        p = i(51608),
        _ = i(76422),
        m = i(11417),
        g = i(67980),
        f = i(3587),
        v = i(78071),
        S = i(18341);

    function y(e) {
        return (0, S.isLineTool)(e) && e.boundToSymbol() || !1
    }
    class b {
        constructor() {
            this._items = [], this._set = new Set, this._dataSourcesCache = null, this._customSourcesCache = null, this._lineSourcesCache = null
        }
        isEmpty() {
            return 0 === this._items.length
        }
        add(e) {
            if (this._items.length > 0 && !y(this._items[0]) && this.clear(), y(e)) {
                const t = (0, v.lowerbound)(this._items, e, ((e, t) => e.zorder() < t.zorder()));
                this._items.splice(t, 0, e)
            } else this.clear(), this._items = [e];
            this._set.add(e), this._invalidateCache()
        }
        canBeAddedToSelection(e) {
            return 0 === this._items.length || y(this._items[0]) && y(e)
        }
        isSelected(e) {
            return this._set.has(e)
        }
        allSources() {
            return this._items.slice(0)
        }
        dataSources() {
            return null === this._dataSourcesCache && (this._dataSourcesCache = this._items.filter(f.isDataSource)), this._dataSourcesCache
        }
        lineDataSources() {
            return null === this._lineSourcesCache && (this._lineSourcesCache = this._items.filter(S.isLineTool)), this._lineSourcesCache
        }
        customSources() {
            return null === this._customSourcesCache && (this._customSourcesCache = this._items.filter((e => !(0, f.isDataSource)(e)))), this._customSourcesCache
        }
        checkLineToolSelection() {
            this._items.forEach((e => (0, S.isLineTool)(e) && e.calcIsActualSymbol())), this._items = this._items.filter((e => !(0, S.isLineTool)(e) || e.isActualSymbol())), this._invalidateCache()
        }
        remove(e) {
            this._items = this._items.filter((t => t !== e)), this._set.delete(e), this._invalidateCache()
        }
        clear() {
            this._items = [], this._set.clear(), this._invalidateCache()
        }
        _invalidateCache() {
            this._customSourcesCache = null, this._dataSourcesCache = null, this._lineSourcesCache = null
        }
    }
    var w = i(6674),
        P = i(52329),
        C = i(58148),
        x = i(36274),
        T = i(46100),
        I = i(59452),
        M = i.n(I),
        A = i(29764),
        L = i(46501);
    class k {
        constructor(e) {
            this._rendererOptions = {
                borderSize: 1,
                additionalPaddingInner: 0,
                fontSize: NaN,
                font: "",
                color: "",
                paneBackgroundColor: "",
                paddingBottom: 0,
                paddingInner: 0,
                paddingOuter: 0,
                paddingTop: 0,
                lineSpacing: 0
            }, this._chartModel = e
        }
        options() {
            const e = this._rendererOptions,
                t = this._chartModel.properties().childs(),
                i = t.scalesProperties.childs().fontSize.value();
            return e.fontSize !== i && (e.fontSize = i, e.font = (0, A.makeFont)(i, L.CHART_FONT_FAMILY, ""), e.paddingTop = i / 12 * 2.5, e.paddingBottom = i / 12 * 2.5, e.paddingInner = i / 12 * 4, e.additionalPaddingInner = i / 12 * 4, e.paddingOuter = i / 12 * 4, e.lineSpacing = i / 12 * 2), e.color = t.scalesProperties.childs().textColor.value(), e.paneBackgroundColor = t.paneProperties.childs().background.value(), this._rendererOptions
        }
    }
    var E = i(94739),
        D = i(12442),
        V = i(61146),
        B = i(85804),
        R = i(15742),
        N = i(14483),
        O = i(42960),
        F = i(16776),
        W = i(28558);
    const z = new V.PriceFormatter,
        H = "sessions";
    class U extends R.CustomSourceBase {
        constructor(e, t, i) {
            super(e, t),
                this._studySource = null, this._paneViews = [], this._metaInfo = null, this._destroyed = !1, this._isStarted = !1, this._loadedGraphics = null, this._doubleClickHandler = i;
            const s = t.mainSeries();
            this._properties = new T.DefaultProperty("sessions"), (0, B.applyDefaultsOverrides)(this._properties.childs().graphics, void 0, !1, H), this._removeDuplicateProperties(), this._properties.subscribe(this, this._onPropertiesChanged), t.studyMetaInfoRepository().findById({
                type: "java",
                studyId: "Sessions@tv-basicstudies"
            }).then((i => {
                this._destroyed || null === this._loadedGraphics && (this._setMetaInfo(i), null !== this._metaInfo && (this._studySource = new E.StudyDataSource(t.chartApi(), s.seriesSource(), "sessions_", this._metaInfo), this._createPaneViews(), this._studySource.dataCleared().subscribe(this, this.updateAllViews.bind(this, (0, W.sourceChangeEvent)(e))), this._studySource.dataUpdated().subscribe(this, this.updateAllViews.bind(this, (0, W.sourceChangeEvent)(e))), this._studySource.setInputs({}), this._processHibernate()))
            })), t.timeScale().onReset().subscribe(this, this._clearData), t.timeScale().logicalRangeChanged().subscribe(this, this.updateAllViews.bind(this, (0, W.viewportChangeEvent)())), t.mainSeries().sessionIdProxyProperty().subscribe(this, this._updateVisibleOfPreAndPostMarketBackground), t.mainSeries().properties().childs().interval.subscribe(this, this._processHibernate), this._updateVisibleOfPreAndPostMarketBackground(t.mainSeries().properties().childs().sessionId)
        }
        applyOverrides(e) {
            (0, B.applyPropertiesOverrides)(this._properties.childs().graphics, void 0, !1, e, H), this._model.updateSource(this)
        }
        start() {
            this._isStarted = !0, this._processHibernate()
        }
        restart() {
            this._clearData(), N.enabled("stop_study_on_restart") && this.stop(), this.start()
        }
        isStarted() {
            return this._isStarted
        }
        stop() {
            this._isStarted = !1, null !== this._studySource && this._studySource.stop()
        }
        isHoveredEnabled() {
            return !1
        }
        paneViews(e) {
            return this._paneViews
        }
        updateAllViews(e) {
            this._paneViews.forEach((t => t.update(e)))
        }
        updateViewsForPane(e, t) {
            this.updateAllViews(t)
        }
        destroy() {
            this._destroyed = !0, null !== this._studySource && (this._studySource.dataCleared().unsubscribeAll(this), this._studySource.dataUpdated().unsubscribeAll(this), this._studySource.destroy(), this._studySource = null), this._model.timeScale().logicalRangeChanged().unsubscribeAll(this), this._model.timeScale().onReset().unsubscribeAll(this), this._model.mainSeries().sessionIdProxyProperty().unsubscribeAll(this), this._model.mainSeries().properties().childs().interval.unsubscribeAll(this), this._properties.unsubscribeAll(this)
        }
        series() {
            return this._model.mainSeries()
        }
        priceScale() {
            return this.series().priceScale()
        }
        graphics() {
            return this._loadedGraphics || (0, n.ensureNotNull)(this._studySource).graphics()
        }
        properties() {
            return this._properties
        }
        graphicsInfo() {
            return (0, n.ensureNotNull)(this._metaInfo).graphics
        }
        firstValue(e) {
            return this._model.mainSeries().firstValue()
        }
        formatter() {
            return z
        }
        state(e) {
            const t = {
                properties: this._properties.state()
            };
            return e && null !== this._metaInfo && (t.data = {
                graphics: (0, D.saveStudyGraphics)(this.graphics(), this._model.timeScale().visibleBarsStrictRange()),
                metaInfo: this._metaInfo
            }), t
        }
        restoreState(e, t) {
            const i = e.properties;
            this._migrateOutOfSessionProperty(i), this._properties.mergeAndFire(i), this._removeDuplicateProperties(), this._updateVisibleOfPreAndPostMarketBackground(this._model.mainSeries().properties().childs().sessionId), void 0 !== e.data && t && (this._loadStudyGraphics(e.data.graphics), this._setMetaInfo(e.data.metaInfo), this._createPaneViews())
        }
        restoreOldState(e, t) {
            const i = {
                properties: {
                    graphics: e.state.graphics
                }
            };
            void 0 !== e.data && void 0 !== e.metaInfo && t && (i.data = {
                metaInfo: e.metaInfo,
                graphics: e.data.graphics
            }), this.restoreState(i, t)
        }
        applyPreferences(e) {
            this._properties.mergePreferences(e)
        }
        metaInfo() {
            return (0, n.ensureNotNull)(this._metaInfo)
        }
        _loadStudyGraphics(e) {
            const t = e.backgrounds;
            if (void 0 !== t) {
                const e = t.findIndex((e => "inSession" === e.styleId)); - 1 !== e && t.splice(e, 1)
            }
            this._loadedGraphics = (0, D.loadStudyGraphics)(e)
        }
        _setMetaInfo(e) {
            const t = e.graphics.backgrounds;
            void 0 !== t && void 0 !== t.inSession && delete t.inSession, this._metaInfo = e
        }
        _updateVisibleOfPreAndPostMarketBackground(e) {
            const t = !(0, O.isRegularSessionId)(e.value());
            this._outOfSessionVisibilityProperty().setValue(t), this._preMarketVisibilityProperty().setValue(t), this._postMarketVisibilityProperty().setValue(t)
        }
        _clearData() {
            null !== this._studySource && this._studySource.clearData()
        }
        _createPaneViews() {
            const e = {
                doubleClickHandler: this._doubleClickHandler
            };
            (0, D.createGraphicsPaneViews)(this, this._model, e).then((e => {
                this._paneViews = e, this._model.lightUpdate()
            }))
        }
        _onPropertiesChanged() {
            this._processHibernate(), this.updateAllViews((0, W.sourceChangeEvent)(this.id()))
        }
        _processHibernate() {
            if (null !== this._studySource) {
                const e = this._canBeHibernated(),
                    t = this._isHibernated(),
                    i = this._studySource.isStarted();
                !t && e && i ? this._studySource.stop() : !t || e || i || this._studySource.start()
            }
        }
        _canBeHibernated() {
            const e = this._model.mainSeries(),
                t = this._preMarketVisibilityProperty().value() && this._postMarketVisibilityProperty().value() && this._outOfSessionVisibilityProperty().value();
            return e.isDWM() || !t && !this._vertLinesVisibleProperty().value()
        }
        _isHibernated() {
            return this._isStarted && (null === this._studySource || !this._studySource.isStarted())
        }
        _outOfSessionVisibilityProperty() {
            return this._properties.childs().graphics.childs().backgrounds.childs().outOfSession.childs().visible
        }
        _preMarketVisibilityProperty() {
            return this._properties.childs().graphics.childs().backgrounds.childs().preMarket.childs().visible
        }
        _postMarketVisibilityProperty() {
            return this._properties.childs().graphics.childs().backgrounds.childs().postMarket.childs().visible
        }
        _vertLinesVisibleProperty() {
            return this._properties.childs().graphics.childs().vertlines.childs().sessBreaks.childs().visible
        }
        _removeDuplicateProperties() {
            this._properties.hasChild("properties") && (this._properties.removeProperty("properties"), (0, T.saveDefaultProperties)(!0), this._properties.childChanged(null), (0, T.saveDefaultProperties)(!1))
        }
        _migrateOutOfSessionProperty(e) {
            const t = e.graphics.backgrounds;
            if (void 0 !== t) {
                const i = t.outOfSession;
                i.color === (0,
                    n.ensureDefined)(F.sessionsPreferencesDefault.graphics.backgrounds).outOfSession.color || "postMarket" in t || (e.graphics.backgrounds = {
                    ...t,
                    postMarket: {
                        color: i.color,
                        transparency: i.transparency,
                        visible: i.visible
                    },
                    preMarket: {
                        color: i.color,
                        transparency: i.transparency,
                        visible: i.visible
                    }
                })
            }
        }
    }
    var j = i(28853),
        G = i(57898),
        q = i.n(G),
        $ = i(58275),
        Y = i.n($),
        K = i(91280),
        Z = i(42226),
        X = i(59224),
        J = i(36174),
        Q = i(49535),
        ee = i(36298),
        te = i(42856),
        ie = i(1722),
        se = i(29921),
        re = i(80842),
        ne = i(98517);
    const oe = new Map([
            ["price", e => (0, re.isPriceDataSource)(e)],
            ["trading", e => (0, S.isTrading)(e)],
            ["drawing", e => (0, S.isLineTool)(e) && !(0, S.isTrading)(e) && !e.isPhantom()],
            ["drawingsForAllSymbols", e => (0, S.isLineTool)(e) && !(0, S.isTrading)(e) && !e.isPhantom()],
            ["phantom", e => (0, S.isLineTool)(e) && e.isPhantom()],
            ["restRowSources", e => !(0, S.isLineTool)(e) && !(0, S.isTrading)(e)],
            ["legendViewSources", e => (0, re.isPriceDataSource)(e) || (0, S.isStudyLineTool)(e)],
            ["leftPriceScale", (e, t) => "left" === le(e, t)],
            ["rightPriceScale", (e, t) => "right" === le(e, t)],
            ["overlayPriceScale", (e, t) => "overlay" === le(e, t)]
        ]),
        ae = new Map([
            ["price", "visibleSorted"],
            ["trading", "visibleSorted"],
            ["drawing", "visibleSorted"],
            ["drawingsForAllSymbols", "allSorted"],
            ["phantom", "visibleSorted"],
            ["restRowSources", "visibleSorted"],
            ["legendViewSources", "visibleSorted"],
            ["leftPriceScale", "visibleSorted"],
            ["rightPriceScale", "visibleSorted"],
            ["overlayPriceScale", "visibleSorted"]
        ]);

    function le(e, t) {
        const i = e.priceScale();
        return null === i ? "overlay" : t.priceScalePosition(i)
    }
    class ce {
        constructor(e) {
            this._groupedSources = new Map, this._sources = null, this._pane = e
        }
        clear() {
            this._groupedSources.clear(), this._sources = null
        }
        destroy() {
            this.clear()
        }
        all() {
            return this._groupedSources.has("visibleSorted") || this._sortSources(), (0, n.ensureDefined)(this._groupedSources.get("visibleSorted"))
        }
        allIncludingHidden() {
            return this._groupedSources.has("allSorted") || this._sortSources(), (0, n.ensureDefined)(this._groupedSources.get("allSorted"))
        }
        allExceptSpecialSources() {
            if (!this._groupedSources.has("exceptSpecial")) {
                const e = this.allIncludingHidden().filter((e => !e.isSpeciallyZOrderedSource()));
                this._groupedSources.set("exceptSpecial", e)
            }
            return (0, n.ensureDefined)(this._groupedSources.get("exceptSpecial"))
        }
        tradingSources() {
            return this._getSourcesByGroupType("trading")
        }
        priceSources() {
            return this._getSourcesByGroupType("price")
        }
        lineSources() {
            return this._getSourcesByGroupType("drawing")
        }
        lineSourcesForAllSymbols() {
            return this._getSourcesByGroupType("drawingsForAllSymbols")
        }
        phantomSources() {
            return this._getSourcesByGroupType("phantom")
        }
        allExceptLineAndTradingSources() {
            return this._getSourcesByGroupType("restRowSources")
        }
        hitTestSources() {
            if (!this._groupedSources.has("hitTest")) {
                const e = this.allExceptLineAndTradingSources().concat(this.lineSources());
                this._groupedSources.set("hitTest", e)
            }
            return (0, n.ensureDefined)(this._groupedSources.get("hitTest"))
        }
        generalSources() {
            if (!this._groupedSources.has("general")) {
                const e = this.allExceptLineAndTradingSources().concat(this.lineSources());
                this._groupedSources.set("general", (0, ne.sortSources)(e))
            }
            return (0,
                n.ensureDefined)(this._groupedSources.get("general"))
        }
        leftPriceScalesSources() {
            return this._getSourcesByGroupType("leftPriceScale")
        }
        rightPriceScalesSources() {
            return this._getSourcesByGroupType("rightPriceScale")
        }
        overlayPriceScaleSources() {
            return this._getSourcesByGroupType("overlayPriceScale")
        }
        legendViewSources() {
            return this._getSourcesByGroupType("legendViewSources")
        }
        _getSourcesByGroupType(e) {
            const t = (0, n.ensureDefined)(ae.get(e));
            return this._groupedSources.has(t) ? this._groupedSources.has(e) || this._groupSources(e) : (this._sortSources(), this._groupSources(e)), (0, n.ensureDefined)(this._groupedSources.get(e))
        }
        _sortSources() {
            null === this._sources && (this._sources = this._pane.dataSources());
            const e = (0, ne.sortSources)(this._sources),
                t = e.filter((e => !(0, S.isLineTool)(e) || e.isActualSymbol() && e.isActualCurrency() && e.isActualUnit()));
            this._groupedSources.set("allSorted", e), this._groupedSources.set("visibleSorted", t)
        }
        _groupSources(e) {
            const t = (0, n.ensureDefined)(ae.get(e)),
                i = oe.get(e);
            if (void 0 !== i) {
                const s = (0, n.ensureDefined)(this._groupedSources.get(t)).filter((e => i(e, this._pane)));
                this._groupedSources.set(e, s)
            }
        }
    }
    var he = i(15367),
        de = i(34256),
        ue = i(78211),
        pe = i(76544),
        _e = i(18611),
        me = i(26512),
        ge = i(37160);
    class fe {
        constructor(e, t) {
            if (this._base = e, this._integralDividers = t, (0, ge.isBaseDecimal)(this._base)) this._fractionalDividers = [2, 2.5, 2];
            else {
                this._fractionalDividers = [];
                for (let e = this._base; 1 !== e;) {
                    if (e % 2 == 0) this._fractionalDividers.push(2), e /= 2;
                    else {
                        if (e % 5 != 0) throw new Error("unexpected base");
                        this._fractionalDividers.push(2), this._fractionalDividers.push(2.5), e /= 5
                    }
                    if (this._fractionalDividers.length > 100) throw new Error("something wrong with base")
                }
            }
        }
        tickSpan(e, t, i) {
            const s = 0 === this._base ? 0 : 1 / this._base,
                r = Math.min(1e-14, (e - t) / 1e3);
            let n = Math.pow(10, Math.max(0, Math.ceil((0, ge.log10)(e - t)))),
                o = 0,
                a = this._integralDividers[0];
            for (;;) {
                const e = (0, ge.greaterOrEqual)(n, s, r) && n > s + r,
                    t = (0, ge.greaterOrEqual)(n, i * a, r),
                    l = (0, ge.greaterOrEqual)(n, 1, r);
                if (!(e && t && l)) break;
                n /= a, a = this._integralDividers[++o % this._integralDividers.length]
            }
            if (n <= s + r && (n = s), n = Math.max(1, n), this._fractionalDividers.length > 0 && (0, ge.equal)(n, 1, r))
                for (o = 0, a = this._fractionalDividers[0];
                    (0, ge.greaterOrEqual)(n, i * a, r) && n > s + r;) n /= a, a = this._fractionalDividers[++o % this._fractionalDividers.length];
            return n
        }
    }
    class ve {
        constructor(e, t, i, s) {
            this._marks = null, this._priceScale = e, this._base = t, this._coordinateToLogicalFunc = i, this._logicalToCoordinateFunc = s
        }
        base() {
            return this._base
        }
        setBase(e) {
            if (e < 0) throw new Error("base < 0");
            this._base = e
        }
        tickSpan(e, t, i = 0) {
            if (e < t) throw new Error("high < low");
            const s = this._priceScale.height(),
                r = (e - t) * this._tickMarkHeight() / s,
                n = new fe(this._base, [2, 2.5, 2]),
                o = new fe(this._base, [2, 2, 2.5]),
                a = new fe(this._base, [2.5, 2, 2]);
            let l = 0;
            const c = n.tickSpan(e, t, r);
            c > i && (l = c);
            const h = o.tickSpan(e, t, r);
            h > i && (l = Math.min(l, h));
            const d = a.tickSpan(e, t, r);
            return d > i && (l = Math.min(l, d)), l > 0 ? l : e - t
        }
        rebuildTickMarks() {
            this._marks = null
        }
        marks() {
            return null === this._marks && (this._marks = this._rebuildTickMarksImpl()), this._marks
        }
        _fontHeight() {
            return this._priceScale.fontSize()
        }
        _tickMarkHeight() {
            return Math.ceil(2.5 * this._fontHeight())
        }
        _rebuildTickMarksImpl() {
            const e = this._priceScale,
                t = [],
                i = e.mainSource();
            if (e.isEmpty() || null === i) return t;
            let s = i.firstValue();
            null === s && (s = 0);
            const r = e.height(),
                n = this._coordinateToLogicalFunc(r - 1, s),
                o = this._coordinateToLogicalFunc(0, s),
                a = Math.max(n, o),
                l = Math.min(n, o);
            if (a === l) return t;
            let c = this.tickSpan(a, l),
                h = a % c;
            h += h < 0 ? c : 0;
            const d = a >= l ? 1 : -1;
            let u = null;
            const p = e.formatter();
            let _ = NaN;
            for (let i = a - h; i > l; i -= c) {
                i === _ && (c = this.tickSpan(a, l, c)), _ = i;
                const r = this._logicalToCoordinateFunc(i, s);
                null !== u && Math.abs(r - u) < this._tickMarkHeight() || (t.push({
                    coord: r,
                    label: p.format(i)
                }), u = r, e.isLog() && (c = this.tickSpan(i * d, l)))
            }
            return t
        }
    }
    var Se = i(88348),
        ye = i(93572);
    const be = new ye.PercentageFormatter,
        we = new V.PriceFormatter(100, 1),
        Pe = {
            autoScale: !0,
            autoScaleDisabled: !1,
            lockScale: !1,
            percentage: !1,
            percentageDisabled: !1,
            log: !1,
            logDisabled: !1,
            alignLabels: !0,
            isInverted: !1,
            indexedTo100: !1
        };
    class Ce {
        constructor(e, t) {
            this._marksCache = null, this._onMarksChanged = new(q()), this.m_dataSources = [], this._sourcesForAutoscale = null, this._hasSeries = !1, this._studiesCount = 0, this._drawingCount = 0, this._seriesLikeSources = [], this._priceDataSources = [], this._mainSource = null, this._lastSourceRemoved = new(q()), this._scaleSeriesOnly = !1, this._invalidatedForRange = {
                isValid: !0,
                visibleBars: null
            }, this.m_priceRange = null, this._logFormula = (0, ue.logFormulaForPriceRange)(null), this.m_height = 0, this._margins = {
                top: 0,
                bottom: 0
            }, this._correctedMarginsCache = null, this._topPixelMargin = 0, this._bottomPixelMargin = 0, this._internalHeightCache = null, this._internalHeightChanged = new(q()), this._priceRangeSnapshot = null, this._scrollStartPoint = null, this._currencyCache = null, this._unitCache = null, this._measureUnitIdCache = null, this._recalculatePriceRangeOnce = !1, this._cachedOrderedSoruces = null, this._scaleStartPoint = null, this._twoPointsScaleStartPosition = null, this._maxPriceRange = null, this._minPriceRange = null, this._priceRangeChanged = new(q()), this._modeChanged = new(q()), this._sourcesToUpdateViews = null, this._markBuilder = new ve(this, 100, this._coordinateToLogical.bind(this), this._logicalToCoordinate.bind(this)), this._formatter = null, this._id = "", t = Object.assign({}, Pe, t), this._properties = new(M())(t), this._boundOnSourceIsActingAsSymbolSourceChanged = this._onSourceIsActingAsSymbolSourceChanged.bind(this), this._scalesProperties = e, this._properties.childs().isInverted.subscribe(this, this._onIsInvertedChanged), this._properties.subscribe(null, (() => {
                const e = this.mainSource();
                if (e && e.model()) {
                    const t = e.model().paneForSource(e);
                    t && e.model().updatePane(t)
                }
            })), this._scalesProperties.listeners().subscribe(this, (() => {
                this._marksCache = null
            })), this.setId((0, J.randomHash)())
        }
        id() {
            return this._id
        }
        setId(e) {
            this._id = e
        }
        isLog() {
            return this._properties.childs().log.value()
        }
        isPercentage() {
            return this._properties.childs().percentage.value()
        }
        isInverted() {
            return this._properties.childs().isInverted.value()
        }
        isIndexedTo100() {
            return this._properties.childs().indexedTo100.value()
        }
        isAutoScale() {
            return this._properties.childs().autoScale.value() && !this.isLockScale()
        }
        isLockScale() {
            return this._properties.childs().lockScale.value()
        }
        isRegular() {
            return !this.isPercentage() && !this.isLog() && !this.isIndexedTo100()
        }
        properties() {
            return this._properties
        }
        height() {
            return this.m_height
        }
        setHeight(e) {
            this.m_height !== e && (this.m_height = e, this._invalidateInternalHeightCache(), this._marksCache = null)
        }
        internalHeight() {
            if (this._internalHeightCache) return this._internalHeightCache;
            const e = this.height() - this.topPixelMargin() - this.bottomPixelMargin();
            return this._internalHeightCache = e, e
        }
        fontSize() {
            return this._scalesProperties.childs().fontSize.value()
        }
        priceRange() {
            return this._makeSureItIsValid(), this.m_priceRange
        }
        setPriceRange(e, t, i) {
            if (!(e instanceof de.PriceRange)) throw new TypeError("incorrect price range");
            const s = this.m_priceRange;
            if (!t && de.PriceRange.compare(s, e)) return;
            const r = null !== this._maxPriceRange && this._maxPriceRange.containsStrictly(e),
                n = null !== this._minPriceRange && e.containsStrictly(this._minPriceRange);
            this.isLockScale() && !t && (r || n) || (this._marksCache = null, this.m_priceRange = e, i || this._priceRangeChanged.fire(s, e))
        }
        setMinPriceRange(e) {
            this._minPriceRange = e
        }
        setMaxPriceRange(e) {
            this._maxPriceRange = e
        }
        recalculatePriceRangeOnce() {
            this._recalculatePriceRangeOnce = !0
        }
        priceRangeShouldBeRecalculatedOnce() {
            if (!this._recalculatePriceRangeOnce || this.isLockScale()) return !1;
            const e = this.mainSource();
            return null !== e && e.priceRangeReady()
        }
        priceRangeChanged() {
            return this._priceRangeChanged
        }
        mode() {
            const e = this._properties.childs();
            return {
                autoScale: e.autoScale.value(),
                lockScale: e.lockScale.value(),
                percentage: e.percentage.value(),
                indexedTo100: e.indexedTo100.value(),
                log: e.log.value()
            }
        }
        setMode(e) {
            const t = {},
                i = this.mode(),
                s = this._properties.state();
            let r = null;
            void 0 !== e.autoScale && e.autoScale !== s.autoScale && (t.autoScale = e.autoScale, this._setAutoScaleValueWithDependentProperties(e.autoScale)), void 0 !== e.lockScale && e.lockScale !== s.lockScale && (t.lockScale = e.lockScale, this._setLockScaleValueWithDependentProperties(e.lockScale)), void 0 !== e.percentage && e.percentage !== s.percentage && (t.percentage = e.percentage, this._setPercentageValueWithDependentProperties(e.percentage), this._invalidatedForRange.isValid = !1), void 0 !== e.indexedTo100 && e.indexedTo100 !== s.indexedTo100 && (t.indexedTo100 = e.indexedTo100, this._setIndexedTo100ValueWithDependentProperties(e.indexedTo100), this._invalidatedForRange.isValid = !1), void 0 !== e.log && e.log !== s.log && (t.log = e.log, this._setLogValueWithDependentProperties(e.log));
            const n = this._properties.childs();
            s.log && !n.log.value() && (this._canConvertPriceRangeFromLog(this.m_priceRange) ? (r = this._convertPriceRangeFromLog(this.m_priceRange), null !== r && this.setPriceRange(r)) : n.autoScale.setValue(!0)), !s.log && n.log.value() && (r = this._convertPriceRangeToLog(this.m_priceRange), null !== r && this.setPriceRange(r)), s.autoScale !== n.autoScale.value() && n.autoScale.listeners().fire(n.autoScale), s.autoScaleDisabled !== n.autoScaleDisabled.value() && n.autoScaleDisabled.listeners().fire(n.autoScaleDisabled), s.lockScale !== n.lockScale.value() && n.lockScale.listeners().fire(n.lockScale),
                s.percentage !== n.percentage.value() && (n.percentage.listeners().fire(n.percentage), this.updateFormatter()), s.indexedTo100 !== n.indexedTo100.value() && (n.indexedTo100.listeners().fire(n.indexedTo100), this.updateFormatter()), s.percentageDisabled !== n.percentageDisabled.value() && n.percentageDisabled.listeners().fire(n.percentageDisabled), s.log !== n.log.value() && n.log.listeners().fire(n.log), s.logDisabled !== n.logDisabled.value() && n.logDisabled.listeners().fire(n.logDisabled), void 0 === t.log && void 0 === t.percentage && void 0 === t.lockScale && void 0 === t.autoScale && void 0 === t.indexedTo100 || this._modeChanged.fire(i, this.mode())
        }
        modeChanged() {
            return this._modeChanged
        }
        isEmpty() {
            return this._makeSureItIsValid(), 0 === this.m_height || !this.m_priceRange || this.m_priceRange.isEmpty()
        }
        canDetachSource(e) {
            return this.m_dataSources.some((t => t !== e && (0, re.isPriceDataSource)(t) && !((0, j.isStudy)(t) && t.isLinkedToSeries())))
        }
        updateAllViews(e) {
            const t = this._getSourcesToUpdateViews();
            for (const i of t) i.updateAllViews(e)
        }
        logFormula() {
            return this._logFormula
        }
        state() {
            var e;
            const t = this._properties.childs();
            return {
                id: this._id,
                m_priceRange: this.isAutoScale() ? null : (null === (e = this.priceRange()) || void 0 === e ? void 0 : e.serialize()) || null,
                m_isAutoScale: this.isAutoScale(),
                m_isPercentage: t.percentage.value(),
                m_isIndexedTo100: t.indexedTo100.value(),
                m_isLog: t.log.value(),
                m_isLockScale: this.isLockScale(),
                m_isInverted: this.isInverted(),
                m_topMargin: this._margins.top,
                m_bottomMargin: this._margins.bottom,
                alignLabels: t.alignLabels.value(),
                logFormula: (0, ie.clone)(this._logFormula)
            }
        }
        restoreState(e) {
            let t = e.m_priceRange;
            if (void 0 === t) throw new TypeError("invalid state");
            if (void 0 === e.m_isAutoScale) throw new TypeError("invalid state");
            void 0 !== e.id && (this._id = e.id);
            const i = {
                autoScale: e.m_isAutoScale
            };
            void 0 !== e.m_isPercentage && (i.percentage = e.m_isPercentage), void 0 !== e.m_isIndexedTo100 && (i.indexedTo100 = e.m_isIndexedTo100), void 0 !== e.m_isLog && (i.log = e.m_isLog), void 0 !== e.m_isLockScale && (i.lockScale = e.m_isLockScale), void 0 !== e.m_isInverted && this._properties.childs().isInverted.setValue(e.m_isInverted), this.setMode(i), t ? (t instanceof de.PriceRange || (t = new de.PriceRange(t)), this.setPriceRange(t, !0)) : this.clearPriceRange(), e.logFormula && (this._logFormula = e.logFormula), void 0 !== e.m_topMargin && (this._margins.top = e.m_topMargin), void 0 !== e.m_bottomMargin && (this._margins.bottom = e.m_bottomMargin), void 0 !== e.alignLabels && this._properties.childs().alignLabels.setValue(e.alignLabels), this._mainSource = null, this._scaleSeriesOnly = !1
        }
        priceToLogical(e) {
            return this.isLog() && e ? (0, ue.toLog)(e, this._logFormula) : e
        }
        logicalToPrice(e) {
            return this.isLog() ? (0, ue.fromLog)(e, this._logFormula) : e
        }
        priceToCoordinate(e, t) {
            const i = this._priceToPercentOrIndexedTo100IfNeeded(e, t);
            return this._logicalToCoordinate(i)
        }
        coordinateToPrice(e, t) {
            let i = this._coordinateToLogical(e);
            return this.isPercentage() ? i = (0, ue.fromPercent)(i, t) : this.isIndexedTo100() && (i = (0, ue.fromIndexedTo100)(i, t)), i
        }
        mainSource() {
            if (null !== this._mainSource) return this._mainSource;
            let e;
            for (const t of this.m_dataSources) {
                if (t instanceof pe.Series) {
                    e = t;
                    break
                }!e && (0, re.isPriceDataSource)(t) && (e = t)
            }
            return this._mainSource = e || null, this._correctedMarginsCache = null, this._mainSource
        }
        pricesArrayToCoordinates(e, t, i) {
            this._makeSureItIsValid();
            const s = this.bottomPixelMargin(),
                r = (0, n.ensureNotNull)(this.priceRange()),
                o = r.minValue(),
                a = r.maxValue(),
                l = this.internalHeight() - 1,
                c = this.isInverted(),
                h = l / (a - o);
            void 0 === i && (i = e.length);
            const d = this.isPercentage(),
                u = this.isIndexedTo100(),
                p = this.isLog(),
                _ = this.m_height;
            let m, g;
            for (let r = 0; r < i; r++) m = e[r], Number.isFinite(m) && (d ? m = (0, ue.toPercent)(m, t) : u ? m = (0, ue.toIndexedTo100)(m, t) : p && (m = (0, ue.toLog)(m, this._logFormula)), g = s + h * (m - o), e[r] = c ? g : _ - 1 - g)
        }
        pointsArrayToCoordinates(e, t, i) {
            var s, r;
            this._makeSureItIsValid();
            const o = (0, n.ensureNotNull)(this.priceRange()),
                a = this.bottomPixelMargin(),
                l = o.minValue(),
                c = o.maxValue(),
                h = this.internalHeight() - 1,
                d = this.isInverted(),
                u = h / (c - l),
                p = e,
                _ = null !== (s = null == i ? void 0 : i.startItemIndex) && void 0 !== s ? s : 0,
                m = null !== (r = null == i ? void 0 : i.endItemIndex) && void 0 !== r ? r : p.length;
            if (this.isPercentage())
                for (let e = _; e < m; e++) p[e].y = (0, ue.toPercent)(p[e].y, t);
            if (this.isIndexedTo100())
                for (let e = _; e < m; e++) p[e].y = (0, ue.toIndexedTo100)(p[e].y, t);
            if (this.isLog())
                for (let e = _; e < m; e++) p[e].y = this.priceToLogical(p[e].y);
            for (let e = _; e < m; e++) {
                const t = p[e].y;
                if (isNaN(t) || null == t) continue;
                const i = a + u * (t - l),
                    s = d ? i : this.m_height - 1 - i;
                p[e].y = s
            }
        }
        barPricesToCoordinates(e, t) {
            this._makeSureItIsValid();
            const i = (0, n.ensureNotNull)(this.priceRange()),
                s = e,
                r = this.bottomPixelMargin(),
                o = i.minValue(),
                a = i.maxValue(),
                l = this.internalHeight() - 1;
            let c = null;
            if (this.isPercentage() ? c = ue.toPercent : this.isIndexedTo100() ? c = ue.toIndexedTo100 : this.isLog() && (c = (e, t) => e ? (0, ue.toLog)(e, this._logFormula) : e), 0 === s.length) return;
            const h = "open" in s[0],
                d = "close" in s[0];
            if (null !== c)
                for (let e = 0; e < s.length; e++) {
                    if (!s[e]) continue;
                    const i = s[e];
                    h && (i.open = c(i.open, t)), i.high = c(i.high, t), i.low = c(i.low, t), d && (i.close = c(i.close, t)), void 0 !== i.additionalPrice && (i.additionalPrice = c(i.additionalPrice, t))
                }
            const u = l / (a - o),
                p = this.isInverted();
            for (let e = 0; e < s.length; e++) {
                const t = s[e];
                if (!t) continue;
                if (h) {
                    const e = r + u * (t.open - o),
                        i = p ? e : this.m_height - 1 - e;
                    t.open = i
                }
                const i = r + u * (t.high - o),
                    n = p ? i : this.m_height - 1 - i;
                t.high = n;
                const a = r + u * (t.low - o),
                    l = p ? a : this.m_height - 1 - a;
                if (t.low = l, d) {
                    const e = r + u * (t.close - o),
                        i = p ? e : this.m_height - 1 - e;
                    t.close = i
                }
                if (void 0 !== t.additionalPrice) {
                    const e = r + u * (t.additionalPrice - o);
                    t.additionalPrice = p ? e : this.m_height - 1 - e
                }
            }
        }
        formatter() {
            return null === this._formatter && this.updateFormatter(), (0, n.ensureNotNull)(this._formatter)
        }
        updateFormatter() {
            this._marksCache = null;
            const e = this.mainSource();
            let t = 100;
            e && (t = e.base()), this._formatter = null, this.isPercentage() ? (this._formatter = be, t = 100) : this.isIndexedTo100() ? (this._formatter = new V.PriceFormatter(100, 1), t = 100) : this._formatter = e ? e.formatter() : we, this._markBuilder = new ve(this, t, this._coordinateToLogical.bind(this), this._logicalToCoordinate.bind(this)), this._markBuilder.rebuildTickMarks()
        }
        formatPrice(e, t, i) {
            return this.isPercentage() ? this.formatPricePercentage(e, t, i) : this.isIndexedTo100() ? this.formatPriceIndexedTo100(e, t) : this.formatter().format(e)
        }
        formatPriceAbsolute(e) {
            return this._mainSourceFormatter().format(e)
        }
        formatPricePercentage(e, t, i) {
            return e = (0, ue.toPercent)(e, t), be.format(e, i)
        }
        formatPriceIndexedTo100(e, t) {
            const i = (0, ue.toIndexedTo100)(e, t);
            return this.formatter().format(i)
        }
        getFormattedValues(e, t, i) {
            const s = this.formatPriceAbsolute(e),
                r = this.formatPricePercentage(e, t, i),
                n = this.formatPriceIndexedTo100(e, t);
            return {
                formattedPriceAbsolute: s,
                formattedPricePercentage: r,
                formattedPriceIndexedTo100: n,
                text: (0, ue.getCurrentModePriceText)(this, {
                    formattedPriceAbsolute: s,
                    formattedPricePercentage: r,
                    formattedPriceIndexedTo100: n
                })
            }
        }
        dataSources() {
            return this.m_dataSources
        }
        seriesLikeSources() {
            return this._seriesLikeSources
        }
        addDataSource(e, t) {
            if (t || -1 === this.m_dataSources.indexOf(e)) {
                if ((0, re.isPriceDataSource)(e) && (this._priceDataSources.push(e), e.currencyChanged().subscribe(this, (() => this._currencyCache = null)), e.unitChanged().subscribe(this, (() => this._unitCache = null)), (0, _e.isSymbolSource)(e) && (this._seriesLikeSources.push(e), e.symbolResolved().subscribe(this, (() => {
                        this._currencyCache = null, this._unitCache = null, this._measureUnitIdCache = null
                    })), e.isActingAsSymbolSource().subscribe(this._boundOnSourceIsActingAsSymbolSourceChanged), e instanceof pe.Series))) {
                    const t = e.properties();
                    this._hasSeries || (t.childs().lockScale && (this.setMode({
                        lockScale: t.childs().lockScale.value()
                    }), t.removeProperty("lockScale")), t.childs().pnfStyle.child("lockScale") && t.childs().pnfStyle.removeProperty("lockScale")), this._hasSeries = !0
                }
                e.properties().visible.listeners().subscribe(this, this._dropScaleCache), (0, j.isStudy)(e) && (e.onIsActualIntervalChange().subscribe(this, this._dropScaleCache), e.onHibernationStateChange().subscribe(this, this._dropScaleCache), 0 === this._studiesCount && (0, Se.hideAllIndicators)().subscribe(this, this._dropScaleCache), this._studiesCount++), (0, S.isLineTool)(e) && (0 === this._drawingCount && (0, Se.hideAllDrawings)().subscribe(this, this._dropScaleCache), this._drawingCount++), this.m_dataSources.push(e), this._mainSource = null, this._correctedMarginsCache = null, this._sourcesToUpdateViews = null, this._dropScaleCache(), this.updateFormatter(), this._initScaleProperties(), this.invalidateSourcesCache()
            }
        }
        removeDataSource(e) {
            const t = this.m_dataSources.indexOf(e);
            if ((0, n.assert)(-1 !== t, "Source is not attached to scale"), e.properties().visible.listeners().unsubscribe(this, this._dropScaleCache), this.m_dataSources.splice(t, 1), (0, re.isPriceDataSource)(e)) {
                const t = this._priceDataSources.indexOf(e);
                if ((0, n.assert)(-1 !== t, "Source is not found"), this._priceDataSources.splice(t, 1), (0, _e.isSymbolSource)(e)) {
                    const t = this._seriesLikeSources.indexOf(e);
                    (0, n.assert)(-1 !== t, "Source is not found"), this._seriesLikeSources.splice(t, 1), e.symbolResolved().unsubscribeAll(this), e.isActingAsSymbolSource().unsubscribe(this._boundOnSourceIsActingAsSymbolSourceChanged), e instanceof pe.Series && (this._hasSeries = !1)
                }
                e.currencyChanged().unsubscribeAll(this),
                    e.unitChanged().unsubscribeAll(this)
            }
            this.mainSource() || this.setMode({
                autoScale: !0
            }), (0, j.isStudy)(e) && (e.onIsActualIntervalChange().unsubscribe(this, this._dropScaleCache), e.onHibernationStateChange().unsubscribe(this, this._dropScaleCache), this._studiesCount--, 0 === this._studiesCount && (0, Se.hideAllIndicators)().unsubscribe(this, this._dropScaleCache)), (0, S.isLineTool)(e) && (this._drawingCount--, 0 === this._drawingCount && (0, Se.hideAllDrawings)().unsubscribe(this, this._dropScaleCache)), this._mainSource = null, this._correctedMarginsCache = null, this._sourcesForAutoscale = null, this._sourcesToUpdateViews = null, this.updateFormatter(), this.invalidateSourcesCache(), 0 === this.m_dataSources.length && this._lastSourceRemoved.fire(), this._currencyCache = null, this._unitCache = null, this._measureUnitIdCache = null
        }
        currency(e) {
            if (null !== this._currencyCache && e.size() === this._currencyCache.availableCurrenciesCount) return this._currencyCache.value;
            let t;
            const i = new Set,
                s = new Set,
                r = new Set,
                o = new Map;
            let a, l = 0 === this._seriesLikeSources.length,
                c = !0,
                h = 0,
                d = 0;
            const u = this._seriesLikeSources.filter(_e.isActingAsSymbolSource);
            for (const d of u) {
                if (!d.isVisible()) continue;
                const u = d.symbolInfo();
                if (null === u) {
                    t = null;
                    break
                }
                const p = (0, O.symbolOriginalCurrency)(u);
                if (null === p) {
                    t = null;
                    break
                }
                o.set(p, (0, n.ensureNotNull)((0, O.symbolOriginalCurrency)(u, !0)));
                const _ = d.currency();
                if (null === _) {
                    t = null;
                    break
                }
                o.set(_, (0, n.ensureNotNull)((0, O.symbolCurrency)(u, !0)));
                const m = (0, O.symbolBaseCurrency)(u);
                null !== m && s.add(m), c = c && p === _, r.add(_), i.add(p), void 0 === a ? a = _ : null !== a && a !== _ && (a = null), l || e.convertible(_) && (0, O.symbolCurrencyConvertible)(u) || (l = !0), h += 1
            }
            if (null !== t)
                for (const i of this._priceDataSources) {
                    if (u.includes(i)) continue;
                    const s = i;
                    if (!s.isCurrencySource() || !s.isVisible()) continue;
                    const c = s.currency();
                    if (null === c) {
                        t = null;
                        break
                    }
                    r.add(c), d += 1;
                    const h = (0, n.ensureNotNull)(s.symbolSource()),
                        p = s.currencySourceSymbolInfo();
                    if (null === p) {
                        t = null;
                        break
                    }
                    if (l || e.convertible(c) && (0, O.symbolCurrencyConvertible)(p) || (l = !0), o.set(c, (0, n.ensureNotNull)((0, O.symbolCurrency)(p, !0))), u.includes(h) || (l = !0), void 0 === a) a = c;
                    else if (null !== a && a !== c) {
                        a = null;
                        break
                    }
                }
            return void 0 === t && (t = 0 === h && 0 === d ? null : {
                readOnly: l,
                selectedCurrency: a || null,
                currencies: r,
                originalCurrencies: i,
                baseCurrencies: s,
                symbolSourceCount: h,
                allCurrenciesAreOriginal: c,
                displayedValues: o
            }), this._currencyCache = {
                value: t,
                availableCurrenciesCount: e.size()
            }, t
        }
        unit(e) {
            if (null !== this._unitCache && e.size() === this._unitCache.availableUnitsCount) return this._unitCache.value;
            let t;
            const i = new Set,
                s = new Set,
                r = new Map,
                o = new Map;
            let a, l = 0 === this._seriesLikeSources.length ? new Set : e.allGroups(),
                c = !0,
                h = 0,
                d = 0;
            const u = this._seriesLikeSources.filter(_e.isActingAsSymbolSource);
            for (const n of u) {
                if (!n.isVisible()) continue;
                const d = n.symbolInfo();
                if (null === d) {
                    t = null;
                    break
                }
                const u = (0, O.symbolOriginalUnit)(d, n.model().unitConversionEnabled());
                if (null === u) {
                    t = null;
                    break
                }
                r.set(u, e.name(u)), o.set(u, e.description(u));
                const p = n.unit();
                if (null === p) {
                    t = null;
                    break
                }
                if (r.set(p, e.name(p)), o.set(p, e.description(p)), c = c && u === p, s.add(p), i.add(u),
                    void 0 === a ? a = p : null !== a && a !== p && (a = null), l.size > 0) {
                    const t = (0, me.unitConvertibleGroups)(d, p, e);
                    l = (0, v.intersect)(l, new Set(t))
                }
                h += 1
            }
            if (null !== t)
                for (const i of this._priceDataSources) {
                    if (u.includes(i)) continue;
                    const c = i;
                    if (!c.isUnitSource() || !c.isVisible()) continue;
                    const h = c.unit();
                    if (null === h) {
                        t = null;
                        break
                    }
                    s.add(h), d += 1;
                    const p = (0, n.ensureNotNull)(c.symbolSource()),
                        _ = p.symbolInfo();
                    if (null === _) {
                        t = null;
                        break
                    }
                    if (l.size > 0) {
                        const t = (0, me.unitConvertibleGroups)(_, h, e);
                        l = (0, v.intersect)(l, new Set(t))
                    }
                    if (r.set(h, e.name(h)), o.set(h, e.description(h)), u.includes(p) || (l = new Set), void 0 === a) a = h;
                    else if (null !== a && a !== h) {
                        a = null;
                        break
                    }
                }
            if (void 0 === t)
                if (0 === h && 0 === d) t = null;
                else {
                    t = {
                        availableGroups: l,
                        selectedUnit: a || null,
                        units: s,
                        originalUnits: i,
                        symbolSourceCount: h,
                        allUnitsAreOriginal: c,
                        names: r,
                        descriptions: o
                    }
                } return this._unitCache = {
                value: t,
                availableUnitsCount: e.size()
            }, t
        }
        measureUnitId(e) {
            if (null !== this._measureUnitIdCache && e.size() === this._measureUnitIdCache.availableUnitsCount) return this._measureUnitIdCache.value;
            let t, i;
            const s = new Map,
                r = new Map,
                n = new Set;
            let o = 0;
            const a = this._seriesLikeSources.filter(_e.isActingAsSymbolSource);
            for (const l of a) {
                if (!l.isVisible()) continue;
                const a = l.measureUnitId();
                if (null === a) {
                    t = null;
                    break
                }
                n.add(a), s.set(a, e.name(a)), r.set(a, e.description(a)), void 0 === i ? i = a : null !== i && i !== a && (i = null), o += 1
            }
            return void 0 === t && (t = 0 === o ? null : {
                selectedMeasureUnitId: i || null,
                measureUnitIds: n,
                names: s,
                descriptions: r,
                symbolSourceCount: o
            }), this._measureUnitIdCache = {
                value: t,
                availableUnitsCount: e.size()
            }, t
        }
        setMargins(e) {
            if (!(0, ie.isNumber)(e.top) || !(0, ie.isNumber)(e.bottom)) throw new TypeError("invalid margin");
            if (e.top < 0 || e.top > 30 || e.bottom < 0 || e.bottom > 30) throw new RangeError("invalid margin");
            this._margins.top === e.top && this._margins.bottom === e.bottom || (this._margins = e, this._correctedMarginsCache = null, this._invalidateInternalHeightCache(), this._marksCache = null)
        }
        topMargin() {
            return this._correctedMargins().top
        }
        bottomMargin() {
            return this._correctedMargins().bottom
        }
        invalidateMargins() {
            this._correctedMarginsCache = null
        }
        topPixelMargin() {
            return this.isInverted() ? this.bottomMargin() * this.height() + this._bottomPixelMargin : this.topMargin() * this.height() + this._topPixelMargin
        }
        bottomPixelMargin() {
            return this.isInverted() ? this.topMargin() * this.height() + this._topPixelMargin : this.bottomMargin() * this.height() + this._bottomPixelMargin
        }
        marks() {
            return this.isEmpty() ? (this._marksCache = null, []) : (null === this._marksCache && (this._markBuilder.rebuildTickMarks(), this._marksCache = this._markBuilder.marks(), this._onMarksChanged.fire()), this._marksCache)
        }
        onMarksChanged() {
            return this._onMarksChanged
        }
        priceRangeInPrice() {
            if (this.isEmpty()) return null;
            const e = this.mainSource();
            if (null === e) return null;
            const t = (0, n.ensureNotNull)(e.firstValue()),
                i = this.height();
            return {
                from: this.coordinateToPrice(i - 1, t),
                to: this.coordinateToPrice(0, t)
            }
        }
        setPriceRangeInPrice(e) {
            if (this.isPercentage() || this.isIndexedTo100()) return;
            const t = this.isInverted(),
                i = t ? this.bottomMargin() : this.topMargin(),
                s = t ? this.topMargin() : this.bottomMargin(),
                r = this.isLog();
            let n = r ? (0,
                    ue.toLog)(e.from, this._logFormula) : e.from,
                o = r ? (0, ue.toLog)(e.to, this._logFormula) : e.to;
            const a = o - n;
            n += s * a, o -= i * a, this.setMode({
                autoScale: !1
            }), this.setPriceRange(new de.PriceRange(n, o)), this._marksCache = null, this._onMarksChanged.fire()
        }
        hasMainSeries() {
            return this._hasSeries
        }
        getStudies() {
            return this.dataSources().filter(j.isStudy)
        }
        lastSourceRemoved() {
            return this._lastSourceRemoved
        }
        sourcesForAutoscale() {
            return this._mainSource && this._scaleSeriesOnly !== this._scalesProperties.childs().scaleSeriesOnly.value() && (this._sourcesForAutoscale = null), this._sourcesForAutoscale || (this._sourcesForAutoscale = this._recalculateSourcesForAutoscale()), this._sourcesForAutoscale
        }
        recalculatePriceRange(e) {
            this._invalidatedForRange = {
                visibleBars: e,
                isValid: !1
            }
        }
        internalHeightChanged() {
            return this._internalHeightChanged
        }
        orderedSources() {
            if (this._cachedOrderedSoruces) return this._cachedOrderedSoruces;
            let e = this.m_dataSources.slice();
            return e = (0, ne.sortSources)(e), this._cachedOrderedSoruces = e, this._cachedOrderedSoruces
        }
        invalidateSourcesCache() {
            this._cachedOrderedSoruces = null, this._sourcesToUpdateViews = null
        }
        startScale(e) {
            var t, i;
            this.isEmpty() || this.isPercentage() || this.isIndexedTo100() || null !== this._scaleStartPoint || null !== this._priceRangeSnapshot || (this._scaleStartPoint = this.m_height - e, this._priceRangeSnapshot = null !== (i = null === (t = this.priceRange()) || void 0 === t ? void 0 : t.clone()) && void 0 !== i ? i : null)
        }
        scaleTo(e) {
            if (this.isPercentage() || this.isIndexedTo100() || null === this._scaleStartPoint) return;
            this.setMode({
                autoScale: !1
            }), (e = this.m_height - e) < 0 && (e = 0);
            let t = (this._scaleStartPoint + .2 * (this.m_height - 1)) / (e + .2 * (this.m_height - 1));
            const i = (0, n.ensureNotNull)(this._priceRangeSnapshot).clone();
            t = Math.max(t, .1), i.scaleAroundCenter(t), this.setPriceRange(i)
        }
        endScale() {
            this.isPercentage() || this.isIndexedTo100() || null !== this._scaleStartPoint && (this._scaleStartPoint = null, this._priceRangeSnapshot = null)
        }
        startTwoPointsScale(e, t) {
            if (this.isEmpty() || this.isPercentage() || this.isIndexedTo100() || null !== this._twoPointsScaleStartPosition) return;
            const i = Math.min(e, t),
                s = Math.max(e, t);
            this._twoPointsScaleStartPosition = {
                topLogical: this._coordinateToLogical(i),
                bottomLogical: this._coordinateToLogical(s)
            }
        }
        twoPointsScale(e, t) {
            if (this.isPercentage() || this.isIndexedTo100() || null === this._twoPointsScaleStartPosition) return;
            this.setMode({
                autoScale: !1
            });
            const i = Math.min(e, t),
                s = Math.max(e, t),
                {
                    topLogical: r,
                    bottomLogical: n
                } = this._twoPointsScaleStartPosition,
                o = this.bottomPixelMargin(),
                a = this.internalHeight() - 1,
                l = (this._invertedCoordinate(i) - o) / a,
                c = (n - r) / ((this._invertedCoordinate(s) - o) / a - l),
                h = r - c * l,
                d = h + c;
            this.setPriceRange(new de.PriceRange(this.priceToLogical(h), this.priceToLogical(d)))
        }
        endTwoPointsScale() {
            this._twoPointsScaleStartPosition = null
        }
        startScroll(e) {
            var t, i;
            this.isAutoScale() || null === this._scrollStartPoint && null === this._priceRangeSnapshot && (this.isEmpty() || (this._scrollStartPoint = e, this._priceRangeSnapshot = null !== (i = null === (t = this.priceRange()) || void 0 === t ? void 0 : t.clone()) && void 0 !== i ? i : null))
        }
        scrollTo(e) {
            if (this.isAutoScale()) return;
            if (null === this._scrollStartPoint || null === this._priceRangeSnapshot) return;
            const t = this.priceRange();
            if (null === t) return;
            let i = e - this._scrollStartPoint;
            this.isInverted() && (i *= -1);
            const s = i * (t.length() / (this.internalHeight() - 1)),
                r = this._priceRangeSnapshot.clone();
            r.shift(s), this.setPriceRange(r, !0), this._marksCache = null
        }
        endScroll() {
            this.isAutoScale() || null !== this._scrollStartPoint && (this._scrollStartPoint = null, this._priceRangeSnapshot = null)
        }
        clearPriceRange() {
            this.m_priceRange = null, this.recalculatePriceRangeOnce()
        }
        _recalculateSourcesForAutoscale() {
            this._mainSource && (this._scaleSeriesOnly = this._scalesProperties.childs().scaleSeriesOnly.value());
            const e = this._scaleSeriesOnly && this._hasSeries;
            return this.m_dataSources.filter((t => !!(t.properties().visible.value() || t instanceof pe.Series) && (e ? t instanceof pe.Series : (0, j.isStudy)(t) ? !t.isSourceHidden() && t.isIncludedInAutoScale() : t.isIncludedInAutoScale())))
        }
        _updateAutoScaleDisabledProperty(e) {
            const t = this._properties.childs(),
                i = t.indexedTo100.value() || t.percentage.value() || t.lockScale.value();
            e ? t.autoScaleDisabled.setValueSilently(i) : t.autoScaleDisabled.setValue(i)
        }
        _setAutoScaleValueWithDependentProperties(e) {
            const t = this._properties.childs();
            t.autoScale.setValueSilently(e), e && (t.percentage.setValueSilently(!1), t.indexedTo100.setValueSilently(!1), t.lockScale.setValueSilently(!1), t.logDisabled.setValueSilently(!1)), this._updateAutoScaleDisabledProperty(!0)
        }
        _setLockScaleValueWithDependentProperties(e) {
            const t = this._properties.childs();
            t.lockScale.setValueSilently(e), e && (t.autoScale.setValueSilently(!1), t.percentage.setValueSilently(!1), t.indexedTo100.setValueSilently(!1), t.log.setValueSilently(!1)), t.percentageDisabled.setValueSilently(e), t.logDisabled.setValueSilently(e), this._updateAutoScaleDisabledProperty(!0)
        }
        _setPercentageValueWithDependentProperties(e) {
            const t = this._properties.childs();
            t.percentage.setValueSilently(e), e && (t.autoScale.setValueSilently(!0), t.log.setValueSilently(!1), t.lockScale.setValueSilently(!1), t.indexedTo100.setValueSilently(!1)), this._updateAutoScaleDisabledProperty(!0)
        }
        _setIndexedTo100ValueWithDependentProperties(e) {
            const t = this._properties.childs();
            t.indexedTo100.setValueSilently(e), e && (t.autoScale.setValueSilently(!0), t.log.setValueSilently(!1), t.lockScale.setValueSilently(!1), t.percentage.setValueSilently(!1)), this._updateAutoScaleDisabledProperty(!0)
        }
        _setLogValueWithDependentProperties(e) {
            const t = this._properties.childs();
            t.log.setValueSilently(e), e && (t.lockScale.setValueSilently(!1), t.percentage.setValueSilently(!1), t.indexedTo100.setValueSilently(!1)), this._updateAutoScaleDisabledProperty(!0)
        }
        _recalculatePriceRangeImpl() {
            const e = this._invalidatedForRange.visibleBars;
            if (null === e) return;
            let t = null;
            const i = this.sourcesForAutoscale(),
                s = this.isPercentage(),
                r = this.isIndexedTo100();
            let n = 0,
                o = 0;
            for (const a of i) {
                if (!a.properties().visible.value()) continue;
                const i = a.firstValue();
                if (null === i || s && 0 === i) continue;
                const l = e.firstBar(),
                    c = e.lastBar(),
                    h = a.autoScaleInfo(l, c);
                let d = h.range;
                d && (s ? d = (0, ue.toPercentRange)(d, i) : r && (d = (0, ue.toIndexedTo100Range)(d, i)),
                    t = null === t ? d : t.merge(d)), void 0 !== h.topPixelMargin && (n = Math.max(n, h.topPixelMargin)), void 0 !== h.bottomPixelMargin && (o = Math.max(o, h.bottomPixelMargin))
            }
            if ((Math.abs(n - this._topPixelMargin) > 0 || Math.abs(o - this._bottomPixelMargin) > 0) && (this._bottomPixelMargin = o, this._topPixelMargin = n, this._marksCache = null, this._invalidateInternalHeightCache()), t) {
                if (t.minValue() === t.maxValue() && (t = new de.PriceRange(t.minValue() - .5, t.maxValue() + .5)), this.isLog()) {
                    const e = this._convertPriceRangeFromLog(t),
                        i = (0, ue.logFormulaForPriceRange)(e);
                    if (!(0, ue.logFormulasAreSame)(i, this._logFormula)) {
                        const s = this._priceRangeSnapshot ? this._convertPriceRangeFromLog(this._priceRangeSnapshot) : null;
                        this._logFormula = i, t = this._convertPriceRangeToLog(e), s && (this._priceRangeSnapshot = this._convertPriceRangeToLog(s))
                    }
                }
                this.setPriceRange(t)
            } else this.m_priceRange || (this.setPriceRange(new de.PriceRange(-.5, .5)), this._logFormula = (0, ue.logFormulaForPriceRange)(null));
            this._invalidatedForRange.isValid = !0;
            const a = this.mainSource();
            null !== a && this._recalculatePriceRangeOnce && (this._recalculatePriceRangeOnce = !a.priceRangeReady())
        }
        _makeSureItIsValid() {
            this._invalidatedForRange.isValid || (this._invalidatedForRange.isValid = !0, this._recalculatePriceRangeImpl())
        }
        _invalidateInternalHeightCache() {
            this._internalHeightCache = null, this._internalHeightChanged.fire()
        }
        _coordinateToLogical(e) {
            if (this._makeSureItIsValid(), this.isEmpty()) return 0;
            const t = this._invertedCoordinate(e),
                i = (0, n.ensureNotNull)(this.priceRange()),
                s = i.minValue() + (i.maxValue() - i.minValue()) * ((t - this.bottomPixelMargin()) / (this.internalHeight() - 1));
            return this.logicalToPrice(s)
        }
        _logicalToCoordinate(e) {
            if (this._makeSureItIsValid(), this.isEmpty()) return 0;
            e = this.priceToLogical(e);
            const t = (0, n.ensureNotNull)(this.priceRange()),
                i = this.bottomPixelMargin() + (this.internalHeight() - 1) * (e - t.minValue()) / (t.maxValue() - t.minValue());
            return this._invertedCoordinate(i)
        }
        _convertPriceRangeFromLog(e) {
            if (null === e) return null;
            const t = (0, ue.fromLog)(e.minValue(), this._logFormula),
                i = (0, ue.fromLog)(e.maxValue(), this._logFormula);
            return new de.PriceRange(t, i)
        }
        _convertPriceRangeToLog(e) {
            if (null === e) return null;
            const t = (0, ue.toLog)(e.minValue(), this._logFormula),
                i = (0, ue.toLog)(e.maxValue(), this._logFormula);
            return new de.PriceRange(t, i)
        }
        _canConvertPriceRangeFromLog(e) {
            if (null === e) return !1;
            const t = (0, ue.fromLog)(e.minValue(), this._logFormula),
                i = (0, ue.fromLog)(e.maxValue(), this._logFormula);
            return isFinite(t) && isFinite(i)
        }
        _dropScaleCache() {
            this._sourcesForAutoscale = null, this._currencyCache = null, this._unitCache = null, this._measureUnitIdCache = null
        }
        _invertedCoordinate(e) {
            return this.isInverted() ? e : this.height() - 1 - e
        }
        _initScaleProperties() {
            const e = this.isLockScale(),
                t = this.properties().childs();
            e && (t.percentage.setValue(!1), t.indexedTo100.setValue(!1), t.log.setValue(!1), t.autoScale.setValue(!1)), t.percentageDisabled.setValue(e), t.logDisabled.setValue(e), this._updateAutoScaleDisabledProperty(!1), t.percentage.value() && (t.log.setValue(!1), t.indexedTo100.setValue(!1)), t.indexedTo100.value() && (t.log.setValue(!1), t.percentage.setValue(!1))
        }
        _correctedMargins() {
            if (null === this._correctedMarginsCache) {
                const e = this.mainSource();
                this._correctedMarginsCache = null !== e ? e.correctScaleMargins(this._margins) : this._margins
            }
            return this._correctedMarginsCache
        }
        _getSourcesToUpdateViews() {
            return this._sourcesToUpdateViews || (this._sourcesToUpdateViews = this.m_dataSources.filter((e => !(0, S.isLineTool)(e) || e.isActualSymbol() && e.isActualCurrency()))), this._sourcesToUpdateViews
        }
        _mainSourceFormatter() {
            const e = this.mainSource();
            return (null == e ? void 0 : e.formatter()) || we
        }
        _priceToPercentOrIndexedTo100IfNeeded(e, t) {
            return this.isPercentage() ? (0, ue.toPercent)(e, t) : this.isIndexedTo100() ? (0, ue.toIndexedTo100)(e, t) : e
        }
        _onSourceIsActingAsSymbolSourceChanged() {
            this._dropScaleCache()
        }
        _onIsInvertedChanged() {
            this._marksCache = null, this._markBuilder.rebuildTickMarks()
        }
    }
    var xe = i(29541),
        Te = i(63009),
        Ie = i(53588),
        Me = i(88732),
        Ae = i(13333);
    const Le = [],
        ke = [];
    class Ee {
        constructor(e) {
            this._studies = {}, this._deferreds = {}, this._container = e, Le.push(e), ke.push(this)
        }
        add(e, t) {
            this._deferreds[e] && (this._deferreds[e].resolve(t), delete this._deferreds[e]), this._studies[e] = t
        }
        get(e) {
            return this._studies[e] ? Promise.resolve(this._studies[e]) : (this._deferreds[e] || (this._deferreds[e] = (0, p.createDeferredPromise)()), this._deferreds[e].promise)
        }
        reset() {
            const e = Le.indexOf(this._container);
            ~e && (Le.splice(e, 1), ke.splice(e, 1))
        }
        static instance(e) {
            const t = Le.indexOf(e);
            return ~t ? ke[t] : new Ee(e)
        }
    }
    var De = i(99366);
    var Ve = i(4949),
        Be = i(2823),
        Re = i(53086),
        Ne = i(78856),
        Oe = i(44010),
        Fe = i(87440),
        We = i(16410);
    new ee.TranslatedString("update {title} script", c.t(null, void 0, i(50728)));
    const ze = N.enabled("clear_price_scale_on_error_or_empty_bars"),
        He = (0, X.getLogger)("Chart.Pane");

    function Ue(e, t, i) {
        e.setMargins({
            top: t,
            bottom: i
        })
    }
    class je {
        constructor(e, t, i, s) {
            this.m_dataSources = [], this._sourceWatchedValuesSubscriptions = new Map, this.m_mainDataSource = null, this._cachedOrderedSources = new ce(this), this._sourcesById = new Map, this._priceSourcesById = new Map, this._sourcePropertiesChanged = new(q()), this._sourcesZOrderChanged = new(q()), this._tagsChanged = new(q()), this._stretchFactor = 1e3, this._isInInsertManyDataSourcesState = !1, this._lastLineDataSourceZOrder = null, this._rightPriceScales = [], this._leftPriceScales = [], this._lockedPriceScale = null, this._currentPriceScaleRatio = null, this._onPriceScalesChanged = new(q()), this._isRecalculatingScales = !1, this._priceDataSources = [], this._symbolSources = [], this._lollipopDataSources = [], this._symbolSourceResolved = new(q()), this._symbolSourceResolvingActive = new(Y())(!1), this._bulkActions = {
                    activeCounter: 0
                }, this._height = 0, this._width = 0, this._sizeChanged = new(q()), this._dataSourcesCollectionChanged = new(q()), this._symbolSourceCollectionChanged = new(q()), this._maximized = new(Y())(!1), this._collapsed = new(Y())(!1), this._destroyed = new(q()), this._executionsPositionController = null, this._seriesDisplayError = null, this._recalcSymbolSourceResolvingActive = () => {
                    for (const e of this._symbolSources)
                        if (e.symbolResolvingActive().value()) return void this._symbolSourceResolvingActive.setValue(!0);
                    this._symbolSourceResolvingActive.setValue(!1)
                },
                this._onSymbolSourceCollectionChanged = () => {
                    0 === this._bulkActions.activeCounter ? this._symbolSourceCollectionChanged.fire() : this._bulkActions.symbolSourceCollectionChanged = !0
                }, this._onSeriesDisplayError = e => {
                    if (null !== e) {
                        for (const e of this._leftPriceScales) e.clearPriceRange();
                        for (const e of this._rightPriceScales) e.clearPriceRange()
                    }
                }, this._priceScaleSelectionStrategy = (0, Q.createPriceScaleSelectionStrategy)(i.properties().childs().priceScaleSelectionStrategyName.value()), this._id = null != s ? s : (0, J.randomHashN)(6), this._timeScale = e, this.m_mainDataSource = null, this._properties = t, this._model = i, i.properties().childs().priceScaleSelectionStrategyName.subscribe(null, (e => {
                    this._priceScaleSelectionStrategy = (0, Q.createPriceScaleSelectionStrategy)(e.value()), this._priceScaleSelectionStrategy.apply(this)
                })), this._timeScale.barSpacingChanged().subscribe(this, (() => {
                    this.m_mainDataSource === this._model.mainSeries() && this._recalculatePriceScaleByScaleRatio(this.m_mainDataSource.priceScale())
                })), ze && (this._seriesDisplayError = (0, O.getSeriesDisplayErrorWV)(this._model.mainSeries()), this._seriesDisplayError.subscribe(this._onSeriesDisplayError)), t.childs().topMargin.subscribe(this, this._updateMargins), t.childs().bottomMargin.subscribe(this, this._updateMargins), this._updateMargins()
        }
        destroy() {
            var e;
            this._properties.childs().topMargin.unsubscribeAll(this), this._properties.childs().bottomMargin.unsubscribeAll(this), this._model.properties().childs().priceScaleSelectionStrategyName.unsubscribeAll(this), this._timeScale.barSpacingChanged().unsubscribeAll(this), this._leftPriceScales.concat(this._rightPriceScales).forEach((e => {
                e.modeChanged().unsubscribeAll(this), e.priceRangeChanged().unsubscribeAll(this), e.internalHeightChanged().unsubscribeAll(this)
            }));
            for (const e of this.m_dataSources) this.removeSourceFromPriceScale(e), e.destroy && e.destroy();
            null === (e = this._seriesDisplayError) || void 0 === e || e.destroy(), this._destroyed.fire()
        }
        id() {
            return this._id
        }
        bulkActionMacro(e) {
            const t = this._bulkActions;
            t.activeCounter += 1, e(), t.activeCounter -= 1, 0 === t.activeCounter && (this._dataSourcesCollectionChanged.fire(), t.symbolSourceCollectionChanged && this._symbolSourceCollectionChanged.fire(), t.symbolSourceCollectionChanged = !1)
        }
        defaultPriceScale() {
            var e, t;
            const i = null !== (t = null === (e = this.m_mainDataSource) || void 0 === e ? void 0 : e.priceScale()) && void 0 !== t ? t : null;
            if (null !== i) return i;
            const s = this.properties().childs().axisProperties.state();
            return s.autoScale = !0, new Ce(this._model.properties().childs().scalesProperties, s)
        }
        leftPriceScales() {
            return this._leftPriceScales
        }
        rightPriceScales() {
            return this._rightPriceScales
        }
        visibleLeftPriceScales() {
            var e;
            const t = this._model.priceScaleSlotsCount();
            if (this._leftPriceScales.length > t.left) {
                const i = (0, v.moveToHead)(this._leftPriceScales, null === (e = this.mainDataSource()) || void 0 === e ? void 0 : e.priceScale());
                return i.splice(t.left), i
            }
            return this._leftPriceScales
        }
        visibleRightPriceScales() {
            var e;
            const t = this._model.priceScaleSlotsCount();
            if (this._rightPriceScales.length > t.right) {
                const i = (0,
                    v.moveToHead)(this._rightPriceScales, null === (e = this.mainDataSource()) || void 0 === e ? void 0 : e.priceScale());
                return i.splice(t.right), i
            }
            return this._rightPriceScales
        }
        clearSeries(e) {
            const t = this._model.mainSeries();
            for (let i = this.m_dataSources.length - 1; i >= 0; i--) this.m_dataSources[i] === t && this._removeSourceFromCollections(i, e)
        }
        sourcesByGroup() {
            return this._cachedOrderedSources
        }
        dataSourceForId(e) {
            return this._sourcesById.get(e) || null
        }
        changeSourceId(e, t) {
            (0, n.assert)(this.hasDataSource(e));
            const i = e.id();
            e.setId(t), this._sourcesById.delete(i), this._sourcesById.set(t, e), (0, re.isPriceDataSource)(e) && (this._priceSourcesById.delete(i), this._priceSourcesById.set(t, e))
        }
        movePriceScale(e, t, i) {
            const s = this.priceScalePosition(e);
            if (s !== t) this.removePriceScale(e), this._placePriceScale(e, t, i), e.invalidateMargins(), this._invalidateSourcesCache();
            else if (void 0 !== i && "overlay" !== s) {
                const t = "left" === s ? this._leftPriceScales : this._rightPriceScales,
                    r = t.indexOf(e);
                t.splice(r, 1), t.splice(i, 0, e)
            }
        }
        mainDataSource() {
            return this.m_mainDataSource
        }
        isEmpty() {
            return null === this.m_mainDataSource
        }
        recalculatePriceScale(e, t) {
            if (!e) return;
            const i = e.sourcesForAutoscale();
            if ((e.isAutoScale() || e.priceRangeShouldBeRecalculatedOnce()) && i && i.length > 0 && !this.timeScale().isEmpty()) {
                const t = this.timeScale().visibleBarsStrictRange();
                e.recalculatePriceRange(t)
            }
            e.updateAllViews(t)
        }
        onSourceTagsChanged() {
            this._tagsChanged.fire()
        }
        insertDataSource(e, t, i) {
            e.setZorder(i), t || (t = this.findSuitableScale(e)), this._addSourceToCollections(e);
            let s = !1;
            e === this.model().mainSeries() ? (this.m_mainDataSource = this.model().mainSeries(), s = !0) : null === this.m_mainDataSource && (0, re.isPriceDataSource)(e) && (this.m_mainDataSource = e, s = !0), t.addDataSource(e, this._isInInsertManyDataSourcesState), e.setPriceScale(t), t.invalidateMargins(), e.onTagsChanged && e.onTagsChanged().subscribe(this, this.onSourceTagsChanged), s && this._processMainSourceChange(), this._tagsChanged.fire(), (0, re.isPriceDataSource)(e) && this.recalculatePriceScale(t, (0, W.sourceChangeEvent)(e.id())), this._invalidateSourcesCache()
        }
        addDataSource(e, t, i) {
            let s = e.zorder();
            i || ((0, S.isLineTool)(e) && !e.isSpeciallyZOrderedSource() ? (s = null !== this._lastLineDataSourceZOrder ? this._lastLineDataSourceZOrder + 1 : this.newLineToolZOrder(), this._isInInsertManyDataSourcesState && (this._lastLineDataSourceZOrder = s)) : (0, j.isStudy)(e) && !e.isSpeciallyZOrderedSource() && (s = this.newStudyZOrder())), this.insertDataSource(e, t, s)
        }
        removeDataSource(e, t, i) {
            const s = this.m_dataSources.indexOf(e);
            if (-1 === s) return void He.logDebug("removeDataSource: invalid data source");
            this._removeSourceFromCollections(s, !!i), e !== this.m_mainDataSource || t || (this.m_mainDataSource = null);
            const r = e.priceScale();
            this.removeSourceFromPriceScale(e), e.onTagsChanged && e.onTagsChanged().unsubscribe(this, this.onSourceTagsChanged), (0, re.isPriceDataSource)(e) && !t && this._processMainSourceChange(), this._tagsChanged.fire(), r && (0, re.isPriceDataSource)(e) && this.recalculatePriceScale(r, (0, W.sourceChangeEvent)(e.id())), this._invalidateSourcesCache()
        }
        hasDataSource(e) {
            return this._sourcesById.has(e.id())
        }
        hasPriceDataSource(e) {
            return this._priceSourcesById.has(e.id())
        }
        dataSources() {
            return this.m_dataSources
        }
        priceDataSources() {
            return this._priceDataSources
        }
        lollipopDataSources() {
            return this._lollipopDataSources
        }
        symbolSources() {
            return this._symbolSources
        }
        replaceSource(e, t, i) {
            const s = this.m_mainDataSource === e,
                r = e.zorder();
            this.insertDataSource(t, i, r), this.removeDataSource(e, s), this._sourcesById.set(t.id(), t), (0, re.isPriceDataSource)(t) && this._priceSourcesById.set(t.id(), t), s && (this.m_mainDataSource = t, this._processMainSourceChange())
        }
        findSuitableScale(e, t, i) {
            return this._priceScaleSelectionStrategy.findSuitableScale(this, e, t, i)
        }
        createNewPriceScaleIfPossible() {
            return this._priceScaleSelectionStrategy.createNewPriceScaleIfPossible(this)
        }
        canCreateNewPriceScale() {
            return this._priceScaleSelectionStrategy.canCreateNewPriceScale(this)
        }
        isOverlay(e) {
            const t = e.priceScale();
            return null === t || "overlay" === this.priceScalePosition(t)
        }
        recalculate(e) {
            this._leftPriceScales.forEach((t => this.recalculatePriceScale(t, e))), this._rightPriceScales.forEach((t => this.recalculatePriceScale(t, e)));
            for (const t of this.m_dataSources) this.isOverlay(t) && !(0, S.isLineTool)(t) && this.recalculatePriceScale(t.priceScale(), e);
            this.updateAllViews(e), this._model.updatePane(this)
        }
        updateAllViews(e) {
            for (const t of this.m_dataSources) t.updateAllViews(e);
            for (const t of this.model().customSources()) t.updateViewsForPane(this, e)
        }
        updateLollipopViews(e) {}
        priceScalePosition(e) {
            return this._leftPriceScales.includes(e) ? "left" : this._rightPriceScales.includes(e) ? "right" : "overlay"
        }
        createPriceScaleAtPosition(e, t) {
            const i = this.properties().childs().axisProperties.state();
            i.autoScale = !0;
            const s = new Ce(this.model().properties().childs().scalesProperties, i);
            return s.setHeight(this.height()), Ue(s, this._defaultTopMargin(), this._defaultBottomMargin()), this._placePriceScale(s, e, t), s
        }
        removePriceScale(e) {
            e.modeChanged().unsubscribeAll(this), e.priceRangeChanged().unsubscribeAll(this), e.internalHeightChanged().unsubscribeAll(this), e === this._lockedPriceScale && (this._lockedPriceScale = null, this._currentPriceScaleRatio = null);
            const t = this._leftPriceScales.indexOf(e); - 1 !== t && (this._leftPriceScales[t].invalidateMargins(), this._leftPriceScales.splice(t, 1));
            const i = this._rightPriceScales.indexOf(e);
            if (-1 !== i && (this._rightPriceScales[i].invalidateMargins(), this._rightPriceScales.splice(i, 1)), null === e.mainSource()) {
                const t = e.dataSources().length;
                0 !== t && He.logError("Invalid priceScale state: empty mainSource but non-empty data sources=" + t)
            }
            this._onPriceScalesChanged.fire()
        }
        priceScaleIndex(e, t) {
            switch (t) {
                case "left":
                    return this.leftPriceScales().indexOf(e);
                case "right":
                    return this.rightPriceScales().indexOf(e)
            }
        }
        move(e, t, i) {
            const s = e.priceScale();
            this.removeSourceFromPriceScale(e), t.addDataSource(e), e.setPriceScale(t), t.invalidateMargins(), this._processMainSourceChange(), this._invalidateSourcesCache(), e.isIncludedInAutoScale() && (null !== s && this.recalculatePriceScale(s, (0, W.sourceChangeEvent)(e.id())), this.recalculatePriceScale(t, (0, W.sourceChangeEvent)(e.id()))), this._onPriceScalesChanged.fire()
        }
        setZOrders(e) {
            e.forEach(((e, t) => {
                t.setZorder(e)
            })), this._invalidateSourcesCache(), 0 === this._bulkActions.activeCounter && this._dataSourcesCollectionChanged.fire(), this.model().lightUpdate()
        }
        isMainPane() {
            return this.hasDataSource(this.model().mainSeries())
        }
        isLast() {
            const e = this.model().panes();
            return e[e.length - 1] === this
        }
        newStudyZOrder() {
            return (0, Te.newStudyZOrder)(this._priceDataSources)
        }
        newLineToolZOrder(e) {
            return (0, Te.newLineToolZOrder)(this.m_dataSources, e)
        }
        model() {
            return this._model
        }
        containsMainSeries() {
            return this._sourcesById.has(this.model().mainSeries().id())
        }
        applyPriceScaleRatio(e, t) {
            var i;
            null !== this._lockedPriceScale && this._lockedPriceScale !== e || this._currentPriceScaleRatio === t || !this.isMainPane() || null === this._lockedPriceScale && e !== (null === (i = this.mainDataSource()) || void 0 === i ? void 0 : i.priceScale()) || (this._setNewPriceRangeByScaleRatio(e, t, this._mainSourceVisiblePriceRange(e), !0, !0), null !== this._lockedPriceScale ? this._tryToApplyNewPriceScaleRatio() : e.isLog() || this.model().mainSeriesScaleRatioPropertyOnChanged())
        }
        sendToBack(e) {
            const t = this.sourcesByGroup().allExceptSpecialSources();
            this._batchReorder(e, t[0], Te.moveBeforeSource)
        }
        bringToFront(e) {
            const t = this.sourcesByGroup().allExceptSpecialSources();
            this._batchReorder(e, t[t.length - 1], Te.moveAfterSource)
        }
        sendBackward(e) {
            const t = this.sourcesByGroup().allIncludingHidden(),
                i = t.indexOf(e[0]);
            if (0 === i) this.bringToFront(e);
            else {
                const s = t[i - 1];
                this.insertBefore(e, s)
            }
        }
        bringForward(e) {
            const t = this.sourcesByGroup().allExceptSpecialSources(),
                i = t.indexOf(e[e.length - 1]);
            if (i === t.length - 1) this.sendToBack(e);
            else {
                const s = t[i + 1];
                this.insertAfter(e, s)
            }
        }
        insertAfter(e, t) {
            this._batchReorder(e, t, Te.moveAfterSource)
        }
        insertBefore(e, t) {
            this._batchReorder(e, t, Te.moveBeforeSource)
        }
        maximized() {
            return this._maximized
        }
        collapsed() {
            return this._collapsed
        }
        getPriceScaleById(e) {
            const t = this.m_dataSources.find((t => {
                var i;
                return (null === (i = t.priceScale()) || void 0 === i ? void 0 : i.id()) === e
            }));
            return void 0 === t ? null : t.priceScale()
        }
        priceScaleSelectionStrategy() {
            return this._priceScaleSelectionStrategy
        }
        setPriceScaleSelectionStrategy(e) {
            this._priceScaleSelectionStrategy = e, e.apply(this)
        }
        findTargetPriceAxisViews(e, t, i, s) {
            if ((0, f.isDataSource)(e) && this.model().paneForSource(e) !== this) return [];
            const r = e.priceScale();
            if (t === r) return i;
            if (null === r) return [];
            if ("overlay" === this.priceScalePosition(r)) return t === this.defaultPriceScale() ? i : [];
            const n = this.priceScalePosition(t);
            if (n !== this.priceScalePosition(r)) return [];
            const o = "left" === n ? this.leftPriceScales() : this.rightPriceScales();
            return o.indexOf(t) < o.indexOf(r) ? s : []
        }
        actionNoScaleIsEnabled(e) {
            return !(!this.isOverlay(e) && (0, re.isPriceDataSource)(e)) || this._nonOverlayPricesSourcesCount() > 1
        }
        properties() {
            return this._properties
        }
        setPriceAutoScale(e, t) {
            e.setMode({
                autoScale: t
            }), this.timeScale().isEmpty() || this.recalculatePriceScale(e, (0, W.viewportChangeEvent)())
        }
        state(e, t, i, s, r, n) {
            var o, a;
            const l = {
                    sources: [],
                    mainSourceId: null === (o = this.m_mainDataSource) || void 0 === o ? void 0 : o.id(),
                    stretchFactor: this._stretchFactor,
                    leftAxisesState: [],
                    rightAxisesState: [],
                    overlayPriceScales: {},
                    priceScaleRatio: this._currentPriceScaleRatio
                },
                c = new Map,
                h = e => {
                    if (c.has(e)) return c.get(e);
                    let o = null;
                    const a = i && !e.isSavedInStudyTemplates() || !e.state || (0, S.isLineTool)(e) && n || !e.isSavedInChart(Boolean(t)) || !(o = e.state(t, r)) || s && (0, S.isLineTool)(e) && e.isActualSymbol && !e.isActualSymbol() || e.isPhantom() ? null : o;
                    return c.set(e, a), a
                };
            if (e) {
                l.sources = [];
                for (let e = 0; e < this.m_dataSources.length; e++) {
                    const t = h(this.m_dataSources[e]);
                    null !== t && l.sources.push(t)
                }
            }
            const d = e => null !== c.get(e),
                u = e => !n || !(0, S.isLineTool)(e);
            l.leftAxisesState = this._leftPriceScales.map((e => ({
                state: e.state(),
                sources: e.dataSources().filter(d).filter(u).map((e => e.id()))
            }))), l.rightAxisesState = this._rightPriceScales.map((e => ({
                state: e.state(),
                sources: e.dataSources().filter(d).filter(u).map((e => e.id()))
            }))), l.overlayPriceScales = {};
            for (const e of this.m_dataSources)
                if (this.isOverlay(e) && e.isSavedInChart(Boolean(t))) {
                    const t = e.priceScale();
                    l.overlayPriceScales[e.id()] = null !== (a = null == t ? void 0 : t.state()) && void 0 !== a ? a : null
                } return l
        }
        restoreState(e, t, i, s, r, o, a) {
            r = r || {}, e.stretchFactor && (this._stretchFactor = e.stretchFactor), s = null != s ? s : this._model.mainSeries().id();
            const l = {};
            if (e.sources) {
                const n = e.sources.filter((e => {
                        var t;
                        return !!e && ("MainSeries" === e.type || (!(null === (t = e.points) || void 0 === t ? void 0 : t.some((e => null === e.time_t || !isFinite(e.time_t)))) || (He.logNormal("Dropped invalid " + e.type + ". Reason: non-numeric point time"), !1)))
                    })),
                    c = n.findIndex(Ie.isMainSeriesState); - 1 !== c && this.model().mainSeries().setObsoleteZOrder(n[c].zorder), i < 3 && (0, Te.reorderDataSourcesStateZOrder)(n);
                const h = -1 !== this.m_dataSources.indexOf(this._model.mainSeries());
                this.clearSeries(Boolean(a)), this.m_mainDataSource = null, h && this._addSourceToCollections(this._model.mainSeries(), a), (() => {
                    const t = n.find((t => t.id === e.mainSourceId));
                    if (void 0 === t) return void He.logWarn("There is no main source with id " + e.mainSourceId + ", total sources=" + n.length);
                    if (!window.TradingView[t.type] || !(0, he.isLineToolName)(t.type)) return void He.logNormal("The type of main source is not line tool - fix is unnecessary");
                    let i = null;
                    for (const e of n)
                        if (!window.TradingView[t.type] || !(0, he.isLineToolName)(e.type)) {
                            if (null !== i) return void He.logWarn("Pane contains more than 1 possibly main sources - auto fix cannot be applied");
                            i = e
                        } if (null === i) return void He.logWarn("Pane contains only line tools - possible we need to remove this pane?");
                    const s = e.mainSourceId;
                    let r = 0;
                    e.mainSourceId = i.id, n.forEach((e => {
                        e.ownerSource === s && (e.ownerSource = null == i ? void 0 : i.id, r += 1)
                    })), He.logNormal("Auto fix broken pane is applied, changed line tools=" + r + ", changed from=" + s + " to=" + i.id)
                })();
                for (const e of n)
                    if ("study_Sessions" === e.type) {
                        this.model().sessions().restoreOldState(e, t);
                        break
                    } for (const e of n) "study_Sessions" !== e.type && (null === this._model.dataSourceForId(e.id) || "MainSeries" === e.type ? (l[e.id] = e.ownerSource, (0, Ie.isMainSeriesState)(e) ? this._restoreMainSeries(e, t, h, r, o, a) : (0, Ie.isStudyState)(e) ? this.restoreStudy(e, t, s, r, a, !0) : (0, Ie.isLineToolState)(e) ? (e.state && (e.state.zOrderVersion = 2),
                    this.restoreLineTool(e, t, void 0, a)) : "ChartEventsSource" === e.type && this._restoreSpecialSource(e, t, a)) : He.logError("Duplicate id while restoring pane: " + e.type + "," + e.id))
            }
            const c = new Set,
                h = (e, t) => {
                    e.priceScale() !== t && (this.removeSourceFromPriceScale(e), e.setPriceScale(t), t.addDataSource(e))
                },
                d = (e, t, i) => {
                    if (c.has(e)) return;
                    c.add(e);
                    const s = i.m_showSymbolLabels;
                    void 0 !== s && e === this.model().mainSeries() && this.model().properties().childs().scalesProperties.childs().showSymbolLabels.setValue(s), this._model.children(e, !0).forEach((e => d(e, t, i))), h(e, t)
                },
                u = e => {
                    const t = (0, B.defaults)("chartproperties").paneProperties.axisProperties,
                        i = new Ce(this.model().properties().childs().scalesProperties, t);
                    return i.restoreState(e.state), i.setHeight(this._height), e.sources.forEach((e => {
                        const s = this.dataSourceForId(e);
                        s && d(s, i, t)
                    })), 0 === i.dataSources().length ? null : i
                },
                p = e => e.map(u).filter((e => null !== e));
            let _;
            if (e.leftAxisesState) _ = p(e.leftAxisesState);
            else {
                const t = u({
                    state: e.leftAxisState,
                    sources: e.leftAxisSources
                });
                _ = null !== t ? [t] : []
            }
            let m;
            if (this._leftPriceScales.slice().forEach((e => this.removePriceScale(e))), this._leftPriceScales = [], _.forEach((e => this._placePriceScale(e, "left"))), e.rightAxisesState) m = p(e.rightAxisesState);
            else {
                const t = u({
                    state: e.rightAxisState,
                    sources: e.rightAxisSources
                });
                m = null !== t ? [t] : []
            }
            this._rightPriceScales.slice().forEach((e => this.removePriceScale(e))), this._rightPriceScales = [], m.forEach((e => this._placePriceScale(e, "right"))), this._currentPriceScaleRatio = e.priceScaleRatio || e.leftPriceScaleRatio || e.rightPriceScaleRatio || null;
            const g = new Map;
            for (const t of this.m_dataSources) {
                if (c.has(t)) continue;
                let i;
                if (e.overlayPriceScales && e.overlayPriceScales[t.id()]) {
                    let s = e.overlayPriceScales[t.id()];
                    g.has(null == s ? void 0 : s.id) ? i = g.get(null == s ? void 0 : s.id) : (s = (0, n.ensure)(s), i = new Ce(this._model.properties().childs().scalesProperties), i.setHeight(this._height), s.m_isAutoScale = !0, s.m_isLog = !1, s.m_isPercentage = !1, s.m_isLockScale = !1, i.restoreState(s), g.set(s.id, i))
                } else i = new Ce(this._model.properties().childs().scalesProperties), i.setHeight(this._height);
                h(t, i)
            }
            for (const e of Object.keys(l)) {
                const t = l[e],
                    i = this.dataSourceForId(e);
                t && i && null === i.ownerSource() && i.setOwnerSource(this.dataSourceForId(t))
            }
            if (e.mainSourceId && !this.containsMainSeries() && (this.m_mainDataSource = this.dataSourceForId(e.mainSourceId)), !this.m_mainDataSource)
                for (const e of this.m_dataSources)
                    if ((0, re.isPriceDataSource)(e)) {
                        this.m_mainDataSource = e;
                        break
                    } for (const e of this.m_dataSources)(0, S.isLineTool)(e) ? (e.ownerSource() || e.setOwnerSource(this.mainDataSource()), e.isFixed() && e.restoreFixedPoint()) : (0, j.isStudy)(e) && !e.ownerSource() && e.isLinkedToSeries() && e.setOwnerSource(this.model().mainSeries());
            this._updateMargins(), this._cachedOrderedSources.clear()
        }
        onPriceScalesChanged() {
            return this._onPriceScalesChanged
        }
        setPaneSize(e) {
            let t;
            switch (e) {
                case "large":
                    t = 1;
                    break;
                case "medium":
                    t = .6;
                    break;
                case "small":
                    t = .3;
                    break;
                case "tiny":
                    t = .15;
                    break;
                default:
                    throw new Error("Unknown size enum value: " + e)
            }
            this._stretchFactor = 1e3 * t
        }
        stretchFactor() {
            return this._stretchFactor
        }
        setStretchFactor(e) {
            this._stretchFactor = e
        }
        customSources(e) {
            return this.model().customSources(e)
        }
        createDrawingsCaches() {
            se.ExecutionsPositionController.recreateOrderedByBarsSourcesCache(this)
        }
        clearDrawingCaches() {
            se.ExecutionsPositionController.clearOrderedByBarsSourcesCache()
        }
        executionsPositionController() {
            return this._executionsPositionController || (this._executionsPositionController = new se.ExecutionsPositionController(this)), this._executionsPositionController
        }
        width() {
            return this._width
        }
        height() {
            return this._height
        }
        setHeight(e) {
            if (this._height !== e) {
                this._height = e, this._leftPriceScales.forEach((t => t.setHeight(e))), this._rightPriceScales.forEach((t => t.setHeight(e)));
                for (let t = 0; t < this.m_dataSources.length; t++) {
                    const i = this.m_dataSources[t];
                    this.isOverlay(i) && i.priceScale() && (0, n.ensureNotNull)(i.priceScale()).setHeight(e)
                }
                this.updateAllViews((0, W.viewportChangeEvent)()), this._sizeChanged.fire()
            }
        }
        setWidth(e) {
            this._width !== e && (this._width = e, this.updateAllViews((0, W.viewportChangeEvent)()), this._sizeChanged.fire())
        }
        onSizeChanged() {
            return this._sizeChanged
        }
        onTagsChanged() {
            return this._tagsChanged
        }
        onDestroyed() {
            return this._destroyed
        }
        dataSourcesCollectionChanged() {
            return this._dataSourcesCollectionChanged
        }
        symbolSourceCollectionChanged() {
            return this._symbolSourceCollectionChanged
        }
        symbolSourceResolved() {
            return this._symbolSourceResolved
        }
        symbolSourceResolvingActive() {
            return this._symbolSourceResolvingActive
        }
        sourcePropertiesChanged() {
            return this._sourcePropertiesChanged
        }
        sourceZOrderChanged() {
            return this._sourcesZOrderChanged
        }
        lineToolsForArea(e) {
            const t = this.height(),
                i = this.width(),
                s = this.logicalRectToPixels(e);
            return [...this.m_dataSources, ...this.model().multiPaneSources(this)].filter(S.isLineTool).filter((e => (e.paneViews(this) || []).some((e => {
                const r = e.renderer(t, i);
                return r && r.doesIntersectWithBox && r.doesIntersectWithBox(s)
            }))))
        }
        logicalRectToPixels(e) {
            const t = this.defaultPriceScale(),
                i = this.timeScale(),
                s = (0, n.ensureNotNull)((0, n.ensureNotNull)(t.mainSource()).firstValue()),
                r = t.priceToCoordinate(e.p1.price, s),
                a = i.indexToCoordinate(e.p1.index),
                l = t.priceToCoordinate(e.p2.price, s),
                c = i.indexToCoordinate(e.p2.index),
                h = new o.Point(Math.min(a, c), Math.min(r, l)),
                d = new o.Point(Math.max(a, c), Math.max(r, l));
            return (0, o.box)(h, d)
        }
        timeScale() {
            return this._timeScale
        }
        restoreLineTool(e, t, i, s, r) {
            var o, a, l, c, h, d, u, p, _, m, g;
            delete e.state.lastUpdateTime, e.state.intervalsVisibilities = (0, Ve.mergeIntervalVisibilitiesDefaults)(e.state.intervalsVisibilities), i = void 0 === i || i, De.LineToolElliott.migrateState(e), "LineToolGannComplex" !== (g = e).type || void 0 !== g.version && 1 !== g.version || (g.type = "LineToolGannFixed"), Array.isArray(e.positionPercents) && (e.positionPercents = e.positionPercents[0]);
            const f = e.type,
                v = e.id,
                y = e.state,
                b = i ? e.zorder : this.newLineToolZOrder();
            (0, n.assert)((0, he.isLineToolName)(f), "invalid data source type:" + f + " (expected to be a Line Tool)");
            let w, P, C = null;
            if ((0, Ie.isStudyLineToolState)(e)) {
                C = this._model.studyVersioning();
                const t = C.patchPointsBasedStudyState(e);
                e = t;
                const i = t.metaInfo;
                Object.assign(i, te.StudyMetaInfo.parseIdString(null == i ? void 0 : i.fullId));
                const s = C.updateMetaInfo(i) || i;
                P = (0, S.createStudyLineToolProperties)(f, i, s, y, C), w = (0, S.createLineTool)(f, this._model, P, s, !0)
            } else P = (0, S.createLineToolProperties)(f, y, this._model), t ? null === (o = P.child("fixedSize")) || void 0 === o || o.setValue(!1) : null === (a = P.child("fixedSize")) || void 0 === a || a.setValue(!0), w = (0, S.createLineTool)(f, this._model, P, null, !0);
            w.setId(v), w.linkKey().setValue(e.linkKey || null);
            const x = e.alertId;
            x && w.canHasAlert() && N.enabled("alerts") && !this._model.readOnly() && !this._model.isJustClonedChart() && w.setAlert(x);
            let T = null !== (l = e.indexes) && void 0 !== l ? l : [];
            if (T = T.slice(0, null !== (h = null === (c = e.points) || void 0 === c ? void 0 : c.length) && void 0 !== h ? h : T.length), w.isFixed() ? void 0 !== e.positionPercents ? w.restorePositionPercents(e.positionPercents) : w.restorePositionPercents({
                    x: .5,
                    y: .5
                }) : e.points && w.restorePoints(e.points, T, t), w instanceof Be.LineToolBarsPattern || w instanceof Re.LineToolCallout || w instanceof Ne.LineToolTrendAngle || w instanceof Oe.LineToolGhostFeed || w instanceof Fe.LineToolParallelChannel) null === (u = (d = w).restoreData) || void 0 === u || u.call(d, e);
            else if (t && (0, Ie.isStudyLineToolState)(e) && w.restoreData) {
                const t = e;
                C && (t.graphics = C.patchPointsBasedStudyData(t.metaInfo, t.graphics)), null === (p = w.restoreData) || void 0 === p || p.call(w, t)
            }
            const I = null == e.version ? 1 : e.version,
                M = null == w.version ? 1 : w.version;
            if (I !== M && (null === (m = (_ = w).migrateVersion) || void 0 === m || m.call(_, I, M, {
                    pane: this,
                    model: this._model,
                    properties: P
                })), void 0 !== b && w.setZorder(b), r)(0, S.prepareLineToolPropertiesByOwnerSource)(w.properties(), r), w.setOwnerSource(r);
            else {
                const t = e.ownerSource ? this.dataSourceForId(e.ownerSource) : null;
                w.setOwnerSource(t)
            }
            return void 0 !== e.userEditEnabled && w.setUserEditEnabled(e.userEditEnabled), void 0 !== e.isSelectionEnabled && w.setSelectionEnabled(e.isSelectionEnabled), this._addSourceToCollections(w, s), this._cachedOrderedSources.clear(), w
        }
        restoreStudy(e, t, i, s, r, n) {
            var o;
            if (t && void 0 === e.data && void 0 === e.nonSeriesData && void 0 === e.indexes) return He.logError("Cannot restore (skipping) study without data " + e.id + ", " + e.metaInfo.id), null;
            const a = e.id,
                l = e.state,
                c = e.zorder;
            i = null != i ? i : this._model.mainSeries().id();
            const h = (null !== (o = e.parentSources) && void 0 !== o ? o : e.ownerSource ? [e.ownerSource] : []).filter((e => e !== i));
            let d = (0, ie.clone)(e.metaInfo);
            if (Object.assign(d, te.StudyMetaInfo.parseIdString(d.id)), function(e) {
                    return "Script$TV_EARNINGS@tv-scripting" === e || "Script$TV_DIVIDENDS@tv-scripting" === e || "Script$TV_SPLITS@tv-scripting" === e || "ESD$TV_EARNINGS@tv-scripting" === e || "ESD$TV_DIVIDENDS@tv-scripting" === e || "ESD$TV_SPLITS@tv-scripting" === e || "Earnings@tv-basicstudies" === e || "Dividends@tv-basicstudies" === e || "Splits@tv-basicstudies" === e || "BarSetContinuousRollDates@tv-corestudies" === e
                }(d.id) && !t) return He.logNormal("Skipping study " + d.id), null;
            let u = l;
            const p = this._model.studyVersioning(),
                _ = p.patchPropsStateAndMetaInfo(u, d, {
                    oldShowStudyLastValueProperty: t && !(null == s ? void 0 : s.showStudyLastValueProperty)
                });
            u = _.propsState, d = _.metaInfo;
            const m = new P.StudyStub(this._model, e, d.shortDescription);
            let g;
            m.setId(a), m.setZorder(c);
            const f = i => {
                m.setStatus({
                    type: Ae.StudyStatusType.Undefined
                });
                const s = i || new te.StudyMetaInfo(d),
                    r = Ee.instance(this._model),
                    n = n => {
                        var o;
                        const l = (0, C.prepareStudyPropertiesForLoadChart)(d, i, u, p),
                            c = (0, j.createStudy)(this._model, l, n, s);
                        if (c.setId(a), c.setOwnFirstValue(null !== (o = e.ownFirstValue) && void 0 !== o ? o : null), t) {
                            const t = e,
                                {
                                    data: i,
                                    nsData: s,
                                    indexes: r
                                } = p.patchStudyData(d, t.data, t.nonSeriesData, t.indexes);
                            c.restoreData(i, s, r)
                        }
                        this._model.replaceStudyStub(m, c) || (g = c), r.add(a, c)
                    };
                if (h.length > 0) {
                    const e = h.map((e => r.get(e)));
                    Promise.all(e).then(n)
                } else n([])
            };
            if (t) f(null);
            else {
                let e = null;
                0;
                const t = e => {
                    const t = p.updateMetaInfoAsync(e);
                    t.sync ? f(t.result) : t.result.then(f).catch((e => m.setFailed("error: " + e)))
                };
                e ? e.then(t) : t(d)
            }
            const v = null != g ? g : m;
            if (v) {
                v.setZorder(c);
                const t = e.metaInfo.linkedToSeries ? this._model.mainSeries() : h.length ? this.dataSourceForId(h[0]) : null;
                v.setOwnerSource(t), this._addSourceToCollections(v, r), this._processMainSourceChange()
            }
            return this._cachedOrderedSources.clear(), v
        }
        clipboardLineToolOwnerSource(e) {
            const t = this.dataSourceForId(e);
            if (null !== t) {
                const e = t.ownerSource();
                if (null !== e && null !== e.firstValue()) return e
            }
            const i = this.mainDataSource();
            if (null !== i && null !== i.firstValue()) return i;
            for (const e of this.dataSources())
                if ((0, re.isPriceDataSource)(e) && null !== e.firstValue()) return e;
            return null
        }
        realignLineTools(e) {
            var t;
            let i = !1;
            for (const s of this.m_dataSources) !(0, S.isLineTool)(s) || void 0 !== e && (null === (t = null == s ? void 0 : s.ownerSource()) || void 0 === t ? void 0 : t.symbolSource()) !== e && (0, _e.isActingAsSymbolSource)(e) || (s.realign(), s.updateAllViews((0, W.sourceChangeEvent)(s.id())), i = !0);
            return i && this._invalidateSourcesCache(), i
        }
        startScalePrice(e, t) {
            e.startScale(t)
        }
        scalePriceTo(e, t) {
            e.scaleTo(t), this.updateAllViews((0, W.viewportChangeEvent)())
        }
        endScalePrice(e) {
            e.endScale()
        }
        startScrollPrice(e, t) {
            e.startScroll(t)
        }
        scrollPriceTo(e, t) {
            e.scrollTo(t), this.updateAllViews((0, W.viewportChangeEvent)())
        }
        endScrollPrice(e) {
            e.endScroll()
        }
        resetPriceScale(e) {
            const t = this.timeScale().visibleBarsStrictRange();
            e.isLockScale() || e.setMode({
                autoScale: !0
            }), e.recalculatePriceRange(t), this.updateAllViews((0, W.viewportChangeEvent)())
        }
        restorePriceScaleState(e, t) {
            e.restoreState(t), this.updateAllViews((0, W.viewportChangeEvent)())
        }
        beginInsertManyLineDataSources() {
            this._isInInsertManyDataSourcesState = !0, this._lastLineDataSourceZOrder = null
        }
        endInsertManyLineDataSources() {
            this._isInInsertManyDataSourcesState = !1, this._lastLineDataSourceZOrder = null
        }
        removeSourceFromPriceScale(e) {
            const t = e.priceScale();
            if (null !== t) {
                const i = t.dataSources();
                i.indexOf(e) >= 0 && t.removeDataSource(e), 0 === i.length && this.removePriceScale(t)
            }
        }
        _invalidateSourcesCache() {
            this._cachedOrderedSources.clear(), this._leftPriceScales.forEach((e => e.invalidateSourcesCache())), this._rightPriceScales.forEach((e => e.invalidateSourcesCache()))
        }
        _processMainSourceChange() {
            let e = !1;
            if (null === this.m_mainDataSource)
                for (const t of this.m_dataSources)
                    if ((0, re.isPriceDataSource)(t) && !this.isOverlay(t) && (!(0,
                            j.isStudy)(t) || !t.isLinkedToSeries())) {
                        this.m_mainDataSource = t, e = !0;
                        break
                    } if (this.m_mainDataSource && e) {
                let e = this.m_dataSources.filter(S.isLineTool);
                e = (0, ne.sortSources)(e);
                for (const t of e) this.move(t, (0, n.ensureNotNull)(this.m_mainDataSource.priceScale()), !0)
            } else if (!this.m_mainDataSource || this.isOverlay(this.m_mainDataSource) && 0 === this._nonOverlayPricesSourcesCount()) {
                let e = null;
                if (this.m_dataSources.includes(this._model.mainSeries())) e = this._model.mainSeries();
                else
                    for (const t of this.m_dataSources)
                        if ((0, re.isPriceDataSource)(t) && this.isOverlay(t) && t.showInObjectTree()) {
                            e = t;
                            break
                        } if (null !== e) {
                    const t = this.m_mainDataSource === e;
                    this.m_mainDataSource = e;
                    const i = this.createNewPriceScaleIfPossible();
                    if (t && e === this._model.mainSeries()) {
                        const t = (0, n.ensureNotNull)(e.priceScale());
                        this._model.children(e, !0).forEach((e => {
                            this.removeSourceFromPriceScale(e), i.addDataSource(e), e.setPriceScale(i)
                        })), this.removePriceScale(t)
                    }
                    this.move(e, i, !0), this.recalculatePriceScale(e.priceScale(), (0, W.globalChangeEvent)())
                }
            }
        }
        _addSourceToCollections(e, t) {
            this.m_dataSources.push(e), this._sourcesById.set(e.id(), e), this._invalidateSourcesCache();
            const i = () => {
                this._sourcePropertiesChanged.fire(e)
            };
            e.properties().subscribe(this, i), e.zOrderChanged().subscribe(this, (t => this._sourcesZOrderChanged.fire(e, t))), (0, S.isLineTool)(e) && (e.normalizedPointsChanged().subscribe(this, i), e.fixedPointChanged().subscribe(this, i), e.hasAlert.subscribe(i), e.sharingMode().subscribe(i), e.linkKey().subscribe(i), this._sourceWatchedValuesSubscriptions.set(e.id(), i));
            const s = (0, _e.isSymbolSource)(e) ? e : null;
            (0, re.isPriceDataSource)(e) && (this._priceSourcesById.set(e.id(), e), e.currencyChanged().subscribe(this, (() => this._invalidateSourcesCache())), e.unitChanged().subscribe(this, (() => this._invalidateSourcesCache())), this._priceDataSources.push(e), null !== s && (this._symbolSources.push(s), s.symbolResolved().subscribe(this, (() => this._symbolSourceResolved.fire(e))), s.symbolResolvingActive().subscribe(this._recalcSymbolSourceResolvingActive), s.symbolHibernated().subscribe(this._onSymbolSourceCollectionChanged), this._recalcSymbolSourceResolvingActive(), this._onSymbolSourceCollectionChanged())), e.isMultiPaneAvailable() && this.model().addMultiPaneSource(e), t || 0 !== this._bulkActions.activeCounter || this._dataSourcesCollectionChanged.fire()
        }
        _removeSourceFromCollections(e, t) {
            const i = this.m_dataSources[e];
            i.properties().unsubscribeAll(this), i.zOrderChanged().unsubscribeAll(this), this.m_dataSources.splice(e, 1), this._sourcesById.delete(i.id());
            const s = i.id();
            if ((0, S.isLineTool)(i) && (i.normalizedPointsChanged().unsubscribeAll(this), i.fixedPointChanged().unsubscribeAll(this), this._sourceWatchedValuesSubscriptions.has(s))) {
                const e = this._sourceWatchedValuesSubscriptions.get(s);
                i.hasAlert.unsubscribe(e), i.linkKey().unsubscribe(e)
            }
            this._invalidateSourcesCache();
            const r = (0, _e.isSymbolSource)(i) ? i : null;
            (0, re.isPriceDataSource)(i) && (this._priceSourcesById.delete(i.id()), i.currencyChanged().unsubscribeAll(this), i.unitChanged().unsubscribeAll(this), (0, v.removeItemFromArray)(this._priceDataSources, i),
                null !== r && ((0, v.removeItemFromArray)(this._symbolSources, r), r.symbolResolved().unsubscribeAll(this), r.symbolResolvingActive().unsubscribe(this._recalcSymbolSourceResolvingActive), r.symbolHibernated().unsubscribe(this._onSymbolSourceCollectionChanged), this._recalcSymbolSourceResolvingActive(), this._onSymbolSourceCollectionChanged())), i.isMultiPaneAvailable() && this.model().removeMultiPaneSource(i), t || 0 !== this._bulkActions.activeCounter || this._dataSourcesCollectionChanged.fire()
        }
        _recalculatePriceScaleByScaleRatio(e) {
            this.isMainPane() && e === this._lockedPriceScale && (null !== this._currentPriceScaleRatio ? this._applyOldScaleRatioToPriceScale() : this._tryToApplyNewPriceScaleRatio())
        }
        _defaultBottomMargin() {
            return .01 * this.properties().childs().bottomMargin.value()
        }
        _defaultTopMargin() {
            return .01 * this.properties().childs().topMargin.value()
        }
        _updateMargins() {
            const e = this._defaultTopMargin(),
                t = this._defaultBottomMargin();
            for (const i of this._leftPriceScales) Ue(i, e, t);
            for (const i of this._rightPriceScales) Ue(i, e, t);
            for (const i of this.m_dataSources)
                if (this.isOverlay(i)) {
                    const s = i.priceScale();
                    null !== s && (Ue(s, e, t), this.recalculatePriceScale(s, (0, W.viewportChangeEvent)()))
                } for (const e of this._leftPriceScales) this.recalculatePriceScale(e, (0, W.viewportChangeEvent)());
            for (const e of this._rightPriceScales) this.recalculatePriceScale(e, (0, W.viewportChangeEvent)());
            this.updateAllViews((0, W.viewportChangeEvent)())
        }
        _batchReorder(e, t, i) {
            i(this.sourcesByGroup().allExceptSpecialSources(), e, t), this._invalidateSourcesCache(), this._dataSourcesCollectionChanged.fire(), this.model().fullUpdate()
        }
        _placePriceScale(e, t, i) {
            if ("overlay" === t) return void e.invalidateMargins();
            const s = "left" === t ? this._leftPriceScales : this._rightPriceScales,
                r = void 0 === i ? s.length : i;
            s.splice(r, 0, e), e.modeChanged().subscribe(this, this._onPriceScaleModeChanged.bind(this, e)), e.internalHeightChanged().subscribe(this, this._recalculatePriceScaleByScaleRatio.bind(this, e)), e.priceRangeChanged().subscribe(this, this._recalculateTimeScaleByScaleRatio.bind(this, e)), e.priceRangeChanged().subscribe(this, this._onPriceScaleSetMinMaxPriceRange.bind(this, e)), e.isLockScale() && ((0, n.assert)(null === this._lockedPriceScale), this._lockedPriceScale = e, this._currentPriceScaleRatio = null), e.invalidateMargins(), this._onPriceScalesChanged.fire()
        }
        _onPriceScaleModeChanged(e, t, i) {
            if (i.lockScale && (this._lockedPriceScale !== e && null !== this._lockedPriceScale && this._lockedPriceScale.setMode({
                    lockScale: !1
                }), this._lockedPriceScale = e, this._currentPriceScaleRatio = (0, xe.scaleRatio)(this.timeScale(), e)), t.lockScale && !i.lockScale && (this._lockedPriceScale = null, this._currentPriceScaleRatio = null), t.percentage === i.percentage && t.indexedTo100 === i.indexedTo100) return;
            const s = this.timeScale().visibleBarsStrictRange();
            null !== s && (e.recalculatePriceRange(s), e.updateAllViews((0, W.viewportChangeEvent)()))
        }
        _applyOldScaleRatioToPriceScale() {
            this._isRecalculatingScales || null === this._currentPriceScaleRatio || null === this._lockedPriceScale || (this._isRecalculatingScales = !0,
                this._setNewPriceRangeByScaleRatio(this._lockedPriceScale, this._currentPriceScaleRatio, this._mainSourceVisiblePriceRange(this._lockedPriceScale)), this._isRecalculatingScales = !1)
        }
        _setNewPriceRangeByScaleRatio(e, t, i, s, r) {
            const n = (0, xe.priceRangeByScaleRatio)(e, this.timeScale().barSpacing(), t);
            e.setPriceRange(null !== n ? n : i, s, r)
        }
        _applyOldScaleRatioToTimeScale() {
            this._isRecalculatingScales || null === this._currentPriceScaleRatio || (this._isRecalculatingScales = !0, this._setNewBarSpacingByScaleRatio(), this._isRecalculatingScales = !1)
        }
        _tryToApplyNewPriceScaleRatio() {
            const e = (0, n.ensureNotNull)(this._lockedPriceScale),
                t = (0, xe.scaleRatio)(this.timeScale(), e);
            this._currentPriceScaleRatio === t || e.isLog() || (this._currentPriceScaleRatio = t, this.model().mainSeriesScaleRatioPropertyOnChanged())
        }
        _recalculateTimeScaleByScaleRatio(e) {
            e === this._lockedPriceScale && (null !== this._currentPriceScaleRatio ? this._applyOldScaleRatioToTimeScale() : this._tryToApplyNewPriceScaleRatio())
        }
        _setNewBarSpacingByScaleRatio() {
            const e = this.timeScale().getValidBarSpacing((0, xe.barSpacingByScaleRatio)((0, n.ensureNotNull)(this._lockedPriceScale), this._currentPriceScaleRatio));
            this.timeScale().isValidBarSpacing(e) && this.timeScale().setBarSpacing(e)
        }
        _mainSourceVisiblePriceRange(e) {
            const t = this.timeScale().visibleBarsStrictRange();
            return null !== t ? (0, n.ensureNotNull)((0, n.ensureNotNull)(e.mainSource()).priceRange(t.firstBar(), t.lastBar())) : new de.PriceRange(-.5, .5)
        }
        _setMinMaxPriceRange() {
            const e = (0, n.ensureNotNull)(this._lockedPriceScale),
                t = (0, xe.priceRangeByScaleRatio)(e, this.timeScale().maxBarSpacing(), this._currentPriceScaleRatio),
                i = (0, xe.priceRangeByScaleRatio)(e, this.timeScale().minBarSpacing(), this._currentPriceScaleRatio);
            null !== t && e.setMaxPriceRange(t), null !== i && e.setMinPriceRange(i)
        }
        _onPriceScaleSetMinMaxPriceRange(e) {
            e === this._lockedPriceScale && this._setMinMaxPriceRange()
        }
        _nonOverlayPricesSourcesCount() {
            return this.m_dataSources.filter((e => (!(0, j.isStudy)(e) || !e.isLinkedToSeries()) && ((0, re.isPriceDataSource)(e) && e.showInObjectTree() && !this.isOverlay(e)))).length
        }
        _restoreMainSeries(e, t, i, s, r, n) {
            const o = e.id,
                a = e.state;
            if (a && r && (a.style = r.style || a.style, a.interval = r.interval || a.interval, r.symbol && r.symbol !== a.symbol && (a.symbol = r.symbol, delete a.currencyId, delete a.unitId)), a && ["candleStyle", "hollowCandleStyle", "haStyle"].forEach((e => {
                    a[e] && (a[e].wickUpColor = a[e].wickUpColor || a[e].wickColor, a[e].wickDownColor = a[e].wickDownColor || a[e].wickColor)
                })), a && (a.statusViewStyle = a.statusViewStyle || {}, !a.statusViewStyle.symbolTextSource)) {
                const e = !!a.statusViewStyle.showSymbolAsDescription;
                a.statusViewStyle.symbolTextSource = e ? "ticker" : "description"
            }
            if (a) {
                a.extendedHours ? a.sessionId = "extended" : a.sessionId || (a.sessionId = "regular"), delete a.extendedHours, (0, We.allChartStyles)().includes(a.style) || (a.style = 2);
                const e = a.lineStyle.styleType;
                delete a.lineStyle.styleType, 0 === e && (a.style = 14, a.lineWithMarkersStyle = (0, ie.clone)(a.lineStyle)), 1 === e && (a.style = 15, a.steplineStyle = (0, ie.clone)(a.lineStyle))
            }
            if (!i) {
                const e = this._model.mainSeries();
                this._model.mainPane().removeDataSource(e, !1, n),
                    this._addSourceToCollections(e, n)
            }
            const l = this.model().mainSeries(),
                c = l.properties().childs();
            this.m_mainDataSource = l;
            const h = a && a.style ? a.style : void 0;
            if (6 === h && "ATR" === c.pnfStyle.childs().inputs.childs().style.value() ? c.pnfStyle.childs().inputs.childs().style.setValueSilently("Traditional") : 4 === h && "ATR" === c.renkoStyle.childs().inputs.childs().style.value() && c.renkoStyle.childs().inputs.childs().style.setValueSilently("Traditional"), a && !a.hasOwnProperty("showSessions") && (a.showSessions = !1), a && void 0 === a.settlementAsClose && (a.settlementAsClose = !1), a && t && (a.showCountdown = !1), a && (t && !("showSeriesLastValueProperty" in s) && "showLastValue" in a && this._model.properties().childs().scalesProperties.childs().showSeriesLastValue.setValue(a.showLastValue), delete a.showLastValue), a) {
                const t = {
                        haStyle: (0, O.chartStyleStudyId)(8, !0),
                        renkoStyle: (0, O.chartStyleStudyId)(4, !0),
                        pbStyle: (0, O.chartStyleStudyId)(7, !0),
                        kagiStyle: (0, O.chartStyleStudyId)(5, !0),
                        pnfStyle: (0, O.chartStyleStudyId)(6, !0),
                        rangeStyle: (0, O.chartStyleStudyId)(11, !0)
                    },
                    i = this._model.studyVersioning(),
                    s = l.styleStudyInfos(),
                    r = Object.keys(Me.SYMBOL_STRING_DATA);
                for (let n = 0; n < r.length; n++) {
                    const o = Me.STYLE_SHORT_NAMES[r[n]] + "Style",
                        l = o in e ? e[o].studyId : t[o],
                        c = a[o];
                    if (null == c) continue;
                    const h = c.inputs,
                        d = te.StudyMetaInfo.parseIdString(l),
                        u = s[o].studyId,
                        p = te.StudyMetaInfo.parseIdString(u),
                        _ = i.updateStudyInputs(d.id, d.version, p.version, h, null);
                    c.inputs = _
                }
            }
            const d = l.sessionId();
            l.restoreState(e, t), this.changeSourceId(l, o), l.sessionId() !== d && c.sessionId.listeners().fire(c.sessionId)
        }
        _restoreSpecialSource(e, t, i) {}
    }
    var Ge = i(61345),
        qe = i(30888),
        $e = i(12500);
    class Ye {
        constructor(e, t) {
            (0, n.assert)(e <= t, "The left value should be greater than or equal to the right value"), this._left = e, this._right = t
        }
        left() {
            return this._left
        }
        right() {
            return this._right
        }
        length() {
            return this._right - this._left + 1
        }
        contains(e, t) {
            return e < this._left - .5 ? !0 === t && 1 : e > this._right + .5 ? !0 === t && 2 : !0 !== t || 0
        }
        before(e) {
            return e < this._left - .5
        }
        after(e) {
            return e > this._right + .5
        }
        intersects(e) {
            return !(this.after(e.left()) || this.before(e.right()))
        }
        equals(e) {
            return this._left === e.left() && this._right === e.right()
        }
        static compare(e, t) {
            return null === e || null === t ? e === t : e.equals(t)
        }
    }
    var Ke = i(83669);
    const Ze = (0, X.getLogger)("Chart.TimePoints");

    function Xe(e, t) {
        return null === e || null === t ? e === t : e.firstIndex === t.firstIndex && e.lastIndex === t.lastIndex
    }
    class Je {
        constructor() {
            this._zoffset = 0, this._items = [], this._range = new Ke.WatchedObject(null, Xe)
        }
        clear() {
            this._zoffset = 0, this._items = [], this._range.setValue(null)
        }
        size() {
            return this._items.length
        }
        range() {
            return this._range.readonly()
        }
        merge(e, t, i) {
            const s = this._mergeImpl(e, t, i);
            return this._updateFirstAndLastIndex(), s
        }
        addTail(e, t) {
            for (let i = t ? 1 : 0; i < e.length; i++) this._items.push(e[i]);
            this._updateFirstAndLastIndex()
        }
        remove(e) {
            const t = this._indexToOffset(e);
            if (null === t) return [];
            const i = this._items.splice(t),
                s = [];
            for (let t = 0; t < i.length; t++) s.push({
                change: "remove",
                index: e + t,
                value: i[t]
            });
            return this._updateFirstAndLastIndex(), s
        }
        valueAt(e) {
            const t = this._indexToOffset(e);
            return null !== t ? this._items[t] : null
        }
        indexOf(e, t) {
            if (this._items.length < 1) return null;
            if (e > this._items[this._items.length - 1]) return t ? this._validOffsetToIndex(this._items.length - 1) : null;
            for (let i = 0; i < this._items.length; ++i) {
                if (e === this._items[i]) return this._validOffsetToIndex(i);
                if (e < this._items[i]) return t ? this._validOffsetToIndex(i) : null
            }
            return null
        }
        state(e) {
            var t, i;
            let s = 0,
                r = this._items.length;
            return null !== e && (s = null !== (t = this._indexToOffset(e.firstBar())) && void 0 !== t ? t : 0, r = (null !== (i = this._indexToOffset(e.lastBar())) && void 0 !== i ? i : r - 1) + 1), {
                items: this._items.slice(s, r),
                zoffset: this._zoffset - s
            }
        }
        restoreState(e) {
            null !== e && (this._items = e.items, this._zoffset = e.zoffset, this._updateFirstAndLastIndex())
        }
        roughTime(e, t = null) {
            e = Math.round(e);
            const i = this.valueAt(e);
            if (null !== i) return i;
            const s = this._items;
            if (!s.length || s.length < 2) return null;
            const r = s.length - 1,
                n = this._validOffsetToIndex(0),
                o = this._validOffsetToIndex(r),
                a = s[0],
                l = s[r],
                c = (l - a) / (o - n);
            if (e < n) {
                return a - (n - e) * c
            }
            if (e > o) {
                const i = e - o;
                if (i < 500 && null != t) return t(l, i);
                return l + i * c
            }
            return null
        }
        roughIndex(e, t = null) {
            const i = this._items;
            if (!i.length || i.length < 2) return null;
            const s = i.length - 1,
                r = this._validOffsetToIndex(0),
                n = this._validOffsetToIndex(s),
                o = i[0],
                a = i[s];
            if (e >= o && e <= a) return this.closestIndexLeft(e);
            const l = (a - o) / (n - r);
            if (e < o) {
                const t = o - e;
                return r - Math.round(t / l)
            }
            if (e > a) {
                const i = e - a;
                let s = Math.trunc(i / l);
                if (s < 500 && null !== t) {
                    const i = t(a, e);
                    i.success && (s = i.result)
                }
                return n + s
            }
            return null
        }
        closestIndexLeft(e) {
            const t = this._items;
            if (!t.length) return null;
            if (Number.isNaN(e)) return null;
            let i = t.length - 1;
            if (e >= t[i]) return this._validOffsetToIndex(i);
            let s = 0;
            const r = t[s];
            if (e < r) return null;
            if (e === r) return this._validOffsetToIndex(s);
            for (; i > s + 1;) {
                const r = s + i >> 1,
                    n = t[r];
                if (n > e) i = r;
                else {
                    if (!(n < e)) return n === e ? this._validOffsetToIndex(r) : null;
                    s = r
                }
            }
            return this._validOffsetToIndex(s)
        }
        _mergeImpl(e, t, i) {
            if (0 === i.length) return Ze.logError("merge: 'values' does not contain any time points"), [];
            if (t > this._zoffset && e + t > 0) return Ze.logError("merge: when the first time point index is updated, we should fill the time points starting from the first one"), [];
            if (0 === this._items.length) return this._items = i.slice(), this._zoffset = t, [{
                change: "rebuild",
                index: this._validOffsetToIndex(0)
            }];
            const s = e + this._zoffset;
            if (s < 0) {
                const r = Math.abs(s);
                if (i.length < r) return Ze.logError("merge: 'values' does not contain enough time points to fill in the new items. 'index': " + e.toString() + ", previous 'zoffset': " + this._zoffset.toString() + ", new 'zoffset': " + t.toString() + ", 'values.length': " + i.length), [];
                this._items = new Array(r).concat(this._items), this._zoffset = t;
                for (let s = 0; s < i.length; ++s) this._items[e + s + t] = i[s];
                return [{
                    change: "rebuild",
                    index: this._validOffsetToIndex(0)
                }]
            }
            const r = [];
            let n = s;
            for (; n < this._items.length && n - s < i.length; ++n) this._items[n] = i[n - s], r.push({
                change: "update",
                index: this._validOffsetToIndex(n),
                value: i[n - s]
            });
            const o = s + i.length;
            if (o > this._items.length) {
                const e = o - this._items.length;
                for (let t = n; t < n + e; ++t) {
                    const e = this._items.length;
                    this._items.push(i[t - s]), r.push({
                        change: "append",
                        index: this._validOffsetToIndex(e),
                        value: i[t - s]
                    })
                }
            } else {
                for (let e = o; e < this._items.length; ++e) r.push({
                    change: "remove",
                    index: this._validOffsetToIndex(e),
                    value: this._items[e]
                });
                this._items.length = o
            }
            return this._zoffset = t, r
        }
        _updateFirstAndLastIndex() {
            const e = this._offsetToIndex(0),
                t = this._offsetToIndex(this._items.length - 1);
            this._range.setValue(null === e || null === t ? null : {
                firstIndex: e,
                lastIndex: t
            })
        }
        _validOffsetToIndex(e) {
            return e - this._zoffset
        }
        _offsetToIndex(e) {
            return 0 <= e && e < this.size() ? this._validOffsetToIndex(e) : null
        }
        _indexToOffset(e) {
            const t = e + this._zoffset;
            return 0 <= t && t < this.size() ? t : null
        }
    }
    var Qe = i(61401);
    const et = new Map([
        [0, .1],
        [11, .1],
        [1, .35],
        [9, .35],
        [12, .35],
        [8, .35]
    ]);
    class tt {
        constructor(e, t) {
            this._styleSpecificRanges = new Map, this._logicalRange = e, this._defaultStyle = t
        }
        strictRange(e) {
            if (null === this._logicalRange) return null;
            void 0 === e && (e = this._defaultStyle);
            let t = this._styleSpecificRanges.get(e);
            if (void 0 === t) {
                const i = (et.get(e) || 0) / 2;
                t = new $e.BarsRange(Math.floor(this._logicalRange.left() + i), Math.ceil(this._logicalRange.right() - i)), this._styleSpecificRanges.set(e, t)
            }
            return t
        }
        logicalRange() {
            return this._logicalRange
        }
        isValid() {
            return null !== this._logicalRange
        }
        static invalid() {
            return new tt(null, 1)
        }
    }
    var it = i(21550),
        st = i(42609);
    class rt {
        constructor(e, t = 50) {
            this._actualSize = 0, this._usageTick = 1, this._oldestTick = 1, this._cache = new Map, this._tick2Labels = new Map, this._format = e, this._maxSize = t
        }
        format(e) {
            const t = this._cache.get(e.valueOf());
            if (void 0 !== t) return t.string;
            if (this._actualSize === this._maxSize) {
                const e = this._tick2Labels.get(this._oldestTick);
                this._tick2Labels.delete(this._oldestTick), this._cache.delete((0, n.ensureDefined)(e)), this._oldestTick++, this._actualSize--
            }
            const i = this._format(e);
            return this._cache.set(e.valueOf(), {
                string: i,
                tick: this._usageTick
            }), this._tick2Labels.set(this._usageTick, e.valueOf()), this._actualSize++, this._usageTick++, i
        }
    }
    var nt = i(1763);
    let ot;
    var at = i(16164),
        lt = i(79206),
        ct = i(92216),
        ht = i(88275),
        dt = i(86094);
    const ut = {
            preserveBarSpacing: !1,
            lockVisibleTimeRangeOnResize: !1,
            rightBarStaysOnScroll: !0,
            minBarSpacing: .5
        },
        pt = N.enabled("low_density_bars"),
        _t = pt ? 1 : 2,
        mt = (0, X.getLogger)("Chart.TimeScale");
    class gt {
        constructor(e, t) {
            this._width = 0, this._widthChanged = new(q()), this._rightOffset = 10, this._rightOffsetChanged = new(q()), this._maxRightOffsetChanged = new(q()), this._defaultRightOffset = new(Y())(10), this._defaultRightOffsetPercentage = new(Y())(5), this._usePercentageRightOffset = new(Y())(!1), this._baseIndex = null, this._leftEdgeIndex = null, this._barSpacingChanged = new(q()), this._barSpacing = 6, this._visibleBars = tt.invalid(), this._visibleBarsInvalidated = !0, this._visibleBarsChanged = new(q()), this._logicalRangeChanged = new(q()), this._points = new Je, this._tickMarks = new it.Tickmarks, this._onScroll = new(q()), this._resetDelegate = new(q()), this._scrollStartPoint = null, this._scaleStartPoint = null, this._commonTransitionStartState = null, this._formattedBySpan = new Map, this._requestingMoreData = !1, this._requestedTickmarksCount = 0, this._endOfData = !1, this._lockBarsAndLogicalRangeEvents = !1, this._options = (0, qe.deepExtend)({}, ut, t), this._model = e,
                this._scalesProperties = e.properties().childs().scalesProperties, this._defaultRightOffset.subscribe((() => {
                    this._usePercentageRightOffset.setValue(!1), this._defaultRightOffsetOptionsUpdated()
                })), this._defaultRightOffsetPercentage.subscribe((e => {
                    if (e >= 100 || e < 0) {
                        const t = Math.max(0, Math.min(e, 99));
                        this._defaultRightOffsetPercentage.setValue(t)
                    } else this._usePercentageRightOffset.setValue(!0), this._defaultRightOffsetOptionsUpdated()
                })), this._usePercentageRightOffset.subscribe((() => {
                    this._defaultRightOffsetOptionsUpdated()
                })), this._options.preserveBarSpacing && (this._barSpacing = this._scalesProperties.childs().barSpacing.value() || 6), this._barSpacingChanged.subscribe(this, this._maxRightOffsetOnChanged), this._widthChanged.subscribe(this, this._maxRightOffsetOnChanged)
        }
        destroy() {
            this._barSpacingChanged.unsubscribeAll(this), this._barSpacingChanged.destroy(), this._widthChanged.unsubscribeAll(this), this._widthChanged.destroy()
        }
        isEmpty() {
            return 0 === this._width || !this.canNormalize()
        }
        canNormalize() {
            return this._points.size() > 0
        }
        update(e, t, i, s) {
            this._visibleBarsInvalidated = !0, i.length > 0 && this._points.merge(e, t, i), this._tickMarks.merge(s), this.correctOffset()
        }
        addTail(e, t, i) {
            this._tickMarks.removeTail(t);
            const s = e.params,
                r = (0, n.ensureDefined)(this._tickMarks.maxIndex) + (i ? 0 : 1);
            for (let e = 0; e < s.marks.length; e++) s.marks[e].index = r + e;
            this._tickMarks.addTail(s.marks), this._points.addTail(s.changes, i);
            const o = this._rightOffset - s.changes.length;
            this._updateRightOffset(o)
        }
        state(e) {
            const t = {
                m_barSpacing: this.barSpacing(),
                m_rightOffset: this._defaultRightOffset.value(),
                rightOffsetPercentage: this._defaultRightOffsetPercentage.value(),
                usePercentageRightOffset: this._usePercentageRightOffset.value()
            };
            if (e) {
                t.m_rightOffset = Math.max(0, this._rightOffset);
                const e = this.visibleExtendedDataRange(this._model.mainSeries().data(), 0);
                t.points = this._points.state(e), t.tickmarks = this._tickMarks.state(e), t.width = this._width
            }
            return t
        }
        restoreState(e, t) {
            if (void 0 === e.m_barSpacing) return void mt.logDebug("restoreState: invalid state");
            if (void 0 === e.m_rightOffset) return void mt.logDebug("restoreState: invalid state");
            let i = e.m_barSpacing;
            const s = e.m_rightOffset < 0 && !t ? this.rightOffsetDefaultValue() : e.m_rightOffset,
                r = s < 0 ? this.rightOffsetDefaultValue() : Math.round(s);
            this._defaultRightOffset.setValue(r), void 0 !== e.rightOffsetPercentage && Number.isFinite(e.rightOffsetPercentage) && this._defaultRightOffsetPercentage.setValue(e.rightOffsetPercentage), this._usePercentageRightOffset.setValue(Boolean(e.usePercentageRightOffset)), this._rightOffset = s, t && (this._requestedTickmarksCount = 1 / 0, this._endOfData = !0, this._points.restoreState(e.points || null), this._tickMarks.restoreState(e.tickmarks || null), e.width && this._width > 0 && (i *= this._width / e.width)), this._tryToUpdateBarSpacing(this._barSpacing, i), this.correctOffset(), this._usePercentageRightOffset.value() && (this._rightOffset = this.percentsToBarIndexLength(this._defaultRightOffsetPercentage.value())), this._rightOffsetChanged.fire(this._rightOffset)
        }
        marks() {
            if (this.isEmpty()) return null;
            const e = this._barSpacing,
                t = 5 * ((this._scalesProperties.childs().fontSize.value() || 0) + 4),
                i = Math.round(t / e),
                s = (0, n.ensureNotNull)(this.visibleBarsStrictRange()),
                r = Math.max(s.firstBar(), s.firstBar() - i),
                o = Math.max(s.lastBar(), s.lastBar() - i),
                a = this._tickMarks.build(e, t),
                l = [];
            for (const e of a) {
                if (!(r <= e.index && e.index <= o)) continue;
                const t = this._tickMarks.indexToTime(e.index);
                null !== t && l.push({
                    coord: this.indexToCoordinate(e.index),
                    label: this.formatLabel(t, e.span),
                    span: e.span,
                    major: e.label >= st.DAY_SPAN
                })
            }
            return l
        }
        visibleBarsStrictRange() {
            return this._visibleBarsInvalidated && (this._visibleBarsInvalidated = !1, this._updateVisibleBars()), this._visibleBars.strictRange()
        }
        visibleBarsStrictRangeChanged() {
            return this._visibleBarsChanged
        }
        visibleStrictDataRange(e) {
            const t = this.visibleBarsStrictRange();
            if (null === t) return null;
            const i = e.search(t.firstBar(), dt.PlotRowSearchMode.NearestRight),
                s = e.search(t.lastBar(), dt.PlotRowSearchMode.NearestLeft);
            return null === i || null === s ? null : new $e.BarsRange(i.index, s.index)
        }
        visibleExtendedDataRange(e, t) {
            const i = this.visibleBarsStrictRange();
            if (null === i) return null;
            let s = 1 === t ? null : e.search(i.firstBar() - 1, dt.PlotRowSearchMode.NearestLeft),
                r = 0 === t ? null : e.search(i.lastBar() + 1, dt.PlotRowSearchMode.NearestRight);
            return null === s && (s = e.search(i.firstBar(), dt.PlotRowSearchMode.NearestRight)), null === r && (r = e.search(i.lastBar(), dt.PlotRowSearchMode.NearestLeft)), null === s || null === r ? null : new $e.BarsRange(s.index, r.index)
        }
        logicalRangeChanged() {
            return this._logicalRangeChanged
        }
        tickMarks() {
            return this._tickMarks
        }
        points() {
            return this._points
        }
        width() {
            return this._width
        }
        setWidth(e, t) {
            if (!Number.isFinite(e) || e <= 0) return void mt.logWarn(`setWidth: invalid argument: ${e}`);
            if (this._width === e) return;
            if (this._visibleBarsInvalidated = !0, (t || this._options.lockVisibleTimeRangeOnResize) && this._width) {
                const t = this._barSpacing * e / this._width;
                this._tryToUpdateBarSpacing(this._barSpacing, t)
            } else this._width && this.setBarSpacing(this._barSpacing);
            if (null !== this._leftEdgeIndex) {
                if ((0, n.ensureNotNull)(this.visibleBarsStrictRange()).firstBar() <= this._leftEdgeIndex) {
                    const t = this._width - e;
                    this._rightOffset -= Math.round(t / this._barSpacing) + 1
                }
            }
            const i = this._usePercentageRightOffset.value() && this._rightOffset > 0 ? this.barIndexLengthToPercents(this._rightOffset) : -1;
            this._width = e, this._widthChanged.fire(e);
            const s = this._rightOffset;
            i > 0 ? this._rightOffset = this.percentsToBarIndexLength(i) : this.correctOffset(), this._rightOffset !== s && this._rightOffsetChanged.fire(this._rightOffset), this._requestMoreData()
        }
        setLeftEdgeFix(e) {
            this._leftEdgeIndex = e;
            const t = this.visibleBarsStrictRange();
            if (null === t) return;
            const i = t.firstBar() - e;
            if (i < 0) {
                const e = this._rightOffset - i - 1;
                this.scrollToOffsetAnimated(e, 500)
            }
        }
        indexToCoordinate(e) {
            if (this.isEmpty()) return 0;
            const t = this.baseIndex() + this._rightOffset - e;
            return this._width - (t + .5) * this._barSpacing
        }
        indexToUserTime(e) {
            return this._tickMarks.indexToTime(e)
        }
        timePointToIndex(e, t) {
            switch (t) {
                case 0:
                    return this._points.indexOf(e, !1);
                case 1:
                    return this._points.closestIndexLeft(e);
                default:
                    return this._points.indexOf(e, !0)
            }
        }
        indexToTimePoint(e) {
            return this._points.valueAt(e)
        }
        timeToCoordinate(e) {
            const t = this._points.closestIndexLeft(e);
            if (null === t) return null;
            const i = (0, n.ensureNotNull)(this._points.valueAt(t)),
                s = this.indexToCoordinate(t);
            if (s <= 0 || s >= this._width) return null;
            const r = this.barSpacing(),
                o = this.baseIndex(),
                a = s + (e - i) / ((0, n.ensureNotNull)(this._points.valueAt(o)) - (0, n.ensureNotNull)(this._points.valueAt(o - 1))) * r + 1;
            return a <= 0 || a >= this._width ? null : a
        }
        barIndexesToCoordinates(e) {
            const t = this.baseIndex();
            for (const i of e) {
                const e = i.time,
                    s = t + this._rightOffset - e,
                    r = this._width - (s + .5) * this._barSpacing;
                i.time = r
            }
        }
        timedValuesToCoordinates(e, t, i) {
            var s, r;
            const n = this.baseIndex() + this._rightOffset,
                o = this._width - n * this._barSpacing - .5 * this._barSpacing,
                a = null !== (s = null == t ? void 0 : t.startItemIndex) && void 0 !== s ? s : 0;
            let l = a;
            const c = null !== (r = null == t ? void 0 : t.endItemIndex) && void 0 !== r ? r : e.length;
            !0 === i && (l = (0, v.upperbound)(e, Qe.UNPLOTTABLE_TIME_POINT_INDEX, ((e, t) => e < t.x), a, c));
            for (let t = l; t < c; ++t) {
                const i = e[t];
                i.x = o + i.x * this._barSpacing
            }
            for (let t = a; t < l; ++t) e[t].x = -500
        }
        indexesToCoordinates(e, t) {
            if (this.isEmpty()) return;
            void 0 === t && (t = e.length);
            const i = this.baseIndex() + this._rightOffset,
                s = this._width - i * this._barSpacing - .5 * this._barSpacing,
                r = this._barSpacing,
                n = e;
            for (let i = 0; i < t; ++i)(0, ie.isInteger)(e[i]) ? n[i] = s + e[i] * r : n[i] = 0
        }
        rightOffsetForTimePoint(e) {
            const t = this.timeToCoordinate(e);
            return null === t ? null : this._rightOffsetForCoordinate(t)
        }
        scrollToRealtime(e, t) {
            let i = this.targetDefaultRightOffset();
            i < 0 && (i = this.rightOffsetDefaultValue());
            const s = () => {
                void 0 !== t && t(), this._requestMoreData()
            };
            if (e) {
                const e = this._rightOffset,
                    t = this.maxRightOffset();
                t > 0 && i > t && (i = t);
                const r = this._model;
                (0, ht.doAnimate)({
                    from: e,
                    to: i,
                    duration: 1e3,
                    easing: Ge.easingFunc.easeInOutQuint,
                    onComplete: s,
                    onStep: (e, t) => {
                        this._visibleBarsInvalidated = !0, this._updateRightOffset(t), this._onScroll.fire(), r.recalculateAllPanes((0, W.viewportChangeEvent)()), r.lightUpdate(), r.recalcVisibleRangeStudies()
                    }
                })
            } else this._visibleBarsInvalidated = !0, this._updateRightOffset(i), this._onScroll.fire(), s()
        }
        scrollToFirstBar(e = (() => {})) {
            this._model.gotoTime(new Date("1800-01-01").getTime()).then(e), this._onScroll.fire()
        }
        scrollToOffsetAnimated(e, t) {
            if (!isFinite(e)) throw new RangeError("offset is required and must be finite number");
            const i = void 0 === t ? 400 : t;
            if (!isFinite(i) || i <= 0) throw new RangeError("animationDuration (optional) must be finite positive number");
            const s = this._rightOffset,
                r = Date.now(),
                n = () => {
                    this._visibleBarsInvalidated = !0;
                    const t = (Date.now() - r) / i;
                    if (t >= 1) return this._updateRightOffset(e), this._visibleBarsInvalidated = !0, this._model.recalculateAllPanes((0, W.viewportChangeEvent)()), void this._model.lightUpdate();
                    const o = s + (e - s) * t;
                    this._updateRightOffset(o), this._model.recalculateAllPanes((0, W.viewportChangeEvent)()), setTimeout(n, 20)
                };
            n()
        }
        defaultRightOffset() {
            return this._defaultRightOffset
        }
        rightOffsetDefaultValue() {
            return 10
        }
        defaultRightOffsetPercentage() {
            return this._defaultRightOffsetPercentage
        }
        usePercentageRightOffset() {
            return this._usePercentageRightOffset
        }
        barSpacing() {
            return this._barSpacing
        }
        setBarSpacing(e) {
            Number.isFinite(e) ? (e = this.getValidBarSpacing(e), this._tryToUpdateBarSpacing(this._barSpacing, e) && (this.correctOffset(), this._options.preserveBarSpacing && ((0, T.saveDefaultProperties)(!0), this._scalesProperties.childs().barSpacing.setValue(this._barSpacing), (0, T.saveDefaultProperties)(!1)), this._model.recalculateAllPanes((0, W.viewportChangeEvent)()), this._model.lightUpdate())) : mt.logWarn(`setBarSpacing: invalid argument: ${e}`)
        }
        barSpacingChanged() {
            return this._barSpacingChanged
        }
        getValidBarSpacing(e) {
            return null == e && (e = this.barSpacing()), e < this.minBarSpacing() ? this.minBarSpacing() : e > this.maxBarSpacing() ? this.maxBarSpacing() : e
        }
        isValidBarSpacing(e) {
            return e >= this.minBarSpacing() && e <= this.maxBarSpacing()
        }
        preserveBarSpacing() {
            return this._options.preserveBarSpacing
        }
        normalizeBarIndex(e) {
            let t = 0,
                i = 0;
            const s = this.baseIndex(),
                r = (0, n.ensureNotNull)(this._points.range().value()).firstIndex;
            return e < r ? (t = (0, n.ensureNotNull)(this._points.valueAt(r)), i = e - r) : e > s ? (t = (0, n.ensureNotNull)(this._points.valueAt(s)), i = e - s) : (t = (0, n.ensureNotNull)(this._points.valueAt(e)), i = 0), {
                time_t: t,
                offset: i
            }
        }
        denormalizeTimePoint(e) {
            const t = this._points.indexOf(e.time_t, !1);
            if (null !== t) return t + e.offset
        }
        rightOffset() {
            return this._rightOffset
        }
        rightOffsetChanged() {
            return this._rightOffsetChanged
        }
        minRightOffset() {
            var e;
            const t = null === (e = this.points().range().value()) || void 0 === e ? void 0 : e.firstIndex,
                i = this._baseIndex;
            if (void 0 === t || null === i) return null;
            if (null !== this._leftEdgeIndex) {
                const e = this.width() / this._barSpacing;
                return this._leftEdgeIndex - i + e - 1
            }
            return t - i - 1 + _t
        }
        maxRightOffset() {
            return this.width() / this._barSpacing - _t
        }
        maxRightOffsetChanged() {
            return this._maxRightOffsetChanged
        }
        onReset() {
            return this._resetDelegate
        }
        scrollStartPoint() {
            return this._scrollStartPoint
        }
        baseIndex() {
            return this._baseIndex || 0
        }
        zoom(e, t, i) {
            if (!Number.isFinite(e) || !Number.isFinite(t)) return void mt.logWarn(`zoom: invalid arguments: ${e}, ${t}, ${i}`);
            const s = this.rightOffset(),
                r = void 0 !== i ? !i : this._options.rightBarStaysOnScroll,
                n = r && this.usePercentageRightOffset().value() && s >= 0,
                o = n ? this.barIndexLengthToPercents(s) : void 0,
                a = this.coordinateToIndex(e),
                l = this.barSpacing(),
                c = l + t * (l / 10);
            this.setBarSpacing(c), r || this.setRightOffset(s - .5 + (a - this.coordinateToFloatIndex(e))), n && void 0 !== o && this.setRightOffset(this.percentsToBarIndexLength(o)), this._requestMoreData()
        }
        zoomToBarsRange(e, t) {
            if (null !== this._leftEdgeIndex && (e = Math.max(e, this._leftEdgeIndex)), t <= e) return;
            const i = this.baseIndex(),
                s = this._rightOffset;
            this._rightOffset = t - i;
            const r = Math.max(t - e + 1, _t);
            this.setBarSpacing(this.width() / r), this._visibleBarsInvalidated = !0, this.correctOffset(), this._rightOffset !== s && this._rightOffsetChanged.fire(this._rightOffset), this._requestMoreData()
        }
        coordinateToIndex(e) {
            return Math.round(this.coordinateToFloatIndex(e))
        }
        coordinateToFloatIndex(e) {
            const t = this._rightOffsetForCoordinate(e),
                i = this.baseIndex() + this.rightOffset() - t;
            return Math.round(1e6 * i) / 1e6
        }
        coordinateToVisibleIndex(e) {
            let t = this.coordinateToIndex(e);
            const i = this.visibleBarsStrictRange();
            return null === i || i.contains(t) || (t = Math.min(Math.max(i.firstBar(), t), i.lastBar())), t
        }
        canZoomIn() {
            return this.barSpacing() < this.maxBarSpacing()
        }
        canZoomOut() {
            return this.barSpacing() > this._options.minBarSpacing
        }
        minBarSpacing() {
            return this._options.minBarSpacing
        }
        maxBarSpacing() {
            const e = this.width();
            return pt ? e : e / _t
        }
        minVisibleBarCount() {
            return _t
        }
        resetRightOffset() {
            this.setRightOffset(this.targetDefaultRightOffset())
        }
        reset() {
            this._visibleBarsInvalidated = !0, this._points.clear(), this._scrollStartPoint = null, this._scaleStartPoint = null, this._clearCommonTransitionsStartState(), this._tickMarks.reset(), this._leftEdgeIndex = null, this._resetDelegate.fire(), this.disconnect()
        }
        disconnect() {
            this._requestingMoreData = !1, this._requestedTickmarksCount = 0, this._endOfData = !1
        }
        setBaseIndex(e) {
            Number.isFinite(e) ? (this._visibleBarsInvalidated = !0, this._baseIndex = e, this.correctOffset()) : mt.logDebug(`setBaseIndex: invalid argument: ${e}`)
        }
        resetBaseIndex() {
            this._visibleBarsInvalidated = !0, this._baseIndex = null
        }
        setRightOffset(e) {
            Number.isFinite(e) ? (this._visibleBarsInvalidated = !0, this._updateRightOffset(e)) : mt.logWarn(`setRightOffset: invalid argument: ${e}`)
        }
        correctBarSpacing() {
            this.isEmpty() || this.points().size() < this.width() / this.barSpacing() && (this.setRightOffset(this.targetDefaultRightOffset()), this.setBarSpacing(this.width() / (this.points().size() + this.rightOffset())))
        }
        correctOffset() {
            const e = this.maxRightOffset();
            this._rightOffset > e && (this._rightOffset = e, this._visibleBarsInvalidated = !0);
            const t = this.minRightOffset();
            null !== t && this._rightOffset < t && (this._rightOffset = t, this._visibleBarsInvalidated = !0)
        }
        logicalRange() {
            return this._visibleBarsInvalidated && (this._visibleBarsInvalidated = !1, this._updateVisibleBars()), this._visibleBars.logicalRange()
        }
        restoreDefault() {
            this._visibleBarsInvalidated = !0, this._lockBarsAndLogicalRangeEvents = !0;
            const e = this._visibleBars;
            this.setBarSpacing(6), this.resetRightOffset(), this._lockBarsAndLogicalRangeEvents = !1, this._fireVisibleBarsChangedIfRequired(e, this._visibleBars), this._requestMoreData()
        }
        startScale(e) {
            this._scrollStartPoint && this.endScroll(), null === this._scaleStartPoint && null === this._commonTransitionStartState && (this.isEmpty() || (this._scaleStartPoint = e, this._saveCommonTransitionsStartState()))
        }
        scaleTo(e) {
            if (null === this._commonTransitionStartState) return;
            const t = (0, ge.clamp)(this._width - e, 0, this._width),
                i = (0, ge.clamp)(this._width - (0, n.ensureNotNull)(this._scaleStartPoint), 0, this._width);
            if (0 === t || 0 === i) return;
            const s = this.barIndexLengthToPercents(this.rightOffset());
            this.setBarSpacing(this._commonTransitionStartState.barSpacing * t / i), this.usePercentageRightOffset().value() && this.setRightOffset(this.percentsToBarIndexLength(s))
        }
        endScale() {
            null !== this._scaleStartPoint && (this._scaleStartPoint = null, this._clearCommonTransitionsStartState(), this._requestMoreData())
        }
        startScroll(e) {
            null === this._scrollStartPoint && null === this._commonTransitionStartState && (this.isEmpty() || (this._scrollStartPoint = e, this._saveCommonTransitionsStartState()))
        }
        scrollTo(e) {
            if (this._visibleBarsInvalidated = !0, null === this._scrollStartPoint) return;
            const t = (this._scrollStartPoint - e) / this.barSpacing(),
                i = (0, n.ensureNotNull)(this._commonTransitionStartState).rightOffset + t;
            this._updateRightOffset(i), this._onScroll.fire()
        }
        endScroll() {
            null !== this._scrollStartPoint && (this._scrollStartPoint = null, this._clearCommonTransitionsStartState(), this._requestMoreData())
        }
        formatLabel(e, t) {
            const i = "24-hours" === at.timeHoursFormatProperty.value() ? t.toString() : `${t}_ampm`;
            let s = this._formattedBySpan.get(i);
            return void 0 === s && (s = new rt((e => this.formatLabelImpl(e, t))), this._formattedBySpan.set(i, s)), s.format(new Date(e))
        }
        formatLabelImpl(e, t) {
            if (!(e && e instanceof Date)) return "incorrect time";
            const s = function(e, t) {
                if (e < st.MINUTE_SPAN && t) return "TimeWithSeconds";
                if (e < st.DAY_SPAN && t) return "Time";
                if (e < st.WEEK_SPAN) return "DayOfMonth";
                if (e < st.MONTH_SPAN) return "DayOfMonth";
                if (e < st.YEAR_SPAN) return "Month";
                return "Year"
            }(t, !this._model.mainSeries().isDWM());
            return null !== nt.customFormatters.tickMarkFormatter ? nt.customFormatters.tickMarkFormatter(e, s) : function(e, t) {
                switch (t) {
                    case "TimeWithSeconds":
                    case "Time":
                        const s = "TimeWithSeconds" === t ? (0, ct.getHourMinuteSecondFormat)(at.timeHoursFormatProperty.value()) : (0, ct.getHourMinuteFormat)(at.timeHoursFormatProperty.value());
                        return new lt.TimeFormatter(s).format(e);
                    case "DayOfMonth":
                        return e.getUTCDate().toString();
                    case "Month":
                        return (void 0 === ot && (ot = [c.t(null, void 0, i(95425)), c.t(null, void 0, i(35050)), c.t(null, void 0, i(51369)), c.t(null, void 0, i(42762)), c.t(null, {
                            context: "short"
                        }, i(27991)), c.t(null, void 0, i(15224)), c.t(null, void 0, i(6215)), c.t(null, void 0, i(38465)), c.t(null, void 0, i(57902)), c.t(null, void 0, i(73546)), c.t(null, void 0, i(71230)), c.t(null, void 0, i(92203))]), ot)[e.getUTCMonth()];
                    case "Year":
                        return e.getUTCFullYear().toString()
                }
            }(e, s)
        }
        onScroll() {
            return this._onScroll
        }
        invalidateVisibleBars() {
            this._visibleBarsInvalidated = !0
        }
        onTimeScaleCompleted(e) {
            var t;
            if (this._requestingMoreData = !1, this._endOfData = e, N.enabled("fix_left_edge") && this._endOfData) {
                const e = null === (t = this._points.range().value()) || void 0 === t ? void 0 : t.firstIndex;
                void 0 !== e && this.setLeftEdgeFix(e)
            }
            this._requestMoreData()
        }
        requestMoreHistoryPoints(e) {
            this._requestHistoryPoints(e)
        }
        targetDefaultRightOffset() {
            return this.usePercentageRightOffset().value() ? this.percentsToBarIndexLength(this._defaultRightOffsetPercentage.value()) : this._defaultRightOffset.value()
        }
        percentsToBarIndexLength(e) {
            return .01 * e * this._width / this._barSpacing
        }
        barIndexLengthToPercents(e) {
            return 100 * e * this._barSpacing / this._width
        }
        _requestMoreData() {
            this._requestFutureTickmarksIfNeeded(), this._requestHistoryPointsIfNeeded()
        }
        _requestFutureTickmarksIfNeeded() {
            if (this.isEmpty() || !this._model.chartApi().isConnected().value()) return;
            const e = this.visibleBarsStrictRange();
            if (null === e) return;
            const t = e.lastBar() - (0, n.ensureNotNull)(this._points.range().value()).lastIndex;
            if (t <= this._requestedTickmarksCount) return;
            const i = t - this._requestedTickmarksCount;
            this._requestedTickmarksCount = t, this._model.chartApi().requestMoreTickmarks(i)
        }
        _requestHistoryPointsIfNeeded() {
            if (this.isEmpty()) return;
            if (this._endOfData) return void mt.logNormal("Skipping loading more data due end of data state");
            const e = this.visibleBarsStrictRange();
            if (null === e) return;
            const t = (0, n.ensureNotNull)(this._points.range().value()).firstIndex - e.firstBar();
            t <= 0 || this._requestHistoryPoints(t)
        }
        _requestHistoryPoints(e) {
            this._model.chartApi().isConnected().value() && (this._requestingMoreData ? mt.logNormal("Skipping loading more data due active loading") : (this._requestingMoreData = !0, this._model.chartApi().requestMoreData(e)))
        }
        _updateVisibleBars() {
            const e = this._visibleBars;
            if (this.isEmpty()) return void(this._visibleBars.isValid() && (this._visibleBars = tt.invalid(), this._visibleBarsChanged.fire(null, e.strictRange()), this._logicalRangeChanged.fire(null, e.logicalRange())));
            const t = this.baseIndex(),
                i = this.width() / this._barSpacing,
                s = this._rightOffset + t,
                r = s - i + 1;
            Number.isFinite(r) && Number.isFinite(s) ? (this._visibleBars = new tt(new Ye(r, s), this._model.mainSeries().style()), this._lockBarsAndLogicalRangeEvents || this._fireVisibleBarsChangedIfRequired(e, this._visibleBars)) : mt.logWarn(`updateVisibleBars error: baseIndex: ${t}, barSpacing: ${this._barSpacing}, rightOffset: ${this._rightOffset}`)
        }
        _fireVisibleBarsChangedIfRequired(e, t) {
            $e.BarsRange.compare(e.strictRange(), t.strictRange()) || this._visibleBarsChanged.fire(t.strictRange(), e.strictRange()), Ye.compare(e.logicalRange(), t.logicalRange()) || this._logicalRangeChanged.fire(t.logicalRange(), e.logicalRange())
        }
        _rightOffsetForCoordinate(e) {
            return (this._width - e) / this._barSpacing - .5
        }
        _tryToUpdateBarSpacing(e, t) {
            return e !== t && (this._visibleBarsInvalidated = !0, this._barSpacing = t, this._barSpacingChanged.fire(t), !0)
        }
        _saveCommonTransitionsStartState() {
            this._commonTransitionStartState = {
                barSpacing: this.barSpacing(),
                rightOffset: this.rightOffset()
            }
        }
        _clearCommonTransitionsStartState() {
            this._commonTransitionStartState = null
        }
        _maxRightOffsetOnChanged() {
            this._maxRightOffsetChanged.fire(this.maxRightOffset())
        }
        _updateRightOffset(e) {
            const t = this._rightOffset;
            this._rightOffset = e, this.correctOffset(), this._rightOffset !== t && this._rightOffsetChanged.fire(this._rightOffset), this._model.recalculateAllPanes((0, W.viewportChangeEvent)()), this._model.lightUpdate()
        }
        _defaultRightOffsetOptionsUpdated() {
            this.setRightOffset(this.targetDefaultRightOffset())
        }
    }
    var ft = i(34928),
        vt = i(53741),
        St = i(83407),
        yt = i(35588);
    class bt {
        constructor(e) {
            this._onChanged = new(q()), this._groups = [], this._groups = e || [], this._groups.forEach((e => {
                e.onChanged().subscribe(null, (t => this._onChanged.fire(e.id, t)))
            }))
        }
        groups() {
            return this._groups.filter((e => e.isActualSymbol()))
        }
        groupsForAllSymbols() {
            return this._groups
        }
        createGroup(e, t, i) {
            t = t || this._generateNextName();
            const s = new yt.LineToolsGroup(e, t, i);
            this._groups.push(s), s.onChanged().subscribe(null, (e => this._onChanged.fire(s.id, e)));
            const r = {
                visibilityChanged: !1,
                lockedChanged: !1,
                titleChanged: !1,
                isActualIntervalChanged: !1,
                affectedLineTools: e.map((e => e.id()))
            };
            return this._onChanged.fire(s.id, r), s
        }
        addGroup(e) {
            this._groups.push(e), e.onChanged().subscribe(null, (t => this._onChanged.fire(e.id, t))), this._onChanged.fire(e.id)
        }
        removeGroup(e) {
            const t = this._groups.findIndex((t => t.id === e.id));
            this._groups.splice(t, 1), this._onChanged.fire(e.id)
        }
        groupForId(e) {
            return this._groups.find((t => t.id === e)) || null
        }
        groupForLineTool(e) {
            return this._groups.find((t => t.containsLineTool(e))) || null
        }
        removeLineTools(e) {
            const t = new Set;
            this._groups.forEach((i => {
                const s = e.filter(i.containsLineTool.bind(i));
                s.length && (i.excludeLineTools(s), t.add(i.id))
            }));
            return this._groups.filter((e => 0 === e.lineTools().length)).forEach((e => this.removeGroup(e))), Array.from(t)
        }
        state(e) {
            return {
                groups: (e ? this._groups.filter((e => e.isActualSymbol())) : this._groups).map((e => e.state()))
            }
        }
        onChanged() {
            return this._onChanged
        }
        fireChangedAll() {
            this._groups.forEach((e => {
                this._onChanged.fire(e.id)
            }))
        }
        static fromState(e, t) {
            const i = [];
            for (const s of t.groups) {
                const t = yt.LineToolsGroup.fromState(e, s);
                null !== t && i.push(t)
            }
            return new bt(i)
        }
        _generateNextName() {
            const e = new Set(this.groups().map((e => e.name())));
            for (let t = 1;; t++) {
                const i = `Group ${t}`,
                    s = `Group_${t}`;
                if (!e.has(i) && !e.has(s)) return i
            }
        }
    }
    var wt = i(99652),
        Pt = i(41249),
        Ct = i.n(Pt),
        xt = i(60156);
    let Tt = null;

    function It(e) {
        return Boolean(e.symbolInfo.timezone) && Boolean(e.symbolInfo.session)
    }
    class Mt {
        constructor(e, t) {
            var i, s;
            this._sourceTargetBarBuilder = null, this._cache = new Map, this._source = e, this._sourceSession = xt.SessionInfo.fromState(e.session), this._target = t, this._targetSession = xt.SessionInfo.fromState(t.session), this._isResolutionTheSame = x.Interval.isEqual(e.resolution, t.resolution), this._isSessionTheSame = (i = e.symbolInfo, s = t.symbolInfo, i.timezone === s.timezone && i.session === s.session && i.session_holidays === s.session_holidays && i.corrections === s.corrections), this._shouldCorrectTradingDay = x.Interval.isDWM(e.resolution) && !this._isSessionTheSame
        }
        sourceTimeToTargetTime(e) {
            if (this._isSessionTheSame && this._isResolutionTheSame) return e;
            if (!It(this._source) || !It(this._target)) return e;
            let t = this._cache.get(e);
            if (void 0 === t) {
                let i = 1e3 * e;
                if (this._shouldCorrectTradingDay) {
                    let e = Ct().utc_to_cal(this._sourceSession.timezone, i);
                    e = this._sourceSession.spec.correctTradingDay(e);
                    const t = new Date(e);
                    Ct().set_hms(t, 0, 0, 0, 0, this._sourceSession.timezone), i = t.valueOf()
                }
                const s = this._sourceTargetBuilder();
                s.moveTo(i);
                const r = s.indexOfBar(i);
                t = s.startOfBar(Math.max(0, r)) / 1e3, this._cache.set(e, t)
            }
            return t
        }
        _sourceTargetBuilder() {
            if (null === this._sourceTargetBarBuilder) {
                const e = this._isSessionTheSame ? this._targetSession : (null === Tt && (Tt = new xt.SessionInfo("Etc/UTC", "24x7")), Tt);
                this._sourceTargetBarBuilder = (0, xt.newBarBuilder)(this._target.resolution, this._targetSession, e)
            }
            return this._sourceTargetBarBuilder
        }
    }
    var At = i(87095),
        Lt = i(36112),
        kt = i(93613);

    function Et(e, t) {
        return e.code < t.code ? -1 : e.code > t.code ? 1 : 0
    }
    class Dt {
        constructor(e) {
            this._convertibleItems = e, this._idsToItems = new Map;
            for (const t of e) this._idsToItems.set(t.id, t)
        }
        convertible(e) {
            return void 0 !== this._idsToItems.get(e)
        }
        item(e) {
            var t;
            return null !== (t = this._idsToItems.get(e)) && void 0 !== t ? t : null
        }
        size() {
            return this._convertibleItems.length
        }
        filterConvertible(e, t) {
            const i = this._convertibleItems.filter(function(e, t) {
                return i => !e.has(i.id) && t(i.id)
            }(e, t));
            return i.sort(Et), i
        }
    }
    class Vt {
        constructor(e) {
            this._allGroups = new Set, this._idToName = new Map, this._idToDescription = new Map, this._groupedUnitIds = new Map, this._groupedUnits = new Map, this._groupById = new Map, this._size = 0, this._units = e;
            for (const t in e)
                if (e.hasOwnProperty(t)) {
                    this._allGroups.add(t), this._groupedUnitIds.set(t, new Set(e[t].map((e => e.id)))), this._groupedUnits.set(t, e[t]);
                    for (const i of e[t]) this._size++, this._idToName.set(i.id, i.name), this._idToDescription.set(i.id, i.description), this._groupById.set(i.id, t)
                }
        }
        unitsChanged(e) {
            return this._units !== e
        }
        size() {
            return this._size
        }
        name(e) {
            return this._idToName.get(e) || e
        }
        description(e) {
            return this._idToDescription.get(e) || e
        }
        unitGroupById(e) {
            return this._groupById.get(e) || null
        }
        allGroups() {
            return new Set(this._allGroups)
        }
        unitsByGroups(e) {
            const t = [];
            return e.forEach((e => {
                const i = this._groupedUnits.get(e);
                void 0 !== i && t.push({
                    name: e,
                    units: i
                })
            })), t
        }
        convertible(e, t) {
            for (const i of t) {
                const t = this._groupedUnitIds.get(i);
                if (void 0 !== t && t.has(e)) return !0
            }
            return !1
        }
    }
    var Bt = i(50335);
    class Rt {
        constructor(e) {
            this._source = null, this._sourcePane = null, this._currentToolSupportsPhantomMode = !1, this._model = e
        }
        destroy() {
            this._source = null, this._sourcePane = null
        }
        source() {
            return this._source
        }
        onToolChanged() {
            this._removeSource();
            const e = this._model.currentTool();
            this._currentToolSupportsPhantomMode = (0, he.isLineToolName)(e) && (0, S.supportsPhantomMode)(e)
        }
        onCursorPositionUpdated() {
            if (!this._currentToolSupportsPhantomMode) return;
            const e = this._model.crossHairSource();
            if (this._sourcePane !== e.pane && this._removeSource(), null === e.pane || !(0, Bt.isNumber)(e.index) || !(0, Bt.isNumber)(e.price)) return void this._removeSource();
            const t = {
                index: e.index,
                price: e.price
            };
            null !== this._source ? this._source.setPoint(0, t) : (this._source = this._model.createLineTool(e.pane, t, this._model.currentTool(), void 0, null, 0), this._sourcePane = e.pane)
        }
        _removeSource() {
            null !== this._source && (this._model.removeSource(this._source), this._source = null, this._sourcePane = null)
        }
    }
    var Nt = i(17133),
        Ot = i(36147),
        Ft = i(18540);
    class Wt {
        constructor() {
            this._lastValue = null
        }
        align(e, t, i) {
            this._lastValue = null;
            let s = e;
            if (!(0, Ft.magnetEnabled)().value()) return s;
            const r = i.mainDataSource();
            if (null === r) return s;
            const o = r.model().mainSeries();
            if (r !== o) return s;
            const a = o.priceScale();
            if (a.isEmpty()) return s;
            const l = function(e, t) {
                const i = e.bars().valueAt(t);
                if (null === i) return;
                let s;
                if (null !== e.priceSource()) s = [e.barFunction()(i)];
                else switch (e.style()) {
                    case 12:
                        s = [i[2], i[3]];
                        break;
                    case 16:
                        s = [i[2], i[4], i[3]];
                        break;
                    default:
                        s = [i[1], i[2], i[3], i[4]]
                }
                return s
            }(o, t);
            if (!l) return s;
            const c = (0, n.ensure)(o.firstValue()),
                h = l.map((e => ({
                    y: a.priceToCoordinate(e, c),
                    price: e
                }))),
                d = a.priceToCoordinate(e, c);
            h.sort(((e, t) => Math.abs(e.y - d) - Math.abs(t.y - d)));
            const u = h[0];
            return ((0, Ft.magnetMode)().value() === Ot.MagnetMode.StrongMagnet || Math.abs(u.y - d) < 50) && (s = u.price, this._lastValue = s), s
        }
        lastValue() {
            return this._lastValue
        }
        resetLastValue() {
            this._lastValue = null
        }
    }
    var zt = i(77475),
        Ht = i(14292),
        Ut = i(68441),
        jt = i(59590);
    class Gt extends jt.BitmapCoordinatesPaneRenderer {
        constructor() {
            super(...arguments), this._data = null
        }
        setData(e) {
            this._data = e
        }
        hitTest(e) {
            return null
        }
        _drawImpl(e) {
            if (null === this._data) return;
            const {
                context: t,
                verticalPixelRatio: i,
                horizontalPixelRatio: s,
                bitmapSize: r
            } = e, n = Math.max(1, Math.floor(s));
            t.lineWidth = n;
            const o = Math.ceil(r.height * i),
                a = Math.ceil(r.width * s);
            if (t.lineCap = "butt", this._data.vertLinesVisible) {
                t.strokeStyle = this._data.vertLinesColor, (0, Ut.setLineStyle)(t, this._data.vertLineStyle);
                for (const e of this._data.timeMarks) {
                    const i = Math.round(e.coord * s);
                    (0, Ut.drawVerticalLine)(t, i, 0, o)
                }
            }
            if (this._data.horzLinesVisible) {
                t.strokeStyle = this._data.horzLinesColor, (0, Ut.setLineStyle)(t, this._data.horzLineStyle);
                for (const e of this._data.priceMarks) {
                    const s = Math.round(e.coord * i);
                    (0, Ut.drawHorizontalLine)(t, s, 0, a)
                }
            }
        }
    }
    class qt {
        constructor(e) {
            this._renderer = new Gt, this._pane = e
        }
        update() {}
        renderer() {
            const e = this._pane.defaultPriceScale(),
                t = this._pane.model().timeScale();
            if (e.isEmpty() || t.isEmpty()) return null;
            const i = this._pane.model().properties().childs().paneProperties.childs(),
                s = t.marks(),
                r = i.gridLinesMode.value(),
                n = {
                    horzLinesVisible: "both" === r || "horz" === r,
                    vertLinesVisible: "both" === r || "vert" === r,
                    horzLinesColor: i.horzGridProperties.childs().color.value(),
                    vertLinesColor: i.vertGridProperties.childs().color.value(),
                    horzLineStyle: i.horzGridProperties.childs().style.value(),
                    vertLineStyle: i.vertGridProperties.childs().style.value(),
                    priceMarks: e.marks(),
                    timeMarks: null !== s ? s : []
                };
            return this._renderer.setData(n), this._renderer
        }
    }
    class $t extends Ht.DataSource {
        id() {
            return "grid"
        }
        paneViews(e) {
            return [new qt(e)]
        }
    }
    var Yt = i(42275);
    class Kt extends Yt.PriceAxisView {
        constructor(e, t, i, s) {
            super(), this._source = e, this._pane = t, this._priceScale = i, this._priceProvider = s, this._properties = e.model().properties().childs().scalesProperties
        }
        setHitTestData(e) {
            this._hitTestData = e
        }
        setXCoord(e) {
            this._xCoord = e
        }
        additionalPadding(e) {
            return 0
        }
        _updateRendererData(e, t, i) {
            e.visible = !1, t.visible = !1;
            const s = this._priceScale,
                r = s.mainSource(),
                n = null !== r ? r.firstValue() : null;
            if (!this._isVisible() || s.isEmpty() || null === n) return;
            const o = this._currentPrice(s);
            if (null === o) return;
            i.background = (0, At.resetTransparency)(this._bgColor()), i.textColor = this.generateTextColor(i.background);
            const a = this.additionalPadding(s.fontSize());
            i.additionalPaddingTop = a, i.additionalPaddingBottom = a, i.coordinate = s.priceToCoordinate(o, n), e.text = s.formatPrice(o, n), e.visible = !0, t.visible = !0, t.hitTestData = this._hitTestData, t.xCoord = this._xCoord
        }
        _currentPrice(e) {
            return this._priceProvider(e)
        }
    }
    class Zt extends Kt {
        additionalPadding(e) {
            return 2 / 12 * e
        }
        _isVisible() {
            const e = this._source.lockedPane();
            return this._properties.childs().showPriceScaleCrosshairLabel.value() && (this._source.visible || null !== e) && (null != e ? e : this._source.pane) === this._pane
        }
        _currentPrice(e) {
            const t = Se.crosshairLock.value();
            return null !== t && 1 === t.type ? this._pane === this._source.lockedPane() ? t.price : null : super._currentPrice(e)
        }
        _bgColor() {
            const e = this._properties.childs();
            return this._source.model().dark().value() ? e.crosshairLabelBgColorDark.value() : e.crosshairLabelBgColorLight.value()
        }
        _updateRendererData(e, t, i) {
            const s = t.visible;
            super._updateRendererData(e, t, i), this._source.isHovered() ? t.backgroung = this._source.model().dark().value() ? l.colorsPalette["color-cold-gray-600"] : l.colorsPalette["color-cold-gray-650"] : t.backgroung = void 0, s || (t.visible = s)
        }
    }
    class Xt extends Kt {
        _isVisible() {
            return null !== this._source.measurePane().value()
        }
        _bgColor() {
            return this._properties.childs().axisLineToolLabelBackgroundColorCommon.value()
        }
    }
    var Jt = i(43493),
        Qt = (i(39347), i(10643)),
        ei = i(11095);

    function ti(e) {
        const t = e.priceScale();
        return null === t ? 0 : t.isPercentage() || t.isIndexedTo100() ? 2 : 1
    }
    const ii = N.enabled("show_context_menu_in_crosshair_if_only_one_item");
    class si extends Jt.PanePriceAxisView {
        constructor(e, t, i, s, r) {
            super(e, t, s), this._crossHairMenuCachedState = null, this._hasActions = !1, this._tooltipText = null, this._gaOrigin = "CH menu", this._crosshairPriceAxisView = e, e.setPaneRendererLabelIcon(0), this._crosshair = t, this._scale = i, this._options = r, this._updateGaOrigin()
        }
        _updateImpl(e, t) {
            const i = this._crosshair.y,
                s = this._chartModel.properties().childs().scalesProperties.childs().fontSize.value(),
                r = this._chartModel.timeScale().width(),
                n = this._crosshair.model().priceAxisRendererOptions(),
                a = s + 2 * this._crosshairPriceAxisView.additionalPadding(s) + n.paddingTop + n.paddingBottom,
                l = a,
                c = i - a / 2,
                h = this._crosshair.pane,
                d = this._mainDataSourceOnPane(),
                u = d && d.symbolSource(),
                p = !!u && (u.isConvertedToOtherCurrency() || u.isConvertedToOtherUnit());
            if (this._updateGaOrigin(), null !== d) {
                const e = ti(d),
                    t = d.idForAlert(),
                    i = this._chartModel.isInReplay(),
                    s = this._crossHairMenuCachedState;
                null !== s && s.id === t && s.priceScale === e && s.isCurrencyOrUnitConverted === p && s.isInReplay === i || (this._updateTooltipAndActionsAvaliability(d, e, p), this._crossHairMenuCachedState = {
                    id: t,
                    priceScale: e,
                    isCurrencyOrUnitConverted: p,
                    isInReplay: i
                })
            }
            const _ = null !== d && (0, _e.isActingAsSymbolSource)(d) ? d.symbol() : null,
                m = null !== h && (h.maximized().value() || !h.collapsed().value()) && (Boolean(_) || !1);
            this._crosshairPriceAxisView.setPaneLabelVisible(m);
            const g = this._position();
            if (null !== g) {
                const e = 0,
                    t = r - l,
                    i = Boolean(ei.showPlusButtonOnCursor.value()),
                    s = i ? this._crosshair.x : void 0,
                    n = void 0 !== s ? s - l / 2 : "left" === g ? e : t,
                    h = void 0 !== s ? s + l / 2 : "left" === g ? e + l : t + l,
                    d = (0, o.box)(new o.Point(n, c), new o.Point(h, c + a)),
                    u = this._tooltipText ? {
                        text: this._tooltipText,
                        rect: {
                            x: d.min.x,
                            y: d.min.y,
                            w: d.max.x - d.min.x,
                            h: d.max.y - d.min.y
                        }
                    } : void 0;
                this._data = {
                    itemBox: d,
                    clickHandler: this._handleClick.bind(this, g, i, d),
                    tooltip: u
                }, this._crosshairPriceAxisView.setHitTestData(this._data), this._crosshairPriceAxisView.setXCoord(s)
            }
            super._updateImpl(e, t)
        }
        _priceScale() {
            return this._scale
        }
        _updateGaOrigin() {
            this._gaOrigin = Boolean(ei.showPlusButtonOnCursor.value()) ? "CH menu cursor" : "CH menu"
        }
        _updateTooltipAndActionsAvaliability(e, t, i) {
            this._tooltipText = null, this._hasActions = !1;
            if (!(1 === t)) return;
            this._chartModel.isInReplay();
            let s = 0;
            let r = 0;
            1 !== s || ii || (this._tooltipText = ""), this._crosshairPriceAxisView.setPaneRendererLabelIcon(r), this._hasActions = 0 !== s
        }
        _handleClick(e, t, i, s, r) {
            (0, u.trackEvent)(this._gaOrigin, "click");
            const n = this._mainDataSourceOnPane(),
                o = null !== n && (0, _e.isActingAsSymbolSource)(n) ? n.symbol() : null,
                a = {
                    pageX: r.pageX,
                    pageY: r.pageY,
                    clientX: r.clientX,
                    clientY: r.clientY,
                    screenX: r.screenX,
                    screenY: r.screenY,
                    price: this._crosshair.price,
                    symbol: o
                };
            _.emit("onPlusClick", a)
        }
        _getMenuItems(e) {
            return Promise.resolve([])
        }
        _createAlertMenuItems(e) {
            return Promise.resolve([])
        }
        _createTradingMenuItems() {
            return Promise.resolve([])
        }
        _createAddHorizontalLineMenuItem() {
            return []
        }
        _getActionAddAlert(e) {
            return null
        }
        _getActionAddHorizontalLine(e) {
            return null
        }
        _getValue(e, t) {
            const i = e.priceScale(),
                s = e.firstValue();
            if (null === i || null === s) return null;
            return i.isPercentage() || i.isIndexedTo100() ? null : i.coordinateToPrice(t, s)
        }
        _formatValue(e, t) {
            return t.formatter().format(e)
        }
        _addAlert(e, t) {}
        _addHorizontalLineTool(e, t) {}
        _showContextMenu(e, t, i, s, r) {
            const o = "left" === r;
            setTimeout((() => {
                const r = s.clientX - s.localX,
                    a = s.clientY - s.localY,
                    l = i.min.x + r,
                    c = i.max.x + r,
                    h = i.min.y + a,
                    d = c - l,
                    u = i.max.y + a - h,
                    p = t ? Se.crosshairLock.value() : void 0;
                if (void 0 !== p) {
                    const e = (0, n.ensureNotNull)(this._chartModel.timeScale().points().roughTime(this._crosshair.index));
                    Se.crosshairLock.setValue({
                        type: 1,
                        price: this._crosshair.price,
                        time: e,
                        modelId: this._chartModel.id(),
                        paneId: (0, n.ensureNotNull)(this._crosshair.pane).id()
                    })
                }
                Qt.ContextMenuManager.showMenu(e, {
                    clientX: s.clientX,
                    clientY: s.clientY,
                    box: {
                        x: l,
                        w: d,
                        y: h,
                        h: u
                    },
                    attachToXBy: t ? "auto" : o ? "left" : "right",
                    attachToYBy: "auto-strict",
                    marginX: t ? 0 : -d
                }, void 0, {
                    menuName: "CrosshairMenuView"
                }, (() => {
                    void 0 !== p && Se.crosshairLock.setValue(p)
                }))
            }))
        }
        _mainDataSourceOnPane() {
            const e = this._crosshair.pane;
            return null !== e ? e.mainDataSource() : null
        }
    }
    var ri = i(79849),
        ni = i(38325),
        oi = i(18807);
    class ai extends jt.BitmapCoordinatesPaneRenderer {
        constructor(e) {
            super(), this._data = e
        }
        hitTest(e) {
            return void 0 === this._data.clickHandler ? null : new oi.HitTestResult(oi.HitTarget.Custom, {
                clickHandler: this._data.clickHandler,
                tapHandler: this._data.clickHandler
            })
        }
        _drawImpl(e) {
            const t = this._data.vertLinesVisible,
                i = this._data.horzLinesVisible;
            if (!t && !i) return;
            const {
                context: s,
                horizontalPixelRatio: r,
                verticalPixelRatio: n,
                bitmapSize: o
            } = e;
            s.lineWidth = Math.max(1, Math.floor(this._data.lineWidth * r)), s.strokeStyle = this._data.color, s.fillStyle = this._data.color, s.lineCap = "butt", (0, Ut.setLineStyle)(s, this._data.lineStyle);
            const a = Math.round(this._data.x * r),
                l = Math.round(this._data.y * n),
                c = Math.ceil(o.width * r),
                h = Math.ceil(o.height * n);
            t && a >= 0 && (0, Ut.drawVerticalLine)(s, a, 0, h), i && l >= 0 && (0, Ut.drawHorizontalLine)(s, l, 0, c), this._data.drawCenter && (s.beginPath(), s.arc(a, l, Math.round(3 * r), 0, 2 * Math.PI, !0), s.fillStyle = this._data.color, s.fill()), this._data.scissors && function(e, t, i) {
                const {
                    context: s,
                    bitmapSize: r,
                    horizontalPixelRatio: n,
                    verticalPixelRatio: o
                } = e, a = 24 * n, l = Math.round(t - a / 2);
                let c = Math.round(i - a / 2);
                if (c < 0) c = 0;
                else {
                    const e = r.height - a;
                    c > e && (c = e)
                }
                s.translate(l, c), s.scale(n, o), s.fillStyle = "#131722", s.fill(li), s.strokeStyle = "#fff", s.lineWidth = 1, s.stroke(li)
            }(e, a, l)
        }
    }
    const li = new Path2D("m15.68 3.72-3.82 5.52-3.83-5.52-.28-.42-.42.3a2.84 2.84 0 0 0-.68 3.92l3.27 4.73-1.16 1.68a3.34 3.34 0 0 0-4.26 3.22 3.34 3.34 0 0 0 3.32 3.35 3.34 3.34 0 0 0 3.08-4.6l1-1.44 1.13 1.62a3.34 3.34 0 0 0 3.15 4.42c1.84 0 3.32-1.5 3.32-3.35a3.34 3.34 0 0 0-4.42-3.17l-1.23-1.78 3.22-4.65a2.86 2.86 0 0 0-.69-3.96l-.41-.29-.29.42ZM7.82 16.27c.47 0 .86.39.86.88 0 .48-.39.87-.86.87a.87.87 0 0 1-.86-.87c0-.5.4-.88.86-.88Zm8.36 0c.47 0 .86.39.86.88 0 .48-.4.87-.86.87a.87.87 0 0 1-.86-.87c0-.5.39-.88.86-.88Z");
    const ci = l.colorsPalette["color-tv-blue-500"];
    class hi {
        constructor(e, t) {
            this._rendererData = {}, this._renderer = new ai(this._rendererData), this._source = e, this._pane = t
        }
        update() {}
        renderer(e, t) {
            var i, s;
            const r = this._source.selectPointMode().value() !== Se.SelectPointMode.None,
                o = this._source.lockedPane(),
                a = (this._source.visible || null !== o) && (this._source.areLinesVisible || r) && !this._source.linesShouldBeHidden(),
                l = this._rendererData;
            if (!a || null === this._pane) return null;
            const c = this._source.paneForPointSelect(),
                h = this._source.isReplaySelection(),
                d = null != o ? o : this._source.pane,
                u = this._pane === d,
                p = h || (null !== c ? d === c && this._pane === c : u);
            if (l.scissors = !1, r && this._source.isOnHoveredChartWidget() && p) {
                const e = (0, n.ensureNotNull)(this._source.pointToSelect());
                l.color = this._source.lineColor() || ci, h ? (l.lineWidth = 2, l.scissors = u) : l.lineWidth = 1, l.lineStyle = ri.LINESTYLE_SOLID, l.horzLinesVisible = !0, l.vertLinesVisible = !0, l.drawCenter = !1, "time" === e ? l.horzLinesVisible = !1 : "price" === e && (l.vertLinesVisible = !1)
            } else {
                const e = this._source.properties(),
                    t = this._source.model().currentTool(),
                    i = (0, ni.lastMouseOrTouchEventInfo)(),
                    s = i.isTouch && !i.stylus && ((0, he.isLineToolName)(t) || (0, Se.toolIsMeasure)(t));
                let r;
                r = s ? ci : e.childs().color.value();
                const n = e.childs().transparency.value();
                !s && n > 0 && (r = (0, At.generateColor)(r, n)), l.color = r, l.horzLinesVisible = this._pane === d && (this._pane.maximized().value() || !this._pane.collapsed().value()), l.vertLinesVisible = !0, l.lineWidth = e.childs().width.value(), l.lineStyle = e.childs().style.value(), l.drawCenter = s && this._pane === d
            }
            return l.x = null !== (i = this._source.lockedX()) && void 0 !== i ? i : this._source.x, l.y = null !== (s = this._source.lockedY()) && void 0 !== s ? s : this._source.y, this._renderer
        }
    }
    var di = i(72739);
    const ui = {
        backgroundColor: (0, At.generateColor)(l.colorsPalette["color-tv-blue-500"], 70),
        borderColor: (0, At.generateColor)(l.colorsPalette["color-tv-blue-500"], 20)
    };
    class pi {
        constructor(e) {
            this._renderer = new di.RectangleRenderer, this._rectangle = null, this._crosshair = e
        }
        update() {
            const e = this._crosshair.selection();
            null !== e && null !== this._crosshair.pane ? this._rectangle = this._crosshair.pane.logicalRectToPixels(e) : this._rectangle = null
        }
        renderer(e, t) {
            if (!this._rectangle) return null;
            const i = {
                backcolor: ui.backgroundColor,
                color: ui.borderColor,
                fillBackground: !0,
                linewidth: 1,
                points: [this._rectangle.min, this._rectangle.max],
                extendLeft: !1,
                extendRight: !1
            };
            return this._renderer.setData(i), this._renderer
        }
    }
    var _i = i(38223),
        mi = i(57322),
        gi = i(2043),
        fi = i(98596),
        vi = i(99031),
        Si = i(80657),
        yi = i(19266),
        bi = i(73436);
    const wi = c.t(null, void 0, i(33355)),
        Pi = c.t(null, {
            context: "study"
        }, i(32819)),
        Ci = new ye.PercentageFormatter,
        xi = new gi.TimeSpanFormatter,
        Ti = new fi.VolumeFormatter,
        Ii = (0, l.getHexColorByName)("color-tv-blue-500"),
        Mi = (0, l.getHexColorByName)("color-ripe-red-400"),
        Ai = {
            bgColorPositive: (0, At.generateColor)(Ii, 80),
            bgColorNegative: (0, At.generateColor)(Mi, 80),
            colorPositive: (0, l.getHexColorByName)("color-tv-blue-600"),
            colorNegative: (0, l.getHexColorByName)("color-ripe-red-400"),
            labelBgColorPositive: Ii,
            labelBgColorNegative: Mi
        };
    class Li {
        constructor(e, t) {
            this._pipFormatter = null, this._lastSymbolInfo = null, this._horzTrenRenderer = new vi.TrendLineRenderer, this._vertTrenRenderer = new vi.TrendLineRenderer, this._bgRenderer = new di.RectangleRenderer, this._labelRenderer = new Si.TextRenderer, this._p1 = null, this._p2 = null, this._label = null, this._source = e, this._pane = t
        }
        update(e) {
            var t, i;
            const [s, r] = this._source.measurePoints();
            if (void 0 === r) return this._p1 = null, void(this._p2 = null);
            const a = (0, n.ensureNotNull)(this._source.measurePane().value()),
                l = s.price,
                c = r.price,
                h = r.index - s.index,
                d = (0, _i.forceLTRStr)("" + h),
                u = (0, n.ensureNotNull)(a.mainDataSource()),
                p = (0, n.ensureNotNull)(u.formatter()),
                _ = r.price - l;
            let m = null !== (i = null === (t = p.formatChange) || void 0 === t ? void 0 : t.call(p, r.price, l)) && void 0 !== i ? i : p.format(_);
            if (Math.abs(l) > 1e-8) {
                const e = _ / Math.abs(l);
                m += " (" + Ci.format(100 * e) + ")"
            }
            const g = (0, _i.forceLTRStr)(m);
            this._label = g + "\n" + wi.format({
                count: d
            });
            const f = (0, n.ensureNotNull)(u.firstValue()),
                v = this._source.model().timeScale().indexToCoordinate(s.index),
                S = this._source.model().timeScale().indexToCoordinate(r.index),
                y = a.defaultPriceScale().priceToCoordinate(l, f),
                b = a.defaultPriceScale().priceToCoordinate(c, f);
            this._p1 = new o.Point(v, y), this._p2 = new o.Point(S, b);
            const w = this._source.model().timeScale().indexToUserTime(s.index),
                P = this._source.model().timeScale().indexToUserTime(r.index);
            let C = null;
            if (null !== w && null !== P) {
                const e = this._pane.model().mainSeries().symbolInfo();
                null !== e && e !== this._lastSymbolInfo && (this._pipFormatter = new mi.PipFormatter(e.pricescale, e.minmov, e.type, e.minmove2, e.typespecs), this._lastSymbolInfo = e), C = (P.valueOf() - w.valueOf()) / 1e3
            }
            const x = this._pipFormatter ? this._pipFormatter.format(_) : null,
                T = null !== x ? " , " + x : "",
                I = null !== C ? xi.format(C) : null,
                M = null !== I ? ", " + (0, _i.startWithLTR)(I) : "";
            this._label = (0, _i.forceLTRStr)(g + T) + "\n" + wi.format({
                count: d
            }) + M;
            const A = this._source.measureVolume();
            Number.isNaN(A) || (this._label += `\n${Pi} ${Ti.format(A)}`);
            const k = c < l ? Ai.bgColorNegative : Ai.bgColorPositive,
                E = c < l ? Ai.colorNegative : Ai.colorPositive,
                D = c < l ? Ai.labelBgColorNegative : Ai.labelBgColorPositive,
                V = {
                    points: [this._p1, this._p2],
                    linewidth: 0,
                    fillBackground: !0,
                    color: k,
                    backcolor: k,
                    extendLeft: !1,
                    extendRight: !1
                };
            this._bgRenderer.setData(V);
            const B = this._p1.add(this._p2).scaled(.5);
            {
                const e = Math.round(B.y),
                    t = new o.Point(this._p1.x, e),
                    i = new o.Point(this._p2.x, e),
                    s = {
                        points: [t, i],
                        color: E,
                        linewidth: 1,
                        linestyle: ri.LINESTYLE_SOLID,
                        extendleft: !1,
                        extendright: !1,
                        leftend: bi.LineEnd.Normal,
                        rightend: Math.abs(t.x - i.x) >= 50 ? bi.LineEnd.Arrow : bi.LineEnd.Normal
                    };
                this._horzTrenRenderer.setData(s)
            } {
                const e = Math.round(B.x),
                    t = new o.Point(e, this._p1.y),
                    i = new o.Point(e, this._p2.y),
                    s = {
                        points: [t, i],
                        color: E,
                        linewidth: 1,
                        linestyle: ri.LINESTYLE_SOLID,
                        extendleft: !1,
                        extendright: !1,
                        leftend: bi.LineEnd.Normal,
                        rightend: Math.abs(t.y - i.y) >= 50 ? bi.LineEnd.Arrow : bi.LineEnd.Normal
                    };
                this._vertTrenRenderer.setData(s)
            }
            const R = {
                    x: 0,
                    y: 10
                },
                N = .5 * (this._p1.x + this._p2.x),
                O = this._p2.y,
                F = new o.Point(N, O),
                W = (z = (0, n.ensureNotNull)(this._label), {
                    points: [F],
                    text: z,
                    color: "#FFFFFF",
                    horzAlign: "center",
                    vertAlign: "middle",
                    font: L.CHART_FONT_FAMILY,
                    offsetX: R.x,
                    offsetY: R.y,
                    bold: !1,
                    italic: !1,
                    fontsize: 12,
                    padding: 8,
                    highlightBorder: !1,
                    backgroundColor: D,
                    backgroundTransparency: 10,
                    backgroundVertInflate: 5,
                    backgroundHorzInflate: 5,
                    backgroundRoundRect: 4
                });
            var z;
            this._labelRenderer.setData(W);
            const H = this._labelRenderer.measure(),
                U = (0, Si.calculateLabelPosition)(H, this._p1, this._p2, R, this._pane.height());
            this._labelRenderer.setPoints([U])
        }
        renderer() {
            if (null === this._p1 || null === this._p2) return null;
            const e = new yi.CompositeRenderer;
            return e.append(this._bgRenderer), e.append(this._horzTrenRenderer), e.append(this._vertTrenRenderer), e.append(this._labelRenderer), e
        }
    }
    var ki = i(15187);
    class Ei extends ki.MediaCoordinatesPaneRenderer {
        constructor(e) {
            super(), this._data = e
        }
        hitTest(e) {
            return null
        }
        _drawImpl(e) {
            const t = e.context;
            t.translate(this._data.x - this._data.width / 2, this._data.y - this._data.height / 2), t.strokeStyle = "rgba(153,153,153,.3)", t.lineWidth = 2, t.beginPath(), this._drawShackle(t), t.stroke(), t.closePath(), t.strokeStyle = "rgba(153,153,153,.7)", t.lineWidth = 1, t.beginPath(), t.rect(0, this._data.height - this._data.bodyHeight + .5, this._data.width, this._data.bodyHeight), t.closePath(), t.stroke(), t.translate(0, -1), t.strokeStyle = "#777", t.beginPath(), this._drawShackle(t), t.stroke(), t.closePath(), t.fillStyle = "rgba(255,255,255,.7)", t.beginPath(), t.rect(1, this._data.height - this._data.bodyHeight + 1.5, this._data.width - 2, this._data.bodyHeight - 2), t.fill(), t.beginPath(), t.rect(.5, this._data.height - this._data.bodyHeight + 1, this._data.width - 1, this._data.bodyHeight - 1), t.stroke(), t.closePath(), t.fillStyle = "#777", t.fillRect(this._data.width / 2 - .5, this._data.height - this._data.bodyHeight / 2, 1, 2)
        }
        _drawShackle(e) {
            const t = (this._data.width - 3) / 2,
                i = this._data.height - this._data.bodyHeight;
            e.moveTo(1.5, t), e.arc(this._data.width / 2, t, t, Math.PI, 2 * Math.PI), i > t && (e.moveTo(1.5, t), e.lineTo(1.5, i), e.moveTo(this._data.width - 1.5, t), e.lineTo(this._data.width - 1.5, i))
        }
    }
    class Di {
        constructor(e, t, i) {
            this._horzVisible = !1, this._source = e, this._pane = t, this._axis = i || "x"
        }
        update() {}
        renderer(e, t) {
            var i;
            const s = this._source.visible && this._source.areLinesVisible,
                r = 0 === (null === (i = Se.crosshairLock.value()) || void 0 === i ? void 0 : i.type),
                o = s && this._horzVisible,
                a = s || r;
            if ("y" === this._axis && !o || !a) return null;
            const l = "y" === this._axis ? this._pane.width() - 4.5 : (0, n.ensureNotNull)(this._source.lockedX()) + 1,
                c = "y" === this._axis ? this._source.y : this._pane.height() - 5.5 - 1;
            return new Ei({
                x: l,
                y: c,
                width: 9,
                height: 11,
                bodyHeight: 7
            })
        }
    }
    var Vi = i(49483),
        Bi = i(93835),
        Ri = i(88546);
    class Ni extends Bi.DataWindowView {
        constructor(e) {
            super(), this._invalidated = !0,
                this._dateItem = new Bi.DataWindowItem("", c.t(null, void 0, i(76912)), ""), this._timeItem = new Bi.DataWindowItem("", c.t(null, void 0, i(31976)), ""), this._model = e, this._items.push(this._dateItem), this._items.push(this._timeItem)
        }
        update() {
            this._invalidated = !0
        }
        items() {
            return this._invalidated && (this._updateImpl(), this._invalidated = !1), this._items
        }
        _updateImpl() {
            const e = this._model.mainSeries().isDWM();
            if (this._timeItem.setVisible(!e), this._timeItem.setValue(Ri.notAvailable), this._dateItem.setValue(Ri.notAvailable), this._model.timeScale().isEmpty()) return;
            let t = this._model.crossHairSource().appliedIndex();
            if (!(0, Bt.isNumber)(t)) {
                const e = this._model.mainSeries().data().last();
                if (null === e) return;
                t = e.index
            }
            const i = this._model.timeScale().indexToUserTime(t);
            null !== i && (this._dateItem.setValue(this._model.dateFormatter().format(i)), e || this._timeItem.setValue(this._model.timeFormatter().format(i)))
        }
    }
    var Oi = i(34951);
    const Fi = l.colorsPalette["color-tv-blue-500"],
        Wi = c.t(null, {
            context: "Replay"
        }, i(20747));
    class zi extends Oi.TimeAxisView {
        constructor(e, t, i, s = !1) {
            super(e), this._indexProvider = i, this._highlighted = s, this._source = t, this._properties = e.properties().childs().scalesProperties
        }
        _getText(e) {
            if (this._source.isReplaySelection()) {
                const t = this._model.timeScale().indexToUserTime(e);
                return null !== t ? `${Wi}: ${this._model.dateTimeFormatter().format(t)}` : ""
            }
            return super._getText(e)
        }
        _getBgColor() {
            if (this._source.isReplaySelection()) return Fi;
            const e = this._properties.childs();
            return this._highlighted ? e.axisLineToolLabelBackgroundColorCommon.value() : this._model.dark().value() ? e.crosshairLabelBgColorDark.value() : e.crosshairLabelBgColorLight.value()
        }
        _getIndex() {
            return this._model.crossHairSource().visible || null !== this._source.lockedPane() ? this._indexProvider() : null
        }
        _isVisible() {
            return this._properties.childs().showTimeScaleCrosshairLabel.value()
        }
    }
    var Hi = i(96280),
        Ui = i(94025);
    const ji = {
        menuEnabled: !1,
        menuForMainSourceOnly: !1,
        disableTradingMenuActions: !1,
        disableDrawHorizLineMenuAction: !1
    };
    let Gi = 0;
    const qi = (0, X.getLogger)("Chart.Crosshair");
    class $i extends Ht.DataSource {
        constructor(e, t, i) {
            super(), this.pane = null, this.price = NaN, this.index = NaN, this.visible = !0, this.areLinesVisible = !0, this.x = NaN, this.y = NaN, this._lockData = null, this._measurePane = new(Y())(null), this._measurePaneViewCache = new WeakMap, this._startMeasurePoint = null, this._endMeasurePoint = null, this._lastValidMeasurePoint = null, this._isOnHoveredChartWidget = !1, this._crossHairSelectPointMode = new(Y())(Se.SelectPointMode.None), this._selectionPane = null, this._selectionView = new pi(this), this._selectionStartPoint = null, this._timeLockPaneView = null, this._crosshairPaneViewCache = new WeakMap, this._pointSelectionPaneViewCache = new WeakMap, this._priceAxisViews = new Map, this._panePriceAxisViews = new Map, this._startMeasurePriceAxisViews = new Map, this._endMeasurePriceAxisViews = new Map, this._originX = NaN, this._originY = NaN, this._subscribed = !1, this._movedDelegate = new(q()), this._pointSelectedDelegate = new(q()), this._requestedPoint = null, this._paneForRequestedPoint = null, this._selectLineColor = null, this._volumeCalculator = null,
                this._currentMeasurePointsetAndSymbolId = null, this._model = e, this._options = Object.assign({}, ji, i || {}), this._linesShouldBeHidden = this._model.readOnly(), this._dataWindowView = new Ni(e), this.setSelectionEnabled(!1);
            const s = e => t => t === (0, n.ensureNotNull)(this._measurePane.value()).defaultPriceScale() ? e() : null;
            this._currentPosPriceProvider = e => {
                const t = (0, n.ensureNotNull)(this.pane);
                if (e === t.defaultPriceScale()) return this.price;
                const i = (0, n.ensureNotNull)(t.defaultPriceScale().mainSource()).firstValue();
                if (null === i) return null;
                const s = t.defaultPriceScale().priceToCoordinate(this.price, i),
                    r = (0, n.ensureNotNull)(e.mainSource()).firstValue();
                return null === r ? null : e.coordinateToPrice(s, r)
            }, this._startMeasurePriceProvider = s((() => (0, n.ensureNotNull)(this._startMeasurePoint).price)), this._endMeasurePriceProvider = s((() => (0, n.ensureNotNull)(this._lastMeasurePoint()).price)), this._properties = t;
            this._timeAxisView = new zi(e, this, (() => this.appliedIndex()), !1), this._startMeasureTimeAxisView = new zi(e, this, (() => (0, n.ensureNotNull)(this._startMeasurePoint).index), !0), this._endMeasureTimeAxisView = new zi(e, this, (() => (0, n.ensureNotNull)(this._lastMeasurePoint()).index), !0), e.readOnly() || Se.cursorTool.subscribe((e => this.areLinesVisible = "arrow" !== e), {
                callWithLast: !0
            }), this._crosshairLock = Se.crosshairLock.spawn(), this._showPlusButtonOnCursor = ei.showPlusButtonOnCursor.spawn();
            const r = () => {
                this.updateAllViews((0, W.sourceChangeEvent)(this.id())), this._model.lightUpdate()
            };
            this._crosshairLock.subscribe(r), this._showPlusButtonOnCursor.subscribe(r)
        }
        destroy() {
            null !== this._volumeCalculator && this._volumeCalculator.destroy(), this._measurePane.setValue(null), this._crosshairLock.destroy(), this._showPlusButtonOnCursor.destroy(), this._removeMeasurePointset()
        }
        moved() {
            return this._movedDelegate
        }
        originX() {
            return this._originX
        }
        originY() {
            return this._originY
        }
        saveOriginCoords(e, t) {
            this._originX = e, this._originY = t
        }
        clearOriginCoords() {
            this._originX = NaN, this._originY = NaN
        }
        currentPoint() {
            return new o.Point(this.x, this.y)
        }
        model() {
            return this._model
        }
        appliedIndex() {
            var e;
            return null !== (e = this._getLockData().index) && void 0 !== e ? e : this.index
        }
        lockedX() {
            var e;
            return null !== (e = this._getLockData().xCoord) && void 0 !== e ? e : null
        }
        lockedY() {
            var e;
            return null !== (e = this._getLockData().yCoord) && void 0 !== e ? e : null
        }
        lockedPane() {
            const e = Se.crosshairLock.value();
            return null === e || 1 !== e.type ? null : this._model.id() === e.modelId ? this._model.paneForId(e.paneId) : this._model.mainPane()
        }
        invalidateLockPosition() {
            this._lockData = null
        }
        startMeasurePoint() {
            return this._startMeasurePoint || null
        }
        endMeasurePoint() {
            return this._endMeasurePoint || null
        }
        measureVolume() {
            if (null === this._volumeCalculator) return NaN;
            const [e, t] = this.measurePoints();
            return void 0 === t ? NaN : this._volumeCalculator.volume(e.index, t.index)
        }
        measurePane() {
            return this._measurePane.readonly()
        }
        startMeasuring(e, t) {
            this._startMeasurePoint = e, this._measurePane.setValue(t), t.containsMainSeries() && ((0, n.assert)(null === this._volumeCalculator), this._volumeCalculator = new Hi.SeriesTimeRangeVolumeCalculator(this.model().mainSeries())), this._model.updatePane(t)
        }
        finishMeasure(e) {
            this._endMeasurePoint = e, this._createMeasurePointset((0, n.ensureNotNull)(this._startMeasurePoint), this._endMeasurePoint)
        }
        clearMeasure() {
            this._removeMeasurePointset(), this._measurePane.setValue(null), delete this._startMeasurePoint, delete this._endMeasurePoint, delete this._lastValidMeasurePoint, this._model.lightUpdate(), null !== this._volumeCalculator && (this._volumeCalculator.destroy(), this._volumeCalculator = null)
        }
        measurePoints() {
            const e = [(0, n.ensureNotNull)(this._startMeasurePoint)],
                t = this._lastMeasurePoint();
            return null !== t && e.push(t), e
        }
        startSelection(e) {
            this._selectionStartPoint = this.currentLogicalPoint(), this._selectionPane = e
        }
        clearSelection() {
            this._selectionStartPoint = null, this._selectionPane = null
        }
        selection() {
            return this._selectionStartPoint ? {
                p1: this._selectionStartPoint,
                p2: this.currentLogicalPoint()
            } : null
        }
        currentLogicalPoint() {
            return {
                index: this.appliedIndex(),
                price: this.price
            }
        }
        selectPointMode() {
            return this._crossHairSelectPointMode
        }
        lineColor() {
            return this._selectLineColor
        }
        cancelRequestSelectPoint() {
            this._crossHairSelectPointMode.value() !== Se.SelectPointMode.None && this._setSelectPointModeState(Se.SelectPointMode.None)
        }
        requestSelectPoint(e) {
            (0, n.assert)(this._crossHairSelectPointMode.value() === Se.SelectPointMode.None, "Point already requested");
            const {
                pointType: t,
                pane: i,
                lineColor: s = null,
                selectPointMode: r = Se.SelectPointMode.Study
            } = e;
            i && ((0, n.assert)(-1 !== this._model.panes().indexOf(i), "Chartmodel doesn't contains specified pane"), this._paneForRequestedPoint = i, this._model.panesCollectionChanged().subscribe(this, this._paneCollectionChanged)), this._selectLineColor = s, this._requestedPoint = t, this._setSelectPointModeState(r)
        }
        onPointSelected() {
            return this._pointSelectedDelegate
        }
        trySelectCurrentPoint() {
            const e = (0, n.ensureNotNull)(this._requestedPoint);
            if (!this._model.mainSeries().bars().contains(this.index) && "price" !== e) return;
            const t = (0, n.ensureNotNull)(this.pane);
            if (this._paneForRequestedPoint && this._paneForRequestedPoint !== t) return;
            let i, s;
            if ("price" === e || (i = this._model.timeScale().indexToTimePoint(this.index), null !== i)) {
                if ("time" !== e) {
                    const e = t.mainDataSource();
                    if (null === e) return;
                    const i = e.firstValue(),
                        r = e.priceScale();
                    if (null === i || null === r) return;
                    s = r.coordinateToPrice(this.y, i)
                }
                this._setSelectPointModeState(Se.SelectPointMode.None), this._pointSelectedDelegate.fire({
                    time: i,
                    price: s
                }, t)
            }
        }
        isOnHoveredChartWidget() {
            return this._isOnHoveredChartWidget
        }
        setOnHoveredChartWidget(e) {
            this._isOnHoveredChartWidget = e
        }
        isReplaySelection() {
            return !1
        }
        clearPosition() {
            this.visible = !1, this.index = NaN, this.price = NaN, this.x = NaN, this.y = NaN, this.pane = null, this.clearOriginCoords(), this._updateVisibilityDependentPaneViews()
        }
        setPosition(e, t, i) {
            return this._subscribed || (this._model.mainSeries().onRestarted().subscribe(this, this.clearMeasure), this._subscribed = !0), this.visible = !0, this._tryToUpdateViews(e, t, i)
        }
        setLinesShouldBeHidden(e) {
            this._linesShouldBeHidden = e
        }
        linesShouldBeHidden() {
            return this._linesShouldBeHidden
        }
        handleContextMenuEvent(e) {
            this._crossHairSelectPointMode.value() !== Se.SelectPointMode.None && this._setSelectPointModeState(Se.SelectPointMode.None)
        }
        properties() {
            return this._properties
        }
        priceAxisViews(e, t) {
            var i;
            const s = null === this._requestedPoint || "time" !== this._requestedPoint || !this._isOnHoveredChartWidget,
                r = [];
            return (null !== (i = this.lockedPane()) && void 0 !== i ? i : this.pane) === e && s && r.push(this._createPriceAxisViewOnDemand(this._priceAxisViews, this._panePriceAxisViews, e, t, this._currentPosPriceProvider, Zt, !0)[0]), this._startMeasurePoint && r.push(this._createPriceAxisViewOnDemand(this._startMeasurePriceAxisViews, null, e, t, this._startMeasurePriceProvider, Xt)[0]), this._lastMeasurePoint() && r.push(this._createPriceAxisViewOnDemand(this._endMeasurePriceAxisViews, null, e, t, this._endMeasurePriceProvider, Xt)[0]), r
        }
        timeAxisViews() {
            const e = [],
                t = null === this._requestedPoint || "price" !== this._requestedPoint || !this._isOnHoveredChartWidget;
            return this._linesShouldBeHidden || !this.visible && null === Se.crosshairLock.value() || !t || e.push(this._timeAxisView), this._startMeasurePoint && e.push(this._startMeasureTimeAxisView), this._lastMeasurePoint() && e.push(this._endMeasureTimeAxisView), e
        }
        paneViews(e) {
            var t, i;
            if (void 0 === e) return null;
            const s = [];
            if (this.isReplaySelection()) {
                let t = this._pointSelectionPaneViewCache.get(e);
                t || (t = new CrosshairPointSelectionPaneView(this, e, this._model), this._pointSelectionPaneViewCache.set(e, t)), s.push(t)
            }
            let r = this._crosshairPaneViewCache.get(e);
            if (r || (r = new hi(this, e), this._crosshairPaneViewCache.set(e, r)), s.push(r), e === this._selectionPane && s.push(this._selectionView), e === this._measurePane.value()) {
                let t = this._measurePaneViewCache.get(e);
                t || (t = new Li(this, e), this._measurePaneViewCache.set(e, t)), t.update((0, W.sourceChangeEvent)(this.id())), s.push(t)
            }
            if ((ei.addPlusButtonProperty.value() || this._showPlusButtonOnCursor.value()) && 1 !== (null === (t = Se.crosshairLock.value()) || void 0 === t ? void 0 : t.type)) {
                const t = e === this.pane,
                    i = !Vi.CheckMobile.any() || window.screen.width >= 320,
                    r = Se.tool.value(),
                    n = (0, he.isLineToolName)(r),
                    o = null !== this._model.lineBeingEdited() || null !== this._model.lineBeingCreated() || this._model.sourcesBeingMoved().length > 0 || null !== this._model.customSourceBeingMoved() || (0, Se.toolIsMeasure)(r);
                if (t && this._isOnHoveredChartWidget && this._crossHairSelectPointMode.value() === Se.SelectPointMode.None && i && !n && !o) {
                    const t = e.mainDataSource();
                    if (null !== t) {
                        const i = t.priceScale();
                        if (null !== i) {
                            const t = this._createPriceAxisViewOnDemand(this._priceAxisViews, this._panePriceAxisViews, e, i, this._currentPosPriceProvider, Zt, !0)[1];
                            null !== t && s.push(t)
                        }
                    }
                }
            }
            return 0 === (null === (i = Se.crosshairLock.value()) || void 0 === i ? void 0 : i.type) && (null === this._timeLockPaneView && (this._timeLockPaneView = new Di(this, e)), s.push(this._timeLockPaneView)), s
        }
        dataWindowView() {
            return this._dataWindowView
        }
        updateAllViews(e) {
            this._priceAxisViews.forEach((t => {
                    t.forEach((t => t.update(e)))
                })), this._panePriceAxisViews.forEach((t => {
                    t.forEach((t => t.update(e)))
                })), this._startMeasurePoint && (this._startMeasurePriceAxisViews.forEach((t => {
                    t.forEach((t => t.update(e)))
                })), this._startMeasureTimeAxisView.update(e)),
                this._lastMeasurePoint() && (this._endMeasurePriceAxisViews.forEach((t => {
                    t.forEach((t => t.update(e)))
                })), this._endMeasureTimeAxisView.update(e)), this._timeAxisView.update(e), this._selectionView.update(), this._dataWindowView.update(), this._updateVisibilityDependentPaneViews()
        }
        isMenuEnabled() {
            return this._options.menuEnabled
        }
        isHoveredEnabled() {
            return ei.addPlusButtonProperty.value() || this._showPlusButtonOnCursor.value()
        }
        isHovered() {
            return this._model.hoveredSource() === this
        }
        pointToSelect() {
            return this._requestedPoint
        }
        paneForPointSelect() {
            return this._paneForRequestedPoint
        }
        _lastMeasurePoint() {
            return this._endMeasurePoint ? this._endMeasurePoint : (null !== this.pane && this._measurePane.value() === this.pane && (this._lastValidMeasurePoint = {
                price: this._model.magnet().align(this.price, this.index, this.pane),
                index: this.index
            }), this._lastValidMeasurePoint || null)
        }
        _createPriceAxisViewOnDemand(e, t, i, s, r, o, a = !1) {
            let l = e.get(i),
                c = null !== t ? t.get(i) : void 0;
            void 0 === l && (l = new Map, e.set(i, l), this._options.menuEnabled && null !== t && (c = new Map, t.set(i, c)), a && i.onDestroyed().subscribe(this, (() => this._onPaneDestroyed(i))));
            let h = l.get(s);
            if (void 0 === h) {
                if (h = new o(this, i, s, r), l.set(s, h), void 0 !== c) {
                    const e = new si(h, this, s, this._model, this._options);
                    c.set(s, e)
                }
                a && s.lastSourceRemoved().subscribe(this, (() => this._onPriceScaleCleared(s)))
            }
            let d = null;
            return void 0 !== c && (d = (0, n.ensureDefined)(c.get(s))), [h, d]
        }
        _onPaneDestroyed(e) {
            e.onDestroyed().unsubscribeAll(this), this._priceAxisViews.delete(e), this._panePriceAxisViews.delete(e), this._startMeasurePriceAxisViews.delete(e), this._endMeasurePriceAxisViews.delete(e)
        }
        _onPriceScaleCleared(e) {
            e.lastSourceRemoved().unsubscribeAll(this), this._priceAxisViews.forEach((t => t.delete(e))), this._panePriceAxisViews.forEach((t => t.delete(e))), this._startMeasurePriceAxisViews.forEach((t => t.delete(e))), this._endMeasurePriceAxisViews.forEach((t => t.delete(e)))
        }
        _tryToUpdateViews(e, t, i) {
            return !!this._tryToUpdateData(e, t, i) && (this.updateAllViews((0, W.sourceChangeEvent)(this.id())), this._movedDelegate.fire({
                index: this.index,
                price: this.price
            }), !0)
        }
        _tryToUpdateData(e, t, i) {
            const s = this.x,
                r = this.y,
                o = this.price,
                a = this.index,
                l = this.pane,
                c = this._priceScaleByPane(i);
            if (this.index = e, this.x = isNaN(e) ? NaN : this._model.timeScale().indexToCoordinate(e), null !== c && null !== i) {
                this.pane = i, this.price = t;
                const e = (0, n.ensureNotNull)(i.mainDataSource()).firstValue();
                this.y = null === e ? NaN : c.priceToCoordinate(t, e)
            } else this.pane = null, this.price = NaN, this.y = NaN;
            return s !== this.x || r !== this.y || a !== this.index || o !== this.price || l !== this.pane
        }
        _priceScaleByPane(e) {
            return e && !e.defaultPriceScale().isEmpty() ? e.defaultPriceScale() : null
        }
        _setSelectPointModeState(e) {
            e === Se.SelectPointMode.None && (this._requestedPoint = null, this._selectLineColor = null, this._paneForRequestedPoint && (this._paneForRequestedPoint = null, this._model.panesCollectionChanged().unsubscribe(this, this._paneCollectionChanged))), Se.activePointSelectionMode.setValue(e), this._crossHairSelectPointMode.setValue(e), this._model.lightUpdate()
        }
        _paneCollectionChanged(e) {
            const t = this._paneForRequestedPoint;
            null !== t && -1 === e.indexOf(t) && this.cancelRequestSelectPoint()
        }
        _updateVisibilityDependentPaneViews() {
            var e;
            for (const t of this.model().panes()) null === (e = this._pointSelectionPaneViewCache.get(t)) || void 0 === e || e.update()
        }
        _getLockData() {
            var e;
            if (null === this._lockData) {
                const t = Se.crosshairLock.value();
                if (null === t) this._lockData = {};
                else {
                    const i = this._model.timeScale(),
                        s = null !== (e = i.points().roughIndex(t.time)) && void 0 !== e ? e : void 0,
                        r = void 0 === s ? void 0 : i.indexToCoordinate(s);
                    switch (t.type) {
                        case 0:
                            this._lockData = {
                                index: s,
                                xCoord: r
                            };
                            break;
                        case 1: {
                            let e;
                            const i = this.lockedPane();
                            if (null !== i) {
                                const s = i.mainDataSource();
                                if (null !== s) {
                                    const i = s.firstValue(),
                                        r = s.priceScale();
                                    null !== r && null !== i && (e = r.priceToCoordinate(t.price, i))
                                }
                            }
                            this._lockData = {
                                index: s,
                                xCoord: r,
                                yCoord: e
                            }
                        }
                    }
                }
            }
            return this._lockData
        }
        _createMeasurePointset(e, t) {
            const i = this._normalizePoint(e),
                s = this._normalizePoint(t),
                r = [
                    [i.time_t, i.offset],
                    [s.time_t, s.offset]
                ];
            this._removeMeasurePointset(), ++Gi, this._currentMeasurePointsetAndSymbolId = {
                measurePointsetId: Gi,
                symbolId: (0, n.ensureNotNull)(this._model.mainSeries().seriesSource().symbolInstanceId())
            };
            const o = (0, Ui.getServerInterval)(this._model.mainSeries().interval());
            this._model.chartApi().createPointset(this._currentMeasurePointsetIdWithPrefix(), "turnaround", this._currentMeasurePointsetAndSymbolId.symbolId, o, r, this._onPointsetResponse.bind(this))
        }
        _removeMeasurePointset() {
            null !== this._currentMeasurePointsetAndSymbolId && this._model.chartApi().isConnected().value() && this._model.chartApi().removePointset(this._currentMeasurePointsetIdWithPrefix()), this._currentMeasurePointsetAndSymbolId = null
        }
        _currentMeasurePointsetIdWithPrefix() {
            return "pointsetMeasure_" + (0, n.ensureNotNull)(this._currentMeasurePointsetAndSymbolId).measurePointsetId
        }
        _normalizePoint(e) {
            return {
                ...this._model.timeScale().normalizeBarIndex(e.index),
                price: e.price
            }
        }
        _onPointsetResponse(e) {
            if ("pointset_error" === e.method) return void qi.logError(`Error getting pointset: ${e.params[0]} ${e.params[1]}`);
            if (e.params.customId !== this._currentMeasurePointsetIdWithPrefix()) return;
            if (null === this._startMeasurePoint || null === this._endMeasurePoint) return;
            const t = e.params.plots;
            if (2 !== t.length) return;
            const i = t[0].value[0],
                s = t[1].value[0];
            this._startMeasurePoint.index = i, this._endMeasurePoint.index = s, this.updateAllViews((0, W.sourceChangeEvent)(this.id())), this._model.updateSource(this)
        }
    }
    var Yi = i(50146),
        Ki = i(12416),
        Zi = i(17236),
        Xi = i(39262),
        Ji = i(26426),
        Qi = i(56840);
    class es {
        constructor(e) {
            this._priceSourceNamesById = new Map, e.forEach((e => this._priceSourceNamesById.set(e.id, e.name)))
        }
        name(e) {
            var t;
            return null !== (t = this._priceSourceNamesById.get(e)) && void 0 !== t ? t : null
        }
        priceSourcesChanged(e) {
            return e.length !== this._priceSourceNamesById.size
        }
    }
    var ts = i(97906);
    const is = new ee.TranslatedString("remove deselected empty line tools", c.t(null, void 0, i(59211))),
        ss = N.enabled("auto_enable_symbol_labels"),
        rs = (0, X.getLogger)("Chart.ChartModel");

    function ns(e, t) {
        const i = e.indexOf(t);
        return -1 !== i && (e.splice(i, 1), !0)
    }

    function os(e) {
        var t, i;
        for (let s = e.length; s--;) {
            const r = e[s].dataSources();
            for (let e = r.length; e--;) null === (t = r[e].dataWindowView()) || void 0 === t || t.update();
            const n = e[s].priceDataSources();
            for (let e = n.length; e--;) null === (i = n[e].legendView()) || void 0 === i || i.update()
        }
    }
    const as = {
        isSnapshot: !1,
        readOnly: !1,
        watermarkEnabled: !0,
        shiftVisibleRangeOnNewBar: !0,
        currencyConversionEnabled: !1,
        unitConversionEnabled: !1,
        countdownEnabled: !0,
        lastPriceAnimationEnabled: !0,
        onWidget: !1,
        hideIdeas: !1
    };
    class ls {
        constructor(e, t, i, r, n, o, a, l, c, d, u) {
            this._onRearrangePanes = new(q()), this._lineToolsGroupModel = new bt, this._sourcesBeingMoved = [], this._activeItemBeingMoved = null, this._lineBeingEdited = null, this._linePointBeingEdited = null, this._linePointBeingChanged = null, this._customSourceBeingMovedHitTestData = null, this._customSourceBeingMoved = null, this._dataSourceCollectionChanged = new(q()), this._sourceProperitesChanged = new(q()), this._sourceZOrderChanged = new(q()), this._symbolSourceResolved = new(q()), this._symbolSourceResolvingActive = new(Y())(!1), this._adjustForDividendsAvailability = new(Y())(0), this._adjustForDividendsEnabled = new(Y())(!1), this._sessions = null, this._currentTool = "", this._lineBeingCreated = null, this._paneBeingCreatedLineOn = null, this._lineCancelled = new(q()), this._phantomSourceContainer = new Rt(this), this._destroyed = !1, this._isSettingsExternalPosition = !1, this._isTimeScrolling = !1, this._magnet = new Wt, this._scrollingState = null, this._modelIntervals = [], this._rendererOptionsProvider = new k(this), this._studyInserted = new(q()), this._cachedStudiesMaxOffset = 0, this._replayStatus = new(Y())(wt.ReplayStatus.Undefined), this._panes = [], this._tagsChanged = new(q()), this._strategySources = [], this._strategySourcesChange = new(q()), this._activeStrategySource = new(Y())(null), this._paneCollapsingAvailable = new(Y())(!1), this._panesCollectionChanged = new(q()), this._scrollEnabled = N.enabled("chart_scroll"), this._zoomEnabled = N.enabled("chart_zoom"), this._isScalesResetAvailableChanged = new(q()), this._isScalesResetAvailable = !1, this._lollipopSourcesWatcher = null, this._alertsWatcher = null, this._hoveredSource = null, this._hoveredSourceChanged = new(q()), this._lastHoveredHittestData = null, this._lastSelectedHittestData = null, this._topmostCustomSources = [], this._fgCustomSources = [], this._bgCustomSources = [], this._allCustomSources = [], this._customSourcesMap = new Map, this._multiPaneSources = [], this._showLegendProperty = new(M()), this._id = (0, J.guid)(), this._chartSaveTime = null, this._availableCurrenciesList = null, this._availableCurrencies = new Dt([]), this._availablePriceSources = new es([]), this._availableUnitsObject = null, this._availableUnits = new Vt({}), this._availablePriceSourcesList = null, this._shouldBeSavedEvenIfHidden = !1, this._watchedThemeSpawn = h.watchedTheme.spawn(), this._gradientColorsCache = null, this._recalcVRStudiesParams = {}, this._recalcColorStudiesParams = {}, this._recalcVisibleRangeStudiesImplDebounced = (0, s.default)(this._recalcVisibleRangeStudiesImpl.bind(this, this._recalcVRStudiesParams), 500), this._recalcColorStudiesImplDebounced = (0, s.default)(this._recalcColorStudiesImpl.bind(this, this._recalcColorStudiesParams), 250), this._width = 0, this._resetScales = new(q()),
                this._chartThemeLoaded = new(q()), this._selection = new b, this._selectedSourceChanged = new(q()), this._symbolSourceCollectionChanged = new(q()), this._gridSource = new $t, this._syncPointCache = new Map, this._lastAppliedGotoTimeRange = null, this._lastGotoTimeRange = null, this._watermarkContentProvider = null, this._clearSelection = () => {
                    this._lastSelectedHittestData = null, this._selection.clear()
                }, this._removeSourceFromSelection = e => {
                    this._selection.remove(e)
                }, this._addSourceToSelection = (e, t) => {
                    const i = this._selection.isSelected(e);
                    i && this._lastSelectedHittestData === t || e && !e.isSelectionEnabled() || (this._lastSelectedHittestData = t || null, i || this._selection.add(e))
                }, this._recalcSymbolResolvingActive = () => {
                    for (const e of this._panes)
                        if (e.symbolSourceResolvingActive().value()) return void this._symbolSourceResolvingActive.setValue(!0);
                    this._symbolSourceResolvingActive.setValue(!1)
                }, this._recalcAdjustForDividendsAvailibility = () => {
                    var e, t, i, s;
                    if (this._symbolSourceResolvingActive.value()) return void this._adjustForDividendsAvailability.setValue(0);
                    const r = this.mainSeries();
                    switch (null !== (t = null === (e = r.symbolInfo()) || void 0 === e ? void 0 : e.allowed_adjustment) && void 0 !== t ? t : "none") {
                        case "dividends":
                            return void this._adjustForDividendsAvailability.setValue(2);
                        case "splits":
                            return void this._adjustForDividendsAvailability.setValue(1);
                        case "any":
                            return void this._adjustForDividendsAvailability.setValue(3)
                    }
                    for (const e of this.symbolSources().filter(_e.isActingAsSymbolSource)) {
                        if (e.symbolHibernated().value() || e === r) continue;
                        if ("any" === (null !== (s = null === (i = e.symbolInfo()) || void 0 === i ? void 0 : i.allowed_adjustment) && void 0 !== s ? s : "none")) return void this._adjustForDividendsAvailability.setValue(3)
                    }
                    this._adjustForDividendsAvailability.setValue(0)
                }, this._recalcAdjustForDividendsEnabled = () => {
                    switch (this._adjustForDividendsAvailability.value()) {
                        case 2:
                            return void this._adjustForDividendsEnabled.setValue(!0);
                        case 0:
                        case 1:
                            return void this._adjustForDividendsEnabled.setValue(!1)
                    }
                    this._adjustForDividendsEnabled.setValue(this.mainSeries().properties().childs().dividendsAdjustment.value())
                }, this._recalcPaneCollapsingAvailable = e => {
                    let t = this._panes.filter((e => !e.collapsed().value())).length;
                    0 === t && e && this._panes.length > 0 && (this._panes[0].collapsed().setValue(!1), t = 1), this._paneCollapsingAvailable.setValue(t > 1)
                }, this._chartApi = e, this._invalidateHandler = t, this._undoModel = o, this._properties = i, this._options = (0, ie.merge)((0, ie.clone)(as), l), this._collapsedWV = c, this._linkingGroupIndex = d, this._isAutoSaveEnabled = u, this._studiesMetaInfoRepository = n, this._readOnly = this._options.readOnly, this._isSnapshot = this._options.isSnapshot, this._chartSaveTime = (new Date).valueOf(), this._backgroundColor = new(Y())(this._getBackgroundColor()), this._backgroundTopColor = new(Y())(this._getBackgroundColor(!0)), this._properties.childs().paneProperties.childs().background.subscribe(this, this._updateBackgroundColor), this._properties.childs().paneProperties.childs().backgroundType.subscribe(this, this._updateBackgroundColor),
                this._properties.childs().paneProperties.childs().backgroundGradientStartColor.subscribe(this, this._updateBackgroundColor), this._properties.childs().paneProperties.childs().backgroundGradientEndColor.subscribe(this, this._updateBackgroundColor), this._backgroundColor.subscribe(this.recalcColorStudies.bind(this, !1)), this._backgroundTopColor.subscribe(this.recalcColorStudies.bind(this, !1)), this._backgroundCounterColor = new(Y())(this._getBackgroundCounterColor()), this._backgroundColor.subscribe((() => this._backgroundCounterColor.setValue(this._getBackgroundCounterColor()))), this._isDark = (0, ts.combine)((e => "white" === e), this._backgroundCounterColor), this._watchedThemeSpawn.subscribe(this._updateBackgroundColor.bind(this)), this._symbolSourceResolvingActive.subscribe(this._recalcAdjustForDividendsAvailibility), this.setStudiesMetaData(this._studiesMetaInfoRepository.getInternalMetaInfoArray(), this._studiesMetaInfoRepository.getMigrations()), (0, Se.init)();
            const p = this._readOnly ? new(M())((0, B.defaults)("chartproperties.paneProperties.crossHairProperties")) : this._properties.childs().paneProperties.childs().crossHairProperties;
            this.m_crossHairSource = new $i(this, p, this._options.crossHair), this._crossHairSelectPointMode = this.m_crossHairSource.selectPointMode().spawn(), this._crossHairSelectPointMode.subscribe((e => {
                if (e !== Se.SelectPointMode.None && this.lineBeingCreated()) {
                    const e = Se.tool.value();
                    this.cancelCreatingLine(), Se.tool.setValue(e)
                }
            })), this._tagsChanged = new(q());
            const _ = new T.DefaultProperty("chartproperties.mainSeriesProperties");
            _.addExclusion("minTick"), _.addExclusion("priceAxisProperties.lockScale"), _.addExclusion("priceAxisProperties.percentage"), _.addExclusion("priceAxisProperties.indexedTo100"), _.addExclusion("priceAxisProperties.isInverted"), _.addExclusion("priceAxisProperties.log"), _.addExclusion("priceAxisProperties.logDisabled"), _.addExclusion("priceAxisProperties.percentageDisabled"), _.addExclusion("priceAxisProperties.autoScaleDisabled"), _.merge(i.childs().mainSeriesProperties.state()), this._timeScale = new gt(this, this._options.timeScale);
            const m = {
                countdownEnabled: this._options.countdownEnabled,
                lastPriceAnimationEnabled: this._options.lastPriceAnimationEnabled
            };
            this.m_mainSeries = new pe.Series(this, _, m, r), this.m_mainSeries.onStyleChanged().subscribe(this._timeScale, this._timeScale.invalidateVisibleBars);
            const g = () => this.fullUpdate();
            this.m_mainSeries.properties().childs().showCountdown.subscribe(this, (() => {
                    this.m_mainSeries.updateAllViews((0, W.sourceChangeEvent)(this.m_mainSeries.id())), g()
                })), (0, Z.currencyUnitVisibilityProperty)().subscribe(this, g), this._timeScale.visibleBarsStrictRangeChanged().subscribe(this.m_mainSeries, this.m_mainSeries.clearHighLowPriceCache), this._timeScale.visibleBarsStrictRangeChanged().subscribe(this.m_mainSeries, this.m_mainSeries.clearAveragePriceCache), this.createPane(void 0, {
                    axisProperties: _.childs().priceAxisProperties.state(["autoScale"])
                }), this._adjustForDividendsAvailability.subscribe(this._recalcAdjustForDividendsEnabled),
                this.mainSeries().properties().childs().dividendsAdjustment.subscribe(this, this._recalcAdjustForDividendsEnabled), this._recalcAdjustForDividendsEnabled(), this._boundUpdateStudiesMaxOffset = this._updateStudiesMaxOffset.bind(this), this.mainSeries().dataEvents().seriesTimeFrame().subscribe(this, ((e, t, i, s) => {
                    if (null !== this._lastAppliedGotoTimeRange && null !== i && s && (0, Nt.areEqualTimeFrames)(this._lastAppliedGotoTimeRange.range, i)) {
                        const e = this.appliedTimeFrame().value();
                        null !== e && !this._lastAppliedGotoTimeRange.actual && (0, Nt.areEqualTimeFrames)(this._lastAppliedGotoTimeRange.range, e.val) && this.appliedTimeFrame().setValue(null), this._lastAppliedGotoTimeRange = null
                    }
                })), this.mainSeries().dataEvents().completed().subscribe(this, (e => {
                    null === this._lastAppliedGotoTimeRange && null !== this._lastGotoTimeRange && (this.gotoTimeRange(this._lastGotoTimeRange.from, this._lastGotoTimeRange.to), this._lastGotoTimeRange = null)
                }));
            const f = this._panes[0];
            f.setStretchFactor(2 * f.stretchFactor()), this._properties.listeners().subscribe(this, this.lightUpdate), this._properties.childs().timezone.subscribe(null, (() => {
                this._chartApi && this._chartApi.isConnected().value() && this._chartApi.switchTimezone(this.timezone())
            })), f.addDataSource(this.m_mainSeries, f.findSuitableScale(this.m_mainSeries), !1), this._barsMarksSources = a(this);
            for (const e of this._barsMarksSources) e.setOwnerSource(this.m_mainSeries), f.addDataSource(e, this.m_mainSeries.priceScale(), !0);
            this.m_mainSeries.symbolResolved().subscribe(this, this._clearAvailablePriceSources)
        }
        setStudiesMetaData(e, t) {
            this._studiesMetaData = e, this._studyVersioning = new w.StudyVersioning(this._studiesMetaData, t)
        }
        restart() {
            this._chartApi.switchTimezone(this.timezone()), this._timeScale.reset(), this.m_mainSeries.restart();
            for (const e of this.dataSources()) e.restart && e !== this.m_mainSeries && e.restart();
            this.sessions().restart()
        }
        version() {
            return 3
        }
        collapsed() {
            return this._collapsedWV
        }
        chartSaveTime() {
            return this._chartSaveTime
        }
        setChartSaveTime(e) {
            this._chartSaveTime = e
        }
        destroy() {
            this._phantomSourceContainer.destroy(), this._hoveredSourceChanged.destroy(), null !== this._watermarkSource && (this._watermarkSource.destroy(), this._watermarkSource = null), Array.from(this._customSourcesMap.keys()).forEach(this._removeCustomSource, this), (0, n.assert)(0 === this._topmostCustomSources.length), (0, n.assert)(0 === this._fgCustomSources.length), (0, n.assert)(0 === this._bgCustomSources.length), (0, n.assert)(0 === this._allCustomSources.length), (0, n.assert)(0 === this._customSourcesMap.size), null !== this._lollipopSourcesWatcher && (this._lollipopSourcesWatcher.destroy(), this._lollipopSourcesWatcher = null), null !== this._alertsWatcher && this._alertsWatcher.destroy(), this._properties.childs().paneProperties.childs().background.unsubscribeAll(this), this._properties.childs().paneProperties.childs().backgroundType.unsubscribeAll(this), this._properties.childs().paneProperties.childs().backgroundGradientEndColor.unsubscribeAll(this), this._properties.childs().paneProperties.childs().backgroundGradientStartColor.unsubscribeAll(this), this._watchedThemeSpawn.destroy(),
                this._lastHoveredHittestData = null, this._lastSelectedHittestData = null, (0, Z.currencyUnitVisibilityProperty)().unsubscribeAll(this), this._crossHairSelectPointMode.destroy(), this.m_mainSeries.symbolResolved().unsubscribe(this, this._clearAvailablePriceSources), this._destroyed = !0
        }
        undoModel() {
            return this._undoModel
        }
        onData(e) {
            switch (e.method) {
                case "timescale_update": {
                    const t = e.params;
                    this._updateTimeScale({
                        index: t.index,
                        zoffset: t.zoffset,
                        values: t.changes,
                        indexDiffs: t.index_diff,
                        baseIndex: t.baseIndex,
                        marks: t.marks,
                        clearFlag: t.clear
                    });
                    break
                }
                case "timescale_completed": {
                    const t = Boolean(e.params[0]);
                    this._timeScale.onTimeScaleCompleted(t);
                    break
                }
            }
        }
        addStrategySource(e, t) {
            1 !== t && -1 === this._strategySources.indexOf(e) && (this._strategySources.push(e), this._strategySourcesChange.fire(t), this.setActiveStrategySource(e))
        }
        removeStrategySource(e, t) {
            if (1 === t) return;
            const i = this._strategySources.indexOf(e);
            if (-1 !== i) {
                if (this._strategySources.splice(i, 1)[0] === this._activeStrategySource.value() && this.unsetActiveStrategySource(), this._strategySources.length > 0) {
                    const e = this._strategySources[this._strategySources.length - 1];
                    this.setActiveStrategySource(e)
                }
                this._strategySourcesChange.fire(t)
            }
        }
        setActiveStrategySource(e) {
            -1 !== this._strategySources.indexOf(e) && this._activeStrategySource.setValue(e)
        }
        unsetActiveStrategySource() {
            this._activeStrategySource.setValue(null)
        }
        activeStrategySource() {
            return this._activeStrategySource
        }
        strategySources() {
            return this._strategySources
        }
        strategySourcesChange() {
            return this._strategySourcesChange
        }
        setScrollEnabled(e) {
            this._scrollEnabled = e
        }
        scrollEnabled() {
            return this._scrollEnabled
        }
        setZoomEnabled(e) {
            this._zoomEnabled = e
        }
        zoomEnabled() {
            return this._zoomEnabled
        }
        zoomToViewport(e, t, i, s, r) {
            this.setTimeViewport(e, t);
            let n = Math.min(i, s),
                o = Math.max(i, s);
            const a = r.defaultPriceScale();
            a.isPercentage() || a.setMode({
                autoScale: !1
            }), a.isLog() && (n = a.priceToLogical(n), o = a.priceToLogical(o)), a.setPriceRange(new de.PriceRange(n, o)), this.recalculateAllPanes((0, W.viewportChangeEvent)()), this.invalidate(this._paneInvalidationMask(r, K.InvalidationLevel.Light)), this._setScalesResetAvailable(!0)
        }
        setTimeViewport(e, t) {
            const i = this.appliedTimeFrame().value();
            null !== this._lastAppliedGotoTimeRange && null !== i && (0, Nt.areEqualTimeFrames)(this._lastAppliedGotoTimeRange.range, i.val) && !this._lastAppliedGotoTimeRange.actual || (this.timeScale().zoomToBarsRange(e, t), this.recalculateAllPanes((0, W.viewportChangeEvent)()), this.recalcVisibleRangeStudies(), this.lightUpdate())
        }
        onTagsChanged() {
            return this._tagsChanged
        }
        canZoomIn() {
            return this._timeScale.canZoomIn() && this._zoomEnabled
        }
        canZoomOut() {
            return this._timeScale.canZoomOut() && this._zoomEnabled
        }
        onPaneTagsChanged() {
            this._tagsChanged.fire()
        }
        panesCollectionChanged() {
            return this._panesCollectionChanged
        }
        dataSourceCollectionChanged() {
            return this._dataSourceCollectionChanged
        }
        symbolSourceCollectionChanged() {
            return this._symbolSourceCollectionChanged
        }
        symbolSourceResolved() {
            return this._symbolSourceResolved
        }
        symbolSourceResolvingActive() {
            return this._symbolSourceResolvingActive
        }
        adjustForDividendsAvailability() {
            return this._adjustForDividendsAvailability
        }
        adjustForDividendsEnabled() {
            return this._adjustForDividendsEnabled
        }
        paneCollapsingAvailable() {
            return this._paneCollapsingAvailable
        }
        sourcePropertiesChanged() {
            return this._sourceProperitesChanged
        }
        sourceZOrderChanged() {
            return this._sourceZOrderChanged
        }
        zoomTime(e, t, i) {
            if (!this._zoomEnabled) return;
            const s = this.timeScale();
            if (s.isEmpty() || 0 === t) return;
            const r = s.width();
            e = Math.max(1, Math.min(e, r - 2)), s.zoom(e, t, i), this.recalculateAllPanes((0, W.viewportChangeEvent)()), this.lightUpdate(), this.recalcVisibleRangeStudies(), this._setScalesResetAvailable(!0)
        }
        lineBeingEdited() {
            return this._lineBeingEdited
        }
        linePointBeingEdited() {
            return this._linePointBeingEdited
        }
        activeItemBeingMoved() {
            return this._activeItemBeingMoved
        }
        linePointBeingChanged() {
            return this._linePointBeingChanged
        }
        updateAllPaneViews(e) {
            for (const t of this._panes) t.updateAllViews(e)
        }
        dataSources() {
            const e = [this.crossHairSource()];
            for (const t of this._panes)
                for (const i of t.dataSources()) e.push(i);
            return e
        }
        priceDataSources() {
            const e = [];
            for (const t of this._panes)
                for (const i of t.priceDataSources()) e.push(i);
            return e
        }
        symbolSources() {
            const e = [];
            for (const t of this._panes)
                for (const i of t.symbolSources()) e.push(i);
            return e
        }
        selection() {
            return this._selection
        }
        selectionMacro(e, t = !1) {
            const i = this.selection().allSources();
            e({
                removeSourceFromSelection: this._removeSourceFromSelection,
                addSourceToSelection: this._addSourceToSelection,
                clearSelection: this._clearSelection,
                selection: this.selection.bind(this)
            });
            const s = (0, v.subtract)(i, this.selection().allSources()),
                r = (0, v.subtract)(this.selection().allSources(), i);
            r.concat(i).forEach((e => e.updateAllViews((0, W.selectionChangeEvent)())));
            let n = [];
            s.forEach((e => {
                if ((0, S.isLineTool)(e)) {
                    const i = e.hasAlert.value() && e.getAlertSync();
                    i && i.setSelected(!1), !t && e.shouldBeRemovedOnDeselect() && n.push(e)
                }
            })), r.forEach((e => {
                const t = (0, S.isLineTool)(e) && e.hasAlert && e.hasAlert.value() && e.getAlertSync();
                t && t.setSelected(!0)
            })), n = n.filter((e => null !== this.dataSourceForId(e.id()))), n.length > 0 && this._undoModel.removeSources(n, !1, is), this.lightUpdate(), (s.length > 0 || r.length > 0) && this._selectedSourceChanged.fire()
        }
        onSelectedSourceChanged() {
            return this._selectedSourceChanged
        }
        checkLineToolSelection() {
            const e = this.selection().allSources();
            this._selection.checkLineToolSelection(), e.length !== this.selection().allSources().length && this._selectedSourceChanged.fire()
        }
        lineToolsGroupModel() {
            return this._lineToolsGroupModel
        }
        restoreLineToolsGroups(e) {
            this._lineToolsGroupModel = bt.fromState(this, e)
        }
        realignLineTools(e) {
            for (const t of this._panes)(void 0 === e || t.hasDataSource(e)) && t.realignLineTools(e) && this._dataSourceCollectionChanged.fire(t)
        }
        isSnapshot() {
            return this._isSnapshot
        }
        onWidget() {
            return this._options.onWidget
        }
        hideIdeas() {
            return this._options.hideIdeas
        }
        updateSource(e) {
            const t = this._invalidationMaskForSource(e);
            null !== t && this.invalidate(t)
        }
        updateSourcePriceScale(e) {
            const t = this._invalidationMaskForSourcePriceScale(e);
            null !== t && this.invalidate(t)
        }
        updatePane(e) {
            this.invalidate(this._paneInvalidationMask(e))
        }
        updateTimeScaleBaseIndex(e) {
            const t = this.mainSeries().bars();
            t.isEmpty() || this._updateBaseIndex((0, n.ensureNotNull)(t.lastIndex()), !!(e && e.index > 0))
        }
        setInterval(e, t) {
            const i = setInterval(e, t);
            return this._modelIntervals.push(i), i
        }
        clearInterval(e) {
            clearInterval(e);
            const t = this._modelIntervals.indexOf(e);
            t > -1 && this._modelIntervals.splice(t, 1)
        }
        clearIntervals() {
            for (let e = 0; e < this._modelIntervals.length; e++) clearInterval(this._modelIntervals[e]);
            this._modelIntervals = []
        }
        insertStudyWithParams(e, t, i, s, o, a, l, c, h, d, u) {
            var p, _;
            let m = null;
            if (!o && void 0 !== e.groupingKey) {
                const t = this.findNonOverlayStudyWithGroupingKey(e.groupingKey);
                null !== t && (m = t.pane)
            }
            null === m && (o || e.is_price_study ? m = (0, n.ensureNotNull)(this.paneForSource(null !== (p = null == a ? void 0 : a[0]) && void 0 !== p ? p : this.m_mainSeries)) : (m = this.createPane(), void 0 !== d && m.setPaneSize(d))), "Compare@tv-basicstudies" === e.id && this.m_mainSeries.priceScale().setMode({
                log: !1,
                percentage: !0
            });
            const g = (0, ie.merge)((0, r.default)(null != s ? s : {}), {
                    inputs: t,
                    parentSources: []
                }),
                f = null != a ? a : [],
                v = (0, C.prepareStudyProperties)(e, g, m, this.studyVersioning(), f),
                S = (0, j.createStudy)(this, v, f, e, u);
            this._recalcVisibleRangeStudiesImpl({
                studies: [S],
                oldEndVisibleIndex: -1,
                oldStartVisibleIndex: -1,
                force: !0,
                timerId: null
            });
            const y = m.findSuitableScale(S, null !== (_ = null == a ? void 0 : a[0]) && void 0 !== _ ? _ : this.mainSeries(), l);
            if (y === this.mainSeries().priceScale() && (0, _e.isSymbolSource)(S)) {
                const e = c ? (0, Xi.sourceNewCurrencyOnPinningToPriceScale)(S, y, this, !0) : null,
                    t = h ? (0, me.sourceNewUnitOnPinningToPriceScale)(S, y, this, !0) : null;
                null === e && null === t || S.setSymbolParams({
                    currency: e || void 0,
                    unit: t || void 0
                })
            }(0, _e.isSymbolSource)(S) && (0, n.ensureNotNull)(m).hasDataSource(this.mainSeries()) && ss && !Qi.getBool("enable_symbol_labels_on_inserting_compare_once", !1) && ((0, T.saveDefaultProperties)(!0), this.properties().childs().scalesProperties.childs().showSymbolLabels.setValue(!0), (0, T.saveDefaultProperties)(!1), Qi.setValue("enable_symbol_labels_on_inserting_compare_once", !0));
            const b = S.start();
            if (i && m.id() === i.paneId) m.insertDataSource(S, y, i.zorder);
            else {
                m.addDataSource(S, y, !1);
                null !== S.preferredZOrder() && m.insertAfter([S], this.mainSeries())
            }
            return S.isLinkedToSeries() && S.setOwnerSource(this.mainSeries()), this.recalculatePane(m, (0, W.sourceChangeEvent)(S.id())), this.fullUpdate(), this._invalidateBarColorerCaches(), this._recalcVisibleRangeStudiesImpl({
                studies: [S],
                force: !0
            }), this._recalcColorStudiesImpl({
                studies: [S],
                force: !0
            }), this._studyInserted.fire(S), S.maxOffset().subscribe(this._boundUpdateStudiesMaxOffset, {
                callWithLast: !0
            }), {
                study: S,
                startPromise: b
            }
        }
        replaceStudyStub(e, t) {
            const i = this.paneForSource(e);
            if (null === i) return !1;
            const s = e.priceScale(),
                r = e.zorder(),
                n = e.ownerSource();
            return this.paneForSource(e) === i ? i.replaceSource(e, t, s) : (i.insertDataSource(t, s, r), this.removeSource(e)), t.setOwnerSource(n), this.dataSources().forEach((i => {
                i.ownerSource() === e && i.setOwnerSource(t)
            })), t.start(), this.recalculatePane(i, (0, W.sourceChangeEvent)(t.id())), this.fullUpdate(), !0
        }
        insertStudyStub(e) {
            const t = this.mainSeries(),
                i = (0,
                    n.ensureNotNull)(this.paneForSource(t)),
                s = new P.StudyStub(this, null, e),
                r = i.createPriceScaleAtPosition("overlay");
            return i.addDataSource(s, r, !1), this.recalculatePane(i, (0, W.sourceChangeEvent)(s.id())), this.fullUpdate(), s
        }
        removeStudyStub(e) {
            const t = this.dataSourceForId(e);
            return null === t ? (rs.logNormal("StudyStub id=" + e + " is not found in chart model"), !1) : (this.removeSource(t), !0)
        }
        allLineTools() {
            return this._getAllSources(S.isLineTool)
        }
        setHoveredSource(e, t = null) {
            const i = this._hoveredSource !== e;
            if (!i && this._lastHoveredHittestData === t) return;
            this._lastHoveredHittestData = t;
            let s = null;
            if (this._hoveredSource) {
                this._hoveredSource.updateAllViews((0, W.selectionChangeEvent)()), s = new K.InvalidationMask(K.InvalidationLevel.Cursor);
                const e = this._invalidationMaskForSource(this._hoveredSource, K.InvalidationLevel.Light);
                null !== e && s.merge(e)
            }
            if (this._hoveredSource = e, e) {
                e.updateAllViews((0, W.selectionChangeEvent)()), s || (s = new K.InvalidationMask(K.InvalidationLevel.Cursor));
                const t = this._invalidationMaskForSource(e, K.InvalidationLevel.Light);
                null !== t && s.merge(t)
            }
            s && this.invalidate(s), i && this._hoveredSourceChanged.fire(e)
        }
        properties() {
            return this._properties
        }
        chartApi() {
            return this._chartApi
        }
        disconnect() {
            this.sessions().stop();
            for (const e of this.dataSources()) e.disconnect && e.disconnect();
            this._timeScale.disconnect()
        }
        crossHairSource() {
            return this.m_crossHairSource
        }
        gridSource() {
            return this._gridSource
        }
        publishedChartsTimelineSource() {
            return null
        }
        hoveredSource() {
            return this._hoveredSource
        }
        hoveredSourceChanged() {
            return this._hoveredSourceChanged
        }
        lastHittestData() {
            return this._lastHoveredHittestData
        }
        lastSelectedHittestData() {
            return this._lastSelectedHittestData
        }
        syncTimeWithModel(e, t) {
            const i = this.mainSeries().syncModel();
            if (null === i) return;
            const s = 1e3 * this.createSyncPoint(e, i.syncSourceTarget()).sourceTimeToTargetTime(t / 1e3),
                r = (0, Pt.get_timezone)(this.timezone());
            let n = (0, Pt.utc_to_cal)(r, s);
            this.mainSeries().isDWM() && (n = i.getSession().spec.correctTradingDay(n), (0, Pt.set_hms)(n, 0, 0, 0, 0, (0, Pt.get_timezone)("Etc/UTC"))), this._gotoTimeImpl(n.getTime(), {
                centerIfVisible: !1
            })
        }
        gotoTime(e) {
            return this._gotoTimeImpl(e, {
                centerIfVisible: !0
            })
        }
        recalculatePane(e, t) {
            null == e || e.recalculate(t)
        }
        recalculateAllPanes(e) {
            this._panes.forEach((t => t.recalculate(e))), this.updateAllPaneViews(e), this.crossHairSource().updateAllViews(e)
        }
        gotoTimeRange(e, t) {
            const i = this.timeScale(),
                s = i.tickMarks(),
                r = this.mainSeries();
            if (void 0 === s.minIndex) return void(this._lastGotoTimeRange = {
                from: e,
                to: t
            });
            let o = e,
                a = t;
            const l = r.symbolInfo();
            if (null !== l) {
                let i = this.properties().childs().timezone.value();
                "exchange" === i && (i = l.timezone);
                const s = (0, Pt.get_timezone)(i),
                    n = (0, Pt.utc_to_cal)(s, e),
                    c = (0, Pt.utc_to_cal)(s, t);
                if (r.isDWM()) {
                    const e = (0, Pt.get_timezone)("Etc/UTC");
                    (0, Pt.set_hms)(n, 0, 0, 0, 0, e), (0, Pt.set_hms)(c, 0, 0, 0, 0, e)
                }
                o = n.getTime(), a = c.getTime()
            }
            const c = (0, n.ensureDefined)(s.maxIndex),
                h = (0, n.ensureDefined)(s.minIndex);
            if (o >= (0, n.ensureNotNull)(s.indexToTime(h)).valueOf() || r.endOfData()) {
                const e = (e, t) => e < t,
                    t = e => (0, n.ensureNotNull)(s.indexToTime(e)).valueOf(),
                    l = (0,
                        v.lowerboundExt)(t, o, e, s.nearestIndex(o), c);
                let d = o === a ? l : (0, v.lowerboundExt)(t, a, e, s.nearestIndex(a), c);
                this._lastGotoTimeRange = null, null !== this._lastAppliedGotoTimeRange && (this._lastAppliedGotoTimeRange.actual = !1);
                const u = i.baseIndex();
                if (l + Math.max(d - l + 1, i.minVisibleBarCount()) > u) {
                    const e = i.targetDefaultRightOffset();
                    d - u < e && (d = u + e)
                }
                if (l !== d) i.zoomToBarsRange(l, d), this.lightUpdate();
                else if (l === h && r.endOfData()) i.zoomToBarsRange(l - 1, d), this.lightUpdate();
                else {
                    const e = ((0, n.ensureNotNull)(i.logicalRange()).left() - l + 1) * i.barSpacing();
                    this.startScrollTime(0), this.scrollTimeTo(e), this.endScrollTime()
                }
            } else {
                const i = {
                    type: "time-range",
                    from: e / 1e3,
                    to: t / 1e3
                };
                null === this._lastAppliedGotoTimeRange ? (this._lastAppliedGotoTimeRange = {
                    range: i,
                    actual: !0
                }, r.loadDataTo(i)) : (0, Nt.areEqualTimeFrames)(this._lastAppliedGotoTimeRange.range, i) || (this._lastGotoTimeRange = {
                    from: e,
                    to: t
                })
            }
        }
        paneForSource(e) {
            if (!(0, f.isDataSource)(e)) return Array.from(this._customSourcesMap.values()).includes(e) ? this.paneForSource(this.mainSeries()) : null;
            for (let t = this._panes.length - 1; t >= 0; t--)
                if (this._panes[t].hasDataSource(e)) return this._panes[t];
            return e instanceof Lt.BarsMarksContainer ? this.paneForSource(this.mainSeries()) : null
        }
        mainPane() {
            for (const e of this._panes)
                if (e.isMainPane()) return e;
            throw new Error("Main pane is not found")
        }
        lastPane() {
            return this._panes[this._panes.length - 1]
        }
        removeSource(e, t) {
            this.selectionMacro((t => t.removeSourceFromSelection(e)), !0), this._hoveredSource === e && (this._hoveredSource = null, this._lastHoveredHittestData = null), this._sourcesBeingMoved.includes(e) && (this._sourcesBeingMoved = this._sourcesBeingMoved.filter((t => t !== e)), this._sourcesBeingMoved.length || (this._activeItemBeingMoved = null)), e === this._lineBeingEdited && (this._lineBeingEdited = null, Se.isToolEditingNow.setValue(!1)), e === this._lineBeingCreated && (this._lineBeingCreated = null, Se.isToolCreatingNow.setValue(!1)), !t && e.stop && e.stop();
            const i = this.detachSource(e),
                s = this.mainSeries().priceScale();
            return (0, j.isStudy)(e) && (0, _e.isActingAsSymbolSource)(e) && e.priceScale() === s && s.isPercentage() && 1 === s.seriesLikeSources().filter(_e.isActingAsSymbolSource).length && s.setMode({
                percentage: !1
            }), this.fullUpdate(), this._invalidateBarColorerCaches(), (0, j.isStudy)(e) && ((0, _.emit)("study_event", e.id(), "remove"), e.isChildStudy() && e.parentSources().forEach((t => t.unsetChild(e))), e.maxOffset().unsubscribe(this._boundUpdateStudiesMaxOffset)), !t && e.destroy && e.destroy(), (0, S.isLineTool)(e) && (e.removeAlert(), (0, _.emit)("drawing_event", e.id(), "remove")), i
        }
        allStudies(e) {
            const t = e ? e => (0, j.isStudy)(e) && !0 : j.isStudy;
            return this._getAllSources(t)
        }
        findNonOverlayStudyWithGroupingKey(e, t) {
            const i = void 0 !== t ? [t] : this._panes;
            for (const t of i) {
                const i = t.dataSources().find((i => (0, j.isStudy)(i) && i.metaInfo().groupingKey === e && !t.isOverlay(i)));
                if (void 0 !== i) return {
                    pane: t,
                    study: i
                }
            }
            return null
        }
        movePaneUp(e) {
            this.movePane(e, e - 1)
        }
        movePaneDown(e) {
            this.movePane(e, e + 1)
        }
        movePane(e, t) {
            const i = this._panes[e];
            this._panes.splice(e, 1), this._panes.splice(t, 0, i), this._panesCollectionChanged.fire(this._panes),
                this._onRearrangePanes.fire(), this.invalidate(K.InvalidationMask.panesOrder())
        }
        backgroundColor() {
            return this._backgroundColor
        }
        backgroundTopColor() {
            return this._backgroundTopColor
        }
        backgroundColorAtYPercentFromTop(e) {
            const t = this.backgroundColor().value(),
                i = this.backgroundTopColor().value();
            if (t === i) return t;
            if (e = Math.max(0, Math.min(100, Math.round(100 * e))), null === this._gradientColorsCache || this._gradientColorsCache.topColor !== i || this._gradientColorsCache.bottomColor !== t) this._gradientColorsCache = {
                topColor: i,
                bottomColor: t,
                colors: new Map
            };
            else {
                const t = this._gradientColorsCache.colors.get(e);
                if (void 0 !== t) return t
            }
            const s = (0, At.gradientColorAtPercent)(i, t, e / 100);
            return this._gradientColorsCache.colors.set(e, s), s
        }
        backgroundCounterColor() {
            return this._backgroundCounterColor.readonly()
        }
        dark() {
            return this._isDark
        }
        defaultResolutions() {
            return this.chartApi().defaultResolutions()
        }
        availableCurrencies() {
            const e = this._getAvailableCurrencies();
            return e.length !== this._availableCurrencies.size() && (this._availableCurrencies = new Dt(e)), this._availableCurrencies
        }
        currencyConversionEnabled() {
            return this._options.currencyConversionEnabled
        }
        availableUnits() {
            const e = this._getAvailableUnits();
            return this._availableUnits.unitsChanged(e) && (this._availableUnits = new Vt(e)), this._availableUnits
        }
        unitConversionEnabled() {
            return this._options.unitConversionEnabled
        }
        availablePriceSources() {
            const e = this._getAvailablePriceSources();
            return null !== e && this._availablePriceSources.priceSourcesChanged(e) && (this._availablePriceSources = new es(e)), this._availablePriceSources
        }
        resetDeferredStudies() {
            Ee.instance(this).reset()
        }
        isJustClonedChart() {
            return this._undoModel.isJustClonedChart()
        }
        studyTemplate(e, t, i) {
            const s = {
                panes: [],
                version: this.version()
            };
            for (const e of this.panes()) s.panes.push(e.state(!0, !1, !0));
            const r = this.mainSeries();
            return e && (s.symbol = r.symbol(), this.currencyConversionEnabled() && i && (s.currency = r.currency()), this.unitConversionEnabled() && i && (s.unit = r.unit())), t && (s.interval = r.interval()), s
        }
        getStudyById(e) {
            const t = this.dataSourceForId(e);
            return null !== t && (0, j.isStudy)(t) ? t : null
        }
        getLineToolById(e) {
            const t = this.dataSourceForId(e);
            return null !== t && (0, S.isLineTool)(t) ? t : null
        }
        restoreLineToolState(e, t, i) {
            e.restorePoints(t.points, t.indexes || []), t.state.intervalsVisibilities = (0, Ve.mergeIntervalVisibilitiesDefaults)(t.state.intervalsVisibilities), e.properties().merge(t.state), e.restoreData && e.restoreData(t), e.linkKey().setValue(t.linkKey || null), e.createServerPoints(), this.fullUpdate();
            const s = e.linkKey().value();
            null !== s && i && (0, Se.restoreLineToolState)({
                model: this,
                linkKey: s,
                state: t
            })
        }
        preferences() {
            return (0, Ki.preferencesByWhiteList)(this, this.mainSeries())
        }
        restoreTheme(e, t, i) {
            e.mainSourceProperties.hollowCandleStyle || (e.mainSourceProperties.hollowCandleStyle = e.mainSourceProperties.candleStyle), this._undoModel.chartLoadTheme(e, t, i)
        }
        onResetScales() {
            return this._resetScales
        }
        startMovingSources(e, t, i, s, r, o) {
            this._sourcesBeingMoved = e, this._activeItemBeingMoved = i;
            let a = !1;
            if (this._sourcesBeingMoved.forEach((e => {
                    !a && (0, j.isStudy)(e) && (a = !0);
                    const l = (0,
                            n.ensureNotNull)(this.paneForSource(e)),
                        c = (0, S.isLineTool)(e),
                        h = c && e.linkKey().value();
                    if (!1 !== h && null !== h && s.has(h) && c && e.isFixed()) {
                        const t = (0, n.ensureDefined)(s.get(h)),
                            a = {
                                screen: this._percentPositionToPoint(t, l)
                            };
                        e.startMoving(a, i, r, o)
                    } else e.startMoving(t, i, r, o);
                    const d = this._paneInvalidationMask(l, K.InvalidationLevel.Light);
                    this.invalidate(d)
                })), !o) {
                const s = e.filter(S.isLineTool).filter((e => e.linkKey().value() && e.isSynchronizable())).map((e => e.linkKey().value()));
                if (s.length && t.logical) {
                    const o = this.externalTimeStamp(t.logical.index),
                        a = {
                            linkKeys: s,
                            model: this,
                            symbol: this.mainSeries().symbol(),
                            point: {
                                price: t.logical.price,
                                timeStamp: o
                            },
                            activeItem: null !== i ? i : void 0,
                            envState: r,
                            pointPositionPercents: new Map
                        };
                    e.forEach((e => {
                        if ((0, S.isLineTool)(e)) {
                            const i = e.linkKey().value();
                            if (i && e.isSynchronizable() && e.isFixed()) {
                                const s = (0, n.ensureNotNull)(this.paneForSource(e));
                                a.pointPositionPercents.set(i, this._pointToPercentPosition((0, n.ensureDefined)(t.screen), s))
                            }
                        }
                    })), (0, Se.startMovingLineTool)(a)
                }
            }
            Se.isToolMovingNow.setValue(!0), a && Se.isStudyEditingNow.setValue(!0)
        }
        moveSources(e, t, i, s) {
            if (this._sourcesBeingMoved.filter((e => !e.isLocked || !e.isLocked())).forEach((r => {
                    const o = (0, S.isLineTool)(r) ? r.linkKey().value() : null;
                    if (null !== o && t.has(o)) {
                        const e = (0, n.ensureNotNull)(this.paneForSource(r)),
                            a = (0, n.ensureDefined)(t.get(o)),
                            l = {
                                screen: this._percentPositionToPoint(a, e)
                            };
                        r.move(l, this._activeItemBeingMoved, i, s)
                    } else r.move(e, this._activeItemBeingMoved, i, s)
                })), this.lightUpdate(), !s && e.logical) {
                const t = this._sourcesBeingMoved.filter(S.isLineTool).filter((e => e.isSynchronizable() && !!e.linkKey().value())).map((e => e.linkKey().value())),
                    s = this.externalTimeStamp(e.logical.index),
                    r = {
                        linkKeys: t,
                        model: this,
                        point: {
                            price: e.logical.price,
                            timeStamp: s
                        },
                        envState: i,
                        pointPositionPercents: new Map
                    };
                this._sourcesBeingMoved.filter(S.isLineTool).forEach((t => {
                    if (t.linkKey().value() && t.isSynchronizable() && t.isFixed()) {
                        const i = (0, n.ensureNotNull)(this.paneForSource(t));
                        r.pointPositionPercents.set(t.linkKey().value(), this._pointToPercentPosition((0, n.ensureDefined)(e.screen), i))
                    }
                })), (0, Se.moveLineTool)(r)
            }
        }
        endMovingSources(e, t, i) {
            const s = this._sourcesBeingMoved.map((s => {
                    const r = (0, n.ensureNotNull)(this.paneForSource(s)),
                        o = s.endMoving(e, t, i),
                        a = this._paneInvalidationMask(r, K.InvalidationLevel.Light);
                    return a.invalidateAll(K.InvalidationLevel.Light), this.invalidate(a), o
                })),
                r = this._sourcesBeingMoved.filter(S.isLineTool).filter((e => e.isSynchronizable() && !!e.linkKey().value())).map((e => e.linkKey().value())),
                o = this._sourcesBeingMoved.filter(S.isLineTool).filter((e => e.isSynchronizable() && !!e.linkKey)).map((e => {
                    const t = {
                        points: e.normalizedPoints(),
                        interval: this.mainSeries().interval()
                    };
                    return e.isFixed() && (t.pointPositionPercents = e.calcPositionPercents()), t
                }));
            r.length && (0, Se.finishMovingLineTool)({
                linkKeys: r,
                model: this,
                finalStates: o,
                changes: s
            }), this._sourcesBeingMoved = [], this._activeItemBeingMoved = null, Se.isToolMovingNow.setValue(!1), Se.isStudyEditingNow.setValue(!1)
        }
        sourcesBeingMoved() {
            return this._sourcesBeingMoved
        }
        setMovingCustomSource(e, t) {
            this._customSourceBeingMoved = e, this._customSourceBeingMovedHitTestData = null !== t ? {
                beingMoved: !1,
                ...t
            } : null
        }
        processingCustomSourceMove() {
            null !== this._customSourceBeingMovedHitTestData && (this._customSourceBeingMovedHitTestData.beingMoved = !0)
        }
        customSourceMovingHitTestData() {
            return this._customSourceBeingMovedHitTestData
        }
        customSourceBeingMoved() {
            return null !== this._customSourceBeingMovedHitTestData && this._customSourceBeingMovedHitTestData.beingMoved ? this._customSourceBeingMoved : null
        }
        lineToolsSynchronizer() {
            return this._lineToolsSynchronizer
        }
        setLineToolsSynchronizer(e) {
            this._lineToolsSynchronizer = e
        }
        width() {
            return this._width
        }
        setWidth(e, t) {
            this._width = e, this._timeScale.setWidth(e, t);
            for (const t of this._panes) t.setWidth(e);
            this.recalculateAllPanes((0, W.viewportChangeEvent)()), this.recalcVisibleRangeStudies()
        }
        setPaneHeight(e, t) {
            e.setHeight(t), this.recalculateAllPanes((0, W.viewportChangeEvent)()), this.lightUpdate()
        }
        isScalesResetAvailableChanged() {
            return this._isScalesResetAvailableChanged
        }
        isScalesResetAvailable() {
            return this._isScalesResetAvailable
        }
        panes() {
            return this._panes
        }
        paneForId(e) {
            return this._panes.find((t => t.id() === e)) || null
        }
        createPane(e, t, i) {
            const s = this._undoModel.chartWidget();
            s.isMaximizedPane() && s.toggleMaximizePane(null);
            const r = this._properties.childs().paneProperties;
            t && r.merge(t);
            const n = new je(this._timeScale, r, this, i);
            return void 0 !== e ? this._panes.splice(e, 0, n) : this._panes.push(n), n.onTagsChanged().subscribe(this, ls.prototype.onPaneTagsChanged), n.dataSourcesCollectionChanged().subscribe(this, (() => this._dataSourceCollectionChanged.fire(n))), n.symbolSourceCollectionChanged().subscribe(this, (() => this._onSymbolSourceCollectionChanged(n))), n.sourcePropertiesChanged().subscribe(this, (e => this._sourceProperitesChanged.fire(n, e))), n.sourceZOrderChanged().subscribe(this, (e => this._sourceZOrderChanged.fire(n, e))), n.symbolSourceResolved().subscribe(this, (e => this._symbolSourceResolved.fire(n, e))), n.symbolSourceResolvingActive().subscribe(this._recalcSymbolResolvingActive), n.collapsed().subscribe(this._recalcPaneCollapsingAvailable), this._recalcPaneCollapsingAvailable(), this._panesCollectionChanged.fire(this._panes), this.invalidate(K.InvalidationMask.panesOrder()), n
        }
        removePane(e) {
            const t = this._undoModel.chartWidget();
            t.isMaximizedPane() && t.toggleMaximizePane(null);
            const i = e;
            i.destroy();
            const s = this._panes.indexOf(i); - 1 !== s && (this._panes.splice(s, 1), e.dataSourcesCollectionChanged().unsubscribeAll(this), e.symbolSourceCollectionChanged().unsubscribeAll(this), e.sourcePropertiesChanged().unsubscribeAll(this), e.onTagsChanged().unsubscribeAll(this), e.symbolSourceResolved().unsubscribeAll(this), i.symbolSourceResolvingActive().unsubscribe(this._recalcSymbolResolvingActive), e.collapsed().unsubscribe(this._recalcPaneCollapsingAvailable), this._recalcPaneCollapsingAvailable(!0));
            this.crossHairSource().pane === e && this.clearCurrentPosition(), this._panesCollectionChanged.fire(this._panes), this.invalidate(K.InvalidationMask.panesOrder())
        }
        changePanesHeight(e, t) {
            if (this._panes.length < 2) return;
            (0,
                n.assert)(e >= 0 && e < this._panes.length, "Invalid pane index");
            const i = this._panes[e],
                s = this._panes.reduce(((e, t) => e + t.stretchFactor()), 0),
                r = this._panes.reduce(((e, t) => e + t.height()), 0),
                o = r - 30 * (this._panes.length - 1);
            t = Math.min(o, Math.max(30, t));
            const a = s / r,
                l = i.height();
            i.setStretchFactor(t * a);
            let c = t - l,
                h = this._panes.length - 1;
            for (const e of this._panes)
                if (e !== i) {
                    const t = Math.min(o, Math.max(30, e.height() - c / h));
                    c -= e.height() - t, h -= 1;
                    const i = t * a;
                    e.setStretchFactor(i)
                } this.fullUpdate()
        }
        clearCurrentPosition() {
            const e = this.crossHairSource();
            e.clearPosition(), (0, n.ensureNotNull)(e.dataWindowView()).update(), os(this._panes), this.invalidate(K.InvalidationMask.cursor());
            const t = this._undoModel.chartWidget();
            t.chartWidgetCollection().syncCrosshair(null, t.id()), this._phantomSourceContainer.onCursorPositionUpdated()
        }
        setAndSaveCurrentPosition(e, t, i, s) {
            this.crossHairSource().saveOriginCoords(e, t), this.setCurrentPosition(e, t, i, s)
        }
        setCurrentPosition(e, t, i, s) {
            var r, o, a, l;
            let c = NaN;
            const h = this._timeScale.coordinateToVisibleIndex(e),
                d = null !== (a = null === (o = null !== (r = this._lineBeingEdited) && void 0 !== r ? r : this._lineBeingCreated) || void 0 === o ? void 0 : o.priceScale()) && void 0 !== a ? a : i.defaultPriceScale();
            let u = null;
            !d.isEmpty() && Number.isFinite(t) && (u = (0, n.ensureNotNull)(i.mainDataSource()).firstValue(), null !== u && (c = d.coordinateToPrice(t, u)));
            const p = this._crossHairSelectPointMode.value() !== Se.SelectPointMode.None,
                _ = this.currentTool(),
                m = this.mainSeries(),
                g = this.crossHairSource(),
                f = g.index,
                v = g.price,
                S = p || Se.isStudyEditingNow.value(),
                y = d === this.m_mainSeries.priceScale() && (this._lineBeingCreated || this._lineBeingEdited || (0, he.isLineToolName)(_) || (0, Se.toolIsMeasure)(_) || S);
            !this._isSettingsExternalPosition && y ? (c = this._magnet.align(c, h, i), null !== u && this._setCorrectedPositionToCrosshair(h, c, i)) : this._magnet.resetLastValue();
            let b = null;
            if (isNaN(c) || (b = i), this._isTimeScrolling) {
                if (!this._isSettingsExternalPosition && p) {
                    const e = m.bars().firstIndex(),
                        t = m.bars().lastIndex();
                    if (null !== e && null !== t) {
                        const s = Math.min(Math.max(h, e), t);
                        s !== h && this._setCorrectedPositionToCrosshair(s, c, i)
                    }
                } else g.setPosition(g.index, c, b);
                return
            }
            g.setOnHoveredChartWidget(!0), g.setPosition(h, c, b), (0, n.ensureNotNull)(g.dataWindowView()).update(), os(this._panes);
            const w = m.syncModel();
            if (this.crossHairSource().startMeasurePoint() || this._lineBeingCreated ? this.lightUpdate() : this.invalidate(K.InvalidationMask.cursor()), this._lineBeingCreated) {
                const e = this._lineBeingCreated.linkKey().value();
                if (!this._isSettingsExternalPosition) {
                    const t = this._lineBeingCreated.setLastPoint({
                        index: h,
                        price: c
                    }, s);
                    if (this._lineBeingCreated.updateAllViews((0, W.sourceChangeEvent)(this._lineBeingCreated.id())), t.price === c && t.index === h || this._setCorrectedPositionToCrosshair(t.index, t.price, i), w && e) {
                        const i = this._timeScale.points().roughTime(t.index, w.projectTime.bind(w));
                        (0, Se.setLineToolLastPoint)({
                            model: this,
                            linkKey: e,
                            point: {
                                timeStamp: (0, n.ensureNotNull)(i),
                                price: t.price
                            }
                        })
                    }
                }
            }
            if (!this._isSettingsExternalPosition && null !== this._lineBeingEdited && null !== this._linePointBeingEdited) {
                const e = {
                    index: h,
                    price: c
                };
                if (null === (l = this._linePointBeingChanged) || void 0 === l ? void 0 : l.nonDiscreteIndex) {
                    const t = this.crossHairSource().originX();
                    Number.isFinite(t) && (e.index = this._timeScale.coordinateToFloatIndex(t))
                }
                this.changeLinePoint(e, s);
                const t = this._lineBeingEdited.alignCrossHairToAnchor(this._linePointBeingEdited) ? this._lineBeingEdited.getPoint(this._linePointBeingEdited) : e;
                null !== t && this._setCorrectedPositionToCrosshair(t.index, t.price, i)
            }
            if (!this._isSettingsExternalPosition && S) {
                const e = m.bars().firstIndex(),
                    t = m.bars().lastIndex();
                if (null !== e && null !== t) {
                    const s = Math.min(Math.max(h, e), t);
                    s !== h && this._setCorrectedPositionToCrosshair(s, c, i)
                }
            }(f !== h || v !== c) && this._syncCrosshair(s)
        }
        setExternalPosition(e, t) {
            let i;
            const s = this.crossHairSource();
            if (s.setOnHoveredChartWidget(!1), null !== e && (0, ie.isNumber)(e.timeStamp)) {
                const t = this.mainSeries().syncModel();
                if (t) {
                    const s = this.createSyncPoint(e.syncSourceTarget, t.syncSourceTarget()).sourceTimeToTargetTime(e.timeStamp);
                    i = this._timeScale.points().roughIndex(s, t.distance.bind(t))
                }
            }
            if (null !== e && null != i && Number.isFinite(i)) {
                this._isSettingsExternalPosition = !0;
                const r = (0, n.ensureNotNull)(this.paneForSource(this.mainSeries())),
                    o = this._timeScale.indexToCoordinate(i),
                    a = (0, n.ensureNotNull)(r.mainDataSource()).firstValue();
                if (null !== a) {
                    let i = NaN;
                    void 0 !== e.price && Number.isFinite(e.price) && (i = this.mainSeries().priceScale().priceToCoordinate(e.price, a)), s.clearOriginCoords(), this.setCurrentPosition(o, i, r, t)
                }
                return s.setOnHoveredChartWidget(!1), void(this._isSettingsExternalPosition = !1)
            }
            s.clearPosition(), (0, n.ensureNotNull)(s.dataWindowView()).update(), os(this._panes), this.invalidate(K.InvalidationMask.cursor())
        }
        startScaleTime(e) {
            this._timeScale.startScale(e)
        }
        scaleTimeTo(e) {
            this._timeScale.scaleTo(e), this.recalculateAllPanes((0, W.viewportChangeEvent)()), this.lightUpdate(), this._setScalesResetAvailable(!0)
        }
        endScaleTime() {
            this._timeScale.endScale(), this.lightUpdate(), this.recalcVisibleRangeStudies()
        }
        resetTimeScale() {
            this._timeScale.restoreDefault(), this.recalculateAllPanes((0, W.viewportChangeEvent)()), this.recalcVisibleRangeStudies(), this.lightUpdate(), this._resetScales.fire(), this._setScalesResetAvailable(!1)
        }
        startScalePrice(e, t, i) {
            e.startScalePrice(t, i)
        }
        scalePriceTo(e, t, i) {
            e.scalePriceTo(t, i), this.mainSeries().priceScale().isLockScale() ? this.lightUpdate() : this.invalidate(this._paneInvalidationMask(e, K.InvalidationLevel.Light)), this._setScalesResetAvailable(!0)
        }
        endScalePrice(e, t) {
            e.endScalePrice(t), this.invalidate(this._paneInvalidationMask(e, K.InvalidationLevel.Light))
        }
        startTwoPointsScalePrice(e, t, i, s) {
            t.startTwoPointsScale(i, s)
        }
        twoPointsScalePriceTo(e, t, i, s) {
            t.twoPointsScale(i, s), this.invalidate(this._paneInvalidationMask(e)), this._setScalesResetAvailable(!0)
        }
        endTwoPointsScalePrice(e, t) {
            t.endTwoPointsScale(), this.invalidate(this._paneInvalidationMask(e))
        }
        resetPriceScale(e, t) {
            this._setScalesResetAvailable(!1), e.resetPriceScale(t), this.invalidate(this._paneInvalidationMask(e, K.InvalidationLevel.Light))
        }
        restorePriceScaleState(e, t, i) {
            e.restorePriceScaleState(t, i),
                this.invalidate(this._paneInvalidationMask(e, K.InvalidationLevel.Light))
        }
        currentTool() {
            return this._currentTool
        }
        setCurrentTool(e) {
            this._currentTool !== e && ((0, he.isLineToolName)(e) && this.selectionMacro((e => {
                e.clearSelection()
            })), this._currentTool = e, this._phantomSourceContainer.onToolChanged())
        }
        detachSource(e) {
            const t = this.paneForSource(e);
            return !!t && (t.removeDataSource(e), t.isEmpty() ? (this._lineBeingCreated && t === this._paneBeingCreatedLineOn && this.cancelCreatingLine(), this.removePane(t), !0) : (this.fullUpdate(), !1))
        }
        children(e, t) {
            return this.dataSources().filter((i => (0, j.isStudy)(i) ? !t && i.parentSources().includes(e) : i.ownerSource() === e))
        }
        onRearrangePanes() {
            return this._onRearrangePanes
        }
        finishLineTool(e) {
            const t = e.linkKey().value();
            (0, Se.drawOnAllCharts)().value() && null !== t && e.isSynchronizable() && (0, Se.finishLineTool)({
                linkKey: t,
                model: this
            })
        }
        startChangingLinetool(e, t, i, s, r) {
            this._lineBeingEdited = e, this._linePointBeingChanged = t || null, this._linePointBeingEdited = void 0 === i ? null : i, this._lineBeingEdited.startChanging(i, t, r), Se.isToolEditingNow.setValue(!0);
            const o = (0, n.ensureNotNull)(this.paneForSource(e));
            this._lineBeingEdited.startDragPoint && void 0 !== i && void 0 !== t && this._lineBeingEdited.startDragPoint(i, t), r || void 0 === i || void 0 === t || this._lineBeingEdited.setPoint(i, t, s, r), this._lineBeingEdited.updateAllViews((0, W.sourceChangeEvent)(this._lineBeingEdited.id()));
            const a = this._paneInvalidationMask(o, K.InvalidationLevel.Light);
            this.invalidate(a);
            const l = e.linkKey().value();
            if (l && e.isSynchronizable() && void 0 !== i && void 0 !== t) {
                const e = (0, n.ensureNotNull)(this.externalTimeStamp(t.index));
                (0, Se.startChangingLineTool)({
                    linkKey: l,
                    model: this,
                    symbol: this.mainSeries().symbol(),
                    point: {
                        price: t.price,
                        timeStamp: e
                    },
                    pointIndex: i,
                    envState: s || null
                })
            }
        }
        createLineTool(e, t, i, s, r, a, l, c) {
            if ((0, n.assert)((0, he.isLineToolName)(i), `Cannot create unknown line tool: ${i}`), s) {
                const e = {
                        ...Zi.intervalsVisibilitiesDefaults
                    },
                    t = s.childs().intervalsVisibilities.state();
                (0, ie.merge)(e, null != t ? t : {});
                const r = s.state();
                r.intervalsVisibilities = e, s = (0, S.createLineToolProperties)(i, r, this)
            }
            const h = (0, S.createLineTool)(i, this, s, null, void 0, c);
            if ("LineToolExecution" !== i) {
                let e;
                switch (i) {
                    case "LineToolIcon":
                        e = h.properties().childs().icon.value().toString(16).toUpperCase();
                        break;
                    case "LineToolEmoji":
                        e = h.properties().childs().emoji.value();
                        break;
                    case "LineToolSticker":
                        e = h.properties().childs().sticker.value()
                }(0, u.trackEvent)("drawings", "Study_Drawing_" + i, e)
            }
            const d = !h.linkKey().value() && !r;
            l = (0, n.ensureDefined)(l || (0, n.ensureNotNull)(e.mainDataSource())), s || (0, S.prepareLineToolPropertiesByOwnerSource)(h.properties(), l), h.setOwnerSource(l);
            const p = l.priceScale();
            if (h.setPriceScale(p), e.addDataSource(h, p, !1), null !== h.preferredZOrder() && e.insertAfter([h], this.mainSeries()), (0, Se.drawOnAllCharts)().value()) {
                const e = h.isSynchronizable() ? r || (0, J.randomHash)() : null;
                h.linkKey().setValue(e)
            } else h.linkKey().setValue(r);
            let _;
            if (h.isFixed()) {
                const i = (0, n.ensureNotNull)((0, n.ensureNotNull)(e.mainDataSource()).firstValue()),
                    s = this._timeScale.indexToCoordinate(t.index),
                    r = (0,
                        n.ensureNotNull)(p).priceToCoordinate(t.price, i);
                _ = h.addFixedPoint(new o.Point(s, r))
            } else _ = h.addPoint(t);
            return _ || (this._lineBeingCreated = h, this._paneBeingCreatedLineOn = e, Se.isToolCreatingNow.setValue(!0)), d && h.enableCurrentIntervalVisibility(), this.fullUpdate(), h
        }
        endChangingLinetool(e, t) {
            const i = (0, n.ensureNotNull)(this._lineBeingEdited),
                s = i.endChanging(!1, e, t);
            this._lineBeingEdited = null, Se.isToolEditingNow.setValue(!1), this._linePointBeingEdited = null, this._linePointBeingChanged = null, this.lightUpdate();
            const r = {
                    points: i.normalizedPoints(),
                    interval: this.mainSeries().interval()
                },
                o = i.linkKey().value();
            null !== o && i.isSynchronizable() && !t && (0, Se.finishChangingLineTool)({
                model: this,
                linkKey: o,
                symbol: this.mainSeries().symbol(),
                finalState: r,
                changes: s
            })
        }
        continueCreatingLine(e, t, i, s) {
            const r = (0, n.ensureNotNull)(this._lineBeingCreated),
                o = r.addPoint(e, t, i);
            r.updateAllViews((0, W.sourceChangeEvent)(r.id()));
            const a = new K.InvalidationMask(K.InvalidationLevel.Light);
            return o && (this._paneBeingCreatedLineOn = null, this._lineBeingCreated = null, Se.isToolCreatingNow.setValue(!1)), this.invalidate(a), o
        }
        cancelCreatingLine() {
            if (!this._lineBeingCreated) return;
            const e = this._lineBeingCreated;
            this.removeSource(this._lineBeingCreated), this._lineBeingCreated = null, this._lineCancelled.fire(), Se.isToolCreatingNow.setValue(!1), (0, Se.drawOnAllCharts)().value() && e.isSynchronizable() && (0, Se.cancelLineTool)({
                model: this
            })
        }
        lineBeingCreated() {
            return this._lineBeingCreated
        }
        paneBeingCreatedLineOn() {
            return this._paneBeingCreatedLineOn
        }
        lineCancelled() {
            return this._lineCancelled
        }
        isPhantomLine(e) {
            return this._phantomSourceContainer.source() === e
        }
        changeLinePoint(e, t, i) {
            const s = (0, n.ensureNotNull)(this._lineBeingEdited),
                r = (0, n.ensureNotNull)(this._linePointBeingEdited);
            let o = e.price,
                a = e.index;
            if (s.setPoint(r, e, t, i), !i) {
                const t = s.alignCrossHairToAnchor(r) ? s.getPoint(r) : e;
                null !== t && (a = t.index, o = t.price)
            }
            s.updateAllViews((0, W.sourceChangeEvent)(s.id())), this.lightUpdate();
            const l = s.linkKey().value();
            if (!i && null !== l && s.isSynchronizable()) {
                const e = (0, n.ensureNotNull)(this._linePointBeingChanged),
                    i = {
                        indexesChanged: a !== e.index,
                        pricesChanged: o !== e.price
                    },
                    c = s.getChangePointForSync(r);
                if (null !== c) {
                    const e = this.externalTimeStamp(a);
                    null !== e && (o = c.price, (0, Se.changeLineTool)({
                        linkKey: l,
                        model: this,
                        symbol: this.mainSeries().symbol(),
                        point: {
                            price: o,
                            timeStamp: e
                        },
                        envState: t,
                        changes: i
                    }))
                }
            }
        }
        changeLinePoints(e, t, i) {
            const s = e.points(),
                r = e.linkKey().value();
            !i && r && e.isSynchronizable() && t.forEach(((t, i) => {
                const o = s[i],
                    a = o.price !== t.price,
                    l = o.index !== t.index;
                if (e.getChangePointForSync(i)) {
                    const e = (0, n.ensureNotNull)(this.externalTimeStamp(t.index));
                    (0, Se.changeLineTool)({
                        linkKey: r,
                        model: this,
                        symbol: this.mainSeries().symbol(),
                        point: {
                            price: t.price,
                            timeStamp: e
                        },
                        changes: {
                            pricesChanged: a,
                            indexesChanged: l
                        }
                    })
                }
            })), e.setPoints(t), e.updateAllViews((0, W.sourceChangeEvent)(e.id())), this.lightUpdate()
        }
        startScrollTime(e) {
            this._timeScale.startScroll(e), this._isTimeScrolling = !0, this.mainSeries().clearGotoDateResult()
        }
        scrollTimeTo(e) {
            this._timeScale.scrollTo(e), this.recalculateAllPanes((0,
                W.viewportChangeEvent)()), this.lightUpdate(), this._setScalesResetAvailable(!0)
        }
        endScrollTime() {
            this._timeScale.endScroll(), this.lightUpdate(), this.recalcVisibleRangeStudies(), this._isTimeScrolling = !1
        }
        startScrollPrice(e, t, i) {
            e.startScrollPrice(t, i)
        }
        scrollPriceTo(e, t, i) {
            e.scrollPriceTo(t, i), this.invalidate(this._paneInvalidationMask(e, K.InvalidationLevel.Light))
        }
        endScrollPrice(e, t) {
            e.endScrollPrice(t), this.invalidate(this._paneInvalidationMask(e, K.InvalidationLevel.Light))
        }
        addCustomSource(e, t, i = g.CustomSourceLayer.Foreground) {
            this._customSourcesMap.has(e) && rs.logWarn(`Attempt to add the same custom source multiple time "${e}"`), rs.logNormal(`Adding custom source "${e}"`);
            const s = t(e, this);
            switch (i) {
                case g.CustomSourceLayer.Background:
                    this._bgCustomSources.push(s);
                    break;
                case g.CustomSourceLayer.Foreground:
                    this._fgCustomSources.push(s);
                    break;
                case g.CustomSourceLayer.Topmost:
                    this._topmostCustomSources.push(s);
                    break;
                default:
                    throw new Error(`Unknown custom sources layer ${i}`)
            }
            this._allCustomSources.push(s), this._customSourcesMap.set(e, s), this.lightUpdate()
        }
        removeCustomSource(e) {
            this._removeCustomSource(e), this.lightUpdate()
        }
        hasCustomSource(e) {
            return this._customSourcesMap.has(e)
        }
        customSourceForName(e) {
            return this._customSourcesMap.get(e) || null
        }
        customSourceName(e) {
            let t = null;
            return this._customSourcesMap.forEach(((i, s) => {
                i === e && (t = s)
            })), t
        }
        customSources(e) {
            switch (e) {
                case g.CustomSourceLayer.Background:
                    return this._bgCustomSources;
                case g.CustomSourceLayer.Foreground:
                    return this._fgCustomSources;
                case g.CustomSourceLayer.Topmost:
                    return this._topmostCustomSources;
                default:
                    return this._allCustomSources
            }
        }
        addMultiPaneSource(e) {
            this._multiPaneSources.push(e), this.lightUpdate()
        }
        removeMultiPaneSource(e) {
            const t = this._multiPaneSources.indexOf(e); - 1 === t ? rs.logWarn("Attempt to remove multi-pane source which does not exist in the model") : this._multiPaneSources.splice(t, 1), this.lightUpdate()
        }
        multiPaneSources(e) {
            return this._multiPaneSources.filter((t => !e.hasDataSource(t)))
        }
        magnet() {
            return this._magnet
        }
        dateTimeFormatter() {
            return this._dateTimeFormatter
        }
        dateFormatter() {
            return this._dateFormatter
        }
        timeFormatter() {
            return this._timeFormatter
        }
        isUnmergeAvailableForSource(e) {
            if (!this._unmergeAvailable(e)) return !1;
            return (0, n.ensureNotNull)(this.paneForSource(e)).dataSources().filter(this._unmergeAvailable, this).length > 1
        }
        isMergeDownAvailableForSource(e) {
            if (!this._unmergeAvailable(e)) return !1;
            const t = this.paneForSource(e),
                i = this.panes();
            return t !== i[i.length - 1]
        }
        isMergeUpAvailableForSource(e) {
            if (!this._unmergeAvailable(e)) return !1;
            return this.paneForSource(e) !== this.panes()[0]
        }
        sessions() {
            return (0, n.ensureNotNull)(this._sessions)
        }
        createSessions(e) {
            (0, n.assert)(null === this._sessions, "Sessions are already created"), this.addCustomSource("sessions", ((t, i) => (this._sessions = new U(t, i, e), this._sessions.start(), this._sessions)), g.CustomSourceLayer.Background)
        }
        createPrePostMarket(e) {
            this.addCustomSource("prePostMarket", ((t, i) => new PrePostMarket(t, i, e)))
        }
        watermarkContentProvider() {
            return this._watermarkContentProvider
        }
        setWatermarkContentProvider(e) {
            this._watermarkContentProvider = e
        }
        replayStatus() {
            return this._replayStatus
        }
        setReplayStatus(e) {
            this._replayStatus.setValue(e)
        }
        theme() {
            const e = this.properties().childs().paneProperties.state(["horzGridProperties.style", "vertGridProperties.style"]);
            delete e.topMargin, delete e.bottomMargin;
            const t = this.mainSeries().state().state;
            t && (delete t.symbol, delete t.interval, delete t.currencyId, delete t.unitId);
            const i = {
                mainSourceProperties: t,
                sessions: this.sessions().properties().state(),
                chartProperties: {
                    paneProperties: e,
                    scalesProperties: this.properties().childs().scalesProperties.state()
                },
                version: this.version()
            };
            return i.version = this.version(), i
        }
        onChartThemeLoaded() {
            return this._chartThemeLoaded
        }
        chartThemeLoaded() {
            this._chartThemeLoaded.fire()
        }
        state(e, t, i, s) {
            var r;
            const n = this.publishedChartsTimelineSource(),
                o = this.properties().childs(),
                a = o.tradingProperties.state(),
                l = {
                    panes: this._panes.map((r => r.state(!0, e, !1, t, i, s))),
                    timeScale: this._timeScale.state(e),
                    chartProperties: {
                        paneProperties: o.paneProperties.state(["horzGridProperties.style", "vertGridProperties.style"]),
                        scalesProperties: o.scalesProperties.state(),
                        publishedChartsTimelineProperties: n ? n.state(e) : void 0,
                        chartEventsSourceProperties: null === (r = o.chartEventsSourceProperties) || void 0 === r ? void 0 : r.state(),
                        tradingProperties: a,
                        priceScaleSelectionStrategyName: o.priceScaleSelectionStrategyName.value()
                    },
                    sessions: this.sessions().state(e),
                    version: this.version(),
                    timezone: this.timezone(),
                    shouldBeSavedEvenIfHidden: this._shouldBeSavedEvenIfHidden,
                    linkingGroup: this._linkingGroupIndex.value()
                };
            return s || (l.lineToolsGroups = this.lineToolsGroupModel().state(t)), l
        }
        restoreState(e, t, i) {
            var s;
            Ee.instance(this).reset();
            const r = {};
            if (!e.panes) return void rs.logDebug("ChartModel.restoreState: invalid state");
            if (!Array.isArray(e.panes)) return void rs.logDebug("ChartModel.restoreState: invalid state");
            if (e.panes.length < 1) return void rs.logDebug("ChartModel.restoreState: invalid state");
            for (const e of this._barsMarksSources) this.detachSource(e);
            if (this._shouldBeSavedEvenIfHidden = void 0 === e.shouldBeSavedEvenIfHidden || e.shouldBeSavedEvenIfHidden, e.chartProperties && !e.chartProperties.timezone && (e.chartProperties.timezone = e.timezone), e.chartProperties) {
                const i = (0, B.factoryDefaults)("chartproperties").scalesProperties;
                (0, ie.merge)(i, e.chartProperties.scalesProperties), !("showLastValue" in i) || "showSeriesLastValue" in i || "showStudyLastValue" in i || (i.showSeriesLastValueProperty = i.showLastValue, i.showStudyLastValueProperty = i.showLastValue), "showSeriesLastValue" in i && (r.showSeriesLastValueProperty = !0), "showStudyLastValue" in i && (r.showStudyLastValueProperty = !0), (!this.isSnapshot() && !this.readOnly() && "showCurrency" in i || "showUnit" in i) && ((0, Z.migrateShowCurrencyAndShowUnitProperties)(i.showCurrency, i.showUnit), delete i.showCurrency, delete i.showUnit);
                {
                    const {
                        paneProperties: t
                    } = e.chartProperties;
                    t.vertGridProperties = t.vertGridProperties || (0, ie.clone)(t.gridProperties), t.horzGridProperties = t.horzGridProperties || (0, ie.clone)(t.gridProperties), "backgroundType" in t || (t.backgroundType = kt.ColorType.Solid),
                        "separatorColor" in t || (t.separatorColor = (0, d.getThemedColor)("color-chart-page-bg")), this._properties.childs().paneProperties.mergeAndFire(t)
                }
                this._properties.childs().scalesProperties.mergeAndFire(i), e.chartProperties.timezone && this._properties.childs().timezone.setValue(e.chartProperties.timezone), e.chartProperties.chartEventsSourceProperties && this._properties.hasChild("chartEventsSourceProperties") && this._properties.childs().chartEventsSourceProperties.mergeAndFire(e.chartProperties.chartEventsSourceProperties), e.chartProperties.tradingProperties && this._properties.hasChild("tradingProperties") && (void 0 === e.chartProperties.tradingProperties.horizontalAlignment && (e.chartProperties.tradingProperties.horizontalAlignment = (n = e.chartProperties.tradingProperties.lineLength) <= 40 ? g.TradedGroupHorizontalAlignment.Right : n >= 60 ? g.TradedGroupHorizontalAlignment.Left : g.TradedGroupHorizontalAlignment.Center), this._properties.childs().tradingProperties.mergeAndFire(e.chartProperties.tradingProperties)), this._timeScale.restoreState(e.timeScale, t), this._updateDateTimeFormatter()
            }
            var n;
            if (e.timeScale && this._timeScale.restoreState(e.timeScale, t), !this.readOnly()) {
                const t = this._getExceedingChildStudies(e.panes);
                if (t.length) {
                    for (let i = e.panes.length - 1; i >= 0; --i) {
                        const s = e.panes[i];
                        for (let e = s.sources.length - 1; e >= 0; --e) {
                            const i = s.sources[e];
                            ~t.indexOf(i) && s.sources.splice(e, 1)
                        }
                        s.sources.length || e.panes.splice(i, 1)
                    }
                    0
                }
            }
            const o = e.version || 0,
                a = e.panes;
            let l = "_seriesId";
            for (const e of a) {
                const t = e.sources.find((e => "MainSeries" === e.type));
                if (t) {
                    l = t.id;
                    break
                }
            }
            this.panes()[0].restoreState(a[0], t, o, l, r, i, !0);
            let c = 1;
            for (let s = 1; s < e.panes.length; s++) {
                const n = e.panes[s];
                if (0 === n.sources.length) {
                    rs.logWarn("Empty pane detected - restoring is skipped. idx=" + s + ", state=" + JSON.stringify(n));
                    continue
                }
                const a = this.panes()[c] || this.createPane();
                a.restoreState(n, t, o, l, r, i, !0), a.mainDataSource() ? c += 1 : this.removePane(a)
            }
            this._invalidateBarColorerCaches();
            const h = this.dataSources();
            let u = 0;
            for (let e = 0; e < h.length; e++) {
                const t = h[e];
                (0, S.isLineTool)(t) && (u++, t.calcIsActualSymbol())
            }
            this.updateTimeScaleBaseIndex(), this.recalculateAllPanes((0, W.globalChangeEvent)()), this.fullUpdate(), this.syncLollipopSources();
            const p = this.mainPane();
            for (const e of this._barsMarksSources) this.detachSource(e), p.addDataSource(e, this.m_mainSeries.priceScale(), !0);
            let _ = m.TVLocalStorage.getItem("linetools_limit") || 1e3;
            return window.is_authenticated && window.user && window.user.settings && (_ = window.user.settings.linetools_limit || _), e.sessions && this.sessions().restoreState(e.sessions, t), e.lineToolsGroups && (this._lineToolsGroupModel = bt.fromState(this, e.lineToolsGroups)), u > _ && u % 100 == 0 ? {
                lines_limit_exceeded: !0,
                line_tools_count: u
            } : (this.panes().forEach((e => this._dataSourceCollectionChanged.fire(e))), this._lineToolsGroupModel.fireChangedAll(), this._linkingGroupIndex.setValue(null !== (s = e.linkingGroup) && void 0 !== s ? s : null), {})
        }
        shouldBeSavedEvenIfHidden() {
            return this._shouldBeSavedEvenIfHidden
        }
        setShouldBeSavedEvenIfHidden(e) {
            this._shouldBeSavedEvenIfHidden = e
        }
        externalTimeStamp(e) {
            const t = this.mainSeries().syncModel();
            return this.timeScale().points().roughTime(e, t && t.projectTime.bind(t))
        }
        syncLollipopSources() {
            null !== this._lollipopSourcesWatcher && this._lollipopSourcesWatcher.syncSources()
        }
        restoreChartEvents(e) {
            null !== this._lollipopSourcesWatcher && this._options.chartEventsEnabled && this._lollipopSourcesWatcher.restoreChartEvents(e)
        }
        recalcVisibleRangeStudies(e) {
            this._recalcVRStudiesParams.force = this._recalcVRStudiesParams.force || Boolean(e), this._recalcVisibleRangeStudiesImplDebounced()
        }
        recalcColorStudies(e) {
            this._recalcColorStudiesParams.force = this._recalcColorStudiesParams.force || Boolean(e), this._recalcColorStudiesImplDebounced()
        }
        recalcStudyBasedLineTools() {
            this.dataSources().forEach((e => {
                (0, S.isStudyLineTool)(e) && e.recalcStudyIfNeeded()
            }))
        }
        alertsWatcher() {
            return this._alertsWatcher
        }
        showLegend() {
            return this._showLegendProperty
        }
        id() {
            return this._id
        }
        selectPointMode() {
            return this._crossHairSelectPointMode
        }
        recalculatePriceRangeOnce() {
            const e = this.mainSeries();
            for (const t of this._panes)
                for (const i of t.priceDataSources()) i.symbolSource() === e && i.disablePriceRangeReady()
        }
        invalidate(e) {
            var t;
            null === (t = this._invalidateHandler) || void 0 === t || t.call(this, e)
        }
        appliedTimeFrame() {
            return this._appliedTimeFrame.appliedTimeFrame()
        }
        barsMarksSources() {
            return this._barsMarksSources
        }
        createSyncPoint(e, t) {
            return (0, Yi.getDefault2Lazy)(this._syncPointCache, e.uniqueId, t.uniqueId, (() => new Mt(e, t)))
        }
        isAutoSaveEnabled() {
            return this._isAutoSaveEnabled
        }
        linkingGroupIndex() {
            return this._linkingGroupIndex
        }
        studyAwareDefaultRightOffset() {
            return this._timeScale.usePercentageRightOffset().value() ? this._timeScale.percentsToBarIndexLength(this.studyAwareDefaultRightOffsetPercentage()) : Math.max(this._timeScale.defaultRightOffset().value(), this._cachedStudiesMaxOffset)
        }
        studyAwareDefaultRightOffsetPercentage() {
            return this._timeScale.usePercentageRightOffset().value() ? Math.max(this._timeScale.defaultRightOffsetPercentage().value(), this._timeScale.barIndexLengthToPercents(this._cachedStudiesMaxOffset)) : this._timeScale.barIndexLengthToPercents(this.studyAwareDefaultRightOffset())
        }
        clearAllStudies() {
            this.dataSources().forEach((e => {
                var t;
                return null === (t = e.clearData) || void 0 === t ? void 0 : t.call(e)
            }))
        }
        setTimeScaleAnimation(e) {
            const t = K.InvalidationMask.light();
            t.setTimeScaleAnimation(e), this.invalidate(t)
        }
        stopTimeScaleAnimation() {
            const e = K.InvalidationMask.light();
            e.stopTimeScaleAnimation(), this.invalidate(e)
        }
        lollipopSourcesOptions() {
            const e = this._options;
            return {
                chartEventsEnabled: !this._options.isSnapshot && this._options.chartEventsEnabled,
                esdEnabled: e.esdEnabled,
                continuousContractSwitchesEnabled: e.continuousContractSwitchesEnabled,
                futuresContractExpirationEnabled: e.futuresContractExpirationEnabled,
                latestUpdatesEnabled: e.latestUpdatesEnabled
            }
        }
        _initAlertsList() {
            throw new Error("Not implemented")
        }
        _updateStudiesMaxOffset() {
            const e = Math.max(...this.allStudies().map((e => e.maxOffset().value())));
            this._cachedStudiesMaxOffset = e;
            const t = this._timeScale.rightOffset();
            t < 0 || this._timeScale.setRightOffset(Math.max(t, e))
        }
        _updateBaseIndex(e, t) {
            const i = this._timeScale,
                s = i.baseIndex(),
                r = i.visibleBarsStrictRange(),
                n = i.logicalRange();
            if (null !== n && t) {
                const t = n.contains(s),
                    o = e - s;
                let a = t ? null : i.rightOffset() - o;
                if (!this._options.shiftVisibleRangeOnNewBar && t) {
                    const e = i.indexToCoordinate(s) + i.barSpacing() / 2 + 1,
                        t = s - n.left() + o,
                        l = e / t;
                    if (l >= i.minBarSpacing()) {
                        i.setBarSpacing(l);
                        a = i.width() / l - t
                    } else(null == r ? void 0 : r.lastBar()) !== s && (a = i.rightOffset() - o)
                }
                null !== a && i.setRightOffset(a)
            }
            i.setBaseIndex(e)
        }
        _createLollipopSourcesWatcher() {}
        _updateDateTimeFormatter() {
            const e = St.dateFormatProperty.value(),
                t = void 0;
            if (this._dateFormatter = new vt.DateFormatter(e, t), this.mainSeries().isDWM()) this._dateTimeFormatter = new vt.DateFormatter(e, t), this._timeFormatter = new lt.TimeFormatter((0, ct.getHourMinuteFormat)(at.timeHoursFormatProperty.value()));
            else {
                const i = x.Interval.parse(this.mainSeries().interval()),
                    s = (0, ct.getTimeFormatForInterval)(i, at.timeHoursFormatProperty.value());
                this._dateTimeFormatter = new ft.DateTimeFormatter({
                    dateFormat: e,
                    withWeekday: t,
                    timeFormat: s,
                    dateTimeSeparator: "   "
                }), this._timeFormatter = new lt.TimeFormatter(s)
            }
        }
        _setScalesResetAvailable(e) {
            this._isScalesResetAvailable !== e && (this._isScalesResetAvailable = e, this._isScalesResetAvailableChanged.fire())
        }
        _invalidationMaskForSource(e, t = K.InvalidationLevel.Light) {
            if (e === this.crossHairSource()) return K.InvalidationMask.cursor();
            if (this._watermarkSource === e) return this._paneInvalidationMask((0, n.ensureNotNull)(this.paneForSource(this.mainSeries())), t);
            if (-1 !== this._allCustomSources.indexOf(e)) {
                const e = new K.InvalidationMask;
                return e.invalidateAll(t), e
            }
            if (!(0, f.isDataSource)(e)) return null;
            if (e.isMultiPaneEnabled()) return new K.InvalidationMask(t);
            const i = this.paneForSource(e);
            return null !== i ? this._paneInvalidationMask(i, t) : null
        }
        _paneInvalidationMask(e, t = K.InvalidationLevel.Light) {
            const i = new K.InvalidationMask,
                s = this._panes.indexOf(e);
            return i.invalidateAllPane(s, t), i
        }
        _invalidationMaskForSourcePriceScale(e, t = K.InvalidationLevel.Light) {
            if (!(0, f.isDataSource)(e)) return new K.InvalidationMask(t);
            const i = this.paneForSource(e);
            if (null === i) return null;
            let s = e.priceScale();
            if (null === s) return null;
            const r = this._panes.indexOf(i);
            let n = i.priceScalePosition(s);
            if ("overlay" === n) {
                const e = this._panes[r].defaultPriceScale();
                s = e, n = i.priceScalePosition(e)
            }
            const o = i.priceScaleIndex(s, n);
            if (void 0 === o) return null;
            const a = new K.InvalidationMask;
            return a.invalidatePriceScale(r, n, o, t), a
        }
        _removeCustomSource(e) {
            const t = this._customSourcesMap.get(e);
            if (void 0 === t) return void rs.logWarn(`Attempt to remove custom source which does not exist in the model - "${e}"`);
            rs.logNormal(`Removing custom source "${e}"`), this.selectionMacro((e => {
                e.removeSourceFromSelection(t)
            })), this._hoveredSource === t && this.setHoveredSource(null), this._customSourceBeingMoved === t && this.setMovingCustomSource(null, null);
            const i = ns(this._bgCustomSources, t),
                s = ns(this._fgCustomSources, t),
                r = ns(this._topmostCustomSources, t),
                o = ns(this._allCustomSources, t);
            (0, n.assert)(i || s || r, "Source should be presented in one of the layers"), (0, n.assert)(o, "Source should be presented in the array"),
            this._customSourcesMap.delete(e), t.destroy()
        }
        _updateShowLegendProperty() {
            const e = this._properties.childs().paneProperties.childs().legendProperties.childs().showLegend,
                t = this._showLegendProperty;
            if (e.value()) t.setValue(!0);
            else {
                for (const e of this._panes) {
                    let i = 0;
                    for (const s of e.priceDataSources())
                        if (s !== this.mainSeries() && null !== s.statusView() && (i++, i > 1)) return void t.setValue(!1)
                }
                t.setValue(!0)
            }
        }
        _pointToPercentPosition(e, t) {
            return {
                x: e.x / this._timeScale.width(),
                y: e.y / (0, n.ensureNotNull)((0, n.ensureNotNull)(t.mainDataSource()).priceScale()).height()
            }
        }
        _percentPositionToPoint(e, t) {
            const i = e.x * this._timeScale.width(),
                s = e.y * (0, n.ensureNotNull)((0, n.ensureNotNull)(t.mainDataSource()).priceScale()).height();
            return new o.Point(i, s)
        }
        _recalcVisibleRangeStudiesImpl(e) {
            var t, i, s;
            if (e.timerId = null, this.timeScale().isEmpty()) return;
            const r = this.timeScale().visibleBarsStrictRange();
            if (null === r) return;
            const n = this.mainSeries().bars(),
                o = n.search(r.firstBar(), dt.PlotRowSearchMode.NearestRight),
                a = n.search(r.lastBar(), dt.PlotRowSearchMode.NearestLeft),
                l = n.lastIndex(),
                c = o ? o.index : void 0,
                h = a ? a.index : void 0,
                d = c === e.oldStartVisibleIndex,
                u = h === e.oldEndVisibleIndex;
            if (d && u && !e.force) return;
            e.force = !1, e.oldStartVisibleIndex = void 0 !== c ? c : NaN, e.oldEndVisibleIndex = void 0 !== h ? h : NaN;
            const p = {
                    first_visible_bar_time: 1e3 * (null !== (t = null == o ? void 0 : o.value[0]) && void 0 !== t ? t : 0),
                    last_visible_bar_time: 1e3 * (null !== (i = null == a ? void 0 : a.value[0]) && void 0 !== i ? i : 0),
                    subscribeRealtime: (null == a ? void 0 : a.index) === l
                },
                _ = null !== (s = e.studies) && void 0 !== s ? s : this.priceDataSources();
            e.studies = void 0;
            for (const e of _)
                if ((0, j.isStudy)(e)) {
                    const t = e.metaInfo().inputs,
                        i = [];
                    for (const e of t) p.hasOwnProperty(e.id) && i.push(e.id);
                    const s = e.properties().childs().inputs;
                    for (const e of i) s.childs()[e].setValueSilently(p[e]);
                    i.length > 0 && s.listeners().fire(s)
                }
        }
        _recalcColorStudiesImpl(e) {
            var t;
            e.timerId = null;
            const i = this.backgroundColorAtYPercentFromTop(.5),
                s = this.dark().value() ? l.colorsPalette["color-cold-gray-200"] : l.colorsPalette["color-cold-gray-900"],
                r = i === e.oldBgColor,
                n = s === e.oldFgColor;
            if (r && n && !e.force) return;
            e.force = !1, e.oldBgColor = i, e.oldFgColor = s;
            const o = {
                    __chart_bgcolor: i,
                    __chart_fgcolor: s
                },
                a = null !== (t = e.studies) && void 0 !== t ? t : this.priceDataSources();
            e.studies = void 0;
            for (const e of a)
                if ((0, j.isStudy)(e)) {
                    const t = e.metaInfo().inputs,
                        i = [];
                    for (const e of t) o.hasOwnProperty(e.id) && i.push(e.id);
                    const s = e.properties().childs().inputs;
                    for (const e of i) s.childs()[e].setValueSilently(o[e]);
                    i.length > 0 && s.listeners().fire(s)
                }
        }
        _getAllSources(e) {
            const t = [];
            for (const i of this._panes) {
                const s = i.sourcesByGroup().all();
                for (const i of s) e(i) && t.push(i)
            }
            return t
        }
        _invalidateBarColorerCaches() {
            this.mainSeries().invalidateBarColorerCache()
        }
        _addAlertLabelToChart(e) {
            throw new Error("Not implemented")
        }
        _removeAlertLabelFromChart(e) {
            throw new Error("Not implemented")
        }
        _removeAllAlertLabelsFromChart() {
            throw new Error("Not implemented")
        }
        _updateTimeScale(e) {
            var t, i, s, r;
            const {
                index: n,
                zoffset: o,
                values: a,
                indexDiffs: l,
                baseIndex: c,
                marks: h,
                clearFlag: d
            } = e;
            if (d) {
                this._timeScale.reset();
                for (const e of this.dataSources()) null === (t = e.clearData) || void 0 === t || t.call(e)
            }
            if (l.length > 0)
                for (const e of this.dataSources()) null === (i = e.moveData) || void 0 === i || i.call(e, l);
            const u = this._timeScale.indexToTimePoint(this._timeScale.baseIndex()),
                p = this._timeScale.canNormalize();
            this._timeScale.update(n, o, a, h);
            const _ = this._timeScale.points().range().value();
            let m = "ChartModel.prototype._updateTimeScale(" + n + "," + o + "," + a.length + "," + l.length + "," + h.length + "," + d + ")";
            if (m += "TimeScale: {first:" + (null !== (s = null == _ ? void 0 : _.firstIndex) && void 0 !== s ? s : null) + ",last:" + (null !== (r = null == _ ? void 0 : _.lastIndex) && void 0 !== r ? r : null) + "}", null === c) {
                this._timeScale.resetBaseIndex();
                const e = this._timeScale.rightOffset();
                e < 0 ? this._timeScale.setRightOffset(this.studyAwareDefaultRightOffset()) : this._timeScale.setRightOffset(Math.max(e, this._cachedStudiesMaxOffset))
            } else if (void 0 !== c) {
                const e = this._timeScale.indexToTimePoint(c),
                    t = null !== u && null !== e && e > u;
                this._updateBaseIndex(c, t)
            }
            if (rs.logDebug(m), !p && p !== this._timeScale.canNormalize())
                for (const e of this.dataSources()) !(0, S.isLineTool)(e) || e.isFixed() || e.isSourceHidden() || e.processHibernate();
            this.recalculateAllPanes((0, W.globalChangeEvent)()), this.lightUpdate()
        }
        _getAvailableCurrencies() {
            return !this.currencyConversionEnabled() || this.isSnapshot() ? [] : (0, ie.isArray)(this._availableCurrenciesList) ? this._availableCurrenciesList : (null !== this._availableCurrenciesList || (this._availableCurrenciesList = this.chartApi().availableCurrencies(), this._availableCurrenciesList.then((e => {
                this._destroyed || (this._availableCurrenciesList = e, this.fullUpdate())
            })).catch((e => {
                rs.logWarn(`An error occurred while getting currencies config: ${e}`)
            }))), [])
        }
        _getAvailableUnits() {
            return !this.unitConversionEnabled() || this.isSnapshot() ? {} : this._availableUnitsObject instanceof Promise || null === this._availableUnitsObject ? (null !== this._availableUnitsObject || (this._availableUnitsObject = this.chartApi().availableUnits(), this._availableUnitsObject.then((e => {
                this._destroyed || (this._availableUnitsObject = e, this.fullUpdate())
            })).catch((e => {
                rs.logWarn(`An error occurred while getting units config: ${e}`)
            }))), {}) : this._availableUnitsObject
        }
        _getAvailablePriceSources() {
            return Array.isArray(this._availablePriceSourcesList) ? this._availablePriceSourcesList : (this._availablePriceSourcesList = this.chartApi().availablePriceSources(this.m_mainSeries.getSymbolString()), this._availablePriceSourcesList.then((e => {
                this._destroyed || (this._availablePriceSourcesList = e, this.fullUpdate())
            })).catch((e => {
                rs.logWarn(`An error occurred while getting price sources config: ${e}`)
            })), [])
        }
        _clearAvailablePriceSources() {
            this._availablePriceSourcesList = null
        }
        _getBackgroundColor(e) {
            const t = this._properties.childs().paneProperties.childs();
            if (t.backgroundType.value() === kt.ColorType.Gradient) {
                const i = t.backgroundGradientStartColor.value(),
                    s = t.backgroundGradientEndColor.value();
                return e ? i : s
            }
            return t.background.value()
        }
        _getBackgroundCounterColor() {
            const e = this.backgroundColor().value();
            return "black" === (0, a.rgbToBlackWhiteString)((0, a.parseRgb)(e), 150) ? "white" : "black"
        }
        _updateBackgroundColor() {
            this._backgroundColor.setValue(this._getBackgroundColor()), this._backgroundTopColor.setValue(this._getBackgroundColor(!0))
        }
        _syncCrosshair(e) {
            if (!this._isSettingsExternalPosition) {
                const t = this._undoModel.chartWidget(),
                    i = this._undoModel.mainSeries(),
                    s = i.syncModel(),
                    r = this._undoModel.crossHairSource(),
                    n = r.pane;
                if (null !== s && null !== n) {
                    const o = {
                        timeStamp: this._timeScale.points().roughTime(r.index, s.projectTime.bind(s)),
                        syncSourceTarget: s.syncSourceTarget()
                    };
                    n.mainDataSource() === i && (o.price = r.price, o.symbol = i.symbol());
                    let a = this._lineBeingCreated || null !== this._linePointBeingEdited || Boolean(this._sourcesBeingMoved.length);
                    a = a && (0, Se.drawOnAllCharts)().value(), t.chartWidgetCollection().syncCrosshair(o, t.id(), a, e)
                }
                this._phantomSourceContainer.onCursorPositionUpdated()
            }
        }
        _gotoTimeImpl(e, t) {
            const i = this.timeScale(),
                s = this.mainSeries();
            let r;
            if (void 0 !== e) {
                if (this._scrollingState && this._scrollingState.deferred.reject(), r = (0, p.createDeferredPromise)(), !s.isDWM()) {
                    const t = s.symbolInfo();
                    if (null !== t) {
                        let i = this.properties().childs().timezone.value();
                        "exchange" === i && (i = t.timezone);
                        const r = (0, Pt.cal_to_utc)((0, Pt.get_timezone)(i), new Date(e)),
                            n = (0, zt.createTimeToBarTimeAligner)(s.interval(), t)(r);
                        e = (0, Pt.utc_to_cal)((0, Pt.get_timezone)(i), n).getTime()
                    }
                }
                this._scrollingState = {
                    targetDate: e,
                    deferred: r,
                    centerIfVisible: t.centerIfVisible
                }
            } else {
                if (!this._scrollingState) return rs.logError("scrollTo called without an argument"), Promise.reject();
                e = this._scrollingState.targetDate, r = this._scrollingState.deferred
            }
            if (void 0 === i.tickMarks().minIndex) return r.resolve(void 0), r.promise;
            this.stopTimeScaleAnimation();
            let o = ((e, t) => {
                if ((e => (0, n.ensureNotNull)(i.tickMarks().indexToTime((0, n.ensureDefined)(i.tickMarks().minIndex))).valueOf() - e)(t) < 0) {
                    let r = i.tickMarks().nearestIndex(t);
                    const o = s.bars().lastIndex();
                    if (null === o) return null;
                    r = Math.min(r, o);
                    let a = (0, n.ensureNotNull)(i.tickMarks().indexToTime(r)).valueOf();
                    for (; a < t && r < o;) r++, a = (0, n.ensureNotNull)(i.tickMarks().indexToTime(r)).valueOf();
                    const l = (0, n.ensureNotNull)(i.visibleBarsStrictRange()),
                        c = l.lastBar() - l.firstBar();
                    return !e && l.contains(r) || i.zoomToBarsRange(r - c / 2, r + c / 2), {
                        timestamp: (0, n.ensureNotNull)(i.indexToTimePoint(r))
                    }
                }
                return null
            })(this._scrollingState.centerIfVisible, this._scrollingState.targetDate);
            if (!o) {
                const t = (0, n.ensureDefined)(i.tickMarks().minIndex),
                    r = (0, n.ensureNotNull)(i.visibleBarsStrictRange()),
                    a = r.lastBar() - r.firstBar();
                if (s.requestMoreDataAvailable()) {
                    const t = i.tickMarks().estimateLeft(e);
                    i.requestMoreHistoryPoints(Math.ceil(t + a / 2))
                } else i.zoomToBarsRange(t - a / 2, t + a / 2), o = {
                    timestamp: (0, n.ensureNotNull)(i.indexToTimePoint(t)),
                    eod: !0
                }
            }
            return o && (this.fullUpdate(), this._scrollingState = null, r.resolve(o)), r.promise
        }
        _setCorrectedPositionToCrosshair(e, t, i) {
            this.crossHairSource().setPosition(e, t, i)
        }
        _onSymbolSourceCollectionChanged(e) {
            this._recalcAdjustForDividendsAvailibility(), this._symbolSourceCollectionChanged.fire(e)
        }
        _unmergeAvailable(e) {
            return e === this.m_mainSeries || (0, j.isStudy)(e) && !e.isLinkedToSeries() && !(0,
                Ji.isNonSeriesStudy)(e) && e.showInObjectTree()
        }
        _getExceedingChildStudies(e) {
            let t = [];
            for (let i = 0; i < e.length; ++i) t = t.concat(e[i].sources || []);
            let i = 0;
            const s = [],
                r = {};
            let n = 0,
                o = 1e6;
            for (; t.length && --o;) {
                const e = t[n];
                (e.ownerSource && r[e.ownerSource] || !e.ownerSource) && (r[e.id] = e, t.splice(t.indexOf(e), 1), e.ownerSource && (0, Ie.isStudyState)(e) && e.state && e.state.isChildStudy && ++i > 1 && s.push(e)), n = (n + 1) % t.length
            }
            return s
        }
    }
}