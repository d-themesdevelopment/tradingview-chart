(e, t, i) => {
  "use strict";
  i.d(t, {
    ChartWidgetApiBase: () => ee,
  });

  var s = i(50151),
    r = i(44352),
    n = i(36298),
    o = i(36274),
    a = i(19386),
    l = i(60156),
    c = i(13041);

  class h {
    constructor(e) {
      this._timeScale = e;
    }
    coordinateToTime(e) {
      const t = this._timeScale.coordinateToIndex(e);
      return this._timeScale.indexToTimePoint(t);
    }
    barSpacingChanged() {
      return this._timeScale.barSpacingChanged();
    }
    rightOffsetChanged() {
      return this._timeScale.rightOffsetChanged();
    }
    setRightOffset(e) {
      this._timeScale.setRightOffset(e);
    }
    setBarSpacing(e) {
      this._timeScale.setBarSpacing(e);
    }
    barSpacing() {
      return this._timeScale.barSpacing();
    }
    rightOffset() {
      return this._timeScale.rightOffset();
    }
    width() {
      return this._timeScale.width();
    }
    defaultRightOffset() {
      return this._timeScale.defaultRightOffset().spawn();
    }
    defaultRightOffsetPercentage() {
      return this._timeScale.defaultRightOffsetPercentage().spawn();
    }
    usePercentageRightOffset() {
      return this._timeScale.usePercentageRightOffset().spawn();
    }
    isEmpty() {
      return this._timeScale.isEmpty();
    }
    scrollToFirstBar(e) {
      this._timeScale.scrollToFirstBar(e);
    }
    scrollToRealtime(e) {
      this._timeScale.scrollToRealtime(!1, e);
    }
  }
  var d = i(57898),
    u = i.n(d),
    p = i(38618);
  const _ = new n.TranslatedString(
    "change timezone",
    r.t(null, void 0, i(20505))
  );
  class m {
    constructor(e) {
      (this._onTimezoneChanged = new (u())()),
        (this._chartWidget = e),
        (this._timezoneProperty = e.properties().childs().timezone),
        this._timezoneProperty.subscribe(this, (e) => {
          this._onTimezoneChanged.fire(e.value());
        }),
        e.onAboutToBeDestroyed().subscribe(
          this,
          () => {
            this._timezoneProperty.unsubscribeAll(this);
          },
          !0
        );
    }
    availableTimezones() {
      return p.availableTimezones;
    }
    getTimezone() {
      const e = this._timezoneProperty.value();
      return (0, s.ensureDefined)(
        this.availableTimezones().find((t) => t.id === e)
      );
    }
    setTimezone(e, t) {
      (0, s.assert)((0, p.timezoneIsAvailable)(e), `Incorrect timezone: ${e}`),
        (null == t ? void 0 : t.disableUndo)
          ? this._timezoneProperty.setValue(e)
          : this._chartWidget.model().setProperty(this._timezoneProperty, e, _);
    }
    onTimezoneChanged() {
      return this._onTimezoneChanged;
    }
  }
  class g {
    constructor(e, t) {
      (this._chartUndoModel = e),
        (this._chartModel = e.model()),
        (this._priceScale = t);
    }
    getMode() {
      const e = this._priceScale.properties().childs();
      return e.percentage.value()
        ? 2
        : e.indexedTo100.value()
        ? 3
        : e.log.value()
        ? 1
        : 0;
    }
    setMode(e) {
      this._priceScale.setMode({
        percentage: 2 === e,
        log: 1 === e,
        indexedTo100: 3 === e,
      });
    }
    isInverted() {
      return this._priceScale.isInverted();
    }
    setInverted(e) {
      this._priceScale.properties().childs().isInverted.setValue(e);
    }
    isLocked() {
      return this._priceScale.isLockScale();
    }
    setLocked(e) {
      this._priceScale.setMode({
        lockScale: e,
      });
    }
    isAutoScale() {
      return this._priceScale.isAutoScale();
    }
    setAutoScale(e) {
      this._priceScale.setMode({
        autoScale: e,
      });
    }
    getVisiblePriceRange() {
      return this._priceScale.priceRangeInPrice();
    }
    setVisiblePriceRange(e) {
      this._priceScale.setPriceRangeInPrice(e), this._chartModel.lightUpdate();
    }
    hasMainSeries() {
      return this._priceScale.hasMainSeries();
    }
    getStudies() {
      return this._priceScale.getStudies().map((e) => e.id());
    }
    coordinateToPrice(e) {
      var t;
      const i =
        null === (t = this._priceScale.mainSource()) || void 0 === t
          ? void 0
          : t.firstValue();
      return null == i ? null : this._priceScale.coordinateToPrice(e, i);
    }
    currency() {
      const e = this._priceScale.currency(
        this._chartModel.availableCurrencies()
      );
      return null === e
        ? null
        : {
            selectedCurrency: e.selectedCurrency,
            readOnly: e.readOnly,
          };
    }
    setCurrency(e) {
      this._chartUndoModel.setPriceScaleCurrency(this._priceScale, e);
    }
    unit() {
      const e = this._priceScale.unit(this._chartModel.availableUnits());
      return null === e
        ? null
        : {
            selectedUnit: e.selectedUnit,
            readOnly: 0 === e.availableGroups.size,
            availableGroups: Array.from(e.availableGroups),
          };
    }
    setUnit(e) {
      this._chartUndoModel.setPriceScaleUnit(this._priceScale, e);
    }
    measureUnitId() {
      const e = this._priceScale.measureUnitId(
        this._chartModel.availableUnits()
      );
      return null === e
        ? null
        : {
            selectedMeasureUnitId: e.selectedMeasureUnitId,
          };
    }
  }
  var f = i(45973),
    v = i(1722),
    S = i(62591);
  const y = new n.TranslatedString(
    "change pane height",
    r.t(null, void 0, i(87510))
  );
  class b extends S.UndoCommand {
    constructor(e, t, i) {
      super(y),
        (this._model = e),
        (this._paneIndex = t),
        (this._paneHeight = i),
        (this._prevStretchFactors = this._model
          .panes()
          .map((e) => e.stretchFactor()));
    }
    redo() {
      this._model.changePanesHeight(this._paneIndex, this._paneHeight);
    }
    undo() {
      const e = this._model.panes();
      for (let t = 0; t < e.length; ++t)
        e[t].setStretchFactor(
          (0, s.ensureDefined)(this._prevStretchFactors[t])
        );
      this._model.fullUpdate();
    }
  }
  class w {
    constructor(e, t) {
      (this._priceScales = new WeakMap()),
        (this._pane = e),
        (this._chartWidget = t);
    }
    hasMainSeries() {
      return this._pane.containsMainSeries();
    }
    getLeftPriceScales() {
      return this._pane.leftPriceScales().map(this._getPriceScaleApi, this);
    }
    getRightPriceScales() {
      return this._pane.rightPriceScales().map(this._getPriceScaleApi, this);
    }
    getMainSourcePriceScale() {
      const e = this._pane.mainDataSource();
      if (null === e) return null;
      const t = e.priceScale();
      return null === t || this._pane.isOverlay(e)
        ? null
        : this._getPriceScaleApi(t);
    }
    setMaximized(e) {
      if (this._pane.maximized().value() !== e)
        for (const e of this._chartWidget.paneWidgets())
          if (e.state() === this._pane) {
            this._chartWidget.toggleMaximizePane(e);
            break;
          }
    }
    legendLoaded() {
      const e = this._chartWidget.paneByState(this._pane);
      return Boolean(e && e.statusWidget());
    }
    getAllEntities() {
      const e = this._pane.model();
      return this._pane
        .sourcesByGroup()
        .allIncludingHidden()
        .map((t) => (0, f.entityForDataSource)(e, t))
        .filter(v.notNull)
        .filter((e) => null !== e.name);
    }
    getHeight() {
      return this._pane.height();
    }
    setHeight(e) {
      const t = this._chartWidget.model().model(),
        i = t.panes();
      (0, s.assert)(
        i.length > 1,
        "Unable to change pane's height if there is only one pane"
      );
      const r = i.indexOf(this._pane);
      (0, s.assert)(-1 !== r, "Invalid pane index");
      const n = new b(t, r, e);
      this._chartWidget.model().undoHistory().pushUndoCommand(n);
    }
    moveTo(e) {
      const t = this.paneIndex();
      t !== e &&
        ((0, s.assert)(
          e >= 0 && e < this._chartWidget.paneWidgets().length,
          "Invalid pane index"
        ),
        this._chartWidget.model().movePane(t, e));
    }
    paneIndex() {
      return this._chartWidget.model().model().panes().indexOf(this._pane);
    }
    collapse() {
      if (1 === this._chartWidget.paneWidgets().length)
        throw new Error("Cannot collapse a single pane!");
      const e = this._chartWidget.paneByState(this._pane);
      if (null === e || this._pane.collapsed().value())
        throw new Error("Cannot collapse current pane!");
      this._chartWidget.toggleCollapsedPane(e);
    }
    restore() {
      if (1 === this._chartWidget.paneWidgets().length)
        throw new Error("Cannot restore a single pane!");
      const e = this._chartWidget.paneByState(this._pane);
      if (null === e || !this._pane.collapsed().value())
        throw new Error("Cannot restore current pane!");
      this._chartWidget.toggleCollapsedPane(e);
    }
    _getPriceScaleApi(e) {
      let t = this._priceScales.get(e);
      return (
        void 0 === t &&
          ((t = new g(this._chartWidget.model(), e)),
          this._priceScales.set(e, t)),
        t
      );
    }
  }
  var P = i(87115),
    C = i(39262),
    x = i(95529),
    T = i(11235),
    I = i(99778),
    M = i(73212),
    A = i(26512),
    L = i(84265),
    k = i(13333),
    E = i(152),
    D = i(70120);
  class V {
    constructor(e, t) {
      (this._onStudyCompleted = new (u())()),
        (this._onStudyError = new (u())()),
        (this._study = e),
        (this._chartWidget = t),
        (this._undoModel = this._chartWidget.model()),
        (this._model = this._undoModel.model()),
        this._study.onAboutToBeDestroyed().subscribe(this, () => {
          this._study.onStatusChanged().unsubscribeAll(this),
            this._study.onAboutToBeDestroyed().unsubscribeAll(this);
        }),
        this._study.onStatusChanged().subscribe(this, (e) => {
          switch (e.type) {
            case k.StudyStatusType.Completed:
              this._onStudyCompleted.fire();
              break;
            case k.StudyStatusType.Error:
              this._onStudyError.fire();
          }
        });
    }
    isUserEditEnabled() {
      return this._study.userEditEnabled();
    }
    setUserEditEnabled(e) {
      this._study.setUserEditEnabled(e);
    }
    getInputsInfo() {
      return (0, E.getStudyInputsInfo)(this._study.metaInfo());
    }
    getInputValues() {
      const e = this._study.inputs({
        symbolsForChartApi: !1,
        asObject: !0,
      });
      return Object.keys(e).map((t) => {
        const i = e[t];
        return {
          id: t,
          value: (0, v.isObject)(i) ? i.v : i,
        };
      });
    }
    getStyleInfo() {
      return (0, D.getStudyStylesInfo)(this._study.metaInfo());
    }
    getStyleValues() {
      const {
        styles: e,
        bands: t,
        filledAreas: i,
        palettes: s,
        graphics: r,
        ohlcPlots: n,
        filledAreasStyle: o,
      } = this._study.properties().state();
      return {
        styles: e,
        bands: t,
        filledAreas: i,
        palettes: s,
        graphics: r,
        ohlcPlots: n,
        filledAreasStyle: o,
      };
    }
    setInputValues(e) {
      const t = this.getInputValues();
      for (const i of e) {
        void 0 !== t.find((e) => e.id === i.id)
          ? this._study
              .properties()
              .childs()
              .inputs.childs()
              [i.id].setValue(i.value)
          : console.warn(`There is no such input: "${i.id}"`);
      }
    }
    mergeUp() {
      this._model.isMergeUpAvailableForSource(this._study) &&
        new T.MergeUpUndoCommand(this._model, this._study, null).redo();
    }
    mergeDown() {
      this._model.isMergeDownAvailableForSource(this._study) &&
        new T.MergeDownUndoCommand(this._model, this._study, null).redo();
    }
    unmergeUp() {
      this._model.isUnmergeAvailableForSource(this._study) &&
        new x.UnmergeUpUndoCommand(this._model, this._study, null).redo();
    }
    unmergeDown() {
      this._model.isUnmergeAvailableForSource(this._study) &&
        new x.UnmergeDownUndoCommand(this._model, this._study, null).redo();
    }
    onDataLoaded() {
      return this._onStudyCompleted;
    }
    onStudyError() {
      return this._onStudyError;
    }
    mergeUpWithUndo() {
      this._model.isMergeUpAvailableForSource(this._study) &&
        this._undoModel.mergeSourceUp(this._study);
    }
    mergeDownWithUndo() {
      this._model.isMergeDownAvailableForSource(this._study) &&
        this._undoModel.mergeSourceDown(this._study);
    }
    unmergeUpWithUndo() {
      this._model.isUnmergeAvailableForSource(this._study) &&
        this._undoModel.unmergeSourceUp(this._study);
    }
    unmergeDownWithUndo() {
      this._model.isUnmergeAvailableForSource(this._study) &&
        this._undoModel.unmergeSourceDown(this._study);
    }
    priceScale() {
      return new g(
        this._undoModel,
        (0, s.ensureNotNull)(this._study.priceScale())
      );
    }
    symbolSource() {
      const e = (0, s.ensureNotNull)(this._study.symbolSource());
      return {
        symbol: e.symbol(),
        currencyId: e.currency(),
        unitId: e.unit(),
      };
    }
    currency() {
      return this._study.currency();
    }
    changePriceScale(e) {
      const t = (0, s.ensureNotNull)(
          this._model.paneForSource(this._model.mainSeries())
        ),
        i = (0, s.ensureNotNull)(this._model.paneForSource(this._study));
      switch (e) {
        case "no-scale":
          (0, s.assert)(
            i.actionNoScaleIsEnabled(this._study),
            "Unable to leave a pane without any non-overlay price scale"
          ),
            new I.MoveToNewPriceScaleUndoCommand(
              this._model,
              this._study,
              i,
              "overlay",
              null
            ).redo();
          break;
        case "as-series":
          (0, s.assert)(i === t, "Study should be on the main pane"),
            new I.MoveToExistingPriceScaleUndoCommand(
              this._model,
              this._study,
              i,
              this._model.mainSeries().priceScale(),
              null
            ).redo();
          break;
        case "new-left":
          new I.MoveToNewPriceScaleUndoCommand(
            this._model,
            this._study,
            i,
            "left",
            null
          ).redo();
          break;
        case "new-right":
          new I.MoveToNewPriceScaleUndoCommand(
            this._model,
            this._study,
            i,
            "right",
            null
          ).redo();
          break;
        default:
          const r = this._model.dataSourceForId(e);
          if (null === r)
            throw new Error(`There is no study with entityId='${e}'`);
          const n = i === this._model.paneForSource(r);
          (0, s.assert)(n, "Both studies should be on the same pane");
          const o = (0, s.ensureNotNull)(r.priceScale()),
            a = (0, C.sourceNewCurrencyOnPinningToPriceScale)(
              this._study,
              o,
              this._model
            ),
            l = (0, A.sourceNewUnitOnPinningToPriceScale)(
              this._study,
              o,
              this._model
            );
          new I.MoveToExistingPriceScaleUndoCommand(
            this._model,
            this._study,
            i,
            o,
            null
          ).redo(),
            null !== a &&
              new P.SetPriceScaleCurrencyUndoCommand(
                o,
                a,
                this._undoModel.chartWidget(),
                null
              ).redo(),
            null !== l &&
              new L.SetPriceScaleUnitUndoCommand(
                o,
                l,
                this._undoModel.chartWidget(),
                null
              ).redo();
      }
    }
    isVisible() {
      return this._study.properties().childs().visible.value();
    }
    setVisible(e) {
      this._study.properties().childs().visible.setValue(e);
    }
    bringToFront() {
      this._model.bringToFront([this._study]);
    }
    sendToBack() {
      this._model.sendToBack([this._study]);
    }
    applyOverrides(e) {
      (0, a.applyOverridesToStudy)(this._study, e);
    }
    dataLength() {
      return this._study.status().type !== k.StudyStatusType.Completed
        ? 0
        : this._study.metaInfo().plots.length > 0
        ? this._study.data().size()
        : this._model.mainSeries().bars().size();
    }
    isLoading() {
      return this._study.isLoading();
    }
    properties() {
      return this._study.properties();
    }
    async applyToEntireLayout() {
      const e = new M.ActionsProvider(this._chartWidget),
        t = (await e.contextMenuActionsForSources([this._study])).find(
          (e) => "applyStudyToEntireLayout" === e.id
        );
      t && t.execute();
    }
    status() {
      return {
        ...this._study.status(),
      };
    }
    title() {
      return this._study.title();
    }
    symbolsResolved() {
      return this._study.symbolsResolved();
    }
  }
  var B = i(68582);
  class R {
    constructor(e, t) {
      (this._series = e), (this._undoModel = t), (this._model = t.model());
    }
    isUserEditEnabled() {
      return this._series.userEditEnabled();
    }
    setUserEditEnabled(e) {
      this._series.setUserEditEnabled(e);
    }
    mergeUp() {
      this._model.isMergeUpAvailableForSource(this._series) &&
        new T.MergeUpUndoCommand(this._model, this._series, null).redo();
    }
    mergeDown() {
      this._model.isMergeDownAvailableForSource(this._series) &&
        new T.MergeDownUndoCommand(this._model, this._series, null).redo();
    }
    unmergeUp() {
      this._model.isUnmergeAvailableForSource(this._series) &&
        new x.UnmergeUpUndoCommand(this._model, this._series, null).redo();
    }
    unmergeDown() {
      this._model.isUnmergeAvailableForSource(this._series) &&
        new x.UnmergeDownUndoCommand(this._model, this._series, null).redo();
    }
    detachToRight() {
      new I.MoveToNewPriceScaleUndoCommand(
        this._model,
        this._series,
        this._pane(),
        "right",
        null
      ).redo();
    }
    detachToLeft() {
      new I.MoveToNewPriceScaleUndoCommand(
        this._model,
        this._series,
        this._pane(),
        "left",
        null
      ).redo();
    }
    detachNoScale() {
      new I.MoveToNewPriceScaleUndoCommand(
        this._model,
        this._series,
        this._pane(),
        "overlay",
        null
      ).redo();
    }
    changePriceScale(e) {
      const t = (0, s.ensureNotNull)(this._model.paneForSource(this._series));
      switch (e) {
        case "new-left":
          new I.MoveToNewPriceScaleUndoCommand(
            this._model,
            this._series,
            t,
            "left",
            null
          ).redo();
          break;
        case "new-right":
          new I.MoveToNewPriceScaleUndoCommand(
            this._model,
            this._series,
            t,
            "right",
            null
          ).redo();
          break;
        case "no-scale":
          (0, s.assert)(
            t.actionNoScaleIsEnabled(this._series),
            "Unable to leave a pane without any non-overlay price scale"
          ),
            new I.MoveToNewPriceScaleUndoCommand(
              this._model,
              this._series,
              t,
              "overlay",
              null
            ).redo();
          break;
        default:
          const i = this._model.dataSourceForId(e);
          if (null === i)
            throw new Error(`There is no study with entityId='${e}'`);
          const r = this._model.paneForSource(i) === t;
          (0, s.assert)(r, "Study should be on the main pane");
          const n = (0, s.ensureNotNull)(i.priceScale());
          new I.MoveToExistingPriceScaleUndoCommand(
            this._model,
            this._series,
            t,
            n,
            null
          ).redo();
      }
    }
    isVisible() {
      return this._series.properties().childs().visible.value();
    }
    setVisible(e) {
      this._series.properties().childs().visible.setValue(e);
    }
    bringToFront() {
      this._model.bringToFront([this._series]);
    }
    sendToBack() {
      this._model.sendToBack([this._series]);
    }
    entityId() {
      return this._series.id();
    }
    chartStyleProperties(e) {
      return this._series
        .properties()
        .childs()
        [N(e)].state(["inputs", "inputsInfo"]);
    }
    setChartStyleProperties(e, t) {
      this._series.properties().childs()[N(e)].mergeAndFire(t);
    }
    barsCount() {
      return this._series.bars().size();
    }
    symbolSource() {
      return {
        symbol: this._series.symbol(),
        currencyId: this._series.currency(),
        unitId: this._series.unit(),
      };
    }
    isLoading() {
      return this._series.isLoading();
    }
    data() {
      return this._series.data();
    }
    priceScale() {
      return new g(this._undoModel, this._series.priceScale());
    }
    _pane() {
      return (0, s.ensureNotNull)(this._model.paneForSource(this._series));
    }
  }

  function N(e) {
    switch (e) {
      case 0:
        return "barStyle";
      case 1:
        return "candleStyle";
      case 2:
        return "lineStyle";
      case 14:
        return "lineWithMarkersStyle";
      case 15:
        return "steplineStyle";
      case 3:
        return "areaStyle";
      case 16:
        return "hlcAreaStyle";
      case 4:
        return "renkoStyle";
      case 5:
        return "kagiStyle";
      case 6:
        return "pnfStyle";
      case 7:
        return "pbStyle";
      case 8:
        return "haStyle";
      case 9:
        return "hollowCandleStyle";
      case 10:
        return "baselineStyle";
      case 11:
        return "rangeStyle";
      case 12:
        return "hiloStyle";
      case 13:
        return "columnStyle";
      default:
        (0, s.ensureNever)(e);
    }
    throw new Error(`unsupported chart style: ${e}`);
  }
  var O = i(32112),
    F = i(95367),
    W = i(610);

  function z(e, t) {
    const i = () => {
        e.completed().unsubscribe(null, s), t(!1);
      },
      s = () => {
        e.error().unsubscribe(null, i), t(!0);
      };
    e.completed().subscribe(null, i, !0), e.error().subscribe(null, s, !0);
  }
  var H = i(21866),
    U = i(42856),
    j = i(88348),
    G = i(88913),
    q = i(66764),
    $ = i(58275),
    Y = i.n($),
    K = i(77475),
    Z = i(5286);
  const X = new n.TranslatedString(
      "change price to bar ratio",
      r.t(null, void 0, i(69510))
    ),
    J = new n.TranslatedString(
      "toggle lock scale",
      r.t(null, void 0, i(21203))
    ),
    Q = new n.TranslatedString(
      "change series style",
      r.t(null, void 0, i(53438))
    );
  class ee {
    constructor(e, t) {
      (this._visibleBarsChanged = new (u())()),
        (this._crosshairMoved = new (u())()),
        (this._ranges = null),
        (this._panes = new WeakMap()),
        (this._studies = new WeakMap()),
        (this._lineDataSources = new WeakMap()),
        (this._selectionApi = null),
        (this._prevVisibleRange = null),
        (this._chartWidget = e),
        (this._activateChart = t),
        (this._timezoneApi = new m(e)),
        this._chartWidget.withModel(this, () => {
          this._chartWidget
            .model()
            .crossHairSource()
            .moved()
            .subscribe(this, this._onCrosshairMoved),
            this._chartWidget
              .model()
              .timeScale()
              .logicalRangeChanged()
              .subscribe(this, this._onLogicalRangeChanged);
        }),
        (this._widgetLinkingGroupIndex = e.linkingGroupIndex().spawn()),
        this._widgetLinkingGroupIndex.subscribe((e) =>
          this._apiLinkingGroupIndex.setValue(e)
        ),
        (this._apiLinkingGroupIndex = new (Y())(
          this._widgetLinkingGroupIndex.value()
        )),
        this._apiLinkingGroupIndex.subscribe((e) => {
          this._widgetLinkingGroupIndex.value() !== e &&
            (this._chartWidget.hasModel()
              ? this._chartWidget.model().setLinkingGroupIndex(e)
              : this._widgetLinkingGroupIndex.setValue(e));
        }),
        this._chartWidget
          .onAboutToBeDestroyed()
          .subscribe(this, this._destroy, !0);
    }
    setActive() {
      this._activateChart();
    }
    getPriceToBarRatio() {
      return this._chartWidget
        .model()
        .model()
        .mainSeriesScaleRatioProperty()
        .value();
    }
    setPriceToBarRatio(e, t) {
      const i = this._chartWidget.model(),
        s = i.model(),
        r = s.mainSeriesScaleRatioProperty();
      (null == t ? void 0 : t.disableUndo)
        ? new W.SetScaleRatioPropertiesCommand(r, e, null, s).redo()
        : i.setScaleRatioProperty(r, e, X);
    }
    isPriceToBarRatioLocked() {
      return this._chartWidget
        .model()
        .model()
        .mainSeries()
        .priceScale()
        .isLockScale();
    }
    setPriceToBarRatioLocked(e, t) {
      const i = this._chartWidget.model(),
        s = i.model(),
        r = s.mainSeries().priceScale();
      (null == t ? void 0 : t.disableUndo)
        ? new F.SetPriceScaleModeCommand(
            {
              lockScale: e,
            },
            r,
            null,
            s
          ).redo()
        : i.setPriceScaleMode(
            {
              lockScale: e,
            },
            r,
            J
          );
    }
    id() {
      return this._chartWidget.id();
    }
    onDataLoaded() {
      return this._makeSubscriptionFromDelegate(
        this._chartWidget.model().mainSeries().dataEvents().completed()
      );
    }
    onSymbolChanged() {
      return this._makeSubscriptionFromDelegate(
        this._chartWidget.model().mainSeries().dataEvents().symbolResolved()
      );
    }
    onIntervalChanged() {
      return this._makeSubscriptionFromDelegate(
        this._chartWidget.model().mainSeries().onIntervalChanged()
      );
    }
    onVisibleRangeChanged() {
      return this._makeSubscriptionFromDelegate(this._visibleBarsChanged);
    }
    onChartTypeChanged() {
      return this._makeSubscriptionFromDelegate(
        this._chartWidget.model().mainSeries().onStyleChanged()
      );
    }
    onSeriesTimeframe() {
      return this._makeSubscriptionFromDelegate(
        this._chartWidget.model().mainSeries().dataEvents().seriesTimeFrame()
      );
    }
    whenChartReady(e) {
      this._chartWidget.withModel(this, e);
    }
    crossHairMoved() {
      return this._makeSubscriptionFromDelegate(this._crosshairMoved);
    }
    setVisibleRange(e, t) {
      return new Promise((i) => {
        this._chartWidget.setVisibleTimeRange(e.from, e.to, t, i);
      });
    }
    setSymbol(e, t) {
      (0, v.isFunction)(t) &&
        (t = {
          dataReady: t,
        });
      const { dataReady: i, doNotActivateChart: s } = t || {};
      if (e === this.symbol()) return void (null == i || i());
      const r = (e) => {
          !e && i && i();
        },
        n = this._chartWidget.model().mainSeries().dataEvents();
      i && z(n, r), s || this._activateChart(), this._chartWidget.setSymbol(e);
    }
    setResolution(e, t) {
      (0, v.isFunction)(t) &&
        (t = {
          dataReady: t,
        });
      const { dataReady: i, doNotActivateChart: s } = t || {};
      let r = o.Interval.normalize(e);
      if (
        (null !== r &&
          (r = this._chartWidget
            .model()
            .mainSeries()
            .getSupportedResolution(r)),
        null === r || r === this.resolution())
      )
        return void (null == i || i());
      const n = (e) => {
          !e && i && i();
        },
        a = this._chartWidget.model().mainSeries().dataEvents();
      i && z(a, n),
        s || this._activateChart(),
        this._chartWidget.setResolution(r);
    }
    setChartType(e, t) {
      const i = this._chartWidget
        .model()
        .mainSeries()
        .properties()
        .childs().style;
      if (i.value() === e) return void (null == t || t());
      const s = (e) => {
          !e && t && t();
        },
        r = this._chartWidget.model().mainSeries().dataEvents();
      t && z(r, s), this._chartWidget.model().setChartStyleProperty(i, e, Q);
    }
    resetData() {
      this._chartWidget.model().mainSeries().rerequestData();
    }
    getBarsMarksSources() {
      return this._chartWidget.model().barsMarksSources();
    }
    getAllStudies() {
      return this._chartWidget
        .model()
        .model()
        .allStudies(!0)
        .map(f.studyEntityInfo);
    }
    getAllPanesHeight() {
      const e = this._chartWidget.model().model().panes();
      if (this._chartWidget.isMaximizedPane()) {
        let t = 0,
          i = 0;
        e.forEach((e) => {
          (t += e.height()), (i += e.stretchFactor());
        });
        const s = i / t;
        return e.map((e) => Math.round((e.stretchFactor() / s) * 100) / 100);
      }
      return e.map((e) => e.height());
    }
    setAllPanesHeight(e) {
      const t = this._chartWidget.model().model(),
        i = t.panes();
      (0, s.assert)(
        i.length === e.length,
        "There`s a mismatch between the number of heights you provided and the number of panes."
      );
      const r =
        i.reduce((e, t) => e + t.stretchFactor(), 0) /
        e.reduce((e, t) => e + t);
      e.forEach((e, t) => {
        const s = e * r;
        i[t].setStretchFactor(s);
      }),
        t.fullUpdate();
    }
    maximizeChart() {
      this._chartWidget.requestFullscreen();
    }
    isMaximized() {
      return this._chartWidget.inFullscreen();
    }
    restoreChart() {
      this._chartWidget.exitFullscreen();
    }
    sessions() {
      return this._chartWidget.model().model().sessions();
    }
    chartModel() {
      return this._chartWidget.model().model();
    }
    getTimeScaleLogicalRange() {
      return this._chartWidget.model().timeScale().logicalRange();
    }
    createStudy(e, t, i, s, r, n) {
      if ("function" == typeof r)
        return (
          console.warn(
            '"createStudy" does not take "callback" parameter anymore'
          ),
          Promise.resolve(null)
        );
      if (((n = n || {}), "string" != typeof e)) return this._createStudy(e);
      if (n.checkLimit && !this._chartWidget.model().canCreateStudy())
        return (0, H.showTooManyStudiesNotice)(), Promise.resolve(null);
      e = e.toLowerCase();
      const o = n.disableUndo
          ? this._chartWidget.model().model()
          : this._chartWidget.model(),
        l = U.StudyMetaInfo.findStudyMetaInfoByDescription(
          o.studiesMetaData(),
          e
        ),
        c = o.createStudyInserter(
          {
            type: "java",
            studyId: l.id,
          },
          []
        );
      if (
        (c.setForceOverlay(!!t),
        n.priceScale &&
          c.setPreferredPriceScale(
            (function (e) {
              switch (e) {
                case "no-scale":
                  return "overlay";
                case "as-series":
                  return "as-series";
                case "new-left":
                  return "left";
                case "new-right":
                  return "right";
                default:
                  throw new Error(
                    'The pricescale "' +
                      e +
                      '" is invalid, the only valid options are "no-scale", "as-series", "new-left" and "new-right".'
                  );
              }
            })(n.priceScale)
          ),
        n.allowChangeCurrency && c.setAllowChangeCurrency(!0),
        n.allowChangeUnit && c.setAllowChangeUnit(!0),
        Array.isArray(s))
      ) {
        console.warn(
          "Passing study inputs as an ordered array is now deprecated. Please use an object where keys correspond to the inputs of your study instead."
        );
        const e = {};
        for (let t = 0; t < l.inputs.length; ++t) e[l.inputs[t].id] = s[t];
        s = e;
      }

      return c
        .insert(() =>
          Promise.resolve({
            inputs: s || {},
            parentSources: [],
          })
        )
        .then(
          (e) => (
            r && (0, a.applyOverridesToStudy)(e, r),
            i && e.setUserEditEnabled(!1),
            e.id()
          )
        );
    }

    getStudyById(e) {
      const t = this._chartWidget.model().model().getStudyById(e);
      if (null === t) throw new Error("There is no such study");
      return this._getStudyApi(t);
    }

    getSeries() {
      const e = this._chartWidget.model(),
        t = e.mainSeries();
      return new R(t, e);
    }

    getShapeById(e) {
      const t = this._chartWidget.model().model().getLineToolById(e);
      if (null === t) throw new Error("There is no such shape");
      return this._getLineDataSourceApi(t);
    }

    selection() {
      return (
        null === this._selectionApi &&
          (this._selectionApi = new O.SelectionApi(
            this._chartWidget.model().model()
          )),
        this._selectionApi
      );
    }

    symbol() {
      return this._chartWidget.symbolWV().value();
    }

    symbolExt() {
      const e = this._chartWidget.model().mainSeries().symbolInfo();
      return null === e
        ? null
        : {
            symbol: e.name,
            full_name: e.full_name,
            exchange: e.exchange,
            description: e.description,
            type: e.type,
            pro_name: e.pro_name,
            typespecs: e.typespecs,
            delay: e.delay,
          };
    }

    resolution() {
      return this._chartWidget.model().mainSeries().interval();
    }

    marketStatus() {
      return this._chartWidget
        .model()
        .mainSeries()
        .marketStatusModel()
        .status()
        .spawn();
    }
    getVisibleRange() {
      const e = {
          from: 0,
          to: 0,
        },
        t = this._chartWidget.model().timeScale(),
        i = t.visibleBarsStrictRange();
      if (null === i) return e;
      const r = i.firstBar(),
        n = i.lastBar(),
        o = this._convertIndexToPublicTime(n);
      if (null === o) return e;
      const a = Math.max(
        (0, s.ensureNotNull)(t.points().range().value()).firstIndex,
        r
      );
      return (
        (e.from = (0, s.ensureNotNull)(this._convertIndexToPublicTime(a))),
        (e.to = o),
        e
      );
    }
    getTimezoneApi() {
      return this._timezoneApi;
    }

    getPanes() {
      return this._chartWidget
        .model()
        .model()
        .panes()
        .map((e) => this._getPaneApi(e));
    }

    exportData(e) {
      const t = {
        ...e,
      };
      return (
        void 0 !== t.from && (t.from = this._convertTimeFromPublic(t.from)),
        void 0 !== t.to && (t.to = this._convertTimeFromPublic(t.to)),
        i
          .e(9498)
          .then(i.bind(i, 50210))
          .then((e) => e.exportData(this._chartWidget.model().model(), t))
      );
    }

    isSelectBarRequested() {
      return (
        this._chartWidget.selectPointMode().value() !== j.SelectPointMode.None
      );
    }

    barTimeToEndOfPeriod(e) {
      const t = this._prepareEndOfPeriodArgs();
      return (0, c.barTimeToEndOfPeriod)(t.barBuilder, e, t.intervalObj);
    }

    endOfPeriodToBarTime(e) {
      const t = this._prepareEndOfPeriodArgs();
      return (0, c.endOfPeriodToBarTime)(t.barBuilder, e, t.intervalObj);
    }

    createAnchoredShape(e, t) {
      if (!0 !== G.supportedLineTools[t.shape].isAnchored)
        return (
          console.warn(
            `${t.shape} is not an anchored shape. It can be created using createShape or createMultipointShape`
          ),
          null
        );
      const i = this._chartWidget.model().model(),
        s = i.mainSeries();
      if (i.timeScale().isEmpty()) return null;
      const r =
          void 0 !== t.ownerStudyId ? i.dataSourceForId(t.ownerStudyId) : s,
        n = this._convertPositionPercentToPricedPoint(e, r);
      return null === n ? null : this.createMultipointShape([n], t);
    }

    properties() {
      return this._chartWidget.properties();
    }

    setBarSpacing(e) {
      this._chartWidget.model().timeScale().setBarSpacing(e);
    }

    scrollChartByBar(e) {
      this._chartWidget.model().scrollChartByBar(e);
    }

    mergeAllScales(e) {
      this._chartWidget.model().mergeAllScales(e);
    }

    chartPainted() {
      return this._chartWidget.chartPainted();
    }

    applyOverrides(e) {
      this._chartWidget.applyOverrides(e);
    }

    addOverlayStudy(e, t, i) {
      return this._chartWidget.addOverlayStudy(e, t, i);
    }

    lineToolsSynchronizer() {
      return this._chartWidget.lineToolsSynchronizer();
    }
    linkingGroupIndex() {
      return this._apiLinkingGroupIndex.spawn();
    }

    ranges() {
      throw new Error("not implemented");
    }

    getTimeScale() {
      return new h(this._chartWidget.model().timeScale());
    }

    async loadChartTemplate(e) {
      await (0, Z.loadTheme)(this._chartWidget.chartWidgetCollection(), {
        themeName: e,
        standardTheme: !1,
        noUndo: !1,
        onlyActiveChart: !0,
      });
    }

    setTimeFrame(e) {
      this.setActive(), this._chartWidget.loadRange(e);
    }

    _destroy() {
      this._chartWidget.hasModel() &&
        (this._chartWidget
          .model()
          .crossHairSource()
          .moved()
          .unsubscribeAll(this),
        this._chartWidget
          .model()
          .timeScale()
          .logicalRangeChanged()
          .unsubscribe(this, this._onLogicalRangeChanged)),
        this._widgetLinkingGroupIndex.destroy();
    }

    _createStudy(e) {
      return Promise.reject("Pine Script™ and java studies are not supported");
    }

    _convertTimeToPublic(e) {
      return this._getTimeConverter().convertInternalTimeToPublicTime(e);
    }

    _convertIndexToPublicTime(e) {
      return null === this._chartWidget.model().mainSeries().symbolInfo()
        ? null
        : this._getTimeConverter().convertTimePointIndexToPublicTime(e);
    }

    _getDefaultCreateMultipointShapeOptions() {
      return {
        filled: !0,
      };
    }

    _convertPositionPercentToPricedPoint(e, t) {
      const i = this._chartWidget.model().timeScale(),
        s = t.priceScale(),
        r = t.firstValue();
      if (null == r || !isFinite(r) || null === s) return null;
      const n = i.coordinateToIndex(e.x * i.width()),
        o = i.indexToTimePoint(n);
      if (null === o) return null;
      return {
        price: s.coordinateToPrice(e.y * s.height(), r),
        time: o,
      };
    }

    _convertUserPointsToDataSource(e) {
      const t = this._chartWidget.model().model(),
        i = t.mainSeries(),
        r = t.timeScale().points(),
        n = i.data();
      if (t.timeScale().isEmpty()) return null;
      const o = e.map((e) => e.time || 0),
        a = this._alignPoints(o),
        l = (e, t, o) => {
          const a = r.closestIndexLeft(e) || 0,
            l = {
              index: a,
              price: NaN,
            },
            c = (0, s.ensureNotNull)(r.valueAt(a)),
            h = (0, s.ensureNotNull)(r.range().value());
          if (e > c && a === h.lastIndex) {
            const t = (0, s.ensureNotNull)(i.syncModel()).distance(c, e);
            t.success && (l.index = l.index + t.result);
          } else if (e < c && a === h.firstIndex) {
            const t = (0, s.ensureNotNull)(i.syncModel()).distance(e, c);
            t.success && (l.index = l.index - t.result);
          }
          if ((0, v.isNumber)(t)) l.price = t;
          else {
            const e = ["open", "high", "low", "close"];
            let t = o ? e.indexOf(o) + 1 : 1;
            t <= 0 && (t = 1),
              (l.price = (0, s.ensure)((0, s.ensureNotNull)(n.valueAt(a))[t]));
          }
          return l;
        },
        c = [];
      for (let t = 0; t < e.length; t++) {
        const i = e[t];
        c.push(l(a[t], i.price, i.channel));
      }
      return c;
    }

    _convertTimeFromPublic(e) {
      return this._getTimeConverter().convertPublicTimeToInternalTime(e);
    }

    _getTimeConverter() {
      const e = this._chartWidget.model().mainSeries();
      return (0, q.getChartWidgetApiTimeConverter)(
        e.interval(),
        (0, s.ensureNotNull)(e.symbolInfo(), "main series symbol info"),
        this._chartWidget.model().model()
      );
    }

    _onCrosshairMoved(e) {
      const t = this._convertIndexToPublicTime(e.index);
      null !== t &&
        this._crosshairMoved.fire({
          price: e.price,
          time: t,
        });
    }

    _makeSubscriptionFromDelegate(e) {
      return {
        subscribe: e.subscribe.bind(e),
        unsubscribe: e.unsubscribe.bind(e),
        unsubscribeAll: e.unsubscribeAll.bind(e),
      };
    }

    _prepareEndOfPeriodArgs() {
      const e = this._chartWidget.model().model(),
        t = e.timezone(),
        i = (0, s.ensureNotNull)(e.mainSeries().symbolInfo()),
        r = e.mainSeries().interval(),
        n = new l.SessionInfo(t, i.session, i.session_holidays, i.corrections);
      return {
        barBuilder: (0, l.newBarBuilder)(r, n, n),
        intervalObj: o.Interval.parse(r),
      };
    }

    _getPaneApi(e) {
      let t = this._panes.get(e);
      return (
        void 0 === t &&
          ((t = new w(e, this._chartWidget)), this._panes.set(e, t)),
        t
      );
    }

    _getStudyApi(e) {
      let t = this._studies.get(e);
      return (
        void 0 === t &&
          ((t = new V(e, this._chartWidget)), this._studies.set(e, t)),
        t
      );
    }

    _getLineDataSourceApi(e) {
      let t = this._lineDataSources.get(e);
      return (
        void 0 === t &&
          ((t = new B.LineDataSourceApi(e, this._chartWidget.model(), {
            apiPointsToDataSource:
              this._convertUserPointsToDataSource.bind(this),
            dataSourcePointsToPriced: (e) => {
              const t = (0, s.ensureNotNull)(
                  this._chartWidget.model().mainSeries().syncModel()
                ),
                i = this._chartWidget.model().timeScale();
              return e.map((e) => {
                const s = i.normalizeBarIndex(e.index);
                return {
                  price: e.price,
                  time: this._convertTimeToPublic(
                    t.projectTime(s.time_t, s.offset)
                  ),
                };
              });
            },
          })),
          this._lineDataSources.set(e, t)),
        t
      );
    }

    _alignPoints(e) {
      const t = this._chartWidget.model().model(),
        i = t.mainSeries(),
        s = i.interval(),
        r = i.symbolInfo();
      if (t.timeScale().isEmpty() || !o.Interval.isDWM(s) || null === r)
        return e;
      const n = (0, K.createDwmAligner)(s, r);
      return null === n ? e : e.map((e) => n.timeToSessionStart(1e3 * e) / 1e3);
    }
    _onLogicalRangeChanged() {
      const e = this._chartWidget.model().mainSeries(),
        t = e.data().isEmpty();
      if (
        null !==
          this._chartWidget.model().timeScale().visibleBarsStrictRange() &&
        t
      )
        return void e
          .dataEvents()
          .completed()
          .subscribe(this, this._onLogicalRangeChanged, !0);
      const i = this.getVisibleRange();
      (null !== this._prevVisibleRange &&
        (0, v.deepEquals)(this._prevVisibleRange, i)[0]) ||
        ((this._prevVisibleRange = i), this._visibleBarsChanged.fire(i));
    }
  }
};
