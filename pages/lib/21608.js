import { TranslatedString, t } from "some-library"; // ! not correct
import { LineDataSource } from "./13087";
import { LineToolWidthsProperty, LineToolColorsProperty } from "./68806";
import { LevelsProperty } from "./53801";

const eraseLevelLineString = new TranslatedString(
  "erase level line",
  t(null, void 0, i(12962))
);

class LineToolGannFan extends LineDataSource {
  constructor(model, properties, source, priceScale) {
    super(
      model,
      properties || LineToolGannFan.createProperties(),
      source,
      priceScale
    );
    import(i(25438)).then((module) => {
      const { GannFanPaneView } = module;
      this._setPaneViews([new GannFanPaneView(this, this._model)]);
    });
  }

  levelsCount() {
    return LineToolGannFan.LevelsCount;
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Gann Fan";
  }

  processErase(sourceId, lineIndex) {
    const levelPropertyName = "level" + lineIndex;
    const { visible } = this.properties()[levelPropertyName];
    sourceId.setProperty(visible, false, eraseLevelLineString);
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
      const { GannFanDefinitionsViewModel } = module;
      return GannFanDefinitionsViewModel;
    });
  }

  static createProperties(properties) {
    const levelsProperty = new LevelsProperty(
      "linetoolgannfan",
      properties,
      false,
      {
        range: [1, 9],
      }
    );
    this._configureProperties(levelsProperty);
    return levelsProperty;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    const lineWidths = [];
    const colors = [];

    for (let i = 1; i <= LineToolGannFan.LevelsCount; i++) {
      const levelProperty = properties.child("level" + i);
      lineWidths.push(levelProperty.child("linewidth"));
      colors.push(levelProperty.child("color"));
    }

    properties.addChild("linesColors", new LineToolColorsProperty(colors));
    properties.addChild("linesWidths", new LineToolWidthsProperty(lineWidths));
  }
}

LineToolGannFan.LevelsCount = 9;

export { LineToolGannFan };
