function tryCallHandler(e, handler, fallbackHandler) {
  if (e.isTouch) {
    if (fallbackHandler !== undefined) {
      fallbackHandler(e);
      return true;
    }
  } else {
    if (handler !== undefined) {
      handler(e);
      return true;
    }
  }
  return false;
}

function shouldDefaultActionBeExecuted(e, target, moveAction, changeAction) {
  return (
    target.executeDefaultAction !== undefined &&
    (e.isTouch
      ? Boolean(target.executeDefaultAction[changeAction])
      : Boolean(target.executeDefaultAction[moveAction]))
  );
}

export class HitTestResult {
  constructor(target, data, eraseMarker) {
    this._target = target;
    this._data = data || null;
    this._eraseMarker = eraseMarker;
  }

  target() {
    return this._target;
  }

  data() {
    return this._data;
  }

  hasPressedMoveHandler(e) {
    return (
      this._data !== null &&
      tryCallHandler(
        e,
        this._data.pressedMouseMoveHandler,
        this._data.touchMoveHandler
      )
    );
  }

  tryCallMouseDownOrTouchStartHandler(e) {
    return (
      this._data !== null &&
      tryCallHandler(
        e,
        this._data.mouseDownHandler,
        this._data.touchStartHandler
      )
    );
  }

  tryCallMouseUpOrTouchEndHandler(e) {
    return (
      this._data !== null &&
      tryCallHandler(e, this._data.mouseUpHandler, this._data.touchEndHandler)
    );
  }

  tryCallMouseEnterHandler(e) {
    return (
      this._data !== null && tryCallHandler(e, this._data.mouseEnterHandler)
    );
  }

  tryCallMouseLeaveHandler(e) {
    return (
      this._data !== null && tryCallHandler(e, this._data.mouseLeaveHandler)
    );
  }

  tryCallMouseMoveHandler(e) {
    return (
      this._data !== null && tryCallHandler(e, this._data.mouseMoveHandler)
    );
  }

  tryCallClickOrTapHandler(e) {
    return (
      this._data !== null &&
      tryCallHandler(e, this._data.clickHandler, this._data.tapHandler)
    );
  }

  tryCallDblClickOrDblTapHandler(e) {
    return (
      this._data !== null &&
      tryCallHandler(
        e,
        this._data.doubleClickHandler,
        this._data.doubleTapHandler
      )
    );
  }

  tryCallContextMenuHandler(e) {
    return (
      this._data !== null &&
      tryCallHandler(
        e,
        this._data.contextMenuHandler,
        this._data.touchContextMenuHandler
      )
    );
  }

  eraseMarker() {
    return this._eraseMarker;
  }
}

export const AreaName = {
  Style: "Style",
  Text: "Text",
  SourceItemMove: "SourceItemMove",
};

export const HitTarget = {
  MovePointBackground: 1,
  Regular: 2,
  MovePoint: 3,
  ChangePoint: 4,
  Custom: 5,
};
