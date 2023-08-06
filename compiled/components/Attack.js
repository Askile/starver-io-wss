"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attacker = void 0;
const InventoryType_1 = require("../enums/InventoryType");
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const BinaryWriter_1 = require("../modules/BinaryWriter");
class Attacker {
    server;
    lastAttack = 0;
    isAttack = false;
    constructor(server) {
        this.server = server;
    }
    tick() {
        for (const player of this.server.players) {
            if (this.isAttack && Date.now() - this.lastAttack >= 5e2) {
                this.lastAttack = Date.now();
                const chunks = player.server.map.getChunks(player.position.x, player.position.y, 2);
                const distanceToMove = player.right.type === "tool" ? 40 : 20;
                const offsetX = distanceToMove * Math.cos((player.angle / 255) * (Math.PI * 2));
                const offsetY = distanceToMove * Math.sin((player.angle / 255) * (Math.PI * 2));
                const shake = new BinaryWriter_1.BinaryWriter();
                shake.writeUInt16(ClientPackets_1.ClientPackets.HITTEN);
                for (const tile of chunks) {
                    const dx = tile.position.x * 100 + 50 - (player.position.x + offsetX);
                    const dy = tile.position.y * 100 + 50 - (player.position.y + offsetY);
                    const distance = Math.hypot(dx, dy);
                    const totalRadius = tile.radius + (player.right.type === "tool" ? 45 : 20);
                    if (distance < totalRadius) {
                        const harvest = player.right.harvest | 1;
                        player.client.sendBinary(player.inventory.giveItem(InventoryType_1.InventoryType[tile.resource], harvest));
                        player.stats.score += harvest;
                        shake.writeUInt16(...tile.shake(player.angle));
                    }
                }
                if (shake.toBuffer().length > 3)
                    this.server.broadcast(shake.toBuffer(), true, player.client.socket);
            }
        }
    }
}
exports.Attacker = Attacker;
