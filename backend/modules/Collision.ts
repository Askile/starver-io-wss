import ServerConfig from "../ServerConfig.json";
import {Vector} from "./Vector";
export class Collision {
    static getDistance(x1: number, x2: number, y1: number, y2: number) {
        return Math.hypot(x1 - y1, x2 - y2);
    }

    static getClosestPointOnCircle(circle1: any, circle2: any) {
        const dx = circle1.x - circle2.x + 10;
        const dy = circle1.y - circle2.y + 10;
        const angle = Math.atan2(dy, dx);
        const totalRadius = (circle1.radius + circle2.radius);
        const closestX = Math.cos(angle) * totalRadius;
        const closestY = Math.sin(angle) * totalRadius;
        return new Vector(closestX, closestY);
    }
}
