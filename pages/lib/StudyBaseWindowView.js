




import { StudyBaseWindowView } from '<path_to_StudyBaseWindowView_module>';
import { DataWindowView } from '<path_to_DataWindowView_module>';

class StudyBaseWindowView extends DataWindowView {
  constructor(study, model) {
    super();
    this._invalidated = true;
    this._study = study;
    this._model = model;
    this._valueProvider = this._createValuesProvider(study, model);
    this._items = this._valueProvider.getItems().map((item) => new DataWindowItem(item.id, item.title, ""));
    this.update();
  }

  update() {
    this._invalidated = true;
  }

  items() {
    if (this._invalidated) {
      this._updateImpl();
      this._invalidated = false;
    }
    return this._items;
  }

  study() {
    return this._study;
  }

  _updateImpl() {
    this._header = this._study.title(true);
    this._title = this._study.title();
    const values = this._valueProvider.getValues(this._currentIndex());
    for (let i = 0; i < values.length; ++i) {
      const value = values[i];
      const item = this._items[i];
      item.setValue(value.value);
      item.setVisible(value.visible);
      item.setColor(value.color);
      item.setTitle(value.title);
    }
  }

  _currentIndex() {
    const appliedIndex = this._model.crossHairSource().appliedIndex();
    return isNaN(appliedIndex) ? null : appliedIndex;
  }
}

export { StudyBaseWindowView };