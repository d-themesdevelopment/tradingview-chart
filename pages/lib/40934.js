import { LineToolTrendLine, createProperties } from 'some-library';

class LineToolExtended extends LineToolTrendLine {
  constructor(model, chartApi, series, properties) {
    super(model, chartApi, series, properties || LineToolExtended.createProperties());
  }

  name() {
    return 'Extended Line';
  }

  static createProperties(defaults) {
    const properties = createProperties(defaults, 'linetoolextended');
    LineToolExtended._configureProperties(properties);
    return properties;
  }
}

export { LineToolExtended };
