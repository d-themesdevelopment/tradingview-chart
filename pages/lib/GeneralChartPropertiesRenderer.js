const { DialogRenderer } = require('85067');

class GeneralChartPropertiesRenderer extends DialogRenderer {
  constructor(chartWidgetCollection) {
    super();
    this._dialog = null;
    this._subscribe = (e) => {
      this._setVisibility(e);
    };
    this._chartWidgetCollection = chartWidgetCollection;
  }

  show(e) {
    const chartWidgetCollection = this._chartWidgetCollection;
    const activeChartWidget = chartWidgetCollection.activeChartWidget.value();
    return activeChartWidget.generalPropertiesDefinitions().then((definitions) => {
      return Promise.all([
        require.e(77),
        require.e(2666),
        require.e(1013),
        require.e(3842),
        require.e(5145),
        require.e(855),
        require.e(6),
        require.e(5993),
        require.e(5649),
        require.e(2191),
        require.e(6221),
        require.e(8056),
        require.e(2587),
        require.e(3502),
        require.e(8149),
        require.e(2639),
        require.e(2109),
        require.e(4015),
        require.e(4215),
        require.e(218),
        require.e(6625),
        require.e(9327),
        require.e(7194),
        require.e(6884),
        require.e(6036),
        require.e(2984),
        require.e(3980),
        require.e(5403),
        require.e(7350),
        require.e(7871),
        require.e(962),
        require.e(2842),
        require.e(9727),
        require.e(4403),
        require.e(4713),
        require.e(5901),
        require.e(1958),
        require.e(7078),
      ]).then(require.bind(null, 72811)).then((GeneralChartPropertiesDialogRenderer) => {
        const dialogRenderer = new GeneralChartPropertiesDialogRenderer({
          chartWidgetCollection: chartWidgetCollection,
          propertyPages: definitions,
          activePageId: this._activePageId,
          model: activeChartWidget.model(),
        });
        if (this._dialog !== null) {
          this._dialog.hide();
        }
        if (this._dialog !== null) {
          this._dialog.visible().unsubscribe(this._subscribe);
        }
        this._dialog = dialogRenderer;
        dialogRenderer.visible().subscribe(this._subscribe);
        dialogRenderer.show(e);
        this._activePageId = undefined;
        return dialogRenderer;
      });
    });
  }

  hide() {
    if (this._dialog !== null) {
      this._dialog.hide();
    }
  }

  isVisible() {
    return this.visible().value();
  }

  focusOnText() {}

  setActivePage(pageId) {
    this._activePageId = pageId;
  }
}

module.exports = {
  GeneralChartPropertiesRenderer,
};

