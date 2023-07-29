import {ensureNotNull} from "./assertions.js"
import {DefaultProperty} from "./46100.js";
import {LineDataSource} from "./13087.js";
import {CustomData} from "./59452.js";
import {sourceChangeEvent} from "./28558.js";
class TrendAngleProperty extends CustomData {
      constructor(e) {
          super(), this._lineSource = e
      }
      value() {
          return Math.round(180 * this._lineSource.angle() / Math.PI)
      }
      setValue(e) {
          const t = e * Math.PI / 180,
              i = ensureNotNull(this._lineSource.pointToScreenPoint(this._lineSource.points()[0])),
              n = Math.cos(t),
              o = -Math.sin(t),
              a = new Point(n, o),
              l = i.addScaled(a, this._lineSource.distance()),
              h = ensureNotNull(this._lineSource.screenPointToPoint(l));
          this._lineSource.setPoint(1, h);
          const d = this._lineSource.model();
          d.updateSource(this._lineSource), this._lineSource.updateAllViews(sourceChangeEvent(this._lineSource.id())), d.updateSource(this._lineSource)
      }
      notifyChanged() {
          this._listeners.fire(this)
      }
}
class LineToolTrendAngle extends LineDataSource {
      constructor(e, t, s, r) {
          const n = t || LineToolTrendAngle.createProperties();
          super(e, n, s, r), this._angle = 0, this._distance = 0, n.addChild("angle", new TrendAngleProperty(this)), i.e(1583).then(i.bind(i, 67998)).then((({
              TrendAnglePaneView: t
          }) => {
              const i = [new t(this, e)];
              this._setPaneViews(i)
          }))
      }
      isSynchronizable() {
          return !1
      }
      pointsCount() {
          return 2
      }
      name() {
          return "Trend Angle"
      }
      angle() {
          return this._angle
      }
      distance() {
          return this._distance
      }
      addPoint(e, t) {
          const i = super.addPoint(e, t);
          return i && this._calculateAngle(), i
      }
      setLastPoint(e, t) {
          const i = super.setLastPoint(e, t);
          return this.points().length > 1 && this._calculateAngle(), i
      }
      axisPoints() {
          if (this.points().length < 2) return [];
          const e = [this.points()[0]],
              t = ensureNotNull(this.pointToScreenPoint(this.points()[0])),
              i = Math.cos(this._angle) * this._distance,
              n = -Math.sin(this._angle) * this._distance,
              o = t.add(new Point(i, n)),
              a = ensureNotNull(this.screenPointToPoint(o));
          return e.push(a), e
      }
      timeAxisPoints() {
          return this.axisPoints()
      }
      priceAxisPoints() {
          return this.axisPoints()
      }
      setPoint(e, t, i) {
          super.setPoint(e, t, i), this.points().length > 1 && 1 === e && this._calculateAngle()
      }
      restoreData(e) {
          var t, i;
          this._angle = null !== (t = e.angle) && void 0 !== t ? t : 0, this._distance = null !== (i = e.distance) && void 0 !== i ? i : 0
      }
      state(e) {
          const t = super.state(e);
          return t.angle = this._angle, t.distance = this._distance, t
      }
      cloneData(e) {
          this._angle = e.angle(), this._distance = e.distance()
      }
      canHasAlert() {
          return !0
      }
      static createProperties(e) {
          e && void 0 === e.showPercentPriceRange && (e.showPercentPriceRange = e.showPriceRange, e.showPipsPriceRange = e.showPriceRange);
          const t = new DefaultProperty("linetooltrendangle", e);
          return this._configureProperties(t), t
      }
      _snapTo45DegreesAvailable() {
          return !0
      }
      _getAlertPlots() {
          const e = this._linePointsToAlertPlot(this._points, null, this._properties.childs().extendLeft.value(), this._properties.childs().extendRight.value());
          return null === e ? [] : [e]
      }
      _calculateAngle() {
          const e = ensureNotNull(this.pointToScreenPoint(this.points()[0]));
          let t = ensureNotNull(this.pointToScreenPoint(this.points()[1])).subtract(e);
          const i = t.length();
          i > 0 ? (t = t.normalized(), this._angle = Math.acos(t.x), t.y > 0 && (this._angle = -this._angle), this._distance = i) : this._angle = 0;
          this.properties().childs().angle.notifyChanged()
      }
      _getPropertyDefinitionsViewModelClass() {
          return Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 34935)).then((e => e.TrendAngleDefinitionsViewModel))
      }
}
