import { UndoCommand } from "some-module"; // ! Did not find Module
import { saveDefaultProperties } from "./46100";
import { viewportChangeEvent } from "./28558";

class SetScaleRatioPropertiesCommand extends UndoCommand {
  constructor(property, newValue, timestamp, model) {
    super(timestamp);
    this._property = property;
    this._newValue = newValue;
    this._model = model;
    this._priceScale = this._model.mainSeries().priceScale();
    this._oldValue = this._property.value();
    this._oldMode = this._priceScale.mode();
  }

  redo() {
    this._oldValue = this._property.value();
    this._oldMode = this._priceScale.mode();
    saveDefaultProperties(true);
    this._priceScale.setMode({
      autoScale: false,
      percentage: false,
      log: false,
    });
    this._property.setValue(this._newValue);
    saveDefaultProperties(false);
    this._model.recalculateAllPanes(viewportChangeEvent());
    this._model.lightUpdate();
  }

  undo() {
    saveDefaultProperties(true);
    this._property.setValue(this._oldValue);
    this._priceScale.setMode(this._oldMode);
    saveDefaultProperties(false);
    this._model.recalculateAllPanes(viewportChangeEvent());
    this._model.lightUpdate();
  }
}

export { SetScaleRatioPropertiesCommand };
