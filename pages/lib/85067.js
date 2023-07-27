import { observable } from "mobx";

class DialogRenderer {
  constructor() {
    this.containerElement = document.createElement("div");
    this.visibility = new observable(false);
  }

  isVisible() {
    return this.visibility.readonly();
  }

  setVisibility(isVisible) {
    this.visibility.setValue(isVisible);
  }
}

export { DialogRenderer };
