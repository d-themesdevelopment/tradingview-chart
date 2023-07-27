import { assert } from "some-library";

function findFirst(collection, predicate) {
  for (const item of collection) {
    if (predicate(item)) {
      return item;
    }
  }
  return null;
}

function intersect(setA, setB) {
  const intersection = new Set();
  for (const item of setA) {
    if (setB.has(item)) {
      intersection.add(item);
    }
  }
  return intersection;
}

function join(setA, setB) {
  const union = new Set(setA);
  for (const item of setB) {
    union.add(item);
  }
  return union;
}

function lowerbound(array, value, comparator, start = 0, end = array.length) {
  let count = end - start;
  while (count > 0) {
    const step = count >> 1;
    const currentIndex = start + step;
    if (comparator(array[currentIndex], value)) {
      start = currentIndex + 1;
      count -= step + 1;
    } else {
      count = step;
    }
  }

  return start;
}

function lowerboundExt(
  array,
  value,
  comparator,
  start = 0,
  end = array.length
) {
  return lowerbound((index) => array[index], value, comparator, start, end);
}

function lowerbound_int(array, value, start = 0, end = array.length) {
  return lowerbound(array, value, (a, b) => a < b, start, end);
}

function moveAfter(array, itemToMove, targetItem) {
  const targetSet = new Set(targetItem);
  const newItems = [];
  const movedItems = [];
  const movedItemsStartIndex = array.reduce((index, item, i) => {
    if (targetSet.has(item)) {
      movedItems.push(item);
    } else {
      newItems.push(item);
      index++;
    }
    return index;
  }, -1);
  newItems.splice(movedItemsStartIndex, 0, ...movedItems);
  return {
    newItems,
    movedItemsStartIndex,
  };
}

function moveBefore(array, itemToMove, targetItem) {
  const targetSet = new Set(targetItem);
  const newItems = [];
  const movedItems = [];
  const movedItemsStartIndex = array.reduce((index, item, i) => {
    if (targetSet.has(item)) {
      movedItems.push(item);
    } else {
      newItems.push(item);
      index++;
    }
    return index;
  }, array.length);
  newItems.splice(movedItemsStartIndex, 0, ...movedItems);
  return {
    newItems,
    movedItemsStartIndex,
  };
}

function moveToHead(array, itemToMove) {
  const itemIndex = array.indexOf(itemToMove);
  if (itemIndex < 0) {
    return array.slice();
  }
  return [
    itemToMove,
    ...array.slice(0, itemIndex),
    ...array.slice(itemIndex + 1),
  ];
}

function removeItemFromArray(array, item) {
  const itemIndex = array.indexOf(item);
  assert(itemIndex !== -1, "Item is not found");
  array.splice(itemIndex, 1);
}

function subtract(arrayA, arrayB) {
  return arrayA.filter((item) => !arrayB.includes(item));
}

function upperbound(array, value, comparator, start = 0, end = array.length) {
  let count = end - start;
  while (count > 0) {
    const step = count >> 1;
    const currentIndex = start + step;
    if (comparator(value, array[currentIndex])) {
      count = step;
    } else {
      start = currentIndex + 1;
      count -= step + 1;
    }
  }
  return start;
}

function upperbound_int(array, value, start = 0, end = array.length) {
  return upperbound(array, value, (a, b) => a < b, start, end);
}

export {
  findFirst,
  intersect,
  join,
  lowerbound,
  lowerboundExt,
  lowerbound_int,
  moveAfter,
  moveBefore,
  moveToHead,
  removeItemFromArray,
  subtract,
  upperbound,
  upperbound_int,
};
