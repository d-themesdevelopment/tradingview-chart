

export function barPercentChange(e, t) {
    return 100 * (t - e) / Math.abs(e || 1);
  }