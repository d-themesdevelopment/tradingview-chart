

"use strict";
import { LineToolTrendLine } from "./47246.js";

class LineToolInfoLine extends LineToolTrendLine {
  constructor(id, properties, model, options) {
    super(id, properties || LineToolInfoLine.createProperties(), model, options);
  }
  
  pointsCount() {
    return 2;
  }
  
  name() {
    return "Info Line";
  }
  
  static createProperties(id) {
    const properties = LineToolTrendLine.createProperties(id, "linetoolinfoline");
    LineToolInfoLine._configureProperties(properties);
    return properties;
  }
}

