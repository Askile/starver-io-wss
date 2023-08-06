import {Server} from "../../Server";
import {Vector} from "../../modules/Vector";
import {ActionType} from "../../enums/ActionType";
import ServerConfig from "../../JSON/ServerConfig.json";
import {Player} from "../../entities/Player";

export class MovementSystem {
    private server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    public tick() {
        for (const entity of this.server.entities) {
            if (!entity.direction) {
                entity.velocity = new Vector(0, 0);
                if (entity.action & ActionType.WALK) {
                    entity.action -= ActionType.WALK;
                    entity.action |= ActionType.IDLE;
                }
                continue;
            }

            if (entity.action & ActionType.IDLE) {
                entity.action -= ActionType.IDLE;
                entity.action |= ActionType.WALK;
            }

            let angle = Math.atan2(
                entity.direction & 4 ? 1 : entity.direction & 8 ? -1 : 0,
                entity.direction & 2 ? 1 : entity.direction & 1 ? -1 : 0
            );

            const isDiagonal = (angle / (Math.PI / 2) % 1);

            const nullVec = new Vector(1, 1)

            entity.velocity.x = entity.speed * Math.cos(angle);
            entity.velocity.y = entity.speed * Math.sin(angle);

            // if(entity.direction === 8 && isBorder) {
            //     entity.velocity.y = 0;
            //     entity.position.y = 0;
            // } else if(entity.direction === 4 && isBorder) {
            //     entity.velocity.y = 0;
            //     entity.position.y = this.server.map.height - 1;
            // }

            entity.position = entity.position.add(entity.velocity.divide(ServerConfig.engine_tps));

            if (entity instanceof Player) {
                entity.speed = this.server.configSystem.speed[entity.type] * 1000;
                if(entity.right.type === "weapon") {
                    entity.speed = this.server.config.speed_weapon * 1000;
                }
                if(entity.water) {
                    entity.speed = this.server.config.speed_water * 1000;
                    if(entity.right.type === "weapon") entity.speed = this.server.config.speed_water_weapon * 1000;
                }
                if(entity.attack) {
                    entity.speed -= this.server.config.speed_attacking * 1000;
                }

            }
        }
    }
}