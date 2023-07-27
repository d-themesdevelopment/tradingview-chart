
import { SpreadRatioBase } from './87302.js';

class ratioStudyItemCalc extends SpreadRatioBase {
    _doCalculation(v1, v2, v3, v4) {
      return (v1 * v2) / (v3 * v4);
    }
  }
  const ratioStudyItem = {
    name: "Ratio",
    metainfo: {
        _metainfoVersion: 15,
        defaults: s.spreadRatioDefaults,
        plots: s.spreadRatioPlots,
        styles: s.spreadRatioStyles,
        description: "Ratio",
        shortDescription: "Ratio",
        is_price_study: !1,
        inputs: s.spreadRatioInputs,
        id: "Ratio@tv-basicstudies-1",
        format: {
            type: "price",
            precision: 2
        }
    },
    constructor: r
}
  export { ratioStudyItem };