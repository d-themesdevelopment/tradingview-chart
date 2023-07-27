import {
  minutesPerDay,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SUNDAY,
  SATURDAY,
  getHexColorByName,
  StdTheme,
  extractAllPropertiesKeys,
  ensureDefined,
  StdTimezone,
  BusinessDay,
  get_timezone,
  get_hours,
  get_minutes,
  get_day_of_week,
  get_year,
  get_month,
  get_day_of_month,
  add_date,
  set_hms,
  clone,
  get_cal_from_unix_timestamp_ms,
  get_cal,
} from "your-imports"; // ! not correct

function compareSessions(a, b) {
  return a.compareTo(b);
}

class SessionSpec {
  constructor() {
    this.sessions = [];
    this.firstDayOfWeek = MONDAY;
    this.entriesHash = new Map();
    this.holidayAndCorrectionMap = new Map();
    this.holidaySessions = [];
  }

  parseSessions(timezone, spec) {
    let hasErrors = false;
    this._clear();
    this.timezone = timezone;

    const { hasErrors: firstDayOfWeekHasErrors, spec: firstDayOfWeekSpec } =
      this._parseFirstDayOfWeek(spec);
    if (firstDayOfWeekSpec.toLowerCase() === "24x7") {
      for (const day of [
        SUNDAY,
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY,
      ]) {
        this.sessions.push(this._createSessionEntry(day, 0, 0, 0, 0));
      }
    } else {
      let defaultSectionExists = false;
      const sessionsMap = new Map();

      for (const section of firstDayOfWeekSpec.split("|")) {
        const parts = section.split(":");
        if (parts.length !== 1 && parts.length !== 2) {
          hasErrors = true;
          console.log(`Bad session section: ${section}`);
          continue;
        }

        const hasNoDays = parts.length === 1;
        if (hasNoDays) {
          if (defaultSectionExists) {
            hasErrors = true;
            console.log(`Duplicated default section: ${section}`);
            continue;
          }
          defaultSectionExists = true;
        }

        const days = hasNoDays
          ? [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY]
          : this._parseWorkingDays(parts[1]);

        for (const day of days) {
          if (hasNoDays && sessionsMap.has(day)) continue;
          sessionsMap.set(day, parts[0]);
        }
      }

      for (const day of [
        SUNDAY,
        MONDAY,
        TUESDAY,
        WEDNESDAY,
        THURSDAY,
        FRIDAY,
        SATURDAY,
      ]) {
        const sessions = sessionsMap.get(day);
        if (sessions !== undefined) {
          for (const session of sessions.split(",")) {
            const { hasErrors: sessionEntryHasErrors, sessionEntry } =
              this._parseSessionEntry(day, session);
            if (sessionEntryHasErrors) hasErrors = true;
            this.sessions.push(sessionEntry);
          }
        }
      }
    }

    this.sessions.sort(compareSessions);

    const totalDayLengths = new Map();
    for (const session of this.sessions) {
      const dayOfWeek = session.dayOfWeek();
      totalDayLengths.set(
        dayOfWeek,
        session.length() + (totalDayLengths.get(dayOfWeek) || 0)
      );
    }

    this.maxTradingDayLength = 0;
    totalDayLengths.forEach((length) => {
      this.maxTradingDayLength = Math.max(this.maxTradingDayLength, length);
    });

    this.weekEndsCount = 7 - totalDayLengths.size;

    return { hasErrors: hasErrors || firstDayOfWeekHasErrors, spec };
  }

  static parseHolidaysAndCorrections(timezone, holidays, corrections) {
    const holidayMap = new Map();
    const correctionMap = new Map();
    const parseDay = (dateString) => {
      const year = parseInt(dateString.substring(0, 4));
      const month = parseInt(dateString.substring(4, 6));
      const day = parseInt(dateString.substring(6, 8));
      return new BusinessDay(year, month, day);
    };

    if (holidays !== "") {
      const holidayDates = [];
      for (const date of holidays.split(",")) {
        if (date.length !== 8) throw new Error(`bad holiday date: ${date}`);
        const holiday = parseDay(date);
        holidayMap.set(holiday, holidayDates);
      }
    }

    if (corrections !== "") {
      const utcTimezone = get_timezone("Etc/UTC");
      for (const section of corrections.split(";")) {
        const parts = section.split(":");
        if (parts.length !== 2)
          throw new Error(`bad correction section: ${section}`);

        const sessionEntries = [];
        if (parts[0] !== "dayoff") {
          for (const entry of parts[0].split(",")) {
            sessionEntries.push(this._parseSessionEntry(1, entry).sessionEntry);
          }
        }

        for (const date of parts[1].split(",")) {
          if (date.length !== 8)
            throw new Error(`bad correction date: ${date}`);
          const correctedDate = parseDay(date);
          const correctedWeekDay = get_day_of_week(
            get_cal(
              utcTimezone,
              correctedDate.year,
              correctedDate.month - 1,
              correctedDate.day
            )
          );
          const sessions = [];
          for (const sessionEntry of sessionEntries) {
            sessions.push(
              new a(
                correctedWeekDay,
                sessionEntry.startOffset(),
                sessionEntry.length()
              )
            );
          }
          correctionMap.set(correctedDate, sessions);
        }
      }
    }

    return { holidays: holidayMap, corrections: correctionMap };
  }

  _clear() {
    this.sessions = [];
    this.timezone = "";
    this.firstDayOfWeek = MONDAY;
    this.weekEndsCount = -1;
  }

  _parseFirstDayOfWeek(spec) {
    const parts = spec.split(";");
    if (parts.length > 2) {
      console.log(
        `Only one \`first day\` specification expected @ session ${spec}`
      );
      return { hasErrors: true, spec };
    }

    if (parts.length === 1) {
      return { hasErrors: false, spec };
    }

    let index = 1;
    let firstDay = parts[0].indexOf("-") >= 0 ? NaN : parseInt(parts[0]);
    if (isNaN(firstDay)) {
      index = 0;
      firstDay = parseInt(parts[1]);
    }

    if (firstDay < SUNDAY || firstDay > SATURDAY) {
      console.log(
        `Unexpected day index @ session: ${spec}; day index ${firstDay}`
      );
      return { hasErrors: true, spec };
    }

    this.firstDayOfWeek = firstDay;
    return { hasErrors: false, spec: parts[index] };
  }

