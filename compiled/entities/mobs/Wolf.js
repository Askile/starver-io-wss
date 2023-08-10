"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wolf = void 0;
const Entity_1 = require("../Entity");
const Player_1 = require("../Player");
const InventoryType_1 = require("../../enums/InventoryType");
const DeadBox_1 = require("../DeadBox");
const Inventory_1 = require("../../systems/individual/Inventory");
const Cosmetics_1 = require("../../enums/Cosmetics");
const EntityType_1 = require("../../enums/EntityType");
class Wolf extends Entity_1.Entity {
    lastPush = 0;
    pushTime = 1000;
    inventory;
    constructor(server) {
        super(EntityType_1.EntityType.WOLF, server);
        this.inventory = new Inventory_1.Inventory(this, 3);
        this.inventory.giveItem(InventoryType_1.InventoryType.FUR_WOLF, 1);
        this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 2);
        this.radius = 35;
        this.collide = false;
    }
    onDead(damager) {
        if (damager instanceof Player_1.Player) {
            damager.stats.score += 250;
            this.server.mobSystem.wolfs = this.server.mobSystem.wolfs.filter(wolf => wolf !== this);
            const box = new DeadBox_1.DeadBox(this.server, this);
            box.info = Cosmetics_1.BOX.BOX_OF_THE_WOLF;
            box.healthSystem.health = 30;
        }
    }
}
exports.Wolf = Wolf;
