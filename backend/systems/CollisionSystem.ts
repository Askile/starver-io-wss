import {Server} from "../Server";
import {Vector} from "../modules/Vector";

export class CollisionSystem {
    private server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    private getClosestPointOnCircle(circle1: any, circle2: any) {
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
        return new Vector(closestX, closestY);
    }

    public tick() {
        for (const entity of this.server.entities) {
            const {x, y} = entity.position;
            const chunks = this.server.map.getChunks(x, y, 2);

            for (const chunk of chunks) {
                for (const tile of chunk.tiles) {
                    if (!tile.radius) continue;
                    const tileX = tile.position.x * 100 + 50;
                    const tileY = tile.position.y * 100 + 50;
                    const dx = tileX - x;
                    const dy = tileY - y;
                    const distance = Math.hypot(dx, dy);
                    const totalRadius = tile.radius + 25;

                    if (distance < totalRadius) {
                        const newCoordinates = this.getClosestPointOnCircle(
                            {
                                x: entity.position.x,
                                y: entity.position.y,
                                radius: 25
                            },
                            {
                                x: tileX,
                                y: tileY,
                                radius: tile.radius
                            }
                        );

                        entity.position.x = newCoordinates.x;
                        entity.position.y = newCoordinates.y;
                    }
                }
            }

        }
    }
}
