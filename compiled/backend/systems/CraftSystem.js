"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CraftSystem = void 0;
const InventoryType_1 = require("../enums/InventoryType");
const CraftType_1 = require("../enums/CraftType");
const nanotimer_1 = __importDefault(require("nanotimer"));
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const defaultRecipes_1 = require("../default/defaultRecipes");
class CraftSystem {
    recipes;
    recipesToSend = [];
    constructor(config) {
        this.recipes = (0, defaultRecipes_1.getDefaultRecipes)();
        if (config.important.recipes) {
            for (const recipe of config.important.recipes) {
                const id = this.findCraftId(recipe.item);
                this.recipes[id] = recipe;
            }
        }
        if (config.instant_craft == 1) {
            for (const recipe of this.recipes) {
                recipe.time = 0;
            }
        }
        this.recipesToSend = this.recipes.map(recipe => {
            return {
                item: this.findCraftId(recipe.item),
                recipe: recipe.recipe.map(r => [this.findInventoryId(r[0].toUpperCase()), r[1]]),
                fire: recipe.fire,
                water: recipe.water,
                workbench: recipe.workbench,
                well: recipe.well,
                time: recipe.time
            };
        });
    }
    handleCraft(player, id) {
        if (!this.recipes[id])
            return;
        const craft = this.recipes[id];
        for (const ingredient of craft.recipe) {
            const ide = InventoryType_1.InventoryType[ingredient[0].toUpperCase()];
            const count = ingredient[1];
            if (!player.inventory.items.has(ide) || player.inventory.items.get(ide) < count) {
                break;
            }
        }
        player.client.sendBinary(new Uint8Array([ClientPackets_1.ClientPackets.BUILD_OK, id]));
        player.isCrafting = true;
        new nanotimer_1.default().setTimeout(() => {
            player.isCrafting = false;
            player.client.sendBinary(new Uint8Array([ClientPackets_1.ClientPackets.BUILD_STOP, InventoryType_1.InventoryType[craft.item.toUpperCase()]]));
            player.inventory.giveItem(InventoryType_1.InventoryType[craft.item.toUpperCase()], 1);
            if (craft.bonus)
                player.stats.score += craft.bonus;
        }, [], craft.time + "s");
    }
    findInventoryId(itemName) {
        return InventoryType_1.InventoryType[itemName.toUpperCase()];
    }
    findCraftId(itemName) {
        return CraftType_1.CraftType[itemName.toUpperCase()];
    }
}
exports.CraftSystem = CraftSystem;
