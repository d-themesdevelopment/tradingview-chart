import { isFunction } from 'some-library'; // Replace 'some-library' with the actual library you're using

class CustomData {
  constructor(data) {
    this._listeners = new ListenerRegistry();
    this._childs = [];
    this._muteChildChanges = false;

    if (data !== undefined) {
      if (this.isPrimitiveType(data)) {
        this._value = data;
      } else {
        for (let key in data) {
          this.addProperty(key, data[key]);
        }
      }
    }
  }

  merge(data, trackChanges) {
    let changedItems = null;
    if (trackChanges) {
      changedItems = [];
    }

    if (data === undefined) {
      return changedItems;
    }

    if (this.isPrimitiveType(data)) {
      if (trackChanges && this._value !== data) {
        changedItems.push(this);
      }
      this._value = data;
      return changedItems;
    }

    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        if (this[i]) {
          const childChanges = this[i].merge(data[i], trackChanges);
          if (trackChanges) {
            changedItems = changedItems.concat(childChanges);
          }
        } else {
          this.addProperty(i, data[i]);
          if (trackChanges) {
            changedItems.push(this[i]);
          }
        }
      }
    } else {
      for (let key in data) {
        if (this[key]) {
          const childChanges = this[key].merge(data[key], trackChanges);
          if (trackChanges && childChanges !== undefined) {
            changedItems = changedItems.concat(childChanges);
          }
        } else {
          this.addProperty(key, data[key]);
          if (trackChanges) {
            changedItems.push(this[key]);
          }
        }
      }
    }

    if (trackChanges && changedItems.length > 0) {
      changedItems.push(this);
    }

    return changedItems;
  }

  mergeAndFire(data) {
    const changedItems = this.merge(data, true);

    this._muteChildChanges = true;

    changedItems.forEach((item) => {
      item._muteChildChanges = true;
    });

    changedItems.forEach((item) => {
      item._muteChildChanges = false;
      item.listeners().fire(item);
    });

    this._muteChildChanges = false;

    if (changedItems.length > 0) {
      this.listeners().fire(this);
    }
  }

  state(excluded) {
    const value = isFunction(this.value) ? this.value() : undefined;
    if (value === undefined) {
      return {};
    }

    const state = {};

    for (let i = 0; i < this._childs.length; i++) {
      const childKey = this._childs[i];

      if (excluded && excluded.indexOf(childKey) !== -1) {
        continue;
      }

      let childState;

      if (excluded) {
        const filteredExcluded = excluded.filter((key) => key.startsWith(childKey + '.'));
        childState = this[childKey].state(filteredExcluded);
      } else {
        childState = this[childKey].state();
      }

      if (childState !== undefined || this[childKey].storeStateIfUndefined()) {
        state[childKey] = childState;
      }
    }

    return state;
  }

  storeStateIfUndefined() {
    return true;
  }

  clone(excluded) {
    return new CustomData(this.state(excluded));
  }

  isPrimitiveType(value) {
    return value === null || isNumber(value) || typeof value === 'string' || typeof value === 'boolean';
  }

  value() {
    return this._value;
  }

  listeners() {
    return this._listeners;
  }

  childCount() {
    return this._childs.length;
  }

  childNames() {
    return this._childs;
  }

  child(name) {
    return this[name];
  }

  setValue(value, trackChanges) {
    if (this._value !== value || trackChanges) {
      this._value = value;
      this._listeners.fire(this);
    }
  }

  setValueSilently(value) {
    this._value = value;
  }

  addProperty(name, value) {
    const child = new CustomData(value);
    this[name] = child;
    this._childs.push(name);
    child.subscribe(this, this.childChanged);
  }

  removeProperty(name) {
    this[name].unsubscribe(this, this.childChanged);
    delete this[name];
    this._childs = this._childs.filter((child) => child !== name);
  }

  hasChild(name) {
    return this._childs.indexOf(name) >= 0;
  }

  addChild(name, child) {
    if (this[name]) {
      this[name].unsubscribe(this, this.childChanged);
    }

    this[name] = child;

    if (this._childs.indexOf(name) === -1) {
      this._childs.push(name);
    }

    child.subscribe(this, this.childChanged);
  }

  childChanged(child, data) {
    if (!this._muteChildChanges) {
      this.listeners().fire(this);
    }
  }

  subscribe(observer, callback) {
    this.listeners().subscribe(observer, callback, false);
  }

  unsubscribe(observer, callback) {
    this.listeners().unsubscribe(observer, callback);
  }

  unsubscribeAll(observer) {
    this.listeners().unsubscribeAll(observer);
  }

  childs() {
    return this;
  }
}

export default CustomData;
