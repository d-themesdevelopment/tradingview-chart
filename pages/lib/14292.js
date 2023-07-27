"use strict";

var s = i(58275);
var r = i.n(s);
var n = i(36174);
var o = i(57898);
var a = i.n(o);

class DataSource {
  constructor(id) {
    this.hasAlert = new (r())(false);
    this._zorder = 0;
    this.m_priceScale = null;
    this._ownerSource = null;
    this._userEditEnabled = true;
    this._onPriceScaleChanged = new (a())();
    this._isSelectionEnabled = true;
    this._instanceId = (0, n.randomHashN)(6);
    this._ownerSourceChanged = new (a())();
    this._zOrderChanged = new (a())();
    this._id = id != null ? id : (0, n.randomHashN)(6);
  }

  id() {
    return this._id;
  }

  instanceId() {
    return this._instanceId;
  }

  preferNoScale() {
    return false;
  }

  setId(id) {
    this._id = id;
  }

  zorder() {
    return this._zorder;
  }

  setZorder(zorder) {
    if (typeof zorder === "number" && this._zorder !== zorder) {
      this._zorder = zorder;
      this._zOrderChanged.fire(zorder);
    }
  }

  preferredZOrder() {
    return null;
  }

  isSpeciallyZOrderedSource() {
    return false;
  }

  title() {
    throw new Error("Implement this fun in a subclass");
  }

  name() {
    throw new Error("Implement this fun in a subclass");
  }

  priceScale() {
    return this.m_priceScale;
  }

  setPriceScale(priceScale) {
    this.m_priceScale = priceScale;
    this._onPriceScaleChanged.fire();
  }

  ownerSource() {
    return this._ownerSource;
  }

  setOwnerSource(ownerSource) {
    const prevOwnerSource = this._ownerSource;
    this._ownerSource = ownerSource;
    this._ownerSourceChanged.fire(prevOwnerSource, ownerSource);
  }

  ownerSourceChanged() {
    return this._ownerSourceChanged;
  }

  zOrderChanged() {
    return this._zOrderChanged;
  }

  isSavedInChart() {
    return true;
  }

  isSavedInStudyTemplates() {
    return true;
  }

  isRemovedByStudyTemplates() {
    return true;
  }

  hasContextMenu() {
    return true;
  }

  showInObjectTree() {
    return true;
  }

  setUserEditEnabled(userEditEnabled) {
    this._userEditEnabled = userEditEnabled;
  }

  userEditEnabled() {
    return this._userEditEnabled;
  }

  canBeHidden() {
    return this.userEditEnabled();
  }

  isUserDeletable() {
    return this.userEditEnabled();
  }

  properties() {
    throw new Error("Implement this fun in a subclass");
  }

  isVisible() {
    return this.properties().visible.value();
  }

  dataWindowView() {
    return null;
  }

  priceAxisViews() {
    return null;
  }

  timeAxisViews() {
    return null;
  }

  updateAllViews() {}

  paneViews() {
    return null;
  }

  labelPaneViews() {
    return null;
  }

  isFailed() {
    return false;
  }

  isLoading() {
    return false;
  }

  isPhantom() {
    return false;
  }

  isChildStudy() {
    return false;
  }

  hasChildren() {
    return false;
  }

  canHaveChildren() {
    return false;
  }

  onClickOutside() {}

  getSourceIcon() {
    return null;
  }

  state() {
    throw new Error("Implement this fun in a subclass");
  }

  onPriceScaleChanged() {
    return this._onPriceScaleChanged;
  }

  doesMovingAffectsUndo() {
    return true;
  }

  isMultiPaneAvailable() {
    return false;
  }

  isMultiPaneEnabled() {
    return false;
  }

  copiable() {
    return false;
  }

  cloneable() {
    return false;
  }

  movable() {
    return false;
  }

  isIncludedInAutoScale() {
    return false;
  }

  isHoveredEnabled() {
    return this.isSelectionEnabled();
  }

  showOnTopOnHovering() {
    return true;
  }

  isSelectionEnabled() {
    return this._isSelectionEnabled;
  }

  setSelectionEnabled(selectionEnabled) {
    this._isSelectionEnabled = selectionEnabled;
  }

  firstValue() {
    return null;
  }

  priceRange() {
    return null;
  }

  autoScaleInfo() {
    return {
      range: this.priceRange(),
    };
  }

  stateForAlert() {
    return null;
  }

  canHasAlert() {
    return false;
  }

  alertCreationAvailable() {
    return new (r())(this.hasStateForAlert()).readonly();
  }

  hasStateForAlert() {
    return false;
  }

  idForAlert() {
    return this._id;
  }
}

export { DataSource };
