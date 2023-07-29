import {assert, ensureNotNull} from "./assertions.js";
import {toInt} from "./37160.js";
import {Interval} from "./36274.js";
import {Std} from "./74649.js";
import {GraphicsObj} from "./GraphicsObj.js"

  class Polygons extends GraphicsObj {
      constructor(e, t, i, r, n, o) {
          super(e), assert(t < i), this._priceLow = this._mixinJSONObject.createDoubleField(t, "priceLow"), this._priceHigh = this._mixinJSONObject.createDoubleField(i, "priceHigh"), this._rate = this._mixinJSONObject.createDoubleArrayField(r, "rate"), this._firstBarTime = this._mixinJSONObject.createTimeField(n, "firstBarTime"), this._lastBarTime = this._mixinJSONObject.createTimeField(o, "lastBarTime")
      }
      isNaN() {
          return super.isNaN() || Number.isNaN(this._priceLow.get()) || Number.isNaN(this._priceHigh.get()) || 0 === this._rate.get().length
      }
      jsonName() {
          return "hhists"
      }
      primitiveData() {
          return {
              id: this.id(),
              priceHigh: this._priceHigh.get(),
              priceLow: this._priceLow.get(),
              rate: this._rate.get().slice(),
              firstBarTime: this._firstBarTime.get(),
              lastBarTime: this._lastBarTime.get()
          }
      }
      setPriceLow(e) {
          this._priceLow.set(e) && this._processObjUpdate()
      }
      priceLow() {
          return this._priceLow.get()
      }
      priceHigh() {
          return this._priceHigh.get()
      }
      setPriceHigh(e) {
          this._priceHigh.set(e) && this._processObjUpdate()
      }
      rate() {
          return this._rate.get().slice()
      }
      setRate(e) {
          this._rate.set(e) && this._processObjUpdate()
      }
      rateAt(e) {
          return this._rate.get()[e]
      }
      ratesSum() {
          let e = 0;
          for (const t of this._rate.get()) !Number.isNaN(t) && Number.isFinite(t) && (e += t);
          return e
      }
      firstBarTime() {
          return this._firstBarTime.get()
      }
      setFirstBarTime(e) {
          this._firstBarTime.set(e) && this._processObjUpdate()
      }
      lastBarTime() {
          return this._lastBarTime.get()
      }
      setLastBarTime(e) {
          this._lastBarTime.set(e) && this._processObjUpdate()
      }
  }
  var c = i(31584);
  class PriceLevel {
      constructor(e, t, i) {
          this.index = e, this.offset = i, this.level = t
      }
      isNaN() {
          return Number.isNaN(this.level)
      }
      equals(e) {
          return e instanceof PriceLevel && (!this.isNaN() && (!e.isNaN() && (this.index === e.index && this.offset === e.offset && Std.equal(this.level, e.level))))
      }
      getLevel() {
          return this.level
      }
      getIndex() {
          return this.index
      }
  }
  class BoxClass extends GraphicsObj {
      constructor(e, t) {
          super(e), this._points = [], t && (this._points = t)
      }
      addPoint(e) {
          this._processObjUpdate(), this._points.push(e)
      }
      addPoints(e) {
          this._processObjUpdate(), this._points.push(...e)
      }
      setPoint(e, t) {
          const i = this._points[e];
          t.equals(i) || (this._processObjUpdate(), this._points[e] = t)
      }
      point(e) {
          const t = this._points[e];
          return new PriceLevel(t.index, t.level, t.offset)
      }
      points() {
          return this._points
      }
      pointsCount() {
          return this._points.length
      }
      setPoints(e) {
          if (e.length === this._points.length) {
              let t = !0;
              for (let i = 0; i < e.length; ++i)
                  if (!e[i].equals(this._points[i])) {
                      t = !1;
                      break
                  } if (t) return
          }
          this._processObjUpdate(), this._points = [], this._points.push(...e)
      }
      clearPoints() {
          this._processObjUpdate(), this._points = []
      }
      isNaN() {
          return super.isNaN() || this._points.length < 3
      }
      jsonName() {
          return "polygons"
      }
      primitiveData() {
          return {
              id: this.id(),
              points: this._points.map((e => ({
                  index: e.index,
                  offset: e.offset,
                  level: e.level
              })))
          }
      }
  }
  class POCClass extends GraphicsObj {
      constructor(e, t, i, s, r = !1, n = !1) {
          super(e), this._endIndex = this._mixinJSONObject.createTimeField(i, "endIndex"), this._extendLeft = this._mixinJSONObject.createField(r, "extendLeft"), this._extendRight = this._mixinJSONObject.createField(n, "extendRight"), this._level = this._mixinJSONObject.createDoubleField(s, "level"), this._startIndex = this._mixinJSONObject.createTimeField(t, "startIndex")
      }
      isNaN() {
          return super.isNaN() || Number.isNaN(this._level.get()) || this._startIndex.get() < 0 || this._endIndex.get() < 0 || this._startIndex.get() === this._endIndex.get() && !this._extendLeft.get() && !this._extendRight.get()
      }
      jsonName() {
          return "horizlines"
      }
      primitiveData() {
          return {
              id: this.id(),
              startIndex: this._startIndex.get(),
              endIndex: this._endIndex.get(),
              extendLeft: this._extendLeft.get(),
              extendRight: this._extendRight.get(),
              level: this._level.get()
          }
      }
      startIndex() {
          return this._startIndex.get()
      }
      setStartIndex(e) {
          this._startIndex.set(e) && this._processObjUpdate()
      }
      endIndex() {
          return this._endIndex.get()
      }
      setEndIndex(e) {
          this._endIndex.set(e) && this._processObjUpdate()
      }
      level() {
          return this._level.get()
      }
      setLevel(e) {
          this._level.set(e) && this._processObjUpdate()
      }
      isExtendLeft() {
          return this._extendLeft.get()
      }
      setExtendLeft(e) {
          this._extendLeft.set(e) && this._processObjUpdate()
      }
      extendLeft() {
          return this.isExtendLeft()
      }
      isExtendRight() {
          return this._extendRight.get()
      }
      setExtendRight(e) {
          this._extendRight.set(e) && this._processObjUpdate()
      }
      extendRight() {
          return this.isExtendRight()
      }
  }
  class p {
      constructor() {
          this._map = new Map
      }
      get(e) {
          const t = this._innerMap(e.start);
          return t && t.get(e.end)
      }
      set(e, t) {
          this._innerMap(e.start, !0).set(e.end, t)
      }
      clear() {
          this._map.clear()
      }
      size() {
          let e = 0;
          return this._map.forEach((t => e += t.size)), e
      }
      _innerMap(e, t) {
          let i = this._map.get(e);
          return void 0 === i && t && (i = new Map, this._map.set(e, i)), i
      }
  }
  class VolumeByPriceExpr {
      constructor(e, t, i, r, n, o, a, l, h, d, u, _, m, g, f) {
          this._freezedBoxes = new c.GraphicsList, this._freezedHists = new c.GraphicsList, this._freezedPocs = new c.GraphicsList, this._freezedVAHists = new c.GraphicsList, this._currentHistsGr = new c.GraphicsList, this._currentVAHistsGr = new c.GraphicsList, this._currentHists = [], this._currentHistsMap = new p, this._currentBox = null, this._currentPoc = null, this._historyBarSet = [], this._prevRtBar = null, this._minPrice = Number.POSITIVE_INFINITY, this._maxPrice = Number.NEGATIVE_INFINITY, this._leftBoxTime = null, this._rightBoxTime = null, this._actualRightBoxTime = null, this._needRecalc = !1, this._largestHistItem = null, this._rowsLayout = null, this._currentVAStart = 0, this._currentVAEnd = 0, this._previousVAStart = 0, this._previousVAEnd = 0, this._idsGenerator = null, assert(1 === e || 2 === e), this._numOfSubHists = e, this._outHists = r, this._outBoxLines = n, this._outPocLines = o, this._extendPocLeftRight = a, this._outVAHists = l, this._vaVolumePercent = h, this._rowsLayoutSupplier = d, this._outHists.addStable(this._freezedHists), this._outVAHists.addStable(this._freezedVAHists), this._maxHHistItems = u, this._layoutIsAutoselected = g, this._leftBoxTimeMutable = _, this._rightBoxTimeMutable = m, this._actualRightBoxTime = null != f ? f : m, this._ctx = t, this._seriesGetter = i
      }
      update(e) {
          this._supplyRowsLayout(this._ctx), null === this._currentBox && this._initCurrentBox(), null === this._currentPoc && this._initCurrentPoc();
          const t = this._timeScale().get(e);
          this._leftBoxTime = this._leftBoxTimeMutable, this._rightBoxTime = this._rightBoxTimeMutable, this._ctx.symbol.isLastBar && !Number.isNaN(this._rightBoxTime) && (this._rightBoxTime = Math.min(t + n.Interval.parse(this._ctx.symbol.interval + this._ctx.symbol.resolution).inMilliseconds(t) - 1, this._rightBoxTime));
          const i = Std.greaterOrEqual(this._seriesClose().get(e), this._seriesOpen().get(e)),
              s = {
                  high: this._seriesHigh().get(e),
                  low: this._seriesLow().get(e),
                  volume: this._seriesVol().get(e),
                  isUp: i,
                  time: t
              };
          this._updateCurrentHistogram(s), this._currentHists.length > 0 && (this._largestHistItem = this._getLargestHistItem(), this._updateCurrentPoc(),
              this._seriesGetter.developingPoc().set(this._currentPoc.level()), this._updateValueArea(), this._vaVolumePercent > 0 && (this._seriesGetter.developingVAHigh().set(this._currentHists[this._currentVAEnd].priceHigh()), this._seriesGetter.developingVALow().set(this._currentHists[this._currentVAStart].priceLow()))), this._updateCurrentBox(), this._rebuildOutData()
      }
      setIdsGeneratorProxy(e) {
          this._idsGenerator = e
      }
      nextGraphicsObjId() {
          return ensureNotNull(this._idsGenerator).nextGraphicsObjId()
      }
      pushEraseObjCmd(e, t) {
          ensureNotNull(this._idsGenerator).pushEraseObjCmd(e, t)
      }
      popEraseCmds() {
          return ensureNotNull(this._idsGenerator).popEraseCmds()
      }
      _timeScale() {
          return this._seriesGetter.time()
      }
      _seriesLow() {
          return this._seriesGetter.low()
      }
      _seriesHigh() {
          return this._seriesGetter.high()
      }
      _seriesVol() {
          return this._seriesGetter.volume()
      }
      _seriesOpen() {
          return this._seriesGetter.open()
      }
      _seriesClose() {
          return this._seriesGetter.close()
      }
      _freezeCurrentHistogramAndCleanup() {
          null !== this._currentBox && this._freezedBoxes.add(this._currentBox), Std.greater(this._getVolume(this._currentHists), 0) && (this._freezedHists.addAll(this._currentHistsGr), this._freezedVAHists.addAll(this._currentVAHistsGr), null !== this._currentPoc && this._freezedPocs.add(this._currentPoc)), this._currentHists = [], this._currentHistsGr.clear(), this._currentHistsMap.clear(), this._initCurrentBox(), this._initCurrentPoc(), this._currentVAHistsGr.clear(), this._historyBarSet = [], this._minPrice = Number.POSITIVE_INFINITY, this._maxPrice = Number.NEGATIVE_INFINITY, this._prevRtBar = null, this._leftBoxTime = null, this._rightBoxTime = null
      }
      _supplyRowsLayout(e) {
          null === this._rowsLayout && e.symbol.isFirstBar && e.symbol.isNewBar && (this._rowsLayout = this._rowsLayoutSupplier())
      }
      _updateCurrentHistogram(e) {
          if (this._needRecalc = !1, Std.greater(this._minPrice, e.low) && (this._minPrice = e.low, this._needRecalc = !0), Std.less(this._maxPrice, e.high) && (this._maxPrice = e.high, this._needRecalc = !0), this._ctx.symbol.isBarClosed && this._historyBarSet.length > 0) {
              const t = this._historyBarSet[this._historyBarSet.length - 1];
              t.time === e.time && (this._prevRtBar = t, this._historyBarSet.pop())
          }
          this._needRecalc && 0 === ensureNotNull(this._rowsLayout).type() ? (this._recalculateCurrentResultsOnHistoryBarSet(), this._applyUpdateToCurrentResults(e, !1)) : this._applyUpdateToCurrentResults(e, !0), this._ctx.symbol.isBarClosed ? (assert(null === this._prevRtBar || e.time === this._prevRtBar.time), this._historyBarSet.push(e), this._prevRtBar = null) : this._prevRtBar = e
      }
      _getMidLevel(e) {
          return (e.priceHigh() + e.priceLow()) / 2
      }
      _getMidLevelFromList(e) {
          return e.length % 2 == 0 ? e[e.length / 2].priceLow() : this._getMidLevel(e[Math.floor(e.length / 2)])
      }
      _getLargestHistItem() {
          let e = [],
              t = this._currentHists[0];
          for (const i of this._currentHists) Std.greater(i.ratesSum(), t.ratesSum()) ? (t = i, e = [t]) : Std.equal(i.ratesSum(), t.ratesSum()) && e.push(i);
          if (e.length > 1) {
              const i = this._getMidLevelFromList(this._currentHists);
              t = e[e.length - 1];
              for (let s = e.length - 2; s >= 0; s--) {
                  const r = e[s];
                  Std.lessOrEqual(Math.abs(this._getMidLevel(r) - i), Math.abs(this._getMidLevel(t) - i)) && (t = r)
              }
          }
          return t
      }
      _initCurrentPoc() {
          this._currentPoc = new POCClass(this, 0, 0, 0)
      }
      _updateCurrentPoc() {
          const e = ensureNotNull(this._currentPoc);
          e.setStartIndex(ensureNotNull(this._leftBoxTime)), e.setEndIndex(ensureNotNull(this._actualRightBoxTime)), e.setExtendLeft(this._extendPocLeftRight), e.setExtendRight(this._extendPocLeftRight);
          const t = this._getMidLevel(ensureNotNull(this._largestHistItem));
          e.setLevel(t)
      }
      _getVolume(e) {
          let t = 0;
          for (const i of e) t += i.ratesSum();
          return t
      }
      _getPocHistItemIndex() {
          for (let e = 0; e < this._currentHists.length; e++)
              if (this._currentHists[e] === this._largestHistItem) return e;
          return -1
      }
      _calculateValueArea() {
          const e = this._getPocHistItemIndex();
          assert(e >= 0, `ERROR - PocHistItemIndex == ${e}`), this._currentVAStart = e - 1, this._currentVAEnd = e + 1;
          const t = this._getVolume(this._currentHists) * this._vaVolumePercent * .01;
          let i = this._currentHists[e].ratesSum(),
              r = 0,
              n = null;
          for (; Std.lessOrEqual(i + r, t) && (i += r, 0 === n ? --this._currentVAStart : 1 === n && ++this._currentVAEnd, -1 !== this._currentVAStart || this._currentVAEnd !== this._currentHists.length);) {
              let t, i;
              if (this._currentVAStart > -1)
                  if (t = this._currentHists[this._currentVAStart].ratesSum(), this._currentVAEnd < this._currentHists.length)
                      if (i = this._currentHists[this._currentVAEnd].ratesSum(), Std.greater(t, i)) r = t, n = 0;
                      else if (Std.greater(i, t)) r = i, n = 1;
              else {
                  const s = Math.abs(e - this._currentVAStart),
                      o = Math.abs(e - this._currentVAEnd);
                  s < o ? (r = t, n = 0) : o <= s && (r = i, n = 1)
              } else r = t, n = 0;
              else r = this._currentHists[this._currentVAEnd].ratesSum(), n = 1
          }
          this._currentVAStart++, this._currentVAEnd--
      }
      _isVA(e) {
          return e.priceHigh() > this._getMidLevel(this._currentHists[this._currentVAStart]) && e.priceLow() < this._getMidLevel(this._currentHists[this._currentVAEnd])
      }
      _updateValueArea() {
          if (this._calculateValueArea(), this._needRecalc || this._previousVAStart !== this._currentVAStart || this._previousVAEnd !== this._currentVAEnd) {
              let e = 0,
                  t = 0;
              for (; e < this._currentHistsGr.size() && t < this._currentVAHistsGr.size();) {
                  for (; e < this._currentHistsGr.size() && !this._isVA(this._currentHistsGr.get(e));) e++;
                  for (; t < this._currentVAHistsGr.size() && this._isVA(this._currentVAHistsGr.get(t));) t++;
                  if (e < this._currentHistsGr.size() && t < this._currentVAHistsGr.size()) {
                      const i = this._currentHistsGr.get(e);
                      this._currentHistsGr.set(e, this._currentVAHistsGr.get(t)), this._currentVAHistsGr.set(t, i)
                  }
              }
              for (; e < this._currentHistsGr.size(); e++) {
                  const t = this._currentHistsGr.get(e);
                  this._isVA(t) && (this._currentHistsGr.remove(e), e--, this._currentVAHistsGr.add(t))
              }
              for (; t < this._currentVAHistsGr.size(); t++) {
                  const e = this._currentVAHistsGr.get(t);
                  this._isVA(e) || (this._currentVAHistsGr.remove(t), t--, this._currentHistsGr.add(e))
              }
          }
          this._previousVAStart = this._currentVAStart, this._previousVAEnd = this._currentVAEnd
      }
      _initCurrentBox() {
          this._currentBox = new BoxClass(this)
      }
      _updateCurrentBox() {
          let e = this._minPrice,
              t = this._maxPrice;
          this._currentHists.length > 0 && (e = this._currentHists[0].priceLow(), t = this._currentHists[this._currentHists.length - 1].priceHigh());
          const i = [],
              r = ensureNotNull(this._leftBoxTime),
              n = ensureNotNull(this._actualRightBoxTime);
          i.push(new PriceLevel(r, e)), i.push(new PriceLevel(r, t)), i.push(new PriceLevel(n, t)),
              i.push(new PriceLevel(n, e)), ensureNotNull(this._currentBox).setPoints(i)
      }
      _recalculateCurrentResultsOnHistoryBarSet() {
          for (let e = 0; e < this._currentHists.length; ++e) this._currentHists[e].erase();
          this._currentHists = [], this._currentHistsGr.clear(), this._currentVAHistsGr.clear(), this._currentHistsMap.clear();
          for (let e = 0; e < this._historyBarSet.length; e++) this._addHistoryBarToHistogram(this._historyBarSet[e], e, this._currentHists, this._currentHistsMap, 1);
          this._currentHists.length > 0 && (this._largestHistItem = this._getLargestHistItem(), this._updateCurrentPoc()), this._updateCurrentBox()
      }
      _applyUpdateToCurrentResults(e, t) {
          t && null !== this._prevRtBar && this._addHistoryBarToHistogram(this._prevRtBar, this._historyBarSet.length - 1, this._currentHists, this._currentHistsMap, -1), this._addHistoryBarToHistogram(e, this._historyBarSet.length - 1, this._currentHists, this._currentHistsMap, 1), this._updateLastBarTimeInHistogram(this._currentHists)
      }
      _addHistoryBarToHistogram(e, t, i, r, n) {
          assert(-1 === n || 1 === n, "Please set sign argument either +1 or -1");
          const a = e.low,
              l = e.high,
              c = isNaN(e.volume) ? 0 : e.volume,
              h = e.isUp,
              d = ensureNotNull(this._rowsLayout);
          d.init(this._ctx.symbol.minTick, this._minPrice, this._maxPrice, a, l);
          const u = d.rowWidth();
          if (!Std.greater(u, 0)) return;
          d.calculate();
          const p = d.getIndexLowVbP(),
              _ = d.getIndexHighVbP(),
              m = d.getStartPrice();
          if (p === _) {
              const e = p * u + m,
                  t = (p + 1) * u + m;
              this._updateResult({
                  start: e,
                  end: t
              }, n * c, h, i, r)
          } else {
              let e = 0;
              for (let t = p; t <= _; t++) {
                  const s = t * u + m,
                      o = (t + 1) * u + m,
                      d = this._rowCoeff(s, o, a, l),
                      p = d * c;
                  e += d, this._updateResult({
                      start: s,
                      end: o
                  }, n * p, h, i, r)
              }assert(Std.equal(e, 1, .05), `totalCoeff not equal 1! totalConf = ${e}`)
          }
      }
      _updateResult(e, t, i, r, n) {
          const a = this._createRates(i, t);
          assert(null !== this._leftBoxTime, "leftBoxTime is not set (equals null)"), assert(null !== this._rightBoxTime, "rightBoxTime is not set (equals null)");
          const c = ensureNotNull(this._leftBoxTime),
              h = ensureNotNull(this._actualRightBoxTime);
          let d = n.get(e);
          if (void 0 === d) d = new Polygons(this, e.start, e.end, a, c, h), n.set(e, d), this._verifyHistogramSizeIsNotTooLarge(n.size()), this._currentHistsGr.add(d), VolumeByPriceExpr._addInOrder(d, r, 0, r.length, ((e, t) => {
              let i = Std.compare(e.firstBarTime(), t.firstBarTime());
              return 0 !== i ? i : (i = Std.compare(e.priceLow(), t.priceLow()), 0 !== i ? i : Std.compare(e.priceHigh(), t.priceHigh()))
          }));
          else {
              const e = [];
              for (let t = 0; t < length; t++) e[t] = d.rateAt(t) + a[t];
              d.setRate(e)
          }
      }
      _rebuildOutData() {
          const e = this._currentHistsMap.size(),
              t = this._currentHists.length,
              i = this._currentHistsGr.size(),
              r = this._currentVAHistsGr.size();
          assert(e === t && t === i + r, `Collections of HHistItems are out of sync ${e} ${t} ${i} ${r}`), this._outPocLines.clear(), this._outPocLines.addAll(this._freezedPocs), Std.greater(this._getVolume(this._currentHists), 0) ? (this._outHists.setVariable(this._currentHistsGr), this._outPocLines.add(ensureNotNull(this._currentPoc)), this._outVAHists.setVariable(this._currentVAHistsGr)) : (this._outHists.setVariable(null), this._outVAHists.setVariable(null)), this._outBoxLines.clear(), this._outBoxLines.addAll(this._freezedBoxes), this._outBoxLines.add(ensureNotNull(this._currentBox))
      }
      _verifyHistogramSizeIsNotTooLarge(e) {
          if (this._layoutIsAutoselected) return;
          if (e <= this._maxHHistItems) return;
          const t = ensureNotNull(this._rowsLayout);
          0 === t.type() ? Std.error('Histogram is too large, please reduce "Row Size" input.') : (assert(1 === t.type(), `Unexpected rowsLayout type ${t.type()}`), Std.error('Histogram is too large, please increase "Row Size" input.'))
      }
      _createRates(e, t) {
          if (1 === this._numOfSubHists) return [t];
          if (2 === this._numOfSubHists) {
              const i = [0, 0];
              return i[e ? 0 : 1] = t, i
          }
          return assert(!1, `Incorrect value of numOfSubHists = ${this._numOfSubHists}`), []
      }
      _updateLastBarTimeInHistogram(e) {
          const t = ensureNotNull(this._actualRightBoxTime);
          for (const i of e) i.setLastBarTime(t)
      }
      _rowCoeff(e, t, i, s) {
          const r = s - i;
          return (t - e - Math.max(t - s, 0) - Math.max(0, i - e)) / r
      }
      static _addInOrder(e, t, i, s, n) {
          if (i === s) return void t.splice(i, 0, e);
          const o = toInt((i + s) / 2),
              a = t[o];
          n(e, a) < 0 ? VolumeByPriceExpr._addInOrder(e, t, i, o, n) : n(e, a) > 0 ? VolumeByPriceExpr._addInOrder(e, t, o + 1, s, n) : t.splice(o, 0, e)
      }
  }
