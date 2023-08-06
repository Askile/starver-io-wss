"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionSystem = void 0;
const Vector_1 = require("../../modules/Vector");
const Player_1 = require("../../entities/Player");
const Wolf_1 = require("../../entities/Wolf");
class CollisionSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    getClosestPointOnCircle(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.hypot(dx, dy);
        const unitX = dx / distance;
        const unitY = dy / distance;
        const totalRadius = circle1.radius + circle2.radius;
        const closestX = circle2.x + (totalRadius) * unitX;
        const closestY = circle2.y + (totalRadius) * unitY;
        return new Vector_1.Vector(closestX, closestY);
    }
    tick() {
        for (const entity of this.server.entities) {
            if (!(entity instanceof Player_1.Player) && !(entity instanceof Wolf_1.Wolf))
                continue;
            const tiles = this.server.map.getTiles(entity.position.x, entity.position.y, 3);
            const entities = this.server.map.getEntities(entity.position.x, entity.position.y, 2);
            for (const tile of tiles) {
                if (!tile.collide)
                    continue;
                const distance = Math.hypot(tile.realPosition.x - entity.position.x, tile.realPosition.y - entity.position.y);
                const totalRadius = tile.radius + entity.radius;
                if (distance < totalRadius) {
                    const newCoordinates = this.getClosestPointOnCircle({
                        x: entity.position.x,
                        y: entity.position.y,
                        radius: entity.radius
                    }, {
                        x: tile.realPosition.x,
                        y: tile.realPosition.y,
                        radius: tile.radius
                    });
                    entity.position.x = newCoordinates.x;
                    entity.position.y = newCoordinates.y;
                }
            }
            for (const entity1 of entities) {
                if (!entity1.radius)
                    continue;
                if (!entity1.collide)
                    continue;
                const distance = Math.hypot(entity1.position.x - entity.position.x, entity1.position.y - entity.position.y);
                const totalRadius = entity1.radius + entity.radius;
                if (distance < totalRadius) {
                    const newCoordinates = this.getClosestPointOnCircle({
                        x: entity.position.x,
                        y: entity.position.y,
                        radius: entity.radius
                    }, {
                        x: entity1.position.x,
                        y: entity1.position.y,
                        radius: entity1.radius
                    });
                    entity.position.x = newCoordinates.x;
                    entity.position.y = newCoordinates.y;
                }
            }
        }
    }
}
exports.CollisionSystem = CollisionSystem;
