import { SpreadRatioBase } from "./87302";

import {
  spreadRatioDefaults,
  spreadRatioStyles,
  spreadRatioInputs,
  spreadRatioPlots,
} from "./87302";

class SpreadStudyItem extends SpreadRatioBase {
  _doCalculation(a, b, c, d) {
    return a * b - c * d;
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
      precision: 2,
    },
  },
  constructor: SpreadStudyItem,
};
