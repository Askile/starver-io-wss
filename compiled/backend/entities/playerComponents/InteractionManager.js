"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionManager = void 0;
const Items_json_1 = __importDefault(require("../../JSON/Items.json"));
const InventoryType_1 = require("../../enums/InventoryType");
const defaultValues_1 = require("../../default/defaultValues");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
class InteractionManager {
    items;
    player;
    lastSwordUse = 0;
    lastHelmUse = 0;
    constructor(player) {
        this.items = Items_json_1.default;
        this.player = player;
        this.initConfig();
    }
    initConfig() {
        // const config = this.player.client.server.config;
        // this.items["BABY_MAMMOTH"].speed = config.speed_mount_baby_mammoth ?? this.items["BABY_MAMMOTH"].speed;
        // this.items["BABY_LAVA"].speed = config.speed_mount_baby_lava | this.items["BABY_LAVA"].speed;
        // this.items["BABY_DRAGON"].speed = config.speed_mount_baby_dragon ?? this.items["BABY_DRAGON"].speed;
    }
    useItem(id) {
        const itemName = InventoryType_1.InventoryType[id];
        if (id !== 7 && !this.player.inventory.items.has(id))
            return;
        if (id === 7 && Date.now() - this.lastSwordUse >= 10e3) {
            this.player.right = (0, defaultValues_1.getDefaultItem)();
        }
        else if (this.isInHand(itemName) && Date.now() - this.lastSwordUse >= 10e3) {
            this.player.right = this.items[itemName];
            if (this.isWeapon(itemName))
                this.lastSwordUse = Date.now();
        }
        else if (this.isHelmet(itemName) && Date.now() - this.lastHelmUse >= 5e3) {
            const helmet = this.items[itemName];
            if (this.player.helmet.id == id)
                this.player.helmet = (0, defaultValues_1.getDefaultHelmet)();
            else {
                this.player.helmet = helmet;
                this.lastHelmUse = Date.now();
            }
        }
        else if (this.isPet(itemName)) {
            const pet = this.items[itemName];
            if (this.player.pet.id == id) {
                this.player.pet = (0, defaultValues_1.getDefaultPet)();
            }
            else
                this.player.pet = pet;
        }
        else if (this.isFood(itemName)) {
            this.player.gauges.hunger += this.items[itemName].value;
            this.player.client.sendBinary(new Uint8Array([ClientPackets_1.ClientPackets.GAUGES_FOOD, this.player.gauges.hunger]));
            this.player.client.sendBinary(this.player.inventory.removeItem(id, 1));
        }
    }
    setEquipment() {
        this.player.info = this.player.right.id + this.player.helmet.id * 128;
        this.player.extra = this.player.pet.id;
    }
    isInHand(name) {
        return ["weapon", "shield", "tool"].includes(this.items[name].type);
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
exports.InteractionManager = InteractionManager;
