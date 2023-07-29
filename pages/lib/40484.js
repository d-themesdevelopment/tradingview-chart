import {isNumber} from "./helpers.js";
import {ensureNotNull, ensureDefined} from "./assertions.js";
import {CheckMobile} from "./49483.js";
import {PlotRowSearchMode} from "./86094.js";
import {tool} from "./88348.js";
import {VolumeFormatter} from "./98596.js";
import {HHistVolumeMode} from "./90164.js";
import {isLineToolName} from "./15367.js";
import {notAvailable} from "./88546.js";

  const isMobileCheck = CheckMobile.any();
  class HHistBasedValuesProvider {
      constructor(e, t) {
          this._emptyValues = [], this._study = e, this._model = t, void 0 !== this._study.metaInfo().graphics.hhists && this._emptyValues.push(this.u(0), this.u(1), this.u(2))
      }
      u(e, t = "", i = "") {
        return {
            id: t,
            index: e,
            title: i,
            value: "",
            visible: !1
        }
     }
      getItems() {
          return this._emptyValues
      }
      getValues(e) {
          var t, i;
          const n = this._emptyValues.map((e => ({
              ...e
          })));
          n.forEach((e => {
              e.visible = this._study.isVisible(), e.value = notAvailable
          }));
          const a = this._study.properties().childs().inputs.childs().volume.value();
          switch (a) {
              case HHistVolumeMode.UpDown:
                  n[0].title = "Up", n[1].title = "Down", n[2].title = "Total";
                  break;
              case HHistVolumeMode.Total:
                  n[0].title = "Total", n[1].visible = !1, n[2].visible = !1;
                  break;
              case HHistVolumeMode.Delta:
                  n[0].title = "Delta", n[1].title = "Max(Up, Down)", n[2].title = "Total"
          }
          const h = this._study.priceScale(),
              u = this._model.timeScale();
          if (null === h || h.isEmpty() || u.isEmpty() || this._hideValues()) return n;
          if (null === e || !isFinite(e)) {
              const t = this._study.data().last();
              if (null === t) return n;
              e = t.index
          }
          const p = this._model.crossHairSource(),
              _ = p.price;
          if (!isFinite(p.y) && (e = function(e, t) {
                  var i;
                  const s = null === (i = e.visibleBarsStrictRange()) || void 0 === i ? void 0 : i.lastBar();
                  if (!s) return null;
                  const r = t.data().search(s, PlotRowSearchMode.NearestLeft);
                  return r ? r.index : null
              }(this._model.timeScale(), this._model.mainSeries()), null === e)) return n;
          const m = function(e, t, i, s) {
              if (0 === e.size) return null;
              if (!i) {
                  const e = ensureNotNull(s.data().valueAt(t));
                  i = s.barFunction()(e)
              }
              const n = function(e, t) {
                  let i = null;
                  return e.forEach(((e, s) => {
                      s <= t && (null === i || s > i) && (i = s)
                  })), i
              }(e, t);
              if (null === n) return null;
              const o = e.get(n);
              if (!o || 0 === o.size) return null;
              return function(e, t) {
                  let i = null;
                  return e.forEach((e => {
                      e.priceLow <= t && t < e.priceHigh && (i = e)
                  })), i
              }(o, i)
          }(this._study.graphics().hhistsByTimePointIndex(), e, _, this._model.mainSeries());
          if (null === m) return n.forEach((e => {
              e.value = "0"
          })), n;
          const g = this._study.metaInfo().graphics.hhists;
          if (void 0 === g) return n;
          if (void 0 === g[m.styleId]) return n;
          const f = null === (i = null === (t = this._study.properties().childs().graphics.childs().hhists) || void 0 === t ? void 0 : t.childs()[m.styleId]) || void 0 === i ? void 0 : i.childs(),
              v = new VolumeFormatter,
              S = e => isNumber(e) ? v.format(e) : "";
          if (a !== HHistVolumeMode.Delta) {
              if (m.rate.forEach(((e, t) => {
                      n[t].value = S(e), n[t].color = ensureDefined(f).colors[t].value()
                  })), a === HHistVolumeMode.UpDown) {
                  const e = m.rate[0] + m.rate[1];
                  n[2].value = S(e),
                      n[2].color = ensureDefined(f).valuesColor.value()
              }
          } else {
              const e = m.rate[0] > m.rate[1] ? 0 : 1,
                  t = ensureDefined(f).colors[e].value(),
                  i = m.rate[0] + m.rate[1];
              [2 * m.rate[e] - i, m.rate[e], i].forEach(((e, i) => {
                  n[i].value = S(e), n[i].color = t
              }))
          }
          return n
      }
      _hideValues() {
          return isMobileCheck && (null === this._model.crossHairSource().pane || isLineToolName(tool.value()) || null !== this._model.lineBeingEdited())
      }
  }