
const clean = (text, encodeAmpersand, exceptions) => {
    const replacements = [
      ["&", "&amp;"],
      ["<", "&lt;"],
      [">", "&gt;"],
      ['"', "&quot;"],
      ["'", "&#039;"],
      ["'", "&#39;"]
    ];
    let cleanedText = text;
    if (!text || !text.replace) {
      return cleanedText;
    }
    for (let i = 0; i < replacements.length; i++) {
      const originalChar = replacements[i][0];
      const replacement = replacements[i][1];
      if (
        encodeAmpersand &&
        exceptions &&
        exceptions.indexOf &&
        exceptions.indexOf(encodeAmpersand ? replacement : originalChar) !== -1
      ) {
        cleanedText = encodeAmpersand
          ? cleanedText.replace(new RegExp(replacement, "g"), originalChar)
          : cleanedText.replace(new RegExp(originalChar, "g"), replacement);
      }
    }
    return cleanedText;
  };
  
  const cleanButAmpersand = (text, encodeAmpersand) => {
    const exceptions = encodeAmpersand ? ["&amp;"] : ["&"];
    return clean(text, encodeAmpersand, exceptions);
  };
  
  const stripTags = (text) => {
    return text && text.replace ? text.replace(/(<([^>]+)>)/gi, "") : text;
  };
  
  const encodeSpread = (text) => {
    return encodeURIComponent(text);
  };
  
  