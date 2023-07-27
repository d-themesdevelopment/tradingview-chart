"use strict";

import { StudyValuesProvider } from "./54303";
import { HHistBasedValuesProvider } from "./40484";
import { StudyBaseWindowView } from "./StudyBaseWindowView";

class ValuesProvider {
  constructor(e, t) {
    this._study = e;
    this._model = t;
    this._hhistBasedStudy = !!e.metaInfo().graphics.hhists;
    this._valuesProvider = this._createValuesProvider(e, t);
  }

  getItems() {
    return this._valuesProvider.getItems();
  }

  getValues(e) {
    const values = this._valuesProvider.getValues(e);
    const isVisible = (id) =>
      this._hhistBasedStudy || this._study.isPlotVisibleAt(id, 2);

    for (const value of values) {
      value.visible = value.visible && isVisible(value.id);
    }

    return values;
  }

  _createValuesProvider(e, t) {
    return this._hhistBasedStudy
      ? new HHistBasedValuesProvider(e, t)
      : new StudyValuesProvider(e, t);
  }
}

class StudyDataWindowView extends StudyBaseWindowView {
  _createValuesProvider(e, t) {
    return new ValuesProvider(e, t);
  }
}

export { StudyDataWindowView };
