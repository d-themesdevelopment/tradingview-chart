"use strict";

function makeFont(size, style, weight, family) {
  return `${style ? style + " " : ""}${weight ? weight + " " : ""}${size}px ${family}`;
}

function parseFont(fontString) {
  const regex = /(bold )?(italic )?(\d+)(px|pt) (.*)$/;
  const matches = regex.exec(fontString);

  if (matches === null) {
    return null;
  }

  return {
    family: matches[5],
    size: parseInt(matches[3]) * (matches[4] === "pt" ? 0.75 : 1),
    bold: Boolean(matches[1]),
    italic: Boolean(matches[2]),
  };
}