  static _parseDay(dateString) {
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6));
    const day = parseInt(dateString.substring(6, 8));
    return new BusinessDay(year, month, day);
  }

  static _parseSessionEntry(dayOfWeek, entry) {
    let hasErrors = false;
    let timeParts = entry.split("-");
    if (timeParts.length !== 2) {
      hasErrors = true;
      console.log(`Bad sessions entry: ${entry}`);
      timeParts = ["0000", "0000"];
    }

    let startOffset = 0;
    let start = timeParts[0];
    if (start.includes("F")) {
      const startAndFactor = start.split("F");
      start = startAndFactor[0];
      startOffset = startAndFactor[1] !== "" ? parseInt(startAndFactor[1]) : 1;
    }

    let endOffset = 0;
    let end = timeParts[1];
    if (end.includes("F")) {
      const endAndFactor = end.split("F");
      end = endAndFactor[0];
      endOffset = endAndFactor[1] !== "" ? parseInt(endAndFactor[1]) : 1;
    }

    if (!this._isCorrectSession(start) || !this._isCorrectSession(end)) {
      throw new Error(`Incorrect entry syntax: ${entry}`);
    }

    const startValue = start;
    const endValue = end;

    return {
      hasErrors,
      sessionEntry: this._createSessionEntry(
        dayOfWeek,
        this._minutesFromHHMM(startValue),
        this._minutesFromHHMM(endValue),
        startOffset,
        endOffset
      ),
    };
  }

  static _isCorrectSession(value) {
    return (
      value.length === 4 &&
      value.charCodeAt(0) >= 48 &&
      value.charCodeAt(0) <= 57 &&
      value.charCodeAt(1) >= 48 &&
      value.charCodeAt(1) <= 57 &&
      value.charCodeAt(2) >= 48 &&
      value.charCodeAt(2) <= 57 &&
      value.charCodeAt(3) >= 48 &&
      value.charCodeAt(3) <= 57
    );
  }

  static _parseWorkingDays(value) {
    const days = [];
    for (let i = 0; i < value.length; i++) {
      const day = +value[i];
      if (days.indexOf(day) === -1) {
        days.push(day);
      }
    }
    return days;
  }

  static _minutesFromHHMM(value) {
    return get_minutes_from_hhmm(value);
  }

  static _createSessionEntry(dayOfWeek, start, end, startFactor, endFactor) {
    if (end === 0) {
      end = minutesPerDay;
    }
    if (startFactor === endFactor && end <= start) {
      endFactor += 1;
    }
    if (startFactor > 0) {
      start -= startFactor * minutesPerDay;
    }
    if (endFactor > 0) {
      end -= endFactor * minutesPerDay;
    }
    return new a(dayOfWeek, start, end - start);
  }
}

function isBefore(a, b) {
  return a.compareTo(b) < 0;
}

function getEntryBefore(sessions, target) {
  const index = (0, r.lowerbound)(sessions, target, (a, b) =>
    a.day.compareTo(b)
  );
  return index === sessions.length ? null : sessions[index];
}

// const baseTime = 621672192e5;

class SessionEntry {
  constructor(dayOfWeek, start, length) {
    this._dayOfWeek = dayOfWeek;
    this._start = start;
    this._length = length;
  }

  start() {
    return this._start + minutesPerDay * this.sessionStartDaysOffset();
  }

  startOffset() {
    return this._start;
  }

  sessionStartDaysOffset() {
    if (this._start >= 0) {
      return 0;
    } else if (this._start % minutesPerDay === 0) {
      return -Math.ceil(this._start / minutesPerDay);
    } else {
      return -Math.floor(this._start / minutesPerDay);
    }
  }

  sessionEndDaysOffset() {
    const end = this._start + this._length;
    if (end >= 0) {
      return 0;
    } else if (end % minutesPerDay === 0) {
      return -Math.ceil(end / minutesPerDay);
    } else {
      return -Math.floor(end / minutesPerDay);
    }
  }

  isOvernight() {
    return this._start < 0;
  }

  dayOfWeek() {
    return this._dayOfWeek;
  }

  sessionStartDayOfWeek() {
    let day = this._dayOfWeek - this.sessionStartDaysOffset();
    if (day < SUNDAY) {
      day += 7;
    }
    return day;
  }

  sessionEndDayOfWeek() {
    let day = this.sessionStartDayOfWeek() + this.sessionEndDaysOffset();
    if (day > SATURDAY) {
      day = 1;
    }
    return day;
  }

  length() {
    return this._length;
  }

  weight() {
    return this._dayOfWeek * minutesPerDay + this._start;
  }

  compareTo(other) {
    const weight = this.weight();
    const weightWithLength = weight + this._length;
    const otherWeight = other.weight();
    const otherWeightWithLength = otherWeight + other._length;
    if (
      (weight <= otherWeight && otherWeight < weightWithLength) ||
      (otherWeight <= weight && weight < otherWeightWithLength)
    ) {
      return 0;
    } else if (weight > otherWeight) {
      return 1;
    } else {
      return -1;
    }
  }

  contains(date) {
    const time = 60 * get_hours(date) + get_minutes(date);
    let dayOffset = get_day_of_week(date) - this._dayOfWeek;
    if (dayOffset > 0) {
      dayOffset -= 7;
    }
    const dateTime = dayOffset * minutesPerDay + time;
    return dateTime >= this._start && dateTime < this._start + this._length;
  }
}

