import { assert } from "./assertions.js";
import { WatchedValue } from "./58275.js";

export class ResizerDetacherState {
  constructor(e) {
    (this._alive = new WatchedValue()),
      (this._container = new WatchedValue()),
      (this._width = new WatchedValue()),
      (this._height = new WatchedValue()),
      (this._fullscreen = new WatchedValue()),
      (this._detachable = new WatchedValue()),
      (this._fullscreenable = new WatchedValue()),
      (this._visible = new WatchedValue()),
      (this._availWidth = new WatchedValue()),
      (this._availHeight = new WatchedValue()),
      (this._owner = new WatchedValue()),
      (this._ownersStack = []),
      (this.owner = this._owner.readonly()),
      (this._bridge = {
        alive: this._alive.readonly(),
        container: this._container.readonly(),
        width: this._width.readonly(),
        height: this._height.readonly(),
        fullscreen: this._fullscreen.readonly(),
        detachable: this._detachable.readonly(),
        fullscreenable: this._fullscreenable.readonly(),
        visible: this._visible.readonly(),
        availWidth: this._availWidth.readonly(),
        availHeight: this._availHeight.readonly(),

        remove: () => {
          const e = this._owner.value();
          e && e.remove && e.remove();
        },

        negotiateWidth: (e) => {
          const t = this._owner.value();
          t && t.negotiateWidth && t.negotiateWidth(e);
        },

        negotiateHeight: (e) => {
          const t = this._owner.value();
          t && t.negotiateHeight && t.negotiateHeight(e);
        },

        requestFullscreen: () => {
          const e = this._owner.value();
          e && e.requestFullscreen && e.requestFullscreen();
        },

        exitFullscreen: () => {
          const e = this._owner.value();
          e && e.exitFullscreen && e.exitFullscreen();
        },

        detach: (e) => {
          const t = this._owner.value();
          t && t.detach && t.detach(e);
        },

        attach: () => {
          const e = this._owner.value();
          e && e.attach && e.attach();
        },
      }),
      e && this.pushOwner(e);
  }

  bridge() {
    return this._bridge;
  }

  pushOwner(e) {
    if (!e.alive.value()) return;
    for (const e of this._ownersStack) this._unsubscribeOwner(e);
    const t = {
      owner: e,
    };

    this._ownersStack.push(t), this._subscribeOwner(t);
  }

  _subscribeOwner(e) {
    const t = e.owner;
    if (
      (e.deathWatcher ||
        (this._alive.setValue(!0),
        (e.deathWatcher = t.alive.spawn()),
        e.deathWatcher.subscribe((t) => {
          t || this._deadHandler(e);
        })),
      this._owner.setValue(t),
      !e.subscriptions)
    ) {
      const i = (e.subscriptions = []);
      this._visible.setValue(!1);
      const s = (e, t) => {
        if (e) {
          const s = e.spawn();
          i.push(s),
            s.subscribe(
              (e) => {
                t.setValue(e);
              },
              {
                callWithLast: !0,
              }
            );
        } else t.deleteValue();
      };

      s(t.container, this._container),
        s(t.width, this._width),
        s(t.height, this._height),
        s(t.fullscreen, this._fullscreen),
        s(t.detachable, this._detachable),
        s(t.fullscreenable, this._fullscreenable),
        s(t.availWidth, this._availWidth),
        s(t.availHeight, this._availHeight),
        s(t.visible, this._visible);
    }
  }

  _unsubscribeOwner(e, t) {
    if (e.subscriptions) {
      for (const t of e.subscriptions) t.unsubscribe();
      e.subscriptions = null;
    }
    t &&
      e.deathWatcher &&
      (e.deathWatcher.unsubscribe(), (e.deathWatcher = null));
  }

  _deadHandler(e) {
    const t = this._ownersStack.indexOf(e);
    assert(-1 !== t, "sanitized owner should be in stack");
    for (let e = this._ownersStack.length - 1; e >= t; e--)
      this._unsubscribeOwner(this._ownersStack[e], !0);
    (this._ownersStack.length = t),
      t > 0
        ? this._subscribeOwner(this._ownersStack[t - 1])
        : (this._alive.setValue(!1), this._owner.deleteValue());
  }
}
