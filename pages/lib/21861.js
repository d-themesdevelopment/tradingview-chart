export function preventDefault(event) {
  event.preventDefault();
}

export function preventDefaultForContextMenu(event) {
  const target = event.target;
  if (
    target &&
    !target.closest(
      [
        "input:not([type])",
        'input[type="text"]',
        'input[type="email"]',
        'input[type="password"]',
        'input[type="search"]',
        'input[type="number"]',
        'input[type="url"]',
        "textarea",
        "a[href]",
        '*[contenteditable="true"]',
        "[data-allow-context-menu]",
      ].join(", ")
    )
  ) {
    event.preventDefault();
  }
}