class SessionSpec {
  constructor(
    timezone = "Etc/UTC",
    sessionSpec = "0000-0000",
    holidayDates = "",
    correctionSpec = ""
  ) {
    this.timezone = timezone;
    this.sessionSpec = sessionSpec;
    this.holidayDates = holidayDates;
    this.correctionSpec = correctionSpec;
    this.sessions = [];
    this.firstDayOfWeek = MONDAY;
    this.weekEndsCount = -1;
    this.holidaySessions = [];
    const parser = new SessionParser();
    const {
      sessions,
      timezone: parsedTimezone,
      firstDayOfWeek,
      weekEndsCount,
      maxTradingDayLength,
      holidayDates: parsedHolidayDates,
      correctionSpec: parsedCorrectionSpec,
    } = parser.parse(timezone, sessionSpec, holidayDates, correctionSpec);
    this.sessions = sessions;
    this.timezone = parsedTimezone;
    this.firstDayOfWeek = firstDayOfWeek;
    this.weekEndsCount = weekEndsCount;
    this.maxTradingDayLength = maxTradingDayLength;
    const holidayMap = this.parseHolidays(parsedHolidayDates);
    const correctionMap = this.parseCorrections(parsedCorrectionSpec);
    this.holidaySessions = this.getHolidaySessions(holidayMap, correctionMap);
  }

  parseHolidays(holidayDates) {
    const holidayMap = new Map();
    if (holidayDates !== "") {
      const dates = holidayDates.split(",");
      for (const date of dates) {
        if (date.length !== 8) {
          throw new Error(`bad holiday date: ${date}`);
        }
        const holiday = SessionParser._parseDay(date);
        holidayMap.set(holiday, []);
      }
    }
    return holidayMap;
  }

  parseCorrections(correctionSpec) {
    const correctionMap = new Map();
    if (correctionSpec === "") {
      return correctionMap;
    }

    const correctionSections = correctionSpec.split(";");
    const utcTimezone = get_timezone("Etc/UTC");

    for (const section of correctionSections) {
      const sectionParts = section.split(":");
      if (sectionParts.length !== 2) {
        throw new Error(`bad correction section: ${section}`);
      }

      const correctionDates = [];
      if (sectionParts[0] !== "dayoff") {
        const entries = SessionParser._parseWorkingDays(sectionParts[0]);
        for (const entry of entries) {
          correctionDates.push(
            this.sessions.find((session) => session.dayOfWeek() === entry)
          );
        }
      }

      const correctionDatesSection = sectionParts[1].split(",");
      for (const dateSection of correctionDatesSection) {
        if (dateSection.length !== 8) {
          throw new Error(`bad correction date: ${dateSection}`);
        }
        const holiday = SessionParser._parseDay(dateSection);
        const weekDay = get_day_of_week(
          get_cal(utcTimezone, holiday.year, holiday.month - 1, holiday.day)
        );
        const sessions = [];
        for (const correctionDate of correctionDates) {
          sessions.push(
            new SessionEntry(
              weekDay,
              correctionDate.startOffset(),
              correctionDate.length()
            )
          );
        }
        correctionMap.set(holiday, sessions);
      }
    }

    return correctionMap;
  }

  getHolidaySessions(holidayMap, correctionMap) {
    const holidaySessions = [];
    for (const [date, sessions] of holidayMap) {
      holidaySessions.push({
        day: date,

        sessions,
      });
    }

    for (const [date, sessions] of correctionMap) {
      const existingHolidaySession = holidaySessions.find(
        (hs) =>
          hs.day.year === date.year &&
          hs.day.month === date.month &&
          hs.day.day === date.day
      );
      if (existingHolidaySession) {
        existingHolidaySession.sessions.push(...sessions);
      } else {
        holidaySessions.push({
          day: date,
          sessions,
        });
      }
    }

    holidaySessions.sort((a, b) => a.day.compareTo(b.day));
    return holidaySessions;
  }

  activeSessions(startDate, endDate) {
    const activeSessions = [];
    const startCal = get_cal_from_unix_timestamp_ms(startDate);
    const endCal = get_cal_from_unix_timestamp_ms(endDate);

    const start =
      get_hours(set_hms(clone(startCal), 0, 0, 0)) * 60 + get_minutes(startCal);
    const end =
      get_hours(set_hms(clone(endCal), 0, 0, 0)) * 60 + get_minutes(endCal);

    const startEntry = new SessionEntry(get_day_of_week(startCal), start, 0);
    const endEntry = new SessionEntry(get_day_of_week(endCal), end, 0);

    const startSession = getEntryBefore(this.sessions, startEntry);
    const endSession = getEntryBefore(this.sessions, endEntry);

    if (startSession && !startSession.contains(startCal)) {
      const prevSession = getEntryBefore(this.sessions, startEntry);
      if (
        prevSession &&
        prevSession.sessionEndDayOfWeek() !== startSession.dayOfWeek()
      ) {
        activeSessions.push({
          session: prevSession,
          start: startDate,
          end:
            prevSession.sessionEndDaysOffset() === 0
              ? endCal
              : add_date(
                  clone(startCal),
                  prevSession.sessionEndDaysOffset() * 24 * 60 * 60 * 1000
                ),
        });
      }
      activeSessions.push({
        session: startSession,
        start: add_date(
          clone(startCal),
          startSession.sessionStartDaysOffset() * 24 * 60 * 60 * 1000
        ),
        end: startEntry,
      });
    } else {
      activeSessions.push({
        session: startSession,
        start: startDate,
        end: startEntry,
      });
    }

    if (startSession && startSession.compareTo(endSession) !== 0) {
      activeSessions.push({
        session: endSession,
        start: endEntry,
        end: add_date(
          clone(endCal),
          endSession.sessionEndDaysOffset() * 24 * 60 * 60 * 1000
        ),
      });
    }

    const sessionsRange = this.sessions.slice(
      this.sessions.indexOf(startSession),
      this.sessions.indexOf(endSession) + 1
    );
    for (const session of sessionsRange) {
      activeSessions.push({
        session,
        start: add_date(
          clone(startCal),
          session.sessionStartDaysOffset() * 24 * 60 * 60 * 1000
        ),
        end: add_date(
          clone(startCal),
          (session.sessionStartDaysOffset() + 1) * 24 * 60 * 60 * 1000
        ),
      });
    }

    return activeSessions;
  }

