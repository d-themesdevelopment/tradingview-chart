
const DEFAULT_ANIMATION_OPTIONS = {
    from: 0,
    duration: 250,
    easing: easingFunc.easeOutCubic
  };
  
  class Animation {
    constructor(options) {
      this._doing = true;
      this._completed = false;
      this._options = {
        ...DEFAULT_ANIMATION_OPTIONS,
        ...options
      };
  
      const startTime = performance.now();
      window.requestAnimationFrame((currentTime) => {
        this._animate(startTime, this._options.from, currentTime);
      });
    }
  
    stop() {
      this._doing = false;
    }
  
    completed() {
      return this._completed;
    }
  
    _animate(startTime, currentValue, currentTime) {
      if (!this._doing) {
        return this._finishAnimation();
      }
  
      const elapsedTime = (currentTime = !currentTime || currentTime < 1e12 ? performance.now() : currentTime) - startTime;
      const animationFinished = elapsedTime >= this._options.duration || currentValue === this._options.to;
      const interpolatedValue = this._interpolate(
        this._options.from,
        this._options.to,
        this._options.easing(elapsedTime / this._options.duration)
      );
  
      const newValue = animationFinished ? this._options.to : interpolatedValue;
      const delta = newValue - currentValue;
  
      this._options.onStep(delta, newValue);
  
      if (animationFinished) {
        this._finishAnimation();
      } else {
        window.requestAnimationFrame((nextTime) => {
          this._animate(startTime, newValue, nextTime);
        });
      }
    }
  
    _finishAnimation() {
      if (this._options.onComplete) {
        this._options.onComplete();
      }
      this._completed = true;
    }
  
    _interpolate(start, end, ratio) {
      return start * (1 - ratio) + end * ratio;
    }
  }
  
  function doAnimate(options) {
    return new Animation(options);
  }