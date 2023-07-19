"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distance(v) {
        return Math.hypot(this.x - v.x, this.y - v.y);
    }
    isVectorInsideRectangle(v, rectangleWidth, rectangleHeight) {
        const minX = this.x;
        const maxX = this.x + rectangleWidth;
        const minY = this.y;
        const maxY = this.y + rectangleHeight;
        return (v.x >= minX &&
            v.x <= maxX &&
            v.y >= minY &&
            v.y <= maxY);
    }
    add(v) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    divide(divisor) {
        return new Vector(this.x / divisor, this.y / divisor);
    }
    multiply(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }
}
exports.Vector = Vector;
