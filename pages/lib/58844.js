import { getLogger } from 'some-module';
import { errorToString } from 'some-other-module';

const logger = getLogger("Chart.SaveloadAdapter.Library");
const defaultErrorResponse = {
  error: ""
};

let clientName, userName, baseUrl, libraryName, customAdapter = null, saveLoadAdapter = null;

function buildUrl(endpoint) {
  return `${baseUrl}/${encodeURIComponent(libraryName)}/${endpoint}?client=${encodeURIComponent(clientName)}&user=${encodeURIComponent(userName)}`;
}

function setCustomAdapter(adapter) {
  customAdapter = adapter;
}

function initialize(client, user, base, library) {
  clientName = client;
  userName = user;
  baseUrl = base;
  libraryName = library;
}

function updateUser(user) {
  userName = user;
}

async function getCharts() {
  const transformData = (data) => {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      image_url: String(item.id),
      modified_iso: item.timestamp,
      short_symbol: item.symbol,
      interval: item.resolution
    }));
  };

  if (customAdapter) {
    return customAdapter.getAllCharts().then(transformData);
  }

  try {
    const response = await fetch(buildUrl('charts'), {
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error(`Getting chart content response was not OK. Status: ${response.status}.`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("Get chart content request failed: " + data.message);
    }

    return transformData(data.data);
  } catch (error) {
    logger.logWarn(errorToString(error));
    throw error;
  }
}

async function removeChart(chartId) {
  if (customAdapter) {
    return customAdapter.removeChart(chartId);
  }

  try {
    const response = await fetch(buildUrl('charts') + `&chart=${encodeURIComponent(chartId)}`, {
      method: "DELETE",
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error(`Remove chart response was not OK. Status: ${response.status}.`);
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("Remove drawing template request failed: " + data.message);
    }
  } catch (error) {
    logger.logWarn(errorToString(error));
    throw error;
  }
}

async function saveChart(name, symbol, resolution, content, id) {
  const chartId = id ? id.value() : null;
  const data = {
    name: name,
    content: JSON.stringify(content),
    symbol: symbol,
    resolution: resolution
  };

  if (customAdapter) {
    return customAdapter.saveChart({
      ...data,
      id: chartId
    });
  }

  try {
    const formData = new FormData();

    for (const key in data) {
      formData.append(key, data[key]);
    }

    let url = buildUrl('charts');
    if (chartId !== null) {
      url += `&chart=${encodeURIComponent(chartId)}`;
    }

    const response = await fetch(url, {
      credentials: "same-origin",
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Saving chart content response was not OK. Status: ${response.status}.`);
    }

    const responseData = await response.json();

    if (responseData.status !== "ok") {
      throw new Error("Saving chart content request failed: " + responseData.message);
    }

    return (responseData.id ?? chartId).toString();
  } catch (error) {
    logger.logWarn(errorToString(error));
    throw error;
  }
}

async function getChartContent(chart) {
  const transformData = (data) => {
    const parsedData = JSON.parse(data);
    parsedData.uid = chart.id;
    return parsedData;
  };

  if (customAdapter) {
    return customAdapter.getChartContent(chart.id).then(transformData);
  }

  try {
    const response = await fetch(buildUrl('charts') + `&chart=${encodeURIComponent(chart.id)}`, {
      credentials: "same-origin"
    });

    if (!response.ok) {
      throw new Error(`Getting chart content response was not OK. Status: ${response.status}.`);
    }

    const responseData = await response.json();

    if (responseData.status !== "ok") {
      throw new Error("Get chart content request failed: " + responseData.message);
    }

    return transformData(responseData.data.content);
  } catch (error) {
    logger.logWarn(errorToString(error));
    throw error;
  }
}

function loadChart(chart) {
  getChartContent(chart).then((content) => {
    // emit event or handle the content
  }).catch(() => {
    logger.logWarn("Error loading chart");
  });
}

// Implement the remaining functions in a similar fashion

export {
  getCharts,
  removeChart,
  saveChart,
  getChartContent,
  loadChart,
  initialize,
  updateUser,
  setCustomAdapter
};