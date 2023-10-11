"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementSystem = void 0;
const Vector_1 = require("../../modules/Vector");
const ActionType_1 = require("../../enums/types/ActionType");
const Player_1 = require("../../entities/Player");
class MovementSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    tick() {
        for (const entity of this.server.entities) {
            if (!entity.speed)
                entity.realPosition = entity.position;
            let angle_ = entity.realPosition.get_std_angle(entity.position) + Math.PI;
            const delta = entity.speed * 1000 * (1 / this.server.settings.tps);
            const vector = entity.position.build(delta, angle_);
            if (angle_) {
                if (vector.magnitude() < entity.realPosition.subtract(entity.position).magnitude())
                    entity.realPosition = entity.realPosition.add(vector);
                else {
                    entity.realPosition.x = entity.position.x;
                    entity.realPosition.y = entity.position.y;
                }
            }
            if (!entity.direction) {
                entity.velocity = new Vector_1.Vector(0, 0);
                if (entity.action & ActionType_1.ActionType.WALK) {
                    entity.action -= ActionType_1.ActionType.WALK;
                    entity.action |= ActionType_1.ActionType.IDLE;
                }
                continue;
            }
            if (entity.action & ActionType_1.ActionType.IDLE) {
                entity.action -= ActionType_1.ActionType.IDLE;
                entity.action |= ActionType_1.ActionType.WALK;
            }
            let angle = Math.atan2(entity.direction & 4 ? 1 : entity.direction & 8 ? -1 : 0, entity.direction & 2 ? 1 : entity.direction & 1 ? -1 : 0);
            if (entity instanceof Player_1.Player) {
                entity.velocity.x = 50 * Math.cos(angle);
                entity.velocity.y = 50 * Math.sin(angle);
            }
            entity.updateSpeed();
            if (entity instanceof Player_1.Player && !entity.isStunned) {
                entity.position = entity.realPosition.add(entity.velocity);
                this.server.collision.update(entity);
            }
            this.server.collision.updateState(entity);
            entity.position = entity.position.clamp(0, 0, this.server.map.width - 1, this.server.map.height - 1);
        }
    }
}
exports.MovementSystem = MovementSystem;
