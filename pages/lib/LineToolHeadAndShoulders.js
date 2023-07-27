import { LineDataSource } from '<path_to_LineDataSource_module>';
import { DefaultProperty } from '<path_to_DefaultProperty_module>';
import { LineToolColorsProperty } from '<path_to_LineToolColorsProperty_module>';

class LineToolHeadAndShoulders extends LineDataSource {
  constructor(model, priceScale, timeScale, properties) {
    const defaultProperties = properties || LineToolHeadAndShoulders.createProperties();
    super(model, defaultProperties, priceScale, timeScale);
    import(/* webpackChunkName: "LineToolHeadAndShouldersPaneView" */ '<path_to_LineToolHeadAndShouldersPaneView_module>').then(({ LineToolHeadAndShouldersPaneView }) => {
      this._setPaneViews([new LineToolHeadAndShouldersPaneView(this, model)]);
    });
  }

  pointsCount() {
    return 7;
  }

  name() {
    return "Head and Shoulders";
  }

  static createProperties(properties) {
    const defaultProperty = new DefaultProperty("linetoolheadandshoulders", properties);

    this._configureProperties(defaultProperty);

    return defaultProperty;
  }

  _getPropertyDefinitionsViewModelClass() {
    return import(/* webpackChunkName: "PatternWithBackgroundDefinitionViewModel" */ '<path_to_PatternWithBackgroundDefinitionViewModel_module>').then(({ PatternWithBackgroundDefinitionViewModel }) => {
      return PatternWithBackgroundDefinitionViewModel;
    });
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);

    properties.addChild("linesColors", new LineToolColorsProperty([properties.childs().color]));
    properties.addChild("textsColors", new LineToolColorsProperty([properties.childs().textcolor]));
  }
}

export { LineToolHeadAndShoulders };