  getSessionStartTimes(startDate, endDate) {
    const sessionStartTimes = [];
    const activeSessions = this.activeSessions(startDate, endDate);
    for (const session of activeSessions) {
      const sessionStart = session.start.getTime() - baseTime;
      sessionStartTimes.push(sessionStart);
    }
    return sessionStartTimes;
  }

  getSessionEndTimes(startDate, endDate) {
    const sessionEndTimes = [];
    const activeSessions = this.activeSessions(startDate, endDate);
    for (const session of activeSessions) {
      const sessionEnd = session.end.getTime() - baseTime;
      sessionEndTimes.push(sessionEnd);
    }
    return sessionEndTimes;
  }
}

class SessionParser {
  parse(timezone, sessionSpec, holidayDates, correctionSpec) {
    const sessionSpecParser = new SessionSpec();
    const { hasErrors, spec } = sessionSpecParser.parseSessions(
      timezone,
      sessionSpec
    );
    if (hasErrors) {
      throw new Error(`Error parsing session specification: ${sessionSpec}`);
    }

    const { holidays, corrections } = SessionSpec.parseHolidaysAndCorrections(
      timezone,
      holidayDates,
      correctionSpec
    );
    const holidaySessions = sessionSpecParser.getHolidaySessions(
      holidays,
      corrections
    );

    return {
      sessions: sessionSpecParser.sessions,
      timezone: sessionSpecParser.timezone,
      firstDayOfWeek: sessionSpecParser.firstDayOfWeek,
      weekEndsCount: sessionSpecParser.weekEndsCount,
      maxTradingDayLength: sessionSpecParser.maxTradingDayLength,
      holidayDates,
      correctionSpec,
    };
  }

