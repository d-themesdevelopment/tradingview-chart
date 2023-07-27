import { getLogger } from '<path_to_getLogger_module>';

function fetch(url, options = {}) {
  return window.fetch(url, options);
}

export { fetch };