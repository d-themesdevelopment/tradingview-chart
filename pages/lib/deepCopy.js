function deepCopy(obj) {
    let copy;
  
    if (typeof obj !== "object" || obj === null || typeof obj.nodeType === "number") {
      copy = obj;
    } else if (obj instanceof Date) {
      copy = new Date(obj.valueOf());
    } else if (Array.isArray(obj)) {
      copy = [];
      let i = 0;
      const length = obj.length;
      for (; i < length; i++) {
        if (Object.prototype.hasOwnProperty.call(obj, i)) {
          copy[i] = deepCopy(obj[i]);
        }
      }
    } else {
      copy = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          copy[key] = deepCopy(obj[key]);
        }
      }
    }
  
    return copy;
  }
