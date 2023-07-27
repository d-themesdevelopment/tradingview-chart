

import { LineToolBrushBase } from '46235';
import { DefaultProperty } from '46100';
import { e } from '<some module>';

class LineToolHighlighter extends LineToolBrushBase {
  constructor(model, options, paneIndex, controlBar) {
    super(model, options || LineToolHighlighter.createProperties(), paneIndex, controlBar);
    this._loadPaneViews(model);
  }

  smooth() {
    return this.properties().childs().smooth.value();
  }

  name() {
    return 'Highlighter';
  }

  static createProperties(options) {
    const properties = new DefaultProperty('linetoolhighlighter', options);
    this._configureProperties(properties);
    return properties;
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([e(7201), e(3753), e(5871), e(8167), e(8537)]).then(bind(this, 63138)).then((viewModel) => viewModel.HighlighterDefinitionsViewModel);
  }

  _loadPaneViews(model) {
    e(1583).then(bind(this, 75427)).then((module) => {
      this._setPaneViews([new module.HighlighterPaneView(this, model)]);
    });
  }
}

export { LineToolHighlighter };
