"use strict";

import { TranslatedString, t } from "translated-string-module"; // ! not correct
import { LineDataSource } from "./13087";
import {
  LevelsProperty,
  LineToolWidthsProperty,
  LineToolColorsProperty,
} from "./53801";

import { LineToolWidthsProperty, LineToolColorsProperty } from "./68806";

const eraseLevelLineLabel = new TranslatedString(
  "erase level line",
  t(null, void 0, 12962)
);

class LineToolFibCircles extends LineDataSource {
  constructor(e, t, s, r) {
    super(e, t || LineToolFibCircles.createProperties(), s, r);
    import(1583).then((i) => {
      const { FibCirclesPaneView } = i;
      this._setPaneViews([new FibCirclesPaneView(this, this._model)]);
    });
  }

  levelsCount() {
    return LineToolFibCircles.LevelsCount;
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Fib Circles";
  }

  processErase(e, t) {
    const levelKey = "level" + t;
    const visible = this.properties()[levelKey].visible;
    e.setProperty(visible, false, eraseLevelLineLabel);
  }

  static createProperties(e) {
    const levels = new LevelsProperty("linetoolfibcircles", e, false, {
      range: [1, 11],
    });
    LineToolFibCircles._configureProperties(levels);
    return levels;
  }

  async _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537),
    ]).then((i) => i[0].FibCirclesDefinitionsViewModel);
  }

  _snapTo45DegreesAvailable() {
    return true;
  }

  static _configureProperties(levels) {
    super._configureProperties(levels);

    const lineProperties = [];
    const colorProperties = [];

    lineProperties.push(levels.child("trendline").child("linewidth"));
    colorProperties.push(levels.child("trendline").child("color"));

    for (let level = 1; level <= LineToolFibCircles.LevelsCount; level++) {
      lineProperties.push(levels.child("level" + level).child("linewidth"));
      colorProperties.push(levels.child("level" + level).child("color"));
    }

    levels.addChild("linesColors", new LineToolColorsProperty(colorProperties));
    levels.addChild("linesWidths", new LineToolWidthsProperty(lineProperties));
  }
}

LineToolFibCircles.LevelsCount = 11;

export { LineToolFibCircles };
