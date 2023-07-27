export function studyPlotFunctionMap(e) {
  const t = new Map();
  return (
    e.plots.forEach((e, i) => {
      t.set(e.id, (e) => e[i + 1]);
    }),
    t
  );
}

export function studyEmptyPlotValuePredicate(e, t) {
  return null == e[t];
}
