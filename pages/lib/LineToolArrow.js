"use strict";
import { LineToolTrendLine } from "./47246.js";
export class LineToolArrow extends LineToolTrendLine {
  constructor(chartWidget, priceScale, points, options) {
    super(
      chartWidget,
      priceScale,
      points,
      options || LineToolArrow.createProperties()
    );
  }

  name() {
    return "Arrow";
  }

  static createProperties(options) {
    const properties = LineToolTrendLine.createProperties(
      options,
      "linetoolarrow"
    );
    LineToolArrow._configureProperties(properties);
    return properties;
  }
}
