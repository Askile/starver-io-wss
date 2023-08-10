"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rabbit = void 0;
const Entity_1 = require("../Entity");
const Player_1 = require("../Player");
const InventoryType_1 = require("../../enums/InventoryType");
const DeadBox_1 = require("../DeadBox");
const Inventory_1 = require("../../systems/individual/Inventory");
const Cosmetics_1 = require("../../enums/Cosmetics");
const EntityType_1 = require("../../enums/EntityType");
class Rabbit extends Entity_1.Entity {
    inventory;
    constructor(server) {
        super(EntityType_1.EntityType.RABBIT, server);
        this.inventory = new Inventory_1.Inventory(this, 3);
        this.inventory.giveItem(InventoryType_1.InventoryType.FUR, 1);
        this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 2);
        this.radius = 35;
        this.collide = false;
    }
    onDead(damager) {
        if (damager instanceof Player_1.Player) {
            damager.stats.score += 60;
            this.server.mobSystem.spiders = this.server.mobSystem.spiders.filter(spider => spider !== this);
            const box = new DeadBox_1.DeadBox(this.server, this);
            box.info = Cosmetics_1.BOX.BOX_OF_THE_RABBIT;
            box.healthSystem.health = 30;
        }
    }
}
exports.Rabbit = Rabbit;
