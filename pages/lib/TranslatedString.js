"use strict";

class TranslatedString {
  constructor(originalText, translatedText) {
    this._originalText = originalText;
    this._translatedText = translatedText;
  }

  originalText() {
    return this._originalText;
  }

  translatedText() {
    return this._translatedText;
  }

  format(data) {
    const originalValues = {};
    const translatedValues = {};

    for (const key of Object.keys(data)) {
      const value = data[key];

      if (value instanceof TranslatedString) {
        originalValues[key] = value.originalText();
        translatedValues[key] = value.translatedText();
      } else {
        originalValues[key] = value.toString();
        translatedValues[key] = value.toString();
      }
    }

    const formattedOriginal = this._originalText.format(originalValues);
    const formattedTranslated = this._translatedText.format(translatedValues);

    return new TranslatedString(formattedOriginal, formattedTranslated);
  }
}

export { TranslatedString };
