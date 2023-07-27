import { LineDataSource, convertStudyStatusToString } from 'some-library';
import { TranslatedString } from 'some-other-library';
import { LevelsProperty, LineToolColorsProperty } from 'another-library';

const eraseTranslation = new TranslatedString('erase level line');

class LineToolFibChannel extends LineDataSource {
  constructor(model, chartApi, series, properties) {
    super(model, chartApi, series, properties || LineToolFibChannel.createProperties());
    this.version = 2;
    import(46406).then(module => {
      const { FibChannelPaneView } = module;
      this._setPaneViews([new FibChannelPaneView(this, this._model)]);
    });
  }

  levelsCount() {
    return 24;
  }

  migrateVersion(fromVersion, toVersion, properties) {
    properties.removeProperty('reverse');
  }

  pointsCount() {
    return 3;
  }

  name() {
    return 'Fib Channel';
  }

  processErase(source, level) {
    const propertyId = 'level' + level;
    const visibleProperty = this.properties().child(propertyId).childs().visible;
    source.setProperty(visibleProperty, false, eraseTranslation);
  }

  static createProperties(defaults) {
    const levelsProperty = new LevelsProperty('linetoolfibchannel', defaults, false, {
      range: [1, 24],
      names: ['coeff', 'color', 'visible'],
    });
    this._configureProperties(levelsProperty);
    return levelsProperty;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const [module1, module2, module3, module4, module5] = await Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537),
    ]);
    return module5.FibDrawingsWith24LevelsDefinitionsViewModel;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    const lineColors = [];
    for (let i = 1; i <= 24; i++) {
      const levelProperty = properties.child('level' + i);
      const colorProperty = levelProperty.child('color');
      lineColors.push(colorProperty);
    }
    properties.addChild('linesColors', new LineToolColorsProperty(lineColors));
  }
}

export { LineToolFibChannel };
