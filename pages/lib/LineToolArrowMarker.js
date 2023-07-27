import { LineDataSource } from '<path_to_LineDataSource_module>';
import { DefaultProperty } from '<path_to_DefaultProperty_module>';

export class LineToolArrowMarker extends LineDataSource {
  constructor(model, points, id, palette) {
    super(model, points || LineToolArrowMarker.createProperties(), id, palette);

    import('<path_to_ArrowMarkerPaneView_module>').then((module) => {
      this._setPaneViews([new module.ArrowMarkerPaneView(this, this.model())]);
    });
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Trend Line";
  }

  static createProperties() {
    const properties = new DefaultProperty("linetoolarrowmarker");
    this._configureProperties(properties);
    return properties;
  }

  _getPropertyDefinitionsViewModelClass() {
    return Promise.all([
      import('<path_to_Module1_module>'),
      import('<path_to_Module2_module>'),
      import('<path_to_Module3_module>'),
      import('<path_to_Module4_module>'),
      import('<path_to_Module5_module>')
    ]).then((modules) => {
      return modules[0].ArrowMarkerDefinitionsViewModel;
    });
  }

  static _configureProperties(properties) {
    super._configureProperties(properties);
    if (!properties.hasChild("text")) {
      properties.addChild("text", new (import('<path_to_TextProperty_module>'))(""));
    }
    properties.addExclusion("text");
  }
}