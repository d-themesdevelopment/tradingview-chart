

const DialogRenderer = require(85067).DialogRenderer;
const eventEmitter = require(76422);

class CompareDialogRenderer extends DialogRenderer {
  constructor(chartWidgetCollection) {
    super();
    this._dialog = null;
    this._chartWidgetCollection = chartWidgetCollection;
    this._subscribe = (isVisible) => {
      this._setVisibility(isVisible);
    };
  }

  show(options) {
    this._load().then((dialog) => {
      if (this._dialog) {
        this._dialog.hide();
        this._dialog.visible().unsubscribe(this._subscribe);
      }
      this._dialog = dialog;
      dialog.visible().subscribe(this._subscribe);
      dialog.show(options);
      eventEmitter.emit("compare_add");
    });
  }

  hide() {
    if (this._dialog) {
      this._dialog.hide();
    }
  }

  _load() {
    return Promise.all([
      import(/* webpackChunkName: "compare" */ 56217),
      Promise.all([
        import(/* webpackChunkName: "compare" */ 2666),
        import(/* webpackChunkName: "compare" */ 1013),
        import(/* webpackChunkName: "compare" */ 5145),
        import(/* webpackChunkName: "compare" */ 855),
        import(/* webpackChunkName: "compare" */ 6),
        import(/* webpackChunkName: "compare" */ 5993),
        import(/* webpackChunkName: "compare" */ 5649),
        import(/* webpackChunkName: "compare" */ 8056),
        import(/* webpackChunkName: "compare" */ 2587),
        import(/* webpackChunkName: "compare" */ 3502),
        import(/* webpackChunkName: "compare" */ 2639),
        import(/* webpackChunkName: "compare" */ 2109),
        import(/* webpackChunkName: "compare" */ 4015),
        import(/* webpackChunkName: "compare" */ 218),
        import(/* webpackChunkName: "compare" */ 6949),
        import(/* webpackChunkName: "compare" */ 5163),
        import(/* webpackChunkName: "compare" */ 962),
        import(/* webpackChunkName: "compare" */ 2842),
        import(/* webpackChunkName: "compare" */ 3016),
        import(/* webpackChunkName: "compare" */ 9727),
        import(/* webpackChunkName: "compare" */ 731),
      ]).then(([compareModule]) => {
        const compareModel = new compareModule.CompareModel(this._chartWidgetCollection);
        return compareModule.getCompareDialogRenderer(compareModel);
      }),
    ]);
  }
}

module.exports = {
  CompareDialogRenderer,
};
