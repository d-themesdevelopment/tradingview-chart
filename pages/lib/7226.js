import { t as TranslatedString } from "12962";
import { LineDataSource } from "./13087";
import {
  LevelsProperty,
  LineToolColorsProperty,
  LineToolWidthsProperty,
} from "68806";
import { e as bind } from "36298";

const eraseLevelLineText = new TranslatedString("erase level line", null);

class LineToolFibTimeZone extends LineDataSource {
  constructor(chartWidget, inputParams, properties, model) {
    super(
      chartWidget,
      inputParams || LineToolFibTimeZone.createProperties(),
      properties,
      model
    );
    this.version = 2;

    import("54498").then(({ FibTimeZonePaneView }) => {
      this._setPaneViews([new FibTimeZonePaneView(this, this._model)]);
    });
  }

  levelsCount() {
    return 11;
  }

  migrateVersion(currentVersion, targetVersion, properties) {
    if (currentVersion === 1) {
      const childProperties = properties.properties.childs();
      const baselineColor = properties.properties.baselinecolor.value();
      const lineColor = properties.properties.linecolor.value();
      const lineWidth = properties.properties.linewidth.value();
      const lineStyle = properties.properties.linestyle.value();

      childProperties.level1.childs().color.setValue(baselineColor);

      for (let i = 2; i <= 11; i++) {
        childProperties["level" + i].childs().color.setValue(lineColor);
      }

      for (let i = 1; i <= 11; i++) {
        childProperties["level" + i].childs().linewidth.setValue(lineWidth);
        childProperties["level" + i].childs().linestyle.setValue(lineStyle);
      }
    }
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Fib Time Zone";
  }

  processErase(chartWidget, level) {
    const levelKey = "level" + level;
    const levelVisible = this.properties().childs()[levelKey].childs().visible;
    chartWidget.setProperty(levelVisible, false, eraseLevelLineText);
  }

  static createProperties(inputParams) {
    const levelsProperty = new LevelsProperty(
      "linetoolfibtimezone",
      inputParams,
      false,
      {
        range: [1, 11],
      }
    );

    this._configureProperties(levelsProperty);

    return levelsProperty;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const viewModelModules = await Promise.all([
      import("7201"),
      import("3753"),
      import("5871"),
      import("8167"),
      import("8537"),
    ]);

    return bind(18505, ...viewModelModules);
  }

  static _configureProperties(levelsProperty) {
    super._configureProperties(levelsProperty);

    const lineWidths = [];
    const colors = [];

    for (let i = 1; i <= 11; i++) {
      const childProperties = levelsProperty.childs()["level" + i].childs();
      lineWidths.push(childProperties.linewidth);
      colors.push(childProperties.color);
    }

    levelsProperty.addChild("linesColors", new LineToolColorsProperty(colors));
    levelsProperty.addChild(
      "linesWidths",
      new LineToolWidthsProperty(lineWidths)
    );
  }
}

export { LineToolFibTimeZone };
