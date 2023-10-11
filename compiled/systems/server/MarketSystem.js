"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketSystem = void 0;
const MarketIds_1 = require("../../enums/MarketIds");
const ItemType_1 = require("../../enums/types/ItemType");
class MarketSystem {
    buy(player, data) {
        const id = ~~(data[1]);
        const count = ~~(data[0]);
        if (!Number.isInteger(id) && !Number.isInteger(count))
            return;
        const items = this.getMarket(id, count);
        if (items === -1 || !player.inventory.containsItem(items[0][1], count))
            return;
        player.client.sendBinary(player.inventory.giveItem(items[0][0], items[1]));
        player.client.sendBinary(player.inventory.removeItem(items[0][1], count));
    }
    getMarket(id, count) {
        switch (id) {
            case MarketIds_1.MarketIds.WOOD: return [[ItemType_1.ItemType.WOOD, ItemType_1.ItemType.BERRY], Math.min(249, Math.max(0, ~~(count * 3)))];
            case MarketIds_1.MarketIds.STONE: return [[ItemType_1.ItemType.STONE, ItemType_1.ItemType.PUMPKIN], Math.min(248, Math.max(0, ~~(count * 4)))];
            case MarketIds_1.MarketIds.GOLD: return [[ItemType_1.ItemType.GOLD, ItemType_1.ItemType.BREAD], Math.min(246, Math.max(0, ~~(count * 6)))];
            case MarketIds_1.MarketIds.DIAMOND: return [[ItemType_1.ItemType.DIAMOND, ItemType_1.ItemType.CARROT], Math.min(63, Math.max(0, ~~(count / 4)))];
            case MarketIds_1.MarketIds.AMETHYST: return [[ItemType_1.ItemType.AMETHYST, ItemType_1.ItemType.TOMATO], Math.min(31, Math.max(0, ~~(count / 8)))];
            case MarketIds_1.MarketIds.REIDITE: return [[ItemType_1.ItemType.REIDITE, ItemType_1.ItemType.THORNBUSH], Math.min(15, Math.max(0, ~~(count / 16)))];
            case MarketIds_1.MarketIds.PUMPKIN: return [[ItemType_1.ItemType.PUMPKIN_SEED, ItemType_1.ItemType.BREAD], Math.min(25, Math.max(0, ~~(count / 10)))];
            case MarketIds_1.MarketIds.CARROT: return [[ItemType_1.ItemType.CARROT_SEED, ItemType_1.ItemType.PUMPKIN], Math.min(15, Math.max(0, ~~(count / 16)))];
            case MarketIds_1.MarketIds.TOMATO: return [[ItemType_1.ItemType.TOMATO_SEED, ItemType_1.ItemType.CARROT], Math.min(12, Math.max(0, ~~(count / 20)))];
            case MarketIds_1.MarketIds.THORNBUSH: return [[ItemType_1.ItemType.THORNBUSH_SEED, ItemType_1.ItemType.TOMATO], Math.min(8, Math.max(0, ~~(count / 30)))];
            case MarketIds_1.MarketIds.GARLIC: return [[ItemType_1.ItemType.GARLIC_SEED, ItemType_1.ItemType.THORNBUSH], Math.min(6, Math.max(0, ~~(count / 40)))];
            case MarketIds_1.MarketIds.WATERMELON: return [[ItemType_1.ItemType.WATERMELON_SEED, ItemType_1.ItemType.GARLIC], Math.min(4, Math.max(0, ~~(count / 60)))];
            default: return -1;
        }
    }
}
exports.MarketSystem = MarketSystem;
