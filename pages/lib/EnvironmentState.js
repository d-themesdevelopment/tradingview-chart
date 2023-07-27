
import { isMac } from 'some-module'; // Replace 'some-module' with the actual module name

export class EnvironmentState {
  constructor(e, t = false) {
    this._shift = false;
    this._mod = false;
    this._alt = false;
    
    if (typeof e !== 'undefined') {
      this._shift = Boolean(e.shiftKey);
      this._mod = Boolean(isMac() ? e.metaKey : e.ctrlKey);
      this._alt = Boolean(e.altKey);
    }
    
    this._isApiEvent = t;
  }
  
  shift() {
    return this._shift;
  }
  
  mod() {
    return this._mod;
  }
  
  alt() {
    return this._alt;
  }
  
  shiftOnly() {
    return this._shift && !this._mod && !this._alt;
  }
  
  modOnly() {
    return this._mod && !this._shift && !this._alt;
  }
  
  altOnly() {
    return this._alt && !this._shift && !this._mod;
  }
  
  modShift() {
    return this._shift && this._mod && !this._alt;
  }
  
  isApiEvent() {
    return this._isApiEvent;
  }
  
  static create(e = false, t = false, i = false) {
    return new EnvironmentState({
      shiftKey: e,
      ctrlKey: t,
      metaKey: t,
      altKey: i
    });
  }
}