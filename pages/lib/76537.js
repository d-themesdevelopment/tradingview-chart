import { lowerbound_int, upperbound_int, assert, ensureNotNull } from 'some-library';
import { newBarBuilder, SessionInfo } from 'another-library';
import { extrapolateBarsFrontToTime, extrapolateBarsFrontByCount } from 'yet-another-library';

class SymbolExtrapolator {
  constructor(symbolInfo, interval, extrapolateLimit = 200000) {
    this._firstRealBarTimeMs = null;
    this._historyBarsCache = [];
    this._projectionFirstIndex = Infinity;
    this._barsTimes = [];
    this._minFutureBarsCount = 0;
    this._lastRealBarTimeMs = null;
    this._futureBarsCache = [];
    this._symbolInfo = symbolInfo;
    this._interval = Interval.parse(interval);
    this._extrapolateLimit = extrapolateLimit;
    this._barBuilder = newBarBuilder(interval, new SessionInfo(symbolInfo.timezone, symbolInfo.session, symbolInfo.session_holidays, symbolInfo.corrections), null);
  }

  destroy() {
    this.clear();
  }

  interval() {
    return this._interval;
  }

  barBuilder() {
    return this._barBuilder;
  }

  symbolInfo() {
    return this._symbolInfo;
  }

  clear() {
    this._firstRealBarTimeMs = null;
    this._historyBarsCache = [];
    this._barsTimes = [];
    this._lastRealBarTimeMs = null;
    this._futureBarsCache = [];
    this._minFutureBarsCount = 0;
    this._projectionFirstIndex = Infinity;
  }

  firstFutureBarIndex() {
    return this._barsTimes.length;
  }

  futureBars() {
    return this._futureBarsCache;
  }

  replaceBarsTimesTail(newBarsTimes, t = newBarsTimes.length) {
    if (newBarsTimes.length === 0) return;
    if (this._barsTimes.length === 0) return void this.setBarsTimes(newBarsTimes, t);
    const firstNewTime = newBarsTimes[0];
    const lastBarsTime = this._barsTimes[this._barsTimes.length - 1];
    const insertIndex = firstNewTime > lastBarsTime ? this._barsTimes.length : lowerbound_int(this._barsTimes, firstNewTime);
    if (insertIndex !== 0) {
      this._barsTimes.splice(insertIndex, this._barsTimes.length, ...newBarsTimes);
      this._projectionFirstIndex = t === newBarsTimes.length ? this._barsTimes.length : this._barsTimes.indexOf(newBarsTimes[t]);
      assert(this._projectionFirstIndex !== -1, "something went wrong");
      if (lastBarsTime !== newBarsTimes[newBarsTimes.length - 1]) this._setLastRealBarTime(newBarsTimes[newBarsTimes.length - 1]);
    } else {
      this.setBarsTimes(newBarsTimes, t);
    }
  }

  setBarsTimes(newBarsTimes, t = newBarsTimes.length) {
    const prevBarsTimes = this._barsTimes;
    this._barsTimes = newBarsTimes.slice();
    this._projectionFirstIndex = newBarsTimes.length === 0 ? Infinity : t;
    if (newBarsTimes.length === 0) {
      this._historyBarsCache = [];
      this._futureBarsCache = [];
      this._firstRealBarTimeMs = null;
      this._lastRealBarTimeMs = null;
      return;
    }
    if (prevBarsTimes.length !== 0 && prevBarsTimes[prevBarsTimes.length - 1] !== newBarsTimes[newBarsTimes.length - 1]) {
      this._setLastRealBarTime(newBarsTimes[newBarsTimes.length - 1]);
    }
    if (prevBarsTimes.length !== 0 && prevBarsTimes[0] !== newBarsTimes[0]) {
      this._historyBarsCache = [];
      this._firstRealBarTimeMs = newBarsTimes[0];
    }
  }

  extrapolateTimeWithOffsetToTime(timeMs, offset) {
    if (offset === 0) {
      return {
        timeMs: timeMs,
        exact: true
      };
    }
    if (this._barsTimes.length === 0) {
      if (offset < 0) {
        if (this._firstRealBarTimeMs === null) {
          this._firstRealBarTimeMs = timeMs;
        } else {
          this._extendHistoryCacheToTimeFromRight(Math.min(timeMs, this._lastRealBarTimeMs !== null ? this._lastRealBarTimeMs : Infinity));
          this._ensureExtrapolatedToHistoryTime(timeMs);
        }
      } else {
        if (this._lastRealBarTimeMs === null) {
          this._lastRealBarTimeMs = timeMs;
        } else {
          this._extendFutureCacheToTimeFromLeft(Math.max(timeMs, this._firstRealBarTimeMs !== null ? this._firstRealBarTimeMs : Infinity));
          this._ensureExtrapolatedToFutureTime(timeMs);
        }
      }
    }
    const barIndex = this.indexOfTime(timeMs);
    if (barIndex === null) {
      return null;
    }
    const projectedTime = this._timeOfBarIndex(barIndex.index + offset);
    if (projectedTime === null) {
      return null;
    }
    if (barIndex.index < 0 || this._projectionFirstIndex <= barIndex.index) {
      projectedTime.exact = false;
    }
    return projectedTime;
  }

