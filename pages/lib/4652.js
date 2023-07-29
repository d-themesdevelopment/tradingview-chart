"use strict";

// Calculate the distance and coefficient for a point projected on a line
function distanceToLine(point, lineStart, lineEnd) {
    const lineVector = lineEnd.subtract(lineStart);
    const pointVector = point.subtract(lineStart);
    const coefficient = pointVector.dotProduct(lineVector) / lineVector.dotProduct(lineVector);
    const projectedPoint = lineStart.addScaled(lineVector, coefficient);
    const distance = point.subtract(projectedPoint).length();
    
    return {
        coeff: coefficient,
        distance: distance
    };
}

// Calculate the distance and coefficient for a point projected on a line segment
function distanceToSegment(point, segmentStart, segmentEnd) {
    const projection = distanceToLine(point, segmentStart, segmentEnd);
    const coefficient = projection.coeff;

    if (coefficient >= 0 && coefficient <= 1) {
        return projection;
    } else {
        const distanceToStart = point.subtract(segmentStart).length();
        const distanceToEnd = point.subtract(segmentEnd).length();

        if (distanceToStart < distanceToEnd) {
            return {
                coeff: 0,
                distance: distanceToStart
            };
        } else {
            return {
                coeff: 1,
                distance: distanceToEnd
            };
        }
    }
}

// Exporting the refactored functions
export { distanceToLine, distanceToSegment };
