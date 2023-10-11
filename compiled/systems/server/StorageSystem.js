"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageSystem = void 0;
const ItemType_1 = require("../../enums/types/ItemType");
const EntityType_1 = require("../../enums/types/EntityType");
const Utils_1 = require("../../modules/Utils");
class StorageSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    giveChestItem(player, [id, isShift]) {
        if (!Number.isInteger(id) ||
            !Number.isInteger(isShift))
            return;
        const chest = this.server.map.getNearest(player, [EntityType_1.EntityType.CHEST], 100);
        const count = Math.min(255, isShift ? 10 : 1, player.inventory.itemCount(id), 255 - chest.data[0]);
        if (!chest)
            return;
        if (!player.inventory.containsItem(id, count))
            return;
        if ((chest.info & 0x2000 && chest.pid !== player.id) && !chest.owner.totem?.data.includes(player.id))
            return;
        chest.data[0] = id;
        chest.data[1] += count;
        player.client.sendBinary(player.inventory.removeItem(id, Math.min(count, player.inventory.items.get(id))));
    }
    takeChestItem(player) {
        const chest = this.server.map.getNearest(player, [EntityType_1.EntityType.CHEST], 100);
        if (!chest)
            return;
        if (chest.pid !== player.id && chest.info & 0x2000 && !chest.owner.totem?.data.includes(player.id))
            return;
        if (player.inventory.items.size >= player.inventory.size)
            return;
        if (chest.owner.id !== player.id)
            player.ruinQuests();
        let count = Math.min(255, chest.data[1]);
        player.client.sendBinary(player.inventory.giveItem(chest.data[0], count));
        chest.data[1] -= count;
        chest.data[0] = chest.data[1] ? chest.data[0] : 0;
    }
    lockChest(player) {
        const chest = this.server.map.getNearest(player, [EntityType_1.EntityType.CHEST], 100);
        if (!chest || chest.info & 0x2000)
            return;
        if (chest.position.distance(player.realPosition) > 100)
            return;
        if (player.inventory.items.get(ItemType_1.ItemType.LOCK)) {
            player.client.sendBinary(player.inventory.removeItem(ItemType_1.ItemType.LOCK, 1));
            chest.info |= 0x2000;
        }
    }
    unlockChest(player) {
        const chest = this.server.map.getNearest(player, [EntityType_1.EntityType.CHEST], 100);
        if (!chest || !(chest.info & 0x2000))
            return;
        if (player.inventory.items.get(ItemType_1.ItemType.LOCK_PICK)) {
            player.client.sendBinary(player.inventory.removeItem(ItemType_1.ItemType.LOCK_PICK, 1));
            chest.info -= 0x2000;
        }
    }
    giveWoodExtractor(player, isShift) {
        const extractor = this.server.map.getNearest(player, [
            EntityType_1.EntityType.STONE_EXTRACTOR, EntityType_1.EntityType.GOLD_EXTRACTOR, EntityType_1.EntityType.DIAMOND_EXTRACTOR,
            EntityType_1.EntityType.AMETHYST_EXTRACTOR, EntityType_1.EntityType.REIDITE_EXTRACTOR
        ], 100);
        if (extractor) {
            if (extractor.data[0] === -1)
                extractor.data[0] = 0;
            let count = Math.min(isShift ? 10 : 1, player.inventory.itemCount(ItemType_1.ItemType.WOOD), 255 - extractor.data[0]);
            extractor.data[0] += count;
            player.client.sendBinary(player.inventory.removeItem(ItemType_1.ItemType.WOOD, count));
        }
    }
    takeResourceExtractor(player) {
        const extractor = this.server.map.getNearest(player, [
            EntityType_1.EntityType.REIDITE_EXTRACTOR, EntityType_1.EntityType.AMETHYST_EXTRACTOR, EntityType_1.EntityType.DIAMOND_EXTRACTOR,
            EntityType_1.EntityType.GOLD_EXTRACTOR, EntityType_1.EntityType.STONE_EXTRACTOR
        ], 100);
        if (extractor) {
            if (extractor.owner.id !== player.id)
                player.ruinQuests();
            let item = Utils_1.Utils.getItemInStorage(extractor.type);
            player.client.sendBinary(player.inventory.giveItem(item, extractor.data[1]));
            extractor.data[1] = 0;
        }
    }
    giveWheat(player, isShift) {
        const windmill = this.server.map.getNearest(player, [EntityType_1.EntityType.WINDMILL], 100);
        if (windmill) {
            const count = Math.min(255, isShift ? 10 : 1, player.inventory.itemCount(ItemType_1.ItemType.WHEAT), 255 - windmill.data[0]);
            windmill.data[0] += count;
            player.client.sendBinary(player.inventory.removeItem(ItemType_1.ItemType.WHEAT, count));
        }
    }
    takeFlour(player) {
        const windmill = this.server.map.getNearest(player, [EntityType_1.EntityType.WINDMILL], 100);
        if (windmill) {
            if (windmill.owner.id !== player.id)
                player.ruinQuests();
            player.client.sendBinary(player.inventory.giveItem(ItemType_1.ItemType.FLOUR, windmill.data[1]));
            windmill.data[1] = 0;
        }
    }
    giveFurnace(player, isShift) {
        const furnace = this.server.map.getNearest(player, [EntityType_1.EntityType.FURNACE], 100);
        if (furnace) {
            const count = Math.min(1000, isShift ? 10 : 1, player.inventory.itemCount(ItemType_1.ItemType.WOOD), 1000 - furnace.data[0]);
            furnace.data[0] += count;
            player.client.sendBinary(player.inventory.removeItem(ItemType_1.ItemType.WOOD, count));
        }
    }
    giveWell(player) {
        const well = this.server.map.getNearest(player, [EntityType_1.EntityType.WELL], 100);
        if (well.type === EntityType_1.EntityType.WELL) {
            if (well.position.distance(player.realPosition) > 100 || !player.inventory.containsItem(ItemType_1.ItemType.BUCKET_FULL))
                return;
            well.data[0] += 8;
            well.info = 1;
            player.client.sendBinary(player.inventory.removeItem(ItemType_1.ItemType.BUCKET_FULL, 1));
        }
    }
    giveWoodOven(player, isShift) {
        const oven = this.server.map.getNearest(player, [EntityType_1.EntityType.BREAD_OVEN], 100);
        if (oven) {
            const count = Math.min(31, isShift ? 10 : 1, player.inventory.itemCount(ItemType_1.ItemType.WOOD), 31 - oven.data[0]);
            oven.data[0] += count;
            player.client.sendBinary(player.inventory.removeItem(ItemType_1.ItemType.WOOD, count));
        }
    }
    giveFlourOven(player, isShift) {
        const oven = this.server.map.getNearest(player, [EntityType_1.EntityType.BREAD_OVEN], 100);
        if (oven) {
            const count = Math.min(31, isShift ? 10 : 1, player.inventory.itemCount(ItemType_1.ItemType.FLOUR), 31 - oven.data[1]);
            oven.data[1] += count;
            player.client.sendBinary(player.inventory.removeItem(ItemType_1.ItemType.FLOUR, count));
        }
    }
    takeBread(player) {
        const oven = this.server.map.getNearest(player, [EntityType_1.EntityType.BREAD_OVEN], 100);
        if (oven) {
            if (oven.owner.id !== player.id)
                player.ruinQuests();
            player.client.sendBinary(player.inventory.giveItem(ItemType_1.ItemType.BREAD, oven.data[2]));
            oven.data[2] = 0;
        }
    }
}
exports.StorageSystem = StorageSystem;
