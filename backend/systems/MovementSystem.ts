import {Server} from "../Server";
import {Vector} from "../modules/Vector";
import {ActionType} from "../enums/ActionType";
import ServerConfig from "../JSON/ServerConfig.json";
import {Player} from "../entities/Player";
import {entitySpeed} from "../entities/components/EntitySpeed";

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

            entity.velocity.x = entity.speed * Math.cos(angle);
            entity.velocity.y = entity.speed * Math.sin(angle);

            entity.position = entity.position.add(entity.velocity.divide(ServerConfig.engine_tps));

            if (entity instanceof Player) {
                if (entity.pet.id) entity.speed = entity.pet.speed * 1000 - (entity.right.type === "weapon" ? 30 : 0);
                else entity.speed = entitySpeed[entity.type] - (entity.right.type === "weapon" ? 30 : 0);
            }

            entity.position.x = Math.max(0, Math.min(this.server.map.width - 1, entity.position.x));
            entity.position.y = Math.max(0, Math.min(this.server.map.height - 1, entity.position.y));
        }
    }
}
