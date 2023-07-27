import { LineToolTrendLine } from './47246.js';

class LineToolExtended extends LineToolTrendLine {
  constructor(model, chartApi, series, properties) {
    super(model, chartApi, series, properties || LineToolExtended.createProperties());
  }

  name() {
    return 'Extended Line';
  }

  static createProperties(defaults) {
    const properties = LineToolTrendLine.createProperties(defaults, 'linetoolextended');
    LineToolExtended._configureProperties(properties);
    return properties;
  }
}

export { LineToolExtended };
