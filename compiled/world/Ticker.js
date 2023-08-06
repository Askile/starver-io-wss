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
            this.server.map.updateEntitiesInChunks();
            this.server.movement.tick();
            this.server.collision.tick();
            this.server.timeSystem.tick();
            this.server.combatSystem.tick();
            this.server.mobSystem.tick();
            for (const entity of this.server.entities) {
                entity.onTick();
            }
        }, [], 1 / ServerConfig_json_1.default.engine_tps + "s");
        new nanotimer_1.default().setInterval(() => {
            for (const player of this.server.players) {
                player.stateManager.tick();
                new EntityPacket_1.EntityPacket(player, false);
            }
            this.entityTick();
        }, [], 1 / ServerConfig_json_1.default.network_tps + "s");
        new nanotimer_1.default().setInterval(() => this.server.leaderboard.tick(), [], 1 / ServerConfig_json_1.default.leaderboard_tps + "s");
    }
    entityTick() {
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
        }
    }
}
exports.Ticker = Ticker;
