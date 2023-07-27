const supportedLineTools = {
    cursor: {
        name: "cursor",
        onlySelectable: true
    },
    dot: {
        name: "dot",
        onlySelectable: true
    },
    arrow_cursor: {
        name: "arrow",
        onlySelectable: true
    },
    eraser: {
        name: "eraser",
        onlySelectable: true
    },
    measure: {
        name: "measure",
        onlySelectable: true
    },
    zoom: {
        name: "zoom",
        onlySelectable: true
    },
    brush: {
        name: "LineToolBrush"
    },
    highlighter: {
        name: "LineToolHighlighter"
    },
    text: {
        name: "LineToolText"
    },
    anchored_text: {
        name: "LineToolTextAbsolute",
        isAnchored: true
    },
    note: {
        name: "LineToolNote"
    },
    anchored_note: {
        name: "LineToolNoteAbsolute",
        isAnchored: true
    },
    signpost: {
        name: "LineToolSignpost"
    },
    callout: {
        name: "LineToolCallout"
    },
    balloon: {
        name: "LineToolBalloon"
    },
    comment: {
        name: "LineToolComment"
    },
    arrow_up: {
        name: "LineToolArrowMarkUp"
    },
    arrow_down: {
        name: "LineToolArrowMarkDown"
    },
    arrow_left: {
        name: "LineToolArrowMarkLeft"
    },
    arrow_right: {
        name: "LineToolArrowMarkRight"
    },
    price_label: {
        name: "LineToolPriceLabel"
    },
    price_note: {
        name: "LineToolPriceNote"
    },
    arrow_marker: {
        name: "LineToolArrowMarker"
    },
    flag: {
        name: "LineToolFlagMark"
    },
    vertical_line: {
        name: "LineToolVertLine"
    },
    horizontal_line: {
        name: "LineToolHorzLine"
    },
    cross_line: {
        name: "LineToolCrossLine"
    },
    horizontal_ray: {
        name: "LineToolHorzRay"
    },
    trend_line: {
        name: "LineToolTrendLine"
    },
    info_line: {
        name: "LineToolInfoLine"
    },
    trend_angle: {
        name: "LineToolTrendAngle"
    },
    arrow: {
        name: "LineToolArrow"
    },
    ray: {
        name: "LineToolRay"
    },
    extended: {
        name: "LineToolExtended"
    },
    parallel_channel: {
        name: "LineToolParallelChannel"
    },
    disjoint_angle: {
        name: "LineToolDisjointAngle"
    },
    flat_bottom: {
        name: "LineToolFlatBottom"
    },
    anchored_vwap: {
        name: "LineToolAnchoredVWAP"
    },
    pitchfork: {
        name: "LineToolPitchfork"
    },
    schiff_pitchfork_modified: {
        name: "LineToolSchiffPitchfork"
    },
    schiff_pitchfork: {
        name: "LineToolSchiffPitchfork2"
    },
    inside_pitchfork: {
        name: "LineToolInsidePitchfork"
    },
    pitchfan: {
        name: "LineToolPitchfan"
    },
    gannbox: {
        name: "LineToolGannSquare"
    },
    gannbox_square: {
        name: "LineToolGannComplex"
    },
    gannbox_fixed: {
        name: "LineToolGannFixed"
    },
    gannbox_fan: {
        name: "LineToolGannFan"
    },
    fib_retracement: {
        name: "LineToolFibRetracement"
    },
    fib_trend_ext: {
        name: "LineToolTrendBasedFibExtension"
    },
    fib_speed_resist_fan: {
        name: "LineToolFibSpeedResistanceFan"
    },
    fib_timezone: {
        name: "LineToolFibTimeZone"
    },
    fib_trend_time: {
        name: "LineToolTrendBasedFibTime"
    },
    fib_circles: {
        name: "LineToolFibCircles"
    },
    fib_spiral: {
        name: "LineToolFibSpiral"
    },
    fib_speed_resist_arcs: {
        name: "LineToolFibSpeedResistanceArcs"
    },
    fib_wedge: {
        name: "LineToolFibWedge"
    },
    fib_channel: {
        name: "LineToolFibChannel"
    },
    xabcd_pattern: {
        name: "LineTool5PointsPattern"
    },
    cypher_pattern: {
        name: "LineToolCypherPattern"
    },
    abcd_pattern: {
        name: "LineToolABCD"
    },
    triangle_pattern: {
        name: "LineToolTrianglePattern"
    },
    "3divers_pattern": {
        name: "LineToolThreeDrivers"
    },
    head_and_shoulders: {
        name: "LineToolHeadAndShoulders"
    },
    elliott_impulse_wave: {
        name: "LineToolElliottImpulse"
    },
    elliott_triangle_wave: {
        name: "LineToolElliottTriangle"
    },
    elliott_triple_combo: {
        name: "LineToolElliottTripleCombo"
    },
    elliott_correction: {
        name: "LineToolElliottCorrection"
    },
    elliott_double_combo: {
        name: "LineToolElliottDoubleCombo"
    },
    cyclic_lines: {
        name: "LineToolCircleLines"
    },
    time_cycles: {
        name: "LineToolTimeCycles"
    },
    sine_line: {
        name: "LineToolSineLine"
    },
    long_position: {
        name: "LineToolRiskRewardLong"
    },
    short_position: {
        name: "LineToolRiskRewardShort"
    },
    forecast: {
        name: "LineToolPrediction"
    },
    date_range: {
        name: "LineToolDateRange"
    },
    price_range: {
        name: "LineToolPriceRange"
    },
    date_and_price_range: {
        name: "LineToolDateAndPriceRange"
    },
    bars_pattern: {
        name: "LineToolBarsPattern"
    },
    ghost_feed: {
        name: "LineToolGhostFeed"
    },
    projection: {
        name: "LineToolProjection"
    },
    rectangle: {
        name: "LineToolRectangle"
    },
    rotated_rectangle: {
        name: "LineToolRotatedRectangle"
    },
    circle: {
        name: "LineToolCircle"
    },
    ellipse: {
        name: "LineToolEllipse"
    },
    triangle: {
        name: "LineToolTriangle"
    },
    polyline: {
        name: "LineToolPolyline"
    },
    path: {
        name: "LineToolPath"
    },
    curve: {
        name: "LineToolBezierQuadro"
    },
    double_curve: {
        name: "LineToolBezierCubic"
    },
    arc: {
        name: "LineToolArc"
    },
    icon: {
        name: "LineToolIcon"
    },
    emoji: {
        name: "LineToolEmoji"
    },
    sticker: {
        name: "LineToolSticker"
    },
    regression_trend: {
        name: "LineToolRegressionTrend"
    },
    fixed_range_volume_profile: {
        name: "LineToolFixedRangeVolumeProfile"
    }
}