(e, t, i) => {
    "use strict";
    i.d(t, {
      LineToolGannFixed: () => GannSquareFixedLineTool
    });
    var s = i(86441),
      r = i(50151),
      n = i(13087),
      o = i(68806),
      a = i(52788);
  
    class GannSquareFixedLineTool extends n.LineDataSource {
      constructor(e, t, s, r) {
        super(e, t || GannSquareFixedLineTool.createProperties(), s, r);
        this._constructor = "LineToolGannFixed";
        i.e(1583)
          .then(i.bind(i, 57583))
          .then(({ GannFixedPaneView: e }) => {
            this._setPaneViews([new e(this, this.model())]);
          });
  
        this.properties().childs().reverse.subscribe(this, this._reversePoints);
      }
  
      static createProperties(e) {
        const t = a.createPropertiesObject("linetoolgannfixed", e);
        return this._configureProperties(t), t;
      }
  
      static _configureProperties(e) {
        super._configureProperties(e);
  
        const lineColors = [];
        const lineWidths = [];
        const childProperties = e.childs();
  
        const levelsCount = childProperties.levels.childCount();
        for (let r = 0; r < levelsCount; r++) {
          const levelProperties = childProperties.levels.childs()[r].childs();
          lineWidths.push(levelProperties.width);
          lineColors.push(levelProperties.color);
        }
  
        const fanLinesCount = childProperties.fanlines.childCount();
        for (let r = 0; r < fanLinesCount; r++) {
          const fanLineProperties = childProperties.fanlines.childs()[r].childs();
          lineWidths.push(fanLineProperties.width);
          lineColors.push(fanLineProperties.color);
        }
  
        const arcsCount = childProperties.arcs.childCount();
        for (let r = 0; r < arcsCount; r++) {
          const arcProperties = childProperties.arcs.childs()[r].childs();
          lineWidths.push(arcProperties.width);
          lineColors.push(arcProperties.color);
        }
  
        e.addChild("linesColors", new o.LineToolColorsProperty(lineColors));
        e.addChild("linesWidths", new o.LineToolWidthsProperty(lineWidths));
      }
  
      pointsCount() {
        return 2;
      }
  
      name() {
        return "Gann Square Fixed";
      }
  
      axisPoints() {
        const points = this.points();
        const screenPoints = this.getScreenPoints();
  
        if (points.length < 2 || screenPoints.length < 2) {
          return [];
        }
  
        return [points[0], r.ensureNotNull(this.screenPointToPoint(screenPoints[1]))];
      }
  
      getScreenPoints() {
        const points = this.points();
  
        if (points.length < 2) {
          return [];
        }
  
        const angle = this._calcAngle();
  
        if (angle === null) {
          return [];
        }
  
        const [startPoint, endPoint] = points;
        const startScreenPoint = r.ensureNotNull(this.pointToScreenPoint(startPoint));
        const endScreenPoint = r.ensureNotNull(this.pointToScreenPoint(endPoint));
        const length = Math.sqrt(Math.pow(startScreenPoint.x - endScreenPoint.x, 2) + Math.pow(startScreenPoint.y - endScreenPoint.y, 2));
        const directionVector = new s.Point(Math.cos(angle), -Math.sin(angle));
        const normalizedVector = directionVector.normalized();
        const xDirection = normalizedVector.x < 0 ? -1 : 1;
        const yDirection = normalizedVector.y < 0 ? -1 : 1;
        const screenPoints = [startScreenPoint.addScaled(directionVector, length), startScreenPoint.add(new s.Point(5 * length * xDirection, 5 * length * yDirection))];
        return screenPoints;
      }
  
      levelsCount() {
        return this.properties().childs().levels.childCount();
      }
  
      levels() {
        const levels = [];
        const childProperties = this.properties().childs();
        const levelsCount = childProperties.levels.childCount();
  
        for (let i = 0; i < levelsCount; i++) {
          const levelChildProperties = childProperties.levels.childs()[i].childs();
          levels.push({
            index: i,
            visible: levelChildProperties.visible.value(),
            color: levelChildProperties.color.value(),
            width: levelChildProperties.width.value()
          });
        }
  
        return levels;
      }
  
      fanLinesCount() {
        return this.properties().childs().fanlines.childCount();
      }
  
      fanLines() {
        const fanLines = [];
        const childProperties = this.properties().childs();
        const fanLinesCount = childProperties.fanlines.childCount();
  
        for (let i = 0; i < fanLinesCount; i++) {
          const fanLineChildProperties = childProperties.fanlines.childs()[i].childs();
          fanLines.push({
            index: i,
            visible: fanLineChildProperties.visible.value(),
            x: fanLineChildProperties.x.value(),
            y: fanLineChildProperties.y.value(),
            color: fanLineChildProperties.color.value(),
            width: fanLineChildProperties.width.value()
          });
        }
  
        return fanLines;
      }
  
      arcsCount() {
        return this.properties().childs().arcs.childCount();
      }
  
      arcs() {
        const arcs = [];
        const childProperties = this.properties().childs();
        const arcsCount = childProperties.arcs.childCount();
  
        for (let i = 0; i < arcsCount; i++) {
          const arcChildProperties = childProperties.arcs.childs()[i].childs();
          arcs.push({
            index: i,
            visible: arcChildProperties.visible.value(),
            x: arcChildProperties.x.value(),
            y: arcChildProperties.y.value(),
            color: arcChildProperties.color.value(),
            width: arcChildProperties.width.value()
          });
        }
  
        return arcs;
      }
  
      arcsBackgroundTransparency() {
        return this.properties().childs().arcsBackground.childs().transparency.value();
      }
  
      isArcsBackgroundFilled() {
        return this.properties().childs().arcsBackground.childs().fillBackground.value();
      }
  
      _getPropertyDefinitionsViewModelClass() {
        return Promise.all([i.e(7201), i.e(3753), i.e(5871), i.e(8167), i.e(8537)])
          .then(i.bind(i, 85951))
          .then((e) => e.GannComplexAndFixedDefinitionsViewModel);
      }
  
      _calcAngle() {
        const points = this.points();
  
        if (points.length < 2) {
          return null;
        }
  
        const [startPoint, endPoint] = points;
        const startScreenPoint = this.pointToScreenPoint(startPoint);
        const endScreenPoint = this.pointToScreenPoint(endPoint);
  
        if (startScreenPoint === null || endScreenPoint === null) {
          return null;
        }
  
        let directionVector = endScreenPoint.subtract(startScreenPoint);
  
        if (directionVector.length() <= 0) {
          return null;
        }
  
        directionVector = directionVector.normalized();
        let angle = Math.acos
  
  (directionVector.x);
  
        if (directionVector.y > 0) {
          angle = -angle;
        }
  
        return angle;
      }
  
      _reversePoints() {
        const [point1, point2] = this._points;
        this._points[0] = point2;
        this._points[1] = point1;
        this.normalizePoints();
        this.restart();
      }
    }
  }