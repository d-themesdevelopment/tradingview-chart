

"use strict";

function getDataSourceById(model, id) {
  const dataSource = model.dataSourceForId(id);
  if (dataSource === null) {
    throw new Error(`Chart has no study or shape with id "${id}"`);
  }
  return dataSource;
}

class SelectionApi {
  constructor(model) {
    this._model = model;
  }

  add(ids) {
    if (Array.isArray(ids)) {
      this._model.selectionMacro((selection => {
        ids.map(id => getDataSourceById(this._model, id)).forEach(dataSource => {
          selection.addSourceToSelection(dataSource);
        });
      }));
    } else {
      this.add([ids]);
    }
  }

  canBeAddedToSelection(id) {
    const dataSource = getDataSourceById(this._model, id);
    return this._model.selection().canBeAddedToSelection(dataSource);
  }

  set(ids) {
    if (Array.isArray(ids)) {
      this._model.selectionMacro((selection => {
        selection.clearSelection();
        ids.map(id => getDataSourceById(this._model, id)).forEach(dataSource => {
          selection.addSourceToSelection(dataSource);
        });
      }));
    } else {
      this.set([ids]);
    }
  }

  remove(ids) {
    if (Array.isArray(ids)) {
      this._model.selectionMacro((selection => {
        ids.map(id => getDataSourceById(this._model, id)).forEach(dataSource => {
          selection.removeSourceFromSelection(dataSource);
        });
      }));
    } else {
      this.remove([ids]);
    }
  }

  contains(id) {
    const dataSource = getDataSourceById(this._model, id);
    return this._model.selection().isSelected(dataSource);
  }

  allSources() {
    return this._model.selection().dataSources().map(dataSource => dataSource.id());
  }

  isEmpty() {
    return this._model.selection().isEmpty();
  }

  clear() {
    this._model.selectionMacro((selection => {
      selection.clearSelection();
    }));
  }

  onChanged() {
    return this._model.onSelectedSourceChanged();
  }
}