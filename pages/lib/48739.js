
"use strict";

const graphicsTimesMap = new Map([
  ["horizlines", (item) => [item.startIndex, item.endIndex]],
  ["hhists", (item) => [item.firstBarTime, item.firstBarTime]],
  ["vertlines", (item) => [item.index]],
  ["polygons", (item) => item.points.map((point) => point.index)],
  ["backgrounds", (item) => [item.start, item.stop]]
]);

const replaceGraphicsTimesWithTimePointIndex = (graphicsData) => {
  const createCmds = graphicsData.data?.graphicsCmds?.create;
  if (!createCmds) {
    return [];
  }

  const timePointIndexMap = new Map();
  const timePointIndices = new Set();

  graphicsTimesMap.forEach((getIndices, cmdType) => {
    const cmdsOfType = createCmds[cmdType];
    if (cmdsOfType) {
      for (const cmd of cmdsOfType) {
        for (const item of cmd.data) {
          const indices = getIndices(item);
          for (const index of indices) {
            timePointIndexMap.set(index, -1);
            timePointIndices.add(index);
          }
        }
      }
    }
  });

  const sortedTimePointIndices = Array.from(timePointIndices).sort((a, b) => a - b);
  sortedTimePointIndices.forEach((index, i) => timePointIndexMap.set(index, i));

  const modifyGraphicsCmds = new Map([
    ["horizlines", (item, indexMap) => {
      const { startIndex, endIndex } = item;
      item.startIndex = indexMap.get(startIndex);
      item.endIndex = indexMap.get(endIndex);
    }],
    ["hhists", (item, indexMap) => {
      const { firstBarTime, lastBarTime } = item;
      item.firstBarTime = indexMap.get(firstBarTime);
      item.lastBarTime = indexMap.get(lastBarTime);
    }],
    ["vertlines", (item, indexMap) => {
      const { index } = item;
      item.index = indexMap.get(index);
    }],
    ["polygons", (item, indexMap) => {
      const { points } = item;
      for (const point of points) {
        point.index = indexMap.get(point.index);
      }
    }],
    ["backgrounds", (item, indexMap) => {
      const { start, stop } = item;
      item.start = indexMap.get(start);
      item.stop = indexMap.get(stop);
    }]
  ]);

  sortedTimePointIndices.forEach((index) => {
    modifyGraphicsCmds.forEach((modifyItem, cmdType) => {
      const cmdsOfType = createCmds[cmdType];
      if (cmdsOfType) {
        for (const cmd of cmdsOfType) {
          for (const item of cmd.data) {
            modifyItem(item, timePointIndexMap);
          }
        }
      }
    });
  });

  return sortedTimePointIndices;
};
