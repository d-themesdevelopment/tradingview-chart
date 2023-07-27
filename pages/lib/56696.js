import { r as register, TVXWindowEvents } from 'window-events-module';
import { showOnElement, hide } from 'some-other-module';
import { deepExtend } from 'utility-module';

function executeWhenDOMReady(callback, defer = false) {
  if (document.readyState !== 'loading') {
    if (defer) {
      setTimeout(() => callback(), 1);
    } else {
      callback();
    }
  } else {
    document.addEventListener('DOMContentLoaded', () => callback());
  }
}

new Promise((resolve) => {
  executeWhenDOMReady(resolve);
});

function hasOverflow(element, axis = 'x') {
  let hasOverflow = false;
  if ((axis === 'x' || axis === 'both') && element.offsetWidth < element.scrollWidth) {
    hasOverflow = true;
  }
  if ((axis === 'y' || axis === 'both') && element.offsetHeight < element.scrollHeight) {
    hasOverflow = true;
  }
  return hasOverflow;
}

function hasOverflowInChildren(element, axis = 'x') {
  for (const child of Array.from(element.children)) {
    if (child instanceof HTMLElement && (hasOverflow(child, axis) || hasOverflowInChildren(child, axis))) {
      return true;
    }
  }
  return false;
}

executeWhenDOMReady(() => {
  document.addEventListener('mouseenter', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.matches('.apply-overflow-tooltip')) {
      let axis = 'x';
      if (target.matches('.apply-overflow-tooltip--direction_both')) {
        axis = 'both';
      } else if (target.matches('.apply-overflow-tooltip--direction_y')) {
        axis = 'y';
      }
      if (target.matches('.apply-overflow-tooltip--check-children-recursively')) {
        if (!hasOverflowInChildren(target, axis)) {
          return;
        }
      } else if (target.matches('.apply-overflow-tooltip--check-children')) {
        let hasOverflowChild = false;
        const children = target.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child instanceof HTMLElement && hasOverflow(child, axis)) {
            hasOverflowChild = true;
            break;
          }
        }
        if (!hasOverflowChild) {
          return;
        }
      } else if (!hasOverflow(target, axis)) {
        return;
      }
      let tooltipText = '';
      if (target.matches && target.matches('.apply-overflow-tooltip--allow-text')) {
        tooltipText = target.textContent || '';
      }
      const dataTooltipText = target.getAttribute('data-overflow-tooltip-text');
      tooltipText = dataTooltipText || Array.from(target.childNodes).reduce((text, node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          text.push(node.textContent || '');
        }
        return text;
      }, []).join('').trim();
      showOnElement(target, {
        text: tooltipText
      });
      const removeListeners = () => {
        hide();
        ['mouseleave', 'mousedown'].forEach((eventType) => target.removeEventListener(eventType, removeListeners));
      };
      ['mouseleave', 'mousedown'].forEach((eventType) => target.addEventListener(eventType, removeListeners));
    }
  }, true);
});

import { n as onWidget, IS_DEMO_PAGE } from 'parent-module';
import { trackEvent } from 'analytics-module';
import { TVLocalStorage } from 'local-storage-module';
import { subscribe } from 'subscription-module';

let loginStateChangeHandler;

function handleLoginStateChange() {
  window.iframeAuthWidget && !false === window.user.profile_data_filled && (window.iframeAuthWidget.preventClose = true);
  const availableOffers = window.user.available_offers || {};
  window.TVSettings && window.TVSettings.sync(window.user.settings);
  if (window.is_authenticated) {
    if (!window.user.profile_data_filled) {
      initOfferLoginStateChangeButton();
      if (onGoPro()) {
        window.location.reload();
      }
      delete window.user.profile_data_filled;
    }
  } else {
    Object.keys(availableOffers).forEach((key) => {
      if (!availableOffers[key].available_for_anons) {
        delete availableOffers[key];
      }
    });
    window.user = {
      username: 'Guest',
      following: '0',
      followers: '0',
      ignore_list: [],
      available_offers: availableOffers
    };
    TVLocalStorage.removeItem('trial_availiable');
  }
}

loginStateChangeHandler = window.loginStateChange ? window.loginStateChange : window.loginStateChange = new(d)();
loginStateChangeHandler.subscribe(null, handleLoginStateChange);
TVXWindowEvents.on('loginStateChange', (event) => {
  const { is_authenticated, user } = JSON.parse(event);
  window.user = user;
  window.is_authenticated = !!is_authenticated;
  loginStateChangeHandler.fire();
});
TVXWindowEvents.on('signOut', () => {
  if (window.initData.lfs) {
    const adminWarningElement = document.getElementsByClassName('js-admin-warning')[0];
    document.body.removeChild(adminWarningElement);
  }
  let shouldReload = true;
  [/^\/chart\//, /^\/share-your-love\//].forEach((regex) => {
    if (regex.test(window.location.pathname)) {
      shouldReload = false;
    }
  });
  if (shouldReload) {
    window.location.reload();
  }
});

(() => {
  const EVENT_NAME = 'user-obj-changed';
  const eventSubscriptions = {};

  window.crossTabSyncUserAttr = (attr) => {
    const userAttributes = {};
    if (attr instanceof Array) {
      attr.forEach((attribute) => {
        userAttributes[attribute] = window.user[attribute];
      });
    } else {
      userAttributes[attr] = window.user[attr];
    }
    TVXWindowEvents.emit(EVENT_NAME, JSON.stringify(userAttributes));
  };

  TVXWindowEvents.on(EVENT_NAME, (event) => {
    const userAttributes = JSON.parse(event);
    for (let attr in userAttributes) {
      if (userAttributes.hasOwnProperty(attr)) {
        window.user[attr] = userAttributes[attr];
        (eventSubscriptions[attr] || []).forEach((subscription) => {
          subscription.fire(userAttributes[attr]);
        });
      }
    }
  });
})();

window.TradingView.changeLoginState = (is_authenticated) => {
  window.is_authenticated = !!is_authenticated;
  TVXWindowEvents.emit('loginStateChange', JSON.stringify({
    is_authenticated: window.is_authenticated,
    user: window.user
  }));
  loginStateChangeHandler.fire();
};

window.loginUser = function(user, callback) {
  if (window.TVDialogs && window.TVDialogs.signModal) {
    window.TVDialogs.signModal.close();
  }
  window.user = deepExtend({}, user);
  window.TradingView.changeLoginState(true);
  if (typeof callback === 'function' && window.TVDialogs && window.TVDialogs.signModal) {
    subscribe('GLOBAL_EVENT_SIGN_IN_SUCCESS', callback, null);
  } else if (typeof callback === 'function') {
    callback();
  }
};

window.loginRequiredDelegate = new(d)();

window.runOrSignIn = (callback, options) => {
  options = options || {};
  callback();
};

window.onLoginStateChange = handle

LoginStateChange;

window.TradingView.setTrialAvailable = (available) => {
  TVLocalStorage.setItem('trial_availiable', available ? '1' : '0');
};

window.TradingView.notificationsChanged = new(d)();