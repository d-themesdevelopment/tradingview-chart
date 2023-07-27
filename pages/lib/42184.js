import { isSafari, CheckMobile } from 'some-module';
import { merge, clone } from 'some-module';
import { preventDefault, setLastMouseOrTouchEventInfo } from 'some-module';

const mouseEventType = isSafari ? 'click' : 'auxclick';

const defaultOptions = {
  treatVertTouchDragAsPageScroll: false,
  treatHorzTouchDragAsPageScroll: false
};

class MouseEventHandler {
  constructor(target, handler, options) {
    this.clickCount = 0;
    this.clickTimeoutId = null;
    this.clickPosition = {
      x: Number.NEGATIVE_INFINITY,
      y: Number.POSITIVE_INFINITY
    };
    this.tapCount = 0;
    this.tapTimeoutId = null;
    this.tapPosition = {
      x: Number.NEGATIVE_INFINITY,
      y: Number.POSITIVE_INFINITY
    };
    this.longTapTimeoutId = null;
    this.longTapActive = false;
    this.mouseMoveStartPosition = null;
    this.touchMoveStartPosition = null;
    this.touchMoveExceededManhattanDistance = false;
    this.cancelClick = false;
    this.cancelTap = false;
    this.unsubscribeOutsideMouseEvents = null;
    this.unsubscribeOutsideTouchEvents = null;
    this.unsubscribeMobileSafariEvents = null;
    this.unsubscribeMousemove = null;
    this.unsubscribeRootMouseEvents = null;
    this.unsubscribeRootTouchEvents = null;
    this.startPinchMiddlePoint = null;
    this.startPinchDistance = 0;
    this.pinchPrevented = false;
    this.preventTouchDragProcess = false;
    this.mousePressed = false;
    this.lastTouchEventTimeStamp = 0;
    this.activeTouchId = null;
    this.acceptMouseLeave = !CheckMobile.iOS();
    this.target = target;
    this.handler = handler;
    this.options = merge(clone(defaultOptions), options || {});
    this.init();
  }

  destroy() {
    if (this.unsubscribeOutsideMouseEvents) {
      this.unsubscribeOutsideMouseEvents();
      this.unsubscribeOutsideMouseEvents = null;
    }
    if (this.unsubscribeOutsideTouchEvents) {
      this.unsubscribeOutsideTouchEvents();
      this.unsubscribeOutsideTouchEvents = null;
    }
    if (this.unsubscribeMousemove) {
      this.unsubscribeMousemove();
      this.unsubscribeMousemove = null;
    }
    if (this.unsubscribeRootMouseEvents) {
      this.unsubscribeRootMouseEvents();
      this.unsubscribeRootMouseEvents = null;
    }
    if (this.unsubscribeRootTouchEvents) {
      this.unsubscribeRootTouchEvents();
      this.unsubscribeRootTouchEvents = null;
    }
    this.clearLongTapTimeout();
    this.resetClickTimeout();
  }

  mouseEnterHandler(event) {
    if (this.unsubscribeMousemove) {
      this.unsubscribeMousemove();
    }
    const mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.unsubscribeMousemove = () => {
      this.target.removeEventListener('mousemove', mouseMoveHandler);
    };
    this.target.addEventListener('mousemove', mouseMoveHandler);
    if (!this.firesTouchEvents(event)) {
      const compatibleEvent = this.makeCompatEvent(event);
      this.processMouseEvent(compatibleEvent, this.handler.mouseEnterEvent);
      this.acceptMouseLeave = true;
    }
  }

  resetClickTimeout() {
    if (this.clickTimeoutId !== null) {
      clearTimeout(this.clickTimeoutId);
    }
    this.clickCount = 0;
    this.clickTimeoutId = null;
    this.clickPosition = {
      x: Number.NEGATIVE_INFINITY,
      y: Number.POSITIVE_INFINITY
    };
  }

  resetTapTimeout() {
    if (this.tapTimeoutId !== null) {
      clearTimeout(this.tapTimeoutId);
    }
    this.tapCount = 0;
    this.tapTimeoutId = null;
    this.tapPosition = {
      x: Number.NEGATIVE_INFINITY,
      y: Number.POSITIVE_INFINITY
    };
  }

