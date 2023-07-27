class StatusView {
  constructor(e) {
    this._text = "";
    this._color = "";
    this._size = "13px";
    this._bold = false;
    this._statusProvider = statusProvider;
  }

  text() {
    return this._text;
  }
  getSplitTitle() {
    return [this._text];
  }
  color() {
    return this._statusProvider.color();
  }
  bold() {
    return this._bold;
  }
  size() {
    return this._size;
  }
}

export { StatusView };
