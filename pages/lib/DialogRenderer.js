import { writable } from 'svelte/store';

export class DialogRenderer {
  constructor() {
    this._container = document.createElement("div");
    this._visibility = writable(false);
    //this._visibility = new(r())(!1)
  }
  
  visible() {
    return this._visibility
  }
  
  _setVisibility(value) {
    this._visibility.set(value);
  }
}