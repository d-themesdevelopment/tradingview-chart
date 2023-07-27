const { GraphicsCmds, EraseAll } = require('./43945');
const { isNaNable } = require('./isNaNable');
const { isArray } = require('1722');
 
class JStudyDataUpdate {
  constructor(enableCmdDataStudy) {
    super(enableCmdDataStudy);
    this._snapshotPredicate = new SnapshotPredicate();
    this._dataSnapShot = {};
  }

  getData() {
    return this._dataSnapShot;
  }

  getUpdate() {
    return this._isDirty ? this._dataSnapShot : {};
  }

  update(forceUpdate) {
    if (this._dataObj.checkForChangeAndResetChangedState(this._eraseCmds) || forceUpdate) {
      if (this._dataObj.graphicsCmds.create !== null) {
        this._dataObj.graphicsCmds.create.deleteErasedObjs();
        this._dataObj.graphicsCmds.erase = [new EraseAll()];
      }
      this._makeSnapshot();
      this._isDirty = true;
    }
  }

  _makeSnapshot() {
    this._json = this._dataObj.primitiveData(this._snapshotPredicate);
    this._dataSnapShot = {
      json: this._json,
    };
  }
}

class JStudyDataUpdateWithUpdate extends JStudyDataUpdate {
  constructor(enableCmdDataStudy) {
    super(enableCmdDataStudy);
    this._updatePredicate = new UpdatePredicate();
    this._sendShapshotOnly = true;
    this._isFirstNotForcedUpdate = true;
  }

  update(forceUpdate) {
    if (this._dataObj.checkForChangeAndResetChangedState(this._eraseCmds) || forceUpdate) {
      if (this._dataObj.graphicsCmds.create !== null) {
        this._dataObj.graphicsCmds.erase = [new EraseAll()];
      }
      this._dataObj.isUpdate = true;
      this._makeSnapshot();
      if (this._dataObj.graphicsCmds.create !== null) {
        this._dataObj.graphicsCmds.erase = this._eraseCmds;
      }
      this._dataObj.isUpdate = true;
      this._jsonUpdate = this._dataObj.primitiveData(this._updatePredicate);
      if (this._dataObj.graphicsCmds.create !== null) {
        this._dataObj.graphicsCmds.create.deleteErasedAndMarkPostedObjs();
      }
      this._sendShapshotOnly = forceUpdate || this._isFirstNotForcedUpdate;
      this._isFirstNotForcedUpdate = Boolean(forceUpdate);
      this._isDirty = true;
    }
  }

  getUpdate() {
    if (this._isDirty) {
      if (this._enableCmdDataStudy) {
        return {
          json: this._sendShapshotOnly ? this._json : undefined,
          jsonUpdate: this._sendShapshotOnly ? undefined : this._jsonUpdate,
        };
      } else {
        return {
          json: this._json,
          jsonUpdate: this._sendShapshotOnly ? undefined : this._jsonUpdate,
        };
      }
    } else {
      return {};
    }
  }
}

class SnapshotPredicate {
  isIgnoredObj(data, prop) {
    return this.isIgnoredObjDefault(data) || this.isIgnoredObjErased(data);
  }

  static isIgnoredObjDefault(data) {
    return isIgnoredObjNaNable(data) || isIgnoredObjErased(data);
  }

  static isIgnoredObjErased(data) {
    return isPosted(data) && data.isErased();
  }
}

class UpdatePredicate {
  isIgnoredObj(data, prop) {
    return this.isIgnoredObjDefault(data) || this.isIgnoredObjErased(data) || this.isIgnoredObjPosted(data);
  }

  static isIgnoredObjDefault(data, prop) {
    return isIgnoredObjNaNable(data) || isIgnoredObjErased(data) || isIgnoredObjPosted(data);
  }

  static isIgnoredObjErased(data) {
    return isPosted(data) && data.isErased();
  }

  static isIgnoredObjPosted(data) {
    return isPosted(data) && data.isPosted();
  }
}

function isPosted(data) {
  return Boolean(data.isPosted);
}

function isIgnoredObjNaNable(data) {
  return isNaNable(data) && data.isNaN();
}

function isIgnoredObjListOfNaNables(data) {
  if (!isArray(data)) {
    return false;
  }
  let result = true;
  for (const item of data) {
    if (!isNaNable(item) || !item.isNaN()) {
      result = false;
      break;
    }
  }
  return result;
}

class DataObj {
  constructor() {
    this.isUpdate = false;
    this.graphicsCmds = new GraphicsCmds();
    this._offsetsChanged = false;
    this._disableGraphicsAndData = false;
  }

  isNaN() {
    return this.graphicsCmds.isNaN();
  }

  primitiveData(data) {
    const result = {};
    if (!this._disableGraphicsAndData) {
      const graphicsCmds = this.graphicsCmds.primitiveData(data);
      if (graphicsCmds !== null) {
        result.graphicsCmds = graphicsCmds;
      }
    }
    if (this.isUpdate) {
      result.isUpdate = true;
    }
    return result.hasOwnProperty('graphicsCmds') ? result : undefined;
  }

  disable() {
    this._disableGraphicsAndData = true;
  }

  checkForChangeAndResetChangedState(data) {
    const offsetsChanged = this._offsetsChanged;
    const isModified = this.graphicsCmds.isModified();
    this.graphicsCmds.setModified(false);
    this._offsetsChanged = false;
    return isModified || offsetsChanged || data.length !== 0;
  }
}

module.exports = {
  JStudyDataUpdate,
};