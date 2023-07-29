import {LineDataSource} from "./13087.js";
import {ensureNotNull, ensureDefined} from "./assertions.js";
import {translateMessage} from "./44352.js";
import {CustomData} from "./59452.js";
import {DefaultProperty} from "./46100.js";
import {LineToolColorsProperty} from "./68806.js";
import {sourceChangeEvent} from "./28558.js";

class LineToolText extends LineDataSource {
      constructor(e, t, s, r) {
          const n = t || LineToolText.createProperties();
          super(e, n, s, r), this._barSpacing = e.timeScale().barSpacing(), this._recalculatePointsOnCenter = !1, i.e(1583).then(i.bind(i, 62912)).then((({
              TextPaneView: t
          }) => {
              const i = this._recalculatePointsOnCenter ? (e, t) => {
                  this._recalculatePointsOnCenter && this._recalculateCenterPosition(e, t)
              } : void 0;
              this._setPaneViews([new t(this, e, void 0, void 0, void 0, void 0, void 0, i)])
          }))
      }
      centerPosition() {
          this._recalculatePointsOnCenter = !0
      }
      setPoint(e, t, i) {
          const r = this.properties().childs();
          let n;
          if (1 === e && r.wordWrapWidth.value()) {
              const e = this.model().timeScale();
              n = this.isFixed() ? ensureDefined(this.fixedPoint()).x : e.indexToCoordinate(this.points()[0].index);
              const i = e.indexToCoordinate(t.index) - n - ~~(r.fontsize.value() / 6);
              if (!isFinite(i)) return;
              r.wordWrapWidth.setValue(Math.max(100, i))
          }
      }
      pointsCount() {
          return 1
      }
      name() {
          return "Text"
      }
      setPriceScale(e) {
          super.setPriceScale(e), e && e.priceRange() && (this._priceDencity = e.height() / ensureNotNull(e.priceRange()).length(), this._isPriceDencityLog = e.isLog())
      }
      restoreSize() {
          const e = ensureNotNull(this.priceScale());
          this._barSpacing = this.model().timeScale().barSpacing(), this._priceDencity = e.height() / ensureNotNull(e.priceRange()).length(), this.redraw(sourceChangeEvent(this.id()))
      }
      redraw(e) {
          this.updateAllViews(e), this._model.updateSource(this)
      }
      template() {
          const e = super.template();
          return e.text = this.properties().childs().text.value(), e
      }
      state(e) {
          const t = super.state(e);
          return e && (t.state.fixedSize = !1), t
      }
      barSpacing() {
          return this._barSpacing
      }
      priceDencity() {
          return this._priceDencity
      }
      isPriceDencityLog() {
          return this._isPriceDencityLog
      }
      hasEditableCoordinates() {
          return !1
      }
      shouldBeRemovedOnDeselect() {
          return "" === this._properties.childs().text.value().trim()
      }
      static createProperties(e) {
          const t = new DefaultProperty("linetooltext", e);
          return this._configureProperties(t), t
      }
      _applyTemplateImpl(e) {
          super._applyTemplateImpl(e), this.properties().childs().text.setValue(e.text)
      }
      _getPropertyDefinitionsViewModelClass() {
          return Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 94625)).then((e => e.TextDefinitionsViewModel))
      }
      static _configureProperties(e) {
          super._configureProperties(e), e.hasChild("text") || e.addChild("text", new CustomData(translateMessage(null, void 0, "Text"))), 
          e.addChild("linesColors", new LineToolColorsProperty([e.childs().borderColor])), 
          e.addChild("textsColors", new LineToolColorsProperty([e.childs().color])), 
          e.addExclusion("text"), e.addExclusion("linesColors"), e.addExclusion("textsColors")
      }
      _recalculateCenterPosition(e, t) {
          const i = this.isFixed() ? ensureDefined(this.fixedPoint()) : ensureNotNull(this.pointToScreenPoint(this._points[0])),
              n = new Point(i.x - e / 2, i.y - t / 2),
              o = ensureNotNull(this.screenPointToPoint(n));
          this.setPoints([o]), this.normalizePoints(), this.createServerPoints(), this.redraw(sourceChangeEvent(this.id()))
      }
}
class LineToolTextAbsolute extends LineToolText {
      constructor(e, t) {
          super(e, t || LineToolTextAbsolute.createProperties())
      }
      name() {
          return "Anchored Text"
      }
      hasEditableCoordinates() {
          return !1
      }
      isFixed() {
          return !0
      }
      static createProperties(e) {
          const t = new DefaultProperty("linetooltextabsolute", e);
          return this._configureProperties(t), t
      }
}