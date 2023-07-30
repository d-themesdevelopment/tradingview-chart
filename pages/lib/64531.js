function detectScrollType() {
  if (!document || !document.createElement) return "indeterminate";
  
  if (!("undefined" === typeof window || !window.document || !window.document.body)) {
    const element = document.createElement("div");
    element.appendChild(document.createTextNode("ABCD"));
    element.dir = "rtl";
    element.style.fontSize = "14px";
    element.style.width = "4px";
    element.style.height = "1px";
    element.style.position = "absolute";
    element.style.top = "-1000px";
    element.style.overflow = "scroll";
    document.body.appendChild(element);

    const scrollType = element.scrollLeft > 0 ? "default" : (element.scrollLeft = 1, 0 === element.scrollLeft ? "negative" : "reverse");
    document.body.removeChild(element);
    return scrollType;
  }
  
  return "indeterminate";
}

function getNormalizedScrollLeft(element, scrollType) {
  const scrollLeft = element.scrollLeft;
  if (scrollType !== "rtl") return scrollLeft;
  
  const rtlScrollType = detectScrollType();
  if (rtlScrollType === "indeterminate") return Number.NaN;
  
  switch (rtlScrollType) {
    case "negative":
      return element.scrollWidth - element.clientWidth + scrollLeft;
    case "reverse":
      return element.scrollWidth - element.clientWidth - scrollLeft;
  }
  
  return scrollLeft;
}

