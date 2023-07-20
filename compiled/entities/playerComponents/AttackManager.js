"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackManager = void 0;
const InventoryType_1 = require("../../enums/InventoryType");
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
class AttackManager {
    player;
    lastAttack = 0;
    isAttack = false;
    constructor(player) {
        this.player = player;
    }
    /**
     *
     */
    hit() {
        if (this.player.right.type === "tool" && this.isAttack && Date.now() - this.lastAttack >= 5e2) {
            let { x, y } = this.player.position;
            const { chunks } = this.player.server.map;
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
            const angleDegrees = this.player.angle;
            const distanceToMove = 40;
            const dx = distanceToMove * Math.cos((angleDegrees / 255) * (Math.PI * 2));
            const dy = distanceToMove * Math.sin((angleDegrees / 255) * (Math.PI * 2));
            x += dx;
            y += dy;
            for (const tile of chunk) {
                const tileX = tile.x * 100 + 50;
                const tileY = tile.y * 100 + 50;
                const dx = tileX - x;
                const dy = tileY - y;
                const distance = Math.hypot(dx, dy);
                const totalRadius = tile.radius + 45;
                if (distance < totalRadius) {
                    this.lastAttack = Date.now();
                    this.player.client.sendBinary(this.player.inventory.giveItem(InventoryType_1.InventoryType.WOOD, this.player.right.harvest));
                    const writer = new BinaryWriter_1.BinaryWriter();
                    writer.writeUInt16(ClientPackets_1.ClientPackets.HITTEN);
                    writer.writeUInt16(tile.x);
                    writer.writeUInt16(tile.y);
                    writer.writeUInt16(this.player.angle);
                    writer.writeUInt16(tile.id);
                    this.player.client.sendBinary(writer.toBuffer());
                    this.player.stats.score += this.player.right.harvest;
                }
            }
        }
    }
}
exports.AttackManager = AttackManager;
