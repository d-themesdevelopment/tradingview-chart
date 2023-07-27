
const Logger = require('./someModule').getLogger('Common.WatchedValue');

class WatchedValue {
  constructor(initialValue) {
    if (!(this instanceof WatchedValue)) {
      return new WatchedValue(initialValue);
    }
    if (arguments.length > 0) {
      this._value = initialValue;
    }
    this._listeners = [];
  }

  value() {
    return this._owner ? this._owner._value : this._value;
  }

  setValue(newValue, callHook = true) {
    const owner = this._owner ? this._owner : this;
    if (typeof owner.hook === 'function' && callHook) {
      newValue = owner.hook(newValue);
    }
    if (owner.writeLock) {
      return owner._value;
    }
    const isValueUnchanged = owner._value === newValue || (Number.isNaN(owner._value) && Number.isNaN(newValue));
    if (!callHook && isValueUnchanged && owner.hasOwnProperty('_value')) {
      return newValue;
    }
    owner._value = newValue;
    const listeners = owner._listeners.slice();
    let removeCount = 0;
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i].once) {
        owner._listeners.splice(i - removeCount, 1);
        removeCount++;
      }
      try {
        listeners[i].cb(newValue);
      } catch (error) {
        Logger.logError(error.stack || error.message);
      }
    }
    return newValue;
  }

  deleteValue() {
    const owner = this._owner ? this._owner : this;
    if (owner.hasOwnProperty('_value')) {
      if (owner.writeLock) {
        return owner._value;
      }
      delete owner._value;
      const listeners = owner._listeners.slice();
      let removeCount = 0;
      for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].once) {
          owner._listeners.splice(i - removeCount, 1);
          removeCount++;
        }
        try {
          listeners[i].cb();
        } catch (error) {
          Logger.logError(error.stack || error.message);
        }
      }
    }
  }

  subscribe(callback, options) {
    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }
    const isOnce = options && options.once;
    const callWithLast = options && options.callWithLast;
    const owner = this._owner ? this._owner : this;
    if (callWithLast && owner.hasOwnProperty('_value')) {
      try {
        callback(owner._value);
      } catch (error) {
        Logger.logError(error.stack || error.message);
      }
      if (isOnce) {
        return;
      }
    }
    owner._listeners.push({
      cb: callback,
      owner: this,
      once: !!(options && options.once)
    });
  }

  unsubscribe(callback) {
    const owner = this._owner ? this._owner : this;
    if (typeof callback === 'undefined') {
      callback = null;
    }
    for (let i = owner._listeners.length; i--;) {
      if ((owner._listeners[i].owner !== this && owner !== this) || (owner._listeners[i].cb !== callback && callback !== null)) {
        owner._listeners.splice(i, 1);
      }
    }
  }

  listeners() {
    return (this._owner ? this._owner : this)._listeners;
  }

  readonly() {
    if (this._readonlyInstance) {
      return this._readonlyInstance;
    }
    const readonlyInstance = this._readonlyInstance = new ReadOnlyWatchedValue();
    readonlyInstance.subscribe = this.subscribe.bind(this);
    readonlyInstance.unsubscribe = this.unsubscribe.bind(this);
    readonlyInstance.value = this.value.bind(this);
    readonlyInstance.when = this.when.bind(this);
    readonlyInstance.spawn = function () {
      return this.spawn.apply(this, arguments).readonly();
    }.bind(this);
    if (this.destroy) {
      readonlyInstance.destroy = this.destroy.bind(this);
    }
    return readonlyInstance;
  }

  spawn(cleanup) {
    const spawnedInstance = new WatchedValue();
    delete spawnedInstance._listeners;
    spawnedInstance._owner = this._owner || this;
    spawnedInstance.destroy = function () {
      if (typeof cleanup === 'function') {
        try {
          cleanup();
        } catch (error) {
          Logger.logError(error.stack || error.message);
        }
      }
      this.unsubscribe();
      delete this._owner;
    };
    return spawnedInstance;
  }

  when(callback) {
    const self = this;
    if (this.value()) {
      try {
        callback();
      } catch (error) {
        Logger.logError(error.stack || error.message);
      }
    } else {
      const listener = function (hasValue) {
        if (hasValue) {
          self.unsubscribe(listener);
          callback();
        }
      };
      this.subscribe(listener);
    }
  }

  opposite() {
    if (!this._opposite) {
      const self = this;
      const oppositeInstance = new WatchedValue(!this.value());
      this.subscribe(function (value) {
        oppositeInstance.setValue(!value);
      });
      oppositeInstance.subscribe(function (value) {
        self.setValue(!value);
      });
      this._opposite = oppositeInstance;
    }
    return this._opposite;
  }
}