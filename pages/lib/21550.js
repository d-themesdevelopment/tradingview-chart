import { Event } from "some-library"; // ! not corrrect

class Tickmarks {
  constructor() {
    this._marksByIndex = new Map();
    this._marksBySpan = [];
    this.changed = new Event();
    this.minIndex = undefined;
    this.maxIndex = undefined;
  }

  reset() {
    this._resetImpl();
    this.changed.fire();
  }

  _resetImpl() {
    this._marksByIndex = new Map();
    this._marksBySpan = [];
    this.minIndex = undefined;
    this.maxIndex = undefined;
    this._cache = undefined;
  }

  merge(marks) {
    if (marks.length !== 0) {
      const firstIndex = marks[0].index;
      const lastIndex = marks[marks.length - 1].index;

      if (firstIndex <= this.minIndex && lastIndex >= this.maxIndex) {
        this._resetImpl();
      }

      const marksBySpan = this._marksBySpan;
      const updatedSpans = new Set();

      for (let i = 0; i < marks.length; i++) {
        const mark = marks[i];
        const index = mark.index;
        const span = mark.span;
        const existingMark = this._marksByIndex.get(mark.index);

        if (existingMark) {
          if (
            existingMark.index === mark.index &&
            existingMark.span === mark.span
          ) {
            existingMark.time = mark.time;
            continue;
          }
          this._removeTickmark(existingMark);
        }
      }

      for (let i = 0; i < marks.length; i++) {
        const mark = marks[i];
        const index = mark.index;
        const span = mark.span;

        if (!this._marksByIndex.has(mark.index)) {
          this._marksByIndex.set(index, mark);
          let spanArray = marksBySpan[span];
          if (spanArray === undefined) {
            spanArray = [];
            marksBySpan[span] = spanArray;
          }
          const isLast =
            spanArray.length === 0 ||
            spanArray[spanArray.length - 1].index < index;
          spanArray.push(mark);
          if (!isLast) {
            updatedSpans.add(span);
          }
        }
      }

      this.minIndex =
        this.minIndex === undefined
          ? firstIndex
          : Math.min(this.minIndex, firstIndex);
      this.maxIndex =
        this.maxIndex === undefined
          ? lastIndex
          : Math.max(this.maxIndex, lastIndex);

      for (let i = marksBySpan.length; i--; ) {
        if (marksBySpan[i]) {
          if (marksBySpan[i].length === 0) {
            delete marksBySpan[i];
          }
          if (updatedSpans.has(i)) {
            marksBySpan[i].sort(this._sortByIndexAsc);
          }
        }
      }

      this._cache = undefined;
      this.changed.fire();
    }
  }

  _removeTickmark(mark) {
    const index = mark.index;
    if (this._marksByIndex.get(index) === mark) {
      this._marksByIndex.delete(index);
      if (index <= this.minIndex) {
        this.minIndex++;
      }
      if (index >= this.maxIndex) {
        this.maxIndex--;
      }
      if (this.maxIndex < this.minIndex) {
        this.minIndex = undefined;
        this.maxIndex = undefined;
      }
      const spanArray = this._marksBySpan[mark.span];
      const markIndex = spanArray.indexOf(mark);
      if (markIndex !== -1) {
        spanArray.splice(markIndex, 1);
      }
    }
  }

  _sortByIndexAsc(a, b) {
    return a.index - b.index;
  }

  removeTail(time) {
    const updatedMarks = new Map();
    this.maxIndex = this.minIndex;
    this._marksByIndex.forEach((mark, index) => {
      if (mark.time < time) {
        updatedMarks.set(index, mark);
        this.maxIndex = Math.max(this.maxIndex, index);
      }
    });
    this._marksByIndex = updatedMarks;
  }

  addTail(marks) {
    for (let i = 0; i < marks.length; i++) {
      marks[i].index = this.maxIndex + i + 1;
    }
    this.merge(marks);
  }

  indexToTime(index) {
    const mark = this._marksByIndex.get(index);
    return mark ? new Date(1000 * mark.time) : null;
  }

  density() {
    const indexRange = this.maxIndex - this.minIndex;
    if (indexRange !== 0) {
      const minMark = this._marksByIndex.get(this.minIndex);
      const maxMark = this._marksByIndex.get(this.maxIndex);
      return (1000 * (maxMark.time - minMark.time)) / indexRange;
    }
  }

  estimateLeft(time) {
    const density = this.density();
    if (density) {
      const minMark = this._marksByIndex.get(this.minIndex);
      return (1000 * minMark.time - time) / density;
    }
  }

  nearestIndex(time) {
    let start = this.minIndex;
    let end = this.maxIndex;
    while (end - start > 2) {
      const startMark = this._marksByIndex.get(start);
      const endMark = this._marksByIndex.get(end);
      if (1000 * startMark.time === time) {
        return start;
      }
      if (1000 * endMark.time === time) {
        return end;
      }
      const middle = Math.round((start + end) / 2);
      const middleMark = this._marksByIndex.get(middle);
      if (1000 * middleMark.time > time) {
        end = middle;
      } else {
        start = middle;
      }
    }
    return start;
  }

  build(barSpacing, maxBars) {
    const requiredBars = Math.ceil(maxBars / barSpacing);

    if (this._maxBars === requiredBars && this._cache) {
      return this._cache;
    }

    this._maxBars = requiredBars;
    let result = [];

    for (let i = this._marksBySpan.length; i--; ) {
      if (this._marksBySpan[i]) {
        let previousArray = result;
        result = [];
        const previousArrayLength = previousArray.length;
        let previousArrayIndex = 0;
        const currentArray = this._marksBySpan[i];
        const currentArrayLength = currentArray.length;
        let previousIndex = -Infinity;

        for (let j = 0; j < currentArrayLength; j++) {
          const currentMark = currentArray[j];
          const currentIndex = currentMark.index;

          while (previousArrayIndex < previousArrayLength) {
            const previousMark = previousArray[previousArrayIndex];
            const previousIndex = previousMark.index;

            if (!(previousIndex < currentIndex)) {
              break;
            }

            result.push(previousMark);
            previousArrayIndex++;
            previousIndex = previousMark.index;
          }

          if (currentIndex - previousIndex >= requiredBars) {
            result.push(currentMark);
            previousIndex = currentIndex;
          }
        }

        for (; previousArrayIndex < previousArrayLength; previousArrayIndex++) {
          result.push(previousArray[previousArrayIndex]);
        }
      }
    }

    this._cache = result;
    return this._cache;
  }

  state(range) {
    let marks = [];
    for (let i = this._marksBySpan.length; i--; ) {
      if (this._marksBySpan[i]) {
        marks = marks.concat(this._marksBySpan[i]);
      }
    }

    if (range !== null) {
      const firstBar = range.firstBar();
      const lastBar = range.lastBar();
      marks = marks.filter(
        (mark) => mark.index >= firstBar && mark.index <= lastBar
      );
    }

    return {
      marks: marks.map((mark) => [mark.span, mark.time, mark.index]),
      version: 2,
    };
  }

  restoreState(state) {
    this._marksByIndex = new Map();
    this._marksBySpan = [];
    this.maxIndex = undefined;
    this.minIndex = undefined;

    if (state && state.marks && state.marks.length) {
      if (state.version === 2) {
        const marks = state.marks.map((mark) => ({
          span: mark[0],
          time: mark[1],
          index: mark[2],
        }));
        this.merge(marks);
      } else {
        this.merge(state.marks);
      }
    }
  }
}

export { Tickmarks };
