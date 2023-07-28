"use strict";

export class EraseObj {
  constructor(id, type) {
    this.id = id;
    this.type = type;
  }

  primitiveData() {
    return {
      action: "one",
      id: this.id,
      type: this.type,
    };
  }
}

export class EraseAll {
  primitiveData() {
    return {
      action: "all",
    };
  }
}

export class GraphicsCmds {
  constructor() {
    this.erase = [];
    this.create = null;
    this._modified = false;
  }

  primitiveData(e) {
    if (this.isNaN()) return null;
    const t = {};
    const i = this.create && this.create.primitiveData(e);
    if (i !== null) {
      t.create = i;
    }
    if (this.erase !== null && this.erase.length > 0) {
      t.erase = this.erase.map((e) => e.primitiveData());
    }
    if (t.create === undefined && t.erase === undefined) {
      return null;
    }
    return t;
  }

  setCreate(e) {
    this.create = e;
    this.create.forEachList((e) => e.setOwner(this));
  }

  isNaN() {
    return (
      (this.erase === null || this.erase.length === 0) && this.create === null
    );
  }

  isModified() {
    return this._modified;
  }

  setModified(e) {
    this._modified = e;
  }

  dirty() {
    this._modified = true;
  }

  setOwner(e) {
    throw new Error("Unsupported");
  }
}
