import {Server} from "../../Server";
import {Player} from "../../entities/Player";
import {Building} from "../../entities/Building";

export class StorageSystem {
    public server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    public giveChestItem(player: Player, data: number[]) {
        for (let i = 0; i < data.length; i++) {
            if(!Number.isInteger(data[i])) return;
        }

        const chest = this.server.findEntityById(data[0]) as Building;
        const id = data[1];
        const count = !!data[2] ? 10 : 1;

        if((chest.inventory.items.size === 1 && !chest.inventory.items.get(id)) || !player.inventory.items.get(id) || chest.inventory.items.get(id) as number + count > 8000) return;

        chest.inventory.giveItem(id, Math.min(count, player.inventory.items.get(id) as number));
        player.client.sendBinary(player.inventory.removeItem(id, Math.min(count, player.inventory.items.get(id) as number)));

        chest.info = chest.inventory.items.get(id) as number;
        chest.extra = id + 1;
    }

    public takeChestItem(player: Player, data: number[]) {
        for (let i = 0; i < data.length; i++) {
            if(!Number.isInteger(data[i])) return;
        }

        const chest = this.server.findEntityById(data[0]) as Building;

        let inv = Array.from(chest.inventory.items);

        let id = inv[0][0];
        let count = inv[0][1] < 255 ? inv[0][1] : 255;

        chest.inventory.removeItem(id, count);
        player.client.sendBinary(player.inventory.giveItem(id, count));

        inv = Array.from(chest.inventory.items);

        if(inv.length === 0) {
            chest.info = 0;
            chest.extra = 0;
            return;
        }

        chest.info = count;
        chest.extra = id + 1;
    }

    public lockChest(player: Player, id: number) {
        if(!Number.isInteger(id)) return;

        const chest = this.server.findEntityById(id);

        if(chest) {
            chest.info |= 0x2000;
        }
    }

}