"use strict";

const isNodeEnvironment = typeof window === 'undefined';
const logger = isNodeEnvironment ? require(59224).getLogger("Common.WatchedValue") : null;

function ReadonlyInstance() {}

function WatchedValue(value) {
    if (!(this instanceof WatchedValue)) return new WatchedValue(value);
    arguments.length > 0 && (this._value = value);
    this._listeners = [];
}

WatchedValue.prototype.value = function () {
    return this._owner ? this._owner._value : this._value;
};

WatchedValue.prototype.setValue = function (value, t) {
    var i = this._owner ? this._owner : this;
    if ("function" == typeof i.hook && (value = i.hook(value)), i.writeLock) return i._value;
    var r = i._value === value || Number.isNaN(i._value) && Number.isNaN(value);
    if (!t && r && i.hasOwnProperty("_value")) return value;
    i._value = value;
    for (var n = i._listeners.slice(), o = 0, a = 0; a < n.length; a++) {
        n[a].once && (i._listeners.splice(a - o, 1), o++);
        try {
            n[a].cb(value);
        } catch (e) {
            logger.logError(e.stack || e.message);
        }
    }
    return value;
};

WatchedValue.prototype.deleteValue = function () {
    var i = this._owner ? this._owner : this;
    if (i.hasOwnProperty("_value")) {
        if (i.writeLock) return i._value;
        delete i._value;
        for (var n = i._listeners.slice(), o = 0, a = 0; a < n.length; a++) {
            n[a].once && (i._listeners.splice(a - o, 1), o++);
            try {
                n[a].cb();
            } catch (e) {
                logger.logError(e.stack || e.message);
            }
        }
    }
};

WatchedValue.prototype.subscribe = function (callback, options) {
    if ("function" != typeof callback) throw new TypeError("callback must be a function");
    var once = !!options && !!options.once;
    var callWithLast = !!options && !!options.callWithLast;
    var owner = this._owner ? this._owner : this;
    if (callWithLast && owner.hasOwnProperty("_value")) {
        try {
            callback(owner._value);
        } catch (e) {
            logger.logError(e.stack || e.message);
        }
        if (once) return;
    }
    owner._listeners.push({
        cb: callback,
        owner: this,
        once: once
    });
};

WatchedValue.prototype.unsubscribe = function (callback) {
    var owner = this._owner ? this._owner : this;
    void 0 === callback && (callback = null);
    for (var listeners = owner._listeners, len = listeners.length; len--;) {
        if ((listeners[len].owner !== this && owner !== this) || (listeners[len].cb !== callback && null !== callback)) {
            continue;
        }
        listeners.splice(len, 1);
    }
};

WatchedValue.prototype.listeners = function () {
    return (this._owner ? this._owner : this)._listeners;
};

WatchedValue.prototype.readonly = function () {
    if (this._readonlyInstance) return this._readonlyInstance;
    var instance = this._readonlyInstance = new ReadonlyInstance();
    instance.subscribe = this.subscribe.bind(this);
    instance.unsubscribe = this.unsubscribe.bind(this);
    instance.value = this.value.bind(this);
    instance.when = this.when.bind(this);
    instance.spawn = function () {
        return this.spawn.apply(this, arguments).readonly();
    }.bind(this);
    if (this.destroy) {
        instance.destroy = this.destroy.bind(this);
    }
    return instance;
};

WatchedValue.prototype.spawn = function (callback) {
    var instance = new WatchedValue();
    delete instance._listeners;
    instance._owner = this._owner || this;
    instance.destroy = function () {
        if ("function" == typeof callback) {
            try {
                callback();
            } catch (e) {
                logger.logError(e.stack || e.message);
            }
        }
        this.unsubscribe();
        delete this._owner;
    };
    return instance;
};

WatchedValue.prototype.when = function (callback) {
    var instance = this;
    if (this.value()) {
        try {
            callback();
        } catch (e) {
            logger.logError(e.stack || e.message);
        }
    } else {
        var subscription = function (value) {
            if (value) {
                instance.unsubscribe(subscription);
                callback();
            }
        };
        instance.subscribe(subscription);
    }
};

WatchedValue.prototype.opposite = function () {
    if (!this._opposite) {
        var instance = this;
        var opposite = new WatchedValue(!this.value());
        this.subscribe(function (value) {
            opposite.setValue(!value);
        });
        opposite.subscribe(function (value) {
            instance.setValue(!value);
        });
        this._opposite = opposite;
    }
    return this._opposite;
};

if (isNodeEnvironment && typeof window !== 'undefined') {
    window.WatchedValue = WatchedValue;
}

if (isNodeEnvironment && module.exports) {
    module.exports = WatchedValue;
}
