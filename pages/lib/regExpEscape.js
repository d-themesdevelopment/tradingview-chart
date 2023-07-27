
function regExpEscape(e) {
    return e.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
  }