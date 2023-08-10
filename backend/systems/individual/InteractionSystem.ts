import {Server} from "../../Server";
import {Player} from "../../entities/Player";
import Items from "../../JSON/Items.json";
import {InventoryType} from "../../enums/InventoryType";
import {getDefaultHelmet, getDefaultItem, getDefaultPet} from "../../default/defaultValues";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {ActionType} from "../../enums/ActionType";

export class InteractionSystem {
    private server: Server;
    private readonly items: any;
    constructor(server: Server) {
        this.server = server;
        this.items = Items;
    }

    public request(player: Player, id: number) {
        const name = InventoryType[id];

        if(!player.inventory.items.has(id) && id !== InventoryType.HAND) return;
        const canWeapon = Date.now() - player.lastWeaponUse >= this.server.config.weapon_delay;
        const canEquip = Date.now() - player.lastHelmetUse >= this.server.config.helmet_delay;

        const item = this.items[name];

        if(id === InventoryType.HAND && canWeapon) {
            player.right = getDefaultItem();
        } else if(this.isInHand(name) && canWeapon) {
            player.right = item;
            if(this.isWeapon(name)) player.lastWeaponUse = Date.now();
        } else if(this.isHelmet(name) && canEquip) {
            if (player.helmet.id == id) player.helmet = getDefaultHelmet();
            else {
                player.helmet = item;
                player.lastHelmetUse = Date.now();
            }
        } else if(this.isPet(name)) {
            if (player.pet.id == id) player.pet = getDefaultPet();
            else player.pet = item;
        } else if(this.isFood(name)){
            if(item.poison) player.client.sendBinary(player.healthSystem.damage(this.server.config.damage_raw_food, ActionType.HURT));
            if(item.value) {
                player.gauges.hunger = Math.min(100, player.gauges.hunger + item.value);
                player.client.sendU8([ClientPackets.GAUGES_FOOD, player.gauges.hunger]);
            }

            if(item.water) {
                player.gauges.thirst = Math.min(100, player.gauges.thirst + item.water);
                player.client.sendU8([ClientPackets.GAUGES_WATER, player.gauges.thirst]);
            }

            if(item.heal_boost) {
                player.gauges.bandage = Math.min(this.server.config.bandage_stack_limit, player.gauges.bandage + item.heal_boost);
                player.client.sendU8([ClientPackets.BANDAGE, player.gauges.bandage]);
            }

            player.client.sendBinary(player.inventory.removeItem(id, 1));
        } else if(canWeapon) {
            player.right = {
                type: "unknown",
                id
            }
        }

        player.updateInfo();
    }

    private isInHand(name: string) {
        return ["weapon", "shield", "tool", "hammer"].includes(this.items[name].type);
    }

    private isFood(name: string) {
        return this.items[name].type == "food";
    }

    private isPet(name: string) {
        return this.items[name].type === "pet";
    }

    private isWeapon(name: string) {
        return this.items[name].type === "weapon";
    }
    private isHelmet(name: string) {
        return this.items[name].type === "helmet";
    }
}