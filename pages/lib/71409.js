

export function isStudyGraphicsEmpty(graphics) {
    const graphicTypes = [
      "horizlines",
      "vertlines",
      "lines",
      "hlines",
      "textmarks",
      "shapemarks",
      "backgrounds",
      "polygons",
      "trendchannels",
      "hhists",
      "dwglabels",
      "dwglines",
      "dwgboxes",
      "dwgtables",
      "dwgtablecells",
      "dwglinefills",
      "tpos",
      "tpoBlockSets",
      "tpoLevels",
      "tpoVolumeRows"
    ];
  
    return !graphicTypes.some((type) => graphics[type]().size > 0);
  }
  
  export const primitivesZOrders = new Map([
    ["polygons", -4],
    ["trendchannels", -3],
    ["textmarks", -2],
    ["shapemarks", -2],
    ["backgrounds", -1],
    ["hlines", 1],
    ["horizlines", 1],
    ["hhists", 1],
    ["dwglinefills", 2],
    ["vertlines", 3],
    ["lines", 3],
    ["dwglines", 3],
    ["dwgboxes", 4],
    ["dwglabels", 5],
    ["dwgtables", 6],
    ["dwgtablecells", 6],
    ["tpos", 7],
    ["tpoBlockSets", 7],
    ["tpoLevels", 7],
    ["tpoVolumeRows", 7]
  ]);
  
  export function splitHHistsByTimePointIndex(hhists) {
    const result = new Map();
  
    hhists.forEach((hhist, styleId) => {
      hhist.forEach((item) => {
        const newItem = {
          ...item,
          styleId: styleId
        };
        const firstBarTime = item.firstBarTime;
  
        let set = result.get(firstBarTime);
        if (set === undefined) {
          set = new Set();
          result.set(firstBarTime, set);
        }
  
        set.add(newItem);
      });
    });
  
    return result;
  }