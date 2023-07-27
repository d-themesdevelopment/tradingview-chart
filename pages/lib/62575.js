import { Point } from 'point-module';
import { LineDataSource } from 'line-data-source-module';
import { DefaultProperty, LineToolColorsProperty } from 'line-tool-properties-module';

class LineToolFlagMark extends LineDataSource {
  constructor(source, model, properties, priceScaleId) {
    super(source, model || LineToolFlagMark.createProperties(), properties, priceScaleId);
    import(86441)
      .then((module) => module.FlagMarkPaneView)
      .then(({ FlagMarkPaneView }) => {
        const paneView = new FlagMarkPaneView(this, this.model());
        paneView.setAnchors(new Point(0, 0));
        this._setPaneViews([paneView]);
      });
  }

  pointsCount() {
    return 1;
  }

  name() {
    return "Flag Mark";
  }

  static createProperties(properties) {
    if (properties && properties.flagColor === undefined) {
      properties.flagColor = "#318757";
    }
    const defaultProperty = new DefaultProperty("linetoolflagmark", properties);
    this._configureProperties(defaultProperty);
    return defaultProperty;
  }

  _getPropertyDefinitionsViewModelClass() {
    return import(42923)
      .then((module) => module.FlagMarkDefinitionsViewModel);
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addChild("backgroundsColors", new LineToolColorsProperty([properties.childs().flagColor]));
    properties.addExclusion("backgroundsColors");
  }
}

LineToolFlagMark.version = 2;

export { LineToolFlagMark };
