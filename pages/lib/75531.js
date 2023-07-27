

let customLayouts;
customLayouts = {};

const layouts = {
  ...{
    single: {
      title: "1 chart",
      count: 1,
      layoutType: "single",
      sizer: (totalSize, index) => {
        if (index !== 0) throw new RangeError("Invalid index");
        return totalSize;
      },
      splitters: () => [],
      resizeApplier: (chartSizes, splitterSizes, containerSize, layoutType) => containerSize,
      syncSublayoutsBySplitter: (layoutType, splitterSizes) => splitterSizes,
      expression: ["horizontal", 0],
    },
  },
  ...customLayouts,
};

function isSingleLayout(layoutType) {
  return layoutType === "single";
}

function isMultipleLayout(layoutType) {
  return !isSingleLayout(layoutType);
}

function isSupportedLayout(layoutType) {
  return isSingleLayout(layoutType) || customLayouts.hasOwnProperty(layoutType);
}

function tryGuessingTheMostSuitableLayout(layoutType) {
  return "single";
}

export {
  isMultipleLayout,
  isSingleLayout,
  isSupportedLayout,
  layouts,
  tryGuessingTheMostSuitableLayout,
};
