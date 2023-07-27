export function isPineIdString(e) {
  return e === extractPineId(e);
}

export function extractPineId(e) {
  const t = e.indexOf("$");
  const i = e.indexOf("@");
  return t < 0 && i >= 0
    ? null
    : e.substring(Math.max(t + 1, 0), i >= 0 ? i : e.length);
}
