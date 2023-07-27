import { TranslatedString } from '36298';
import { LineDataSource } from '13087';
import { LevelsProperty } from '53801';
import { Action, ACTION_ID } from '39347';
import { LineToolPitchforkStyle } from '90095';
import { LineToolWidthsProperty, LineToolColorsProperty } from '68806';
import { t } from '44352';

const eraseLevelLineString = new TranslatedString('erase level line', t(null, void 0, 12962));
const changeStyleString = new TranslatedString('change {title} style', t(null, void 0, 74428));

let c = null;

class LineToolPitchfork extends LineDataSource {
  constructor(source, model, properties, options) {
    super(source, properties || LineToolPitchfork.createProperties(), model, options);
    this._properties.style.listeners().subscribe(this, this._recreatePaneView);
    this._recreatePaneView();
  }

  levelsCount() {
    return LineToolPitchfork.LevelsCount;
  }

  additionalActions(actionsContext) {
    const actions = [];
    const actionDefinitions = [
      {
        title: t(null, void 0, 25595),
        actionId: ACTION_ID.ChartLineToolPitchforkChangeTypeToOriginal,
      },
      {
        title: t(null, void 0, 66276),
        actionId: ACTION_ID.ChartLineToolPitchforkChangeTypeToModifiedSchiff,
      },
      {
        title: t(null, void 0, 9114),
        actionId: ACTION_ID.ChartLineToolPitchforkChangeTypeToInside,
      },
      {
        title: t(null, void 0, 51464),
        actionId: ACTION_ID.ChartLineToolPitchforkChangeTypeToSchiff,
      },
    ];

    for (let i = 0; i < 4; i++) {
      const action = new Action({
        actionId: actionDefinitions[i].actionId,
        checked: this.properties().style.value() === i,
        checkable: true,
        label: actionDefinitions[i].title,
        payload: {
          target: this,
          value: i,
        },
        onExecute: (payload) => {
          const { target, value } = payload.getPayload();
          const styleProperty = target.properties().style;
          styleProperty.setValue(value);
          actionsContext.setProperty(styleProperty, value, changeStyleString.format({ title: new TranslatedString(target.name(), target.title()) }));
          target.updateAllViews();
          target._model.updateSource(target);
        },
      });
      actions.push(action);
    }

    return [actions[0], actions[3], actions[1], actions[2]];
  }

  _recreatePaneView() {
    if (c !== null) {
      let paneViews = [];
      const styleValue = this._properties.style.value();

      if (styleValue === LineToolPitchforkStyle.Original) {
        paneViews = [new c.PitchforkLinePaneView(this, this._model)];
      } else if (styleValue === LineToolPitchforkStyle.Schiff) {
        paneViews = [new c.SchiffPitchforkLinePaneView(this, this._model)];
      } else if (styleValue === LineToolPitchforkStyle.Schiff2) {
        paneViews = [new c.SchiffPitchfork2LinePaneView(this, this._model)];
      } else if (styleValue === LineToolPitchforkStyle.Inside) {
        paneViews = [new c.InsidePitchforkLinePaneView(this, this._model)];
      }

      this._setPaneViews(paneViews);
    } else {
      i.e(1583).then(i.bind(i, 95337)).then((module) => {
        if (c === null) {
          c = module;
          this._recreatePaneView();
        }
      });
    }
  }

  pointsCount() {
    return 3;
  }

  name() {
    return 'Pitchfork';
  }

  processErase(source, level) {
    const levelProperty = `level${level}`;
    const visibleProperty = this.properties()[levelProperty].visible;
    source.setProperty(visibleProperty, false, eraseLevelLineString);
  }

  static createProperties() {
    const properties = new LevelsProperty('linetoolpitchfork', false, { range: [0, 8] });
    LineToolPitchfork._configureProperties(properties);
    return properties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const viewModelModule = await Promise.all([
      i.e(7201),
      i.e(3753),
      i.e(5871),
      i.e(8167),
      i.e(8537),
    ]).then(i.bind(i, 769));
    return viewModelModule.PitchForkDefinitionsViewModel;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    const lineWidthProperties = [properties.child('median').child('linewidth')];
    const colorProperties = [properties.child('median').child('color')];

    for (let i = 0; i <= LineToolPitchfork.LevelsCount; i++) {
      lineWidthProperties.push(properties.child(`level${i}`).child('linewidth'));
      colorProperties.push(properties.child(`level${i}`).child('color'));
    }

    properties.addChild('linesColors', new LineToolColorsProperty(colorProperties));
    properties.addChild('linesWidths', new LineToolWidthsProperty(lineWidthProperties));
  }
}

LineToolPitchfork.LevelsCount = 8;

export {
  LineToolPitchfork
};