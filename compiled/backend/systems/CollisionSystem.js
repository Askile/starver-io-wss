"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionSystem = void 0;
const Vector_1 = require("../modules/Vector");
const Player_1 = require("../entities/Player");
class CollisionSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    getClosestPointOnCircle(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        // const angle = Math.atan2(dy, dx);
        const distance = Math.hypot(dx, dy);
        const unitX = dx / distance;
        const unitY = dy / distance;
        const totalRadius = circle1.radius + circle2.radius;
        const closestX = circle2.x + (totalRadius) * unitX;
        const closestY = circle2.y + (totalRadius) * unitY;
        // const closestX = Math.cos(angle) * totalRadius;
        // const closestY = Math.sin(angle) * totalRadius;
        return new Vector_1.Vector(closestX, closestY);
    }
    tick() {
        for (const player of this.server.players) {
            const { x, y } = player.position;
            const chunks = this.server.map.getChunks(x, y, 2);
            for (const chunk of chunks) {
                for (const entity of chunk.entities) {
                    if (!entity.radius)
                        continue;
                    if (entity instanceof Player_1.Player)
                        continue;
                    const distance = entity.position.distance(player.position);
                    const totalRadius = entity.radius + player.radius;
                    if (distance < totalRadius) {
                        const newCoordinates = this.getClosestPointOnCircle({
                            x: player.position.x,
                            y: player.position.y,
                            radius: player.radius
                        }, {
                            x: entity.position.x,
                            y: entity.position.y,
                            radius: entity.radius
                        });
                        player.position.x = newCoordinates.x;
                        player.position.y = newCoordinates.y;
                    }
                }
                for (const tile of chunk.tiles) {
                    if (!tile.radius)
                        continue;
                    const tileX = tile.position.x * 100 + 50;
                    const tileY = tile.position.y * 100 + 50;
                    const dx = tileX - x;
                    const dy = tileY - y;
                    const distance = Math.hypot(dx, dy);
                    const totalRadius = tile.radius + 25;
                    if (distance < totalRadius) {
                        const newCoordinates = this.getClosestPointOnCircle({
                            x: player.position.x,
                            y: player.position.y,
                            radius: player.radius
                        }, {
                            x: tileX,
                            y: tileY,
                            radius: tile.radius
                        });
                        player.position.x = newCoordinates.x;
                        player.position.y = newCoordinates.y;
                    }
                }
            }
        }
    }
}
exports.CollisionSystem = CollisionSystem;
