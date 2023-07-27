(e, t, i) => {
    "use strict";
    i.r(t), i.d(t, {
        activeLinkingGroupWV: () => gi,
        allInitialModelsCreated: () => ei,
        allInitialSymbolsResolved: () => Qt,
        allLinkingGroupsWV: () => vi,
        applyIndicatorToAllChartsImpl: () => ut,
        applyIndicatorsToAllChartsImpl: () => dt,
        applyLineToolUpdateNotificationImpl: () => yt,
        applyThemeImpl: () => si,
        chartsSymbolsImpl: () => Pt,
        checkProFeatureImpl: () => ti,
        computeContentBoxImpl: () => Dt,
        copyScreenshotToClipboard: () => Mt,
        createBroadcastChannel: () => Zt,
        createChartStorageSubscriptionsIfRequired: () => Ct,
        createClipboardHandler: () => bt,
        createLeftBottomChartWidgetWV: () => Lt,
        deserializedChartIds: () => vt,
        destroyBroadcastChannel: () => Xt,
        downloadScreenshot: () => It,
        generateNewChartId: () => Wt,
        getAllLinkingGroups: () => fi,
        getAsyncStateForChartImpl: () => gt,
        getChartWidgetsForIntervalLock: () => _i,
        getClientSnapshot: () => Et,
        getLinkingGroupCharts: () => yi,
        getSnapshot: () => kt,
        getStateForChartImpl: () => mt,
        getVisuallyAdjacentDefImpl: () => Ot,
        handleConnectionLimitReachedChanged: () => wi,
        handleDateRangeLockChange: () => ci,
        handleInternalDateRangeLockChange: () => li,
        handleInternalIntervalLockChange: () => oi,
        handleInternalSymbolLockChange: () => ri,
        handleInternalTrackTimeLockChange: () => hi,
        handleIntervalLockChange: () => ai,
        handleSymbolLockChange: () => ni,
        handleTrackTimeLockChange: () => di,
        hideChartImpl: () => jt,
        isFirstChartInLayout: () => ft,
        lineToolsAndGroupsDTOsImpl: () => _t,
        removeChartWidgetSubscriptionsImpl: () => Gt,
        resetLineToolsInvalidatedImpl: () => St,
        setBrokerImpl: () => wt,
        setChartLayoutWithUndoImpl: () => ii,
        setLayoutImpl: () => $t,
        setResolution: () => mi,
        setSymbol: () => ui,
        setSymbolAll: () => pi,
        syncCrosshairImpl: () => Kt,
        syncScrollImpl: () => Jt,
        takeScreenshot: () => xt,
        takeServerScreenshot: () => Tt,
        updateLayoutImpl: () => Nt,
        updateLayoutPartialImpl: () => Rt,
        updateLinkingGroupCharts: () => bi
    });
    var s = i(50151),
        r = i(86441),
        n = i(59224),
        o = i(44352),
        a = i(36298),
        l = i(69109),
        c = i(49483),
        h = i(14483);

    function d(e) {
        const t = {};
        return {
            promise: new Promise(((i, s) => {
                e.subscribe(t, i, !0)
            })),
            destroy: () => {
                e.unsubscribeAll(t)
            }
        }
    }
    i(98310);
    var u = i(62591);
    class p extends u.UndoCommand {
        constructor(e, t) {
            super(null), this._chartModel = e, this._targetIndex = t
        }
        redo() {
            const e = this._chartModel.createPane(this._targetIndex, void 0, this._paneId);
            this._paneId = e.id()
        }
        undo() {
            const e = (0, s.ensureDefined)(this._paneId),
                t = this._chartModel.panes().find((t => t.id() === e));
            void 0 !== t && this._chartModel.removePane(t)
        }
        createdPaneId() {
            return this._paneId
        }
    }
    class _ extends u.UndoCommand {
        constructor(e, t, i, s) {
            super(s), this._setter = e, this._oldValue = t, this._newValue = i
        }
        redo() {
            this._setter(this._newValue)
        }
        undo() {
            this._setter(this._oldValue)
        }
    }
    class m extends _ {
        constructor(e, t, i, s) {
            super((e => this._vwState.setValue(e)), t, i, s), this._vwState = e
        }
    }
    var g = i(94474),
        f = i(65446),
        v = i(93352);
    const S = (0, n.getLogger)("Clipboard");
    class y {
        constructor(e) {
            this._e = e
        }
        write(e) {
            return (0, f.writeImpl)(this._toRaw(e), this._e)
        }
        _toRaw(e) {
            const t = {
                files: []
            };
            t.text = e.text, void 0 !== e.app ? t.html = this._serializeAppData(e.app, e.text) : e.html && (t.html = e.html);
            for (const i of e.files || []) t.files.push(i);
            return t
        }
        _serializeAppData(e, t) {
            return `<meta charset="utf-8"><span data-tradingview-clip="${(0,g.htmlEscape)(e)}">${t?(0,g.htmlEscape)(t.slice(0,256)):"&#128200;"}</span>`
        }
    }
    class b {
        constructor(e) {
            this._e = e
        }
        async read() {
            this._e && 0 === this._e.eventPhase && (S.logWarn("Cannot use an already dispatched ClipboardEvent for reading"), this._e = null);
            const e = this._e ? this._readUsingEvent(this._e) : await this._readUsingApi();
            return this._fromRaw(e)
        }
        _readUsingEvent(e) {
            const t = (0, s.ensure)(e.clipboardData);
            e.preventDefault();
            const i = {
                files: []
            };
            for (let e = 0; e < t.files.length; e++) i.files.push(t.files[e]);
            for (let e = 0; e < t.items.length; e++) {
                const s = t.items[e];
                "string" === s.kind && ("text/plain" === s.type ? i.text = t.getData(s.type) : "text/html" === s.type ? i.html = t.getData(s.type) : i.files.push(new Blob([t.getData(s.type)], {
                    type: s.type
                })))
            }
            return i
        }
        async _readUsingApi() {
            const e = (0, v.getClipboard)();
            if (!e || !e.read) throw new DOMException("ClipboardApi is not supported", "NotSupportedError");
            let t, i;
            const s = [],
                r = await e.read();
            for (const e of r)
                for (const r of e.types) "text/html" === r ? t = e.getType(r).then(this._readBlobAsText) : "text/plain" === r ? i = e.getType(r).then(this._readBlobAsText) : s.push(e.getType(r));
            return {
                text: await i,
                html: await t,
                files: await Promise.all(s)
            }
        }
        _fromRaw(e) {
            const t = {};
            if (void 0 !== e.text && (t.text = e.text), void 0 !== e.html) {
                const i = this._parseAppData(e.html);
                i ? t.app = i : t.html = e.html
            }
            return e.files.length > 0 && (t.files = e.files), t
        }
        _parseAppData(e) {
            if (-1 === e.slice(0, 1024).indexOf("data-tradingview-clip")) return;
            const t = (new DOMParser).parseFromString(e, "text/html").querySelector("[data-tradingview-clip]");
            return t ? t.getAttribute("data-tradingview-clip") || "" : void 0
        }
        _readBlobAsText(e) {
            return new Promise(((t, i) => {
                const s = new FileReader;
                s.onloadend = () => {
                    t(s.result)
                }, s.onerror = () => {
                    i(s.error)
                }, s.readAsText(e)
            }))
        }
    }
    var w = i(35749);

    function P(e) {
        const t = e.target;
        return null !== t && 1 === t.nodeType && (0, w.isTextEditingField)(t)
    }

    function C(e) {
        const t = e.target;
        if (null === t) return !1;
        const i = (t.ownerDocument || t).getSelection();
        return null !== i && !i.isCollapsed
    }
    class x extends class {
        constructor(e) {
            this._callbacks = Object.assign({}, e), this._boundOnCopy = this._onCopyEv.bind(this), this._boundOnCut = this._onCutEv.bind(this), this._boundOnPaste = this._onPasteEv.bind(this)
        }
        listen() {
            document.addEventListener("copy", this._boundOnCopy), document.addEventListener("cut", this._boundOnCut), document.addEventListener("paste", this._boundOnPaste)
        }
        async peek() {
            if ("granted" !== (await navigator.permissions.query({
                    name: "clipboard-read"
                })).state) throw new Error("clipboard-read is not granted");
            return new b(null).read()
        }
        uiRequestCopy(e) {
            this._callbacks.copyRequested && this._callbacks.copyRequested(new y(null), e)
        }
        uiRequestCut(e) {
            this._callbacks.cutRequested && this._callbacks.cutRequested(new y(null), e)
        }
        uiRequestPaste(e) {
            this._callbacks.pasteRequested && this._callbacks.pasteRequested(new b(null), e)
        }
        destroy() {
            document.removeEventListener("copy", this._boundOnCopy), document.removeEventListener("cut", this._boundOnCut), document.removeEventListener("paste", this._boundOnPaste)
        }
        _onCopyEv(e) {
            e.defaultPrevented || this._callbacks.copyRequested && this._callbacks.copyRequested(new y(e))
        }
        _onCutEv(e) {
            e.defaultPrevented || this._callbacks.cutRequested && this._callbacks.cutRequested(new y(e))
        }
        _onPasteEv(e) {
            e.defaultPrevented || this._callbacks.pasteRequested && this._callbacks.pasteRequested(new b(e))
        }
    } {
        _onCopyEv(e) {
            if (!P(e) && !C(e)) return super._onCopyEv(e)
        }
        _onCutEv(e) {
            if (!P(e) && !C(e)) return super._onCutEv(e)
        }
        _onPasteEv(e) {
            if (!P(e)) return super._onPasteEv(e)
        }
    }
    const T = () => i.e(4389).then(i.bind(i, 82869));

    function I(e, t = {}) {
        return T().then((i => i.copyToClipboardImageOfChart(e, t)))
    }

    function M(e, t = {}) {
        return T().then((i => i.getImageOfChartSilently(e, t)))
    }
    var A = i(76422),
        L = i(84015),
        k = i(5286),
        E = i(27714),
        D = i(24377),
        V = i(26843),
        B = i(78071),
        R = i(74359),
        N = i(46501),
        O = i(29764),
        F = i(34976),
        W = i(76351);
    const z = !h.enabled("widget_logo") || !1;

    function H(e, t = null, i = null) {
        let s = {};
        if ("number" == typeof e) return {
            relativePositions: {
                [e]: {
                    l: t,
                    t: i
                }
            },
            nextElementLeft: e,
            nextElementTop: e
        };
        const [r, ...n] = e;
        if ("v" === r) {
            let e = null;
            for (const r of n) {
                const n = H(r, t, i);
                s = {
                    ...s,
                    ...n.relativePositions
                }, i = n.nextElementTop, e = n.nextElementLeft
            }
            t = e
        }
        if ("h" === r) {
            let e = null;
            for (const r of n) {
                const n = H(r, t, i);
                s = {
                    ...s,
                    ...n.relativePositions
                }, t = n.nextElementLeft, e = n.nextElementTop
            }
            i = e
        }
        return {
            relativePositions: s,
            nextElementTop: i,
            nextElementLeft: t
        }
    }
    const U = function(e) {
        const t = {};
        for (const i of Object.keys(e)) {
            const s = H(e[i]).relativePositions;
            t[i] = s
        }
        return t
    }(F);

    function j(e, t, i, s) {
        let r = Math.round(10 * s),
            n = Math.round(10 * s);
        const o = i[e];
        if (null !== o.l) {
            const e = j(o.l, t, i, s);
            r = e.x + e.width + Math.round(5 * s)
        }
        if (null !== o.t) {
            const e = j(o.t, t, i, s);
            n = e.y + e.height + Math.round(5 * s)
        }
        const a = t[e];
        return {
            x: r,
            y: n,
            width: a.width,
            height: a.height
        }
    }

    function G(e, t, i) {
        var s;
        const r = (new DOMParser).parseFromString(W, "image/svg+xml");
        null === (s = null == r ? void 0 : r.firstElementChild) || void 0 === s || s.setAttribute("color", i);
        const n = URL.createObjectURL(new Blob([(new XMLSerializer).serializeToString(r)], {
            type: "image/svg+xml"
        }));
        return new Promise((i => {
            const s = new Image;
            s.width = e, s.height = t, s.onload = () => {
                i({
                    image: s,
                    width: e,
                    height: t
                })
            }, s.src = n
        }))
    }

    function q(e, t, i, s, r) {
        e.save(), e.drawImage(s.image, t, i, s.width, s.height), e.textBaseline = "bottom";
        const n = (t + s.width) / r + 3,
            o = (i + s.height) / r;
        (0, R.drawScaled)(e, r, r, (() => {
            e.fillText("TradingView", n, o)
        })), e.restore()
    }

    function $(e, t, i, s) {
        return (0, R.drawScaled)(e, s, s, (() => {
            e.fillText(i, t.x / s, t.y / s)
        })), e.measureText(i).width * s
    }

    function Y(e, t, i, s, n, o) {
        const a = n.map((e => e.text)).join("");
        let l = i.x;
        const c = function(e, t, i, s) {
            if (e.measureText(t).width * s <= i) return {
                text: t,
                elided: !1
            };
            const r = e.measureText("...").width * s,
                n = [];
            for (let e = 0; e < t.length; ++e) n.push(e);
            const o = (0, B.upperbound)(n, i, ((n, o) => e.measureText(t.slice(0, o + 1)).width * s + r > i));
            return {
                text: (t = t.slice(0, o)).trim(),
                elided: !0
            }
        }(e, a, s - l, t);
        if (c.elided && !o) return null;
        const h = [];
        let d = 0;
        for (const e of n) {
            if (d + e.text.length > c.text.length) break;
            h.push(e.text), d += e.text.length
        }
        const u = h.join("").trim().length;
        d = 0;
        for (const s of n) {
            if (d + s.text.length > u) break;
            s.color && (e.save(), e.fillStyle = s.color), l += $(e, new r.Point(l, i.y), s.text, t), s.color && e.restore(), d += s.text.length
        }
        return c.elided && (l += $(e, new r.Point(l, i.y), "...", t)), l
    }

    function K(e) {
        return e.map((e => ({
            ...e,
            title: ""
        })))
    }

    function Z(e, t) {
        const i = [{
            text: e.trim()
        }];
        for (const e of t) e.visible && ("" !== i[i.length - 1].text && i.push({
            text: "  "
        }), e.title && i.push({
            text: e.title
        }), i.push({
            text: e.value,
            color: e.color
        }));
        return i
    }
    class X {
        constructor(e, t) {
            this._logoTextColor = null, this._snapshotData = e, t = t || {}, this._options = {
                backgroundColor: k.themes[e.theme].getThemedColor("color-bg-primary"),
                borderColor: k.themes[e.theme].getThemedColor("color-border"),
                font: N.CHART_FONT_FAMILY,
                fontSize: 12,
                legendMode: "vertical",
                hideResolution: !1,
                showHeaderPublishedBy: !1,
                showHeaderMainSymbol: !1,
                ...t
            };
            const i = U[e.layout],
                s = e.charts.map((e => function(e) {
                    const t = e.panes[0],
                        i = t.canvas.width + t.leftAxis.canvas.width + t.rightAxis.canvas.width;
                    let s = 0;
                    for (const t of e.panes) s += t.canvas.height;
                    return void 0 !== e.timeAxis && 0 !== e.timeAxis.contentHeight && (s += e.timeAxis.canvas.height), (0, E.size)({
                        width: i,
                        height: s
                    })
                }(e)));
            if (this._pixelRatio = e.hidpiRatio, this._chartsGeometry = e.charts.map(((e, t) => j(t, s, i, this._pixelRatio))), !z) {
                let i = e.theme;
                void 0 !== t.backgroundColor && (i = "black" === (0, D.rgbToBlackWhiteString)((0, D.parseRgb)(t.backgroundColor), 150) ? V.StdTheme.Dark : V.StdTheme.Light), this._logoTextColor = k.themes[i].getThemedColor("color-text-primary")
            }
            this._headerDefaultTextColor = k.themes[e.theme].getThemedColor("color-text-primary")
        }
        async getImage() {
            const e = this._pixelRatio;
            let t = 0,
                i = 0,
                s = 0;
            const n = this._headerItems();
            if (n.length > 0) {
                s = Math.ceil(1.4 * this._options.fontSize * e) * n.length
            }
            i += s;
            let o = 0,
                a = 0;
            for (const e of this._chartsGeometry) o = Math.max(o, e.x + e.width), a = Math.max(a, e.y + e.height);
            const l = i;
            t += o, i += a, t += Math.round(10 * e);
            const c = z ? Math.round(10 * e) : Math.round(35 * e),
                h = i;
            i += c;
            const d = (0, R.createDisconnectedCanvas)(document, (0, E.size)({
                    width: t,
                    height: i
                }), 1),
                u = (0, R.getContext2D)(d);
            u.font = (0, O.makeFont)(this._options.fontSize, this._options.font), u.textBaseline = "top", u.fillStyle = this._options.backgroundColor, u.fillRect(0, 0, t, i), n.length > 0 && this._drawHeader(u, n, t, new r.Point(Math.round(10 * e), Math.round(10 * e)));
            for (let e = 0; e < this._snapshotData.charts.length; ++e) {
                const t = this._snapshotData.charts[e],
                    i = this._chartsGeometry[e];
                this._drawChart(t, i, u, new r.Point(0, l))
            }
            if (null !== this._logoTextColor) {
                const t = await G(Math.round(20 * e), Math.round(15 * e), this._logoTextColor);
                u.fillStyle = this._logoTextColor, u.font = (0, O.makeFont)(13, N.CHART_FONT_FAMILY);
                const i = h + Math.round(c / 2 - t.height / 2);
                q(u, Math.round(10 * e), i, t, e)
            }
            return d
        }
        _drawChart(e, t, i, s) {
            i.save(), i.translate(t.x + s.x, t.y + s.y);
            let n = 0;
            for (const t of e.panes) {
                let s = 0;
                const o = t.leftAxis.canvas.width + Math.round(8 * this._pixelRatio),
                    a = n,
                    l = n + Math.round(10 * this._pixelRatio);
                t.leftAxis.contentWidth > 0 && t.leftAxis.contentHeight > 0 && (i.drawImage(t.leftAxis.canvas, s, n), s += t.leftAxis.canvas.width), i.drawImage(t.canvas, s, n), s += t.canvas.width, t.rightAxis.contentWidth > 0 && t.rightAxis.contentHeight > 0 && i.drawImage(t.rightAxis.canvas, s, n), "pane" === t.type && (i.fillStyle = e.colors.text, this._drawLegend(t, i, new r.Point(o, l), a)), n += t.canvas.height
            }
            if (void 0 !== e.timeAxis && 0 !== e.timeAxis.contentHeight) {
                let t = 0;
                e.timeAxis.lhsStub.contentWidth > 0 && e.timeAxis.lhsStub.contentHeight > 0 && (i.drawImage(e.timeAxis.lhsStub.canvas, t, n), t += e.timeAxis.lhsStub.canvas.width), i.drawImage(e.timeAxis.canvas, t, n), t += e.timeAxis.canvas.width, e.timeAxis.rhsStub.contentWidth > 0 && e.timeAxis.rhsStub.contentHeight > 0 && i.drawImage(e.timeAxis.rhsStub.canvas, t, n)
            }
            i.strokeStyle = this._options.borderColor, i.strokeRect(0, 0, t.width, t.height), i.restore()
        }
        _headerItems() {
            var e, t, i, s;
            const r = [];
            if (this._options.showHeaderPublishedBy && this._snapshotData.publishedBy)
                for (const e of this._snapshotData.publishedBy) r.push([{
                    text: e
                }]);
            if (this._options.showHeaderMainSymbol) {
                const n = this._snapshotData.charts[0],
                    o = `${null===(e=n.meta)||void 0===e?void 0:e.symbol}, ${null===(t=n.meta)||void 0===t?void 0:t.resolution}`;
                r.push(Z(o, null !== (s = null === (i = n.meta) || void 0 === i ? void 0 : i.values) && void 0 !== s ? s : []))
            }
            return r
        }
        _drawHeader(e, t, i, s) {
            e.save(), e.fillStyle = this._headerDefaultTextColor;
            const n = Math.ceil(1.4 * this._options.fontSize * this._pixelRatio);
            t.forEach(((t, o) => {
                Y(e, this._pixelRatio, new r.Point(s.x, s.y + n * o), i, t, !0)
            })), e.restore()
        }
        _drawLegend(e, t, i, n) {
            let o = !0;
            const a = Math.ceil(1.4 * this._options.fontSize * this._pixelRatio);
            let l = i.x,
                c = i.y;
            if (e.mainSeriesText && c + a < n + e.canvas.height) {
                const i = Y(t, this._pixelRatio, new r.Point(l, c), e.contentWidth * this._pixelRatio, Z(e.mainSeriesText, e.mainSeriesValues), !0);
                "horizontal" !== this._options.legendMode ? c += a : (l = (0, s.ensureNotNull)(i) + 1.4 * this._options.fontSize * this._pixelRatio, o = !1)
            }
            for (let s = 0; s < e.studies.length; ++s)
                if (c + a < n + e.canvas.height) {
                    const n = e.studies[s],
                        h = e.studiesValues[s];
                    let d = null;
                    for (; null === d;) d = Y(t, this._pixelRatio, new r.Point(l, c), e.contentWidth * this._pixelRatio, Z(n, K(h)), o), "horizontal" !== this._options.legendMode ? c += a : null === d ? (o = !0, l = i.x, c += a) : (l = d + 1.4 * this._options.fontSize * this._pixelRatio, o = !1)
                }
        }
    }
    var J = i(36174),
        Q = i(75531),
        ee = i(31940),
        te = i(66509),
        ie = i(26097),
        se = i(22767),
        re = i(42184),
        ne = i(28571);
    const oe = new a.TranslatedString("change chart layout to {title}", o.t(null, void 0, i(30501)));
    class ae extends u.UndoCommand {
        constructor(e, t) {
            super(oe.format({
                title: Q.layouts[t].title
            })), this._chartWidgetCollection = e, this._newLayoutType = t, this._oldLayoutType = e.layout.value()
        }
        redo() {
            this._chartWidgetCollection.setLayout(this._newLayoutType)
        }
        undo() {
            this._chartWidgetCollection.setLayout(this._oldLayoutType)
        }
    }
    var le = i(1722),
        ce = i(88348),
        he = i(48891),
        de = i(19266),
        ue = i(34565),
        pe = i(71254),
        _e = i(34026),
        me = i(79849),
        ge = i(68441),
        fe = i(45197);
    class ve {
        constructor(e, t, i) {
            this._data = e, this._hittest = t,
                this._textWidthCache = i
        }
        draw(e, t) {
            const i = t.pixelRatio,
                s = this._data.centerPoint,
                n = Math.round(s.x * i),
                o = Math.round(s.y * i),
                a = Math.max(1, Math.floor(i)) % 2 / 2,
                l = new r.Point(n + a, o - a);
            this._drawLollipop(e, l, t), this._drawLabel(e, l, t.pixelRatio)
        }
        hitTest(e, t) {
            const i = (0, fe.interactionTolerance)().esd,
                s = this._data.centerPoint.y - this._data.style.lollipop.height / 2 - i,
                n = this._data.centerPoint.x - this._data.style.lollipop.width / 2 - i,
                o = (0, r.box)(new r.Point(n, s), new r.Point(n + this._data.style.lollipop.width + 2 * i, s + this._data.style.lollipop.height + 2 * i));
            return (0, _e.pointInBox)(e, o) ? this._hittest : null
        }
        _drawLollipop(e, t, i) {
            const s = this._data.style,
                r = i.pixelRatio,
                n = this._fillRadius(r);
            s.lollipop.fillCircle && s.lollipop.backgroundColor && this._drawFilledCircle(e, t, n, s.lollipop.backgroundColor);
            const o = Math.round(s.lollipop.lineWidth * r),
                a = n - Math.round(1 * r + o / 2);
            this._drawBorderLine(e, t, o, a), s.lollipop.fillCircle && s.lollipop.fillStyle && this._drawFilledCircle(e, t, a, s.lollipop.fillStyle)
        }
        _drawLabel(e, t, i) {
            const s = this._data.style.lollipop.text,
                r = s.label;
            if ("" === r) return;
            e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = s.strokeStyle, e.font = s.font;
            const n = this._textWidthCache.yMidCorrection(e, r);
            e.translate(t.x, t.y + ((s.deltaY || 0) + n) * i), (0, R.drawScaled)(e, i, i, (() => {
                e.fillText(r, 0, 0)
            }))
        }
        _fillRadius(e) {
            const t = this._data.style,
                i = Math.max(1, Math.floor(e));
            let s = Math.round(t.lollipop.width * e);
            return s % 2 != i % 2 && (s += 1), s / 2
        }
        _drawBorderLine(e, t, i, s) {
            const r = this._data.style;
            e.strokeStyle = r.lollipop.strokeStyle, e.lineWidth = i, (0, ge.setLineStyle)(e, me.LINESTYLE_SOLID), (0, ge.createCircle)(e, t.x, t.y, s), e.stroke()
        }
        _drawFilledCircle(e, t, i, s) {
            e.fillStyle = s, (0, ge.createCircle)(e, t.x, t.y, i), e.fill()
        }
    }
    var Se = i(18807);
    class ye extends ve {
        _drawLollipop(e, t, i) {
            var s;
            if (!this._imageLoaded()) return void super._drawLollipop(e, t, i);
            const r = this._data.style,
                n = i.pixelRatio,
                o = this._fillRadius(n);
            let a = Math.round(r.lollipop.lineWidth * n),
                l = o - Math.round(1 * n + a / 2);
            if (r.lollipop.fillCircle && (r.lollipop.backgroundColor && this._drawFilledCircle(e, t, o, r.lollipop.backgroundColor), r.lollipop.fillStyle && this._drawFilledCircle(e, t, l, r.lollipop.fillStyle)), null === (s = this._data.style.lollipop.image) || void 0 === s ? void 0 : s.imageElement) {
                const i = o - Math.round(1 * n + 2 * a),
                    s = 2 * i;
                e.save(), e.imageSmoothingEnabled = !0, e.imageSmoothingQuality = "high", (0, ge.createCircle)(e, t.x, t.y, i), e.clip(), e.drawImage(this._data.style.lollipop.image.imageElement, t.x - i, t.y - i, s, s), e.restore()
            }
            "active" === this._data.status && (l -= a / 2, a *= 1.5), this._drawBorderLine(e, t, a, l)
        }
        _drawLabel(e, t, i) {
            this._imageLoaded() && !this._data.style.lollipop.text.showWhenImageLoaded || super._drawLabel(e, t, i)
        }
        _imageLoaded() {
            return Boolean(this._data.style.lollipop.image && this._data.style.lollipop.image.imageElement && this._data.style.lollipop.image.imageElement.complete && this._data.style.lollipop.image.imageElement.naturalWidth)
        }
    }
    const be = {
            fillPath: new Path2D("M8.961.92a3 3 0 0 1 3.078 0l7.5 4.48A3 3 0 0 1 21 7.975V20a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V7.975A3 3 0 0 1 1.461 5.4l7.5-4.48z"),
            strokePath: new Path2D("M9.867 2.742c.39-.23.875-.23 1.266 0l7.5 4.406c.382.225.617.635.617 1.078V20c0 .69-.56 1.25-1.25 1.25H3c-.69 0-1.25-.56-1.25-1.25V8.226c0-.443.235-.853.617-1.078l7.5-4.406z")
        },
        we = {
            fillPath: new Path2D("M8.961 22.08a3 3 0 0 0 3.078 0l7.5-4.48A3 3 0 0 0 21 15.025V3a3 3 0 0 0-3-3H3a3 3 0 0 0-3 3v12.025A3 3 0 0 0 1.461 17.6l7.5 4.48z"),
            strokePath: new Path2D("M9.866 20.257c.391.23.877.23 1.268 0l7.5-4.414a1.25 1.25 0 0 0 .616-1.078V3c0-.69-.56-1.25-1.25-1.25H3c-.69 0-1.25.56-1.25 1.25v11.765c0 .443.234.853.616 1.078l7.5 4.414z")
        },
        Pe = {
            fillPath: new Path2D("M3 0h15c1.662 0 3 1.338 3 3v15c0 1.662-1.338 3-3 3H3c-1.662 0-3-1.338-3-3V3c0-1.662 1.338-3 3-3z"),
            strokePath: new Path2D("M3 1.75h15c.693 0 1.25.557 1.25 1.25v15c0 .693-.557 1.25-1.25 1.25H3c-.692 0-1.25-.558-1.25-1.25V3c0-.692.558-1.25 1.25-1.25z")
        };

    function Ce(e, t, i, s, r) {
        const n = i.pixelRatio;
        e.save(), e.translate(t.x - s.lollipop.width * n / 2, t.y - s.lollipop.height * n / 2), e.scale(n, n), s.lollipop.fillCircle && s.lollipop.backgroundColor && (e.fillStyle = s.lollipop.backgroundColor, e.fill(r.fillPath)), e.strokeStyle = s.lollipop.strokeStyle, e.lineWidth = Math.round(s.lollipop.lineWidth * n) / n, (0, ge.setLineStyle)(e, me.LINESTYLE_SOLID), s.lollipop.fillCircle && s.lollipop.fillStyle && (e.fillStyle = s.lollipop.fillStyle, e.fill(r.strokePath)), e.stroke(r.strokePath), e.restore()
    }

    function xe(e, t, i, s) {
        Ce(e, t, i, s, be)
    }

    function Te(e, t, i, s) {
        Ce(e, t, i, s, we)
    }

    function Ie(e, t, i, s) {
        Ce(e, t, i, s, Pe)
    }
    class Me extends ve {
        _drawLollipop(e, t, i) {
            const s = this._data.style;
            switch (s.shape) {
                case "earningUp":
                    xe(e, t, i, s);
                    break;
                case "earningDown":
                    Te(e, t, i, s);
                    break;
                case "earning":
                    Ie(e, t, i, s);
                    break;
                default:
                    super._drawLollipop(e, t, i)
            }
        }
    }
    const Ae = {
        backgroundDark: (0, he.getHexColorByName)("color-cold-gray-900"),
        backgroundLight: (0, he.getHexColorByName)("color-white")
    };
    class Le extends class {
        constructor(e, t, i) {
            this._invalidated = !1, this._renderer = new de.CompositeRenderer, this._textWidthCache = new ue.TextWidthCache, this._stylesCache = null, this._lollipops = {}, this._lollipopsCounter = 0, this._lastClickedId = null, this.onPaneBgChange = () => {
                this._recreateStyles(this._model)
            }, this._lastClickedId = null, this._model = e, this._source = t, this._clickHandler = i, this._recreateStyles(e), e.backgroundColor().subscribe(this.onPaneBgChange), e.mainSeries().onSymbolIntervalChanged().subscribe(this, this._onSymbolOrIntervalChanged)
        }
        destroy() {
            this._model.backgroundColor().unsubscribe(this.onPaneBgChange), this._model.mainSeries().onSymbolIntervalChanged().unsubscribeAll(this)
        }
        processClickOutside(e) {
            var t;
            if (null === this._lastClickedId || !e) return void this.clearLastClicked();
            let i = null;
            if (function(e) {
                    return void 0 !== e.touches
                }(e)) {
                if (1 !== e.touches.length) return;
                {
                    const t = (0, s.ensureNotNull)(e.target).getBoundingClientRect(),
                        n = e.touches[0];
                    i = new r.Point(n.clientX - t.left, n.clientY - t.top)
                }
            } else i = new r.Point(e.offsetX, e.offsetY);
            const n = this._renderer.hitTest(i, {
                physicalHeight: 0,
                physicalWidth: 0,
                pixelRatio: 1,
                cssHeight: 0,
                cssWidth: 0
            });
            null !== n && (null === (t = n.data()) || void 0 === t ? void 0 : t.activeItem) === (0,
                s.ensureDefined)(this._lollipops[this._lastClickedId]).itemIndex || this.clearLastClicked()
        }
        clearLastClicked() {
            const e = null !== this._lastClickedId && this._lollipops[this._lastClickedId] || null;
            null !== e && (e.active = !1), this._lastClickedId = null
        }
        getLastClickedLollipopId() {
            return this._lastClickedId
        }
        update() {
            this._invalidated = !0
        }
        afterUpdate(e, t, i, s) {}
        getStyle(e, t) {
            let i = t;
            if (e.stack && (i += "_stack:" + e.stack), "active" === i) return this._activeStyle;
            if ("hovered" === i) return this._hoveredStyle;
            if ("default" === i) return this._defaultStyle;
            if (this._stylesCache || (this._stylesCache = {}), !this._stylesCache[i]) {
                const s = (0, le.clone)("active" === t ? this._activeStyle : "hovered" === t ? this._hoveredStyle : this._defaultStyle);
                e.stack && (s.lollipop.incHeight = 25 * e.stack), this._stylesCache[i] = s
            }
            return this._stylesCache[i]
        }
        hasTooltip(e) {
            return !0
        }
        _getY() {
            let e = 0;
            const t = this._model.panes();
            for (let i = t.length; i--;) {
                const s = t[i];
                s.containsMainSeries() && (e += s.height())
            }
            return e
        }
        _showBarLine(e) {
            return this.hasTooltip(e) && (e.hovered || e.active)
        }
        _createRenderers(e, t) {
            this._renderer.clear();
            const i = (0, E.size)({
                width: e,
                height: t
            });
            for (const e in this._lollipops)
                if (this._lollipops.hasOwnProperty(e)) {
                    const t = (0, s.ensureDefined)(this._lollipops[e]);
                    if (t.visible) {
                        const e = this._getLollipopStatus(t),
                            s = this.getStyle(t, e),
                            n = {
                                id: t.id,
                                centerPoint: new r.Point(t.basePoint.x, t.basePoint.y - s.lollipop.bottom - s.lollipop.height / 2 - (s.lollipop.incHeight || 0)),
                                style: s,
                                status: e
                            },
                            o = {
                                activeItem: t.itemIndex,
                                hideCrosshairLinesOnHover: !0,
                                clickHandler: this._lollipopMouseClickHandler.bind(this, n, i),
                                tapHandler: this._lollipopMouseClickHandler.bind(this, n, i)
                            };
                        if (this._renderer.append(this._createRendererForLollipop(n, o)), this._showBarLine(t)) {
                            const {
                                strokeStyle: e,
                                lineStyle: i,
                                lineWidth: r
                            } = s.barLine, n = {
                                color: e,
                                linestyle: i,
                                linewidth: r,
                                x: t.basePoint.x,
                                top: 0,
                                bottom: t.basePoint.y - s.lollipop.bottom - s.lollipop.height
                            }, o = new pe.VerticalLineRenderer;
                            o.setData(n), this._renderer.insert(o, 0)
                        }
                    }
                }
        }
        _recreateStyles(e) {
            this._stylesCache = null
        }
        _createRendererForLollipop(e, t) {
            return new ve(e, new Se.HitTestResult(Se.HitTarget.Custom, t), this._textWidthCache)
        }
        _onSymbolOrIntervalChanged() {
            this._lollipops = {}, this._lollipopsCounter = 0, this._renderer.clear(), this.clearLastClicked()
        }
        _lollipopMouseClickHandler(e, t, i) {
            i.preventDefault();
            const n = e.id;
            if (this._lastClickedId = this._lastClickedId === n ? null : n, null === this._lastClickedId) return;
            const o = {
                target: i.target,
                targetSize: t,
                point: new r.Point(e.centerPoint.x, e.centerPoint.y - e.style.lollipop.height / 2 - 8),
                marginTop: 15
            };
            this._clickHandler(o, (() => {
                const e = (0, s.ensureDefined)(this._lollipops[n]);
                return this._createTooltipContent(e)
            }))
        }
        _getLollipopStatus(e) {
            return e.active ? "active" : e.hovered ? "hovered" : "default"
        }
    } {
        constructor(e, t, i) {
            super(e, t, i), this.stylesCache = {}, this.templatesCache = {}, this._itemIndexToId = new Map, this.source = t
        }
        clearCaches() {
            this.clearLastClicked(), this._lollipops = {}, this._lollipopsCounter = 0
        }
        update() {
            this._invalidated = !0
        }
        renderer(e, t) {
            return this._invalidated && (this._createLollipops(t, e), this._invalidated = !1), this._renderer
        }
        getStyle(e) {
            const t = e.active ? "active" : e.hovered ? "hovered" : "default";
            return this._generateStyle(t, e)
        }
        hasTooltip(e) {
            return Boolean(e.items && e.items.length)
        }
        _createTooltipContent(e) {
            const t = e.items;
            return t ? [{
                type: "common",
                subTitle: Array.isArray(t) ? t.map((e => ({
                    value: e
                }))) : [{
                    value: t
                }],
                style: {
                    color: e.color
                }
            }] : null
        }
        _createRendererForLollipop(e, t) {
            return new(e.style.lollipop.image ? ye : Me)(e, new Se.HitTestResult(Se.HitTarget.Custom, t), this._textWidthCache)
        }
        _lollipopMouseClickHandler(e, t, i) {
            super._lollipopMouseClickHandler(e, t, i), (0, A.emit)("onTimescaleMarkClick", e.id)
        }
        _createLollipops(e, t) {
            const i = this._model.timeScale(),
                s = super._getY(),
                n = this._model.lastHittestData(),
                o = this._model.hoveredSource(),
                a = this.source.marks(),
                l = new Map;
            Object.keys(a).forEach((e => {
                var t;
                const c = a[e],
                    h = c.id,
                    d = c.index;
                if (null != d) {
                    const e = h === this.getLastClickedLollipopId(),
                        a = this._lollipops[h],
                        u = void 0 !== a ? a.itemIndex : this._lollipopsCounter++;
                    this._itemIndexToId.has(u) || this._itemIndexToId.set(u, h);
                    const p = o === this.source && null !== n && n.activeItem === u,
                        _ = (null !== (t = l.get(d)) && void 0 !== t ? t : -1) + 1;
                    l.set(d, _), this._lollipops[h] = {
                        id: h,
                        itemIndex: u,
                        basePoint: new r.Point(i.indexToCoordinate(d) + 1, s),
                        hovered: p,
                        active: e,
                        label: c.label,
                        color: c.color,
                        items: c.tooltip,
                        visible: !0,
                        stack: _,
                        shape: c.shape,
                        image: this._getImageForUrl(c.imageUrl),
                        showLabelWhenImageLoaded: c.showLabelWhenImageLoaded,
                        textColor: c.labelFontColor
                    }
                }
            })), super._createRenderers(e, t)
        }
        _getImageForUrl(e) {
            if (e) return this.source.getImageElement(e)
        }
        _generateStyle(e, t) {
            const {
                color: i,
                label: s,
                stack: r,
                shape: n,
                image: o,
                textColor: a
            } = t;
            let l = e + i + s + (this._model.dark().value() ? "dark" : "light");
            if (void 0 !== r && (l += "_stack" + r), !(l in this.stylesCache)) {
                const c = this._model.dark().value() ? Ae.backgroundDark : Ae.backgroundLight;
                let h, d = i;
                if ("active" === e) h = i, d = "rgba(255, 255, 255, 0.92)";
                else if ("hovered" === e) {
                    const e = (0, D.tryParseRgba)(i);
                    if (null !== e) {
                        const t = e[3] * (1 - .85);
                        h = (0, D.rgbaToString)((0, D.rgba)(e[0], e[1], e[2], t))
                    }
                }
                a && (d = a);
                let u = 23,
                    p = 23,
                    _ = 1,
                    m = 0;
                "earning" === n ? (p = 21, u = 21, _ = 2) : "earningUp" === n ? (u = 21, m = 1, _ = 2) : "earningDown" === n && (u = 21, m = -.5, _ = .5);
                const g = {
                    barLine: {
                        lineStyle: me.LINESTYLE_DASHED,
                        lineWidth: 1,
                        strokeStyle: i
                    },
                    lollipop: {
                        width: u,
                        height: p,
                        bottom: _,
                        backgroundColor: c,
                        lineWidth: 1.5,
                        fillStyle: h,
                        strokeStyle: i,
                        fillCircle: !0,
                        text: {
                            label: s,
                            deltaY: m,
                            strokeStyle: d,
                            font: (0, O.makeFont)(12, N.CHART_FONT_FAMILY, "bold"),
                            showWhenImageLoaded: t.showLabelWhenImageLoaded
                        },
                        image: o
                    },
                    shape: n
                };
                void 0 !== r && (g.lollipop.incHeight = 25 * r), this.stylesCache[l] = g
            }
            return this.stylesCache[l]
        }
    }
    var ke = i(46100),
        Ee = i(98517),
        De = i(12767),
        Ve = i(36112);
    const Be = (0, n.getLogger)("Chart.UserDefinedImageMarks");
    class Re extends Ve.BarsMarksContainer {
        constructor() {
            super(...arguments), this._imageItems = new Map, this._destroyed = !1
        }
        destroy() {
            this._destroyed = !0, super.destroy()
        }
        getImageElement(e) {
            return this._imageItems.has(e) || this.addImageToStore(e), this._imageItems.get(e)
        }
        addImageToStore(e) {
            this._imageItems.has(e) || this._loadNewImage(e)
        }
        _loadNewImage(e) {
            const t = {
                imageElement: null
            };
            (0, De.getImage)(e, e).then((e => {
                this._destroyed || (t.imageElement = e, this.updateAllViewsAndRepaint(),
                    this._model.updateSource(this))
            })).catch((() => {
                Be.logWarn(`An error ocurred while loading image ${e}`)
            })), this._imageItems.set(e, t)
        }
    }
    class Ne extends Re {
        constructor(e) {
            super(e, new ke.DefaultProperty("UserDefinedTimescaleMarks", {
                visible: !0
            })), this._requestedPointsets = new Set, (0, ce.hideMarksOnBars)().subscribe(this, (() => this._properties.childs().visible.setValue(!(0, ce.hideMarksOnBars)().value()))), this._paneView = new Le(e, this, this._showTooltip.bind(this)), this._paneViews = [this._paneView]
        }
        destroy() {
            (0, ce.hideMarksOnBars)().unsubscribeAll(this), super.destroy()
        }
        zorder() {
            return Ee.sortSourcesPreOrdered.TimeScaleMarks
        }
        userEditEnabled() {
            return !1
        }
        clearMarks(e = 0) {
            if (1 === e) return;
            const t = this._model.chartApi();
            t.isConnected().value() && Object.keys(this._marks).forEach((e => {
                const i = this._getPointsetId(e);
                t.removePointset(i)
            })), this._requestedPointsets.clear(), super.clearMarks(), this._paneView.clearCaches(), this.updateAllViewsAndRepaint()
        }
        hasContextMenu() {
            return !1
        }
        paneViews() {
            return this._properties.childs().visible.value() ? this._paneViews : []
        }
        updateAllViews() {
            this._paneView.update()
        }
        onClickOutside() {
            this._paneView.processClickOutside()
        }
        _initialize() {
            this._properties.childs().visible.setValue(!0)
        }
        _plateViewData(e) {
            return {
                text: e.text
            }
        }
        _getData(e) {
            const t = this._model.mainSeries().symbolInfo();
            if (!t) return;
            const i = this.roundRange(this._rangeDifference(e)),
                r = this._model.mainSeries(),
                n = r.seriesSource().symbolInstanceId(),
                o = r.properties().childs().interval.value();
            window.ChartApiInstance.getTimescaleMarks(t, i.start, i.end, (t => {
                const i = this._model.chartApi();
                for (const e of t) {
                    e.index = null;
                    const t = e.id,
                        r = this._getPointsetId(t.toString()),
                        a = this._marks[t];
                    if (a && null !== a.index && (a.tickmark === e.tickmark ? e.index = a.index : this._requestedPointsets.has(r) && i.isConnected().value() && (i.removePointset(r), this._requestedPointsets.delete(r))), e.imageUrl && this.addImageToStore(e.imageUrl), this._marks[t] = e, null === e.index && i.isConnected().value()) {
                        this._requestedPointsets.add(r);
                        const t = [
                            [e.tickmark, 0]
                        ];
                        i.createPointset(r, "turnaround", (0, s.ensureNotNull)(n), o, t, (e => this._onPointsetData(e)))
                    }
                }
                this._loadedRange = this._rangeUnion(e, this._loadedRange), this.updateAllViewsAndRepaint()
            }), o)
        }
        _getPointsetId(e) {
            return "pointsetMark_" + e
        }
        _onPointsetData(e) {
            if ("data_update" === e.method) {
                const t = e.params.customId.split("_")[1],
                    i = this._marks[t],
                    s = e.params.plots;
                i && 1 === s.length && (i.index = s[0].value[0])
            }
            this.updateAllViews()
        }
        async _showTooltip(e, t) {
            const r = t();
            if (!r) return;
            const n = this._model.timeScale(),
                o = [n.onScroll(), n.barSpacingChanged(), this._model.mainSeries().onSymbolIntervalChanged(), (0, s.ensureNotNull)(this._model.paneForSource(this)).onSizeChanged()],
                a = this._paneView.processClickOutside.bind(this._paneView),
                l = this._paneView.clearLastClicked.bind(this._paneView);
            (await Promise.all([i.e(3842), i.e(5649), i.e(4928), i.e(962), i.e(3179), i.e(9039)]).then(i.bind(i, 88033))).showLollipopTooltip({
                items: r,
                position: e,
                customCloseSubscriptions: o,
                onClickOutside: a,
                onCustomClose: l
            })
        }
    }

    function Oe(e, t) {
        const i = Math.max(1, Math.floor(t)),
            s = Math.round(e.x * t) + i % 2 / 2;
        let r = Math.round(e.size * t);
        (s + r / 2) % 1 != 0 && (r += 1);
        const n = Math.min(Math.max(1, Math.round(t * e.borderWidth)), r / 2);
        let o;
        const a = ("up" === e.direction ? -1 : 1) * (e.yInverted ? -1 : 1),
            l = a * (Math.round(e.size * t / 2) + i % 2);
        if (void 0 !== e.fixedSpaceYPosition) {
            const i = Math.round(e.fixedSpaceYPosition.itemSpacing * t),
                s = e.fixedSpaceYPosition.order,
                n = a * (r * s + i * (s + 1));
            o = Math.round(e.fixedSpaceYPosition.basePosition * t) + n + l
        } else o = Math.round(e.y * t) + l;
        return {
            x: s,
            y: o,
            size: r,
            borderWidth: n,
            tickSize: i
        }
    }

    function Fe(e, t, i, s) {
        var r, n, o;
        if (e.save(), i && !s.highlightByAuthor && (e.globalAlpha = .4), s.mine) ! function(e, t, i) {
            const {
                borderColor: s,
                backgroundColor: r,
                doNotFill: n,
                direction: o,
                yInverted: a
            } = i, {
                x: l,
                y: c,
                borderWidth: h,
                size: d,
                tickSize: u
            } = Oe(i, t.pixelRatio);
            e.strokeStyle = s, e.fillStyle = r, e.lineWidth = h;
            const p = "up" === o !== a ? -1 : 1;
            let _ = Math.round(d / 2 / Math.tan(Math.PI / 6)) + u % 2 / 2;
            (l + _ / 2) % 1 != 0 && (_ -= 1);
            e.translate(l, c + _ / 2 * p), e.beginPath();
            const m = h / 2;
            e.moveTo(0, -p * (_ - m)), e.lineTo(d / 2 - m, h / 2), e.lineTo(-d / 2 + m, h / 2), e.lineTo(0, -p * (_ - h / 2)), e.closePath(), n || e.fill();
            e.stroke()
        }(e, t, s);
        else {
            let i = !1;
            {
                const e = s.image && (o = s.image, Boolean(o && o.imageElement && o.imageElement.complete && o.imageElement.naturalWidth));
                i = Boolean(e && !s.showLabelWhenImageLoaded)
            }! function(e, t, i, s, r) {
                const {
                    borderColor: n,
                    backgroundColor: o,
                    label: a
                } = i, l = t.pixelRatio, {
                    x: c,
                    y: h,
                    borderWidth: d,
                    size: u
                } = Oe(i, l);
                e.strokeStyle = n, e.fillStyle = o, e.lineWidth = d, e.beginPath();
                const p = u / 2 - d / 2;
                e.arc(c, h, p, 0, 2 * Math.PI, !0), e.closePath(), e.fill(), r && function(e, t, i, s, r) {
                    if (t) {
                        const n = 2 * i;
                        e.save(), e.imageSmoothingEnabled = !0, e.imageSmoothingQuality = "high", (0, ge.createCircle)(e, s, r, i), e.clip(), e.drawImage(t, s - i, r - i, n, n), e.restore()
                    }
                }(e, r, p, c, h);
                e.stroke(), !s && a && u / 2 >= 7 && (e.textAlign = "center", e.textBaseline = "middle", e.font = a.font, e.fillStyle = a.fontColor, (0, R.drawScaled)(e, l, l, (() => {
                    e.fillText(a.text, c / l, h / l)
                })))
            }(e, t, s, i, null !== (n = null === (r = s.image) || void 0 === r ? void 0 : r.imageElement) && void 0 !== n ? n : void 0)
        }
        e.restore()
    }
    class We {
        constructor(e, t, i, s) {
            this._canvas = null, this._clickHandler = e, this._enterHandler = t, this._leaveHandler = i, this._data = null != s ? s : null
        }
        setData(e) {
            this._data = e
        }
        hitTest(e, t) {
            if (null === this._data) return null;
            for (let i = this._data.items.length - 1; i >= 0; --i) {
                const s = this._hitTestDot(this._data.items[i], e, t.pixelRatio);
                if (s) return s
            }
            return null
        }
        draw(e, t) {
            this._canvas = e.canvas, null !== this._data && this._data.items.forEach(Fe.bind(null, e, t, this._data.highlightByAuthor))
        }
        _hitTestDot(e, t, i) {
            const s = new r.Point(e.x, Oe(e, i).y / i);
            if ((0, _e.pointInCircle)(t, s, Math.max(e.size / 2, 8))) {
                const t = this._canvas,
                    i = null === t ? void 0 : {
                        mouseEnterHandler: () => this._enterHandler(e, s.y, t),
                        mouseLeaveHandler: () => this._leaveHandler(),
                        clickHandler: i => this._clickHandler(e, s.y, t, i),
                        tapHandler: i => this._clickHandler(e, s.y, t, i)
                    };
                return new Se.HitTestResult(Se.HitTarget.Regular, {
                    activeItem: e.originalItem.id,
                    ...i
                })
            }
            return null
        }
    }
    const ze = {
        green: {
            border: (0, he.getHexColorByName)("color-minty-green-700"),
            background: (0, he.getHexColorByName)("color-minty-green-a700")
        },
        red: {
            border: (0, he.getHexColorByName)("color-ripe-red-700"),
            background: (0, he.getHexColorByName)("color-ripe-red-500")
        },
        neutral: {
            border: (0,
                he.getHexColorByName)("color-tan-orange-700"),
            background: (0, he.getHexColorByName)("color-tan-orange-500")
        },
        yellow: {
            border: "#EAC300",
            background: "#FFD400"
        },
        blue: {
            border: "#047ACE",
            background: "#0496FF"
        }
    };

    function He(e) {
        var t, i, s, r;
        return e.hovered || e.highlightByAuthor ? null !== (i = null === (t = e.overrideBorderWidth) || void 0 === t ? void 0 : t.hoveredWidth) && void 0 !== i ? i : 4 : null !== (r = null === (s = e.overrideBorderWidth) || void 0 === s ? void 0 : s.width) && void 0 !== r ? r : 2
    }
    class Ue extends class {
        constructor(e, t) {
            this._tooltip = null, this._hoveredBarsMarkData = null, this._destroyed = !1, this._invalidated = !0, this._originalData = [], this._source = e, this._model = t, this._renderer = new We(this._onItemClicked.bind(this), this._showItem.bind(this), this._hideItem.bind(this)), this._createTooltipRenderer().then((e => {
                this._destroyed ? null == e || e.destroy() : this._tooltip = e
            })), e.properties().childs().visible.subscribe(null, (() => {
                var e;
                null === (e = this._tooltip) || void 0 === e || e.hide(!0)
            }))
        }
        destroy() {
            var e;
            this._destroyed = !0, null === (e = this._tooltip) || void 0 === e || e.destroy()
        }
        source() {
            return this._source
        }
        update() {
            this._invalidated = !0
        }
        renderer(e, t) {
            return this._invalidated && (this._updateImpl(), this._invalidated = !1), this._renderer
        }
        onClickOutside(e) {
            e.isTouch && null !== this._tooltip && !this._tooltip.contains(e.target) && this._tooltip.hide(!0)
        }
        _extractBarMarksRendererItemData(e, t) {
            var i, s;
            const r = null !== (i = t.overridedTheme) && void 0 !== i ? i : ze[t.theme],
                n = this._calculateSize(e, t),
                o = this._calculateY(e, n, t);
            return null === this._hoveredBarsMarkData || this._hoveredBarsMarkData.id !== t.id || this._hoveredBarsMarkData.x === t.x && this._hoveredBarsMarkData.y === Math.round(o) || (null === (s = this._tooltip) || void 0 === s || s.hide(!0), this._hoveredBarsMarkData = null), {
                x: t.x,
                y: this._calculateY(e, n, t),
                direction: t.direction,
                borderColor: r.border,
                borderWidth: He(t),
                backgroundColor: r.background,
                size: n,
                doNotFill: !t.public,
                yInverted: t.yInverted,
                label: void 0 === t.label ? void 0 : {
                    text: t.label,
                    fontColor: t.labelFontColor,
                    font: (0, O.makeFont)(Math.ceil(Math.max(10, Math.min(n / 2, 20))), N.CHART_FONT_FAMILY, "bold")
                },
                originalItem: t
            }
        }
        _onItemClicked(e, t, i, s) {
            s.isTouch && this._showItem(e, t, i)
        }
        async _showItem(e, t, i) {
            var r;
            const n = await this._tooltipProps(e);
            if (null === n) return;
            const o = this._model.timeScale().barSpacing(),
                a = this._calculateSize(o, e.originalItem);
            this._hoveredBarsMarkData = {
                x: e.x,
                y: Math.round(this._calculateY(o, a, e.originalItem)),
                id: e.originalItem.id
            }, null === (r = this._tooltip) || void 0 === r || r.show({
                itemSize: a,
                container: (0, s.ensureNotNull)(i.parentElement),
                x: e.x,
                y: t,
                factoryProps: n,
                onClickOutside: () => {
                    var e;
                    return null === (e = this._tooltip) || void 0 === e ? void 0 : e.hide(!0)
                }
            })
        }
        _hideItem() {
            var e;
            null === (e = this._tooltip) || void 0 === e || e.hide()
        }
        _calculateSize(e, t) {
            return Math.min(553, Math.max(7, t.minSize, .8 * e))
        }
        _updateImpl() {
            this._originalData = this._source.getPlatesViewData();
            const e = this._model.timeScale().barSpacing(),
                t = this._originalData.map(this._extractBarMarksRendererItemData.bind(this, e));
            this._renderer.setData({
                items: t,
                barSpacing: e,
                highlightByAuthor: !1
            })
        }
    } {
        async _createTooltipRenderer() {
            const [{
                TooltipRenderer: e
            }, {
                UserDefinedBarsMarksTooltip: t
            }] = await Promise.all([Promise.all([i.e(9789), i.e(962), i.e(8020)]).then(i.bind(i, 5972)), Promise.all([i.e(9789), i.e(962), i.e(8020)]).then(i.bind(i, 48080))]);
            return new e(t)
        }
        _calculateY(e, t, i) {
            const s = Math.max(1.4 * i.minSize, e + 4),
                r = ("up" === i.direction ? -1 : 1) * (i.yInverted ? -1 : 1) * (s * (i.order + .6) + .25 * s);
            return i.y + r
        }
        _onItemClicked(e, t, i, s) {
            var r, n;
            super._onItemClicked(e, t, i, s), null === (n = (r = e.originalItem).onClicked) || void 0 === n || n.call(r)
        }
        _tooltipProps(e) {
            const t = e.originalItem.text;
            return t ? Promise.resolve({
                text: t
            }) : Promise.resolve(null)
        }
        _extractBarMarksRendererItemData(e, t) {
            return {
                ...super._extractBarMarksRendererItemData(e, t),
                showLabelWhenImageLoaded: t.showLabelWhenImageLoaded,
                image: t.image
            }
        }
    }
    class je extends Re {
        constructor(e) {
            super(e, new ke.DefaultProperty("UserDefinedBarsMarks", {
                visible: !0
            })), this._paneView = new Ue(this, e), this._paneViews = [this._paneView], (0, ce.hideMarksOnBars)().subscribe(this, (() => {
                this.properties().childs().visible.setValue(!(0, ce.hideMarksOnBars)().value())
            }))
        }
        destroy() {
            (0, ce.hideMarksOnBars)().unsubscribeAll(this), this._paneView.destroy(), super.destroy()
        }
        zorder() {
            return Ee.sortSourcesPreOrdered.BarMarks
        }
        userEditEnabled() {
            return !1
        }
        clearMarks(e = 0) {
            2 !== e && (super.clearMarks(), this.updateAllViewsAndRepaint())
        }
        hasContextMenu() {
            return !1
        }
        paneViews() {
            return this._properties.childs().visible.value() ? this._paneViews : []
        }
        onClickOutside(e) {
            this._paneView.onClickOutside(e)
        }
        _initialize() {
            this.properties().childs().visible.setValue(!0)
        }
        _plateViewData(e) {
            const t = {
                text: e.text,
                onClicked: e.onClicked
            };
            "object" == typeof e.color && (t.theme = "user_defined_theme", t.overridedTheme = {}, t.overridedTheme.border = e.color.border, t.overridedTheme.background = e.color.background);
            const i = (0, le.isNumber)(e.borderWidth) ? e.borderWidth : void 0,
                s = (0, le.isNumber)(e.hoveredBorderWidth) ? e.hoveredBorderWidth : void 0;
            if (void 0 === i && void 0 === s || (t.overrideBorderWidth = {
                    width: i,
                    hoveredWidth: s
                }), e.showLabelWhenImageLoaded && (t.showLabelWhenImageLoaded = !0), e.imageUrl) {
                const i = this.getImageElement(e.imageUrl);
                t.image = i
            }
            return t
        }
        _getData(e) {
            const t = this._model.mainSeries().symbolInfo();
            if (!t) return;
            const i = this.roundRange(this._rangeDifference(e)),
                s = this._model.mainSeries().properties().childs().interval.value();
            window.ChartApiInstance.getMarks(t, i.start, i.end, (t => {
                for (const e of t) this._marks[e.id] = e, e.imageUrl && this.addImageToStore(e.imageUrl);
                this._loadedRange = this._rangeUnion(e, this._loadedRange), this.updateAllViewsAndRepaint()
            }), s)
        }
    }
    var Ge = i(45345);
    const qe = new a.TranslatedString("apply toolbars theme", o.t(null, void 0, i(58570)));
    class $e extends u.UndoCommand {
        constructor(e, t, i = !0) {
            super(qe), this._prevThemeName = e, this._themeName = t, this._syncState = i
        }
        undo() {
            (0, k.isStdThemeName)(this._prevThemeName) && ((0, Ge.setTheme)(this._prevThemeName), this._syncState && (0, k.syncTheme)())
        }
        redo() {
            (0, k.isStdThemeName)(this._themeName.toLowerCase()) && ((0, Ge.setTheme)(this._themeName.toLowerCase()), this._syncState && (0, k.syncTheme)())
        }
    }
    var Ye = i(97906),
        Ke = i(83669),
        Ze = i(49152),
        Xe = (i(36274), i(94025)),
        Je = i(81501),
        Qe = i(58275);
    const et = !c.CheckMobile.any(),
        tt = (0, n.getLogger)("ChartWidgetCollectionBase"),
        it = new a.TranslatedString("apply indicators to entire layout", o.t(null, void 0, i(44547))),
        st = new a.TranslatedString("sync time", o.t(null, void 0, i(60635))),
        rt = new a.TranslatedString("resize layout", o.t(null, void 0, i(13034))),
        nt = new a.TranslatedString("reset layout sizes", o.t(null, void 0, i(30910))),
        ot = new a.TranslatedString("apply chart theme", o.t(null, void 0, i(66568))),
        at = new a.TranslatedString("symbol lock", o.t(null, void 0, i(92831))),
        lt = new a.TranslatedString("interval lock", o.t(null, void 0, i(28916))),
        ct = new a.TranslatedString("date range lock", o.t(null, void 0, i(90621))),
        ht = new a.TranslatedString("track time", o.t(null, void 0, i(47122)));
    o.t(null, void 0, i(46669)), o.t(null, void 0, i(98478)), o.t(null, void 0, i(34004)), o.t(null, void 0, i(96260)), o.t(null, void 0, i(38641)), o.t(null, void 0, i(10160)), o.t(null, void 0, i(19149));

    function dt(e, t) {
        const i = t.model().model().studyTemplate();
        e.undoHistory.beginUndoMacro(it);
        for (let s = 0; s < e.chartWidgetsDefs.length; s++) {
            const r = e.chartWidgetsDefs[s].chartWidget;
            r !== t && (r.hasModel() && r.model().applyStudyTemplate(i, ""))
        }
        e.undoHistory.endUndoMacro()
    }

    function ut(e, t, i, r, n) {
        e.undoHistory.beginUndoMacro(n);
        for (let o = 0; o < e.chartWidgetsDefs.length; o++) {
            const a = e.chartWidgetsDefs[o].chartWidget;
            if (a !== t && a && a.hasModel()) {
                const t = a.model();
                let o;
                if (r.isOnMainPane) o = (0, s.ensureNotNull)(t.model().paneForSource(a.model().model().mainSeries()));
                else {
                    const i = new p(t.model(), r.paneIndex);
                    e.undoHistory.pushUndoCommand(i);
                    const n = (0, s.ensureDefined)(i.createdPaneId());
                    o = (0, s.ensureDefined)(t.model().panes().find((e => e.id() === n)))
                }
                const l = t.pasteSourceFromClip(o, i, !0);
                if (l && 1 === l.length) {
                    const e = l[0];
                    if (r.asCompare) {
                        const i = (0, s.ensureNotNull)(t.mainSeries().priceScale());
                        t.moveToScale(e, (0, s.ensureDefined)(o), i, n), t.setPriceScaleMode({
                            percentage: !0
                        }, i, null)
                    }
                }
                t.model().lightUpdate()
            }
        }
        e.undoHistory.endUndoMacro()
    }

    function pt(e) {
        let t = 1;
        for (; e.has("" + t);) t++;
        return "" + t
    }

    function _t(e) {
        const t = new Map,
            i = e.chartsCountToSave(),
            s = new Set;
        for (let r = 0; r < i; r++)
            if (r < e.chartWidgetsDefs.length) {
                const i = e.chartWidgetsDefs[r].chartWidget,
                    n = i.id(),
                    o = i.lineToolsAndGroupsDTO();
                t.set(n, o), s.add(n)
            } else {
                const i = e.savedChartWidgetOptions[r - e.chartWidgetsDefs.length].content;
                i.chartId || (i.chartId = pt(s));
                const n = new Map;
                n.set(0, extractLineToolsDTOFromChartState(i)), t.set(i.chartId, n), s.add(i.chartId)
            } return t
    }

    function mt(e, t, i, s, r, n) {
        if (t < e.chartWidgetsDefs.length) {
            const o = e.chartWidgetsDefs[t].chartWidget;
            return t < e.actualLayoutCount() || o.shouldBeSavedEvenIfHidden() ? o.state(i, s, r, n) : null
        }
        const o = e.savedChartWidgetOptions[t - e.chartWidgetsDefs.length].content;
        return o
    }

    function gt(e, t) {
        return t < e.chartWidgetsDefs.length ? e.chartWidgetsDefs[t].chartWidget.asyncState() : Promise.resolve({})
    }

    function ft(e, t) {
        return e.chartWidgetsDefs[0].chartWidget === t
    }

    function vt(e) {
        return e.savedChartWidgetOptions.map((e => (0, s.ensureDefined)(e.content.chartId)))
    }

    function St(e, t, i) {
        e.chartsCountToSave();
        i.forEach((i => {
            const s = (t => {
                var i, s;
                return null !== (s = null === (i = e.chartWidgetsDefs.find((e => e.chartWidget.id() === t))) || void 0 === i ? void 0 : i.chartWidget) && void 0 !== s ? s : null
            })(i.chartId);
            null == s || s.resetLineToolsInvalidated(t, i.savedDto, i.sharingMode)
        }))
    }

    function yt(e, t, i, s) {
        const r = e.map((e => e.chartWidget)).filter((e => e.hasModel())).filter((e => e.id() === t || 0 !== s));
        try {
            r.forEach((e => e.startApplyingLineToolUpdateNotification())), r.forEach((e => e.applyLineToolUpdateNotification(i, s)))
        } finally {
            r.forEach((e => e.endApplyingLineToolUpdateNotification()))
        }
    }

    function bt(e) {
        return new x({
            copyRequested: (t, i) => {
                e.activeChartWidget.value().model().clipboardCopy(t, i)
            },
            cutRequested: (t, i) => {
                e.activeChartWidget.value().model().clipboardCut(t, i)
            },
            pasteRequested: (t, i) => {
                (i ? i.model().undoModel() : e.activeChartWidget.value().model()).clipboardPaste(t, i)
            }
        })
    }

    function wt(e, t) {
        0
    }

    function Pt(e) {
        const t = {};
        return e.chartWidgetsDefs.map((e => e.chartWidget)).forEach((e => t[e.id()] = function(e) {
            var t, i, r, n, o;
            const a = {};
            if (!e.hasModel()) {
                const n = e.options().content;
                if (!n) return a;
                const o = (0, s.ensureNotNull)(n.panes.reduce(((e, t) => {
                    var i;
                    return null !== (i = null != e ? e : t.sources.find((e => "MainSeries" === e.type))) && void 0 !== i ? i : null
                }), null));
                return a.resolution = null === (t = o.state) || void 0 === t ? void 0 : t.interval, a.symbol = null === (i = o.state) || void 0 === i ? void 0 : i.symbol, a.short_name = null === (r = o.state) || void 0 === r ? void 0 : r.shortName, a
            }
            const l = e.model().mainSeries(),
                c = l.properties().childs(),
                h = l.symbolInfo();
            a.resolution = c.interval.value(), a.symbol_type = null !== h && h.type || "", a.exchange = null !== h && h.exchange || "", a.listed_exchange = null !== h && h.listed_exchange || "";
            const d = null !== (n = null == h ? void 0 : h.legs) && void 0 !== n ? n : [];
            if (null !== h && l.isSpread()) {
                const e = d[0];
                let t = h.base_name[0];
                t = t.split(":")[1], a.symbol = e, a.short_name = t, a.expression = h.full_name
            } else a.symbol = null !== h && h.ticker || c.symbol.value(), a.short_name = c.shortName.value();
            const u = null !== (o = null == h ? void 0 : h.base_name) && void 0 !== o ? o : [];
            return a.legs = d.map(((e, t) => ({
                symbol: e,
                pro_symbol: u[t]
            }))), a
        }(e))), t
    }

    function Ct(e, t) {
        0
    }

    function xt(e, t) {
        return M(t, {
            snapshotUrl: e
        }).then((e => ((0, A.emit)("onScreenshotReady", e), e)))
    }

    function Tt(e, t) {
        const i = {
            snapshotUrl: e
        };
        const s = (0, L.isOnMobileAppPage)("any");
        return (s ? M : I)(t, i).then((e => ((0, A.emit)("onScreenshotReady", e), s || (0, A.emit)("onServerScreenshotCopiedToClipboard"), e)))
    }

    function It(e) {
        return function(e) {
            return T().then((t => t.downloadClientScreenshot(e)))
        }(e)
    }

    function Mt(e) {
        return function(e) {
            return T().then((t => t.copyToClipboardClientScreenshot(e)))
        }(e).then((() => {
            (0, A.emit)("onClientScreenshotCopiedToClipboard")
        }))
    }
    const At = {
        s: 0,
        "2h": 0,
        "2v": 1,
        "2-1": 1,
        "3s": 0,
        "3h": 0,
        "3v": 2,
        4: 1,
        6: 1,
        8: 1,
        "1-2": 1,
        "3r": 1,
        "4h": 0,
        "4v": 3,
        "4s": 0,
        "5h": 0,
        "6h": 0,
        "7h": 0,
        "8h": 0,
        "1-3": 1,
        "2-2": 3,
        "2-3": 2,
        "1-4": 1,
        "5s": 0,
        "6c": 4,
        "8c": 6
    };

    function Lt(e, t, i, s) {
        let r = 0;
        const n = (0, Ze.createWVFromGetterAndSubscriptions)((() => ++r), [i, s]);
        return (0, Ye.combine)((t => {
            var i;
            return null !== (i = e()[At[t]]) && void 0 !== i ? i : null
        }), t, n)
    }

    function kt(e, t, i, s) {
        const r = Math.max(1, window.devicePixelRatio || 1),
            n = e.getAll();
        let o;
        const a = e.maximizedChartWidget().value();
        if (s && s.onlyActiveChart || a) return {
            layout: "s",
            hidpiRatio: r,
            theme: (0, k.getCurrentTheme)().name,
            charts: [e.activeChartWidget.value().images(s)],
            publishedBy: o
        };
        const l = [],
            c = Q.layouts[e.layout.value()].count,
            h = {
                showCollapsedStudies: (s = s || {}).showCollapsedStudies,
                status: s.status
            };
        for (let e = 0; e < n.length && e < c; e++) l.push(n[e].images(h));
        return {
            layout: e.layout.value(),
            hidpiRatio: r,
            theme: (0, k.getCurrentTheme)().name,
            charts: l,
            publishedBy: o
        }
    }

    function Et(e, t, i, s) {
        const r = s || {};
        return async function(e, t) {
            return new X(e, t).getImage()
        }(kt(e, 0, 0, {
            showCollapsedStudies: !0,
            status: {
                hideResolution: Boolean(r.hideResolution)
            }
        }), r)
    }

    function Dt(e) {
        var t, i, s, r, n, o;
        const a = (null !== (t = e.options.edge) && void 0 !== t ? t : 0) + (null !== (i = e.options.border) && void 0 !== i ? i : 0),
            l = null !== (r = null === (s = e.bottomToolbar.value()) || void 0 === s ? void 0 : s.offsetHeight) && void 0 !== r ? r : 0,
            c = null !== (o = null === (n = e.replayContainer) || void 0 === n ? void 0 : n.offsetHeight) && void 0 !== o ? o : 0;
        return {
            width: e.widthWV.value() - 2 * a,
            height: e.heightWV.value() - l - c - a,
            top: 0,
            left: a
        }
    }

    function Vt(e) {
        return `chart-widget-collection-border-${e}`
    }
    class Bt {
        constructor(e, t, i) {
            this._onShiftPressed = e => {
                const t = this._state.currentLayoutResizeAction.value();
                t && this._applyMouseMove(t.delta, e)
            }, this._state = e, this._splitterElement = t, this._splitter = i, (0, ne.shiftPressed)().subscribe(this._onShiftPressed)
        }
        destroy() {
            (0, ne.shiftPressed)().unsubscribe(this._onShiftPressed)
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
        mouseEnterEvent(e) {
            this._highlightSplitters(e.shiftKey)
        }
        mouseLeaveEvent(e) {
            const t = Vt(this._splitter.className);
            Array.from(this._state.parent.getElementsByClassName(t)).forEach((e => e.classList.remove(Je.hovered)))
        }
        mouseDoubleClickEvent(e) {
            const t = (0, ie.layoutInitialSizingState)(this._state.layoutTemplate.value().expression);
            this._state.undoHistory.beginUndoMacro(nt), this._state.undoHistory.pushUndoCommand(new m(this._state.sizingState.spawn(), this._state.sizingState.value(), t, nt));
            const i = this._state.layoutTemplate.value().layoutType;
            this._state.undoHistory.pushUndoCommand(new _((e => e ? this._state.allLayoutSizesState.set(i, e) : this._state.allLayoutSizesState.delete(i)), this._state.allLayoutSizesState.get(this._state.layoutTemplate.value().layoutType), t, nt)), this._state.undoHistory.endUndoMacro()
        }
        _highlightSplitters(e) {
            const t = Vt(this._splitter.className);
            Array.from(this._state.parent.getElementsByClassName(t)).forEach((e => e.classList.remove(Je.hovered)));
            (e ? Array.from(this._state.parent.getElementsByClassName(t)) : [this._splitterElement]).forEach((e => e.classList.add(Je.hovered)))
        }
        _mouseDownOrTouchStartEvent(e) {
            const t = new r.Point(e.localX + this._splitterElement.offsetLeft, e.localY + this._splitterElement.offsetTop),
                i = (0, se.deepCopy)(this._state.sizingState.value());
            this._state.currentLayoutResizeAction.setValue({
                point: t,
                splitter: this._splitter,
                initialState: i,
                alignedState: this._state.layoutTemplate.value().syncSublayoutsBySplitter(this._splitter, (0, se.deepCopy)(i)),
                shiftState: e.shiftKey,
                delta: 0
            }), this._splitterElement.classList.add(Je["i-active"]), this._highlightSplitters(e.shiftKey)
        }
        _pressedMouseOrTouchMoveEvent(e) {
            const t = this._state.currentLayoutResizeAction.value();
            if (!t) return;
            t.shiftState !== e.shiftKey && (this._highlightSplitters(e.shiftKey), t.shiftState = e.shiftKey);
            const i = new r.Point(e.localX + this._splitterElement.offsetLeft, e.localY + this._splitterElement.offsetTop);
            t.delta = "v" === t.splitter.orientation ? i.y - t.point.y : i.x - t.point.x, this._applyMouseMove(t.delta, e.shiftKey)
        }
        _mouseUpOrTouchEndEvent(e) {
            const t = this._state.currentLayoutResizeAction.value();
            if (t && (this._splitterElement.classList.remove(Je["i-active"]), this._state.currentLayoutResizeAction.setValue(null), t.currentState)) {
                this._state.undoHistory.beginUndoMacro(rt), this._state.undoHistory.pushUndoCommand(new m(this._state.sizingState.spawn(), t.initialState, t.currentState, rt));
                const e = this._state.layoutTemplate.value().layoutType;
                this._state.undoHistory.pushUndoCommand(new _((t => t ? this._state.allLayoutSizesState.set(e, t) : this._state.allLayoutSizesState.delete(e)), this._state.allLayoutSizesState.get(this._state.layoutTemplate.value().layoutType), this._state.sizingState.value(), nt)), this._state.undoHistory.endUndoMacro(), this._state.layoutSizesChanged.setValue(!0)
            }
        }
        _applyMouseMove(e, t) {
            var i;
            const r = (0, s.ensureNotNull)(this._state.currentLayoutResizeAction.value()),
                n = t ? r.alignedState : r.initialState,
                o = null !== (i = this._state.options.padding) && void 0 !== i ? i : 2,
                a = Dt(this._state);
            r.currentState = this._state.layoutTemplate.value().resizeApplier(a, o, e, r.splitter, (0, se.deepCopy)(n), t), this._state.sizingState.setValue(r.currentState)
        }
    }

    function Rt(e, t, i, s, r) {
        var n, o;
        const a = null !== (n = e.options.padding) && void 0 !== n ? n : 2,
            l = null !== (o = e.options.border) && void 0 !== o ? o : 0;
        r = null != r ? r : e.layoutTemplate.value();
        const c = Dt(e),
            h = r.sizer(c, i, s, a + l, et ? e.sizingState.value() : void 0);
        h.width = Math.max(Math.round(h.width), 0), h.height = Math.max(Math.round(h.height), 0), h.top = Math.round(h.top), h.left = Math.round(h.left), t.metrics = h;
        const d = t.container.value();
        if (d) {
            d.style.width = h.width + "px", d.style.height = h.height + "px", d.style.top = h.top + "px", d.style.left = h.left + "px";
            const e = 1 === s;
            false;
            const t = Math.round(c.width),
                i = 0 === h.top && 0 === h.left,
                r = 0 === h.top && h.left + h.width === t,
                n = 0 === h.top && h.width === t;
            d.classList.toggle("top-left-chart", !e && !n && i), d.classList.toggle("top-right-chart", !e && !n && r), d.classList.toggle("top-full-width-chart", e || n)
        }
        t.width.setValue(h.width), t.height.setValue(h.height)
    }

    function Nt(e) {
        var t, i, s;
        let r;
        const n = e.layoutTemplate.value(),
            o = e.maximizedChartDef.value();
        if (r = o ? [o] : e.chartWidgetsDefs.slice(0, n.count).filter((e => !e.hiddenInLayout.value())), r.forEach(((t, i) => Rt(e, t, i, r.length))), et && !e.maximizedChartDef.value()) {
            const r = Dt(e),
                o = null !== (t = e.options.padding) && void 0 !== t ? t : 2,
                a = null !== (i = e.options.border) && void 0 !== i ? i : 0,
                l = n.splitters(r, o + a, e.sizingState.value()),
                c = null !== (s = e.splitters.value()) && void 0 !== s ? s : [];
            c.forEach(((e, t) => {
                t >= l.length && (e.splitterElement.remove(), e.mouseHandler.destroy(), e.mouseListener.destroy())
            }));
            const h = l.map(((t, i) => {
                const s = i < c.length ? c[i].splitterElement : document.createElement("div");
                let r, n;
                i < c.length ? (r = c[i].mouseListener, n = c[i].mouseHandler) : (r = new Bt(e, s, t), n = new re.MouseEventHandler(s, r));
                const o = t.metrics,
                    a = s.classList.contains(Je.hovered),
                    l = s.classList.contains(Je["i-active"]);
                return s.className = "", s.classList.add(Je.chartsSplitter), s.classList.add(Vt(t.className)), a && s.classList.add(Je.hovered), l && s.classList.add(Je["i-active"]), s.style.left = o.left + "px", s.style.top = o.top + "px", s.style.width = o.width + "px", s.style.height = o.height + "px", "v" === t.orientation ? s.style.cursor = "ns-resize" : s.style.cursor = "ew-resize", e.parent.appendChild(s), {
                    splitter: t,
                    splitterElement: s,
                    mouseHandler: n,
                    mouseListener: r
                }
            }));
            e.splitters.setValue(h)
        }
    }

    function Ot(e, t, i) {
        const s = e.chartWidgetsDefs.slice(0, e.layoutTemplate.value().count).map(((t, i, s) => ({
            def: t,
            metrics: e.layoutTemplate.value().sizer({
                top: 0,
                left: 0,
                width: 256,
                height: 256
            }, i, s.length, 0)
        }))).sort(((e, t) => e.metrics.top - t.metrics.top || e.metrics.left - t.metrics.left)).map((e => e.def));
        if (s.length < 2) return null;
        let r = s.indexOf(t);
        return -1 === r ? null : (r = (r + (i ? s.length - 1 : 1)) % s.length, s[r])
    }

    function Ft(e, t) {
        return e.chartWidgetsDefs.some((e => {
            var i;
            return (null === (i = e.chartWidget) || void 0 === i ? void 0 : i.id()) === t
        }))
    }

    function Wt(e) {
        let t = 1;
        for (; e("" + t);) t++;
        return "" + t
    }

    function zt(e) {
        const t = e.activeChartWidget.value();
        if (t) {
            const i = t.state();
            return i.chartId = Wt((t => Ft(e, t))), i.shouldBeSavedEvenIfHidden = !1, i.panes.forEach((e => {
                e.sources.forEach((e => {
                    "alertId" in e && (e.alertId = void 0)
                }))
            })), {
                content: i
            }
        }
    }

    function Ht(e, t, i) {
        var r, n;
        const {
            toastsFactory: o,
            chartWidgetsDefs: a,
            customLegendWidgetsFactoriesMap: l
        } = e;
        let h = {
            chartWidgetCollection: t,
            isActive: 0 === a.length,
            barsMarksContainersFactory: t => function(e, t, i) {
                const s = [];
                {
                    const t = new je(e);
                    s.push(t);
                    const i = new Ne(e);
                    s.push(i)
                }
                return s
            }(t, 0, e.options),
            undoHistory: e.undoHistory,
            readOnly: e.readOnly,
            initialLoading: e.initialLoading,
            getToasts: o ? () => o.getChartToasts() : void 0,
            ...null != i ? i : {}
        };
        void 0 !== l && (h.customLegendWidgetFactories = new Map(l));
        const d = document.createElement("div");
        d.classList.add("chart-container"), d.style.position = "absolute", d.style.overflow = "hidden", e.parent.appendChild(d), c.isEdge && (d.style.touchAction = "none", d.style.msTouchAction = "none"), h.className && d.classList.add(h.className);
        const u = {
            alive: new Qe(!0),
            container: new Qe(d),
            width: new Qe,
            height: new Qe,
            collapsed: new Qe(!1),
            hiddenInLayout: new Qe(!1),
            visible: new Qe,
            rdState: new ee.ResizerDetacherState,
            requestFullscreen: () => {
                e.globalDetachable.value() && (e.setMaximized(u), e.activeChartWidget.setValue((0, s.ensureNotNull)(u.chartWidget)))
            },
            exitFullscreen: () => {
                e.activeChartWidget.value() === u.chartWidget && e.setMaximized(null)
            },
            detachable: e.globalDetachable,
            fullscreenable: e.globalDetachable,
            fullscreen: new Qe,
            chartWidget: null
        };
        u.rdState.pushOwner(u), a.push(u);
        const p = () => {
            u.visible.setValue(!u.hiddenInLayout.value() && e.options.resizerBridge.visible.value())
        };
        u.hiddenInLayout.subscribe((() => {
                (0, s.ensureNotNull)(u.chartWidget).setVisible(!u.hiddenInLayout.value()), p()
            })), u.collapsed.subscribe((() => (0, s.ensureNotNull)(u.chartWidget).setCollapsed(u.collapsed.value()))), e.options.resizerBridge.visible.subscribe(p), p(),
            function(e, t) {
                let i = 0,
                    s = 0;
                const r = t.layoutTemplate.value();
                for (let n = 0; n < r.count; n++) t.chartWidgetsDefs[n] === e && (s = i), i++;
                Rt(t, e, s, i, r)
            }(u, e), h = {
                ...h,
                ...u.rdState.bridge()
            };
        const _ = h.content ? (0, s.ensureDefined)(h.content.chartId) : Wt((t => Ft(e, t))),
            m = u.chartWidget = new te.ChartWidget(h, _, t.metaInfo.uid.value());
        return e.saveChartService && m.setSaveChartService(e.saveChartService), h.containsData ? m.finishInitWithoutConnect() : m.connect(), m.withModel(null, (() => {
            const t = m.model().model();
            e.customSources.forEach(((e, i) => {
                t.addCustomSource(i, e.factory, e.layer)
            }))
        })), e.updateWatchedValue(), e.updateActivityView(), m.linkingGroupIndex().setValue(null !== (n = null === (r = null == h ? void 0 : h.content) || void 0 === r ? void 0 : r.linkingGroup) && void 0 !== n ? n : null), m.linkingGroupIndex().subscribe(e.updateLinkingGroupCharts), e.updateLinkingGroupCharts(), e.chartWidgetCreatedDelegate.fire(m), u
    }

    function Ut(e, t, i, s) {
        const r = {
                ...e.widgetOptions,
                ...e.savedChartWidgetOptions.shift() || zt(e),
                ...0 === i || e.symbolLock.value() ? void 0 : {
                    defSymbol: null
                }
            },
            n = Ht(e, t, r),
            {
                chartWidget: o
            } = n;
        return o.modelCreated().subscribe(null, (() => {
            s ? s() : e.checkAllPendingModelsAlreadyCreated(), e.dateRangeLock.value() && o === e.activeChartWidget.value() && e.subscribeToCompletedEventForDateRangeSync(o, !0)
        }), !0), n
    }

    function jt(e) {
        e.hiddenInLayout.setValue(!0);
        const t = e.container.value();
        t.parentNode && t.parentNode.removeChild(t), e.fullscreen.setValue(!1)
    }

    function Gt(e, t) {
        e.chartWidgetsDefs.forEach((i => {
            const r = (0, s.ensureNotNull)(i.chartWidget);
            r.onZoom().unsubscribeAll(t), r.onScroll().unsubscribeAll(t), r.withModel(null, (() => {
                const t = r.lineToolsSynchronizer();
                null !== t && (t.hasChanges().unsubscribe(e.recalcHasChanges), e.recalcHasChanges())
            }))
        }))
    }

    function qt(e, t) {
        e.chartWidgetsDefs.forEach((i => {
            const r = (0, s.ensureNotNull)(i.chartWidget);
            r.onZoom().subscribe(t, (t => e.onZoom.fire(t))), r.onScroll().subscribe(t, (() => e.onScroll.fire())), r.withModel(null, (() => {
                const t = r.lineToolsSynchronizer();
                null !== t && (t.hasChanges().subscribe(e.recalcHasChanges), e.recalcHasChanges())
            }))
        }))
    }
    async function $t(e, t, i) {
        var r, n;
        try {
            const t = e.chartWidgetsDefs.map((e => {
                var t, i, s;
                return null !== (s = null === (i = null === (t = e.chartWidget) || void 0 === t ? void 0 : t.lineToolsSynchronizer()) || void 0 === i ? void 0 : i.flushPendingSavings()) && void 0 !== s ? s : null
            })).filter(le.notNull);
            t.length && await Promise.all(t)
        } catch (e) {
            tt.logError(`Error flushing line tools: ${e}`)
        }(t = e.checkProFeature(t)) in Q.layouts || (t = "s"), Gt(e, i);
        const o = e.layoutType,
            a = Q.layouts[t].count;
        (0, A.emit)("layout_about_to_be_changed", t), (null !== (r = e.splitters.value()) && void 0 !== r ? r : []).forEach(((e, t) => {
            e.splitterElement.remove(),
                e.mouseHandler.destroy()
        })), e.splitters.setValue([]);
        const l = Q.layouts[t];
        e.layoutTemplate.setValue(l);
        const c = null !== (n = e.allLayoutSizesState.get(l.layoutType)) && void 0 !== n ? n : (0, ie.layoutInitialSizingState)(l.expression);
        e.allLayoutSizesState.set(l.layoutType, c), e.sizingState.setValue(c);
        const h = e.maximizedChartDef.value();
        o !== t && e.maximizedChartDef.value() && e.maximizedChartDef.setValue(null), h && e.activeChartWidget.setValue((0, s.ensureNotNull)(h.chartWidget));
        for (let t = 0; t < a || t < e.chartWidgetsDefs.length; t++) {
            let r, n = e.chartWidgetsDefs[t];
            const o = t >= a;
            if (r = e.maximizedChartDef.value() ? e.maximizedChartDef.value() === n : t < a, r) {
                if (n) {
                    if (e.parent.appendChild(n.container.value()), n.hiddenInLayout.setValue(!1), e.loadingContent) {
                        const t = e.savedChartWidgetOptions.shift();
                        t && (e.setLoadingContent(!0), (0, s.ensureNotNull)(n.chartWidget).loadContent(t.content, e.initialLoading), e.setLoadingContent(!1))
                    }
                } else Ut(e, i, t, void 0), n = e.chartWidgetsDefs[t];
                n.container.value().classList.toggle("multiple", a > 1), n.fullscreen.setValue(e.maximizedChartDef.value() === n), n.collapsed.setValue(o)
            } else n && (jt(n), n.collapsed.setValue(o))
        }
        e.sizingState.setValue(c), Nt(e), e.layoutWV.setValue(t), e.setLayoutType(t), e.updateWatchedValue(),
            function(e) {
                const t = e.layoutTemplate.value().count;
                e.inlineChartsCount.setValue(t), e.globalDetachable.setValue(t > 1)
            }(e), e.checkAllPendingModelsAlreadyCreated(), qt(e, i), e.inlineChartsCount.value() < 1 && a > 0 && e.chartWidgetsDefs[a - 1].rdState.bridge().attach()
    }

    function Yt(e, t, i, s, r) {
        if (!s && !e.crosshairLockRaw) return !1;
        const n = e.actualLayoutCount();
        return e.chartWidgetsDefs.slice(0, n).filter((e => e.rdState.bridge().visible.value())).map((e => e.chartWidget)).filter((e => e.id() !== i && e.hasModel())).forEach((e => e.model().model().setExternalPosition(t, r))), !0
    }

    function Kt(e, t, i, s, r) {
        if (Yt(e, t, i, s, r)) {
            const i = e.crossHairSyncBroadcast;
            if (i) {
                const e = {
                    type: "crosshair",
                    payload: {
                        point: t,
                        envState: r,
                        sourceUniqueId: i.uniqueId
                    }
                };
                i.channel.postMessage(e)
            }
        }
    }

    function Zt(e) {
        const t = new BroadcastChannel("ChartWidgetsCollection");
        return t.onmessage = t => {
            const i = t.data,
                s = e();
            if (s.crossHairSyncBroadcast && "crosshair" === i.type) s.crossHairSyncBroadcast.uniqueId !== i.payload.sourceUniqueId && Yt(s, i.payload.point, null, !1, i.payload.envState)
        }, {
            channel: t,
            uniqueId: (0, J.randomHashN)(6)
        }
    }

    function Xt(e) {
        var t;
        null === (t = e.crossHairSyncBroadcast) || void 0 === t || t.channel.close()
    }

    function Jt(e, t, i) {
        if (!e.trackTimeLock.value() || e.dateRangeLock.value()) return;
        const s = e.layoutTemplate.value().count;
        e.undoHistory.beginUndoMacro(st), e.chartWidgetsDefs.slice(0, s).filter((e => e.chartWidget.hasModel() && e.chartWidget.model().model() !== i)).forEach((e => {
            const i = e.chartWidget.model().model(),
                s = i.mainSeries().syncModel();
            s && i.syncTimeWithModel(s.syncSourceTarget(), t)
        })), e.undoHistory.endUndoMacro()
    }

    function Qt(e) {
        return Promise.all(e.map((e => {
            const t = e.model().mainSeries();
            return t.symbolResolvingActive().value() ? d(t.dataEvents().symbolResolved()).promise : t.symbolInfo()
        })))
    }

    function ei(e) {
        return e.chartWidgetsDefs.every((e => e.chartWidget.hasModel())) ? Promise.resolve(e.chartWidgetsDefs.map((e => e.chartWidget))) : Promise.all(e.chartWidgetsDefs.map((e => e.chartWidget.hasModel() || d(e.chartWidget.modelCreated()).promise))).then((() => ei(e)))
    }

    function ti(e, t) {
        var i;
        if ((0, h.enabled)("charting_library_base")) return t;
        if ("s" === t || e.widgetOptions.containsData || e.readOnly || isProductFeatureEnabled(ProductFeatures.MULTIPLE_CHARTS) && (0, s.ensure)(null === (i = getProductFeatureConfig(ProductFeatures.MULTIPLE_CHARTS)) || void 0 === i ? void 0 : i.limit) >= Q.layouts[t].count) return t;
        return "s"
    }
    async function ii(e, t, i) {
        if (i = ti(e, i), e.layoutWV.value() === i) return !1;
        const s = e.chartWidgetsDefs.map((e => {
            var t, i, s;
            return null !== (s = null === (i = null === (t = e.chartWidget) || void 0 === t ? void 0 : t.lineToolsSynchronizer()) || void 0 === i ? void 0 : i.flushPendingSavings()) && void 0 !== s ? s : null
        })).filter(le.notNull);
        if (s.length) try {
            await Promise.all(s)
        } catch (e) {
            tt.logError(`Error flushing line tools: ${e}`)
        }
        return e.undoHistory.pushUndoCommand(new ae(t, i)), !0
    }
    async function si(e, t, i) {
        const {
            theme: s,
            onlyActiveChart: r,
            restoreNonThemeDefaults: n,
            themeName: o,
            standardTheme: a,
            syncState: l = !0,
            noUndo: c
        } = i, h = (0, k.getCurrentTheme)().name;
        let d;
        r ? d = [e.activeChartWidget.value()] : (Gt(e, t), await Promise.all(e.savedChartWidgetOptions.map(((i, s) => new Promise((i => {
            jt(Ut(e, t, s, i))
        }))))), d = e.chartWidgetsDefs.map((e => e.chartWidget)), qt(e, t)), c ? (a && new $e(h, o, l).redo(), d.forEach((e => {
            e.model().model().restoreTheme(s, n, c)
        }))) : (e.undoHistory.beginUndoMacro(ot), a && e.undoHistory.pushUndoCommand(new $e(h, o, l)), d.forEach((e => {
            e.model().model().restoreTheme(s, n)
        })), e.undoHistory.endUndoMacro())
    }

    function ri(e, t) {
        e.symbolLock.setValue(t)
    }

    function ni(e, t) {
        const {
            internalSymbolLock: i,
            activeChartWidget: s,
            undoHistory: r,
            dateRangeLock: n,
            loadingContent: o,
            linkingGroupsCharts: a,
            chartWidgetsDefs: c
        } = e;
        if (t !== i.value())
            if (o) i.setValue(t);
            else {
                if (e.undoHistory.beginUndoMacro(at), t) {
                    const t = s.value();
                    c.map((e => e.chartWidget));
                    a.forEach(((i, s) => {
                        const r = (t.linkingGroupIndex().value(), t);
                        if (void 0 !== r) {
                            (0, l.muteLinkingGroup)(s, !0);
                            for (const t of i.value()) t !== r && t.symbolWV().value() !== r.symbolWV().value() && (t.setSymbol(r.symbolWV().value()), n.value() && e.subscribeToCompletedEventForDateRangeSync(t, !0));
                            (0, l.muteLinkingGroup)(s, !1)
                        }
                    }))
                }
                r.setWatchedValue(i, t, at), r.endUndoMacro()
            }
    }

    function oi(e, t) {
        e.intervalLock.setValue(t)
    }

    function ai(e, t) {
        const {
            internalIntervalLock: i,
            activeChartWidget: s,
            undoHistory: r,
            dateRangeLock: n,
            loadingContent: o,
            chartWidgetsDefs: a,
            linkingGroupsCharts: c
        } = e;
        if (t !== i.value())
            if (o) i.setValue(t);
            else {
                if (r.beginUndoMacro(lt), t && t) {
                    const t = s.value();
                    a.map((e => e.chartWidget));
                    c.forEach(((i, s) => {
                        const r = (t.linkingGroupIndex().value(), t);
                        if (void 0 !== r) {
                            (0, l.muteLinkingGroup)(s, !0);
                            for (const t of i.value()) t !== r && t.resolutionWV().value() !== r.resolutionWV().value() && (t.setResolution(r.resolutionWV().value()), n.value() && e.subscribeToCompletedEventForDateRangeSync(t, !0));
                            (0, l.muteLinkingGroup)(s, !1)
                        }
                    }))
                }
                r.setWatchedValue(i, t, lt), r.endUndoMacro()
            }
    }

    function li(e, t) {
        const i = e.activeChartWidget.value();
        if (i && i.hasModel()) {
            const s = i.model();
            t ? (e.subscribeToEventsForDateRangeSync(s), e.syncChartsDateRangesWithActiveChartRange()) : e.unsubscribeFromEventsForDateRangeSync(s)
        }
        e.dateRangeLock.setValue(t)
    }

    function ci(e, t) {
        const {
            internalDateRangeLock: i,
            undoHistory: s,
            loadingContent: r
        } = e;
        r ? i.setValue(t) : s.setWatchedValue(i, t, ct)
    }

    function hi(e, t) {
        e.trackTimeLock.setValue(t)
    }

    function di(e, t) {
        const {
            internalTrackTimeLock: i,
            undoHistory: s,
            loadingContent: r
        } = e;
        r ? i.setValue(t) : s.setWatchedValue(i, t, ht)
    }

    function ui(e, t, i) {
        e.symbolLock.value() ? pi(e, t, i) : e.activeChartWidget.value().setSymbol(t)
    }

    function pi(e, t, i) {
        const s = e.activeChartWidget.value();
        void 0 === i && (i = s.linkingGroupIndex().value());
        for (const i of e.chartWidgetsDefs) {
            const e = i.chartWidget;
            (e.hasModel() ? e.model().mainSeries().symbolSameAsCurrent(t) : e.symbolWV().value() === t) || e.setSymbol(t)
        }
    }

    function _i(e) {
        return e.intervalLock.value() ? e.chartWidgetsDefs.map((e => e.chartWidget)) : [e.activeChartWidget.value()]
    }

    function mi(e, t, i) {
        e.flags.loadingChart || e.flags.setTimeFrameActive || e.flags.setNewResolution || function(e, t, i) {
            (0, Xe.setLastUsedResolution)(t), e.flags.setNewResolution = !0;
            const s = e.activeChartWidget.value();
            void 0 === i && (i = s.linkingGroupIndex().value());
            if (e.intervalLock.value())
                for (const i of e.chartWidgetsDefs) {
                    const e = i.chartWidget;
                    e.resolutionWV().value() !== t && e.setResolution(t)
                } else s.setResolution(t);
            e.flags.setNewResolution = !1
        }(e, t, i)
    }

    function gi(e) {
        return new Qe(null).spawn()
    }

    function fi(e) {
        return [null]
    }

    function vi(e) {
        const t = new Ke.WatchedObject((e.chartWidgetsDefs, [null])),
            i = () => {
                t.setValue((e.chartWidgetsDefs, [null]))
            };
        e.chartWidgetsDefs.forEach((e => e.chartWidget.linkingGroupIndex().subscribe(i)));
        const s = e => {
            e.linkingGroupIndex().subscribe(i), i()
        };
        return e.chartWidgetCreatedDelegate.subscribe(null, s), t.spawn((() => {
            e.chartWidgetsDefs.forEach((e => e.chartWidget.linkingGroupIndex().unsubscribe(i))), e.chartWidgetCreatedDelegate.unsubscribe(null, s)
        }))
    }

    function Si(e, t) {
        if (e.length !== t.length) return !1;
        for (let i = 0; i < e.length; ++i)
            if (e[i] !== t[i]) return !1;
        return !0
    }

    function yi(e, t) {
        t = null;
        let i = e.linkingGroupsCharts.get(t);
        return void 0 === i && (i = new Ke.WatchedObject([], Si), e.linkingGroupsCharts.set(t, i)), i
    }

    function bi(e) {
        var t;
        const i = new Map;
        for (const t of e.chartWidgetsDefs) {
            const e = null;
            let s = i.get(e);
            void 0 === s && (s = [], i.set(e, s)), s.push(t.chartWidget)
        }
        for (const s of (0, B.join)(new Set(e.linkingGroupsCharts.keys()), new Set(i.keys()))) yi(e, s).setValue(null !== (t = i.get(s)) && void 0 !== t ? t : [])
    }

    function wi(e) {
        0
    }
}