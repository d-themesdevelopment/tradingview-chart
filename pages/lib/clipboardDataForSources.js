


import { ensureNotNull } from './assertions.js';
import { isLineTool } from './18341.js';

function clipboardDataForSources(modelId, sources) {
  if (sources.length === 1 && isStudy(sources[0])) {
    const study = sources[0];
    return {
      title: study.title(),
      sources: [
        {
          source: ensureNotNull(study.state()),
          type: "study",
        },
      ],
    };
  }

  const data = {
    sources: [],
    title: "",
  };

  data.sources = sources
    .filter((source) => source.copiable() && isLineTool(source))
    .map((tool) => {
      const source = {
        type: "drawing",
        geometry: tool.geometry(),
        source: {
          ...tool.state(false),
          points: tool.normalizedPoints(),
        },
        modelId: modelId,
      };
      delete source.source.alertId;
      return source;
    });

  if (data.sources.length > 0) {
    if (data.sources.length === 1) {
      data.title = sources[0].title && sources[0].title();
    } else {
      data.title = "Drawings";
    }
    return data;
  }

  return null;
}

export { clipboardDataForSources };