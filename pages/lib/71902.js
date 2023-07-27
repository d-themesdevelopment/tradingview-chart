import { ensureDefined } from '50151';
import { DefaultProperty } from '46100';
import { LineDataSource } from '13087';
import { LineToolColorsProperty } from '68806';
import { e as bind } from '50151';

class LineTool5PointsPattern extends LineDataSource {
  constructor(chartWidget, inputParams, properties, model) {
    super(chartWidget, inputParams || LineTool5PointsPattern.createProperties(), properties, model);
    this._loadPaneViews(chartWidget);
  }

  pointsCount() {
    return 5;
  }

  name() {
    return "XABCD Pattern";
  }

  static createProperties(inputParams) {
    const properties = new DefaultProperty("linetool5pointspattern", inputParams);
    this._configureProperties(properties);
    return properties;
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import('7201'),
      import('3753'),
      import('5871'),
      import('8167'),
      import('8537')
    ]).then(bind(25107)).then(({ PatternWithBackgroundDefinitionViewModel }) => PatternWithBackgroundDefinitionViewModel);
  }

  _loadPaneViews(chartWidget) {
    import('24424').then(({ Pattern5pointsPaneView }) => {
      this._setPaneViews([new Pattern5pointsPaneView(this, chartWidget)]);
    });
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addChild("linesColors", new LineToolColorsProperty([ensureDefined(properties.child("color"))]));
    properties.addChild("textsColors", new LineToolColorsProperty([ensureDefined(properties.child("textcolor"))]));
  }
}

export {
  LineTool5PointsPattern
};