  static _parseDay(dateString) {
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6));
    const day = parseInt(dateString.substring(6, 8));
    return new BusinessDay(year, month, day);
  }

  static _parseSessionEntry(dayOfWeek, entry) {
    let hasErrors = false;
    let timeParts = entry.split("-");
    if (timeParts.length !== 2) {
      hasErrors = true;
      console.log(`Bad sessions entry: ${entry}`);
      timeParts = ["0000", "0000"];
    }

    let startOffset = 0;
    let start = timeParts[0];
    if (start.includes("F")) {
      const startAndFactor = start.split("F");
      start = startAndFactor[0];
      startOffset = startAndFactor[1] !== "" ? parseInt(startAndFactor[1]) : 1;
    }

    let endOffset = 0;
    let end = timeParts[1];
    if (end.includes("F")) {
      const endAndFactor = end.split("F");
      end = endAndFactor[0];
      endOffset = endAndFactor[1] !== "" ? parseInt(endAndFactor[1]) : 1;
    }

    if (
      !SessionParser._isCorrectSession(start) ||
      !SessionParser._isCorrectSession(end)
    ) {
      throw new Error(`Incorrect entry syntax: ${entry}`);
    }

    const startValue = start;
    const endValue = end;

    return {
      hasErrors,
      sessionEntry: SessionParser._createSessionEntry(
        dayOfWeek,
        SessionParser._minutesFromHHMM(startValue),
        SessionParser._minutesFromHHMM(endValue),
        startOffset,
        endOffset
      ),
    };
  }

  static _isCorrectSession(value) {
    return (
      value.length === 4 &&
      value.charCodeAt(0) >= 48 &&
      value.charCodeAt(0) <= 57 &&
      value.charCodeAt(1) >= 48 &&
      value.charCodeAt(1) <= 57 &&
      value.charCodeAt(2) >= 48 &&
      value.charCodeAt(2) <= 57 &&
      value.charCodeAt(3) >= 48 &&
      value.charCodeAt(3) <= 57
    );
  }

  static _parseWorkingDays(value) {
    const days = [];
    for (let i = 0; i < value.length; i++) {
      const day = +value[i];
      if (days.indexOf(day) === -1) {
        days.push(day);
      }
    }
    return days;
  }

  static _minutes;

  FromHHMM(value) {
    return get_minutes_from_hhmm(value);
  }

  static _createSessionEntry(dayOfWeek, start, end, startFactor, endFactor) {
    if (end === 0) {
      end = minutesPerDay;
    }
    if (startFactor === endFactor && end <= start) {
      endFactor += 1;
    }
    if (startFactor > 0) {
      start -= startFactor * minutesPerDay;
    }
    if (endFactor > 0) {
      end -= endFactor * minutesPerDay;
    }
    return new SessionEntry(dayOfWeek, start, end - start);
  }

  parseSessions(timezone, sessionSpec) {
    const parts = sessionSpec.split("/");
    if (parts.length !== 3) {
      console.log(`Bad session specification: ${sessionSpec}`);
      return { hasErrors: true, spec: sessionSpec };
    }

    const timezoneParts = parts[0].split(":");
    if (timezoneParts.length !== 2) {
      console.log(`Bad timezone specification: ${parts[0]}`);
      return { hasErrors: true, spec: sessionSpec };
    }

    const firstDayOfWeekSpec = timezoneParts[1];
    if (firstDayOfWeekSpec) {
      const result = this._parseFirstDayOfWeek(firstDayOfWeekSpec);
      if (result.hasErrors) {
        return { hasErrors: true, spec: sessionSpec };
      }
      sessionSpec = result.spec;
    }

    const timeSpecs = parts[1].split(",");
    if (timeSpecs.length === 0) {
      console.log(`No session time specification found: ${sessionSpec}`);
      return { hasErrors: true, spec: sessionSpec };
    }

    const sessions = [];
    let maxTradingDayLength = 0;

    for (let i = 0; i < timeSpecs.length; i++) {
      const dayOfWeek = i + 1;
      const daySpec = timeSpecs[i];
      const sessionEntries = daySpec.split(";");
      if (sessionEntries.length === 0) {
        console.log(`No session entries found for day: ${daySpec}`);
        return { hasErrors: true, spec: sessionSpec };
      }

      for (const entry of sessionEntries) {
        const { hasErrors, sessionEntry } = SessionParser._parseSessionEntry(
          dayOfWeek,
          entry
        );
        if (hasErrors) {
          return { hasErrors: true, spec: sessionSpec };
        }
        sessions.push(sessionEntry);
        if (sessionEntry.length() > maxTradingDayLength) {
          maxTradingDayLength = sessionEntry.length();
        }
      }
    }

    this.sessions = sessions;
    this.timezone = timezoneParts[0];
    this.firstDayOfWeek = this._parseFirstDayOfWeek(timezoneParts[1]).hasErrors
      ? MONDAY
      : this._parseFirstDayOfWeek(timezoneParts[1]).spec;

    const weekEndsCount = parts[2] ? parseInt(parts[2]) : -1;
    this.weekEndsCount = weekEndsCount;
    this.maxTradingDayLength = maxTradingDayLength;

    return { hasErrors: false, spec: sessionSpec };
  }

  _parseFirstDayOfWeek(spec) {
    const parts = spec.split(";");
    if (parts.length > 2) {
      console.log(
        `Only one \`first day\` specification expected @ session ${spec}`
      );
      return { hasErrors: true, spec };
    }

    if (parts.length === 1) {
      return { hasErrors: false, spec };
    }

    let index = 1;
    let firstDay = parts[0].indexOf("-") >= 0 ? NaN : parseInt(parts[0]);
    if (isNaN(firstDay)) {
      index = 0;
      firstDay = parseInt(parts[1]);
    }

    if (firstDay < SUNDAY || firstDay > SATURDAY) {
      console.log(
        `Unexpected day index @ session: ${spec}; day index ${firstDay}`
      );
      return { hasErrors: true, spec };
    }

    this.firstDayOfWeek = firstDay;
    return { hasErrors: false, spec: parts[index] };
  }

  static parseHolidaysAndCorrections(timezone, holidayDates, correctionSpec) {
    const holidayMap = new Map();
    const correctionMap = new Map();

    const utcTimezone = get_timezone("Etc/UTC");
    const currentYear = get_year(get_today(utcTimezone));

    if (holidayDates !== "") {
      const dates = holidayDates.split(",");
      for (const date of dates) {
        if (date.length !== 8) {
          throw new Error(`bad holiday date: ${date}`);
        }
        const holiday = SessionParser._parseDay(date);
        holidayMap.set(holiday, []);
      }
    }

    if (correctionSpec !== "") {
      const sections = correctionSpec.split(";");
      for (const section of sections) {
        const parts = section.split(":");
        if (parts.length !== 2) {
          throw new Error(`bad correction section: ${section}`);
        }

        const correctionDates = [];
        if (parts[0] !== "dayoff") {
          const entries = SessionParser._parseWorkingDays(parts[0]);
          for (const entry of entries) {
            correctionDates.push(entry);
          }
        }

        const dateSection = parts[1];
        const dateParts = dateSection.split(",");
        for (const datePart of dateParts) {
          if (datePart.length !== 8) {
            throw new Error(`bad correction date: ${datePart}`);
          }
          const holiday = SessionParser._parseDay(datePart);
          const weekDay = get_day_of_week(
            get_cal(utcTimezone, holiday.year, holiday.month - 1, holiday.day)
          );
          const sessions = [];
          for (const correctionDate of correctionDates) {
            sessions.push(
              new SessionEntry(
                weekDay,
                this._minutesFromHHMM(
                  this.sessions
                    .find((session) => session.dayOfWeek() === correctionDate)
                    .startOffset()
                ),
                this.sessions
                  .find((session) => session.dayOfWeek() === correctionDate)
                  .length()
              )
            );
          }
          correctionMap.set(holiday, sessions);
        }
      }
    }

    return { holidays: holidayMap, corrections: correctionMap };
  }
}

function isBefore(a, b) {
  return a.compareTo(b) < 0;
}

function getEntryBefore(sessions, target) {
  const index = (0, r.lowerbound)(sessions, target, (a, b) =>
    a.day.compareTo(b)
  );
  return index === sessions.length ? null : sessions[index];
}

const baseTime = 621672192e5;

class SessionEntry {
  constructor(dayOfWeek, start, length) {
    this._dayOfWeek = dayOfWeek;
    this._start = start;
    this._length = length;
  }

  start() {
    return this._start + minutesPerDay * this.sessionStartDaysOffset();
  }

  startOffset() {
    return this._start;
  }

  sessionStartDaysOffset() {
    if (this._start >= 0) {
      return 0;
    } else if (this._start % minutesPerDay === 0) {
      return -Math.ceil(this._start / minutesPerDay);
    } else {
      return -Math.floor(this._start / minutesPerDay);
    }
  }

  end() {
    return (
      this._start + this._length + minutesPerDay * this.sessionEndDaysOffset()
    );
  }

  sessionEndDaysOffset() {
    const end = this._start + this._length;
    if (end >= 0) {
      return 0;
    } else if (end % minutesPerDay === 0) {
      return -Math.ceil(end / minutesPerDay);
    } else {
      return -Math.floor(end / minutesPerDay);
    }
  }

  isOvernight() {
    return this._start < 0;
  }

  dayOfWeek() {
    return this._dayOfWeek;
  }

  sessionStartDayOfWeek() {
    let day = this._dayOfWeek - this.sessionStartDaysOffset();
    if (day < SUNDAY) {
      day += 7;
    }
    return day;
  }

  sessionEndDayOfWeek() {
    let day = this.sessionStartDayOfWeek() + this.sessionEndDaysOffset();
    if (day > SATURDAY) {
      day = 1;
    }
    return day;
  }

