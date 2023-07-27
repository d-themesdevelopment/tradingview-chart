(e, t, i) => {
    "use strict";
    i.d(t, {
        ChartUndoModelBase: () => Ki
    });
    var s = i(85459),
        r = i.n(s),
        n = i(16230),
        o = i(50151),
        a = i(86441),
        l = i(44352),
        c = i(61345),
        h = i(21866),
        d = i(42856),
        u = i(17133),
        p = i(36274);

    function _(e, t) {
        return !!p.Interval.isEqual(e.res, t.res) && (0, u.areEqualTimeFrames)(e.val, t.val)
    }
    var m = i(93244),
        g = i(69618),
        f = i(18341),
        v = i(88275),
        S = i(36174),
        y = i(51768),
        b = i(39262),
        w = i(14483),
        P = i(46627),
        C = i(59224),
        x = i(28853),
        T = i(36298),
        I = i(1722);
    const M = new T.TranslatedString("move all scales to left", l.t(null, void 0, i(81898))),
        A = new T.TranslatedString("move all scales to right", l.t(null, void 0, i(22863))),
        L = (0, C.getLogger)("Chart.MergeAllScales");
    var k = i(62591);
    class E extends k.UndoCommand {
        constructor(e, t, i, s, r, n) {
            super(n), this._model = e, this._paneIndex = e.panes().indexOf(t), this._targetPosition = s, this._targetIndex = r, this._scaleId = i.id(), this._sourcePosition = t.priceScalePosition(i), "overlay" !== this._sourcePosition && (this._sourceIndex = t.priceScaleIndex(i, this._sourcePosition))
        }
        redo() {
            const e = this._model.panes()[this._paneIndex],
                t = (0, o.ensureNotNull)(e.getPriceScaleById(this._scaleId));
            e.movePriceScale(t, this._targetPosition, this._targetIndex), this._model.fullUpdate()
        }
        undo() {
            const e = this._model.panes()[this._paneIndex],
                t = (0, o.ensureNotNull)(e.getPriceScaleById(this._scaleId));
            e.movePriceScale(t, this._sourcePosition, this._sourceIndex), this._model.fullUpdate()
        }
    }
    class D extends k.UndoCommand {
        constructor(e, t, i, s) {
            super(s), this._createdIds = [], this._model = e, this._withoutShift = i, this._origStates = t.map((e => e.state(!0)));
            const r = e.lineToolsGroupModel();
            this._origGroups = t.map((e => {
                const t = r.groupForLineTool(e);
                return t && t.id
            }))
        }
        redo() {
            const e = this._model.lineToolsGroupModel(),
                t = this._origStates.map(((t, i) => {
                    const s = (0, o.ensureNotNull)(this._model.dataSourceForId(t.id)),
                        r = 0 === this._createdIds.length ? void 0 : (0, o.ensureDefined)(this._createdIds[i]),
                        n = (0, f.cloneLineTool)(this._model, s, !this._withoutShift, r),
                        a = (0, o.ensureNotNull)(s.priceScale());
                    (0, o.ensureNotNull)(this._model.paneForSource(s)).addDataSource(n, a, !1);
                    const l = this._origGroups[i];
                    if (null !== l) {
                        const t = e.groupForId(l);
                        t && t.addLineTools([n])
                    }
                    return this._model.updateSource(n), n
                }));
            0 === this._createdIds.length && (this._createdIds = t.map((e => e.id()))), this._model.selectionMacro((e => {
                    e.clearSelection(), t.forEach((t => {
                        e.addSourceToSelection(t)
                    }))
                })),
                this._model.setShouldBeSavedEvenIfHidden(!0)
        }
        undo() {
            const e = this._model.lineToolsGroupModel();
            this._createdIds.forEach((t => {
                const i = (0, o.ensureNotNull)(this._model.dataSourceForId(t)),
                    s = e.groupForLineTool(i);
                null !== s && s.excludeLineTool(i), this._model.removeSource(i)
            }))
        }
        newIds() {
            return this._createdIds
        }
    }
    var V = i(47513),
        B = i(93562);
    class R extends k.UndoCommand {
        constructor(e, t, i, s = !0) {
            super(i, s), this._newStates = [], this._model = e, this._savedStates = t.map((e => e.state(!1)))
        }
        redo() {
            this._applyState(this._newStates)
        }
        undo() {
            0 === this._newStates.length && this.saveNewState(), this._applyState(this._savedStates)
        }
        saveNewState() {
            const e = this._savedStates.filter(I.notNull).map((e => (0, o.ensureNotNull)(this._model.dataSourceForId(e.id))));
            this._newStates = e.map((e => e.state(!1)))
        }
        _applyState(e) {
            for (const t of e)
                if (null !== t) {
                    const e = this._model.dataSourceForId(t.id);
                    if (null !== e)
                        if ((0, x.isStudy)(e)) {
                            const i = t.state.inputs,
                                s = e.properties().childs().inputs.childs();
                            for (const e in i) s[e] && s[e].setValue(i[e])
                        } else this._model.restoreLineToolState(e, t, !0)
                }
        }
    }
    var N = i(95529),
        O = i(11235),
        F = i(98517),
        W = i(59656);
    const z = new T.TranslatedString("create {tool}", l.t(null, void 0, i(81791)));
    class H extends k.UndoCommand {
        constructor(e, t, i, s, r = 0, n) {
            super(z.format({
                tool: new T.TranslatedString(i, W.lineToolsLocalizedNames[i])
            }), !1), this._lineId = null, this._lineState = null, this._model = e, this._paneIndex = e.panes().indexOf(t), this._lineTool = i, this._ownerSourceId = s.id(), this._lineId = null != n ? n : null, this._drawOnAllChartsMode = r
        }
        startCreatingLine(e, t, i, s) {
            var r;
            const n = this._model.panes()[this._paneIndex],
                o = this._model.dataSourceForId(this._ownerSourceId),
                a = this._model.createLineTool(n, e, this._lineTool, t, i, s, o, null !== (r = this._lineId) && void 0 !== r ? r : void 0);
            return this._lineId = a.id(), !this._model.lineBeingCreated()
        }
        continueCreatingLine(e, t, i, s) {
            const r = this._model.continueCreatingLine(e, t, i, s);
            return r && this._model.setShouldBeSavedEvenIfHidden(!0), r
        }
        line() {
            return null === this._lineId ? null : this._model.dataSourceForId(this._lineId)
        }
        undo() {
            const e = this.line();
            null !== e && (this._lineState = e.state(!1), this._model.removeSource(e), this._lineId = null)
        }
        redo() {
            if (null === this._lineState) return;
            const e = this._model.restoreSource(!1, this._paneIndex, null, (0, o.ensureNotNull)(this._lineState), null);
            null !== e && (this._lineId = e.id(), this._lineState = null, e.share(this._drawOnAllChartsMode))
        }
        drawOnAllCharts() {
            return 0 !== this._drawOnAllChartsMode
        }
    }
    const U = new T.TranslatedString("bring {title} to front", l.t(null, void 0, i(78246))),
        j = new T.TranslatedString("send {title} to back", l.t(null, void 0, i(66781))),
        G = new T.TranslatedString("insert {title} after {targetTitle}", l.t(null, void 0, i(53146))),
        q = new T.TranslatedString("insert {title} before {targetTitle}", l.t(null, void 0, i(67176))),
        $ = new T.TranslatedString("send {title} backward", l.t(null, void 0, i(16259))),
        Y = new T.TranslatedString("bring {title} forward", l.t(null, void 0, i(56763))),
        K = new T.TranslatedString("send group {title} backward", l.t(null, void 0, i(4998))),
        Z = new T.TranslatedString("bring group {title} forward", l.t(null, void 0, i(27195)));

    function X(e) {
        return new T.TranslatedString(e.name(), e.title())
    }
    class J extends k.UndoCommand {
        constructor(e, t, i) {
            super(i), this._sourcesByPanes = new Map, this._originalState = new Map, this._model = e, t.forEach((t => {
                const i = (0, o.ensureNotNull)(e.paneForSource(t)),
                    s = e.panes().indexOf(i),
                    r = this._sourcesByPanes.get(s) || [];
                r.push(t.id()), this._sourcesByPanes.set(s, r)
            })), Array.from(this._sourcesByPanes.keys()).forEach((t => {
                const i = e.panes()[t],
                    s = new Map;
                i.sourcesByGroup().allIncludingHidden().forEach((e => {
                    s.set(e.id(), e.zorder())
                })), this._originalState.set(t, s)
            }))
        }
        undo() {
            this._originalState.forEach(((e, t) => {
                const i = this._model.panes()[t],
                    s = new Map;
                e.forEach(((e, t) => {
                    const r = (0, o.ensureNotNull)(i.dataSourceForId(t));
                    s.set(r, e)
                })), i.setZOrders(s)
            }))
        }
        redo() {
            this._sourcesByPanes.forEach(((e, t) => {
                const i = this._model.panes()[t],
                    s = e.map((e => (0, o.ensureNotNull)(i.dataSourceForId(e))));
                this._paneOperation(i, s)
            }))
        }
    }
    class Q extends J {
        constructor(e, t) {
            super(e, t, U.format({
                title: X(t[0])
            }))
        }
        _paneOperation(e, t) {
            e.bringToFront(t)
        }
    }
    class ee extends J {
        constructor(e, t) {
            super(e, t, j.format({
                title: X(t[0])
            }))
        }
        _paneOperation(e, t) {
            e.sendToBack(t)
        }
    }
    class te extends J {
        constructor(e, t, i, s) {
            super(e, t, s), this._targetSource = i
        }
        _paneOperation(e, t) {
            e.insertAfter(t, this._targetSource)
        }
    }
    class ie extends te {
        constructor(e, t, i) {
            super(e, t, i, G.format({
                title: X(t[0]),
                targetTitle: X(i)
            }))
        }
    }
    class se extends J {
        constructor(e, t, i, s) {
            super(e, t, s), this._targetSource = i
        }
        _paneOperation(e, t) {
            e.insertBefore(t, this._targetSource)
        }
    }
    class re extends se {
        constructor(e, t, i) {
            super(e, t, i, q.format({
                title: X(t[0]),
                targetTitle: X(i)
            }))
        }
    }

    function ne(e, t) {
        const i = t[0],
            s = e.sourcesByGroup().all().filter((e => e.zorder() < i.zorder()));
        if (0 === s.length) throw new Error("Cannot move backward source that alreadt on back");
        let r = s[s.length - 1];
        if ((0, f.isLineTool)(r)) {
            const t = e.model().lineToolsGroupModel().groupForLineTool(r);
            null !== t && (r = t.lineTools()[0])
        }
        return r
    }
    class oe extends se {
        constructor(e, t, i) {
            super(e, i, ne(t, i), $.format({
                title: X(i[0])
            }))
        }
    }

    function ae(e, t) {
        const i = t[t.length - 1],
            s = e.sourcesByGroup().allExceptSpecialSources().filter((e => e.zorder() > i.zorder()));
        if (0 === s.length) throw new Error("Cannot bring forward source that alreadt on back");
        let r = s[0];
        if ((0, f.isLineTool)(r)) {
            const t = e.model().lineToolsGroupModel().groupForLineTool(r);
            if (null !== t) {
                const e = t.lineTools();
                r = e[e.length - 1]
            }
        }
        return r
    }
    class le extends te {
        constructor(e, t, i) {
            super(e, i, ae(t, i), Y.format({
                title: X(i[0])
            }))
        }
    }

    function ce(e, t) {
        return (0, o.ensureNotNull)(e.paneForSource(t.lineTools()[0]))
    }
    class he extends se {
        constructor(e, t) {
            super(e, t.lineTools(), ne(ce(e, t), t.lineTools()), K.format({
                title: t.name()
            }))
        }
    }
    class de extends te {
        constructor(e, t) {
            super(e, t.lineTools(), ae(ce(e, t), t.lineTools()), Z.format({
                title: t.name()
            }))
        }
    }
    const ue = new T.TranslatedString("rearrange panes", l.t(null, void 0, i(33348)));
    class pe extends k.UndoCommand {
        constructor(e, t, i) {
            super(ue), this._chartModel = e, this._index = t, (0, I.isNumber)(i) ? this._dstIndex = i : this._dstIndex = "up" === i ? t - 1 : t + 1
        }
        redo() {
            this._checkIndices() && this._chartModel.movePane(this._index, this._dstIndex)
        }
        undo() {
            this._checkIndices() && this._chartModel.movePane(this._dstIndex, this._index)
        }
        _checkIndices() {
            const e = this._chartModel.panes().length;
            return this._index >= 0 && this._index < e && this._dstIndex >= 0 && this._dstIndex < e
        }
    }
    var _e = i(51674),
        me = i(8775),
        ge = i(46100),
        fe = i(42960),
        ve = i(82992),
        Se = i(94025),
        ye = i(28558);
    class be extends k.UndoCommand {
        constructor(e, t, i, s, r, n) {
            super(s), this._prevPriceAxisProps = {}, this._property = e, this._mainSeries = i, this._value = t, this._model = r, this._chartWidget = n
        }
        redo() {
            const e = this._mainSeries,
                t = e.properties().childs();
            this._prevResolution = t.interval.value(), this._prevValue = this._property.value(), this._storePriceAxisProps(), (0, ge.saveDefaultProperties)(!0);
            const i = t.interval.value(),
                s = this._model.defaultResolutions(),
                r = (0, Se.getResolutionByChartStyle)(this._value, i, s);
            ve.linking.interval.setValue(r), e.setChartStyleWithIntervalIfNeeded(this._value, r), (0, fe.setLastUsedStyle)(this._value, e.symbolInfo()), (0, fe.preparePriceAxisProperties)(t), (0, ge.saveDefaultProperties)(!1), this._invalidateModel(), this._chartWidget.screen.show(!0)
        }
        undo() {
            const e = this._mainSeries;
            (0, ge.saveDefaultProperties)(!0), e.setChartStyleWithIntervalIfNeeded(this._prevValue, this._prevResolution), this._restorePriceAxisProps(), ve.linking.interval.setValue(this._prevResolution), (0, ge.saveDefaultProperties)(!1), this._invalidateModel(), this._chartWidget.screen.show(!0)
        }
        _storePriceAxisProps() {
            const e = this._mainSeries.priceScale();
            this._prevPriceAxisProps = e.mode()
        }
        _restorePriceAxisProps() {
            this._mainSeries.priceScale().setMode(this._prevPriceAxisProps)
        }
        _invalidateModel() {
            this._model && (this._model.recalculateAllPanes((0, ye.sourceChangeEvent)(this._model.mainSeries().id())), this._model.lightUpdate())
        }
    }
    const we = new T.TranslatedString("change date range", l.t(null, void 0, i(7151)));
    class Pe extends k.UndoCommand {
        constructor(e, t) {
            super(we), this._modelsData = [], this._rangeOptions = t, this._modelsData.push({
                model: e,
                prevResolution: e.mainSeries().properties().childs().interval.value(),
                barSpacing: e.timeScale().barSpacing(),
                rightOffset: e.timeScale().rightOffset(),
                rangeOptions: e.appliedTimeFrame().value()
            })
        }
        redo() {
            for (const e of this._modelsData) {
                const t = e.model.mainSeries(),
                    i = t.properties().childs().interval;
                p.Interval.isEqual(this._rangeOptions.res, i.value()) ? t.loadDataTo(this._rangeOptions.val) : (t.setDefaultTimeframe(this._rangeOptions.val), t.setSymbolParams({
                    interval: this._rangeOptions.res
                }))
            }
        }
        undo() {
            for (const e of this._modelsData) {
                const t = e.model.mainSeries(),
                    i = t.properties().childs().interval;
                e.prevResolution !== i.value() ? (null !== e.rangeOptions && t.setDefaultTimeframe(e.rangeOptions.val), t.setSymbolParams({
                    interval: e.prevResolution
                })) : null !== e.rangeOptions && t.loadDataTo(e.rangeOptions.val);
                const s = e.model.timeScale();
                s.setBarSpacing(e.barSpacing), s.setRightOffset(e.rightOffset)
            }
        }
        canMerge(e) {
            return e instanceof Pe && _(e._rangeOptions, this._rangeOptions)
        }
        merge(e) {
            if (!(e instanceof Pe)) throw new Error("Invalid command to merge");
            this._modelsData = this._modelsData.concat(e._modelsData)
        }
    }
    var Ce = i(35588);
    i(42053);
    class xe extends k.UndoCommand {
        constructor(e, t, i) {
            super(i),
                this._model = e, this._groupId = t.id, this._groupName = t.name(), this._lineToolsIds = t.lineTools().map((e => e.id()))
        }
        redo() {
            const e = (0, o.ensureNotNull)(this._model.lineToolsGroupModel().groupForId(this._groupId));
            this._model.lineToolsGroupModel().removeGroup(e)
        }
        undo() {
            const e = this._lineToolsIds.map((e => this._model.dataSourceForId(e))),
                t = new Ce.LineToolsGroup(e, this._groupName, this._groupId);
            this._model.lineToolsGroupModel().addGroup(t)
        }
    }
    const Te = new T.TranslatedString("create line tools group", l.t(null, void 0, i(3195)));
    class Ie extends k.UndoCommand {
        constructor(e, t) {
            super(Te), this._groupId = null, this._model = e, this._sourcesIds = t.map((e => e.id()))
        }
        redo() {
            const e = this._sourcesIds.map((e => this._model.dataSourceForId(e))),
                t = null === this._groupId ? void 0 : this._groupId;
            this._groupId = this._model.lineToolsGroupModel().createGroup(e, this._title, t).id
        }
        undo() {
            const e = (0, o.ensureNotNull)(this._model.lineToolsGroupModel().groupForId((0, o.ensureNotNull)(this._groupId)));
            this._model.lineToolsGroupModel().removeGroup(e)
        }
        createdGroupId() {
            return this._groupId
        }
    }
    const Me = new T.TranslatedString("add line tool(s) to group {group}", l.t(null, void 0, i(40242)));
    class Ae extends k.UndoCommand {
        constructor(e, t, i) {
            super(Me.format({
                group: t.name()
            })), this._model = e, this._groupId = t.id, this._lineToolsIds = i.map((e => e.id()))
        }
        redo() {
            const e = (0, o.ensureNotNull)(this._model.lineToolsGroupModel().groupForId(this._groupId)),
                t = this._lineToolsIds.map((e => this._model.dataSourceForId(e)));
            e.addLineTools(t)
        }
        undo() {
            const e = this._lineToolsIds.map((e => this._model.dataSourceForId(e)));
            (0, o.ensureNotNull)(this._model.lineToolsGroupModel().groupForId(this._groupId)).excludeLineTools(e)
        }
    }
    class Le extends k.UndoCommand {
        constructor(e, t, i, s, r) {
            super(i), this._targetObj = e, this._newValue = t, this._oldValue = this._targetObj.value(), this._model = s, r && this.setCustomFlag("doesnt_affect_save", !0)
        }
        redo() {
            (0, ge.saveDefaultProperties)(!0), this._targetObj.setValue(this._newValue), (0, ge.saveDefaultProperties)(!1), this._model.recalculateAllPanes((0, ye.globalChangeEvent)()), this._model.lightUpdate()
        }
        undo() {
            (0, ge.saveDefaultProperties)(!0), this._targetObj.setValue(this._oldValue), (0, ge.saveDefaultProperties)(!1), this._model.recalculateAllPanes((0, ye.globalChangeEvent)()), this._model.lightUpdate()
        }
    }
    class ke extends k.UndoCommand {
        constructor(e, t, i, s) {
            super(s), this._chartModel = e, this._groupId = t.id, this._oldName = t.name(), this._newName = i
        }
        redo() {
            (0, o.ensureNotNull)(this._chartModel.lineToolsGroupModel().groupForId(this._groupId)).setName(this._newName)
        }
        undo() {
            (0, o.ensureNotNull)(this._chartModel.lineToolsGroupModel().groupForId(this._groupId)).setName(this._oldName)
        }
    }
    var Ee = i(88348);
    const De = new T.TranslatedString("create line tools group from selection", l.t(null, void 0, i(92659))),
        Ve = new T.TranslatedString("removing line tools group {name}", l.t(null, void 0, i(78811))),
        Be = new T.TranslatedString("add line tool {lineTool} to group {name}", l.t(null, void 0, i(99113))),
        Re = new T.TranslatedString("make group {group} visible", l.t(null, void 0, i(87927))),
        Ne = new T.TranslatedString("make group {group} invisible", l.t(null, void 0, i(45223))),
        Oe = new T.TranslatedString("lock group {group}", l.t(null, void 0, i(4963))),
        Fe = new T.TranslatedString("unlock group {group}", l.t(null, void 0, i(51114))),
        We = new T.TranslatedString("rename group {group} to {newName}", l.t(null, void 0, i(16338)));
    class ze {
        constructor(e) {
            this._lineToolsAffectChartInvalidation = new P.FeatureToggleWatchedValue("do_not_invalidate_chart_on_changing_line_tools", !1), this._environment = e
        }
        createGroupFromSelection() {
            const e = this._environment.model();
            (0, o.assert)(!e.selection().isEmpty(), "Cannot create group from empty selection");
            const t = (0, F.sortSources)(e.selection().lineDataSources());
            (0, o.assert)(t.length === e.selection().allSources().length, "A group could contain line tools only");
            const i = t.length > 1 || null !== this._environment.model().lineToolsGroupModel().groupForLineTool(t[0]),
                s = t.reduce(((e, t) => e.zorder() > t.zorder() ? e : t), t[0]);
            let r = s;
            const n = e.lineToolsGroupModel().groupForLineTool(s);
            if (null !== n) {
                const e = n.lineTools();
                r = e[e.length - 1]
            }
            this._environment.beginUndoMacro(De, this._lineToolsAffectChartInvalidation.value());
            const a = new Map,
                l = new Set;
            t.forEach((t => {
                const i = this._groupForLineTool(t);
                if (null === i) return;
                const s = a.get(i) || [];
                s.push(t), a.set(i, s);
                const r = (0, o.ensureNotNull)(e.paneForSource(t));
                l.add(r)
            })), (0, o.assert)(l.size <= 1, "All selected sources should be on the same pane"), a.forEach(((t, i) => {
                const s = new B.ExcludeLineToolsFromGroupUndoCommand(e, i, t);
                this._environment.pushUndoCommand(s)
            }));
            const c = new Ie(e, (0, F.sortSources)(t));
            if (this._environment.pushUndoCommand(c), i) {
                const i = new ie(e, t, r);
                this._environment.pushUndoCommand(i)
            }
            this._environment.endUndoMacro();
            const h = (0, o.ensureNotNull)(c.createdGroupId());
            return (0, o.ensureNotNull)(e.lineToolsGroupModel().groupForId(h))
        }
        removeGroup(e) {
            const t = this._environment.model(),
                i = e.lineTools();
            this._environment.beginUndoMacro(Ve.format({
                name: e.name()
            }), this._lineToolsAffectChartInvalidation.value());
            const s = new xe(t, e, null);
            this._environment.pushUndoCommand(s);
            const r = new V.RemoveSourcesCommand(t, i, null);
            this._environment.pushUndoCommand(r);
            const n = t.mainSeries().symbol();
            i.forEach((e => {
                null !== e.linkKey().value() && (0, Ee.removeLineTool)({
                    withUndo: !0,
                    model: t,
                    symbol: n,
                    sourceTitle: new T.TranslatedString(e.name(), e.title()),
                    lineToolState: e.state(!1),
                    linkKey: (0, o.ensureNotNull)(e.linkKey().value())
                })
            })), this._environment.endUndoMacro()
        }
        groups() {
            return this._environment.model().lineToolsGroupModel().groups()
        }
        excludeLineToolFromGroup(e, t) {
            const i = this._environment.model(),
                s = new B.ExcludeLineToolsFromGroupUndoCommand(i, e, [t]);
            s.setCustomFlag("doesnt_affect_save", this._lineToolsAffectChartInvalidation.value()),
                this._environment.pushUndoCommand(s)
        }
        addLineToolToGroup(e, t) {
            const i = this._environment.model(),
                s = i.lineToolsGroupModel().groupForLineTool(t);
            if (s === e) return;
            const r = Be.format({
                lineTool: new T.TranslatedString(t.name(), t.title()),
                name: e.name()
            });
            this._environment.beginUndoMacro(r, this._lineToolsAffectChartInvalidation.value()), null !== s && this._environment.pushUndoCommand(new B.ExcludeLineToolsFromGroupUndoCommand(i, s, [t])), this._environment.pushUndoCommand(new Ae(i, e, [t])), this._environment.endUndoMacro()
        }
        bringToFront(e) {
            const t = this._environment.model(),
                i = new Q(t, e.lineTools());
            i.setCustomFlag("doesnt_affect_save", this._lineToolsAffectChartInvalidation.value()), this._environment.pushUndoCommand(i), this._environment.emitEvent("changeZOrder", [e.lineTools()])
        }
        sendToBack(e) {
            const t = this._environment.model(),
                i = new ee(t, e.lineTools());
            i.setCustomFlag("doesnt_affect_save", this._lineToolsAffectChartInvalidation.value()), this._environment.pushUndoCommand(i), this._environment.emitEvent("changeZOrder", [e.lineTools()])
        }
        bringForward(e) {
            const t = this._environment.model(),
                i = new de(t, e);
            i.setCustomFlag("doesnt_affect_save", this._lineToolsAffectChartInvalidation.value()), this._environment.pushUndoCommand(i), this._environment.emitEvent("changeZOrder", [e.lineTools()])
        }
        sendBackward(e) {
            const t = this._environment.model(),
                i = new he(t, e);
            i.setCustomFlag("doesnt_affect_save", this._lineToolsAffectChartInvalidation.value()), this._environment.pushUndoCommand(i), this._environment.emitEvent("changeZOrder", [e.lineTools()])
        }
        insertAfter(e, t) {
            const i = this._environment.model();
            let s;
            if (t instanceof Ce.LineToolsGroup) {
                const e = t.lineTools();
                s = e[e.length - 1]
            } else s = t;
            const r = new ie(i, e.lineTools(), s);
            this._environment.pushUndoCommand(r), this._environment.emitEvent("changeZOrder", [e.lineTools()])
        }
        insertBefore(e, t) {
            const i = this._environment.model();
            let s;
            if (t instanceof Ce.LineToolsGroup) {
                s = t.lineTools()[0]
            } else s = t;
            const r = new re(i, e.lineTools(), s);
            this._environment.pushUndoCommand(r), this._environment.emitEvent("changeZOrder", [e.lineTools()])
        }
        availableZOrderOperations(e) {
            const t = this._environment.model(),
                i = e.lineTools(),
                s = i[0],
                r = i[i.length - 1],
                n = (0, o.ensureNotNull)(t.paneForSource(i[0])).sourcesByGroup().allExceptSpecialSources(),
                a = n[0],
                l = n[n.length - 1];
            return {
                bringForwardEnabled: r !== l,
                bringToFrontEnabled: r !== l,
                sendBackwardEnabled: s !== a,
                sendToBackEnabled: s !== a
            }
        }
        setGroupVisibility(e, t) {
            const i = (t ? Re : Ne).format({
                    group: e.name()
                }),
                s = this._environment.model();
            this._environment.beginUndoMacro(i, this._lineToolsAffectChartInvalidation.value()), e.lineTools().forEach((e => {
                const i = e.properties().visible,
                    r = new Le(i, t, null, s);
                this._environment.pushUndoCommand(r)
            })), this._environment.endUndoMacro()
        }
        setGroupLock(e, t) {
            const i = (t ? Oe : Fe).format({
                    group: e.name()
                }),
                s = this._environment.model();
            this._environment.beginUndoMacro(i, this._lineToolsAffectChartInvalidation.value()), e.lineTools().forEach((e => {
                const i = e.properties().frozen,
                    r = new Le(i, t, null, s);
                this._environment.pushUndoCommand(r)
            })), this._environment.endUndoMacro()
        }
        setGroupName(e, t) {
            const i = this._environment.model(),
                s = We.format({
                    group: e.name(),
                    newName: t
                }),
                r = new ke(i, e, t, s);
            r.setCustomFlag("doesnt_affect_save", this._lineToolsAffectChartInvalidation.value()), this._environment.pushUndoCommand(r)
        }
        canBeGroupped(e) {
            const t = this._environment.model();
            return new Set(e.map((e => t.paneForSource(e)))).size <= 1
        }
        _groupForLineTool(e) {
            return this._environment.model().lineToolsGroupModel().groups().find((t => t.containsLineTool(e))) || null
        }
    }
    var He = i(58121),
        Ue = i(35115),
        je = i(53588),
        Ge = i(63009);
    const qe = new T.TranslatedString("apply study template {template}", l.t(null, void 0, i(26065)));

    function $e(e) {
        for (const t of e.panes)
            for (const e of t.sources)
                if ((0, je.isMainSeriesState)(e)) return e.id;
        return null
    }
    class Ye extends k.UndoCommand {
        constructor(e, t, i) {
            var s, r;
            super(qe.format({
                template: i
            })), this._newSymbolParams = {}, this._model = e, this._templateContent = function(e, t) {
                const i = (0, He.default)({}, e),
                    s = (0, o.ensureNotNull)($e(i));
                for (const e of i.panes) {
                    e.mainSourceId === s && (e.mainSourceId = t);
                    for (const i of e.sources)
                        if (i.id === s) {
                            i.id = t;
                            const r = e => {
                                const i = e.indexOf(s); - 1 !== i && e.splice(i, 1, t)
                            };
                            if (e.leftAxisesState && e.rightAxisesState ? (e.leftAxisesState.forEach((e => r(e.sources))), e.rightAxisesState.forEach((e => r(e.sources)))) : (r(e.leftAxisSources), r(e.rightAxisSources)), e.overlayPriceScales) {
                                const i = e.overlayPriceScales[s];
                                i && (delete e.overlayPriceScales[s], e.overlayPriceScales[t] = i)
                            }
                        } else i.ownerSource === s && (i.ownerSource = t)
                }
                return i
            }(t, e.mainSeries().id()), this._initialState = e.studyTemplate(!0, !0, !0);
            const n = e.mainSeries();
            t.symbol && (this._newSymbolParams = {
                symbol: t.symbol,
                currency: null !== (s = t.currency) && void 0 !== s ? s : null,
                unit: null !== (r = t.unit) && void 0 !== r ? r : null
            }), t.interval && (this._newSymbolParams.interval = t.interval, this._newSymbolParams.style = (0, fe.getChartStyleByResolution)(t.interval, n.style())), this._initialSymbolParams = {
                symbol: n.symbol(),
                currency: n.currency(),
                unit: n.unit(),
                interval: n.interval(),
                style: n.style()
            }, this._initialState = e.studyTemplate(), this._initialGroupsState = e.lineToolsGroupModel().state()
        }
        redo() {
            this._model.mainSeries().setSymbolParams(this._newSymbolParams);
            const e = this._merge(this._templateContent).filter(f.isLineTool);
            this._model.lineToolsGroupModel().removeLineTools(e);
            const t = this._model.mainSeries().properties();
            (0, fe.preparePriceAxisProperties)(t), this._model.recalcVisibleRangeStudies(!0), this._model.setShouldBeSavedEvenIfHidden(!0)
        }
        undo() {
            this._model.mainSeries().setSymbolParams(this._initialSymbolParams), this._merge(this._initialState)
        }
        _merge(e) {
            const t = e.version || 0,
                i = this._model,
                s = i.mainSeries();
            (0, o.assert)(s.id() === $e(e)), s.priceScale().properties().childs().lockScale.setValue(!1);
            const r = i.panes(),
                n = [];
            for (let e = r.length; e--;) {
                const t = r[e],
                    i = t.containsMainSeries(),
                    s = t.dataSources();
                for (let e = s.length; e--;) {
                    const t = s[e];
                    (!i || (0, x.isStudy)(t) && t.isRemovedByStudyTemplates()) && n.push(t)
                }
            }
            i.resetDeferredStudies();
            const a = (0, Ue.closeSourcesSet)(i, n);
            for (let e = 0; e < a.length; ++e) i.removeSource(a[e]);
            const l = e.panes;
            for (let e = 0; e < l.length; e++) {
                let s = -1;
                const n = (0, I.clone)(l[e]);
                n.sources.sort(((e, t) => e.zorder - t.zorder));
                for (let e = 0; e < n.sources.length; e++) {
                    const t = n.sources[e];
                    if ((0, je.isMainSeriesState)(t)) {
                        delete t.state, s = e;
                        break
                    }
                }
                const o = s > -1,
                    a = o ? r[e] : i.createPane(e);
                o && t < 3 && (0, Ge.reorderDataSourcesStateZOrder)(n.sources), a.restoreState(n, !1, t), null !== a.mainDataSource() || i.removePane(a)
            }
            return i.syncLollipopSources(), s.priceScale().setMode({
                autoScale: !0
            }), i.startNotStartedStudies(), i.recalculateAllPanes((0, ye.globalChangeEvent)()), i.fullUpdate(), a
        }
    }
    var Ke = i(18611);
    const Ze = (0, C.getLogger)("Chart.ChartUndoModel"),
        Xe = new T.TranslatedString("paste drawing", l.t(null, void 0, i(96916)));
    class Je extends k.UndoCommand {
        constructor(e, t, i, s, r) {
            super(Xe), this._needCopyToOtherCharts = !1, this._sourceState = null, this._model = e, this._clipboardData = t, this._paneIndex = this._model.panes().indexOf(i || (0, o.ensureNotNull)(this._model.paneForSource(this._model.mainSeries()))), this._pasteWithData = !!s, this._keepZIndex = !!r
        }
        redo() {
            const e = this._model.panes()[this._paneIndex],
                t = (0, o.ensureNotNull)(e.clipboardLineToolOwnerSource(this._clipboardData.source.id));
            null === this._sourceState && (this._sourceState = this._getSourceState(t));
            const i = (0, o.ensureNotNull)(e.restoreLineTool(this._sourceState, this._pasteWithData, this._keepZIndex, void 0, t));
            (0, o.ensureNotNull)(t.priceScale()).addDataSource(i), this._clipboardData.centeredOnChart && i.centerPosition && i.centerPosition(), i.restoreFixedPoint(), i.createServerPoints();
            const s = (0, Ke.isActingAsSymbolSource)(t) || t.metaInfo().is_price_study;
            this._needCopyToOtherCharts = Boolean(s && ((0, Ee.drawOnAllCharts)().value() || i.linkKey().value() && i.isSynchronizable())), this._model.setShouldBeSavedEvenIfHidden(!0)
        }
        undo() {
            if (!this._sourceState) return void Ze.logError("This command was never executed - nothing to undo");
            const e = this.source();
            this._clipboardData.centeredOnChart && (this._clipboardData.centeredOnChart = !1, this._sourceState.points = e.normalizedPoints()), this._model.removeSource(e)
        }
        source() {
            return (0, o.ensureNotNull)(this._model.dataSourceForId((0, o.ensureNotNull)(this._sourceState).id))
        }
        needCopyToOtherCharts() {
            return this._needCopyToOtherCharts
        }
        _getSourceState(e) {
            const t = (0, I.clone)(this._clipboardData.source);
            delete t.state.symbol, null != t.linkKey && (t.linkKey = (0, S.randomHash)());
            const i = (0, o.ensureNotNull)(e.priceScale()),
                s = this._model,
                {
                    symbol: r,
                    currencyId: n,
                    unitId: l
                } = this._clipboardData.source.state,
                c = (0, o.ensureNotNull)(e.symbolSource());
            let h = !1;
            !c.symbolSameAsCurrent(r) || (null !== n ? n !== (0, fe.symbolCurrency)(c.symbolInfo(), void 0, !0) : c.isConvertedToOtherCurrency()) || (null !== l ? l !== (0, fe.symbolUnit)(c.symbolInfo(), this._model.unitConversionEnabled()) : c.isConvertedToOtherUnit()) || ((0, Ke.isActingAsSymbolSource)(e) ? h = !0 : (0, x.isStudy)(e) && (h = Boolean(e.metaInfo().is_price_study)));
            const d = e => {
                    const t = e.x * s.timeScale().width(),
                        r = e.y * i.height() - 40;
                    return new a.Point(t, r)
                },
                u = (0, o.ensureNotNull)(e.firstValue());
            if (this._model.id() === this._clipboardData.modelId || !h)
                for (let e = 0; e < this._clipboardData.geometry.length; ++e) {
                    const r = d(this._clipboardData.geometry[e]),
                        n = s.timeScale().coordinateToIndex(r.x),
                        o = s.timeScale().normalizeBarIndex(n);
                    if (h) {
                        const s = i.priceToCoordinate(t.points[e].price, u) + -40;
                        o.price = i.coordinateToPrice(s, u)
                    } else o.price = i.coordinateToPrice(r.y, u);
                    t.points[e] = o
                }
            return t.id = (0, S.randomHashN)(6), t
        }
    }
    var Qe = i(87115),
        et = i(84265),
        tt = i(99778),
        it = i(69109);
    class st extends k.UndoCommand {
        constructor(e, t, i, s) {
            super(e), this._charts = new Map, this._firstRedo = !0, this._creationTime = performance.now(), this._linkingGroupIndex = s.linkingGroupIndex().value(), this._charts.set(s, {
                sourceId: t.id(),
                newSymbolParams: i,
                prevSymbolParams: {
                    symbol: t.symbol(),
                    currency: t.currency(),
                    unit: t.unit(),
                    interval: t.interval(),
                    style: t.style()
                },
                showFade: this._showFade(t, s),
                chartWidget: s
            })
        }
        redo() {
            this._firstRedo || (0, it.muteLinkingGroup)(this._linkingGroupIndex, !0), this._charts.forEach((e => {
                this._symbolSource(e).setSymbolParams(e.newSymbolParams), e.showFade && e.chartWidget.screen.show(!0)
            })), this._firstRedo || (0, it.muteLinkingGroup)(this._linkingGroupIndex, !1), this._firstRedo = !1
        }
        undo() {
            (0, it.muteLinkingGroup)(this._linkingGroupIndex, !0), this._charts.forEach((e => {
                this._symbolSource(e).setSymbolParams(e.prevSymbolParams), e.showFade && e.chartWidget.screen.show(!0)
            })), (0, it.muteLinkingGroup)(this._linkingGroupIndex, !1)
        }
        canMerge(e) {
            if (!(e instanceof st) || e._linkingGroupIndex !== this._linkingGroupIndex || !this._containsMainSeriesOnly() || !e._containsMainSeriesOnly() || e._creationTime - this._creationTime > 500) return !1;
            for (const [t] of e._charts)
                if (this._charts.has(t)) return !1;
            return !0
        }
        merge(e) {
            if (e instanceof st)
                for (const [t, i] of e._charts) this._charts.set(t, i)
        }
        _showFade(e, t) {
            return e === t.model().mainSeries()
        }
        _symbolSource(e) {
            return (0, o.ensureNotNull)(e.chartWidget.model().model().dataSourceForId(e.sourceId))
        }
        _containsMainSeriesOnly() {
            for (const [e, t] of this._charts)
                if (t.sourceId !== e.model().mainSeries().id()) return !1;
            return !0
        }
    }
    const rt = new T.TranslatedString("change symbol", l.t(null, void 0, i(526)));
    class nt extends st {
        constructor(e, t, i) {
            super(rt, e, {
                symbol: t,
                currency: null,
                unit: null
            }, i), this._symbol = t
        }
        canMerge(e) {
            return e instanceof nt && e._symbol === this._symbol && super.canMerge(e)
        }
    }
    const ot = (0, C.getLogger)("Chart.ChartUndoModel"),
        at = new T.TranslatedString("paste indicator", l.t(null, void 0, i(80611)));
    class lt extends k.UndoCommand {
        constructor(e, t, i) {
            super(at), this._sourceState = null, this._model = e, this._clipboardData = t, this._paneId = i
        }
        redo() {
            if (!this._sourceState) {
                const e = (0, I.clone)(this._clipboardData.source);
                e.id = (0, S.randomHashN)(6), this._sourceState = e
            }
            let e, t;
            e = this._paneId ? (0, o.ensureNotNull)(this._model.paneForId(this._paneId)) : this._sourceState.metaInfo.is_price_study ? (0, o.ensureNotNull)(this._model.paneForSource(this._model.mainSeries())) : this._model.createPane();
            const i = !e.mainDataSource();
            this._sourceState.zorder = e.newStudyZOrder();
            const s = (0, o.ensureNotNull)(e.restoreStudy(this._sourceState, !1));
            i || (t = this._sourceState.metaInfo.is_price_study ? t = this._model.mainSeries().priceScale() : this._paneId ? e.findSuitableScale(s) : e.defaultPriceScale(), t !== s.priceScale() && e.move(s, t)), (0,
                x.isStudy)(s) && s.start()
        }
        undo() {
            if (null === this._sourceState) return void ot.logError("This command was never executed - nothing to undo");
            const e = (0, o.ensureNotNull)(this._model.dataSourceForId(this._sourceState.id));
            this._model.removeSource(e)
        }
        state() {
            return this._sourceState
        }
    }
    class ct extends k.UndoCommand {
        constructor(e, t, i, s, r) {
            super(null, !1), this._model = e, this._paneA = t, this._paneB = i, this._prevStretchA = s, this._currStretchA = r
        }
        redo() {
            const e = this._paneA.stretchFactor() + this._paneB.stretchFactor();
            this._paneA.setStretchFactor(this._currStretchA), this._paneB.setStretchFactor(e - this._currStretchA), this._model.fullUpdate()
        }
        undo() {
            const e = this._paneA.stretchFactor() + this._paneB.stretchFactor();
            this._paneA.setStretchFactor(this._prevStretchA), this._paneB.setStretchFactor(e - this._prevStretchA), this._model.fullUpdate()
        }
    }
    var ht = i(81155);
    const dt = new T.TranslatedString("move", l.t(null, void 0, i(47107)));
    class ut extends k.UndoCommand {
        constructor(e, t, i, s) {
            super(dt, !1), this._endEvent = null, this._model = e, this._sourceId = t.id(), this._itemIndex = i, this._startEvent = s
        }
        move(e) {
            this._endEvent = e, this._move(e)
        }
        hasChanges() {
            return null !== this._endEvent
        }
        undo() {
            this._move(this._startEvent)
        }
        redo() {
            this._move((0, o.ensureNotNull)(this._endEvent))
        }
        _move(e) {
            const t = (0, o.ensureNotNull)(this._model.dataSourceForId(this._sourceId));
            (0, o.assert)(void 0 !== t.moveItem, 'The method "moveItem" is not defined'), t.moveItem && t.moveItem(new a.Point(e.localX, e.localY), this._itemIndex, new ht.EnvironmentState(e))
        }
    }
    class pt extends k.UndoCommand {
        constructor(e, t, i, s, r, n, o, a, l, c, h, d) {
            super(d), this._studyId = null, this._paneState = null, this._lastInsertionStartPromise = null, this._chartModel = e, this._studyMetaInfo = t, this._props = s, this._addAsOverlay = r, this._parentIds = n.map((e => e.id())), this._inputs = i, this._targetZOrder = h, this._preferredPriceScale = o, this._allowChangeCurrency = a, this._allowChangeUnit = l, this._paneSize = c
        }
        redo() {
            const e = this._parentIds.map((e => this._chartModel.dataSourceForId(e))),
                t = this._chartModel.insertStudyWithParams(this._studyMetaInfo, this._inputs, this._targetZOrder, this._props, this._addAsOverlay, e, this._preferredPriceScale, this._allowChangeCurrency, this._allowChangeUnit, this._paneSize, null === this._studyId ? void 0 : this._studyId),
                i = t.study;
            if (this._lastInsertionStartPromise = t.startPromise, this._studyId = i.id(), i.childStudyByRebind().subscribe(null, (() => (0, y.trackEvent)("SOS", "Apply SOS", "Rebind SOS"))), this._chartModel.setShouldBeSavedEvenIfHidden(!0), null !== this._paneState) {
                (0, o.ensureNotNull)(this._chartModel.paneForSource(i)).restoreState(this._paneState, !1, this._chartModel.version()), this._paneState = null
            }
        }
        undo() {
            const e = (0, o.ensureNotNull)(this._chartModel.dataSourceForId((0, o.ensureNotNull)(this._studyId))),
                t = (0, o.ensureNotNull)(this._chartModel.paneForSource(e)).state();
            this._chartModel.removeSource(e) && (this._paneState = t)
        }
        insertedStudy() {
            return this._chartModel.dataSourceForId((0, o.ensureNotNull)(this._studyId))
        }
        lastInsertionStartPromise() {
            var e;
            return null !== (e = this._lastInsertionStartPromise) && void 0 !== e ? e : Promise.resolve()
        }
    }
    var _t = i(95367),
        mt = i(20585),
        gt = i.n(mt),
        ft = i(26512),
        vt = i(67521);
    const St = new T.TranslatedString("zoom", l.t(null, void 0, i(59833)));
    class yt extends k.UndoCommand {
        constructor(e, t, i, s, r, n) {
            super(St), this._barSpacing = null, this._rightBarsOffset = null, this._leftBarsOffset = null, this._priceMode = null, this._model = e, this._startBar = t, this._endBar = i, this._startPrice = s, this._endPrice = r, this._pane = n
        }
        redo() {
            const e = (0, o.ensureNotNull)(this._model.timeScale().visibleBarsStrictRange());
            this._leftBarsOffset = e.firstBar() - this._startBar, this._rightBarsOffset = e.lastBar() - this._endBar, this._barSpacing = this._model.timeScale().barSpacing(), this._priceMode = this._pane.defaultPriceScale().mode(), this._model.zoomToViewport(this._startBar, this._endBar, this._startPrice, this._endPrice, this._pane)
        }
        undo() {
            const e = this._model.timeScale(),
                t = this._pane.defaultPriceScale(),
                i = (0, o.ensureNotNull)(e.visibleBarsStrictRange());
            e.setBarSpacing((0, o.ensureNotNull)(this._barSpacing)), e.zoomToBarsRange(i.firstBar() + (0, o.ensureNotNull)(this._leftBarsOffset), i.lastBar() + (0, o.ensureNotNull)(this._rightBarsOffset)), t.setMode((0, o.ensureNotNull)(this._priceMode)), t.recalculatePriceRange((0, o.ensureNotNull)(e.visibleBarsStrictRange())), this._model.recalculateAllPanes((0, ye.viewportChangeEvent)()), this._model.lightUpdate()
        }
    }
    const bt = (0, C.getLogger)("Chart.ChartUndoModel"),
        wt = new T.TranslatedString("zoom", l.t(null, void 0, i(59833)));
    class Pt extends k.UndoCommand {
        constructor(e, t, i) {
            super(wt), this._baseCmd = e, this._zoomStack = t, this._inOut = i
        }
        undo() {
            if (this._inOut) {
                if (this._baseCmd !== this._zoomStack.head()) return void bt.logDebug("zoom stack inconsistency");
                this._baseCmd.undo(), this._zoomStack.pop()
            } else this._baseCmd.redo(), this._zoomStack.push(this._baseCmd)
        }
        redo() {
            if (this._inOut) this._baseCmd.redo(), this._zoomStack.push(this._baseCmd);
            else {
                if (this._baseCmd !== this._zoomStack.head()) return void bt.logDebug("zoom stack inconsistency");
                this._baseCmd.undo(), this._zoomStack.pop()
            }
        }
    }
    const Ct = new T.TranslatedString("stop syncing drawing", l.t(null, void 0, i(98784)));
    class xt extends k.UndoCommand {
        constructor(e, t) {
            super(Ct), this._model = e, this._sourceId = t.id(), this._linkKey = t.linkKey().value()
        }
        redo() {
            (0, o.ensureNotNull)(this._model.dataSourceForId(this._sourceId)).linkKey().setValue(null)
        }
        undo() {
            (0, o.ensureNotNull)(this._model.dataSourceForId(this._sourceId)).linkKey().setValue(this._linkKey)
        }
    }
    const Tt = new T.TranslatedString("restore defaults", l.t(null, void 0, i(9608)));
    class It extends k.UndoCommand {
        constructor(e, t, i = Tt) {
            super(i), this._chartModel = e, this._defaultProperty = t, this._state = t.state()
        }
        redo() {
            this._chartModel.restoreFactoryDefaults(this._defaultProperty)
        }
        undo() {
            this._defaultProperty.mergeAndFire(this._state), this._chartModel.mainSeries().onChartStyleChanged()
        }
    }
    var Mt = i(17236);
    class At extends It {
        redo() {
            this._defaultProperty.hasChild("intervalsVisibilities") && this._defaultProperty.childs().intervalsVisibilities.mergeAndFire(Mt.intervalsVisibilitiesDefaults), super.redo()
        }
    }
    class Lt extends At {
        redo() {
            super.redo(), this._chartModel.recalcColorStudies(!0)
        }
        undo() {
            super.undo(),
                this._chartModel.recalcColorStudies(!0)
        }
    }
    var kt = i(4949),
        Et = i(30888),
        Dt = i(85804);

    function Vt(e) {
        const {
            visible: t,
            ...i
        } = e;
        return i
    }

    function Bt(e) {
        const {
            visible: t,
            ...i
        } = e;
        return i
    }

    function Rt(e) {
        const {
            drawWick: t,
            drawBorder: i,
            drawBody: s,
            barColorsOnPrevClose: r,
            ...n
        } = e;
        return n
    }

    function Nt(e) {
        const {
            drawWick: t,
            drawBorder: i,
            drawBody: s,
            ...r
        } = e;
        return r
    }

    function Ot(e) {
        const {
            drawWick: t,
            drawBorder: i,
            drawBody: s,
            showRealLastPrice: r,
            inputs: n,
            ...o
        } = e;
        return o
    }

    function Ft(e) {
        const {
            barColorsOnPrevClose: t,
            dontDrawOpen: i,
            thinBars: s,
            ...r
        } = e;
        return r
    }

    function Wt(e) {
        const {
            showBorders: t,
            showLabels: i,
            drawBody: s,
            ...r
        } = e;
        return r
    }

    function zt(e) {
        const {
            linestyle: t,
            linewidth: i,
            priceSource: s,
            ...r
        } = e;
        return r
    }

    function Ht(e) {
        const {
            linestyle: t,
            linewidth: i,
            priceSource: s,
            ...r
        } = e;
        return r
    }

    function Ut(e) {
        const {
            inputs: t,
            ...i
        } = e;
        return i
    }

    function jt(e) {
        const {
            inputs: t,
            ...i
        } = e;
        return i
    }

    function Gt(e) {
        const {
            inputs: t,
            ...i
        } = e;
        return i
    }

    function qt(e) {
        const {
            inputs: t,
            ...i
        } = e;
        return i
    }

    function $t(e) {
        const {
            topLineWidth: t,
            bottomLineWidth: i,
            baseLevelPercentage: s,
            priceSource: r,
            ...n
        } = e;
        return n
    }

    function Yt(e) {
        const {
            thinBars: t,
            inputs: i,
            ...s
        } = e;
        return s
    }

    function Kt(e) {
        const {
            visible: t,
            style: i,
            symbol: s,
            interval: r,
            sessionId: n,
            highLowAvgPrice: o,
            showCountdown: a,
            bidAsk: l,
            prePostMarket: c,
            priceAxisProperties: h,
            candleStyle: d,
            hollowCandleStyle: u,
            haStyle: p,
            barStyle: _,
            hiloStyle: m,
            lineStyle: g,
            lineWithMarkersStyle: f,
            steplineStyle: v,
            areaStyle: S,
            renkoStyle: y,
            pbStyle: b,
            kagiStyle: w,
            pnfStyle: P,
            baselineStyle: C,
            rangeStyle: x,
            esdShowDividends: T,
            esdShowSplits: I,
            esdShowEarnings: M,
            esdShowBreaks: A,
            showContinuousContractSwitches: L,
            showContinuousContractSwitchesBreaks: k,
            showFuturesContractExpiration: E,
            showLastNews: D,
            ...V
        } = e;
        return {
            bidAsk: Vt(l),
            prePostMarket: Bt(c),
            candleStyle: Rt(d),
            hollowCandleStyle: Nt(u),
            haStyle: Ot(p),
            barStyle: Ft(_),
            hiloStyle: Wt(m),
            lineStyle: zt(g),
            lineWithMarkersStyle: zt(f),
            steplineStyle: zt(v),
            areaStyle: Ht(S),
            renkoStyle: Ut(y),
            pbStyle: jt(b),
            kagiStyle: Gt(w),
            pnfStyle: qt(P),
            baselineStyle: $t(C),
            rangeStyle: Yt(x),
            ...V
        }
    }

    function Zt(e) {
        const {
            scaleSeriesOnly: t,
            showSeriesLastValue: i,
            showStudyLastValue: s,
            showSymbolLabels: r,
            showBidAskLabels: n,
            showPrePostMarketPriceLabel: o,
            showStudyPlotLabels: a,
            showFundamentalNameLabel: l,
            showFundamentalLastValue: c,
            seriesLastValueMode: h,
            ...d
        } = e;
        return d
    }

    function Xt(e) {
        const {
            topMargin: t,
            bottomMargin: i,
            ...s
        } = e;
        return s
    }
    const Jt = new T.TranslatedString("apply chart theme", l.t(null, void 0, i(66568)));
    class Qt extends k.UndoCommand {
        constructor(e, t, i) {
            var s, r, n;
            super(Jt), this._model = e, this._newSessionProps = t.sessions || (0, Dt.factoryDefaults)("sessions"), ["candleStyle", "hollowCandleStyle", "haStyle"].forEach((e => {
                    t.mainSourceProperties[e].wickUpColor = t.mainSourceProperties[e].wickUpColor || t.mainSourceProperties[e].wickColor, t.mainSourceProperties[e].wickDownColor = t.mainSourceProperties[e].wickDownColor || t.mainSourceProperties[e].wickColor
                })), t.chartProperties = null !== (s = t.chartProperties) && void 0 !== s ? s : {
                    paneProperties: void 0,
                    scalesProperties: void 0
                },
                t.chartProperties.paneProperties.vertGridProperties = null !== (r = t.chartProperties.paneProperties.vertGridProperties) && void 0 !== r ? r : t.chartProperties.paneProperties.gridProperties, t.chartProperties.paneProperties.horzGridProperties = null !== (n = t.chartProperties.paneProperties.horzGridProperties) && void 0 !== n ? n : t.chartProperties.paneProperties.gridProperties;
            const o = this._model.properties().state().paneProperties.legendProperties;
            delete o.backgroundTransparency, t.chartProperties.paneProperties.legendProperties = {
                ...t.chartProperties.paneProperties.legendProperties,
                ...o
            };
            const a = (0, Dt.factoryDefaults)("chartproperties"),
                l = (0, Et.deepExtend)({}, a, t.chartProperties);
            this._newChartProps = {
                paneProperties: Xt(l.paneProperties),
                scalesProperties: Zt(l.scalesProperties)
            }, e.timeScale().preserveBarSpacing() && delete this._newChartProps.scalesProperties.barSpacing;
            const c = (0, Dt.factoryDefaults)("chartproperties.mainSeriesProperties"),
                h = (0, Et.deepExtend)({}, c, t.mainSourceProperties);
            this._newSeriesProps = i ? h : Kt(h);
            const d = e.properties().state();
            this._oldChartProps = {
                paneProperties: Xt(d.paneProperties),
                scalesProperties: Zt(d.scalesProperties)
            };
            const u = e.mainSeries().properties().state();
            this._oldSeriesProps = i ? u : Kt(u), this._oldSessionProps = this._model.sessions().properties().state()
        }
        undo() {
            this._merge(this._oldChartProps, this._oldSeriesProps, this._oldSessionProps), this._model.mainSeries().onChartStyleChanged(), this._model.updateScales(), this._model.chartThemeLoaded()
        }
        redo() {
            this._merge(this._newChartProps, this._newSeriesProps, this._newSessionProps), this._model.mainSeries().onChartStyleChanged(), this._model.updateScales(), this._model.chartThemeLoaded()
        }
        _merge(e, t, i) {
            var s, r, n, o;
            const a = this._model;
            (0, ge.saveDefaultProperties)(!0), e && (a.properties().childs().paneProperties.mergeAndFire(e.paneProperties), a.properties().childs().scalesProperties.mergeAndFire(e.scalesProperties)), "priceAxisProperties" in t && a.mainSeries().priceScale().setMode({
                autoScale: null === (s = t.priceAxisProperties) || void 0 === s ? void 0 : s.autoScale,
                percentage: null === (r = t.priceAxisProperties) || void 0 === r ? void 0 : r.percentage,
                log: null === (n = t.priceAxisProperties) || void 0 === n ? void 0 : n.log,
                lockScale: null === (o = t.priceAxisProperties) || void 0 === o ? void 0 : o.lockScale
            }), a.mainSeries().properties().mergeAndFire(t), a.mainSeries().properties().saveDefaults(), a.mainSeries().createPaneView(), a.mainSeries().invalidateBarStylesCache(), a.recalculateAllPanes((0, ye.globalChangeEvent)()), a.fullUpdate(), a.properties().saveDefaults(), a.sessions().restoreState({
                properties: i
            }, !1), (0, ge.saveDefaultProperties)(!1)
        }
    }
    const ei = new T.TranslatedString("change resolution", l.t(null, void 0, i(32303)));
    class ti extends st {
        constructor(e, t, i) {
            super(ei, e, function(e, t) {
                let i;
                const s = (0, fe.isRangeStyle)(e.style()),
                    r = p.Interval.isRange(t);
                return !s && r ? i = 11 : s && !r && (i = (0, fe.getLastUsedStyle)()), {
                    interval: t,
                    style: i
                }
            }(e, t), i), this._resolution = t
        }
        canMerge(e) {
            return e instanceof ti && e._resolution === this._resolution && super.canMerge(e)
        }
        _showFade(e, t) {
            return !0
        }
    }
    var ii = i(69718);
    class si extends ii.SetWatchedValueCommand {
        constructor() {
            super(...arguments), this._firstRedo = !0
        }
        redo() {
            this._firstRedo || (0, it.muteLinkingGroup)(this._newValue, !0), (0, it.muteLinkingGroup)(this._oldValue, !0), super.redo(), this._firstRedo || (0, it.muteLinkingGroup)(this._newValue, !1), (0, it.muteLinkingGroup)(this._oldValue, !1), this._firstRedo = !1
        }
        undo() {
            (0, it.muteLinkingGroup)(this._newValue, !0), (0, it.muteLinkingGroup)(this._oldValue, !0), super.undo(), (0, it.muteLinkingGroup)(this._newValue, !1), (0, it.muteLinkingGroup)(this._oldValue, !1)
        }
    }
    var ri = i(97340),
        ni = i(76422);
    const oi = new T.TranslatedString("send {title} backward", l.t(null, void 0, i(16259))),
        ai = new T.TranslatedString("bring {title} forward", l.t(null, void 0, i(56763))),
        li = new T.TranslatedString("insert {title} after {target}", l.t(null, void 0, i(74055))),
        ci = new T.TranslatedString("insert {title} before {target}", l.t(null, void 0, i(11231))),
        hi = new T.TranslatedString("cut {title}", l.t(null, void 0, i(78755))),
        di = new T.TranslatedString("cut sources", l.t(null, void 0, i(63649))),
        ui = new T.TranslatedString("remove {title}", l.t(null, void 0, i(39859))),
        pi = new T.TranslatedString("remove drawings group", l.t(null, void 0, i(70653))),
        _i = new T.TranslatedString("move scale", l.t(null, void 0, i(4184))),
        mi = new T.TranslatedString("stop syncing line tool(s)", l.t(null, void 0, i(57011))),
        gi = new T.TranslatedString("zoom out", l.t(null, void 0, i(9645))),
        fi = new T.TranslatedString("zoom in", l.t(null, void 0, i(19813))),
        vi = new T.TranslatedString("move drawing(s)", l.t(null, void 0, i(45356))),
        Si = new T.TranslatedString("load default drawing template", l.t(null, void 0, i(54597))),
        yi = new T.TranslatedString("apply factory defaults to selected sources", l.t(null, void 0, i(96996))),
        bi = new T.TranslatedString("change currency", l.t(null, void 0, i(22641))),
        wi = new T.TranslatedString("change unit", l.t(null, void 0, i(39028))),
        Pi = new T.TranslatedString("clone line tools", l.t(null, void 0, i(5179))),
        Ci = new T.TranslatedString("merge up", l.t(null, void 0, i(66143))),
        xi = new T.TranslatedString("merge down", l.t(null, void 0, i(62153))),
        Ti = new T.TranslatedString("merge to pane", l.t(null, void 0, i(70746))),
        Ii = new T.TranslatedString("unmerge up", l.t(null, void 0, i(52540))),
        Mi = new T.TranslatedString("unmerge down", l.t(null, void 0, i(86949))),
        Ai = new T.TranslatedString("unmerge to new bottom pane", l.t(null, void 0, i(20057))),
        Li = new T.TranslatedString("move {title} to new right scale", l.t(null, void 0, i(45544))),
        ki = new T.TranslatedString("move {title} to new left scale", l.t(null, void 0, i(11303))),
        Ei = new T.TranslatedString("make {title} no scale (Full screen)", l.t(null, void 0, i(74642))),
        Di = new T.TranslatedString("scroll time", l.t(null, void 0, i(70009))),
        Vi = new T.TranslatedString("scale time", l.t(null, void 0, i(35962))),
        Bi = new T.TranslatedString("reset time scale", l.t(null, void 0, i(55064))),
        Ri = new T.TranslatedString("reset scales", l.t(null, void 0, i(21948))),
        Ni = new T.TranslatedString("create {tool}", l.t(null, void 0, i(81791))),
        Oi = new T.TranslatedString("change {pointIndex} point", l.t(null, void 0, i(72032))),
        Fi = new T.TranslatedString("paste {title}", l.t(null, void 0, i(41601))),
        Wi = new T.TranslatedString("insert {title}", l.t(null, void 0, i(90743))),
        zi = new T.TranslatedString("remove all studies", l.t(null, void 0, i(15516))),
        Hi = new T.TranslatedString("remove drawings", l.t(null, void 0, i(44656))),
        Ui = new T.TranslatedString("remove all studies and drawing tools", l.t(null, void 0, i(80171))),
        ji = (new T.TranslatedString("turn line tools sharing off", l.t(null, void 0, i(28068))), new T.TranslatedString("share line tools in layout", l.t(null, void 0, i(77554))), new T.TranslatedString("share line tools globally", l.t(null, void 0, i(64704))),
            new T.TranslatedString("change linking group", l.t(null, void 0, i(23783)))),
        Gi = (l.t(null, void 0, i(75139)), (0, C.getLogger)("Chart.ChartUndoModel"));

    function qi(e, t) {
        return {
            bringForwardEnabled: e.bringForwardEnabled || t.bringForwardEnabled,
            bringToFrontEnabled: e.bringToFrontEnabled || t.bringToFrontEnabled,
            sendBackwardEnabled: e.sendBackwardEnabled || t.sendBackwardEnabled,
            sendToBackEnabled: e.sendToBackEnabled || t.sendToBackEnabled
        }
    }

    function $i(e) {
        return new T.TranslatedString(e.name(), e.title())
    }

    function Yi() {
        return (0, Ee.drawOnAllCharts)().value() ? 1 : 0
    }
    class Ki extends(r()) {
        constructor(e, t, i, s, r, n, o, a, l, c, h, d) {
            super(), this._createLineCommand = null, this._initialTimeScrollState = null, this._initialTimeScrollPos = null, this._scalePriceInfo = null, this._currentSourceMoveCommand = null, this._currentLineChangeCommand = null, this._currentCustomMoveCommand = null, this._zoomStack = new m.UndoStack, this._lineToolsDoNotAffectChartInvalidation = new P.FeatureToggleWatchedValue("do_not_invalidate_chart_on_changing_line_tools", !1), this._chartWidget = n, this.m_model = new(gt())(e, t, i, s, r, this, a, l, c, h, d), this._undoHistory = o, this._lineToolsGroupController = new ze({
                model: this._model.bind(this),
                pushUndoCommand: this._pushUndoCommand.bind(this),
                beginUndoMacro: (e, t) => {
                    this._undoHistory.beginUndoMacro(e).setCustomFlag("doesnt_affect_save", !!t)
                },
                endUndoMacro: this._undoHistory.endUndoMacro.bind(this._undoHistory),
                emitEvent: this.emitEvent.bind(this)
            })
        }
        undoHistory() {
            return this._undoHistory
        }
        setWatchedValue(e, t, i) {
            this._undoHistory.setWatchedValue(e, t, i)
        }
        lineToolsGroupController() {
            return this._lineToolsGroupController
        }
        mergeAllScales(e) {
            ! function(e, t) {
                e.beginUndoMacro("left" === t ? M : A), e.model().panes().forEach((i => {
                    const s = "left" === t ? i.rightPriceScales() : i.leftPriceScales(),
                        r = ("left" === t ? i.leftPriceScales() : i.rightPriceScales()).concat(s),
                        n = "overlay" === i.priceScalePosition(i.defaultPriceScale()) ? r[0] : i.defaultPriceScale();
                    e.movePriceScale(i, n, t, 0), r.forEach((t => {
                        if (t === n) return;
                        let s = t.mainSource();
                        for (; null !== s;) {
                            e.moveToScale(s, i, n, null, !0);
                            const r = t.mainSource();
                            if (r === s) {
                                L.logError("Loop detected while trying to merge scales");
                                break
                            }
                            s = r
                        }
                    }))
                })), e.endUndoMacro(), e.model().fullUpdate()
            }(this, e)
        }
        movePriceScale(e, t, i, s) {
            const r = new E(this._model(), e, t, i, s, _i);
            this._pushUndoCommand(r)
        }
        createLineTool({
            pane: e,
            point: t,
            linetool: i,
            properties: s,
            linkKey: r,
            ownerSource: n,
            disableSynchronization: a,
            sharingMode: l = Yi(),
            id: c
        }) {
            if (("LineToolRegressionTrend" === i || "LineToolAnchoredVWAP" === i) && !this.canCreateStudy()) return (0, h.showTooManyStudiesNotice)(), null;
            const d = Ni.format({
                tool: new T.TranslatedString(i, W.lineToolsLocalizedNames[i])
            });
            this.beginUndoMacro(d, this._lineToolsDoNotAffectChartInvalidation.value());
            const u = !a;
            this._createLineCommand = new H(this._model(), e, i, n || (0, o.ensureNotNull)(e.mainDataSource()), l, c);
            const p = this._createLineCommand.startCreatingLine(t, s, r || null, l),
                _ = (0, o.ensureNotNull)(this._createLineCommand.line());
            let m = null;
            if (p && (u && this.finishLineTool(_), this._pushUndoCommand(this._createLineCommand), this._createLineCommand = null, m = {
                    points: _.normalizedPoints(),
                    interval: this.mainSeries().interval()
                }), u && void 0 === r && (0, Ee.drawOnAllCharts)().value() && _.isSynchronizable()) {
                const e = (0, o.ensureNotNull)(this.model().externalTimeStamp(t.index)),
                    s = {
                        point: {
                            price: t.price,
                            timeStamp: e
                        },
                        linetool: i,
                        properties: _.properties(),
                        symbol: this.mainSeries().symbol(),
                        model: this.model(),
                        linkKey: (0, o.ensureNotNull)(_.linkKey().value()),
                        finalState: m,
                        id: _.id(),
                        sharignMode: _.sharingMode().value()
                    };
                _.isFixed() && (s.pointPositionPercents = _.calcPositionPercents()), (0, Ee.createLineTool)(s)
            }
            return this.endUndoMacro(), _
        }
        continueCreatingLine(e, t, i, s) {
            const r = (0, o.ensureNotNull)(this._createLineCommand);
            this.beginUndoMacro(r.text(), this._lineToolsDoNotAffectChartInvalidation.value());
            const n = (0, o.ensureNotNull)(this._model().lineBeingCreated()),
                a = r.continueCreatingLine(e, t, i, s);
            let l = null;
            if (a && (this.finishLineTool(n), this._pushUndoCommand(r), this._createLineCommand = null, l = {
                    points: n.normalizedPoints(),
                    interval: this.mainSeries().interval()
                }), r.drawOnAllCharts() && n.isSynchronizable()) {
                const i = (0, o.ensureNotNull)(this._model().externalTimeStamp(e.index));
                (0, Ee.continueLineTool)({
                    point: {
                        price: e.price,
                        timeStamp: i
                    },
                    envState: t,
                    finalState: l,
                    model: this._model()
                })
            }
            return this.endUndoMacro(), a
        }
        continueExternalLine(e, t, i) {
            const s = (0, o.ensureNotNull)(this._createLineCommand),
                r = s.continueCreatingLine(e, t, i);
            return r && (this._pushUndoCommand(s), this._createLineCommand = null), r
        }
        finishLineTool(e) {
            this._model().finishLineTool(e)
        }
        pasteImageAsLineTool(e, t, i, s) {
            return null
        }
        loadRange(e) {
            const t = this._model(),
                i = t.mainSeries().getSupportedResolution(e.res),
                s = {
                    val: e.val,
                    res: i
                },
                r = t.appliedTimeFrame().value();
            return (null === r || !_(r, s)) && (this._pushUndoCommand(new Pe(t, s)), !0)
        }
        unlinkLines(e) {
            const t = this.model();
            this.beginUndoMacro(mi, this._lineToolsDoNotAffectChartInvalidation.value());
            for (const i of e) null !== i.linkKey().value() && (0, Ee.removeLineTool)({
                withUndo: !0,
                model: this.model(),
                symbol: i.symbol(),
                linkKey: (0, o.ensureNotNull)(i.linkKey().value()),
                sourceTitle: $i(i),
                lineToolState: i.state(!1),
                unlink: !0
            }), this._pushUndoCommand(new xt(t, i));
            this.endUndoMacro()
        }
        zoomFromViewport() {
            const e = new Pt((0, o.ensureDefined)(this._zoomStack.head()), this._zoomStack, !1);
            this._pushUndoCommand(e)
        }
        zoomToViewport(e, t, i, s, r) {
            const n = new yt(this.m_model, e, t, i, s, r),
                o = new Pt(n, this._zoomStack, !0);
            this._pushUndoCommand(o)
        }
        zoomStack() {
            return this._zoomStack
        }
        hoveredSource() {
            return this.m_model.hoveredSource()
        }
        setProperty(e, t, i, s) {
            if (e && e.value() !== t) {
                const r = new Le(e, t, i, this.m_model, s);
                this._pushUndoCommand(r), this.emitEvent("setProperty")
            }
        }
        withMacro(e, t, i) {
            const s = this.beginUndoMacro(e, i);
            try {
                t()
            } finally {
                this.endUndoMacro()
            }
            return s
        }
        barsMarksSources() {
            return this.m_model.barsMarksSources()
        }
        removeAllDrawingTools() {
            this.beginUndoMacro(Hi, !1), this._removeAllDrawingToolsImpl(), this.endUndoMacro()
        }
        removeAllStudiesAndDrawingTools() {
            this.beginUndoMacro(Ui), this._removeAllDrawingToolsImpl(), this._removeAllStudiesImpl(), this.endUndoMacro()
        }
        removeAllStudies() {
            this.beginUndoMacro(zi), this._removeAllStudiesImpl(), this.endUndoMacro()
        }
        scrollChartByBar(e) {
            if (!this.m_model.scrollEnabled()) return;
            const t = e * this.m_model.timeScale().barSpacing();
            this.startScrollTime(0), this.scrollTimeTo(t), this.endScrollTime()
        }
        canZoomIn() {
            return this.model().canZoomIn()
        }
        canZoomOut() {
            return this.model().canZoomOut()
        }
        zoomOut() {
            const e = this.timeScale().width();
            if (this.canZoomOut()) {
                try {
                    this.beginUndoMacro(gi)
                } catch (e) {
                    return
                }(0, v.doAnimate)({
                    to: e / 5,
                    onStep: e => {
                        this.startScaleTime(0), this.scaleTimeTo(e), this.endScaleTime()
                    },
                    onComplete: () => this.endUndoMacro()
                })
            }
        }
        zoomIn() {
            const e = this.timeScale().width();
            if (this.canZoomIn()) {
                try {
                    this.beginUndoMacro(fi)
                } catch (e) {
                    return
                }(0, v.doAnimate)({
                    to: e / 5,
                    onStep: e => {
                        this.startScaleTime(e), this.scaleTimeTo(0), this.endScaleTime()
                    },
                    onComplete: () => this.endUndoMacro()
                })
            }
        }
        startMovingSources(e, t, i, s) {
            e.filter((e => e.doesMovingAffectsUndo())).length && (this._currentSourceMoveCommand = new R(this.model(), e, vi, !1), e.every(f.isLineTool) && this._currentSourceMoveCommand.setCustomFlag("doesnt_affect_save", this._lineToolsDoNotAffectChartInvalidation.value())), this.model().startMovingSources(e, t, i, new Map, s)
        }
        moveSources(e, t) {
            this.model().moveSources(e, new Map, t)
        }
        endMovingSource(e, t) {
            this.model().endMovingSources(e, void 0, t), null !== this._currentSourceMoveCommand && (this._currentSourceMoveCommand.saveNewState(), this._pushUndoCommand(this._currentSourceMoveCommand)), this._currentSourceMoveCommand = null
        }
        startChangingLinetool(e, t, i, s, r) {
            this._currentLineChangeCommand = new R(this.model(), [e], Oi.format({
                pointIndex: i
            }), !1), this._currentLineChangeCommand.setCustomFlag("doesnt_affect_save", this._lineToolsDoNotAffectChartInvalidation.value()), this.model().startChangingLinetool(e, t, i, s, r)
        }
        changeLinePoint(e, t) {
            this.model().changeLinePoint(e, t)
        }
        endChangingLinetool(e) {
            this.model().endChangingLinetool(e), null !== this._currentLineChangeCommand && (this._currentLineChangeCommand.saveNewState(), this._pushUndoCommand(this._currentLineChangeCommand)), this._currentLineChangeCommand = null
        }
        setChartStyleProperty(e, t, i) {
            if (e.value() !== t) {
                const s = new be(e, t, this.mainSeries(), i, this.model(), this.chartWidget());
                this._pushUndoCommand(s), this.emitEvent("setChartStyleProperty"), (0, me.trackChartStyleChanged)(e.value())
            }
        }
        restorePropertiesForSource(e) {
            (0, f.isLineTool)(e) ? this._restoreLineToolFactoryDefaults(e): this._restoreStudyFactoryDefaults(e)
        }
        restoreLineToolsFactoryDefaults(e) {
            1 === e.length ? this._restoreLineToolFactoryDefaults(e[0]) : (this.beginUndoMacro(yi), e.forEach((e => this._restoreLineToolFactoryDefaults(e))), this.endUndoMacro())
        }
        restoreState(e, t, i) {
            return this.m_model.restoreState(e, t, i)
        }
        async clipboardCopy(e, t = this.selection().dataSources()) {
            if (!(0, w.enabled)("datasource_copypaste")) return;
            const i = t.filter((e => e.copiable()));
            if (0 === i.length) return;
            for (const e of i)
                if ((0, x.isStudy)(e) && e.isChildStudy()) throw new Error("Can not copy child study");
            const s = (0, g.clipboardDataForSources)(this._model().id(), i);
            return null !== s ? e.write({
                app: JSON.stringify(s),
                text: s.title
            }) : void 0
        }
        async clipboardCut(e, t = this.selection().dataSources()) {
            if (!(0, w.enabled)("datasource_copypaste")) return;
            const i = t.filter((e => e.copiable()));
            if (0 === i.length) return;
            await this.clipboardCopy(e, i);
            const s = i.filter((e => e.isUserDeletable()));
            if (0 === s.length) return;
            const r = (1 === s.length ? hi : di).format({
                title: $i(s[0])
            });
            this.beginUndoMacro(r), this.m_model.selectionMacro((() => this.removeSources(s, !1, r)), !0), this.endUndoMacro()
        }
        async clipboardPaste(e, t) {
            let i = null;
            if ((0, w.enabled)("datasource_copypaste") && (i = i || await e.read(), i.app)) {
                const e = JSON.parse(i.app);
                if (null !== this.pasteSourceFromClip(t, e)) return
            }
            await this._processSpecialLineToolsContents(e, i, t)
        }
        applyStudyTemplate(e, t) {
            const i = new Ye(this._model(), e, t);
            this._pushUndoCommand(i), (0, ni.emit)("load_study_template")
        }
        createStudyInserter(e, t, i) {
            const s = {
                createStudy: (e, t, i, s, r, n, o, a, l, c, h) => this.checkIfFeatureAvailable(e, n) ? ((0, y.trackEvent)("studies", "Study_" + e.id), "Compare@tv-basicstudies" === e.id && (0, y.trackEvent)("compare", "symbol:" + t.symbol), this._insertStudy(e, t, s, r, n, o, a, l, c, null, h)) : (Gi.logNormal("Cannot insert study " + e.id), null)
            };
            void 0 !== i && (s.createStub = () => this.m_model.insertStudyStub(i).id(), s.removeStub = e => this.m_model.removeStudyStub(e));
            const r = new ri.StudyInserter(e, this.m_model.studyMetaInfoRepository(), s);
            return r.setParentSources(t), r
        }
        replayStatus() {
            return this.m_model.replayStatus()
        }
        setReplayStatus(e) {
            return this.m_model.setReplayStatus(e)
        }
        startCustomMoving(e, t, i) {
            this._currentCustomMoveCommand = new ut(this.model(), e, t, i)
        }
        customMoveBeingProcessed() {
            return null !== this._currentCustomMoveCommand
        }
        processCustomMove(e) {
            (0, o.ensureNotNull)(this._currentCustomMoveCommand).move(e)
        }
        endCustomMoving() {
            null !== this._currentCustomMoveCommand && this._currentCustomMoveCommand.hasChanges() && (this._pushUndoCommand(this._currentCustomMoveCommand), this._currentCustomMoveCommand = null)
        }
        panes() {
            return this.m_model.panes()
        }
        cloneLineTools(e, t) {
            for (let t = 0; t < Math.min(5, e.length); ++t)(0, me.trackDrawingCloned)(e[t]);
            this.beginUndoMacro(Pi, this._lineToolsDoNotAffectChartInvalidation.value());
            const i = new D(this._model(), e, t, Pi);
            if (this._pushUndoCommand(i), (0, Ee.drawOnAllCharts)().value()) {
                const e = i.newIds().map((e => (0, o.ensureNotNull)(this.model().dataSourceForId(e))));
                this.copyToOtherCharts(e)
            }
            return this.endUndoMacro(), this.emitEvent("cloneLineTools"), i.newIds()
        }
        removeSource(e, t, i) {
            this.lineBeingCreated() !== e ? this.removeSources([e], t, ui.format({
                title: $i(e)
            }), i) : this.cancelCreatingLine()
        }
        removeSelectedSources() {
            const e = this._model().selection().dataSources();
            if (!e.length) return;
            const t = (e.length > 1 ? pi : ui).format({
                title: $i(e[0])
            });
            this.removeSources(e, !1, t)
        }
        removeSources(e, t, i, s) {
            s || (e = e.filter((e => e.isUserDeletable())));
            const r = this._model(),
                n = r.lineToolsGroupModel(),
                a = e.every(f.isLineTool) && this._lineToolsDoNotAffectChartInvalidation.value();
            this.beginUndoMacro(i, a), r.selectionMacro((s => {
                const a = new Map;
                e.forEach((e => {
                    if ((0, f.isLineTool)(e)) {
                        const t = n.groupForLineTool(e);
                        if (null !== t) {
                            const i = a.get(t) || [];
                            i.push(e), a.set(t, i)
                        }
                        null !== e.linkKey().value() && (0, Ee.removeLineTool)({
                            withUndo: !0,
                            model: this.model(),
                            linkKey: (0, o.ensureNotNull)(e.linkKey().value()),
                            symbol: this.model().mainSeries().symbol(),
                            lineToolState: e.state(!1),
                            sourceTitle: $i(e)
                        })
                    }
                })), a.forEach(((e, t) => {
                    const i = new B.ExcludeLineToolsFromGroupUndoCommand(r, t, e);
                    this._pushUndoCommand(i)
                }));
                const l = new V.RemoveSourcesCommand(r, e, i),
                    c = l.removedIds();
                this._pushUndoCommand(l), !t && c.length > 0 && (1 === c.length ? this.emitEvent("removeSource", [c[0]]) : this.emitEvent("removeSources", [c]))
            }), !0), this.endUndoMacro()
        }
        removeUnloadedLineTool({
            lineToolsSynchronizer: e,
            sourceTitle: t,
            linkKey: i,
            symbol: s,
            state: r,
            withUndo: n,
            unlink: o
        }) {}
        async scrollToLineTool(e) {
            const t = this.timeScale().logicalRange();
            if (null === t) return;
            const i = this.timeScale().barSpacing();
            let s = t.left();
            const r = e.points().map((e => e.index)),
                n = this.timeScale().points().range().value();
            if (null === n) return;
            let a = n.firstIndex;
            const l = n.lastIndex,
                h = t.length() / 2;
            if (0 === r.length || r.some((e => t.contains(e)))) return;
            const d = () => {
                const t = e.points().map((e => e.index)),
                    i = t.filter((e => e <= l)).reduce(((e, t) => null === e ? t : Math.max(e, t)), null);
                return null !== i ? i : t.reduce(((e, t) => Math.min(e, t)))
            };
            let u, p = d();
            if (a - h > p) {
                const t = e.points().map((e => e.time)).filter(I.notUndefined).map((e => e.valueOf()));
                if (0 === t.length) return;
                const i = t.reduce(((e, t) => Math.min(e, t)), t[0]);
                await this.model().gotoTime(i), p = d();
                const r = (0, o.ensureNotNull)(this.timeScale().logicalRange());
                if (r.contains(p)) return;
                s = r.left(), a = (0, o.ensureNotNull)(this.timeScale().points().range().value()).firstIndex
            }
            a - h > p ? (u = (s - a + h) * i, this.mainSeries().setGotoDateResult({
                timestamp: (0, o.ensureNotNull)(this.timeScale().points().valueAt(a)),
                eod: !0
            })) : u = (s - p + 1 + h) * i, this.startScrollTime(0), (0, v.doAnimate)({
                onStep: (e, t) => this.scrollTimeTo(t),
                from: 0,
                to: Math.round(u),
                easing: c.easingFunc.easeInOutCubic,
                duration: c.dur,
                onComplete: () => this.endScrollTime()
            })
        }
        mergeSourceUp(e) {
            const t = new O.MergeUpUndoCommand(this._model(), e, Ci);
            this._mergeUnmergeSource(e, t)
        }
        mergeSourceDown(e) {
            const t = new O.MergeDownUndoCommand(this._model(), e, xi);
            this._mergeUnmergeSource(e, t)
        }
        mergeToPane(e, t, i) {
            const s = this._model().panes().indexOf(t),
                r = new O.MergeToTargetPane(this._model(), e, s, Ti, i);
            this._mergeUnmergeSource(e, r)
        }
        unmergeSourceUp(e) {
            const t = new N.UnmergeUpUndoCommand(this._model(), e, Ii);
            this._mergeUnmergeSource(e, t)
        }
        unmergeSourceDown(e) {
            const t = new N.UnmergeDownUndoCommand(this._model(), e, Mi);
            this._mergeUnmergeSource(e, t)
        }
        unmergeToNewBottomPane(e) {
            const t = new N.UnmergeToNewBottomPane(this._model(), e, Ai);
            this._mergeUnmergeSource(e, t)
        }
        availableZOrderOperations(e) {
            const t = this._model().lineToolsGroupModel(),
                i = e.filter(f.isLineTool),
                s = i.map((e => t.groupForLineTool(e)));
            (0, o.assert)(new Set(s).size <= 1, "Cannot move line tools from different group");
            const r = 0 === s.length ? null : s[0];
            let n = {
                bringForwardEnabled: !1,
                bringToFrontEnabled: !1,
                sendBackwardEnabled: !1,
                sendToBackEnabled: !1
            };
            const a = new Set(i);
            for (const t of (0, F.sortSources)(e)) {
                if ((0, f.isLineTool)(t) && null !== r) {
                    const e = (0, F.sortSources)(r.lineTools().filter((e => !a.has(e) || e === t)));
                    n = qi(n, {
                        bringForwardEnabled: t !== e[e.length - 1],
                        bringToFrontEnabled: t !== e[e.length - 1],
                        sendBackwardEnabled: t !== e[0],
                        sendToBackEnabled: t !== e[0]
                    });
                    continue
                }
                const e = (0,
                    o.ensureNotNull)(this._model().paneForSource(t)).sourcesByGroup().allExceptSpecialSources();
                if (0 === e.length) continue;
                const i = t.zorder(),
                    s = e[0].zorder(),
                    l = e[e.length - 1].zorder();
                n = qi(n, {
                    bringForwardEnabled: i !== l,
                    bringToFrontEnabled: i !== l,
                    sendBackwardEnabled: i !== s,
                    sendToBackEnabled: i !== s
                })
            }
            return n
        }
        sendToBack(e) {
            if (!this.availableZOrderOperations(e).sendToBackEnabled) throw new Error("Send to back operation is unavailable");
            let t = null;
            const i = e[0];
            if ((0, f.isLineTool)(i)) {
                const s = this._model().lineToolsGroupModel().groupForLineTool(i);
                if (null !== s) {
                    const i = s.lineTools();
                    t = new re(this.model(), (0, F.sortSources)(e), i[0])
                }
            }
            null === t && (t = new ee(this.model(), (0, F.sortSources)(e))), this._pushUndoCommand(t), this.emitEvent("changeZOrder", [e])
        }
        bringToFront(e) {
            if (!this.availableZOrderOperations(e).bringToFrontEnabled) throw new Error("Bring to front operation is unavailable");
            let t = null;
            const i = e[0];
            if ((0, f.isLineTool)(i)) {
                const s = this._model().lineToolsGroupModel().groupForLineTool(i);
                if (null !== s) {
                    const i = s.lineTools();
                    t = new ie(this.model(), (0, F.sortSources)(e), i[i.length - 1])
                }
            }
            null === t && (t = new Q(this.model(), (0, F.sortSources)(e))), this._pushUndoCommand(t), this.emitEvent("changeZOrder", [e])
        }
        sendBackward(e) {
            if (!this.availableZOrderOperations(e).sendBackwardEnabled) throw new Error("Send backward operation is unavailable");
            const t = oi.format({
                title: $i(e[0])
            });
            this._sendBackOrBringForward(t, (0, F.sortSources)(e), ((e, t) => new oe(this.model(), e, t)))
        }
        bringForward(e) {
            if (!this.availableZOrderOperations(e).bringForwardEnabled) throw new Error("Bring forward operation is unavailable");
            const t = ai.format({
                title: $i(e[0])
            });
            this._sendBackOrBringForward(t, (0, F.sortSources)(e), ((e, t) => new le(this.model(), e, t)))
        }
        insertAfter(e, t) {
            e = (0, F.sortSources)(e);
            const i = li.format({
                title: $i(e[0]),
                target: $i(t)
            });
            this._insertAfterOrBefore(i, e, t, (() => new ie(this.model(), e, t)))
        }
        insertBefore(e, t) {
            e = (0, F.sortSources)(e);
            const i = ci.format({
                title: $i(e[0]),
                target: $i(t)
            });
            this._insertAfterOrBefore(i, e, t, (() => new re(this.model(), e, t)))
        }
        detachToRight(e, t) {
            (0, y.trackEvent)("Chart", "Move to new right scale");
            const i = Li.format({
                    title: $i(e)
                }),
                s = new tt.MoveToNewPriceScaleUndoCommand(this.model(), e, t, "right", i);
            this._pushUndoCommand(s), this.emitEvent("moveSource", [e])
        }
        detachToLeft(e, t) {
            (0, y.trackEvent)("Chart", "Move to new left scale");
            const i = ki.format({
                    title: $i(e)
                }),
                s = new tt.MoveToNewPriceScaleUndoCommand(this.model(), e, t, "left", i);
            this._pushUndoCommand(s), this.emitEvent("moveSource", [e])
        }
        detachNoScale(e, t) {
            (0, y.trackEvent)("Chart", "Make source no scale");
            const i = Ei.format({
                    title: $i(e)
                }),
                s = new tt.MoveToNewPriceScaleUndoCommand(this.model(), e, t, "overlay", i);
            this._pushUndoCommand(s), this.emitEvent("moveSource", [e])
        }
        moveToScale(e, t, i, s, r) {
            (0, y.trackEvent)("Chart", "Move source to target scale"), this.beginUndoMacro(s);
            const n = new tt.MoveToExistingPriceScaleUndoCommand(this.model(), e, t, i, s),
                o = r ? null : (0, b.sourceNewCurrencyOnPinningToPriceScale)(e, i, this._model()),
                a = r ? null : (0, ft.sourceNewUnitOnPinningToPriceScale)(e, i, this._model());
            this._pushUndoCommand(n),
                null !== o && this.setPriceScaleCurrency(i, o), null !== a && this.setPriceScaleUnit(i, a), this.endUndoMacro(), this.emitEvent("moveSource", [e])
        }
        setLinkingGroupIndex(e) {
            this._undoHistory.beginUndoMacro(ji), this._pushUndoCommand(new si(this.model().linkingGroupIndex(), e, ji)), this._model().setShouldBeSavedEvenIfHidden(!0), this._undoHistory.endUndoMacro()
        }
        startScrollTime(e) {
            const t = this.timeScale();
            this._initialTimeScrollState = {
                rightOffset: t.rightOffset(),
                barSpacing: t.barSpacing()
            }, this._initialTimeScrollPos = e, this.model().startScrollTime(e)
        }
        scrollTimeTo(e) {
            null !== this._initialTimeScrollPos && null !== this._initialTimeScrollState && Math.abs(e - this._initialTimeScrollPos) > 20 && (this._pushUndoCommand(new _e.TimeScaleChangeUndoCommand(this.model(), this._initialTimeScrollState, Di)), this._initialTimeScrollPos = null, this._initialTimeScrollState = null), this.model().scrollTimeTo(e)
        }
        endScrollTime() {
            this.model().endScrollTime(), this._initialTimeScrollPos = null, this._initialTimeScrollState = null
        }
        startScaleTime(e) {
            const t = this.timeScale(),
                i = {
                    rightOffset: t.rightOffset(),
                    barSpacing: t.barSpacing()
                };
            this._pushUndoCommand(new _e.TimeScaleChangeUndoCommand(this.model(), i, Vi)), this.model().startScaleTime(e)
        }
        scaleTimeTo(e) {
            this.model().scaleTimeTo(e)
        }
        endScaleTime() {
            this.model().endScaleTime()
        }
        resetTimeScale() {
            const e = this.timeScale(),
                t = {
                    rightOffset: e.rightOffset(),
                    barSpacing: e.barSpacing()
                };
            this._pushUndoCommand(new _e.TimeScaleChangeUndoCommand(this.model(), t, Bi)), this.model().resetTimeScale()
        }
        startScalePrice(e, t, i, s) {
            this._scalePriceInfo = {
                priceScaleState: t.state(),
                tryMergeConsecutiveScales: s
            }, this.model().startScalePrice(e, t, i)
        }
        scalePriceTo(e, t, i) {
            this.model().scalePriceTo(e, t, i)
        }
        endScalePrice(e, t) {
            this.model().endScalePrice(e, t);
            const i = (0, o.ensureNotNull)(this._scalePriceInfo);
            (0, n.default)(i.priceScaleState, t.state()) || this._pushUndoCommand(new vt.PriceScaleChangeUndoCommand(this.model(), e, t, i.priceScaleState, i.tryMergeConsecutiveScales)), this._scalePriceInfo = null
        }
        startTwoPointsScalePrice(e, t, i, s, r) {
            this._scalePriceInfo = {
                priceScaleState: t.state(),
                tryMergeConsecutiveScales: r
            }, this.model().startTwoPointsScalePrice(e, t, i, s)
        }
        twoPointsScalePriceTo(e, t, i, s) {
            this.model().twoPointsScalePriceTo(e, t, i, s)
        }
        endTwoPointsScalePrice(e, t) {
            this.model().endTwoPointsScalePrice(e, t);
            const i = (0, o.ensureNotNull)(this._scalePriceInfo);
            (0, n.default)(i.priceScaleState, t.state()) || this._pushUndoCommand(new vt.PriceScaleChangeUndoCommand(this.model(), e, t, i.priceScaleState, i.tryMergeConsecutiveScales)), this._scalePriceInfo = null
        }
        resetPriceScale(e, t) {
            const i = t.state();
            this.model().resetPriceScale(e, t), (0, n.default)(i, t.state()) || this._pushUndoCommand(new vt.PriceScaleChangeUndoCommand(this.m_model, e, t, i))
        }
        rearrangePanes(e, t) {
            const i = new pe(this._model(), e, t);
            this._pushUndoCommand(i)
        }
        movePane(e, t) {
            const i = new pe(this._model(), e, t);
            this._pushUndoCommand(i)
        }
        readOnly() {
            return this.m_model.readOnly()
        }
        checkIfFeatureAvailable(e, t) {
            let i = this.canCreateStudy();
            const s = t.length > 0;
            return !this.readOnly() && s && (i = this.canCreateStudy(!0)), !!i || (s || (0, h.showTooManyStudiesNotice)(), !1)
        }
        pasteSourceFromClip(e, t, i) {
            const s = t;
            if (!s || 0 === s.sources.length) return null;
            const r = e || (0, o.ensureNotNull)(this.model().paneForSource(this.mainSeries()));
            if (!s.sources.some((e => "drawing" !== e.type || null !== r.clipboardLineToolOwnerSource(e.source.id)))) return null;
            this.beginUndoMacro(Fi.format({
                title: s.title
            }));
            let n = 0;
            const a = [],
                l = [];
            for (const t of s.sources)
                if ("drawing" === t.type && null !== r.clipboardLineToolOwnerSource(t.source.id)) {
                    const e = this.pasteLineTool(r, t);
                    n < 5 && ((0, me.trackDrawingPasted)(e), n += 1), l.push(e), a.push(e)
                } else "study" === t.type && t.source && t.source.metaInfo && this.checkIfFeatureAvailable(new d.StudyMetaInfo(t.source.metaInfo), []) && a.push(this.pasteStudy(t, i ? e : void 0));
            return l.length && this.selectionMacro((e => {
                e.clearSelection(), l.forEach((t => {
                    e.addSourceToSelection(t, null)
                }))
            })), this.endUndoMacro(), a
        }
        pasteLineTool(e, t, i, s) {
            t.source.state.intervalsVisibilities = (0, kt.mergeIntervalVisibilitiesDefaults)(t.source.state.intervalsVisibilities), (0, kt.makeIntervalsVisibilitiesVisibleAtInterval)(t.source.state.intervalsVisibilities, p.Interval.parse(this.model().mainSeries().interval()));
            const r = new Je(this.model(), t, e, i, s);
            this._pushUndoCommand(r);
            const n = r.source();
            return r.needCopyToOtherCharts() && this.copyToOtherCharts([n]), this.selectionMacro((e => {
                e.clearSelection(), e.addSourceToSelection(n, null)
            })), n
        }
        pasteStudy(e, t) {
            const i = new lt(this.model(), e, null == t ? void 0 : t.id());
            this._pushUndoCommand(i);
            const s = (0, o.ensureNotNull)(i.state()).id;
            return (0, ni.emit)("study_event", s, "paste_study"), (0, o.ensureNotNull)(this._model().dataSourceForId(s))
        }
        setPriceScaleCurrency(e, t) {
            const i = new Qe.SetPriceScaleCurrencyUndoCommand(e, t, this.chartWidget(), bi);
            this._pushUndoCommand(i)
        }
        setPriceScaleUnit(e, t) {
            const i = new et.SetPriceScaleUnitUndoCommand(e, t, this.chartWidget(), wi);
            this._pushUndoCommand(i)
        }
        setSymbol(e, t) {
            e.symbol() !== t && this._pushUndoCommand(new nt(e, t, this.chartWidget()))
        }
        setResolution(e, t) {
            e === this.mainSeries() && (t = e.getSupportedResolution(t)), p.Interval.isEqual(e.interval(), t) || this._pushUndoCommand(new ti(e, t, this.chartWidget()))
        }
        chartLoadTheme(e, t, i) {
            const s = new Qt(this.model(), e, t);
            i ? s.redo() : this._pushUndoCommand(s)
        }
        isJustClonedChart() {
            return this._chartWidget.isJustClonedChart()
        }
        isMultipleLayout() {
            return this._chartWidget.isMultipleLayout()
        }
        isSingleChart() {
            return !this._chartWidget.isMultipleLayout().value()
        }
        inFullscreen() {
            return this._chartWidget.inFullscreen()
        }
        copyToOtherCharts(e) {
            const t = this.mainSeries(),
                i = t.syncModel(),
                s = this.timeScale();
            if (i)
                for (const r of e) {
                    if (!r.isSynchronizable()) continue;
                    const e = r.linkKey().value() || (0, S.randomHash)();
                    r.linkKey().setValue(e);
                    const n = r.state(!1),
                        a = r.normalizedPoints(),
                        l = r.properties().interval.value(),
                        c = t.interval();
                    let h;
                    if (p.Interval.isEqual(l, c)) h = a.map((e => {
                        const t = (0, o.ensureNotNull)(s.timePointToIndex(e.time_t)) + e.offset;
                        return {
                            price: e.price,
                            timeStamp: (0, o.ensureNotNull)(this.model().externalTimeStamp(t))
                        }
                    }));
                    else {
                        const e = i.createNewModelWithResolution(l);
                        h = a.map((t => ({
                            price: t.price,
                            timeStamp: 0 === t.offset ? t.time_t : e.projectTime(t.time_t, t.offset)
                        })))
                    }
                    const d = {
                        ...n,
                        id: r.id(),
                        linkKey: e,
                        points: h,
                        linetool: r.toolname,
                        model: this.model(),
                        symbol: t.symbol(),
                        finalState: {
                            points: a,
                            interval: l
                        },
                        pointPositionPercents: r.isFixed() ? r.calcPositionPercents() : void 0,
                        sharingMode: r.sharingMode().value()
                    };
                    (0, Ee.copyLineTool)(d)
                }
        }
        addPaneStretchFactorUndoCommand(e, t, i, s) {
            const r = new ct(this.model(), e, t, i, s);
            this._pushUndoCommand(r)
        }
        paneForSource(e) {
            return this.m_model.paneForSource(e)
        }
        destroy() {
            this._lineToolsDoNotAffectChartInvalidation.destroy(), this.m_model.destroy()
        }
        moveSelectedToolsLeft() {
            return this._moveSelectedTools(2)
        }
        moveSelectedToolsUp() {
            return this._moveSelectedTools(0)
        }
        moveSelectedToolsRight() {
            return this._moveSelectedTools(3)
        }
        moveSelectedToolsDown() {
            return this._moveSelectedTools(1)
        }
        insertStudyWithoutCheck(e, t, i) {
            return this._insertStudy(e, t, {}, !1, [], void 0, void 0, void 0, void 0, null != i ? i : null, void 0)
        }
        saveLineToolState(e, t) {
            this._pushUndoCommand(new R(this.m_model, [e], t))
        }
        resetScales() {
            this.beginUndoMacro(Ri), this.resetTimeScale();
            for (const e of this.m_model.panes()) {
                for (const t of e.leftPriceScales()) this.resetPriceScale(e, t);
                for (const t of e.rightPriceScales()) this.resetPriceScale(e, t)
            }
            this.endUndoMacro(), this.m_model.recalculateAllPanes((0, ye.viewportChangeEvent)())
        }
        shareLineTools(e, t) {}
        canCreateStudy(e) {
            return this.model().chartApi().canCreateStudy(e)
        }
        studiesMetaData() {
            return this.m_model.studiesMetaData()
        }
        chartWidgetCollectionLock() {
            return this._chartWidget.chartWidgetCollection().lock
        }
        _isCountedStudy(e) {
            throw new Error("Not implemented")
        }
        _mergeUnmergeSource(e, t) {
            this.beginUndoMacro(t.text());
            const i = (0, o.ensureNotNull)(this._model().paneForSource(e)),
                s = new Set(i.sourcesByGroup().lineSources().filter((t => t.ownerSource() === e)));
            this._model().lineToolsGroupModel().groups().filter((e => {
                const t = e.lineTools().some((e => s.has(e))),
                    i = e.lineTools().some((e => !s.has(e)));
                return t && i
            })).forEach((e => {
                this._pushUndoCommand(new B.ExcludeLineToolsFromGroupUndoCommand(this._model(), e, e.lineTools()))
            })), this._pushUndoCommand(t), this.endUndoMacro()
        }
        _insertStudy(e, t, i, s, r, n, a, l, c, h, d) {
            const u = Wi.format({
                title: e.description
            });
            this.beginUndoMacro(u);
            const p = new pt(this.model(), e, t, i, s, r, n, a, l, c, h || null, u);
            this._pushUndoCommand(p);
            const _ = p.insertedStudy();
            if (void 0 !== d) {
                const e = new _t.SetPriceScaleModeCommand(d, (0, o.ensureNotNull)(_.priceScale()), null, this.model());
                this._pushUndoCommand(e)
            }
            return this.endUndoMacro(), {
                study: _,
                startPromise: p.lastInsertionStartPromise()
            }
        }
        async _processSpecialLineToolsContents(e, t, i) {
            0
        }
        _insertAfterOrBefore(e, t, i, s) {
            const r = (0, o.ensureNotNull)(this._model().paneForSource(i));
            if (t.some((e => (0, f.isLineTool)(e) && this._model().paneForSource(e) !== r))) throw new Error("Cannot insert line tool after target on another pane");
            this.beginUndoMacro(e), t.forEach((e => {
                (0, o.ensureNotNull)(this.model().paneForSource(e)) !== r && this.mergeToPane(e, r)
            }));
            const n = s();
            this._pushUndoCommand(n), this.emitEvent("changeZOrder", [t]), this.endUndoMacro()
        }
        _sendBackOrBringForward(e, t, i) {
            const s = new Map;
            t.forEach((e => {
                const t = (0, o.ensureNotNull)(this._model().paneForSource(e)),
                    i = s.get(t) || [];
                i.push(e), s.set(t, i)
            })), this.beginUndoMacro(e), s.forEach(((e, t) => {
                this._pushUndoCommand(i(t, e))
            })), this.endUndoMacro(), this.emitEvent("changeZOrder", [t])
        }
        _moveSelectedTools(e) {
            const t = this.model().selection().lineDataSources();
            if (0 === t.length) return !1;
            if ((0, Ee.lockDrawings)().value()) return !0;
            const i = this.timeScale().visibleBarsStrictRange();
            if (null === i) return !1;
            const s = function(e) {
                const t = new Map;
                for (const i of e) {
                    const e = i.ownerSource();
                    if (null === e) continue;
                    let s = t.get(e);
                    if (void 0 === s) {
                        const r = e.priceScale(),
                            n = e.priceStep(),
                            o = e.firstValue();
                        if (null === r || null === n || null === o) continue;
                        if (null === r.priceRange()) continue;
                        s = {
                            sources: [],
                            priceScale: r,
                            priceStep: n,
                            startPrice: i.points()[0].price,
                            firstValue: o
                        }, t.set(e, s)
                    }
                    s.sources.push(i)
                }
                return t
            }(t);
            if (0 === s.size) return !1;
            this.beginUndoMacro(vi, this._lineToolsDoNotAffectChartInvalidation.value());
            const r = i.firstBar(),
                n = this.timeScale().indexToCoordinate(r),
                o = r + (3 === e ? 1 : 2 === e ? -1 : 0),
                l = this.timeScale().indexToCoordinate(o);
            return Ee.isDirectionalMovementActive.setValue(!0), s.forEach((t => {
                const {
                    startPrice: i,
                    priceStep: s,
                    priceScale: c,
                    firstValue: h
                } = t, d = i + (0 === e ? s : 1 === e ? -s : 0), u = c.priceToCoordinate(i, h), p = c.priceToCoordinate(d, h), _ = {
                    logical: {
                        index: r,
                        price: i
                    },
                    screen: new a.Point(n, u)
                }, m = {
                    logical: {
                        index: o,
                        price: d
                    },
                    screen: new a.Point(l, p)
                };
                this.startMovingSources(t.sources, _, null), this.moveSources(m), this.endMovingSource(!1, !0)
            })), Ee.isDirectionalMovementActive.setValue(!1), this.endUndoMacro(), !0
        }
        _restoreStudyFactoryDefaults(e) {
            const t = new Lt(this.m_model, e.properties());
            this._pushUndoCommand(t)
        }
        _restoreLineToolFactoryDefaults(e) {
            this.beginUndoMacro(Si, this._lineToolsDoNotAffectChartInvalidation.value()), this.saveLineToolState(e, Si);
            const t = new At(this.m_model, e.properties(), Si);
            this._pushUndoCommand(t), this.saveLineToolState(e, Si), this.endUndoMacro(), this.model().updateSource(e)
        }
        _removeAllDrawingToolsImpl(e) {
            this.selectionMacro((() => {
                this.lineBeingCreated() && this.cancelCreatingLine();
                this.dataSources().filter(f.isLineTool).filter((e => e.isActualSymbol() && e.isUserDeletable())).filter((t => !e || e === t.toolname)).forEach((e => this.removeSource(e, !1)))
            }), !0)
        }
        _removeAllStudiesImpl() {
            const e = this.dataSources(),
                t = e.filter(x.isStudy).filter((e => !e.isChildStudy() && e.removeByRemoveAllStudies())),
                i = e.filter(x.isStudyStub);
            t.concat(i).forEach((e => this.removeSource(e, !1)))
        }
    }
}