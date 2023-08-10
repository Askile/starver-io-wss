"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bear = void 0;
const Entity_1 = require("../Entity");
const Player_1 = require("../Player");
const InventoryType_1 = require("../../enums/InventoryType");
const DeadBox_1 = require("../DeadBox");
const Inventory_1 = require("../../systems/individual/Inventory");
const Cosmetics_1 = require("../../enums/Cosmetics");
const EntityType_1 = require("../../enums/EntityType");
class Bear extends Entity_1.Entity {
    inventory;
    constructor(server) {
        super(EntityType_1.EntityType.BEAR, server);
        this.inventory = new Inventory_1.Inventory(this, 3);
        this.inventory.giveItem(InventoryType_1.InventoryType.FUR_WINTER, 2);
        this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 3);
        this.radius = 35;
        this.collide = false;
    }
    onDead(damager) {
        if (damager instanceof Player_1.Player) {
            damager.stats.score += 500;
            this.server.mobSystem.bears = this.server.mobSystem.spiders.filter(bear => bear !== this);
            const box = new DeadBox_1.DeadBox(this.server, this);
            box.info = Cosmetics_1.BOX.BOX_OF_THE_BEAR;
            box.healthSystem.health = 30;
        }
    }
}
exports.Bear = Bear;
