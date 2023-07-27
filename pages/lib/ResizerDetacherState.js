

import { assert } from '50151';
import { Observer } from '58275';

class ResizerDetacherState {
  constructor(owner) {
    this._alive = new Observer();
    this._container = new Observer();
    this._width = new Observer();
    this._height = new Observer();
    this._fullscreen = new Observer();
    this._detachable = new Observer();
    this._fullscreenable = new Observer();
    this._visible = new Observer();
    this._availWidth = new Observer();
    this._availHeight = new Observer();
    this._owner = new Observer();
    this._ownersStack = [];
    this.owner = this._owner.readonly();

    this._bridge = {
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
        const owner = this._owner.value();
        if (owner && owner.remove) {
          owner.remove();
        }
      },
      negotiateWidth: width => {
        const owner = this._owner.value();
        if (owner && owner.negotiateWidth) {
          owner.negotiateWidth(width);
        }
      },
      negotiateHeight: height => {
        const owner = this._owner.value();
        if (owner && owner.negotiateHeight) {
          owner.negotiateHeight(height);
        }
      },
      requestFullscreen: () => {
        const owner = this._owner.value();
        if (owner && owner.requestFullscreen) {
          owner.requestFullscreen();
        }
      },
      exitFullscreen: () => {
        const owner = this._owner.value();
        if (owner && owner.exitFullscreen) {
          owner.exitFullscreen();
        }
      },
      detach: element => {
        const owner = this._owner.value();
        if (owner && owner.detach) {
          owner.detach(element);
        }
      },
      attach: () => {
        const owner = this._owner.value();
        if (owner && owner.attach) {
          owner.attach();
        }
      }
    };

    if (owner) {
      this.pushOwner(owner);
    }
  }

  bridge() {
    return this._bridge;
  }

  pushOwner(owner) {
    if (!owner.alive.value()) {
      return;
    }

    for (const existingOwner of this._ownersStack) {
      this._unsubscribeOwner(existingOwner);
    }

    const stackItem = { owner };
    this._ownersStack.push(stackItem);
    this._subscribeOwner(stackItem);
  }

  _subscribeOwner(stackItem) {
    const owner = stackItem.owner;

    if (!stackItem.deathWatcher) {
      this._alive.setValue(true);
      stackItem.deathWatcher = owner.alive.spawn();
      stackItem.deathWatcher.subscribe(isAlive => {
        if (!isAlive) {
          this._deadHandler(stackItem);
        }
      });
    }

    this._owner.setValue(owner);

    if (!stackItem.subscriptions) {
      const subscriptions = (stackItem.subscriptions = []);
      this._visible.setValue(false);

      const subscribeToObserver = (observer, target) => {
        if (observer) {
          const spawnedObserver = observer.spawn();
          subscriptions.push(spawnedObserver);
          spawnedObserver.subscribe(value => {
            target.setValue(value);
          }, { callWithLast: true });
        } else {
          target.deleteValue();
        }
      };

      subscribeToObserver(owner.container, this._container);
      subscribeToObserver(owner.width, this._width);
      subscribeToObserver(owner.height, this._height);
      subscribeToObserver(owner.fullscreen, this._fullscreen);
      subscribeToObserver(owner.detachable, this._detachable);
      subscribeToObserver(owner.fullscreenable, this._fullscreenable);
      subscribeToObserver(owner.availWidth, this._availWidth);
      subscribeToObserver(owner.availHeight, this._availHeight);
      subscribeToObserver(owner.visible, this._visible);
    }
  }

  _unsubscribeOwner(stackItem, removeDeathWatcher) {
    if (stackItem.subscriptions) {
      for (const subscription of stackItem.subscriptions) {
        subscription.unsubscribe();
      }
      stackItem.subscriptions = null;
    }

    if (removeDeathWatcher && stackItem.deathWatcher) {
      stackItem.deathWatcher.unsubscribe();
      stackItem.deathWatcher = null;
    }
  }

  _deadHandler(stackItem) {
    const index = this._ownersStack.indexOf(stackItem);
    assert(index !== -1, "sanitized owner should be in stack");

    for (let i = this._ownersStack.length - 1; i >= index; i--) {
      this._unsubscribeOwner(this._ownersStack[i], true);
    }

    this._ownersStack.length = index;

    if (index > 0) {
      this._subscribeOwner(this._ownersStack[index - 1]);
    } else {
      this._alive.setValue(false);
      this._owner.deleteValue();
    }
  }
}

export { ResizerDetacherState };