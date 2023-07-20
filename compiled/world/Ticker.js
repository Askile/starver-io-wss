"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticker = void 0;
const BinaryWriter_1 = require("../modules/BinaryWriter");
const nanotimer_1 = __importDefault(require("nanotimer"));
const ServerConfig_json_1 = __importDefault(require("../JSON/ServerConfig.json"));
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const EntityPacket_1 = require("../packets/EntityPacket");
const Vector_1 = require("../modules/Vector");
const EntitySpeed_1 = require("../entities/components/EntitySpeed");
const Player_1 = require("../entities/Player");
const ActionType_1 = require("../enums/ActionType");
class Ticker {
    server;
    constructor(server) {
        this.server = server;
        // prettier-ignore
        new nanotimer_1.default().setInterval(() => {
            this.entityTick();
        }, [], 1 / ServerConfig_json_1.default.network_tps + "s");
        // prettier-ignore
        new nanotimer_1.default().setInterval(() => {
            this.movementTick();
        }, [], 1 / ServerConfig_json_1.default.engine_tps + "s");
        // prettier-ignore
        new nanotimer_1.default().setInterval(() => {
            this.leaderboardTick();
        }, [], 1 / ServerConfig_json_1.default.leaderboard_tps + "s");
    }
    movementTick() {
        for (const entity of this.server.entities) {
            if (!entity.direction) {
                entity.velocity = new Vector_1.Vector(0, 0);
                if (entity.action & ActionType_1.ActionType.WALK) {
                    entity.action -= ActionType_1.ActionType.WALK;
                    entity.action |= ActionType_1.ActionType.IDLE;
                }
                continue;
            }
            entity.old.position = entity.position;
            if (entity.action & ActionType_1.ActionType.IDLE) {
                entity.action -= ActionType_1.ActionType.IDLE;
                entity.action |= ActionType_1.ActionType.WALK;
            }
            let angle = Math.atan2(entity.direction & 4 ? 1 : entity.direction & 8 ? -1 : 0, entity.direction & 2 ? 1 : entity.direction & 1 ? -1 : 0);
            entity.position = entity.position.add(entity.velocity.divide(ServerConfig_json_1.default.engine_tps));
            if (entity instanceof Player_1.Player) {
                if (entity.pet.id)
                    entity.speed = entity.pet.speed * 1000 - (entity.right.type === "weapon" ? 30 : 0);
                else
                    entity.speed = EntitySpeed_1.entitySpeed[entity.type] - (entity.right.type === "weapon" ? 30 : 0);
            }
            entity.position.x = Math.max(0, Math.min(this.server.map.width - 1, entity.position.x));
            entity.position.y = Math.max(0, Math.min(this.server.map.height - 1, entity.position.y));
            entity.velocity.x = entity.speed * Math.cos(angle);
            entity.velocity.y = entity.speed * Math.sin(angle);
        }
    }
    entityTick() {
        const players = this.server.players;
        for (const player of players) {
            new EntityPacket_1.EntityPacket(player, false);
            player.interactionManager.setEquipment();
            player.attackManager.hit();
        }
        const entities = this.server.entities;
        for (const entity of entities) {
            if (entity.action & ActionType_1.ActionType.ATTACK)
                entity.action -= ActionType_1.ActionType.ATTACK;
            entity.old.angle = entity.angle;
            entity.old.extra = entity.extra;
            entity.old.info = entity.info;
        }
    }
    leaderboardTick() {
        const writer = new BinaryWriter_1.BinaryWriter();
        const leaderboard = this.server.players.sort((a, b) => b.stats.score - a.stats.score).slice(0, 10);
        writer.writeUInt16(ClientPackets_1.ClientPackets.LEADERBOARD);
        for (const player of leaderboard) {
            writer.writeUInt16(player.id);
            writer.writeUInt16(player.stats.score);
        }
        const players = this.server.players;
        for (const player of players) {
            player.client.sendBinary(writer.toBuffer());
        }
    }
}
exports.Ticker = Ticker;
