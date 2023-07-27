import { ensureDefined, assert } from 'utility-module';
import { LineDataSource } from 'line-data-source-module';
import { extractAllPropertiesKeys, factoryDefaultsForCurrentTheme, themedFactoryDefaultsBase, nonThemedFactoryDefaultsBase, allPropertiesStateKeysBase, commonLineToolPropertiesStateKeys } from 'property-helpers';
import { getHexColorByName } from 'color-module';
import { StdTheme } from 'std-theme-module';
import { DateAndPriceBaseProperties } from 'date-and-price-base-properties-module';
import { extractAllPropertiesKeys } from 'property-helpers';
import { DateAndPriceRangePaneView } from 'date-and-price-range-pane-view-module';
import { SeriesTimeRangeVolumeCalculator } from 'series-time-range-volume-calculator-module';

const blueColor = getHexColorByName("color-tv-blue-500");
const basePropertiesLight = {
  ...themedFactoryDefaultsBase.get(StdTheme.Light),
  borderColor: blueColor
};

const basePropertiesDark = {
  ...themedFactoryDefaultsBase.get(StdTheme.Dark),
  borderColor: blueColor
};

const factoryDefaults = {
  ...nonThemedFactoryDefaultsBase,
  drawBorder: false,
  borderWidth: 1
};

const propertiesLight = extractAllPropertiesKeys(ensureDefined(basePropertiesLight));
const propertiesDark = extractAllPropertiesKeys(ensureDefined(basePropertiesDark));
const commonProperties = [...propertiesLight, ...propertiesDark, ...commonLineToolPropertiesStateKeys, ...allPropertiesStateKeysBase];

class LineToolDateAndPriceRange extends DateAndPriceBaseProperties {
  static create(e) {
    return new this(
      "linetooldateandpricerange",
      () => factoryDefaultsForCurrentTheme(factoryDefaults, { [StdTheme.Light]: basePropertiesLight, [StdTheme.Dark]: basePropertiesDark }),
      commonProperties,
      propertiesLight,
      propertiesDark,
      e
    );
  }
}

class LineToolDataSource extends LineDataSource {
  constructor(e, t, s, r) {
    super(e, t || LineToolDateAndPriceRange.createProperties(), s, r);
    this._volumeCalculator = null;
    import(54306).then((module) => {
      this._setPaneViews([new module.DateAndPriceRangePaneView(this, this._model)]);
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
    return "Date and Price Range";
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

  static createProperties(e) {
    const properties = LineToolDateAndPriceRange.create(e);
    this._configureProperties(properties);
    return properties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    return await Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537)
    ]).then((module) => module[0].GeneralDatePriceRangeDefinitionsViewModel);
  }
}

export { LineToolDataSource as LineToolDateAndPriceRange };