class CompositeRenderer {
  constructor() {
    this._renderers = [];
    this._globalAlpha = 1;
  }

  setGlobalAlpha(alpha) {
    this._globalAlpha = alpha;
  }

  append(renderer) {
    this._renderers.push(renderer);
  }

  insert(renderer, index) {
    this._renderers.splice(index, 0, renderer);
  }

  clear() {
    this._renderers.length = 0;
  }

  isEmpty() {
    return this._renderers.length === 0;
  }

  draw(ctx, type) {
    for (let i = 0; i < this._renderers.length; i++) {
      ctx.save();
      ctx.globalAlpha = this._globalAlpha;
      this._renderers[i].draw(ctx, type);
      ctx.restore();
    }
  }

  drawBackground(ctx, type) {
    ctx.save();
    ctx.globalAlpha = this._globalAlpha;
    for (let i = 0; i < this._renderers.length; i++) {
      const renderer = this._renderers[i];
      if (renderer.drawBackground) {
        renderer.drawBackground(ctx, type);
      }
    }
    ctx.restore();
  }

  hitTest(x, y) {
    let result = null;
    for (let i = this._renderers.length - 1; i >= 0; i--) {
      const hitResult = this._renderers[i].hitTest(x, y);
      if (
        hitResult !== null &&
        (result === null || hitResult.target() > result.target())
      ) {
        result = hitResult;
      }
    }
    return result;
  }

  doesIntersectWithBox(box) {
    return this._renderers.some(
      (renderer) =>
        renderer.doesIntersectWithBox && renderer.doesIntersectWithBox(box)
    );
  }
}

export { CompositeRenderer };
