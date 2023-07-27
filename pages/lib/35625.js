import { TranslatedString } from "./TranslatedString"; // Replace 'translated-string-module' with the actual module path
import { t } from "t-module"; // Replace 't-module' with the actual module path // ! not correct
import { LineDataSource } from "./13087"; // Replace 'line-data-source-module' with the actual module path
import { LevelsProperty } from "./53801"; // Replace 'levels-property-module' with the actual module path
import { LineToolColorsProperty, LineToolWidthsProperty } from "./68806"; // Replace 'line-tool-properties-module' with the actual module path

const eraseLevelLineString = new TranslatedString(
  "erase level line",
  t(null, void 0, "i18n-module")
); // Replace 'i18n-module' with the actual module path

export class LineToolTrendBasedFibTime extends LineDataSource {
  constructor(chartWidget, properties, source, model) {
    super(
      chartWidget,
      properties || LineToolTrendBasedFibTime.createProperties(),
      source,
      model
    );
    this.version = 1;
    import(
      /* webpackChunkName: "trendBasedFibTimePaneView" */ "trend-based-fib-time-pane-view-module"
    ).then(({ TrendBasedFibTimePaneView }) => {
      this._setPaneViews([new TrendBasedFibTimePaneView(this, this._model)]);
    });
  }

  levelsCount() {
    return 11;
  }

  pointsCount() {
    return 3;
  }

  name() {
    return "Trend-Based Fib Time";
  }

  processErase(chartWidget, levelIndex) {
    const levelPropertyName = "level" + levelIndex;
    const levelProperty = this.properties()
      .childs()
      [levelPropertyName].childs().visible;
    chartWidget.setProperty(levelProperty, false, eraseLevelLineString);
  }

  static createProperties(defaults) {
    const properties = new LevelsProperty(
      "linetooltrendbasedfibtime",
      defaults,
      false,
      {
        range: [1, 11],
      }
    );
    LineToolTrendBasedFibTime._configureProperties(properties);
    return properties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const [module1, module2, module3, module4, module5] = await Promise.all([
      import(/* webpackChunkName: "module1" */ "module1-path"),
      import(/* webpackChunkName: "module2" */ "module2-path"),
      import(/* webpackChunkName: "module3" */ "module3-path"),
      import(/* webpackChunkName: "module4" */ "module4-path"),
      import(/* webpackChunkName: "module5" */ "module5-path"),
    ]);
    return module5.TrendBasedFibTimeDefinitionsViewModel;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    const childProperties = properties.childs();
    const lineProperties = [childProperties.trendline.childs().linewidth];
    const colorProperties = [childProperties.trendline.childs().color];

    for (let levelIndex = 1; levelIndex <= 11; levelIndex++) {
      lineProperties.push(
        childProperties["level" + levelIndex].childs().linewidth
      );
      colorProperties.push(
        childProperties["level" + levelIndex].childs().color
      );
    }

    properties.addChild(
      "linesColors",
      new LineToolColorsProperty(colorProperties)
    );
    properties.addChild(
      "linesWidths",
      new LineToolWidthsProperty(lineProperties)
    );
  }
}
