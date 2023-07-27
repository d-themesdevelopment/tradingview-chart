"use strict";

const { SpreadRatioBase, spreadRatioDefaults, spreadRatioPlots, spreadRatioStyles, spreadRatioInputs } = require('path/to/spread-ratio-base-module');

class SpreadStudyItem extends SpreadRatioBase {
  _doCalculation(e, t, i, s) {
    return e * t - i * s;
  }
}

const spreadStudyItem = {
  name: "Spread",
  metainfo: {
    _metainfoVersion: 15,
    defaults: spreadRatioDefaults,
    plots: spreadRatioPlots,
    styles: spreadRatioStyles,
    description: "Spread",
    shortDescription: "Spread",
    is_price_study: false,
    inputs: spreadRatioInputs,
    id: "Spread@tv-basicstudies-1",
    format: {
      type: "price",
      precision: 2
    }
  },
  constructor: SpreadStudyItem
};
