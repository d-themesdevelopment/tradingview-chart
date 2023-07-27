import { LevelsProperty } from '<path_to_LevelsProperty_module>';
import { LineToolPitchfork } from '<path_to_LineToolPitchfork_module>';

export class LineToolInsidePitchfork extends LineToolPitchfork {
  constructor(chartWidget, propertyCategory, propertyKey, priceDataSource) {
    super(chartWidget, propertyKey || LineToolInsidePitchfork.createProperties(), propertyCategory, priceDataSource);
  }

  name() {
    return "Inside Pitchfork";
  }

  static createProperties(propertyKey) {
    const properties = new LevelsProperty("linetoolinsidepitchfork", propertyKey, false, {
      range: [0, 8],
    });
    this._configureProperties(properties);
    return properties;
  }
}
