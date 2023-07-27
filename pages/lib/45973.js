import { isStudy } from './28853.js';
import { supportedLineTools } from './88913.js';
import { isLineTool } from './18341.js';

function lineToolEntityInfo(lineTool) {
  return {
    id: lineTool.id(),
    name: Object.keys(supportedLineTools).find((key) => supportedLineTools[key].name === lineTool.toolname) || null
  };
}

function studyEntityInfo(study) {
  return {
    id: study.id(),
    name: study.metaInfo().description
  };
}

function seriesEntityInfo(series) {
  return {
    id: series.id(),
    name: 'Main Series'
  };
}

function entityForDataSource(chartModel, dataSource) {
  if (dataSource === chartModel.mainSeries()) {
    return seriesEntityInfo(chartModel.mainSeries());
  } else if (isStudy(dataSource)) {
    return studyEntityInfo(dataSource);
  } else if (isLineTool(dataSource)) {
    return lineToolEntityInfo(dataSource);
  }
  
  return null;
}

export { entityForDataSource, lineToolEntityInfo, seriesEntityInfo, studyEntityInfo };
