import { setTooltipData, getTooltipData } from 'tooltip-utils';
import { parseHtmlElement } from 'html-utils';
import { clamp } from 'math-utils';
import { CheckMobile, supportTouch, isMac } from 'device-utils';
import { preventDefault } from 'event-utils';
import { createGroup } from 'performance-utils';
import { ensureNotNull } from 'null-utils';

const hide = () => {
  clearTimeout(r);
  clearTimeout(n);
  clearTimeout(o);
};

const show = (e) => {
  const t = ensureNotNull(F.options);
  const i = Y(e);
  const s = x(i);

  if (F) {
    hide();
    j();
  }

  F = {
    options: i,
    element: s,
  };

  if (!O) {
    I(s);
    l(() => q(s), t.tooltipDelay || 500);
  } else {
    const { tooltipDebounce: r } = e;

    if (typeof r === 'number' && !isNaN(r)) {
      l(() => q(s), r);
    } else {
      q(s);
    }
  }
};

const showOnElement = (element, options = {}) => {
  const content = Y(options);
  const tooltip = x({ ...C(element), ...content });
  const { tooltipDebounce: debounce } = options;

  if (!tooltipDebounce || isNaN(tooltipDebounce)) {
    q(tooltip);
  } else {
    l(() => q(tooltip), tooltipDebounce);
  }
};

const setTooltipData = (e, key, value) => {
  e.dataset[key] = value;
};

const getTooltipData = (e, key) => {
  return e.dataset[key];
};

const m = Object.keys(_);

const B = (e) => {
  return e.querySelector(`.${P["common-tooltip__body"]}`);
};

const R = (e, t) => {
  return 10 + e < t.y;
};

const N = createGroup({
  desc: 'Tooltip',
});

let O = false;
let F = null;
let W = null;

s.mobiletouch || document.addEventListener('mouseover', (e) => {
  if (e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents) {
    return;
  }

  const target = e.target;
  const currentTarget = e.currentTarget;

  const applyTooltipElements = function (e, t, i) {
    const s = [];

    while (e && e !== t) {
      if (e.classList && e.classList.contains(i)) {
        s.push(e);
      }
      e = e.parentElement || $(e.parentNode);
    }

    return s;
  }(target, currentTarget, 'apply-common-tooltip');

  const tooltipHandler = () => {
    showOnElement(tooltipElement);
  };

  for (const tooltipElement of applyTooltipElements) {
    if ('buttons' in e) {
      if (e.buttons & 1) {
        continue;
      }
    } else if (e.which === 1) {
      continue;
    }

    const updateTooltip = () => {
      tooltipElement.removeEventListener('common-tooltip-update', tooltipHandler);
      tooltipElement.removeEventListener('mouseleave', removeTooltip);
      tooltipElement.removeEventListener('mousedown', removeTooltip);
      document.removeEventListener('scroll', scrollListener, { capture: true });

      if (tooltipElement === F.options.target) {
        G();
      }
    };

    const removeTooltip = (immediate, keepTarget = false) => {
      tooltipElement.removeEventListener('mouseleave', removeTooltip);
      tooltipElement.removeEventListener('mousedown', removeTooltip);
      document.removeEventListener('scroll', scrollListener, { capture: true });

      if (immediate) {
        G();
      } else {
        if (!O) {
          I(tooltipElement);
          j();
        }

        if (F && F.options.target === tooltipElement) {
          n = setTimeout(() => {
            G();
          }, 250);
        }
      }
    };

    const scrollListener = (event) => {
      if (event.target instanceof Element && event.target.contains(tooltipElement)) {
        removeTooltip(false, true);
      }
    };

    tooltipElement.addEventListener('common-tooltip-update', tooltipHandler);
    tooltipElement.addEventListener('mouseleave', removeTooltip);
    tooltipElement.addEventListener('mousedown', removeTooltip);
    document.addEventListener('scroll', scrollListener, { capture: true });

    if (!W) {
      W = createGroup({ desc: 'Tooltip' });
      W.add({
        desc: 'Hide',
        hotkey: 27,
        handler: removeTooltip.bind(null, true),
      });
    }

    break;
  }
});

const Y = (options) => {
  if ('content' in options) {
    return options;
  }

  const { inner, html, text, ...rest } = options;
  let content = { type: 'none' };

  if (inner) {
    content = { type: 'element', data: inner };
  }

 else if (text) {
    content = { type: html ? 'html' : 'text', data: text };
  }

  return { content, ...rest };
};

const $ = (e) => {
  return e && e.nodeType === Node.ELEMENT_NODE ? e : null;
};

export {
  hide,
  show,
  showOnElement,
  setTooltipData,
  getTooltipData,
};