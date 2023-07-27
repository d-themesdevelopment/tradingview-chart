import { TranslatedString } from "./TranslatedString";
import { LineDataSource } from "./13087";
import { LevelsProperty } from "./53801";
import { LineToolWidthsProperty, LineToolColorsProperty } from "./68806";

class LineToolFibSpeedResistanceArcs extends LineDataSource {
  static LevelsCount = 11;

  constructor(chartWidget, model, priceScale, timeScale) {
    super(
      chartWidget,
      model || LineToolFibSpeedResistanceArcs.createProperties(),
      priceScale,
      timeScale
    );

    import(
      /* webpackChunkName: "chart-tool-fib-speed-resistance-arcs-pane-view" */ "some-library"
    ).then(({ FibSpeedResistanceArcsPaneView }) => {
      this._setPaneViews([
        new FibSpeedResistanceArcsPaneView(this, this._model),
      ]);
    });
  }

  static createProperties() {
    const properties = new LevelsProperty(
      "linetoolfibspeedresistancearcs",
      false,
      { range: [1, 11] }
    );
    this._configureProperties(properties);
    return properties;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);

    const lineProps = {
      lineWidth: properties.child("trendline").child("linewidth"),
      lineColor: properties.child("trendline").child("color"),
    };

    const levelProps = [];
    for (let i = 1; i <= this.LevelsCount; i++) {
      levelProps.push({
        lineWidth: properties.child(`level${i}`).child("linewidth"),
        lineColor: properties.child(`level${i}`).child("color"),
      });
    }

    properties.addChild(
      "linesColors",
      new LineToolColorsProperty(levelProps.map((p) => p.lineColor))
    );
    properties.addChild(
      "linesWidths",
      new LineToolWidthsProperty(levelProps.map((p) => p.lineWidth))
    );
  }

  levelsCount() {
    return LineToolFibSpeedResistanceArcs.LevelsCount;
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Fib Speed Resistance Arcs";
  }

  processErase(index, levelIndex) {
    const property = this.properties()[`level${levelIndex}`];
    const visible = property.visible;
    property.setVisible(!visible, new TranslatedString("erase level line"));
  }

  async _getPropertyDefinitionsViewModelClass() {
    const { FibSpeedResistanceArcsDefinitionsViewModel } = await Promise.all([
      import(
        /* webpackChunkName: "chart-fib-speed-resistance-arcs-definitions-view-model" */ "some-library"
      ),
      import(
        /* webpackChunkName: "chart-fib-speed-resistance-arcs-definitions-view-model" */ "some-library"
      ),
      import(
        /* webpackChunkName: "chart-fib-speed-resistance-arcs-definitions-view-model" */ "some-library"
      ),
      import(
        /* webpackChunkName: "chart-fib-speed-resistance-arcs-definitions-view-model" */ "some-library"
      ),
      import(
        /* webpackChunkName: "chart-fib-speed-resistance-arcs-definitions-view-model" */ "some-library"
      ),
    ]);
    return FibSpeedResistanceArcsDefinitionsViewModel;
  }
}

export { LineToolFibSpeedResistanceArcs };
