"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crate = void 0;
const Entity_1 = require("./Entity");
const nanotimer_1 = __importDefault(require("nanotimer"));
const Inventory_1 = require("../systems/individual/Inventory");
const Player_1 = require("./Player");
const EntityType_1 = require("../enums/EntityType");
class Crate extends Entity_1.Entity {
    inventory;
    constructor(server, data) {
        super(EntityType_1.EntityType.CRATE, server);
        this.position = data.owner.position;
        this.angle = data.owner.angle;
        this.info = data.owner.cosmetics.crate ?? 10;
        this.inventory = new Inventory_1.Inventory(this, 16);
        this.inventory.giveItem(data.item, data.count);
        this.radius = 25;
        this.server.entities.push(this);
        new nanotimer_1.default().setTimeout(() => {
            this.delete();
        }, [], "16s");
    }
    onDead(damager) {
        if (damager instanceof Player_1.Player) {
            damager.client.sendBinary(damager.inventory.addInventory(this.inventory));
        }
    }
}
exports.Crate = Crate;
