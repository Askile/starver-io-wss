"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionSystem = void 0;
const Items_json_1 = __importDefault(require("../../JSON/Items.json"));
const InventoryType_1 = require("../../enums/InventoryType");
const defaultValues_1 = require("../../default/defaultValues");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const ActionType_1 = require("../../enums/ActionType");
class InteractionSystem {
    server;
    items;
    constructor(server) {
        this.server = server;
        this.items = Items_json_1.default;
    }
    request(player, id) {
        const name = InventoryType_1.InventoryType[id];
        if (!player.inventory.items.has(id) && id !== InventoryType_1.InventoryType.HAND)
            return;
        const canWeapon = Date.now() - player.lastWeaponUse >= this.server.config.weapon_delay;
        const canEquip = Date.now() - player.lastHelmetUse >= this.server.config.helmet_delay;
        const item = this.items[name];
        if (id === InventoryType_1.InventoryType.HAND && canWeapon) {
            player.right = (0, defaultValues_1.getDefaultItem)();
        }
        else if (this.isInHand(name) && canWeapon) {
            player.right = item;
            if (this.isWeapon(name))
                player.lastWeaponUse = Date.now();
        }
        else if (this.isHelmet(name) && canEquip) {
            if (player.helmet.id == id)
                player.helmet = (0, defaultValues_1.getDefaultHelmet)();
            else {
                player.helmet = item;
                player.lastHelmetUse = Date.now();
            }
        }
        else if (this.isPet(name)) {
            if (player.pet.id == id)
                player.pet = (0, defaultValues_1.getDefaultPet)();
            else
                player.pet = item;
        }
        else if (this.isFood(name)) {
            player.gauges.hunger = Math.min(100, player.gauges.hunger + item.value);
            if (item.poison)
                player.client.sendBinary(player.healthSystem.damage(this.server.config.damage_raw_food, ActionType_1.ActionType.HURT));
            player.client.sendU8([ClientPackets_1.ClientPackets.GAUGES_FOOD, player.gauges.hunger]);
            player.client.sendBinary(player.inventory.removeItem(id, 1));
        }
        else if (canWeapon) {
            player.right = {
                type: "unknown",
                id
            };
        }
        player.updateInfo();
    }
    isInHand(name) {
        return ["weapon", "shield", "tool", "hammer"].includes(this.items[name].type);
    }
    isFood(name) {
        return this.items[name].type == "food";
    }
    isPet(name) {
        return this.items[name].type === "pet";
    }
    isWeapon(name) {
        return this.items[name].type === "weapon";
    }
    isHelmet(name) {
        return this.items[name].type === "helmet";
    }
}
exports.InteractionSystem = InteractionSystem;
