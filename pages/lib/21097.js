import { getLogger } from "log4js"; // ! not correct

const logger = getLogger("XWindowEvents");

let TVXWindowEvents;

(function (events) {
  const eventPrefix = "tvxwevents.";
  const eventListeners = {};
  let broadcastChannel;

  if (window.BroadcastChannel) {
    broadcastChannel = new BroadcastChannel("tvxwevents");
    broadcastChannel.addEventListener("message", (event) => {
      const {
        data: { event: eventName, value: eventValue },
      } = event;
      if (eventListeners[eventName]) {
        eventListeners[eventName].forEach((listener) => {
          listener(eventValue);
        });
      }
    });

    (function () {
      const keysToDelete = [];
      const startTime = performance.now();
      for (let i = 0; i < TVLocalStorage.length; i++) {
        const key = TVLocalStorage.key(i);
        if (key.startsWith(eventPrefix)) {
          keysToDelete.push(key);
        }
      }
      const totalKeys = TVLocalStorage.length;
      for (const key of keysToDelete) {
        TVLocalStorage.removeItem(key);
      }
      const elapsedTime = performance.now() - startTime;
      logger.logNormal(
        `Total keys amount in local storage on operation start: ${totalKeys}`
      );
      logger.logNormal(
        `Keys amount in local storage to be deleted: ${keysToDelete.length}`
      );
      logger.logNormal(
        `Keys to be deleted from local storage: ${JSON.stringify(keysToDelete)}`
      );
      logger.logNormal(
        `Removing keys from local storage took ${elapsedTime} ms`
      );
    })();
  } else {
    window.addEventListener("storage", (event) => {
      const { newValue, key } = event;
      if (newValue === null || !key || !key.startsWith(eventPrefix)) {
        return;
      }
      const eventName = key.substring(eventPrefix.length);
      if (eventListeners[eventName]) {
        eventListeners[eventName].forEach((listener) => {
          listener(newValue);
        });
      }
      TVLocalStorage.removeItem(key);
    });
  }

  events.on = function (eventName, listener) {
    eventListeners[eventName] = eventListeners[eventName] || [];
    eventListeners[eventName].push(listener);
  };

  events.off = function (eventName, listener) {
    if (!eventListeners[eventName]) {
      return;
    }
    const index = eventListeners[eventName].indexOf(listener);
    if (index !== -1) {
      if (eventListeners[eventName].length === 1) {
        delete eventListeners[eventName];
      } else {
        eventListeners[eventName].splice(index, 1);
      }
    }
  };

  events.emit = function (eventName, value = Date.now()) {
    try {
      if (broadcastChannel) {
        broadcastChannel.postMessage({ event: eventName, value });
      } else {
        TVLocalStorage.setItem(eventPrefix + eventName, value.toString());
      }
    } catch (error) {
      logger.logError(error.message);
    }
  };
})(TVXWindowEvents || (TVXWindowEvents = {}));

export default TVXWindowEvents;
