import {defaultFunc} from "./helpers.js";
import {ensureNotNull} from "./assertions.js";
import {isExtendedInput, isExtendedInputSource} from "./33703.js";
  const forbiddenStudyIds = new Set(["CorrelationCoefficient@tv-basicstudies", "Correlation - Log@tv-basicstudies-1"]),
      forbiddenStudyTypes = new Set([]),
      allowedPlotTypes = new Set(["line"]),
      studyIdMappings = new Map([
          ["AnchoredVWAP@tv-basicstudies", "linetoolanchoredvwap"],
          ["RegressionTrend@tv-basicstudies", "linetoolregressiontrend"]
      ]),
      idRegex = /^([^\$]+)\$\d+$/;
  class StudyMetaInfoBase {
      static getSourceIdsByInputs(e, t) {
          if (!Array.isArray(e) || !t) return [];
          const i = [];
          for (const r of e)
              if (StudyMetaInfoBase.isSourceInput(r) && defaultFunc(t[r.id])) {
                  const e = t[r.id];
                  e.includes("$") && i.push(e.split("$")[0])
              } return i
      }
      static isSourceInput(e) {
          return Boolean(e.id && (("source" === e.id || "src" === e.id) && ("text" === e.type || "source" === e.type) || "source" === e.type))
      }
      static getSourceInputIds(e) {
          const t = [];
          for (const i of e.inputs) StudyMetaInfoBase.isSourceInput(i) && t.push(i.id);
          return t
      }
      static setChildStudyMetaInfoPropertiesSourceId(e, t, i) {
          for (const s of e.inputs) {
              if (!StudyMetaInfoBase.isSourceInput(s)) continue;
              const e = i.childs().inputs && i.childs().inputs.childs()[s.id];
              if (e) {
                  const i = e.value(),
                      s = idRegex.exec(i);
                  if (2 === (null == s ? void 0 : s.length)) {
                      if ("{pid}" === s[1]) {
                          const s = i.replace(/^[^\$]+/, t);
                          e.setValue(s)
                      }
                  }
              }
          }
      }
      static patchSoSInputs(e, t) {
          const i = e => {
              const i = idRegex.exec(e);
              if (2 === (null == i ? void 0 : i.length)) {
                  const s = i[1],
                      n = `${ensureNotNull(t(s))}`;
                  return e.replace(/^[^\$]+/, n)
              }
              return e
          };
          for (const t in e)
              if (/in_[\d+]/.test(t) || "source" === t) {
                  const r = e[t];
                  defaultFunc(r) ? e[t] = i(r): isExtendedInput(r) && isExtendedInputSource(r) && (r.v = i(r.v))
              }
      }
      static canBeChild(e) {
          if (defaultFunc(e)) return !0;
          if (!e) return !1;
          if (e.extra && !StudyMetaInfoBase.isAllowedSourceInputsCount(e.extra.sourceInputsCount) || !0 === e.canNotBeChild || !1 === e.canBeChild || forbiddenStudyIds.has(e.id)) return !1;
          let t = 0;
          for (const i of e.inputs) StudyMetaInfoBase.isSourceInput(i) && (t += 1);
          return StudyMetaInfoBase.isAllowedSourceInputsCount(t)
      }
      static isAllowedSourceInputsCount(e) {
          return 1 === e
      }
      static canHaveChildren(e) {
          if (e) {
              if (e.isTVScriptStrategy || e.TVScriptSourceCode && isStrategy(e.TVScriptSourceCode)) return !1;
              if (e.id && !forbiddenStudyTypes.has(e.id) && Array.isArray(e.plots))
                  for (const t of e.plots)
                      if (allowedPlotTypes.has(t.type)) return !0
          }
          return !1
      }
      static getChildSourceInputTitles(e, t, i) {
          var s;
          const r = {};
          if (t.plots && t.plots.length && e.options && e.options.length)
              for (const n of e.options) {
                  const e = n ? +n.split("$")[1] : NaN,
                      o = isFinite(e) && t.plots[e];
                  o && allowedPlotTypes.has(o.type) && (r[n] = t.styles && t.styles[o.id] && (null === (s = t.styles[o.id]) || void 0 === s ? void 0 : s.title) || o.id, i && (r[n] = i + ": " + r[n]))
              }
          return r
      }
      static canPlotBeSourceOfChildStudy(e) {
          return allowedPlotTypes.has(e)
      }
      static getStudyPropertyRootName(e) {
          const t = studyIdMappings.get(e.id);
          if (void 0 !== t) return t;
          let i = "study_" + e.id;
          return e.pine && e.pine.version && (i += "_" + e.pine.version.replace(".", "_")), i
      }
      static getStudyPropertyRootNameById(e) {
          const t = studyIdMappings.get(e);
          return void 0 !== t ? t : "study_" + e
      }
  }
