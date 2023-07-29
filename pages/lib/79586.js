import {makeFont} from "./29764.js";
import {lowerbound, lowerboundExt} from "./78071.js";
import {optimalHiLoWidth, interactionTolerance} from "./45197.js";
import {HitTestResult} from "./18807.js";
import {MediaCoordinatesPaneRenderer} from "./MediaCoordinatesPaneRenderer.js";
import {CHART_FONT_FAMILY} from "./46501.js";
import {measureText} from "./74359.js";
import {PaneRendererCandles} from "./PaneRendererCandles.js";
import {SeriesBarCandlesPaneView} from "./4502.js";




class HiLoPaneView extends MediaCoordinatesPaneRenderer {
  constructor() {
    super();
    this.data = null;
    this.barWidth = null;
  }

  setData(data) {
    this.data = data;
    this.barWidth = Math.max(1, Math.round(optimalHiLoWidth(data.barSpacing)));
  }

  hitTest(point) {
    if (this.data === null || this.barWidth === null) return null;

    const bars = this.data.bars;
    const halfBarSpacing = 0.5 * this.data.barSpacing;

    if (bars.length === 0) return null;
    if (point.x < bars[0].time - halfBarSpacing) return null;
    if (point.x > bars[bars.length - 1].time + halfBarSpacing) return null;

    const index = lowerbound(bars, point.x - halfBarSpacing, (a, b) => a.time < b);
    const currentBar = bars[index];

    if (point.x < currentBar.time - halfBarSpacing || point.x > currentBar.time + halfBarSpacing) {
      return null;
    }

    const tolerance = interactionTolerance().series + this.barWidth / 2;
    const low = Math.min(currentBar.high, currentBar.low);
    const high = Math.max(currentBar.high, currentBar.low);
    const fontSize = this.data.fontSize;

    if ((low - tolerance - fontSize <= point.y && point.y <= low + tolerance) || 
        (high - tolerance <= point.y && point.y <= high + tolerance + fontSize)) {
      return new HitTestResult(HitTarget.Regular);
    }

    return null;
  }

  drawImpl(renderer) {
    if (this.data === null || this.barWidth === null) return;

    const { font, fontSize, labelColor, bars, inverted, labelsPadding } = this.data;
    const context = renderer.context;

    context.textAlign = 'center';
    context.fillStyle = labelColor;
    context.font = makeFont(fontSize, font);

    for (let i = 0; i < bars.length; ++i) {
      const bar = bars[i];
      const topY = Math.round(Math.min(bar.high, bar.low));
      const bottomY = Math.round(Math.max(bar.high, bar.low));
      const x = Math.round(bar.time);

      context.textBaseline = 'alphabetic';
      context.fillText(inverted ? bar.lowLabel : bar.highLabel, x, topY - labelsPadding);
      context.textBaseline = 'top';
      context.fillText(inverted ? bar.highLabel : bar.lowLabel, x, bottomY + labelsPadding);
    }
  }
}

class SeriesHiLoPaneView extends SeriesBarCandlesPaneView {
  constructor(chartWidget, series) {
    super(chartWidget, series);
    this.labelsRenderer = new HiLoPaneView();
    this.candlesRenderer = new PaneRendererCandles();
    this.maxLengthLabel = '';
    this.calculateFontSize = (getTextWidth, maxWidth) => {
      return Math.max(
        1,
        lowerboundExt((i) => i + 1, null, (fontSize) => {
          const font = makeFont(fontSize, CHART_FONT_FAMILY);
          return measureText(getTextWidth, font).width <= maxWidth;
        }, 7, 36)
      );
    };
  }

  renderer(index, rendererSettings, options) {
    const priceScale = this.source.priceScale();
    if (!priceScale || priceScale.isEmpty()) return null;

    const compositeRenderer = new CompositeRenderer();
    const generateLabels = this.needLabels();
    const hiLoStyle = this.source.properties().childs().hiloStyle.childs();
    const barSpacing = this.model.timeScale().barSpacing();

    if (this.invalidated) {
      const formatter = this.source.formatter();
      this.maxLengthLabel = '';
      this.updateData({
        generateLabels,
        formatter
      });
      this.invalidated = false;
    }

    this.candlesRenderer.setData({
      bars: this.bars,
      wickVisible: false,
      bodyVisible: hiLoStyle.drawBody.value(),
      barSpacing,
      borderVisible: hiLoStyle.showBorders.value(),
      barWidth: optimalHiLoWidth(barSpacing)
    });

    compositeRenderer.append(this.candlesRenderer);

    if (generateLabels) {
      const fontSize = this.calculateLabelFontSize();
      if (fontSize && fontSize >= 8) {
        this.labelsRenderer.setData({
          bars: this.bars,
          barSpacing,
          font: CHART_FONT_FAMILY,
          fontSize,
          labelColor: hiLoStyle.labelColor.value(),
          inverted: priceScale.isInverted(),
          labelsPadding: 0.4 * fontSize
        });
        compositeRenderer.append(this.labelsRenderer);
      }
    }

    if (this.model.selection().isSelected(this.source) && this.isMarkersEnabled && this.selectionData) {
      compositeRenderer.append(new SelectionRenderer(this.selectionData));
    }

    return compositeRenderer;
  }

  topMargin() {
    return this.margin();
  }

  bottomMargin() {
    return this.margin();
  }

  createItem(time, data, seriesProperties, generateLabels) {
    const item = {
      time,
      open: NaN,
      high: NaN,
      low: NaN,
      close: NaN,
      color: seriesProperties.barColor,
      borderColor: seriesProperties.barBorderColor,
      hollow: false,
      highLabel: '',
      lowLabel: ''
    };

    if (!baseBarCandlesUpdater(data, item)) {
      return null;
    }

    item.open = item.high;
    item.close = item.low;

    if (generateLabels) {
      const highLabel = seriesProperties.formatter.format(item.high);
      const lowLabel = seriesProperties.formatter.format(item.low);
      item.highLabel = highLabel;
      item.lowLabel = lowLabel;

      const maxLengthLabel = (highLabel.length > lowLabel.length ? highLabel : lowLabel).replace(/\d/g, '0');
      if (maxLengthLabel.length > this.maxLengthLabel.length) {
        this.maxLengthLabel = maxLengthLabel;
      }
    }

    return item;
  }

  margin() {
    if (this.needLabels()) {
      const fontSize = this.calculateLabelFontSize();
      if (fontSize && fontSize >= 8) {
        return 1.4 * fontSize;
      }
    }

    return 0;
  }

  calculateLabelFontSize() {
    return this.maxLengthLabel === '' ? null : this.calculateFontSize(this.maxLengthLabel, Math.floor(this.model.timeScale().barSpacing()) - 2);
  }

  needLabels() {
    const showLabels = this.source.properties().childs().hiloStyle.childs().showLabels.value();
    const barSpacing = this.model.timeScale().barSpacing();
    return showLabels && barSpacing > 5;
  }
}

export { SeriesHiLoPaneView };
