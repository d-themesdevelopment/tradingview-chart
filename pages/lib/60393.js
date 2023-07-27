import { default as _, ensureNotNull } from 'some-module';
import { isExtendedInput, isExtendedInputSource } from 'some-module';
import { getSourceIdsByInputs, isSourceInput, getSourceInputIds, setChildStudyMetaInfoPropertiesSourceId, patchSoSInputs, canBeChild, isAllowedSourceInputsCount, canHaveChildren, getChildSourceInputTitles, canPlotBeSourceOfChildStudy, getStudyPropertyRootName, getStudyPropertyRootNameById } from 'some-module';

const forbiddenStudyIds = new Set(["CorrelationCoefficient@tv-basicstudies", "Correlation - Log@tv-basicstudies-1"]);
const forbiddenStudyTypes = new Set([]);
const allowedPlotTypes = new Set(["line"]);
const studyIdMappings = new Map([
  ["AnchoredVWAP@tv-basicstudies", "linetoolanchoredvwap"],
  ["RegressionTrend@tv-basicstudies", "linetoolregressiontrend"]
]);
const idRegex = /^([^\$]+)\$\d+$/;

class StudyMetaInfoBase {
  static getSourceIdsByInputs(inputs, values) {
    if (!Array.isArray(inputs) || !values) return [];
    const sourceIds = [];
    for (const input of inputs) {
      if (isSourceInput(input) && _(values[input.id])) {
        const value = values[input.id];
        if (value.includes("$")) {
          sourceIds.push(value.split("$")[0]);
        }
      }
    }
    return sourceIds;
  }

  static isSourceInput(input) {
    return Boolean(
      input.id && (
        (input.id === "source" || input.id === "src") && (input.type === "text" || input.type === "source") ||
        input.type === "source"
      )
    );
  }

  static getSourceInputIds(metaInfo) {
    const sourceInputIds = [];
    for (const input of metaInfo.inputs) {
      if (isSourceInput(input)) {
        sourceInputIds.push(input.id);
      }
    }
    return sourceInputIds;
  }

  static setChildStudyMetaInfoPropertiesSourceId(metaInfo, rootId, valueGetter) {
    for (const input of metaInfo.inputs) {
      if (!isSourceInput(input)) continue;
      const childInput = valueGetter.childs().inputs?.childs()[input.id];
      if (childInput) {
        const value = childInput.value();
        const matches = idRegex.exec(value);
        if (matches && matches.length === 2) {
          if (matches[1] === "{pid}") {
            const updatedValue = value.replace(/^[^\$]+/, rootId);
            childInput.setValue(updatedValue);
          }
        }
      }
    }
  }

  static patchSoSInputs(inputs, valueGetter) {
    const processValue = (value) => {
      const matches = idRegex.exec(value);
      if (matches && matches.length === 2) {
        const sourceId = matches[1];
        const newValue = `${ensureNotNull(valueGetter(sourceId))}`;
        return value.replace(/^[^\$]+/, newValue);
      }
      return value;
    };

    for (const inputName in inputs) {
      if (/in_[\d+]/.test(inputName) || inputName === "source") {
        const value = inputs[inputName];
        if (_(value)) {
          inputs[inputName] = processValue(value);
        } else if (isExtendedInput(value) && isExtendedInputSource(value)) {
          value.v = processValue(value.v);
        }
      }
    }
  }

  static canBeChild(metaInfo) {
    if (_(metaInfo)) return true;
    if (!metaInfo) return false;
    if (metaInfo.extra && !isAllowedSourceInputsCount(metaInfo.extra.sourceInputsCount) ||
        metaInfo.canNotBeChild === true || metaInfo.canBeChild === false || forbiddenStudyIds.has(metaInfo.id)) {
      return false;
    }
    let sourceInputCount = 0;
    for (const input of metaInfo.inputs) {
      if (isSourceInput(input)) {
        sourceInputCount += 1;
      }
    }
    return isAllowedSourceInputsCount(sourceInputCount);
  }

  static isAllowedSourceInputsCount(count) {
    return count === 1;
  }

  static canHaveChildren(metaInfo) {
    if (metaInfo) {
      if (metaInfo.isTVScriptStrategy ||
          (metaInfo.TVScriptSourceCode && isStrategy(metaInfo.TVScriptSourceCode))) {
        return false;
      }
      if (metaInfo.id && !forbiddenStudyTypes.has(metaInfo.id) && Array.isArray(metaInfo.plots)) {
        for (const plot of metaInfo.plots) {
          if (allowedPlotTypes.has(plot.type)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  static getChildSourceInputTitles(metaInfo, studyOptions, prefix) {
    const titles = {};
    if (studyOptions.plots && studyOptions.plots.length && metaInfo.options && metaInfo.options.length) {
      for (const option of metaInfo.options) {
        const index = option ? +option.split("$")[1] : NaN;
        const plot = isFinite(index) && studyOptions.plots[index];
        if (plot && allowedPlotTypes.has(plot.type)) {
          titles[option] = (
            studyOptions.styles &&
            studyOptions.styles[plot.id] &&
            (studyOptions.styles[plot.id]?.title ?? plot.id)
          );
          if (prefix) {
            titles[option] = `${prefix}: ${titles[option]}`;
          }
        }
      }
    }
    return titles;
  }

  static canPlotBeSourceOfChildStudy(plotType) {
    return allowedPlotTypes.has(plotType);
  }

  static getStudyPropertyRootName(studyInfo) {
    const mappedName = studyIdMappings.get(studyInfo.id);
    if (mappedName !== undefined) {
      return mappedName;
    }
    let rootName = `study_${studyInfo.id}`;
    if (studyInfo.pine && studyInfo.pine.version) {
      rootName += `_${studyInfo.pine.version.replace(".", "_")}`;
    }
    return rootName;
  }

  static getStudyPropertyRootNameById(studyId) {
    const mappedName = studyIdMappings.get(studyId);
    return mappedName !== undefined ? mappedName : `study_${studyId}`;
  }
}

export {
  StudyMetaInfoBase
};