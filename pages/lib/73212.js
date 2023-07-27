(e, t, i) => {
    "use strict";
    i.d(t, {
        ActionsProvider: () => $e,
        createActionCopyPrice: () => Ue,
        createChangeIntervalsVisibilitiesAction: () => He,
        createLinesAction: () => Ge,
        createMTPredictorActions: () => je,
        createPasteAction: () => We,
        createSyncDrawingActions: () => qe,
        createVisualOrderAction: () => ze,
        defaultContextMenuOptions: () => Fe
    });
    var s = i(50151),
        r = i(59224),
        n = (i(60521), i(1722)),
        o = i(44352),
        a = i(14483),
        l = i(39347),
        c = i(77212),
        h = i(10688),
        d = i(28853),
        u = (i(14787), i(26426)),
        p = i(96362),
        _ = i(68335),
        m = (i(25812), i(64063)),
        g = i(8561),
        f = (i(42960), i(5894)),
        v = i(69618),
        S = i(18341),
        y = i(18611),
        b = i(53180),
        w = i(36298),
        P = (i(88348), i(36274)),
        C = i(4949),
        x = i(93352);
    (0, r.getLogger)("Chart.ActionsProvider"), new w.TranslatedString("show alert label lines", o.t(null, void 0, i(16237))), new w.TranslatedString("hide alert label lines", o.t(null, void 0, i(91842)));
    const T = new w.TranslatedString("change visibility", o.t(null, void 0, i(21511))),
        I = new w.TranslatedString("pin to scale {label}", o.t(null, void 0, i(56015))),
        M = new w.TranslatedString("pin to right scale", o.t(null, void 0, i(22615))),
        A = new w.TranslatedString("pin to left scale", o.t(null, void 0, i(84018))),
        L = (new w.TranslatedString("change earnings visibility", o.t(null, void 0, i(88217))), new w.TranslatedString("change dividends visibility", o.t(null, void 0, i(84944))), new w.TranslatedString("change splits visibility", o.t(null, void 0, i(74488))), new w.TranslatedString("change continuous contract switch visibility", o.t(null, void 0, i(7017))), new w.TranslatedString("change futures contract expiration visibility", o.t(null, void 0, i(28288))), new w.TranslatedString("change latest news and Minds visibility", o.t(null, void 0, i(19839))), new w.TranslatedString("show all ideas", o.t(null, void 0, i(13622)))),
        k = new w.TranslatedString("show ideas of followed users", o.t(null, void 0, i(26267))),
        E = new w.TranslatedString("show my ideas only", o.t(null, void 0, i(40061))),
        D = (new w.TranslatedString("change events visibility on chart", o.t(null, void 0, i(79574))), new w.TranslatedString("add this symbol to entire layout", o.t(null, void 0, i(27982)))),
        V = new w.TranslatedString("add this indicator to entire layout", o.t(null, void 0, i(82388))),
        B = (new w.TranslatedString("add this strategy to entire layout", o.t(null, void 0, i(94292))), new w.TranslatedString("add this financial metric to entire layout", o.t(null, void 0, i(22856))), new w.TranslatedString("apply drawing template", o.t(null, void 0, i(49037))),
            new w.TranslatedString("lock objects", o.t(null, void 0, i(68163)))),
        R = new w.TranslatedString("unlock objects", o.t(null, void 0, i(66824))),
        N = new w.TranslatedString("change visibility at current interval and above", o.t(null, void 0, i(78422))),
        O = new w.TranslatedString("change visibility at current interval and below", o.t(null, void 0, i(49529))),
        F = new w.TranslatedString("change visibility at current interval", o.t(null, void 0, i(16698))),
        W = new w.TranslatedString("change visibility at all intervals", o.t(null, void 0, i(66927))),
        z = (o.t(null, void 0, i(8700)), o.t(null, void 0, i(44469)), o.t(null, void 0, i(64596)), o.t(null, void 0, i(64885)), (0, b.appendEllipsis)(o.t(null, void 0, i(93512)))),
        H = (o.t(null, void 0, i(27558)), o.t(null, void 0, i(87085)), (0, b.appendEllipsis)(o.t(null, void 0, i(52302))), o.t(null, void 0, i(81428))),
        U = o.t(null, void 0, i(31971)),
        j = (o.t(null, void 0, i(11156)), o.t(null, void 0, i(15682)), o.t(null, void 0, i(66631)), o.t(null, void 0, i(37422)), o.t(null, void 0, i(5716)), o.t(null, void 0, i(50352)), o.t(null, void 0, i(19263)), o.t(null, void 0, i(15818)), o.t(null, void 0, i(5897)), o.t(null, void 0, i(58976)), o.t(null, void 0, i(11661)), o.t(null, void 0, i(66560)), o.t(null, void 0, i(53958)), o.t(null, void 0, i(34150)), o.t(null, void 0, i(83927)), o.t(null, void 0, i(15644)), o.t(null, void 0, i(42660)), o.t(null, void 0, i(44788)), o.t(null, void 0, i(70437)), o.t(null, void 0, i(71263)), o.t(null, void 0, i(70573)), o.t(null, void 0, i(59560)), o.t(null, void 0, i(14125))),
        G = o.t(null, void 0, i(44538)),
        q = o.t(null, void 0, i(56948)),
        $ = o.t(null, void 0, i(20207)),
        Y = o.t(null, void 0, i(65810)),
        K = o.t(null, void 0, i(3822)),
        Z = o.t(null, void 0, i(97324)),
        X = o.t(null, void 0, i(764)),
        J = o.t(null, void 0, i(8128)),
        Q = o.t(null, void 0, i(61201)),
        ee = o.t(null, void 0, i(32156)),
        te = o.t(null, void 0, i(91130)),
        ie = o.t(null, void 0, i(37680)),
        se = o.t(null, void 0, i(43707)),
        re = o.t(null, void 0, i(39065)),
        ne = o.t(null, void 0, i(54727)),
        oe = o.t(null, void 0, i(66156)),
        ae = o.t(null, void 0, i(76598)),
        le = o.t(null, void 0, i(3485)),
        ce = o.t(null, void 0, i(45828)),
        he = o.t(null, void 0, i(2899)),
        de = o.t(null, void 0, i(40887)),
        ue = o.t(null, void 0, i(53387)),
        pe = o.t(null, void 0, i(96712)),
        _e = o.t(null, void 0, i(26354)),
        me = o.t(null, void 0, i(19796)),
        ge = o.t(null, void 0, i(59901)),
        fe = o.t(null, void 0, i(23221)),
        ve = o.t(null, void 0, i(22198)),
        Se = o.t(null, void 0, i(27557)),
        ye = o.t(null, void 0, i(98486)),
        be = o.t(null, void 0, i(73106)),
        we = o.t(null, void 0, i(85964)),
        Pe = o.t(null, void 0, i(59192)),
        Ce = o.t(null, void 0, i(83182)),
        xe = ((0, b.appendEllipsis)(o.t(null, void 0, i(92206))), (0, b.appendEllipsis)(o.t(null, void 0, i(3612))), (0, b.appendEllipsis)(o.t(null, void 0, i(89517)))),
        Te = (o.t(null, void 0, i(13345)), (0, b.appendEllipsis)(o.t(null, void 0, i(9908))), o.t(null, void 0, i(35216))),
        Ie = o.t(null, void 0, i(52977)),
        Me = (o.t(null, void 0, i(19611)), o.t(null, void 0, i(38342))),
        Ae = o.t(null, void 0, i(15101)),
        Le = o.t(null, void 0, i(42284)),
        ke = (o.t(null, void 0, i(46771)), o.t(null, void 0, i(66263)), o.t(null, void 0, i(30816)), o.t(null, void 0, i(24620)), o.t(null, void 0, i(84813)), o.t(null, void 0, i(72973)), o.t(null, void 0, i(48284))),
        Ee = o.t(null, void 0, i(87933)),
        De = o.t(null, void 0, i(58669)),
        Ve = ((0,
            b.appendEllipsis)(o.t(null, void 0, i(89517))), o.t(null, void 0, i(8251)), o.t(null, void 0, i(34059))),
        Be = o.t(null, void 0, i(64288)),
        Re = (o.t(null, void 0, i(77920)), o.t(null, void 0, i(75669)), o.t(null, void 0, i(8886)), o.t(null, void 0, i(18008)), o.t(null, void 0, i(33606)), (0, b.appendEllipsis)(o.t(null, void 0, i(65986)))),
        Ne = o.t(null, void 0, i(29682)),
        Oe = o.t(null, void 0, i(28851)),
        Fe = {
            general: !0,
            mainSeries: !0,
            mainSeriesTrade: !1,
            esdStudies: !0,
            studies: !0,
            fundamentals: !0,
            lineTools: !0,
            publishedCharts: !0,
            ordersAndPositions: !0,
            alerts: !0,
            chartEvents: !0,
            objectTree: !0,
            gotoLineTool: !1
        };

    function We(e, t) {
        return !t.isEmpty() && a.enabled("datasource_copypaste") ? new l.Action({
            actionId: "Chart.Clipboard.PasteSource",
            label: Ne.trim(),
            shortcutHint: (0, _.humanReadableHash)(_.Modifiers.Mod + 86),
            statName: "Paste",
            onExecute: () => e.chartWidgetCollection().clipboard.uiRequestPaste(t)
        }) : null
    }

    function ze(e, t) {
        const s = e.model(),
            r = s.availableZOrderOperations(t),
            n = [new l.Action({
                actionId: "Chart.Source.VisualOrder.BringToFront",
                label: _e,
                statName: "BringToFront",
                disabled: !r.bringToFrontEnabled,
                onExecute: () => s.bringToFront(t)
            }), new l.Action({
                actionId: "Chart.Source.VisualOrder.SendToBack",
                label: me,
                statName: "SendToBack",
                disabled: !r.sendToBackEnabled,
                onExecute: () => s.sendToBack(t)
            }), new l.Action({
                actionId: "Chart.Source.VisualOrder.BringForward",
                label: ge,
                statName: "BringForward",
                disabled: !r.bringForwardEnabled,
                onExecute: () => s.bringForward(t)
            }), new l.Action({
                actionId: "Chart.Source.VisualOrder.SendBackward",
                label: fe,
                statName: "SendBackward",
                disabled: !r.sendBackwardEnabled,
                onExecute: () => s.sendBackward(t)
            })];
        return new l.Action({
            actionId: "Chart.Source.VisualOrder",
            label: ve,
            icon: i(77067),
            statName: "VisualOrder",
            subItems: n
        })
    }

    function He(e, t) {
        const i = e.model(),
            s = (e, s) => {
                const r = P.Interval.parse(i.mainSeries().interval()),
                    n = (0, C.getIntervalsVisibilitiesForMode)(r, e),
                    o = [],
                    a = [];
                t.forEach((e => {
                    const t = e.properties().intervalsVisibilities.childs();
                    o.push(t.ticks), a.push(n.ticks), o.push(t.seconds), a.push(n.seconds), o.push(t.secondsFrom), a.push(n.secondsFrom), o.push(t.secondsTo), a.push(n.secondsTo), o.push(t.minutes), a.push(n.minutes), o.push(t.minutesFrom), a.push(n.minutesFrom), o.push(t.minutesTo), a.push(n.minutesTo), o.push(t.hours), a.push(n.hours), o.push(t.hoursFrom), a.push(n.hoursFrom), o.push(t.hoursTo), a.push(n.hoursTo), o.push(t.days), a.push(n.days), o.push(t.daysFrom), a.push(n.daysFrom), o.push(t.daysTo), a.push(n.daysTo), o.push(t.weeks), a.push(n.weeks), o.push(t.weeksFrom), a.push(n.weeksFrom), o.push(t.weeksTo), a.push(n.weeksTo), o.push(t.months), a.push(n.months), o.push(t.monthsFrom), a.push(n.monthsFrom), o.push(t.monthsTo), a.push(n.monthsTo), o.push(t.ranges), a.push(n.ranges)
                })), i.setProperties(o, a, s)
            },
            r = [new l.Action({
                actionId: "Chart.Source.IntervalsVisibility.CurrentAndAbove",
                label: ye,
                statName: "currentAndAboveIntervals",
                onExecute: () => s(3, N)
            }), new l.Action({
                actionId: "Chart.Source.IntervalsVisibility.CurrentAndBelow",
                label: be,
                statName: "currentAndBelowIntervals",
                onExecute: () => s(2, O)
            }), new l.Action({
                actionId: "Chart.Source.IntervalsVisibility.Current",
                label: we,
                statName: "currentInterval",
                onExecute: () => s(1, F)
            }), new l.Action({
                actionId: "Chart.Source.IntervalsVisibility.All",
                label: Pe,
                statName: "allIntervals",
                onExecute: () => s(0, W)
            })];
        return new l.Action({
            actionId: "Chart.Source.IntervalsVisibility",
            label: Se,
            statName: "IntervalsVisibility",
            subItems: r
        })
    }

    function Ue(e, t) {
        var i, s, r;
        const n = e.defaultPriceScale(),
            o = void 0 !== t ? n.coordinateToPrice(t, null !== (s = null === (i = e.mainDataSource()) || void 0 === i ? void 0 : i.firstValue()) && void 0 !== s ? s : 0) : e.model().mainSeries().lastValueData(4, !0, !0).price,
            a = null === (r = e.mainDataSource()) || void 0 === r ? void 0 : r.formatter();
        if (void 0 === o || !a) return null;
        const c = a.format(o);
        return new l.Action({
            actionId: "Chart.Clipboard.CopyPrice",
            label: `${Oe} ${c}`,
            statName: "CopyPrice",
            onExecute: () => (0, x.getClipboard)().writeText(c)
        })
    }

    function je(e, t, i, s) {
        return null
    }

    function Ge(e) {
        const t = e.actions(),
            i = [t.showPriceLine];
        return i.push(t.showHighLowPriceLines), a.enabled("show_average_close_price_line_and_label") && i.push(t.showAverageClosePriceLine), new l.Action({
            actionId: "Chart.Lines",
            label: Ce,
            statName: "Lines",
            subItems: i
        })
    }

    function qe(e, t) {
        return []
    }
    class $e {
        constructor(e, t) {
            this._chartWidget = e, this._options = (0, n.merge)((0, n.clone)(Fe), t || {})
        }
        async contextMenuActionsForSources(e, t, i) {
            const s = e[0],
                r = this._options;
            if (s === this._chartWidget.model().mainSeries() && r.mainSeries) return this._contextMenuActionsForSeries(s, t);
            if ((0, d.isStudy)(s) && r.studies) return this._contextMenuActionsForStudy(s, t);
            if ((0, S.isLineTool)(s) && r.lineTools) {
                const t = e.filter(S.isLineTool);
                return this._contextMenuActionsForLineTool(t)
            }
            return []
        }
        _isReadOnly() {
            return this._chartWidget.readOnly()
        }
        _createActionHide(e) {
            return new l.Action({
                actionId: "Chart.SelectedObject.Hide",
                label: U,
                icon: i(84959),
                statName: "HideSelectedObject",
                onExecute: this._chartWidget.hideDataSources.bind(this._chartWidget, [e])
            })
        }
        _createActionShow(e) {
            const t = new l.Action({
                    actionId: "Chart.SelectedObject.Show",
                    checkable: !0,
                    label: H,
                    icon: i(16911),
                    statName: "ToggleShow"
                }),
                s = new c.ActionBinder(t, e.properties().visible, this._chartWidget.model(), T);
            return t.setBinding(s), s.setValue(e.properties().visible.value()), t
        }
        _createActionScale(e) {
            const t = (0, s.ensureNotNull)(e.priceScale()),
                r = this._chartWidget.model().model(),
                n = (0, s.ensureNotNull)(r.paneForSource(e)),
                o = n.priceScalePosition(t),
                a = ("left" === o ? n.leftPriceScales() : n.rightPriceScales()).indexOf(t),
                c = r.priceScaleSlotsCount().totallySlots < 2 ? "dontneedname" : "needname",
                d = "overlay" === o ? "" : (0, h.getPriceAxisNameInfo)(o, a).label,
                u = re.format({
                    label: d
                }),
                p = {
                    "left-needname": u,
                    "left-dontneedname": oe,
                    "right-needname": u,
                    "right-dontneedname": ae,
                    "overlay-needname": ne,
                    "overlay-dontneedname": ne
                } [o + "-" + c];
            return new l.Action({
                actionId: "Chart.Source.ChangePriceScale",
                label: p,
                icon: i(25191),
                subItems: this._createActionScaleItems(e)
            })
        }
        _createActionLayoutChartsSync() {
            return new LayoutChartsSyncContextMenuAction(this._chartWidget.linkingGroupIndex().readonly(), (e => this._chartWidget.model().setLinkingGroupIndex(e)))
        }
        _createActionScaleDetach(e, t, i, r) {
            const n = this._chartWidget.model().model(),
                o = (0, s.ensureNotNull)(n.paneForSource(e));
            if (!o.canCreateNewPriceScale()) return null;
            const a = (0, s.ensureNotNull)(e.priceScale()),
                c = a.canDetachSource(e),
                d = o.priceScalePosition(a),
                u = c || d !== t;
            if (!u) return null;
            const p = n.priceScaleSlotsCount(),
                _ = {
                    left: {
                        labelled: Z,
                        sided: ie
                    },
                    right: {
                        labelled: Z,
                        sided: se
                    }
                },
                m = "left" === t ? o.leftPriceScales().length : o.rightPriceScales().length,
                g = p[t] > m ? "labelled" : "sided",
                f = (0, h.getPriceAxisNameInfo)(t, m).label,
                v = _[t][g].format({
                    label: f
                });
            return new l.Action({
                actionId: "Chart.Source.ChangePriceScale",
                checkable: !1,
                disabled: !u,
                label: v,
                statName: r,
                payload: e,
                onExecute: i
            })
        }
        _onDetachLeft(e) {
            const t = e.getPayload(),
                i = this._chartWidget.model().model(),
                r = (0, s.ensureNotNull)(i.paneForSource(t));
            this._chartWidget.model().detachToLeft(t, r)
        }
        _onDetachRight(e) {
            const t = e.getPayload(),
                i = this._chartWidget.model().model(),
                r = (0, s.ensureNotNull)(i.paneForSource(t));
            this._chartWidget.model().detachToRight(t, r)
        }
        _createActionScaleDetachLeft(e) {
            return this._createActionScaleDetach(e, "left", this._onDetachLeft.bind(this), "ToggleScaleLeft")
        }
        _createActionScaleDetachRight(e) {
            return this._createActionScaleDetach(e, "right", this._onDetachRight.bind(this), "ToggleScaleRight")
        }
        _onMoveToScale(e) {
            const t = e.getPayload();
            if (t.datasource.priceScale() === t.priceScale) return;
            const i = this._chartWidget.model().model(),
                r = (0, s.ensureNotNull)(i.paneForSource(t.datasource));
            this._chartWidget.model().moveToScale(t.datasource, r, t.priceScale, t.undoText)
        }
        _createMoveToScaleAction(e, t, i, s) {
            const r = e.priceScale() === t;
            return new l.Action({
                actionId: "Chart.Source.MoveToOtherScale",
                checkable: !0,
                checked: r,
                label: i,
                statName: "ToggleScale",
                payload: {
                    datasource: e,
                    priceScale: t,
                    undoText: s
                },
                onExecute: this._onMoveToScale.bind(this)
            })
        }
        _onNoScale(e) {
            const t = e.getPayload().datasource,
                i = this._chartWidget.model().model(),
                r = (0, s.ensureNotNull)(i.paneForSource(t));
            r.isOverlay(t) || this._chartWidget.model().detachNoScale(t, r)
        }
        _createActionNoScale(e) {
            const t = this._chartWidget.model().model(),
                i = (0, s.ensureNotNull)(t.paneForSource(e)),
                r = i.actionNoScaleIsEnabled(e);
            return new l.Action({
                actionId: "Chart.Source.MoveToNoScale",
                checkable: !0,
                checked: i.isOverlay(e),
                label: le,
                disabled: !r,
                statName: "ToggleNoScale",
                payload: {
                    datasource: e
                },
                onExecute: this._onNoScale.bind(this)
            })
        }
        _createActionScaleItems(e) {
            const t = [],
                i = this._chartWidget.model().model(),
                r = (0, s.ensureNotNull)(i.paneForSource(e)),
                n = i.priceScaleSlotsCount().totallySlots > 1,
                o = r.rightPriceScales(),
                a = r.leftPriceScales(),
                c = this._createActionScaleDetachRight(e),
                d = this._createActionScaleDetachLeft(e),
                u = o.length + a.length + (null === c ? 0 : 1) + (null === d ? 0 : 1) > 2,
                p = {
                    right: {
                        hidden: {
                            checked: {
                                labelled: j,
                                sided: G
                            },
                            unchecked: {
                                labelled: q,
                                sided: $
                            }
                        },
                        visible: {
                            checked: {
                                labelled: Y,
                                sided: K
                            },
                            unchecked: {
                                labelled: Z,
                                sided: X
                            }
                        }
                    },
                    left: {
                        hidden: {
                            checked: {
                                labelled: j,
                                sided: J
                            },
                            unchecked: {
                                labelled: q,
                                sided: Q
                            }
                        },
                        visible: {
                            checked: {
                                labelled: Y,
                                sided: ee
                            },
                            unchecked: {
                                labelled: Z,
                                sided: te
                            }
                        }
                    }
                },
                _ = {
                    right: M,
                    left: A
                },
                m = {
                    left: r.visibleLeftPriceScales(),
                    right: r.visibleRightPriceScales()
                },
                g = (t, i) => {
                    const s = ("right" === i ? o : a)[t],
                        r = m[i].includes(s) ? "visible" : "hidden",
                        l = e.priceScale() === s ? "checked" : "unchecked",
                        c = n ? "labelled" : "sided",
                        d = p[i],
                        u = (0, h.getPriceAxisNameInfo)(i, t).label;
                    return {
                        actionText: d[r][l][c].format({
                            label: u
                        }),
                        undoText: n ? I.format({
                            label: u
                        }) : _[i]
                    }
                };
            t.push(...o.map(((t, i) => {
                const s = g(i, "right");
                return this._createMoveToScaleAction(e, t, s.actionText, s.undoText)
            }))), null !== c && t.push(c);
            u && (o.length > 0 || null !== c) && t.push(new l.Separator);
            t.push(...a.map(((t, i) => {
                const s = g(i, "left");
                return this._createMoveToScaleAction(e, t, s.actionText, s.undoText)
            }))), null !== d && t.push(d);
            u && (a.length > 0 || null !== d) && t.push(new l.Separator);
            return t.push(this._createActionNoScale(e)), t
        }
        _createActionMergeUp(e) {
            const t = this._chartWidget.model();
            return t.model().isMergeUpAvailableForSource(e) ? new l.Action({
                actionId: "Chart.Source.MergeUp",
                label: he,
                statName: "MergeUp",
                onExecute: () => t.mergeSourceUp(e)
            }) : null
        }
        _createActionUnmergeUp(e) {
            const t = this._chartWidget.model();
            return t.model().isUnmergeAvailableForSource(e) ? new l.Action({
                actionId: "Chart.Source.UnmergeUp",
                label: de,
                statName: "UnmergeUp",
                onExecute: () => t.unmergeSourceUp(e)
            }) : null
        }
        _createActionMergeDown(e) {
            const t = this._chartWidget.model();
            return t.model().isMergeDownAvailableForSource(e) ? new l.Action({
                actionId: "Chart.Source.MergeDown",
                label: ue,
                statName: "MergeDown",
                onExecute: () => t.mergeSourceDown(e)
            }) : null
        }
        _createActionUnmergeDown(e) {
            const t = this._chartWidget.model();
            return t.model().isUnmergeAvailableForSource(e) ? new l.Action({
                actionId: "Chart.Source.UnmergeDown",
                label: pe,
                statName: "UnmergeDown",
                onExecute: () => t.unmergeSourceDown(e)
            }) : null
        }
        _mergeContentMenuItems(e) {
            return [this._createActionMergeUp(e), this._createActionUnmergeUp(e), this._createActionMergeDown(e), this._createActionUnmergeDown(e)].filter(n.notNull)
        }
        _createActionMove(e) {
            const t = this._mergeContentMenuItems(e);
            return t.length > 0 ? new l.Action({
                actionId: "Chart.Source.MoveToPane",
                label: ce,
                icon: i(54190),
                subItems: t
            }) : null
        }
        _contextMenuActionsForSeries(e, t) {
            var i;
            const r = [],
                n = e.properties().childs().visible.value(),
                o = this._chartWidget.model().model(),
                c = (0, s.ensureNotNull)(o.paneForSource(e)),
                h = this._chartWidget.actions(),
                d = t && "localY" in t ? t.localY : void 0;
            if (this._isReadOnly()) r.push(n ? this._createActionHide(e) : this._createActionShow(e)), r.push(new l.Separator), r.push(this._createActionScale(e));
            else {
                0,
                r.length > 0 && !(r[r.length - 1] instanceof l.Separator) && r.push(new l.Separator),
                a.enabled("symbol_info") && r.push(h.showSymbolInfoDialog);o.mainSeries().symbolInfo();
                if (r.length > 0 && !(r[r.length - 1] instanceof l.Separator) && r.push(new l.Separator), !c.isEmpty() && a.enabled("datasource_copypaste")) {
                    const e = Ue(c, d),
                        t = We(this._chartWidget, c);
                    (e || t) && (e && r.push(e), t && r.push(t), r.push(new l.Separator))
                }
                r.push(ze(this._chartWidget, [e]));
                const t = this._createActionMove(e);null !== t && r.push(t),
                r.push(this._createActionScale(e)),
                r.push(n ? this._createActionHide(e) : this._createActionShow(e)),
                r.push(new l.Separator),
                r.push(Ge(this._chartWidget)),
                r.push(new l.Separator);Boolean(null === (i = window.widgetbar) || void 0 === i ? void 0 : i.widget("watchlist")) && h.addToWatchlist && r.push(h.addToWatchlist),
                a.enabled("text_notes") && r.push(h.addToTextNotes),
                r[r.length - 1] instanceof l.Separator || r.push(new l.Separator),
                a.enabled("show_chart_property_page") && !this._chartWidget.onWidget() && r.push(h.mainSeriesPropertiesAction),
                r[r.length - 1] instanceof l.Separator && r.pop()
            }
            return r
        }
        _createActionAddChildStudy(e) {
            throw new Error("unsupported")
        }
        _createActionAddFundamentals(e) {
            return null
        }
        _createActionShowSymbolInfoDialog(e, t) {
            const s = this._chartWidget.model().model();
            return new l.Action({
                actionId: "Chart.Dialogs.ShowSymbolInfo",
                label: Re,
                icon: i(37924),
                checkable: !1,
                statName: "SymbolInfo",
                onExecute: () => {
                    const i = e.symbol(),
                        r = {
                            symbolInfo: e.symbolInfo(),
                            unitDescription: e => t.description(e),
                            dateFormatter: s.dateFormatter()
                        };
                    (0, f.showSymbolInfoDialog)(i, r)
                }
            })
        }
        _createActionShowProperties(e) {
            return new l.Action({
                actionId: "Chart.Indicator.ShowSettingsDialog",
                label: xe,
                icon: i(51983),
                statName: "EditSelectedObject",
                onExecute: () => this._chartWidget.showSourceProperties(e)
            })
        }
        async _contextMenuActionsForStudy(e, t) {
            const i = this._chartWidget.actions(),
                s = e.properties().childs().visible.value(),
                r = (t && "localY" in t && t.localY, []);
            if (!e.userEditEnabled()) return r;
            if (this._chartWidget.readOnly()) r.push(s ? this._createActionHide(e) : this._createActionShow(e)), r.push(new l.Separator), (0, u.isNonSeriesStudy)(e) || r.push(this._createActionScale(e));
            else {
                0,
                a.enabled("study_on_study") && e.canHaveChildren() && r.push(this._createActionAddChildStudy(e));
                const t = this._createApplyToEntireLayoutCommand(e);
                if (null !== t && r.push(t), r.length > 0 && !(r[r.length - 1] instanceof l.Separator) && r.push(new l.Separator), a.enabled("symbol_info") && (e instanceof g.StudyCompare || e instanceof m.study_Overlay) && null !== e.symbolInfo() && (r.push(this._createActionShowSymbolInfoDialog(e, this._chartWidget.model().model().availableUnits())), r.push(new l.Separator)), r.push(ze(this._chartWidget, [e])), r.push(He(this._chartWidget, [e])), !(0, u.isNonSeriesStudy)(e)) {
                    const t = this._createActionMove(e);
                    null !== t && r.push(t), r.push(this._createActionScale(e))
                }
                r.push(new l.Separator);
                const n = e.metaInfo();
                if (e.copiable()) {
                    const t = new l.Action({
                        actionId: "Chart.Clipboard.CopySource",
                        label: Te,
                        shortcutHint: (0, _.humanReadableHash)(_.Modifiers.Mod + 67),
                        statName: "Copy",
                        onExecute: () => {
                            this._chartWidget.chartWidgetCollection().clipboard.uiRequestCopy([e])
                        }
                    });
                    r.push(t)
                }
                r.push(s ? this._createActionHide(e) : this._createActionShow(e)),
                r.push(i.studyRemove);
                const o = this._options.objectTree && i.paneObjectTree,
                    c = !1;
                (o || c) && (r.push(new l.Separator), o && r.push(i.paneObjectTree), c && r.push(this._chartWidget.actions().showDataWindow)),
                r.push(new l.Separator),
                a.enabled("property_pages") && new p.MetaInfoHelper(n).hasUserEditableOptions() && r.push(this._createActionShowProperties(e)),
                r[r.length - 1] instanceof l.Separator && r.pop()
            }
            return r
        }
        _createEditAlertDrawingAction(e) {
            return new TVAction({
                label: z.format({
                    title: e.title()
                }),
                icon: TbbiEditAlertSvg,
                statName: "EditAlert",
                onExecute: () => {
                    window.runOrSignIn((() => {
                        e.editAlert("pane_context_menu_edit_alert")
                    }), {
                        source: "Alert edit from pane context menu"
                    })
                }
            })
        }
        _createLineToolTemplateAction(e) {
            return null
        }
        _createActionToggleLockLineTools(e) {
            const t = e[0].properties().frozen.value(),
                s = t ? Ae : Le;
            return new l.Action({
                actionId: "Chart.SelectedObject.ToggleLocked",
                label: s,
                statName: "ToggleLockSelectedObject",
                checkable: !0,
                icon: i(t ? 97874 : 2872),
                onExecute: () => {
                    if (1 === e.length) this._chartWidget.toggleLockSelectedObject();
                    else {
                        const i = t ? R : B,
                            s = this._chartWidget.model();
                        s.withMacro(i, (() => {
                            e.forEach((e => {
                                s.setProperty(e.properties().frozen, !t, i)
                            }))
                        }))
                    }
                }
            })
        }
        async _contextMenuActionsForLineTool(e) {
            const t = [],
                s = this._chartWidget.actions(),
                r = (this._chartWidget.model().model(), () => {
                    t.push(ze(this._chartWidget, e))
                }),
                n = () => {
                    t.push(He(this._chartWidget, e))
                },
                o = () => {
                    const s = e.filter((e => e.cloneable()));
                    if (s.length > 0) {
                        const e = new l.Action({
                            actionId: "Chart.LineTool.Clone",
                            label: Ie,
                            icon: i(1457),
                            shortcutHint: (0, _.humanReadableModifiers)(_.Modifiers.Mod) + "Drag",
                            statName: "Clone",
                            onExecute: () => this._chartWidget.model().cloneLineTools(s, !1)
                        }, "Clone");
                        t.push(e)
                    }
                    return !!s.length
                },
                c = () => {
                    const i = e.filter((e => e.copiable()));
                    if (i.length > 0) {
                        const e = new l.Action({
                            actionId: "Chart.Clipboard.CopyLineTools",
                            label: Te,
                            shortcutHint: (0, _.humanReadableHash)(_.Modifiers.Mod + 67),
                            statName: "Copy",
                            onExecute: () => this._chartWidget.chartWidgetCollection().clipboard.uiRequestCopy(i)
                        }, "Copy");
                        t.push(e)
                    }
                    return !!i.length
                },
                h = () => {
                    const e = (this._chartWidget, []);
                    return t.push(...e), e.length > 0
                },
                d = e => {
                    const i = new l.Action({
                        actionId: "Chart.ScrollToLineTool",
                        label: Me.format({
                            lineToolName: e.title()
                        }),
                        statName: "GoToLineTool",
                        checkable: !1,
                        onExecute: async () => this._chartWidget.model().scrollToLineTool(e)
                    });
                    t.push(i)
                },
                u = e => {
                    const t = this._chartWidget.model().model().lineToolsGroupModel(),
                        i = e.map((e => t.groupForLineTool(e)));
                    return new Set(i).size <= 1
                };
            if (1 === e.length) {
                const i = e[0];
                if (this._chartWidget.readOnly()) t.push(s.lineHide);
                else if (i.userEditEnabled()) {
                    0,
                    r(),
                    n(),
                    this._options.objectTree && s.paneObjectTree && t.push(s.paneObjectTree),
                    t.push(new l.Separator);
                    let e = o();e = c() || e,
                    e = h() || e,
                    e && t.push(new l.Separator),
                    t.push(this._createActionToggleLockLineTools([i])),
                    t.push(s.lineHide),
                    t.push(s.lineRemove),
                    i.points().length > 0 && this._options.gotoLineTool && (t.push(new l.Separator), d(i));
                    const u = await this._chartWidget.propertiesDefinitionsForSource(i);
                    if (a.enabled("property_pages") && null !== u && (t.push(new l.Separator), t.push(s.format)), i.additionalActions) {
                        t.push(new l.Separator);
                        const e = i.additionalActions(this._chartWidget.model());
                        t.push(...e)
                    }
                }
            } else this._options.objectTree && s.paneObjectTree && t.push(s.paneObjectTree), u(e) && r(), n(), t.length > 0 && t.push(new l.Separator), o(), c(), h(), t.push(new l.Separator), t.push(this._createActionToggleLockLineTools(e)), t.push(s.lineHide), t.push(s.lineRemove), a.enabled("property_pages") && (t.push(new l.Separator), t.push(s.format));
            return t
        }
        _createEarningsShow() {
            return null
        }
        _createDividendsShow() {
            return null
        }
        _createSplitsShow() {
            return null
        }
        _contextMenuActionsForESD() {
            return []
        }
        _contextMenuActionsForRollDates() {
            return []
        }
        _contextMenuActionsForFuturesContractExpiration() {
            return []
        }
        _contextMenuActionsForisLatestUpdates() {
            return []
        }
        _contextMenuActionsForPublishedTimeline(e) {
            const t = this._chartWidget.actions(),
                i = [];
            if (i.push(t.lineHide), window.is_authenticated) {
                const t = e.properties().childs().filter,
                    s = new TVAction({
                        checked: t.value() === PublishedChartsFilter.None,
                        checkable: !0,
                        label: ke,
                        name: "ToggleAllIdeas",
                        statName: "ToggleAllIdeas",
                        onExecute: () => this._chartWidget.model().setProperty(t, PublishedChartsFilter.None, L)
                    }),
                    r = new TVAction({
                        checked: t.value() === PublishedChartsFilter.Following,
                        checkable: !0,
                        label: Ee,
                        name: "ToggleIdeasOfPeopleAndUser",
                        statName: "ToggleIdeasOfPeopleAndUser",
                        onExecute: () => this._chartWidget.model().setProperty(t, PublishedChartsFilter.Following, k)
                    }),
                    n = new TVAction({
                        checked: t.value() === PublishedChartsFilter.Private,
                        checkable: !0,
                        label: De,
                        name: "ToggleUserIdeas",
                        statName: "ToggleUserIdeas",
                        onExecute: () => this._chartWidget.model().setProperty(t, PublishedChartsFilter.Private, E)
                    });
                i.push(new l.Separator, s, r, n)
            }
            return i
        }
        _contextMenuActionsForTradingDrawings(e) {
            return e.contextMenuItems()
        }
        _createAlertToggleHorzLineLabelAction(e) {
            throw new Error("Not implemented")
        }
        _contextMenuActionsForAlertLabel(e, t) {
            throw new Error("Not implemented")
        }
        _contextMenuActionsForChartEvents(e) {
            return []
        }
        _createApplyToEntireLayoutCommand(e) {
            if (!this._chartWidget.chartWidgetCollection().applyIndicatorsToAllChartsAvailable()) return null;
            const t = this._chartWidget.model().model();
            if (e.parentSources().length > 0) return null;
            const i = (0, s.ensureNotNull)(t.paneForSource(e)),
                r = t.paneForSource(t.mainSeries()) === i,
                n = e instanceof g.StudyCompare && e.priceScale() === t.mainSeries().priceScale() && (0, s.ensureNotNull)(e.priceScale()).isPercentage(),
                o = r ? void 0 : t.panes().indexOf(i);
            let a = Be,
                c = V,
                h = "AddStudyToEntireLayout";
            return (0, y.isActingAsSymbolSource)(e) && (a = Ve, c = D, h = "AddSymbolToEntireLayout"), new l.Action({
                actionId: "Chart.AddIndicatorToAllCharts",
                label: a,
                statName: h,
                onExecute: () => {
                    const i = (0, s.ensureNotNull)((0, v.clipboardDataForSources)(t.id(), [e])),
                        a = this._chartWidget.chartWidgetCollection(),
                        l = {
                            isOnMainPane: r,
                            asCompare: n,
                            paneIndex: o
                        };
                    a.applyIndicatorToAllCharts(this._chartWidget, i, l, c)
                }
            }, "applyStudyToEntireLayout")
        }
    }
}