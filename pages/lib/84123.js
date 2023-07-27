import { t } from 'path/to/translations';
import { LineDataSource } from 'path/to/lineDataSource';
import { LevelsProperty, LineToolColorsProperty, LineToolWidthsProperty } from 'path/to/properties';
import { FibDrawingsWith24LevelsDefinitionsViewModel } from 'path/to/viewModels';
import { bind, e } from 'path/to/utils';
import { TranslatedString } from 'path/to/translatedString';
import { TrendBasedFibExtensionPaneView } from 'path/to/paneViews';

const eraseLevelLineString = new TranslatedString('erase level line', t(null, void 0, i(12962)));

class LineToolTrendBasedFibExtension extends LineDataSource {
  constructor(source, points, properties, model) {
    super(source, points || LineToolTrendBasedFibExtension.createProperties(), properties, model);
    this.version = 2;
    e(1583)
      .then(bind(e, 38058))
      .then(({ TrendBasedFibExtensionPaneView }) => {
        this._setPaneViews([new TrendBasedFibExtensionPaneView(this, this._model)]);
      });
  }

  levelsCount() {
    return 24;
  }

  pointsCount() {
    return 3;
  }

  name() {
    return 'Trend-Based Fib Extension';
  }

  migrateVersion(fromVersion, toVersion) {
    if (fromVersion === 1) {
      this.properties().childs().extendLines.setValue(true);
    }
  }

  processErase(index, level) {
    const levelKey = `level${level}`;
    const visibleProperty = this.properties().childs()[levelKey].childs().visible;
    this.setProperty(visibleProperty, false, eraseLevelLineString);
  }

  fibLevelsBasedOnLogScale() {
    const priceScale = this.priceScale();
    return this.properties().childs().fibLevelsBasedOnLogScale.value() && (priceScale === null || priceScale.isLog());
  }

  static createProperties(defaults) {
    const levelsProperty = new LevelsProperty('linetooltrendbasedfibextension', defaults, false, {
      range: [0, 8],
    });
    this.configureProperties(levelsProperty);
    return levelsProperty;
  }

  async _getPropertyDefinitionsViewModelClass() {
    return Promise.all([e(7201), e(3753), e(5871), e(8167), e(8537)])
      .then(bind(e, 56194))
      .then(({ FibDrawingsWith24LevelsDefinitionsViewModel }) => FibDrawingsWith24LevelsDefinitionsViewModel);
  }

  static configureProperties(properties) {
    const childs = properties.childs();
    super.configureProperties(properties);
    const lineColors = [childs.trendline.childs().color];
    for (let i = 1; i <= 24; i++) {
      const color = childs[`level${i}`].childs().color;
      lineColors.push(color);
    }
    properties.addChild('linesColors', new LineToolColorsProperty(lineColors));
    const lineWidths = [childs.trendline.childs().linewidth, childs.levelsStyle.childs().linewidth];
    properties.addChild('linesWidths', new LineToolWidthsProperty(lineWidths));
  }
}

export { LineToolTrendBasedFibExtension };