  mouseMoveHandler(event) {
    if (this.mousePressed || this.touchMoveStartPosition !== null) {
      return;
    }
    if (this.firesTouchEvents(event)) {
      return;
    }
    const compatibleEvent = this.makeCompatEvent(event);
    this.processMouseEvent(compatibleEvent, this.handler.mouseMoveEvent);
    this.acceptMouseLeave = true;
  }

  touchMoveHandler(event) {
    const touch = this.getActiveTouch(event.changedTouches);
    if (touch === null) {
      return;
    }
    this.lastTouchEventTimeStamp = this.getEventTimeStamp(event);
    if (this.startPinchMiddlePoint !== null) {
      return;
    }
    if (this.preventTouchDragProcess) {
      return;
    }
    this.pinchPrevented = true;
    const moveInfo = this.touchMouseMoveWithDownInfo(
      this.getTouchCoordinates(touch),
      this.touchMoveStartPosition
    );
    const { xOffset, yOffset, manhattanDistance } = moveInfo;
    if (this.touchMoveExceededManhattanDistance || !(manhattanDistance < 5)) {
      if (!this.touchMoveExceededManhattanDistance) {
        const halfXOffset = 0.5 * xOffset;
        const treatVertTouchDragAsPageScroll = this.options.treatVertTouchDragAsPageScroll;
        const treatHorzTouchDragAsPageScroll = this.options.treatHorzTouchDragAsPageScroll;
        if (!(yOffset >= halfXOffset && !treatVertTouchDragAsPageScroll)
            && !(halfXOffset > yOffset && !treatHorzTouchDragAsPageScroll)) {
          this.preventTouchDragProcess = true;
        }
        this.touchMoveExceededManhattanDistance = true;
        this.cancelTap = true;
        this.clearLongTapTimeout();
        this.resetTapTimeout();
      }
      if (!this.preventTouchDragProcess) {
        const compatibleEvent = this.makeCompatEvent(event, touch);
        this.processTouchEvent(compatibleEvent, this.handler.touchMoveEvent);
        preventDefault(event);
      }
    }
  }

  mouseMoveWithDownHandler(event) {
    if (event.button !== 0) {
      return;
    }
    const moveInfo = this.touchMouseMoveWithDownInfo(
      this.getMouseCoordinates(event),
      this.mouseMoveStartPosition
    );
    const { manhattanDistance } = moveInfo;
    if (manhattanDistance >= 5) {
      this.cancelClick = true;
      this.resetClickTimeout();
    }
    if (this.cancelClick) {
      const compatibleEvent = this.makeCompatEvent(event);
      this.processMouseEvent(compatibleEvent, this.handler.pressedMouseMoveEvent);
    }
  }

  touchEndHandler(event) {
    let touch = this.getActiveTouch(event.changedTouches);
    if (touch === null && event.touches.length === 0) {
      touch = event.changedTouches[0];
    }
    if (touch === null) {
      return;
    }
    this.activeTouchId = null;
    this.lastTouchEventTimeStamp = this.getEventTimeStamp(event);
    this.clearLongTapTimeout();
    this.touchMoveStartPosition = null;
    if (this.unsubscribeRootTouchEvents) {
      this.unsubscribeRootTouchEvents();
      this.unsubscribeRootTouchEvents = null;
    }
    const compatibleEvent = this.makeCompatEvent(event, touch);
    this.processTouchEvent(compatibleEvent, this.handler.touchEndEvent);
    this.tapCount++;
    if (this.tapTimeoutId && this.tapCount > 1) {
      const { manhattanDistance } = this.touchMouseMoveWithDownInfo(
        this.getTouchCoordinates(touch),
        this.tapPosition
      );
      if (manhattanDistance < 30 && !this.cancelTap) {
        this.processTouchEvent(compatibleEvent, this.handler.doubleTapEvent);
      }
      this.resetTapTimeout();
    } else if (!this.cancelTap) {
      this.processTouchEvent(compatibleEvent, this.handler.tapEvent);
      if (this.handler.tapEvent) {
        preventDefault(event);
      }
    }
    if (this.tapCount === 0) {
      preventDefault(event);
    }
    if (event.touches.length === 0 && this.longTapActive) {
      this.longTapActive = false;
      preventDefault(event);
    }
  }

