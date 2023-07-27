// import { generateColor } from 's';
import { PaneRendererArea } from "./62885";
import { SelectionRenderer } from "./80101";
import { CompositeRenderer } from "./CompositeRenderer";
import { SeriesSingleLinePaneView } from "./96476";
import createColor from "create-color";

class SeriesAreaPaneView extends SeriesSingleLinePaneView {
  renderer(canvas, series) {
    if (this._invalidated) {
      this._updateImpl();
      this._invalidated = false;
    }
    const priceScale = this._source.priceScale();
    if (!priceScale) return null;

    const areaProperties = this._source
      .properties()
      .childs()
      .areaStyle.childs();
    const transparency = areaProperties.transparency.value();
    const color1 = createColor(areaProperties.color1.value(), transparency);
    const color2 = createColor(areaProperties.color2.value(), transparency);

    const rendererOptions = {
      simpleMode: false,
      barSpacing: this._model.timeScale().barSpacing(),
      items: this._items,
      lineColor: areaProperties.linecolor.value(),
      lineStyle: areaProperties.linestyle.value(),
      lineWidth: areaProperties.linewidth.value(),
      isSeries: true,
      withMarkers: false,
      bottom: priceScale.height(),
      color1: color1,
      color2: color2,
    };

    const compositeRenderer = new CompositeRenderer();
    compositeRenderer.append(new PaneRendererArea(rendererOptions));

    if (
      this._model.selection().isSelected(this._source) &&
      this._isMarkersEnabled &&
      this._selectionData
    ) {
      compositeRenderer.append(new SelectionRenderer(this._selectionData));
    }

    return compositeRenderer;
  }
}

export default SeriesAreaPaneView;
