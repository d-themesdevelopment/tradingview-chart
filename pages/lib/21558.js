import { TranslatedString, t } from "some-library"; // ! not correct
import { LineDataSource } from "./13087";
import { LineToolColorsProperty, LineToolWidthsProperty } from "./68806";
import { LevelsProperty } from "./53801";

const eraseLevelLineString = new TranslatedString(
  "erase level line",
  t(null, void 0, i(12962))
);

class LineToolFibRetracement extends LineDataSource {
  constructor(model, properties, source, priceScale) {
    super(
      model,
      properties || LineToolFibRetracement.createProperties(),
      source,
      priceScale
    );
    this.version = 2;
    import(i(95994)).then((module) => {
      const { FibRetracementPaneView } = module;
      this._setPaneViews([new FibRetracementPaneView(this, this._model)]);
    });
  }

  levelsCount() {
    return 24;
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Fib Retracement";
  }

  migrateVersion(version) {
    if (version === 1) {
      this.properties().childs().extendLines.setValue(true);
    }
  }

  processErase(sourceId, lineIndex) {
    const levelPropertyName = "level" + lineIndex;
    const { visible } = this.properties().childs()[levelPropertyName].childs();
    sourceId.setProperty(visible, false, eraseLevelLineString);
  }

  fibLevelsBasedOnLogScale() {
    const priceScale = this.priceScale();
    return (
      this.properties().childs().fibLevelsBasedOnLogScale.value() &&
      priceScale &&
      priceScale.isLog()
    );
  }

  static createProperties(properties) {
    const levelsProperty = new LevelsProperty(
      "linetoolfibretracement",
      properties,
      false,
      {
        range: [1, 24],
        names: ["coeff", "color", "visible"],
      }
    );
    this._configureProperties(levelsProperty);
    return levelsProperty;
  }

  async _getPropertyDefinitionsViewModelClass() {
    return (
      await Promise.all([
        import(i(7201)),
        import(i(3753)),
        import(i(5871)),
        import(i(8167)),
        import(i(8537)),
      ])
    ).then((module) => {
      const { FibDrawingsWith24LevelsDefinitionsViewModel } = module;
      return FibDrawingsWith24LevelsDefinitionsViewModel;
    });
  }

  static _configureProperties(properties) {
    const levelsProperty = properties;
    super._configureProperties(levelsProperty);
    const lineWidths = [
      levelsProperty.childs().trendline.childs().linewidth,
      levelsProperty.childs().levelsStyle.childs().linewidth,
    ];
    const colors = [levelsProperty.childs().trendline.childs().color];

    for (let i = 1; i <= 24; i++) {
      const levelProperty = levelsProperty.child("level" + i);
      const color = levelProperty?.child("color");
      colors.push(color);
    }

    levelsProperty.addChild("linesColors", new LineToolColorsProperty(colors));
    levelsProperty.addChild(
      "linesWidths",
      new LineToolWidthsProperty(lineWidths)
    );
  }
}

export { LineToolFibRetracement };
