"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
const Entity_1 = require("./Entity");
const Inventory_1 = require("../systems/individual/Inventory");
class Building extends Entity_1.Entity {
    inventory;
    constructor(type, server) {
        super(type, server);
        this.inventory = new Inventory_1.Inventory(this, 5);
        this.setup();
    }
    setup() {
    }
}
exports.Building = Building;
