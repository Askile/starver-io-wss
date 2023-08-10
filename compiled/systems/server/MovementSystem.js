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
            // const isDiagonal = (angle / (Math.PI / 2) % 1);
            //
            // const nullVec = new Vector(1, 1)
            entity.velocity.x = entity.speed * 1000 * Math.cos(angle);
            entity.velocity.y = entity.speed * 1000 * Math.sin(angle);
            // if(entity.direction === 8 && isBorder) {
            //     entity.velocity.y = 0;
            //     entity.position.y = 0;
            // } else if(entity.direction === 4 && isBorder) {
            //     entity.velocity.y = 0;
            //     entity.position.y = this.server.map.height - 1;
            // }
            entity.position = entity.position.add(entity.velocity.divide(ServerConfig_json_1.default.engine_tps));
            if (entity instanceof Player_1.Player) {
                const isWeapon = entity.right.type === "weapon";
                entity.speed = this.server.configSystem.speed[entity.type];
                if (isWeapon) {
                    entity.speed = this.server.config.speed_weapon;
                }
                if (entity.winter) {
                    entity.speed = this.server.config.speed_winter;
                    if (isWeapon)
                        entity.speed = this.server.config.speed_winter_weapon;
                }
                if (entity.water) {
                    entity.speed = this.server.config.speed_water;
                    if (isWeapon)
                        entity.speed = this.server.config.speed_water_weapon;
                }
                if (entity.attack) {
                    entity.speed -= this.server.config.speed_attacking;
                }
                // entity.speed = 3;
            }
        }
    }
}
exports.MovementSystem = MovementSystem;
