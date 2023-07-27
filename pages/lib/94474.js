const htmlSpecialCharsRegex = /[<"'&>]/g;
const charToHtmlEntity = (char) => `&#${char.charCodeAt(0)};`;

function htmlEscape(text) {
    return text.replace(htmlSpecialCharsRegex, charToHtmlEntity);
}

function removeTags(text = "") {
    return text.replace(/(<([^>]+)>)/gi, "");
}

function removeSpaces(text = "") {
    return text.replace(/\s+/g, "");
}

function capitalizeFirstLetterInWord(text = "") {
    return text.replace(/\b\w/g, (char => char.toUpperCase()));
}