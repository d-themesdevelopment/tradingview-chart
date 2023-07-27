"use strict";

async function showSimpleDialog(e, module, t) {
  const s = await Promise.all([
    i.e(2666),
    i.e(1013),
    i.e(6),
    i.e(2191),
    i.e(6221),
    i.e(6639),
    i.e(3610),
    i.e(3717),
    i.e(962),
    i.e(3016),
    i.e(4717),
    i.e(8890),
  ]).then(i.bind(i, 70493));
  return s.showSimpleDialog(e, module, t);
}

async function showConfirm(e, t) {
  return showSimpleDialog(e, s.confirmModule, t);
}

async function showRename(e, t) {
  return showSimpleDialog(e, s.renameModule, t);
}

export async function showWarning(e, t) {
  return showSimpleDialog(e, s.warningModule, t);
}
