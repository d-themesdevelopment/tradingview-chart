import { DefaultProperty } from "./46100";
import LineToolHorzLinePriceAxisView from "./LineToolHorzLinePriceAxisView";
import { LineToolVertLineTimeAxisView } from "./LineToolVertLineTimeAxisView";
import { LineDataSource } from "./13087";

class LineToolCrossLine extends LineDataSource {
  constructor(chartWidget, model, priceScale, timeScale) {
    super(
      chartWidget,
      model || LineToolCrossLine.createProperties(),
      priceScale,
      timeScale
    );
    this._priceAxisView = new LineToolHorzLinePriceAxisView(this);
    this._timeAxisView = new LineToolVertLineTimeAxisView(this);

    import(
      /* webpackChunkName: "chart-tool-crossline-pane-view" */ "some-library"
    ).then(({ CrossLinePaneView }) => {
      this._setPaneViews([new CrossLinePaneView(this, this._model)]);
    });
  }

  static createProperties() {
    const properties = new DefaultProperty("linetoolcrossline", {});
    this._configureProperties(properties);
    return properties;
  }

  static _configureProperties(properties) {
    // Configure properties
  }

  pointsCount() {
    return 1;
  }

  name() {
    return "Cross Line";
  }

  priceAxisViews(pane, priceScale) {
    if (this.isSourceHidden()) return null;
    if (
      priceScale === this.priceScale() &&
      this.properties().childs().showPrice.value() &&
      this._model.paneForSource(this) === pane
    ) {
      return [this._priceAxisView];
    }
    return null;
  }

  timeAxisViews() {
    if (this.isSourceHidden()) return null;
    if (this.properties().childs().showTime.value()) {
      return [this._timeAxisView];
    }
    return null;
  }

  updateAllViews(updateType) {
    super.updateAllViews(updateType);
    this._priceAxisView.update(updateType);
    this._timeAxisView.update();
  }

  canHasAlert() {
    return false;
  }

  lineColor() {
    return this.properties().childs().linecolor.value();
  }

  lineWidth() {
    return this.properties().childs().linewidth.value();
  }

  lineStyle() {
    return this.properties().childs().linestyle.value();
  }

  _getPropertyDefinitionsViewModelClass() {
    return import(
      /* webpackChunkName: "chart-crossline-definitions-view-model" */ "some-library"
    ).then(({ CrossLineDefinitionsViewModel }) => {
      return CrossLineDefinitionsViewModel;
    });
  }
}

export { LineToolCrossLine };
