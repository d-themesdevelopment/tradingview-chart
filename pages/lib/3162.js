    "use strict";
    var s = i(57898),
        r = i(50151).assert,
        n = i(51608).createDeferredPromise,
        o = i(36298).TranslatedString,
        a = i(75531).layouts,
        l = i(18687).createUndoHistory,
        c = i(88348),
        h = i(4741),
        d = i(68335),
        u = i(76422),
        p = i(14483),
        _ = i(58275),
        m = i(59224).getLogger("Chart.ChartWidgetCollection"),
        g = i(21861).preventDefaultForContextMenu,
        f = i(88732),
        v = i(13323).GeneralChartPropertiesRenderer,
        S = i(42120).CompareDialogRenderer,
        y = i(84015).isOnMobileAppPage,
        b = i(41249),
        w = i(42960);
    const {
        isSupportedLayout: P,
        tryGuessingTheMostSuitableLayout: C
    } = i(75531);
    var x, T = i(55148),
        I = T.applyIndicatorsToAllChartsImpl,
        M = T.applyIndicatorToAllChartsImpl,
        A = T.lineToolsAndGroupsDTOsImpl,
        L = T.getStateForChartImpl,
        k = T.resetLineToolsInvalidatedImpl,
        E = T.applyLineToolUpdateNotificationImpl,
        D = T.createClipboardHandler,
        V = T.chartsSymbolsImpl,
        B = T.updateLayoutImpl,
        R = T.computeContentBoxImpl,
        N = (T.getVisuallyAdjacentDefImpl, T.setLayoutImpl),
        O = T.removeChartWidgetSubscriptionsImpl,
        F = T.generateNewChartId,
        W = T.syncCrosshairImpl,
        z = T.createBroadcastChannel,
        H = T.destroyBroadcastChannel,
        U = T.syncScrollImpl,
        j = T.allInitialModelsCreated,
        G = T.allInitialSymbolsResolved,
        q = T.applyThemeImpl,
        $ = T.isFirstChartInLayout,
        Y = T.deserializedChartIds,
        K = T.handleDateRangeLockChange,
        Z = T.handleInternalDateRangeLockChange,
        X = T.handleTrackTimeLockChange,
        J = T.handleInternalTrackTimeLockChange,
        Q = T.handleIntervalLockChange,
        ee = T.handleInternalIntervalLockChange,
        te = T.handleSymbolLockChange,
        ie = T.handleInternalSymbolLockChange,
        se = (T.handleConnectionLimitReachedChanged, T.createLeftBottomChartWidgetWV),
        re = {
            saveChartEnabled: !0,
            takeScreenshotEnabled: !0,
            publishedChartsEnabled: !0
        },
        ne = new o("change series style", i(44352).t(null, void 0, i(53438)));
    i(44352).t(null, void 0, i(19149));
    e.exports = function(e) {
        var t = this,
            o = Object.assign({}, re, e),
            oe = new _,
            ae = o.readOnly || !1,
            le = [],
            ce = 0,
            he = new _,
            de = new _,
            ue = new _,
            pe = "s",
            _e = new _(null),
            me = new Map,
            ge = new _([]),
            fe = new _,
            ve = [];
        const Se = {
            isConfirmationAboutReplayLocked: !1,
            loadingChart: !1,
            setTimeFrameActive: !1,
            setNewResolution: !1
        };
        var ye = !1,
            be = !1,
            we = new _(!1),
            Pe = new _(null),
            Ce = new _(!1),
            xe = new _(!1);
        xe.subscribe((e => te(ut(), e)));
        var Te = new _(xe.value());
        Te.subscribe((e => ie(ut(), e)));
        var Ie = new _(!1);
        Ie.subscribe((e => Q(ut(), e)));
        var Me = new _(Ie.value());
        Me.subscribe((e => ee(ut(), e)));
        var Ae = new _(!1);
        Ae.subscribe((e => X(ut(), e)));
        var Le = new _(Ae.value());
        Le.subscribe((e => J(ut(), e)));
        var ke = new _(!1);
        ke.subscribe((e => K(ut(), e))), _e.subscribe(Wt);
        var Ee = new _(ke.value());
        Ee.subscribe((e => Z(ut(), e)));
        var De = new _(TVSettings.getBool("chart.syncCrosshair", !0)),
            Ve = h.createGroup({
                desc: "Layout"
            }),
            Be = null,
            Re = null,
            Ne = null,
            Oe = null;
        if (window.TVD) {
            var Fe = window.TVD.crosshairSyncEnabled;
            Fe ? (Fe.value() && (Ne = z(ut)), Oe = Fe.subscribe((e => {
                e ? Ne = z(ut) : (H(ut()), Ne = null)
            }))) : Ne = z(ut)
        }
        var We = De.value();
        De.subscribe((function(e) {
            We = e = !!e, TVSettings.setValue("chart.syncCrosshair", e);
            for (var t = 0; t < le.length; ++t) {
                var i = le[t].chartWidget;
                i.hasModel() && i.model().model().lightUpdate()
            }
        }));
        var ze = new _(pe),
            He = o.resizerBridge.width,
            Ue = o.resizerBridge.height,
            je = new _(null),
            Ge = new _(null);
        je.subscribe((e => {
            Ge.setValue(null === e ? null : e.chartWidget)
        }));
        var qe = o.widgetOptions || {},
            $e = o.metaInfo || {},
            Ye = {
                id: new _($e.id || null),
                name: new _($e.name),
                description: new _($e.description),
                username: new _($e.username),
                uid: new _($e.uid),
                lastModified: new _($e.lastModified)
            },
            Ke = l();
        Ke.onChange().subscribe(null, (function(e) {
            u.emit("undo_redo_state_changed", e)
        }));
        var Ze = o.resizerBridge.container.value();
        Ze.addEventListener("contextmenu", g);
        var Xe, Je = n(),
            Qe = new s,
            et = new s,
            tt = new s,
            it = new _(!1),
            st = new _(null),
            rt = null,
            nt = null;
        o.seriesControlBarEnabled && (Xe = "0px", st.setValue(document.createElement("div")), st.value().style.left = Xe, st.value().style.right = Xe, st.value().style.bottom = Xe, st.value().classList.add("chart-toolbar", "chart-controls-bar"), st.value().setAttribute("data-is-chart-toolbar-component", "true"), Ze.appendChild(st.value()), Promise.all([i.e(2666), i.e(3842), i.e(5145), i.e(6), i.e(5993), i.e(5649), i.e(8056), i.e(6639), i.e(6036), i.e(6106), i.e(9916), i.e(1033), i.e(4987), i.e(962), i.e(3179), i.e(5050), i.e(3291), i.e(7260)]).then(i.bind(i, 92861)).then((({
            BottomToolbarRenderer: e
        }) => {
            var i = o.resizerBridge,
                r = [i.container.spawn(), i.width.spawn(), i.height.spawn()],
                n = i.container.value(),
                a = function() {
                    var e = n.getBoundingClientRect(),
                        t = R(ut());
                    return t.top = e.top + t.top, t.left = e.left + t.left, t
                },
                l = new s,
                c = function() {
                    l.fire()
                };
            r.forEach((function(e) {
                e.subscribe(c)
            }));
            var h = function() {
                r.forEach((function(e) {
                    e.destroy()
                })), l.destroy()
            };
            rt = new e(st.value(), l, a, t, ChartApiInstance, qe, o.seriesControlBar), nt = function() {
                null !== rt && (rt.destroy(), rt = null, st.value().remove(), st.setValue(null)), h()
            }
        })));
        var ot = new v(t),
            at = new S(t);

        function lt() {
            it.setValue(le.some((e => {
                const t = e.chartWidget.lineToolsSynchronizer();
                return null !== t && t.hasChanges().value()
            })))
        }

        function ct(e) {
            return T.checkProFeatureImpl(ut(), e)
        }
        Pe.subscribe((() => ft()));
        const ht = new Map,
            dt = () => T.updateLinkingGroupCharts(ut());

        function ut() {
            return {
                undoHistory: Ke,
                chartWidgetsDefs: le,
                chartsCountToSave: pt,
                actualLayoutCount: _t,
                savedChartWidgetOptions: ve,
                activeChartWidget: oe,
                options: o,
                parent: Ze,
                toastsFactory: null,
                crosshairLockRaw: We,
                crossHairSyncBroadcast: Ne,
                setChartStorageNotificationSubscription: e => {
                    Re = e
                },
                maximizedChartDef: je,
                setMaximized: wt,
                layoutTemplate: ue,
                widthWV: He,
                heightWV: Ue,
                checkProFeature: ct,
                lineToolsSynchronizerHasChanges: it,
                recalcHasChanges: lt,
                onZoom: et,
                onScroll: tt,
                layoutType: pe,
                layoutWV: ze,
                setLayoutType: e => {
                    pe = e
                },
                isPhoneSize: we,
                viewMode: fe,
                updateViewMode: Ct,
                loadingContent: ye,
                setLoadingContent: e => {
                    ye = e
                },
                initialLoading: be,
                inlineChartsCount: de,
                updateWatchedValue: xt,
                checkAllPendingModelsAlreadyCreated: Pt,
                readOnly: ae,
                symbolLock: xe,
                internalSymbolLock: Te,
                intervalLock: Ie,
                internalIntervalLock: Me,
                dateRangeLock: ke,
                internalDateRangeLock: Ee,
                trackTimeLock: Ae,
                internalTrackTimeLock: Le,
                crosshairLock: De,
                customLegendWidgetsFactoriesMap: Jt,
                globalDetachable: he,
                saveChartService: Be,
                customSources: Zt,
                updateActivityView: Tt,
                chartWidgetCreatedDelegate: Qe,
                sizingState: Pe,
                currentLayoutResizeAction: _e,
                allLayoutSizesState: me,
                splitters: ge,
                widgetOptions: qe,
                bottomToolbar: st,
                replayContainer: Xt,
                layoutSizesChanged: Ce,
                subscribeToCompletedEventForDateRangeSync: Nt,
                subscribeToEventsForDateRangeSync: Ot,
                unsubscribeFromEventsForDateRangeSync: Ft,
                syncChartsDateRangesWithActiveChartRange: Ht,
                flags: Se,
                linkingGroupsCharts: ht,
                updateLinkingGroupCharts: dt
            }
        }

        function pt() {
            return _t()
        }

        function _t() {
            return a[pe].count
        }

        function mt(e, t, i, s, r) {
            return L(ut(), e, t, i, s, r)
        }

        function gt(e) {
            return e.value() ? 1 : 0
        }

        function ft() {
            B(ut())
        }
        He.subscribe(ft), Ue.subscribe(ft), this.updateLayout = ft;
        const vt = T.activeLinkingGroupWV(oe),
            St = T.allLinkingGroupsWV(ut());

        function yt(e) {
            return e.rdState.owner.value() !== e
        }

        function bt(e) {
            return N(ut(), e, t)
        }

        function wt(e) {
            je.value() !== e && (je.setValue(e), bt(pe))
        }

        function Pt() {
            le.every((e => e.chartWidget.hasModel())) && (xt(), u.emit("layout_changed"))
        }

        function Ct() {
            "s" === pe || je.value() ? fe.setValue(x.ForceFullscreen) : fe.setValue(x.Multichart)
        }

        function xt() {
            var e = Math.min(ue.value().count, le.length) - 1;
            if (e < 0) oe.deleteValue();
            else {
                var t = ce;
                t < 0 && (t = 0), t > e && (t = e), oe.setValue(le[t].chartWidget)
            }
        }

        function Tt() {
            for (var e = le.length; e--;) {
                var t = e === ce;
                le[e].container.value().classList.toggle("active", t), le[e].container.value().classList.toggle("inactive", !t)
            }
        }

        function It(e) {}
        const Mt = new s;
        var At = new s,
            Lt = new _,
            kt = new _([]),
            Et = null;

        function Dt(e) {
            var t = e.mainSeries().properties();
            t.style.subscribe(null, Vt), Vt(t.style), e.model().onSelectedSourceChanged().subscribe(null, Bt), ke.value() && (Ot(e), Ht()), Bt(e.selection().allSources())
        }

        function Vt(e) {
            Lt.setValue(e.value())
        }

        function Bt() {
            var e = Et.model();
            kt.setValue(e.selection().allSources())
        }
        oe.subscribe((function(e) {
            if (e) {
                for (var t, i = le.length; i--;)
                    if (le[i].chartWidget === e) {
                        t = i;
                        break
                    } if (!isFinite(t)) throw new Error("Cannot make detached ChartWidget active");
                if (ce !== t) {
                    je.value() && (yt(le[t]) || je.setValue(le[t])), ce = t, Tt();
                    for (i = le.length; i--;) le[i].chartWidget !== e && le[i].chartWidget.setActive(!1);
                    li(), e.setActive(!0), c.activePointSelectionMode.setValue(e.selectPointMode().value())
                }! function(e) {
                    if (Et !== e) {
                        if (Et && (Et.modelCreated().unsubscribe(null, Dt), Et.hasModel())) {
                            var t = Et.model();
                            ke.value() && Ft(t), t.mainSeries().properties().style.unsubscribe(null, Vt), t.model().onSelectedSourceChanged().unsubscribe(null, Bt), Et = null
                        }
                        e && (Et = e, e.hasModel() ? Dt(e.model()) : e.modelCreated().subscribe(null, Dt))
                    }
                }(e)
            }
        }), {
            callWithLast: !0
        });
        var Rt = new Map;

        function Nt(e, t) {
            var i = e.id();
            if (!Rt.has(i)) {
                var s = function() {
                    const i = e.id();
                    Rt.has(i) && (Rt.delete(i), Ht(t ? e : void 0))
                };
                e.model().mainSeries().dataEvents().completed().subscribe(null, s, !0), Rt.set(i, {
                    cw: e,
                    callback: s
                })
            }
        }

        function Ot(e) {
            e.timeScale().visibleBarsStrictRangeChanged().subscribe(null, zt)
        }

        function Ft(e) {
            e.timeScale().visibleBarsStrictRangeChanged().unsubscribe(null, zt), Rt.forEach((function(e) {
                var t = e.cw,
                    i = e.callback;
                t.model().mainSeries().dataEvents().completed().unsubscribe(null, i)
            })), Rt.clear()
        }

        function Wt(e) {
            ke.value() && null === e && Ht()
        }

        function zt(e, t) {
            Ht()
        }

        function Ht(e) {
            if (ke.value() && null === _e.value()) {
                var t = oe.value(),
                    i = t.model().mainSeries();
                if (w.isTimeBasedStyle(i.style())) {
                    var s = t.model().timeScale(),
                        r = s.visibleBarsStrictRange();
                    if (null !== r) {
                        var n = s.points().range().value(),
                            o = s.indexToTimePoint(r.firstBar());
                        null === o && i.endOfData() && (o = s.indexToTimePoint(n.firstIndex));
                        var a = s.indexToTimePoint(r.lastBar());
                        if (null === a && (a = s.indexToTimePoint(n.lastIndex)), null !== o && null !== a) {
                            Rt.delete(t.id());
                            var l = 1e3 * o,
                                c = 1e3 * a;
                            if (i.isDWM()) {
                                var h = new Date(l),
                                    d = new Date(c);
                                b.set_hms(h, 0, 0, 0, 0), b.set_hms(d, 0, 0, 0, 0), l = h.getTime(), c = d.getTime()
                            }
                            for (var u = 0; u < le.length; u++) {
                                var p = le[u].chartWidget;
                                p.hasModel() && p !== t && (void 0 === e || p === e) && w.isTimeBasedStyle(p.model().mainSeries().style()) && setTimeout(Ut.bind(null, p, l, c))
                            }
                        } else Nt(t, !1)
                    }
                }
            }
        }

        function Ut(e, t, i) {
            e.model().model().gotoTimeRange(t, i)
        }
        var jt = new s;

        function Gt() {
            o.resizerBridge.requestFullscreen()
        }

        function qt() {
            o.resizerBridge.exitFullscreen()
        }

        function $t() {
            return o.resizerBridge.fullscreenable
        }

        function Yt() {
            return o.resizerBridge.fullscreen
        }

        function Kt(e) {
            if (0 !== le.length) {
                for (var t = le.length; t--;) le[t].chartWidget.setActive(!1);
                le[ce].chartWidget.setActive(e)
            }
        }
        ae || (Ve.add({
            desc: "Switch active chart",
            hotkey: 9,
            handler: function() {}
        }), Ve.add({
            desc: "Switch active chart",
            hotkey: d.Modifiers.Shift + 9,
            handler: function() {}
        })), Ve.add({
            desc: "Fullscreen mode",
            hotkey: d.Modifiers.Shift + 70,
            isDisabled: p.enabled("widget") || !$t().value(),
            handler: function() {
                Yt().value() ? qt() : Gt()
            }
        }), o.takeScreenshotEnabled && (Ve.add({
            desc: "Screenshot server",
            hotkey: d.Modifiers.Alt + 83,
            handler: T.takeServerScreenshot.bind(this, o.snapshotUrl, t)
        }), y("any") || (Ve.add({
            desc: "Download client screenshot",
            hotkey: d.Modifiers.Mod + d.Modifiers.Alt + 83,
            handler: T.downloadScreenshot.bind(this, t)
        }), Ve.add({
            desc: "Copy client screenshot",
            hotkey: d.Modifiers.Mod + d.Modifiers.Shift + 83,
            handler: T.copyScreenshotToClipboard.bind(this, t)
        }))), o.saveChartEnabled && Ve.add({
            desc: "Save Chart Layout",
            hotkey: d.Modifiers.Mod + 83,
            handler: function() {
                At.fire()
            }
        });
        var Zt = new Map,
            Xt = null,
            Jt = new Map;
        const Qt = D(ut());
        o.globalEvents && Qt.listen();
        const ei = xe.spawn(),
            ti = Ie.spawn(),
            ii = ke.spawn(),
            si = Ae.spawn(),
            ri = De.spawn(),
            ni = () => le.map((e => e.chartWidget)),
            oi = se(ni, ze.readonly(), Mt, Qe);

        function ai(e, t) {
            if (ye = !0, be = Boolean(t), ve.splice(0), e) {
                if (e.charts || (e = {
                        layout: "s",
                        charts: [e]
                    }), e.layoutsSizes)
                    for (const t of Object.keys(e.layoutsSizes)) me.set(t, e.layoutsSizes[t]);
                var i = new Set;
                e.charts.forEach((function(e) {
                    e.chartId && i.add(e.chartId)
                })), e.charts.forEach((function(e) {
                    if (!e.chartId) {
                        var t = F((function(e) {
                            return i.has(e)
                        }));
                        i.add(t), e.chartId = t
                    }
                }));
                let t = e.layout;
                if (!P(t)) {
                    const e = C(t);
                    m.logError(`Loading unsupported layout ${t}. Force migration to ${e}`), t = e
                }
                pe = ct(t || "s");
                for (var s = 0; s < e.charts.length; s++) {
                    var r = e.charts[s];
                    ve.push({
                        content: r
                    })
                }
                void 0 !== e.symbolLock && xe.setValue(Boolean(e.symbolLock)), void 0 !== e.intervalLock && Ie.setValue(Boolean(e.intervalLock)),
                    void 0 !== e.trackTimeLock && Ae.setValue(Boolean(e.trackTimeLock)), void 0 !== e.dateRangeLock && ke.setValue(Boolean(e.dateRangeLock)), void 0 !== e.crosshairLock && De.setValue(Boolean(e.crosshairLock))
            }
            bt(pe), c.init(), c.tool.subscribe(ci), c.tool.subscribe(li), ye = !1, be = !1
        }

        function li() {
            var e = oe.value();
            le.forEach((function(t) {
                t.chartWidget !== e && t.chartWidget.updateCrossHairPositionIfNeeded()
            })), e && e.updateCrossHairPositionIfNeeded()
        }

        function ci() {
            le.forEach((function(e) {
                e.chartWidget.onToolChanged()
            }))
        }
        Object.assign(this, {
            getAll: ni,
            maximizedChartWidget: () => Ge.readonly(),
            leftBottomChartWidget: () => oi,
            activeLinkingGroup: () => vt,
            allLinkingGroups: () => St,
            linkingGroupsCharts: e => T.getLinkingGroupCharts(ut(), e).readonly(),
            destroy: function() {
                if (jt.fire(), Kt(!1), null !== nt && (nt(), nt = null), O(ut()), ei.destroy(), ti.destroy(), si.destroy(), ii.destroy(), ri.destroy(), _e.unsubscribe(Wt), le.forEach((function(e) {
                        void 0 !== e.timingsMeter && e.timingsMeter.destroy(), e.chartWidget.linkingGroupIndex().unsubscribe(dt), e.chartWidget.destroy()
                    })), o.resizerBridge.remove(), ge.value().forEach((e => {
                        e.mouseHandler.destroy(), e.mouseListener.destroy()
                    })), window.removeEventListener("resize", ft), c.tool.unsubscribe(li), c.tool.unsubscribe(ci), Je.resolve(), Ze.remove(), Zt.clear(), Jt.clear(), Ve.destroy(), Re && Re.destroy(), Qt && Qt.destroy(), vt.destroy(), St.destroy(), window.TVD) {
                    const e = window.TVD.crosshairSyncEnabled;
                    e && e.unsubscribe(Oe), H(ut())
                }
            },
            onAboutToBeDestroyed: jt,
            layout: ze.readonly(),
            setLayout: bt,
            activeChartWidget: oe,
            viewMode: fe,
            activeChartStyle: Lt.readonly(),
            setChartStyleToWidget: function(e, t) {
                t || (t = oe.value()), t && function(e, t) {
                    var i = e.model(),
                        s = i.mainSeries().properties().style;
                    i.setChartStyleProperty(s, t, ne)
                }(t, e)
            },
            selectedSources: kt.readonly(),
            metaInfo: Ye,
            state: function(e, i, s, r) {
                for (var n = [], o = pt(), a = 0; a < o; a++) {
                    var l = mt(a, e, i, s, r);
                    l && n.push(l)
                }
                var c = {
                    name: t.metaInfo.name.value(),
                    layout: pe,
                    charts: n
                };
                return c.symbolLock = gt(xe), c.intervalLock = gt(Ie), c.trackTimeLock = gt(Ae), c.dateRangeLock = gt(ke), c.crosshairLock = gt(De), c.layoutsSizes = {}, me.forEach(((e, t) => {
                    c.layoutsSizes[t] = e
                })), c
            },
            lineToolsAndGroupsDTOs: function() {
                return A(ut())
            },
            resetLineToolsInvalidated: function(e, t) {
                return k(ut(), e, t)
            },
            applyLineToolUpdateNotification: E.bind(null, le),
            readOnly: function() {
                return ae
            },
            onZoom: function() {
                return et
            },
            onScroll: function() {
                return tt
            },
            resizerBridge: function() {
                return o.resizerBridge
            },
            lock: {
                symbol: ei,
                interval: ti,
                dateRange: ii,
                crosshair: ri,
                trackTime: si
            },
            setSymbol: (e, t) => T.setSymbol(ut(), e, t),
            setSymbolAll: (e, t) => T.setSymbolAll(ut(), e, t),
            setResolution: (e, t) => T.setResolution(ut(), e, t),
            setTimeFrame: function(e) {
                Se.loadingChart || Se.setTimeFrameActive || (Se.setTimeFrameActive = !0, Ie.value() ? le.forEach((function(t) {
                    t.chartWidget.loadRange(e)
                })) : oe.value().loadRange(e), Se.setTimeFrameActive = !1)
            },
            updateLayout: ft,
            setChartLayoutWithUndo: function(e) {
                return T.setChartLayoutWithUndoImpl(ut(), this, e)
            },
            images: T.getSnapshot.bind(this, this, o.widgetOptions.customerReadableName, qe.onWidget),
            clientSnapshot: T.getClientSnapshot.bind(this, this, o.widgetOptions.customerReadableName, qe.onWidget),
            tags: function() {
                for (var e = [], t = 0; t < le.length && t < ue.value().count; t++) e = e.concat(le[t].chartWidget.tags());
                return e = (e = Array.from(new Set(e))).map((function(e) {
                    return e.toLowerCase().replace(/\W+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
                }))
            },
            syncCrosshair: (e, t, i, s) => W(ut(), e, t, i, s),
            syncScroll: function(e, t) {
                return U(ut(), e, t)
            },
            clearChartMetaInfo: function() {
                Ye.id.setValue(null), Ye.uid.setValue(void 0), Ye.name.setValue(void 0)
            },
            takeScreenshot: T.takeScreenshot.bind(this, o.snapshotUrl, this),
            takeServerScreenshot: T.takeServerScreenshot.bind(this, o.snapshotUrl, this),
            loadContent: ai,
            purgeUnusedWidgets: function() {
                for (var e = a[pe].count; e < le.length; e++) le[e].chartWidget.destroy();
                le.splice(a[pe].count)
            },
            applyOverrides: function(e) {
                for (var t = 0; t < le.length; t++) le[t].chartWidget.applyOverrides(e)
            },
            applyStudiesOverrides: function(e) {
                for (var t = 0; t < le.length; t++) le[t].chartWidget.applyStudiesOverrides(e)
            },
            switchChart: It,
            startFullscreen: Gt,
            exitFullscreen: qt,
            fullscreen: Yt,
            fullscreenable: $t,
            destroyPromise: function() {
                return Je.promise()
            },
            chartWidgetCreated: function() {
                return Qe
            },
            saveKeysPressed: function() {
                return At
            },
            getContainer: function() {
                return Ze
            },
            onWidget: qe.onWidget,
            applyTheme: function(e) {
                return q(ut(), t, e)
            },
            applyIndicatorsToAllCharts: function(e) {
                I(ut(), e)
            },
            applyIndicatorsToAllChartsAvailable: function() {
                return !ae && _t() > 1
            },
            applyIndicatorToAllCharts: function(e, t, i, s) {
                M(ut(), e, t, i, s)
            },
            setActive: Kt,
            inlineChartsCount: de.readonly(),
            revertToInline: function() {
                wt(null);
                for (var e = 0; e < le.length; e++) le[e].rdState.bridge().attach()
            },
            chartMarketStatuses: function() {
                return le.map((function(e) {
                    return "-"
                }))
            },
            chartSeriesStatuses: function() {
                return le.map((function(e) {
                    var t = e.chartWidget.hasModel() ? e.chartWidget.model().mainSeries().status() : null;
                    return (null === t ? "" : f.SERIES_STATUS_TEXT[t]) + " (" + t + ")"
                }))
            },
            undoHistory: Ke,
            lineToolsSynchronizerHasChanges: it,
            applyPreferencesToAllCharts: function(e) {},
            getToasts: function() {
                return Promise.resolve(null)
            },
            addCustomSource: function(e, t, i) {
                r(!Zt.has(e), "Cannot create the same custom source multiple times"), Zt.set(e, {
                    factory: t,
                    layer: i
                });
                for (var s = 0; s < le.length; ++s) {
                    var n = le[s].chartWidget;
                    n.hasModel() && n.model().model().addCustomSource(e, t, i)
                }
            },
            removeCustomSource: function(e) {
                r(Zt.has(e), "Cannot remove not created custom source"), Zt.delete(e);
                for (var t = 0; t < le.length; ++t) {
                    var i = le[t].chartWidget;
                    i.hasModel() && i.model().model().removeCustomSource(e)
                }
            },
            addCustomWidgetToLegend: function(e, t) {
                r(!Jt.has(e), "Cannot create the same custom widget in legend multiple times"), Jt.set(e, t);
                for (var i = 0; i < le.length; ++i) le[i].chartWidget.addCustomWidgetToLegend(e, t)
            },
            addReplayWidget: function(e) {
                r(null === Xt, "Cannot create replay container multiple times"), (Xt = document.createElement("div")).style.position = "absolute", Xt.style["min-height"] = "51px", Xt.style.overflow = "hidden", Xt.style.left = "0px", Xt.style.right = "0px";
                var t = null === st.value() ? 0 : st.value().offsetHeight;
                Xt.style.bottom = `${t}px`, Xt.setAttribute("data-is-chart-toolbar-component", "true"), Ze.prepend(Xt), e(Xt, (() => ft())), ft()
            },
            destroyReplayWidget: function() {
                r(null !== Xt, "Cannot remove replay container, container is not created"), Xt.remove(), Xt = null, ft()
            },
            setViewMode: function(e) {
                fe.setValue(e)
            },
            moveActiveChartWithUndo: function(e) {},
            activeChartCanBeMoved: function() {
                return !1
            },
            generalPropertiesDefinitions: function() {
                return oe.value().generalPropertiesDefinitions()
            },
            reconnectChartApi: function(e) {
                undefined(e)
            },
            setBroker: function(e) {
                0
            },
            setSaveChartService: function(e) {
                Be = e;
                for (var t = 0; t < le.length; ++t) {
                    le[t].chartWidget.setSaveChartService(e)
                }
            },
            getCompareDialogRenderer: function() {
                return at
            },
            getChartPropertiesDialogRenderer: function() {
                return ot
            },
            clipboard: Qt,
            chartsSymbols: function() {
                return V(ut())
            },
            isFirstChartInLayout: $.bind(null, ut()),
            deserializedChartIds: Y.bind(null, ut()),
            layoutSizesChanged: () => Ce
        }), ai(o.content, !0), ze.subscribe((function() {
            Tt()
        })), ze.hook = function(e) {
            return e === this.value() ? e : ct(e)
        }, ae && (ze.writeLock = !0), window.addEventListener("resize", ft);
        var hi = 0;

        function di() {
            0 === --hi && u.emitOnce("onChartReady")
        }
        le.forEach((function(e) {
            if (e) {
                hi++;
                var t = e.chartWidget;
                t.withModel(null, (function() {
                    o.metaInfo && t.model().model().setChartSaveTime(1e3 * o.metaInfo.lastModified);
                    var e = t.model().mainSeries();
                    if (e.bars().size() > 0 || e.isFailed()) di();
                    else {
                        var i = e.dataEvents(),
                            s = function() {
                                di(), i.barReceived().unsubscribe(null, s), i.completed().unsubscribe(null, s), i.error().unsubscribe(null, s)
                            };
                        i.barReceived().subscribe(null, s), i.completed().subscribe(null, s), i.error().subscribe(null, s)
                    }
                }))
            }
        })), j(ut()).then(G).then((function() {
            window.saver && window.is_authenticated && o.widgetOptions.justCloned && window.saver.saveChartSilently()
        })).catch(m.logError.bind(m))
    }