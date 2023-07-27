

"use strict";

function visitObject(e, t, i) {
  const visit = (obj, transformer, visitor) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        const transformed = visit(item, transformer, visitor);
        const visited = transformer(transformed);
        return (visited !== undefined) ? visited : transformed;
      });
    } else if (typeof obj === 'object' && (obj !== null) && ((obj.constructor === Object) || (i && i.visitInstances))) {
      const result = {};
      Object.keys(obj).forEach((key) => {
        const transformed = visit(obj[key], transformer, visitor);
        const visited = transformer(transformed);
        result[key] = (visited !== undefined) ? visited : transformed;
      });
      return result;
    } else {
      return obj;
    }
  };

  const transformed = visit(e, t, i);
  const visited = t(transformed);
  return (visited !== undefined) ? visited : transformed;
}

