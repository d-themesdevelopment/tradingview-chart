

export class GraphicsListColl {
    constructor() {
      this._stable = [];
      this._variable = null;
      this._owner = null;
    }
    
    addStable(e) {
      e.setOwner(this);
      this._stable.push(e);
    }
    
    setVariable(e) {
      this._variable = e;
      if (this._variable !== null) {
        this._variable.setOwner(this);
      }
    }
    
    primitivesData(e) {
      const t = [];
      this._forEach((i) => t.push(...i.primitivesData(e)));
      return t;
    }
    
    deleteErasedItems() {
      this._forEach((e) => e.deleteErasedItems());
    }
    
    markPostedItems() {
      this._forEach((e) => e.markPostedItems());
    }
    
    isNaN() {
      return this._all((e) => e.isNaN());
    }
    
    dirty() {
      if (this._owner !== null) {
        this._owner.dirty();
      }
    }
    
    setOwner(e) {
      this._owner = e;
    }
    
    _forEach(e) {
      for (const t of this._stable) {
        e(t);
      }
      
      if (this._variable !== null) {
        e(this._variable);
      }
    }
    
    _all(e) {
      for (const t of this._stable) {
        if (!e(t)) {
          return false;
        }
      }
      
      return this._variable === null || e(this._variable);
    }
  }
