"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chest = void 0;
const Entity_1 = require("../Entity");
const EntityType_1 = require("../../enums/EntityType");
const Inventory_1 = require("../../systems/individual/Inventory");
class Chest extends Entity_1.Entity {
    inventory;
    constructor(server) {
        super(EntityType_1.EntityType.CHEST, server);
        this.inventory = new Inventory_1.Inventory(this, 1);
        this.radius = 25;
        this.collide = true;
    }
}
exports.Chest = Chest;
