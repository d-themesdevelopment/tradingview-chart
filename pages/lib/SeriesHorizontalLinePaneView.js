
import { HorizontalLinePaneView } from '38003';

class SeriesHorizontalLinePaneView extends HorizontalLinePaneView {
  constructor(series) {
    super();
    this._series = series;
    this._model = series.model();
  }
}

export { SeriesHorizontalLinePaneView };
