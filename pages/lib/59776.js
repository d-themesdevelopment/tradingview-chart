import { DateAndPriceBaseProperties, ensureDefined, extractAllPropertiesKeys, factoryDefaultsForCurrentTheme } from 'some-module';
import { LineDataSource } from 'some-module';
import { e as lazyImport, bind } from 'some-module';

const nonThemedDefaults = {
  ...factoryDefaultsBase.nonThemedFactoryDefaultsBase,
  extendLeft: false,
  extendRight: false
};

const themedDefaults = factoryDefaultsBase.themedFactoryDefaultsBase;
const themedDefaultsKeys = extractAllPropertiesKeys(ensureDefined(themedDefaults.get(StdTheme.Light)));
const nonThemedDefaultsKeys = extractAllPropertiesKeys(nonThemedDefaults);
const allPropertiesKeys = [...themedDefaultsKeys, ...nonThemedDefaultsKeys, ...commonLineToolPropertiesStateKeys, ...allPropertiesStateKeysBase];

class LineToolPriceRangeProperties extends DateAndPriceBaseProperties {
  static create(options) {
    return new this("linetoolpricerange", (() => factoryDefaultsForCurrentTheme(nonThemedDefaults, themedDefaults)), nonThemedDefaultsKeys, themedDefaultsKeys, allPropertiesKeys, options);
  }
}

class LineToolPriceRange extends LineDataSource {
  constructor(series, properties, model, options) {
    super(series, properties || LineToolPriceRangeProperties.create(), model, options);

    lazyImport(/* webpackChunkName: "PriceRangePaneView" */ 1583)
      .then(bind(null, lazyImport, 61416))
      .then(PriceRangePaneView => {
        this._setPaneViews([new PriceRangePaneView(this, this._model)]);
      });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Price Range";
  }

  template() {
    return this._properties.template();
  }

  static createProperties(options) {
    const properties = LineToolPriceRangeProperties.create(options);
    this._configureProperties(properties);
    return properties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      lazyImport(7201),
      lazyImport(3753),
      lazyImport(5871),
      lazyImport(8167),
      lazyImport(8537)
    ]).then(bind(null, lazyImport, 83115))
      .then(GeneralDatePriceRangeDefinitionsViewModel => GeneralDatePriceRangeDefinitionsViewModel);
  }
}

export {
  LineToolPriceRange
};