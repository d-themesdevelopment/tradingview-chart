

(e, t, i) => {
    "use strict";
    i.d(t, {
      LineToolIcon: () => a
    });
  
    const s = i(46100);
    const r = i(68806);
    const n = i(8459);
    const { getLogger } = i(59224);
    const logger = getLogger("Chart.LineToolIcon");
  
    class a extends n.LineToolSvgIconBase {
      constructor(e, t, i, s) {
        super(e, t || a.createProperties(), i, s);
        this.version = 1;
        this._loadViews();
      }
  
      name() {
        return "Icon";
      }
  
      applyTemplate(e) {
        delete e.icon;
        super.applyTemplate(e);
      }
  
      static createProperties(e) {
        const t = new s.DefaultProperty("linetoolicon", e);
        a._configureProperties(t);
        return t;
      }
  
      _getPropertyDefinitionsViewModelClass() {
        return Promise.all([
          i.e(7201),
          i.e(3753),
          i.e(5871),
          i.e(8167),
          i.e(8537)
        ]).then(i.bind(i, 53284)).then(e => e.IconsDefinitionsViewModel);
      }
  
      async _loadViews() {
        const [
          { getSvgContentForCharCode, getSvgRenderer },
          { IconPaneView },
          { svgRenderer }
        ] = await Promise.all([
          i.e(7987).then(i.bind(i, 1383)),
          i.e(1583).then(i.bind(i, 48273)),
          i.e(2616).then(i.bind(i, 50765))
        ]);
  
        if (!this._isDestroyed) {
          const icon = this._properties.childs().icon.value();
          this._svgContent = getSvgContentForCharCode(icon);
          this._onIconChanged.fire();
  
          const svgRenderer = getSvgRenderer(svgRenderer, icon);
          if (svgRenderer === null) {
            logger.logWarn(`Couldn't create svg renderer for icon ${icon}`);
          }
  
          this._setPaneViews([new IconPaneView(this, this._model, svgRenderer)]);
        }
      }
  
      static _configureProperties(e) {
        super._configureProperties(e);
        e.addChild("backgroundsColors", new r.LineToolColorsProperty([e.childs().color]));
      }
    }
  
    return a;
  };
  