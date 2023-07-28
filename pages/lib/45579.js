import { DefaultProperty } from "propertyUtils";
import { LineDataSource } from "dataSource";
import { LineToolColorsProperty } from "lineToolProperties";
import { LineToolTrianglePatternPaneView } from "lineToolViews";

class LineToolTrianglePattern extends LineDataSource {
  constructor(chartModel, properties, options, renderer) {
    const defaultProperties =
      properties || LineToolTrianglePattern.createProperties();
    super(chartModel, defaultProperties, options, renderer);
    import("./LineToolTrianglePatternPaneView").then(
      ({ LineToolTrianglePatternPaneView }) => {
        this._setPaneViews([
          new LineToolTrianglePatternPaneView(this, chartModel),
        ]);
      }
    );
  }

  pointsCount() {
    return 4;
  }

  name() {
    return "Triangle Pattern";
  }

  static createProperties(properties) {
    const defaultProp = new DefaultProperty(
      "linetooltrianglepattern",
      properties
    );
    this._configureProperties(defaultProp);
    return defaultProp;
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.childs().color])
    );
    properties.addChild(
      "textsColors",
      new LineToolColorsProperty([properties.childs().textcolor])
    );
    properties.addChild(
      "backgroundsColors",
      new LineToolColorsProperty([properties.childs().backgroundColor])
    );
  }
}

export { LineToolTrianglePattern };
