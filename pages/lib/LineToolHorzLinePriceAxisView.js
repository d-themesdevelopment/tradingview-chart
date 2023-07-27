


import { PriceAxisView } from 'some-library'; // Replace 'some-library' with the actual library you're using
import { resetTransparency } from 'some-other-library'; // Replace 'some-other-library' with the actual library you're using

class LineToolHorzLinePriceAxisView extends PriceAxisView {
  constructor(source) {
    super();
    this._source = source;
  }

  _updateRendererData(rendererData, priceScale, options) {
    rendererData.visible = false;

    const points = this._source.points();
    const ownerSource = this._source.ownerSource();
    const properties = this._source.properties();

    if (points.length === 0 || !priceScale || priceScale.isEmpty()) {
      return;
    }

    const point = points[0];
    if (!isFinite(point.price)) {
      return;
    }

    const firstValue = ownerSource ? ownerSource.firstValue() : null;
    if (firstValue === null) {
      return;
    }

    const lineColor = resetTransparency(properties.linecolor.value());
    options.background = lineColor;
    options.textColor = this.generateTextColor(lineColor);
    options.coordinate = priceScale.priceToCoordinate(point.price, firstValue);
    rendererData.text = priceScale.formatPrice(point.price, firstValue);
    rendererData.visible = true;
  }
}

export default LineToolHorzLinePriceAxisView;