  indexOfTime(timeMs) {
    if (this._firstRealBarTimeMs !== null && timeMs < this._firstRealBarTimeMs) {
      this._ensureExtrapolatedToHistoryTime(timeMs);
      let index = lowerbound_int(this._historyBarsCache, timeMs);
      if (this._historyBarsCache.length !== 0 && index === 0 && timeMs < this._historyBarsCache[0]) {
        return null;
      }
      if (index !== this._historyBarsCache.length && this._historyBarsCache[index] !== timeMs) {
        index -= 1;
      }
      return {
        index: index - this._historyBarsCache.length,
        timeMs: this._historyBarsCache[index]
      };
    }
    if (this._lastRealBarTimeMs !== null && timeMs > this._lastRealBarTimeMs) {
      this._ensureExtrapolatedToFutureTime(timeMs);
      let index = lowerbound_int(this._futureBarsCache, timeMs);
      if (this._futureBarsCache.length !== 0 && index === this._futureBarsCache.length && timeMs > this._futureBarsCache[this._futureBarsCache.length - 1]) {
        return null;
      }
      if (this._futureBarsCache[index] !== timeMs) {
        index -= 1;
      }
      const projectedIndex = Math.max(1, this._barsTimes.length) + index;
      return {
        index: projectedIndex,
        timeMs: projectedIndex === this._barsTimes.length - 1 ? ensureNotNull(this._lastRealBarTimeMs) : this._futureBarsCache[index]
      };
    }
    if (this._barsTimes.length === 0) {
      return null !== this._firstRealBarTimeMs && this._firstRealBarTimeMs <= timeMs || null !== this._lastRealBarTimeMs && timeMs <= this._lastRealBarTimeMs ? {
        index: 0,
        timeMs: ensureNotNull(null !== this._firstRealBarTimeMs && this._firstRealBarTimeMs !== undefined ? this._firstRealBarTimeMs : this._lastRealBarTimeMs)
      } : null;
    }
    let index = lowerbound_int(this._barsTimes, timeMs);
    if (this._barsTimes[index] !== timeMs) {
      index -= 1;
    }
    return {
      index: index,
      timeMs: this._barsTimes[index]
    };
  }

  setMinFutureBarsCount(count) {
    this._minFutureBarsCount = count;
    if (this._barsTimes.length !== 0) {
      this._ensureExtrapolatedToFutureBar(count);
    }
  }

  ensureExtrapolatedToFutureTime(timeMs) {
    this._ensureExtrapolatedToFutureTime(timeMs);
  }

  _setLastRealBarTime(timeMs) {
    const previousFutureBarsCount = this._futureBarsCache.length;
    const insertIndex = upperbound_int(this._futureBarsCache, timeMs);
    if (insertIndex === 0) {
      this._extendFutureCacheToTimeFromLeft(timeMs);
    } else {
      this._lastRealBarTimeMs = timeMs;
      this._futureBarsCache = this._futureBarsCache.slice(insertIndex);
    }
    this._ensureExtrapolatedToFutureBar(Math.max(previousFutureBarsCount, this._minFutureBarsCount));
  }

  _timeOfBarIndex(index) {
    if (index < 0) {
      const count = Math.abs(index);
      this._ensureExtrapolatedToHistoryBar(count);
      const historyIndex = this._historyBarsCache.length - count;
      if (historyIndex < 0) {
        return null;
      }
      return {
        timeMs: this._historyBarsCache[historyIndex],
        exact: false
      };
    }
    if (index === 0 && this._barsTimes.length === 0) {
      return {
        timeMs: ensureNotNull(null !== this._firstRealBarTimeMs && this._firstRealBarTimeMs !== undefined ? this._firstRealBarTimeMs : this._lastRealBarTimeMs),
        exact: false
      };
    }
    if (index >= this._barsTimes.length) {
      const futureIndex = index - Math.max(1, this._barsTimes.length);
      this._ensureExtrapolatedToFutureBar(futureIndex + 1);
      if (futureIndex >= this._futureBarsCache.length) {
        return null;
      }
      return {
        timeMs: this._futureBarsCache[futureIndex],
        exact: false
      };
    }
    return {
      timeMs: this._barsTimes[index],
      exact: index < this._projectionFirstIndex
    };
  }

