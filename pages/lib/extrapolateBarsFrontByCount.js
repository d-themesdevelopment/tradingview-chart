

import { SessionStage } from '<path_to_SessionStage_module>';

export function extrapolateBarsFrontToTime(timeScale, time, count, limit, includeCurrentBar = false) {
  if (time > limit) {
    const result = extrapolateBarsFrontToTime(timeScale, limit, time, count, includeCurrentBar);
    result.count = -result.count;
    return result;
  }
  return extrapolateBarsFrontByCount(timeScale, time, 1, (time, index) => index > count || (limit !== 0 && time > limit), includeCurrentBar);
}

export function extrapolateBarsFrontByCount(timeScale, time, count, includeCurrentBar = false) {
  const direction = count < 0 ? -1 : 1;
  return extrapolateBarsFront(timeScale, time, direction, (time, index) => index >= count * direction, includeCurrentBar);
}

function extrapolateBarsFront(timeScale, time, direction, limitPredicate, includeCurrentBar) {
  let counter = 0;
  let index = time;

  timeScale.moveTo(index);

  let loopCount = 0;
  let lastTime = Number.MAX_VALUE;
  let atFirstBar = false;
  let nextTime = time;

  const times = [];
  const MIN_VALUE = Number.MIN_SAFE_INTEGER;

  while (!limitPredicate(counter, index)) {
    if (loopCount > 15) {
      throw new Error("Internal error 0x10 while extrapolating.");
    }

    const stage = timeScale.indexOfBar(index);

    if (stage === SessionStage.PRE_SESSION && direction === 1) {
      index = timeScale.startOfBar(0);
      timeScale.moveTo(index);
    } else if (stage === SessionStage.PRE_SESSION && direction === -1) {
      index = timeScale.startOfBar(SessionStage.PRE_SESSION);
      timeScale.moveTo(index);
    } else if (stage === SessionStage.POST_SESSION && direction === 1) {
      index = timeScale.startOfBar(SessionStage.POST_SESSION);
      timeScale.moveTo(index);
    } else {
      if (stage === SessionStage.POST_SESSION && direction === -1) {
        throw new Error("Internal error 0x12 while extrapolating.");
      }

      const barStart = timeScale.startOfBar(stage);

      if ((barStart > time && direction > 0) || (time > barStart && direction < 0)) {
        if (atFirstBar && lastTime === barStart) {
          throw new Error("Internal error 0x11 while extrapolating.");
        }

        atFirstBar = true;
        lastTime = barStart;
        loopCount = 0;
        counter++;
        nextTime = barStart;

        if (includeCurrentBar) {
          times.push(nextTime);
        }
      }

      if (stage === 0 && direction === -1) {
        index = barStart - 1;
      } else {
        index = timeScale.startOfBar(stage + direction);

        const postSessionStart = timeScale.startOfBar(SessionStage.POST_SESSION);
        if (index > postSessionStart) {
          timeScale.moveTo(postSessionStart);
          index = timeScale.startOfBar(0);
        }
      }
    }

    loopCount++;
  }

  return {
    time: nextTime,
    times: times,
    count: counter,
  };
}

