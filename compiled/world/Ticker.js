"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticker = void 0;
const nanotimer_1 = __importDefault(require("nanotimer"));
const EntityPacket_1 = require("../packets/EntityPacket");
const Player_1 = require("../entities/Player");
const Animal_1 = require("../entities/Animal");
class Ticker {
    server;
    constructor(server) {
        this.server = server;
        new nanotimer_1.default().setInterval(() => {
            this.server.map.updateEntitiesInChunks();
            this.server.timeSystem.tick();
            this.server.mobSystem.tick();
            this.server.combatSystem.tick();
            this.server.eventSystem.tick();
            for (const entity of this.server.entities) {
                entity.onTick();
                if (entity instanceof Animal_1.Animal || entity instanceof Player_1.Player) {
                    entity.movement.tick();
                }
                if (entity instanceof Player_1.Player) {
                    new EntityPacket_1.EntityPacket(entity);
                    this.server.collision.updateState(entity);
                }
            }
            for (const entity of this.server.entities) {
                entity.lastTick();
            }
        }, [], 1 / this.server.settings.tps + "s");
        new nanotimer_1.default().setInterval(() => {
            this.server.leaderboard.tick();
        }, [], "1s");
    }
}
exports.Ticker = Ticker;
