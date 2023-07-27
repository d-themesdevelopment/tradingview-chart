class CustomSourceBase {
    constructor(id, model) {
      this._id = id;
      this._model = model;
    }
  
    id() {
      return this._id;
    }
  
    isHoveredEnabled() {
      return true;
    }
  
    isSelectionEnabled() {
      return false;
    }
  
    priceScale() {
      return null;
    }
  
    paneViews(e) {
      return [];
    }
  
    labelPaneViews(e) {
      return [];
    }
  
    priceAxisViews(e, t) {
      return [];
    }
  
    updateViewsForPane(e, t) {
      if (e.containsMainSeries()) {
        this.updateAllViews(t);
      }
    }
  }

