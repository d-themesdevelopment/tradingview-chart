

import { Std } from '74649';

class GraphicsObj {
  constructor(gen) {
    this._mixinJSONObject = new FieldMixin(this);
    this._state = 0;
    this._owner = null;
    this._gen = gen;
    this._id = gen.nextGraphicsObjId();
    this._id2 = this._mixinJSONObject.createField(this.id(), 'id');
  }

  dirty() {
    if (this._owner !== null) {
      this._owner.dirty();
    }
  }

  setOwner(owner) {
    this._owner = owner;
  }

  id() {
    return this._id;
  }

  unsetOwner(owner) {
    if (this._owner === owner) {
      this._owner = null;
    }
  }

  state() {
    return this._state;
  }

  erase() {
    if (this._state === 1) {
      this._gen.pushEraseObjCmd(this._id, this.jsonName());
    }
    this._state = 2;
    this.dirty();
  }

  markAsPosted() {
    if (this._state !== 1) {
      this._state = 1;
      this.dirty();
    }
  }

  isErased() {
    return this._state === 2;
  }

  isPosted() {
    return this._state === 1;
  }

  isNaN() {
    return false;
  }

  _processObjUpdate() {
    if (this._state === 1) {
      this._gen.pushEraseObjCmd(this._id, this.jsonName());
      this._id = this._gen.nextGraphicsObjId();
      this._id2.set(this._id);
      this._state = 0;
    }
    this.dirty();
  }
}

class FieldMixin {
  constructor(owner) {
    this._owner = owner;
  }

  createField(value, name) {
    return new Field(value, name, this._owner);
  }

  createDoubleField(value, name) {
    return new Field(value, name, this._owner, (a, b) => !Std.equal(a, b));
  }

  createDoubleArrayField(value, name) {
    return new DoubleArrayField(value, name, this._owner, (a, b) => {
      if (a === b) return false;
      const length = a.length;
      if (b.length !== length) return true;
      for (let i = 0; i < length; i++) {
        if (!Std.equal(a[i], b[i])) return true;
      }
      return false;
    });
  }

  createTimeField(value, name) {
    return new TimeField(value, name, this._owner);
  }

  dirty() {
    if (this._owner !== null) {
      this._owner.dirty();
    }
  }

  setOwner(owner) {
    this._owner = owner;
  }
}

class Field {
  constructor(value, name, owner, comparer = (a, b) => (a == null ? b != null : a === b)) {
    this._value = value;
    this._name = name;
    this._owner = owner;
    this._comparer = comparer;
  }

  getName() {
    return this._name;
  }

  set(value) {
    const isEqual = this._comparer(this._value, value);
    if (isEqual) {
      this._owner.dirty();
    }
    this._value = value;
    return isEqual;
  }

  get() {
    return this._value;
  }
}

class DoubleArrayField extends Field {
  constructor(value, name, owner, comparer = (a, b) => {
    if (a === b) return false;
    const length = a.length;
    if (b.length !== length) return true;
    for (let i = 0; i < length; i++) {
      if (!Std.equal(a[i], b[i])) return true;
    }
    return false;
  }) {
    super(value, name, owner, comparer);
  }
}

class TimeField extends Field {
  constructor(value, name, owner) {
    super(value, name, owner);
  }

  set(value) {
    if (this._value !== value) {
      this._value = value;
      if (this._owner !== null) {
        this._owner.dirty();
      }
      return true;
    }
    return false;
  }
}

export { GraphicsObj };