import Items from "../../JSON/Items.json";
import {InventoryType} from "../../enums/InventoryType";
import {Player} from "../Player";
import {getDefaultHelmet, getDefaultItem, getDefaultPet} from "../../default/defaultValues";
import {ClientPackets} from "../../enums/packets/ClientPackets";
export class InteractionManager {
    private items: any;
    private player: Player;
    private lastSwordUse: number = 0;
    private lastHelmUse: number = 0;
    constructor(player: Player) {
        this.items = Items;
        this.player = player;

        this.initConfig();
    }

    private initConfig() {
        // const config = this.player.client.server.config;
        // this.items["BABY_MAMMOTH"].speed = config.speed_mount_baby_mammoth ?? this.items["BABY_MAMMOTH"].speed;
        // this.items["BABY_LAVA"].speed = config.speed_mount_baby_lava | this.items["BABY_LAVA"].speed;
        // this.items["BABY_DRAGON"].speed = config.speed_mount_baby_dragon ?? this.items["BABY_DRAGON"].speed;
    }

    public useItem(id: number) {
        const itemName = InventoryType[id];
        if (id !== 7 && !this.player.inventory.items.has(id)) return;

        if (id === 7 && Date.now() - this.lastSwordUse >= 10e3) {
            this.player.right = getDefaultItem();
        } else if (this.isInHand(itemName) && Date.now() - this.lastSwordUse >= 10e3) {
            this.player.right = this.items[itemName];
            if (this.isWeapon(itemName)) this.lastSwordUse = Date.now();
        } else if (this.isHelmet(itemName) && Date.now() - this.lastHelmUse >= 5e3) {
            const helmet = this.items[itemName];
            if (this.player.helmet.id == id) this.player.helmet = getDefaultHelmet();
            else {
                this.player.helmet = helmet;
                this.lastHelmUse = Date.now();
            }
        } else if (this.isPet(itemName)) {
            const pet = this.items[itemName];
            if (this.player.pet.id == id) {
                this.player.pet = getDefaultPet();
            } else this.player.pet = pet;
        } else if (this.isFood(itemName)) {
            this.player.gauges.hunger += this.items[itemName].value;
            this.player.client.sendBinary(new Uint8Array([ClientPackets.GAUGES_FOOD, this.player.gauges.hunger]));
            this.player.client.sendBinary(this.player.inventory.removeItem(id, 1));
        }
    }

    public setEquipment() {
        this.player.info = this.player.right.id + this.player.helmet.id * 128;
        this.player.extra = this.player.pet.id;
    }

    private isInHand(name: string) {
        return ["weapon", "shield", "tool"].includes(this.items[name].type);
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
