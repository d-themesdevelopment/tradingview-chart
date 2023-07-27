
"use strict";

const utils = (e, t, i) => {
  i.r(t);
  i.d(t, {
    LineToolProjection: () => LineToolProjection,
  });

  const LevelsProperty = i(53801).LevelsProperty;
  const LineToolFibWedgeBase = i(37122).LineToolFibWedgeBase;
  const LineToolColorsProperty = i(68806).LineToolColorsProperty;

  class LineToolProjection extends LineToolFibWedgeBase {
    constructor(e, t, i, s) {
      super(e, t || LineToolProjection.createProperties(), i, s);
      i.e(1583)
        .then(i.t.bind(i, 75219, 19))
        .then(({ ProjectionLinePaneView }) => {
          this._setPaneViews([new ProjectionLinePaneView(this, this._model)]);
        });
    }

    levelsCount() {
      return 1;
    }

    name() {
      return "Projection";
    }

    async _getPropertyDefinitionsViewModelClass() {
      return Promise.all([
        i.e(7201),
        i.e(3753),
        i.e(5871),
        i.e(8167),
        i.e(8537),
      ]).then(i.bind(i, 12501)).ProjectionDefinitionsViewModel;
    }

    static createProperties(e) {
      const linetoolprojection = new LevelsProperty("linetoolprojection", e, false, { range: [1, 1] });
      this._configureProperties(linetoolprojection);
      return linetoolprojection;
    }

    static _configureProperties(e) {
      super._configureProperties(e);
      e.addChild("linesColors", new LineToolColorsProperty([e.trendline.color]));
    }
  }

  return {
    LineToolProjection,
  };
};
