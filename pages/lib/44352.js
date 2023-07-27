export function translateMessage(messageKey, options = {}, translations) {
  if (messageKey === null) {
    if (Array.isArray(translations)) {
      return (
        translations[getPluralIndex(options.count)] || translations[0]
      ).format(options.replace || options);
    }
    if (typeof translations === "object") {
      return translateMessage(
        null,
        options,
        translations[getLocale()] || translations.en
      );
    }
    return translateMessage(translations, options);
  }

  if (translations && messageKey) {
    const translationKey = `${messageKey}${
      options.context ? `_${options.context}` : ""
    }`;
    if (translations[translationKey]) {
      return translateMessage(null, options, translations[translationKey]);
    }
  }

  if (typeof messageKey === "number") {
    return messageKey.toString();
  }

  if (typeof messageKey !== "string") {
    return "";
  }

  if (hasCustomTranslateFunction()) {
    const translatedMessage = executeCustomTranslateFunction(
      messageKey,
      options
    );
    if (translatedMessage !== null) {
      return translatedMessage;
    }
  }

  return (
    options.plural && options.count !== 1 ? options.plural : messageKey
  ).format(options.replace || options);
}

const pluralRules = {
  ca_ES: (count = 1) => +(count !== 1),
  cs: (count = 1) => +(count === 1 ? 0 : count >= 2 && count <= 4 ? 1 : 2),
  el: (count = 1) => +(count !== 1),
  da_DK: (count = 1) => +(count !== 1),
  en: (count = 1) => +(count !== 1),
  et_EE: (count = 1) => +(count !== 1),
  fa: (count = 1) => 0,
  hu_HU: (count = 1) => 0,
  id_ID: (count = 1) => 0,
  it: (count = 1) => +(count !== 1),
  ms_MY: (count = 1) => 0,
  no: (count = 1) => +(count !== 1),
  nl_NL: (count = 1) => +(count !== 1),
  ro: (count = 1) =>
    +(count === 1
      ? 0
      : count % 100 > 19 || (count % 100 === 0 && count !== 0)
      ? 2
      : 1),
  sk_SK: (count = 1) => +(count === 1 ? 0 : count >= 2 && count <= 4 ? 1 : 2),
  sv: (count = 1) => +(count !== 1),
  zh: (count = 1) => 0,
  zh_TW: (count = 1) => 0,
};

function getPluralIndex(count) {
  const locale = getLocale();
  return pluralRules[locale] ? pluralRules[locale](count) : 0;
}

function getLocale() {
  return i.g.language;
}

function hasCustomTranslateFunction() {
  return typeof i.g.customTranslateFunction === "function";
}

function executeCustomTranslateFunction(messageKey, options) {
  return i.g.customTranslateFunction(messageKey, options);
}
