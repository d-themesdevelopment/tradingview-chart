import { t } from 'TranslationLibraryName';

class TimeSpanFormatter {
  format(time) {
    const isNegative = time < 0;
    time = Math.abs(time);
    const days = Math.floor(time / 86400);
    time -= 86400 * days;
    const hours = Math.floor(time / 3600);
    time -= 3600 * hours;
    const minutes = Math.floor(time / 60);
    time -= 60 * minutes;
    let formattedTime = "";
    if (days) {
      formattedTime += days + t(null, { context: "dates" }, 'days') + " ";
    }
    if (hours) {
      formattedTime += hours + t(null, { context: "dates" }, 'hours') + " ";
    }
    if (minutes) {
      formattedTime += minutes + t(null, { context: "dates" }, 'minutes') + " ";
    }
    if (time) {
      formattedTime += time + t(null, { context: "dates" }, 'seconds') + " ";
    }
    if (isNegative) {
      formattedTime = "-" + formattedTime;
    }
    return formattedTime.trim();
  }
}

export { TimeSpanFormatter as default };