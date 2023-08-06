import { getDefaultKit } from "../../default/defaultKit";
import { Player } from "../../entities/Player";
import { InventoryType } from "../../enums/InventoryType";

export class KitSystem {
    private readonly kit: any[];
    constructor(config: Config) {
        this.kit = getDefaultKit();

        if(config.important.starter_kit.length > 0) {
            this.kit = config.important.starter_kit;
        }

    }

    public gainKit(player: Player) {
        for (const item of this.kit) {
            const name = item[0];
            const count = item[1];
            const id = this.findInventoryId(name);

            player.client.sendBinary(player.inventory.giveItem(id, count));
        }
    }

    private findInventoryId(itemName: string) {
        return InventoryType[itemName.toUpperCase() as "BAG"] as number;
    }
}