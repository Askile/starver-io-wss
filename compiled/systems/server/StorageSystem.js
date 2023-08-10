"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageSystem = void 0;
class StorageSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    giveChestItem(player, data) {
        for (let i = 0; i < data.length; i++) {
            if (!Number.isInteger(data[i]))
                return;
        }
        const chest = this.server.findEntityById(data[0]);
        const id = data[1];
        const count = !!data[2] ? 10 : 1;
        if ((chest.inventory.items.size === 1 && !chest.inventory.items.get(id)) || !player.inventory.items.get(id) || chest.inventory.items.get(id) + count > 8000)
            return;
        chest.inventory.giveItem(id, Math.min(count, player.inventory.items.get(id)));
        player.client.sendBinary(player.inventory.removeItem(id, Math.min(count, player.inventory.items.get(id))));
        chest.info = chest.inventory.items.get(id);
        chest.extra = id + 1;
    }
    takeChestItem(player, data) {
        for (let i = 0; i < data.length; i++) {
            if (!Number.isInteger(data[i]))
                return;
        }
        const chest = this.server.findEntityById(data[0]);
        let inv = Array.from(chest.inventory.items);
        let id = inv[0][0];
        let count = inv[0][1] < 255 ? inv[0][1] : 255;
        chest.inventory.removeItem(id, count);
        player.client.sendBinary(player.inventory.giveItem(id, count));
        inv = Array.from(chest.inventory.items);
        if (inv.length === 0) {
            chest.info = 0;
            chest.extra = 0;
            return;
        }
        chest.info = count;
        chest.extra = id + 1;
    }
    lockChest(player, id) {
        if (!Number.isInteger(id))
            return;
        const chest = this.server.findEntityById(id);
        if (chest) {
            chest.info |= 0x2000;
        }
    }
}
exports.StorageSystem = StorageSystem;
