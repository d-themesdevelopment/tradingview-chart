import { coordinateIsValid, ensureDefined } from 'utility-module1';
import { setLineStyle } from 'utility-module2';
import { PaneRendererLine } from 'pane-renderer-module';

class PaneRendererArea extends PaneRendererLine {
  constructor(data) {
    data.forceLineColor = false;
    super(data);
  }

  _drawImpl(renderer) {
    const data = this._data;
    if (data.items.length === 0) return;

    let startItemIndex = ensureDefined(data.visibleItemsRange?.startItemIndex, 0);
    let endItemIndex = ensureDefined(data.visibleItemsRange?.endItemIndex, data.items.length - 1);

    while (startItemIndex < endItemIndex && !coordinateIsValid(data.items[startItemIndex].y)) {
      startItemIndex++;
    }

    while (endItemIndex >= 0 && !coordinateIsValid(data.items[endItemIndex].y)) {
      endItemIndex--;
    }

    if (startItemIndex > endItemIndex) return;

    const { context, horizontalPixelRatio, verticalPixelRatio } = renderer;
    context.save();
    context.scale(horizontalPixelRatio, verticalPixelRatio);
    context.lineCap = "round";
    context.strokeStyle = data.lineColor;
    context.lineWidth = data.lineWidth;
    setLineStyle(context, data.lineStyle);
    context.lineWidth = 1;

    const colorGroups = {};
    const items = data.items;

    for (let i = startItemIndex; i <= endItemIndex; i++) {
      const item = items[i];
      let color;
      if (item.style) {
        color = item.style.color;
      } else {
        color = data.lineColor;
      }

      if (i < endItemIndex && items[i + 1].style) {
        const nextColor = ensureDefined(items[i + 1].style).color;
        if (color !== nextColor) {
          const group = colorGroups[nextColor] || [];
          group.push(item);
          colorGroups[nextColor] = group;
        }
      }

      const group = colorGroups[color] || [];
      group.push(item);
      colorGroups[color] = group;
    }

    for (const color of Object.keys(colorGroups)) {
      const groupItems = colorGroups[color];
      context.beginPath();
      let startIndex = 0;

      for (let j = 0; j < groupItems.length; j++) {
        if (groupItems[j].style && groupItems[j].style.color !== color) {
          context.moveTo(Math.round(groupItems[startIndex].x), data.bottom);
          this._walkLine(context, groupItems.slice(startIndex, j), true, data.bottom, true);
          startIndex = j;
        }
      }

      context.moveTo(Math.round(groupItems[startIndex].x), data.bottom);
      this._walkLine(context, groupItems.slice(startIndex, groupItems.length), true, data.bottom, true);
      context.closePath();

      if (data.isSeries) {
        const gradient = context.createLinearGradient(0, 0, 0, data.bottom);
        gradient.addColorStop(0, data.color1);
        gradient.addColorStop(1, data.color2);
        context.fillStyle = gradient;
        data.simpleMode = true;
      } else {
        context.fillStyle = color;
      }

      context.fill();
    }

    context.lineWidth = data.lineWidth;
    context.restore();
    super._drawImpl(renderer);
  }
}

export { PaneRendererArea };
