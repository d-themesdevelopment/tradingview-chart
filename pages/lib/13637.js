import {defaultFunc} from "./helpers.js";
import {ensureDefined} from "./assertions.js";
import {getJSON} from "./56840.js";
import {deepCopy} from "./deepCopy.js";
import {watchedTheme} from "./45345.js";
import {StdTheme} from "./26843.js";
import {CustomData} from "./59452.js";
import {saveDefaults} from "./85804.js";
import {Delegate} from "./57898.js";
var   r = i(99094),
      n = i(16230),
      o = i(98279),
      a = i(38651);

  const getLogger = (0, i(59224).getLogger)("ThemedDefaults");

  function extractAllPropertiesKeys(e) {
      const t = Object.keys(e),
          i = [];
      return t.forEach((t => {
          const s = e[t];
          if ((0, o.default)(s)) {
              extractAllPropertiesKeys(s).forEach((e => i.push(`${t}.${e}`)))
          } else i.push(t)
      })), i
  }

  function extractState(e, t, i = "") {
      const s = {};
      return t.forEach((r => {
          const n = r.split("."),
              a = n[0],
              l = e[a],
              c = "" === i ? a : `${i}.${a}`;
          if (e.hasOwnProperty(a))
              if (n.length > 1) {
                  if (!(0, o.default)(l)) return void getLogger.logError(`path ${c} must be an object, but it is a primitive`);
                  {
                      const e = t.filter((e => e.startsWith(`${a}.`))).map((e => e.split(".").slice(1).join(".")));
                      s[a] = extractState(l, e, c)
                  }
              } else {
                  if ((0, o.default)(l)) return void getLogger.logError(`path ${c} must be a primitive, but it is an object`);
                  s[a] = l
              }
      })), s
  }

  function factoryDefaultsForCurrentTheme(e, t) {
      var i;
      const r = null !== (i = watchedTheme.value()) && void 0 !== i ? i : StdTheme.Light,
          n = deepCopy(e);
      return defaultFunc(n, ensureDefined(t.get(r))), n
  }

  function mergeDefaults(e, t) {
      const i = (0, r.default)(e, ((e, i, s) => {
          if (void 0 === t[s]) return e;
          if (!(0, n.default)(i, t[s]))
              if ((0, o.default)(i) && (0, o.default)(t[s])) {
                  const r = mergeDefaults(i, t[s]);
                  void 0 !== r && (e[s] = r)
              } else e[s] = i;
          return e
      }), {});
      return (0, a.default)(i) ? void 0 : i
  }
  class ThemedDefaultProperty extends(CustomData()) {
      constructor(e, t, i, r, n, o) {
          super(function(e, t, i, r) {
              var n;
              const o = t(),
                  a = extractState(deepCopy(null !== (n = getJSON(e, null)) && void 0 !== n ? n : {}), i);
              return defaultFunc(o, a), defaultFunc(o, extractState(null != r ? r : {}, i)), o
          }(e, t, n, o)), this._applyingThemeInProcess = !1, this._restoreFactoryDefaultsEvent = new Delegate(), this._defaultName = e, this._defaultsSupplier = t, this._notThemedDefaultsKeys = i, this._themedDefaultsKeys = r, this._allStateKeys = n, this._allDefaultsKeys = [...i, ...r]
      }
      restoreFactoryDefaults() {
          const e = this._defaultsSupplier();
          this.mergeAndFire(e), this.saveDefaults(), this._restoreFactoryDefaultsEvent.fire()
      }
      addExclusion() {}
      state() {
          return extractState(super.state(), this._allStateKeys)
      }
      mergePreferences(e) {
          this.mergeAndFire(extractState(e, this._allStateKeys))
      }
      childChanged(e) {
          super.childChanged(e), this._applyingThemeInProcess || this.saveDefaults()
      }
      saveDefaults() {
          const e = this.state(),
              t = this._defaultsSupplier();
          let i = mergeDefaults(extractState(e, this._notThemedDefaultsKeys), extractState(t, this._notThemedDefaultsKeys));
          const r = extractState(t, this._themedDefaultsKeys),
              n = extractState(e, this._themedDefaultsKeys),
              o = mergeDefaults(n, r);
          (0, a.default)(o) || (i = null != i ? i : {}, defaultFunc(i, n)), saveDefaults(this._defaultName, i)
      }
  }
