(e, t, i) => {
    "use strict";
    var s = i(1836),
        r = i(43370),
        n = i(50151);

    function o() {
        return window
    }

    function a() {
        const e = o();
        return e.parent[e.urlParams.uid]
    }
    var l = i(44352),
        c = (i(44232), i(58005), i(85804)),
        h = (i(89173), i(14483));
    const d = o();
    JSON.parse(d.urlParams.disabledFeatures).forEach((e => {
        h.setEnabled(e, !1)
    })), JSON.parse(d.urlParams.enabledFeatures).forEach((e => {
        h.setEnabled(e, !0)
    }));
    var u = i(56840);
    const p = o(),
        _ = a();
    p.__settingsOverrides = _.settingsOverrides || {};
    const m = _.settingsAdapter;
    null != m ? (u.setSettingsAdapter(m), u.sync()) : h.enabled("use_localstorage_for_settings") && u.sync();
    var g = i(46501);
    const f = o();
    f.urlParams.customFontFamily && (0, g.setChartFontFamily)(f.urlParams.customFontFamily);
    var v = i(38881);
    class S extends v.ChunkLoader {
        _startLoading() {
            return Promise.all([i.e(2684), i.e(2666), i.e(3842), i.e(6), i.e(5993), i.e(5649), i.e(8056), i.e(6752), i.e(8149), i.e(6639), i.e(6036), i.e(6106), i.e(4894), i.e(6025), i.e(6949), i.e(1033), i.e(1849), i.e(9842), i.e(962), i.e(3179), i.e(5050), i.e(3291), i.e(5516)]).then(i.bind(i, 6652)).then((e => e.getRestrictedToolSet()))
        }
    }
    var y = i(69774),
        b = i(24899);

    function w(e = [], t = []) {
        const i = document.createElement("div"),
            s = document.createElement("div");
        return i.appendChild(s), i.classList.add(b.container), s.classList.add(b.inner), e.forEach((e => {
            i.classList.add(b[e])
        })), t.forEach((e => {
            i.classList.add(b[e])
        })), i
    }
    class P extends v.ChunkLoader {
        constructor(e, t) {
            super(), this._toolsBootloader = e, this._headerProps = t, this._headerProps.resizerBridge.negotiateHeight(y.HEADER_TOOLBAR_HEIGHT_EXPANDED), this._headerProps.resizerBridge.container.value().appendChild(w())
        }
        _startLoading() {
            return Promise.all([this._toolsBootloader.load(), this._loadHeaderToolbar()]).then((([e, t]) => new t(this._headerProps.resizerBridge.container.value(), {
                ...this._headerProps,
                tools: e
            })))
        }
        _loadHeaderToolbar() {
            return Promise.all([i.e(3066), i.e(962), i.e(2158), i.e(3005)]).then(i.bind(i, 46618)).then((e => e.HeaderToolbarRenderer))
        }
    }
    var C = i(14873),
        x = i(9438);
    class T extends v.ChunkLoader {
        constructor(e) {
            super(), this._opts = e, C.isDrawingToolbarVisible.value() && (this._opts.resizerBridge.negotiateWidth(x.TOOLBAR_WIDTH_EXPANDED), this._opts.resizerBridge.container.value().appendChild(w()))
        }
        _startLoading() {
            return Promise.all([i.e(2427), i.e(2666), i.e(3842), i.e(5993), i.e(5649), i.e(6752), i.e(3980), i.e(1109), i.e(1849), i.e(6959), i.e(962), i.e(2842), i.e(3179), i.e(1890), i.e(5007), i.e(2878)]).then(i.bind(i, 14186)).then((e => new e.DrawingToolbarRenderer(this._opts.resizerBridge.container.value(), {
                ...this._opts
            })))
        }
    }
    var I = i(66501),
        M = i(32563),
        A = i(5286),
        L = i(45345);
    var k = i(58844),
        E = i(4741),
        D = i(3343);

    function V(e) {
        if ("number" == typeof e) return e;
        switch (e.toLowerCase()) {
            case "ctrl":
                return D.Modifiers.Control;
            case "shift":
                return D.Modifiers.Shift;
            case "alt":
                return D.Modifiers.Alt;
            default:
                return e.toUpperCase().charCodeAt(0)
        }
    }

    function B(e) {
        let t = 0;
        for (let i = 0; i < e.length; i++) t |= V(e[i]);
        return t
    }
    var R = i(80147),
        N = i(58275),
        O = i.n(N),
        F = i(76422);

    function W(e, t) {
        h.enabled("saveload_requires_authentication") ? window.runOrSignIn(e, t) : e()
    }
    i(42053);
    h.enabled("atsv2s");
    var z = i(61595);
    async function H() {
        return !0
    }
    var U = i(3615);
    const j = h.enabled("confirm_overwrite_if_chart_layout_with_name_exists");
    class G {
        constructor(e, t, i) {
            this._visibility = new(O())(!1), this._chartWidgetCollection = e, this._doSave = t, this._doLoad = i
        }
        hide() {
            var e;
            null === (e = this._hide) || void 0 === e || e.call(this), this._visibility.setValue(!1)
        }
        visible() {
            return this._visibility.readonly()
        }
        _showRenameDialog(e, t, s, r) {
            return (0, U.showRename)({
                title: this._renameDialogTitle(),
                text: this._renameDialogText(),
                maxLength: 64,
                initValue: e,
                onRename: async e => {
                    if (!j) return void this._renameActionHandler(e, t, s, r);
                    const {
                        newValue: n,
                        dialogClose: o
                    } = e, a = (await this._doLoad()).find((e => e.name === n));
                    o(), void 0 !== a ? this._hide = await (0, U.showConfirm)({
                        title: l.t(null, void 0, i(56996)),
                        text: l.t(null, void 0, i(30192)),
                        onConfirm: ({
                            dialogClose: e
                        }) => {
                            e(), this._doOverwriteExistingLayout(a.id, n, t, s, r)
                        },
                        onCancel: ({
                            dialogClose: e
                        }) => {
                            e(), this._showRenameDialog(n, t, s, r)
                        }
                    }) : this._renameActionHandler({
                        newValue: n,
                        dialogClose: o
                    }, t, s, r)
                },
                onClose: () => this._visibility.setValue(!1)
            })
        }
        _doSaveCurrentLayout(e, t, i, s) {
            const r = this._chartWidgetCollection.metaInfo.name.value();
            this._chartWidgetCollection.metaInfo.name.setValue(e), this._doSave(t, i, (() => {
                this._chartWidgetCollection.metaInfo.name.setValue(r), null == s || s()
            }))
        }
        _doOverwriteExistingLayout(e, t, i, s, r) {
            const n = this._chartWidgetCollection.metaInfo.name.value();
            this._chartWidgetCollection.metaInfo.id.setValue(e), this._chartWidgetCollection.metaInfo.name.setValue(t), this._doSave(i, s, (() => {
                this._chartWidgetCollection.metaInfo.name.setValue(n), null == r || r()
            }))
        }
    }
    class q extends G {
        cloneChart() {
            this._cloneChart().then((() => this._visibility.setValue(!0)))
        }
        show() {
            W((() => this.cloneChart()), {
                source: "Clone chart"
            })
        }
        _renameDialogTitle() {
            return l.t(null, void 0, i(87898))
        }
        _renameDialogText() {
            return l.t(null, void 0, i(24435)) + ":"
        }
        _renameActionHandler({
            newValue: e,
            dialogClose: t
        }) {
            h.enabled("saveload_storage_customization") && this._doCloneCurrentLayout(e), t()
        }
        async _cloneChart() {
            let e;
            try {
                e = await H()
            } catch (e) {
                return void showErrorDialog({
                    content: l.t(null, void 0, i(56670))
                })
            }
            e && (this._hide = await this._showRenameDialog(this._getInitialRenameDialogInput()))
        }
        _doCloneCurrentLayout(e) {
            const t = this._chartWidgetCollection.metaInfo.name.value();
            this._chartWidgetCollection.metaInfo.uid.deleteValue(), this._chartWidgetCollection.metaInfo.id.deleteValue(), this._chartWidgetCollection.metaInfo.name.setValue(e), this._doSave(void 0, void 0, (() => {
                this._chartWidgetCollection.metaInfo.name.setValue(t)
            }))
        }
        _getInitialRenameDialogInput() {
            return l.t(null, {
                context: "ex: AAPL chart copy"
            }, i(16493)).format({
                title: this._chartWidgetCollection.metaInfo.name.value()
            })
        }
    }
    class $ extends G {
        show(e, t, i) {
            const s = "function" == typeof e ? e : void 0;
            this._saveNewChart(s, t, i).then((() => this._visibility.setValue(!0)))
        }
        _renameDialogTitle() {
            return l.t(null, void 0, i(10520))
        }
        _renameDialogText() {
            return l.t(null, void 0, i(24435)) + ":"
        }
        _renameActionHandler({
            newValue: e,
            dialogClose: t
        }, i, s, r) {
            this._doSaveCurrentLayout(e, i, s, r), t()
        }
        async _saveNewChart(e, t, s) {
            let r;
            try {
                r = await H()
            } catch (e) {
                return void showErrorDialog({
                    content: l.t(null, void 0, i(56670))
                })
            }
            const n = this._chartWidgetCollection.metaInfo.name.value();
            this._hide = await this._showRenameDialog(n, e, t, s)
        }
    }
    class Y extends G {
        show() {
            W((() => this._show()), {
                source: "Rename chart"
            })
        }
        _renameDialogTitle() {
            return l.t(null, void 0, i(4142))
        }
        _renameDialogText() {
            return l.t(null, void 0, i(24435)) + ":"
        }
        _renameActionHandler({
            newValue: e,
            dialogClose: t
        }) {
            this._doSaveCurrentLayout(e), t()
        }
        async _show() {
            await this._renameChart(), this._visibility.setValue(!0)
        }
        async _renameChart() {
            const e = this._chartWidgetCollection.metaInfo.name.value();
            this._hide = await this._showRenameDialog(e)
        }
    }
    class K {
        constructor(e, t) {
            this._autosaveTimer = null, this._watchedAutoSaveEnabled = new(O()), this._toggleAutoSaveEnabledHandler = this._toggleAutoSaveEnabled.bind(this), this._doSave = (e, t, i, s) => {
                const r = this._chartWidgetCollection;
                void 0 !== e && e();
                const n = this._chartChangesWatcher.changes();
                this._chartSaver.saveChartSilently((e => {
                    var i;
                    i = r.metaInfo.uid.value(), "/chart/" === location.pathname && (location.href = "/chart/" + i), void 0 !== t && t(e)
                }), (() => {
                    void 0 !== i && i()
                }), {
                    autoSave: Boolean(s),
                    changes: n
                })
            }, this._doLoad = () => z.backend.getCharts(), this._chartWidgetCollection = e, this._chartSaver = t, this._createController = new $(e, this._doSave, this._doLoad), this._renameController = new Y(e, this._doSave, this._doLoad), this._saveAsController = new q(e, this._doSave, this._doLoad), this._chartChangesWatcher = new I.ChartChangesWatcher(e, t, F), e.saveKeysPressed().subscribe(this, this.saveChartOrShowTitleDialog), this._chartChangesWatcher.getOnChange().subscribe(this, this._onStateChanged)
        }
        autoSaveEnabled() {
            return this._watchedAutoSaveEnabled
        }
        destroy() {
            0
        }
        getCreateController() {
            return this._createController
        }
        getRenameController() {
            return this._renameController
        }
        getSaveAsController() {
            return this._saveAsController
        }
        cloneChart() {
            this._saveAsController.cloneChart()
        }
        saveChartAs() {
            this._saveAsController.show()
        }
        renameChart() {
            this._renameController.show()
        }
        saveNewChart(e, t, i) {
            this._createController.show(e, t, i)
        }
        saveExistentChart(e, t, i) {
            this._doSave(e, t, i)
        }
        changes() {
            return this._chartChangesWatcher.changes()
        }
        hasChanges() {
            return 0 !== this._chartChangesWatcher.changes()
        }
        saveChartOrShowTitleDialog(e, t, i) {
            const s = window.saver.isSaveInProcess(),
                r = this._chartChangesWatcher.hasChanges(),
                n = !!this._chartWidgetCollection.metaInfo.id.value();
            window.is_authenticated && (s || !r && n) || W((() => {
                null != this._chartWidgetCollection.metaInfo.id.value() ? this.saveExistentChart(e, t, i) : this.saveNewChart(e, t, i)
            }), {
                source: "Save chart",
                sourceMeta: "Chart"
            })
        }
        saveToJSON() {
            return this._chartSaver.saveToJSON()
        }
        saveChartSilently(e, t, i) {
            this._chartSaver.saveChartSilently(e, t, i)
        }
        setAutoSaveEnabled(e) {
            window.is_authenticated && window.saver.isSaveInProcess() || W((() => {
                this._watchedAutoSaveEnabled.setValue(e)
            }), {
                source: "AutoSave chart"
            })
        }
        saveChartLineTools(e, t, i, s) {
            return this._chartSaver.saveChartLineTools(e, t, i, s)
        }
        _autoSaveEnabledSettingHandler(e) {
            0
        }
        _toggleAutoSaveEnabled(e) {
            0
        }
        _enableAutoSave() {
            0
        }
        _disableAutoSave() {
            0
        }
        _onStateChanged(e) {
            e ? this._startAutosave() : this._stopAutosave()
        }
        _startAutosave() {
            h.enabled("charts_auto_save") && null === this._autosaveTimer && (this._autosaveTimer = setTimeout((() => {
                this._autosaveTimer = null, this._chartWidgetCollection.metaInfo.id.value() && this._doSave(void 0, void 0, void 0, !0)
            }), 6e4))
        }
        _stopAutosave() {
            null !== this._autosaveTimer && (clearInterval(this._autosaveTimer), this._autosaveTimer = null)
        }
    }
    var Z = i(85067),
        X = i(21097),
        J = i(68456);
    class Q extends J.CommonJsonStoreService {
        constructor(e, t) {
            super(e, t, "FAVORITE_CHARTS_CHANGED", "loadChartDialog.favorites", {})
        }
    }
    class ee extends Z.DialogRenderer {
        constructor(e = null) {
            super(), this._chartWidgetCollection = null, this._promise = null, this._dialog = null, this._subscribe = e => {
                this._setVisibility(e)
            }, this._getChartEntry = e => ({
                id: e.id,
                url: e.url,
                title: e.name,
                symbol: e.short_symbol,
                interval: e.interval,
                toolsCount: 0,
                modified: e.modified_iso,
                favorite: void 0,
                active: () => this._isActiveChart(e.id),
                openAction: () => z.backend.loadChart(e),
                deleteAction: () => z.backend.removeChart(e.image_url).then((() => this._deleteChart(e.id))),
                favoriteAction: e => Promise.resolve(this._updateFavorites(e))
            }), this._updateFavorites = e => {
                var t;
                null === (t = this._favoriteChartsService) || void 0 === t || t.set(e)
            }, this._isActiveChart = e => null !== this._chartWidgetCollection && e === this._chartWidgetCollection.metaInfo.id.value(), this._deleteChart = e => {
                this._isActiveChart(e) && (h.enabled("saveload_storage_customization") ? null !== this._chartWidgetCollection && this._chartWidgetCollection.clearChartMetaInfo() : location.href = "/chart/" + location.search)
            }, this._chartWidgetCollection = e, this._favoriteChartsService = new Q(X.TVXWindowEvents, u)
        }
        showLoadDialog() {
            W(this._showLoadDialog.bind(this), {
                source: "Load chart",
                sourceMeta: "Chart"
            })
        }
        show() {
            this.showLoadDialog()
        }
        hide() {
            var e, t;
            null === (e = this._dialog) || void 0 === e || e.hide(), null === (t = this._dialog) || void 0 === t || t.visible().unsubscribe(this._subscribe)
        }
        _showLoadDialog() {
            (h.enabled("saveload_requires_authentication") && !window.is_authenticated ? Promise.resolve([]) : z.backend.getCharts()).then((e => e.map(this._getChartEntry))).then((e => {
                const t = this._promise = Promise.all([i.e(2666), i.e(1013), i.e(3842), i.e(5145), i.e(855), i.e(5993), i.e(2587), i.e(6752), i.e(8149), i.e(1054), i.e(898), i.e(962), i.e(2842), i.e(3016), i.e(3179), i.e(5711), i.e(5009)]).then(i.bind(i, 34557)).then((i => {
                    if (this._promise === t) {
                        this._dialog && (this._dialog.hide(), this._dialog.visible().unsubscribe(this._subscribe));
                        const t = {
                            charts: e,
                            favoriteChartsService: this._favoriteChartsService,
                            chartWidgetCollection: this._chartWidgetCollection
                        };
                        this._dialog = new i.LoadChartDialogRenderer(t), this._dialog.visible().subscribe(this._subscribe), this._dialog.show()
                    }
                }))
            }))
        }
        async _changeFavoriteState(e, t, i) {
            return Promise.resolve()
        }
    }
    var te = i(51768),
        ie = i(57898),
        se = i.n(ie);
    const re = (0, i(59224).getLogger)("Platform.StudyTemplates"),
        ne = l.t(null, void 0, i(97065));
    class oe {
        constructor(e) {
            this._chartWidgetCollection = e.chartWidgetCollection, this._favoriteStudyTemplatesService = e.favoriteStudyTemplatesService, window.loginStateChange.subscribe(null, z.backend.invalidateStudyTemplatesList), this._list = new(O())([]), this._onChange = new(se()), this._list.subscribe((() => this._onChange.fire()))
        }
        findRecordByName(e) {
            return this._list.value().find((t => t.name === e)) || null
        }
        showSaveAsDialog() {
            const e = this._chartWidgetCollection.activeChartWidget.value().model();
            Promise.all([i.e(2666), i.e(1013), i.e(5145), i.e(855), i.e(6), i.e(2191), i.e(6221), i.e(3502), i.e(4215), i.e(6639), i.e(6884), i.e(3610), i.e(7149), i.e(962), i.e(3016), i.e(4717), i.e(6631)]).then(i.bind(i, 13932)).then((t => {
                new t.StudyTemplateSaver({
                    controller: e,
                    onSave: e => {
                        this._list.setValue(e)
                    }
                }).show()
            }))
        }
        applyTemplate(e) {
            const t = this.findRecordByName(e);
            null !== t ? window.runOrSignIn((() => {
                const e = this._chartWidgetCollection.activeChartWidget.value(),
                    i = i => {
                        (0, te.trackEvent)("GUI", "Load Study Template"), e.model().applyStudyTemplate(JSON.parse(i.content), t.name)
                    };
                void 0 !== t.id ? t.is_default ? z.backend.getStandardStudyTemplateContentById(t.id, i) : z.backend.getStudyTemplateContentById(t.id, i) : z.backend.getStudyTemplateContent(t.name).then(i)
            }), {
                source: "Study templates apply"
            }) : re.logNormal(`Template ${e} not found in cache`)
        }
        deleteStudyTemplate(e) {
            const t = this.findRecordByName(e);
            null !== t ? this._removeTemplate(t) : re.logNormal(`Template ${e} not found in cache`)
        }
        list() {
            return this._list.value()
        }
        getOnChange() {
            return this._onChange
        }
        refreshStudyTemplateList(e) {
            z.backend.getStudyTemplatesList().then((t => {
                this._list.setValue(t), void 0 !== e && e()
            }))
        }
        invalidate() {
            z.backend.invalidateStudyTemplatesList()
        }
        _removeTemplate(e) {
            window.runOrSignIn((() => {
                (0, U.showConfirm)({
                    text: ne.format({
                        name: e.name
                    }),
                    onConfirm: ({
                        dialogClose: t
                    }) => new Promise((i => {
                        const s = () => {
                            this.refreshStudyTemplateList((() => {
                                const s = this.list();
                                this._list.setValue(s.filter((t => t !== e))), this._favoriteStudyTemplatesService && this._favoriteStudyTemplatesService.remove(e.name), i(), t()
                            }))
                        };
                        z.backend.invalidateStudyTemplatesList(), void 0 !== e.id ? z.backend.removeStudyTemplateById(e.id, s) : z.backend.removeStudyTemplate(e.name).then(s)
                    }))
                })
            }), {
                source: "Study templates delete"
            })
        }
    }
    var ae = i(35423),
        le = i(82992),
        ce = i(61146),
        he = i(1763);
    class de {
        constructor(e, t) {
            this._visibility = new(O())(!1), this._dialogPromise = null, this._dialog = null, this._chartWidgetCollection = e, this._options = t
        }
        visible() {
            return this._visibility.readonly()
        }
        show(e, t, i) {
            var s;
            const r = Array.isArray(e) ? e : [],
                n = Array.isArray(e) ? void 0 : e,
                o = void 0;
            null === this._dialog && this._requestDialog(null != r ? r : [], o, t, i, n), null === (s = this._dialog) || void 0 === s || s.open(null != r ? r : [], o, t, i, n)
        }
        hide() {
            var e;
            null === (e = this._dialog) || void 0 === e || e.hide()
        }
        getDialog() {
            return this._dialog
        }
        resetAllPages() {
            var e;
            null === (e = this._dialog) || void 0 === e || e.resetAllStudies()
        }
        _requestDialog(e, t, s, r, n) {
            if (null === this._dialogPromise) {
                let o;
                o = Promise.all([i.e(2666), i.e(1013), i.e(5145), i.e(855), i.e(2191), i.e(2587), i.e(6752), i.e(7350), i.e(6494), i.e(962), i.e(3016), i.e(6456)]).then(i.bind(i, 57979)).then((e => new e.IndicatorsLibraryContainer(this._chartWidgetCollection, this._options))), this._dialogPromise = o.then((i => {
                    this._dialog = i, this._dialog.visible().subscribe((e => {
                        this._visibility.setValue(e)
                    })), this._dialog.open(e, t, s, r, n)
                }))
            }
            return this._dialogPromise
        }
    }
    var ue = i(51608),
        pe = i(30888),
        _e = i(36174);

    function me(e) {
        const t = new(O())(e.value());
        let i = !1;
        e.subscribe(t, (() => {
            i || (i = !0, t.setValue(e.value()), i = !1)
        }));
        const s = () => {
            i || (i = !0, e.setValue(t.value()), i = !1)
        };
        return t.subscribe(s), t.spawn((() => {
            e.unsubscribeAll(t), t.unsubscribe(s)
        }))
    }
    var ge = i(78159),
        fe = i(3228),
        ve = i(83407),
        Se = i(16164),
        ye = i(41249),
        be = i(38618),
        we = i(96429);
    const Pe = /^Etc\/GMT([+-])(\d{1,2}):?(\d\d)?$/,
        Ce = new Map;

    function xe(e) {
        if (Ce.has(e)) return Ce.get(e);
        const t = Pe.test(e);
        return Ce.set(e, t), t
    }
    const Te = new Map;

    function Ie(e) {
        if (Te.has(e)) return Te.get(e);
        const t = function(e) {
                const t = e.match(Pe);
                if (!t) return 0;
                const i = "+" === t[1] ? -1 : 1;
                return 60 * (60 * parseInt(t[2], 10) + parseInt(t[3] || "0", 10)) * i
            }(e),
            i = {
                time: [1924992e3 + t],
                offset: [t]
            };
        return Te.set(e, i), i
    }
    let Me = null;
    const Ae = new Map;
    class Le {
        constructor() {
            this._customTimezones = new Map
        }
        addTimezones(e) {
            e.forEach((e => {
                const {
                    id: t,
                    ...i
                } = e;
                this._addTimezone(t, i)
            })), this.updateChartTimezones()
        }
        listTimezoneIds() {
            return [...this._customTimezones.keys()]
        }
        listTimezones() {
            return [...this._customTimezones.entries()].map((([e, t]) => ({
                id: e,
                ...t
            })))
        }
        getTimezoneInfo(e) {
            if (!this.timezoneIsAvailable(e)) throw new Error("Provided timezone alias is not within the list of supported timezones.");
            return (0, n.ensure)(this._customTimezones.get(e))
        }
        getAllTimezoneInfo() {
            return this.listTimezones()
        }
        getAliasTimezone(e) {
            return this.getTimezoneInfo(e).alias
        }
        timezoneIsAvailable(e) {
            return this._customTimezones.has(e)
        }
        updateChartTimezones() {
            (0, be.updateAvailableTimezones)(this.getAllTimezoneInfo())
        }
        getTimezoneData(e) {
            if (Ae.has(e)) return Ae.get(e);
            let t = null;
            if (xe(e)) t = Ie(e);
            else if (this.timezoneIsAvailable(e)) {
                const i = this.getAliasTimezone(e);
                we.tzData[i] && (t = we.tzData[i]), !t && xe(i) && (t = Ie(i))
            }
            return t && Ae.set(e, t), t
        }
        static instance() {
            return null === Me && (Me = new Le), Me
        }
        _addTimezone(e, t) {
            try {
                if ((0, n.ensure)(e, "Custom timezone ID"), (0, n.ensure)(t.alias, "Custom timezone alias"), (0, n.ensure)(t.title, "Custom timezone title"), (0, be.timezoneIsAvailable)(e) && !this.timezoneIsAvailable(e)) throw new Error("Custom timezone id already exists.");
                if (!(0, be.timezoneIsSupported)(t.alias) && !xe(t.alias)) throw new Error("Custom timezone alias is not a supported timezone.");
                if (e.length < 1) throw new Error("Custom timezone id is empty");
                if (t.title.length < 1) throw new Error("Custom timezone title is empty");
                this._customTimezones.set(e, t)
            } catch (e) {
                console.warn(`Unable to add custom timezone. ${e}`)
            }
        }
    }(0, ye.setCustomTimezones)(Le);
    var ke = i(42226),
        Ee = i(36274),
        De = i(31940);
    class Ve {
        constructor(e) {
            this._document = e, this.isFullscreen = new(O());
            const t = () => {
                const e = ["fullscreenElement", "webkitFullscreenElement", "mozFullscreenElement", "mozFullScreenElement", "msFullscreenElement"];
                for (let t = 0; t < e.length; t++) {
                    const i = e[t];
                    if (i in this._document) {
                        this.isFullscreen.setValue(!!this._document[i]);
                        break
                    }
                }
            };
            t();
            for (const i of ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"]) e.addEventListener(i, t, !1)
        }
        enter() {
            const e = this._document.documentElement;
            for (const t of ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen", "msRequestFullscreen"])
                if ("function" == typeof e[t]) {
                    e[t]();
                    break
                } this.isFullscreen.setValue(!0)
        }
        exit() {
            const e = this._document;
            for (const t of ["exitFullscreen", "mozCancelFullScreen", "mozExitFullscreen", "webkitExitFullscreen", "msExitFullscreen"])
                if ("function" == typeof e[t]) {
                    e[t]();
                    break
                } this.isFullscreen.setValue(!1)
        }
    }
    class Be {
        constructor(e) {
            let t;
            this.isVisible = new(O())(!0);
            let i = null;
            for (const s of ["", "moz", "ms", "webkit"]) {
                const r = s ? `${s}Hidden` : "hidden";
                if (r in e) {
                    t = `${s}visibilitychange`, i = () => {
                        this.isVisible.setValue(!e[r])
                    }, i(), e.addEventListener(t, i, !1);
                    break
                }
            }
            this.destroy = () => {
                i && (e.removeEventListener(t, i, !1), i = null)
            }
        }
    }
    var Re = i(84015),
        Ne = i(49483);

    function Oe(e, t) {
        let i = 0;
        for (const {
                min: s,
                max: r
            }
            of t) {
            if (e < s || r < s) continue;
            const t = Math.min(e, r);
            if (i = Math.max(i, t), e === i) break
        }
        return i
    }

    function Fe(e) {
        const t = [];
        if (void 0 === e) return [];
        Array.isArray(e) || (e = [e]);
        for (const i of e) {
            let e, s;
            isFinite(i) ? e = s = Number(i) : (e = +i.min, s = +i.max), (e < 0 || isNaN(e)) && (e = 0), isNaN(s) && (s = 1 / 0), e <= s && s > 0 && t.push({
                min: e,
                max: s
            })
        }
        return t.sort(((e, t) => e.min - t.min || e.max - t.max)), t
    }

    function We(e, t) {
        if (e.length !== t.length) return !1;
        for (let i = e.length; i--;) {
            if (e[i].min !== t[i].min) return !1;
            if (e[i].max !== t[i].max) return !1
        }
        return !0
    }
    const ze = h.enabled("no_min_chart_width");

    function He(e) {
        const t = h.enabled("side_toolbar_in_fullscreen_mode"),
            i = h.enabled("header_in_fullscreen_mode");
        return "center" === e || "left" === e && t || "top" === e && i
    }
    var Ue = i(2438),
        je = i(98310),
        Ge = i(16216),
        qe = (i(26665), i(3162)),
        $e = i.n(qe),
        Ye = i(241),
        Ke = i(88348),
        Ze = i(15367),
        Xe = i(68335);
    var Je = i(2269),
        Qe = i.n(Je),
        et = i(42856),
        tt = i(75117),
        it = i.n(tt),
        st = (i(24172), i(46544), i(78136)),
        rt = i(88732),
        nt = i(74649),
        ot = i(97906),
        at = i(27714),
        lt = i(12481),
        ct = i(86441),
        ht = i(34026),
        dt = i(48891),
        ut = i(15742),
        pt = i(18807),
        _t = i(61345),
        mt = i(87095),
        gt = i(88275),
        ft = i(74359),
        vt = i(68441),
        St = i(34565),
        yt = i(66103),
        bt = i(70893),
        wt = i(50946);
    i(77275);
    const Pt = new Map([
            ["logo-old-style", wt],
            ["tradingview-old-style", bt]
        ]),
        Ct = h.enabled("adaptive_logo"),
        xt = h.enabled("small_no_display"),
        Tt = h.enabled("38914"),
        It = "site_branding",
        Mt = "widget_branding",
        At = "widget_referral_branding",
        Lt = "widget_custom_branding",
        kt = "widget_custom_no_powered_branding",
        Et = "fundamental_branding",
        Dt = "fundamental_custom_branding",
        Vt = "fundamental_custom_no_powered_branding",
        Bt = "library_branding",
        Rt = "library_custom_branding",
        Nt = "library_custom_no_powered_branding",
        Ot = navigator.userAgent.toLowerCase().indexOf("chrome") > -1 && -1 === navigator.userAgent.toLowerCase().indexOf("edge"),
        Ft = window.urlParams || {};
    window.initData;
    Ft.no_referral_id && enable(Ft.referral_id || "", "aggressive");
    const Wt = l.t(null, void 0, i(26619)),
        zt = Tt ? l.t(null, void 0, i(5607)) : l.t(null, void 0, i(68111)),
        Ht = (l.t(null, void 0, i(82128)), l.t(null, void 0, i(88841)), l.t(null, void 0, i(99769)), (0, Ne.onWidget)(), {
            brandCircleSize: 32,
            textAsImageWidthCompensation: 0,
            leftOffset: 0,
            bottomOffset: -23,
            logoLeftOffset: 1,
            maximizedWidthsCompensation: 0,
            logoTextOffset: 6
        });
    class Ut extends ut.CustomSourceBase {
        constructor(e, t, i) {
            super(e, t), this._canvasWidth = 0, this._paneHeight = 0, this._left = 13, this._bottom = 36, this._layout = It, this._needToShow = !0, this._showBranding = !1, this._customLogoSrc = "", this._customLogoLink = "", this._cubicBezier = new _t.CubicBezier(.4, .01, .22, 1), this._openAnimation = null, this._closeAnimation = null, this._powBy = null, this._custom = null, this._destroyed = !1, this._mainSeries = this._model.mainSeries(), this._visibleSpawn = i, this._showForPro = !t.onWidget();
            const s = () => this._model.updateSource(this);
            this._visibleSpawn.subscribe(s), this._dark = t.dark().spawn(), this._dark.subscribe(s), this._checkLayout(), this._layout !== Lt && this._layout !== Dt || (this._left = 8, this._bottom = 5);
            const r = () => {
                this._needToShow ? this._showBranding = !0 : this._showBranding = !1
            };
            this._resizeHandlerDelayed = (0, lt.default)(r, 200), r(), window.addEventListener("resize", this._resizeHandlerDelayed), this._monitorCanvas = (0, ft.createDisconnectedBoundCanvas)(document, (0, at.size)({
                width: 0,
                height: 0
            })), this._monitorCanvas.subscribeSuggestedBitmapSizeChanged((() => {
                this._init()
            })), this._model.isSnapshot() ? this._init() : (this._mainSeries.dataEvents().symbolResolved().subscribe(this, this._init), null !== this._mainSeries.symbolInfo() && this._init()), this._renderer = {
                draw: this.draw.bind(this),
                hitTest: this.hitTest.bind(this)
            }, t.onWidget() || window.loginStateChange.subscribe(this, this._init)
        }
        destroy() {
            window.removeEventListener("resize", this._resizeHandlerDelayed), this._mainSeries.dataEvents().symbolResolved().unsubscribeAll(this), this._powBy && this._powBy.destroy(), this._model.onWidget() || window.loginStateChange.unsubscribeAll(this), this._visibleSpawn.destroy(), this._dark.destroy(), this._destroyed = !0
        }
        paneViews(e) {
            if (window.TradingView.printing && this._layout !== kt && this._layout !== Vt) return [];
            if (!this._visibleSpawn.value()) return [];
            if (this._layout === It && !this._showForPro && window.user && window.user.is_pro) return [];
            const t = h.enabled("move_logo_to_main_pane");
            let i = !1;
            if (e.maximized().value()) i = !0;
            else if (t) i = this._model.mainPane().collapsed().value() ? e === this._model.panes().find((e => !e.collapsed().value())) : e.isMainPane();
            else if (this._model.lastPane().collapsed().value()) {
                const t = this._model.panes();
                for (let s = t.length - 1; s >= 0; --s) {
                    const r = t[s];
                    if (!r.collapsed().value()) {
                        i = r === e;
                        break
                    }
                }
            } else i = e.isLast();
            return i ? [{
                renderer: this.renderer.bind(this)
            }] : []
        }
        labelPaneViews(e) {
            return []
        }
        priceAxisViews(e, t) {
            return []
        }
        updateAllViews() {}
        updateViewsForPane(e) {}
        priceScale() {
            return null
        }
        renderer(e, t) {
            return this._paneHeight = e, this._canvasWidth = t, this._renderer
        }
        hasContextMenu() {
            return !1
        }
        onClickOutside() {
            this._hasAnimation() && this._startCloseAnimation()
        }
        hitTest(e) {
            if (!this._showBranding || h.enabled("logo_without_link")) return null;
            if (this._powBy && this._layout !== kt && this._layout !== Vt && (this._powBy.hitTest(e) || this._custom && this._custom.hitTest(e))) {
                const e = !0;
                return new pt.HitTestResult(pt.HitTarget.Custom, {
                    hideCrosshairLinesOnHover: !0,
                    cursorType: e ? yt.PaneCursorType.Pointer : yt.PaneCursorType.Default,
                    clickHandler: () => {
                        this._openLink()
                    },
                    tapHandler: () => {
                        this._hasAnimation() ? this._toggleOpenAnimatedOrOpenLink() : this._openLink()
                    },
                    mouseEnterHandler: () => {
                        this._hasAnimation() && this._startOpenAnimation()
                    },
                    mouseLeaveHandler: () => {
                        this._hasAnimation() && this._startCloseAnimation()
                    }
                })
            }
            return null
        }
        tvUrl() {
            let e = new URL("https://www.tradingview.com/");
            if (this._customLogoLink) return this._customLogoLink;
            if (this._layout === Bt || this._layout === Rt) {
                let t;
                switch (!0) {
                    case h.enabled("charting_library"):
                        t = "library";
                        break;
                    case h.enabled("trading_terminal"):
                        t = "trading-terminal"
                }
                e.searchParams.append("utm_source", window.location.origin), e.searchParams.append("utm_medium", "library"), t && e.searchParams.append("utm_campaign", t)
            }
            return e.toString()
        }
        draw(e, t) {
            if (!this._showBranding) return;
            let i = 0;
            Ft.utm = !0, (0, ft.drawScaled)(e, t.pixelRatio, t.pixelRatio, (() => {
                if (this._powBy && this._powBy.show) {
                    i = this._powBy.height, e.save();
                    const s = new ct.Point(this._left, this._paneHeight - this._bottom - i);
                    this._powBy.draw(s, e, t, this._canvasWidth), e.restore()
                }
                if (this._custom && this._custom.show) {
                    e.save();
                    const s = new ct.Point(this._left, this._paneHeight - this._bottom - i - this._custom.height);
                    this._custom.draw(s, e, t), e.restore()
                }
            }))
        }
        _init() {
            this._checkLayout();
            const e = this._mainSeries.symbolInfo();
            this._powBy && this._powBy.destroy(), this._powBy = new Qt(this._layout, (null == e ? void 0 : e.name) || "", this._model, (() => this._model.fullUpdate())), this._custom = new ei(this._layout, this._customLogoSrc, (() => this._model.fullUpdate())), this._openAnimation = null, this._closeAnimation = null, this._model.lightUpdate()
        }
        _checkLayout() {
            if (h.enabled("widget")) 0;
            else {
                {
                    const e = JSON.parse(Ft.logo) || {};
                    e.image ? (this._customLogoSrc = e.image, this._customLogoLink = e.link, this._needToShow = h.enabled("widget_logo"),
                        h.enabled("link_to_tradingview") ? this._layout = Rt : this._layout = Nt) : (this._layout = Bt, this._needToShow = h.enabled("widget_logo"))
                }
            }
        }
        _startOpenAnimation() {
            null === this._openAnimation && (null !== this._closeAnimation && (this._closeAnimation.stop(), this._closeAnimation = null), this._openAnimation = (0, gt.doAnimate)({
                from: this._currentStateForAnimation(),
                to: this._openedStateForAnimation(),
                duration: 200,
                easing: this._cubicBezier.easingFunc,
                onStep: this._animatedDrawStep.bind(this)
            }))
        }
        _startCloseAnimation() {
            null === this._closeAnimation && (null !== this._openAnimation && (this._openAnimation.stop(), this._openAnimation = null), this._closeAnimation = (0, gt.doAnimate)({
                from: this._currentStateForAnimation(),
                to: this._closedStateForAnimation(),
                duration: 200,
                easing: this._cubicBezier.easingFunc,
                onStep: this._animatedDrawStep.bind(this)
            }))
        }
        _currentStateForAnimation() {
            return (0, n.ensureNotNull)(this._powBy).width
        }
        _closedStateForAnimation() {
            return (0, n.ensureNotNull)(this._powBy).minimizedAnimationWidth()
        }
        _openedStateForAnimation() {
            return (0, n.ensureNotNull)(this._powBy).maximizedAnimationWidth()
        }
        _animatedDrawStep(e, t) {
            (0, n.ensureNotNull)(this._powBy).animatedDrawStep(e, t), this._model.lightUpdate()
        }
        _hasAnimation() {
            return null !== this._powBy && this._powBy.hasAnimation()
        }
        _openGoPro() {
            0
        }
        _openLink() {
            if (this._layout === It) return this._openGoPro(), !1;
            h.enabled("widget");
            return (0, n.ensureNotNull)(window.open(this.tvUrl(), "_blank")).opener = null, !0
        }
        _toggleOpenAnimatedOrOpenLink() {
            null !== this._openAnimation && this._openAnimation.completed() ? this._openLink() || this._startCloseAnimation() : this._startOpenAnimation()
        }
    }

    function jt(e) {
        return !xt || e > 480
    }

    function Gt(e) {
        return !Ct || e > 500
    }
    const qt = {
            customBrandingTradingViewText: dt.colorsPalette["color-brand"],
            customBrandingText: dt.colorsPalette["color-cold-gray-850"],
            background: dt.colorsPalette["color-cold-gray-900"],
            shadow: dt.colorsPalette["color-cold-gray-700"],
            text: dt.colorsPalette["color-white"],
            staticTextBackground: (0, mt.generateColor)(dt.colorsPalette["color-cold-gray-800"], 20),
            logo: dt.colorsPalette["color-white"]
        },
        $t = {
            customBrandingTradingViewText: dt.colorsPalette["color-brand"],
            customBrandingText: dt.colorsPalette["color-cold-gray-850"],
            background: dt.colorsPalette["color-white"],
            shadow: dt.colorsPalette["color-cold-gray-150"],
            text: dt.colorsPalette["color-cold-gray-900"],
            staticTextBackground: (0, mt.generateColor)(dt.colorsPalette["color-white"], 20),
            logo: dt.colorsPalette["color-cold-gray-900"]
        };

    function Yt(e, t) {
        return new Promise((i => {
            const s = e.replace(/fill="#[\da-f]{6}"/gi, `fill="${t}"`),
                r = new Image;
            r.onload = () => {
                r.onload = null, i(r)
            }, r.src = URL.createObjectURL(new Blob([s], {
                type: "image/svg+xml"
            }))
        }))
    }
    let Kt = {},
        Zt = {};

    function Xt(e, t, i) {
        const s = Zt,
            r = e + t,
            o = s[r];
        if (void 0 !== o) return o;
        const a = (0, n.ensureDefined)(Pt.get("logo-old-style")),
            l = (0, n.ensureDefined)(Pt.get("tradingview-old-style")),
            c = Yt(a, t),
            h = Yt(l, t);
        return Promise.all([c, h]).then((([e, t]) => {
            const n = {
                logoImage: e,
                textImage: t
            };
            s[r] = n, i(n)
        })), null
    }
    class Jt {
        constructor() {
            this._topLeftPoint = null
        }
        hitTest(e) {
            const t = this._getHitTestBox();
            if (t) return (0, ht.pointInBox)(e, t)
        }
        _getHitTestBox() {
            const e = this._topLeftPoint;
            if (e) {
                const {
                    x: t,
                    y: i
                } = e;
                return (0, ct.box)(e, new ct.Point(t + this.width, i + this.height))
            }
        }
    }
    class Qt extends Jt {
        constructor(e, t, i, s) {
            super(), this.show = !0, this._needDisplayImage = !1, this._animatedWidth = Ht.brandCircleSize, this._font = `px ${g.CHART_FONT_FAMILY}`, this._txt = "TradingView", this._textWidth = 0, this._maximizedAnimationTextWidth = 0, this._textWidthCache = new St.TextWidthCache, this._pixelRatio = 1, this._onLogoImageReady = e => {
                this._requestRepaint()
            }, this._model = i, this._layout = e, this._symbol = t, this._showAnimatedBranding = h.enabled("show_animated_logo") || this._layout === Mt, this._alwaysMaximized = h.enabled("logo_always_maximized") || !1, this._fontSize = this._showAnimatedBranding || this._layout === At ? 11 : 14, this._showAnimatedBranding || this._layout !== Lt && this._layout !== Dt || (this._fontSize = 12), this.width = Ht.brandCircleSize, this.height = this._fontSize + 2, this._requestRepaint = s, this._init(), this._checkFontLoaded(), this._recalculateMetrics()
        }
        destroy() {
            this._model.properties().childs().paneProperties.childs().background.unsubscribeAll(this), this._model.onChartThemeLoaded().unsubscribeAll(this)
        }
        hasAnimation() {
            return this._showAnimatedBranding && !this._alwaysMaximized
        }
        minimizedAnimationWidth() {
            return Ht.brandCircleSize
        }
        maximizedAnimationWidth() {
            return Ht.brandCircleSize + Ht.logoTextOffset + this._maximizedAnimationTextWidth
        }
        animatedDrawStep(e, t) {
            this._animatedWidth = t
        }
        draw(e, t, i, s) {
            const {
                brandCircleSize: r,
                logoLeftOffset: n,
                leftOffset: o,
                bottomOffset: a
            } = Ht;
            this._needDisplayImage && jt(s) && (e = new ct.Point(e.x + o, e.y - a)), this._topLeftPoint = e, t.translate(e.x, e.y), i.pixelRatio !== this._pixelRatio && (this._textWidthCache.reset(), this._pixelRatio = i.pixelRatio);
            const l = this._colors;
            if (this._showAnimatedBranding) {
                const e = this._getLogoImage(l.logo);
                this._needDisplayImage && e && this._drawLogo(t, e, this._animatedWidth, this._animatedWidth - r, this._animatedWidth > r)
            } else if (this._layout === Lt || this._layout === Dt) {
                t.font = this._fontSize + this._font;
                const e = t.measureText(this._txt).width + 2;
                this.width = e + t.measureText("TradingView").width + 2, t.save(), t.globalAlpha = .7, t.fillStyle = this._colors.customBrandingText, t.fillText(this._txt, 0, 12), t.fillStyle = this._colors.customBrandingTradingViewText, t.fillText("TradingView", e, 12), t.restore()
            } else if (jt(s) && this._layout === At) {
                const e = this._getLogoImage(l.logo),
                    i = this.maximizedAnimationWidth();
                e && this._drawLogo(t, e, i, i, !0)
            } else if (jt(s)) {
                const e = this._getLogoImage(l.logo);
                if (this._needDisplayImage && e) {
                    t.save(), this._drawBgCircle(t, r / 2);
                    const i = new ct.Point(Math.round((r - e.logoImage.width) / 2) - 1 + n, Math.floor((r - e.logoImage.height) / 2) + 1);
                    this._drawLogoImage(t, i, e.logoImage);
                    const o = Gt(s);
                    o && (t.translate(r + 5, Math.round(this._fontSize * ("px EuclidCircular" === this._font ? .1 : 0))), this._drawTextStroke(t), this._drawTextFill(t)), t.restore(), this.width = r, o && (this.width += this._maximizedAnimationTextWidth)
                } else {
                    const e = Gt(s);
                    e && (t.save(), t.translate(Ot ? -.5 : 0, -.5), this._drawTextStroke(t), this._drawTextFill(t), t.restore()), e && (this.width = this._maximizedAnimationTextWidth)
                }
            } else this.width = 0
        }
        _drawLogo(e, t, i, s, r) {
            const {
                brandCircleSize: n,
                logoLeftOffset: o,
                logoTextOffset: a
            } = Ht;
            e.save(), this._drawFillRectWithRoundedCorner(e, -.5, 0, i, n, n / 2);
            const l = new ct.Point(Math.round((n - t.logoImage.width) / 2) - 1 + o, Math.floor((n - t.logoImage.height) / 2) + 1);
            if (this._drawLogoImage(e, l, t.logoImage), r) {
                const i = new ct.Point(l.x + t.logoImage.width + a, l.y);
                this._drawImageCropWidth(e, i, t.textImage, s), this.width = t.logoImage.width + Math.min(t.textImage.width, s)
            }
            e.restore()
        }
        _init() {
            Zt = {}, Kt = {}, this._checkLayout(), this.show && (this._updateColors(), this.height = this._needDisplayImage ? Ht.brandCircleSize : this._fontSize + 2, this._model.properties().childs().paneProperties.childs().background.subscribe(this, this._updateColors), this._model.onChartThemeLoaded().subscribe(this, this._updateColors))
        }
        _checkFontLoaded() {
            if (!this._showAnimatedBranding && document.fonts && document.fonts.check && document.fonts.load) {
                document.fonts.check(`${this._fontSize}px EuclidCircular`) ? this._font = "px EuclidCircular" : document.fonts.load(`${this._fontSize}px EuclidCircular`, this._txt).then((() => {
                    this._font = "px EuclidCircular", this._recalculateMetrics(), this._requestRepaint()
                }))
            }
        }
        _recalculateMetrics() {
            const e = (0, ft.createDisconnectedBoundCanvas)(document, (0, at.size)({
                    width: 0,
                    height: 0
                })),
                t = (0, ft.getPretransformedContext2D)(e, !0);
            t.font = this._fontSize + this._font;
            const i = this._needDisplayImage ? Xt(this._model.dark().value() ? "dark" : "light", this._colors.logo, (() => this._recalculateMetrics())) : null;
            this._textWidth = i ? i.textImage.width + Ht.textAsImageWidthCompensation : Math.ceil(t.measureText(this._txt).width) + 2 + 8;
            let s = this._textWidth;
            s % 2 == 0 && (s += 1), this._maximizedAnimationTextWidth = s, this._textWidthCache.reset(), this._alwaysMaximized && (this._animatedWidth = this.maximizedAnimationWidth())
        }
        _updateColors() {
            this._colors = this._model.dark().value() ? qt : $t
        }
        _getLogoImage(e) {
            return Xt(this._model.dark().value() ? "dark" : "light", e, this._onLogoImageReady)
        }
        _checkLayout() {
            switch (this._layout) {
                case Mt:
                case At:
                case Lt:
                case Et:
                case Dt:
                case Rt:
                case Bt:
                case It:
                    this.show = !0;
                    break;
                case kt:
                case Vt:
                case Nt:
                    this.show = !1
            }
            switch (this._layout) {
                case Bt:
                    this._needDisplayImage = !0, this._txt = Wt;
                    break;
                case Rt:
                    this._txt = zt
            }
        }
        _drawTextStroke(e) {
            e.save(), e.textBaseline = "middle", e.textAlign = "start", e.font = this._fontSize + this._font, e.strokeStyle = this._colors.staticTextBackground, e.lineWidth = 4, e.lineJoin = "round", e.strokeText(this._txt, 0, Ht.brandCircleSize / 2 + this._textWidthCache.yMidCorrection(e, this._txt)), e.restore()
        }
        _drawTextFill(e) {
            e.save(), e.textBaseline = "middle", e.textAlign = "start", e.font = this._fontSize + this._font, e.fillStyle = this._colors.text, e.fillText(this._txt, 0, Ht.brandCircleSize / 2 + this._textWidthCache.yMidCorrection(e, this._txt)), e.restore()
        }
        _drawImageCropWidth(e, t, i, s) {
            e.save(), e.beginPath(), e.rect(t.x, t.y, s, this.height), e.clip(), e.drawImage(i, t.x, t.y), e.restore()
        }
        _drawBgCircle(e, t) {
            const i = 2 * Math.PI;
            e.save(), e.beginPath(), e.fillStyle = this._colors.shadow, e.arc(t, t, t + 1, 0, i), e.fill(), e.closePath(), e.restore(), e.save(), e.beginPath(), e.fillStyle = this._colors.background, e.arc(t, t, t, 0, i, !1), e.fill(), e.closePath(), e.restore()
        }
        _drawFillRectWithRoundedCorner(e, t, i, s, r, n) {
            e.save(), (0, vt.drawRoundRect)(e, t - 1, i - 1, s + 2, r + 2, n), e.fillStyle = this._colors.shadow, e.fill(), e.closePath(), e.restore(), e.save(), (0, vt.drawRoundRect)(e, t, i, s, r, n), e.fillStyle = this._colors.background, e.fill(), e.closePath(), e.restore()
        }
        _drawLogoImage(e, t, i) {
            e.drawImage(i, t.x, t.y)
        }
    }
    class ei extends Jt {
        constructor(e, t, i) {
            super(), this.show = !1, this.width = 0, this.height = 0, this._ready = !1, this._layout = e, this._src = t, this._onReadyCallback = i, this._checkLayout();
            const s = new Image;
            this._img = s, this.show && (s.addEventListener("load", (() => {
                this.width = Math.round(s.width), this.height = Math.round(s.height), this._ready = !0, this._onReadyCallback && this._onReadyCallback()
            })), s.crossOrigin = "anonymous", s.src = this._src)
        }
        draw(e, t, i) {
            this._topLeftPoint = e, this._ready && (t.translate(e.x, e.y), t.drawImage(this._img, -.5, -.5, this.width, this.height))
        }
        _checkLayout() {
            switch (this._layout) {
                case Lt:
                case kt:
                case Dt:
                case Vt:
                case Rt:
                case Nt:
                    this.show = !0;
                    break;
                case It:
                case Mt:
                case At:
                case Et:
                case Bt:
                    this.show = !1
            }
        }
    }
    var ti = i(97304),
        ii = i(65106);
    class si {
        constructor(e, t) {
            this._headerToolbar = e, this._dropdownId = t
        }
        applyOptions(e) {
            this._headerToolbar.updateDropdown(this._dropdownId, e)
        }
        remove() {
            this._headerToolbar.removeDropdown(this._dropdownId)
        }
    }
    var ri = i(10643);
    var ni = i(65632);
    class oi {
        constructor(e) {
            this._model = e, this._watermarkProperties = (0, ni.watermarkProperty)();
            const t = (0, n.ensureDefined)(this._watermarkProperties.child("color")),
                i = (0, n.ensureDefined)(this._watermarkProperties.child("visibility"));
            this._colorWatchedValue = me(t), this._visibilityWatchedValue = me(i)
        }
        setContentProvider(e) {
            this._model.setWatermarkContentProvider(e), this._model.lightUpdate()
        }
        destroy() {
            this._colorWatchedValue.destroy(), this._visibilityWatchedValue.destroy()
        }
        visibility() {
            return this._visibilityWatchedValue
        }
        color() {
            return this._colorWatchedValue
        }
    }
    var ai = i(75593);
    class li {
        constructor(e) {
            this._symbolModel = e
        }
        getVisible() {
            return this._symbolModel.visible().value()
        }
        setVisible(e) {
            return this._symbolModel.visible().setValue(e), this
        }
        getIcon() {
            return this._symbolModel.icon().value()
        }
        setIcon(e) {
            return this._symbolModel.icon().setValue(e), this
        }
        getColor() {
            return this._symbolModel.color().value()
        }
        setColor(e) {
            return this._symbolModel.color().setValue(e), this
        }
        getTooltip() {
            return this._symbolModel.tooltip().value()
        }
        setTooltip(e) {
            return this._symbolModel.tooltip().setValue(e), this
        }
        getDropDownContent() {
            return this._symbolModel.tooltipContent().value()
        }
        setDropDownContent(e) {
            return this._symbolModel.tooltipContent().setValue(e), this
        }
    }
    class ci {
        symbol(e) {
            return new li(this._model().getSymbolCustomStatus(e))
        }
        hideAll() {
            this._model().hideAll()
        }
        static getInstance() {
            return null === this._instance && (this._instance = new ci), this._instance
        }
        _model() {
            return ai.CustomStatusModel.getInstance()
        }
    }
    ci._instance = null;
    var hi, di = i(39347),
        ui = i(16838);
    (0, M.setClasses)();
    const pi = o(),
        _i = a(),
        mi = new class {
            constructor(e) {
                this._updateDocumentHeight = e => {
                        "visual" === this._viewportType && this._window.document.documentElement.style.setProperty("height", `${e}px`, "important")
                    }, this._window = e,
                    this._fullscreenApi = new Ve(e.document), this._viewportType = Ne.CheckMobile.iOS() && !(0, Re.isOnMobileAppPage)("any") && this._window.visualViewport ? "visual" : "quirks", "visual" === this._viewportType ? this._viewport = (0, n.ensure)(this._window.visualViewport) : this._viewport = this._window;
                const t = this._layoutSizeSensor = this._window.document.createElement("div");
                t.id = "layout-size-sensor", t.style.position = "fixed", t.style.top = "0", t.style.left = "0", t.style.right = "0", t.style.bottom = "0", t.style.pointerEvents = "none", t.style.visibility = "hidden", this._initFullscreen()
            }
            allocate() {
                this.free();
                const e = this._window.document,
                    t = e.createElement("div");
                t.classList.add("js-rootresizer__contents"), t.style.position = "relative", t.style.width = "100%", t.style.height = "100%", e.body.insertAdjacentElement("afterbegin", t), e.body.insertAdjacentElement("afterbegin", this._layoutSizeSensor), this._visibilityApi = new Be(this._window.document);
                const i = {
                    alive: new(O())(!0),
                    fullscreenable: new(O())(!0),
                    container: new(O())(t),
                    width: new(O()),
                    height: new(O()),
                    availWidth: new(O()),
                    availHeight: new(O()),
                    visible: this._visibilityApi.isVisible,
                    fullscreen: this._fullscreenApi.isFullscreen,
                    remove: () => {
                        i.alive.setValue(!1)
                    },
                    attach: () => {
                        i.alive.setValue(!1), this._window.close()
                    },
                    requestFullscreen: () => {
                        this._requestFullscreen()
                    },
                    exitFullscreen: () => {
                        this._exitFullscreen()
                    }
                };
                return i.alive.subscribe((e => {
                    e || i !== this._area || this.free()
                })), this._area = i, this._resizeHandler = () => {
                    const e = this._width(i) || 800,
                        t = this._height(i) || 600;
                    i.availHeight.setValue(t), i.availWidth.setValue(e), i.height.setValue(t), i.width.setValue(e)
                }, this._area.height.subscribe(this._updateDocumentHeight, {
                    callWithLast: !0
                }), this._resizeHandler(), this._viewport.addEventListener("resize", this._resizeHandler), new De.ResizerDetacherState(i).bridge()
            }
            free() {
                if (this._resizeHandler && (this._viewport.removeEventListener("resize", this._resizeHandler), this._resizeHandler = void 0), this._visibilityApi && (this._visibilityApi.destroy(), this._visibilityApi = void 0), this._area) {
                    const e = this._area;
                    this._area = void 0, e.height.unsubscribe(this._updateDocumentHeight), e.alive.setValue(!1);
                    const t = e.container.value(),
                        i = null == t ? void 0 : t.parentElement;
                    i && (i.removeChild(t), i.removeChild(this._layoutSizeSensor))
                }
            }
            _height(e) {
                if ("visual" === this._viewportType) return this._layoutSizeSensor.clientHeight;
                return e.container.value().clientHeight
            }
            _width(e) {
                return e.container.value().clientWidth
            }
            _requestFullscreen() {
                this._fullscreenApi.enter()
            }
            _exitFullscreen() {
                this._fullscreenApi.exit()
            }
            _initFullscreen() {
                this._fullscreenApi.isFullscreen.subscribe((e => {
                    this._resizeHandler && this._resizeHandler()
                }))
            }
        }(window),
        gi = new class {
            constructor(e) {
                this._processVisibility = e => {
                        const t = e.container.value();
                        return this.affectsLayout(e.name) ? (t && t.classList.toggle("js-hidden", !1), !0) : (t && t.classList.toggle("js-hidden", !0), !1)
                    }, this._setWidth = (e, t, i) => {
                        let s = i;
                        this._fullscreenArea !== e.name && (e.availWidth.setValue(i), e.canNegotiate.width && (s = Oe(i, e.negotiations.width))), t || (s = 0);
                        const r = e.container.value();
                        return r && t && (r.style.width = s + "px"), e.width.setValue(s), s
                    },
                    this._setHeight = (e, t, i) => {
                        let s = i;
                        this._fullscreenArea !== e.name && (e.availHeight.setValue(i), e.canNegotiate.height && (s = Oe(i, e.negotiations.height))), t || (s = 0);
                        const r = e.container.value();
                        return r && t && (r.style.height = s + "px"), e.height.setValue(s), s
                    };
                const t = e.container.value();
                if (!t) throw new Error("bridge.container.value() must be an element");
                this._container = t, this._availableAreas = ["left", "tradingpanel", "right", "top", "bottom", "center", "topleft", "extratop"], this._areas = {}, this._bridge = e, this._width = e.width, this._height = e.height, this._width.subscribe((() => this.recalculate())), this._height.subscribe((() => this.recalculate())), this._bridge.visible.subscribe((() => this._updateVisibility())), this._bridge.fullscreen.subscribe((() => this._onParentFullscreenChange())), this.recalculate()
            }
            allocate(e) {
                const t = e && e.areaName;
                if (-1 === this._availableAreas.indexOf(t)) throw new Error("unknown options.areaName");
                this.free(t);
                const i = this._createDOM(t),
                    s = {
                        name: t,
                        canNegotiate: {
                            width: "left" === t || "right" === t || "tradingpanel" === t || "topleft" === t,
                            height: "top" === t || "bottom" === t || "topleft" === t || "extratop" === t
                        },
                        negotiations: {
                            width: [],
                            height: []
                        },
                        remove: () => {
                            for (const e in this._areas) this._areas[e] === s && this.free(e)
                        },
                        negotiateWidth: e => {
                            if (!s.canNegotiate.width) return;
                            const t = Fe(e);
                            We(s.negotiations.width, t) || (s.negotiations.width = t, this.recalculate())
                        },
                        negotiateHeight: e => {
                            if (!s.canNegotiate.height) return;
                            const t = Fe(e);
                            We(s.negotiations.height, t) || (s.negotiations.height = t, this.recalculate())
                        },
                        requestFullscreen: () => {
                            this._fullscreenArea || ("right" !== t && "center" !== t || (this._fullscreenArea = t), "center" === t && this._bridge.requestFullscreen(), this._updateFullscreen())
                        },
                        exitFullscreen: () => {
                            t === this._fullscreenArea && (this._fullscreenArea = void 0, "center" === t && this._bridge.exitFullscreen(), this._updateFullscreen())
                        },
                        width: new(O()),
                        height: new(O()),
                        availWidth: new(O()),
                        availHeight: new(O()),
                        alive: new(O())(!0),
                        container: new(O())(i),
                        visible: new(O())(!0),
                        fullscreen: new(O())(!1),
                        fullscreenable: new(O())("right" === t || "center" === t),
                        rdState: new De.ResizerDetacherState
                    };
                return s.rdState.pushOwner(s), this._areas[t] = s, s.rdState.owner.subscribe((e => {
                    const i = s.container.value();
                    if (e !== s) i && (i.innerHTML = "", i.parentElement && i.parentElement.removeChild(i));
                    else {
                        let e = null;
                        for (let i = this._availableAreas.indexOf(t); i--;) {
                            const t = this._availableAreas[i];
                            if (this.affectsLayout(t)) {
                                e = this._areas[t].container.value();
                                break
                            }
                        }
                        i && (e && i.parentElement ? i.insertAdjacentElement("afterend", e) : this._container.appendChild(i))
                    }
                    this.recalculate()
                }), {
                    callWithLast: !0
                }), s.rdState.bridge()
            }
            free(e) {
                const t = this._areas[e];
                if (!t) return;
                this._areas[e] = void 0;
                const i = t.container.value();
                i && i.parentElement && i.parentElement.removeChild(i), t.alive.setValue(!1)
            }
            recalculate() {
                const e = {};
                this._recalcSingleRunToken = e;
                const t = this._areas.topleft,
                    i = this._areas.left,
                    s = this._areas.tradingpanel,
                    r = this._areas.right,
                    n = this._areas.top,
                    o = this._areas.bottom,
                    a = this._areas.center,
                    l = this._areas.extratop,
                    c = this._width.value(),
                    h = this._height.value();
                let d = 0,
                    u = 0,
                    p = 0,
                    _ = 0,
                    m = 0,
                    g = 0,
                    f = 0,
                    v = 0;
                if (e === this._recalcSingleRunToken && l) {
                    const e = this._processVisibility(l);
                    v = this._setHeight(l, e, h), this._setWidth(l, e, c)
                }
                if (e === this._recalcSingleRunToken && t) {
                    const e = this._processVisibility(t);
                    f = this._setHeight(t, e, h), g = this._setWidth(t, e, c);
                    const i = t.container.value();
                    e && i && (i.style.top = v + "px")
                }
                let S = 0;
                if (e === this._recalcSingleRunToken && n) {
                    const e = this._processVisibility(n),
                        t = n.container.value();
                    e && t && (t.style.left = g + "px", t.style.top = v + "px");
                    const i = c - g;
                    this._setWidth(n, e, i), d = this._setHeight(n, e, h), d && (S = 1)
                }
                if (e === this._recalcSingleRunToken && i) {
                    const e = this._processVisibility(i),
                        t = Math.max(f, d);
                    p = this._setWidth(i, e, c), p && (p += 4), p && 1 === S && (S = 4);
                    const s = i.container.value();
                    e && s && (s.style.top = t + v + S + "px"), this._setHeight(i, e, h - t - v)
                }
                if (e === this._recalcSingleRunToken && s) {
                    const e = this._processVisibility(s);
                    let t = c - p;
                    ze || (t -= 300), m = this._setWidth(s, e, t), m && 1 === S && (S = 4), this._setHeight(s, e, h - v - d - S)
                }
                if (e === this._recalcSingleRunToken && r) {
                    const e = this._processVisibility(r);
                    let t = c - p - m;
                    ze || (t -= 300), _ = this._setWidth(r, e, t), _ && 1 === S && (S = 4), this._setHeight(r, e, h - v - d - S);
                    const i = r.container.value();
                    e && i && (i.style.top = d + v + S + "px", i.classList.toggle("no-border-top-left-radius", Boolean(m)))
                }
                const y = m + _;
                let b = 0;
                const w = c - p - m - _ - (y ? 4 : 0);
                if (e === this._recalcSingleRunToken && o) {
                    const e = this._processVisibility(o),
                        t = o.container.value();
                    e && t && (t.style.left = p + "px", t.classList.toggle("no-border-top-left-radius", !p), t.classList.toggle("no-border-top-right-radius", !y)), this._setWidth(o, e, w);
                    const i = h - v;
                    b = Math.min(300, i - 0), u = this._setHeight(o, e, i) + 4
                }
                const P = Boolean(d && (p || y));
                if (this._container.classList.toggle("layout-with-border-radius", P), e === this._recalcSingleRunToken && a) {
                    const e = this._processVisibility(a),
                        t = a.container.value();
                    e && t && (t.style.left = p + "px", t.style.top = d + v + S + "px", t.classList.toggle("no-border-bottom-left-radius", !u || !p), t.classList.toggle("no-border-bottom-right-radius", !y || !u), t.classList.toggle("no-border-top-left-radius", Boolean(!p && y)), t.classList.toggle("no-border-top-right-radius", Boolean(p && !y))), this._setWidth(a, e, w);
                    const i = h - d - u - v - S;
                    this._setHeight(a, e, Math.max(i, b))
                }
                if (e === this._recalcSingleRunToken && s && this.affectsLayout("tradingpanel")) {
                    const e = s.container.value();
                    e && (e.style.right = _ + "px", e.style.top = v + d + S + "px", e.style.borderTopLeftRadius = P ? "4px" : "0px")
                }
                e === this._recalcSingleRunToken && this._updateVisibility()
            }
            affectsLayout(e) {
                const t = this._areas[e];
                if (!t) return !1;
                if (t.rdState.owner.value() !== t) return !1;
                if (this._fullscreenArea && this._fullscreenArea !== e) return He(e);
                if (this._width.value() <= 567 || this._height.value() <= 445) {
                    if (!["center", "top", "left", "topleft", "extratop"].includes(e)) return !1
                }
                return !0
            }
            _updateVisibility() {
                const e = this._bridge.visible.value();
                for (let t = 0; t < this._availableAreas.length; t++) {
                    const i = this._availableAreas[t],
                        s = this._areas[i];
                    s && (e && this.affectsLayout(i) ? s.visible.setValue(!0) : s.visible.setValue(!1))
                }
            }
            _onParentFullscreenChange() {
                this._bridge.fullscreen.value() || (this._fullscreenArea = void 0, this._updateFullscreen())
            }
            _updateFullscreen() {
                const e = void 0 !== this._fullscreenArea;
                for (let t = 0; t < this._availableAreas.length; t++) {
                    const i = this._availableAreas[t],
                        s = this._areas[i];
                    if (!s) continue;
                    if (i === this._fullscreenArea) {
                        s.fullscreen.setValue(!0);
                        continue
                    }
                    s.fullscreen.setValue(!1);
                    const r = s.container.value();
                    r && r.classList.toggle("js-hidden", e && !He(i))
                }
                this._updateVisibility(), this.recalculate()
            }
            _createDOM(e) {
                const t = document.createElement("div");
                return t.classList.add("layout__area--" + e), t.style.position = "absolute", "tradingpanel" === e && (t.style.overflow = "hidden", t.style.borderTopLeftRadius = "4px"), "bottom" === e ? t.style.bottom = "0" : t.style.top = "0", "right" === e || "tradingpanel" === e ? t.style.right = "0" : t.style.left = "0", t
            }
        }(mi.allocate()),
        fi = (_i.brokerFactory, Boolean(!1)),
        vi = pi.urlParams,
        Si = new AbortController,
        yi = _i.getCustomIndicators,
        bi = (0, ue.createDeferredPromise)(),
        wi = (0, ue.createDeferredPromise)(),
        Pi = h.enabled("left_toolbar"),
        Ci = JSON.parse(vi.widgetbar),
        xi = h.enabled("right_toolbar") && (Ci.watchlist || Ci.details || Ci.news || Ci.datawindow || h.enabled("dom_widget") || h.enabled("order_panel") || h.enabled("show_object_tree") || h.enabled("bugreport_button")),
        Ti = h.enabled("header_widget") ? gi.allocate({
            areaName: "top"
        }) : null,
        Ii = (xi && gi.allocate({
            areaName: "right"
        }), Pi ? gi.allocate({
            areaName: "left"
        }) : null),
        Mi = gi.allocate({
            areaName: "center"
        });
    if (void 0 !== _i.contextMenu) {
        const e = _i.contextMenu;
        void 0 !== e.items_processor && ri.ContextMenuManager.setCustomItemsProcessor(e.items_processor), void 0 !== e.renderer_factory && ri.ContextMenuManager.setCustomRendererFactory(e.renderer_factory)
    }
    if (Promise.all([bi.promise, wi.promise]).then((() => {
            pi.ChartApiInstance.start()
        })), "function" == typeof yi) {
        const e = yi(nt);
        e && e.then ? e.then((e => {
            if (!Array.isArray(e)) return console.warn("custom_indicators_getter should be a function that returns a Promise object which result is an array of custom indicators"), void bi.resolve();
            const t = pi.JSServer;
            t.studyLibrary.push.apply(t.studyLibrary, e), bi.resolve(), console.log("{0} custom indicators loaded.".format(e.length))
        })).catch((e => {
            console.warn("Error loading custom indicators " + e), bi.resolve()
        })) : (console.warn("custom_indicators_getter should be a function that returns a Promise object"), bi.resolve())
    } else bi.resolve();
    pi.widgetReady = e => {
        F.subscribe("onChartReady", e, null)
    };
    const Ai = null === (hi = vi.theme) || void 0 === hi ? void 0 : hi.toLowerCase();

    function Li(e) {
        pi.__defaultsOverrides = pi.__defaultsOverrides || {}, (0, pe.deepExtend)(pi.__defaultsOverrides, e), void 0 !== TradingView.defaultProperties && void 0 !== TradingView.defaultProperties.chartproperties && ((0, c.applyDefaultsOverrides)(TradingView.defaultProperties.chartproperties), (0, c.applyDefaultOverridesToLinetools)())
    }! function(e) {
        if (!e) return;
        A.themes[e] && (0, L.setTheme)(e)
    }(Ai), pi.applyStudiesOverrides = e => {
        var t, i;
        e && (pi.chartWidgetCollection ? null === (i = (t = pi.chartWidgetCollection).applyStudiesOverrides) || void 0 === i || i.call(t, e) : et.StudyMetaInfo.mergeDefaultsOverrides(e))
    }, pi.applyOverrides = e => {
        Li(e), pi.chartWidgetCollection && pi.chartWidgetCollection.applyOverrides(e)
    }, pi.doWhenApiIsReady = e => {
        pi.tradingViewApi ? e() : wi.promise.then(e)
    }, pi.applyTradingCustomization = e => {
        for (const t in e.order) TradingView.defaultProperties.linetoolorder[t] = e.order[t];
        for (const t in e.position) TradingView.defaultProperties.linetoolposition[t] = e.position[t]
    }, pi.changeTheme = (e, t) => {
        const i = A.themes[e.toLowerCase()];
        return i ? pi.tradingViewApi.themes().setStdTheme(i.name, !0, t && t.disableUndo) : Promise.resolve()
    }, pi.getTheme = () => pi.tradingViewApi.themes().getCurrentThemeName(), pi.is_authenticated = !1;
    JSON.parse(pi.urlParams.brokerConfig);
    l.t(null, void 0, i(65911)), l.t(null, void 0, i(68111)), l.t(null, void 0, i(5607));
    let ki = null;
    const Ei = (0, ue.createDeferredPromise)();
    let Di;
    const Vi = () => {
        if (h.setEnabled("charting_library_debug_mode", "true" === vi.debug), h.setEnabled("chart_property_page_trading", !1), h.enabled("remove_library_container_border")) {
            const e = document.querySelector("#library-container");
            null !== e && (e.style.border = "0px", e.style.padding = "1px")
        }
        h.enabled("no_min_chart_width") && (document.body.style.minWidth = "0px"), null != vi.studiesOverrides && et.StudyMetaInfo.mergeDefaultsOverrides(JSON.parse(vi.studiesOverrides)), (0, n.assert)(void 0 === TradingView.defaultProperties, "Default properties are inited before applying overrides"), Li(JSON.parse(vi.overrides));
        const e = vi.numeric_formatting ? JSON.parse(vi.numeric_formatting) : void 0;
        e && "string" == typeof e.decimal_sign && (ce.formatterOptions.decimalSign = e.decimal_sign[0]), pi.ChartApiInstance = new(Qe())(_i.datafeed);
        const t = _i.customFormatters;
        t && (t.timeFormatter && (he.customFormatters.timeFormatter = t.timeFormatter), t.dateFormatter && (he.customFormatters.dateFormatter = t.dateFormatter), t.tickMarkFormatter && (he.customFormatters.tickMarkFormatter = t.tickMarkFormatter), t.priceFormatterFactory && (he.customFormatters.priceFormatterFactory = t.priceFormatterFactory), t.studyFormatterFactory && (he.customFormatters.studyFormatterFactory = t.studyFormatterFactory)), _i.customTimezones && Le.instance().addTimezones(_i.customTimezones), pi.ChartApiInstance.setStudiesAccessController(pi.ChartApiInstance.createStudiesAccessController(vi.studiesAccess));
        const s = vi.chartContent ? JSON.parse(vi.chartContent).json : void 0,
            o = vi.chartContentExtendedData ? JSON.parse(vi.chartContentExtendedData) : s ? s.extendedData : void 0,
            a = vi.interval || "D",
            c = function(e) {
                const t = /(\d+)(\w+)/;
                return e.map((e => {
                    const s = (0, n.ensureNotNull)(t.exec(e.text)),
                        r = s[2].toLowerCase(),
                        o = parseInt(s[1]),
                        a = "y" === r ? 12 * o + "M" : o + r,
                        c = Ee.Interval.parse(e.resolution);
                    return {
                        text: e.title || o + l.t(r, {
                            context: "dates",
                            count: o
                        }, i(673)),
                        description: e.description || "",
                        value: {
                            value: a.toUpperCase(),
                            type: "period-back"
                        },
                        targetResolution: c.value(),
                        requiresIntraday: c.isIntraday()
                    }
                }))
            }(JSON.parse(vi.timeFrames)),
            d = {
                resizerBridge: Mi,
                padding: h.enabled("border_around_the_chart") ? 2 : 0,
                content: s,
                widgetOptions: {
                    addToWatchlistEnabled: !1,
                    hideIdeas: !0,
                    addVolume: (0, n.ensureDefined)(pi.ChartApiInstance.studiesAccessController).isToolEnabled("Volume"),
                    muteSessionErrors: !0,
                    timezone: vi.timezone,
                    defSymbol: vi.symbol,
                    defInterval: a,
                    compareSymbols: vi.compareSymbols && JSON.parse(vi.compareSymbols),
                    defTimeframe: (p = _i.timeframe, p ? "string" == typeof p ? p : {
                        ...p,
                        type: "time-range"
                    } : p),
                    paneContextMenuEnabled: h.enabled("pane_context_menu"),
                    paneContextMenu: {
                        mainSeriesTrade: fi
                    },
                    priceScaleContextMenuEnabled: h.enabled("scales_context_menu"),
                    currencyConversionEnabled: h.enabled("pricescale_currency"),
                    unitConversionEnabled: h.enabled("pricescale_unit"),
                    legendWidgetEnabled: h.enabled("legend_widget"),
                    legendWidget: {
                        contextMenu: {
                            settings: h.enabled("show_chart_property_page"),
                            showOpenMarketStatus: h.enabled("display_market_status")
                        }
                    },
                    sourceStatusesWidget: {
                        errorSolution: !1
                    },
                    marketStatusWidgetEnabled: h.enabled("display_market_status"),
                    chartWarningWidget: {
                        subscriptionFullInfo: !1
                    },
                    timeScaleWidget: {
                        contextMenuEnabled: h.enabled("scales_context_menu"),
                        timezoneMenuEnabled: h.enabled("timezone_menu"),
                        priceAxisLabelsOptions: {
                            showLabels: h.enabled("main_series_scale_menu")
                        }
                    },
                    timeScale: {
                        preserveBarSpacing: !1,
                        lockVisibleTimeRangeOnResize: h.enabled("lock_visible_time_range_on_resize"),
                        rightBarStaysOnScroll: h.enabled("right_bar_stays_on_scroll"),
                        minBarSpacing: vi.time_scale && JSON.parse(vi.time_scale).min_bar_spacing
                    },
                    goToDateEnabled: h.enabled("go_to_date"),
                    crossHair: {
                        menuEnabled: h.enabled("chart_crosshair_menu")
                    },
                    handleScale: {
                        mouseWheel: h.enabled("mouse_wheel_scale"),
                        pinch: h.enabled("pinch_scale"),
                        axisPressedMouseMove: {
                            time: h.enabled("axis_pressed_mouse_move_scale"),
                            price: h.enabled("axis_pressed_mouse_move_scale")
                        }
                    },
                    handleScroll: {
                        mouseWheel: h.enabled("mouse_wheel_scroll"),
                        pressedMouseMove: h.enabled("pressed_mouse_move_scroll"),
                        horzTouchDrag: h.enabled("horz_touch_drag_scroll"),
                        vertTouchDrag: h.enabled("vert_touch_drag_scroll")
                    },
                    shiftVisibleRangeOnNewBar: h.enabled("shift_visible_range_on_new_bar"),
                    croppedTickMarks: h.enabled("cropped_tick_marks"),
                    countdownEnabled: h.enabled("countdown"),
                    indicatorsDialogShortcutEnabled: h.enabled("insert_indicator_dialog_shortcut")
                },
                seriesControlBarEnabled: h.enabled("timeframes_toolbar"),
                seriesControlBar: {
                    timeFramesWidgetEnabled: !0,
                    timeFramesWidget: {
                        goToDateEnabled: h.enabled("go_to_date"),
                        availableTimeFrames: (e, t) => {
                            if (!e) return [];
                            if (t !== rt.STATUS_DELAYED && t !== rt.STATUS_DELAYED_STREAMING && t !== rt.STATUS_EOD && t !== rt.STATUS_READY) return [];
                            return c.filter((t => !(t.requiresIntraday && !e.has_intraday) && !(e.supported_resolutions && !e.supported_resolutions.includes(t.targetResolution))))
                        }
                    },
                    timeWidgetEnabled: !0,
                    timeWidget: {
                        timezoneMenuEnabled: h.enabled("timezone_menu")
                    },
                    adjustForDividendsButtonEnabled: !1,
                    sessionIdButtonEnabled: h.enabled("pre_post_market_sessions"),
                    backAdjustmentButtonEnabled: !1,
                    settlementAsCloseButtonEnabled: !1,
                    percentageScaleButtonEnabled: !0,
                    logScaleButtonEnabled: !0,
                    autoScaleButtonEnabled: !0,
                    fullscreenButtonEnabled: !0,
                    mobileChangeLayoutEnabled: !1
                },
                globalEvents: !0,
                snapshotUrl: vi.snapshotUrl,
                mobileForceChartMaximizeEnabled: !1,
                saveChartEnabled: h.enabled("save_shortcut")
            };
        var p;
        Pi && ((0, Ye.createFavoriteDrawingToolbar)(), d.widgetOptions.isDrawingToolbarVisible = C.isDrawingToolbarVisible), o && (d.metaInfo = {
            id: o.uid,
            name: o.name,
            description: o.description,
            uid: o.uid,
            username: ""
        }), _i.additionalSymbolInfoFields && (0, ti.setAdditionalSymbolInfoFields)(_i.additionalSymbolInfoFields);
        const _ = _i.symbolSearchComplete;
        _ && (0, ii.setSymbolSearchCompleteOverrideFunction)(_);
        const m = pi.chartWidgetCollection = new($e())(d);
        let g = !1;
        m.onAboutToBeDestroyed.subscribe(null, (() => {
                g = !0
            }), !0),
            function(e) {
                e.addCustomSource("branding", ((t, i) => {
                    const s = (0, ot.combine)(((e, t) => {
                        const s = null != e ? e : t;
                        return null !== s && s.hasModel() && s.model().model() === i
                    }), e.maximizedChartWidget(), e.leftBottomChartWidget());
                    return new Ut(t, i, s)
                }))
            }(m), pi.studyMarket = new de(m), Ge.registerService(je.CHART_WIDGET_COLLECTION_SERVICE, m), m.activeChartWidget.subscribe((e => {
                F.emit("activeChartChanged", m.getAll().indexOf(e))
            })), pi.saver = new R.ChartSaver(m);
        const f = new K(m, pi.saver),
            v = new ee(m);
        pi.chartWidget = m.activeChartWidget.value(), pi.pro = new TradingView.Pro;
        const y = function(e) {
            if (!Ti) return null;
            const t = new I.ChartChangesWatcher(e.chartWidgetCollection, pi.saver, F),
                i = JSON.parse(vi.favorites);
            let s, r;
            i.intervals = i.intervals.map((e => {
                let t = "" + e;
                return t.match(/1[DWMYdwmy]/) && (t = t.slice(1)), t
            })), h.enabled("study_templates") && (s = new ae.FavoriteStudyTemplateService(X.TVXWindowEvents, u), Di = new oe({
                chartWidgetCollection: e.chartWidgetCollection,
                favoriteStudyTemplatesService: s
            }));
            const n = vi.header_widget_buttons_mode;
            "fullsize" === n && (r = ["full"]);
            "compact" === n && (r = ["small"]);
            return new P(new S, {
                chartSaver: pi.saver,
                chartApiInstance: pi.ChartApiInstance,
                chartWidgetCollection: e.chartWidgetCollection,
                defaultFavoriteStyles: i.chartTypes,
                defaultFavoriteIntervals: i.intervals,
                resizerBridge: Ti,
                studyMarket: pi.studyMarket,
                studyTemplates: Di,
                favoriteStudyTemplatesService: s,
                allowedModes: r,
                saveChartService: e.saveChartService,
                loadChartService: e.loadChartService,
                chartChangesWatcher: t,
                onClick: Oi,
                snapshotUrl: e.snapshotUrl
            })
        }({
            chartWidgetCollection: m,
            saveChartService: f,
            loadChartService: v,
            snapshotUrl: vi.snapshotUrl
        });
        null !== y ? y.load().then((e => {
            ki = e.getComponent(), Ei.resolve()
        })) : (Ei.promise.catch((() => {})), Ei.reject("header widget is not loaded"));
        const b = function(e) {
                if (Ii) {
                    const t = vi.toolbarbg && /^[0-9a-f]+$/i.test(vi.toolbarbg) ? String(vi.toolbarbg) : void 0;
                    if (t) {
                        const e = document.createElement("style");
                        e.textContent = "body,.chart-controls-bar,#footer-chart-panel{background-color:#" + t + " !important}", document.head.appendChild(e)
                    }
                    return new T({
                        bgColor: t,
                        chartWidgetCollection: e,
                        drawingsAccess: vi.drawingsAccess ? JSON.parse(vi.drawingsAccess) : void 0,
                        resizerBridge: Ii,
                        onClick: Oi
                    })
                }
                return null
            }(m),
            w = null;
        pi.tradingViewApi = new(it())({
            chartWidgetCollection: m,
            chartApiInstance: pi.ChartApiInstance,
            saveChartService: f,
            loadChartService: v,
            studyMarket: null
        });
        if (le.linking.bindToChartWidgetCollection(m), isNaN(vi.studyCountLimit) || (TradingView.STUDY_COUNT_LIMIT = Math.max(2, +(0, n.ensureDefined)(vi.studyCountLimit))), !isNaN(vi.ssreqdelay)) {
            const e = Math.max(0, +(0, n.ensureDefined)(vi.ssreqdelay));
            (0, st.setSearchRequestDelay)(e)
        }
        pi.ChartApiInstance.connect(), (async () => {
            const {
                default: e
            } = await Promise.all([i.e(5652), i.e(2666), i.e(3842), i.e(6), i.e(5993), i.e(5649), i.e(2191), i.e(8056), i.e(3502), i.e(6752), i.e(8149), i.e(6639), i.e(9327), i.e(6106), i.e(9916), i.e(1109), i.e(6831), i.e(8049), i.e(962), i.e(3179), i.e(5050), i.e(1890), i.e(5007), i.e(5899), i.e(2306)]).then(i.t.bind(i, 26916, 23));
            g || (pi.lineToolPropertiesToolbar = new e(m))
        })();
        const x = document.querySelector(".tv-content");
        null !== x && x.addEventListener("contextmenu", (e => {
            e.target instanceof Element && "input" !== e.target.tagName.toLowerCase() && "textarea" !== e.target.tagName.toLowerCase() && e.preventDefault()
        })), wi.resolve(), m.undoHistory.undoStack().onChange().subscribe(null, (0, r.default)((e => {
            e && !e.customFlag("doesnt_affect_save") && F.emit("onAutoSaveNeeded")
        }), 1e3 * (Number(vi.autoSaveDelay) || 5), {
            leading: !1,
            trailing: !0
        }));
        let M = !1;

        function L() {
            b && b.load(Si.signal), w && w.load(Si.signal).then((e => {
                pi.footerWidget = e.getComponent()
            }))
        }
        pi.chartWidget.withModel(null, (() => {
            pi.ChartApiInstance.on("realtime_tick", (e => {
                F.emit("onTick", e)
            }));
            if (!A.savedThemeName() && Ai) {
                const e = A.getStdTheme(Ai);
                e && e.content && void 0 === s && m.applyTheme({
                    theme: e.content,
                    onlyActiveChart: !1,
                    restoreNonThemeDefaults: !1,
                    themeName: Ai,
                    standardTheme: !0,
                    syncState: !0,
                    noUndo: !0
                }).then((() => pi.applyOverrides(pi.__defaultsOverrides)))
            }
            h.enabled("charting_library_debug_mode") && F.subscribeToAll(((...e) => {
                console.log('Event "{0}", arguments: {1}'.format(e[0], JSON.stringify(e.slice(1))))
            })), M || (M = !0, function(e, t = !1) {
                if (!h.enabled("popup_hints")) return;
                const s = e.getContainer();
                let r = null,
                    o = null;

                function a(e, t) {
                    if (r) r.show(e, d.bind(null, t));
                    else {
                        const n = Ke.tool.value();
                        Promise.all([i.e(6214), i.e(962), i.e(6166)]).then(i.bind(i, 5015)).then((i => {
                            r = new i.ChartEventHintRenderer(s), n === Ke.tool.value() && r.show(e, d.bind(null, t))
                        }))
                    }
                }

                function c(e) {
                    return !Boolean(u.getBool(e))
                }

                function d(e) {
                    u.setValue(e, !0, {
                        forceFlush: !0
                    }), (0, n.ensureNotNull)(r).destroy(), null !== o && o(), r = null
                }
                Ke.tool.subscribe((function() {
                    if (!c("hint.touchPainting")) return;
                    const e = Ke.tool.value(),
                        t = (0, Ze.isLineToolDrawWithoutPoints)(e),
                        s = Ne.CheckMobile.any();
                    !(0, Ze.isStudyLineToolName)(e) || "LineToolRegressionTrend" === e || t || s ? (0, Ze.isLineToolName)(e) && !(0, Ze.isLineDrawnWithPressedButton)(e) && !t && s ? a(l.t(null, void 0, i(67861)), "hint.touchPainting") : r && r.hide() : a(l.t(null, void 0, i(32234)), "hint.touchPainting")
                })), Ke.createdLineTool.subscribe(null, (function() {
                    const e = Ke.tool.value();
                    "LineToolPath" === e && c("hint.finishBuildPathByDblClick") ? a(l.t(null, void 0, i(5828)), "hint.finishBuildPathByDblClick") : "LineToolPolyline" === e && c("hint.finishBuildPolylineByDblClick") && a(l.t(null, void 0, i(63898)), "hint.finishBuildPolylineByDblClick")
                })), Ke.finishedLineTool.subscribe(null, (function() {
                    if (r) {
                        const e = Ke.tool.value();
                        "LineToolPath" === e ? d("hint.finishBuildPathByDblClick") : "LineToolPolyline" === e && d("hint.finishBuildPolylineByDblClick")
                    }
                })), e.layoutSizesChanged().subscribe((function() {
                    c("hint.startResizingChartInLayout") && a(l.t(null, void 0, i(35273)), "hint.startResizingChartInLayout")
                })), t || Ne.CheckMobile.any() || !c("hint.startFocusedZoom") || (o = function(e, t) {
                    let i = !1;
                    const s = r => {
                        r ? (i && t(r), e.onZoom().unsubscribe(null, s)) : i || (t(r), i = !0)
                    };
                    return e.onZoom().subscribe(null, s), () => e.onZoom().unsubscribe(null, s)
                }(e, (function(e) {
                    if (c("hint.startFocusedZoom"))
                        if (e) r && (o = null, d("hint.startFocusedZoom"));
                        else {
                            const e = Xe.isMacKeyboard ? "⌘" : "Ctrl";
                            a(l.t(null, void 0, i(35963)).format({
                                key: e
                            }), "hint.startFocusedZoom")
                        }
                })))
            }(m), function(e, t) {
                const s = l.t(null, void 0, i(78104)).format({
                        emoji: "👍"
                    }),
                    r = l.t(null, void 0, i(12011)).format({
                        emoji: "👍"
                    });
                F.on("onServerScreenshotCopiedToClipboard", (() => c(s)), null), F.on("onClientScreenshotCopiedToClipboard", (() => c(r)), null);
                let o = null;
                const a = e.getContainer();

                function c(e) {
                    o ? o.show(e) : Promise.all([i.e(2109), i.e(84), i.e(962), i.e(92)]).then(i.bind(i, 81573)).then((i => {
                        o || (o = new i.ChartScreenshotHintRenderer((0, n.ensureNotNull)(a), {
                            bottomPadding: t.seriesControlBarEnabled
                        }), o.show(e))
                    }))
                }
            }(m, {
                seriesControlBarEnabled: h.enabled("timeframes_toolbar")
            }), pi.tradingViewApi.setWatermarkApi(new oi(pi.chartWidget.model().model())))
        })), m.getAll().some((e => e.isInitialized())) ? L() : function(e, t) {
            const i = e.getAll(),
                s = () => {
                    t(), i.forEach((e => {
                        e.chartWidgetInitialized().unsubscribe(null, s)
                    }))
                };
            i.forEach((e => {
                e.chartWidgetInitialized().subscribe(null, s, !0)
            }))
        }(m, L), F.subscribe("chart_load_requested", (e => {
            pi.tradingViewApi.loadChart({
                json: JSON.parse(e.content),
                extendedData: e
            })
        }), null)
    };
    window.addEventListener("unload", (() => {
        Si.abort(), pi.widgetbar && (pi.widgetbar.destroy(), pi.widgetbar = null), pi.chartWidgetCollection && (pi.chartWidgetCollection.destroy(), pi.chartWidgetCollection = null), pi.ChartApiInstance && pi.ChartApiInstance.disconnect(), (0, Ue.destroyQuoteSessions)(), pi.ChartApiInstance && (pi.ChartApiInstance.destroy(), pi.ChartApiInstance = null)
    })), h.enabled("saveload_storage_customization") && (_i.saveLoadAdapter ? k.setCustomAdapter(_i.saveLoadAdapter) : pi.urlParams.chartsStorageUrl && pi.urlParams.clientId ? k.initialize(pi.urlParams.clientId, pi.urlParams.userId, pi.urlParams.chartsStorageUrl, pi.urlParams.chartsStorageVer || "1.0") : (h.setEnabled("saveload_storage_customization", !1), h.setEnabled("header_saveload", !1)));
    const Bi = (0, ue.createDeferredPromise)();

    function Ri() {
        Bi.resolve()
    }
    _i.loadLastChart && h.enabled("saveload_storage_customization") ? k.getCharts().then((e => {
        if (0 === e.length) return void Ri();
        const t = e.sort(((e, t) => t.modified_iso - e.modified_iso))[0];
        k.getChartContent(t).then((e => {
            const t = e,
                i = JSON.parse(t.content);
            i.extendedData = e, vi.chartContent = JSON.stringify({
                json: i
            }), Ri()
        })).catch(Ri)
    })).catch(Ri) : Ri();
    const Ni = (0, ue.createDeferredPromise)();

    function Oi() {
        const e = TradingView.bottomWidgetBar;
        e && e.turnOffMaximize()
    }
    Promise.all([Ni.promise, Bi.promise, pi.loadedCustomCss]).then((() => {
        const e = document.querySelector(".loading-indicator");
        if (e && (e.style.display = "none"), setTimeout(Vi, 0), h.enabled("14851") && Math.random() <= .02) {
            t = window, i = document, s = "script", r = "ga", t.GoogleAnalyticsObject = r, t.ga = t.ga || function() {
                    (t.ga.q = t.ga.q || []).push(arguments)
                }, t.ga.l = Number(new Date), o = i.createElement(s), a = i.getElementsByTagName(s)[0], o.async = 1, o.src = "//www.google-analytics.com/analytics.js",
                a.parentNode.insertBefore(o, a);
            const e = (0, n.ensureNotNull)(document.URL.match(new RegExp("(:?.*://)([^/]+)/.*")))[2];
            pi.ga("create", "UA-112911840-1", "auto"), pi.ga("set", "anonymizeIp", !0), pi.ga("set", {
                hostname: e,
                page: e,
                referrer: e
            }), pi.ga("send", "pageview")
        }
        var t, i, s, r, o, a
    })), (() => {
        let e = !0;
        _i.datafeed.onReady((t => {
            e && console.warn("`onReady` should return result asynchronously. Use `setTimeout` with 0 interval to execute the callback function."), pi.configurationData = t, Ni.resolve()
        })), e = !1
    })(), pi.createShortcutAction = (() => {
        const e = E.createGroup({
            desc: "API"
        });
        return (t, i) => {
            var s;
            e.add({
                hotkey: (s = t, "number" == typeof s ? s : "string" == typeof s ? B(s.split("+")) : Array.isArray(s) ? B(s) : 0),
                handler: i
            })
        }
    })(), pi.initializationFinished = () => {
        pi.chartWidgetCollection.undoHistory.clearStack()
    }, pi.headerReady = () => Ei.promise, pi.createButton = e => {
        if (null === ki) throw new Error("Cannot create button: header widget is not ready or is not loaded - use `headerReady` to wait until header is ready");
        return (e = e || {}).align = e.align || "left", e.useTradingViewStyle = e.useTradingViewStyle || !1, ki.addButton((0, _e.randomHash)(), e)
    }, pi.createDropdown = e => {
        if (void 0 === e) throw new Error("Cannot create dropdown without any parameters. Please refer to the documentation");
        void 0 === e.align && (e.align = "left");
        const t = (0, _e.randomHash)();
        return ki ? (ki.addDropdown(t, e), Promise.resolve(new si(ki, t))) : Ei.promise.then((() => ((0, n.ensureNotNull)(ki).addDropdown(t, e), new si((0, n.ensureNotNull)(ki), t))))
    }, pi.getAllFeatures = () => {
        const e = h.getAllFeatures();
        return Object.keys(e).forEach((t => {
            isNaN(parseFloat(t)) || delete e[t]
        })), e
    }, pi.getNavigationButtonsVisibility = (0, s.default)((() => me((0, ge.property)()))), pi.getPaneButtonsVisibility = (0, s.default)((() => me((0, fe.property)()))), pi.getDateFormat = (0, s.default)((() => me(ve.dateFormatProperty))), pi.getTimeHoursFormat = (0, s.default)((() => me(Se.timeHoursFormatProperty))), pi.getCurrencyAndUnitVisibility = (0, s.default)((() => me((0, ke.currencyUnitVisibilityProperty)()))), pi.customSymbolStatus = () => ci.getInstance(), new di.Action({
        actionId: "TVActionId",
        onExecute: () => {
            window.dispatchEvent(new CustomEvent("keyboard-navigation-activation", {
                bubbles: !0
            }));
            const [e] = Array.from(document.querySelectorAll('button:not([disabled], [aria-disabled], [tabindex="-1"]), input:not([disabled], [aria-disabled], [tabindex="-1"]), [tabindex]:not([disabled], [aria-disabled], [tabindex="-1"])')).filter((0, ui.createScopedVisibleElementFilter)(document.documentElement)).sort(ui.navigationOrderComparator);
            void 0 !== e && e.focus()
        },
        hotkeyHash: E.Modifiers.Alt + 90,
        hotkeyGroup: (0, E.createGroup)({
            desc: "Global shortcuts"
        }),
        disabled: !ui.PLATFORM_ACCESSIBILITY_ENABLED
    })
}