import { getLogger } from "path/to/logger"; // !
import { enabled } from "./helpers";
import { ensureDefined } from "./assertions";

import { ensureNotNull } from "./assertions";
import {
  pointAdded,
  pointChanged,
  startChanging,
  setPoint,
  model,
  endChanging,
  syncMultichartState,
} from "path/to/lineDataSource"; // ! not correct

import formatter from "formatter";

class CustomLineDataSource extends LineDataSource {
  constructor(lineSource, pointIndex) {
    super();
    this._lineSource = lineSource;
    this._pointIndex = pointIndex;

    pointAdded().subscribe(this, (index) => {
      if (this._pointIndex === index) {
        this._listeners.fire(this);
      }
    });

    pointChanged().subscribe(this, (index) => {
      if (this._pointIndex === index) {
        this._listeners.fire(this);
      }
    });
  }

  value() {
    const price = this._lineSource.points()[this._pointIndex].price;
    const lineOwnerSource = ensureNotNull(this._lineSource.ownerSource());
    const lineFormatter = formatter(lineOwnerSource);
    if (lineFormatter.parse) {
      const formattedPrice = lineFormatter.format(price);
      const parsedPrice = lineFormatter.parse(formattedPrice);
      return parsedPrice.res ? parsedPrice.value : price;
    }
    return price;
  }

  setValue(value) {
    const point = this._lineSource.points()[this._pointIndex];
    point.price = parseFloat("" + value);
    this._lineSource[startChanging](this._pointIndex, point);
    this._lineSource[setPoint](this._pointIndex, point);
    this._lineSource[model]()[updateSource](this._lineSource);
    this._listeners.fire(this);
    const endChangingResult = this._lineSource[endChanging](true, false);
    this._lineSource[syncMultichartState](endChangingResult);
  }
}

class LineDataSource {
  constructor() {
    this._states = [];
  }

  start(state) {
    this._states.push(state);
  }

  finish(newState) {
    const prevState = ensureDefined(this._states.pop());
    if (newState.length !== prevState.length) {
      return {
        indexesChanged: true,
        pricesChanged: true,
      };
    }
    return newState.reduce(
      (result, point, index) => {
        const prevPoint = prevState[index];
        result.indexesChanged =
          result.indexesChanged || point.index !== prevPoint.index;
        result.pricesChanged =
          result.pricesChanged || point.price !== prevPoint.price;
        return result;
      },
      {
        indexesChanged: false,
        pricesChanged: false,
      }
    );
  }

  isEmpty() {
    return this._states.length === 0;
  }
}

const logger = getLogger("Chart.LineDataSource");
const isCopyPasteEnabled = enabled("datasource_copypaste");

// Other necessary imports
import { ensureDefined } from "path/to/ensureDefined";

// Rest of the code...

export { LineDataSource, logger, isCopyPasteEnabled };

export { CustomLineDataSource };