  mouseUpHandler(event) {
    if (event.button !== 0) {
      return;
    }
    const compatibleEvent = this.makeCompatEvent(event);
    this.mouseMoveStartPosition = null;
    this.mousePressed = false;
    if (this.unsubscribeRootMouseEvents) {
      this.unsubscribeRootMouseEvents();
      this.unsubscribeRootMouseEvents = null;
    }
    if (isFirefox) {
      this.target.ownerDocument.documentElement.removeEventListener(
        'mouseleave',
        this.onFirefoxOutsideMouseUp
      );
    }
    if (!this.firesTouchEvents(event)) {
      this.processMouseEvent(compatibleEvent, this.handler.mouseUpEvent);
      this.clickCount++;
      if (this.clickTimeoutId && this.clickCount > 1) {
        const { manhattanDistance } = this.touchMouseMoveWithDownInfo(
          this.getMouseCoordinates(event),
          this.clickPosition
        );
        if (manhattanDistance < 5 && !this.cancelClick) {
          this.processMouseEvent(compatibleEvent, this.handler.mouseDoubleClickEvent);
        }
        this.resetClickTimeout();
      } else if (!this.cancelClick) {
        this.processMouseEvent(compatibleEvent, this.handler.mouseClickEvent);
      }
    }
  }

  clearLongTapTimeout() {
    if (this.longTapTimeoutId !== null) {
      clearTimeout(this.longTapTimeoutId);
      this.longTapTimeoutId = null;
    }
  }

  touchStartHandler(event) {
    if (this.activeTouchId !== null) {
      return;
    }
    const touch = event.changedTouches[0];
    this.activeTouchId = touch.identifier;
    this.lastTouchEventTimeStamp = this.getEventTimeStamp(event);
    const docElement = this.target.ownerDocument.documentElement;
    this.cancelTap = false;
    this.touchMoveExceededManhattanDistance = false;
    this.preventTouchDragProcess = false;
    this.touchMoveStartPosition = this.getTouchCoordinates(touch);
    if (this.unsubscribeRootTouchEvents) {
      this.unsubscribeRootTouchEvents();
      this.unsubscribeRootTouchEvents = null;
    }
    {
      const touchMoveHandler = this.touchMoveHandler.bind(this);
      const touchEndHandler = this.touchEndHandler.bind(this);
      this.unsubscribeRootTouchEvents = () => {
        docElement.removeEventListener('touchmove', touchMoveHandler);
        docElement.removeEventListener('touchend', touchEndHandler);
      };
      docElement.addEventListener('touchmove', touchMoveHandler, { passive: false });
      docElement.addEventListener('touchend', touchEndHandler, { passive: false });
      this.clearLongTapTimeout();
      this.longTapTimeoutId = setTimeout(
        this.longTapHandler.bind(this, event),
        240
      );
    }
    const compatibleEvent = this.makeCompatEvent(event, touch);
    this.processTouchEvent(compatibleEvent, this.handler.touchStartEvent);
    if (!this.tapTimeoutId) {
      this.tapCount = 0;
      this.tapTimeoutId = setTimeout(
        this.resetTapTimeout.bind(this),
        500
      );
      this.tapPosition = this.getTouchCoordinates(touch);
    }
  }

  wheelClickHandler(event) {
    if (event.button !== 1) {
      return;
    }
    if (this.firesTouchEvents(event)) {
      return;
    }
    const compatibleEvent = this.makeCompatEvent(event);
    this.processMouseEvent(compatibleEvent, this.handler.wheelClickEvent);
  }

  mouseDownHandler(event) {
    if (event.button !== 0) {
      return;
    }
    const docElement = this.target.ownerDocument.documentElement;
    if (isFirefox) {
      docElement.addEventListener('mouseleave', this.onFirefoxOutsideMouseUp);
    }
    this.cancelClick = false;
    this.mouseMoveStartPosition = this.getMouseCoordinates(event);
    if (this.unsubscribeRootMouseEvents) {
      this.unsubscribeRootMouseEvents();
      this.unsubscribeRootMouseEvents = null;
    }
    {
      const mouseMoveHandler = this.mouseMoveWithDownHandler.bind(this);
      const mouseUpHandler = this.mouseUpHandler.bind(this);
      this.unsubscribeRootMouseEvents = () => {
        docElement.removeEventListener('mousemove', mouseMoveHandler);
        docElement.removeEventListener('mouseup', mouseUpHandler);
      };
      docElement.addEventListener('mousemove', mouseMoveHandler);
      docElement.addEventListener('mouseup', mouseUpHandler);
    }
    if (!this.firesTouchEvents(event)) {
      const compatibleEvent = this.makeCompatEvent(event);
      this.processMouseEvent(compatibleEvent, this.handler.mouseDownEvent);
      this.clickTimeoutId || (this.clickCount = 0, this.clickTimeoutId = setTimeout(this.resetClickTimeout.bind(this), 500), this.clickPosition = this.getMouseCoordinates(event));
    }
  }

