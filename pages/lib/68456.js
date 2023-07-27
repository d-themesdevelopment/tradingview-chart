import { EventEmitter } from 'events';

export class AbstractJsonStoreService {
  constructor(crossTabEvents, jsonKeyValueStore, crosstabEventName, jsonStoreKey, defaultValue) {
    this._onChange = new EventEmitter();
    this._crossTabEvents = crossTabEvents;
    this._jsonKeyValueStore = jsonKeyValueStore;
    this.CROSSTAB_EVENT_NAME = crosstabEventName;
    this.JSON_STORE_KEY = jsonStoreKey;
    this.defaultStoreValue = this._serialize(defaultValue);
    this._subscribe();
  }

  get() {
    const serializedValue = this._jsonKeyValueStore.getJSON(this.JSON_STORE_KEY, this.defaultStoreValue);
    return this._deserialize(serializedValue);
  }

  set(value, sync = true) {
    const serializedValue = this._serialize(value);
    this._jsonKeyValueStore.setJSON(this.JSON_STORE_KEY, serializedValue, sync);
    this._crossTabEvents.emit(this.CROSSTAB_EVENT_NAME);
    this._onChange.emit(value);
  }

  getOnChange() {
    return this._onChange;
  }

  destroy() {
    this._unsubscribe();
    this._onChange.removeAllListeners();
    delete this._onChange;
  }

  _subscribe() {
    this._crossTabEvents.on(this.CROSSTAB_EVENT_NAME, this._handleChange);
    this._jsonKeyValueStore.onSync.subscribe(this, this._handleChange);
  }

  _unsubscribe() {
    this._crossTabEvents.off(this.CROSSTAB_EVENT_NAME, this._handleChange);
    this._jsonKeyValueStore.onSync.unsubscribe(this, this._handleChange);
  }

  _serialize(value) {
    return value;
  }

  _deserialize(value) {
    return value;
  }
}

export class CommonJsonStoreService extends AbstractJsonStoreService {
  _serialize(value) {
    return value;
  }

  _deserialize(value) {
    return value;
  }
}