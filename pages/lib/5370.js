export function parseUpdateMode(e) {
  if (void 0 === e) return null;
  const t = e.match(/(delayed_streaming)_([\d]{1,4})/);
  return null === t
    ? null
    : {
        mode: t[1],
        interval: parseInt(t[2]),
      };
}

export function normalizeUpdateMode(e) {
  const t = s(e.update_mode);
  return (
    null === t ||
      ((e.update_mode = t.mode), (e.update_mode_seconds = t.interval)),
    e
  );
}