  init() {
    this.target.addEventListener('mouseenter', this.mouseEnterHandler.bind(this));
    this.target.addEventListener('touchcancel', this.clearLongTapTimeout.bind(this));
    {
      const doc = this.target.ownerDocument;
      const isTargetOrDescendant = (event) =>
        !event.target || !this.target.contains(event.target);
      const touchStartOutsideHandler = (event) => {
        if (isTargetOrDescendant(event)) {
          const touch = event.changedTouches[0];
          this.lastTouchEventTimeStamp = this.getEventTimeStamp(event);
          this.processTouchEvent(
            this.makeCompatEvent(event, touch),
            this.handler.touchStartOutsideEvent
          );
        }
      };
      const mouseDownOutsideHandler = (event) => {
        if (isTargetOrDescendant(event) && !this.firesTouchEvents(event)) {
          this.processMouseEvent(
            this.makeCompatEvent(event),
            this.handler.mouseDownOutsideEvent
          );
        }
      };
      this.unsubscribeOutsideTouchEvents = () => {
        doc.removeEventListener('touchstart', touchStartOutsideHandler);
      };
      this.unsubscribeOutsideMouseEvents = () => {
        doc.removeEventListener('mousedown', mouseDownOutsideHandler);
      };
      doc.addEventListener('mousedown', mouseDownOutsideHandler);
      doc.addEventListener('touchstart', touchStartOutsideHandler, { passive: true });
    }
    if (CheckMobile.iOS()) {
      this.unsubscribeMobileSafariEvents = () => {
        this.target.removeEventListener('dblclick', this.onMobileSafariDoubleClick);
      };
      this.target.addEventListener('dblclick', this.onMobileSafariDoubleClick);
    }
    this.target.addEventListener('mouseleave', this.mouseLeaveHandler.bind(this));
    this.target.addEventListener('contextmenu', this.contextMenuHandler.bind(this));
    this.target.addEventListener('touchstart', this.touchStartHandler.bind(this), { passive: true });
    preventScrollByWheelClick(this.target);
    this.target.addEventListener('mousedown', this.mouseDownHandler.bind(this));
    this.target.addEventListener(l, this.wheelClickHandler.bind(this));
    this.initPinch();
    this.target.addEventListener('touchmove', (() => {}), { passive: false });
  }

  initPinch() {
    if (
      this.handler.pinchStartEvent === undefined &&
      this.handler.pinchEvent === undefined &&
      this.handler.pinchEndEvent === undefined
    ) {
      return;
    }
    this.target.addEventListener('touchstart', (e) =>
      this.checkPinchState(e.touches),
      { passive: true }
    );
    this.target.addEventListener('touchmove', (e) => {
      if (
        e.touches.length === 2 &&
        this.startPinchMiddlePoint !== null &&
        this.handler.pinchEvent !== undefined
      ) {
        const [touch1, touch2] = e.touches;
        const point1 = this.getTouchCoordinates(touch1);
        const point2 = this.getTouchCoordinates(touch2);
        const distanceRatio = getDistanceRatio(touch1, touch2) / this.startPinchDistance;
        const boundingRect = this.target.getBoundingClientRect();
        this.handler.pinchEvent(
          this.startPinchMiddlePoint,
          {
            x: touch1.clientX - boundingRect.left,
            y: touch1.clientY - boundingRect.top,
          },
          {
            x: touch2.clientX - boundingRect.left,
            y: touch2.clientY - boundingRect.top,
          },
          distanceRatio
        );
        preventDefault(e);
      }
    }, { passive: false });
    this.target.addEventListener('touchend', (e) => {
      this.checkPinchState(e.touches);
    });
  }

