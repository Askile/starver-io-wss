"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticker = void 0;
const BinaryWriter_1 = require("../modules/BinaryWriter");
const nanotimer_1 = __importDefault(require("nanotimer"));
const ServerConfig_json_1 = __importDefault(require("../ServerConfig.json"));
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const EntityPacket_1 = require("../packets/EntityPacket");
const Vector_1 = require("../modules/Vector");
const EntitySpeed_1 = require("../entities/components/EntitySpeed");
const Player_1 = require("../entities/Player");
const Collision_1 = require("../modules/Collision");
const ActionType_1 = require("../enums/ActionType");
class Ticker {
    server;
    constructor(server) {
        this.server = server;
        new nanotimer_1.default().setInterval(() => {
            this.entityTick();
        }, [], 1 / ServerConfig_json_1.default.network_tps + "s");
        new nanotimer_1.default().setInterval(() => {
            this.movementTick();
        }, [], 1 / ServerConfig_json_1.default.engine_tps + "s");
        new nanotimer_1.default().setInterval(() => {
            this.leaderboardTick();
        }, [], ServerConfig_json_1.default.leaderboard_tps + "s");
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
            if (entity.action & ActionType_1.ActionType.IDLE) {
                entity.action -= ActionType_1.ActionType.IDLE;
                entity.action |= ActionType_1.ActionType.WALK;
            }
            let angle = Math.atan2(entity.direction & 4 ? 1 : entity.direction & 8 ? -1 : 0, entity.direction & 2 ? 1 : entity.direction & 1 ? -1 : 0);
            entity.velocity.x = entity.speed * Math.cos(angle);
            entity.velocity.y = entity.speed * Math.sin(angle);
            if (entity instanceof Player_1.Player && !entity.pet.isFly) {
                this.collisionTick();
            }
            else if (!(entity instanceof Player_1.Player)) {
                this.collisionTick();
            }
            entity.position = entity.position.add(entity.velocity.divide(ServerConfig_json_1.default.engine_tps));
            for (const biome of this.server.map.biomes) {
                const biomePos = biome.position;
                if (entity.position.isVectorInsideRectangle(biomePos.subtract(biomePos.divide(2)), biome.size.x, biome.size.y) &&
                    !entity.biomes.includes(biome)) {
                    entity.biomes.push(biome);
                }
                else {
                    entity.biomes = entity.biomes.filter((b) => b !== biome);
                }
            }
            if (entity instanceof Player_1.Player) {
                if (entity.pet.id !== 0) {
                    entity.speed = entity.pet.speed * 1000 - (entity.right.type === "weapon" ? 30 : 0);
                }
                else {
                    entity.speed = EntitySpeed_1.entitySpeed[entity.type] - (entity.right.type === "weapon" ? 30 : 0);
                }
            }
            entity.position.x = Math.max(0, Math.min(this.server.map.width, entity.position.x));
            entity.position.y = Math.max(0, Math.min(this.server.map.height, entity.position.y));
        }
    }
    collisionTick() {
        const { chunks } = this.server.map;
        for (const entity of this.server.entities) {
            const { x, y } = entity.position;
            const chunkX = Math.floor(x / 100);
            const chunkY = Math.floor(y / 100);
            const chunk = [];
            for (let offsetY = -2; offsetY <= 2; offsetY++) {
                const chunkRow = chunks[chunkY + offsetY];
                for (let offsetX = -2; offsetX <= 2; offsetX++) {
                    const row = chunkRow && chunkRow[chunkX + offsetX];
                    if (row) {
                        chunk.push(...row);
                    }
                }
            }
            for (const tile of chunk) {
                const tileX = tile.x * 100 + 50;
                const tileY = tile.y * 100 + 50;
                const dx = tileX - x;
                const dy = tileY - y;
                const distance = Math.hypot(dx, dy);
                const totalRadius = tile.radius + 25;
                if (distance < totalRadius) {
                    const newCoordinates = Collision_1.Collision.getClosestPointOnCircle({
                        x: entity.position.x,
                        y: entity.position.y,
                        radius: 25,
                    }, {
                        x: tileX,
                        y: tileY,
                        radius: tile.radius,
                    });
                    entity.position.x = tileX + newCoordinates.x;
                    entity.position.y = tileY + newCoordinates.y;
                    entity.isCollide = true;
                }
            }
        }
    }
    entityTick() {
        const players = this.server.players;
        for (const player of players) {
            new EntityPacket_1.EntityPacket(player, false);
            player.interactionManager.setEquipment();
        }
        const entities = this.server.entities;
        for (const entity of entities) {
            if (entity.isCollide) {
                entity.speed = 100;
                entity.isCollide = false;
            }
            if (entity.action & ActionType_1.ActionType.ATTACK) {
                entity.action -= ActionType_1.ActionType.ATTACK;
            }
            entity.old.position = entity.position;
            entity.old.angle = entity.angle;
            entity.old.extra = entity.extra;
            entity.old.info = entity.info;
        }
    }
    leaderboardTick() {
        const writer = new BinaryWriter_1.BinaryWriter();
        const leaderboard = this.server.players
            .sort((a, b) => b.stats.score - a.stats.score)
            .slice(0, 10);
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
