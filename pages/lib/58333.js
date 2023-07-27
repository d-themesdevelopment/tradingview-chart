import { parseRgb, distanceRgb, invertRgb, rgbToHexString } from 'some-module';
import { isNumber, ensureNotNull } from 'some-other-module';
import CheckMobile from 'check-mobile';
import { PercentageFormatter, VolumeFormatter } from 'formatters';
import { notAvailable } from 'some-translations';

const isMobile = CheckMobile.any();
const isMobileAndTablet = isMobile && !true;
const percentageFormatter = new PercentageFormatter();
const volumeFormatter = new VolumeFormatter(2);
const notAvailableWithPercentage = `${notAvailable} (${notAvailable}%)`;

function calculateColor(color1, color2) {
  const rgbColor1 = parseRgb(color1);
  const rgbColor2 = parseRgb(color2);

  if (distanceRgb(rgbColor1, rgbColor2) < 70) {
    return rgbToHexString(invertRgb(rgbColor1));
  }

  return color2;
}

class SeriesValuesProvider {
  constructor(series, model) {
    this.series = series;
    this.model = model;
    this.emptyValues = [{
      title: 'Title 1',
      visible: false,
      value: '',
      index: 0,
      id: ''
    }, {
      title: 'Title 2',
      visible: false,
      value: '',
      index: 1,
      id: ''
    }, {
      title: 'Title 3',
      visible: false,
      value: '',
      index: 2,
      id: ''
    }, {
      title: 'Title 4',
      visible: false,
      value: '',
      index: 3,
      id: ''
    }, {
      title: '',
      visible: false,
      value: '',
      index: 4,
      id: ''
    }, {
      title: '',
      visible: false,
      value: '',
      index: 5,
      id: ''
    }, {
      title: 'Title 7',
      visible: false,
      value: '',
      index: 6,
      id: ''
    }, {
      title: 'Title 8',
      visible: false,
      value: '',
      index: 7,
      id: ''
    }];
  }

  getItems() {
    return this.emptyValues;
  }

  getValues(index) {
    const showLastPriceAndChangeOnly = this._showLastPriceAndChangeOnly();
    const values = this.emptyValues.map((item) => ({
      ...item,
      visible: !showLastPriceAndChangeOnly
    }));

    values[0].value = notAvailable;
    values[1].value = notAvailable;
    values[2].value = notAvailable;
    values[3].value = notAvailable;
    values[6].value = notAvailableWithPercentage;
    values[7].value = notAvailable;

    if (this.model.timeScale().isEmpty() || this.series.bars().size() === 0 || this.series.priceScale().isEmpty()) {
      return values;
    }

    if (!isNumber(index)) {
      index = ensureNotNull(this.series.data().last()).index;
    }

    const nearestIndex = this.series.nearestIndex(index);
    if (nearestIndex === undefined) {
      return values;
    }

    const data = this.series.data().valueAt(nearestIndex);
    const backgroundTopColor = this.model.backgroundTopColor().value();

    if (data === null) {
      return values;
    }

    const open = data[1];
    const high = data[2];
    const low = data[3];
    const close = data[4];

    const changesData = this._changesData(close, nearestIndex, showLastPriceAndChangeOnly);

    const priceFormatter = getPriceFormatterForSource(this.series);

    if (shouldBeFormattedAsPercent(this.series) || shouldBeFormattedAsIndexedTo100(this.series)) {
      values[6].value = '';
    } else if (changesData !== undefined) {
      const formatter = this.series.formatter();
      const { currentPrice, prevPrice, change, percentChange } = changesData;

      const changeValue = formatter.formatChange(currentPrice, prevPrice, true);
      const formattedChange = changeValue !== null ? changeValue : formatter.format(change, true);

      values[6].value = forceLTRStr(`${formattedChange} (${percentageFormatter.format(percentChange, true)})`);
    }

    if (showLastPriceAndChangeOnly) {
      values[5].value = close === null ? notAvailable : priceFormatter(close);
      values[5].visible = true;
      values[6].visible = true;
    } else {
      values[0].value = open === null ? notAvailable : priceFormatter(open);
      values[1].value = high === null ? notAvailable : priceFormatter(high);
      values[2].value = low === null ? notAvailable : priceFormatter(low);
      values[3].value = close === null ? notAvailable : priceFormatter(close);
      values[

4].value = priceFormatter(this.series.barFunction()(data));

      const volume = data[5];
      if (isNumber(volume)) {
        values[7].value = volumeFormatter.format(volume);
      } else {
        values[7].visible = false;
      }
    }

    let color;
    if (showLastPriceAndChangeOnly && !isMobileAndTablet) {
      const quotes = this.series.quotes();
      if (quotes !== null) {
        const change = quotes.change !== null ? quotes.change : 0;
        const upColor = SeriesBarColorer.upColor(this.series.properties());
        const downColor = SeriesBarColorer.downColor(this.series.properties());
        color = change >= 0 ? upColor : downColor;
      }
    } else {
      const barStyle = this.series.barColorer().barStyle(nearestIndex, false);
      const barColor = barStyle.barBorderColor ?? barStyle.barColor;
      color = calculateColor(backgroundTopColor, barColor);
    }

    color = resetTransparency(calculateColor(backgroundTopColor, color));

    for (const value of values) {
      value.color = color;
    }

    return values;
  }

  _showLastPriceAndChangeOnly() {
    return isMobileAndTablet && (this.model.crossHairSource().pane === null || isLineToolName(tool.value()) || this.model.lineBeingEdited() !== null);
  }

  _changesData(close, index, showLastPriceAndChangeOnly) {
    if (showLastPriceAndChangeOnly) {
      const quotes = this.series.quotes();
      if (quotes !== null) {
        const change = quotes.change ?? 0;
        return {
          values: {
            change,
            currentPrice: close,
            prevPrice: close - change,
            percentChange: quotes.change_percent ?? 0
          }
        };
      }
    } else {
      const prevData = this.series.data().search(index - 1);
      const prevClose = prevData?.value[4] ?? null;

      if (prevClose !== null && close !== null) {
        return {
          values: {
            change: close - prevClose,
            currentPrice: close,
            prevPrice: prevClose,
            percentChange: barPercentChange(prevClose, close)
          }
        };
      }
    }

    return undefined;
  }
}

export {
  SeriesValuesProvider,
  calculateColor
};