  length() {
    return this._length;
  }

  weight() {
    return this._dayOfWeek * minutesPerDay + this._start;
  }

  compareTo(other) {
    const weight = this.weight();
    const weightWithLength = weight + this._length;
    const otherWeight = other.weight();
    const otherWeightWithLength = otherWeight + other._length;
    if (
      (weight <= otherWeight && otherWeight < weightWithLength) ||
      (otherWeight <= weight && weight < otherWeightWithLength)
    ) {
      return 0;
    } else if (weight > otherWeight) {
      return 1;
    } else {
      return -1;
    }
  }

  contains(date) {
    const time = 60 * get_hours(date) + get_minutes(date);
    let dayOffset = get_day_of_week(date) - this._dayOfWeek;
    if (dayOffset > 0) {
      dayOffset -= 7;
    }
    const dateTime = dayOffset * minutesPerDay + time;
    return dateTime >= this._start && dateTime < this._start + this._length;
  }
}

class SessionSpec {
  constructor(
    timezone = "Etc/UTC",
    sessionSpec = "0000-0000",
    holidayDates = "",
    correctionSpec = ""
  ) {
    this.timezone = timezone;
    this.sessionSpec = sessionSpec;
    this.holidayDates = holidayDates;
    this.correctionSpec = correctionSpec;
    this.sessions = [];
    this.firstDayOfWeek = MONDAY;
    this.weekEndsCount = -1;
    this.holidaySessions = [];
    const parser = new SessionParser();
    const {
      sessions,
      timezone: parsedTimezone,
      firstDayOfWeek,
      weekEndsCount,
      maxTradingDayLength,
      holidayDates: parsedHolidayDates,
      correctionSpec: parsedCorrectionSpec,
    } = parser.parse(timezone, sessionSpec, holidayDates, correctionSpec);
    this.sessions = sessions;
    this.timezone = parsedTimezone;
    this.firstDayOfWeek = firstDayOfWeek;
    this.weekEndsCount = weekEndsCount;
    this.maxTradingDayLength = maxTradingDayLength;
    const holidayMap = this.parseHolidays(parsedHolidayDates);
    const correctionMap = this.parseCorrections(parsedCorrectionSpec);
    this.holidaySessions = this.getHolidaySessions(holidayMap, correctionMap);
  }

  parseHolidays(holidayDates) {
    const holidayMap = new Map();
    if (holidayDates !== "") {
      const dates = holidayDates.split(",");
      for (const date of dates) {
        if (date.length !== 8) {
          throw new Error(`bad holiday date: ${date}`);
        }
        const holiday = SessionParser._parseDay(date);
        holidayMap.set(holiday, []);
      }
    }
    return holidayMap;
  }

  parseCorrections(correctionSpec) {
    const correctionMap = new Map();
    if (correctionSpec === "") {
      return correctionMap;
    }

    const correctionSections = correctionSpec.split(";");
    const utcTimezone = get_timezone("Etc/UTC");

    for (const section of correctionSections) {
      const sectionParts = section.split(":");
      if (sectionParts.length !== 2) {
        throw new Error(`bad correction section: ${section}`);
      }

      const correctionDates = [];
      if (sectionParts[0] !== "dayoff") {
        const entries = SessionParser._parseWorkingDays(sectionParts[0]);
        for (const entry of entries) {
          correctionDates.push(
            this.sessions.find((session) => session.dayOfWeek() === entry)
          );
        }
      }

      const correctionDatesSection = sectionParts[1].split(",");
      for (const dateSection of correctionDatesSection) {
        if (dateSection.length !== 8) {
          throw new Error(`bad correction date: ${dateSection}`);
        }
        const holiday = SessionParser._parseDay(dateSection);
        const weekDay = get_day_of_week(
          get_cal(utcTimezone, holiday.year, holiday.month - 1, holiday.day)
        );
        const sessions = [];
        for (const correctionDate of correctionDates) {
          sessions.push(
            new SessionEntry(
              weekDay,
              correctionDate.startOffset(),
              correctionDate.length()
            )
          );
        }
        correctionMap.set(holiday, sessions);
      }
    }

    return correctionMap;
  }

  getHolidaySessions(holidayMap, correctionMap) {
    const holidaySessions = [];
    for (const [date, sessions] of holidayMap) {
      holidaySessions.push({
        day: date,
        sessions,
      });
    }

    for (const [date, sessions] of correctionMap) {
      const existingHolidaySession = holidaySessions.find(
        (hs) =>
          hs.day.year === date.year &&
          hs.day.month === date.month &&
          hs.day.day === date.day
      );
      if (existingHolidaySession) {
        existingHolidaySession.sessions.push(...sessions);
      } else {
        holidaySessions.push({
          day: date,
          sessions,
        });
      }
    }

    holidaySessions.sort((a, b) => a.day.compareTo(b.day));
    return holidaySessions;
  }

