import { SeriesSingleLinePaneView } from 'path/to/SeriesSingleLinePaneView';
import { HitTarget } from 'path/to/HitTarget';
import { PaneRendererLine } from 'path/to/PaneRendererLine';
import { PaneRendererStepLine } from 'path/to/PaneRendererStepLine';
import { SelectionRenderer } from 'path/to/SelectionRenderer';

class SeriesLinePaneView extends SeriesSingleLinePaneView {
  renderer(source, model) {
    if (this._invalidated) {
      this._updateImpl();
      this._invalidated = false;
    }

    const sourceProperties = this._source.properties().childs();
    const lineStyleValue = sourceProperties.style.value();
    let lineProperties, withMarkers;
    if (lineStyleValue === 2) {
      lineProperties = sourceProperties.lineStyle.childs();
      withMarkers = false;
    } else if (lineStyleValue === 14) {
      lineProperties = sourceProperties.lineWithMarkersStyle.childs();
      withMarkers = true;
    } else if (lineStyleValue === 15) {
      lineProperties = sourceProperties.steplineStyle.childs();
      withMarkers = false;
    }

    const rendererParams = {
      barSpacing: this._model.timeScale().barSpacing(),
      items: this._items,
      lineColor: lineProperties.color.value(),
      lineStyle: lineProperties.linestyle.value(),
      withMarkers: withMarkers,
      lineWidth: lineProperties.linewidth.value(),
      simpleMode: true,
      hitTestResult: HitTarget.Regular
    };

    let renderer, compositeRenderer;
    if (lineStyleValue === 15) {
      renderer = new PaneRendererStepLine(rendererParams);
    } else {
      renderer = new PaneRendererLine(rendererParams);
    }

    if (this._model.selection().isSelected(this._source) && this._isMarkersEnabled && this._selectionData) {
      const compositeRenderer = new CompositeRenderer();
      compositeRenderer.append(renderer);
      compositeRenderer.append(new SelectionRenderer(this._selectionData));
    } else {
      compositeRenderer = renderer;
    }

    return compositeRenderer;
  }
}

export {
  SeriesLinePaneView
};