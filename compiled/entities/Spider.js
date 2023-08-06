"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spider = void 0;
const Entity_1 = require("./Entity");
const Player_1 = require("./Player");
const DeadBox_1 = require("./DeadBox");
class Spider extends Entity_1.Entity {
    constructor(type, server) {
        super(type, server);
        this.radius = 35;
        this.collide = false;
    }
    onDead(damager) {
        if (damager instanceof Player_1.Player) {
            damager.stats.score += 150;
            this.server.mobSystem.spiders = this.server.mobSystem.spiders.filter(spider => spider !== this);
            const box = new DeadBox_1.DeadBox(this.server, this);
            box.info = 50;
            box.healthSystem.health = 30;
        }
    }
}
exports.Spider = Spider;
