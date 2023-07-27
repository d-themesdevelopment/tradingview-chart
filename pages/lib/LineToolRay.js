
const { LineToolTrendLine } = require(47246);

class LineToolRay extends LineToolTrendLine {
  constructor(chartModel, properties, options, inputObject) {
    super(chartModel, properties || LineToolRay.createProperties(), options, inputObject);
  }

  name() {
    return "Ray";
  }

  static createProperties() {
    const properties = LineToolTrendLine.createProperties("linetoolray");
    LineToolRay._configureProperties(properties);
    return properties;
  }
}

module.exports = {
  LineToolRay,
};

