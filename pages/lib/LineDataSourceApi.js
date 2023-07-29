import {ensureNotNull, assert} from "./assertions.js";
import {isHashObject} from "./1722.js"

  const pointsCountMap = new Map([
      ["LineToolRiskRewardLong", 2],
      ["LineToolRiskRewardShort", 2],
      ["LineToolBezierQuadro", 3],
      ["LineToolBezierCubic", 4]
  ]);

  function getPointsCount(e) {
      const t = pointsCountMap.get(e.toolname);
      if (void 0 !== t) return t;
      const i = e.pointsCount();
      return -1 === i ? e.points().length : i
  }

  function isLineToolRiskReward(e) {
      return "LineToolRiskRewardLong" === e || "LineToolRiskRewardShort" === e
  }
  const PropertiesLineDataSource = ["alwaysShowStats", "entryPrice", "inputs.first bar time", "inputs.last bar time", "interval", "linesWidths", "points", "snapTo45Degrees", "stopPrice", "symbol", "symbolStateVersion", "currencyId", "unitId", "targetPrice", "zOrderVersion"];
  class LineDataSourceApi {
      constructor(e, t, i) {
          this._source = e, this._undoModel = t, this._model = t.model(), this._pointsConverter = i
      }
      isSelectionEnabled() {
          return this._source.isSelectionEnabled()
      }
      setSelectionEnabled(e) {
          this._source.setSelectionEnabled(e)
      }
      isSavingEnabled() {
          return this._source.isSavedInChart()
      }
      setSavingEnabled(e) {
          this._source.setSavingInChartEnabled(e)
      }
      isShowInObjectsTreeEnabled() {
          return this._source.showInObjectTree()
      }
      setShowInObjectsTreeEnabled(e) {
          this._source.setShowInObjectsTreeEnabled(e)
      }
      isUserEditEnabled() {
          return this._source.userEditEnabled()
      }
      setUserEditEnabled(e) {
          this._source.setUserEditEnabled(e)
      }
      bringToFront() {
          this._model.bringToFront([this._source])
      }
      sendToBack() {
          this._model.sendToBack([this._source])
      }
      getProperties() {
          return this._source.properties().state(PropertiesLineDataSource, !0)
      }
      setProperties(e) {
          this._setProps(this._source.properties(), e, "")
      }
      getPoints() {
          let e = this._source.points();
          const t = getPointsCount(this._source);
          return e.length > t && (assert(isLineToolRiskReward(this._source.toolname)), e = e.slice(0, t)), this._pointsConverter.dataSourcePointsToPriced(e)
      }
      setPoints(e) {
          if (this._source.isFixed()) return;
          const t = getPointsCount(this._source);
          if (t !== e.length) throw new Error(`Wrong points count. Required: ${t}, provided: ${e.length}`);
          const i = this._pointsConverter.apiPointsToDataSource(e);
          this._model.startChangingLinetool(this._source), this._model.changeLinePoints(this._source, i), this._model.endChangingLinetool(!0), this._source.createServerPoints()
      }
      getAnchoredPosition() {
          return this._source.positionPercents()
      }
      setAnchoredPosition(e) {
          const t = this._source.fixedPoint(),
              i = this._source.linkKey().value(),
              s = void 0 === t ? null : this._source.screenPointToPoint(t);
          if (!this._source.isFixed() || void 0 === t || null === i || null === s) return;
          const r = {
                  logical: s,
                  screen: t
              },
              n = new Map;
          n.set(i, e), this._model.startMovingSources([this._source], r, null, new Map), this._model.moveSources(r, n), this._model.endMovingSources(!0)
      }
      ownerSourceId() {
          return ensureNotNull(this._source.ownerSource()).id()
      }
      changePoint(e, t) {
          if (this._source.isFixed()) return;
          const i = this._pointsConverter.apiPointsToDataSource([e])[0];
          this._model.startChangingLinetool(this._source, {
              ...i
          }, t), this._model.changeLinePoint({
              ...i
          }), this._model.endChangingLinetool(!1), this._source.createServerPoints()
      }
      isHidden() {
          return this._source.isSourceHidden()
      }
      getRawPoints() {
          return this._source.points()
      }
      setRawPoint(e, t) {
          this._model.startChangingLinetool(this._source, {
              ...t
          }, e), this._model.changeLinePoint({
              ...t
          }), this._model.endChangingLinetool(!1)
      }
      move(e, t) {
          this._model.startMovingSources([this._source], {
              logical: e
          }, null, new Map), this._model.moveSources({
              logical: t
          }, new Map), this._model.endMovingSources(!1)
      }
      dataAndViewsReady() {
          return this._source.dataAndViewsReady()
      }
      zorder() {
          return this._source.zorder()
      }
      symbol() {
          return this._source.properties().symbol.value()
      }
      currency() {
          return this._source.properties().currencyId.value()
      }
      unit() {
          return this._source.properties().unitId.value()
      }
      share(e) {
          this._undoModel.shareLineTools([this._source], e)
      }
      sharingMode() {
          return this._source.sharingMode().value()
      }
      _setProps(e, t, i) {
          for (const s in t) {
              if (!t.hasOwnProperty(s)) continue;
              const n = 0 === i.length ? s : `${i}.${s}`;
              if (e.hasOwnProperty(s)) {
                  const i = t[s];
                  isHashObject(i) ? this._setProps(e[s], i, n): e[s].setValue(i)
              } else console.warn(`Unknown property "${n}"`)
          }
      }
  }