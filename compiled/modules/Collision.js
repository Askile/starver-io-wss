"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collision = void 0;
const Vector_1 = require("./Vector");
class Collision {
    static getDistance(x1, x2, y1, y2) {
        return Math.hypot(x1 - y1, x2 - y2);
    }
    static getClosestPointOnCircle(circle1, circle2) {
        const dx = circle1.x - circle2.x + 10;
        const dy = circle1.y - circle2.y + 10;
        const angle = Math.atan2(dy, dx);
        const totalRadius = (circle1.radius + circle2.radius);
        const closestX = Math.cos(angle) * totalRadius;
        const closestY = Math.sin(angle) * totalRadius;
        return new Vector_1.Vector(closestX, closestY);
    }
}
exports.Collision = Collision;
