import { DefaultProperty } from "./46100"; // Replace 'some-module' with the actual module path
import { ensureNotNull } from "./assertions"; // Replace 'another-module' with the actual module path
import { LineDataSource } from "./13087"; // Replace 'line-data-source-module' with the actual module path
import { LineToolColorsProperty, LineToolWidthsProperty } from "./68806"; // Replace 'line-tool-properties-module' with the actual module path

export class LineToolCircle extends LineDataSource {
  constructor(chartWidget, properties, source, model) {
    const defaultProps = properties || LineToolCircle.createProperties();
    super(chartWidget, defaultProps, source, model);
    import(
      /* webpackChunkName: "circlePaneView" */ "circle-pane-view-module"
    ).then(({ CirclePaneView }) => {
      const paneViews = [new CirclePaneView(this, chartWidget)];
      this._setPaneViews(paneViews);
    });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Circle";
  }

  template() {
    const template = super.template();
    template.text = this.properties().childs().text.value();
    return template;
  }

  static createProperties(defaults) {
    const properties = new DefaultProperty("linetoolcircle", defaults);
    LineToolCircle._configureProperties(properties);
    return properties;
  }

  async _getPropertyDefinitionsViewModelClass() {
    const [module1, module2, module3, module4, module5] = await Promise.all([
      import(/* webpackChunkName: "module1" */ "module1-path"),
      import(/* webpackChunkName: "module2" */ "module2-path"),
      import(/* webpackChunkName: "module3" */ "module3-path"),
      import(/* webpackChunkName: "module4" */ "module4-path"),
      import(/* webpackChunkName: "module5" */ "module5-path"),
    ]);
    return module5.EllipseCircleDefinitionsViewModel;
  }

  _snapTo45DegreesAvailable() {
    return true;
  }

  _applyTemplateImpl(properties) {
    super._applyTemplateImpl(properties);
    this.properties().childs().text.setValue(properties.text);
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild("text", new (ensureNotNull("module6-path"))(""));
    }
    properties.addChild(
      "linesColors",
      new LineToolColorsProperty([properties.childs().color])
    );
    properties.addChild(
      "linesWidths",
      new LineToolWidthsProperty([properties.childs().linewidth])
    );
    properties.addChild(
      "backgroundsColors",
      new LineToolColorsProperty([properties.childs().backgroundColor])
    );
    properties.addChild(
      "textsColors",
      new LineToolColorsProperty(
        [properties.childs().textColor],
        properties.childs().showLabel
      )
    );
    properties.addExclusion("linesColors");
    properties.addExclusion("linesWidths");
    properties.addExclusion("backgroundsColors");
    properties.addExclusion("text");
  }
}
