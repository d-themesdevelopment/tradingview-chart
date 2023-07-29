

  import {ensure, ensureDefined, ensureNotNull} from "./50151.js";
  import {NumericFormatter } from "./87663.js";
  import {PlotRowSearchMode} from "./86094.js";
  import {PriceRange} from "./34256.js";
  import {LineDataSource} from "./13087.js";
  import {RiskDisplayMode} from "./4895.js";
  import {RiskRewardPointIndex} from "./95539.js";
  import {PriceAxisView} from "./42275.js";
  import {resetTransparency} from "./87095.js"
  import {CustomData} from "./59452.js";
  import {isNumber} from "./1722.js";
  import {hideAllDrawings, changeLineStyle} from "./88348.js";
  import {sourceChangeEvent} from "./28558.js";
  import {DefaultProperty} from "./46100.js";
  class u extends PriceAxisView {
      constructor(e, t) {
          super(), this._source = e, this._data = t
      }
      _updateRendererData(e, t, i) {
          if (e.visible = !1, !this._showAxisLabel()) return;
          const s = this._source.priceScale();
          if (0 === this._source.points().length || null === s || s.isEmpty()) return;
          const r = this._source.ownerSource(),
              n = null !== r ? r.firstValue() : null;
          if (null === n) return;
          const o = this._data.priceProperty.value(),
              a = resetTransparency(this._data.colorProperty.value());
          i.background = a, i.textColor = this.generateTextColor(a), i.coordinate = s.priceToCoordinate(o, n), e.text = s.formatPrice(o, n), e.visible = !0
      }
      _showAxisLabel() {
          return this._source.properties().childs().showPriceLabels.value()
      }
  }

  class m extends CustomData {
      constructor(e, t) {
          super(), this._lineSource = e, this._pointIndex = t
      }
      value() {
          const e = this._lineSource.points()[this._pointIndex].price;
          return this._formatAndParsePrice(e)
      }
      state() {
          return this.value()
      }
      merge(e, t) {
          return this.setValue(e), t ? [] : null
      }
      _formatAndParsePrice(e) {
          const t = ensureNotNull(this._lineSource.ownerSource()).formatter();
          if (t.parse) {
              const i = t.format(e),
                  s = t.parse(i);
              return s.res ? s.value : e
          }
          return e
      }
  }
  class g extends m {
      constructor(e) {
          super(e, 0)
      }
      setValue(e) {
          const t = this._lineSource.points()[this._pointIndex];
          this._lineSource.startChanging(this._pointIndex, t), t.price = parseFloat("" + e), this._lineSource.setPoint(this._pointIndex, t), this._lineSource.recalculate(), this._lineSource.model().updateSource(this._lineSource), this._listeners.fire(this), this._lineSource.endChanging(!1, !1), this._lineSource.syncPriceLevels()
      }
  }
  class f extends m {
      constructor(e) {
          super(e, 1)
      }
      value() {
          const e = this._lineSource.stopPrice();
          return this._formatAndParsePrice(e)
      }
      setValue(e) {
          const t = Math.round(Math.abs(e - this._lineSource.entryPrice()) * this._lineSource.ownerSourceBase());
          this._lineSource.properties().childs().stopLevel.setValue(t), this._lineSource.syncPriceLevels()
      }
  }
  class v extends m {
      constructor(e) {
          super(e, 2)
      }
      value() {
          const e = this._lineSource.profitPrice();
          return this._formatAndParsePrice(e)
      }
      setValue(e) {
          const t = Math.round(Math.abs(e - this._lineSource.entryPrice()) * this._lineSource.ownerSourceBase());
          this._lineSource.properties().childs().profitLevel.setValue(t), this._lineSource.syncPriceLevels()
      }
  }


  function w(e) {
      return parseFloat(e.toFixed(2))
  }
  class P extends LineDataSource {
      constructor(e, t, n, a) {
          super(e, t, n, a), this._syncStateExclusions = ["points", "entryPrice", "stopPrice", "targetPrice", "stopLevel", "profitLevel", "riskSize", "qty", "amountTarget", "amountStop"], this._riskInChange = !1, this.version = 2, t.hasChild("stopLevel") || t.hasChild("profitLevel") || (t.addProperty("stopLevel", 0), t.addProperty("profitLevel", 0), this.ownerSourceChanged().subscribe(this, (() => {
              const i = ensureNotNull(e.timeScale().visibleBarsStrictRange()),
                  r = i.firstBar(),
                  n = i.lastBar(),
                  a = ensureNotNull(this.ownerSource()),
                  l = a.priceScale();
              let c = ensureNotNull(a.priceRange(r, n));
              if (l && l.isLog()) {
                  const e = l.logicalToPrice(c.minValue()),
                      t = l.logicalToPrice(c.maxValue());
                  c = new PriceRange(e, t)
              }
              if (c && !c.isEmpty()) {
                  const e = Math.round(.2 * c.length() * this.ownerSourceBase());
                  t.merge({
                      stopLevel: e,
                      profitLevel: e
                  })
              }
          }), !0));
          const h = t.childs();
          h.stopLevel.listeners().subscribe(this, this.recalculate), h.stopLevel.listeners().subscribe(null, (() => {
                  this.properties().childs().stopPrice.childChanged(null)
              })), h.profitLevel.listeners().subscribe(this, this.recalculate), h.profitLevel.listeners().subscribe(null, (() => {
                  this.properties().childs().targetPrice.childChanged(null)
              })), t.addChild("entryPrice", new g(this)), t.addChild("stopPrice", new f(this)), t.addChild("targetPrice", new v(this)), t.hasChild("riskSize") || t.addProperty("riskSize", 0), t.hasChild("qty") || t.addProperty("qty", 0), t.hasChild("amountTarget") || t.addProperty("amountTarget", h.accountSize.value()), t.hasChild("amountStop") || t.addProperty("amountStop", h.accountSize.value()), t.addExclusion("riskSize"), t.addExclusion("qty"), t.addExclusion("amountTarget"), t.addExclusion("amountStop"), this._riskInPercentsFormatter = new NumericFormatter(2), this._riskInMoneyFormatter = new NumericFormatter, h.risk.subscribe(this, this._recalculateRiskSize), h.accountSize.subscribe(this, this._recalculateRiskSize), h.riskDisplayMode.subscribe(this, this._recalculateRisk), h.riskDisplayMode.subscribe(this, this._recalculateRiskSize), h.entryPrice.subscribe(this, this._recalculateRiskSize), h.stopPrice.subscribe(this, this._recalculateRiskSize), h.profitLevel.subscribe(this, this._recalculateRiskSize), h.profitLevel.subscribe(this, this.syncPriceLevels.bind(this)), h.stopLevel.subscribe(this, this._recalculateRiskSize), h.stopLevel.subscribe(this, this.syncPriceLevels.bind(this)),
              h.qty.subscribe(this, this._recalculateRiskSize), this.ownerSourceChanged().subscribe(null, ((e, t) => {
                  e && e.barsProvider().dataUpdated().unsubscribeAll(this), t && t.barsProvider().dataUpdated().subscribe(this, this._onSeriesUpdated)
              })), this.pointAdded().subscribe(this, (e => {
                  switch (e) {
                      case RiskRewardPointIndex.Entry:
                      case RiskRewardPointIndex.Close:
                          this._recalculateRiskSize(), this._recalculateQty()
                  }
              })), this.pointChanged().subscribe(this, (e => {
                  switch (e) {
                      case RiskRewardPointIndex.Entry:
                      case RiskRewardPointIndex.Close:
                          this._recalculateRiskSize(), this._recalculateQty()
                  }
              })), h.riskDisplayMode.value() === RiskDisplayMode.Percentage && h.risk.value() > 100 && h.riskDisplayMode.setValueSilently(RiskDisplayMode.Money), h.entryPrice.subscribe(this, this._recalculateQty), h.stopPrice.subscribe(this, this._recalculateQty), h.riskSize.subscribe(this, this._recalculateQty), h.entryPrice.subscribe(this, this._recalculateAmount), h.profitLevel.subscribe(this, this._recalculateAmount), h.stopLevel.subscribe(this, this._recalculateAmount), h.accountSize.subscribe(this, this._recalculateAmount), h.riskSize.subscribe(this, this._recalculateAmount), h.qty.subscribe(this, this._recalculateAmount), this._entryPriceAxisView = new u(this, {
                  colorProperty: h.linecolor,
                  priceProperty: h.entryPrice
              }), this._stopPriceAxisView = new u(this, {
                  colorProperty: h.stopBackground,
                  priceProperty: h.stopPrice
              }), this._profitPriceAxisView = new u(this, {
                  colorProperty: h.profitBackground,
                  priceProperty: h.targetPrice
              }), i.e(1583).then(i.bind(i, 56457)).then((({
                  RiskRewardPaneView: t
              }) => {
                  const i = [new t(this, e)];
                  this._setPaneViews(i)
              }))
      }
      destroy() {
          var e;
          null === (e = this.ownerSource()) || void 0 === e || e.barsProvider().dataUpdated().unsubscribeAll(this), this.ownerSourceChanged().unsubscribeAll(this), super.destroy()
      }
      hasEditableCoordinates() {
          return !1
      }
      setOwnerSource(e) {
          super.setOwnerSource(e);
          const t = this.ownerSource();
          t && t.symbolSource().symbolInfo() && (this._recalculateAmount(), this._recalculateRiskSize(), this._recalculateQty())
      }
      pointsCount() {
          return 1
      }
      priceAxisViews(e, t) {
          return this.isSourceHidden() || t !== this.priceScale() || this._model.paneForSource(this) !== e ? null : [this._entryPriceAxisView, this._stopPriceAxisView, this._profitPriceAxisView]
      }
      updateAllViews(e) {
          this.isActualSymbol() && this.properties().childs().visible.value() && (hideAllDrawings().value() && this.userEditEnabled() || (super.updateAllViews(e), this._entryPriceAxisView.update(e), this._stopPriceAxisView.update(e), this._profitPriceAxisView.update(e)))
      }
      migrateVersion(e, t, i) {
          if (1 === e && this._points.length >= 1) {
              const e = [];
              e.push(this._points[0]);
              let t = this._points[0];
              if (t = {
                      price: t.price,
                      index: this._getClosePointIndex(t.index)
                  }, e.push(t), this._points[1] && e.push(this._points[1]), this._points[2] && e.push(this._points[2]), this._points = e, this._timePoint.length >= 1) {
                  const t = [],
                      i = this._timePoint[0];
                  t.push(i);
                  const s = {
                      price: i.price,
                      time_t: i.time_t,
                      offset: this._getClosePointIndex(i.offset)
                  };
                  t.push(s), this._timePoint[1] && e.push(this._points[1]), this._timePoint[2] && e.push(this._points[2]), this._timePoint = t
              }
          }
      }
      restoreExternalState(e) {
          if (isNumber(e.entryPrice)) {
              if (e = Object.assign({}, e), !this.isActualSymbol()) {
                  this._timePoint[0].price = e.entryPrice, delete e.entryPrice
              }
              this.properties().merge(e)
          } else super.restoreExternalState(e)
      }
      addPoint(e, t, i) {
          e.price = this._roundPrice(e.price), super.addPoint(e, void 0, !0);
          const s = {
              price: e.price,
              index: this._getClosePointIndex(e.index)
          };
          super._addPointIntenal(s, void 0, !0);
          const r = this._calculateActualEntry(e, s);
          if (r) {
              super._addPointIntenal(r, void 0, !0);
              const e = this._findClosePoint(r, s);
              e && super._addPointIntenal(e, void 0, !0)
          }
          return this._lastPoint = null, this.normalizePoints(), this.createServerPoints(), !0
      }
      setPoint(e, t, i, s) {
          if (!this.isActualSymbol()) return;
          const r = this.properties().childs();
          switch (this._muteSyncLineStyle(), e) {
              case 0:
                  this._changeEntryPoint(t);
                  break;
              case 2:
                  r.stopPrice.setValue(this.prepareStopPrice(t.price));
                  break;
              case 3:
                  r.targetPrice.setValue(this.prepareProfitPrice(t.price));
                  break;
              case 1:
                  t.price = this._roundPrice(t.price), super.setPoint(1, t), this.recalculate()
          }
          this._unmuteSyncLineStyleWithoutApplyingChanges(), this.syncPriceLevels()
      }
      getPoint(e) {
          switch (e) {
              case 0:
                  return this._points[0];
              case 1:
                  return {
                      index: this._points[1].index, price: this._points[0].price
                  };
              case 2:
                  return {
                      index: this._points[0].index, price: this.stopPrice()
                  };
              case 3:
                  return {
                      index: this._points[0].index, price: this.profitPrice()
                  }
          }
          return null
      }
      setPoints(e) {
          this._muteSyncLineStyle(), super.setPoints(e), this.recalculate(), this._unmuteSyncLineStyleWithoutApplyingChanges(), this.syncPriceLevels()
      }
      start() {
          super.start(), this.recalculate()
      }
      startMoving(e, t, i, r) {
          const n = ensureDefined(e.logical);
          n.price = this._roundPrice(n.price), super.startMoving(e, t, i)
      }
      move(e, t, i, r) {
          const n = ensureDefined(e.logical);
          n.price = this._roundPrice(n.price), super.move(e, t, i), this.recalculate(), this._entryPriceAxisView.update(sourceChangeEvent(this.id()))
      }
      axisPoints() {
          if (!this._points[RiskRewardPointIndex.ActualEntry]) return [];
          const e = this._points[RiskRewardPointIndex.ActualEntry];
          let t = null;
          if (4 === this._points.length) t = this._points[RiskRewardPointIndex.ActualClose];
          else {
              const e = this.lastBarData();
              if (!e) return [];
              t = {
                  index: e.index,
                  price: e.closePrice
              }
          }
          return [e, t]
      }
      recalculateStateByData() {
          this.recalculate()
      }
      recalculate() {
          if (0 === this.points().length) return;
          const e = this.properties().childs(),
              t = e.targetPrice.value(),
              i = e.stopPrice.value(),
              s = [this._points[0], this._points[1]],
              r = this._calculateActualEntry(this.points()[0], this.points()[1]);
          if (r) {
              s.push(r);
              const e = this._findClosePoint(r, this.points()[1]);
              e && s.push(e)
          }
          this._points = s, t !== e.targetPrice.value() && e.targetPrice.listeners().fire(e.targetPrice), i !== e.stopPrice.value() && e.stopPrice.listeners().fire(e.stopPrice)
      }
      syncPriceLevels() {
          const e = this.linkKey().value();
          if (e) {
              const t = this.properties().childs(),
                  i = {
                      entryPrice: t.entryPrice.value(),
                      stopLevel: t.stopLevel.value(),
                      profitLevel: t.profitLevel.value()
                  };
              changeLineStyle({
                  linkKey: e,
                  state: i,
                  model: this._model
              })
          }
      }
      entryPrice() {
          return this.points()[0].price
      }
      lastBarData() {
          var e;
          const t = null === (e = this.ownerSource()) || void 0 === e ? void 0 : e.barsProvider();
          if (!t) return null;
          const i = t.bars().firstIndex(),
              r = t.bars().lastIndex();
          if (null === i || null === r || isNaN(i) || isNaN(r)) return null;
          const o = this.points();
          if (4 === o.length) {
              const e = o[RiskRewardPointIndex.ActualClose];
              return e.index < i ? null : {
                  closePrice: e.price,
                  index: Math.min(r, e.index)
              }
          }
          const a = o[RiskRewardPointIndex.Close];
          if (a.index < i) return null;
          const l = Math.min(r, a.index),
              h = t.bars().search(l, PlotRowSearchMode.NearestLeft);
          return null === h ? null : {
              closePrice: ensure(h.value[4]),
              index: h.index
          }
      }
      ownerSourceBase() {
          var e;
          const t = null === (e = this.ownerSource()) || void 0 === e ? void 0 : e.symbolSource().symbolInfo();
          return t ? t.pricescale / t.minmov : 100
      }
      getOrderTemplate() {
          return null
      }
      template() {
          const e = this.properties().childs(),
              t = super.template();
          return t.stopLevel = e.stopLevel.value(), t.profitLevel = e.profitLevel.value(), t
      }
      _applyTemplateImpl(e) {
          const {
              targetPrice: t,
              stopPrice: i,
              entryPrice: s,
              ...r
          } = e;
          super._applyTemplateImpl(r);
          const n = this.properties().childs();
          void 0 !== e.stopLevel && n.stopLevel.setValue(e.stopLevel), void 0 !== e.profitLevel && n.profitLevel.setValue(e.profitLevel)
      }
      _propertiesStateExclusions() {
          return ["entryPrice", "stopPrice", "targetPrice"]
      }
      _correctPoints(e, t) {
          return !!this.isActualSymbol() && super._correctPoints([e[0], e[1]], t)
      }
      async _getPropertyDefinitionsViewModelClass() {
          return (await Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 30333))).RiskRewardDefinitionsViewModel
      }
      _recalculateRiskSize() {
          if (this._riskInChange) return;
          const e = this.properties().childs(),
              t = e.risk.value(),
              i = e.riskDisplayMode.value(),
              s = e.accountSize.value();
          i === RiskDisplayMode.Percentage ? e.riskSize.setValue(t / 100 * s) : t > s ? (e.risk.setValue(s), e.riskSize.setValue(s)) : e.riskSize.setValue(t)
      }
      _roundPrice(e) {
          const t = this.ownerSourceBase();
          return Math.round(e * t) / t
      }
      _ownerSourcePointValue() {
          var e, t, i;
          return null !== (i = null === (t = null === (e = this.ownerSource()) || void 0 === e ? void 0 : e.symbolSource().symbolInfo()) || void 0 === t ? void 0 : t.pointvalue) && void 0 !== i ? i : 1
      }
      static _configureProperties(e) {
          LineDataSource._configureProperties(e), e.addExclusion("stopLevel"), e.addExclusion("profitLevel"), e.addExclusion("stopPrice"), e.addExclusion("targetPrice"), e.addExclusion("entryPrice")
      }
      _onSeriesUpdated(e, t, i) {
          this.isSourceHidden() || this._points.length < 2 || null !== i && i.index > Math.max(this._points[0].index, this._points[1].index) || this.recalculateStateByData()
      }
      _recalculateRisk() {
          const e = this.properties().childs(),
              t = e.riskDisplayMode.value(),
              i = e.riskSize.value(),
              s = e.accountSize.value();
          let r = e.risk.value();
          r = t === RiskDisplayMode.Percentage ? w(i / s * 100) : w(s / 100 * r), this._riskInChange = !0, e.risk.setValue(+this._riskFormatter(t).format(r)), this._riskInChange = !1
      }
      _recalculateAmount() {
          if (0 === this.points().length) return;
          const e = this.properties().childs(),
              t = e.accountSize.value(),
              i = e.entryPrice.value(),
              s = e.qty.value(),
              r = e.stopPrice.value(),
              n = e.targetPrice.value(),
              o = this._ownerSourcePointValue();
          e.amountTarget.setValue(this._amountTarget(t, n, i, s, o)), e.amountStop.setValue(this._amountStop(t, r, i, s, o))
      }
      _recalculateQty() {
          if (0 === this.points().length) return;
          const e = this.properties().childs(),
              t = e.entryPrice.value(),
              i = e.stopPrice.value(),
              s = e.riskSize.value() / (Math.abs(t - i) * this._ownerSourcePointValue());
          e.qty.setValue(s)
      }
      _calculateActualEntry(e, t) {
          const i = this.ownerSource();
          if (!i) return null;
          const r = i.barsProvider().bars();
          if (r.isEmpty()) return null;
          const n = ensureNotNull(r.firstIndex()),
              o = Math.max(e.index, n),
              a = e.price,
              l = ensureNotNull(r.lastIndex()),
              c = Math.min(l, t.index),
              h = r.rangeIterator(o, c + 1);
          for (; h.hasNext();) {
              const e = h.next(),
                  t = e.value;
              if (null !== t && ensure(t[2]) >= a && ensure(t[3]) <= a) return {
                  index: e.index,
                  price: a
              }
          }
          return null
      }
      _riskFormatter(e) {
          return e === RiskDisplayMode.Percentage ? this._riskInPercentsFormatter : this._riskInMoneyFormatter
      }
      _getClosePointIndex(e) {
          const t = this._model.timeScale(),
              i = Math.round(t.width() / t.barSpacing());
          return e + Math.max(3, Math.round(.15 * i))
      }
      _findClosePoint(e, t) {
          const i = this.ownerSource();
          if (!i) return null;
          const r = i.barsProvider().bars(),
              n = ensureNotNull(r.firstIndex()),
              o = Math.max(e.index, n),
              a = ensureNotNull(r.lastIndex()),
              l = Math.min(a, t.index),
              c = r.rangeIterator(o, l + 1);
          for (; c.hasNext();) {
              const e = c.next(),
                  t = e.value;
              if (null === t) continue;
              const i = this._checkStopPrice(t);
              if (null != i) return {
                  index: e.index,
                  price: i
              }
          }
          return null
      }
      _changeEntryPoint(e) {
          const t = this.properties().childs(),
              i = t.stopPrice.value(),
              s = t.targetPrice.value(),
              r = 1 / this.ownerSourceBase(),
              n = Math.min(i, s) + r,
              o = Math.max(i, s) - r;
          e.price = Math.max(n, Math.min(o, this._roundPrice(e.price))), super.setPoint(0, e), t.stopPrice.setValue(i), t.targetPrice.setValue(s)
      }
  }
  class LineToolRiskRewardShort extends P {
      constructor(e, t, i, s) {
          super(e, null != t ? t : LineToolRiskRewardShort.createProperties(), i, s)
      }
      name() {
          return "Risk/Reward short"
      }
      stopPrice() {
          return this.entryPrice() + this.properties().childs().stopLevel.value() / this.ownerSourceBase()
      }
      calculatePL(e) {
          return this.entryPrice() - e
      }
      profitPrice() {
          return this.entryPrice() - this.properties().childs().profitLevel.value() / this.ownerSourceBase()
      }
      prepareStopPrice(e) {
          e = this._roundPrice(e);
          const t = this.entryPrice() + 1 / this.ownerSourceBase();
          return Math.max(e, t)
      }
      prepareProfitPrice(e) {
          e = this._roundPrice(e);
          const t = this.entryPrice() - 1 / this.ownerSourceBase();
          return Math.min(e, t)
      }
      static createProperties(e) {
          const t = new DefaultProperty("linetoolriskrewardshort", e);
          return this._configureProperties(t), t
      }
      _amountTarget(e, t, i, s, r) {
          return w(e + (i - t) * s * r)
      }
      _amountStop(e, t, i, s, r) {
          return w(e - (t - i) * s * r)
      }
      _checkStopPrice(e) {
          const t = this.stopPrice(),
              i = this.profitPrice();
          return ensure(e[2]) >= t ? this.stopPrice() : ensure(e[3]) <= i ? this.profitPrice() : null
      }
      _orderSide() {
          throw new Error("not supported")
      }
  }
  class LineToolRiskRewardLong extends P {
      constructor(e, t, i, s) {
          super(e, null != t ? t : LineToolRiskRewardLong.createProperties(), i, s)
      }
      name() {
          return "Risk/Reward long"
      }
      stopPrice() {
          return this.entryPrice() - this.properties().childs().stopLevel.value() / this.ownerSourceBase()
      }
      profitPrice() {
          return this.entryPrice() + this.properties().childs().profitLevel.value() / this.ownerSourceBase()
      }
      calculatePL(e) {
          return e - this.entryPrice()
      }
      prepareStopPrice(e) {
          e = this._roundPrice(e);
          const t = this.entryPrice() - 1 / this.ownerSourceBase();
          return Math.min(e, t)
      }
      prepareProfitPrice(e) {
          e = this._roundPrice(e);
          const t = this.entryPrice() + 1 / this.ownerSourceBase();
          return Math.max(e, t)
      }
      static createProperties(e) {
          const t = new DefaultProperty("linetoolriskrewardlong", e);
          return this._configureProperties(t), t
      }
      _amountTarget(e, t, i, s, r) {
          return w(e + (t - i) * s * r)
      }
      _amountStop(e, t, i, s, r) {
          return w(e - (i - t) * s * r)
      }
      _checkStopPrice(e) {
          const t = this.stopPrice(),
              i = this.profitPrice();
          return ensure(e[3]) <= t ? this.stopPrice() : ensure(e[2]) >= i ? this.profitPrice() : null
      }
      _orderSide() {
          throw new Error("not supported")
      }
  }
