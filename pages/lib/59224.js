let applyOverridesToStudyDefaults = false;

try {
  localStorage.getItem("");
  applyOverridesToStudyDefaults = true;
} catch (e) {}

let n;
(function (n) {
  n[(n.ERROR = 1)] = "ERROR";
  n[(n.WARNING = 2)] = "WARNING";
  n[(n.INFO = 3)] = "INFO";
  n[(n.NORMAL = 4)] = "NORMAL";
  n[(n.DEBUG = 5)] = "DEBUG";
})(n || (n = {}));

let emptyElementStudyMetaInfo = 0;
const a = "tv.logger.loglevel";
const l = "tv.logger.logHighRate";
const c = [];
let h = null;
let d = null;
let u = null;
let p = NaN;
let _ = n.WARNING;
let m = false;

function getLogLevel() {
  return _;
}

function isHighRateEnabled() {
  return m;
}

function setLogLevel(level) {
  level = Math.max(n.ERROR, Math.min(n.DEBUG, level));
  _ = level;
  saveLoggerState();
}

function getRawLogHistory() {
  let logEntries = c.reduce(
    (accumulator, currentValue) => accumulator.concat(currentValue),
    []
  );
  logEntries.sort((a, b) => a.id - b.id);

  if (typeof arguments[0] !== "undefined") {
    logEntries = logEntries.filter(
      (entry) => entry.subSystemId === arguments[0]
    );
  }

  if (typeof arguments[1] === "number") {
    logEntries = logEntries.slice(-arguments[1]);
  }

  return logEntries;
}

function serializeLogHistoryEntry(entry) {
  return (
    new Date(entry.timestamp).toISOString() +
    ":" +
    entry.subSystemId +
    ":" +
    entry.message.replace(/"/g, "'")
  );
}

function getLogHistory() {
  return (function (logEntries, maxBytes) {
    const serializedEntries = logEntries.map(serializeLogHistoryEntry);
    let bytesCount = 0;

    for (
      let i = logEntries.length - 1;
      i >= 1 &&
      ((bytesCount +=
        8 * (1 + encodeURIComponent(serializedEntries[i]).length)),
      !(
        i - 1 > 0 &&
        ((bytesCount +=
          8 * (1 + encodeURIComponent(serializedEntries[i - 1]).length)),
        bytesCount > maxBytes)
      ));
      i--
    );

    return logEntries.slice(i);
  })(getRawLogHistory.apply(null, arguments), 75497472);
}

function logEntry(time, message, logEntries, subSystemId, maxCount) {
  if (arguments[1] === d && arguments[3] === u) return;

  const timestamp = new Date(time);

  if (arguments[0] <= n.NORMAL) {
    (function (time, message, logEntries, subSystemId, maxCount) {
      if (typeof structuredClone === "function") {
        message = structuredClone(message);
      }

      const logEntry = {
        id: emptyElementStudyMetaInfo,
        message: message,
        subSystemId: subSystemId,
        timestamp: Number(time),
      };

      emptyElementStudyMetaInfo += 1;
      logEntries.push(logEntry);

      if (typeof maxCount !== "undefined" && logEntries.length > maxCount) {
        logEntries.splice(0, 1);
      }
    })(timestamp, message, logEntries, subSystemId, maxCount);
  }

  if (
    arguments[0] <= _ &&
    (!maxCount.highRate || isHighRateEnabled()) &&
    (!h || subSystemId.match(h))
  ) {
    const logString =
      timestamp.toISOString() + ":" + subSystemId + ":" + message;

    switch (arguments[0]) {
      case n.DEBUG:
        console.debug(logString);
        break;
      case n.INFO:
      case n.NORMAL:
        if (maxCount.color) {
          console.log("%c" + logString, "color: " + maxCount.color);
        } else {
          console.log(logString);
        }
        break;
      case n.WARNING:
        console.warn(logString);
        break;
      case n.ERROR:
        console.error(logString);
        break;
    }

    d = message;
    u = subSystemId;

    if (!isNaN(p)) {
      clearTimeout(p);
    }

    p = setTimeout(() => {
      d = null;
      u = null;
      p = NaN;
    }, 1000);
  }
}

function getLogger(id, options = {}) {
  const logEntries = [];
  c.push(logEntries);
  const subsystem = Object.assign(options, { id: id });

  function log(level) {
    return (message) =>
      logEntry(
        level,
        String(message),
        logEntries,
        subsystem.id,
        subsystem.maxCount
      );
  }

  return {
    logDebug: log(n.DEBUG),
    logError: log(n.ERROR),
    logInfo: log(n.INFO),
    logNormal: log(n.NORMAL),
    logWarn: log(n.WARNING),
  };
}

const globalLogger = getLogger("logger");

function loggingOn(enabled, subsystem) {
  setLogLevel(n.DEBUG);
  globalLogger.logNormal("Debug logging enabled");
  m = Boolean(enabled);
  h = subsystem || null;
  saveLoggerState();
}

function loggingOff() {
  setLogLevel(n.INFO);
  globalLogger.logInfo("Debug logging disabled");
}

function saveLoggerState() {
  try {
    if (applyOverridesToStudyDefaults) {
      localStorage.setItem(l, String(m));
      localStorage.setItem(a, String(_));
    }
  } catch (e) {
    globalLogger.logWarn(
      `Cannot save logger state (level: ${_}, high-rate: ${m}) to localStorage: ${e.message}`
    );
  }
}

(function () {
  m = !!applyOverridesToStudyDefaults && localStorage.getItem(l) === "true";
  let level = parseInt((applyOverridesToStudyDefaults && localStorage.getItem(a)) || "");
  if (Number.isNaN(level)) {
    level = n.WARNING;
  }
  setLogLevel(level);
  globalLogger.logNormal(`Init with settings - level: ${_}, high-rate: ${m}`);
})();

if (
  typeof s.performance !== "undefined" &&
  typeof s.performance.now === "function"
) {
  globalLogger.logNormal(
    `Sync logger and perf times, now is ${s.performance.now()}`
  );
} else {
  globalLogger.logWarn("Perf time is not available");
}
