export const watchedTheme = new Set();

export function setTheme(theme) {
  watchedTheme.forEach((t) =>
    document.documentElement.classList.remove(`theme-${t}`)
  );
  watchedTheme.clear();

  if (theme) {
    document.documentElement.classList.add(`theme-${theme}`);
    watchedTheme.add(theme);
  }
}
