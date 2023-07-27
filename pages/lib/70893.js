
function studyIdString(e, t) {
    return `${e}@${t}`
  }
  
  function extractStudyId(e) {
    return e.replace(/(@[^-]+-[^-]+).*$/, "$1")
  }
  
  