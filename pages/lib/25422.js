"use strict";

// Importing the Point class from the required module
const { Point } = require('./path-to-point-module');

// Function to create a rotation matrix
function rotationMatrix(angle) {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    return [
        [cosAngle, -sinAngle, 0],
        [sinAngle, cosAngle, 0],
        [0, 0, 1]
    ];
}

// Function to create a scaling matrix
function scalingMatrix(scaleX, scaleY) {
    return [
        [scaleX, 0, 0],
        [0, scaleY, 0],
        [0, 0, 1]
    ];
}

// Function to create a translation matrix
function translationMatrix(translateX, translateY) {
    return [
        [1, 0, translateX],
        [0, 1, translateY],
        [0, 0, 1]
    ];
}

// Function to transform a point using a transformation matrix
function transformPoint(matrix, point) {
    const { x, y } = point;
    const vector = [x, y, 1];
    const transformedVector = [0, 0, 0];

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            transformedVector[i] += vector[j] * matrix[i][j];
        }
    }

    return new Point(transformedVector[0], transformedVector[1]);
}

// Exporting the refactored functions
module.exports = {
    rotationMatrix,
    scalingMatrix,
    translationMatrix,
    transformPoint
};
