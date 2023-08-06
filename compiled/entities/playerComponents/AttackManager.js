"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackManager = void 0;
const InventoryType_1 = require("../../enums/InventoryType");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const BinaryWriter_1 = require("../../modules/BinaryWriter");
class AttackManager {
    player;
    lastAttack = 0;
    isAttack = false;
    constructor(player) {
        this.player = player;
    }
    tick() {
        if (this.isAttack && Date.now() - this.lastAttack >= 500) {
            this.lastAttack = Date.now();
            const chunks = this.player.server.map.getChunks(this.player.position.x, this.player.position.y, 3);
            const distanceToMove = this.player.right.type === "tool" ? 45 : 20;
            const offsetX = distanceToMove * Math.cos((this.player.angle / 255) * (Math.PI * 2));
            const offsetY = distanceToMove * Math.sin((this.player.angle / 255) * (Math.PI * 2));
            const shake = new BinaryWriter_1.BinaryWriter();
            shake.writeUInt16(ClientPackets_1.ClientPackets.HITTEN);
            for (const chunk of chunks) {
                for (const tile of chunk.tiles) {
                    if (!InventoryType_1.InventoryType[tile.resource])
                        continue;
                    const dx = tile.position.x * 100 + 50 - (this.player.position.x + offsetX);
                    const dy = tile.position.y * 100 + 50 - (this.player.position.y + offsetY);
                    const distance = Math.hypot(dx, dy);
                    const totalRadius = tile.radius + (this.player.right.type === "tool" ? 45 : 20);
                    if (distance < totalRadius) {
                        let harvest = Math.max(0, this.player.right.harvest + 1 - tile.hard);
                        if (tile.hard === -1)
                            harvest = 1;
                        shake.writeUInt16(...tile.shake(this.player.angle));
                        if (!harvest) {
                            this.player.client.sendBinary(new Uint8Array([ClientPackets_1.ClientPackets.DONT_HARVEST]));
                            continue;
                        }
                        if (tile.count <= 0) {
                            this.player.client.sendBinary(new Uint8Array([ClientPackets_1.ClientPackets.EMPTY_RES]));
                            continue;
                        }
                        this.player.client.sendBinary(this.player.inventory.giveItem(InventoryType_1.InventoryType[tile.resource], harvest));
                        tile.count = Math.clamp(tile.count - harvest, 0, tile.limit);
                        if (tile.entity)
                            tile.entity.info = tile.count;
                        this.player.stats.score += harvest * (tile.hard === -1 ? 1 : tile.hard);
                    }
                }
            }
            if (shake.toBuffer().length > 3) {
                this.player.server.broadcast(shake.toBuffer(), true);
            }
        }
    }
}
exports.AttackManager = AttackManager;
