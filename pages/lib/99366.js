"use strict";

// const LineToolElliott = {
//   LineToolElliott: () => u,
//   LineToolElliottCorrection: () => w,
//   LineToolElliottDoubleCombo: () => C,
//   LineToolElliottImpulse: () => m,
//   LineToolElliottTriangle: () => f,
//   LineToolElliottTripleCombo: () => S,
// };

import { TranslatedString } from "./TranslatedString";
import { LineDataSource } from "./13087";
import { Action } from "./39347";
import { DefaultProperty } from "./46100";
import { LineToolColorsProperty } from "./68806";

const degreeOptions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const changeDegreeTranslation = new TranslatedString(
  "change Elliott degree",
  t(null, void 0, "./76020")
);

const degreeLabels = [
  { value: 0, title: t(null, void 0, "./33820") },
  { value: 1, title: t(null, void 0, "./58397") },
  { value: 2, title: t(null, void 0, "./9753") },
  { value: 3, title: t(null, void 0, "./18367") },
  { value: 4, title: t(null, void 0, "./91889") },
  { value: 5, title: t(null, void 0, "./95176") },
  { value: 6, title: t(null, void 0, "./48404") },
  { value: 7, title: t(null, void 0, "./71778") },
  { value: 8, title: t(null, { context: "wave" }, "./66051") },
  { value: 9, title: t(null, { context: "wave" }, "./86054") },
  { value: 10, title: t(null, void 0, "./85884") },
  { value: 11, title: t(null, void 0, "./71722") },
  { value: 12, title: t(null, void 0, "./10931") },
  { value: 13, title: t(null, void 0, "./29662") },
  { value: 14, title: t(null, void 0, "./9632") },
];

class ElliottLineTool extends LineDataSource {
  constructor(e, t, s, r) {
    super(e, t || ElliottLineTool.createProperties(), s, r);
    this.version = 4;
    import(14417).then((e) => {
      this._setPaneViews([new e.ElliottLabelsPaneView(this, this._model)]);
    });
  }

  migrateVersion(e, t, i) {
    if (i.properties.hasChild("background")) {
      i.properties.removeProperty("background");
    }
    if (i.properties.hasChild("backgroundColor")) {
      i.properties.removeProperty("backgroundColor");
    }
    if (i.properties.hasChild("showBackground")) {
      i.properties.removeProperty("showBackground");
    }
    if (e === 1) {
      const e = Object.assign({}, this._timePoint[0]);
      this._timePoint.unshift(e);
      if (this._points.length > 0) {
        const e = Object.assign({}, this._points[0]);
        this._points.unshift(e);
      }
    }
  }

  applyTemplate(e) {
    const t = e;
    delete t.background;
    delete t.backgroundColor;
    delete t.showBackground;
    super.applyTemplate(e);
  }

  name() {
    return "Elliott Labels";
  }

  additionalActions(e) {
    return [
      new Action({
        actionId: "Chart.LineTool.Elliot.ChangeDegreeProperty",
        label: t(null, void 0, "./69479"),
        subItems: degreeOptions.map((t) => {
          const degree = degreeLabels.filter((e) => e.value === t)[0];
          return new Action({
            actionId: "Chart.LineTool.Elliot.ChangeDegreeProperty",
            label: degree.title,
            checkable: true,
            checked: this.properties().childs().degree.value() === t,
            onExecute: () => {
              e.setProperty(
                this.properties().childs().degree,
                t,
                changeDegreeTranslation
              );
            },
          });
        }),
      }),
    ];
  }

  label(e) {
    const degreeIndex =
      degreeOptions.length - this.properties().childs().degree.value() - 1;
    const groupIndex = Math.floor(degreeIndex / 3);
    return {
      group: groupIndex,
      bold: !!(groupIndex % 2),
      decoration: ["", "brackets", "circle"][degreeIndex % 3],
      label: this.labelsGroup()[groupIndex][e],
    };
  }

  availableDegreesValues() {
    return degreeLabels;
  }