  activeSessions(startDate, endDate) {
    const activeSessions = [];
    const startCal = get_cal_from_unix_timestamp_ms(startDate);
    const endCal = get_cal_from_unix_timestamp_ms(endDate);

    const start =
      get_hours(set_hms(clone(startCal), 0, 0, 0)) * 60 + get_minutes(startCal);
    const end =
      get_hours(set_hms(clone(endCal), 0, 0, 0)) * 60 + get_minutes(endCal);

    const startEntry = new SessionEntry(get_day_of_week(startCal), start, 0);
    const endEntry = new SessionEntry(get_day_of_week(endCal), end, 0);

    const startSession = getEntryBefore(this.sessions, startEntry);
    const endSession = getEntryBefore(this.sessions, endEntry);

    if (startSession && !startSession.contains(startCal)) {
      const prevSession = getEntryBefore(this.sessions, startEntry);
      if (
        prevSession &&
        prevSession.sessionEndDayOfWeek() !== startSession.dayOfWeek()
      ) {
        activeSessions.push({
          session: prevSession,
          start: startDate,

          end:
            prevSession.sessionEndDaysOffset() === 0
              ? endCal
              : add_date(
                  clone(startCal),
                  prevSession.sessionEndDaysOffset() * 24 * 60 * 60 * 1000
                ),
        });
      }
      activeSessions.push({
        session: startSession,
        start: add_date(
          clone(startCal),
          startSession.sessionStartDaysOffset() * 24 * 60 * 60 * 1000
        ),
        end: startEntry,
      });
    } else {
      activeSessions.push({
        session: startSession,
        start: startDate,
        end: startEntry,
      });
    }

    if (startSession && startSession.compareTo(endSession) !== 0) {
      activeSessions.push({
        session: endSession,
        start: endEntry,
        end: add_date(
          clone(endCal),
          endSession.sessionEndDaysOffset() * 24 * 60 * 60 * 1000
        ),
      });
    }

    const sessionsRange = this.sessions.slice(
      this.sessions.indexOf(startSession),
      this.sessions.indexOf(endSession) + 1
    );
    for (const session of sessionsRange) {
      activeSessions.push({
        session,
        start: add_date(
          clone(startCal),
          session.sessionStartDaysOffset() * 24 * 60 * 60 * 1000
        ),
        end: add_date(
          clone(startCal),
          (session.sessionStartDaysOffset() + 1) * 24 * 60 * 60 * 1000
        ),
      });
    }

    return activeSessions;
  }

  getSessionStartTimes(startDate, endDate) {
    const sessionStartTimes = [];
    const activeSessions = this.activeSessions(startDate, endDate);
    for (const session of activeSessions) {
      const sessionStart = session.start.getTime() - baseTime;
      sessionStartTimes.push(sessionStart);
    }
    return sessionStartTimes;
  }

  getSessionEndTimes(startDate, endDate) {
    const sessionEndTimes = [];
    const activeSessions = this.activeSessions(startDate, endDate);
    for (const session of activeSessions) {
      const sessionEnd = session.end.getTime() - baseTime;
      sessionEndTimes.push(sessionEnd);
    }
    return sessionEndTimes;
  }
}

function isBefore(a, b) {
  return a.compareTo(b) < 0;
}

function getEntryBefore(sessions, target) {
  const index = (0, r.lowerbound)(sessions, target, (a, b) =>
    a.day.compareTo(b)
  );
  return index === sessions.length ? null : sessions[index];
}

// const baseTime = 621672192e5;

class SessionEntry {
  constructor(dayOfWeek, start, length) {
    this._dayOfWeek = dayOfWeek;
    this._start = start;
    this._length = length;
  }

  start() {
    return this._start + minutesPerDay * this.sessionStartDaysOffset();
  }

  startOffset() {
    return this._start;
  }

  sessionStartDaysOffset() {
    if (this._start >= 0) {
      return 0;
    } else if (this._start % minutesPerDay === 0) {
      return -Math.ceil(this._start / minutesPerDay);
    } else {
      return -Math.floor(this._start / minutesPerDay);
    }
  }

  end() {
    return (
      this._start + this._length + minutesPerDay * this.sessionEndDaysOffset()
    );
  }

  sessionEndDaysOffset() {
    const end = this._start + this._length;
    if (end >= 0) {
      return 0;
    } else if (end % minutesPerDay === 0) {
      return -Math.ceil(end / minutesPerDay);
    } else {
      return -Math.floor(end / minutesPerDay);
    }
  }

  isOvernight() {
    return this._start < 0;
  }

  dayOfWeek() {
    return this._dayOfWeek;
  }

  sessionStartDayOfWeek() {
    let day = this._dayOfWeek - this.sessionStartDaysOffset();
    if (day < SUNDAY) {
      day += 7;
    }
    return day;
  }

  sessionEndDayOfWeek() {
    let day = this.sessionStartDayOfWeek() + this.sessionEndDaysOffset();
    if (day > SATURDAY) {
      day = 1;
    }
    return day;
  }

  length() {
    return this._length;
  }

  weight() {
    return this._dayOfWeek * minutesPerDay + this._start;
  }

  compareTo(other) {
    const weight = this.weight();
    const weightWithLength = weight + this._length;
    const otherWeight = other.weight();
    const otherWeightWithLength = otherWeight + other._length;
    if (
      (weight <= otherWeight && otherWeight < weightWithLength) ||
      (otherWeight <= weight && weight < otherWeightWithLength)
    ) {
      return 0;
    } else if (weight > otherWeight) {
      return 1;
    } else {
      return -1;
    }
  }

  contains(date) {
    const time = 60 * get_hours(date) + get_minutes(date);
    let dayOffset = get_day_of_week(date) - this._dayOfWeek;
    if (dayOffset > 0) {
      dayOffset -= 7;
    }
    const dateTime = dayOffset * minutesPerDay + time;
    return dateTime >= this._start && dateTime < this._start + this._length;
  }
}

class SessionSpec {
  constructor(
    timezone = "Etc/UTC",
    sessionSpec = "0000-0000",
    holidayDates = "",
    correctionSpec = ""
  ) {
    this.timezone = timezone;
    this.sessionSpec = sessionSpec;
    this.holidayDates = holidayDates;
    this.correctionSpec = correctionSpec;
    this.sessions = [];
    this.firstDayOfWeek = MONDAY;
    this.weekEndsCount = -1;
    this.holidaySessions = [];
    const parser = new SessionParser();
    const {
      sessions,
      timezone: parsedTimezone,
      firstDayOfWeek,
      weekEndsCount,
      maxTradingDayLength,
      holidayDates: parsedHolidayDates,
      correctionSpec: parsedCorrectionSpec,
    } = parser.parse(timezone, sessionSpec, holidayDates, correctionSpec);
    this.sessions = sessions;
    this.timezone = parsedTimezone;
    this.firstDayOfWeek = firstDayOfWeek;
    this.weekEndsCount = weekEndsCount;
    this.maxTradingDayLength = maxTradingDayLength;
    const holidayMap = this.parseHolidays(parsedHolidayDates);
    const correctionMap = this.parseCorrections(parsedCorrectionSpec);
    this.holidaySessions = this.getHolidaySessions(holidayMap, correctionMap);
  }

