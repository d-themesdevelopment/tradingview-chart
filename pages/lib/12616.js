"use strict";

// const { assert } = i(50151);
const {
  materializeVertLine,
  // dematerializeVertLine, isVertLineInBarsRange
} = require("./68696");

const {
  materializeHorizLine,
  // dematerializeHorizLine, isHorizLineInBarsRange
} = require("./34522");

const {
  materializePolygon,
  // dematerializePolygon, isPolygonInBarsRange
} = require("./80009");

const {
  materializeHHist,
  // dematerializeHHist, isHHistInBarsRange
} = require("./90164");

const {
  materializeBackground,
  // dematerializeBackground,
  // isBackgroundInBarsRange,
} = require("./93804");

const { splitHHistsByTimePointIndex } = require("./71409");

class StaticStudyGraphics {
  constructor(type, data) {
    this._indexes = [];
    this._horizlines = new Map();
    this._vertlines = new Map();
    this._lines = new Map();
    this._hlines = new Map();
    this._textmarks = new Map();
    this._shapemarks = new Map();
    this._backgrounds = new Map();
    this._polygons = new Map();
    this._trendchannels = new Map();
    this._hhists = new Map();
    this._dwglabels = new Map();
    this._dwglines = new Map();
    this._dwgboxes = new Map();
    this._dwgtables = new Map();
    this._dwgtablecells = new Map();
    this._dwglinefills = new Map();
    this._tpos = new Map();
    this._tpoBlockSets = new Map();
    this._tpoLevelGroups = new Map();
    this._tpoVolumeRows = new Map();

    if (type === "data") {
      const { indexes, vertlines, horizlines, polygons, hhists, backgrounds } =
        data;
      this._indexes = indexes;
      this._vertlines = materializeEntities(
        vertlines,
        this._indexes,
        materializeVertLine
      );
      this._horizlines = materializeEntities(
        horizlines,
        this._indexes,
        materializeHorizLine
      );
      this._polygons = materializeEntities(
        polygons,
        this._indexes,
        materializePolygon
      );
      this._hhists = materializeEntities(
        hhists,
        this._indexes,
        materializeHHist
      );
      this._backgrounds = materializeEntities(
        backgrounds,
        this._indexes,
        materializeBackground
      );
    } else if (type === "state") {
      const {
        indexes = [],
        vertlines,
        horizlines,
        polygons,
        hhists,
        backgrounds,
      } = data;
      this._indexes = indexes;
      this._vertlines = updateEntities(
        vertlines,
        this._indexes,
        materializeVertLine
      );
      this._horizlines = updateEntities(
        horizlines,
        this._indexes,
        materializeHorizLine
      );
      this._polygons = updateEntities(
        polygons,
        this._indexes,
        materializePolygon
      );
      this._hhists = updateEntities(hhists, this._indexes, materializeHHist);
      this._backgrounds = updateEntities(
        backgrounds,
        this._indexes,
        materializeBackground
      );
    }
    this._hhistsByTimePointIndex = splitHHistsByTimePointIndex(this._hhists);
  }

  horizlines() {
    return this._horizlines;
  }

  vertlines() {
    return this._vertlines;
  }

  lines() {
    return this._lines;
  }

  hlines() {
    return this._hlines;
  }

  textmarks() {
    return this._textmarks;
  }

  shapemarks() {
    return this._shapemarks;
  }

  backgrounds() {
    return this._backgrounds;
  }

  polygons() {
    return this._polygons;
  }

  trendchannels() {
    return this._trendchannels;
  }

  hhists() {
    return this._hhists;
  }

  dwglabels() {
    return this._dwglabels;
  }

  dwglines() {
    return this._dwglines;
  }

  dwgboxes() {
    return this._dwgboxes;
  }

  dwgtables() {
    return this._dwgtables;
  }

  dwgtablecells() {
    return this._dwgtablecells;
  }

  dwglinefills() {
    return this._dwglinefills;
  }

  tpos() {
    return this._tpos;
  }

  tpoBlockSets() {
    return this._tpoBlockSets;
  }

  tpoLevels() {
    return this._tpoLevelGroups;
  }

  tpoVolumeRows() {
    return this._tpoVolumeRows;
  }

  hhistsByTimePointIndex() {
    return this._hhistsByTimePointIndex;
  }
}

