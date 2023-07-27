
export function parseHtml(htmlString, element = null) {
    const targetElement = element === null ? document.documentElement : 9 === element.nodeType ? element.documentElement : element;
    const range = new Range();
    range.selectNodeContents(targetElement);
  
    return range.createContextualFragment(htmlString);
  }
  
  export function parseHtmlElement(htmlString, element = null) {
    const fragment = parseHtml(htmlString, element);
    const firstElementChild = fragment.firstElementChild;
  
    if (firstElementChild !== null) {
      fragment.removeChild(firstElementChild);
    }
  
    return firstElementChild;
  }