  static createProperties(e) {
    const properties = new DefaultProperty("linetoolelliott", e);
    return this._configureProperties(properties), properties;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.childs().color])
    );
    properties.addExclusion("linesColors");
  }
}

class ElliottImpulseLineTool extends ElliottLineTool {
  constructor(e, t, i, s) {
    super(e, t || ElliottImpulseLineTool.createProperties(), i, s);
  }

  name() {
    return "Elliott Impulse Wave (12345)";
  }

  labelsGroup() {
    return [
      ["0", "1", "2", "3", "4", "5"],
      ["0", "i", "ii", "iii", "iv", "v"],
      ["0", "1", "2", "3", "4", "5"],
      ["0", "I", "II", "III", "IV", "V"],
      ["0", "1", "2", "3", "4", "5"],
    ];
  }

  static createProperties(e) {
    const properties = new DefaultProperty("linetoolelliottimpulse", e);
    return this._configureProperties(properties), properties;
  }
}

class ElliottTriangleLineTool extends ElliottLineTool {
  constructor(e, t, i, s) {
    super(e, t || ElliottTriangleLineTool.createProperties(), i, s);
  }

  name() {
    return "Elliott Triangle Wave (ABCDE)";
  }

  labelsGroup() {
    return [
      ["0", "A", "B", "C", "D", "E"],
      ["0", "a", "b", "c", "d", "e"],
      ["0", "A", "B", "C", "D", "E"],
      ["0", "a", "b", "c", "d", "e"],
      ["0", "A", "B", "C", "D", "E"],
    ];
  }

  static createProperties(e) {
    const properties = new DefaultProperty("linetoolelliotttriangle", e);
    return this._configureProperties(properties), properties;
  }
}

class ElliottTripleComboLineTool extends ElliottLineTool {
  constructor(e, t, i, s) {
    super(e, t || ElliottTripleComboLineTool.createProperties(), i, s);
  }

  name() {
    return "Elliott Triple Combo Wave (WXYXZ)";
  }

  labelsGroup() {
    return [
      ["0", "W", "X", "Y", "X", "Z"],
      ["0", "w", "x", "y", "x", "z"],
      ["0", "W", "X", "Y", "X", "Z"],
      ["0", "w", "x", "y", "x", "z"],
      ["0", "W", "X", "Y", "X", "Z"],
    ];
  }

  static createProperties(e) {
    const properties = new DefaultProperty("linetoolelliotttriplecombo", e);
    return this._configureProperties(properties), properties;
  }
}

class ElliottCorrectionLineTool extends ElliottLineTool {
  constructor(e, t, i, s) {
    super(e, t || ElliottCorrectionLineTool.createProperties(), i, s);
  }

  name() {
    return "Elliott Correction Wave (ABC)";
  }

  labelsGroup() {
    return [
      ["0", "A", "B", "C"],
      ["0", "a", "b", "c"],
      ["0", "A", "B", "C"],
      ["0", "a", "b", "c"],
      ["0", "A", "B", "C"],
    ];
  }

  static createProperties(e) {
    const properties = new DefaultProperty("linetoolelliottcorrection", e);
    return this._configureProperties(properties), properties;
  }
}

class ElliottDoubleComboLineTool extends ElliottLineTool {
  constructor(e, t, i, s) {
    super(e, t || ElliottDoubleComboLineTool.createProperties(), i, s);
  }

  name() {
    return "Elliott Double Combo Wave (WXY)";
  }

  labelsGroup() {
    return [
      ["0", "W", "X", "Y"],
      ["0", "w", "x", "y"],
      ["0", "W", "X", "Y"],
      ["0", "w", "x", "y"],
      ["0", "W", "X", "Y"],
    ];
  }

  static createProperties(e) {
    const properties = new DefaultProperty("linetoolelliottdoublecombo", e);
    return this._configureProperties(properties), properties;
  }
}

module.exports = {
  LineToolElliott,
  ElliottLineTool,
  ElliottImpulseLineTool,
  ElliottTriangleLineTool,
  ElliottTripleComboLineTool,
  ElliottCorrectionLineTool,
  ElliottDoubleComboLineTool,
};
