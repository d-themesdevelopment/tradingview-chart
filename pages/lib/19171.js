let nextSymbolId = 0;

function makeNextSymbolId() {
  nextSymbolId++;
  return "ss_" + nextSymbolId;
}

let nextStudyId = 0;

function makeNextStudyId() {
  nextStudyId++;
  return "st" + nextStudyId;
}

export { makeNextSymbolId, makeNextStudyId };
