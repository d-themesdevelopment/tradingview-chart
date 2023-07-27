
import { LevelsProperty } from '<path_to_LevelsProperty_module>';
import { LineToolPitchfork } from '<path_to_LineToolPitchfork_module>';

class LineToolSchiffPitchfork extends LineToolPitchfork {
  constructor(model, priceScale, timeScale, properties) {
    super(model, properties || LineToolSchiffPitchfork.createProperties(), priceScale, timeScale);
  }

  name() {
    return "Schiff Pitchfork";
  }

  static createProperties(properties) {
    const levelsProperty = new LevelsProperty("linetoolschiffpitchfork2", properties, false, {
      range: [0, 8]
    });

    this._configureProperties(levelsProperty);

    return levelsProperty;
  }
}