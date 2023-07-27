import { deepEquals } from 'path/to/deepEquals';
import { WatchedObject as BaseWatchedObject } from 'path/to/watchedObject';

function defaultComparator(a, b) {
  return deepEquals(a, b)[0];
}

class WatchedObject extends BaseWatchedObject {
  constructor(initialValue, comparator = defaultComparator) {
    super(initialValue);
    this._comparator = comparator;
  }

  setValue(value, silent) {
    if (!this._comparator(this.value(), value)) {
      super.setValue(value, silent);
    }
  }
}

export { WatchedObject };