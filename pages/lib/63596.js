import { TranslatedString } from 'translated-string-module';
import { LineDataSource } from 'line-data-source-module';
import { LevelsProperty } from 'levels-property-module';
import { LineToolWidthsProperty, LineToolColorsProperty } from 'line-tool-properties-module';

const eraseLevelLineTranslation = new TranslatedString('erase level line', null, 'erase-level-line-translation-module');

class LineToolPitchfan extends LineDataSource {
  constructor(model, inputs, options, priceData) {
    super(model, inputs || LineToolPitchfan.createProperties(), options, priceData);

    import(/* webpackChunkName: "chunk-line-tool-pitchfan" */ 'pitchfan-line-pane-view-module')
      .then((module) => {
        const PitchfanLinePaneView = module.PitchfanLinePaneView;
        this._setPaneViews([new PitchfanLinePaneView(this, this._model)]);
      });
  }

  levelsCount() {
    return LineToolPitchfan.LevelsCount;
  }

  pointsCount() {
    return 3;
  }

  name() {
    return 'Pitchfan';
  }

  processErase(source, level) {
    const propertyName = `level${level}`;
    const isVisible = this.properties()[propertyName].visible;
    source.setProperty(isVisible, false, eraseLevelLineTranslation);
  }

  async _getPropertyDefinitionsViewModelClass() {
    const PitchBaseDefinitionsViewModel = await Promise.all([
      import(/* webpackChunkName: "chunk-pitch-base-1" */ 'pitch-base-module1'),
      import(/* webpackChunkName: "chunk-pitch-base-2" */ 'pitch-base-module2'),
      import(/* webpackChunkName: "chunk-pitch-base-3" */ 'pitch-base-module3'),
      import(/* webpackChunkName: "chunk-pitch-base-4" */ 'pitch-base-module4'),
      import(/* webpackChunkName: "chunk-pitch-base-5" */ 'pitch-base-module5')
    ]).then((modules) => modules[0].PitchBaseDefinitionsViewModel);

    return PitchBaseDefinitionsViewModel;
  }

  static createProperties(inputs) {
    const levelsProperty = new LevelsProperty('linetoolpitchfan', inputs, false, {
      range: [0, 8]
    });

    this._configureProperties(levelsProperty);

    return levelsProperty;
  }

  static _configureProperties(levelsProperty) {
    super._configureProperties(levelsProperty);

    const lineWidths = [levelsProperty.child('median').child('linewidth')];
    const lineColors = [levelsProperty.child('median').child('color')];

    for (let level = 0; level <= this.LevelsCount; level++) {
      lineWidths.push(levelsProperty.child(`level${level}`).child('linewidth'));
      lineColors.push(levelsProperty.child(`level${level}`).child('color'));
    }

    levelsProperty.addChild('linesColors', new LineToolColorsProperty(lineColors));
    levelsProperty.addChild('linesWidths', new LineToolWidthsProperty(lineWidths));
  }
}

LineToolPitchfan.LevelsCount = 8;

export { LineToolPitchfan };
