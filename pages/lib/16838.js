const { enabled } = require("./helpers");

const PLATFORM_ACCESSIBILITY_ENABLED = enabled("accessibility");

function createScopedVisibleElementFilter(element) {
  return (target) => {
    let current = target;
    while (current !== element && current !== null) {
      const styles = getComputedStyle(current);
      if (styles.display === "none" || styles.visibility !== "visible") {
        return false;
      }
      current = current.parentElement;
    }
    return true;
  };
}

function navigationOrderComparator(a, b) {
  if (a === b) {
    return 0;
  } else if (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) {
    return -1;
  } else {
    return 1;
  }
}

export {
  PLATFORM_ACCESSIBILITY_ENABLED,
  createScopedVisibleElementFilter,
  navigationOrderComparator,
};
