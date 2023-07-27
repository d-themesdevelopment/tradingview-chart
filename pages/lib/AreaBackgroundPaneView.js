import { ensureDefined } from './assertions.js';
import { AbstractFilledAreaPaneView } from './70044.js';

export class AreaBackgroundPaneView extends AbstractFilledAreaPaneView {
  constructor(source, priceScale) {
    super(source, priceScale);
  }

  _plotAId() {
    return ensureDefined(this._source.metaInfo().area)[0].name;
  }

  _plotBId() {
    return ensureDefined(this._source.metaInfo().area)[1].name;
  }

  _commonColor() {
    return {
      type: 0,
      color: this._source.properties().areaBackground.backgroundColor.value(),
    };
  }

  _transparency() {
    const transparency = this._source.properties().areaBackground.transparency.value();
    return clamp(transparency, 0, 100);
  }

  _visible() {
    return this._source.properties().areaBackground.fillBackground.value();
  }

  _getColorByPlotValue() {
    return this._commonColor();
  }
}