  parseHolidays(holidayDates) {
    const holidayMap = new Map();
    if (holidayDates !== "") {
      const dates = holidayDates.split(",");
      for (const date of dates) {
        if (date.length !== 8) {
          throw new Error(`bad holiday date: ${date}`);
        }
        const holiday = SessionParser._parseDay(date);
        holidayMap.set(holiday, []);
      }
    }
    return holidayMap;
  }

  parseCorrections(correctionSpec) {
    const correctionMap = new Map();
    if (correctionSpec === "") {
      return correctionMap;
    }

    const correctionSections = correctionSpec.split(";");
    const utcTimezone = get_timezone("Etc/UTC");

    for (const section of correctionSections) {
      const sectionParts = section.split(":");
      if (sectionParts.length !== 2) {
        throw new Error(`bad correction section: ${section}`);
      }

      const correctionDates = [];
      if (sectionParts[0] !== "dayoff") {
        const entries = SessionParser._parseWorkingDays(sectionParts[0]);
        for (const entry of entries) {
          correctionDates.push(
            this.sessions.find((session) => session.dayOfWeek() === entry)
          );
        }
      }

      const correctionDatesSection = sectionParts[1].split(",");
      for (const dateSection of correctionDatesSection) {
        if (dateSection.length !== 8) {
          throw new Error(`bad correction date: ${dateSection}`);
        }
        const holiday = SessionParser._parseDay(dateSection);
        const weekDay = get_day_of_week(
          get_cal(utcTimezone, holiday.year, holiday.month - 1, holiday.day)
        );
        const sessions = [];
        for (const correctionDate of correctionDates) {
          sessions.push(
            new SessionEntry(
              weekDay,
              correctionDate.startOffset(),
              correctionDate.length()
            )
          );
        }
        correctionMap.set(holiday, sessions);
      }
    }

    return correctionMap;
  }

  getHolidaySessions(holidayMap, correctionMap) {
    const holidaySessions = [];
    for (const [date, sessions] of holidayMap) {
      holidaySessions.push({
        day: date,
        sessions,
      });
    }

    for (const [date, sessions] of correctionMap) {
      const existingHolidaySession = holidaySessions.find(
        (hs) =>
          hs.day.year === date.year &&
          hs.day.month === date.month &&
          hs.day.day === date.day
      );
      if (existingHolidaySession) {
        existingHolidaySession.sessions.push(...sessions);
      } else {
        holidaySessions.push({
          day: date,
          sessions,
        });
      }
    }

    holidaySessions.sort((a, b) => a.day.compareTo(b.day));
    return holidaySessions;
  }

  activeSessions(startDate, endDate) {
    const activeSessions = [];
    const startCal = get_cal_from_unix_timestamp_ms(startDate);
    const endCal = get_cal_from_unix_timestamp_ms(endDate);

    const start =
      get_hours(set_hms(clone(startCal), 0, 0, 0)) * 60 + get_minutes(startCal);
    const end =
      get_hours(set_hms(clone(endCal), 0, 0, 0)) * 60 + get_minutes(endCal);

    const startEntry = new SessionEntry(get_day_of_week(startCal), start, 0);
    const endEntry = new SessionEntry(get_day_of_week(endCal), end, 0);

    const startSession = getEntryBefore(this.sessions, startEntry);
    const endSession = getEntryBefore(this.sessions, endEntry);

    if (startSession && !startSession.contains(startCal)) {
      const prevSession = getEntryBefore(this.sessions, startEntry);
      if (
        prevSession &&
        prevSession.sessionEndDayOfWeek() !== startSession.dayOfWeek()
      ) {
        activeSessions.push({
          session: prevSession,
          start: startDate,
          end:
            prevSession.sessionEndDaysOffset() === 0
              ? endCal
              : add_date(
                  clone(startCal),
                  prevSession.sessionEndDaysOffset() * 24 * 60 * 60 * 1000
                ),
        });
      }
      activeSessions.push({
        session: startSession,
        start: add_date(
          clone(startCal),
          startSession.sessionStartDaysOffset() * 24 * 60 * 60 * 1000
        ),
        end: startEntry,
      });
    } else {
      activeSessions.push({
        session: startSession,
        start: startDate,
        end: startEntry,
      });
    }

    if (startSession && startSession.compareTo(endSession) !== 0) {
      activeSessions.push({
        session: endSession,
        start: endEntry,
        end: add_date(
          clone(endCal),
          endSession.sessionEndDaysOffset() * 24 * 60 * 60 * 1000
        ),
      });
    }

    const sessionsRange = this.sessions.slice(
      this.sessions.indexOf(startSession),
      this.sessions.indexOf(endSession) + 1
    );
    for (const session of sessionsRange) {
      activeSessions.push({
        session,
        start: add_date(
          clone(startCal),
          session.sessionStartDaysOffset() * 24 * 60 * 60 * 1000
        ),
        end: add_date(
          clone(startCal),
          (session.sessionStartDaysOffset() + 1) * 24 * 60 * 60 * 1000
        ),
      });
    }

    return activeSessions;
  }

  getSessionStartTimes(startDate, endDate) {
    const sessionStartTimes = [];
    const activeSessions = this.activeSessions(startDate, endDate);
    for (const session of activeSessions) {
      const sessionStart = session.start.getTime() - baseTime;
      sessionStartTimes.push(sessionStart);
    }
    return sessionStartTimes;
  }

  getSessionEndTimes(startDate, endDate) {
    const sessionEndTimes = [];
    const activeSessions = this.activeSessions(startDate, endDate);
    for (const session of activeSessions) {
      const sessionEnd = session.end.getTime() - baseTime;
      sessionEndTimes.push(sessionEnd);
    }
    return sessionEndTimes;
  }
}
