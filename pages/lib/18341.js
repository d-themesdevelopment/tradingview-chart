import { ensureDefined, ensureNotNull, assert } from "./assertions";

// import { merge, clone, isNaN, isNumber } from "some-library";

import { LineToolTrading } from "./LineToolTrading";

import {
  LineToolPriceNote,
  isLineToolName,
  isStudyLineToolName,
} from "./LineToolTrading"; // ! not correct

// import {
//   studyIdString,
//   createDefaultsState,
//   createStudyPropertiesFromBase,
//   prepareStudyPropertiesForLoadChart,
//   LineToolWidthsProperty,
//   LineToolColorsProperty,
// } from "some-library";

import { LineDataSource } from "./13087";
import { StudyLineDataSource } from "./4063";

export class LineToolCloneManager {
  constructor() {
    this.tool = null;
    this.toolData = null;
    this.properties = null;
  }

  getProperties(tool, toolData, chartProperties) {
    if (
      this.tool !== tool ||
      this.toolData !== toolData ||
      this.properties === null
    ) {
      this.properties = {
        ...cloneProperties(tool, toolData, chartProperties),
        visible: true,
      };
      this.tool = tool;
      this.toolData = toolData;
    }

    return this.properties;
  }

  clear() {
    this.tool = null;
    this.toolData = null;
    this.properties = null;
  }
}

function cloneProperties(tool, toolData, chartProperties) {
  assert(isLineToolName(tool), `${tool} should be the name of the line tool`);

  let properties;

  if (tool === "LineToolVbPFixed") {
    properties = LineToolVbPFixed.createProperties(chartProperties, toolData);
  } else if (tool === "LineToolFixedRangeVolumeProfile") {
    properties = LineToolFixedRangeVolumeProfile.createProperties(
      chartProperties,
      toolData
    );
  } else if (tool === "LineToolRegressionTrend") {
    properties = LineToolRegressionTrend.createProperties(
      chartProperties,
      toolData
    );
  } else if (tool === "LineToolAnchoredVWAP") {
    properties = LineToolAnchoredVWAP.createProperties(
      chartProperties,
      toolData
    );
  } else {
    properties = ensureDefined(lineTools[tool]).createProperties(toolData);
  }

  return properties;
}

const lineTools = {};

async function initAllLineToolsFromContent(content) {
  if (!content) return;

  const toolTypes = new Set();
  (content.charts || [content]).forEach((chart) => {
    chart.panes.forEach((pane) => {
      pane.sources.forEach((source) => {
        if (isLineToolName(source.type)) {
          toolTypes.add(source.type);
        }
      });
    });
  });

  await Promise.all(Array.from(toolTypes).map((type) => initLineTool(type)));
}

async function initLineTool(toolType) {
  if (lineTools[toolType]) return;

  if (toolType === "LineToolPriceNote") {
    lineTools[toolType] = await import("some-library").then(
      (module) => module.LineToolPriceNote
    );
  }
}

function createLineTool(toolType, chartWidget, toolData, chartProperties) {
  assert(isLineToolName(toolType), `Unknown line tool: ${toolType}`);

  let properties;
  if (!chartProperties && !toolData) {
    properties = lineToolCloneManager.getProperties(
      toolType,
      toolData,
      chartProperties
    );
  } else {
    properties = cloneProperties(toolType, toolData, chartProperties);
    properties.visible = true;
  }

  const ownerSource = chartWidget.model().ownerSource();
  const lineTool = createLineToolInstance(toolType, chartWidget, properties);
  lineTool.setOwnerSource(ownerSource);
  lineTool.toolname = toolType;

  return lineTool;
}

function createLineToolInstance(toolType, chartWidget, properties) {
  if (toolType === "LineToolVbPFixed") {
    return new LineToolVbPFixed(chartWidget, properties);
  } else if (toolType === "LineToolFixedRangeVolumeProfile") {
    return new LineToolFixedRangeVolumeProfile(chartWidget, properties);
  } else if (toolType === "LineToolRegressionTrend") {
    return new LineToolRegressionTrend(chartWidget, properties);
  } else if (toolType === "LineToolAnchoredVWAP") {
    return new LineToolAnchoredVWAP(chartWidget, properties);
  } else {
    return new lineTools[toolType](chartWidget, properties);
  }
}

