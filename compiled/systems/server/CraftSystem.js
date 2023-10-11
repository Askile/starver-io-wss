"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraftSystem = void 0;
const ItemType_1 = require("../../enums/types/ItemType");
const nanotimer_1 = __importDefault(require("nanotimer"));
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const defaultRecipes_1 = require("../../default/defaultRecipes");
const Utils_1 = require("../../modules/Utils");
class CraftSystem {
    recipes;
    newRecipes;
    constructor(config) {
        this.recipes = defaultRecipes_1.RECIPES;
        this.newRecipes = [];
        if (config.important.recipes) {
            for (let recipe of config.important.recipes) {
                recipe = Utils_1.Utils.convertRecipe(recipe);
                this.recipes[recipe.id] = recipe;
                this.newRecipes[recipe.id] = recipe;
            }
        }
        if (config.instant_craft == 1) {
            for (const recipe of this.recipes) {
                if (recipe)
                    recipe.time = 0;
            }
        }
    }
    handleCraft(player, id) {
        if (!this.recipes[id])
            return;
        const craft = this.recipes[id];
        const time = player.right.equal(ItemType_1.ItemType.BOOK) ? craft.time / 3 : craft.time;
        if (craft.w && !player.workbench ||
            craft.f && !player.fire ||
            craft.o && !player.water ||
            craft.e && !player.well)
            return;
        for (const [id, count] of craft.r) {
            if (!player.inventory.containsItem(id, count))
                return;
            player.inventory.removeItem(id, count);
        }
        player.isCrafting = true;
        player.client.sendU8([ClientPackets_1.ClientPackets.BUILD_OK, id]);
        new nanotimer_1.default().setTimeout(() => {
            if (!player.isCrafting)
                return;
            player.client.sendU8([ClientPackets_1.ClientPackets.BUILD_STOP, (id === ItemType_1.ItemType.BOTTLE_FULL_2 || id === ItemType_1.ItemType.BOTTLE_FULL_3) ? ItemType_1.ItemType.BOTTLE_FULL : id]);
            player.inventory.giveItem((id === ItemType_1.ItemType.BOTTLE_FULL_2 || id === ItemType_1.ItemType.BOTTLE_FULL_3) ? ItemType_1.ItemType.BOTTLE_FULL : id, 1);
            if (craft.bonus)
                player.score += craft.bonus;
            player.isCrafting = false;
        }, [], time + "s");
    }
    handleRecycle(player, id) {
        if (!this.recipes[id])
            return;
        const craft = this.recipes[id];
        const time = player.right.equal(ItemType_1.ItemType.BOOK) ? craft.time / 1.5 : craft.time;
        if (!player.inventory.containsItem(id, 1) ||
            craft.w && !player.workbench ||
            craft.f && !player.fire ||
            craft.o && !player.water ||
            craft.e && !player.well)
            return;
        player.isCrafting = true;
        player.client.sendU8([ClientPackets_1.ClientPackets.RECYCLE_OK, id]);
        player.client.sendBinary(player.inventory.removeItem(id, 1));
        new nanotimer_1.default().setTimeout(() => {
            if (!player.isCrafting)
                return;
            for (const [id, count] of craft.r) {
                if (count === 1)
                    continue;
                player.inventory.giveItem(id, count * 0.8);
            }
            player.client.sendBinary(new Uint8Array([ClientPackets_1.ClientPackets.RECYCLE_STOP, id]));
            player.isCrafting = false;
        }, [], time / 8 + "s");
    }
    stopCraft(player) {
        player.isCrafting = false;
        player.client.sendU8([ClientPackets_1.ClientPackets.CANCEL_CRAFT]);
    }
}
exports.CraftSystem = CraftSystem;
