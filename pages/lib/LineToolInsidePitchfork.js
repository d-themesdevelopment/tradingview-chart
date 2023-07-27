import { LevelsProperty } from './53801.js';
import { LineToolPitchfork } from './70309.js';

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