function materializeEntities(entities, indexes, materializeFn) {
  const entityMap = new Map();
  entities.forEach((entityData, styleId) => {
    const entitySet = entityMap.get(styleId) || new Set();
    entityData.forEach((entity) => {
      const materializedEntity = materializeFn(entity, indexes);
      if (materializedEntity !== null) {
        entitySet.add(materializedEntity);
      }
    });
    entityMap.set(styleId, entitySet);
  });
  return entityMap;
}

function updateEntities(entities, indexes, materializeFn) {
  const entityMap = new Map();
  if (entities === undefined) {
    return entityMap;
  }
  for (const entityData of entities) {
    const styleId = entityData.styleId;
    const entitySet = entityMap.get(styleId) || new Set();
    entityData.data.forEach((entity) => {
      const materializedEntity = materializeFn(entity, indexes);
      if (materializedEntity !== null) {
        entitySet.add(materializedEntity);
      }
    });
    entityMap.set(styleId, entitySet);
  }
  return entityMap;
}

function emptyStudyGraphics() {
  return new StaticStudyGraphics();
}

function loadStudyGraphics(state) {
  return new StaticStudyGraphics("state", state);
}

function saveStudyGraphics(graphics, bars) {
  const indexes = extractIndexes(graphics);

  const updatedVertlines = updateEntities(
    graphics.vertlines(),
    bars,
    materializeVertLine
  );

  const updatedHorizlines = updateEntities(
    graphics.horizlines(),
    bars,
    materializeHorizLine
  );

  const updatedPolygons = updateEntities(
    graphics.polygons(),
    bars,
    materializePolygon
  );

  const updatedHHists = updateEntities(
    graphics.hhists(),
    bars,
    materializeHHist
  );

  const updatedBackgrounds = updateEntities(
    graphics.backgrounds(),
    bars,
    materializeBackground
  );

  return {
    indexes,
    vertlines: updatedVertlines,
    horizlines: updatedHorizlines,
    polygons: updatedPolygons,
    hhists: updatedHHists,
    backgrounds: updatedBackgrounds,
  };
}

function extractIndexes(graphics) {
  const indexes = new Set();
  graphics.horizlines().forEach((lines) => {
    lines.forEach((line) => {
      indexes.add(line.startIndex);
      indexes.add(line.endIndex);
    });
  });

  graphics.vertlines().forEach((lines) => {
    lines.forEach((line) => {
      indexes.add(line.index);
    });
  });

  graphics.lines().forEach((lines) => {
    lines.forEach((line) => {
      indexes.add(line.startIndex);
      indexes.add(line.endIndex);
    });
  });

  graphics.textmarks().forEach((marks) => {
    marks.forEach((mark) => {
      indexes.add(mark.time);
    });
  });

  graphics.shapemarks().forEach((marks) => {
    marks.forEach((mark) => {
      indexes.add(mark.time);
    });
  });

  graphics.backgrounds().forEach((backgrounds) => {
    backgrounds.forEach((background) => {
      indexes.add(background.start !== null ? background.start : -1);
      indexes.add(background.stop);
    });
  });

  graphics.polygons().forEach((polygons) => {
    polygons.forEach((polygon) => {
      polygon.points.forEach((point) => {
        indexes.add(point.index);
      });
    });
  });

  graphics.trendchannels().forEach((channels) => {
    channels.forEach((channel) => {
      indexes.add(channel.startIndex);
      indexes.add(channel.endIndex);
    });
  });

  graphics.hhists().forEach((hhists) => {
    hhists.forEach((hhist) => {
      indexes.add(hhist.firstBarTime);
      indexes.add(hhist.lastBarTime);
    });
  });

  graphics.dwglabels().forEach((labels) => {
    labels.forEach((label) => {
      indexes.add(label.x);
    });
  });

  graphics.dwglines().forEach((lines) => {
    lines.forEach((line) => {
      indexes.add(line.x1 !== null ? line.x1 : -1);
      indexes.add(line.x2 !== null ? line.x2 : -1);
    });
  });

  graphics.dwgboxes().forEach((boxes) => {
    boxes.forEach((box) => {
      indexes.add(box.left !== null ? box.left : -1);
      indexes.add(box.right !== null ? box.right : -1);
    });
  });

  graphics.tpos().forEach((tpos) => {
    tpos.forEach((tpo) => {
      indexes.add(tpo.firstBarTime);
      indexes.add(tpo.lastBarTime);
    });
  });

  const sortedIndexes = Array.from(indexes);
  sortedIndexes.sort((a, b) => a - b);
  return sortedIndexes;
}

export { emptyStudyGraphics, loadStudyGraphics, saveStudyGraphics };
