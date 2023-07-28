var s = i(46100),
  r = i(8459);

const getLogger = (name) => (0, i(59224).getLogger)(name);

export class LineToolSticker extends r.LineToolSvgIconBase {
  constructor(e, t, i, s) {
    super(e, t || o.createProperties(), i, s);
    this.version = 1;
    this._loadViews();
  }

  name() {
    return "Sticker";
  }

  static createProperties(e) {
    const t = new s.DefaultProperty("linetoolsticker", e);
    o._configureProperties(t);
    return t;
  }

  async _getPropertyDefinitionsViewModelClass() {
    return (
      await Promise.all([
        i.e(7201),
        i.e(3753),
        i.e(5871),
        i.e(8167),
        i.e(8537),
      ]).then(i.bind(i, 85766))
    ).LineDataSourceDefinitionsViewModel;
  }

  async _loadViews() {
    const [
      { getSvgContentForSticker: e, getSvgRenderer: t },
      { StickerPaneView: s },
      { svgRenderer: r },
    ] = await Promise.all([
      i.e(5598).then(i.bind(i, 31235)),
      i.e(1583).then(i.bind(i, 15378)),
      i.e(2616).then(i.bind(i, 50765)),
    ]);

    if (!this._isDestroyed) {
      const i = this._properties.childs().sticker.value();
      this._svgContent = e(i);
      this._onIconChanged.fire();

      const o = t(r, i);
      if (o === null) {
        getLogger("Chart.LineToolSticker").logWarn(
          `Couldn't create svg renderer for sticker ${i}`
        );
      }
      this._setPaneViews([new s(this, this._model, o)]);
    }
  }
}
