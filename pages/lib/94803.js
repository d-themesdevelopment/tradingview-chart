"use strict";

export class LineToolSineLine extends LineDataSource {
  constructor(e, t, s, r) {
    super(e, t || LineToolSineLine.createProperties(), s, r);
    import(
      /* webpackChunkName: "sine-line-pane-view" */ "./sine-line-pane-view"
    ).then((module) => {
      const SineLinePaneView = module.default;
      this._setPaneViews([new SineLinePaneView(this, this._model)]);
    });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Sine Line";
  }

  static createProperties(e) {
    const t = new DefaultProperty("linetoolsineline", e);
    this._configureProperties(t);
    return t;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const modulePromises = [
      import(
        /* webpackChunkName: "cyclic-and-sine-lines-pattern-definitions-view-model" */ "./cyclic-and-sine-lines-pattern-definitions-view-model"
      ),
      import(/* webpackChunkName: "module2" */ "module2"),
      import(/* webpackChunkName: "module3" */ "module3"),
      import(/* webpackChunkName: "module4" */ "module4"),
      import(/* webpackChunkName: "module5" */ "module5"),
    ];
    const [CyclicAndSineLinesPatternDefinitionsViewModel] = await Promise.all(
      modulePromises
    );
    return CyclicAndSineLinesPatternDefinitionsViewModel;
  }
}
