import { ThemedDefaultProperty, extractState } from './13637.js';

class LineDataSourceThemedProperty extends ThemedDefaultProperty {
  template() {
    return extractState(this.state(), this._allDefaultsKeys);
  }
}

export { LineDataSourceThemedProperty };
