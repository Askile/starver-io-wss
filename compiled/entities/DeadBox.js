"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeadBox = void 0;
const nanotimer_1 = __importDefault(require("nanotimer"));
const Entity_1 = require("./Entity");
const EntityType_1 = require("../enums/EntityType");
const Player_1 = require("./Player");
const Inventory_1 = require("../systems/individual/Inventory");
class DeadBox extends Entity_1.Entity {
    inventory;
    constructor(server, owner) {
        super(EntityType_1.EntityType.DEAD_BOX, server);
        this.position = owner.position;
        this.angle = owner.angle;
        this.inventory = new Inventory_1.Inventory(this, 16);
        this.radius = 25;
        if ("inventory" in owner) {
            this.inventory.addInventory(owner.inventory);
        }
        if (owner instanceof Player_1.Player) {
            this.info = owner.cosmetics.dead;
        }
        this.server.entities.push(this);
        new nanotimer_1.default().setTimeout(() => {
            this.delete();
        }, [], "480s");
    }
    onDead(damager) {
        if (damager instanceof Player_1.Player) {
            damager.client.sendBinary(damager.inventory.addInventory(this.inventory));
        }
    }
}
exports.DeadBox = DeadBox;
