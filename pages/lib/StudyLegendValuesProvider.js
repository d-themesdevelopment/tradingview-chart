import { StudyValuesProvider } from "some-library"; // Replace 'some-library' with the actual library you're using
import { HHistBasedValuesProvider } from "some-library"; // Replace 'some-library' with the actual library you're using

class StudyLegendValuesProvider {
  constructor(study, model) {
    this._study = study;
    this._model = model;
    this._showStudyValues = model
      .properties()
      .childs()
      .paneProperties.childs()
      .legendProperties.childs().showStudyValues;
    this._hhistBasedStudy =
      typeof study.metaInfo().graphics.hhists !== "undefined";
    this._valuesProvider = this._createValuesProvider(study, model);
  }

  getItems() {
    return this._valuesProvider.getItems();
  }

  getValues(id) {
    const values = this._valuesProvider.getValues(id);
    const studyProperties = this._study.properties();
    const showStudyValues =
      this._showStudyValues.value() &&
      studyProperties.childs().showLegendValues.value();
    const isVisible = (id) => {
      return this._hhistBasedStudy || this._study.isPlotVisibleAt(id, 8);
    };

    for (const value of values) {
      value.visible = value.visible && showStudyValues && isVisible(value.id);
    }

    return values;
  }

  _createValuesProvider(study, model) {
    if (this._hhistBasedStudy) {
      return new HHistBasedValuesProvider(study, model);
    } else {
      return new StudyValuesProvider(study, model);
    }
  }
}

export default StudyLegendValuesProvider;
