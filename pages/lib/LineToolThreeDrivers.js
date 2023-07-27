//r = i(13087),

  const { LineDataSource, DefaultProperty } = i(46100);
  const { LineToolColorsProperty, LineToolWidthsProperty } = i(68806);

  class LineToolThreeDrivers extends LineDataSource {
    constructor(e, t, s, r) {
      const properties = t || LineToolThreeDrivers.createProperties();
      super(e, properties, s, r);
      i.e(1583)
        .then(i.bind(i, 90042))
        .then((lineToolModule) => {
          this._setPaneViews([new lineToolModule.LineToolThreeDrivesPaneView(this, e)]);
        });
    }

    pointsCount() {
      return 7;
    }

    name() {
      return "Three Drives Pattern";
    }

    static createProperties(e) {
      const property = new DefaultProperty("linetoolthreedrivers", e);
      LineToolThreeDrivers._configureProperties(property);
      return property;
    }

    _getPropertyDefinitionsViewModelClass() {
      return Promise.all([
        i.e(7201),
        i.e(3753),
        i.e(5871),
        i.e(8167),
        i.e(8537),
      ])
        .then(i.bind(i, 63311))
        .then((viewModelModule) => viewModelModule.PatternWithoutBackgroundDefinitionsViewModel);
    }

    static _configureProperties(property) {
      LineDataSource._configureProperties(property);
      property.addChild("linesColors", new LineToolColorsProperty([property.childs().color]));
      property.addChild("textsColors", new LineToolColorsProperty([property.childs().textcolor]));
      property.addChild("linesWidths", new LineToolWidthsProperty([property.childs().linewidth]));
      if (property.hasChild("backgroundsColors")) {
        property.removeProperty("backgroundsColors");
      }
    }
  }
