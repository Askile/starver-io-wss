"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitSystem = void 0;
const defaultKit_1 = require("../default/defaultKit");
const InventoryType_1 = require("../enums/InventoryType");
class KitSystem {
    kit;
    constructor(config) {
        this.kit = (0, defaultKit_1.getDefaultKit)();
        if (config.important.starter_kit.length > 0) {
            this.kit = config.important.starter_kit;
        }
    }
    gainKit(player) {
        for (const item of this.kit) {
            const name = item[0];
            const count = item[1];
            const id = this.findInventoryId(name);
            player.client.sendBinary(player.inventory.giveItem(id, count));
        }
    }
    findInventoryId(itemName) {
        return InventoryType_1.InventoryType[itemName.toUpperCase()];
    }
}
exports.KitSystem = KitSystem;
