"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
const Entity_1 = require("./Entity");
const Player_1 = require("./Player");
const DeadBox_1 = require("./DeadBox");
const Cosmetics_1 = require("../enums/Cosmetics");
const Inventory_1 = require("../systems/individual/Inventory");
class Animal extends Entity_1.Entity {
    score = 0;
    inventory;
    constructor(type, server) {
        super(type, server);
        this.inventory = new Inventory_1.Inventory(this, 16);
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
exports.Animal = Animal;
