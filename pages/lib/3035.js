import { SessionInfo, isTradingNow } from 'some-import-path';

let currentTicker = null;
let tickerTimer = null;
const sessionData = {};

function processQuotesData(ticker, status) {
  const data = {
    symbolname: ticker,
    status: 'ok',
    values: {
      current_session: status
    }
  };
  sessionData[ticker] = status;
  TradingView.ChartapiMessagerInstances[currentTicker].onQuotesData([currentTicker, data]);
}

function updateMarketStatus() {
  if (currentTicker) {
    if (tickerTimer) {
      sessionData[currentTicker] = 'out_of_session';
    } else {
      const status = isTradingNow(new Date().getTime(), tickerTimer) ? 'market' : 'out_of_session';
      if (status !== sessionData[currentTicker]) {
        sessionData[currentTicker] = status;
      }
    }
  }
}

export default function (timezone, session, sessionHolidays, corrections) {
  let initialized = false;
  let sessionExpired = false;
  let marketStatus = 'out_of_session';
  let stopTimer = null;
  let marketStatusTimer = null;

  function initialize(data) {
    if (!initialized) {
      const secondsToNextMinute = 60 - new Date(Date.now()).getSeconds();
      if (currentTicker && (currentTicker.ticker !== data.ticker || currentTicker.timer !== secondsToNextMinute)) {
        clearTimeout(currentTicker.timeout);
        currentTicker = null;
      }

      initialized = true;
      sessionExpired = data.expired;
      currentTicker = {
        ticker: data.ticker,
        timer: secondsToNextMinute
      };
      currentTicker.timeout = setTimeout(() => {
        marketStatusTimer = setInterval(() => {
          updateMarketStatus();
          processQuotesData();
        }, 60000);

        updateMarketStatus();
        processQuotesData();
      }, 1000 * currentTicker.timer);

      updateMarketStatus();
      processQuotesData();
    }
  }

  function onDataReceived(data) {
    if (!initialized) {
      initialize(data);
    }
  }

  function stop() {
    initialized = false;
    clearInterval(marketStatusTimer);
    clearTimeout(currentTicker.timeout);
  }

  function getMarketStatus() {
    return marketStatus;
  }

  return function (e, t, i) {
    onDataReceived(i);
    return {
      stop,
      marketStatus: getMarketStatus
    };
  };
}
