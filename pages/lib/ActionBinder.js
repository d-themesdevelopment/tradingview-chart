class ActionBinder {
    constructor(action, property, undoModel, undoText, onExecuteCallback = null) {
      this._property = property;
      this._undoModel = undoModel;
      this._undoText = undoText;
      this._action = action;
  
      this.setValue(property.value());
      property.subscribe(this, this._propertyChanged);
  
      if (onExecuteCallback !== null) {
        action.update({
          onExecute: onExecuteCallback.bind(this)
        });
      } else {
        action.update({
          onExecute: this._onActionCallback.bind(this)
        });
      }
    }
  
    destroy() {
      this._property.unsubscribe(this, this._propertyChanged);
    }
  
    value() {
      return this._action.isChecked();
    }
  
    setValue(value) {
      this._action.update({
        checked: Boolean(value)
      });
    }
  
    _onActionCallback() {
      this._undoModel.setProperty(this._property, this.value(), this._undoText);
    }
  
    _propertyChanged(property) {
      this.setValue(property.value());
    }
  }
  
  export { ActionBinder };