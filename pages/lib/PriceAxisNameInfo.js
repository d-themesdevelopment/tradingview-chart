"use strict";

const leftAxisNames = ["Z", "Y", "X", "W", "V", "U", "T", "S"];
const rightAxisNames = ["A", "B", "C", "D", "E", "F", "G", "H"];

class PriceAxisNameInfo {
    constructor(label) {
        this.label = label;
    }

    equals(other) {
        return other !== null && this.label === other.label;
    }
}

function getPriceAxisNameInfo(axisPosition, index) {
    const axisNames = axisPosition === "left" ? leftAxisNames : rightAxisNames;
    const label = index < axisNames.length ? axisNames[index] : "";
    return new PriceAxisNameInfo(label);
}

module.exports = {
    getPriceAxisNameInfo,
};
