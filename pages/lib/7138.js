import { CompositeRenderer } from "./CompositeRenderer";
import { PaneRendererBars } from "./PaneRendererBars";
import { SeriesBarCandlesPaneView } from "./4502";
import { SelectionRenderer } from "./80101";
import { baseBarCandlesUpdater } from "./4502";

class SeriesBarsPaneView extends SeriesBarCandlesPaneView {
  renderer(index, isHovered) {
    if (this._invalidated) {
      this._updateImpl(null);
      this._invalidated = false;
    }

    const sourceProperties = this._source.properties().childs();
    const rendererParams = {
      bars: this._bars,
      barSpacing: this._model.timeScale().barSpacing(),
      dontDrawOpen: sourceProperties.barStyle.childs().dontDrawOpen.value(),
      thinBars:
        11 === sourceProperties.style.value()
          ? sourceProperties.rangeStyle.childs().thinBars.value()
          : sourceProperties.barStyle.childs().thinBars.value(),
    };

    const compositeRenderer = new CompositeRenderer();
    compositeRenderer.append(new PaneRendererBars(rendererParams));

    if (
      this._model.selection().isSelected(this._source) &&
      this._isMarkersEnabled &&
      this._selectionData
    ) {
      compositeRenderer.append(new SelectionRenderer(this._selectionData));
    }

    return compositeRenderer;
  }

  _createItem(time, price, color) {
    const item = {
      time: time,
      open: NaN,
      high: NaN,
      low: NaN,
      close: NaN,
      color: color.barColor,
    };

    return baseBarCandlesUpdater(price, item) ? item : null;
  }
}

export { SeriesBarsPaneView };
