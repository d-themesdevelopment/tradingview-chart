import { LineDataSource } from "<path_to_LineDataSource_module>";
import { DefaultProperty } from "<path_to_DefaultProperty_module>";

export class LineToolCircleLines extends LineDataSource {
  constructor(model, priceScale, timeScale, properties) {
    super(
      model,
      properties || LineToolCircleLines.createProperties(),
      priceScale,
      timeScale
    );
    import(
      /* webpackChunkName: "LineToolCircleLinesPaneView" */ "<path_to_LineToolCircleLinesPaneView_module>"
    ).then(({ LineToolCircleLinesPaneView }) => {
      this._setPaneViews([new LineToolCircleLinesPaneView(this, this._model)]);
    });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Cyclic Lines";
  }

  async _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import(
        /* webpackChunkName: "cyclicAndSineLinesPatternDefinitionsViewModel" */ "<path_to_cyclicAndSineLinesPatternDefinitionsViewModel_module>"
      ),
    ]).then((i) => i[0].CyclicAndSineLinesPatternDefinitionsViewModel);
  }

  static createProperties(properties) {
    const defaultProperty = new DefaultProperty(
      "linetoolcirclelines",
      properties
    );

    this._configureProperties(defaultProperty);

    return defaultProperty;
  }
}
