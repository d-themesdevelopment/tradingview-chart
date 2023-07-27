import { enabled } from "./helpers";

export function japaneseChartStyles() {
  return enabled("japanese_chart_styles") ? [8] : [];
}

export function commonChartStyles() {
  const styles = [0, 1, 9, 13, 2, 14, 15, 3, 16, 10];
  if (enabled("chart_style_hilo")) {
    styles.push(12);
  }
  return styles;
}

export function allChartStyles() {
  return commonChartStyles().concat(japaneseChartStyles());
}