let N = 0;
class LineDataSource extends DataSource {
  constructor(e, t, i, s) {
    if (
      (super(s),
      (this.version = 1),
      (this.toolname = ""),
      (this.customization = {
        forcePriceAxisLabel: !1,
        disableErasing: !1,
        disableSave: !1,
        showInObjectsTree: !0,
      }),
      (this._currentPointsetAndSymbolId = null),
      (this._pointChanged = new (c())()),
      (this._pointAdded = new (c())()),
      (this._priceAxisViews = []),
      (this._timeAxisViews = []),
      (this._timePoint = []),
      (this._points = []),
      (this._lastPoint = null),
      (this._paneViews = new Map()),
      (this._normalizedPointsChanged = new (c())()),
      (this._fixedPointsChanged = new (c())()),
      (this._changeStatesStack = new R()),
      (this._startMovingPoint = null),
      (this._currentMovingPoint = null),
      (this._isActualSymbol = !1),
      (this._isActualInterval = !1),
      (this._isActualCurrency = !1),
      (this._isActualUnit = !1),
      (this._isDestroyed = !1),
      (this._sharingMode = new (u())(0)),
      (this._onTemplateApplying = new (c())()),
      (this._onTemplateApplied = new (c())()),
      (this._syncStateExclusions = []),
      (this._definitionsViewModel = null),
      (this._syncLineStyleMuted = !1),
      (this._onIsActualIntervalChange = new (c())()),
      (this._linkKey = new (u())(null)),
      (this._serverUpdateTime = null),
      (this._boundCalcIsActualSymbol = this.calcIsActualSymbol.bind(this)),
      (this._alertUndoMode = !1),
      (this._model = e),
      (this._properties = t),
      (this._localAndServerAlertsMismatch = !1),
      this._properties.hasChild("interval") ||
        this._properties.addChild(
          "interval",
          new (b())(e.mainSeries().interval())
        ),
      this.calcIsActualSymbol(),
      this._properties
        .childs()
        .intervalsVisibilities.listeners()
        .subscribe(this, this.calcIsActualSymbol),
      this._properties.subscribe(this, () => this.propertiesChanged()),
      this._createPointsProperties(),
      this.pointsCount() > 0)
    )
      for (let e = 0; e < this.pointsCount(); e++)
        this._priceAxisViews.push(this.createPriceAxisView(e)),
          this._timeAxisViews.push(new L.LineDataSourceTimeAxisView(this, e));
    this._properties.childs().visible.subscribe(this, (e) => {
      const t = !1 === (0, w.hideAllDrawings)().value();
      e.value()
        ? e.value() && t && n.emit("drawing_event", this._id, "show")
        : (this._model.selection().isSelected(this) &&
            this._model.selectionMacro((e) => {
              e.removeSourceFromSelection(this);
            }),
          t && n.emit("drawing_event", this._id, "hide")),
        this._onSourceHiddenMayChange();
    }),
      (0, w.hideAllDrawings)().subscribe(this, this._onSourceHiddenMayChange),
      (this._definitionsViewModel = null),
      (this._isDestroyed = !1);
  }
  destroy() {
    this._paneViews.forEach((e, t) => this._destroyPanePaneViews(t)),
      this.stop(),
      null !== this._definitionsViewModel &&
        (this._definitionsViewModel.destroy(),
        (this._definitionsViewModel = null)),
      null !== this._ownerSource &&
        (this._ownerSource.currencyChanged().unsubscribeAll(this),
        this._ownerSource.unitChanged().unsubscribeAll(this),
        (0, I.isSymbolSource)(this._ownerSource) &&
          (this._ownerSource
            .symbolResolved()
            .subscribe(this, this._boundCalcIsActualSymbol),
          this._ownerSource
            .isActingAsSymbolSource()
            .unsubscribe(this._boundCalcIsActualSymbol))),
      this.ownerSourceChanged().unsubscribeAll(this),
      (0, w.hideAllDrawings)().unsubscribeAll(this),
      (this._isDestroyed = !0);
  }
  priceScale() {
    return this._ownerSource ? this._ownerSource.priceScale() : null;
  }
  createPriceAxisView(e) {
    return new k.LineToolPriceAxisView(this, {
      pointIndex: e,
    });
  }
  model() {
    return this._model;
  }
  symbol() {
    return this._properties.childs().symbol.value();
  }
  linkKey() {
    return this._linkKey;
  }
  serverUpdateTime() {
    return this._serverUpdateTime;
  }
  setServerUpdateTime(e) {
    this._serverUpdateTime = e;
  }
  boundToSymbol() {
    return !0;
  }
  isAvailableInFloatingWidget() {
    return !0;
  }
  points() {
    const e = [];
    for (let t = 0; t < this._points.length; t++) {
      const i = this._points[t];
      e.push({
        index: i.index,
        price: i.price,
        time: i.time,
      });
    }
    return (
      this._lastPoint && e.push(this._correctLastPoint(this._lastPoint)),
      !this.isFixed() &&
        this._currentMovingPoint &&
        this._startMovingPoint &&
        this._correctPoints(e),
      e
    );
  }
  timeAxisPoints() {
    return this.points();
  }
  priceAxisPoints() {
    return this.points();
  }
  fixedPoint() {
    var e;
    let t;
    const i = this.priceScale();
    if (this._positionPercents && null !== i && !i.isEmpty()) {
      const e = this._positionPercents,
        r = this._model.timeScale().width() * e.x,
        n = i.height() * e.y;
      t = new s.Point(r, n);
    } else
      void 0 !== this._fixedPoint &&
        (t =
          null === (e = this._fixedPoint) || void 0 === e ? void 0 : e.clone());
    if (this._currentMovingPoint && this._startMovingPoint && void 0 !== t) {
      const e = this._correctFixedPoint(t);
      e.didCorrect && (t = e.point);
    }
    return t;
  }
  positionPercents() {
    return this._positionPercents;
  }
  normalizedPoints() {
    return this._timePoint;
  }
  normalizedPointsChanged() {
    return this._normalizedPointsChanged;
  }
  fixedPointChanged() {
    return this._fixedPointsChanged;
  }
  geometry() {
    const e = (0, r.ensureNotNull)(this.priceScale());
    return this.points().map((t) => {
      const i = (0, r.ensureNotNull)(this.pointToScreenPoint(t)),
        n = i.x / this._model.timeScale().width(),
        o = i.y / e.height();
      return new s.Point(n, o);
    });
  }
  widthsProperty() {
    var e;
    return null !== (e = this._properties.childs().linesWidths) && void 0 !== e
      ? e
      : null;
  }
  lineColorsProperty() {
    var e;
    return null !== (e = this._properties.childs().linesColors) && void 0 !== e
      ? e
      : null;
  }
  backgroundColorsProperty() {
    var e;
    return null !== (e = this._properties.childs().backgroundsColors) &&
      void 0 !== e
      ? e
      : null;
  }
  textColorsProperty() {
    var e;
    return null !== (e = this._properties.childs().textsColors) && void 0 !== e
      ? e
      : null;
  }
  pointsProperty() {
    return this._pointsProperty;
  }
  hasEditableCoordinates() {
    return !0;
  }
  startMoving(e, t, i, s) {
    this.isFixed() && this.restoreFixedPoint(), (this._startMovingPoint = e);
  }
  move(e, t, i, s) {
    if (i && (i.shiftOnly() || i.modShift()))
      if (this.isFixed()) {
        const t = this._alignScreenPointHorizontallyOrVertically(
          (0, r.ensureDefined)(e.screen)
        );
        this._currentMovingPoint = {
          screen: t,
        };
      } else {
        const t = this._alignPointHorizontallyOrVertically(
            (0, r.ensureDefined)(e.logical)
          ),
          i = (0, r.ensureNotNull)(this.pointToScreenPoint(t));
        this._currentMovingPoint = {
          logical: t,
          screen: i,
        };
      }
    else this._currentMovingPoint = e;
    this.updateAllViews((0, T.sourceChangeEvent)(this.id()));
  }
  endMoving(e, t, i) {
    let s = !1,
      o = !1;
    if (this._currentMovingPoint && this._startMovingPoint) {
      if (this.isFixed()) {
        const e = this._correctFixedPoint(
          (0, r.ensureDefined)(this._fixedPoint)
        );
        e.didCorrect &&
          ((this._fixedPoint = e.point), this._fixedPointsChanged.fire());
      } else {
        const e = (0, r.ensureDefined)(this._currentMovingPoint.logical),
          t = (0, r.ensureDefined)(this._startMovingPoint.logical);
        (s = e.index !== t.index), (o = e.price !== t.price);
        if (this._correctPoints(this._points, i)) {
          n.emit("drawing_event", this._id, "move"),
            n.emit("drawing_event", this._id, "points_changed");
          for (let e = 0; e < this._points.length; e++)
            this._pointChanged.fire(e);
        }
      }
      (this._startMovingPoint = null), (this._currentMovingPoint = null);
    }
    const a = {
      indexesChanged: s,
      pricesChanged: o,
    };
    return this.isFixed()
      ? (this.calcPositionPercents(),
        this.updateAllViews((0, T.sourceChangeEvent)(this.id())),
        a)
      : (this.updateAllViews((0, T.sourceChangeEvent)(this.id())),
        s && !e
          ? (this._properties
              .childs()
              .interval.setValue(this._model.mainSeries().interval()),
            this.normalizePoints(),
            this.createServerPoints())
          : (this._copyPricesWithoutNormalization(),
            this._normalizedPointsChanged.fire()),
        a);
  }
  startMovingPoint() {
    return this._startMovingPoint
      ? {
          ...this._startMovingPoint,
        }
      : null;
  }
  currentMovingPoint() {
    return this._currentMovingPoint
      ? {
          ...this._currentMovingPoint,
        }
      : null;
  }
  startChanging(e, t) {
    void 0 !== e &&
      void 0 !== t &&
      (e < this._priceAxisViews.length && this._priceAxisViews[e].setActive(!0),
      e < this._timeAxisViews.length && this._timeAxisViews[e].setActive(!0)),
      this._changeStatesStack.start(this.points());
  }
  endChanging(e, t, i) {
    const s = this._changeStatesStack.finish(this.points());
    s.indexesChanged && this._changeStatesStack.isEmpty()
      ? (this._properties
          .childs()
          .interval.setValue(this._model.mainSeries().interval()),
        this.normalizePoints(),
        t || this.createServerPoints())
      : (this._copyPricesWithoutNormalization(),
        this._normalizedPointsChanged.fire()),
      n.emit("drawing_event", this._id, "points_changed");
    for (let e = 0; e < this._priceAxisViews.length; e++)
      this._priceAxisViews[e].setActive(!1);
    for (let e = 0; e < this._timeAxisViews.length; e++)
      this._timeAxisViews[e].setActive(!1);
    return s;
  }
  setPoint(e, t, i, s) {
    if (i && i.shift() && this._snapTo45DegreesAvailable()) {
      const i = 0 === e ? 1 : e - 1;
      this._snapPoint45Degree(t, this.points()[i]);
    }
    this._setPoint(e, t);
  }
  getPoint(e) {
    return this.points()[e] || null;
  }
  alignCrossHairToAnchor(e) {
    return !0;
  }
  setLastPoint(e, t) {
    return (
      (this._lastPoint = this._preparePoint(e, t)),
      this.updateAllViews((0, T.sourceChangeEvent)(this.id())),
      this._lastPoint
    );
  }
  lastPoint() {
    return this._lastPoint;
  }
  getChangePointForSync(e) {
    return this.getPoint(e);
  }
  setPoints(e) {
    this._points = e;
  }
  isForcedDrawPriceAxisLabel() {
    return this.customization.forcePriceAxisLabel;
  }
  clearData() {
    this._points = [];
  }
  denormalizeTimePoints() {
    let e = [];
    for (let t = 0; t < this._timePoint.length; t++) {
      const i = this._model
        .timeScale()
        .denormalizeTimePoint(this._timePoint[t]);
      if (void 0 === i) {
        e = [];
        break;
      }
      e.push({
        index: i,
        price: this._timePoint[t].price,
      });
    }
    e.length > 0 && (this._points = e);
  }
  restorePoints(e, t, i) {
    const s =
      this._timePoint.length > 0 && !(0, x.deepEquals)(this._timePoint, e)[0];
    (this._timePoint = (0, h.deepCopy)(e)),
      (this._points = t),
      i || this.denormalizeTimePoints(),
      s && this._normalizedPointsChanged.fire();
  }
  restorePositionPercents(e) {
    this._positionPercents = e;
  }
  calcIsActualSymbol() {
    const e = this.ownerSource();
    if (null === e) this._isActualSymbol = !1;
    else {
      const t = (0, r.ensureNotNull)(e.symbolSource());
      this._migrateSymbolProperty();
      const i = this._properties.childs().symbol,
        s = i.value();
      if (
        ((this._isActualSymbol = t.symbolSameAsCurrent(s)),
        this._isActualSymbol)
      ) {
        const e = t.symbol();
        (0, v.areEqualSymbols)(s, e) ||
          (V.logWarn(
            'Possible drawing "migrating" detected from "' +
              s +
              '" to "' +
              e +
              '"'
          ),
          V.logWarn("Series symbolInfo: " + JSON.stringify(t.symbolInfo())),
          V.logWarn(`${new Error().stack}`)),
          i.setValue(e);
      }
    }
    this.calcIsActualInterval(),
      this.calcIsActualCurrency(),
      this.calcIsActualUnit(),
      this._onSourceHiddenMayChange();
  }
  calcIsActualCurrency() {
    const e = this.ownerSource();
    if (null === e) return void (this._isActualCurrency = !1);
    let t = this._properties.childs().currencyId.value();
    if (null !== t) {
      const i = e.symbolSource();
      0,
        (this._isActualCurrency =
          t === (0, f.symbolCurrency)(i.symbolInfo(), void 0, !0));
    } else {
      const t = (0, r.ensureNotNull)(e.symbolSource()).symbolInfo();
      this._isActualCurrency =
        null !== t &&
        (0, f.symbolCurrency)(t) === (0, f.symbolOriginalCurrency)(t);
    }
    this._onSourceHiddenMayChange();
  }
  calcIsActualUnit() {
    const e = this.ownerSource();
    if (null === e) return void (this._isActualUnit = !1);
    const t = this._properties.childs().unitId.value();
    if (null !== t)
      this._isActualUnit = t === (0, r.ensureNotNull)(e.symbolSource()).unit();
    else {
      const t = (0, r.ensureNotNull)(e.symbolSource()).symbolInfo(),
        i = this._model.unitConversionEnabled();
      this._isActualUnit =
        null !== t &&
        (0, f.symbolUnit)(t, i) === (0, f.symbolOriginalUnit)(t, i);
    }
    this._onSourceHiddenMayChange();
  }
  calcIsActualInterval() {
    const e = this._isActualInterval,
      t = this._properties,
      i = this._model.mainSeries();
    (this._isActualInterval = (0, m.isActualInterval)(
      S.Interval.parse(i.interval()),
      t.childs().intervalsVisibilities
    )),
      !this._isActualInterval &&
        this._model.selection().isSelected(this) &&
        this._model.selectionMacro((e) => e.removeSourceFromSelection(this)),
      this._isActualInterval !== e && this._onIsActualIntervalChange.fire(),
      this._onSourceHiddenMayChange();
  }
  paneViews(e) {
    if (this.isSourceHidden()) return null;
    const t = this._getPaneViews(this.isMultiPaneAvailable() ? e : void 0);
    if (null === t) return null;
    if (1 === t.length) return [t[0]];
    const i = [];
    for (let e = t.length - 1; e >= 0; --e) i.push(t[e]);
    return i;
  }
  priceAxisViews(e, t) {
    if (t !== this.priceScale() || this.isSourceHidden()) return null;
    if (this._model.lineBeingEdited() === this) {
      const e = this._model.linePointBeingEdited();
      if (null !== e && e < this._priceAxisViews.length) {
        const t = this._priceAxisViews.slice(),
          i = t[e];
        return t.splice(e, 1), t.push(i), t;
      }
      return this._priceAxisViews;
    }
    return this._priceAxisViews;
  }
  timeAxisViews() {
    if (this.isSourceHidden()) return null;
    if (this._model.lineBeingEdited() === this) {
      const e = this._model.linePointBeingEdited();
      if (null !== e && e < this._timeAxisViews.length) {
        const t = this._timeAxisViews.slice(),
          i = t[e];
        return t.splice(e, 1), t.push(i), t;
      }
      return this._timeAxisViews;
    }
    return this._timeAxisViews;
  }
  isSavedInChart() {
    return !this.customization.disableSave;
  }
  isSavedInStudyTemplates() {
    return !1;
  }
  setSavingInChartEnabled(e) {
    this.customization.disableSave = !e;
  }
  shouldBeRemovedOnDeselect() {
    return !1;
  }
  getOrderTemplate() {
    return null;
  }
  getSourceIcon() {
    return {
      type: "loadSvg",
      svgId: "linetool." + this.toolname,
    };
  }
  alertId() {
    return this._alertId;
  }
  setAlert(e, t) {
    throw new Error("not implemented");
  }
  editAlert(e) {}
  getAlert() {
    throw new Error("not implemented");
  }
  getAlertSync() {
    return null;
  }
  synchronizeAlert(e) {
    0;
  }
  syncAlert(e) {
    0;
  }
  stateForAlert() {
    return null;
  }
  getAlertIsActive() {
    return !1;
  }
  detachAlert() {}
  removeAlert() {}
  deleteAlert() {}
  areLocalAndServerAlertsMismatch() {
    return !1;
  }
  showInObjectTree() {
    return this.customization.showInObjectsTree;
  }
  setShowInObjectsTreeEnabled(e) {
    this.customization.showInObjectsTree = e;
  }
  start() {
    this.createServerPoints();
  }
  processHibernate() {
    this.isSourceHidden()
      ? this.isStarted() && this.stop()
      : this.isStarted() || this.start();
  }
  onData(e) {
    "pointset_error" !== e.method
      ? e.params.customId === this._currentPointsetIdWithPrefix() &&
        this._onPointsetUpdated(e.params.plots)
      : V.logError(`Error getting pointset: ${e.params[0]} ${e.params[1]}`);
  }
  isBeingEdited() {
    return this === this._model.lineBeingEdited();
  }
  isActualSymbol() {
    return this._isActualSymbol;
  }
  isActualCurrency() {
    return this._isActualCurrency;
  }
  isActualInterval() {
    return this._isActualInterval;
  }
  isActualUnit() {
    return this._isActualUnit;
  }
  onIsActualIntervalChange() {
    return this._onIsActualIntervalChange;
  }
  setOwnerSource(e) {
    null !== this._ownerSource &&
      (this._ownerSource.currencyChanged().unsubscribeAll(this),
      this._ownerSource.unitChanged().unsubscribeAll(this)),
      null !== this._ownerSource &&
        (0, I.isSymbolSource)(this._ownerSource) &&
        (this._ownerSource
          .symbolResolved()
          .unsubscribe(this, this._boundCalcIsActualSymbol),
        this._ownerSource
          .isActingAsSymbolSource()
          .unsubscribe(this._boundCalcIsActualSymbol)),
      super.setOwnerSource(e),
      e &&
        (this.setPriceScale(e.priceScale()),
        e.currencyChanged().subscribe(this, this.calcIsActualCurrency),
        e.unitChanged().subscribe(this, this.calcIsActualUnit),
        this.calcIsActualSymbol(),
        this._migrateZOrder()),
      (0, I.isSymbolSource)(e) &&
        (e.symbolResolved().subscribe(this, this._boundCalcIsActualSymbol),
        e.isActingAsSymbolSource().subscribe(this._boundCalcIsActualSymbol));
  }
  dataAndViewsReady() {
    return this._paneViews.size > 0;
  }
  pointAdded() {
    return this._pointAdded;
  }
  pointChanged() {
    return this._pointChanged;
  }
  pointToScreenPoint(e) {
    var t;
    const i = this._model.timeScale(),
      r = this.priceScale(),
      n =
        null === (t = this.ownerSource()) || void 0 === t
          ? void 0
          : t.firstValue();
    if (!r || r.isEmpty() || i.isEmpty() || null == n) return null;
    const o = i.indexToCoordinate(e.index),
      a = r.priceToCoordinate(e.price, n);
    return new s.Point(o, a);
  }
  screenPointToPoint(e) {
    var t;
    const i = this.priceScale(),
      s =
        null === (t = this.ownerSource()) || void 0 === t
          ? void 0
          : t.firstValue();
    if (null == s || !isFinite(s) || null === i) return null;
    const r = this._model.timeScale().coordinateToIndex(e.x);
    return {
      price: i.coordinateToPrice(e.y, s),
      index: r,
    };
  }
  calcMiddlePoint(e, t) {
    return new s.Point((e.x + t.x) / 2, (e.y + t.y) / 2);
  }
  addPoint(e, t, i) {
    const s = this._preparePoint(e, t);
    return this._addPointIntenal(s, t, i);
  }
  addFixedPoint(e) {
    return (this._fixedPoint = e), this.calcPositionPercents(), !0;
  }
  calcPositionPercents() {
    const e = this.priceScale();
    if (!e || e.isEmpty() || void 0 === this._fixedPoint) return;
    const t = this._fixedPoint.x / this._model.timeScale().width(),
      i = this._fixedPoint.y / e.height();
    return (
      (this._positionPercents = {
        x: t,
        y: i,
      }),
      this._positionPercents
    );
  }
  restoreFixedPoint() {
    this._fixedPoint = this.fixedPoint();
  }
  propertiesChanged(e) {
    this.calcIsActualInterval(),
      this.updateAllViewsAndRedraw((0, T.sourceChangeEvent)(this.id())),
      e || this._syncLineStyleIfNeeded(),
      void 0 === this._pendingPropertyChangedEvent &&
        (this._pendingPropertyChangedEvent = setTimeout(() => {
          (this._pendingPropertyChangedEvent = void 0),
            n.emit("drawing_event", this._id, "properties_changed");
        }, 0));
  }
  state(e) {
    var t, i;
    const s = {
      type: this.toolname,
      id: this.id(),
      state: this.properties().state(
        null !== (t = this._propertiesStateExclusions()) && void 0 !== t
          ? t
          : void 0
      ),
      points: (0, h.deepCopy)(this._timePoint),
      zorder: this.zorder(),
      ownerSource:
        null === (i = this.ownerSource()) || void 0 === i ? void 0 : i.id(),
    };
    return (
      (s.isSelectionEnabled = this.isSelectionEnabled()),
      (s.userEditEnabled = this.userEditEnabled()),
      this.linkKey().value() && (s.linkKey = this.linkKey().value()),
      delete s.state.points,
      e && (s.indexes = this._points),
      this.isFixed() &&
        (s.positionPercents =
          this._positionPercents || this.calcPositionPercents()),
      "version" in this && 1 !== this.version && (s.version = this.version),
      s
    );
  }
  updateAllViews(e) {
    this._isActualSymbol &&
      this._isActualCurrency &&
      this._isActualUnit &&
      this._isActualInterval &&
      this._properties.childs().visible.value() &&
      (this._updateAllPaneViews(e),
      this._priceAxisViews.forEach((t) => t.update(e)),
      this._timeAxisViews.forEach((t) => t.update(e)));
  }
  updateAllViewsAndRedraw(e) {
    this.updateAllViews(e), this._model.updateSource(this);
  }
  tags() {
    return [this.toolname];
  }
  properties() {
    return this._properties;
  }
  restoreExternalPoints(e, t) {
    if (((this._timePoint = (0, h.deepCopy)(e.points)), t.indexesChanged)) {
      if (
        (this.properties().childs().interval.setValue(e.interval),
        !this.isActualSymbol())
      )
        return (
          this._clearServerPoints(), void this._normalizedPointsChanged.fire()
        );
      this.createServerPoints();
    } else {
      const t = Math.min(this._points.length, e.points.length);
      for (let i = 0; i < t; i++) this._points[i].price = e.points[i].price;
    }
    this._normalizedPointsChanged.fire();
  }
  restoreExternalState(e) {
    this.properties().mergeAndFire(e);
  }
  applyTemplate(e) {
    this._onTemplateApplying.fire(e),
      this._applyTemplateImpl(e),
      this.calcIsActualSymbol(),
      this.updateAllViews((0, T.sourceChangeEvent)(this.id())),
      this.model().lightUpdate(),
      this._onTemplateApplied.fire();
  }
  template() {
    return this.properties().preferences();
  }
  isFixed() {
    return !1;
  }
  isLocked() {
    const e = this.properties().child("frozen");
    return void 0 !== e && e.value();
  }
  isSourceHidden() {
    return (
      !this._properties.childs().visible.value() ||
      ((0, w.hideAllDrawings)().value() && this.canBeHidden()) ||
      !this._isActualInterval ||
      !this._isActualSymbol ||
      !this._isActualCurrency ||
      !this._isActualUnit
    );
  }
  isSynchronizable() {
    return this.priceScale() === this._model.mainSeries().priceScale();
  }
  copiable() {
    return B;
  }
  cloneable() {
    return (
      null !== this._ownerSource && null !== this._ownerSource.firstValue()
    );
  }
  movable() {
    return !0;
  }
  async getPropertyDefinitionsViewModel() {
    if (null === this._definitionsViewModel) {
      const e = await this._getPropertyDefinitionsViewModelClass();
      return null === e || this._isDestroyed
        ? null
        : ((this._definitionsViewModel = new e(this._model.undoModel(), this)),
          this._definitionsViewModel);
    }
    return this._definitionsViewModel;
  }
  title() {
    return this.translatedType();
  }
  translatedType() {
    var e;
    return null !== (e = D.lineToolsLocalizedNames[this.toolname]) &&
      void 0 !== e
      ? e
      : "Line Tool";
  }
  name() {
    return "Line Tool";
  }
  createServerPoints() {
    if (!this._isActualSymbol) return;
    if (!this._model.chartApi().isConnected().value()) return;
    if ((this._clearServerPoints(), this._model.timeScale().isEmpty())) return;
    if (
      (0 === this._timePoint.length &&
        this._points.length > 0 &&
        this.normalizePoints(),
      !this._readyToCreatePointset())
    )
      return;
    const e = this._pointsForPointset();
    if (0 === e.length) return;
    ++N,
      (this._currentPointsetAndSymbolId = {
        pointsetId: N,
        symbolId: (0, r.ensureNotNull)(
          this._model.mainSeries().seriesSource().symbolInstanceId()
        ),
      });
    const t = (0, _.getServerInterval)(
      this.properties().childs().interval.value()
    );
    this._model
      .chartApi()
      .createPointset(
        this._currentPointsetIdWithPrefix(),
        "turnaround",
        this._currentPointsetAndSymbolId.symbolId,
        t,
        e,
        this.onData.bind(this)
      );
  }
  finish() {}
  realign() {
    var e;
    this.calcIsActualSymbol(),
      this.isFixed() ||
        this.isSourceHidden() ||
        this._model.lineBeingCreated() === this ||
        this._model.lineBeingEdited() === this ||
        (null === (e = this._currentPointsetAndSymbolId) || void 0 === e
          ? void 0
          : e.symbolId) ===
          this._model.mainSeries().seriesSource().symbolInstanceId() ||
        this._clearServerPoints(),
      this.updateAllViews((0, T.sourceChangeEvent)(this.id()));
  }
  stop() {
    this._clearServerPoints();
  }
  restart() {
    this.isFixed() ||
      ((this._currentPointsetAndSymbolId = null), this.createServerPoints());
  }
  isStarted() {
    return null !== this._currentPointsetAndSymbolId;
  }
  convertYCoordinateToPriceForMoving(e, t) {
    var i;
    const s = (0, r.ensureNotNull)(this.priceScale());
    if (s.isEmpty()) return null;
    const n = this.ownerSource(),
      o = (0, r.ensure)(
        null === (i = n || t) || void 0 === i ? void 0 : i.firstValue()
      );
    return s.coordinateToPrice(e, o);
  }
  syncMultichartState(e) {
    const t = {
        points: this._timePoint,
        interval: this._model.mainSeries().interval(),
      },
      i = this.linkKey().value();
    if (null !== i && this.isSynchronizable()) {
      const s = {
        model: this._model,
        linkKey: i,
        symbol: this._model.mainSeries().symbol(),
        finalState: t,
        changes: e,
      };
      (0, w.finishChangingLineTool)(s);
    }
  }
  enableCurrentIntervalVisibility() {
    const e = this.properties().childs().intervalsVisibilities.state();
    void 0 !== e &&
      ((0, m.makeIntervalsVisibilitiesVisibleAtInterval)(
        e,
        S.Interval.parse(this._model.mainSeries().interval())
      ),
      this.properties().childs().intervalsVisibilities.mergeAndFire(e));
  }
  clonePositionOffset() {
    return this.isFixed()
      ? {
          barOffset: 0,
          xCoordOffset: 20,
          yCoordOffset: 20,
        }
      : {
          barOffset: 0,
          xCoordOffset: 0,
          yCoordOffset: -40,
        };
  }
  sharingMode() {
    return this._sharingMode;
  }
  share(e) {
    this.isSynchronizable() && this._sharingMode.setValue(e);
  }
  syncLineStyleState() {
    const e = this.properties().state(this._syncStateExclusions);
    return (
      delete e.interval,
      (e.intervalsVisibilities = (0, m.mergeIntervalVisibilitiesDefaults)(
        e.intervalsVisibilities
      )),
      e
    );
  }
  moveLineTool(e) {
    e.forEach((e, t) => this._setPoint(t, e)), this.normalizePoints();
  }
  _setPoint(e, t) {
    this._points[e].index === t.index
      ? (this._points[e].price = t.price)
      : (this._points[e] = t),
      this._pointChanged.fire(e);
  }
  _correctLastPoint(e) {
    return (0, x.clone)(e);
  }
  _pointsForPointset() {
    return this._timePoint.map((e) => [e.time_t, e.offset]);
  }
  _snapPoint45Degree(e, t, i) {
    const s = this._model.timeScale(),
      n = s.indexToCoordinate(t.index),
      o = s.indexToCoordinate(e.index) - n,
      a = (0, r.ensureNotNull)(this.priceScale()),
      l = t.price,
      c = e.price,
      h = (0, r.ensureNotNull)(
        (0, r.ensureNotNull)(this.ownerSource()).firstValue()
      ),
      d = a.priceToCoordinate(l, h),
      u = a.priceToCoordinate(c, h) - d,
      p = Math.round((Math.atan2(o, u) / Math.PI) * 4);
    if (2 === Math.abs(p)) i || (e.price = l);
    else if (0 === Math.abs(p) || 4 === Math.abs(p)) i || (e.index = t.index);
    else {
      const t = Math.sqrt(o * o + u * u),
        i = o < 0 ? -1 : 1,
        r = u < 0 ? -1 : 1;
      let l = Math.max(Math.abs(u), Math.abs(o));
      l /= (l * Math.sqrt(2)) / t;
      const c = Math.round(s.coordinateToIndex(n + l * i)),
        p = Math.abs(s.indexToCoordinate(c) - n),
        _ = a.coordinateToPrice(d + p * r, h);
      (e.index = c), (e.price = _);
    }
  }
  normalizePoint(e) {
    return {
      ...this._model.timeScale().normalizeBarIndex(e.index),
      price: e.price,
    };
  }
  normalizePoints() {
    this._timePoint = [];
    for (let e = 0; e < this._points.length; e++)
      if (void 0 !== this._points[e].index) {
        const t = this.normalizePoint(this._points[e]);
        if (!t.time_t) {
          this._timePoint = [];
          break;
        }
        this._timePoint.push(t);
      }
    this._normalizedPointsChanged.fire();
  }
  _setPaneViews(e, t, i) {
    if (this._isDestroyed) for (const t of e) t.destroy && t.destroy();
    else
      this._paneViews.set(t, e),
        void 0 !== t &&
          i &&
          t.onDestroyed().subscribe(this, () => this._destroyPanePaneViews(t)),
        this._model.lightUpdate();
  }
  _getPaneViews(e) {
    return this._paneViews.get(e) || null;
  }
  _updateAllPaneViews(e) {
    this._paneViews.forEach((t) => {
      for (const i of t) i.update(e);
    });
  }
  _alignPointHorizontallyOrVertically(e) {
    const t = (0, r.ensureNotNull)(this.pointToScreenPoint(e)),
      i = (0, r.ensureDefined)(
        (0, r.ensureNotNull)(this._startMovingPoint).logical
      ),
      s = (0, r.ensureDefined)(
        (0, r.ensureNotNull)(this._startMovingPoint).screen
      ),
      n = Math.abs(s.x - t.x),
      o = Math.abs(s.y - t.y);
    if (n < 10 && o < 10) return e;
    return {
      index: n < o ? i.index : e.index,
      price: n < o ? e.price : i.price,
    };
  }
  _alignScreenPointHorizontallyOrVertically(e) {
    const t = (0, r.ensureDefined)(
        (0, r.ensureNotNull)(this._startMovingPoint).screen
      ),
      i = Math.abs(t.x - e.x),
      n = Math.abs(t.y - e.y);
    return i < 10 && n < 10
      ? e
      : i < n
      ? new s.Point(t.x, e.y)
      : new s.Point(e.x, t.y);
  }
  _correctPoints(e, t) {
    const i = (0, r.ensureDefined)(
        (0, r.ensureNotNull)(this._currentMovingPoint).screen
      ),
      s = (0, r.ensureDefined)(
        (0, r.ensureNotNull)(this._startMovingPoint).screen
      ),
      n = i.subtract(s);
    if (n.length() < 1 && !t) return !1;
    for (let t = 0; t < e.length; t++) {
      const i = e[t],
        s = (0, r.ensureNotNull)(this.pointToScreenPoint(i)).add(n),
        o = (0, r.ensureNotNull)(this.screenPointToPoint(s));
      (e[t].index = o.index), (e[t].price = o.price);
    }
    return !0;
  }
  _correctFixedPoint(e) {
    if (void 0 === this._fixedPoint)
      return {
        didCorrect: !1,
        point: e,
      };
    const t = (0, r.ensureDefined)(
        (0, r.ensureNotNull)(this._currentMovingPoint).screen
      ),
      i = (0, r.ensureDefined)(
        (0, r.ensureNotNull)(this._startMovingPoint).screen
      ),
      s = t.subtract(i);
    return s.length() >= 1
      ? {
          didCorrect: !0,
          point: e.add(s),
        }
      : {
          didCorrect: !1,
          point: e,
        };
  }
  _currentPointsetIdWithPrefix() {
    return (
      "pointset_" +
      (0, r.ensureNotNull)(this._currentPointsetAndSymbolId).pointsetId
    );
  }
  _clearServerPoints() {
    null !== this._currentPointsetAndSymbolId &&
      this._model.chartApi().isConnected().value() &&
      this._model
        .chartApi()
        .removePointset(this._currentPointsetIdWithPrefix()),
      (this._currentPointsetAndSymbolId = null);
  }
  _createPointProperty(e) {
    const t = this._pointsProperty.childs().points;
    t.addProperty("" + e, {});
    const i = t[e];
    i.addChild("price", new A(this, e)),
      i.addChild("bar", new M.LineDataSourcePointIndexProperty(this, e));
  }
  _createPointsProperties() {
    (this._pointsProperty = new (b())()),
      this._pointsProperty.addChild("points", new (b())());
    for (let e = 0; e < this.pointsCount(); e++) this._createPointProperty(e);
  }
  _alignPointToRangeOfActualData(e) {
    const t = (0, r.ensureNotNull)(
        this._model.mainSeries().bars().firstIndex()
      ),
      i = (0, r.ensureNotNull)(this._model.mainSeries().bars().lastIndex());
    let s = Math.max(e.index, t);
    return (
      (s = Math.min(s, i)),
      {
        ...e,
        index: s,
      }
    );
  }
  _migrateSymbolProperty() {
    const e = this._properties.childs();
    if (e.symbolStateVersion.value() < 2) {
      const t = (0, r.ensureNotNull)(this.ownerSource()),
        i = (0, r.ensureNotNull)(t.symbolSource()),
        s = this._model.mainSeries();
      if (i === s) return void e.symbolStateVersion.setValueSilently(2);
      if (null === s.symbolInfo()) return;
      if (null === i.symbolInfo()) return;
      s.symbolSameAsCurrent(e.symbol.value()) &&
        e.symbol.setValueSilently(i.symbol()),
        e.symbolStateVersion.setValueSilently(2);
    }
  }
  _migrateZOrder() {
    const e = this._properties.childs();
    e.zOrderVersion.value() < 2 &&
      (this.ownerSource() === this.model().mainSeries() &&
        this.setZorder(
          this.zorder() - this.model().mainSeries().obsoleteZOrder()
        ),
      e.zOrderVersion.setValueSilently(2));
  }
  _preparePoint(e, t) {
    const i = e;
    return (
      t &&
        t.shift() &&
        this.points().length >= 2 &&
        this._snapTo45DegreesAvailable() &&
        this._snapPoint45Degree(i, this.points()[this.points().length - 2]),
      i
    );
  }
  _addPointIntenal(e, t, i) {
    this._points.push(e);
    const s = this._points.length === this.pointsCount();
    return (
      s
        ? ((this._lastPoint = null),
          i || (this.normalizePoints(), this.createServerPoints()))
        : (this._lastPoint = e),
      this._pointAdded.fire(this._points.length - 1),
      s
    );
  }
  _onSourceHiddenMayChange() {
    this._model.invalidate(
      p.InvalidationMask.validateAction(() => {
        this !== this._model.lineBeingCreated() &&
          (this._isDestroyed || this.processHibernate());
      })
    );
  }
  _saveAlertIdInState() {
    return !0;
  }
  _onPointsetUpdated(e) {
    if (0 !== e.length) {
      for (let t = 0; t < e.length; t++) {
        const i = e[t],
          s = this._timePoint[i.index],
          r = {
            index: i.value[0],
            time: new Date(1e3 * i.value[1]),
            price: s.price,
          };
        this._points.length <= i.index
          ? (this._points.push(r),
            this._pointAdded.fire(this._points.length - 1))
          : ((this._points[i.index] = r), this._pointChanged.fire(i.index));
      }
      0, this.updateAllViewsAndRedraw((0, T.sourceChangeEvent)(this.id()));
    }
  }
  _snapTo45DegreesAvailable() {
    return !1;
  }
  _onMainSeriesSymbolResolved() {
    const e = this.ownerSource();
    null === e ||
      this._model.mainSeries() === e.symbolSource() ||
      this.isSourceHidden() ||
      this.createServerPoints();
  }
  _readyToCreatePointset() {
    return this._timePoint.length > 0;
  }
  _onAlertData(e) {}
  _propertiesStateExclusions() {
    return null;
  }
  _syncLineStyleIfNeeded() {
    const e = this.linkKey().value();
    !this._syncLineStyleMuted &&
      e &&
      (0, w.changeLineStyle)({
        linkKey: e,
        state: this.syncLineStyleState(),
        model: this._model,
      });
  }
  _muteSyncLineStyle() {
    this._syncLineStyleMuted = !0;
  }
  _unmuteSyncLineStyleWithoutApplyingChanges() {
    this.propertiesChanged(), (this._syncLineStyleMuted = !1);
  }
  _applyTemplateImpl(e) {
    e.intervalsVisibilities = (0, m.mergeIntervalVisibilitiesDefaults)(
      e.intervalsVisibilities
    );
    const t = this.properties();
    t.mergePreferences(e), t.saveDefaults(), this.propertiesChanged();
  }
  _getPropertyDefinitionsViewModelClass() {
    return Promise.resolve(null);
  }
  _getAlertPlots() {
    return [];
  }
  _getUndoHistory() {
    return this._model.undoModel().undoHistory();
  }
  _synchronizeAlert(e) {}
  _linePointsToAlertPlot(e, t, i, s) {
    return null;
  }
  static _configureProperties(e) {
    if (
      (this._addCollectedProperties(e),
      e.hasChild("symbolStateVersion") ||
        e.addChild("symbolStateVersion", new (b())(1)),
      e.hasChild("zOrderVersion") || e.addChild("zOrderVersion", new (b())(1)),
      e.hasChild("visible") || e.addChild("visible", new (b())(!0)),
      e.hasChild("frozen") || e.addChild("frozen", new (b())(!1)),
      e.hasChild("symbol") || e.addChild("symbol", new (b())("")),
      e.hasChild("currencyId") || e.addChild("currencyId", new (b())(null)),
      e.hasChild("unitId") || e.addChild("unitId", new (b())(null)),
      e.addExclusion("symbolStateVersion"),
      e.addExclusion("zOrderVersion"),
      e.addExclusion("visible"),
      e.addExclusion("frozen"),
      e.addExclusion("symbol"),
      e.addExclusion("currencyId"),
      e.addExclusion("unitId"),
      e.hasChild("intervalsVisibilities"))
    ) {
      const t = (0, x.merge)(
        (0, x.clone)(g.intervalsVisibilitiesDefaults),
        e.childs().intervalsVisibilities.state()
      );
      e.removeProperty("intervalsVisibilities"),
        e.addChild(
          "intervalsVisibilities",
          new C.IntervalsVisibilitiesProperty(t)
        );
    } else
      e.addChild(
        "intervalsVisibilities",
        new C.IntervalsVisibilitiesProperty(g.intervalsVisibilitiesDefaults)
      );
    e.hasChild("title") || e.addChild("title", new (b())("")),
      e.addExclusion("symbolInfo"),
      e.addExclusion("points"),
      e.addExclusion("interval"),
      e.addExclusion("title"),
      e.hasChild("singleChartOnly") && e.removeProperty("singleChartOnly"),
      e.hasChild("font") && e.removeProperty("font");
  }

