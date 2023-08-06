"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticker = void 0;
const nanotimer_1 = __importDefault(require("nanotimer"));
const ServerConfig_json_1 = __importDefault(require("../JSON/ServerConfig.json"));
const EntityPacket_1 = require("../packets/EntityPacket");
const ActionType_1 = require("../enums/ActionType");
class Ticker {
    server;
    constructor(server) {
        this.server = server;
        new nanotimer_1.default().setInterval(() => {
            for (const player of this.server.players) {
                player.attackManager.tick();
            }
        }, [], 1 / 5 + "s");
        new nanotimer_1.default().setInterval(() => {
            this.server.movement.tick();
            this.server.collision.tick();
            this.server.map.updateEntitiesInChunks();
            this.server.timeSystem.tick();
        }, [], 1 / ServerConfig_json_1.default.engine_tps + "s");
        new nanotimer_1.default().setInterval(() => this.entityTick(), [], 1 / ServerConfig_json_1.default.network_tps + "s");
        new nanotimer_1.default().setInterval(() => this.server.leaderboard.tick(), [], 1 / ServerConfig_json_1.default.leaderboard_tps + "s");
    }
    entityTick() {
        const players = this.server.players;
        for (const player of players) {
            player.interactionManager.setEquipment();
            new EntityPacket_1.EntityPacket(player, false);
        }
        for (const entity of this.server.entities) {
            if (entity.action & ActionType_1.ActionType.ATTACK)
                entity.action -= ActionType_1.ActionType.ATTACK;
            if (entity.action & ActionType_1.ActionType.HUNGER)
                entity.action -= ActionType_1.ActionType.HUNGER;
            if (entity.action & ActionType_1.ActionType.COLD)
                entity.action -= ActionType_1.ActionType.COLD;
            if (entity.action & ActionType_1.ActionType.HEAL)
                entity.action -= ActionType_1.ActionType.HEAL;
            if (entity.action & ActionType_1.ActionType.HURT)
                entity.action -= ActionType_1.ActionType.HURT;
            entity.old.position = JSON.parse(JSON.stringify(entity.position));
            entity.old.angle = JSON.parse(JSON.stringify(entity.angle));
            entity.old.extra = JSON.parse(JSON.stringify(entity.extra));
            entity.old.info = JSON.parse(JSON.stringify(entity.info));
        }
    }
}
exports.Ticker = Ticker;
