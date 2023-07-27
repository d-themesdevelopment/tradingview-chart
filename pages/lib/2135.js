import { LineDataSource, DefaultProperty } from "./13087";
import { DefaultProperty } from "./46100";
import LineToolHorzLinePriceAxisView from "./LineToolHorzLinePriceAxisView";

class LineToolHorzRay extends LineDataSource {
  constructor(points, properties, model, priceScale) {
    super(
      points,
      properties || LineToolHorzRay.createProperties(),
      model,
      priceScale
    );
    this._priceAxisView = new LineToolHorzLinePriceAxisView(this);
    import(/* webpackChunkName: "HorzRayPaneView" */ "another-library").then(
      ({ HorzRayPaneView }) => {
        this._setPaneViews([new HorzRayPaneView(this, this._model)]);
      }
    );
  }

  get pointsCount() {
    return 1;
  }

  get name() {
    return "Horizontal Ray";
  }

  priceAxisViews(pane, priceScale) {
    if (
      this.isSourceHidden() ||
      priceScale !== this.priceScale() ||
      (!this._model.selection().isSelected(this) &&
        !this.properties().childs().showPrice.value()) ||
      pane !== this._model.paneForSource(this)
    ) {
      return null;
    }
    return [this._priceAxisView];
  }

  updateAllViews(updateType) {
    super.updateAllViews(updateType);
    this._priceAxisView.update(updateType);
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  canHasAlert() {
    return true;
  }

  static createProperties(properties) {
    const lineToolHorzRayProperties = new DefaultProperty(
      "linetoolhorzray",
      properties
    );
    this._configureProperties(lineToolHorzRayProperties);
    return lineToolHorzRayProperties;
  }

  _getAlertPlots() {
    const point = this._points[0];
    const nextPoint = {
      index: point.index + 1,
      price: point.price,
    };
    const alertPlot = this._linePointsToAlertPlot(
      [point, nextPoint],
      null,
      false,
      true
    );
    return alertPlot !== null ? [alertPlot] : [];
  }

  async _getPropertyDefinitionsViewModelClass() {
    const [module1, module2, module3, module4, module5] = await Promise.all([
      import(/* webpackChunkName: "module1" */ "module1"),
      import(/* webpackChunkName: "module2" */ "module2"),
      import(/* webpackChunkName: "module3" */ "module3"),
      import(/* webpackChunkName: "module4" */ "module4"),
      import(/* webpackChunkName: "module5" */ "module5"),
    ]);
    return module1.HorizontalRayDefinitionsViewModel;
  }

  _applyTemplateImpl(template) {
    super._applyTemplateImpl(template);
    this.properties()
      .childs()
      .text.setValue(template.text || "");
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild("text", new TextProperty(""));
    }
    properties.addExclusion("text");
  }
}
