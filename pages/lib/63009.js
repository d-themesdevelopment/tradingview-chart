import { isLineTool, isStudy } from 'utility-module1';
import { isMainSeriesState, isStudyState, isLineToolState } from 'utility-module2';
import { moveAfter, moveBefore } from 'array-utility-module';

function isStandardLineTool(source) {
  return isLineTool(source) && !source.isSpeciallyZOrderedSource();
}

function isStandardStudy(source) {
  return isStudy(source) && !source.isSpeciallyZOrderedSource();
}

function compareZOrder(a, b) {
  return a.zorder - b.zorder;
}

function setZOrderMainSeries(source, zorder) {
  isMainSeriesState(source) ? (source.zorder = 0) : (source.zorder = zorder);
}

function setZOrder(source, zorder) {
  source.setZorder(zorder);
}

function getZOrder(source) {
  return source.zorder();
}

function roundToThreeDecimalPlaces(number) {
  return Math.round(number * 1000) / 1000;
}

function calculateGap(startZOrder, endZOrder, stepSize) {
  const maxZOrder = Math.max(startZOrder, endZOrder);
  const minZOrder = Math.min(startZOrder, endZOrder);
  return Math.max(0, Math.ceil(maxZOrder) - Math.floor(minZOrder) - 1);
}

function calculateZOrder(startZOrder, endZOrder, gap) {
  let step = 0;
  const difference = Math.abs(endZOrder * 1000 - startZOrder * 1000) / 1000;
  if (difference > gap) {
    startZOrder = Math.trunc(startZOrder);
    step = Math.floor(difference / (gap + 1));
  } else {
    step = Math.floor(difference * 1000) / 1000;
  }
  return {
    startZOrder: startZOrder,
    zOrderStep: step
  };
}

function updateZOrderList(list, start, updateFunc, conditionFunc) {
  let lastIndex = list.length;
  for (let index = list.length - 1; index >= -1; index--) {
    if (index === -1 || conditionFunc(list[index])) {
      const currentIndex = index;
      let newZOrder = updateFunc(start);
      if (lastIndex - 1 === currentIndex) {
        currentIndex >= 0 && updateFunc(list[currentIndex], newZOrder);
      } else {
        const gap = calculateGap(lastIndex, currentIndex);
        let count = 0;
        while (count === 0) {
          const zOrder = calculateZOrder(start, newZOrder, gap);
          start = zOrder.startZOrder;
          count = zOrder.zOrderStep;
          if (count === 0) {
            newZOrder -= 10000;
            if (newZOrder === 0) {
              newZOrder -= 10000;
            }
          }
        }
        let targetIndex = lastIndex - 1;
        for (; targetIndex > currentIndex; targetIndex--) {
          const newZOrderValue = roundToThreeDecimalPlaces(start - count);
          updateFunc(list[targetIndex], newZOrderValue);
          start = newZOrderValue;
        }
        currentIndex >= 0 && updateFunc(list[currentIndex], newZOrder);
      }
      start = newZOrder;
      lastIndex = currentIndex;
    }
  }
}

function reorderDataSourcesStateZOrder(list) {
  const standardLineToolCondition = isStandardLineTool;
  const standardStudyCondition = isStandardStudy;
  const moveMainSeriesToFront = setZOrderMainSeries;

  function updateZOrder(e) {
    updateZOrderList(
      e,
      isMainSeriesState,
      isStudyState,
      isLineToolState,
      setZOrder,
      compareZOrder
    );
  }

  updateZOrder(list);
}

function calculateNewLineToolZOrder(list) {
  return calculateZOrder(list, isStandardLineTool, isStandardStudy, setZOrder, getZOrder, true);
}

function calculateNewStudyZOrder(list) {
  let minZOrder = -10000;
  for (const item of list) {
    if (isStandardStudy(item)) {
      minZOrder = Math.min(minZOrder, item.zorder() - 10000);
    }
  }
  return minZOrder === 0 ? -10000 : minZOrder;
}

function roundZOrder(zorder) {
  const floorValue = 10000 * Math.floor(zorder / 10000);
  return floorValue === zorder ? floorValue + 10000 : floorValue;
}

function ceilZOrder(zorder) {
  const ceilValue = 10000 * Math.ceil(zorder / 10000);
  return ceilValue === zorder ? ceilValue - 10000 : ceilValue;
}

function moveAfterSource(list, source, target) {
  updateZOrderList(list, isSeries, isStudy, isLineTool, moveAfter, ceilZOrder, roundZOrder);
}

function moveBeforeSource(list, source, target) {
  updateZOrderList(list, isSeries, isStudy, isLineTool, moveBefore, floorZOrder, roundZOrder);
}

export {
  moveAfterSource,
  moveBeforeSource,
  calculateNewLineToolZOrder,
  calculateNewStudyZOrder,
  reorderDataSourcesStateZOrder
};
