
  import {StudyMetaInfoBase} from "./60762.js";
  import {getLogger} from "./59224.js";
  import {applyOverridesToStudyDefaults} from "./19386.js";

  var loggerStudyMetaUInfo = getLogger("Chart.Study.MetaInfo");
  var emptyElementStudyMetaInfo = {};
  class StudyMetaInfo extends StudyMetaInfoBase {
      constructor(e) {
          super(), TradingView.merge(this, {
              palettes: {},
              inputs: [],
              plots: [],
              graphics: {},
              defaults: {}
          }), TradingView.merge(this, e);
          var t = e.fullId || e.id;
          TradingView.merge(this, StudyMetaInfo.parseIdString(t))
      }
      static versionOf(e) {
          var t = "_metainfoVersion" in e && isNumber(e._metainfoVersion) ? e._metainfoVersion : 0;
          return t < 0 && loggerStudyMetaUInfo.logError("Metainfo format version cannot be negative: " + t), t
      }
      static parseIdString(e) {
          var t = {};
          if (-1 === e.indexOf("@")) t.shortId = e, t.packageId = "tv-basicstudies", t.id = e + "@" + t.packageId, t.version = 1;
          else {
              var i = e.split("@");
              t.shortId = i[0];
              var s = i[1].split("-");
              if (3 === s.length) t.packageId = s.slice(0, 2).join("-"), t.id = t.shortId + "@" + t.packageId, t.version = s[2];
              else if (1 === s.length && "decisionbar" === s[0]) t.packageId = "les-" + s[0], t.id = t.shortId + "@" + t.packageId, t.version = 1;
              else {
                  if (1 !== s.length) throw new Error("unexpected study id:" + e);
                  t.packageId = "tv-" + s[0], t.id = t.shortId + "@" + t.packageId, t.version = 1
              }
          }
          if (t.fullId = t.id + "-" + t.version, "tv-scripting" === t.packageId) {
              var r = t.shortId;
              if (0 === r.indexOf("Script$") || 0 === r.indexOf("StrategyScript$")) {
                  var n = r.indexOf("_");
                  t.productId = n >= 0 ? r.substring(0, n) : t.packageId
              } else t.productId = t.packageId
          } else t.productId = t.packageId;
          return t
      }
      static getPackageName(e) {
          return (/^[^@]+@([^-]+-[^-]+)/.exec(e || "") || [0, "tv-basicstudies"])[1]
      }
      static cutDollarHash(e) {
          var t = e.indexOf("$"),
              i = e.indexOf("@");
          return -1 === t ? e : e.substring(0, t) + (i >= 0 ? e.substring(i) : "")
      }
      static hasUserIdSuffix(e) {
          return /^USER;[\d\w]+;\d+$/.test(e)
      }
      static hasPubSuffix(e) {
          return /^PUB;.+$/.test(e)
      }
      static hasStdSuffix(e) {
          return /^STD;.+$/.test(e)
      }
      static isStandardPine(e) {
          return /^(Strategy)?Script\$STD;.*@tv-scripting$/.test(e)
      }
      static getStudyIdWithLatestVersion(e) {
          const t = StudyMetaInfo.cutDollarHash(e.id);
          let i = t;
          return t.indexOf("@tv-scripting") >= 0 ? i += "-101!" : t.endsWith("CP@tv-basicstudies") ? i += "-" + Math.min(e.version, 207) : t.endsWith("CP@tv-chartpatterns") ? i += "-" + Math.min(e.version, 9) : i += "-" + e.version, i
      }
      defaultInputs() {
          for (var e = [], t = 0; t < this.inputs.length; t++) e.push(this.inputs[t].defval);
          return e
      }
      state(e) {
          var t = {};
          for (var i in this) this.hasOwnProperty(i) && (t[i] = this[i], !0 !== e && "id" === i && (t[i] += "-" + this.version));
          return t
      }
      symbolInputId() {
          var e = this.inputs.filter((function(e) {
              return "symbol" === e.type
          }));
          return e.length > 0 ? e[0].id : null
      }
      createDefaults() {
          if (this.defaults) {
              var e = TradingView.clone(this.defaults);
              e.precision = "default";
              var t = StudyMetaInfo.getStudyPropertyRootName(this);
              defaults.create(t, e)
          }
      }
      removeDefaults() {
          defaults.remove(StudyMetaInfo.getStudyPropertyRootName(this))
      }
      static findStudyMetaInfoByDescription(e, t) {
          if (e) {
              for (var i = 0; i < e.length; ++i)
                  if (e[i].description.toLowerCase() === t.toLowerCase()) return e[i];
              throw new Error("unexpected study id:" + t)
          }
          throw new Error("There is no studies metainfo")
      }
      static isParentSourceId(e) {
          return "string" == typeof e && /^[^\$]+\$\d+$/.test(e)
      }
      static overrideDefaults(e) {
          0 !== e.length && applyOverridesToStudyDefaults(emptyElementStudyMetaInfo, e, (function(e) {
              return TradingView.defaultProperties[StudyMetaInfo.getStudyPropertyRootName(e)] || null
          }))
      }
      static mergeDefaultsOverrides(e) {
          TradingView.merge(emptyElementStudyMetaInfo, e)
      }
      static isScriptStrategy(e) {
          return !1
      }
      static getOrderedInputIds(e) {
          for (var t = [], i = e.inputs, s = 0; s < i.length; ++s) {
              var r = i[s];
              t.push(r.id)
          }
          return t
      }
  }
  StudyMetaInfo.VERSION_STUDY_ARG_SOURCE = 41, StudyMetaInfo.METAINFO_FORMAT_VERSION_SOS_V2 = 42, StudyMetaInfo.VERSION_PINE_PROTECT_TV_4164 = 43, StudyMetaInfo.CURRENT_METAINFO_FORMAT_VERSION = 52, StudyMetaInfo.VERSION_NEW_STUDY_PRECISION_FORMAT = 46, StudyMetaInfo.FilledArea = {}, StudyMetaInfo.FilledArea.TYPE_PLOTS = "plot_plot", StudyMetaInfo.FilledArea.TYPE_HLINES = "hline_hline", TradingView.StudyMetaInfo = StudyMetaInfo
