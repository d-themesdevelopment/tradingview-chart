import { timeStamp as consoleTimeStamp } from "console"; // ! not correct

function emptyFunction() {}

function addPerfMark(mark) {
  const timeStamp = consoleTimeStamp
    ? consoleTimeStamp.bind(console)
    : emptyFunction;
  const markFunction =
    window.performance && performance.mark
      ? performance.mark.bind(performance)
      : emptyFunction;

  timeStamp(mark);
  markFunction(mark);
}

export { addPerfMark };
