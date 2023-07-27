
const Logger = require('./someModule').getLogger('Common.Delegate');

class Delegate {
  constructor() {
    this._listeners = [];
  }

  subscribe(object, member, singleshot) {
    const listener = {
      object,
      member,
      singleshot: !!singleshot,
      skip: false
    };
    this._listeners.push(listener);
  }

  unsubscribe(object, member) {
    for (let i = 0; i < this._listeners.length; ++i) {
      const listener = this._listeners[i];
      if (listener.object === object && listener.member === member) {
        listener.skip = true;
        this._listeners.splice(i, 1);
        break;
      }
    }
  }

  unsubscribeAll(object) {
    for (let i = this._listeners.length - 1; i >= 0; --i) {
      const listener = this._listeners[i];
      if (listener.object === object) {
        listener.skip = true;
        this._listeners.splice(i, 1);
      }
    }
  }

  destroy() {
    delete this._listeners;
  }

  fire() {
    const listeners = this._listeners;
    this._listeners = this._listeners.filter(n);
    const count = listeners.length;
    for (let i = 0; i < count; ++i) {
      const listener = listeners[i];
      if (!listener.skip) {
        try {
          listener.member.apply(listener.object || null, arguments);
        } catch (error) {
          Logger.logError(error.stack || error.message);
        }
      }
    }
  }
}