  static _addCollectedProperties(e) {
    e.hasChild("linewidth") &&
      e.addChild(
        "linesWidths",
        new E.LineToolWidthsProperty([
          (0, r.ensureDefined)(e.child("linewidth")),
        ])
      ),
      e.hasChild("linecolor") &&
        e.addChild(
          "linesColors",
          new E.LineToolColorsProperty([
            (0, r.ensureDefined)(e.child("linecolor")),
          ])
        ),
      e.hasChild("backgroundColor") &&
        e.addChild(
          "backgroundsColors",
          new E.LineToolColorsProperty([
            (0, r.ensureDefined)(e.child("backgroundColor")),
          ])
        ),
      e.hasChild("textColor") &&
        e.addChild(
          "textsColors",
          new E.LineToolColorsProperty([
            (0, r.ensureDefined)(e.child("textColor")),
          ])
        ),
      e.addExclusion("linesWidths"),
      e.addExclusion("linesColors"),
      e.addExclusion("backgroundsColors"),
      e.addExclusion("textsColors");
  }
  _removeAlertSubscriptions() {
    var e;
    null === (e = this._unsubscribeAlertCallbacks) ||
      void 0 === e ||
      e.call(this),
      (this._unsubscribeAlertCallbacks = void 0);
  }
  _addAlertSubscriptions(e) {}
  _destroyPanePaneViews(e) {
    const t = this._paneViews.get(e);
    if (void 0 !== t) for (const e of t) e.destroy && e.destroy();
    void 0 !== e && e.onDestroyed().unsubscribeAll(this),
      this._paneViews.delete(e);
  }
  _copyPricesWithoutNormalization() {
    const e = Math.min(this._points.length, this._timePoint.length);
    for (let t = 0; t < e; t++)
      this._timePoint[t].price = this._points[t].price;
  }
}
