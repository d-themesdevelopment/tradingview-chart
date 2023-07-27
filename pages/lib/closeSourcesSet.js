"use strict";

function getAllDescendants(e, t) {
  let i = [];
  const children = e.children(t, false);
  for (let t = 0; t < children.length; t++) {
    i = i.concat(getAllDescendants(e, children[t]));
  }
  i.push(t);
  return i;
}

function closeSourcesSet(e, sources) {
  const visited = new Set();
  const traverse = (source) => {
    e.children(source, false).forEach((child) => {
      if (!visited.has(child)) {
        visited.add(child);
        traverse(child);
      }
    });
  };
  sources.forEach(traverse);
  return sources.filter((source) => !visited.has(source)).map((source) => getAllDescendants(e, source)).reduce((acc, arr) => acc.concat(arr), []);
}
