"use strict";

const TranslatedString = require(36298).TranslatedString;
const LineToolFibWedgeBase = require(37122).LineToolFibWedgeBase;
const LevelsProperty = require(53801).LevelsProperty;
const { LineToolWidthsProperty, LineToolColorsProperty } = require(68806);

const eraseLevelLineText = new TranslatedString(
  "erase level line",
  require(44352).t(null, undefined, require(12962))
);

export class LineToolFibWedge extends LineToolFibWedgeBase {
  constructor(model, properties, options, priceScale) {
    super(
      model,
      properties || LineToolFibWedge.createProperties(),
      options,
      priceScale
    );

    require(1583)
      .then(require.t.bind(require, 60322, 19))
      .then(({ FibWedgePaneView }) => {
        this._setPaneViews([new FibWedgePaneView(this, this._model)]);
      });
  }

  isSynchronizable() {
    return false;
  }

  levelsCount() {
    return LineToolFibWedge.LevelsCount;
  }

  name() {
    return "Fib Wedge";
  }

  processErase(target, level) {
    const propertyName = `level${level}`;
    const visibleProperty = this.properties()[propertyName].visible;
    target.setProperty(visibleProperty, false, eraseLevelLineText);
  }

  static createProperties(index) {
    const properties = new LevelsProperty("linetoolfibwedge", index, false, {
      range: [1, 11],
    });
    this._configureProperties(properties);
    return properties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const viewModels = await Promise.all([
      require.e(7201),
      require.e(3753),
      require.e(5871),
      require.e(8167),
      require.e(8537),
    ]).then(require.bind(require, 89478));
    return viewModels.FibWedgeDefinitionsViewModel;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);

    const lineWidthProperties = [
      properties.child("trendline").child("linewidth"),
    ];
    const lineColorProperties = [properties.child("trendline").child("color")];

    for (let level = 1; level <= this.LevelsCount; level++) {
      const levelLineWidthProperty = properties
        .child(`level${level}`)
        .child("linewidth");
      const levelLineColorProperty = properties
        .child(`level${level}`)
        .child("color");
      lineWidthProperties.push(levelLineWidthProperty);
      lineColorProperties.push(levelLineColorProperty);
    }

    properties.addChild(
      "linesColors",
      new LineToolColorsProperty(lineColorProperties)
    );
    properties.addChild(
      "linesWidths",
      new LineToolWidthsProperty(lineWidthProperties)
    );
  }
}

LineToolFibWedge.LevelsCount = 11;

module.exports = LineToolFibWedge;
