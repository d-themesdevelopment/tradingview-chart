function clearStyle(style) {
    style.lineWidth = undefined;
    style.lineStyle = undefined;
    for (let t = 0; t < style.colors.length; t++) {
      style.colors[t] = undefined;
    }
    return style;
  }
  
  function createEmptyStyle() {
    return {
      colors: [undefined, undefined, undefined, undefined, undefined, undefined, undefined],
      lineWidth: undefined,
      lineStyle: undefined
    };
  }
  