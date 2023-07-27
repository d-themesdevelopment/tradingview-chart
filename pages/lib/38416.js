(e, t, i) => {
    "use strict";
    const { LineDataSource } = i(13087);
    const { DefaultProperty, LineToolColorsProperty } = i(46100);
  
    class LineToolTriangle extends LineDataSource {
      constructor(e, t, s, r) {
        super(e, t || LineToolTriangle.createProperties(), s, r);
        i.e(1583)
          .then(i.t.bind(i, 97615, 19))
          .then(({ TrianglePaneView }) => {
            this._setPaneViews([new TrianglePaneView(this, this._model)]);
          });
      }
  
      pointsCount() {
        return 3;
      }
  
      name() {
        return "Triangle";
      }
  
      async _getPropertyDefinitionsViewModelClass() {
        const [
          module1,
          module2,
          module3,
          module4,
          module5
        ] = await Promise.all([
          i.e(7201),
          i.e(3753),
          i.e(5871),
          i.e(8167),
          i.e(8537)
        ]);
        return module1.GeneralFiguresDefinitionsViewModel;
      }
  
      static createProperties(e) {
        const properties = new DefaultProperty("linetooltriangle", e);
        LineToolTriangle._configureProperties(properties);
        return properties;
      }
  
      static _configureProperties(properties) {
        super._configureProperties(properties);
        properties.addChild("linesColors", new LineToolColorsProperty([properties.childs().color]));
      }
    }
  
    return { LineToolTriangle };
  }