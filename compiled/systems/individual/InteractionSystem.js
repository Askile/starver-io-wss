"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionSystem = void 0;
const ItemType_1 = require("../../enums/types/ItemType");
const Item_1 = require("../../entities/Item");
class InteractionSystem {
    server;
    items;
    constructor(server) {
        this.server = server;
        this.items = [];
        for (let i = 0; i < Object.values(ItemType_1.ItemType).length / 2; i++) {
            this.items[i] = new Item_1.Item(i, server.configSystem);
        }
    }
    request(player, id) {
        const item = this.items[id];
        const canWeapon = Date.now() - player.lastWeaponUse >= this.server.config.weapon_delay;
        const canEquip = Date.now() - player.lastHelmetUse >= this.server.config.helmet_delay;
        if (!item.equal(ItemType_1.ItemType.HAND) && (!item || !player.inventory.containsItem(id, 1)))
            return;
        if (item.isHat()) {
            if ((item.isCooldown() || player.helmet.isCooldown()) && !canEquip)
                return;
            if (!player.helmet.equal(id)) {
                player.helmet = item;
                if (item.isCooldown())
                    player.lastHelmetUse = Date.now();
            }
            else
                player.helmet = this.items[ItemType_1.ItemType.HAND];
        }
        else if (item.isFood()) {
            if (item.id === ItemType_1.ItemType.BANDAGE && player.gauges.bandage === player.server.config.bandage_stack_limit)
                return;
            if (item.equal(ItemType_1.ItemType.BOTTLE_FULL)) {
                player.client.sendBinary(player.inventory.giveItem(ItemType_1.ItemType.BOTTLE_EMPTY, 1));
            }
            player.gauges.hunger += item.food;
            player.gauges.thirst += item.water;
            player.gauges.bandage += item.heal;
            player.gauges.cold -= item.cold;
            player.client.sendBinary(player.inventory.removeItem(item.id, 1));
            player.gauges.clamp();
            player.gauges.updateClientGauges();
        }
        else if (item.isVehicle()) {
            if (player.vehicle.equal(item.id)) {
                player.vehicle = this.items[ItemType_1.ItemType.HAND];
            }
            else
                player.vehicle = item;
        }
        else if (item.isEquipment()) {
            if ((item.isSlowDown() || player.right.isSlowDown()) && !canWeapon)
                return;
            player.right = item;
            if (item.isSlowDown())
                player.lastWeaponUse = Date.now();
        }
        else if (item.equal(ItemType_1.ItemType.HAND) && canWeapon) {
            player.right = this.items[ItemType_1.ItemType.HAND];
        }
        player.updateInfo();
    }
}
exports.InteractionSystem = InteractionSystem;
