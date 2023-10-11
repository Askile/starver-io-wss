"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crate = void 0;
const Entity_1 = require("./Entity");
const Inventory_1 = require("../systems/individual/Inventory");
const Player_1 = require("./Player");
const EntityType_1 = require("../enums/types/EntityType");
const ItemType_1 = require("../enums/types/ItemType");
const Animal_1 = require("./Animal");
class Crate extends Entity_1.Entity {
    inventory;
    isDead;
    owner;
    constructor(server, data) {
        super(EntityType_1.EntityType.CRATE, server);
        this.id = this.server.entityPool.createId();
        this.owner = data.owner ?? null;
        this.position = data.owner.realPosition;
        this.angle = data.owner.angle;
        this.info = this.owner instanceof Player_1.Player ? data.isDead ? this.owner.cosmetics.dead : this.owner.cosmetics.crate : 0;
        this.inventory = new Inventory_1.Inventory(this, 20);
        this.isDead = data.isDead ?? false;
        this.realPosition.set(this.position);
        data.item && data.count && this.inventory.giveItem(data.item, data.count);
        if ("inventory" in this.owner && data.isDead) {
            this.healthSystem.health = 300;
            this.inventory.addInventory(this.owner.inventory, 255);
        }
        this.radius = 25;
        this.server.entities.push(this);
    }
    onTick() {
        const now = Date.now();
        if (now - this.createdAt >= (this.isDead ? 480e3 : this.owner instanceof Animal_1.Animal ? 30000 : 16000)) {
            this.delete();
        }
    }
    onDead(damager) {
        if (damager instanceof Player_1.Player) {
            if (damager.id !== this.owner.id && this.owner instanceof Player_1.Player) {
                damager.ruinQuests();
            }
            damager.client.sendBinary(damager.inventory.addInventory(this.inventory, Infinity, this.owner instanceof Animal_1.Animal && damager.right.id === ItemType_1.ItemType.MACHETE));
        }
    }
}
exports.Crate = Crate;
