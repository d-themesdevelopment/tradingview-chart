import { LineDataSource } from 'path/to/lineDataSource';
import { LevelsProperty } from 'path/to/levelsProperty';
import { LineToolColorsProperty } from 'path/to/lineToolColorsProperty';

const horizontalLevels = [4.5, 9, 11.25, 18, 22.5, 36, 45];
const verticalLevels = (() => {
  const levels = [];
  const horizontalLevelsCount = horizontalLevels.length;
  let multiplier = 1;
  let levelIndex = 0;
  let i = 0;
  while (i < 1e10) {
    i = horizontalLevels[levelIndex] * multiplier;
    levels.push(Math.round(i));
    levels.push(Math.ceil(-i));
    if (levelIndex === horizontalLevelsCount - 1) {
      multiplier *= 10;
    }
    levelIndex = (levelIndex + 1) % horizontalLevelsCount;
  }
  return levels.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
})();

class LineToolGannSquare extends LineDataSource {
  constructor(chartApi, properties, source, priceScale) {
    super(chartApi, properties || LineToolGannSquare.createProperties(), source, priceScale);
    import(1583).then(({ GannSquarePaneView }) => {
      this.setPaneViews([new GannSquarePaneView(this, this._model)]);
    });
  }

  getHorizontalLevelsCount() {
    return LineToolGannSquare.HorizontalLevelsCount;
  }

  getVerticalLevelsCount() {
    return LineToolGannSquare.VerticalLevelsCount;
  }

  pointsCount() {
    return 2;
  }

  name() {
    return "Gann Box";
  }

  alignPriceOnPattern(point, referencePoint) {
    const priceDiff = Math.round(1e6 * (point.price - referencePoint.price)) / 1e6;
    if (priceDiff === 0) {
      return referencePoint.price;
    }
    const minLevel = horizontalLevels[0];
    const maxLevel = horizontalLevels[horizontalLevels.length - 1];
    let multiplier = 1;
    let increment = Math.abs(priceDiff);
    while (increment < minLevel * multiplier || maxLevel * multiplier < increment) {
      if (increment < minLevel * multiplier) {
        multiplier *= 0.1;
      } else if (maxLevel * multiplier < increment) {
        multiplier *= 10;
      }
    }
    let level = maxLevel * multiplier;
    let levelIndex = horizontalLevels.length - 2;
    while (levelIndex >= 0 && !(horizontalLevels[levelIndex] * multiplier < increment)) {
      level = horizontalLevels[levelIndex] * multiplier;
      levelIndex--;
    }
    point.price = referencePoint.price + (priceDiff >= 0 ? level : -level);
    return point;
  }

  alignTimeOnPattern(point, referencePoint) {
    const indexDiff = point.index - referencePoint.index;
    if (indexDiff === 0) {
      return 0;
    }
    let levelIndex = verticalLevels.length - 2;
    while (levelIndex >= 0 && !(verticalLevels[levelIndex] < indexDiff)) {
      levelIndex--;
    }
    levelIndex += indexDiff > 0 ? 1 : 0;
    point.index = referencePoint.index + verticalLevels[levelIndex];
    return point;
  }

  alignPointsFixedIncrement(point, referencePoint) {
    this.alignTimeOnPattern(point, referencePoint);
    this.alignPriceOnPattern(point, referencePoint);
    return point;
  }

  preparePoint(point, shift) {
    if (shift && shift.shift() && this._points.length !== 0) {
      this.alignPointsFixedIncrement(point, this._points[0]);
    }
    return super.preparePoint(point, shift);
  }

  getPoint(index) {
    if (index < 2) {
      return super.getPoint(index);
    }
    let point = null;
    switch (index) {
      case 2:
      case 3: {
        const currentPoints = this.points();
        if (currentPoints.length === this.pointsCount()) {
          const referencePoint = currentPoints[0];
          const price = currentPoints[1].price;
          if (index === 2) {
            point = { index: referencePoint.index, price: price };
          } else {
            point = { index: currentPoints[1].index, price: referencePoint.price };
          }
        }
        break;
      }
    }
    return point;
  }

  setPoint(index, point, shift) {
    if (shift && shift.shift()) {
      const referencePoint = index % 2 === 0 ? this._points[1] : this._points[0];
      this.alignPointsFixedIncrement(point, referencePoint);
    }
    switch (index) {
      case 2:
        this._points[0].index = point.index;
        this._points[1].price = point.price;
        break;
      case 3:
        this._points[1].index = point.index;
        this._points[0].price = point.price;
        break;
      default:
        super.setPoint(index, point, shift);
    }
  }

  async getPropertyDefinitionsViewModelClass() {
    const [
      PropertyDefinitionsViewModelBase,
      DrawingStyleProperty,
      FillBackgroundProperty,
      TransparencyProperty,
      LineStyleProperty,
    ] = await Promise.all([
      import(7201),
      import(3753),
      import(5871),
      import(8167),
      import(8537),
    ]);
    return GannSquareDefinitionsViewModel;
  }

  static createProperties(defaults) {
    const properties = new LevelsProperty("linetoolgannsquare", defaults, false, {
      range: [1, 7],
      prefixes: ["h", "v"],
      names: ["coeff", "color", "visible"],
    });
    this.configureProperties(properties);
    return properties;
  }

  static configureProperties(properties) {
    super.configureProperties(properties);
    const colors = [
      properties.child("color"),
      properties.child("fans").child("color"),
    ];
    for (let i = 1; i <= this.HorizontalLevelsCount; i++) {
      colors.push(properties.child(`hlevel${i}`).child("color"));
    }
    for (let i = 1; i <= this.VerticalLevelsCount; i++) {
      colors.push(properties.child(`vlevel${i}`).child("color"));
    }
    properties.addChild("linesColors", new LineToolColorsProperty(colors));
    properties.addExclusion("linesColors");
  }
}

LineToolGannSquare.HorizontalLevelsCount = 7;
LineToolGannSquare.VerticalLevelsCount = 7;

export { LineToolGannSquare };