function cloneLineTool(tool, toolData, chartWidget, toolId = null) {
  const properties = ensureDefined(tool.properties()).clone();
  properties.visible.setValue(true);

  const ownerSource = ensureNotNull(tool.ownerSource());
  const clonedTool = createLineToolInstance(
    tool.toolname,
    chartWidget,
    properties
  );
  if (tool.isFixed()) {
    const fixedPoint = ensureDefined(tool.fixedPoint());
    const offset = isJavaScriptStudy(tool)
      ? clonedTool.clonePositionOffset()
      : {};
    const newPoint = isJavaStudy(tool)
      ? fixedPoint.add(new Point(offset.xCoordOffset, offset.yCoordOffset))
      : fixedPoint;
    clonedTool.addFixedPoint(newPoint);
  }
  const points = tool.normalizedPoints();
  clonedTool.restorePoints(points, tool.points());

  if (clonedTool.cloneData) {
    clonedTool.cloneData(tool);
  }

  if (clonedTool.recalculateStateByData) {
    clonedTool.recalculateStateByData();
  }

  return clonedTool;
}

function isJavaStudy(tool) {
  return tool.toolname === "LineToolRegressionTrend";
}

function isJavaScriptStudy(tool) {
  return tool.toolname === "LineToolAnchoredVWAP";
}

function isLineTool(tool) {
  return tool instanceof LineDataSource;
}

function isStudyLineTool(tool) {
  return tool instanceof StudyLineDataSource;
}

function isTrading(tool) {
  return tool instanceof LineToolTrading;
}

function lineToolByLinkKey(dataSources, linkKey) {
  return dataSources.find(
    (dataSource) =>
      isLineTool(dataSource) && dataSource.linkKey().value() === linkKey
  );
}

function prepareLineToolPropertiesByOwnerSource(properties, ownerSource) {
  properties.symbol.setValue(ownerSource.symbol());
  if (ownerSource.model().currencyConversionEnabled()) {
    properties.currencyId.setValue(ownerSource.currency());
  }
  if (ownerSource.model().unitConversionEnabled()) {
    properties.unitId.setValue(ownerSource.unit());
  }
  properties.symbolStateVersion.setValue(2);
  properties.zOrderVersion.setValue(2);
}
function supportsPhantomMode(tool) {
  const toolInstance = toolInstanceMap[tool];
  return (
    toolInstance !== undefined && Boolean(toolInstance.supportsPhantomMode)
  );
}

function isLineDataSource(dataSource) {
  return dataSource instanceof a.LineDataSource;
}

function isStudyLineDataSource(dataSource) {
  return dataSource instanceof o.StudyLineDataSource;
}

function isLineToolTrading(tool) {
  return tool instanceof G.LineToolTrading;
}

function getLineToolTypeById(id) {
  let lineToolType = null;
  if (id === b.studyId()) {
    lineToolType = "LineToolRegressionTrend";
  } else if (id === w.LineToolVbPFixed.studyId()) {
    lineToolType = "LineToolVbPFixed";
  } else if (id === C.studyId()) {
    lineToolType = "LineToolFixedRangeVolumeProfile";
  }
  return lineToolType;
}

function cloneLineTool(chartWidget, tool, isJavaScript, toolId = null) {
  const toolType = tool.toolname;
  const toolProperties = tool.properties().state();
  toolProperties.intervalsVisibilities = n.mergeIntervalVisibilitiesDefaults(
    toolProperties?.intervalsVisibilities
  );
  const clonedProperties = cloneProperties(
    toolType,
    toolProperties,
    chartWidget
  );
  clonedProperties.childs().visible.setValue(true);

  const ownerSource = s.ensureNotNull(tool.ownerSource());
  const clonedTool = createLineToolInstance(
    toolType,
    chartWidget,
    clonedProperties
  );
  if (tool.isFixed()) {
    const fixedPoint = s.ensureDefined(tool.fixedPoint());
    const offset = isJavaScript ? clonedTool.clonePositionOffset() : {};
    const newPoint = isJavaScript
      ? fixedPoint.add(new r.Point(offset.xCoordOffset, offset.yCoordOffset))
      : fixedPoint;
    clonedTool.addFixedPoint(newPoint);
  }
  const points = tool.normalizedPoints();
  clonedTool.restorePoints(points, tool.points());

  if (clonedTool.cloneData) {
    clonedTool.cloneData(tool);
  }

  if (clonedTool.recalculateStateByData) {
    clonedTool.recalculateStateByData();
  }

  return clonedTool;
}

function getLineToolByLinkKey(dataSources, linkKey) {
  return dataSources.find(
    (dataSource) =>
      isLineDataSource(dataSource) && dataSource.linkKey().value() === linkKey
  );
}
