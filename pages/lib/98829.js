"use strict";

const { get_timezone } = require(41249);
const { SessionSpec, SessionStage } = require(32923);

class SessionInfo {
  constructor(timezone, spec, holidays, corrections) {
    this.init(timezone, spec, holidays, corrections);
    this._state = {
      timezone: timezone,
      spec: spec,
      holidays: holidays,
      corrections: corrections
    };
  }

  init(timezone, spec, holidays, corrections) {
    this.timezone = get_timezone(timezone);
    this.spec = new SessionSpec(timezone, spec, holidays, corrections);
  }

  state() {
    return this._state;
  }

  static fromState(state) {
    return new SessionInfo(state.timezone, state.spec, state.holidays, state.corrections);
  }
}

class BarBuilderBase {
  alignTime(time) {
    if (isNaN(time)) return NaN;

    let stage = this.indexOfBar(time);

    if (stage === SessionStage.POST_SESSION) {
      this.moveTo(time);
      stage = this.indexOfBar(time);
    }

    return stage < 0 ? NaN : this.startOfBar(stage);
  }
}

module.exports = {
  BarBuilderBase,
  SessionInfo
};
