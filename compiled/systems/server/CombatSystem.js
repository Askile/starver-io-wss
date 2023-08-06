"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatSystem = void 0;
const Player_1 = require("../../entities/Player");
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const InventoryType_1 = require("../../enums/InventoryType");
const Vector_1 = require("../../modules/Vector");
const ActionType_1 = require("../../enums/ActionType");
const DeathReason_1 = require("../../enums/DeathReason");
const Wall_1 = require("../../entities/buildings/Wall");
const Spike_1 = require("../../entities/buildings/Spike");
const Fire_1 = require("../../entities/buildings/Fire");
const Bridge_1 = require("../../entities/buildings/Bridge");
const Door_1 = require("../../entities/buildings/Door");
const Workbench_1 = require("../../entities/buildings/Workbench");
class CombatSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    tick() {
        for (const player of this.server.players) {
            this.handleAttack(player);
        }
    }
    handleAttack(player) {
        if (Date.now() - player.lastAttack > 500 && player.attack) {
            player.lastAttack = Date.now();
            const chunks = this.server.map.getChunks(player.position.x, player.position.y, 3);
            const radius = ["tool", "hammer"].includes(player.right.type) ? 45 : player.right.type === "weapon" ? 45 : 20;
            const offset = ["tool", "hammer"].includes(player.right.type) ? 50 : player.right.type === "weapon" ? 65 : 20;
            const offsetX = offset * Math.cos((player.angle / 255) * (Math.PI * 2));
            const offsetY = offset * Math.sin((player.angle / 255) * (Math.PI * 2));
            const shake = new BinaryWriter_1.BinaryWriter();
            shake.writeUInt16(ClientPackets_1.ClientPackets.HITTEN);
            for (const chunk of chunks) {
                for (const tile of chunk.tiles) {
                    const distance = tile.realPosition.distance(player.position.add(new Vector_1.Vector(offsetX, offsetY)));
                    const totalRadius = tile.radius + radius;
                    if (distance < totalRadius) {
                        let harvest = Math.max(0, player.right.harvest + 1 - tile.hard);
                        if (tile.hard === -1)
                            harvest = 1;
                        shake.writeUInt16(...tile.shake(player.angle));
                        if (!harvest) {
                            player.client.sendU8([ClientPackets_1.ClientPackets.DONT_HARVEST]);
                            continue;
                        }
                        if (tile.count <= 0) {
                            player.client.sendU8([ClientPackets_1.ClientPackets.EMPTY_RES]);
                            continue;
                        }
                        player.client.sendBinary(player.inventory.giveItem(InventoryType_1.InventoryType[tile.resource], harvest));
                        tile.count = Math.clamp(tile.count - harvest, 0, tile.limit);
                        if (tile.entity)
                            tile.entity.info = tile.count;
                        player.stats.score += harvest * (tile.hard === -1 ? 1 : tile.hard);
                    }
                }
                for (const entity of chunk.entities) {
                    if (entity === player)
                        continue;
                    const distance = entity.position.distance(player.position.add(new Vector_1.Vector(offsetX, offsetY)));
                    const totalRadius = entity.radius + radius;
                    if (distance < totalRadius) {
                        if (entity instanceof Player_1.Player) {
                            entity.reason = DeathReason_1.DeathReason.PLAYER;
                            entity.client.sendBinary(entity.healthSystem.damage(player.right.damage + entity.helmet.defense + (entity.right.defense ? entity.right.defense : 0), ActionType_1.ActionType.HURT, player));
                            return;
                        }
                        if (this.isBuilding(entity)) {
                            if (player.right.type === "hammer") {
                                entity.healthSystem.damage(player.right.building_damage, ActionType_1.ActionType.HURT, player);
                            }
                            else {
                                entity.healthSystem.damage(~~(player.right.damage / 4), ActionType_1.ActionType.HURT, player);
                            }
                            const writer = new BinaryWriter_1.BinaryWriter();
                            writer.writeUInt16(ClientPackets_1.ClientPackets.HITTEN_OTHER);
                            writer.writeUInt16(entity.id);
                            writer.writeUInt8(entity.id);
                            writer.writeUInt8(player.angle);
                            player.client.sendBinary(writer.toBuffer());
                            // entity.info = entity.healthSystem.health / entity.healthSystem.maxHealth * 100;
                            return;
                        }
                        entity.healthSystem.damage(player.right.damage, ActionType_1.ActionType.HURT, player);
                    }
                }
            }
            if (shake.toBuffer().length > 3) {
                this.server.broadcast(shake.toBuffer(), true);
            }
        }
    }
    isBuilding(entity) {
        return entity instanceof Wall_1.Wall || entity instanceof Spike_1.Spike || entity instanceof Fire_1.Fire || entity instanceof Bridge_1.Bridge || entity instanceof Door_1.Door || entity instanceof Workbench_1.Workbench;
    }
}
exports.CombatSystem = CombatSystem;
