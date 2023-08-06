"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovementSystem = void 0;
const Vector_1 = require("../../modules/Vector");
const ActionType_1 = require("../../enums/ActionType");
const ServerConfig_json_1 = __importDefault(require("../../JSON/ServerConfig.json"));
const Player_1 = require("../../entities/Player");
class MovementSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    tick() {
        for (const entity of this.server.entities) {
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
            const isDiagonal = (angle / (Math.PI / 2) % 1);
            const nullVec = new Vector_1.Vector(1, 1);
            entity.velocity.x = entity.speed * Math.cos(angle);
            entity.velocity.y = entity.speed * Math.sin(angle);
            // if(entity.direction === 8 && isBorder) {
            //     entity.velocity.y = 0;
            //     entity.position.y = 0;
            // } else if(entity.direction === 4 && isBorder) {
            //     entity.velocity.y = 0;
            //     entity.position.y = this.server.map.height - 1;
            // }
            entity.position = entity.position.add(entity.velocity.divide(ServerConfig_json_1.default.engine_tps));
            if (entity instanceof Player_1.Player) {
                entity.speed = this.server.configSystem.speed[entity.type] * 1000;
                if (entity.right.type === "weapon") {
                    entity.speed = this.server.config.speed_weapon * 1000;
                }
                if (entity.water) {
                    entity.speed = this.server.config.speed_water * 1000;
                    if (entity.right.type === "weapon")
                        entity.speed = this.server.config.speed_water_weapon * 1000;
                }
                if (entity.attack) {
                    entity.speed -= this.server.config.speed_attacking * 1000;
                }
            }
        }
    }
}
exports.MovementSystem = MovementSystem;