  checkPinchState(touches) {
    if (touches.length === 1) {
      this.pinchPrevented = false;
    }
    if (touches.length !== 2 || this.pinchPrevented || this.longTapActive) {
      this.stopPinch();
    } else {
      this.startPinch(touches);
    }
  }

  startPinch(touches) {
    if (this.handler.pinchStartEvent !== undefined) {
      const [touch1, touch2] = touches;
      const boundingRect = this.target.getBoundingClientRect();
      const point1 = {
        x: touch1.clientX - boundingRect.left,
        y: touch1.clientY - boundingRect.top,
      };
      const point2 = {
        x: touch2.clientX - boundingRect.left,
        y: touch2.clientY - boundingRect.top,
      };
      this.startPinchMiddlePoint = {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2,
      };
      this.startPinchDistance = getDistance(touch1, touch2);
      this.handler.pinchStartEvent(this.startPinchMiddlePoint, point1, point2);
    }
    this.clearLongTapTimeout();
  }

  stopPinch() {
    if (this.startPinchMiddlePoint !== null) {
      this.startPinchMiddlePoint = null;
      if (this.handler.pinchEndEvent !== undefined) {
        this.handler.pinchEndEvent();
      }
    }
  }

  mouseLeaveHandler(event) {
    if (this.unsubscribeMousemove) {
      this.unsubscribeMousemove();
      this.unsubscribeMousemove = null;
    }
    if (this.firesTouchEvents(event)) {
      return;
    }
    if (!this.acceptMouseLeave) {
      return;
    }
    const compatibleEvent = this.makeCompatEvent(event);
    this.processMouseEvent(compatibleEvent, this.handler.mouseLeaveEvent);
    this.acceptMouseLeave = !CheckMobile.iOS();
  }

  longTapHandler(event) {
    const touch = getTouch(event.touches, this.activeTouchId);
    if (touch === null) {
      return;
    }
    const compatibleEvent = this.makeCompatEvent(event, touch);
    this.processTouchEvent(compatibleEvent, this.handler.longTapEvent);
    this.processTouchEvent(compatibleEvent, this.handler.touchContextMenuEvent);
    this.cancelTap = true;
    this.longTapActive = true;
  }

  contextMenuHandler(event) {
    preventDefault(event);
    if (this.touchMoveStartPosition !== null) {
      return;
    }
    if (this.firesTouchEvents(event)) {
      return;
    }
    const compatibleEvent = this.makeCompatEvent(event);
    this.processMouseEvent(compatibleEvent, this.handler.contextMenuEvent);
    this.cancelClick = true;
  }

  firesTouchEvents(event) {
    if (event.sourceCapabilities !== undefined &&
      event.sourceCapabilities.firesTouchEvents !== undefined) {
      return event.sourceCapabilities.firesTouchEvents;
    }
    return this.getEventTimeStamp(event) < this.lastTouchEventTimeStamp + 500;
  }

  processTouchEvent(event, handler) {
    setLastMouseOrTouchEventInfo(event);
    if (handler !== undefined) {
      handler.call(this.handler, event);
    }
  }

  processMouseEvent(event, handler) {
    if (event.srcType !== 'mouseleave') {
      setLastMouseOrTouchEventInfo(event);
    }
    if (handler !== undefined) {
      handler.call(this.handler, event);
    }
  }

  makeCompatEvent(event, touch) {
    const touchEvent = touch || event;
    const boundingRect = this.target.getBoundingClientRect() || {
      left: 0,
      top: 0,
    };
    return {
      clientX: touchEvent.clientX,
      clientY: touchEvent.clientY,
      pageX: touchEvent.pageX,
      pageY: touchEvent.pageY,
      screenX: touchEvent.screenX,
      screenY: touchEvent.screenY,
      localX: touchEvent.clientX - boundingRect.left,
      localY: touchEvent.clientY - boundingRect.top,
      ctrlKey: event.ctrlKey,
      altKey: event.altKey,
      shiftKey: event.shiftKey,
      metaKey: event.metaKey,
      isTouch: !event.type.startsWith('mouse') && event.type !== 'contextmenu' && event.type !== 'click',
      stylus: touchEvent.touchType === 'stylus',
      srcType: event.type,
      target: touchEvent.target,
      view: event.view,
      preventDefault: () => {
        if (event.type !== 'touchstart') {
          preventDefault(event);
        }
      },
    };
  }
}
