
import { LineDataSource } from '<path_to_LineDataSource_module>';
import { DefaultProperty } from '<path_to_DefaultProperty_module>';
import { DefaultProperty } from '<path_to_DefaultProperty_module>';
import { TimeCyclesPaneView } from '<path_to_TimeCyclesPaneView_module>';

class LineToolTimeCycles extends LineDataSource {
  constructor(model, points, priceScaleId, priceScaleOptions) {
    super(model, points || LineToolTimeCycles.createProperties(), priceScaleId, priceScaleOptions);

    import(/* webpackChunkName: "line-tool-time-cycles-pane-view" */ './path_to_TimeCyclesPaneView_module').then((module) => {
      this._setPaneViews([new module.TimeCyclesPaneView(this, this._model)]);
    });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Time Cycles";
  }

  setPoint(index, point) {
    const normalizedPoint = ensureDefined(point);
    const firstPoint = this._points[0];
    const secondPoint = this._points[1];
    firstPoint.price = normalizedPoint.price;
    secondPoint.price = normalizedPoint.price;
    this._points[index] = normalizedPoint;
    this.normalizePoints();
  }

  addPoint(time, price, withUpdate = true) {
    const added = super.addPoint(time, price, true);
    if (added) {
      const firstPoint = this._points[0];
      this._points[1].price = firstPoint.price;
      if (!withUpdate) {
        this.normalizePoints();
        this.createServerPoints();
      }
    }
    return added;
  }

  static createProperties(input) {
    const options = new DefaultProperty("linetooltimecycles", input);
    return this._configureProperties(options);
  }

  async _getPropertyDefinitionsViewModelClass() {
    return await Promise.all([
      import(/* webpackChunkName: "time-cycles-pattern-definitions-view-model" */ './path_to_TimeCyclesPatternDefinitionsViewModel_module'),
    ]).then(([module]) => module.TimeCyclesPatternDefinitionsViewModel);
  }
}

export { LineToolTimeCycles };