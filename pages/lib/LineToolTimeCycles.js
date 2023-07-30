import {LineDataSource} from "./13087.js";
import {DefaultProperty} from "./46100.js";

  var s = i(27788);
  class LineToolTimeCycles extends LineDataSource {
      constructor(e, t, s, r) {
          super(e, null != t ? t : LineToolTimeCycles.createProperties(), s, r), i.e(1583).then(i.bind(i, 65557)).then((e => {
              this._setPaneViews([new e.TimeCyclesPaneView(this, this._model)])
          }))
      }
      pointsCount() {
          return 2
      }
      name() {
          return "Time Cycles"
      }
      setPoint(e, t) {
          const i = (0, s.defaultFunc)(t),
              r = this._points[0],
              n = this._points[1];
          r.price = i.price, n.price = i.price, this._points[e] = i, this.normalizePoints()
      }
      addPoint(e, t, i) {
          const s = super.addPoint(e, t, !0);
          if (s) {
              const e = this._points[0];
              this._points[1].price = e.price, i || (this.normalizePoints(), this.createServerPoints())
          }
          return s
      }
      static createProperties(e) {
          const t = new DefaultProperty("linetooltimecycles", e);
          return this._configureProperties(t), t
      }
      async _getPropertyDefinitionsViewModelClass() {
          return (await Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)]).then(i.bind(i, 81888))).TimeCyclesPatternDefinitionsViewModel
      }
  }
