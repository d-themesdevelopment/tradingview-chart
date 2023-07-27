(e, t, i) => {
    "use strict";
    i.d(t, {
        ChartWidgetBase: () => Wi
    });
    var s = i(27714),
        r = i(50151),
        n = i(3343),
        o = i(44352),
        a = i(59224);

    function l(e, t) {
        const i = Object.create(Object.getPrototypeOf(e));
        for (const s of t) Object.prototype.hasOwnProperty.call(e, s) && (i[s] = e[s]);
        return i
    }
    var c = i(56840),
        h = i(49483),
        d = i(51608),
        u = i(76422),
        p = i(85067);
    let _;
    class m extends p.DialogRenderer {
        constructor() {
            super(), this._dialog = null, this._subscribe = e => {
                this._setVisibility(e)
            }
        }
        show() {
            this._load().then((e => e.show()))
        }
        hide() {
            var e;
            null === (e = this._dialog) || void 0 === e || e.hide()
        }
        static getInstance() {
            return _ || (_ = new m), _
        }
        _load() {
            return Promise.all([i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(6), i.e(5993), i.e(5649), i.e(6221), i.e(8056), i.e(6752), i.e(8149), i.e(6106), i.e(1054), i.e(4387), i.e(962), i.e(2842), i.e(4062), i.e(3016), i.e(3179), i.e(5050), i.e(5711), i.e(4862)]).then(i.bind(i, 82497)).then((e => {
                var t, i;
                return null === (t = this._dialog) || void 0 === t || t.hide(), null === (i = this._dialog) || void 0 === i || i.visible().unsubscribe(this._subscribe), this._dialog = new e.ObjectTreeDialogRenderer, this._dialog.visible().subscribe(this._subscribe), this._dialog
            }))
        }
    }
    i(83135);
    var g = i(70027),
        f = i(58096);
    const v = (0, g.parseHtmlElement)(function(e = "") {
        return `<div class="tv-spinner ${e}" role="progressbar"></div>`
    }());
    class S {
        constructor(e) {
            this._shown = !1, this._el = v.cloneNode(!0), this.setSize(f.spinnerSizeMap[e || f.DEFAULT_SIZE])
        }
        spin(e) {
            return this._el.classList.add("tv-spinner--shown"), void 0 === this._container && (this._container = e, void 0 !== e && e.appendChild(this._el)), this._shown = !0, this
        }
        stop(e) {
            return e && void 0 !== this._container && this._container.removeChild(this._el), this._el && this._el.classList.remove("tv-spinner--shown"), this._shown = !1, this
        }
        setStyle(e) {
            return Object.keys(e).forEach((t => {
                const i = e[t];
                void 0 !== i && this._el.style.setProperty(t, i)
            })), this
        }
        style() {
            return this._el.style
        }
        setSize(e) {
            const t = void 0 !== e ? `tv-spinner--size_${e}` : "";
            return this._el.className = `tv-spinner ${t} ${this._shown?"tv-spinner--shown":""}`, this
        }
        getEl() {
            return this._el
        }
        destroy() {
            this.stop(), delete this._el, delete this._container
        }
    }
    var y = i(1722),
        b = i(97906),
        w = i(94792);
    var P = i(39347),
        C = i(42856),
        x = i(97087),
        T = i(18923);
    const I = (0, a.getLogger)("Chart.Studies.StudyMetaInfoRepository", {
        color: "#606"
    });
    class M {
        constructor(e) {
            this._nextRequestNumber = 1, this._rawStudiesMetaInfo = [], this._isReady = !1, this._metaInfoQueryQueue = [], this._javaMetaInfoQueryQueue = [], this._javaStudiesMetaInfo = [], this._pineMetaInfoCache = [], this._studiesMigrations = [], this._gateway = e
        }
        requestMetaInfo() {
            this._requestStarted();
            const e = this._makeNextRequestId();
            return I.logNormal(`Requesting metainfo #${e}`), new Promise((t => {
                I.logNormal(`Requesting studies metadata #${e}`), this._gateway.requestMetadata(e, (i => {
                    I.logNormal(`Requesting studies metadata #${e} finished`);
                    const s = i.params[1].metainfo.slice();
                    this._processLibraryMetaInfo(s), this._requestFinished(), t()
                }))
            }))
        }
        findById(e) {
            if (!this._isReady) return this._enqueueMetaInfoQuery(e);
            const t = this._findStudyMetaInfo(e);
            return null !== t ? Promise.resolve(t) : "pine" === e.type ? this._compilePine(e) : Promise.reject(`unexpected study id=${e.studyId} with type=${e.type}`)
        }
        findByIdSync(e) {
            return this._findStudyMetaInfo(e)
        }
        isReady() {
            return this._isReady
        }
        findAllJavaStudies() {
            return this._isReady ? Promise.resolve(this._javaStudiesMetaInfo) : this._enqueueJavaMetaInfoQuery()
        }
        getInternalMetaInfoArray() {
            return this._javaStudiesMetaInfo
        }
        getMigrations() {
            return this._studiesMigrations
        }
        addPineMetaInfo(e) {
            return L(this._pineMetaInfoCache, e)
        }
        async getLatestMetaInfoForPineStudy(e, t) {
            return null
        }
        _processMigrations(e) {
            throw new Error("not implemented")
        }
        _processSiteMetaInfo(e, t) {
            throw new Error("not implemented")
        }
        _processLibraryMetaInfo(e) {
            for (const t of e) A(t), L(this._javaStudiesMetaInfo, t);
            this._javaStudiesMetaInfo = this._javaStudiesMetaInfo.sort(((e, t) => {
                const i = e.description_localized || e.description,
                    s = t.description_localized || t.description;
                return i > s ? 1 : i < s ? -1 : 0
            })), C.StudyMetaInfo.overrideDefaults(this._javaStudiesMetaInfo)
        }
        _requestStarted() {
            this._isReady = !1, this._javaStudiesMetaInfo = [], this._pineMetaInfoCache = [], this._studiesMigrations = [], this._rawStudiesMetaInfo = []
        }
        _requestFinished() {
            this._isReady = !0, this._processPendingMetaInfoQueries(), this._processPendingFullMetaInfoQueries()
        }
        _enqueueMetaInfoQuery(e) {
            return new Promise((t => {
                this._metaInfoQueryQueue.push({
                    studyDescriptor: e,
                    resolver: t
                })
            }))
        }
        _enqueueJavaMetaInfoQuery() {
            return new Promise((e => {
                this._javaMetaInfoQueryQueue.push({
                    resolver: e
                })
            }))
        }
        _processPendingMetaInfoQueries() {
            for (; this._metaInfoQueryQueue.length;) {
                const e = this._metaInfoQueryQueue.shift();
                this.findById(e.studyDescriptor).then(e.resolver)
            }
        }
        _processPendingFullMetaInfoQueries() {
            for (; this._javaMetaInfoQueryQueue.length;) {
                this._javaMetaInfoQueryQueue.shift().resolver(this._javaStudiesMetaInfo)
            }
        }
        _findStudyMetaInfo(e) {
            return "java" === e.type ? this._javaStudiesMetaInfo.find((t => t.id === e.studyId)) || null : this._pineMetaInfoCache.find((t => t.scriptIdPart === e.pineId && (void 0 === e.pineVersion || (0, r.ensureDefined)(t.pine).version === e.pineVersion))) || null
        }
        _makeNextRequestId() {
            return "metadata_" + this._nextRequestNumber++
        }
        _compilePine(e) {
            throw new Error("unsupported")
        }
    }

    function A(e) {
        e.description_localized = o.t(e.description, {
            context: "study"
        }, i(68716))
    }

    function L(e, t) {
        const i = new C.StudyMetaInfo(t);
        (0, x.migrateMetaInfoAndPropState)(i);
        let s = !0;
        const r = e.findIndex((e => e.id === i.id));
        if (-1 === r) e.push(i);
        else {
            const t = e[r],
                n = void 0 !== t.pine ? T.Version.parse(t.pine.version) : null,
                o = void 0 !== i.pine ? T.Version.parse(i.pine.version) : null;
            null === o || null === n || o.isGreaterOrEqual(n) ? (t.removeDefaults(), e[r] = i) : s = !1
        }
        return s && i.createDefaults(), i
    }
    var k, E = i(18341),
        D = i(15367),
        V = i(28853),
        B = i(46100),
        R = i(91280),
        N = i(16230);
    ! function(e) {
        e.Default = "default", e.Success = "success", e.Warning = "warning", e.Danger = "danger"
    }(k || (k = {}));
    var O = i(86441),
        F = i(48891),
        W = i(90995),
        z = i(36298),
        H = i(38325),
        U = i(30888),
        j = i(18807),
        G = i(67980),
        q = i(81155),
        $ = i(3587),
        Y = i(88348),
        K = i(68452),
        Z = i(42184),
        X = i(74359),
        J = i(68441),
        Q = i(29764),
        ee = i(5286),
        te = i(7983),
        ie = i(49668),
        se = i(46501);
    const re = parseInt(ie.labelheight),
        ne = parseInt(ie.bottommargin);

    function oe(e) {
        return e / 11
    }
    class ae {
        constructor() {
            this._wrapper = document.createElement("div"), this._element = document.createElement("div"), this._labelElement = document.createElement("div"), this._gearElement = document.createElement("div"), this._currentScale = 1, this._info = null, this._mode = "auto", this._wrapper.appendChild(this._element), this._wrapper.classList.add(ie.wrapper), this._element.classList.add(ie.label), this._labelElement.className = ie.symbol, this._element.appendChild(this._labelElement), this._gearElement.className = ie.gear, this._gearElement.innerHTML = te, this._element.appendChild(this._gearElement)
        }
        getElement() {
            return this._wrapper
        }
        setMode(e) {
            this._mode !== e && (this._mode = e)
        }
        align(e, t) {
            const i = oe(t);
            Math.abs(i - this._currentScale) > .1 && (this._currentScale = i, Math.abs(this._currentScale - 1) > .1 ? this._element.style.transform = `scale(${this._currentScale})` : (this._currentScale = 1, this._element.style.transform = ""))
        }
        drawLabelForScreenshot(e, t) {
            if (null === this._info || "gear" === this._mode) return;
            const i = (0, Q.makeFont)(t.fontSize, se.CHART_FONT_FAMILY);
            e.fillStyle = ee.themes[t.theme].getThemedColor("color-price-axis-label-back"), e.globalAlpha = .5, e.beginPath();
            const s = oe(t.fontSize) * re / 2,
                r = (0, O.point)(t.offset + t.width / 2, t.height / 2);
            e.arc(r.x, r.y, s, 0, 2 * Math.PI, !0), e.fill(), e.globalAlpha = 1, e.fillStyle = ee.themes[t.theme].getThemedColor("color-price-axis-label-text"), e.textAlign = "center", e.font = i, e.textBaseline = "middle", e.fillText(this._info.label, r.x, r.y)
        }
        setAxisNameInfo(e) {
            this._info = e, null !== e && (this._labelElement.textContent = e.label)
        }
        static height(e) {
            return (re + ne) * e
        }
    }
    var le = i(57898),
        ce = i.n(le),
        he = i(10643),
        de = i(94194);
    const ue = {
        enableTooltip: !0,
        showLabels: !0,
        enableMenu: !0,
        enableHighlight: !0
    };
    class pe {
        constructor(e, t, i, r, n, o = null) {
            this._invalidated = !0, this._size = (0, s.size)({
                width: 0,
                height: 0
            }), this._offset = 0, this._axisInfo = null, this._onLabelHovered = new(ce()), this._highlighted = !1, this._labelMode = "auto", this._fixedLabelMode = null, this._canvasConfiguredHandler = () => this.update(), this._timeAxisWidget = o, this._isLeft = "left" === e, this._rendererOptionsProvider = r.rendererOptionsProvider, this._sourcesTitlesProvider = r.sourcesTitlesProvider, this._contextMenuItemsProvider = r.contextMenuItemsProvider, this._backgroundBasedTheme = r.backgroundBasedTheme, this._getBackgroundTopColor = r.getBackgroundTopColor, this._getBackgroundBottomColor = r.getBackgroundBottomColor, this._showHorizontalBorder = Boolean(r.showHorizontalBorder), this._properties = t, this._axisInfo = i, this._labelOptions = {
                ...ue,
                ...n
            }, this._properties.lineColor.subscribe(this, this._onPropertyChanged), this._cell = document.createElement("div"), this._cell.classList.add(ie["price-axis-stub"]), this._labelOptions.enableTooltip && this._cell.classList.add("apply-common-tooltip"), this._cell.style.width = "25px", this._cell.style.height = "100%", this._cell.style.position = "absolute", this._cell.style.left = "0", this._cell.style.overflow = "hidden", this._labelOptions.showLabels ? (this._label = new ae, this._label.setAxisNameInfo(this._axisInfo), this._cell.appendChild(this._label.getElement()), this._labelOptions.enableTooltip && (0, de.setTooltipData)(this._cell, "text", (e => this._tooltipContent()))) : this._label = null, this._mouseEventHandler = new Z.MouseEventHandler(this._cell, this, {
                treatHorzTouchDragAsPageScroll: !0,
                treatVertTouchDragAsPageScroll: !0
            }), this._canvasBinding = (0, X.createBoundCanvas)(this._cell, (0, s.size)({
                width: 16,
                height: 16
            })), this._canvasBinding.subscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler);
            const a = this._canvasBinding.canvasElement;
            a.style.position = "absolute", a.style.left = "0", a.style.top = "0"
        }
        destroy() {
            this._canvasBinding.unsubscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler), this._canvasBinding.dispose(), this._properties.lineColor.unsubscribe(this, this._onPropertyChanged), this._mouseEventHandler.destroy()
        }
        mouseEnterEvent(e) {
            this._mouseOrTouchEnterEvent(e)
        }
        touchStartEvent(e) {
            this._mouseOrTouchEnterEvent(e)
        }
        mouseLeaveEvent(e) {
            this._mouseOrTouchLeaveEvent(e)
        }
        touchEndEvent(e) {
            this._mouseOrTouchLeaveEvent(e)
        }
        mouseClickEvent(e) {
            this._mouseClickOrTapEvent(e)
        }
        tapEvent(e) {
            this._mouseClickOrTapEvent(e)
        }
        update() {}
        getElement() {
            return this._cell
        }
        onLabelHovered() {
            return this._onLabelHovered
        }
        setSizeAndOffset(e, t) {
            (0, s.equalSizes)(this._size, e) || (this._size = e, this._canvasBinding.resizeCanvasElement(e), this._cell.style.width = `${e.width}px`, this._cell.style.minWidth = `${e.width}px`, this._cell.style.height = `${e.height}px`, this._invalidated = !0), this._offset !== t && (this._offset = t, this._cell.style.left = `${t}px`)
        }
        paint(e) {
            if (e < R.InvalidationLevel.Light && !this._invalidated) return;
            if (0 === this._size.width || 0 === this._size.height) return;
            this._invalidated = !1, this._canvasBinding.applySuggestedBitmapSize();
            const t = (0, X.getBindingPixelRatio)(this._canvasBinding),
                i = (0, X.getContext2D)(this._canvasBinding.canvasElement);
            this._drawBackground(i, t), this._drawVerticalBorder(i, t),
                this._showHorizontalBorder && this._drawHorizontalBorder(i, t)
        }
        getWidth() {
            return this._size.width
        }
        getImage() {
            const e = (0, X.createDisconnectedCanvas)(document, this._size),
                t = (0, X.getPrescaledContext2D)(e),
                i = this._getBackgroundTopColor(),
                s = this._getBackgroundBottomColor();
            return i === s ? (0, X.clearRect)(t, 0, 0, this._size.width, this._size.height, i) : (0, J.clearRectWithGradient)(t, 0, 0, this._size.width, this._size.height, i, s), t.drawImage(this._canvasBinding.canvasElement, 0, 0, this._size.width, this._size.height), null !== this._label && this._label.drawLabelForScreenshot(t, {
                offset: 0,
                width: this._size.width,
                height: this._size.height,
                fontSize: this._properties.fontSize.value(),
                theme: this._backgroundBasedTheme.value()
            }), e
        }
        setLabelMode(e) {
            e !== this._labelMode && (this._labelMode = e, null !== this._label && this._label.setMode(e), this._cell.classList.toggle(ie["fixed-gear"], "gear" === e), this._cell.classList.toggle(ie["fixed-symbol"], "symbol" === e), this._cell.classList.toggle("apply-common-tooltip", "symbol" !== e && this._labelOptions.enableTooltip))
        }
        _setHighlighted(e) {
            this._labelOptions.enableHighlight && (this._onLabelHovered.fire("stubButton", e), this._highlighted !== e && (this._highlighted = e, this._invalidated = !0))
        }
        _onPropertyChanged() {
            this._invalidated = !0
        }
        _drawVerticalBorder(e, t) {
            const i = this._size.width;
            e.save(), e.fillStyle = this._properties.lineColor.value();
            const s = Math.max(1, Math.floor(this._rendererOptionsProvider.options().borderSize * t)),
                r = this._isLeft ? Math.floor(i * t) - s : 0,
                n = Math.ceil(this._size.height * t);
            e.fillRect(r, 0, s, n + 1), e.restore()
        }
        _drawHorizontalBorder(e, t) {
            var i, s;
            e.save(), e.fillStyle = null !== (s = null === (i = this._timeAxisWidget) || void 0 === i ? void 0 : i.lineColor()) && void 0 !== s ? s : this._properties.lineColor.value();
            const r = Math.max(1, Math.floor(this._rendererOptionsProvider.options().borderSize * t)),
                n = Math.ceil(this._size.width * t),
                o = this._isLeft ? 0 : r;
            e.fillRect(o, 0, n - r, r), e.restore()
        }
        _drawBackground(e, t) {
            const i = Math.ceil(t * this._size.width),
                s = Math.ceil(t * this._size.height),
                r = this._getBackgroundTopColor(),
                n = this._getBackgroundBottomColor();
            if (r === n ? (0, X.clearRect)(e, 0, 0, i + 1, s + 1, r) : (0, J.clearRectWithGradient)(e, 0, 0, i + 1, s + 1, r, n), this._highlighted) {
                const t = ee.themes[this._backgroundBasedTheme.value()].getThemedColor("color-price-axis-highlight");
                (0, X.fillRect)(e, 0, 0, i + 1, s + 1, t), e.globalAlpha = 1
            }
        }
        _tooltipContent() {
            return this._sourcesTitlesProvider().join("\n")
        }
        _mouseOrTouchEnterEvent(e) {
            null !== this._label && "symbol" !== this._labelMode && this._labelOptions.enableHighlight && this._setHighlighted(!0)
        }
        _mouseOrTouchLeaveEvent(e) {
            "symbol" !== this._labelMode && this._setHighlighted(!1)
        }
        _mouseClickOrTapEvent(e) {
            if (e.preventDefault(), null !== this._fixedLabelMode || "symbol" === this._labelMode || !this._labelOptions.enableMenu || !this._labelOptions.showLabels) return void he.ContextMenuManager.hideAll();
            this._fixedLabelMode = this._labelMode, this.setLabelMode("gear");
            const t = this._cell.getBoundingClientRect();
            he.ContextMenuManager.showMenu(this._contextMenuItemsProvider(), {
                clientX: this._isLeft ? t.left : t.right,
                clientY: t.top,
                attachToXBy: this._isLeft ? "left" : "right",
                attachToYBy: "bottom"
            }, {
                statName: "PriceScaleLabelContextMenu",
                doNotCloseOn: this.getElement()
            }, {
                menuName: "PriceScaleLabelContextMenu"
            }, (() => {
                this.setLabelMode((0, r.ensureNotNull)(this._fixedLabelMode)), this._fixedLabelMode = null
            }))
        }
    }
    var _e = i(10688);
    class me {
        constructor(e, t, i, r, n, o = null) {
            this._axises = [], this._stubs = [], this._size = (0, s.size)({
                width: 0,
                height: 0
            }), this._onLabelHovered = new(ce()), this._scalesProperties = e, this._priceAxisWidgetFactory = i, this._timeAxisWidget = o, this._rendererOptionsProvider = r.rendererOptionsProvider, this._titlesProvider = r.titlesProvider, this._stubContextMenuProvider = r.stubContextMenuProvider, this._backgroundBasedTheme = r.backgroundBasedTheme, this._getBackgroundTopColor = r.getBackgroundTopColor, this._getBackgroundBottomColor = r.getBackgroundBottomColor, this._showHorisontalBorder = Boolean(r.showHorizontalBorder), this._labelsOptions = {
                ...ue,
                ...n
            };
            const a = this._scalesProperties.childs();
            this._stubProperties = {
                lineColor: a.lineColor,
                fontSize: a.fontSize
            }, this._side = t, this._cell = document.createElement("td"), this._cell.classList.add("chart-markup-table", "price-axis-container"), this._cell.style.width = "25px", this._cell.style.position = "relative"
        }
        destroy() {
            this.setScales([], 0, 0, 0)
        }
        onLabelHovered() {
            return this._onLabelHovered
        }
        setScales(e, t, i, s) {
            for (; e.length > this._axises.length && this._axises.length < t;) {
                const e = (0, _e.getPriceAxisNameInfo)(this._side, this._axises.length),
                    t = this._priceAxisWidgetFactory(this._side, this._rendererOptionsProvider, this._scalesProperties, e, this._backgroundBasedTheme);
                this._axises.push(t), this._cell.appendChild(t.getElement())
            }
            for (; e.length < this._axises.length;) {
                const e = (0, r.ensureDefined)(this._axises.pop());
                this._cell.removeChild(e.getElement()), e.destroy()
            }
            for (let t = 0; t < this._axises.length; ++t) this._axises[t].setPriceScale(e[t]);
            const n = t - e.length,
                o = Math.max(0, n);
            for (; this._stubs.length > o;) {
                const e = (0, r.ensureDefined)(this._stubs.pop());
                e.onLabelHovered().unsubscribeAll(this), this._cell.removeChild(e.getElement()), e.destroy()
            }
            for (; this._stubs.length < n;) {
                const e = this._labelsOptions.showLabels ? (0, _e.getPriceAxisNameInfo)(this._side, this._stubs.length) : null,
                    t = new pe(this._side, this._stubProperties, e, this._stubParams(this._stubs.length), this._labelsOptions, this._timeAxisWidget);
                t.onLabelHovered().subscribe(this, ((t, i) => {
                    this._labelsOptions.showLabels && this._labelsOptions.enableHighlight && this._onLabelHovered.fire({
                        owner: t,
                        axis: (0, r.ensureNotNull)(e)
                    }, i)
                })), this._stubs.push(t), this._cell.appendChild(t.getElement())
            }
            const a = this._labelsOptions.enableMenu;
            1 === s ? this._stubs.forEach(((e, t) => e.setLabelMode(a ? "gear" : "symbol"))) : this._stubs.forEach(((e, t) => e.setLabelMode(t < i && a ? "auto" : "symbol")))
        }
        getElement() {
            return this._cell
        }
        updateCurrencyLabels() {
            return this._axises.forEach((e => e.updateCurrencyLabel()))
        }
        optimalWidths() {
            return this._axises.map((e => e.optimalWidth()))
        }
        setSizes(e, t) {
            this._size = (0, s.size)({
                    width: t.reduce(((e, t) => e + t), 0),
                    height: e
                }), this._cell.style.width = this._size.width + "px", this._cell.style.minWidth = this._size.width + "px", this._cell.style.height = this._size.height + "px",
                t.length !== this._axises.length + this._stubs.length && (0, r.assert)(t.length === this._axises.length + this._stubs.length, "Widgets count should be the same as widths one");
            let i = 0;
            this._forEachWidgetFromLeft(((r, n) => {
                const o = t[n];
                r.setSizeAndOffset((0, s.size)({
                    width: o,
                    height: e
                }), i), i += o
            }))
        }
        update() {
            this._axises.forEach((e => e.update())), this._stubs.forEach((e => e.update()))
        }
        paint(e) {
            this._axises.forEach(((t, i) => t.paint(e(i)))), this._stubs.forEach(((t, i) => t.paint(e(i))))
        }
        paintStubs(e) {
            this._stubs.forEach((t => t.paint(e)))
        }
        restoreDefaultCursor() {
            this._axises.forEach((e => e.restoreDefaultCursor()))
        }
        getWidth() {
            return this._size.width
        }
        findAxisWidgetForScale(e) {
            const t = this._axises.find((t => t.priceScale() === e));
            return void 0 === t ? null : t
        }
        getScreenshotData() {
            const e = this._getImage();
            return {
                canvas: e,
                content: e.toDataURL(),
                contentHeight: this._size.height,
                contentWidth: this._size.width
            }
        }
        getImage() {
            return this._getImage()
        }
        slotsCount() {
            return this._axises.length + this._stubs.length
        }
        highlightPriceAxisByLabel(e) {
            this._axises.forEach((t => {
                const i = t.axisInfo();
                t.setHighlighted(null !== i && i.equals(e))
            }))
        }
        axes() {
            return this._axises
        }
        _stubParams(e) {
            return {
                rendererOptionsProvider: this._rendererOptionsProvider,
                backgroundBasedTheme: this._backgroundBasedTheme,
                sourcesTitlesProvider: () => this._titlesProvider(this._side, e),
                contextMenuItemsProvider: () => this._stubContextMenuProvider(this._side, e),
                getBackgroundTopColor: this._getBackgroundTopColor,
                getBackgroundBottomColor: this._getBackgroundBottomColor,
                showHorizontalBorder: this._showHorisontalBorder
            }
        }
        _getImage() {
            const e = (0, X.createDisconnectedCanvas)(document, this._size),
                t = (0, X.getPrescaledContext2D)(e);
            let i = 0;
            return this._forEachWidgetFromLeft(((e, s) => {
                const r = e.getWidth();
                0 !== r && 0 !== this._size.height && (t.drawImage(e.getImage(), i, 0, r, this._size.height), i += r)
            })), e
        }
        _forEachWidgetFromLeft(e) {
            const t = [...this._axises, ...this._stubs],
                i = "left" === this._side,
                s = i ? -1 : t.length,
                r = i ? -1 : 1;
            for (let n = i ? t.length - 1 : 0; n !== s; n += r) e(t[n], n, t)
        }
    }
    var ge = i(34565),
        fe = i(51768),
        ve = i(24377),
        Se = i(87095),
        ye = i(45345),
        be = i(24633),
        we = i(37160),
        Pe = i(55824),
        Ce = i(60682);
    const xe = (0, F.getHexColorByName)("color-white"),
        Te = (0, F.getHexColorByName)("color-cold-gray-100"),
        Ie = (0, Se.applyTransparency)((0, F.getHexColorByName)("color-white"), 60),
        Me = (0, F.getHexColorByName)("color-cold-gray-800"),
        Ae = (0, Se.applyTransparency)((0, F.getHexColorByName)("color-black"), 60);

    function Le(e) {
        const t = (0, Se.isHexColor)(e) ? e.toLowerCase() : (0, ve.rgbToHexString)((0, ve.parseRgb)(e));
        return ye.watchedTheme.value() === be.StdTheme.Light ? t === xe ? Te : Ie : "#181c27" === t ? Me : Ae
    }
    class ke {
        constructor() {
            this._width = null, this._currencyInfo = null, this._unitInfo = null, this._measureUnitIdInfo = null, this._fontSize = 0, this._backgroundColor = "", this._hoverColor = "", this._fadeEndColor = "", this._hoveredLabel = null, this._currencyAndUnitLabelsWrapper = document.createElement("div"), this._currencyAndUnitLabelsWrapper.className = Ce["price-axis-currency-label-wrapper"], this._currencyAndUnitLabelsWrapper.setAttribute("data-name", "currency-unit-label-wrapper"), this._controlsContainer = document.createElement("div"),
                this._controlsContainer.className = Ce["price-axis-currency-label"], this._currencyAndUnitLabelsWrapper.appendChild(this._controlsContainer), this._currencyLabelDiv = document.createElement("div"), this._currencyLabelDiv.className = Ce.row, this._currencyLabelDiv.classList.add("apply-common-tooltip"), (0, de.setTooltipData)(this._currencyLabelDiv, "text", (e => this._currencyTooltipContent())), this._currencyText = document.createElement("span"), this._currencyText.className = Ce["price-axis-currency-label-text"], this._currencyLabelDiv.appendChild(this._currencyText), this._currencyArrowDown = document.createElement("span"), this._currencyArrowDown.className = Ce["price-axis-currency-label-arrow-down"], this._currencyArrowDown.innerHTML = Pe, this._currencyLabelDiv.appendChild(this._currencyArrowDown), this._measureUnitIdLabelDiv = document.createElement("div"), this._measureUnitIdLabelDiv.className = Ce.row, this._measureUnitIdLabelDiv.classList.add("apply-common-tooltip"), this._measureUnitIdLabelDiv.classList.add("readonly"), (0, de.setTooltipData)(this._measureUnitIdLabelDiv, "text", (e => this._measureUnitIdTooltipContent())), this._measureUnitIdText = document.createElement("span"), this._measureUnitIdText.className = Ce["price-axis-currency-label-text"], this._measureUnitIdLabelDiv.appendChild(this._measureUnitIdText), this._unitLabelDiv = document.createElement("div"), this._unitLabelDiv.className = Ce.row, this._unitLabelDiv.classList.add("apply-common-tooltip"), (0, de.setTooltipData)(this._unitLabelDiv, "text", (e => this._unitTooltipContent())), this._unitText = document.createElement("span"), this._unitText.className = Ce["price-axis-currency-label-text"], this._unitLabelDiv.appendChild(this._unitText), this._unitArrowDown = document.createElement("span"), this._unitArrowDown.className = Ce["price-axis-currency-label-arrow-down"], this._unitArrowDown.innerHTML = Pe, this._unitLabelDiv.appendChild(this._unitArrowDown), this._controlsContainer.appendChild(this._currencyLabelDiv), this._controlsContainer.appendChild(this._measureUnitIdLabelDiv), this._controlsContainer.appendChild(this._unitLabelDiv), this._fadeDiv = document.createElement("div"), this._fadeDiv.className = Ce["price-axis-currency-label-fade"], this._currencyAndUnitLabelsWrapper.appendChild(this._fadeDiv);
            const e = e => {
                null !== this._hoveredLabel && this._hoveredLabel !== e && (this._hoveredLabel.style.background = ""), e && e.classList.contains("readonly") || (this._hoveredLabel = e, "" === this._hoverColor && (this._hoverColor = Le(this._backgroundColor)), null !== e && (e.style.background = this._hoverColor))
            };
            this._currencyLabelDiv.addEventListener("mouseover", (() => e(this._currencyLabelDiv))), this._currencyLabelDiv.addEventListener("mouseout", (() => e(null))), this._unitLabelDiv.addEventListener("mouseover", (() => e(this._unitLabelDiv))), this._unitLabelDiv.addEventListener("mouseout", (() => e(null))), this.disableCurrency(), this.disableUnit()
        }
        element() {
            return this._currencyAndUnitLabelsWrapper
        }
        currencyLabelElement() {
            return this._currencyLabelDiv
        }
        unitLabelElement() {
            return this._unitLabelDiv
        }
        measureUnitIdLabelElement() {
            return this._measureUnitIdLabelDiv
        }
        isEnabled() {
            return this.currencyLabelEnabled() || this.unitLabelEnabled() || this.measureUnitIdLableEnabled()
        }
        width() {
            if (null !== this._width) return this._width;
            let e = 0;
            if (this.currencyLabelEnabled()) {
                const t = this._currencyText.getBoundingClientRect(),
                    i = this._currencyArrowDown.getBoundingClientRect();
                e = Math.max(e, t.width + i.width + 2 * this._textMarginAndPadding())
            }
            if (this.measureUnitIdLableEnabled()) {
                const t = this._measureUnitIdText.getBoundingClientRect();
                e = Math.max(e, t.width + 2 * this._textMarginAndPadding())
            }
            if (this.unitLabelEnabled()) {
                const t = this._unitText.getBoundingClientRect(),
                    i = this._unitArrowDown.getBoundingClientRect();
                e = Math.max(e, t.width + i.width + 2 * this._textMarginAndPadding())
            }
            return this._width = e
        }
        drawLabel(e, t, i) {
            var s, r, n;
            if (!this.isEnabled()) return;
            const o = [];
            o.push(this.currencyLabelEnabled() && null !== (s = this._currencyText.textContent) && void 0 !== s ? s : ""), o.push(this.measureUnitIdLableEnabled() && null !== (r = this._measureUnitIdText.textContent) && void 0 !== r ? r : ""), o.push(this.unitLabelEnabled() && null !== (n = this._unitText.textContent) && void 0 !== n ? n : ""), e.font = (0, Q.makeFont)(this._fontSize, se.CHART_FONT_FAMILY);
            const a = new ge.TextWidthCache,
                l = o.map((t => "" === t ? 0 : a.yMidCorrection(e, t))),
                c = Math.round(Number(Ce.css_wrapper_margin) * i),
                h = (0, we.ceiledEven)(t * i) - 2 * c,
                d = Math.round(this.labelBottom() * i);
            e.fillStyle = this._backgroundColor, e.fillRect(c, 0, h, d);
            const u = Math.round(Number(Ce.css_fade_height) * i),
                p = e.createLinearGradient(0, d, 0, d + u);
            p.addColorStop(0, this._backgroundColor), p.addColorStop(1, this._fadeEndColor), e.fillStyle = p;
            const _ = Math.round(Number(Ce.css_value_currency_label_radius) * i);
            (0, J.drawRoundRect)(e, c, d, h, u, [0, 0, _, _]), e.fill(), e.fillStyle = this._controlsContainer.style.color, e.textBaseline = "middle", e.textAlign = "left";
            const m = Math.round(Number(Ce.css_first_row_top_padding) * i),
                g = Math.round(this._textMarginAndPadding() * i) + c,
                f = this._oneLineHeight() / 2 * i;
            let v = m + f;
            o.forEach(((t, s) => {
                "" !== t && ((0, X.drawScaled)(e, i, i, (() => {
                    e.fillText(t, g / i, (v + l[s]) / i)
                })), v = Math.ceil(v + 2 * f))
            }))
        }
        setHidden(e) {
            this._controlsContainer.classList.toggle(Ce.hidden, e), this._fadeDiv.classList.toggle(Ce.hidden, e)
        }
        enableCurrency() {
            this._currencyLabelDiv.classList.remove("js-hidden"), this._width = null, this._updateVisibility()
        }
        disableCurrency() {
            this._currencyLabelDiv.classList.add("js-hidden"), this._width = null, this._updateVisibility()
        }
        enableUnit() {
            this._unitLabelDiv.classList.remove("js-hidden"), this._width = null, this._updateVisibility()
        }
        disableUnit() {
            this._unitLabelDiv.classList.add("js-hidden"), this._width = null, this._updateVisibility()
        }
        enableMeasureUnitId() {
            this._measureUnitIdLabelDiv.classList.remove("js-hidden"), this._width = null, this._updateVisibility()
        }
        disableMeasureUnitId() {
            this._measureUnitIdLabelDiv.classList.add("js-hidden"), this._width = null, this._updateVisibility()
        }
        currencyLabelEnabled() {
            return !this._currencyLabelDiv.classList.contains("js-hidden")
        }
        unitLabelEnabled() {
            return !this._unitLabelDiv.classList.contains("js-hidden")
        }
        measureUnitIdLableEnabled() {
            return !this._measureUnitIdLabelDiv.classList.contains("js-hidden")
        }
        currencyConversionAvailable() {
            return !this._currencyLabelDiv.classList.contains("readonly")
        }
        unitConversionAvailable() {
            return !this._unitLabelDiv.classList.contains("readonly")
        }
        setCurrencyInfo(e) {
            if (this._currencyInfo === e) return !1;
            this._currencyInfo = e;
            const t = null === e.selectedCurrency ? o.t(null, void 0, i(95093)) : (0, r.ensureDefined)(e.displayedValues.get(e.selectedCurrency));
            return this._currencyText.textContent !== t && (this._currencyText.textContent = t, this._width = null), this._currencyArrowDown.classList.contains("js-hidden") !== e.readOnly && (this._currencyArrowDown.classList.toggle("js-hidden", e.readOnly), this._currencyLabelDiv.classList.toggle("readonly", e.readOnly), this._width = null), !0
        }
        setUnitInfo(e) {
            if (null !== this._unitInfo && this._unitInfo.selectedUnit === e.selectedUnit && 0 === this._unitInfo.availableGroups.size == (0 === e.availableGroups.size) && this._unitInfo.originalUnits.size === e.originalUnits.size) return this._unitInfo = e, !1;
            this._unitInfo = e;
            const t = null === e.selectedUnit ? o.t(null, void 0, i(95093)) : (0, r.ensureDefined)(e.names.get(e.selectedUnit));
            return this._unitText.textContent !== t && (this._unitText.textContent = t, this._width = null), this._unitArrowDown.classList.contains("js-hidden") !== (0 === e.availableGroups.size) && (this._unitArrowDown.classList.toggle("js-hidden", 0 === e.availableGroups.size), this._unitLabelDiv.classList.toggle("readonly", 0 === e.availableGroups.size), this._width = null), !0
        }
        setMeasureUnitIdInfo(e) {
            if (this._measureUnitIdInfo === e) return !1;
            this._measureUnitIdInfo = e;
            const t = null === e.selectedMeasureUnitId ? o.t(null, void 0, i(95093)) : (0, r.ensureDefined)(e.names.get(e.selectedMeasureUnitId));
            return this._measureUnitIdText.textContent !== t && (this._measureUnitIdText.textContent = t, this._width = null), this._measureUnitIdLabelDiv.classList.contains("js-hidden") !== (0 === e.names.size) && (this._measureUnitIdLabelDiv.classList.toggle("js-hidden", 0 === e.names.size), this._width = null), !0
        }
        updateColors(e, t) {
            this._controlsContainer.style.color = t, this._backgroundColor !== e && (this._backgroundColor = e, this._fadeEndColor = (0, Se.applyTransparency)(e, 100), this._hoverColor = Le(e)), this._controlsContainer.style.background = this._backgroundColor, null !== this._hoveredLabel && (this._hoveredLabel.style.background = this._hoverColor), this._fadeDiv.style.background = `linear-gradient(${this._backgroundColor}, ${this._fadeEndColor})`
        }
        currencyInfo() {
            return this._currencyInfo
        }
        unitInfo() {
            return this._unitInfo
        }
        measureUnitIdInfo() {
            return this._measureUnitIdInfo
        }
        setFontSize(e) {
            this._fontSize !== e && (this._fontSize = e, this._currencyLabelDiv.style.fontSize = e + "px", this._measureUnitIdLabelDiv.style.fontSize = e + "px", this._unitLabelDiv.style.fontSize = e + "px", this._width = null, this._setLineHeight(this._oneLineHeight()))
        }
        labelBottom() {
            const e = this._oneLineHeight();
            let t = (this.currencyLabelEnabled() ? e : 0) + (this.measureUnitIdLableEnabled() ? e : 0) + (this.unitLabelEnabled() ? e : 0);
            return t > 0 && (t += Number(Ce.css_first_row_top_padding)), t
        }
        _textMarginAndPadding() {
            return Number(Ce.css_row_left_right_margin) + Number(Ce.css_row_left_right_padding)
        }
        _currencyTooltipContent() {
            const e = this._currencyInfo;
            return null === e ? "" : null === e.selectedCurrency ? Array.from(e.currencies).map((t => (0, r.ensureDefined)(e.displayedValues.get(t)))).join(", ") : e.displayedValues.get(e.selectedCurrency) || ""
        }
        _unitTooltipContent() {
            const e = this._unitInfo;
            return null === e ? "" : null === e.selectedUnit ? Array.from(e.units).map((t => (0, r.ensureDefined)(e.names.get(t)))).join(", ") : e.descriptions.get(e.selectedUnit) || ""
        }
        _measureUnitIdTooltipContent() {
            const e = this._measureUnitIdInfo;
            return null === e ? "" : null === e.selectedMeasureUnitId ? Array.from(e.measureUnitIds).map((t => (0, r.ensureDefined)(e.names.get(t)))).join(", ") : e.descriptions.get(e.selectedMeasureUnitId) || ""
        }
        _setLineHeight(e) {
            this._currencyLabelDiv.style.lineHeight = e + "px", this._measureUnitIdLabelDiv.style.lineHeight = e + "px", this._unitLabelDiv.style.lineHeight = e + "px"
        }
        _updateVisibility() {
            const e = this.isEnabled();
            this._currencyAndUnitLabelsWrapper.classList.toggle("js-hidden", !e), this._fadeDiv.classList.toggle("js-hidden", !e)
        }
        _oneLineHeight() {
            return 7 + this._fontSize
        }
    }
    async function Ee(e, t, s, r) {
        const {
            UnitConversionRenderer: n
        } = await Promise.all([i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(6), i.e(2587), i.e(6752), i.e(4015), i.e(6036), i.e(6025), i.e(7111), i.e(962), i.e(3016), i.e(3179), i.e(2704)]).then(i.bind(i, 28587));
        return new n(e, s, t, r)
    }

    function De(e, t) {
        let {
            deltaX: i,
            deltaY: s
        } = e;
        switch (i /= 100, s /= 100, t.deltaMode) {
            case t.DOM_DELTA_PAGE:
                i *= 120, s *= 120;
                break;
            case t.DOM_DELTA_LINE:
                i *= 32, s *= 32
        }
        return {
            deltaX: i,
            deltaY: s
        }
    }
    class Ve {
        constructor() {
            this._totalDeltaX = 0, this._totalDeltaY = 0, this._prevWheelTime = 0
        }
        processWheel(e) {
            e.timeStamp - this._prevWheelTime > 100 && this._reset(), this._totalDeltaX += e.deltaX, this._totalDeltaY += e.deltaY, this._prevWheelTime = e.timeStamp;
            const t = {
                deltaX: e.deltaX,
                deltaY: e.deltaY
            };
            return 0 === this._totalDeltaX || 0 === this._totalDeltaY || (Math.abs(this._totalDeltaX) >= Math.abs(3 * this._totalDeltaY) && (t.deltaY = 0), Math.abs(this._totalDeltaY) >= Math.abs(3 * this._totalDeltaX) && (t.deltaX = 0)), De(t, e)
        }
        _reset() {
            this._totalDeltaX = 0, this._totalDeltaY = 0
        }
    }
    var Be = i(68335),
        Re = i(77212),
        Ne = i(10786),
        Oe = i(14483),
        Fe = i(73212),
        We = i(42226),
        ze = i(39267);
    i(47184);
    const He = new z.TranslatedString("change no overlapping labels", o.t(null, void 0, i(83935))),
        Ue = o.t(null, void 0, i(75633)),
        je = o.t(null, void 0, i(94420)),
        Ge = o.t(null, void 0, i(81520)),
        qe = o.t(null, void 0, i(25933)),
        $e = o.t(null, void 0, i(17258)),
        Ye = o.t(null, void 0, i(50834)),
        Ke = o.t(null, {
            context: "scale_menu"
        }, i(70361)),
        Ze = o.t(null, {
            context: "scale_menu"
        }, i(47807)),
        Xe = o.t(null, {
            context: "scale_menu"
        }, i(34727)),
        Je = o.t(null, {
            context: "scale_menu"
        }, i(72116)),
        Qe = o.t(null, {
            context: "scale_menu"
        }, i(19238)),
        et = o.t(null, {
            context: "scale_menu"
        }, i(54138));
    const tt = function(e) {
            const t = new Ne.LimitedPrecisionNumericFormatter(e);
            return (e, i) => (0, y.isNumber)(i) && !e.isLog() ? t.format(i) : ""
        }(4),
        it = {
            contextMenuEnabled: !0,
            currencyConversionEnabled: !1,
            unitConversionEnabled: !1,
            countdownEnabled: !0,
            contextMenu: {
                general: !0,
                source: !0
            },
            pressedMouseMoveScale: !0,
            mouseWheelScale: !0,
            pinchScale: !0,
            croppedTickMarks: !0
        };
    class st {
        constructor(e, t, i, r, n, o, a, l, c) {
            this._actions = null, this._priceScale = null,
                this._widthCache = new ge.TextWidthCache(1e3), this._color = null, this._fontSize = null, this._currencyFontSize = 0, this._currencyLabelWidth = null, this._isVisible = !0, this._currencyMenu = null, this._unitMenu = null, this._prevOptimalWidth = 0, this._size = (0, s.size)({
                    width: 0,
                    height: 0
                }), this._currentCursorClassName = "", this._destroyed = !1, this._highlighted = !1, this._mouseWheelHelper = null, this._dragScaleActive = !1, this._offset = NaN, this._pinching = !1, this._lastHittestResult = null, this._recalcCurrencyAndUnitVisibility = () => {
                    if (null === this._currencyLabel) return;
                    let e = !0;
                    switch ((0, We.currencyUnitVisibilityProperty)().value()) {
                        case "alwaysOff":
                            e = !1;
                            break;
                        case "visibleOnMouseOver":
                            const t = this._chart.anyPriceAxisHovered().value(),
                                i = null !== this._currencyMenu && this._currencyMenu.isOpened(),
                                s = null !== this._unitMenu && this._unitMenu.isOpened();
                            e = t || i || s
                    }
                    this._currencyLabel.setHidden(!e)
                }, this._chart = e, this._pane = t, this._undoModel = i, this._properties = r, this._isLeft = "left" === o, this._options = (0, y.merge)((0, y.clone)(it), a), this._rendererOptionsProvider = n, this._backgroundBasedTheme = c, this._cell = document.createElement("div"), this._cell.className = "price-axis", this._cell.style.width = "25px", this._cell.style.left = "0", this._canvasConfiguredHandler = () => {
                    this._undoModel.model().lightUpdate()
                }, this._canvasBinding = (0, X.createBoundCanvas)(this._cell, (0, s.size)({
                    width: 16,
                    height: 16
                })), this._canvasBinding.subscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler);
            const h = this._canvasBinding.canvasElement;
            h.style.position = "absolute", h.style.zIndex = "1", h.style.left = "0", h.style.top = "0", this._topCanvasBinding = (0, X.createBoundCanvas)(this._cell, (0, s.size)({
                width: 16,
                height: 16
            })), this._topCanvasBinding.subscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler);
            const d = this._topCanvasBinding.canvasElement;
            d.style.position = "absolute", d.style.zIndex = "2", d.style.left = "0", d.style.top = "0", this._mouseEventHandler = new Z.MouseEventHandler(this._cell, this, {
                treatVertTouchDragAsPageScroll: !1,
                treatHorzTouchDragAsPageScroll: !0
            }), this._options.currencyConversionEnabled || this._options.unitConversionEnabled ? (this._currencyLabel = new ke, this._cell.appendChild(this._currencyLabel.element())) : this._currencyLabel = null, this._properties.childs().fontSize.subscribe(this, this._onFontSizeChanged), this._options.mouseWheelScale && (this._mouseWheelHelper = new Ve, this._cell.addEventListener("wheel", this._onMousewheel.bind(this), {
                passive: !1
            })), this._axisInfo = l, this._offset = 0, this.restoreDefaultCursor(), (0, We.currencyUnitVisibilityProperty)().subscribe(this, this._recalcCurrencyAndUnitVisibility), this._chart.anyPriceAxisHovered().subscribe(this._recalcCurrencyAndUnitVisibility), this._recalcCurrencyAndUnitVisibility(), this.update()
        }
        getContextMenuActions() {
            this._initActions();
            const e = (0, r.ensureNotNull)(this._actions),
                t = this._chart.actions(),
                i = [];
            return i.push(e.reset, new P.Separator), i.push(this._autoScaleAction()), this._isMainSeriesAxis() && i.push(this._lockScaleAction()),
                i.push(t.scaleSeriesOnly, this._invertAction(), new P.Separator, this._regularScaleAction(), this._percentageAction(), this._indexedTo100Action(), this._logAction(), new P.Separator), h.CheckMobile.any() || (i.push(this._createMergeScalesAction()), i.push(new P.Separator)), Oe.enabled("fundamental_widget") || i.push(new P.Action({
                    actionId: "Chart.PriceScale.Labels",
                    label: je,
                    subItems: [t.showSymbolLabelsAction, t.showSeriesLastValue, null, null, t.showHighLowPriceLabels, Oe.enabled("show_average_close_price_line_and_label") ? t.showAverageClosePriceLabel : null, null, t.showStudyPlotNamesAction, t.showStudyLastValue, e.alignLabels].filter(Boolean)
                })), i.push((0, Fe.createLinesAction)(this._chart)), this._options.countdownEnabled && i.push(t.showCountdown), this._undoModel.crossHairSource().isMenuEnabled() && i.push(t.addPlusButton), !(0, h.onWidget)() && Oe.enabled("show_chart_property_page") && Oe.enabled("chart_property_page_scales") && t.scalesProperties && i.push(new P.Separator, t.scalesProperties), i
        }
        getElement() {
            return this._cell
        }
        onOptimalWidthNeedToBeRecalculated(e) {
            const t = this.optimalWidth();
            (this._prevOptimalWidth < t || e) && this._undoModel.model().fullUpdate(), this._prevOptimalWidth = t
        }
        optimalWidth() {
            var e;
            if (!this.isVisible()) return 0;
            let t = 0;
            const i = this.rendererOptions();
            if (this._pane.hasState()) {
                const i = (0, X.getContext2D)(this._canvasBinding.canvasElement);
                i.font = this.baseFont();
                const s = this.backLabels(!0);
                for (let e = s.length; e--;) {
                    if (!s[e].isAxisLabelVisible()) continue;
                    const r = this._widthCache.measureText(i, s[e].text());
                    t = Math.max(t, r);
                    const n = s[e].secondLineText();
                    n && (t = Math.max(t, this._widthCache.measureText(i, n)));
                    const o = s[e].thirdLineText();
                    o && (t = Math.max(t, this._widthCache.measureText(i, o)))
                }
                const r = this.priceScale(),
                    n = r.marks();
                n.length > 0 && (t = Math.max(t, this._widthCache.measureText(i, n[0].label), this._widthCache.measureText(i, n[n.length - 1].label)));
                const o = (null === (e = r.mainSource()) || void 0 === e ? void 0 : e.firstValue()) || null;
                if (null !== o) {
                    const e = r.coordinateToPrice(1, o),
                        s = r.coordinateToPrice(this._size.height - 2, o);
                    if (Math.abs(e - s) > 1e-14) {
                        const n = r.formatPrice(Math.floor(Math.min(e, s)) + .11111111111111, o),
                            a = r.formatPrice(Math.ceil(Math.max(e, s)) - .11111111111111, o);
                        t = Math.max(t, this._widthCache.measureText(i, n), this._widthCache.measureText(i, a))
                    }
                }
            }
            let s = 0;
            this._isCurrencyLabelEnabled() && (null === this._currencyLabelWidth && (this._currencyLabelWidth = (0, r.ensureNotNull)(this._currencyLabel).width()), s = Math.round(this._currencyLabelWidth));
            const n = t || 34;
            let o = Math.max(s, Math.ceil(i.borderSize + i.additionalPaddingInner + i.paddingInner + i.paddingOuter + n + 4));
            return o += o % 2, o
        }
        backLabels(e) {
            const t = [],
                i = this._grouppedSources(),
                s = s => {
                    for (const r of s) {
                        if (!e && i.topLevelSources.has(r)) continue;
                        const s = r.priceAxisViews(this._pane.state(), this.priceScale());
                        if (s)
                            for (const e of s) t.push(e)
                    }
                };
            return s(i.sources), s(this._pane.state().customSources()), t
        }
        setSizeAndOffset(e, t) {
            (0, s.equalSizes)(this._size, e) || (this._size = e, this._canvasBinding.resizeCanvasElement(e), this._topCanvasBinding.resizeCanvasElement(e), this._cell.style.width = e.width + "px",
                this._cell.style.height = e.height + "px", this._cell.style.minWidth = e.width + "px"), this._offset !== t && (this._offset = t, this._cell.style.left = t + "px")
        }
        getWidth() {
            return this._size.width
        }
        getImage() {
            const e = this._size,
                t = (0, X.createDisconnectedCanvas)(document, e);
            return (0, X.getPrescaledContext2D)(t).drawImage(this._canvasBinding.canvasElement, 0, 0, e.width, e.height), null !== this._currencyLabel && this._currencyLabel.isEnabled() && this._currencyLabel.drawLabel((0, X.getContext2D)(t), e.width, (0, X.getCanvasDevicePixelRatio)(t)), t
        }
        update() {
            null !== this._priceScale && (this._priceScale.marks(), this._updateCurrencyLabelFont(), this.rendererOptions())
        }
        paint(e) {
            if (!this._isVisible || 0 === this._size.width || 0 === this._size.height) return;
            if (e === R.InvalidationLevel.None) return;
            const t = this._pane.state(),
                i = !t.maximized().value() && t.collapsed().value();
            if (this._canvasBinding.applySuggestedBitmapSize(), this._topCanvasBinding.applySuggestedBitmapSize(), e > R.InvalidationLevel.Cursor) {
                const e = (0, X.getContext2D)(this._canvasBinding.canvasElement),
                    t = (0, X.getBindingPixelRatio)(this._canvasBinding);
                i || this._alignLabels(), this._drawBackground(e, t), this._drawBorder(e, t), this._pane.hasState() && (this.updateCurrencyLabel(), i || (this._drawTickMarks(e, t), this._drawBackLabels(e, t)))
            }
            if (this._pane.hasState() && !i) {
                const e = (0, X.getContext2D)(this._topCanvasBinding.canvasElement),
                    t = (0, X.getBindingPixelRatio)(this._topCanvasBinding);
                e.clearRect(0, 0, Math.ceil(this._size.width * t) + 1, Math.ceil(this._size.height * t) + 1), this._drawCrossHairLabel(e, t)
            }
        }
        restoreDefaultCursor() {
            this._setCursor("")
        }
        priceScale() {
            return (0, r.ensureNotNull)(this._priceScale)
        }
        setPriceScale(e) {
            this._priceScale !== e && (null !== this._priceScale && (this._priceScale.onMarksChanged().unsubscribe(this, this.onOptimalWidthNeedToBeRecalculated), this._priceScale.modeChanged().unsubscribeAll(this)), this._priceScale = e, null !== e && (e.onMarksChanged().subscribe(this, this.onOptimalWidthNeedToBeRecalculated), e.modeChanged().subscribe(this, (() => this.onOptimalWidthNeedToBeRecalculated(!0))), this.onOptimalWidthNeedToBeRecalculated()))
        }
        isVisible() {
            return this._isVisible
        }
        setVisible(e) {
            (e = !!e) !== this._isVisible && (this._cell.style.display = e ? "table-cell" : "none", this._isVisible = e)
        }
        destroy() {
            null !== this._currencyMenu && (this._currencyMenu.close(), this._currencyMenu = null), null !== this._unitMenu && (this._unitMenu.close(), this._unitMenu = null), this._topCanvasBinding.unsubscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler), this._topCanvasBinding.dispose(), this._canvasBinding.unsubscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler), this._canvasBinding.dispose(), null !== this._priceScale && (this._priceScale.onMarksChanged().unsubscribe(this, this.onOptimalWidthNeedToBeRecalculated), this._priceScale.modeChanged().unsubscribeAll(this)), this._priceScale = null, this._mouseEventHandler.destroy(), this._properties.childs().fontSize.unsubscribe(this, this._onFontSizeChanged), null !== this._actions && this._actions.reset && this._actions.reset.destroy(), (0, We.currencyUnitVisibilityProperty)().unsubscribeAll(this),
                this._chart.anyPriceAxisHovered().unsubscribe(this._recalcCurrencyAndUnitVisibility), this._chart.setPriceAxisHovered(this, !1), this._destroyed = !0
        }
        axisInfo() {
            return this._axisInfo
        }
        setHighlighted(e) {
            this._highlighted = e
        }
        backgroundColor() {
            return this._pane.state().model().backgroundColor().value()
        }
        backgroundTopColor() {
            return this._pane.state().model().backgroundTopColor().value()
        }
        lineColor() {
            return this._properties.childs().lineColor.value()
        }
        textColor() {
            return this._properties.childs().textColor.value()
        }
        fontSize() {
            return this._properties.childs().fontSize.value()
        }
        baseFont() {
            return (0, Q.makeFont)(this.fontSize(), se.CHART_FONT_FAMILY, "")
        }
        rendererOptions() {
            let e = this._rendererOptionsProvider.options();
            return this._color === e.color && this._fontSize === e.fontSize || (this._color = e.color), this._fontSize !== e.fontSize && (this._widthCache.reset(), this._fontSize = e.fontSize, this._currencyLabelWidth = null, this._currencyFontSize = 0, this._updateCurrencyLabelFont(), this.onOptimalWidthNeedToBeRecalculated()), e
        }
        mouseEnterEvent(e) {
            this._chart.setPriceAxisHovered(this, !0), this._mouseEnterOrTouchStartEvent(e)
        }
        mouseMoveEvent(e) {
            this._mouseOrTouchMoveEvent(e)
        }
        mouseDownEvent(e) {
            this._mouseDownOrTouchStartEvent(e)
        }
        touchStartEvent(e) {
            this._mouseOrTouchMoveEvent(e), this._mouseEnterOrTouchStartEvent(e), this._mouseDownOrTouchStartEvent(e)
        }
        pressedMouseMoveEvent(e) {
            this._pressedMouseOrTouchMoveEvent(e)
        }
        touchMoveEvent(e) {
            this._pressedMouseOrTouchMoveEvent(e)
        }
        pinchStartEvent() {}
        pinchEvent(e, t, i) {
            if (this._zoomAvailable() && this._options.pinchScale) {
                if (this._dragScaleActive && this._finishScale(), !this._pinching) return this._pinching = !0, void this._undoModel.startTwoPointsScalePrice(this._pane.state(), this.priceScale(), t.y, i.y);
                this._undoModel.twoPointsScalePriceTo(this._pane.state(), this.priceScale(), t.y, i.y)
            }
        }
        pinchEndEvent() {
            this._pinching = !1, this._undoModel.endTwoPointsScalePrice(this._pane.state(), this.priceScale())
        }
        mouseDownOutsideEvent() {
            this._finishScale()
        }
        touchStartOutsideEvent() {
            this._finishScale()
        }
        mouseUpEvent(e) {
            this._mouseUpOrTouchEndEvent(e)
        }
        touchEndEvent(e) {
            this._mouseLeaveOrTouchEndEvent(e), this._mouseUpOrTouchEndEvent(e)
        }
        mouseClickEvent(e) {
            this._mouseClickOrTapEvent(e)
        }
        tapEvent(e) {
            this._mouseClickOrTapEvent(e)
        }
        mouseLeaveEvent(e) {
            this._chart.setPriceAxisHovered(this, !1), this._mouseLeaveOrTouchEndEvent(e)
        }
        mouseDoubleClickEvent(e) {
            this._mouseDoubleClickOrDoubleTapEvent(e)
        }
        doubleTapEvent(e) {
            this._mouseDoubleClickOrDoubleTapEvent(e)
        }
        contextMenuEvent(e) {
            this._contextMenuOrTouchContextMenuEvent(e)
        }
        touchContextMenuEvent(e) {
            this._contextMenuOrTouchContextMenuEvent(e)
        }
        dataSourceAtPoint(e, t) {
            const i = this._pane.state();
            if (!i.maximized().value() && i.collapsed().value()) return null;
            const s = this._grouppedSources(),
                r = [...s.sources, ...s.topLevelSources, ...i.customSources()];
            let n = null,
                o = null;
            if (!this._priceScale) return null;
            const a = (e, t) => {
                    var i;
                    const s = null !== (i = null == o ? void 0 : o.target()) && void 0 !== i ? i : 0;
                    e.target() > s && (o = e, n = t)
                },
                l = new O.Point(e, t);
            for (let e = r.length - 1; e >= 0; --e) {
                const t = r[e],
                    s = t.priceAxisViews(i, this._priceScale);
                if (s && 0 !== s.length)
                    for (let e = s.length - 1; e >= 0; --e) {
                        const i = s[e].renderer();
                        if (void 0 !== i.hitTest) {
                            const e = i.hitTest(l, this._size.width, this._isLeft ? "left" : "right");
                            null !== e && a(e, t)
                        }
                    }
            }
            return this._lastHittestResult = o, n
        }
        reset() {
            const e = this._pane.state(),
                t = this.priceScale();
            this._undoModel.resetPriceScale(e, t), this.onOptimalWidthNeedToBeRecalculated(!0)
        }
        updateCurrencyLabel() {
            if (null === this._currencyLabel) return;
            let e = !1;
            if (this._options.currencyConversionEnabled) {
                const t = this.priceScale().currency(this._undoModel.model().availableCurrencies());
                null === t || "alwaysOff" === (0, We.currencyUnitVisibilityProperty)().value() ? (e = this._currencyLabel.currencyLabelEnabled(), this._currencyLabel.disableCurrency()) : (e = !this._currencyLabel.currencyLabelEnabled(), this._currencyLabel.enableCurrency(), this._currencyLabel.updateColors(this.backgroundTopColor(), this.textColor()), e = this._currencyLabel.setCurrencyInfo(t) || e)
            }
            if (this._options.unitConversionEnabled) {
                const t = "alwaysOff" === (0, We.currencyUnitVisibilityProperty)().value(),
                    i = this._undoModel.model().availableUnits(),
                    s = this.priceScale().unit(i);
                null === s || t ? (e = e || this._currencyLabel.unitLabelEnabled(), this._currencyLabel.disableUnit()) : (e = e || !this._currencyLabel.unitLabelEnabled(), this._currencyLabel.enableUnit(), this._currencyLabel.updateColors(this.backgroundTopColor(), this.textColor()), e = this._currencyLabel.setUnitInfo(s) || e);
                const r = this.priceScale().measureUnitId(i);
                null === r || t ? (e = e || this._currencyLabel.measureUnitIdLableEnabled(), this._currencyLabel.disableMeasureUnitId()) : (e = e || !this._currencyLabel.measureUnitIdLableEnabled(), this._currencyLabel.enableMeasureUnitId(), this._currencyLabel.updateColors(this.backgroundTopColor(), this.textColor()), e = this._currencyLabel.setMeasureUnitIdInfo(r) || e)
            }
            this._updateCurrencyLabelFont(), e && (this._currencyLabelWidth = null)
        }
        _grouppedSources() {
            var e;
            const t = this._pane,
                i = t.state().model(),
                s = this._sameSideSources().slice(),
                r = t.state(),
                n = this.priceScale(),
                o = new Set,
                a = null !== (e = i.lineBeingEdited()) && void 0 !== e ? e : i.lineBeingCreated();
            a && o.add(a);
            const l = i.customSourceBeingMoved();
            null !== l && o.add(l), i.sourcesBeingMoved().forEach((e => o.add(e))), i.selection().allSources().forEach((e => o.add(e)));
            const c = i.hoveredSource();
            null !== c && o.add(c);
            if (n === r.defaultPriceScale()) {
                const e = this._pane.state().dataSources();
                for (const t of e) r.isOverlay(t) && s.push(t)
            }
            return {
                sources: s,
                topLevelSources: o
            }
        }
        _isCurrencyLabelEnabled() {
            return null !== this._currencyLabel && this._currencyLabel.isEnabled()
        }
        _updateCurrencyLabelFont() {
            if (null === this._currencyLabel) return;
            const e = this.fontSize();
            e !== this._currencyFontSize && (this._currencyLabel.setFontSize(e), this._currencyFontSize = e, this._currencyLabelWidth = null, this.onOptimalWidthNeedToBeRecalculated())
        }
        _alignLabels() {
            var e, t;
            const i = this._size.height;
            let s = i / 2;
            const r = [],
                n = this.priceScale(),
                o = n.orderedSources().slice(),
                a = this._pane.state(),
                l = this.rendererOptions();
            if (n === a.defaultPriceScale()) {
                const e = a.priceDataSources();
                for (let t = 0; t < e.length; t++) a.isOverlay(e[t]) && o.push(e[t])
            }
            const c = n.mainSource();
            for (const e of [o, a.customSources()])
                for (let t = 0; t < e.length; ++t) {
                    const o = e[t],
                        h = o.priceAxisViews(a, n);
                    if (h) {
                        const e = h.filter((e => {
                            if (e.ignoreAlignment() || !e.isVisible()) return !1;
                            const {
                                total: t
                            } = e.topBottomTotalHeight(l), s = e.floatCoordinate();
                            return s > -t && s < i + t
                        }));
                        if (!e.length) continue;
                        r.push(...e), c === o && (s = e[0].floatCoordinate())
                    }
                }
            const h = r.filter((e => e.floatCoordinate() <= s)),
                d = r.filter((e => e.floatCoordinate() > s));
            h.sort(((e, t) => t.floatCoordinate() - e.floatCoordinate())), h.length > 0 && d.length > 0 && d.push(h[0]), d.sort(((e, t) => e.floatCoordinate() - t.floatCoordinate()));
            for (const e of r) e.setFixedCoordinate(e.coordinate());
            if (n.properties().childs().alignLabels.value()) {
                if (d.length > 0 || h.length > 0) {
                    {
                        const t = null !== (e = h[0]) && void 0 !== e ? e : d[0],
                            s = t.getFixedCoordinate(),
                            {
                                top: r,
                                bottom: n,
                                total: o
                            } = t.topBottomTotalHeight(l);
                        o < i && s - r < 0 && s + n > 0 && t.setFixedCoordinate(r)
                    } {
                        const e = null !== (t = d[0]) && void 0 !== t ? t : h[0],
                            s = e.getFixedCoordinate(),
                            {
                                top: r,
                                bottom: n,
                                total: o
                            } = e.topBottomTotalHeight(l);
                        o < i && s - r < i && s + n > i && e.setFixedCoordinate(i - n)
                    }
                }
                for (let e = 1; e < h.length; e++) {
                    const t = h[e],
                        i = h[e - 1],
                        {
                            top: s,
                            bottom: r,
                            total: n
                        } = t.topBottomTotalHeight(l),
                        o = t.getFixedCoordinate(),
                        a = i.getFixedCoordinate();
                    if (o > a - n) t.setFixedCoordinate(a - n);
                    else if (a > 0 && o - s < 0 && o + r > 0) {
                        const {
                            top: e
                        } = i.topBottomTotalHeight(l);
                        t.setFixedCoordinate(Math.min(a - e - r, s))
                    }
                }
                for (let e = 1; e < d.length; e++) {
                    const t = d[e],
                        s = d[e - 1],
                        {
                            bottom: r,
                            total: n
                        } = s.topBottomTotalHeight(l),
                        o = t.getFixedCoordinate(),
                        a = s.getFixedCoordinate();
                    if (o < a + n) t.setFixedCoordinate(a + n);
                    else if (a < i) {
                        const {
                            top: e,
                            bottom: s
                        } = t.topBottomTotalHeight(l);
                        o - e < i && o + s > i && t.setFixedCoordinate(Math.max(a + r + e, i - s))
                    }
                }
            }
        }
        _drawTickMarks(e, t) {
            const i = this.priceScale().marks();
            e.save(), e.font = this.baseFont();
            const s = this.rendererOptions(),
                n = this._isLeft ? Math.floor((this._size.width - s.additionalPaddingInner) * t) : 0,
                o = this._isLeft ? Math.round(n - s.paddingInner * t) : Math.round(n + (s.additionalPaddingInner + s.paddingInner) * t),
                a = this.fontSize(),
                l = this._isCurrencyLabelEnabled() ? (0, r.ensureNotNull)(this._currencyLabel).labelBottom() : 0,
                c = i.map((t => {
                    if (this._options.croppedTickMarks) return {
                        visible: !0,
                        yCorrection: this._widthCache.yMidCorrection(e, t.label)
                    };
                    const i = t.coord - a / 2,
                        s = t.coord + a / 2,
                        r = !(s > this._size.height || i < l);
                    return {
                        visible: !(s > this._size.height || i < l),
                        yCorrection: r ? this._widthCache.yMidCorrection(e, t.label) : 0
                    }
                }));
            e.fillStyle = this.textColor(), e.textAlign = this._isLeft ? "right" : "left", e.textBaseline = "middle", (0, X.drawScaled)(e, t, t, (() => {
                for (let s = i.length; s--;) {
                    if (!c[s].visible) continue;
                    const r = i[s];
                    e.fillText(r.label, o / t, r.coord + c[s].yCorrection)
                }
            })), e.restore()
        }
        _hasAlertLabel() {
            return !1
        }
        async _showCurrenciesContextMenu() {
            if (null !== this._currencyMenu && this._currencyMenu.isOpened()) return void this._currencyMenu.close();
            (0, fe.trackEvent)("GUI", "Currency conversion");
            const {
                currencyActions: e
            } = await Promise.all([i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(6), i.e(2587), i.e(6752), i.e(4015), i.e(6036), i.e(6025), i.e(7111), i.e(962), i.e(3016), i.e(3179), i.e(2704)]).then(i.bind(i, 84298)), t = await Ee(Ge, (() => e(this._undoModel, (0,
                r.ensureNotNull)(this._currencyLabel).currencyInfo(), this.priceScale())), (0, r.ensureNotNull)(this._currencyLabel).currencyLabelElement(), (() => this._recalcCurrencyAndUnitVisibility()));
            this._destroyed ? t.close() : this._currencyMenu = t
        }
        async _showUnitsContextMenu() {
            if (null !== this._unitMenu && this._unitMenu.isOpened()) return void this._unitMenu.close();
            (0, fe.trackEvent)("GUI", "Unit conversion");
            const {
                unitActions: e
            } = await Promise.all([i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(6), i.e(2587), i.e(6752), i.e(4015), i.e(6036), i.e(6025), i.e(7111), i.e(962), i.e(3016), i.e(3179), i.e(2704)]).then(i.bind(i, 14818)), t = await Ee(qe, (() => e(this._undoModel, (0, r.ensureNotNull)(this._currencyLabel).unitInfo(), this.priceScale())), (0, r.ensureNotNull)(this._currencyLabel).unitLabelElement(), (() => this._recalcCurrencyAndUnitVisibility()));
            this._destroyed ? t.close() : this._unitMenu = t
        }
        _onFontSizeChanged() {
            this._currencyLabelWidth = null, this._currencyFontSize = 0, this._updateCurrencyLabelFont(), this.onOptimalWidthNeedToBeRecalculated()
        }
        _mouseOrTouchMoveEvent(e) {
            if (!this._priceScale) return;
            this.dataSourceAtPoint(e.localX, e.localY) ? this._setCursorClassName("pointer") : this._setResizeCursor()
        }
        _mouseDownOrTouchStartEvent(e) {
            this._zoomAvailable() && this._options.pressedMouseMoveScale && !this._pinching && (this._dragScaleActive = !0, this._undoModel.startScalePrice(this._pane.state(), this.priceScale(), e.localY))
        }
        _mouseEnterOrTouchStartEvent(e) {
            this._setResizeCursor()
        }
        _pressedMouseOrTouchMoveEvent(e) {
            if (this._dragScaleActive) {
                const t = this.priceScale();
                this._undoModel.scalePriceTo(this._pane.state(), t, e.localY)
            }
        }
        _mouseUpOrTouchEndEvent(e) {
            this._finishScale()
        }
        _finishScale() {
            this._dragScaleActive && (this._undoModel.endScalePrice(this._pane.state(), this.priceScale()), this.restoreDefaultCursor(), this._dragScaleActive = !1)
        }
        _mouseClickOrTapEvent(e) {
            if (this._currencyLabel) {
                if (this._currencyLabel.currencyConversionAvailable() && this._currencyLabel.currencyLabelElement().contains(e.target)) return void this._showCurrenciesContextMenu();
                if (this._currencyLabel.unitConversionAvailable() && this._currencyLabel.unitLabelElement().contains(e.target)) return void this._showUnitsContextMenu()
            }
            const t = this.dataSourceAtPoint(e.localX, e.localY);
            t && this._undoModel.selectionMacro((e => {
                e.selection().isSelected(t) || (e.clearSelection(), e.addSourceToSelection(t))
            }))
        }
        _mouseLeaveOrTouchEndEvent(e) {
            this._setCursorClassName("")
        }
        _mouseDoubleClickOrDoubleTapEvent(e) {
            var t;
            const i = this.dataSourceAtPoint(e.localX, e.localY);
            i ? this._pane.processDoubleClickOnSource(i, null !== (t = this._lastHittestResult) && void 0 !== t ? t : void 0, {
                origin: "price_scale"
            }) : (this.reset(), (0, fe.trackEvent)("GUI", "Double click price scale"))
        }
        _contextMenuOrTouchContextMenuEvent(e) {
            if (this._options.contextMenuEnabled) {
                const t = this.dataSourceAtPoint(e.localX, e.localY);
                if (null !== t && this._options.contextMenu.source) {
                    return void this._undoModel.model().selectionMacro((i => {
                        i.selection().isSelected(t) || (i.clearSelection(), i.addSourceToSelection(t)), this._pane.showContextMenuForSelection(e, {
                            origin: "price_scale"
                        })
                    }))
                }
                this._options.contextMenu.general && he.ContextMenuManager.showMenu(this.getContextMenuActions(), e, {
                    statName: "PriceScaleContextMenu"
                }, {
                    menuName: "PriceScaleContextMenu"
                })
            }
        }
        _setResizeCursor() {
            const e = this.priceScale();
            e.isPercentage() || e.isIndexedTo100() ? this._setCursorClassName("") : this._zoomAvailable() && (this._options.pressedMouseMoveScale || this._options.mouseWheelScale) && this._setCursorClassName("ns-resize")
        }
        _setCursorClassName(e) {
            let t = "";
            e && (t = "price-axis--cursor-" + e), this._currentCursorClassName !== t && (this._currentCursorClassName && this._cell.classList.remove(this._currentCursorClassName), t && this._cell.classList.add(t), this._currentCursorClassName = t)
        }
        _zoomAvailable() {
            return !this.priceScale().isEmpty() && this._undoModel.model().zoomEnabled()
        }
        _onMousewheel(e) {
            if (!this._zoomAvailable() || !this._options.mouseWheelScale) return;
            const t = (0, r.ensureNotNull)(this._mouseWheelHelper).processWheel(e).deltaY;
            if (0 === t) return;
            e.cancelable && e.preventDefault();
            const i = this._undoModel,
                s = this._pane.state(),
                n = this.priceScale(),
                o = this._cell.getBoundingClientRect(),
                a = e.clientY - o.top,
                l = a + 15 * t;
            i.startScalePrice(s, this.priceScale(), a, !0), i.scalePriceTo(s, n, l), i.endScalePrice(s, n), e.stopPropagation()
        }
        _drawCrossHairLabel(e, t) {
            var i, s;
            e.save();
            const r = this._pane.state(),
                n = r.model(),
                o = this.priceScale(),
                a = [],
                l = this.priceScale() === r.defaultPriceScale(),
                c = null !== (i = n.lineBeingEdited()) && void 0 !== i ? i : n.lineBeingCreated();
            if (c && (c.priceScale() === o || l && r.isOverlay(c))) {
                const e = c.priceAxisViews(r, o);
                e && e.length && a.push(e)
            }
            const h = n.customSourceBeingMoved();
            this._addViewsOrMaxMin(null === h ? [] : [h], a), this._addViewsOrMaxMin(n.sourcesBeingMoved(), a), this._addViewsOrMaxMin(n.selection().allSources(), a);
            const d = n.hoveredSource();
            if (d) {
                const e = r.customSources().includes(d) ? o : d.priceScale();
                if (!n.selection().isSelected(d) && (this._isFromSameSide(e) || l && r.isOverlay(d))) {
                    const e = null === (s = n.hoveredSource()) || void 0 === s ? void 0 : s.priceAxisViews(r, o);
                    e && e.length && a.push(e)
                }
            }
            const u = n.crossHairSource().priceAxisViews(r, o);
            u && u.length && a.push(u);
            const p = this.rendererOptions(),
                _ = this._isLeft ? "right" : "left";
            a.forEach((i => {
                i.forEach((i => {
                    e.save(), i.renderer().draw(e, p, this._widthCache, this._size.width, this._size.height, _, t), e.restore()
                }))
            })), e.restore()
        }
        _drawBackground(e, t) {
            const i = Math.ceil(this._size.width * t),
                s = Math.ceil(this._size.height * t),
                r = this.backgroundTopColor(),
                n = this.backgroundColor();
            if (r === n ? (0, X.clearRect)(e, 0, 0, i + 1, s + 1, this.backgroundColor()) : (0, J.clearRectWithGradient)(e, 0, 0, i + 1, s + 1, r, n), this._highlighted) {
                e.globalAlpha = .5;
                const t = ee.themes[this._backgroundBasedTheme.value()].getThemedColor("color-price-axis-highlight");
                (0, X.fillRect)(e, 0, 0, i + 1, s + 1, t), e.globalAlpha = 1
            }
            const o = this._pane.state().model(),
                a = this.priceScale(),
                l = o.selection().lineDataSources().filter((e => e.priceScale() === a)).reduce(((e, t) => {
                    const i = t.priceAxisPoints();
                    return 0 === i.length ? e : e.concat(i)
                }), []);
            l.length > 0 && this._hightlightBackground(e, l, this.priceScale().mainSource(), t);
            const c = o.crossHairSource();
            c.startMeasurePoint() && this._hightlightBackground(e, c.measurePoints(), this.priceScale().mainSource(), t)
        }
        _drawBorder(e, t) {
            e.save(), e.fillStyle = this.lineColor();
            const i = Math.max(1, Math.floor(this.rendererOptions().borderSize * t)),
                s = this._isLeft ? Math.floor(this._size.width * t) - i : 0;
            e.fillRect(s, 0, i, Math.ceil(this._size.height * t) + 1), e.restore()
        }
        _drawBackLabels(e, t) {
            e.save();
            const i = this.backLabels(),
                s = this.rendererOptions(),
                r = this._isLeft ? "right" : "left";
            for (const n of i) n.isAxisLabelVisible() && (e.save(), n.renderer().draw(e, s, this._widthCache, this._size.width, this._size.height, r, t), e.restore());
            e.restore()
        }
        _hightlightBackground(e, t, i, s) {
            if (!i) return;
            const r = i.firstValue();
            if (null === r) return;
            let n = t[0].price,
                o = t[0].price;
            for (let e = 1; e < t.length; e++) n = Math.min(n, t[e].price), o = Math.max(o, t[e].price);
            const a = this.priceScale(),
                l = Math.floor(a.priceToCoordinate(n, r) * s),
                c = Math.ceil(a.priceToCoordinate(o, r) * s);
            (0, X.fillRect)(e, Math.floor(s), l, Math.ceil((this._size.width - 1) * s) + 1, c - l, this._properties.childs().axisHighlightColor.value())
        }
        _addViewsOrMaxMin(e, t) {
            const i = this._pane.state(),
                s = this.priceScale();
            if (s !== i.defaultPriceScale() && (e = e.filter((e => i.isOverlay(e) || this._isFromSameSide(e.priceScale())))), 0 !== e.length)
                if (1 === e.length) {
                    const r = e[0].priceAxisViews(i, s);
                    r && r.length && t.push(r)
                } else t.push(this._minMaxViews(e))
        }
        _minMaxViews(e) {
            const t = this._pane.state(),
                i = this.priceScale(),
                s = [];
            let r = 1 / 0,
                n = -1 / 0,
                o = null,
                a = null;
            for (const s of e) {
                const e = s.priceAxisViews(t, i);
                if (e && e.length)
                    for (let t = 0; t < e.length; t++) {
                        const i = e[t],
                            s = i.coordinate();
                        s >= n && (n = s, a = i), s <= r && (r = s, o = i)
                    }
            }
            return a && s.push(a), o && s.push(o), s
        }
        _isFromSameSide(e) {
            return null !== e && (this._isLeft ? this._pane.state().leftPriceScales() : this._pane.state().rightPriceScales()).includes(e)
        }
        _sameSideSources() {
            const e = this._pane.state().sourcesByGroup();
            return this._isLeft ? e.leftPriceScalesSources() : e.rightPriceScalesSources()
        }
        _initActions() {
            if (!this._pane.hasState() || null !== this._actions) return;
            const e = this._undoModel,
                t = new P.Action({
                    actionId: "Chart.PriceScale.Reset",
                    label: $e,
                    icon: ze,
                    shortcutHint: (0, Be.humanReadableHash)(Be.Modifiers.Alt + 82),
                    statName: "ResetScale",
                    onExecute: () => this.reset()
                }),
                i = new P.Action({
                    actionId: "Chart.PriceScale.ToggleAutoScale",
                    label: Ye,
                    checkable: !0,
                    checked: !0,
                    statName: "ToggleAutoScale",
                    onExecute: () => {
                        e.togglePriceScaleAutoScaleMode(this.priceScale()), this._updateScalesActions()
                    }
                }),
                s = new P.Action({
                    actionId: "Chart.PriceScale.TogglePercentage",
                    label: Ke,
                    checkable: !0,
                    checked: this.priceScale().isPercentage(),
                    statName: "TogglePercantage",
                    onExecute: () => {
                        e.togglePriceScalePercentageScaleMode(this.priceScale()), this._updateScalesActions()
                    }
                }),
                r = new P.Action({
                    actionId: "Chart.PriceScale.ToggleIndexedTo100",
                    label: Ze,
                    checkable: !0,
                    checked: this.priceScale().isIndexedTo100(),
                    statName: "ToggleIndexedTo100",
                    onExecute: () => {
                        e.togglePriceScaleIndexedTo100ScaleMode(this.priceScale()), this._updateScalesActions()
                    }
                }),
                n = new P.Action({
                    actionId: "Chart.PriceScale.ToggleLogarithmic",
                    label: Xe,
                    checkable: !0,
                    checked: this.priceScale().isLog(),
                    statName: "ToggleLogScale",
                    onExecute: () => {
                        e.togglePriceScaleLogScaleMode(this.priceScale()), this._updateScalesActions()
                    }
                }),
                o = new P.Action({
                    actionId: "Chart.PriceScale.ToggleRegular",
                    label: Je,
                    checkable: !0,
                    checked: this.priceScale().isRegular(),
                    statName: "ToggleRegularScale",
                    onExecute: () => {
                        e.setPriceScaleRegularScaleMode(this.priceScale()), this._updateScalesActions()
                    }
                }),
                a = new P.Action({
                    actionId: "Chart.PriceScale.Labels.ToggleNoOverlappingLabelsVisibility",
                    label: Qe,
                    checkable: !0,
                    checked: this.priceScale().properties().childs().alignLabels.value(),
                    statName: "TogglePreciseLabels"
                });
            a.setBinding(new Re.ActionBinder(a, this.priceScale().properties().childs().alignLabels, e, He));
            const l = new P.Action({
                actionId: "Chart.PriceScale.ToggleInvertScale",
                label: et,
                checkable: !0,
                checked: this.priceScale().isInverted(),
                statName: "Invert Scale",
                onExecute: () => {
                    e.invertPriceScale(this.priceScale()), this._updateScalesActions()
                }
            });
            this._actions = {
                reset: t,
                setAutoScale: i,
                setPercentage: s,
                setIndexedTo100: r,
                setLog: n,
                setRegular: o,
                alignLabels: a,
                invertScale: l
            }, this._updateScalesActions()
        }
        _logAction() {
            return this._isMainSeriesAxis() ? this._chart.actions().logSeriesScale : (0, r.ensureNotNull)(this._actions).setLog
        }
        _percentageAction() {
            return this._isMainSeriesAxis() ? this._chart.actions().percentSeriesScale : (0, r.ensureNotNull)(this._actions).setPercentage
        }
        _indexedTo100Action() {
            return this._isMainSeriesAxis() ? this._chart.actions().indexedTo100SeriesScale : (0, r.ensureNotNull)(this._actions).setIndexedTo100
        }
        _autoScaleAction() {
            return this._isMainSeriesAxis() ? this._chart.actions().autoSeriesScale : (0, r.ensureNotNull)(this._actions).setAutoScale
        }
        _regularScaleAction() {
            return this._isMainSeriesAxis() ? this._chart.actions().regularSeriesScale : (0, r.ensureNotNull)(this._actions).setRegular
        }
        _lockScaleAction() {
            const e = this._chart.actions().lockSeriesScale,
                t = tt(this.priceScale(), this._undoModel.model().mainSeriesScaleRatio());
            return e.update({
                hint: t
            }), e
        }
        _invertAction() {
            return this._isMainSeriesAxis() ? this._chart.actions().invertSeriesScale : (0, r.ensureNotNull)(this._actions).invertScale
        }
        _isMainSeriesAxis() {
            return this.priceScale().hasMainSeries()
        }
        _updateScalesActions() {
            const e = this.priceScale(),
                t = this._isMainSeriesAxis(),
                i = (0, r.ensureNotNull)(e.mainSource()).properties(),
                s = t && e.isLockScale(),
                n = t && 6 === i.style.value(),
                o = (0, r.ensureNotNull)(this._actions);
            o.setRegular.update({
                checked: e.isRegular(),
                disabled: s || n
            }), o.setPercentage.update({
                checked: e.isPercentage(),
                disabled: s || n
            }), o.setIndexedTo100.update({
                checked: e.isIndexedTo100(),
                disabled: s || n
            }), o.setLog.update({
                checked: e.isLog(),
                disabled: s || n
            }), o.setAutoScale.update({
                checked: e.isAutoScale(),
                disabled: e.properties().childs().autoScaleDisabled.value()
            })
        }
        _createMergeScalesAction() {
            const e = this._chart.actions(),
                t = this._undoModel.model().priceScaleSlotsCount();
            if (t.left + t.right === 1) return 0 === t.left ? e.moveScaleToLeft : e.moveScaleToRight;
            const i = [];
            return i.push(e.mergeLeftScalesAction), i.push(e.mergeRightScalesAction), new P.Action({
                actionId: "Chart.PriceScale.MergeAllScales",
                label: Ue,
                subItems: i
            })
        }
        _setCursor(e) {
            let t = "";
            "grabbing" !== e && "ns-resize" !== e || (t = "price-axis--cursor-" + e),
                this._currentCursorClassName !== t && (this._currentCursorClassName && this._cell.classList.remove(this._currentCursorClassName), t && this._cell.classList.add(t), this._currentCursorClassName = t, this._cell.style.cursor)
        }
    }

    function rt(e, t) {
        return e.position - t.position
    }

    function nt(e, t, i) {
        const s = (e.position - t.position) / (e.time - t.time);
        return Math.sign(s) * Math.min(Math.abs(s), i)
    }
    class ot {
        constructor(e, t, i, s) {
            this._position1 = null, this._position2 = null, this._position3 = null, this._position4 = null, this._animationStartPosition = null, this._durationMsecs = 0, this._speedPxPerMsec = 0, this._terminated = !1, this._minSpeed = e, this._maxSpeed = t, this._dumpingCoeff = i, this._minMove = s
        }
        addPosition(e, t) {
            if (null !== this._position1) {
                if (this._position1.time === t) return void(this._position1.position = e);
                if (Math.abs(this._position1.position - e) < this._minMove) return
            }
            this._position4 = this._position3, this._position3 = this._position2, this._position2 = this._position1, this._position1 = {
                time: t,
                position: e
            }
        }
        start(e, t) {
            if (null === this._position1 || null === this._position2) return;
            if (t - this._position1.time > 50) return;
            let i = 0;
            const s = nt(this._position1, this._position2, this._maxSpeed),
                r = rt(this._position1, this._position2),
                n = [s],
                o = [r];
            if (i += r, null !== this._position3) {
                const e = nt(this._position2, this._position3, this._maxSpeed);
                if (Math.sign(e) === Math.sign(s)) {
                    const t = rt(this._position2, this._position3);
                    if (n.push(e), o.push(t), i += t, null !== this._position4) {
                        const e = nt(this._position3, this._position4, this._maxSpeed);
                        if (Math.sign(e) === Math.sign(s)) {
                            const t = rt(this._position3, this._position4);
                            n.push(e), o.push(t), i += t
                        }
                    }
                }
            }
            let a = 0;
            for (let e = 0; e < n.length; ++e) a += o[e] / i * n[e];
            Math.abs(a) < this._minSpeed || (this._animationStartPosition = {
                position: e,
                time: t
            }, this._speedPxPerMsec = a, this._durationMsecs = function(e, t) {
                const i = Math.log(t);
                return Math.log(1 * i / -e) / i
            }(Math.abs(a), this._dumpingCoeff))
        }
        getPosition(e) {
            const t = (0, r.ensureNotNull)(this._animationStartPosition),
                i = e - t.time;
            return t.position + this._speedPxPerMsec * (Math.pow(this._dumpingCoeff, i) - 1) / Math.log(this._dumpingCoeff)
        }
        finished(e) {
            return null === this._animationStartPosition || this._progressDuration(e) === this._durationMsecs
        }
        terminate() {
            this._terminated = !0
        }
        terminated() {
            return this._terminated
        }
        _progressDuration(e) {
            const t = e - (0, r.ensureNotNull)(this._animationStartPosition).time;
            return Math.min(t, this._durationMsecs)
        }
    }
    var at = i(58275),
        lt = i.n(at),
        ct = i(51674),
        ht = i(67521),
        dt = i(80842),
        ut = i(8775),
        pt = i(14787),
        _t = i(66103),
        mt = i(38780);
    async function gt() {
        return (await Promise.all([i.e(5866), i.e(962), i.e(139)]).then(i.bind(i, 81200))).ErrorCardRenderer
    }
    var ft = i(18540),
        vt = i(28571);

    function St(e) {
        return "startMoving" in e && "move" in e && "endMoving" in e && "convertYCoordinateToPriceForMoving" in e
    }
    var yt = i(76544),
        bt = i(28558),
        wt = i(71332);
    i(84516);
    const Pt = parseInt(wt["css-value-pane-controls-padding-left"]),
        Ct = parseInt(wt["css-value-pane-controls-padding-right"]),
        xt = (0, F.getHexColorByName)("color-cold-gray-700"),
        Tt = (0, F.getHexColorByName)("color-cold-gray-400"),
        It = new z.TranslatedString("scroll", o.t(null, void 0, i(68193))),
        Mt = o.t(null, void 0, i(82232));
    o.t(null, void 0, i(98478));

    function At(e, t, i) {
        e.drawBackground && e.drawBackground(t, i)
    }

    function Lt(e, t, i) {
        e.draw(t, i)
    }

    function kt(e, t) {
        return e.paneViews(t)
    }

    function Et(e, t) {
        return e.topPaneViews()
    }

    function Dt(e, t) {
        return e.labelPaneViews(t)
    }

    function Vt(e, t) {
        const i = e.strategyOrdersPaneView();
        return null === i ? null : [i]
    }

    function Bt(e, t) {
        return null === e || e.source !== t ? null : e.hittest.data()
    }

    function Rt(e, t, i, s, r) {
        var n, o;
        const a = null !== (o = null === (n = e.result) || void 0 === n ? void 0 : n.hittest.target()) && void 0 !== o ? o : 0;
        t.target() > a && (e.result = {
            hittest: t,
            source: i,
            renderer: s,
            isCustom: r
        })
    }
    const Nt = {
            contextMenuEnabled: !0,
            contextMenu: Fe.defaultContextMenuOptions,
            priceScaleContextMenuEnabled: !0,
            legendWidgetEnabled: !0,
            controlsEnabled: !0,
            propertyPagesEnabled: !0,
            sourceSelectionEnabled: !0,
            countdownEnabled: !0
        },
        Ot = new Map([
            [j.AreaName.Text, "Text"],
            [j.AreaName.Style, "Style"]
        ]),
        Ft = !Oe.enabled("display_legend_on_all_charts");
    let Wt = null;

    function zt(e, t) {
        return !(0, j.shouldDefaultActionBeExecuted)(e, t, "pressedMouseMoveHandler", "touchMoveHandler")
    }
    class Ht {
        constructor(e, t, i, r) {
            this._legendWidget = null, this._paneControls = null, this._isDestroyed = !1, this._trackCrosshairOnlyAfterLongTap = (0, H.lastMouseOrTouchEventInfo)().isTouch, this._startTrackPoint = null, this._exitTrackingModeOnNextTry = !1, this._startMoveSourceParams = null, this._startChangeLineToolParams = null, this._preventSourceChange = !1, this._clonningAtMoveLineTools = null, this._startCloningPoint = null, this._size = (0, s.size)({
                width: 0,
                height: 0
            }), this._themedTopColor = null, this._initCrossHairPosition = null, this._firstZoomPoint = null, this._editDialog = null, this._processing = !1, this._pressedMoveStage = 0, this._touchMove = !1, this._startTouchPoint = null, this._isSelecting = !1, this._prevHoveredHittest = null, this._contextMenuX = 0, this._contextMenuY = 0, this._startScrollingPos = null, this._isScrolling = !1, this._scrollPriceScale = null, this._scrollXAnimation = null, this._prevPinchScale = 1, this._pinching = !1, this._wasPinched = !1, this._longTap = !1, this._contextMenuOpenedOnLastTap = !1, this._paneControlsResizeObserver = null, this._lastClickedSource = null, this._customLegendWidgetsFactoryMap = new Map, this._prevMoveEventPosition = null, this._onMagnetStateChangedListener = this._onMagnetStateChanged.bind(this), this._onShiftKeyStateChangedListener = this._onShiftKeyStateChanged.bind(this), this._currentCursorClassName = "", this._lastFinishedToolId = null, this._needResetMeasureLater = !1, this._currentChangingLineToolHitTest = null, this._currentMovingHitTest = null, this._prevTooltipData = null, this._errorRenderer = null, this._highlightedPriceAxis = new(lt())({
                owner: "",
                axis: null
            }), this._visuallyCollapsed = new(lt())(!1), this._endOfSeriesDataBanner = null, this._canvasConfiguredHandler = () => this._state && this._chartModel().lightUpdate(), this._updateVisuallyCollapsed = () => {
                this._visuallyCollapsed.setValue(!this.state().maximized().value() && this.state().collapsed().value())
            }, this._chart = e, this._state = t, this._options = (0, y.merge)((0, y.clone)(Nt), i), this._paneWidgetsSharedState = r, this._state && this._subscribeToState();
            const n = {
                contextMenuEnabled: this._options.priceScaleContextMenuEnabled,
                pressedMouseMoveScale: this._options.handleScale.axisPressedMouseMove.price,
                mouseWheelScale: this._options.handleScale.mouseWheel,
                currencyConversionEnabled: this._options.currencyConversionEnabled,
                unitConversionEnabled: this._options.unitConversionEnabled,
                countdownEnabled: this._options.countdownEnabled,
                croppedTickMarks: this._options.croppedTickMarks
            };
            void 0 !== this._options.priceScaleContextMenu && (n.contextMenu = this._options.priceScaleContextMenu);
            const o = (e, t, i, s, r) => new st(this._chart, this, this._chartUndoModel(), i, t, e, n, s, r),
                a = e.properties().childs().scalesProperties,
                l = this._chartModel().rendererOptionsProvider(),
                c = {
                    backgroundBasedTheme: e.backgroundBasedTheme(),
                    rendererOptionsProvider: l,
                    getBackgroundTopColor: () => this._chartModel().backgroundTopColor().value(),
                    getBackgroundBottomColor: () => this._chartModel().backgroundColor().value()
                },
                h = {
                    showLabels: !1
                };
            this._lhsPriceAxisesContainer = new me(a, "left", o, c, h), this._rhsPriceAxisesContainer = new me(a, "right", o, c, h), this._paneCell = document.createElement("td"), this._paneCell.classList.add("chart-markup-table", "pane"), this._div = document.createElement("div"), this._div.classList.add("chart-gui-wrapper"), this._div.setAttribute("data-name", "pane-widget-chart-gui-wrapper"), this._paneCell.appendChild(this._div), this._canvasBinding = (0, X.createBoundCanvas)(this._div, (0, s.size)({
                width: 16,
                height: 16
            })), this._canvasBinding.subscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler);
            const d = this._canvasBinding.canvasElement;
            d.style.position = "absolute", d.style.left = "0", d.style.top = "0", this._topCanvasBinding = (0, X.createBoundCanvas)(this._div, (0, s.size)({
                width: 16,
                height: 16
            })), this._topCanvasBinding.subscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler);
            const u = this._topCanvasBinding.canvasElement;
            u.style.position = "absolute", u.style.left = "0", u.style.top = "0", this._rowElement = document.createElement("tr"), this._rowElement.appendChild(this._lhsPriceAxisesContainer.getElement()), this._rowElement.appendChild(this._paneCell), this._rowElement.appendChild(this._rhsPriceAxisesContainer.getElement()), this._options.legendWidgetEnabled && (this._options.customLegendWidgetFactories && (this._customLegendWidgetsFactoryMap = this._options.customLegendWidgetFactories), this._loadAndCreateLegendWidget()), this._state && !this._chart.readOnly() && this._options.controlsEnabled && this._loadAndCreatePaneControlsWidget(), (0, ft.magnetEnabled)().subscribe(this._onMagnetStateChangedListener), (0, vt.shiftPressed)().subscribe(this._onShiftKeyStateChangedListener), this._paneCell.addEventListener("dragover", (e => {
                e.dataTransfer && Array.from(e.dataTransfer.files).some(blobImageFilter) && e.preventDefault()
            })), this.setCursorForTool(), this._mouseEventHandler = new Z.MouseEventHandler(this._topCanvasBinding.canvasElement, this, {
                treatVertTouchDragAsPageScroll: !this._options.handleScroll.vertTouchDrag,
                treatHorzTouchDragAsPageScroll: !this._options.handleScroll.horzTouchDrag
            }), this._prevHoveredHittest = null, this._highlightedPriceAxis.subscribe((e => this._highlightPriceAxisByLabel(e.axis))), this._prevPinchScale = 0, this._isDestroyed = !1
        }
        destroy() {
            var e;
            this._chart.onPaneWidgetDestroyed(this), this._customLegendWidgetsFactoryMap.clear(), this._topCanvasBinding.unsubscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler), this._topCanvasBinding.dispose(), this._canvasBinding.unsubscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler), this._canvasBinding.dispose(), this._legendWidget && (this._legendWidget.destroy(), this._legendWidget = null), null !== this._paneControlsResizeObserver && this._paneControlsResizeObserver.disconnect(), null !== this._paneControls && (this._paneControls.destroy(), this._paneControls = null), this._lhsPriceAxisesContainer.destroy(), this._rhsPriceAxisesContainer.destroy(), this.hasState() && this._unsubscribeFromState(), (0, ft.magnetEnabled)().unsubscribe(this._onMagnetStateChangedListener), (0, vt.shiftPressed)().unsubscribe(this._onShiftKeyStateChangedListener), this._paneWidgetsSharedState.onPaneDestroyed(this), this._errorRenderer && this._errorRenderer.then((e => {
                e.destroy(), this._errorRenderer = null
            })), this._prevHoveredHittest = null, this._mouseEventHandler.destroy(), null === (e = this._rowElement.parentElement) || void 0 === e || e.removeChild(this._rowElement), this._isDestroyed = !0
        }
        size() {
            return this._size
        }
        setSize(e) {
            (0, s.equalSizes)(this._size, e) || (this._size = e, this._canvasBinding.resizeCanvasElement(e), this._topCanvasBinding.resizeCanvasElement(e), this._paneCell.style.width = e.width + "px", this._paneCell.style.height = e.height + "px", this._div.style.width = e.width + "px", this._div.style.height = e.height + "px", this._rowElement.classList.toggle("js-hidden", 0 === e.height), null !== this._legendWidget && this._legendWidget.updateWidgetModeBySize(e), null !== this._paneControls && this._paneControls.updateWidgetModeByWidth(e.width))
        }
        width() {
            return this._size.width
        }
        height() {
            return this._size.height
        }
        backgroundColor() {
            return this._chartModel().backgroundColor().value()
        }
        highlightedPriceAxis() {
            return this._highlightedPriceAxis
        }
        processDoubleClickOnSource(e, t, i) {
            (0, $.isDataSource)(e) && e.id() !== this._lastFinishedToolId && this._showEditDialogForSource(e, t)
        }
        stretchFactor() {
            return this._state ? this._state.stretchFactor() : 0
        }
        setStretchFactor(e) {
            this.hasState() && this.state().setStretchFactor(e)
        }
        setCursorForTool(e, t, i) {
            if (t && t.mod() && e && e !== this._chartModel().crossHairSource()) return void this._setCursorClassName("pointer");
            if (void 0 !== i) {
                switch (i) {
                    case _t.PaneCursorType.VerticalResize:
                        this._setCursorClassName("ns-resize");
                        break;
                    case _t.PaneCursorType.HorizontalResize:
                        this._setCursorClassName("ew-resize");
                        break;
                    case _t.PaneCursorType.DiagonalNeSwResize:
                        this._setCursorClassName("nesw-resize");
                        break;
                    case _t.PaneCursorType.DiagonalNwSeResize:
                        this._setCursorClassName("nwse-resize");
                        break;
                    case _t.PaneCursorType.Default:
                        this._setCursorClassName("default");
                        break;
                    case _t.PaneCursorType.Pointer:
                        this._setCursorClassName("pointer");
                        break;
                    case _t.PaneCursorType.Grabbing:
                        this._setCursorClassName("grabbing")
                }
                return
            }
            const s = Y.tool.value();
            if ((0, Y.toolIsCursor)(s)) {
                if (null !== this._paneWidgetsSharedState.draggingSource() || this._isScrolling || this._chartUndoModel() && this._chartUndoModel().model().sourcesBeingMoved().length) return void this._setCursorClassName("grabbing");
                if (e && this._options.sourceSelectionEnabled) return void this._setCursorClassName("pointer")
            }
            if ("eraser" === s) return void this._setCursorClassName("eraser");
            if ("zoom" === s) return void this._setCursorClassName("zoom-in");
            const r = Y.cursorTool.value();
            "dot" !== r ? "arrow" !== r ? this._setCursorClassName("") : this._setCursorClassName("default") : this._setCursorClassName("dot")
        }
        showContextMenuForSelection(e, t) {
            const i = this._chartUndoModel().selection();
            if (i.isEmpty()) return;
            const s = i.dataSources().filter((e => e.hasContextMenu()));
            this.showContextMenuForSources(s, e, void 0, t)
        }
        async showContextMenuForSources(e, t, i, s) {
            var r;
            if (!e.length) return Promise.resolve(null);
            const n = e[0],
                o = (0, y.merge)((0, y.clone)(this._options.contextMenu), i || {}),
                a = new Fe.ActionsProvider(this._chart, o);
            if (n === this._chartUndoModel().crossHairSource()) return n.handleContextMenuEvent(t), Promise.resolve(null);
            {
                const i = await a.contextMenuActionsForSources(e, t, null == s ? void 0 : s.origin);
                if (0 === i.length) return Promise.resolve(null);
                {
                    let e;
                    return e = n instanceof yt.Series ? {
                        menuName: "ObjectTreeContextMenu",
                        detail: {
                            type: "series",
                            id: n.instanceId()
                        }
                    } : (0, E.isLineTool)(n) ? {
                        menuName: "ObjectTreeContextMenu",
                        detail: {
                            type: "shape",
                            id: null !== (r = null == n ? void 0 : n.id()) && void 0 !== r ? r : null
                        }
                    } : {
                        menuName: "ObjectTreeContextMenu",
                        detail: {
                            type: "study",
                            id: (null == n ? void 0 : n.id()) || null
                        }
                    }, he.ContextMenuManager.createMenu(i, void 0, e).then((e => (e.show(t), e)))
                }
            }
        }
        leftPriceAxisesContainer() {
            return this._lhsPriceAxisesContainer
        }
        rightPriceAxisesContainer() {
            return this._rhsPriceAxisesContainer
        }
        setPriceAxisSizes(e, t, i) {
            this._priceAxisesContainer(e).setSizes(t, i)
        }
        state() {
            return (0, r.ensureNotNull)(this._state)
        }
        hasState() {
            return null !== this._state
        }
        setState(e) {
            this._state !== e && (this.hasState() && this._unsubscribeFromState(), this._state = e, this.hasState() && (this._subscribeToState(), this.updatePriceAxisWidgetsStates()))
        }
        getScreenshotData(e) {
            var t, i, s, r;
            const n = [],
                o = [];
            let a, l = [];
            const c = this.state().sourcesByGroup().priceSources().slice().reverse(),
                h = this._chart.properties().childs().paneProperties.childs().legendProperties.childs();
            for (const d of c) {
                const c = d.statusView();
                if ((0, V.isStudy)(d) && (h.showLegend.value() || (null == e ? void 0 : e.showCollapsedStudies))) {
                    const s = h.showStudyTitles.value(),
                        r = s;
                    if (d.properties().childs().visible.value() && c && r) {
                        n.push(s ? d.statusProvider(null == e ? void 0 : e.status).text() : "");
                        const r = Oe.enabled("use_last_visible_bar_value_in_legend") && null !== (i = null === (t = this._chartModel().timeScale().visibleBarsStrictRange()) || void 0 === t ? void 0 : t.lastBar()) && void 0 !== i ? i : null,
                            a = d.valuesProvider().getValues(r);
                        o.push(a)
                    }
                } else if (d === this._chartModel().mainSeries() && c && h.showSeriesTitle.value()) {
                    a = d.statusProvider((null == e ? void 0 : e.status) || {}).text();
                    const t = Oe.enabled("use_last_visible_bar_value_in_legend") && null !== (r = null === (s = this._chartModel().timeScale().visibleBarsStrictRange()) || void 0 === s ? void 0 : s.lastBar()) && void 0 !== r ? r : null;
                    l = d.valuesProvider().getValues(t)
                }
            }
            return {
                type: "pane",
                leftAxis: this._lhsPriceAxisesContainer.getScreenshotData(),
                rightAxis: this._rhsPriceAxisesContainer.getScreenshotData(),
                content: this._canvasBinding.canvasElement.toDataURL(),
                canvas: this._canvasBinding.canvasElement,
                contentWidth: this._size.width,
                contentHeight: this._size.height,
                studies: n,
                studiesValues: o,
                containsMainSeries: this.containsMainSeries(),
                mainSeriesText: a,
                mainSeriesValues: l
            }
        }
        updatePriceAxisWidgetsStates() {
            if (!this.hasState()) return;
            const e = this._chartModel(),
                t = e.paneForSource(e.mainSeries());
            if (!t) return;
            const i = e.priceScaleSlotsCount(),
                s = this.state(),
                r = s.visibleLeftPriceScales(),
                n = s.visibleRightPriceScales();
            this._lhsPriceAxisesContainer.setScales(r, i.left, t.leftPriceScales().length, i.left + i.right), this._rhsPriceAxisesContainer.setScales(n, i.right, t.rightPriceScales().length, i.left + i.right)
        }
        updatePriceAxisWidgets() {
            this._lhsPriceAxisesContainer.update(), this._rhsPriceAxisesContainer.update()
        }
        update() {
            this.hasState() && (this.updatePriceAxisWidgets(), null !== this._legendWidget && this._legendWidget.update(), this.updateControls())
        }
        updateStatusWidget(e) {
            this.hasState() && null !== this._legendWidget && (e.legendWidgetLayoutInvalidated() ? this._legendWidget.updateLayout() : this._legendWidget.update())
        }
        updateControls() {
            this.hasState() && null !== this._paneControls && this._paneControls.update()
        }
        updateThemedColors(e) {
            this._themedTopColor = e.topColor, this._updateByThemedColors()
        }
        statusWidget() {
            return this._legendWidget
        }
        getElement() {
            return this._rowElement
        }
        canvasElement() {
            return this._canvasBinding.canvasElement
        }
        hasCanvas(e) {
            return this._canvasBinding.canvasElement === e || this._topCanvasBinding.canvasElement === e
        }
        pinchStartEvent() {
            null === this._paneWidgetsSharedState.scrollingPane() && null === this._paneWidgetsSharedState.pinchingPane() && (this._onTouchEvent(), this._options.handleScale.pinch && (this._chartModel().stopTimeScaleAnimation(), this._prevPinchScale = 1, this._pinching = !0, this._wasPinched = !0, this._paneWidgetsSharedState.setPinchingPane(this)))
        }
        pinchEvent(e, t, i, s) {
            if (null !== this._paneWidgetsSharedState.scrollingPane() || this._paneWidgetsSharedState.pinchingPane() !== this) return;
            if (this._onTouchEvent(), !this._options.handleScale.pinch) return;
            const r = 10 * (s - this._prevPinchScale);
            this._prevPinchScale = s, this._chartModel().zoomTime(e.x, r, !0), this._prevPinchScale = s
        }
        pinchEndEvent() {
            null === this._paneWidgetsSharedState.scrollingPane() && this._paneWidgetsSharedState.pinchingPane() === this && (this._onTouchEvent(), this._pinching = !1, this._paneWidgetsSharedState.setPinchingPane(null))
        }
        mouseClickEvent(e) {
            this._onMouseEvent(), this._mouseClickOrTapEvent(e)
        }
        tapEvent(e) {
            this._preventTouchEventsExceptPinch() || (this._onTouchEvent(), this._mouseClickOrTapEvent(e))
        }
        mouseDownEvent(e) {
            this._onMouseEvent(), this.hasState() && this._mouseDownOrTouchStartEvent(e, this._dataSourceAtPoint(e.localX, e.localY))
        }
        touchStartEvent(e) {
            if (this._paneWidgetsSharedState.startTouch(this), this._preventTouchEventsExceptPinch()) return;
            const t = !this._trackCrosshairOnlyAfterLongTap && null !== Wt && Wt.stateId === this.state().id() && Math.abs(Wt.x - e.localX) + Math.abs(Wt.y - e.localY) < 5;
            this._onTouchEvent(), this._chart.setActivePaneWidget(this);
            const i = this._dataSourceAtPoint(e.localX, e.localY);
            if (t) {
                const t = this._chartModel().crossHairSource();
                null !== i && i.source === t || t.selectPointMode().value() !== Y.SelectPointMode.None ? this.startTrackingMode(new O.Point(e.localX, e.localY), new O.Point(e.localX, e.localY)) : !this._chart.readOnly() && null !== i && (0, E.isLineTool)(i.source) && i.source.userEditEnabled() && this._chartUndoModel().selectionMacro((e => {
                    e.clearSelection(), e.addSourceToSelection(i.source, i.hittest.data())
                }))
            }
            this._mouseDownOrTouchStartEvent(e, i), this._mouseOrTouchMoveEvent(e)
        }
        mouseUpEvent(e) {
            this._onMouseEvent(), this._mouseUpOrTouchEndEvent(e)
        }
        touchEndEvent(e) {
            this._paneWidgetsSharedState.endTouch(this), this._preventTouchEventsExceptPinch() || (this._onTouchEvent(), this._mouseOrTouchLeaveEvent(e), this._mouseUpOrTouchEndEvent(e))
        }
        mouseMoveEvent(e) {
            this._onMouseEvent(), this._mouseOrTouchMoveEvent(e)
        }
        pressedMouseMoveEvent(e) {
            this._onMouseEvent(), this._pressedMouseOrTouchMoveEvent(e)
        }
        touchMoveEvent(e) {
            this._preventTouchEventsExceptPinch() || (this._onTouchEvent(), this._pressedMouseOrTouchMoveEvent(e))
        }
        mouseLeaveEvent(e) {
            this._onMouseEvent(), this._mouseOrTouchLeaveEvent(e)
        }
        mouseDoubleClickEvent(e) {
            this._onMouseEvent(), this._mouseDoubleClickOrDoubleTapEvent(e)
        }
        wheelClickEvent(e) {
            if (this._chart.readOnly()) return;
            const t = this._dataSourceAtPoint(e.localX, e.localY);
            if (null === t || t.isCustom) return;
            if ((t.hittest.target() || 0) <= j.HitTarget.MovePointBackground) return;
            const i = new q.EnvironmentState(e),
                s = t.hittest.eraseMarker();
            if (i.mod() && void 0 !== s && t.source.processErase) return void t.source.processErase(this._chartUndoModel(), s);
            const n = this._chartUndoModel();
            n.selection().isSelected(t.source) || n.selectionMacro((e => {
                e.clearSelection();
                const i = (0, r.ensureNotNull)(t.source);
                e.addSourceToSelection(i, Bt(t, i))
            })), this._chart.removeSelectedSources()
        }
        doubleTapEvent(e) {
            this._preventTouchEventsExceptPinch() || (this._onTouchEvent(), this._mouseDoubleClickOrDoubleTapEvent(e))
        }
        longTapEvent(e) {
            if (null === this._state || this._preventTouchEventsExceptPinch()) return;
            if (this._onTouchEvent(), this._longTap = !0, null !== this._startTrackPoint || !this._trackingModeShouldBeActive()) return;
            const t = this._chartModel().selection();
            if (!t.isEmpty()) {
                const i = this._dataSourceAtPoint(e.localX, e.localY);
                if (null !== i && t.isSelected(i.source)) return
            }
            this.startTrackingMode(new O.Point(e.localX, e.localY), new O.Point(e.localX, e.localY), new q.EnvironmentState(e))
        }
        mouseEnterEvent(e) {
            this._onMouseEvent(), this.hasState() && (this._chart.setActivePaneWidget(this), this._setCursorPosition(e.localX, e.localY, new q.EnvironmentState(e)))
        }
        contextMenuEvent(e) {
            this._onMouseEvent(), this._contextMenuEvent(e)
        }
        touchContextMenuEvent(e) {
            this._preventTouchEventsExceptPinch() || (this._onTouchEvent(), this._contextMenuEvent(e))
        }
        mouseDownOutsideEvent(e) {
            this._processOutsideClick(null, e)
        }
        touchStartOutsideEvent(e) {
            this._processOutsideClick(null, e)
        }
        cancelZoom() {
            this._chartModel().crossHairSource().clearSelection(), this._firstZoomPoint = null, this._preventCrossHairMove() && this._clearCursorPosition()
        }
        startTrackingMode(e, t, i) {
            this._startChangeLineToolParams = null, this._startMoveSourceParams = null, this._currentChangingLineToolHitTest = null, this._currentMovingHitTest = null, this._chartUndoModel().selectionMacro((e => e.clearSelection())), this._startTrackPoint = e, this._exitTrackingModeOnNextTry = !1, this._setCursorPosition(t.x, t.y, i), this._initCrossHairPosition = this._chartModel().crossHairSource().currentPoint()
        }
        setDragToAnotherPaneCursor() {
            this._setCursorClassName("grabbing")
        }
        cloneLineTools(e, t) {
            return this._chartUndoModel().cloneLineTools(e, t)
        }
        exitTrackingMode() {
            null !== this._state && null !== this._startTrackPoint && (this._exitTrackingModeOnNextTry = !0, this._tryExitTrackingMode())
        }
        trackingModeEnabled() {
            return null !== this._state && null !== this._startTrackPoint
        }
        addCustomWidgetToLegend(e, t) {
            this._options.legendWidgetEnabled && (this._customLegendWidgetsFactoryMap.set(e, t), null !== this._legendWidget && this._legendWidget.addCustomWidgetToLegend(e, t))
        }
        containsMainSeries() {
            return !!this.hasState() && this.state().containsMainSeries()
        }
        paint(e) {
            if (!this._chartUndoModel() || !this.hasState() || 0 === this._size.width || 0 === this._size.height) return;
            this._canvasBinding.applySuggestedBitmapSize(), this._topCanvasBinding.applySuggestedBitmapSize(), this._state && (e.priceScaleSideMaxLevel("left") > R.InvalidationLevel.Cursor || e.priceScaleSideMaxLevel("right") > R.InvalidationLevel.Cursor) && (this._recalculatePriceScales((0, bt.viewportChangeEvent)()), null !== Wt && Wt.stateId === this.state().id() && this._setCursorPosition(Wt.x, Wt.y, Wt.envState));
            const t = e.fullInvalidation();
            if (t > R.InvalidationLevel.Cursor && null !== Wt && Wt.stateId === this.state().id()) {
                const e = this._dataSourceAtPoint(Wt.x, Wt.y);
                this._updateHoveredSource(e, (0, vt.globalEnvironmentState)())
            }
            if (this._lhsPriceAxisesContainer.paint(e.getterForPriceScaleInvalidationLevelBySide("left")), this._rhsPriceAxisesContainer.paint(e.getterForPriceScaleInvalidationLevelBySide("right")), t === R.InvalidationLevel.None) return;
            const i = this._state && (this._state.maximized().value() || !this._state.collapsed().value());
            if (t > R.InvalidationLevel.Cursor) {
                const e = (0, r.ensureNotNull)(this._canvasBinding.canvasElement.getContext("2d"));
                e.setTransform(1, 0, 0, 1, 0, 0), this._makeSureIsUpdated();
                const t = this._canvasRenderParams();
                this._drawBackground(e, t), i && this._drawSources(e, t)
            }
            if (null !== this._state) {
                const e = (0, r.ensureNotNull)(this._topCanvasBinding.canvasElement.getContext("2d"));
                e.setTransform(1, 0, 0, 1, 0, 0);
                const t = this._topCanvasRenderParams();
                e.clearRect(0, 0, Math.ceil(this._size.width * t.pixelRatio), Math.ceil(this._size.height * t.pixelRatio)), i && this._drawSeriesTopViews(e, t), this._drawCrossHair(e, t), i && this._drawActiveLineTools(e, t)
            }
        }
        cancelCreatingLineTool() {
            const e = this._chartUndoModel(),
                t = this._chartUndoModel().lineBeingCreated();
            if (t)
                if (t.pointsCount() <= 0 && !(0, D.isLineDrawnWithPressedButton)(t.toolname)) {
                    const i = t.points();
                    if (i.length > 2) {
                        const s = i[i.length - 2];
                        e.continueCreatingLine(s), this._finishTool(t)
                    } else e.cancelCreatingLine()
                } else e.cancelCreatingLine();
            null !== this._firstZoomPoint && this.cancelZoom(), this.setCursorForTool()
        }
        drawRightThere(e) {
            if ((0, D.isLineToolName)(e) && this.hasState()) {
                const t = this._chartUndoModel(),
                    i = t.crossHairSource(),
                    s = t.model().magnet().align(i.price, i.index, this.state());
                t.createLineTool({
                    pane: this.state(),
                    point: {
                        index: i.index,
                        price: s
                    },
                    linetool: e
                })
            }
        }
        cancelMeasuring() {
            this._chartUndoModel().crossHairSource().clearMeasure(), (0, Y.resetToCursor)(), this.setCursorForTool()
        }
        async setErrorMessage(e) {
            var t, i, s;
            e && !this._errorRenderer && (this._errorRenderer = this._createErrorBlock()), null === (t = await this._errorRenderer) || void 0 === t || t.update({
                message: null == e ? void 0 : e.message,
                icon: (null === (i = this._state) || void 0 === i ? void 0 : i.containsMainSeries()) || (null === (s = this._state) || void 0 === s ? void 0 : s.maximized().value()) ? null == e ? void 0 : e.icon : void 0,
                backgroundColor: `linear-gradient(${this._chartModel().backgroundTopColor().value()}, ${this._chartModel().backgroundColor().value()})`,
                textColor: this._chartModel().dark().value() ? Tt : xt,
                solutionId: null == e ? void 0 : e.solutionId
            })
        }
        collapsedHeight() {
            var e, t;
            return Math.max(Math.ceil(null !== (t = null === (e = this._paneControls) || void 0 === e ? void 0 : e.bottomWithMargin()) && void 0 !== t ? t : 0), 33)
        }
        _topCanvasRenderParams() {
            return {
                pixelRatio: (0, X.getBindingPixelRatio)(this._topCanvasBinding),
                physicalWidth: this._topCanvasBinding.canvasElement.width,
                physicalHeight: this._topCanvasBinding.canvasElement.height,
                cssWidth: this._chartModel().timeScale().width(),
                cssHeight: this.height()
            }
        }
        _canvasRenderParams() {
            return {
                pixelRatio: (0, X.getBindingPixelRatio)(this._canvasBinding),
                physicalWidth: this._canvasBinding.canvasElement.width,
                physicalHeight: this._canvasBinding.canvasElement.height,
                cssWidth: this._chartModel().timeScale().width(),
                cssHeight: this.height()
            }
        }
        _tryExitTrackingMode(e) {
            this._exitTrackingModeOnNextTry && (this._startTrackPoint = null, e || this._clearCursorPosition())
        }
        _tryStartMeasure(e, t, i, s, r) {
            return !(!(0, Y.toolIsMeasure)(Y.tool.value()) || t.startMeasurePoint()) && (e.isTouch || this._preventCrossHairMove() || this._setCursorPosition(e.localX, e.localY, i), s = this._chartModel().magnet().align(s, r, this.state()), t.startMeasuring({
                price: s,
                index: r
            }, this.state()), !0)
        }
        _tryFinishMeasure(e, t) {
            if (t.startMeasurePoint() && !t.endMeasurePoint()) {
                let i = t.price;
                const s = t.index;
                return i = this._chartModel().magnet().align(i, s, this.state()), t.finishMeasure({
                    price: i,
                    index: s
                }), e.isTouch ? (0, Y.resetToCursor)() : this._needResetMeasureLater = !0, this._preventCrossHairMove() && this._clearCursorPosition(), !0
            }
            return !1
        }
        _tryStartZoom(e, t, i, s) {
            const r = this._chart.model().model().zoomEnabled();
            if ("zoom" === Y.tool.value() && r) {
                const r = this._chartUndoModel(),
                    n = r.timeScale().indexToCoordinate(i) - .5 * r.timeScale().barSpacing();
                return this._firstZoomPoint = {
                    price: t,
                    index: i,
                    x: n,
                    y: e.localY
                }, this._preventCrossHairMove() || this._setCursorPosition(e.localX, e.localY, s), this._chartModel().crossHairSource().startSelection(this.state()), !0
            }
            return !1
        }
        _finishZoom(e) {
            const t = this.state(),
                i = t.defaultPriceScale(),
                s = (0, r.ensureNotNull)(t.mainDataSource()).firstValue(),
                n = i.coordinateToPrice(e.localY, (0, r.ensureNotNull)(s)),
                o = this._chartUndoModel(),
                a = Math.round(o.timeScale().coordinateToIndex(e.localX)),
                l = (0, r.ensureNotNull)(this._firstZoomPoint);
            a !== l.index && o.zoomToViewport(l.index, a, l.price, n, t), this._chartModel().crossHairSource().clearSelection(), this._firstZoomPoint = null, (0, Y.resetToCursor)(), this._preventCrossHairMove() && this._clearCursorPosition()
        }
        _tryFinishZoom(e) {
            return null !== this._firstZoomPoint && (this._finishZoom(e), !0)
        }
        _tryHandleEraserMouseDown(e, t) {
            if (!("eraser" !== Y.tool.value() || e.isCustom || (i = e.source, i && i.customization && i.customization.disableErasing))) {
                const i = this._chartUndoModel();
                if ((0, E.isLineTool)(e.source) || (0, V.isStudy)(e.source)) {
                    const s = e.hittest.eraseMarker();
                    return t.mod() && void 0 !== s && e.source.processErase ? e.source.processErase(i, s) : i.removeSource(e.source, !1), !0
                }
            }
            var i;
            return !1
        }
        _tryStartChangingLineTool(e, t, i, s) {
            var n, o, a;
            if (e.isTouch && null !== this._startTrackPoint) return !1;
            const l = t.hittest;
            if ((!e.isTouch || !this._preventSourceChange) && l && (0, E.isLineTool)(t.source) && l.target() === j.HitTarget.ChangePoint) {
                const c = this._chartUndoModel(),
                    h = (0, r.ensure)(null === (n = this.state().mainDataSource()) || void 0 === n ? void 0 : n.firstValue()),
                    d = (0, r.ensureNotNull)(t.source.priceScale()).coordinateToPrice(e.localY, h);
                c.selectionMacro((e => {
                    e.clearSelection(), e.addSourceToSelection(t.source, l.data())
                }));
                let u = d;
                t.source.priceScale() === c.mainSeries().priceScale() && (u = c.model().magnet().align(d, s, this.state()));
                const p = null === (o = l.data()) || void 0 === o ? void 0 : o.nonDiscreteIndex;
                p && (s = c.timeScale().coordinateToFloatIndex(e.localX));
                const _ = null === (a = l.data()) || void 0 === a ? void 0 : a.pointIndex;
                return this._startChangeLineToolParams = {
                    source: t.source,
                    startPoint: {
                        index: s,
                        price: u,
                        nonDiscreteIndex: p
                    },
                    screenPoint: {
                        x: e.localX,
                        y: e.localY
                    },
                    pointIndex: _,
                    envState: i
                }, !0
            }
            return this._startChangeLineToolParams = null, !1
        }
        _tryStartCloning(e, t, i, s) {
            if (i.mod()) {
                const t = this._chartUndoModel().selection().dataSources().filter((e => e.cloneable()));
                if (s && s.cloneable() && t.push(s), t.length > 0) return this._clonningAtMoveLineTools = t.map((e => e.id())), this._startCloningPoint = new O.Point(e.localX, e.localY), !0
            }
            return !1
        }
        _tryFinishClonning(e, t, i) {
            const s = this._chartUndoModel(),
                n = this._chartModel();
            if (t.mod() && this._clonningAtMoveLineTools) {
                const o = new O.Point(e.localX, e.localY),
                    a = (0, r.ensureNotNull)(this._startCloningPoint).subtract(o).length(),
                    l = [];
                for (const e of this._clonningAtMoveLineTools) {
                    const t = n.dataSourceForId(e);
                    null !== t && l.push(t)
                }
                if (0 === l.length) return !1;
                if (a > 8) {
                    const n = this.cloneLineTools(l, !0).map((e => (0, r.ensureNotNull)(s.model().dataSourceForId(e))));
                    s.selectionMacro((e => {
                        e.clearSelection();
                        let t = null;
                        n.forEach((s => {
                            null === t && (t = Bt(i, s)), e.addSourceToSelection(s, t)
                        }))
                    }));
                    const o = new O.Point(e.localX, e.localY),
                        a = (0, r.ensureNotNull)(n[0].priceScale()),
                        c = (0, r.ensureNotNull)(this.state().mainDataSource()).firstValue(),
                        h = {
                            index: s.timeScale().coordinateToIndex(e.localX),
                            price: a.coordinateToPrice(e.localY, (0, r.ensureNotNull)(c))
                        };
                    s.startMovingSources(n, {
                        logical: h,
                        screen: o
                    }, null, t), this._clonningAtMoveLineTools = null, this._startCloningPoint = null
                }
                return !0
            }
            return !1
        }
        _mouseDownEventForLineTool(e, t, i, s) {
            var n, o;
            const a = Y.tool.value();
            if (!this.hasState() || (0, D.isLineToolDrawWithoutPoints)(a)) return;
            const l = this._chartUndoModel();
            let c = !1,
                h = null;
            (0, Y.hideAllDrawings)().value() && (0, W.toggleHideMode)(), (0, Y.lockDrawings)().setValue(!1), e.isTouch && !e.stylus && ((0, D.isLineToolName)(a) && !(0, D.isLineDrawnWithPressedButton)(a) || l.lineBeingCreated()) && this._initToolCreationModeParams(e);
            const d = l.lineBeingCreated();
            if (d && !(0, D.isLineDrawnWithPressedButton)(d.toolname)) {
                const a = (0, r.ensure)(null === (n = d.ownerSource()) || void 0 === n ? void 0 : n.firstValue());
                if (e.isTouch && !e.stylus) {
                    if (!this._startTouchPoint) {
                        this._startTouchPoint = new O.Point(e.pageX, e.pageY);
                        const t = d.points(),
                            i = t[t.length - 1],
                            s = l.timeScale().indexToCoordinate(i.index),
                            n = (0, r.ensureNotNull)(d.priceScale()).priceToCoordinate(i.price, a);
                        return void(this._initCrossHairPosition = new O.Point(s, n))
                    }
                } else if (!e.isTouch) {
                    h = d;
                    const n = l.model().paneForSource(d);
                    if (n !== this._state && null !== n) {
                        const i = this._externalPaneXCoord(n, e.localX),
                            s = this._externalPaneYCoord(n, e.localY);
                        c = l.continueCreatingLine({
                            index: Math.round(l.timeScale().coordinateToIndex(i)),
                            price: (0, r.ensure)(null === (o = d.priceScale()) || void 0 === o ? void 0 : o.coordinateToPrice(s, a))
                        }, t)
                    } else {
                        const e = l.model().magnet().align(s, i, this.state());
                        c = l.continueCreatingLine({
                            index: i,
                            price: e
                        }, t)
                    }
                }
            } else if (!e.isTouch || e.stylus || (0, D.isLineDrawnWithPressedButton)(a)) {
                const e = {
                    index: i,
                    price: l.model().magnet().align(s, i, this.state())
                };
                h = l.createLineTool({
                    pane: this.state(),
                    point: e,
                    linetool: a
                }), l.lineBeingCreated() || (c = !0)
            }
            const u = this._dataSourceAtPoint(e.localX, e.localY);
            h && l.selectionMacro((e => {
                e.addSourceToSelection((0, r.ensureNotNull)(h), null == u ? void 0 : u.hittest.data())
            })), c && h && (this._finishTool(h, u), e.preventDefault())
        }
        _handleSelectionMouseDownAndGetJustDeselectedSource(e, t, i) {
            const s = this._chartUndoModel();
            let r = null;
            return (null === t || t.source.isSelectionEnabled()) && s.selectionMacro((s => {
                !this._preventSourceChange && null !== t && (e.isTouch ? t.hittest.target() >= j.HitTarget.MovePointBackground : t.hittest.target() > j.HitTarget.MovePointBackground) ? (i.mod() || s.selection().isSelected(t.source) || s.clearSelection(), i.mod() && s.selection().isSelected(t.source) ? (r = t.source, s.removeSourceFromSelection(t.source)) : s.addSourceToSelection(t.source, t.hittest.data()), s.selection().allSources().length > 1 && (0, fe.trackEvent)("GUI", "Multiselect", "Click Select")) : i.mod() || s.clearSelection()
            })), r
        }
        _processMouseMoveWhileZoom(e, t) {
            this._preventCrossHairMove() || this._setCursorPosition(e.localX, e.localY, t)
        }
        _updateCommonTooltip(e, t) {
            let i = null;
            if (null !== e && null !== e.hittest) {
                const t = e.hittest.data();
                t && (i = t.tooltip || null)
            }
            if (null === this._prevTooltipData && null === i) return;
            if (null === i || "" === i.text) return this._prevTooltipData = null, void(0, mt.hide)(t);
            if (this._prevTooltipData && (0, N.default)(i, this._prevTooltipData)) return;
            this._prevTooltipData = i;
            const s = (0, y.clone)(i);
            if (void 0 !== s.rect) {
                const e = this._paneCell.getBoundingClientRect();
                s.rect.x += e.left, s.rect.y += e.top
            }(0, mt.show)(s)
        }
        _setCursorPositionOnExternalPane(e, t, i, s) {
            t = this._externalPaneXCoord(e, t), i = this._externalPaneYCoord(e, i);
            this._chart.paneByState(e)._setCursorPosition(t, i, s)
        }
        _setCursorPosition(e, t, i) {
            this._updateLastCrosshairPosition(e, t, i), this._chartModel().setAndSaveCurrentPosition(this._correctXCoord(e), this._correctYCoord(t), this.state(), i)
        }
        _updateLastCrosshairPosition(e, t, i) {
            const s = this.state().id();
            Wt = {
                x: e,
                y: t,
                envState: i,
                stateId: s
            }
        }
        _setCursorClassName(e) {
            let t = "";
            e && (t = "pane--cursor-" + e), this._currentCursorClassName !== t && (this._currentCursorClassName && this._paneCell.classList.remove(this._currentCursorClassName), t && this._paneCell.classList.add(t), this._currentCursorClassName = t, this._paneCell.style.cursor)
        }
        _processMouseUpOrTouchEndHandler(e) {
            const t = this._dataSourceAtPoint(e.localX, e.localY);
            null !== t && t.hittest.tryCallMouseUpOrTouchEndHandler(e)
        }
        _crossHairShouldBeVisible() {
            const e = this._chartModel().crossHairSource();
            return (0, D.isLineToolName)(Y.tool.value()) || (0, Y.toolIsMeasure)(Y.tool.value()) || e.startMeasurePoint() && !e.endMeasurePoint() || null !== this._firstZoomPoint || null !== this._chartModel().lineBeingEdited() || null !== this._chartModel().lineBeingCreated()
        }
        _clearCursorPosition() {
            Wt = null, this._chartModel().clearCurrentPosition()
        }
        _dataSourceAtPoint(e, t) {
            if (!this.hasState()) return null;
            const i = {
                    result: null
                },
                s = this._chartUndoModel();
            if ((0, D.isLineToolName)(Y.tool.value()) || null !== s.lineBeingCreated()) return i.result;
            if (this._currentChangingLineToolHitTest) return this._currentChangingLineToolHitTest;
            if (this._currentMovingHitTest) return this._currentMovingHitTest;
            const r = this.state(),
                n = r.height(),
                o = r.width();
            this._makeSureIsUpdated();
            const a = Rt.bind(null, i),
                l = this._canvasRenderParams(),
                c = new O.Point(e, t);
            if (!this.state().maximized().value() && this.state().collapsed().value() || (0, H.lastMouseOrTouchEventInfo)().isTouch && (Y.activePointSelectionMode.value() !== Y.SelectPointMode.None || null !== this._startTrackPoint)) return this._hitTestSources(l, [s.crossHairSource()], c, a, !1), i.result;
            const h = r.sourcesByGroup(),
                d = s.selection();
            this._hitTestSources(l, d.dataSources(), c, a, !1), this._hitTestSources(l, d.customSources(), c, a, !0);
            const u = new Set(d.allSources().map((e => e.id())));
            this._hitTestSources(l, [s.crossHairSource()], c, a, !1, u), this._hitTestSources(l, r.customSources(G.CustomSourceLayer.Topmost), c, a, !0, u), this._hitTestSources(l, h.tradingSources(), c, a, !1, u), this._hitTestSources(l, r.customSources(G.CustomSourceLayer.Foreground), c, a, !0, u);
            const p = [...this._chartModel().multiPaneSources(r), ...h.hitTestSources()];
            if (this._hitTestSources(l, p, c, a, !1, u), this.containsMainSeries()) {
                const e = s.activeStrategySource().value();
                if (null !== e) {
                    const t = e.strategyOrdersPaneView();
                    if (null !== t) {
                        const s = t.renderer(n, o);
                        if (null !== s) {
                            const t = s.hitTest(c, l);
                            t && Rt(i, t, e, s, !1)
                        }
                    }
                }
            }
            return null === i.result && this._hitTestSources(l, r.customSources(G.CustomSourceLayer.Background), c, a, !0, u), i.result
        }
        _hitTestSources(e, t, i, s, n, o) {
            const a = (0,
                    r.ensureNotNull)(this._state),
                l = a.height(),
                c = a.width();
            for (let r = t.length - 1; r >= 0; --r) {
                const h = t[r];
                if (void 0 !== o && o.has(h.id())) continue;
                const d = h.paneViews(a);
                if (null !== d && 0 !== d.length)
                    for (let t = d.length - 1; t >= 0; --t) {
                        const r = d[t].renderer(l, c);
                        if (r && r.hitTest) {
                            const t = r.hitTest(i, e);
                            null !== t && s(t, h, r, n)
                        }
                    }
            }
        }
        _tryStartMovingLineTool(e, t, i, s) {
            var n;
            if (null === t.source || !t.source.movable() || null !== this._startTrackPoint) return !1;
            if (!this._preventSourceChange) {
                const o = this._chartUndoModel(),
                    a = (0, r.ensureNotNull)((0, r.ensureNotNull)(this._state).mainDataSource()).firstValue(),
                    l = (0, r.ensureNotNull)(t.source.priceScale()).coordinateToPrice(e.localY, (0, r.ensureNotNull)(a));
                let c = (t.source.isSelectionEnabled() ? o.selection().allSources() : [t.source]).filter(St);
                const h = c.filter(E.isLineTool);
                c = h.length > 0 ? h : c.includes(t.source) ? [t.source] : [c[0]];
                const d = new O.Point(e.localX, e.localY),
                    u = {
                        index: s,
                        price: l
                    },
                    p = null === (n = t.hittest.data()) || void 0 === n ? void 0 : n.activeItem;
                return this._startMoveSourceParams = {
                    source: c,
                    startPoint: {
                        logical: u,
                        screen: d
                    },
                    activeItem: void 0 === p ? null : p,
                    envState: i
                }, !0
            }
            return this._startMoveSourceParams = null, !1
        }
        _chartModel() {
            return this._chart.model().model()
        }
        _chartUndoModel() {
            return this._chart.model()
        }
        _externalPaneXCoord(e, t) {
            t += this._div.getBoundingClientRect().left + document.body.scrollLeft;
            const i = (0, r.ensureNotNull)(this._chart.paneByState(e)),
                s = i._div.getBoundingClientRect().left + document.body.scrollLeft;
            return i._correctXCoord(t - s)
        }
        _externalPaneYCoord(e, t) {
            t += this._div.getBoundingClientRect().top + document.body.scrollTop;
            const i = (0, r.ensureNotNull)(this._chart.paneByState(e)),
                s = i._div.getBoundingClientRect().top + document.body.scrollTop;
            return i._correctYCoord(t - s)
        }
        _correctXCoord(e) {
            return Math.max(0, Math.min(e, this._size.width - 1))
        }
        _correctYCoord(e) {
            return Math.max(0, Math.min(e, this._size.height - 1))
        }
        _processScroll(e) {
            if (!this._chart.model().model().scrollEnabled()) return;
            const t = performance.now();
            this._startScrollingPos || this._preventScroll() || (this._startScrollingPos = {
                x: e.clientX,
                y: e.clientY,
                timestamp: t,
                localX: e.localX,
                localY: e.localY
            });
            const i = this._chartUndoModel(),
                s = this._chartModel().timeScale();
            let r = this.state().defaultPriceScale();
            if (this._startScrollingPos && !this._isScrolling && (this._startScrollingPos.x !== e.clientX || this._startScrollingPos.y !== e.clientY)) {
                if (i.beginUndoMacro(It, !0), null === this._scrollXAnimation && this._options.useKineticScroll) {
                    const e = s.barSpacing();
                    this._scrollXAnimation = new ot(.2 / e, 7 / e, .997, 15 / e), this._scrollXAnimation.addPosition(s.rightOffset(), this._startScrollingPos.timestamp)
                }
                return i.selection().isEmpty() || (r = i.selection().allSources()[0].priceScale()), null === r || r.isEmpty() || (this._scrollPriceScale = r, i.startScrollPrice(this.state(), r, e.localY)), i.startScrollTime(e.localX), this._isScrolling = !0, this.setCursorForTool(), void this._paneWidgetsSharedState.setScrollingPane(this)
            }
            this._isScrolling && (null !== this._scrollPriceScale && i.scrollPriceTo(this.state(), this._scrollPriceScale, e.localY), i.scrollTimeTo(e.localX),
                null !== this._scrollXAnimation && this._scrollXAnimation.addPosition(s.rightOffset(), t))
        }
        _finishScroll() {
            const e = this._chartUndoModel();
            e.endScrollTime(), null !== this._scrollPriceScale && e.endScrollPrice(this.state(), this._scrollPriceScale), e.endUndoMacro(), this._isScrolling = !1, this._startScrollingPos = null, this._scrollPriceScale = null, this.setCursorForTool(), this._paneWidgetsSharedState.setScrollingPane(null)
        }
        _endScroll(e) {
            if (!this._isScrolling) return !1;
            this._finishScroll();
            const t = this._scrollUndoCommandInStack(),
                i = performance.now(),
                s = this._chartUndoModel().timeScale();
            return null !== this._scrollXAnimation && (this._scrollXAnimation.start(s.rightOffset(), i), this._scrollXAnimation.finished(i) || (this._chartModel().setTimeScaleAnimation(this._scrollXAnimation), this._scrollXAnimation = null)), t
        }
        _preventScroll() {
            return this._trackCrosshairOnlyAfterLongTap && this._longTap || this._contextMenuOpenedOnLastTap || (0, D.isLineToolName)(Y.tool.value()) || Boolean(this._chartUndoModel().lineBeingCreated()) || null !== this._startTrackPoint
        }
        _isSelectPointModeEnabled() {
            return this._chartUndoModel().crossHairSource().selectPointMode().value() !== Y.SelectPointMode.None
        }
        _preventCrossHairMove() {
            return !!this._trackCrosshairOnlyAfterLongTap && (null === this._chart.trackingModePaneWidget() && (!!this._contextMenuOpenedOnLastTap || !this._crossHairShouldBeVisible() && null === this._startTrackPoint))
        }
        _finishTool(e, t = null) {
            const i = this._chartUndoModel(),
                s = e.toolname;
            if (s === Y.tool.value() && (0, Y.resetToCursor)(), this._preventCrossHairMove() && this._clearCursorPosition(), i.selectionMacro((i => {
                    i.addSourceToSelection(e, Bt(t, e))
                })), (0, D.isTextToolName)(s)) {
                const t = i.createUndoCheckpoint();
                this._chart.showChartPropertiesForSource(e, pt.TabNames.text, void 0, t).then((e => {
                    0
                }))
            }
            this._lastFinishedToolId = e.id(), (0, u.emit)("drawing_event", e.id(), "create"), (0, ut.trackDrawingCreated)(e)
        }
        _alignSourcesThatBeingMoved(e, t, i, s) {
            const r = this._chartUndoModel(),
                n = r.timeScale().coordinateToIndex(t);
            r.model().sourcesBeingMoved().forEach((e => {
                var o;
                let a = n,
                    l = e.convertYCoordinateToPriceForMoving(i, this.state().mainDataSource());
                if (null !== l) {
                    if ((0, V.isStudy)(e)) {
                        const e = r.mainSeries(),
                            t = e.bars().firstIndex(),
                            i = e.bars().lastIndex();
                        null !== t && null !== i && (a = Math.min(Math.max(n, t), i)), l = this._chartModel().magnet().align(l, n, this.state())
                    }
                    null !== this._currentMovingHitTest && void 0 !== (null === (o = this._currentMovingHitTest.hittest.data()) || void 0 === o ? void 0 : o.cursorType) || this.setCursorForTool(), r.moveSources({
                        screen: new O.Point(t, i),
                        logical: {
                            index: a,
                            price: l
                        }
                    }, s)
                }
            }))
        }
        _resetMeasureIfRequired() {
            this._needResetMeasureLater && ((0, Y.resetToCursor)(), this._needResetMeasureLater = !1)
        }
        _makeSureIsUpdated() {
            var e;
            const t = this.state(),
                i = [...t.dataSources(), ...t.customSources()],
                s = t.height(),
                r = t.width();
            for (const n of i) {
                const i = n.paneViews(t);
                if (null !== i)
                    for (const t of i) null === (e = t.makeSureIsUpdated) || void 0 === e || e.call(t, s, r)
            }
        }
        _drawBackground(e, t) {
            const i = Math.ceil(t.pixelRatio * this._size.width),
                s = Math.ceil(t.pixelRatio * this._size.height),
                r = this._chartModel(),
                n = r.backgroundTopColor().value(),
                o = r.backgroundColor().value();
            n === o ? (0, X.clearRect)(e, 0, 0, i + 1, s + 1, o) : (0, J.clearRectWithGradient)(e, 0, 0, i + 1, s + 1, n, o)
        }
        _drawWatermark(e, t) {
            const i = this._chartModel().watermarkSource();
            if (null === i) return;
            const s = this.state();
            if (!s.containsMainSeries()) return;
            const r = i.paneViews(),
                n = s.height(),
                o = s.width();
            for (const i of r) {
                e.save();
                const s = i.renderer(n, o);
                s && s.draw(e, t), e.restore()
            }
        }
        _drawCrossHair(e, t) {
            const i = this._chartUndoModel().crossHairSource();
            i.invalidateLockPosition(), i.visible || null === Y.crosshairLock.value() || i.updateAllViews((0, bt.sourceChangeEvent)(i.id())), this._drawSourceImpl(e, t, kt, Lt, i)
        }
        _drawActiveLineTools(e, t) {
            const i = this._chartModel(),
                s = [i.lineBeingCreated(), i.lineBeingEdited(), ...i.sourcesBeingMoved(), i.customSourceBeingMoved()].filter((e => !!e));
            for (const r of s) {
                (i.paneForSource(r) === this.state() || (0, $.isDataSource)(r) && r.isMultiPaneEnabled()) && this._drawSourceImpl(e, t, kt, Lt, r)
            }
        }
        _drawSeriesTopViews(e, t) {
            this.state().containsMainSeries() && this._drawSourceImpl(e, t, Et, Lt, this._chartUndoModel().mainSeries())
        }
        _drawSources(e, t) {
            const i = this.state(),
                s = i.model(),
                r = i.sourcesByGroup(),
                n = r.tradingSources(),
                o = [...s.multiPaneSources(i), ...r.generalSources()],
                a = r.phantomSources(),
                l = i.customSources(G.CustomSourceLayer.Background).slice(),
                c = i.customSources(G.CustomSourceLayer.Foreground).slice(),
                h = i.customSources(G.CustomSourceLayer.Topmost).slice();
            {
                const e = s.panes();
                for (let t = e.length - 1; t >= 0; t--) e[t].createDrawingsCaches()
            }
            this._drawSourceImpl(e, t, kt, Lt, s.gridSource()), this._drawWatermark(e, t);
            for (const i of l) this._drawSourceImpl(e, t, kt, At, i);
            for (const i of o) this._drawSourceImpl(e, t, kt, At, i);
            for (const i of c) this._drawSourceImpl(e, t, kt, At, i);
            for (const i of a) this._drawSourceImpl(e, t, kt, At, i);
            const d = new Set;
            [s.lineBeingCreated(), s.lineBeingEdited(), ...s.sourcesBeingMoved(), s.customSourceBeingMoved()].filter(y.notNull).forEach((e => d.add(e.id())));
            let u = s.hoveredSource();
            null !== u && ((0, $.isDataSource)(u) && !u.showOnTopOnHovering() || d.has(u.id()) || (0, $.isDataSource)(u) && !o.includes(u) ? u = null : d.add(u.id()));
            const p = s.selection().allSources().filter((e => !((0, $.isDataSource)(e) && !o.includes(e)) && !d.has(e.id())));
            p.forEach((e => d.add(e.id())));
            {
                for (const i of l) this._drawSourceImpl(e, t, kt, Lt, i, d);
                for (const i of o) this._drawSourceImpl(e, t, kt, Lt, i, d);
                for (const i of c) this._drawSourceImpl(e, t, kt, Lt, i, d);
                const i = s.activeStrategySource().value();
                i && this.containsMainSeries() && this._drawSourceImpl(e, t, Vt, Lt, i)
            }
            for (const i of n) this._drawSourceImpl(e, t, kt, At, i);
            for (const i of h) this._drawSourceImpl(e, t, kt, At, i);
            for (const i of o) this._drawSourceImpl(e, t, Dt, Lt, i, d);
            for (const i of c) this._drawSourceImpl(e, t, Dt, Lt, i, d);
            for (const i of n) this._drawSourceImpl(e, t, kt, Lt, i, d);
            for (const i of h) this._drawSourceImpl(e, t, kt, Lt, i, d);
            for (const i of p) this._drawSourceImpl(e, t, kt, Lt, i);
            for (const i of p) this._drawSourceImpl(e, t, Dt, Lt, i);
            u && (this._drawSourceImpl(e, t, kt, Lt, u), this._drawSourceImpl(e, t, Dt, Lt, u));
            for (const i of a) this._drawSourceImpl(e, t, kt, Lt, i, d);
            {
                const e = s.panes();
                for (let t = e.length - 1; t >= 0; t--) e[t].clearDrawingCaches()
            }
        }
        _drawSourceImpl(e, t, i, s, r, n) {
            if (n && n.has(r.id())) return;
            const o = this.state(),
                a = o.height(),
                l = o.width(),
                c = i(r, this.state());
            if (c)
                for (const i of c) {
                    const r = i.renderer(a, l);
                    r && (e.save(), s(r, e, t), e.restore())
                }
        }
        _updateByThemedColors() {
            null !== this._legendWidget && this._legendWidget.updateThemedColors(this._themedTopColor), null !== this._paneControls && this._paneControls.updateThemedColors(this._themedTopColor)
        }
        _scrollUndoCommandInStack() {
            const e = this._chartUndoModel().undoHistory().undoStack();
            if (e.isEmpty()) return !1;
            const t = e.head();
            if (!(t instanceof K.UndoMacroCommand)) return !1;
            if (t.isEmpty()) return !1;
            const i = t.commands()[0];
            return i instanceof ht.PriceScaleChangeUndoCommand || i instanceof ct.TimeScaleChangeUndoCommand
        }
        _onStateDestroyed() {
            this.setState(null)
        }
        _onDataSourcesCollectionChanged() {
            this._startMoveSourceParams = null
        }
        _processMouseEnterLeaveMoveHandlers(e, t) {
            var i, s, r, n;
            null === this._prevHoveredHittest || this._prevHoveredHittest.renderer === (null == e ? void 0 : e.renderer) && (null === (i = this._prevHoveredHittest.hittest.data()) || void 0 === i ? void 0 : i.activeItem) === (null === (s = e.hittest.data()) || void 0 === s ? void 0 : s.activeItem) || ((0, j.tryCallHandler)(t, null === (r = this._prevHoveredHittest.hittest.data()) || void 0 === r ? void 0 : r.mouseLeaveHandler), this._prevHoveredHittest = null), t.isTouch || null !== e && ((null === (n = this._prevHoveredHittest) || void 0 === n ? void 0 : n.renderer) !== e.renderer && (e.hittest.tryCallMouseEnterHandler(t), this._prevHoveredHittest = e), e.hittest.tryCallMouseMoveHandler(t))
        }
        _startChangeOrMoveLineToolIfNeeded() {
            if (null !== this._startChangeLineToolParams) {
                const e = this._startChangeLineToolParams;
                this._chartUndoModel().startChangingLinetool(e.source, e.startPoint, e.pointIndex, e.envState)
            }
            if (null !== this._startMoveSourceParams) {
                const e = this._startMoveSourceParams;
                this._chartUndoModel().startMovingSources(e.source, e.startPoint, e.activeItem, e.envState)
            }
            this._startMoveSourceParams = null, this._startChangeLineToolParams = null
        }
        _trackingModeShouldBeActive() {
            return !(!this._trackCrosshairOnlyAfterLongTap || this._contextMenuOpenedOnLastTap || this._crossHairShouldBeVisible()) && this._longTap
        }
        _processOutsideClick(e, t) {
            var i;
            let s = null;
            const r = this._chartModel();
            if (null !== e && (s = e.isCustom ? r.customSourceName(e.source) : e.source.id()), null !== this._lastClickedSource && this._lastClickedSource.id !== s) {
                const e = this._lastClickedSource.id;
                let i = this._lastClickedSource.isCustom ? r.customSourceForName(e) : r.dataSourceForId(e);
                null !== i || this._lastClickedSource.isCustom || (i = r.dataSourceForId(e)), null !== i && i.onClickOutside && (i.onClickOutside(t), this._chartModel().updateSource(i))
            }
            this._lastClickedSource = null !== s ? {
                id: s,
                isCustom: null !== (i = null == e ? void 0 : e.isCustom) && void 0 !== i && i
            } : null
        }
        _mouseClickOrTapEvent(e) {
            var t;
            if (!this.hasState()) return;
            const i = this._dataSourceAtPoint(e.localX, e.localY),
                s = i && i.source,
                n = this._chartUndoModel(),
                o = Boolean(null === (t = null == i ? void 0 : i.hittest.data()) || void 0 === t ? void 0 : t.hideCrosshairLinesOnHover);
            this._processOutsideClick(i, e),
                !this._isSelectPointModeEnabled() || o || e.isTouch && this.trackingModeEnabled() && !this._exitTrackingModeOnNextTry || n.crossHairSource().trySelectCurrentPoint(), null !== i && i.hittest.tryCallClickOrTapHandler(e) && n.model().updateSource((0, r.ensureNotNull)(s)), !e.isTouch || this._isSelectPointModeEnabled() || i && i.source === n.crossHairSource() || this._tryExitTrackingMode(), s && (0, E.isLineTool)(s) && this._lastFinishedToolId !== s.id() && (0, u.emit)("drawing_event", s.id(), "click"), this._resetMeasureIfRequired()
        }
        _mouseDownOrTouchStartEvent(e, t) {
            var i, s, n, o, a;
            if (this._pressedMoveStage = 1, e.isTouch && (this._longTap = !1, this._exitTrackingModeOnNextTry = null !== this._startTrackPoint, this._paneWidgetsSharedState.clearDraggingSource()), this._contextMenuOpenedOnLastTap = !1, this._lastFinishedToolId = null, this._chartModel().stopTimeScaleAnimation(), e.isTouch && this._switchTrackingModeFromAnotherPaneIfNeeded(e), document.activeElement !== document.body && document.activeElement !== document.documentElement) document.activeElement && document.activeElement.blur ? document.activeElement.blur() : document.body.focus();
            else {
                const e = document.getSelection();
                null !== e && e.removeAllRanges()
            }(0, u.emit)("mouse_down", {
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                screenX: e.screenX,
                screenY: e.screenY
            }), this._updateCommonTooltip(null);
            const l = this._chartUndoModel(),
                c = new q.EnvironmentState(e);
            l.mainSeries().clearGotoDateResult();
            const h = this.state().defaultPriceScale();
            if (h.isEmpty() || l.timeScale().isEmpty()) return;
            const d = l.crossHairSource();
            if (!e.isTouch && !(0, D.isLineDrawnWithPressedButton)(Y.tool.value())) {
                const t = l.lineBeingCreated(),
                    i = null !== t ? l.model().paneForSource(t) : null;
                null !== i && i !== this._state ? this._setCursorPositionOnExternalPane(i, e.localX, e.localY, c) : this._setCursorPosition(e.localX, e.localY, c)
            }
            e.isTouch && (0, D.isLineToolName)(Y.tool.value()) && ((0, D.isLineDrawnWithPressedButton)(Y.tool.value()) || null !== d.pane ? (0, D.isLineDrawnWithPressedButton)(Y.tool.value()) && this._clearCursorPosition() : this._chart.updateCrossHairPositionIfNeeded());
            const p = (0, r.ensureNotNull)(this.state().mainDataSource()).firstValue();
            if (null === p) return void(this._chart.readOnly() || (this._handleSelectionMouseDownAndGetJustDeselectedSource(e, t, c), null !== t && (0, dt.isPriceDataSource)(t.source) && t.source.isDraggable() && this._paneWidgetsSharedState.trySetDraggingSource(t.source, this)));
            let _ = h.coordinateToPrice(e.localY, p),
                m = this._chartModel().timeScale().coordinateToIndex(e.localX);
            if (d.startMeasurePoint() && d.endMeasurePoint() && d.clearMeasure(), c.shift() && (null === t || !(null === (s = null === (i = t.hittest.data()) || void 0 === i ? void 0 : i.hasOwnShortcutsBehaviourFor) || void 0 === s ? void 0 : s.shiftKey)) && (0, Y.toolIsCursor)(Y.tool.value()) && l.selection().isEmpty() && Y.tool.setValue("measure"), (e.isTouch && !e.stylus || !this._tryStartMeasure(e, d, c, _, m)) && (e.isTouch && !e.stylus || !this._tryFinishMeasure(e, d)) && !this._tryFinishZoom(e) && !this._tryStartZoom(e, _, m, c)) {
                if (e.isTouch && (null !== this._startTrackPoint ? (this._initCrossHairPosition = d.currentPoint(),
                        this._startTrackPoint = new O.Point(e.localX, e.localY)) : this._isSelectPointModeEnabled() && null === this._chart.trackingModePaneWidget() && this.startTrackingMode(new O.Point(e.localX, e.localY), new O.Point(e.localX, e.localY), new q.EnvironmentState(e))), e.isTouch && (this._preventSourceChange = null === t || !l.selection().isSelected(t.source)), !this._isSelectPointModeEnabled() && !this._isScrolling) {
                    if (e.isTouch && !e.stylus && ((0, Y.toolIsMeasure)(Y.tool.value()) || null !== d.measurePane().value())) return void this._initToolCreationModeParams(e);
                    if ((0, D.isLineToolName)(Y.tool.value()) || l.lineBeingCreated()) return c.shift() || l.selectionMacro((e => e.clearSelection())), void this._mouseDownEventForLineTool(e, c, m, _)
                }
                if (null !== t && t.hittest.tryCallMouseDownOrTouchStartHandler(e), !this._chart.readOnly()) {
                    const i = this._handleSelectionMouseDownAndGetJustDeselectedSource(e, t, c);
                    if (null !== t && !this._preventSourceChange) {
                        const i = t.hittest.data();
                        if (t.isCustom) {
                            if (t.hittest.hasPressedMoveHandler(e)) return l.model().setMovingCustomSource(t.source, i), this._currentMovingHitTest = t, void l.selectionMacro((e => {
                                e.clearSelection(), e.addSourceToSelection((0, r.ensureNotNull)(t.source), (0, r.ensureNotNull)(i))
                            }))
                        } else if ((null == i ? void 0 : i.areaName) === j.AreaName.SourceItemMove) {
                            const s = null == i ? void 0 : i.activeItem;
                            if (void 0 !== s) return l.startCustomMoving(t.source, s, e), this._currentMovingHitTest = t, void l.selectionMacro((e => {
                                e.clearSelection(), e.addSourceToSelection((0, r.ensureNotNull)(t.source), (0, r.ensureNotNull)(i))
                            }))
                        }
                    }
                    if (null !== t && this._tryHandleEraserMouseDown(t, c)) return;
                    const s = null !== t && (0, E.isLineTool)(t.source) && t.source.isLocked && t.source.isLocked();
                    if (!((0, Y.lockDrawings)().value() || s) && null !== t && !t.isCustom) {
                        if (!t.source.userEditEnabled()) return;
                        const s = null === (n = t.hittest.data()) || void 0 === n ? void 0 : n.snappingPrice,
                            l = null === (o = t.hittest.data()) || void 0 === o ? void 0 : o.snappingIndex;
                        let h = e.localY,
                            d = e.localX;
                        if (void 0 !== s && (h = (0, r.ensure)(null === (a = t.source) || void 0 === a ? void 0 : a.priceScale()).priceToCoordinate(s, p), _ = s), void 0 !== l && (d = this._chartModel().timeScale().indexToCoordinate(l), m = l), h === e.localY && d === e.localX || (e = {
                                ...e,
                                localY: h,
                                localX: d
                            }, this._setCursorPosition(e.localX, e.localY, c)), this._tryStartChangingLineTool(e, t, c, m)) return void(this._currentChangingLineToolHitTest = t);
                        if (this._currentChangingLineToolHitTest = null, (g = t.hittest.target()) === j.HitTarget.MovePoint || g === j.HitTarget.MovePointBackground && (0, H.lastMouseOrTouchEventInfo)().isTouch) {
                            if (this._tryStartCloning(e, t, c, i)) return;
                            if (this._tryStartMovingLineTool(e, t, c, m)) return void(this._currentMovingHitTest = t);
                            this._currentMovingHitTest = null
                        }
                    }
                    if (null !== t && (0, dt.isPriceDataSource)(t.source) && t.source.isDraggable() && this._paneWidgetsSharedState.trySetDraggingSource(t.source, this)) return
                }
                var g;
                null !== t && t.hittest.target() === j.HitTarget.Regular || (this._processing = !0)
            }
        }
        _mouseUpOrTouchEndEvent(e) {
            var t, i;
            if (!this.hasState()) return;
            this._pressedMoveStage = 0;
            const s = e.isTouch && null !== this._startTrackPoint,
                n = e.isTouch && this._wasPinched;
            e.isTouch && (this._wasPinched = !1, this._longTap = !1),
                this._startMoveSourceParams = null, this._startChangeLineToolParams = null, this._currentChangingLineToolHitTest = null, this._currentMovingHitTest = null;
            const o = this._chartUndoModel(),
                a = o.model().customSourceMovingHitTestData();
            null !== a || o.customMoveBeingProcessed() || this._processMouseUpOrTouchEndHandler(e), this._isSelecting = !1;
            const l = o.model(),
                c = l.crossHairSource(),
                h = this._dataSourceAtPoint(e.localX, e.localY);
            if (c.selection() && null === this._firstZoomPoint) {
                const e = this.state().lineToolsForArea(c.selection());
                o.selectionMacro((t => {
                    let i = null;
                    e.forEach((e => {
                        null === i && (i = Bt(h, e)), t.addSourceToSelection(e, i)
                    }))
                })), c.clearSelection(), (0, fe.trackEvent)("GUI", "Multiselect", "Area Select")
            }(0, u.emit)("mouse_up", {
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                screenX: e.screenX,
                screenY: e.screenY
            });
            const d = e.isTouch && this._touchMove;
            e.isTouch && (this._touchMove = !1);
            const p = new q.EnvironmentState(e),
                _ = Y.tool.value();
            if (e.isTouch && ((0, Y.toolIsMeasure)(_) || null !== c.measurePane().value())) {
                if (!d && !e.stylus && null === c.measurePane().value() && c.pane !== this._state) return void this._setCursorPosition(e.localX, e.localY);
                if (!d && !e.stylus && this._tryStartMeasure(e, c, p, c.price, c.index)) return;
                if ((!d || e.stylus) && this._tryFinishMeasure(e, c)) return
            }
            if (e.isTouch && !d && !(0, D.isLineDrawnWithPressedButton)(_) && (0, D.isLineToolName)(_) && !o.lineBeingCreated()) {
                if (this._chart.justActivated()) return;
                if (c.pane !== this._state) return void this._setCursorPosition(e.localX, e.localY, p);
                const i = c.currentPoint(),
                    s = this.state().defaultPriceScale(),
                    n = (0, r.ensure)(null === (t = this.state().mainDataSource()) || void 0 === t ? void 0 : t.firstValue()),
                    a = {
                        index: Math.round(o.timeScale().coordinateToIndex(i.x)),
                        price: s.coordinateToPrice(i.y, n)
                    },
                    l = (0, r.ensureNotNull)(o.createLineTool({
                        pane: this.state(),
                        point: a,
                        linetool: _
                    }));
                return o.selectionMacro((e => {
                    e.addSourceToSelection(l)
                })), o.lineBeingCreated() || (this._finishTool(l, h), e.preventDefault()), void(this._startTouchPoint = null)
            }
            const m = o.lineBeingCreated();
            if (m && !(0, D.isLineDrawnWithPressedButton)(m.toolname) && e.isTouch && (this._startTouchPoint || e.stylus)) {
                if (this._startTouchPoint = null, !d || e.stylus) {
                    const t = m.points()[m.points().length - 1],
                        i = o.continueCreatingLine({
                            index: t.index,
                            price: t.price
                        }, new q.EnvironmentState(e));
                    this._initCrossHairPosition = null, i && (this._finishTool(m, h), e.preventDefault())
                }
                return
            }
            if (null !== this._firstZoomPoint && this._firstZoomPoint.draggingMode) return void this._finishZoom(e);
            if (this._processing = !1, o.customMoveBeingProcessed()) return void o.endCustomMoving();
            if (null !== a && (a.beingMoved && ((0, j.tryCallHandler)(e, a.mouseUpHandler, a.touchEndHandler), this.setCursorForTool()), l.setMovingCustomSource(null, null), zt(e, a))) return;
            if (l.lineBeingEdited()) return o.endChangingLinetool(!1), void(this._preventCrossHairMove() && this._clearCursorPosition());
            if ((0, D.isLineDrawnWithPressedButton)(_) && !this._isSelectPointModeEnabled()) {
                const t = o.lineBeingCreated();
                null !== t && ((0, ut.trackDrawingCreated)(t), t.finish());
                const s = this.state().defaultPriceScale();
                if (s.isEmpty()) return;
                if (!t) return;
                const n = (0,
                        r.ensure)(null === (i = t.ownerSource()) || void 0 === i ? void 0 : i.firstValue()),
                    a = s.coordinateToPrice(e.localY, n),
                    l = {
                        index: Math.round(o.timeScale().coordinateToIndex(e.localX)),
                        price: a
                    };
                return void o.continueCreatingLine(l)
            }
            if (l.sourcesBeingMoved().length) return o.endMovingSource(!1, !1), l.sourcesBeingMoved().filter(E.isLineTool).forEach((e => {
                this.setCursorForTool(e)
            })), void l.invalidate(R.InvalidationMask.cursor());
            if (!this._chart.readOnly()) {
                const t = e.localX >= 0 && e.localX < this._size.width;
                if ((!h || h.source !== c) && t) {
                    const t = o.timeScale().coordinateToIndex(e.localX);
                    l.onSyncScrollNeeded(t)
                }
            }
            const g = this._isScrolling,
                f = this._endScroll(e),
                v = this._paneWidgetsSharedState.draggingSource();
            if (null !== v) {
                const t = e.target,
                    i = this._chart.paneByCanvas(t);
                i && i !== this && (f && o.undoHistory().undo(), o.mergeToPane(v, i.state()));
                if (this._chart.timeAxisByCanvas(t))
                    if (l.isUnmergeAvailableForSource(v)) f && o.undoHistory().undo(), o.unmergeToNewBottomPane(v);
                    else {
                        const e = l.panes(),
                            t = (0, r.ensureNotNull)(l.paneForSource(v)),
                            i = e.indexOf(t);
                        i !== e.length - 1 && (f && o.undoHistory().undo(), t.maximized().value() && this._chart.toggleMaximizePane(null), o.movePane(i, e.length - 1))
                    } this._paneWidgetsSharedState.clearDraggingSource();
                const s = this._chart.getTimeScale();
                s && s.restoreDefaultCursor();
                const n = this._chart.paneWidgets();
                for (let e = 0; e < n.length; e++) {
                    const t = n[e];
                    t === this && h && !h.isCustom ? t.setCursorForTool(h.source || void 0) : t.setCursorForTool(), t.leftPriceAxisesContainer().restoreDefaultCursor(), t.rightPriceAxisesContainer().restoreDefaultCursor()
                }
            }
            this._chart.readOnly() || s || p.mod() || g || n || null !== this._lastFinishedToolId || null !== h && (h.hittest.target() > j.HitTarget.MovePointBackground || (0, H.lastMouseOrTouchEventInfo)().isTouch) && o.selectionMacro((e => {
                e.clearSelection();
                const t = (0, r.ensureNotNull)(h.source);
                e.addSourceToSelection(t, Bt(h, t))
            })), e.isTouch && (this._touchMove = !1)
        }
        _mouseOrTouchMoveEvent(e) {
            if (!this.hasState()) return;
            this._resetMeasureIfRequired();
            const t = this._dataSourceAtPoint(e.localX, e.localY);
            this._processMouseEnterLeaveMoveHandlers(t, e);
            const i = this._chartUndoModel();
            if (!i) return;
            const s = e.localX,
                r = e.localY;
            this._prevMoveEventPosition = new O.Point(s, r);
            const n = new q.EnvironmentState(e);
            if (null === this._firstZoomPoint) {
                if (this._updateHoveredSource(t, n, e), !e.isTouch && i.lineBeingCreated()) {
                    const e = i.lineBeingCreated(),
                        t = null === e ? null : i.model().paneForSource(e);
                    if (null !== t && t !== this._state) return void this._setCursorPositionOnExternalPane(t, s, r, n)
                }
                e.isTouch || this._setCursorPosition(s, r, n)
            } else this._processMouseMoveWhileZoom(e, n)
        }
        _pressedMouseOrTouchMoveEvent(e) {
            var t;
            if (!this.hasState() || this._pinching || e.isTouch && this._contextMenuOpenedOnLastTap) return;
            this._pressedMoveStage = 2, this._resetMeasureIfRequired(), this._startChangeOrMoveLineToolIfNeeded(), e.isTouch && (this._touchMove = !0, this._preventSourceChange = !1);
            const i = new q.EnvironmentState(e),
                s = this._chartUndoModel(),
                n = s.crossHairSource(),
                o = e.localX,
                a = e.localY;
            if (this._prevMoveEventPosition = new O.Point(o, a), null !== this._firstZoomPoint) return this._processMouseMoveWhileZoom(e),
                void(this._firstZoomPoint.draggingMode = !0);
            const l = Y.tool.value();
            if (e.isTouch && this._startTouchPoint && (0, D.isLineToolName)(l) && !(0, D.isLineDrawnWithPressedButton)(l) && !s.lineBeingCreated() && !this._isSelectPointModeEnabled()) return void this._updateCrosshairPositionInToolCreationMode(e, this.state());
            const c = n.measurePane().value();
            if (e.isTouch && (this._startTouchPoint || e.stylus) && ((0, Y.toolIsMeasure)(l) || null !== c)) return void(e.stylus ? this._setCursorPosition(e.localX, e.localY, new q.EnvironmentState(e)) : this._updateCrosshairPositionInToolCreationMode(e, c || this.state()));
            const h = s.lineBeingCreated();
            if (e.isTouch && !e.stylus && h && !(0, D.isLineDrawnWithPressedButton)(h.toolname)) {
                if (this._startTouchPoint) {
                    const t = (0, r.ensureNotNull)(s.lineBeingCreated()),
                        i = (0, r.ensureNotNull)(s.model().paneForSource(t));
                    this._updateCrosshairPositionInToolCreationMode(e, i)
                }
                return
            }
            if (e.isTouch && null !== this._startTrackPoint) {
                this._exitTrackingModeOnNextTry = !1;
                const e = (0, r.ensureNotNull)(this._initCrossHairPosition),
                    t = new O.Point(o, a).subtract(this._startTrackPoint),
                    s = e.add(t);
                this._setCursorPosition(s.x, s.y, i)
            } else e.isTouch && this._preventCrossHairMove() || this._setCursorPosition(o, a, i);
            const d = this._isSelectPointModeEnabled();
            if ((0, D.isLineToolName)(l) && !(0, D.isLineDrawnWithPressedButton)(l) && !d && !i.mod()) return;
            if ((0, D.isLineDrawnWithPressedButton)(l) && !d) {
                const i = this.state().defaultPriceScale();
                if (i.isEmpty()) return;
                const n = s.lineBeingCreated();
                if (!n) return;
                const o = new O.Point(e.localX, e.localY),
                    a = (0, r.ensure)(null === (t = n.ownerSource()) || void 0 === t ? void 0 : t.firstValue());
                return o.price = i.coordinateToPrice(e.localY, a), o.index = Math.round(s.timeScale().coordinateToIndex(e.localX)), void s.continueCreatingLine(o)
            }
            if (null !== this._paneWidgetsSharedState.draggingSource()) {
                const t = e.target,
                    i = this._chart.paneByCanvas(t);
                i && (i !== this ? i.setDragToAnotherPaneCursor() : i.setCursorForTool());
                const s = this._chart.timeAxisByCanvas(t);
                s && s.setCursor("grabbing")
            }
            if (s.timeScale().isEmpty()) return;
            const u = this._options.handleScroll;
            if ((!u.pressedMouseMove || e.isTouch) && (!u.horzTouchDrag && !u.vertTouchDrag || !e.isTouch)) return;
            if (s.customMoveBeingProcessed()) return void s.processCustomMove(e);
            const p = s.model().customSourceMovingHitTestData();
            if (null !== p && (this._updateCommonTooltip(null, !0), s.model().processingCustomSourceMove(), (0, j.tryCallHandler)(e, p.pressedMouseMoveHandler, p.touchMoveHandler), zt(e, p))) return;
            if (s.model().lineBeingEdited()) return void this._setCursorPosition(o, a, i);
            if (s.model().sourcesBeingMoved().length) return void this._alignSourcesThatBeingMoved(s.model().sourcesBeingMoved(), e.localX, e.localY, i);
            const _ = this._dataSourceAtPoint(e.localX, e.localY);
            if (this._tryFinishClonning(e, new q.EnvironmentState(e), _)) return;
            const m = (0, Y.toolIsMeasure)(l) || n.startMeasurePoint() && n.endMeasurePoint();
            this._chart.readOnly() || !i.mod() || (0, D.isLineToolName)(l) || m || d ? (this._processScroll(e),
                this._preventScroll() && !this._preventCrossHairMove() && null === this._startTrackPoint && this._setCursorPosition(e.localX, e.localY, new q.EnvironmentState(e))) : this._isSelecting || (n.startSelection(this.state()), this._isSelecting = !0)
        }
        _mouseOrTouchLeaveEvent(e) {
            var t;
            if (!this.hasState()) return;
            const i = this._chartUndoModel();
            if (!i) return;
            const s = i.crossHairSource();
            e.isTouch || null !== s.measurePane().value() && null === s.endMeasurePoint() || this._clearCursorPosition(), i.model().setHoveredSource(null, null), null !== this._prevHoveredHittest && ((0, j.tryCallHandler)(e, null === (t = this._prevHoveredHittest.hittest.data()) || void 0 === t ? void 0 : t.mouseLeaveHandler), this._prevHoveredHittest = null), this._updateCommonTooltip(null), this._chart.unsetActivePaneWidget()
        }
        _mouseDoubleClickOrDoubleTapEvent(e) {
            if (!this.hasState()) return;
            const t = !this._chart.readOnly() && !(0, D.isLineToolName)(Y.tool.value()) && this._dataSourceAtPoint(e.localX, e.localY) || null;
            if (null !== t && t.isCustom) t.hittest.tryCallDblClickOrDblTapHandler(e);
            else if (null !== t && (e.isTouch || t.hittest.target() > j.HitTarget.MovePointBackground)) this.processDoubleClickOnSource(t.source, t.hittest ? t.hittest : void 0);
            else if (!this._chart.readOnly() && !(0, D.isLineToolName)(Y.tool.value()) && !this._chartUndoModel().lineBeingCreated() && this._chartUndoModel().selection().isEmpty()) {
                const t = this.state();
                new q.EnvironmentState(e).mod() && !t.maximized().value() ? (t.collapsed().value() || this._chartModel().paneCollapsingAvailable().value()) && this._chart.toggleCollapsedPane(this) : this._chart.toggleMaximizePane(this)
            }
        }
        _contextMenuEvent(e) {
            const t = this._chartUndoModel();
            if (t.crossHairSource().startMeasurePoint() && !this._trackCrosshairOnlyAfterLongTap) return t.crossHairSource().clearMeasure(), void(0, Y.resetToCursor)(!0);
            if (this._pinching) return;
            if (null === this._firstZoomPoint || this._trackCrosshairOnlyAfterLongTap || this.cancelZoom(), !(0, Y.toolIsCursor)(Y.tool.value()) || this._isSelectPointModeEnabled()) {
                if (e.isTouch) return;
                return (0, Y.resetToCursor)(!0), this.setCursorForTool(), void(t.lineBeingCreated() && t.cancelCreatingLine())
            }
            if (!this._options.contextMenuEnabled) return;
            const i = this._dataSourceAtPoint(e.localX, e.localY),
                s = i ? i.source : null;
            if (e.isTouch && null !== this._startTrackPoint) {
                if (this._preventSourceChange) return;
                this._clearCursorPosition()
            }
            e.isTouch && (this._contextMenuOpenedOnLastTap = !0, this._startTrackPoint = null), this._contextMenuX = e.localX, this._contextMenuY = e.localY;
            const r = i && i.hittest ? i.hittest.target() : 0,
                n = r >= j.HitTarget.Regular || r >= j.HitTarget.MovePointBackground && e.isTouch;
            this._chart.updateActions(), t.selectionMacro((t => {
                null !== s && n ? t.selection().isSelected(s) || (t.clearSelection(), t.addSourceToSelection(s, Bt(i, s))) : (this._options.contextMenu.general && this._showContextMenu(e), t.clearSelection())
            })), null !== i && n && null !== s && ((0, $.isDataSource)(s) && s.hasContextMenu() ? s.isSelectionEnabled() ? this.showContextMenuForSelection(e) : this.showContextMenuForSources([s], e) : i.hittest.tryCallContextMenuHandler(e))
        }
        _onMouseEvent() {
            this._preventSourceChange = !1, this._startTrackPoint = null, this._trackCrosshairOnlyAfterLongTap = !1
        }
        _onTouchEvent() {
            this._trackCrosshairOnlyAfterLongTap = !0
        }
        _switchTrackingModeFromAnotherPaneIfNeeded(e) {
            const t = this._chart.trackingModePaneWidget();
            if (null !== t && t !== this) {
                const i = this._chartModel().crossHairSource().currentPoint();
                t._exitTrackingModeOnNextTry = !0, t._tryExitTrackingMode(!0), this.startTrackingMode(new O.Point(e.localX, e.localY), new O.Point(i.x, e.localY), new q.EnvironmentState(e))
            }
        }
        _showContextMenu(e) {
            const t = e => e instanceof P.Separator,
                i = this._customActions(),
                s = this._initActions(e).filter((e => null !== e));
            i.remove.forEach((e => {
                for (let t = 0; t < s.length; t++) {
                    const i = s[t];
                    if (i instanceof P.Action && i.getLabel() === e) {
                        s.splice(t, 1);
                        break
                    }
                }
            }));
            const r = i.top.concat(s).concat(i.bottom);
            for (let e = r.length - 1; e > 0; e--) t(r[e]) && t(r[e - 1]) && r.splice(e, 1);
            r.length && t(r[0]) && r.splice(0, 1), r.length && t(r[r.length - 1]) && r.splice(r.length - 1, 1), he.ContextMenuManager.showMenu(r, e, {
                statName: "ChartContextMenu"
            }, {
                menuName: "ChartContextMenu"
            })
        }
        _initActions(e) {
            var t, i;
            const s = this._chart.actions(),
                r = [];
            if (r.push(s.chartReset), r.push(new P.Separator), !this.state().isEmpty() && Oe.enabled("datasource_copypaste")) {
                const t = (0, Fe.createActionCopyPrice)(this.state(), e.localY),
                    i = (0, Fe.createPasteAction)(this._chart, this.state());
                (t || i) && (t && r.push(t), i && r.push(i), r.push(new P.Separator))
            }
            r[r.length - 1] instanceof P.Separator || r.push(new P.Separator);
            return Boolean(null === (t = window.widgetbar) || void 0 === t ? void 0 : t.widget("watchlist")) && s.addToWatchlist && r.push(s.addToWatchlist), Oe.enabled("text_notes") && r.push(s.addToTextNotes), r[r.length - 1] instanceof P.Separator || r.push(new P.Separator), r.push(this._createLockTimeAxisAction(e)), r.push(new P.Separator), r.push((0, Fe.createLinesAction)(this._chart)), !Oe.enabled("charting_library_base") && s.applyColorTheme && r.push(s.applyColorTheme), r[r.length - 1] instanceof P.Separator || r.push(new P.Separator), this._chart.applyIndicatorsToAllChartsAvailable() && (r.push(s.applyStudiesToAllCharts), r.push(new P.Separator)), r.push(s.paneRemoveAllDrawingTools), r.push(s.paneRemoveAllStudies), r.push(new P.Separator), (null === (i = window.pro) || void 0 === i ? void 0 : i.hasPackage("mtp-mtpredictor")) && this.state().containsMainSeries() && r.push((0, Fe.createMTPredictorActions)(this._chart, this.state(), this._contextMenuX, this._contextMenuY), new P.Separator), r.push(s.hideAllMarks), r.push(new P.Separator), Oe.enabled("show_chart_property_page") && r.push(s.chartProperties), r[r.length - 1] instanceof P.Separator && r.pop(), r
        }
        _loadAndCreateLegendWidget() {
            Promise.all([i.e(2014), i.e(9322), i.e(2215), i.e(5093)]).then(i.bind(i, 44449)).then((e => {
                if (this._isDestroyed) return;
                const t = e.LegendWidget,
                    i = (0, U.deepExtend)({}, this._options.legendWidget);
                i.canShowSourceCode = !this._chart.onWidget() && !h.CheckMobile.any(), i.readOnlyMode = i.readOnlyMode || this._chart.readOnly(), i.statusesWidgets = {
                    sourceStatusesEnabled: this._options.sourceStatusesWidgetEnabled,
                    sourceStatuses: this._options.sourceStatusesWidget || {},
                    marketStatusEnabled: this._options.marketStatusWidgetEnabled,
                    dataUpdateModeEnabled: this._options.chartWarningWidgetEnabled,
                    dataUpdateMode: this._options.chartWarningWidget || {},
                    dataProblemEnabled: this._options.dataProblemWidgetEnabled
                };
                const s = (0, b.combine)(((e, t) => Ft && this._chart !== e && !t), this._chart.chartWidgetCollection().activeChartWidget, this._chart.chartWidgetCollection().lock.crosshair),
                    n = (0, b.combine)(((e, t) => null !== e ? e === this._state : (0, Y.toolIsMeasure)(t)), this._chartModel().crossHairSource().measurePane(), Y.tool);
                this._legendWidget = new t(this._chartUndoModel(), this, this._chart.backgroundTopTheme().spawn(), s, this._visuallyCollapsed.spawn(), n, i, {
                    showContextMenuForSelection: this.showContextMenuForSelection.bind(this),
                    showContextMenuForSources: this.showContextMenuForSources.bind(this),
                    updateActions: this._chart.updateActions.bind(this._chart),
                    showChartPropertiesForSource: this._chart.showChartPropertiesForSource.bind(this._chart),
                    showGeneralChartProperties: this._chart.showGeneralChartProperties.bind(this._chart),
                    showObjectsTreeDialog: this._chart.showObjectsTreeDialog.bind(this._chart)
                }), this._div.appendChild(this._legendWidget.getElement()), this._legendWidget.updateLayout(), this._legendWidget.updateWidgetModeBySize(this._size), this._legendWidget.updateThemedColors(this._themedTopColor);
                for (const e of Array.from(this._customLegendWidgetsFactoryMap.keys())) this._legendWidget.addCustomWidgetToLegend(e, (0, r.ensureDefined)(this._customLegendWidgetsFactoryMap.get(e)))
            }))
        }
        _loadAndCreatePaneControlsWidget() {
            Promise.all([Promise.all([i.e(2014), i.e(9322), i.e(2215), i.e(5093)]).then(i.bind(i, 69289)), Promise.all([i.e(2014), i.e(9322), i.e(2215), i.e(5093)]).then(i.bind(i, 59255))]).then((([e, t]) => {
                var i;
                if (this._isDestroyed) return;
                const s = e.PaneControlsWidget;
                this._paneControls = new s(this._chartUndoModel(), this, {
                    backgroundThemeName: this._chart.backgroundTopTheme()
                }, {
                    toggleMaximizePane: this._chart.toggleMaximizePane.bind(this._chart),
                    toggleCollapsedPane: this._chart.toggleCollapsedPane.bind(this._chart)
                }, this._div), this._paneControls.updateWidgetModeByWidth(this._size.width), this._paneControls.updateThemedColors(this._themedTopColor), this._paneControlsResizeObserver = new t.default(this._handleRestrictLegendWidth.bind(this)), this._paneControlsResizeObserver.observe(this._paneControls.getElement()), (null === (i = this._state) || void 0 === i ? void 0 : i.collapsed().value()) && this._chartModel().fullUpdate()
            }))
        }
        _handleRestrictLegendWidth(e) {
            if (null === this._legendWidget || null === this._paneControls) return;
            const t = e[e.length - 1].contentRect.width,
                i = 0 === t ? 0 : t + Pt + Ct;
            this._legendWidget.addMargin(i)
        }
        _onMagnetStateChanged() {
            this._chart.isActive() && (this._isSelectPointModeEnabled() || this._isToolActionActiveOnPane(!0)) && this._chartModel().crossHairSource().visible && this._updateLineToolUsingMagnetOrShift()
        }
        _onShiftKeyStateChanged() {
            this._chart.isActive() && this._isToolActionActiveOnPane(!1) && this._chartModel().crossHairSource().visible && this._updateLineToolUsingMagnetOrShift(q.EnvironmentState.create((0, vt.shiftPressed)().value()))
        }
        _isToolActionActiveOnPane(e) {
            const t = this._chartModel(),
                i = t.lineBeingCreated() || t.lineBeingEdited() || t.sourcesBeingMoved().length > 0 && t.sourcesBeingMoved()[0];
            return i ? t.paneForSource(i) === this._state : e && (0, D.isLineToolName)(Y.tool.value()) && t.crossHairSource().pane === this._state
        }
        _updateLineToolUsingMagnetOrShift(e) {
            if (null === this._prevMoveEventPosition) return;
            const {
                x: t,
                y: i
            } = this._prevMoveEventPosition, s = this._chartModel().sourcesBeingMoved();
            s.length > 0 ? (Y.isStudyEditingNow.value() && this._setCursorPosition(t, i, e), this._alignSourcesThatBeingMoved(s, t, i, e)) : this._setCursorPosition(t, i, e)
        }
        _showEditDialogForSource(e, t) {
            if (this._options.propertyPagesEnabled && e.userEditEnabled())
                if (e === this._chartUndoModel().mainSeries()) this._chart.showGeneralChartProperties(pt.TabNames.symbol);
                else if ((0, E.isLineTool)(e) || (0, V.isStudy)(e)) {
                let i;
                const s = null == t ? void 0 : t.data();
                if (null != s) {
                    const e = s.areaName;
                    void 0 !== e && (i = Ot.get(e))
                }
                this._chart.showChartPropertiesForSource(e, i).then((e => {
                    this._editDialog = e
                }))
            }
        }
        _initToolCreationModeParams(e) {
            this._startTouchPoint = new O.Point(e.pageX, e.pageY), this._initCrossHairPosition = this._chartModel().crossHairSource().currentPoint()
        }
        _updateCrosshairPositionInToolCreationMode(e, t) {
            if (t !== this._state) {
                const i = this._chart.paneByState(t);
                return i._startTouchPoint = this._startTouchPoint, i._initCrossHairPosition = this._initCrossHairPosition, void i._updateCrosshairPositionInToolCreationMode(e, t)
            }
            const i = this._chartModel().crossHairSource();
            this._chart.justActivated() && (this._initCrossHairPosition = i.currentPoint());
            const s = e.pageX,
                n = e.pageY,
                o = (0, r.ensureNotNull)(this._initCrossHairPosition),
                a = new O.Point(s, n).subtract((0, r.ensureNotNull)(this._startTouchPoint)),
                l = o.add(a);
            this._setCursorPosition(l.x, l.y, new q.EnvironmentState(e))
        }
        _priceAxisesContainer(e) {
            return "left" === e ? this._lhsPriceAxisesContainer : this._rhsPriceAxisesContainer
        }
        _recalculatePriceScales(e) {
            const t = this.state();
            for (const i of t.leftPriceScales()) t.recalculatePriceScale(i, e);
            for (const i of t.rightPriceScales()) t.recalculatePriceScale(i, e);
            for (const i of t.sourcesByGroup().overlayPriceScaleSources())(0, E.isLineTool)(i) || t.recalculatePriceScale(i.priceScale(), e)
        }
        _createLockTimeAxisAction(e) {
            var t;
            const i = 0 === (null === (t = Y.crosshairLock.value()) || void 0 === t ? void 0 : t.type);
            return new P.Action({
                actionId: "Chart.Crosshair.LockVerticalCursor",
                label: Mt,
                statName: "LockCursorInTime",
                checkable: !0,
                checked: i,
                onExecute: () => this._toggleLockTimeAxis(e.localX, !i)
            })
        }
        _toggleLockTimeAxis(e, t) {
            if (t) {
                const t = this._chartUndoModel().timeScale(),
                    i = t.coordinateToIndex(e),
                    s = t.points().roughTime(i);
                if (null !== s) return void Y.crosshairLock.setValue({
                    type: 0,
                    time: s
                })
            }
            Y.crosshairLock.setValue(null)
        }
        _preventTouchEventsExceptPinch() {
            return this._paneWidgetsSharedState.hasTouchesOnOtherPanes(this) || null !== this._paneWidgetsSharedState.pinchingPane()
        }
        _updateHoveredSource(e, t, i) {
            var s, r;
            const n = this._chartUndoModel(),
                o = n.model();
            let a = !1;
            const l = e && e.source,
                c = this._chart.readOnly();
            if (o.crossHairSource().isReplaySelection()) this._setCursorClassName("none");
            else if (!(!c || e && (0,
                    E.isLineTool)(e.source)) || this._editDialog && this._editDialog.visible().value()) c && (o.setHoveredSource(null, null), this.setCursorForTool());
            else {
                const h = Y.tool.value();
                let d = null;
                if (!this._processing && ((0, Y.toolIsCursor)(h) || "eraser" === h && !c || t.mod() || !n.lineBeingCreated())) {
                    const t = null == e ? void 0 : e.hittest;
                    a = Boolean(null === (s = null == t ? void 0 : t.data()) || void 0 === s ? void 0 : s.hideCrosshairLinesOnHover), t && t.target() > j.HitTarget.MovePointBackground ? (d = l, !(null == l ? void 0 : l.isHoveredEnabled()) || "eraser" === h && l === n.mainSeries() ? o.setHoveredSource(null, null) : o.setHoveredSource(l, t.data())) : o.setHoveredSource(null, null)
                }
                c ? this.setCursorForTool(d, t, _t.PaneCursorType.Default) : this._options.sourceSelectionEnabled && (this._isSelectPointModeEnabled() ? this._setCursorClassName("pointer") : this.setCursorForTool(d, t, null === (r = null == e ? void 0 : e.hittest.data()) || void 0 === r ? void 0 : r.cursorType));
                const u = o.customSourceBeingMoved(),
                    p = null !== u ? [u] : o.sourcesBeingMoved();
                if ((!p.length || null !== e && -1 === p.indexOf(e.source)) && this._updateCommonTooltip(e), !c && null !== e && i && e.hittest.hasPressedMoveHandler(i)) {
                    switch ((e.hittest.data() || {}).cursorType) {
                        case _t.PaneCursorType.VerticalResize:
                            this._setCursorClassName("ns-resize");
                            break;
                        case _t.PaneCursorType.HorizontalResize:
                            this._setCursorClassName("we-resize");
                            break;
                        case _t.PaneCursorType.DiagonalNeSwResize:
                            this._setCursorClassName("nesw-resize");
                            break;
                        case _t.PaneCursorType.DiagonalNwSeResize:
                            this._setCursorClassName("nwse-resize")
                    }
                }
            }
            this._preventCrossHairMove() && this._clearCursorPosition(), 1 !== this._pressedMoveStage && o.crossHairSource().setLinesShouldBeHidden(a)
        }
        async _createErrorBlock() {
            const e = new(await gt());
            return this._div.insertBefore(e.container, this._topCanvasBinding.canvasElement.nextSibling), e
        }
        _customActions() {
            const e = {
                    top: [],
                    bottom: [],
                    remove: []
                },
                t = this._chartUndoModel().timeScale(),
                i = this._state && this._state.defaultPriceScale();
            if (!Oe.enabled("custom_items_in_context_menu")) return e;
            const s = t.isEmpty() ? void 0 : t.indexToUserTime(t.coordinateToIndex(this._contextMenuX));
            let n;
            if (i && !i.isEmpty()) {
                const e = (0, r.ensureNotNull)(this.state().mainDataSource()).firstValue();
                n = i.coordinateToPrice(this._contextMenuY, (0, r.ensureNotNull)(e))
            }
            return (0, u.emit)("onContextMenu", {
                unixtime: null != s ? s.getTime() / 1e3 : void 0,
                price: n,
                callback: t => {
                    [...t].forEach((t => {
                        if (t.text)
                            if (t.text.length > 1 && "-" === t.text[0]) e.remove.push(t.text.slice(1));
                            else {
                                let i;
                                i = "-" === t.text ? new P.Separator : new P.Action({
                                    actionId: "Chart.ExternalActionId",
                                    label: t.text,
                                    onExecute: t.click
                                }), t.position && "top" === t.position ? e.top.push(i) : e.bottom.push(i)
                            }
                    }))
                }
            }), e
        }
        _highlightPriceAxisByLabel(e) {
            this._lhsPriceAxisesContainer.highlightPriceAxisByLabel(e), this._rhsPriceAxisesContainer.highlightPriceAxisByLabel(e)
        }
        _subscribeToState() {
            const e = this.state();
            e.onDestroyed().subscribe(this, this._onStateDestroyed, !0), e.dataSourcesCollectionChanged().subscribe(this, this._onDataSourcesCollectionChanged), e.maximized().subscribe(this._updateVisuallyCollapsed), e.collapsed().subscribe(this._updateVisuallyCollapsed)
        }
        _unsubscribeFromState() {
            const e = this.state();
            e.onDestroyed().unsubscribeAll(this), e.dataSourcesCollectionChanged().unsubscribeAll(this), e.maximized().unsubscribe(this._updateVisuallyCollapsed), e.collapsed().unsubscribe(this._updateVisuallyCollapsed)
        }
        async _updateEndOfSeriesBanner() {}
    }
    var Ut = i(30383);
    class jt {
        constructor(e, t, i) {
            this._handleEl = null, this._resizeInfo = null, this._colorCache = {
                lineColor: "",
                backgroundColor: "",
                color: ""
            }, this._chart = e, this._topPaneIndex = t, this._bottomPaneIndex = i, this._row = document.createElement("tr"), this._cell = document.createElement("td"), this._row.appendChild(this._cell), this._cell.classList.add(Ut.paneSeparator), this._cell.setAttribute("colspan", "3"), this._cell.style.background = this._color(), this.adjustSize(), this._cell.addEventListener("click", (() => {}));
            const s = document.createElement("div");
            s.classList.add(Ut.handle), this._cell.appendChild(s), this._mouseEventHandler = new Z.MouseEventHandler(s, this, {
                treatVertTouchDragAsPageScroll: !1,
                treatHorzTouchDragAsPageScroll: !0
            }), this._handleEl = s
        }
        destroy() {
            this._mouseEventHandler.destroy(), this._row.parentElement && this._row.parentElement.removeChild(this._row)
        }
        getElement() {
            return this._row
        }
        hide() {
            this._row.classList.add("js-hidden")
        }
        show() {
            this._row.classList.remove("js-hidden")
        }
        adjustSize() {
            this._row.style.height = jt.height() + "px"
        }
        mouseEnterEvent(e) {
            const {
                topPane: t,
                bottomPane: i
            } = this._topBottomPane(!0);
            null !== t && null !== i && (0, r.ensureNotNull)(this._handleEl).classList.add(Ut.hovered)
        }
        mouseLeaveEvent(e) {
            (0, r.ensureNotNull)(this._handleEl).classList.remove(Ut.hovered)
        }
        mouseDownEvent(e) {
            this._mouseDownOrTouchStartEvent(e)
        }
        touchStartEvent(e) {
            this._mouseDownOrTouchStartEvent(e)
        }
        pressedMouseMoveEvent(e) {
            this._pressedMouseOrTouchMoveEvent(e)
        }
        touchMoveEvent(e) {
            this._pressedMouseOrTouchMoveEvent(e)
        }
        mouseUpEvent(e) {
            this._mouseUpOrTouchEndEvent(e)
        }
        touchEndEvent(e) {
            this._mouseUpOrTouchEndEvent(e)
        }
        update() {
            this._cell.style.background = this._color().toString()
        }
        paint() {}
        image() {
            const {
                topPane: e
            } = this._topBottomPane(!1), t = e.leftPriceAxisesContainer().getWidth(), i = e.width(), r = e.rightPriceAxisesContainer().getWidth(), n = this._color(), o = (0, X.createDisconnectedCanvas)(document, (0, s.size)({
                width: t,
                height: 1
            })), a = (0, X.getPrescaledContext2D)(o);
            a.fillStyle = n, a.fillRect(0, 0, t, 1);
            const l = (0, X.createDisconnectedCanvas)(document, (0, s.size)({
                    width: i,
                    height: 1
                })),
                c = (0, X.getPrescaledContext2D)(l);
            c.fillStyle = n, c.fillRect(0, 0, i, 1);
            const h = (0, X.createDisconnectedCanvas)(document, (0, s.size)({
                    width: r,
                    height: 1
                })),
                d = (0, X.getPrescaledContext2D)(h);
            return d.fillStyle = n, d.fillRect(0, 0, r, 1), {
                type: "separator",
                leftAxis: {
                    content: o.toDataURL(),
                    canvas: o,
                    contentWidth: t,
                    contentHeight: 1
                },
                rightAxis: {
                    content: h.toDataURL(),
                    canvas: h,
                    contentWidth: r,
                    contentHeight: 1
                },
                content: l.toDataURL(),
                canvas: l,
                contentWidth: i,
                contentHeight: 1
            }
        }
        static height() {
            const e = window.devicePixelRatio || 1;
            return e >= 1 ? 1 : 1 / e
        }
        _mouseDownOrTouchStartEvent(e) {
            const {
                topPane: t,
                bottomPane: i
            } = this._topBottomPane(!0);
            if (null === t || null === i) return;
            const s = t.state().stretchFactor() + i.state().stretchFactor(),
                n = s / (t.height() + i.height()),
                o = 30 * n;
            s <= 2 * o || (this._resizeInfo = {
                startY: e.pageY,
                prevStretchTopPane: t.state().stretchFactor(),
                maxPaneStretch: s - o,
                totalStretch: s,
                pixelStretchFactor: n,
                minPaneStretch: o
            }, (0, r.ensureNotNull)(this._handleEl).classList.add(Ut.active))
        }
        _pressedMouseOrTouchMoveEvent(e) {
            const {
                topPane: t,
                bottomPane: i
            } = this._topBottomPane(!0), s = this._resizeInfo;
            if (null === s || null === t || null === i) return;
            const r = (e.pageY - s.startY) * s.pixelStretchFactor,
                n = (0, we.clamp)(s.prevStretchTopPane + r, s.minPaneStretch, s.maxPaneStretch);
            t.state().setStretchFactor(n), i.state().setStretchFactor(s.totalStretch - n), this._chart.model().model().fullUpdate()
        }
        _mouseUpOrTouchEndEvent(e) {
            const {
                topPane: t,
                bottomPane: i
            } = this._topBottomPane(!0), s = this._resizeInfo;
            null !== s && null !== t && null !== i && (this._chart.model().addPaneStretchFactorUndoCommand(t.state(), i.state(), s.prevStretchTopPane, t.state().stretchFactor()), this._resizeInfo = null, (0, r.ensureNotNull)(this._handleEl).classList.remove(Ut.active))
        }
        _color() {
            const e = this._chart.properties().childs().paneProperties.childs().separatorColor.value(),
                t = this._chart.model().model().backgroundColor().value();
            if (this._colorCache.lineColor !== e || this._colorCache.backgroundColor !== t) {
                const i = (0, ve.parseRgba)(t),
                    s = (0, ve.parseRgba)(e),
                    r = 0 === i[3] && 0 === s[3] ? "rgba(0,0,0,0)" : (0, ve.rgbaToString)((0, ve.blendRgba)(i, s));
                this._colorCache = {
                    lineColor: e,
                    backgroundColor: t,
                    color: r
                }
            }
            return this._colorCache.color
        }
        _topBottomPane(e) {
            const t = this._chart.paneWidgets();
            let i = null,
                s = null;
            for (let s = this._topPaneIndex; s >= 0; --s) {
                const r = t[s];
                if (!e || !r.state().collapsed().value()) {
                    i = r;
                    break
                }
            }
            for (let i = this._bottomPaneIndex; i < t.length; ++i) {
                const r = t[i];
                if (!e || !r.state().collapsed().value()) {
                    s = r;
                    break
                }
            }
            return {
                topPane: i,
                bottomPane: s
            }
        }
    }
    var Gt = i(42609),
        qt = i(11678);
    i(658);
    const $t = {
            contextMenuEnabled: !0,
            timezoneMenuEnabled: !0,
            pressedMouseMoveScale: !0
        },
        Yt = new z.TranslatedString("change session", o.t(null, void 0, i(65303))),
        Kt = o.t(null, void 0, i(25866));
    class Zt {
        constructor(e, t, i, r, n) {
            this._rendererOptions = null, this._onLabelHovered = new(ce()), this._mousedown = !1, this._currentCursorClassName = "invalid", this._options = (0, y.merge)((0, y.clone)($t), t || {}), this.chart = e, this._properties = e.properties().childs().scalesProperties, this._element = document.createElement("tr"), this._backgroundBasedTheme = n;
            const o = () => this.backgroundColor(),
                a = () => {
                    throw new Error("Time axis does not support real price scales")
                },
                l = {
                    titlesProvider: i,
                    stubContextMenuProvider: (e, t) => {
                        const i = r(e, t),
                            s = this.getContextMenuActions(!0);
                        return 0 === s.length ? i : i.concat(new P.Separator, s)
                    },
                    backgroundBasedTheme: n,
                    rendererOptionsProvider: e.model().model().rendererOptionsProvider(),
                    getBackgroundTopColor: o,
                    getBackgroundBottomColor: o,
                    showHorizontalBorder: !0
                };
            this._lhsStubContainer = new me(this._properties, "left", a, l, this._options.priceAxisLabelsOptions, this), this._lhsStubContainer.onLabelHovered().subscribe(this, ((e, t) => {
                    this._onLabelHovered.fire(e, t)
                })), this._rhsStubContainer = new me(this._properties, "right", a, l, this._options.priceAxisLabelsOptions, this), this._rhsStubContainer.onLabelHovered().subscribe(this, ((e, t) => {
                    this._onLabelHovered.fire(e, t)
                })),
                this._element.appendChild(this._lhsStubContainer.getElement()), this._cell = document.createElement("td"), this._element.appendChild(this._cell), this._cell.classList.add("chart-markup-table", "time-axis"), this._cell.style.height = "25px", this._dv = document.createElement("div"), this._dv.style.width = "100%", this._dv.style.height = "100%", this._dv.style.position = "relative", this._dv.style.overflow = "hidden", this._cell.appendChild(this._dv), this._canvasConfiguredHandler = () => this.chart.model().model().lightUpdate(), this._canvasBinding = (0, X.createBoundCanvas)(this._dv, (0, s.size)({
                    width: 16,
                    height: 16
                })), this._canvasBinding.subscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler);
            const c = this._canvasBinding.canvasElement;
            c.style.position = "absolute", c.style.zIndex = "1", c.style.left = "0", c.style.top = "0", this._topCanvasBinding = (0, X.createBoundCanvas)(this._dv, (0, s.size)({
                width: 16,
                height: 16
            })), this._topCanvasBinding.subscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler);
            const h = this._topCanvasBinding.canvasElement;
            h.style.position = "absolute", h.style.zIndex = "2", h.style.left = "0", h.style.top = "0", this._element.appendChild(this._rhsStubContainer.getElement()), this.restoreDefaultCursor(), this.update(), this._minVisibleSpan = Gt.MINUTE_SPAN, this._mouseEventHandler = new Z.MouseEventHandler(this._topCanvasBinding.canvasElement, this, {
                treatVertTouchDragAsPageScroll: !0,
                treatHorzTouchDragAsPageScroll: !1
            }), this.size = (0, s.size)({
                width: 0,
                height: 0
            }), (0, Y.hideMarksOnBars)().subscribe(this, (() => this.chart.model().model().lightUpdate()))
        }
        destroy() {
            this._mouseEventHandler.destroy(), this._topCanvasBinding.unsubscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler), this._topCanvasBinding.dispose(), this._canvasBinding.unsubscribeSuggestedBitmapSizeChanged(this._canvasConfiguredHandler), this._canvasBinding.dispose(), this._rhsStubContainer.onLabelHovered().unsubscribeAll(this), this._lhsStubContainer.onLabelHovered().unsubscribeAll(this), this._lhsStubContainer.destroy(), this._rhsStubContainer.destroy(), this.chart.properties().childs().paneProperties.childs().background.unsubscribeAll(this), (0, Y.hideMarksOnBars)().unsubscribeAll(this)
        }
        setCursor(e) {
            let t = "";
            "grabbing" !== e && "ew-resize" !== e || (t = "time-axis--cursor-" + e), this._currentCursorClassName !== t && (this._currentCursorClassName && this._cell.classList.remove(this._currentCursorClassName), t && this._cell.classList.add(t), this._currentCursorClassName = t, this._cell.style.cursor)
        }
        restoreDefaultCursor() {
            this.setCursor("")
        }
        getElement() {
            return this._element
        }
        optimalHeight() {
            const e = this.rendererOptions();
            return Math.ceil(e.borderSize + e.offsetSize + e.fontSize + e.paddingTop + e.paddingBottom + e.labelBottomOffset)
        }
        setSizes(e, t, i) {
            this.size && (0, s.equalSizes)(this.size, e) || (this.size = e, this._canvasBinding.resizeCanvasElement(e), this._topCanvasBinding.resizeCanvasElement(e), this._cell.style.width = e.width + "px", this._cell.style.height = e.height + "px"), this._lhsStubContainer.setSizes(e.height, t), this._rhsStubContainer.setSizes(e.height, i)
        }
        rendererOptions() {
            if (!this._rendererOptions || this._rendererOptions.fontSize !== this.fontSize()) {
                const e = this.fontSize();
                this._rendererOptions = {
                    borderSize: 1,
                    offsetSize: 5,
                    fontSize: e,
                    font: (0, Q.makeFont)(e, se.CHART_FONT_FAMILY, ""),
                    widthCache: new ge.TextWidthCache,
                    paddingTop: 3 * e / 12,
                    paddingBottom: 3 * e / 12,
                    paddingHorizontal: 9 * e / 12,
                    labelBottomOffset: 4 * e / 12
                }
            }
            return this._rendererOptions
        }
        backgroundColor() {
            return this.chart.model().model().backgroundColor().value()
        }
        lineColor() {
            const e = this._properties.childs().lineColor.value();
            if (0 === (0, ve.parseRgba)(e)[3]) {
                const e = this.chart.model().model().lastPane();
                if (e && (e.collapsed().value() || e.isMainPane() && this._areEventsEnabled())) return this.chart.properties().childs().paneProperties.childs().separatorColor.value()
            }
            return e
        }
        textColor() {
            return this._properties.childs().textColor.value()
        }
        fontSize() {
            return this._properties.childs().fontSize.value()
        }
        baseFont() {
            return (0, Q.makeFont)(this.fontSize(), se.CHART_FONT_FAMILY)
        }
        baseBoldFont() {
            return (0, Q.makeFont)(this.fontSize(), se.CHART_FONT_FAMILY, "", "bold")
        }
        hasCanvas(e) {
            return this._canvasBinding.canvasElement === e || this._topCanvasBinding.canvasElement === e
        }
        onLabelHovered() {
            return this._onLabelHovered
        }
        getScreenshotData() {
            return {
                content: this._canvasBinding.canvasElement.toDataURL(),
                canvas: this._canvasBinding.canvasElement,
                contentWidth: this.size.width,
                contentHeight: this.size.height,
                lhsStub: this._lhsStubContainer.getScreenshotData(),
                rhsStub: this._rhsStubContainer.getScreenshotData()
            }
        }
        getContextMenuActions(e) {
            var t;
            const i = this.chart;
            i.updateActions();
            const s = i.actions(),
                r = [];
            if (e || (r.push(s.timeScaleReset), r.push(new P.Separator), this._options.timezoneMenuEnabled && r.push(s.applyTimeZone), r.push(s.sessionBreaks)), !i.model().mainSeries().isDWM()) {
                const e = null === (t = i.model()) || void 0 === t ? void 0 : t.mainSeries().symbolInfo();
                if (e) {
                    const t = i.model().mainSeries().properties().childs().sessionId,
                        s = (e.subsessions || []).filter((e => !e.private));
                    if (s.length > 1) {
                        const e = s.map((e => {
                                const s = {
                                    label: (0, qt.translateSessionDescription)(e.description),
                                    checkable: !0,
                                    checked: t.value() === e.id,
                                    statName: "SetSession",
                                    onExecute: () => {
                                        i.model().setProperty(t, e.id, Yt)
                                    }
                                };
                                return new P.Action({
                                    ...s,
                                    actionId: "Chart.SetSession"
                                })
                            })),
                            n = {
                                label: Kt,
                                statName: "SetSession",
                                subItems: e
                            },
                            o = new P.Action({
                                ...n,
                                actionId: "Chart.SetSession"
                            });
                        r.push(o)
                    }
                }
            }
            return r
        }
        update() {
            if (!this.chart.hasModel()) return;
            const e = this.chart.model().timeScale().marks();
            if (e) {
                this._minVisibleSpan = Gt.YEAR_SPAN;
                for (const t of e) this._minVisibleSpan = Math.min(t.span, this._minVisibleSpan)
            }
        }
        updatePriceAxisStubs() {
            const e = this.chart.model().model(),
                t = this.chart.isMaximizedPane() ? (0, r.ensureNotNull)(this.chart.maximizedPaneWidget()).state() : e.paneForSource(e.mainSeries());
            if (!t) return;
            const i = e.priceScaleSlotsCount();
            this._lhsStubContainer.setScales([], i.left, t.leftPriceScales().length, i.left + i.right), this._rhsStubContainer.setScales([], i.right, t.rightPriceScales().length, i.left + i.right)
        }
        paint(e) {
            if (e === R.InvalidationLevel.None || 0 === this.size.width || 0 === this.size.height) return;
            this._canvasBinding.applySuggestedBitmapSize(),
                this._topCanvasBinding.applySuggestedBitmapSize();
            const t = (0, X.getContext2D)(this._topCanvasBinding.canvasElement);
            if (e > R.InvalidationLevel.Cursor) {
                const i = (0, X.getContext2D)(this._canvasBinding.canvasElement),
                    s = (0, X.getBindingPixelRatio)(this._canvasBinding);
                this.drawBackground(i, s), this.chart.hasModel() && (this.drawBorder(i, s), this.drawTickMarks(i, s), this.drawBackLabels(i, s), this.drawCrossHairLabel(t, s)), this._lhsStubContainer.paintStubs(e), this._rhsStubContainer.paintStubs(e)
            }
            this.drawCrossHairLabel(t, (0, X.getBindingPixelRatio)(this._topCanvasBinding))
        }
        drawBackground(e, t) {
            if ((0, X.clearRect)(e, 0, 0, Math.ceil(this.size.width * t) + 1, Math.ceil(this.size.height * t) + 1, this.backgroundColor()), !this.chart.hasModel()) return;
            const i = this.chart.model();
            if (!i.timeScale().isEmpty()) {
                const s = i.model().selection().lineDataSources().reduce(((e, t) => {
                    const i = t.timeAxisPoints();
                    return 0 === i.length ? e : e.concat(i)
                }), []);
                s.length > 0 && this._hightlightBackground(e, s, t)
            }
            const s = i.model().crossHairSource();
            s.startMeasurePoint() && this._hightlightBackground(e, s.measurePoints(), t)
        }
        drawBorder(e, t) {
            e.save(), e.fillStyle = this.lineColor();
            const i = Math.max(1, Math.floor(this.rendererOptions().borderSize * t)),
                s = Math.ceil(this.size.width * t);
            e.fillRect(0, 0, s + 1, i), e.restore()
        }
        drawTickMarks(e, t) {
            const i = this.chart.model().timeScale().marks();
            if (!i || 0 === i.length) return;
            let s = i.reduce(((e, t) => e.span > t.span ? e : t), i[0]).span;
            s > 30 && s < 40 && (s = 30), e.save(), e.strokeStyle = this.lineColor();
            const r = this.rendererOptions(),
                n = r.borderSize + r.offsetSize + r.paddingTop + r.fontSize / 2;
            e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = this.textColor(), (0, X.drawScaled)(e, t, t, (() => {
                e.font = this.baseFont();
                for (let t = 0; t < i.length; t++) {
                    const r = i[t];
                    r.span < s && e.fillText(r.label, r.coord, n)
                }
                e.font = this.baseBoldFont();
                for (let t = 0; t < i.length; t++) {
                    const r = i[t];
                    r.span >= s && e.fillText(r.label, r.coord, n)
                }
            })), e.restore()
        }
        drawBackLabels(e, t) {
            var i;
            e.save();
            const s = new Set,
                r = this.chart.model().model();
            let n = r.dataSources();
            const o = r.selection().allSources();
            for (const e of o) s.add(e);
            r.hoveredSource() && s.add(r.hoveredSource());
            for (const e of r.sourcesBeingMoved()) s.add(e);
            const a = r.customSourceBeingMoved();
            null !== a && s.add(a);
            const l = null !== (i = r.lineBeingEdited()) && void 0 !== i ? i : r.lineBeingCreated();
            l && s.add(l), s.add(this.chart.model().crossHairSource()), n = n.concat(r.customSources());
            const c = this.rendererOptions();
            for (let i = 0; i < n.length; i++) {
                const r = n[i];
                if (!s.has(r) && r.timeAxisViews) {
                    const i = r.timeAxisViews();
                    if (i)
                        for (let s = 0; s < i.length; s++) i[s].renderer().draw(e, c, t)
                }
            }
            e.restore()
        }
        drawCrossHairLabel(e, t) {
            var i;
            e.save(), e.clearRect(0, 0, Math.ceil(this.size.width * t) + 1, Math.ceil(this.size.height * t) + 1);
            const s = this.chart.model().model(),
                r = [],
                n = null !== (i = s.lineBeingEdited()) && void 0 !== i ? i : s.lineBeingCreated();
            if (n && n.timeAxisViews) {
                const e = n.timeAxisViews();
                e && e.length && r.push(e)
            }
            const o = s.customSourceBeingMoved();
            this._addViewsOrMaxMin(null === o ? [] : [o], r), this._addViewsOrMaxMin(s.sourcesBeingMoved(), r), this._addViewsOrMaxMin(s.selection().allSources(), r);
            const a = s.hoveredSource();
            if (a && (0,
                    $.isDataSource)(a) && !s.selection().isSelected(a) && a.timeAxisViews) {
                const e = a.timeAxisViews();
                e && e.length && r.push(e)
            }
            const l = s.crossHairSource(),
                c = l.timeAxisViews && l.timeAxisViews();
            c && c.length && r.push(c);
            const h = this.rendererOptions();
            for (const i of r)
                for (const s of i) e.save(), s.renderer().draw(e, h, t), e.restore();
            e.restore()
        }
        mouseDownEvent(e) {
            this._mouseDownOrTouchStartEvent(e)
        }
        touchStartEvent(e) {
            this._mouseOrTouchEnterEvent(e), this._mouseDownOrTouchStartEvent(e)
        }
        mouseDownOutsideEvent() {
            this._outsideMouseDownOrTouchStartEvent()
        }
        touchStartOutsideEvent() {
            this._outsideMouseDownOrTouchStartEvent()
        }
        pressedMouseMoveEvent(e) {
            this._pressedMouseOrTouchMoveEvent(e)
        }
        touchMoveEvent(e) {
            this._pressedMouseOrTouchMoveEvent(e)
        }
        mouseUpEvent(e) {
            this._mouseUpOrTouchEndEvent(e)
        }
        touchEndEvent(e) {
            this._mouseUpOrTouchEndEvent(e), this._mouseOrTouchLeaveEvent(e)
        }
        contextMenuEvent(e) {
            this._contextMenuOrTouchContextMenuEvent(e)
        }
        touchContextMenuEvent(e) {
            this._contextMenuOrTouchContextMenuEvent(e)
        }
        mouseEnterEvent(e) {
            this._mouseOrTouchEnterEvent(e)
        }
        mouseLeaveEvent(e) {
            this._mouseOrTouchLeaveEvent(e)
        }
        mouseDoubleClickEvent(e) {
            this._mouseDoubleClickOrDoubleTapEvent(e)
        }
        doubleTapEvent(e) {
            this._mouseDoubleClickOrDoubleTapEvent(e)
        }
        _outsideMouseDownOrTouchStartEvent() {
            this._zoomAvailable() && this._mousedown && (this._mousedown = !1, this.chart.model().endScaleTime(), this.restoreDefaultCursor())
        }
        _hightlightBackground(e, t, i) {
            const s = this.chart.model().timeScale();
            let r = t[0].index,
                n = t[0].index;
            for (let e = 1; e < t.length; e++) r = Math.min(r, t[e].index), n = Math.max(n, t[e].index);
            const o = Math.floor(s.indexToCoordinate(r) * i),
                a = Math.ceil(s.indexToCoordinate(n) * i);
            (0, X.fillRect)(e, o, 0, a - o, Math.ceil(this.size.height * i) + 1, this._properties.childs().axisHighlightColor.value())
        }
        _addViewsOrMaxMin(e, t) {
            if (e.length <= 1) {
                for (const i of e)
                    if (i.timeAxisViews) {
                        const e = i.timeAxisViews();
                        e && e.length && t.push(e)
                    }
            } else t.push(this._minMaxViews(e))
        }
        _minMaxViews(e) {
            const t = [];
            let i = 1 / 0,
                s = -1 / 0,
                r = null,
                n = null;
            for (const t of e)
                if (t.timeAxisViews) {
                    const e = t.timeAxisViews();
                    if (e && e.length)
                        for (let t = 0; t < e.length; ++t) {
                            const o = e[t],
                                a = o.coordinate();
                            a >= s && (s = a, n = o), a <= i && (i = a, r = o)
                        }
                } return n && t.push(n), r && t.push(r), t
        }
        _zoomAvailable() {
            return !this.chart.model().timeScale().isEmpty() && this.chart.model().model().zoomEnabled() && this._options.pressedMouseMoveScale
        }
        _mouseDownOrTouchStartEvent(e) {
            if (this._mousedown || !this._zoomAvailable()) return;
            this._mousedown = !0;
            const t = this.chart.model();
            t.timeScale().isEmpty() || t.startScaleTime(e.localX)
        }
        _pressedMouseOrTouchMoveEvent(e) {
            this._zoomAvailable() && this.chart.model().scaleTimeTo(e.localX)
        }
        _mouseUpOrTouchEndEvent(e) {
            this._zoomAvailable() && (this._mousedown = !1, this.chart.model().endScaleTime(), this.restoreDefaultCursor())
        }
        _contextMenuOrTouchContextMenuEvent(e) {
            this._options.contextMenuEnabled && he.ContextMenuManager.showMenu(this.getContextMenuActions(), e, {
                statName: "TimeScaleContextMenu"
            }, {
                menuName: "TimeScaleContextMenu"
            })
        }
        _mouseOrTouchEnterEvent(e) {
            this._zoomAvailable() && this.setCursor("ew-resize")
        }
        _mouseOrTouchLeaveEvent(e) {
            this.restoreDefaultCursor()
        }
        _mouseDoubleClickOrDoubleTapEvent(e) {
            (0, fe.trackEvent)("GUI", "Double click time scale"), this.chart.model().resetTimeScale()
        }
        _areEventsEnabled() {
            return !(0, Y.hideMarksOnBars)().value()
        }
    }

    function Xt(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }

    function Jt(e) {
        return e.reduce(((e, t) => {
            for (const i in t)
                if (Xt(t, i)) {
                    const s = t[i],
                        r = e[i];
                    r ? r.push(s) : e[i] = [s]
                } return e
        }), {})
    }
    const Qt = new z.TranslatedString("move left", o.t(null, void 0, i(15086))),
        ei = new z.TranslatedString("move right", o.t(null, void 0, i(61711))),
        ti = {
            moving: "wait_finishing",
            wait_finishing: "stop",
            stop: "moving"
        };
    class ii {
        constructor(e) {
            this._chartModel = null, this._currentDistance = 0, this._deferredFinishTimeout = 0, this._finishingTimeout = 0, this._moveType = "", this._startTime = 0, this._state = "stop", this._movingTimeout = 0, this._chart = e, this._chart.withModel(this, (() => {
                this._chartModel = this._chart.model()
            }))
        }
        destroy() {
            clearTimeout(this._movingTimeout)
        }
        move(e) {
            if (null !== this._chartModel && "stop" === this._state && this._chartModel.beginUndoMacro(1 === e ? Qt : ei), this._state = ti.stop, this._moveType = "animated", this._deferredFinishTimeout && (clearTimeout(this._deferredFinishTimeout), this._deferredFinishTimeout = 0), this._finishingTimeout && (clearTimeout(this._finishingTimeout), this._finishingTimeout = 0), this._startTime = Date.now(), 0 === this._movingTimeout) {
                const t = this._startTime,
                    i = 10,
                    s = () => {
                        this.moveStep(t, 0, 50 * e, 1e3), this._movingTimeout = setTimeout(s, i)
                    };
                this._movingTimeout = setTimeout(s, i)
            }
        }
        moveStep(e, t, i, s) {
            if (null !== this._chartModel && !this._chartModel.timeScale().isEmpty()) {
                const r = Date.now();
                r < e && (e = r);
                let n = (r - e) / s;
                (n > 1 || !isFinite(n)) && (n = 1);
                const o = 1 - Math.pow(1 - n, 3);
                return this._currentDistance = (i - t) * o + t, this._chartModel.scrollChart(this._currentDistance), n
            }
        }
        moveByBar(e) {
            if (null !== this._chartModel) {
                const t = this._chartModel.timeScale();
                if (t.isEmpty()) return;
                if ("stop" === this._state && this._chartModel.beginUndoMacro(1 === e ? Qt : ei), null !== t.visibleBarsStrictRange()) {
                    const e = t.indexToCoordinate(t.visibleBarsStrictRange().lastBar()) + t.barSpacing() / 2;
                    Math.abs(t.width() - e) > t.barSpacing() / 6 && this._chartModel.scrollChart(t.width() - e)
                }
                if (this._state = ti.stop, this._moveType = "by_bar", this._startTime = Date.now(), !this._movingTimeout) {
                    let t = 0,
                        i = 150;
                    const s = 400,
                        r = () => {
                            this._moveByBarStep(e), t++, i > 100 && (i -= t / 5 * 20), this._movingTimeout = setTimeout(r, i)
                        };
                    this._movingTimeout = setTimeout(r, s), this._moveByBarStep(e)
                }
            }
        }
        stopMove() {
            "by_bar" === this._moveType ? this.stopMoveByBar() : this._stopMove()
        }
        stopMoveByBar() {
            "moving" === this._state && (clearTimeout(this._movingTimeout), this._movingTimeout = 0, this._state = ti.wait_finishing, this._moveType = "", this._movingTimeout = 0, this._currentDistance = 0, null !== this._chartModel && this._chartModel.endUndoMacro())
        }
        scrollToRealtime(e) {
            null !== this._chartModel && this._chartModel.timeScale().scrollToRealtime(e)
        }
        _finishMove() {
            clearTimeout(this._movingTimeout), this._movingTimeout = 0, this._deferredFinishTimeout = 0;
            const e = this._currentDistance,
                t = Date.now(),
                i = () => {
                    const s = this.moveStep(t, e, 0, 700);
                    s && s < 1 ? this._finishingTimeout = setTimeout(i, 10) : null !== this._chartModel && (this._state = ti.wait_finishing,
                        this._moveType = "", this._movingTimeout = 0, this._currentDistance = 0, this._chartModel.endUndoMacro())
                };
            this._finishingTimeout = setTimeout(i, 10)
        }
        _stopMove() {
            "moving" === this._state && (this._state = ti.moving, Date.now() - this._startTime < 200 ? this._deferredFinishTimeout = setTimeout(this._finishMove.bind(this), 200 - (Date.now() - this._startTime)) : this._finishMove())
        }
        _moveByBarStep(e) {
            if (null !== this._chartModel) {
                if (this._chartModel.timeScale().isEmpty()) return;
                this._chartModel.scrollChartByBar(e)
            }
        }
    }
    var si = i(36174);
    const ri = (0, a.getLogger)("ChartApi.AbstractSession");
    class ni extends class {
        constructor(e, t, i) {
            this._isConnected = new(lt())(!1), this._state = 0, this._isConnectForbidden = !1, this._sessionId = "", this._sessionIdChanged = new(ce()), this._chartApi = e, this._sessionPrefix = t, this._shouldReconnectAfterCriticalError = i
        }
        destroy() {
            this._logNormal("Destroying session"), this._isConnected.unsubscribe(), this.disconnect(), this._sessionIdChanged.destroy(), delete this._chartApi, this._logNormal("Session has been destroyed")
        }
        isConnected() {
            return this._isConnected
        }
        sessionId() {
            return this._sessionId
        }
        onSessionIdChanged() {
            return this._sessionIdChanged
        }
        connect() {
            0 === this._state && ((0, r.assert)(!this._isConnectForbidden, "Cannot call connect because it is forbidden at this moment"), this._setSessionId(`${this._sessionPrefix}_${(0,si.randomHash)()}`), this._logNormal("Connecting session - wait until transport stay connected"), this._state = 1, this._chartApi.createSession(this._sessionId, this))
        }
        disconnect() {
            0 !== this._state && ((0, r.assert)("" !== this._sessionId, "sessionId must not be invalid"), this._logNormal("Disconnecting session..."), this._forbidConnectWhile((() => {
                this._chartApi.connected() && this._sendRemoveSession(), this._processDestroyingOnServer()
            })))
        }
        onMessage(e) {
            switch (e.method) {
                case "connected":
                    return void this._onChartApiConnected();
                case "disconnected":
                    return void this._onChartApiDisconnected();
                case "critical_error":
                    const t = String(e.params[0]),
                        i = String(e.params[1]);
                    return void this._onCriticalError(t, i)
            }
            this._onMessage(e)
        }
        _getChartApi() {
            return this._chartApi
        }
        _generateLogMessage(e) {
            return `[${this._sessionId}] ${e}`
        }
        _onCriticalError(e, t) {
            this._logError(`Critical error. Reason=${e}, info=${t}.`), this._forbidConnectWhile((() => {
                this._processDestroyingOnServer()
            })), this._shouldReconnectAfterCriticalError ? (this._logNormal("Reconnecting after critical error..."), this.connect()) : this._logNormal("Reconnecting after critical error skipped")
        }
        _onChartApiConnected() {
            (0, r.assert)(1 === this._state, "Session is not registered"), this._logNormal("Transport is connected. Creating session on the server"), this._sendCreateSession(), this._state = 2, this._isConnected.setValue(!0)
        }
        _onChartApiDisconnected() {
            this._logNormal("Transport is disconnected. Reconnecting..."), this._forbidConnectWhile((() => {
                this._processDestroyingOnServer()
            })), this.connect()
        }
        _setSessionId(e) {
            const t = this._sessionId;
            this._logNormal(`Changing sessionId: old=${t}, new=${e}`), this._sessionId = e, this._sessionIdChanged.fire(e, t)
        }
        _logNormal(e) {
            ri.logNormal(this._generateLogMessage(e))
        }
        _logError(e) {
            ri.logError(this._generateLogMessage(e))
        }
        _processDestroyingOnServer() {
            this._state = 0, this._isConnected.setValue(!1), this._chartApi.removeSession(this._sessionId), this._setSessionId("")
        }
        _forbidConnectWhile(e) {
            this._isConnectForbidden = !0, e(), this._isConnectForbidden = !1
        }
    } {
        constructor(e, t = !1) {
            super(e, "cs", !1), this._sessionDisabled = !1, this._handler = null, this._criticalError = new(ce()), this._symbolResolveMap = new Map, this._disableStatistics = t
        }
        destroy() {
            this._criticalError.destroy(), this._handler = null, this._symbolResolveMap.clear(), super.destroy()
        }
        serverTimeOffset() {
            return this._getChartApi().serverTimeOffset()
        }
        switchTimezone(e) {
            return this._getChartApi().switchTimezone(this.sessionId(), e)
        }
        defaultResolutions() {
            return this._getChartApi().defaultResolutions()
        }
        availableCurrencies() {
            return this._getChartApi().availableCurrencies()
        }
        availableUnits() {
            return this._getChartApi().availableUnits()
        }
        availablePriceSources(e) {
            return this._getChartApi().availablePriceSources(e)
        }
        resolveSymbol(e, t, i) {
            if (this._symbolResolveMap.has(t)) {
                const [e, s] = this._symbolResolveMap.get(t);
                return Array.isArray(s) ? s.push(i) : s.then(i), e
            } {
                const s = [i];
                return this._getChartApi().resolveSymbol(this.sessionId(), e, t, (i => {
                    "symbol_error" === i.method ? this._symbolResolveMap.delete(t) : this._symbolResolveMap.set(t, [e, Promise.resolve(i)]), s.forEach((e => e(i)))
                })), this._symbolResolveMap.set(t, [e, s]), e
            }
        }
        requestFirstBarTime(e, t, i) {
            return this._getChartApi().requestFirstBarTime(this.sessionId(), e, t, i)
        }
        createSeries(e, t, i, s, r, n, o) {
            return this._getChartApi().createSeries(this.sessionId(), e, t, i, s, r, n, o)
        }
        modifySeries(e, t, i, s, r, n) {
            return this._getChartApi().modifySeries(this.sessionId(), e, t, i, s, r, n)
        }
        removeSeries(e) {
            return !!this.isConnected().value() && this._getChartApi().removeSeries(this.sessionId(), e)
        }
        requestMoreData(e, t, i) {
            return "number" == typeof e ? this._getChartApi().requestMoreData(this.sessionId(), e) : this._getChartApi().requestMoreData(this.sessionId(), e, t, i)
        }
        requestMoreTickmarks(e, t, i) {
            return (0, y.isNumber)(e) ? this._getChartApi().requestMoreTickmarks(this.sessionId(), e) : this._getChartApi().requestMoreTickmarks(this.sessionId(), e, t, i)
        }
        requestMetadata(e, t) {
            this._getChartApi().requestMetadata(this.sessionId(), e, t)
        }
        canCreateStudy(e) {
            return this._getChartApi().canCreateStudy(e)
        }
        getStudyCounter() {
            return this._getChartApi().getStudyCounter()
        }
        createStudy(e, t, i, s, r, n, o) {
            return this._getChartApi().createStudy(this.sessionId(), e, t, i, s, r, n, o)
        }
        rebindStudy(e, t, i, s, r, n, o) {
            return this._getChartApi().rebindStudy(this.sessionId(), e, t, i, s, r, n, o)
        }
        modifyStudy(e, t, i, s, r) {
            return this._getChartApi().modifyStudy(this.sessionId(), e, t, i, s, r)
        }
        removeStudy(e, t) {
            return this._getChartApi().removeStudy(this.sessionId(), e, t)
        }
        createPointset(e, t, i, s, r, n) {
            return this._getChartApi().createPointset(this.sessionId(), e, t, i, s, r, n)
        }
        modifyPointset(e, t, i, s) {
            return this._getChartApi().modifyPointset(this.sessionId(), e, t, i, s)
        }
        removePointset(e) {
            return this._getChartApi().removePointset(this.sessionId(), e)
        }
        setVisibleTimeRange(e, t, i, s, r, n) {
            this._getChartApi().setVisibleTimeRange(this.sessionId(), e, t, i, s, !0, r, n)
        }
        criticalError() {
            return this._criticalError
        }
        connect(e = null) {
            null !== e && (this._handler = e), this._symbolResolveMap.clear(), super.connect()
        }
        setHandler(e) {
            this._handler = e
        }
        connected() {
            return this.isConnected().value() && !this._sessionDisabled
        }
        disable() {
            this._sessionDisabled = !0
        }
        chartApi() {
            return this._getChartApi()
        }
        _sendCreateSession() {
            Object.keys(this).forEach((e => {
                /^(s|st|symbol_)\d+$/.test(e) && delete this[e]
            })), this._getChartApi().chartCreateSession(this.sessionId(), this._disableStatistics)
        }
        _sendRemoveSession() {
            this._getChartApi().chartDeleteSession(this.sessionId())
        }
        _onMessage(e) {
            this._handler && this._handler(e)
        }
        _onCriticalError(e, t) {
            this._criticalError.fire(e, t), super._onCriticalError(e, t)
        }
    }
    var oi = i(42960),
        ai = i(94025);
    class li {
        constructor() {
            this._draggingSource = null, this._activeTouchPanes = new Set, this._scrollingPane = null, this._pinchingPane = null
        }
        onPaneDestroyed(e) {
            this._activeTouchPanes.delete(e), this._scrollingPane === e && (this._scrollingPane = null), this._pinchingPane === e && (this._pinchingPane = null)
        }
        startTouch(e) {
            this._activeTouchPanes.add(e)
        }
        endTouch(e) {
            this._activeTouchPanes.delete(e)
        }
        hasTouchesOnOtherPanes(e) {
            return this._activeTouchPanes.size > 1 || 1 === this._activeTouchPanes.size && !this._activeTouchPanes.has(e)
        }
        trySetDraggingSource(e, t) {
            return !this.hasTouchesOnOtherPanes(t) && ((0, r.assert)(null === this._draggingSource || this._draggingSource === e), this._draggingSource = e, !0)
        }
        clearDraggingSource() {
            null !== this._draggingSource && (this._draggingSource = null)
        }
        draggingSource() {
            return this._draggingSource
        }
        setScrollingPane(e) {
            (0, r.assert)(null === e || null === this._scrollingPane || this._scrollingPane === e), this._scrollingPane = e
        }
        scrollingPane() {
            return this._scrollingPane
        }
        setPinchingPane(e) {
            (0, r.assert)(null === e || null === this._pinchingPane || this._pinchingPane === e), this._pinchingPane = e
        }
        pinchingPane() {
            return this._pinchingPane
        }
    }
    let ci = null;
    i(59744);

    function hi(e, t, s, r, n) {
        return Promise.all([i.e(77), i.e(7201), i.e(8884), i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(6), i.e(5993), i.e(5649), i.e(2191), i.e(6221), i.e(8056), i.e(2587), i.e(3502), i.e(8149), i.e(2639), i.e(2109), i.e(4015), i.e(4215), i.e(218), i.e(6625), i.e(9327), i.e(7194), i.e(6884), i.e(6036), i.e(2984), i.e(3980), i.e(5403), i.e(3889), i.e(4894), i.e(7391), i.e(7555), i.e(962), i.e(2842), i.e(9727), i.e(4403), i.e(4713), i.e(5901), i.e(1958), i.e(4378), i.e(6265)]).then(i.bind(i, 91595)).then((i => {
            const o = new(0, i.EditObjectDialogRenderer)(e, t, r, n);
            return o.show(s), o
        }))
    }
    let di = null;
    var ui = i(58229);
    const pi = {
            [pt.TabNames.symbol]: "symbol",
            [pt.TabNames.legend]: "legend",
            [pt.TabNames.scales]: "scales",
            [pt.TabNames.trading]: "trading",
            [pt.TabNames.events]: "events",
            [pt.TabNames.timezoneSessions]: "appearance",
            [pt.TabNames.text]: "text",
            [pt.TabNames.style]: "style",
            [pt.TabNames.visibility]: "visibility"
        },
        _i = {
            [pt.TabNames.style]: "style",
            [pt.TabNames.visibility]: "visibilities"
        };
    async function mi(e, t, s = {}, r, n) {
        const o = r.activeChartWidget.value(),
            {
                initialTab: a,
                tabName: l
            } = s;
        if (l && !a && (s.initialTab = _i[l]), (0, E.isStudyLineTool)(e) && function(e) {
                return [ui.LineToolVbPFixed].some((t => e instanceof t))
            }(e)) return o.propertiesDefinitionsForSource(e).then((i => null !== i ? hi(e, t, s, n, i) : null));
        if ((0, V.isStudy)(e) && function(e) {
                const {
                    shortId: t
                } = e.metaInfo();
                return "Overlay" === t
            }(e) || (0, E.isLineTool)(e)) return o.propertiesDefinitionsForSource(e).then((r => {
            if (null !== r) {
                return function(e) {
                    return Promise.all([i.e(77), i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(6), i.e(5993), i.e(5649), i.e(2191), i.e(6221), i.e(8056), i.e(2587), i.e(3502), i.e(8149), i.e(2639), i.e(2109), i.e(4015), i.e(4215), i.e(218), i.e(6625), i.e(9327), i.e(7194), i.e(6884), i.e(2984), i.e(3980), i.e(5403), i.e(3889), i.e(7391), i.e(8904), i.e(962), i.e(2842), i.e(9727), i.e(4403), i.e(4713), i.e(5901), i.e(1958), i.e(4378), i.e(6780)]).then(i.bind(i, 75892)).then((t => {
                        const i = new(0, t.SourcePropertiesEditorRenderer)(e);
                        return null !== di && di.hide(), i.show({
                            shouldReturnFocus: e.shouldReturnFocus
                        }), di = i, i
                    }))
                }({
                    propertyPages: r,
                    model: t,
                    source: e,
                    activePageId: l && pi[l],
                    shouldReturnFocus: s.shouldReturnFocus
                })
            }
            return null
        }));
        if ((0, V.isStudy)(e)) return hi(e, t, s, n);
        {
            const e = l && pi[l],
                t = r.getChartPropertiesDialogRenderer();
            return t.setActivePage(e), t.show(s)
        }
    }
    var gi = i(38618),
        fi = i(82723),
        vi = i(93613),
        Si = i(1803);
    class yi {
        constructor(e, t) {
            this._showed = !1, this._cw = e, this._element = document.createElement("div"), this._element.classList.add("chart-loading-screen"), this._shield = document.createElement("div"), this._shield.classList.add("chart-loading-screen-shield"), this._element.appendChild(this._shield), t.appendChild(this._element), this._cw.withModel(this, this._connectToModel)
        }
        show(e) {
            if (e) {
                const e = this._cw.model().mainSeries().status();
                if (1 !== e && 2 !== e) return
            }
            this._cw.setInLoadingState(!0), this._showed || (this._showed = !0, this._show())
        }
        hide() {
            this._cw.setInLoadingState(!1), this._showed && this._hide()
        }
        isShown() {
            return this._showed
        }
        _connectToModel() {
            const e = this._cw.model().mainSeries().dataEvents();
            e.symbolError().subscribe(this, (e => {
                e !== Si.permissionDenied && this.hide()
            })), e.seriesError().subscribe(this, (() => {
                (0, Oe.enabled)("hide_loading_screen_on_series_error") && this.hide()
            })), e.completed().subscribe(this, this.hide)
        }
        _show() {
            const e = this._cw.properties().childs().paneProperties.childs();
            let t;
            if (e.backgroundType.value() === vi.ColorType.Solid) t = e.background.value();
            else {
                t = `linear-gradient(${e.backgroundGradientStartColor.value()},${e.backgroundGradientEndColor.value()})`
            }
            this._shield.style.background = t, this._element.classList.add("fade")
        }
        _hide() {
            this._showed = !1, this._element.classList.remove("fade")
        }
    }
    var bi = i(78071),
        wi = i(4949);
    const Pi = (0, F.getHexColorByName)("color-cold-gray-700"),
        Ci = (0, F.getHexColorByName)("color-cold-gray-400");
    class xi {
        constructor(e) {
            this._container = null, this._errorCardRenderer = null, this._mainSeriesErrorMessage = null, this._banErrorMessage = null, this._errorMessageHandler = e => {
                this._chartWidget.hasModel() ? this._updatePaneWidgets(e) : this._renderErrorWithoutModel(e)
            }, this._chartWidget = e, this._subscribeToMainSeriesErrors()
        }
        destroy() {
            var e, t, i;
            null === (e = this._mainSeriesErrorMessage) || void 0 === e || e.destroy(), null === (t = this._banErrorMessage) || void 0 === t || t.destroy(),
                null === (i = this._errorCardRenderer) || void 0 === i || i.then((e => {
                    e.container.remove(), e.destroy()
                }))
        }
        updatePaneWidgets() {
            this._updatePaneWidgets()
        }
        setContainer(e) {
            var t;
            if (this._container !== e) {
                this._container = e, null === (t = this._errorCardRenderer) || void 0 === t || t.then((e => e.container.remove()));
                const i = this._getErrorMessage();
                i && this._errorMessageHandler(i)
            }
        }
        _updatePaneWidgets(e = this._getErrorMessage()) {
            this._chartWidget.paneWidgets().forEach((t => t.setErrorMessage(e)))
        }
        async _renderErrorWithoutModel(e) {
            if (null === this._container || null === e && null === this._errorCardRenderer) return;
            const t = await this._getErrorCardRenderer();
            this._container.contains(t.container) || this._container.appendChild(t.container), t.update(this._createErrorCardRendererState(e))
        }
        async _getErrorCardRenderer() {
            return this._errorCardRenderer || (this._errorCardRenderer = this._createErrorCardRenderer())
        }
        async _createErrorCardRenderer() {
            return new(await gt())
        }
        _createErrorCardRendererState(e) {
            return e ? {
                message: e.message,
                icon: e.icon,
                textColor: ye.watchedTheme.value() === be.StdTheme.Dark ? Ci : Pi,
                backgroundColor: ye.watchedTheme.value() === be.StdTheme.Dark ? "#131722" : "#FFF",
                solutionId: e.solutionId
            } : {
                message: null
            }
        }
        _subscribeToMainSeriesErrors() {
            const e = this._chartWidget;
            e.withModel(this, (() => {
                const t = e.model().model().mainSeries();
                this._mainSeriesErrorMessage = (0, b.combine)(((e, t) => {
                    if (e) return e;
                    switch (t) {
                        case "invalid_symbol":
                            return {
                                message: "Invalid symbol", icon: "ghost"
                            };
                        case "no_data":
                            return {
                                message: "No data here", icon: "ghost"
                            };
                        case null:
                            return null
                    }
                }), this._banErrorMessage || new(lt())(null).readonly(), (0, oi.getSeriesDisplayErrorWV)(t)), this._mainSeriesErrorMessage.subscribe(this._errorMessageHandler, {
                    callWithLast: !0
                })
            }))
        }
        _getErrorMessage() {
            var e, t;
            return (null === (e = this._banErrorMessage) || void 0 === e ? void 0 : e.value()) || (null === (t = this._mainSeriesErrorMessage) || void 0 === t ? void 0 : t.value()) || null
        }
    }
    var Ti = i(33703),
        Ii = i(59452),
        Mi = i.n(Ii);
    async function Ai(e, t, s, r, n, a = "default") {
        let l, c = [];
        const h = e.model().model(),
            d = (0, y.clone)(t),
            u = new(Mi())({
                inputs: d
            }),
            p = function(e, t) {
                return "symbol" === t ? e.inputs.filter((t => t.id === e.symbolInputId())) : e.inputs.filter((e => e.confirm))
            }(s, a),
            _ = () => {
                l && h.removeCustomSource(l)
            },
            m = () => {
                _(), n()
            },
            g = e => {
                r({
                    inputs: e,
                    parentSources: c
                }), _()
            },
            f = p.filter(Ti.isTimeOrPriceNotHiddenInput);
        if (f.length > 0) try {
            const t = await Promise.all([i.e(77), i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(6), i.e(5993), i.e(2191), i.e(6221), i.e(8056), i.e(2587), i.e(3502), i.e(2639), i.e(2109), i.e(4015), i.e(4215), i.e(218), i.e(6625), i.e(9327), i.e(7194), i.e(6884), i.e(2984), i.e(1762), i.e(962), i.e(2842), i.e(3016), i.e(3179), i.e(9727), i.e(4403), i.e(4713), i.e(5901), i.e(3030)]).then(i.bind(i, 73339)),
                r = await t.selectInputValuesOnChart(e, f, u, s.shortDescription, s.inputs);
            if (l = r.customSourceId, r.destPane) {
                const e = r.destPane.mainDataSource();
                c = e === h.mainSeries() ? [] : [e]
            } else c = []
        } catch (e) {
            return void m()
        }
        f.length !== p.length ? Promise.all([i.e(77), i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(6), i.e(5993), i.e(2191), i.e(6221), i.e(8056), i.e(2587), i.e(3502), i.e(2639), i.e(2109), i.e(4015), i.e(4215), i.e(218), i.e(6625), i.e(9327), i.e(7194), i.e(6884), i.e(2984), i.e(1762), i.e(962), i.e(2842), i.e(3016), i.e(3179), i.e(9727), i.e(4403), i.e(4713), i.e(5901), i.e(3030)]).then(i.bind(i, 29638)).then((t => {
            const r = new t.ConfirmInputsDialogRenderer(function(e) {
                if ("symbol" === e) return o.t(null, void 0, i(45743));
                return o.t(null, void 0, i(46689))
            }(a), p, u, a, s, e.model(), g, m);
            return r.show(), r
        })) : g(u.state().inputs || {})
    }
    var Li = i(60156),
        ki = i(36274);
    var Ei = i(85804),
        Di = i(75531);
    const Vi = (0, a.getLogger)("ChartWidget", {
            color: "#606"
        }),
        Bi = (0, Oe.enabled)("chart_content_overrides_by_defaults"),
        Ri = new z.TranslatedString("hide {title}", o.t(null, void 0, i(70301)));
    const Ni = {
        addToWatchlistEnabled: !0,
        showFinancialsEnabled: !1,
        sourceSelectionEnabled: !0,
        propertyPagesEnabled: !0,
        paneContextMenuEnabled: !0,
        priceScaleContextMenuEnabled: !0,
        currencyConversionEnabled: !1,
        unitConversionEnabled: !1,
        goToDateEnabled: !1,
        marketStatusWidgetEnabled: !0,
        chartWarningWidgetEnabled: !0,
        dataProblemWidgetEnabled: !0,
        paneControlsEnabled: !0,
        isSymbolAvailable: e => Promise.resolve(!0),
        legendWidgetEnabled: !0,
        chartEventsEnabled: !0,
        esdEnabled: !1,
        latestUpdatesEnabled: {
            news: !1,
            minds: !1
        },
        continuousContractSwitchesEnabled: !1,
        futuresContractExpirationEnabled: !1,
        croppedTickMarks: !0,
        countdownEnabled: !0,
        lastPriceAnimationEnabled: !0,
        useKineticScroll: h.CheckMobile.any(),
        indicatorsDialogShortcutEnabled: !0,
        handleScale: {
            mouseWheel: !0,
            pinch: !0,
            axisPressedMouseMove: {
                time: !0,
                price: !0
            }
        },
        handleScroll: {
            mouseWheel: !0,
            pressedMouseMove: !0,
            horzTouchDrag: !0,
            vertTouchDrag: !0
        }
    };

    function Oi(e, t, i, s = 0) {
        const r = t.mainSeries().syncModel(),
            n = e.mainSeries().syncModel();
        let o = i;
        if (null !== r && null !== n) {
            const t = e.createSyncPoint(r.syncSourceTarget(), n.syncSourceTarget());
            0 !== s && (i = r.projectTime(i, s)), o = t.sourceTimeToTargetTime(i)
        }
        return e.timeScale().points().roughIndex(o, n && n.distance.bind(n))
    }
    const Fi = ["Overlay@tv-basicstudies", "CorrelationCoefficient@tv-basicstudies", "Correlation Coeff@tv-basicstudies", "Spread@tv-basicstudies", "Ratio@tv-basicstudies"];
    class Wi {
        constructor(e, t, i) {
            this.activePaneWidget = null, this._model = null, this._paneWidgets = [], this._maximizedPaneWidget = null, this._timeAxisWidget = null, this._paneSeparators = [], this._controlBarNavigation = null, this._lineToolsSynchronizer = null, this._modelCreated = new(ce()), this._isDestroyed = !1, this._customLegendWidgetsFactoryMap = new Map, this._backgroundTopTheme = new(lt())("light"), this._backgroundBasedTheme = new(lt())("light"), this._backgroundBottomTheme = new(lt())("light"), this._lhsAxesWidth = 0, this._rhsAxesWidth = 0, this._lhsPriceAxisWidthChanged = new(ce()), this._rhsPriceAxisWidthChanged = new(ce()), this._mainDiv = null, this._parent = null, this._elTooltipDiv = null, this._hotkeysListener = null, this._mouseWheelHelper = null, this._onWheelBound = null, this._justActivated = !1, this._inited = !1, this._containsData = !1, this._initialLoading = !1, this._defTimeframe = void 0, this._removeMaximizeHotkey = null,
                this._metaInfoRepository = null, this._invalidationMask = null, this._drawPlanned = !1, this._drawRafId = 0, this._inLoadingState = !1, this._timingsMeter = null, this._tagsChanged = new(ce()), this._redraw = new(ce()), this._isVisible = new(lt())(!0), this._collapsed = new(lt())(!1), this._dataWindowWidget = null, this._resizeHandler = null, this._spinner = null, this._keydownEventListener = null, this._properties = null, this._symbolWV = new(lt()), this._resolutionWV = new(lt()), this._updateThemedColorBound = this._updateThemedColor.bind(this), this._disconnected = new(ce()), this._reconnectBailout = new(ce()), this._connected = new(ce()), this._chartWidgetInitialized = new(ce()), this._saveChartService = null, this._objectTreeDialogController = null, this._chartPaintedPromise = null, this._noExchangeSubscrptionWarning = null, this._paneWidgetsSharedState = new li, this._brokerName = "", this._onZoom = new(ce()), this._onScroll = new(ce()), this._availableScreen = null, this._hoveredPriceAxes = new Set, this._anyAxisHovered = new(lt())(!1), this._linkingGroupIndex = new(lt())(null), this._showDataWindowAction = null, this._invalidationHandler = e => {
                    if (!(e instanceof R.InvalidationMask)) throw new Error("Invalid mask");
                    null !== this._invalidationMask ? this._invalidationMask.merge(e) : this._invalidationMask = e, this._drawPlanned || (this._drawPlanned = !0, this._options.visible.when((() => {
                        const e = !document.hidden,
                            t = this.screen && this.screen.isShown();
                        null !== this._timingsMeter && e && !t && this._timingsMeter.startWaitingDraw();
                        const i = (0, r.ensureNotNull)((0, r.ensureNotNull)(this._parent).ownerDocument.defaultView);
                        this._drawRafId = i.requestAnimationFrame(this._invalidationRAFCallback.bind(this))
                    })))
                }, this._onChartSessionIsConnectedChanged = e => {
                    e ? this._onConnection() : this._onDisconnect()
                }, this._subscribeToBanInfo = e => {
                    var t, i;
                    e ? null === (t = this._spinner) || void 0 === t || t.stop() : null === (i = this._spinner) || void 0 === i || i.spin()
                }, this._id = t, this._layoutId = i, this._options = (0, y.merge)((0, y.clone)(Ni), e), this._options.customLegendWidgetFactories && (this._customLegendWidgetsFactoryMap = this._options.customLegendWidgetFactories), this._subscribeToDrawingState(), this._chartWidgetCollection = this._options.chartWidgetCollection, this.withModel(this, (() => {
                    const e = this.model().model();
                    e.backgroundTopColor().subscribe(this._updateThemedColorBound), e.backgroundColor().subscribe(this._updateThemedColorBound)
                })), this._errorRenderer = new xi(this), this._scrollHelper = new ii(this), this._objectTreeDialogController = m.getInstance(), this._properties = new B.DefaultProperty("chartproperties", void 0, void 0, this._options.useUserChartPreferences), this._properties.addExclusion("scalesProperties.axisHighlightColor"), this._properties.addExclusion("scalesProperties.axisLineToolLabelBackgroundColorActive"), this._properties.addExclusion("scalesProperties.axisLineToolLabelBackgroundColorCommon"), this._properties.addExclusion("scalesProperties.showPriceScaleCrosshairLabel"), this._properties.addExclusion("scalesProperties.showTimeScaleCrosshairLabel"), this._properties.addExclusion("scalesProperties.crosshairLabelBgColorLight"),
                this._properties.addExclusion("scalesProperties.crosshairLabelBgColorDark"), this._startSpinner(this._options.container.value()), this._chartSession = new ni(window.ChartApiInstance), this._metaInfoRepository = new M(this._chartSession), this._isMultipleLayout = (0, b.combine)((e => (0, Di.isMultipleLayout)(e)), this._chartWidgetCollection.layout)
        }
        destroy() {
            var e, t;
            null === (e = this._lineToolsSynchronizer) || void 0 === e || e.destroy(), null === (t = this._noExchangeSubscrptionWarning) || void 0 === t || t.destroy(), window.loginStateChange.unsubscribe(this, this._handleLoginStateChanged), null !== this._model && (this._model.model().backgroundTopColor().unsubscribe(this._updateThemedColorBound), this._model.model().backgroundColor().unsubscribe(this._updateThemedColorBound), this._model.destroy()), this._customLegendWidgetsFactoryMap.clear(), this._scrollHelper.destroy(), this._errorRenderer.destroy(), this._chartSession.criticalError().unsubscribe(this, this._onChartSessionCriticalError), this._chartSession.isConnected().unsubscribe(this._onChartSessionIsConnectedChanged), this._chartSession.destroy(), this._isDestroyed = !0
        }
        emulateCriticalError() {
            this._chartSession.removeSeries("-1")
        }
        chartSession() {
            return this._chartSession
        }
        onDisconnected() {
            return this._disconnected
        }
        onReconnectBailout() {
            return this._reconnectBailout
        }
        onConnected() {
            return this._connected
        }
        chartWidgetInitialized() {
            return this._chartWidgetInitialized
        }
        setVisibleTimeRange(e, t, i, s) {
            {
                const n = this.model().mainSeries().seriesSource();
                this._chartSession.setVisibleTimeRange((0, r.ensureNotNull)(n.instanceId()), n.turnaround(), e, t, null != i ? i : {}, null != s ? s : () => {})
            }
        }
        lineToolsSynchronizer() {
            return this._lineToolsSynchronizer
        }
        requestFullscreen() {
            this.getResizerDetacher().requestFullscreen()
        }
        exitFullscreen() {
            this.getResizerDetacher().exitFullscreen()
        }
        inFullscreen() {
            return this.getResizerDetacher().fullscreen.value()
        }
        model() {
            return (0, r.ensureNotNull)(this._model)
        }
        id() {
            return this._id
        }
        layoutId() {
            return this._layoutId
        }
        crossHairSyncEnabled() {
            return this._chartWidgetCollection.lock.crosshair.value()
        }
        isVisible() {
            return this._isVisible.value()
        }
        setVisible(e) {
            this._isVisible.setValue(e)
        }
        setCollapsed(e) {
            this._collapsed.setValue(e)
        }
        isJustClonedChart() {
            return !!(this._options || {}).justCloned
        }
        getSymbol(e) {
            var t, i, s, r;
            let n;
            return n = this._model ? this._model.mainSeries().properties().childs() : this.properties().childs().mainSeriesProperties.childs(), n ? e && n.shortName && n.shortName.value() ? null !== (i = null === (t = n.shortName) || void 0 === t ? void 0 : t.value()) && void 0 !== i ? i : "" : null !== (r = null === (s = n.symbol) || void 0 === s ? void 0 : s.value()) && void 0 !== r ? r : "" : ""
        }
        setSymbol(e) {
            this._model ? (this._symbolWV.setValue(e), this._model.setSymbol(this._model.mainSeries(), e)) : (this.properties().childs().mainSeriesProperties.merge({
                symbol: e
            }), this._symbolWV.setValue(e))
        }
        setResolution(e) {
            this._model ? (this._resolutionWV.setValue(e), this._model.setResolution(this._model.mainSeries(), e)) : (this.properties().childs().mainSeriesProperties.merge({
                interval: e
            }), this._resolutionWV.setValue(e))
        }
        getResolution() {
            return this._model ? this._model.mainSeries().properties().childs().interval.value() : this.properties().childs().mainSeriesProperties.childs().interval.value()
        }
        symbolWV() {
            return this._symbolWV.readonly()
        }
        resolutionWV() {
            return this._resolutionWV.readonly()
        }
        loadRange(e) {
            if (this._model) {
                this.screen.show();
                this._model.loadRange(e) || this.screen.hide()
            }
        }
        async showGeneralChartProperties(e, t) {
            if (!Oe.enabled("show_chart_property_page")) return Promise.resolve(null);
            const s = await this._showChartProperties(this.model().mainSeries(), e, {
                doNotCloseOnBgClick: !0,
                onResetToDefault: async () => {
                    this.model().restorePreferences();
                    const e = await Promise.resolve().then(i.bind(i, 5286)),
                        t = e.getCurrentTheme().name;
                    e.loadTheme(this.chartWidgetCollection(), {
                        themeName: t,
                        standardTheme: !0
                    })
                },
                shouldReturnFocus: null == t ? void 0 : t.shouldReturnFocus
            });
            if (null === s) return null;
            const r = () => {
                s.hide(), this._chartWidgetCollection.activeChartWidget.unsubscribe(r)
            };
            return this._chartWidgetCollection.activeChartWidget.subscribe(r), s
        }
        showChartPropertiesForSource(e, t, i, s) {
            return Oe.enabled("property_pages") && e.userEditEnabled() ? e === this.model().model().mainSeries() ? this.showGeneralChartProperties(t) : ((i = i || {}).onResetToDefault = () => {
                ((0, E.isLineTool)(e) || (0, V.isStudy)(e)) && this.model().restorePropertiesForSource.bind(this._model, e)
            }, this._showChartProperties(e, t, i, s)) : Promise.resolve(null)
        }
        async showChartPropertiesForSources(e) {
            if (!(0, Oe.enabled)("property_pages")) return Promise.resolve(null);
            const {
                sources: t,
                title: s,
                tabName: n,
                renamable: a
            } = e, l = (0, r.ensureNotNull)(this._model), c = Jt(t.map((e => e.properties().childs()))), h = Jt(t.map((e => e.properties().childs().intervalsVisibilities))), [{
                createPropertyPage: d
            }, {
                getSelectionStylePropertiesDefinitions: u
            }, {
                getSelectionIntervalsVisibilitiesPropertiesDefinition: p
            }, {
                getSelectionCoordinatesPropertyDefinition: _
            }] = await Promise.all([Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 73955)), Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 43940)), Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 97456)), Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 41339))]);
            return async function(e) {
                const {
                    SourcesPropertiesEditorRenderer: t
                } = await Promise.all([i.e(77), i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(6), i.e(5993), i.e(5649), i.e(2191), i.e(6221), i.e(8056), i.e(2587), i.e(3502), i.e(8149), i.e(2639), i.e(2109), i.e(4015), i.e(4215), i.e(218), i.e(6625), i.e(9327), i.e(7194), i.e(6884), i.e(2984), i.e(3980), i.e(5403), i.e(3889), i.e(7391), i.e(8904), i.e(962), i.e(2842), i.e(9727), i.e(4403), i.e(4713), i.e(5901), i.e(1958), i.e(4378), i.e(6780)]).then(i.bind(i, 66512)), s = new t(e);
                return null !== ci && (ci.hide(), ci = s), s.show(), s
            }({
                sources: t,
                propertyPages: [d(u(c, l), "style", o.t(null, void 0, i(32733))), d({
                    definitions: [_(t, l)]
                }, "displacement", o.t(null, void 0, i(62764))), d(p(h, l), "visibility", o.t(null, void 0, i(21852)))],
                undoModel: l,
                title: s,
                activeTabId: n,
                renamable: a
            })
        }
        getPriceAxisWidthChangedByName(e) {
            return "left" === e ? this._lhsPriceAxisWidthChanged : this._rhsPriceAxisWidthChanged
        }
        getPriceAxisMaxWidthByName(e) {
            return "left" === e ? this._lhsAxesWidth : this._rhsAxesWidth
        }
        timeAxisHeight() {
            return null !== this._timeAxisWidget ? this._timeAxisWidget.size.height : 0
        }
        withModel(e, t) {
            null !== this._model ? t.call(e) : this.modelCreated().subscribe(e, t, !0)
        }
        hasModel() {
            return null !== this._model
        }
        onRedraw() {
            return this._redraw
        }
        copyLineToOtherCharts() {
            const e = (0, r.ensureNotNull)(this._model),
                t = e.selection().lineDataSources().filter((e => e.isSynchronizable()));
            e.copyToOtherCharts(t)
        }
        hideDataSources(e) {
            if (e.length) {
                const t = e.map((e => e.properties().visible)),
                    i = e.map((() => !1));
                this.model().setProperties(t, i, Ri.format({
                    title: new z.TranslatedString(e[0].name(), e[0].title())
                }))
            }
        }
        hideSelectedObject() {
            this.hideDataSources(this.model().selection().dataSources().filter((e => !0)))
        }
        unlinkSelectedLine() {
            const e = (0, r.ensureNotNull)(this._model),
                t = e.selection().lineDataSources();
            e.unlinkLines(t)
        }
        onScroll() {
            return this._onScroll
        }
        onZoom() {
            return this._onZoom
        }
        images(e) {
            window.TradingView.printing = !0;
            const t = this.model().selection().allSources();
            this.model().selectionMacro((e => e.clearSelection())), this.model().model().recalculateAllPanes((0, bt.globalChangeEvent)());
            const i = (t, i) => {
                    t.paint(i);
                    const s = {
                        showCollapsedStudies: Boolean(null == e ? void 0 : e.showCollapsedStudies),
                        status: null == e ? void 0 : e.status
                    };
                    return t.getScreenshotData(s)
                },
                s = [];
            if (null !== this._maximizedPaneWidget) {
                const e = this._paneWidgets.indexOf(this._maximizedPaneWidget);
                s.push(i(this._maximizedPaneWidget, R.InvalidationMask.light().invalidateForPane(e)))
            } else
                for (let e = 0; e < this._paneWidgets.length; ++e) {
                    const t = this._paneWidgets[e];
                    s.push(i(t, R.InvalidationMask.light().invalidateForPane(e))), e < this._paneWidgets.length - 1 && s.push(this._paneSeparators[e].image())
                }
            let r;
            this._timeAxisWidget && (this._timeAxisWidget.paint(R.InvalidationLevel.Light), r = this._timeAxisWidget.getScreenshotData()), window.TradingView.printing = !1, this.model().selectionMacro((e => {
                t.forEach((t => {
                    e.addSourceToSelection(t)
                }))
            })), this.model().model().recalculateAllPanes((0, bt.globalChangeEvent)()), this.model().model().lightUpdate();
            const n = this.mainSeriesQuotesAndMetainfo();
            return {
                panes: s,
                timeAxis: r,
                colors: {
                    text: this.properties().childs().scalesProperties.childs().textColor.value(),
                    bg: this.properties().childs().paneProperties.childs().background.value(),
                    scales: this.properties().childs().scalesProperties.childs().lineColor.value()
                },
                meta: n.meta,
                ohlc: n.ohlc,
                quotes: n.quotes
            }
        }
        insertStudy(e, t, i, s) {
            return new Promise((r => {
                0 !== t.length ? window.runOrSignIn((() => {
                    r(this._insertStudy(e, t, i, s))
                }), {
                    source: "study on study"
                }) : r(this._insertStudy(e, t, i, s))
            })).catch((() => null))
        }
        addOverlayStudy(e, t, i) {
            const s = this.model();
            return this._options && this._options.isSymbolAvailable ? this._options.isSymbolAvailable(e).then((r => {
                if (!r) return null;
                const n = s.createStudyInserter({
                        type: "java",
                        studyId: "Overlay@tv-basicstudies"
                    }, []),
                    o = {
                        allowExtendTimeScale: i
                    };
                if (Oe.enabled("use_overrides_for_overlay")) {
                    const e = (0, Ei.factoryDefaults)("study_Overlay@tv-basicstudies.style");
                    o.style = e
                }
                return n.setPropertiesState(o), n.setForceOverlay(t), n.insert((() => Promise.resolve({
                    inputs: {
                        symbol: e
                    },
                    parentSources: []
                })))
            })) : Promise.resolve(null)
        }
        addCompareStudy(e) {
            const t = this.model();
            return this._options && this._options.isSymbolAvailable ? this._options.isSymbolAvailable(e).then((i => i ? t.createStudyInserter({
                type: "java",
                studyId: "Compare@tv-basicstudies"
            }, []).insert((() => Promise.resolve({
                inputs: {
                    symbol: e
                },
                parentSources: []
            }))) : null)) : Promise.resolve(null)
        }
        showIndicators(e, t) {
            if (window.studyMarket) return window.studyMarket.visible().value() ? void window.studyMarket.hide() : (window.studyMarket.show(e, t), window.studyMarket)
        }
        setSaveChartService(e) {
            this._saveChartService = e, null !== this._lineToolsSynchronizer && this._lineToolsSynchronizer.setSaveChartService(e)
        }
        getSaveChartService() {
            return this._saveChartService
        }
        mainSeriesQuotesAndMetainfo() {
            let e, t, i;
            const s = this._model && this._model.mainSeries();
            if (s) {
                const r = e => null == e ? "" : s.formatter().format(e, void 0, void 0, !0, !1) + "",
                    n = e => null == e ? "" : e + "";
                e = {
                    resolution: s.interval(),
                    symbol: s.symbol(),
                    values: s.valuesProvider().getValues(null)
                };
                const o = s.symbolInfo();
                o && (e.symbol = o.full_name, e.description = o.description, e.exchange = o.exchange);
                const a = s.bars().last();
                null !== a && (t = a.value.slice(1, 5).map(r));
                const l = s.quotes();
                l && (i = {
                    change: r(l.change),
                    changePercent: n(l.change_percent),
                    last: r(l.last_price)
                })
            }
            return {
                meta: e,
                ohlc: t,
                quotes: i
            }
        }
        isMultipleLayout() {
            return this._isMultipleLayout
        }
        updateCrossHairPositionIfNeeded() {
            if (this._model) {
                const e = Y.tool.value();
                this._model.model().setCurrentTool(e);
                const t = (0, H.lastMouseOrTouchEventInfo)();
                if (t.isTouch) {
                    const e = this._maximizedPaneWidget || this._paneWidgets[0];
                    if (e.hasState() && (!t.stylus && (this._isLineToolModeExceptBrush() || (0, Y.toolIsMeasure)(Y.tool.value())) || this.selectPointMode().value() !== Y.SelectPointMode.None)) {
                        const t = e.state(),
                            i = .5 * this._model.model().timeScale().width(),
                            s = .5 * t.defaultPriceScale().height();
                        this._model.model().setAndSaveCurrentPosition(i, s, t)
                    }
                }
                if (this._model && t.isTouch) {
                    const e = this._model.model().crossHairSource();
                    e.updateAllViews((0, bt.sourceChangeEvent)(e.id()))
                }
            }
        }
        trackingModePaneWidget() {
            if (!(0, H.lastMouseOrTouchEventInfo)().isTouch) return null;
            for (const e of this.paneWidgets())
                if (e.trackingModeEnabled()) return e;
            return null
        }
        startTrackingMode() {
            if ((0, H.lastMouseOrTouchEventInfo)().isTouch) {
                this.exitTrackingMode(), this.updateCrossHairPositionIfNeeded();
                const e = this._maximizedPaneWidget || this._paneWidgets[0],
                    t = this.model().model().crossHairSource().currentPoint();
                e.startTrackingMode(t, t)
            }
        }
        exitTrackingMode() {
            (0, H.lastMouseOrTouchEventInfo)().isTouch && this.paneWidgets().some((e => e.trackingModeEnabled())) && (this.paneWidgets().forEach((e => e.exitTrackingMode())), this.model().model().clearCurrentPosition())
        }
        onToolChanged() {
            this.model().lineBeingCreated() && this._cancelCreatingLine(), this.selectPointMode().value() !== Y.SelectPointMode.None && this.cancelRequestSelectPoint(), this.exitTrackingMode()
        }
        setInLoadingState(e) {
            this._inLoadingState = e
        }
        paint(e) {
            const t = null != e ? e : R.InvalidationMask.full();
            t.validationActions().forEach((e => e())),
                this._paneWidgets.forEach(((e, i) => {
                    null !== this._maximizedPaneWidget && this._maximizedPaneWidget !== e || e.paint(t.invalidateForPane(i))
                })), this._timeAxisWidget && this._timeAxisWidget.paint(t.invalidateForTimeScale()), this._redraw.fire()
        }
        GUIResetScales() {
            (0, fe.trackEvent)("GUI", "Reset Scales"), null !== this._model && this._model.resetScales()
        }
        toggleMaximizePane(e) {
            var t;
            if (!(this._paneWidgets.length < 2)) {
                this._maximizedPaneWidget ? (this._maximizedPaneWidget.state().maximized().setValue(!1), this._maximizedPaneWidget = null, this._paneSeparators.forEach((e => e.show()))) : (this._maximizedPaneWidget = e, this._maximizedPaneWidget.state().maximized().setValue(!0), this._paneSeparators.forEach((e => e.hide())));
                for (let e = this._paneWidgets.length; e--;) this._paneWidgets[e].updateControls(), this._paneWidgets[e].updatePriceAxisWidgetsStates();
                this._errorRenderer.updatePaneWidgets(), null === (t = this._timeAxisWidget) || void 0 === t || t.updatePriceAxisStubs(), this._adjustSize(), this.updateCrossHairPositionIfNeeded()
            }
        }
        maximizedPaneWidget() {
            return this._maximizedPaneWidget
        }
        isMaximizedPane() {
            return null !== this._maximizedPaneWidget
        }
        toggleCollapsedPane(e) {
            const t = e.state();
            t.collapsed().setValue(!t.collapsed().value()), this._paneWidgets.forEach((e => e.updateControls())), this._adjustSize(), this.updateCrossHairPositionIfNeeded()
        }
        unsetActivePaneWidget() {
            this.activePaneWidget = null
        }
        setActivePaneWidget(e) {
            this.activePaneWidget = e
        }
        onPaneWidgetDestroyed(e) {
            this.activePaneWidget === e && (this.activePaneWidget = null)
        }
        backgroundTopTheme() {
            return this._backgroundTopTheme.readonly()
        }
        backgroundBasedTheme() {
            return this._backgroundBasedTheme.readonly()
        }
        backgroundBottomTheme() {
            return this._backgroundBottomTheme.readonly()
        }
        lineToolsAndGroupsDTO() {
            return (0, r.ensureNotNull)(this._lineToolsSynchronizer).prepareDTO()
        }
        resetLineToolsInvalidated(e, t, i) {
            (0, r.ensureNotNull)(this._lineToolsSynchronizer).resetInvalidated(e, t, i)
        }
        applyLineToolUpdateNotification(e, t) {
            (0, r.ensureNotNull)(this._lineToolsSynchronizer).applyLineToolUpdateNotification(e, t)
        }
        reloadAllLineTools() {
            (0, r.ensureNotNull)(this._lineToolsSynchronizer).reloadAllLineTools()
        }
        startApplyingLineToolUpdateNotification() {
            var e;
            null === (e = this._lineToolsSynchronizer) || void 0 === e || e.startApplyingLineToolUpdateNotification()
        }
        endApplyingLineToolUpdateNotification() {
            var e;
            null === (e = this._lineToolsSynchronizer) || void 0 === e || e.endApplyingLineToolUpdateNotification()
        }
        applyAlertIdByExternalSource(e, t) {
            var i;
            null === (i = this._lineToolsSynchronizer) || void 0 === i || i.applyAlertIdByExternalSource(e, t)
        }
        deleteAlertByExternalSource(e, t) {
            var i;
            null === (i = this._lineToolsSynchronizer) || void 0 === i || i.deleteAlertByExternalSource(e)
        }
        shouldBeSavedEvenIfHidden() {
            return this._model ? this.model().model().shouldBeSavedEvenIfHidden() : !!this._options.content.shouldBeSavedEvenIfHidden
        }
        showObjectsTreeDialog() {
            var e;
            null === (e = this._objectTreeDialogController) || void 0 === e || e.show()
        }
        addCustomWidgetToLegend(e, t) {
            this._customLegendWidgetsFactoryMap.set(e, t);
            for (const i of this.paneWidgets()) i.addCustomWidgetToLegend(e, t)
        }
        applyIndicatorsToAllChartsAvailable() {
            if (!this.chartWidgetCollection().applyIndicatorsToAllChartsAvailable()) return !1;
            for (const e of this.model().model().panes()) {
                if (e.sourcesByGroup().all().some((e => (0, V.isStudy)(e) && !0))) return !0
            }
            return !1
        }
        restoreState(e, t, i) {
            this._adjustSize();
            const s = (0, r.ensureNotNull)(this._model),
                n = (s.restoreState(this._content, t, i), s.mainSeries().properties().childs());
            this._symbolWV.setValue(n.symbol.value()), this._resolutionWV.setValue(n.interval.value()), this._setActions()
        }
        addCompareAsOverlay(e, t, i) {
            const s = this.model();
            return (0, r.ensureDefined)(this._options.isSymbolAvailable)(e).then((r => {
                if (!r) return null;
                const n = s.createStudyInserter({
                    type: "java",
                    studyId: "Overlay@tv-basicstudies"
                }, []);
                return n.setForceOverlay(!0), n.setPreferredPriceScale("as-series"), !0 !== i && n.setTargetPriceScaleMode({
                    percentage: !0
                }), void 0 !== t && n.setPropertiesState({
                    allowExtendTimeScale: t
                }), n.insert((async () => ({
                    inputs: {
                        symbol: e
                    },
                    parentSources: []
                })))
            }))
        }
        scrollHelper() {
            return this._scrollHelper
        }
        setBroker(e) {
            var t;
            this._brokerName = e, null === (t = this._lineToolsSynchronizer) || void 0 === t || t.setBroker(e)
        }
        chartPainted() {
            return this._drawPlanned ? (null === this._chartPaintedPromise && (this._chartPaintedPromise = (0, d.createDeferredPromise)()), this._chartPaintedPromise.promise) : Promise.resolve()
        }
        setDataWindowWidget(e) {
            this._dataWindowWidget = e
        }
        removeDataWindowWidget() {
            this._dataWindowWidget = null
        }
        showSelectedSourcesProperties(e) {
            const t = (0, r.ensureNotNull)(this._model).selection().dataSources();
            if (1 === t.length) this.showSourceProperties(t[0], e);
            else {
                const i = t.filter(E.isLineTool);
                i.length > 0 && this.showChartPropertiesForSources({
                    sources: i,
                    tabName: e
                })
            }
        }
        connect() {
            this._chartSession.isConnected().subscribe(this._onChartSessionIsConnectedChanged), this._chartSession.criticalError().subscribe(this, this._onChartSessionCriticalError), this._chartSession.connect(this._onData.bind(this))
        }
        finishInitWithoutConnect() {
            this._chartSession.disable(), this._init(), this._chartWidgetInitialized.fire()
        }
        reconnect() {
            this._chartSession.disconnect(), this._chartSession.connect()
        }
        update() {
            if (this.hasModel()) {
                for (const e of this._paneWidgets) e.update();
                this._timeAxisWidget && this._timeAxisWidget.update()
            }
        }
        setPriceAxisHovered(e, t) {
            t ? this._hoveredPriceAxes.add(e) : this._hoveredPriceAxes.delete(e), this._anyAxisHovered.setValue(this._hoveredPriceAxes.size > 0)
        }
        anyPriceAxisHovered() {
            return this._anyAxisHovered.readonly()
        }
        linkingGroupIndex() {
            return this._linkingGroupIndex
        }
        _createShowDataWindowAction() {
            return this._showDataWindowAction = new P.Action({
                actionId: "Chart.DataWindow.Show",
                label: o.t(null, void 0, i(53831)),
                statName: "DataWindow",
                hotkeyGroup: this._hotkeys,
                hotkeyHash: n.Modifiers.Alt + 68,
                icon: dataWindowSvg,
                onExecute: this._showOrHideDataWindowWidget.bind(this)
            }), this._showDataWindowAction
        }
        _insertStudy(e, t, i, s) {
            const n = (0, r.ensureNotNull)(this._model).createStudyInserter(e, t, i);
            n.setForceOverlay("java" === e.type && "Volume@tv-basicstudies" === e.studyId && Oe.enabled("volume_force_overlay"));
            const o = n.insert(((e, i, r) => new Promise(((n, o) => {
                var a;
                this.selectPointMode().value() !== Y.SelectPointMode.None && this.cancelRequestSelectPoint(), s ? n(s(e, i, r)) : ! function(e) {
                    return Fi.includes(e.id)
                }(r) ? (null != (a = i) ? a : []).some((e => e.confirm)) ? ((0, fe.trackEvent)("GUI", "Confirmation dialogs", "Inputs confirmation dialog"), Ai(this, e, r, n, o)) : n({
                    inputs: {},
                    parentSources: t
                }) : ((0, fe.trackEvent)("GUI", "Confirmation dialogs", "Symbol confirmation dialog"), Ai(this, e, r, n, o, "symbol"))
            }))));
            return o.then((() => {
                (0, Y.hideAllIndicators)().value() && (0, W.toggleHideMode)()
            })).catch((e => {})), o
        }
        async _showChartProperties(e, t, i, s) {
            if (!this._model) return null;
            t && ((0, c.setValue)("properties_dialog.active_tab.chart", t), i.tabName = t);
            const r = await mi(e, this._model, i, this._options.chartWidgetCollection, s);
            return (null == r ? void 0 : r.visible().value()) ? r : null
        }
        _createLineToolsSynchronizerIfNeeded() {}
        _updateThemedColor() {
            const e = this.model().model(),
                t = e.backgroundColorAtYPercentFromTop(.5);
            let i = e.backgroundTopColor().value(),
                s = e.backgroundColor().value();
            const r = (0, Se.isColorDark)(t),
                n = (0, Se.isColorDark)(i),
                o = (0, Se.isColorDark)(s);
            this.widget().classList.toggle("chart-widget--themed-dark", r), this.widget().classList.toggle("chart-widget--themed-light", !r), this.widget().classList.toggle("chart-widget__top--themed-dark", n), this.widget().classList.toggle("chart-widget__top--themed-light", !n), this.widget().classList.toggle("chart-widget__bottom--themed-dark", o), this.widget().classList.toggle("chart-widget__bottom--themed-light", !o), this._backgroundTopTheme.setValue(n ? "dark" : "light"), this._backgroundBasedTheme.setValue(r ? "dark" : "light"), this._backgroundBottomTheme.setValue(o ? "dark" : "light"), i === s && (0, ee.isStdThemedDefaultValue)("chartProperties.paneProperties.background", i, this._backgroundBasedTheme.value()) && (i = null, s = null);
            for (const e of this._paneWidgets) e.updateThemedColors({
                topColor: i,
                bottomColor: s
            })
        }
        _isLineToolModeExceptBrush() {
            const e = Y.tool.value();
            return (0, D.isLineToolName)(e) && !(0, D.isLineDrawnWithPressedButton)(e) && this.selectPointMode().value() === Y.SelectPointMode.None
        }
        _cancelCreatingLine() {
            const e = (0, r.ensureNotNull)(this._model).model(),
                t = e.lineBeingCreated();
            if (null !== t) {
                const i = (0, r.ensureNotNull)(e.paneForSource(t));
                (0, r.ensureNotNull)(this.paneByState(i)).cancelCreatingLineTool(), t.toolname === Y.tool.value() && (0, Y.resetToCursor)()
            }
            const i = e.crossHairSource().measurePane().value();
            if (null !== i) {
                (0, r.ensureNotNull)(this.paneByState(i)).cancelMeasuring()
            }
        }
        _adjustSize(e) {
            var t;
            let i = 0;
            const r = null === this._model ? null : this._model.model().priceScaleSlotsCount(),
                n = new Uint32Array(null === r ? 0 : r.left),
                o = new Uint32Array(null === r ? 0 : r.right),
                a = (0, X.getCanvasDevicePixelRatio)(document.body),
                l = (e, t) => e + t,
                c = (e, t) => {
                    t.forEach(((t, i) => {
                        e[i] = Math.max(e[i], t)
                    }))
                },
                h = this._width(),
                d = this._height(),
                p = this._paneSeparators.length,
                _ = this.isMaximizedPane() ? 0 : jt.height() * p,
                m = null !== this._timeAxisWidget ? this._timeAxisWidget.optimalHeight() : 0;
            let g = d - m >= 61 ? m : 0;
            g % 2 && (g += 1);
            const f = Math.max(1, Math.floor((d - _ - g) / this._paneWidgets.length));
            let v = 0,
                S = null;
            for (const e of this._paneWidgets)
                if (!this._maximizedPaneWidget || this._maximizedPaneWidget === e) {
                    e.leftPriceAxisesContainer().updateCurrencyLabels();
                    const t = e.leftPriceAxisesContainer().optimalWidths();
                    e.rightPriceAxisesContainer().updateCurrencyLabels();
                    const s = e.rightPriceAxisesContainer().optimalWidths();
                    c(n, t), c(o, s), this._maximizedPaneWidget !== e && e.state().collapsed().value() ? v += Math.min(f, e.collapsedHeight()) : (i += e.stretchFactor(), S = e)
                } let y = n.reduce(l, 0),
                b = o.reduce(l, 0),
                w = Math.max(h - y - b, 0);
            if (w <= 102) {
                y = 0, b = 0, w = h;
                for (let e = 0; e < n.length; e++) n[e] = 0;
                for (let e = 0; e < o.length; e++) o[e] = 0
            }
            for (const e of this._paneSeparators) e.adjustSize();
            const P = _ + v + g,
                C = d < P ? 0 : d - P,
                x = C / i;
            let T = 0,
                I = !1;
            const M = null === (t = this._model) || void 0 === t ? void 0 : t.model();
            for (let e = 0; e < this._paneWidgets.length; ++e) {
                const t = this._paneWidgets[e];
                void 0 !== M && t.setState(M.panes()[e]);
                let i = 0;
                if (this.isMaximizedPane()) i = this._maximizedPaneWidget === t ? C : 0;
                else if (t.state().collapsed().value()) i = Math.min(f, t.collapsedHeight());
                else {
                    const e = t === S ? Math.ceil((C - T) * a) / a : Math.round(t.stretchFactor() * x * a) / a;
                    i = Math.max(e, 2), T += i
                }
                t.setPriceAxisSizes("left", i, n), t.setPriceAxisSizes("right", i, o), I = I || i !== t.height(), t.setSize((0, s.size)({
                    width: w,
                    height: i
                })), M && t.state() && M.setPaneHeight(t.state(), i)
            }
            null !== this._timeAxisWidget && this._timeAxisWidget.setSizes((0, s.size)({
                width: w,
                height: g
            }), n, o), M && M.setWidth(w, e), this._controlBarNavigation && this._controlBarNavigation.updatePosition(), this._lhsAxesWidth !== y && (this._lhsAxesWidth = y, this._lhsPriceAxisWidthChanged.fire(y)), this._rhsAxesWidth !== b && (this._rhsAxesWidth = b, this._rhsPriceAxisWidthChanged.fire(b)), I && u.emit("panes_height_changed")
        }
        _makePaneWidgetsAndSeparators() {
            const e = this.model().model().panes(),
                t = e.length,
                i = this._paneWidgets.length;
            for (let e = t; e < i; e++) {
                (0, r.ensureDefined)(this._paneWidgets.pop()).destroy();
                const e = this._paneSeparators.pop();
                e && e.destroy()
            }
            const s = this._options.containsData;
            for (let r = i; r < t; r++) {
                const t = {
                    contextMenuEnabled: this._options.paneContextMenuEnabled,
                    currencyConversionEnabled: this._options.currencyConversionEnabled,
                    unitConversionEnabled: this._options.unitConversionEnabled,
                    handleScale: this._options.handleScale,
                    handleScroll: this._options.handleScroll,
                    priceScaleContextMenuEnabled: this._options.priceScaleContextMenuEnabled,
                    legendWidgetEnabled: this._options.legendWidgetEnabled,
                    sourceStatusesWidgetEnabled: !s,
                    sourceStatusesWidget: this._options.sourceStatusesWidget,
                    marketStatusWidgetEnabled: this._options.marketStatusWidgetEnabled && !s,
                    chartWarningWidgetEnabled: this._options.chartWarningWidgetEnabled && !s,
                    chartWarningWidget: this._options.chartWarningWidget,
                    dataProblemWidgetEnabled: this._options.dataProblemWidgetEnabled && !s,
                    legendWidget: this._options.legendWidget,
                    propertyPagesEnabled: this._options.propertyPagesEnabled,
                    sourceSelectionEnabled: this._options.sourceSelectionEnabled,
                    controlsEnabled: this._options.paneControlsEnabled,
                    croppedTickMarks: this._options.croppedTickMarks,
                    countdownEnabled: this._options.countdownEnabled,
                    customLegendWidgetFactories: new Map(this._customLegendWidgetsFactoryMap),
                    useKineticScroll: this._options.useKineticScroll
                };
                void 0 !== this._options.paneContextMenu && (t.contextMenu = this._options.paneContextMenu), void 0 !== this._options.priceScaleContextMenu && (t.priceScaleContextMenu = this._options.priceScaleContextMenu);
                const i = new Ht(this, e[r], t, this._paneWidgetsSharedState);
                if (this._paneWidgets.push(i), r > 0) {
                    const e = new jt(this, r - 1, r);
                    this._paneSeparators.push(e), this._timeAxisWidget ? this._elMainTable.insertBefore(e.getElement(), this._timeAxisWidget.getElement()) : this._elMainTable.appendChild(e.getElement())
                }
                this._timeAxisWidget ? this._elMainTable.insertBefore(i.getElement(), this._timeAxisWidget.getElement()) : this._elMainTable.appendChild(i.getElement())
            }
            for (let i = 0; i < t; i++) {
                const t = e[i],
                    s = this._paneWidgets[i];
                s.hasState() && s.state() === t ? s.updatePriceAxisWidgetsStates() : s.setState(t)
            }
            for (let e = t; e--;) this._paneWidgets[e].updateControls();
            this._errorRenderer.updatePaneWidgets(), this._updateThemedColor()
        }
        _width() {
            return this._options.width.value()
        }
        _height() {
            return this._options.height.value()
        }
        _update(e, t) {
            var i, s;
            const r = e ? e.fullInvalidation() : R.InvalidationLevel.Full,
                n = !!e && e.isVisibleTimeRangeLockedOnResize();
            if (null !== this._timingsMeter && this._timingsMeter.startDraw(r), r === R.InvalidationLevel.Full && (this._model ? this._updateGui(n) : this._adjustSize(n)), r > R.InvalidationLevel.Cursor && (null === (i = this._timeAxisWidget) || void 0 === i || i.update(), this._paneWidgets.forEach((e => {
                    e.updatePriceAxisWidgets()
                })), this._applyTimeScaleInvalidations(e, t), (null === (s = this._invalidationMask) || void 0 === s ? void 0 : s.fullInvalidation()) === R.InvalidationLevel.Full && (this._invalidationMask.merge(e), this._adjustSize(this._invalidationMask.isVisibleTimeRangeLockedOnResize()), this._applyTimeScaleInvalidations(this._invalidationMask, t), e = this._invalidationMask, this._invalidationMask = null)), this.paint(e), this._dataWindowWidget) {
                const t = e.maxPaneInvalidation();
                t === R.InvalidationLevel.Full ? this._dataWindowWidget.fullUpdate() : t > R.InvalidationLevel.None && this._dataWindowWidget.update()
            }
            for (let t = 0; t < this._paneWidgets.length; t++) this._paneWidgets[t].updateStatusWidget(e.invalidateForPane(t));
            null !== this._timingsMeter && this._timingsMeter.stopDraw(), e && e.panesOrderInvalidated() && u.emit("panes_order_changed")
        }
        _onMousewheel(e) {
            if (!this.model().model().zoomEnabled() || null === this._mouseWheelHelper) return;
            if (!(0, h.onWidget)() && parent && parent !== window && parent.IS_DEMO_PAGE) return;
            if (null === this._model) return;
            if (this.model().timeScale().isEmpty()) return;
            const t = this._mouseWheelHelper.processWheel(e),
                i = t.deltaX,
                s = -t.deltaY;
            if (0 !== i && this._options.handleScroll.mouseWheel || 0 !== s && this._options.handleScale.mouseWheel) {
                if (e.cancelable && e.preventDefault(), 0 !== s && this._options.handleScale.mouseWheel) {
                    const t = Math.sign(s) * Math.min(1, Math.abs(s)),
                        i = (0, r.ensureNotNull)(this._mainDiv).getBoundingClientRect(),
                        n = e.clientX - this._lhsAxesWidth - i.left;
                    if (!Number.isFinite(n) || !Number.isFinite(t)) return void Vi.logWarn("Incorrect mouse wheel processing: scrollPosition: " + n + ", zoomScale: " + t);
                    const o = new q.EnvironmentState(e).mod();
                    this.model().model().zoomTime(n, t, !!o || void 0), this._onZoom.fire(o)
                }
                0 !== i && this._options.handleScroll.mouseWheel && this.model().scrollChart(-80 * i)
            }
        }
        _updateGui(e) {
            this._model && (this._makeTimeAxisWidget(), this._makePaneWidgetsAndSeparators(), this._elMainTable.style.userSelect = "none", this._adjustSize(e))
        }
        _setElement(e) {
            if (this._mainDiv) {
                this._mainDiv.remove();
                const e = document.createRange();
                e.selectNodeContents((0, r.ensureNotNull)(this._parent)), e.deleteContents()
            }
            this._controlBarNavigation && (this._controlBarNavigation.destroy(), this._controlBarNavigation = null), null !== this._removeMaximizeHotkey && this._removeMaximizeHotkey(), this._removeMaximizeHotkey = this._initMaximizeHotkey(e);
            const t = e.ownerDocument,
                i = t.createElement("div");
            i.classList.add("chart-container-border"), e.insertBefore(i, e.firstChild), this._parent = i;
            const s = t.createElement("div");
            if (s.classList.add("chart-widget"), this._mainDiv = s, this._elTooltipDiv = t.createElement("div"), this._elTooltipDiv.className = "tooltip-wrapper", this._mainDiv.appendChild(this._elTooltipDiv), this._elMainTable = t.createElement("table"), this._elMainTable.className = "chart-markup-table", this._elMainTable.setAttribute("cellpading", "0"), this._elMainTable.setAttribute("cellspacing", "0"), this._mainDiv.appendChild(this._elMainTable), this._hotkeysListener && this._hotkeysListener.destroy(), this._errorRenderer.setContainer(this._parent), this._hotkeysListener = new vt.ChartHotkeysListener(this, this._mainDiv), (this._options.controlBarEnabled || (0, Oe.enabled)("control_bar")) && this._createControlBar(), this._options.handleScale.mouseWheel || this._options.handleScroll.mouseWheel) {
                this._mouseWheelHelper = new Ve;
                const e = this._onMousewheel.bind(this);
                this._onWheelBound = e, this._mainDiv.addEventListener("wheel", e, {
                    passive: !1
                })
            }
            this.resize(), this._justActivated = !1, this.withModel(this, (() => {
                i.appendChild(s), s.addEventListener("mousedown", this._beginRequestActive.bind(this)), s.addEventListener("mouseup", this._endRequestActive.bind(this)), s.addEventListener("touchstart", this._beginRequestActive.bind(this)), s.addEventListener("touchmove", this._endRequestActive.bind(this)), s.addEventListener("touchend", this._endRequestActive.bind(this)), s.addEventListener("click", this._requestActive.bind(this))
            })), this._inited && (null !== this._timeAxisWidget && (this._timeAxisWidget.destroy(), this._timeAxisWidget = null), this._paneWidgets.forEach((e => {
                e.destroy()
            })), this._paneWidgets.length = 0, this._paneSeparators.forEach((e => {
                e.destroy()
            })), this._paneSeparators.length = 0, this._update(R.InvalidationMask.full(), performance.now()))
        }
        _init() {
            this.hasModel() && this.model().mainSeries().clearData(), this._initColors(), this._makeDefaultGui();
            this._makeDefaultModel(), (() => {
                this._checkObsoleteTimezone(), this._chartSession && this._chartSession.connected() && this.model().model().restart(), this._content && (this._initColors(), this._updateGui(), this.update()), this._resizeHandler = () => {
                        this._invalidationHandler(R.InvalidationMask.full())
                    }, this._resizeHandler(), (0, r.ensureNotNull)(this._parent).appendChild((0, r.ensureNotNull)(this._mainDiv)),
                    this._spinner && (this._spinner.stop(), this._spinner = null), this._keydownEventListener = e => {
                        27 === e.which && e.preventDefault()
                    }, window.addEventListener("keydown:chart_" + this._id, this._keydownEventListener), this._activateSymbolSearchHotkeys(), this.model().timeScale().onScroll().subscribe(this, (() => this._onScroll.fire())), this._inited = !0
            })()
        }
        _makeDefaultModel() {
            let e;
            if (this._content && this._content.timeScale.points) {
                const t = this._content.timeScale.points.items[0];
                e = {
                    startDate: t
                }
            }
            if (!(0, r.ensureNotNull)(this._metaInfoRepository).getInternalMetaInfoArray()) throw new Error("Cannot create chart model: studies metainfo is absent");
            const t = () => {
                var t, i;
                const s = {
                    readOnly: this.readOnly(),
                    isSnapshot: !!this._containsData,
                    ...l(this._options, ["timeScale", "crossHair", "chartEventsEnabled", "esdEnabled", "latestUpdatesEnabled", "continuousContractSwitchesEnabled", "futuresContractExpirationEnabled", "countdownEnabled", "lastPriceAnimationEnabled", "currencyConversionEnabled", "unitConversionEnabled", "watermarkEnabled", "shiftVisibleRangeOnNewBar", "hideIdeas", "onWidget"])
                };
                let n;
                n = this._collapsed;
                const o = function(e, t, i, s, r, n, o, a, l, c, h, d) {
                    const u = new w.ChartUndoModel(e, t, i, s, r, n, o, a, l, c, h, d);
                    return u.model().fullUpdate(), u
                }(this._chartSession, this._invalidationHandler, this.properties(), e, (0, r.ensureNotNull)(this._metaInfoRepository), this, this._options.undoHistory, this._options.barsMarksContainersFactory, s, n, this._linkingGroupIndex, null !== (i = null === (t = this._saveChartService) || void 0 === t ? void 0 : t.autoSaveEnabled()) && void 0 !== i ? i : new(lt())(!0));
                return this._createSessions(o.model()), o
            };
            (0, Oe.enabled)("lean_chart_load") ? this._model = this._model || t(): this._model = t(), this._model.model().setChartSaveTime(1e3 * this._chartWidgetCollection.metaInfo.lastModified.value()), this._createVolumeIfNeeded();
            if (this._content) {
                let e = {};
                Bi && this._initialLoading && (e = {
                    symbol: this._defSymbol,
                    interval: this._defInterval,
                    style: this._defStyle
                }), this.restoreState(this._content, this._containsData, e), Bi && this._defSymbol && this.model().model().recalculatePriceRangeOnce()
            } else this._setActions();
            this._createLineToolsSynchronizerIfNeeded(), (() => {
                const e = (0, r.ensureNotNull)(this._model);
                e.onTagsChanged().subscribe(this, (() => this.onModelTagsChanged())), this._initBackgroundColor(), this._updateGui(), this._modelCreated.fire(e), this._tagsChanged.fire(), Oe.enabled("determine_first_data_request_size_using_visible_range") && this._setFirstRequestNumbarsUsingTimeframeAndInterval(e);
                const t = e.mainSeries(),
                    i = t.properties().childs();
                this._defTimeframe && t.setDefaultTimeframe(this._defTimeframe), t.dataEvents().symbolNotPermitted().subscribe(null, (e => t.setSymbolParams({
                        symbol: e
                    }))), this._symbolWV.setValue(i.symbol.value()), i.symbol.subscribe(this, (e => this._symbolWV.setValue(e.value()))), this._resolutionWV.setValue(i.interval.value()), i.interval.subscribe(this, (e => this._resolutionWV.setValue(e.value()))), i.style.unsubscribe(this, this._onChartStyleChanged), i.style.subscribe(this, this._onChartStyleChanged), t.dataEvents().completed().subscribe(this, (() => this._addPerfMark("SeriesCompleted")), !0),
                    t.dataEvents().barReceived().subscribe(this, (() => this._addPerfMark("SeriesFirstDataReceived")), !0);
                this._options;
                t.dataEvents().chartTypeNotPermitted().subscribe(null, (() => {
                    t.setSymbolParams({
                        interval: "D"
                    })
                })), t.dataEvents().intradaySpreadNotPermitted().subscribe(null, (() => {
                    t.setSymbolParams({
                        interval: "D"
                    })
                })), t.dataEvents().customIntervalNotPermitted().subscribe(null, (i => {
                    const s = e.model().defaultResolutions(),
                        r = s.find((e => (0, ai.compareResolutions)(e, i) >= 0)),
                        n = null != r ? r : s[s.length - 1];
                    t.setSymbolParams({
                        interval: n
                    })
                })), t.dataEvents().intradayExchangeNotPermitted().subscribe(null, (() => {
                    t.setSymbolParams({
                        interval: "D"
                    })
                })), t.requestingStyleIsNotSupported.subscribe(null, (() => {
                    const i = t.interval(),
                        s = e.model().defaultResolutions(),
                        r = (0, oi.getLastUsedSingleValueBasedStyle)(),
                        n = (0, ai.getResolutionByChartStyle)(r, i, s);
                    t.setChartStyleWithIntervalIfNeeded(r, n)
                })), t.requestingStyleSupportRecovered.subscribe(null, (i => {
                    const s = t.interval(),
                        r = e.model().defaultResolutions(),
                        n = (0, ai.getResolutionByChartStyle)(i, s, r);
                    t.setChartStyleWithIntervalIfNeeded(i, n)
                }))
            })()
        }
        _startSpinner(e) {
            this._spinner || e && (this._spinner = (new S).spin(e))
        }
        _handleLoginStateChanged() {
            0
        }
        _checkObsoleteTimezone() {
            const e = this.properties().childs().timezone.value();
            (0, gi.timezoneIsAvailable)(e) || this.properties().childs().timezone.setValue({
                UTC: "Etc/UTC",
                EST: "America/New_York",
                CST: "America/Chicago",
                PST: "America/Los_Angeles"
            } [e] || "exchange")
        }
        _initColors() {
            const e = this.properties().childs(),
                t = e.scalesProperties.childs();
            t.lineColor.listeners().subscribe(this, this._updateAndPaint), t.textColor.listeners().subscribe(this, this._updateAndPaint), e.paneProperties.childs().separatorColor.listeners().subscribe(this, this._setPaneSeparatorLineColor)
        }
        _setPaneSeparatorLineColor() {
            this._paneSeparators.forEach((e => e.update())), this._updateAndPaint()
        }
        _updateAndPaint() {
            this.update(), this.paint()
        }
        _makeDefaultGui() {
            this._makeLoadingScreen(), this.hasModel() && (this._makeTimeAxisWidget(), this._makePaneWidgetsAndSeparators()), this._adjustSize(), this._updateScalesActions(), (0, X.disableSelection)(this._elMainTable), this._updateAndPaint()
        }
        _makeLoadingScreen() {
            if (Oe.enabled("lean_chart_load")) {
                if (this.screen) return;
                this.screen = new yi(this, (0, r.ensureNotNull)(this._parent))
            } else this.screen = new yi(this, (0, r.ensureNotNull)(this._mainDiv))
        }
        _makeAvailableOnTVPopup() {
            throw new Error("Not implemented")
        }
        _activateSymbolSearchHotkeys() {
            this.readOnly() || this._options.hideSymbolSearch || (0, fi.activateKeyPressHandler)()
        }
        _makeTimeAxisWidget() {
            if (this._timeAxisWidget) return void this._timeAxisWidget.updatePriceAxisStubs();
            const e = this.model();
            this._timeAxisWidget = new Zt(this, this._options.timeScaleWidget, this._titlesProvider.bind(this), this._menuItemsProvider.bind(this), this._backgroundBasedTheme), this._elMainTable.appendChild(this._timeAxisWidget.getElement()), this._timeAxisWidget.updatePriceAxisStubs(), this._timeAxisWidget.onLabelHovered().subscribe(this, ((t, i) => {
                const s = this._maximizedPaneWidget ? this._maximizedPaneWidget.state() : e.paneForSource(e.mainSeries()),
                    n = (0, r.ensureNotNull)(this.paneByState((0,
                        r.ensureNotNull)(s))).highlightedPriceAxis(),
                    o = n.value();
                (i || o.owner === t.owner) && (n.setValue({
                    owner: t.owner,
                    axis: i ? t.axis : null
                }), this.model().model().lightUpdate())
            }))
        }
        _titlesProvider(e, t) {
            const i = this.model(),
                s = (0, r.ensureNotNull)(this._maximizedPaneWidget ? this._maximizedPaneWidget.state() : i.paneForSource(i.mainSeries())),
                n = "right" === e ? s.rightPriceScales() : s.leftPriceScales();
            if (n.length < t + 1) return [];
            let o = n[t].orderedSources().filter((e => e === i.mainSeries() || (0, V.isStudy)(e)));
            return o.reverse(), o = (0, bi.moveToHead)(o, i.mainSeries()), o.map((e => e.title(!0, void 0, !1)))
        }
        _menuItemsProvider(e, t) {
            const i = this.model(),
                s = (0, r.ensureNotNull)(this._maximizedPaneWidget ? this._maximizedPaneWidget.state() : i.paneForSource(i.mainSeries())),
                n = "right" === e ? s.visibleRightPriceScales() : s.visibleLeftPriceScales();
            if (n.length < t + 1) return [];
            const o = n[t],
                a = i.model().panes().indexOf(s),
                l = this._paneWidgets[a],
                c = "right" === e ? l.rightPriceAxisesContainer() : l.leftPriceAxisesContainer();
            return (0, r.ensureNotNull)(c.findAxisWidgetForScale(o)).getContextMenuActions()
        }
        _invalidationRAFCallback(e) {
            if (this._drawPlanned = !1, this._drawRafId = 0, !this._inLoadingState) {
                if (this._invalidationMask) {
                    const t = this._invalidationMask;
                    this._invalidationMask = null, this._update(t, e);
                    for (const i of t.timeScaleInvalidations())
                        if (0 === i.type && !i.value.finished(e)) {
                            this.model().model().setTimeScaleAnimation(i.value);
                            break
                        }
                }
                null !== this._chartPaintedPromise && (this._chartPaintedPromise.resolve(), this._chartPaintedPromise = null)
            }
        }
        _applyTimeScaleInvalidations(e, t) {
            for (const i of e.timeScaleInvalidations()) this._applyTimeScaleInvalidation(i, t)
        }
        _applyTimeScaleInvalidation(e, t) {
            var i;
            const s = null === (i = this._model) || void 0 === i ? void 0 : i.timeScale();
            if (s && 0 === e.type) e.value.finished(t) || s.setRightOffset(e.value.getPosition(t))
        }
        _onChartSessionCriticalError(e, t) {
            this._disconnected.fire(!0)
        }
        _onData(e) {
            if ("reconnect_bailout" === e.method) this._reconnectBailout.fire();
            else this.model().model().onData(e)
        }
        _onConnection() {
            this.hasModel() ? (this.model().model().restart(), this.model().model().fullUpdate(), this._connected.fire()) : this._requestMetadata()
        }
        _onDisconnect() {
            this.hasModel() && this.model().model().disconnect(), this._model && this._model.model().fullUpdate(), this._disconnected.fire()
        }
        async _requestMetadata() {
            this._addPerfMark("RequestMetadataStart");
            const e = (0, r.ensureNotNull)(this._metaInfoRepository);
            await e.requestMetaInfo(), this._addPerfMark("RequestMetadataEnd"), this._inited ? this.model().model().setStudiesMetaData(e.getInternalMetaInfoArray(), e.getMigrations()) : (await (0, E.initAllLineToolsFromContent)(this._content), this._init(), this._chartWidgetInitialized.fire(), Oe.enabled("charting_library_base") || Vi.logDebug("initialized"))
        }
        async _createControlBar() {
            const e = await Promise.all([i.e(2014), i.e(9322), i.e(2215), i.e(5093)]).then(i.bind(i, 33283));
            this._controlBarNavigation = new e.ControlBarNavigation(this, (0, r.ensureNotNull)(this._mainDiv), this._options.controlBar), this._model && this._adjustSize()
        }
        _subscribeToDrawingState() {
            if (this._options.readOnly) return;
            (0, Y.init)();
            const e = (e, t) => {
                const i = this._model;
                if (null === i) return;
                const s = i.model();
                e.model !== s && (this._lineToolsSynchronizer ? this._lineToolsSynchronizer.executeSyncedAction((() => t(s, i))) : t(s, i))
            };
            Y.createdLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const s = (0, r.ensureNotNull)(e.paneForSource(e.mainSeries()));
                    let n, o = null;
                    if (void 0 === t.pointPositionPercents) {
                        if (o = Oi(e, t.model, t.point.timeStamp), null === o) return;
                        n = t.point.price
                    } else {
                        const i = t.pointPositionPercents.x * e.timeScale().width(),
                            s = e.mainSeries().priceScale(),
                            r = t.pointPositionPercents.y * s.height(),
                            a = e.mainSeries().firstValue();
                        if (null === a) return;
                        o = e.timeScale().coordinateToIndex(i), n = s.coordinateToPrice(r, a)
                    }
                    const a = {
                            index: (0, r.ensureNotNull)(o),
                            price: n
                        },
                        l = i.createLineTool({
                            pane: s,
                            point: a,
                            linetool: t.linetool,
                            properties: t.properties,
                            linkKey: t.linkKey,
                            ownerSource: e.mainSeries(),
                            disableSynchronization: !0,
                            id: t.id,
                            sharingMode: t.sharignMode
                        });
                    null !== l && !Boolean(this.model().lineBeingCreated()) && t.finalState && l.restoreExternalPoints(t.finalState, {
                        indexesChanged: !0,
                        pricesChanged: !0
                    })
                }))
            })), Y.continuedLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    var s;
                    const r = Oi(e, t.model, t.point.timeStamp);
                    if (null === r) return;
                    const n = {
                            index: r,
                            price: t.point.price
                        },
                        o = e.lineBeingCreated();
                    if (null === o) return;
                    i.continueExternalLine(n, null !== (s = t.envState) && void 0 !== s ? s : void 0, !!t.finalState) && t.finalState && o.restoreExternalPoints(t.finalState, {
                        indexesChanged: !0,
                        pricesChanged: !0
                    })
                }))
            })), Y.cancelledLineTool.subscribe(null, (t => {
                e(t, ((e, t) => {
                    e.cancelCreatingLine()
                }))
            })), Y.beenSetLineToolLastPoint.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const s = e.lineBeingCreated();
                    if (null === s || s.linkKey().value() !== t.linkKey) return;
                    const r = Oi(e, t.model, t.point.timeStamp);
                    if (null === r) return;
                    const n = {
                        index: r,
                        price: t.point.price
                    };
                    s.setLastPoint(n), s.updateAllViews((0, bt.sourceChangeEvent)(s.id())), e.lightUpdate()
                }))
            })), Y.startedMovingLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    var s;
                    const r = t.linkKeys.map(E.lineToolByLinkKey.bind(null, e)).filter(y.notNull);
                    if (r.length) {
                        const i = Oi(e, t.model, t.point.timeStamp);
                        if (null === i) return;
                        const n = {
                                index: i,
                                price: t.point.price
                            },
                            o = null !== (s = t.activeItem) && void 0 !== s ? s : null,
                            a = r[0].pointToScreenPoint(n);
                        a && e.startMovingSources(r, {
                            logical: n,
                            screen: a
                        }, o, t.pointPositionPercents, null === t.envState ? void 0 : t.envState, !0)
                    }
                }))
            })), Y.movedLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    var s;
                    const r = e.sourcesBeingMoved().filter(E.isLineTool).filter((e => (e => t.linkKeys.some((t => e.linkKey().value() === t)))(e)));
                    if (!r.length) return;
                    const n = Oi(e, t.model, t.point.timeStamp);
                    if (null === n) return;
                    const o = {
                            index: n,
                            price: t.point.price
                        },
                        a = r[0].pointToScreenPoint(o);
                    a && e.moveSources({
                        logical: o,
                        screen: a
                    }, t.pointPositionPercents, null !== (s = t.envState) && void 0 !== s ? s : void 0, !0)
                }))
            })), Y.finishedMovingLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const s = e.sourcesBeingMoved().filter(E.isLineTool);
                    if (0 === s.length) return;
                    s.forEach((i => {
                        const s = (e => {
                            for (let i = 0; i < t.linkKeys.length; i++)
                                if (t.linkKeys[i] === e.linkKey().value()) return {
                                    state: t.finalStates[i],
                                    changes: t.changes[i]
                                };
                            return null
                        })(i);
                        e.endMovingSources(null !== s, !0),
                            null !== s && (i.restoreExternalPoints(s.state, s.changes), s.state.pointPositionPercents && i.restorePositionPercents(s.state.pointPositionPercents))
                    }))
                }))
            })), Y.startedChangingLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    var s;
                    const r = (0, E.lineToolByLinkKey)(e, t.linkKey);
                    if (null !== r) {
                        const i = r.getPoint(t.pointIndex),
                            n = i ? i.index : Oi(e, t.model, t.point.timeStamp);
                        if (null === n) return;
                        if (r.isActualSymbol() && r.isActualCurrency() && r.isActualUnit()) {
                            const i = {
                                index: n,
                                price: t.point.price
                            };
                            e.startChangingLinetool(r, i, t.pointIndex, null !== (s = t.envState) && void 0 !== s ? s : void 0, !0)
                        }
                    }
                }))
            })), Y.changedLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const s = e.lineBeingEdited();
                    if (null === s || s.linkKey().value() !== t.linkKey) return;
                    let n = null;
                    if (n = t.changes.indexesChanged ? Oi(e, t.model, t.point.timeStamp) : (0, r.ensureNotNull)(e.linePointBeingChanged()).index, null !== n && s.isActualSymbol() && s.isActualCurrency() && s.isActualUnit()) {
                        const i = {
                            index: n,
                            price: t.point.price
                        };
                        e.changeLinePoint(i, void 0, !0)
                    }
                }))
            })), Y.finishedChangingLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const s = (0, E.lineToolByLinkKey)(e, t.linkKey);
                    null !== s && s.isActualSymbol() && s.isActualCurrency() && s.isActualUnit() && null !== e.lineBeingEdited() && e.endChangingLinetool(!!t.finalState, !0), null !== s && t.finalState && s.restoreExternalPoints(t.finalState, t.changes)
                }))
            })), Y.removedLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const {
                        withUndo: s,
                        unlink: r,
                        linkKey: n
                    } = t, o = (0, E.lineToolByLinkKey)(e, n);
                    if (null !== o) r && o.detachAlert(), s ? i.removeSource(o, !1) : e.removeSource(o);
                    else if (this._lineToolsSynchronizer) {
                        const {
                            sourceTitle: e,
                            symbol: o,
                            lineToolState: a
                        } = t;
                        i.removeUnloadedLineTool({
                            lineToolsSynchronizer: this._lineToolsSynchronizer,
                            state: a,
                            unlink: r,
                            sourceTitle: e,
                            linkKey: n,
                            symbol: o,
                            withUndo: s
                        })
                    }
                }))
            })), Y.finishedLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const s = (0, E.lineToolByLinkKey)(e, t.linkKey);
                    null !== s && (0, D.isLineToolFinishRequiredWhenCreatedByApi)(s.toolname) && s.finish()
                }))
            })), Y.changedLineStyle.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const s = (0, E.lineToolByLinkKey)(e, t.linkKey);
                    null !== s && (s.restoreExternalState(t.state), s.propertiesChanged(!0), t.alertId && s.syncAlert(t.alertId))
                }))
            })), Y.restoredLineToolState.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const s = (0, E.lineToolByLinkKey)(e, t.linkKey);
                    if (null !== s) {
                        const i = {
                            ...t.state
                        };
                        i.indexes = t.state.points.map((i => ({
                            index: Oi(e, t.model, i.time_t),
                            price: i.price
                        }))), e.restoreLineToolState(s, i, !1)
                    }
                }))
            })), Y.restoredLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    e.restoreSource(t.state.restorePane, t.state.paneIndex, t.state.paneState, t.state.sourceState, null)
                }))
            })), Y.copiedLineTool.subscribe(null, (t => {
                e(t, ((e, i) => {
                    const s = (0, r.ensureNotNull)(e.paneForSource(e.mainSeries()));
                    let n;
                    const o = {
                            ...t.state,
                            intervalsVisibilities: (0, wi.mergeIntervalVisibilitiesDefaults)(t.state.intervalsVisibilities)
                        },
                        a = (0, E.createLineToolProperties)(t.linetool, o, e),
                        l = e.dataSourceForId(t.id);
                    if (l) {
                        if (!(0, E.isLineTool)(l)) return void Vi.logError(`Error sync creating line tool. Object with id ${t.id} is already in use and it is not a line tool`);
                        if (l.toolname !== t.linetool) return void Vi.logError(`Error sync creating line tool. Object with id ${t.id} is already in use and its type differs: ${l.toolname} and ${t.linetool}`)
                    }
                    if (l && (l.linkKey().setValue(t.linkKey), l.share(t.sharingMode)), t.pointPositionPercents) {
                        const e = {
                            index: 0,
                            price: 0
                        };
                        if (n = null != l ? l : i.createLineTool({
                                pane: s,
                                point: e,
                                linetool: t.linetool,
                                properties: a,
                                linkKey: t.linkKey,
                                disableSynchronization: !0,
                                id: t.id
                            }), null === n) return;
                        n.restorePositionPercents((0, r.ensureDefined)(t.pointPositionPercents))
                    } else {
                        const o = t.points.map((i => ({
                                index: (0, r.ensureNotNull)(Oi(e, t.model, i.timeStamp)),
                                price: i.price
                            }))),
                            c = o[0];
                        if (n = null != l ? l : i.createLineTool({
                                pane: s,
                                point: c,
                                linetool: t.linetool,
                                properties: a,
                                linkKey: t.linkKey,
                                sharingMode: t.sharingMode,
                                disableSynchronization: !0,
                                id: t.id
                            }), null === n) return;
                        if (e.lineBeingCreated())
                            for (let e = 1; e < o.length; e++) e === o.length - 1 && (0, D.isLineToolFinishRequiredWhenCreatedByApi)(t.linetool) && n.finish(), i.continueCreatingLine(o[e], new q.EnvironmentState(void 0, !0), e < o.length - 1, !0)
                    }
                    n.properties().interval.setValue(t.state.interval), n.restoreExternalState(t.state), n.restoreData && n.restoreData(t), n.propertiesChanged(!0), t.finalState && (n.calcIsActualSymbol(), n.restoreExternalPoints(t.finalState, {
                        pricesChanged: !0,
                        indexesChanged: !0
                    }, !0)), t.alertId && n.syncAlert(t.alertId)
                }))
            }))
        }
        _setFirstRequestNumbarsUsingTimeframeAndInterval(e) {
            const t = function(e) {
                var t, i, s, r, n, o, a, l, c, h, d, u, p;
                const _ = null !== (t = e.numberExtraBars) && void 0 !== t ? t : 0,
                    m = e.barSpacing || 6,
                    g = Math.ceil(e.width / m) + _;
                if (e.timeFrame) {
                    if (!e.interval) return {
                        barCount: g
                    };
                    const t = ki.Interval.parse(e.interval);
                    if ("string" == typeof e.timeFrame) {
                        if ("ALL" === e.timeFrame) return {
                            barCount: g
                        };
                        let l = e.timeFrame;
                        "YTD" === e.timeFrame && (l = `${Math.floor(((new Date).valueOf()-new Date((new Date).getFullYear(),0,0).valueOf())/1e3/60/60/24)}D`);
                        const c = ki.Interval.parse(l),
                            h = Date.now().valueOf(),
                            d = h - c.inMilliseconds();
                        return {
                            barCount: (0, Li.getPeriodsBetweenDates)(null !== (s = null === (i = e.symbolInfo) || void 0 === i ? void 0 : i.session) && void 0 !== s ? s : "24x7", null !== (n = null === (r = e.symbolInfo) || void 0 === r ? void 0 : r.session_holidays) && void 0 !== n ? n : "", null !== (a = null === (o = e.symbolInfo) || void 0 === o ? void 0 : o.corrections) && void 0 !== a ? a : "", t.letter(), t.multiplier(), d, h) + _,
                            message: `based on period of ${l}`,
                            shouldAdjustBarSpacing: !0
                        }
                    }
                    if ("time-range" === e.timeFrame.type) return {
                        barCount: (0, Li.getPeriodsBetweenDates)(null !== (c = null === (l = e.symbolInfo) || void 0 === l ? void 0 : l.session) && void 0 !== c ? c : "24x7", null !== (d = null === (h = e.symbolInfo) || void 0 === h ? void 0 : h.session_holidays) && void 0 !== d ? d : "", null !== (p = null === (u = e.symbolInfo) || void 0 === u ? void 0 : u.corrections) && void 0 !== p ? p : "", t.letter(), t.multiplier(), 1e3 * e.timeFrame.from, 1e3 * e.timeFrame.to) + _,
                        message: `based on time range: ${e.timeFrame.from} ... ${e.timeFrame.to}`,
                        shouldAdjustBarSpacing: !0
                    }
                }
                return {
                    barCount: g
                }
            }({
                width: e.timeScale().width(),
                barSpacing: e.timeScale().barSpacing(),
                timeFrame: this.options().defTimeframe,
                interval: this.options().defInterval
            });
            if (Oe.enabled("charting_library_debug_mode") && console.log(`Setting initial data request count to ${t.barCount} bars${t.message?` (${t.message})`:""}`), e.mainSeries().seriesSource().setInitialRequestOptions({
                    count: t.barCount
                }), t.shouldAdjustBarSpacing && "number" == typeof t.barCount && t.barCount > 0) {
                const i = Math.ceil(e.timeScale().width() / t.barCount);
                e.timeScale().setBarSpacing(i)
            }
        }
        _showOrHideDataWindowWidget() {
            const e = window.widgetbar,
                t = null == e ? void 0 : e.layout;
            if (!t) return;
            const i = t.getActivePage();
            i && "data-window" === i.name || (t.setMinimizedState(!1), e.setPage("data-window"))
        }
    }
}