  _extendFutureCacheFromRight(generator) {
    const lastFutureBarTime = this._futureBarsCache.length !== 0 ? this._futureBarsCache[this._futureBarsCache.length - 1] : this._lastRealBarTimeMs;
    if (lastFutureBarTime === null) {
      return false;
    }
    const newFutureBars = generator(lastFutureBarTime, this._futureBarsCache.length);
    if (newFutureBars.length !== 0) {
      this._futureBarsCache = this._futureBarsCache.concat(newFutureBars);
      return true;
    }
    return false;
  }

  _extendHistoryCacheFromLeft(generator) {
    const firstHistoryBarTime = this._historyBarsCache.length !== 0 ? this._historyBarsCache[0] : this._firstRealBarTimeMs;
    if (firstHistoryBarTime === null) {
      return;
    }
    const newHistoryBars = generator(firstHistoryBarTime, this._historyBarsCache.length);
    this._historyBarsCache = newHistoryBars.concat(this._historyBarsCache);
  }

  _extendFutureCacheToTimeFromLeft(timeMs) {
    if (this._lastRealBarTimeMs !== null && this._lastRealBarTimeMs <= timeMs) {
      return;
    }
    assert(this._barsTimes.length === 0 || timeMs === this._barsTimes[this._barsTimes.length - 1], 'invalid argument');
    this._lastRealBarTimeMs = timeMs;
    if (this._futureBarsCache.length === 0) {
      return;
    }
    const newFutureBars = extrapolateBarsFrontToTime(this._barBuilder, timeMs, this._futureBarsCache[0] - 1, this._extrapolateLimit, true).times;
    this._futureBarsCache = newFutureBars.concat(this._futureBarsCache);
  }

  _extendHistoryCacheToTimeFromRight(timeMs) {
    if (this._firstRealBarTimeMs !== null && this._firstRealBarTimeMs >= timeMs) {
      return;
    }
    assert(this._barsTimes.length === 0, 'bars should be empty');
    this._firstRealBarTimeMs = timeMs;
    if (this._historyBarsCache.length === 0) {
      return;
    }
    const newHistoryBars = extrapolateBarsFrontToTime(this._barBuilder, this._historyBarsCache[this._historyBarsCache.length - 1], timeMs - 1, this._extrapolateLimit, true).times;
    this._historyBarsCache = this._historyBarsCache.concat(newHistoryBars);
  }

  _ensureExtrapolatedToFutureBar(count) {
    if (this._futureBarsCache.length >= count || this._futureBarsCache.length >= this._extrapolateLimit) {
      return;
    }
    this._extendFutureCacheFromRight((lastBarTime, barCount) => extrapolateBarsFrontByCount(this._barBuilder, lastBarTime, count - barCount, true).times);
  }

  _ensureExtrapolatedToFutureTime(timeMs) {
    if (this._lastRealBarTimeMs !== null && this._lastRealBarTimeMs >= timeMs) {
      return;
    }
    if (this._futureBarsCache.length >= this._extrapolateLimit) {
      return;
    }
    if (this._futureBarsCache.length !== 0 && this._futureBarsCache[this._futureBarsCache.length - 1] >= timeMs) {
      return;
    }
    this._extendFutureCacheFromRight((lastBarTime) => extrapolateBarsFrontToTime(this._barBuilder, lastBarTime, timeMs, this._extrapolateLimit, true).times);
    if (this._futureBarsCache[this._futureBarsCache.length - 1] < timeMs) {
      this._ensureExtrapolatedToFutureBar(this._futureBarsCache.length + 1);
    }
  }

  _ensureExtrapolatedToHistoryBar(count) {
    if (this._historyBarsCache.length >= count || this._historyBarsCache.length >= this._extrapolateLimit) {
      return;
    }
    this._extendHistoryCacheFromLeft((firstBarTime, barCount) => extrapolateBarsFrontByCount(this._barBuilder, firstBarTime, -(count - barCount), true).times.reverse());
  }

  _ensureExtrapolatedToHistoryTime(timeMs) {
    if (this._firstRealBarTimeMs !== null && this._firstRealBarTimeMs <= timeMs) {
      return;
    }
    if (this._historyBarsCache.length >= this._extrapolateLimit) {
      return;
    }
    if (this._historyBarsCache.length !== 0 && this._historyBarsCache[0] <= timeMs) {
      return;
    }
    this._extendHistoryCacheFromLeft((firstBarTime) => {
      const extrapolatedBars = extrapolateBarsFrontToTime(this._barBuilder, firstBarTime - 1, timeMs - 1, this._extrapolateLimit, true).times;
      return extrapolatedBars[extrapolatedBars.length - 1] === firstBarTime ? extrapolatedBars.slice(0, -1) : extrapolatedBars;
    });
    if ((this._historyBarsCache.length === 0 || this._historyBarsCache[0] > timeMs)) {
      this._ensureExtrapolatedToHistoryBar(this._historyBarsCache.length + 1);
    }
  }
}
