
import {materializeHHist} from "./90164.js";
import {assert} from "./assertions.js";
import {materializeHorizLine} from "./34522.js";
import {materializeVertLine} from "./68696.js";
import {materializePolygon} from "./80009.js";
import {materializeBackground} from "./93804.js";
import {splitHHistsByTimePointIndex} from "./71409.js";
import {StaticStudyGraphics} from "./12616.js";

class LiveStudyGraphics {
      constructor() {
          this._indexes = [], this._horizlines = new Map, this._vertlines = new Map, this._lines = new Map, this._hlines = new Map, this._textmarks = new Map, this._shapemarks = new Map, this._backgrounds = new Map, this._polygons = new Map, this._trendchannels = new Map, this._hhists = new Map, this._dwglabels = new Map, this._dwgboxes = new Map, this._dwglines = new Map, this._dwgtables = new Map, this._dwgtablecells = new Map, this._dwglinefills = new Map, this._tpos = new Map, this._tpoBlockSets = new Map, this._tpoLevelGroups = new Map, this._tpoVolumeRows = new Map, this._hhistsByTimePointIndex = new Map
      }
      horizlines() {
          return this._horizlines
      }
      vertlines() {
          return this._vertlines
      }
      lines() {
          return this._lines
      }
      hlines() {
          return this._hlines
      }
      textmarks() {
          return this._textmarks
      }
      shapemarks() {
          return this._shapemarks
      }
      backgrounds() {
          return this._backgrounds
      }
      polygons() {
          return this._polygons
      }
      trendchannels() {
          return this._trendchannels
      }
      hhists() {
          return this._hhists
      }
      dwglabels() {
          return this._dwglabels
      }
      dwglines() {
          return this._dwglines
      }
      dwgboxes() {
          return this._dwgboxes
      }
      dwgtables() {
          return this._dwgtables
      }
      dwgtablecells() {
          return this._dwgtablecells
      }
      dwglinefills() {
          return this._dwglinefills
      }
      tpos() {
          return this._tpos
      }
      tpoBlockSets() {
          return this._tpoBlockSets
      }
      tpoLevels() {
          return this._tpoLevelGroups
      }
      tpoVolumeRows() {
          return this._tpoVolumeRows
      }
      hhistsByTimePointIndex() {
          return this._hhistsByTimePointIndex
      }
      clear() {
          this._indexes = [], this._clearPrimitives()
      }
      extract() {
          const e = e => e.extract(),
              t = {
                  indexes: this._indexes,
                  horizlines: mapValuesToKeys(this._horizlines, e),
                  vertlines: mapValuesToKeys(this._vertlines, e),
                  lines: mapValuesToKeys(this._lines, e),
                  hlines: mapValuesToKeys(this._hlines, e),
                  textmarks: mapValuesToKeys(this._textmarks, e),
                  shapemarks: mapValuesToKeys(this._shapemarks, e),
                  backgrounds: mapValuesToKeys(this._backgrounds, e),
                  polygons: mapValuesToKeys(this._polygons, e),
                  trendchannels: mapValuesToKeys(this._trendchannels, e),
                  hhists: mapValuesToKeys(this._hhists, e),
                  dwglabels: mapValuesToKeys(this._dwglabels, e),
                  dwglines: mapValuesToKeys(this._dwglines, e),
                  dwgboxes: mapValuesToKeys(this._dwgboxes, e),
                  dwgtables: mapValuesToKeys(this._dwgtables, e),
                  dwgtablecells: mapValuesToKeys(this._dwgtablecells, e),
                  dwglinefills: mapValuesToKeys(this._dwglinefills, e),
                  tpos: mapValuesToKeys(this._tpos, e),
                  tpoBlockSets: mapValuesToKeys(this._tpoBlockSets, e),
                  tpoLevels: mapValuesToKeys(this._tpoLevelGroups, e),
                  tpoVolumeRows: mapValuesToKeys(this._tpoVolumeRows, e)
              };
          return this._hhistsByTimePointIndex = new Map, new StaticStudyGraphics("data", t)
      }
      replaceIndexesTo(e) {
          this._indexes = e;
          const t = e => e.replaceIndexesTo(this._indexes);
          this._horizlines.forEach(t), this._vertlines.forEach(t), this._lines.forEach(t), this._hlines.forEach(t), this._textmarks.forEach(t), this._shapemarks.forEach(t), this._backgrounds.forEach(t), this._polygons.forEach(t), this._trendchannels.forEach(t), this._hhists.forEach(t), this._dwglabels.forEach(t), this._dwgboxes.forEach(t), this._dwglines.forEach(t), this._dwgtables.forEach(t), this._dwgtablecells.forEach(t), this._dwglinefills.forEach(t), this._tpos.forEach(t), this._tpoBlockSets.forEach(t), this._tpoLevelGroups.forEach(t), this._tpoVolumeRows.forEach(t), this._hhistsByTimePointIndex = splitHHistsByTimePointIndex(this._hhists)
      }
      processCommands(e, t) {
          void 0 !== e.erase && this._processEraseCommands(e.erase), void 0 !== e.create && this._processCreateCommands(e.create, t)
      }
      _processCreateCommands(e, t) {
          for (const i in e) {
              if (!e.hasOwnProperty(i)) continue;
              const c = i;
              switch (assert(c in t, `There is a '${c}' in study response, but it doesn't present in graphics info!`), c) {
                  case "hhists":
                      processGraphicsPrimitives(this._hhists, e[c], t[c], this._indexes, materializeHHist);
                      break;
                  case "horizlines":
                      processGraphicsPrimitives(this._horizlines, e[c], t[c], this._indexes, materializeHorizLine);
                      break;
                  case "vertlines":
                      processGraphicsPrimitives(this._vertlines, e[c], t[c], this._indexes, materializeVertLine);
                      break;
                  case "polygons":
                      processGraphicsPrimitives(this._polygons, e[c], t[c], this._indexes, materializePolygon);
                      break;
                  case "backgrounds":
                      processGraphicsPrimitives(this._backgrounds, e[c], t[c], this._indexes, materializeBackground)
              }
          }
          this._hhistsByTimePointIndex = splitHHistsByTimePointIndex(this._hhists)
      }
      _processEraseCommands(e) {
          for (const t of e)
              if ("all" === t.action) this._clearPrimitives();
              else {
                  const e = e => e.deleteById(t.id);
                  switch (t.type) {
                      case "horizlines":
                          this._horizlines.forEach(e);
                          break;
                      case "vertlines":
                          this._vertlines.forEach(e);
                          break;
                      case "lines":
                          this._lines.forEach(e);
                          break;
                      case "hlines":
                          this._hlines.forEach(e);
                          break;
                      case "textmarks":
                          this._textmarks.forEach(e);
                          break;
                      case "shapemarks":
                          this._shapemarks.forEach(e);
                          break;
                      case "backgrounds":
                          this._backgrounds.forEach(e);
                          break;
                      case "polygons":
                          this._polygons.forEach(e);
                          break;
                      case "trendchannels":
                          this._trendchannels.forEach(e);
                          break;
                      case "hhists":
                          this._hhists.forEach(e);
                          break;
                      case "dwglabels":
                          this._dwglabels.forEach(e);
                          break;
                      case "dwglines":
                          this._dwglines.forEach(e);
                          break;
                      case "dwgboxes":
                          this._dwgboxes.forEach(e);
                          break;
                      case "dwgtables":
                          this._dwgtables.forEach(e);
                          break;
                      case "dwgtablecells":
                          this._dwgtablecells.forEach(e);
                          break;
                      case "dwglinefills":
                          this._dwglinefills.forEach(e);
                          break;
                      case "tpos":
                          this._tpos.forEach(e);
                          break;
                      case "tpoBlockSets":
                          this._tpoBlockSets.forEach(e);
                          break;
                      case "tpoLevels":
                          this._tpoLevelGroups.forEach(e);
                          break;
                      case "tpoVolumeRows":
                          this._tpoVolumeRows.forEach(e)
                  }
              } this._hhistsByTimePointIndex = splitHHistsByTimePointIndex(this._hhists)
      }
      _clearPrimitives() {
          this._horizlines.clear(), this._vertlines.clear(), this._lines.clear(), this._hlines.clear(),
              this._textmarks.clear(), this._shapemarks.clear(), this._backgrounds.clear(), this._polygons.clear(), this._trendchannels.clear(), this._hhists.clear(), this._dwglabels.clear(), this._dwgboxes.clear(), this._dwglines.clear(), this._dwgtables.clear(), this._dwgtablecells.clear(), this._dwglinefills.clear(), this._tpos.clear(), this._tpoBlockSets.clear(), this._tpoLevelGroups.clear(), this._tpoVolumeRows.clear(), this._hhistsByTimePointIndex = new Map
      }
  }
  class GraphicsPrimitiveCollection {
      constructor(e, t) {
          this._primitivesDataById = new Map, this._primitiveById = new Map, this._materializePrimitive = e, this._indexes = t
      }
      forEach(e, t) {
          this._primitiveById.forEach((i => {
              e.call(t, i, i, this)
          }))
      }
      has(e) {
          let t = !1;
          return this._primitiveById.forEach((i => {
              t = t || i === e
          })), t
      }
      get size() {
          return this._primitiveById.size
      } [Symbol.iterator]() {
          return this._primitiveById.values()
      }
      entries() {
          throw new Error("Not implemented")
      }
      keys() {
          throw new Error("Not implemented")
      }
      values() {
          throw new Error("Not implemented")
      }
      hasId(e) {
          return this._primitiveById.has(e)
      }
      addData(e) {
          this._primitivesDataById.set(e.id, e), this._tryMaterialize(e)
      }
      deleteById(e) {
          this._primitiveById.delete(e), this._primitivesDataById.delete(e)
      }
      clear() {
          this._primitivesDataById.clear(), this._primitiveById.clear()
      }
      replaceIndexesTo(e) {
          this._indexes = e, this._primitiveById.clear(), this._primitivesDataById.forEach(this._tryMaterialize, this)
      }
      extract() {
          const e = new Set(this._primitivesDataById.values());
          return this._primitivesDataById = new Map, this._primitiveById.clear(), e
      }
      _tryMaterialize(e) {
          const t = this._materializePrimitive(e, this._indexes);
          null !== t && (assert(!this._primitiveById.has(e.id), "primitive with specified id should not exist"), this._primitiveById.set(e.id, t))
      }
  }

  function mapValuesToKeys(e, t) {
      const i = new Map;
      return e.forEach(((e, s) => i.set(s, t(e)))), i
  }

  function processGraphicsPrimitives(e, t, i, r, n) {
      if (void 0 !== t)
          for (const o of t) {
              const t = o.styleId;
              void 0 !== i && assert(t in i, "Every style used by graphics primitive should be declared in study metainfo");
              let a = e.get(t);
              void 0 === a && (a = new GraphicsPrimitiveCollection(n, r), e.set(t, a)), o.data.forEach(a.addData.bind(a))
          }
  }
