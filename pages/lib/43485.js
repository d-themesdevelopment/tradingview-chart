import { assert, ensureDefined } from 'utils';
import { LineDataSource } from 'lineDataSource';
import { LineToolProperties, nonThemedFactoryDefaultsBase, themedFactoryDefaultsBase, extractAllPropertiesKeys, factoryDefaultsForCurrentTheme, commonLineToolPropertiesStateKeys, allPropertiesStateKeysBase } from 'lineToolProperties';
import { DateAndPriceBaseProperties } from 'dateAndPriceBaseProperties';
import { extractAllPropertiesKeys } from 'propertyStateExtractor';
import { LineToolDateRangePaneView } from 'lineToolDateRangePaneView';
import { SeriesTimeRangeVolumeCalculator } from 'seriesTimeRangeVolumeCalculator';

const nonThemedDefaults = {
  ...nonThemedFactoryDefaultsBase,
  extendTop: false,
  extendBottom: false
};

const themedDefaults = themedFactoryDefaultsBase.get(StdTheme.Light);
const themedKeys = extractAllPropertiesKeys(ensureDefined(themedDefaults));
const nonThemedKeys = extractAllPropertiesKeys(nonThemedDefaults);
const allKeys = [...themedKeys, ...nonThemedKeys, ...commonLineToolPropertiesStateKeys, ...allPropertiesStateKeysBase];

class LineToolDateRangeProperties extends DateAndPriceBaseProperties {
  static create(theme) {
    return new this(
      "linetooldaterange",
      () => factoryDefaultsForCurrentTheme(nonThemedDefaults, themedDefaults),
      nonThemedKeys,
      themedKeys,
      allKeys,
      theme
    );
  }
}

class LineToolDateRange extends LineDataSource {
  constructor(id, model, inputProperties, options) {
    super(id, inputProperties || LineToolDateRange.createProperties(), model, options);
    this._volumeCalculator = null;
    import(55762).then((module) => {
      this._setPaneViews([new LineToolDateRangePaneView(this, this._model)]);
    });
  }

  destroy() {
    super.destroy();
    if (this._volumeCalculator !== null) {
      this._volumeCalculator.destroy();
    }
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Date Range";
  }

  template() {
    return this._properties.template();
  }

  volume() {
    if (this._volumeCalculator === null) {
      return NaN;
    }

    const points = this.points();
    return this._volumeCalculator.volume(points[0].index, points[1].index);
  }

  setOwnerSource(source) {
    if (source === this._model.mainSeries()) {
      assert(this._volumeCalculator === null);
      this._volumeCalculator = new SeriesTimeRangeVolumeCalculator(this._model.mainSeries());
    }
    super.setOwnerSource(source);
  }

  static createProperties(theme) {
    const properties = LineToolDateRangeProperties.create(theme);
    this._configureProperties(properties);
    return properties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const module = await Promise.all([import(7201), import(3753), import(5871), import(8167), import(8537)]);
    return module[4].GeneralDatePriceRangeDefinitionsViewModel;
  }
}

export {
  LineToolDateRange
};