import { TranslatedString } from "36298";
import { LineDataSource } from "13087";
import { LevelsProperty } from "53801";
import { LineToolColorsProperty } from "68806";
import { t } from "44352";
import { bind } from "12962";
import { e } from "80724";
import { FibSpeedResistanceFanPaneView } from "FibSpeedResistanceFanPaneView";
import { e as loadPromise } from "7201";
import { e as loadPromise1 } from "3753";
import { e as loadPromise2 } from "5871";
import { e as loadPromise3 } from "8167";
import { e as loadPromise4 } from "8537";
import { FibSpeedResistanceFanDefinitionsViewModel } from "4841";

const eraseLevelLineTranslation = new TranslatedString(
  "erase level line",
  t(null, void 0, bind)
);

export class LineToolFibSpeedResistanceFan extends LineDataSource {
  static HLevelsCount = 7;
  static VLevelsCount = 7;

  constructor(data, properties, options, model) {
    super(
      data,
      properties || LineToolFibSpeedResistanceFan.createProperties(),
      options,
      model
    );
    loadPromise.then(
      bind(this, ({ FibSpeedResistanceFanPaneView }) => {
        this._setPaneViews([
          new FibSpeedResistanceFanPaneView(this, this._model),
        ]);
      })
    );
  }

  hLevelsCount() {
    return LineToolFibSpeedResistanceFan.HLevelsCount;
  }

  vLevelsCount() {
    return LineToolFibSpeedResistanceFan.VLevelsCount;
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Fib Speed Resistance Fan";
  }

  processErase(source, target) {
    const propertyName =
      target.type === "h" ? `hlevel${target.index}` : `vlevel${target.index}`;
    const visibleProperty = this.properties()[propertyName].visible;
    source.setProperty(visibleProperty, false, eraseLevelLineTranslation);
  }

  async _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      loadPromise,
      loadPromise1,
      loadPromise2,
      loadPromise3,
      loadPromise4,
    ]).then(bind(this, FibSpeedResistanceFanDefinitionsViewModel));
  }

  _snapTo45DegreesAvailable() {
    return true;
  }

  static createProperties(options) {
    if (options !== undefined && options.reverse === undefined) {
      options.reverse = true;
    }

    const levelsProperty = new LevelsProperty(
      "linetoolfibspeedresistancefan",
      options,
      false,
      {
        range: [1, 7],
        prefixes: ["h", "v"],
        names: ["coeff", "color", "visible"],
      }
    );

    this._configureProperties(levelsProperty);

    return levelsProperty;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);

    const colorProperties = [properties.child("grid").child("color")];
    for (let i = 1; i <= LineToolFibSpeedResistanceFan.HLevelsCount; i++) {
      colorProperties.push(properties.child(`hlevel${i}`).child("color"));
    }
    for (let i = 1; i <= LineToolFibSpeedResistanceFan.VLevelsCount; i++) {
      colorProperties.push(properties.child(`vlevel${i}`).child("color"));
    }

    properties.addChild(
      "linesColors",
      new LineToolColorsProperty(colorProperties)
    );
    properties.addExclusion("linesColors");
  }
}

export default LineToolFibSpeedResistanceFan;
