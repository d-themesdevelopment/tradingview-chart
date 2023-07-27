
function dematerializePolygon(polygon, id, indexes) {
    return {
      id,
      points: polygon.points.map((point) => ({
        ...point,
        index: ensureTimePointIndex(indexes.indexOf(point.index)),
      })),
    };
  }
  
  function isPolygonInBarsRange(polygon, bars) {
    if (polygon.points.some((point) => bars.contains(point.index + (point.offset ?? 0)))) {
      return true;
    }
  
    let hasBefore = false;
    let hasAfter = false;
    const firstBar = bars.firstBar();
    for (const point of polygon.points) {
      if (point.index + (point.offset ?? 0) < firstBar) {
        hasBefore = true;
      } else {
        hasAfter = true;
      }
    }
  
    return hasBefore && hasAfter;
  }
  
  export { materializePolygon, dematerializePolygon, isPolygonInBarsRange };