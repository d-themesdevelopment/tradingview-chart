export function isSymbolSource(e) {
  const isSource = e?.symbolSource && e.symbolSource() === e;
  const isActing = e?.isActingAsSymbolSource !== undefined;
  return isSource || isActing;
}

export function isActingAsSymbolSource(e) {
  return isSymbolSource(e) && e.isActingAsSymbolSource().value();
}
