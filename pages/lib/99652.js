const ReplayStatus = {
    Undefined: 0,
    PointSelect: 1,
    AutoPlay: 2,
    Pause: 3
  };

import { LineTool5PointsPattern } from '<path_to_LineTool5PointsPattern_module>';
import { DefaultProperty } from '<path_to_DefaultProperty_module>';

export class LineToolCypherPattern extends LineTool5PointsPattern {
  constructor(chartWidget, propertyCategory, propertyKey, priceDataSource) {
    super(chartWidget, propertyKey || LineToolCypherPattern.createProperties(), propertyCategory, priceDataSource);
  }

  name() {
    return "Cypher Pattern";
  }

  static createProperties(propertyKey) {
    const properties = new DefaultProperty("linetoolcypherpattern", propertyKey);
    this._configureProperties(properties);
    return properties;
  }

  _loadPaneViews(pane) {
    import(25615).then((module) => {
      this._setPaneViews([new module.CypherPaneView(this, pane)]);
    });
  }
}
