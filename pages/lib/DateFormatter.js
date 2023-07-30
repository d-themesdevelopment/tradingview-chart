import {customFormatters} from "./customFormatters.js";
import {getDateFormatWithWeekday, dateFormatFunctions} from "./15879.js";

  class DateFormatter {
      constructor(e = "yyyy-MM-dd", t = !1) {
          this._dateFormatFunc = t ? getDateFormatWithWeekday(e) : dateFormatFunctions[e]
      }
      format(e) {
          return customFormatters && customFormatters.dateFormatter ? customFormatters.dateFormatter.format(e) : this._dateFormatFunc(e, !1)
      }
      formatLocal(e) {
          return customFormatters.dateFormatter ? customFormatters.dateFormatter.formatLocal ? customFormatters.dateFormatter.formatLocal(e) : customFormatters.dateFormatter.format(e) : this._dateFormatFunc(e, !0)
      }
  }