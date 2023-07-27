import { ThemedDefaultProperty, extractState } from 'some-library';

class LineDataSourceThemedProperty extends ThemedDefaultProperty {
  template() {
    return extractState(this.state(), this._allDefaultsKeys);
  }
}

export { LineDataSourceThemedProperty };
