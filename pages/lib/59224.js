
const s = "undefined" != typeof window ? window : {};
let applyOverridesToStudyDefaults = !1;
try {
  localStorage.getItem(""), applyOverridesToStudyDefaults = !0
} catch (e) {}
const LOGLEVEL = {
  "1": "ERROR",
  "2": "WARNING",
  "3": "INFO",
  "4": "NORMAL",
  "5": "DEBUG",
  "ERROR": 1,
  "WARNING": 2,
  "INFO": 3,
  "NORMAL": 4,
  "DEBUG": 5
};
let emptyElementStudyMetaInfo = 0;
const loglevelStr = "tv.logger.loglevel",
  logHighRate = "tv.logger.logHighRate",
  logArray = [];
let hObjectLogger = null,
  dObjectLogger = null,
  uObjectLogger = null,
  pObjectLogger = NaN,
  warningStrLevel = LOGLEVEL.WARNING,
  mBoolLogger = !1;

function getLogLevel() {
  return warningStrLevel
}

function isHighRateEnabled() {
  return mBoolLogger
}

function setLogLevel(e) {
  e = Math.max(LOGLEVEL.ERROR, Math.min(LOGLEVEL.DEBUG, e)), warningStrLevel = e, saveLoggerState()
}

function getRawLogHistory(e, t) {
  let i = logArray.reduce(((e, t) => e.concat(t)), []);
  return i.sort(((e, t) => e.id - t.id)), void 0 !== t && (i = i.filter((e => e.subSystemId === t))), "number" == typeof e && (i = i.slice(-e)), i
}

function serializeLogHistoryEntry(e) {
  return new Date(e.timestamp).toISOString() + ":" + e.subSystemId + ":" + e.message.replace(/"/g, "'")
}

function getLogHistory(e, t) {
  return function(e, t) {
      let i, s = 0,
          r = 0;
      for (i = e.length - 1; i >= 1 && (s += 8 * (1 + encodeURIComponent(e[i]).length), !(i - 1 > 0 && (r = 8 * (1 + encodeURIComponent(e[i - 1]).length), s + r > t))); i--);
      return e.slice(i)
  }(getRawLogHistory(e, t).map(serializeLogHistoryEntry), 75497472)
}

function logEntry(e, t, i, s) {
  if (t === dObjectLogger && s.id === uObjectLogger) return;
  const r = new Date;
  if (e <= LOGLEVEL.NORMAL && function(e, t, i, s, r) {
          "function" == typeof structuredClone && (t = structuredClone(t));
          const n = {
              id: emptyElementStudyMetaInfo,
              message: t,
              subSystemId: s,
              timestamp: Number(e)
          };
          emptyElementStudyMetaInfo += 1, i.push(n), void 0 !== r && i.length > r && i.splice(0, 1)
      }(r, t, i, s.id, s.maxCount), e <= warningStrLevel && (!s.highRate || isHighRateEnabled()) && (!hObjectLogger || s.id.match(hObjectLogger))) {
      const i = r.toISOString() + ":" + s.id + ":" + t;
      switch (e) {
          case LOGLEVEL.DEBUG:
              console.debug(i);
              break;
          case LOGLEVEL.INFO:
          case LOGLEVEL.NORMAL:
              s.color ? console.log("%c" + i, "color: " + s.color) : console.log(i);
              break;
          case LOGLEVEL.WARNING:
              console.warn(i);
              break;
          case LOGLEVEL.ERROR:
              console.error(i)
      }
      dObjectLogger = t, uObjectLogger = s.id, pObjectLogger && clearTimeout(pObjectLogger), pObjectLogger = setTimeout((() => {
          dObjectLogger = null, uObjectLogger = null, pObjectLogger = NaN
      }), 1e3)
  }
}

function getLogger(e, t = {}) {
  const i = [];
  logArray.push(i);
  const s = Object.assign(t, {
      id: e
  });

  function r(e) {
      return t => logEntry(e, String(t), i, s)
  }
  return {
      logDebug: r(LOGLEVEL.DEBUG),
      logError: r(LOGLEVEL.ERROR),
      logInfo: r(LOGLEVEL.INFO),
      logNormal: r(LOGLEVEL.NORMAL),
      logWarn: r(LOGLEVEL.WARNING)
  }
}
const globalLogger = getLogger("logger"),
  loggingOn = s.lon = (e, t) => {
      setLogLevel(LOGLEVEL.DEBUG), globalLogger.logNormal("Debug logging enabled"), mBoolLogger = Boolean(e), hObjectLogger = t || null, saveLoggerState()
  },
  loggingOff = s.loff = () => {
      setLogLevel(LOGLEVEL.INFO), globalLogger.logInfo("Debug logging disabled")
  };

function saveLoggerState() {
  try {
      applyOverridesToStudyDefaults && (localStorage.setItem(logHighRate, String(mBoolLogger)), localStorage.setItem(loglevelStr, String(warningStrLevel)))
  } catch (e) {
      globalLogger.logWarn(`Cannot save logger state (level: ${warningStrLevel}, high-rate: ${mBoolLogger}) to localStorage: ${e.message}`)
  }
}! function() {
  mBoolLogger = !!applyOverridesToStudyDefaults && "true" === localStorage.getItem(logHighRate);
  let e = parseInt(applyOverridesToStudyDefaults && localStorage.getItem(loglevelStr) || "");
  Number.isNaN(e) && (e = LOGLEVEL.WARNING), setLogLevel(e), globalLogger.logNormal(`Init with settings - level: ${warningStrLevel}, high-rate: ${mBoolLogger}`)
}(), s.performance && s.performance.now ? globalLogger.logNormal(`Sync logger and perf times, now is ${s.performance.now()}`) : globalLogger.logWarn("Perf time is not available")
