import { LineDataSource } from 'path/to/lineDataSource';
import { DefaultProperty } from 'path/to/defaultProperty';

class LineToolCircleLines extends LineDataSource {
  constructor(chartApi, properties, source, priceScale) {
    super(chartApi, properties || LineToolCircleLines.createProperties(), source, priceScale);
    import(1583).then(({ LineToolCircleLinesPaneView }) => {
      this.setPaneViews([new LineToolCircleLinesPaneView(this, this._model)]);
    });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Cyclic Lines";
  }

  async getPropertyDefinitionsViewModelClass() {
    const [
      PropertyDefinitionsViewModelBase,
      DrawingStyleProperty,
      FillBackgroundProperty,
      TransparencyProperty,
      LineStyleProperty,
    ] = await Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537),
    ]);
    return CyclicAndSineLinesPatternDefinitionsViewModel;
  }

  static createProperties(defaults) {
    const properties = new DefaultProperty("linetoolcirclelines", defaults);
    this.configureProperties(properties);
    return properties;
  }

  static configureProperties(properties) {
    // Configure properties here
  }
}

export { LineToolCircleLines };
