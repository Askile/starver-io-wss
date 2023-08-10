"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Door = void 0;
const Entity_1 = require("../Entity");
class Door extends Entity_1.Entity {
    constructor(type, server) {
        super(type, server);
        this.info = 200;
        this.radius = 45;
        this.collide = true;
    }
    onDamage(damager) {
        if (!damager)
            return;
        if (damager.position.distance(this.position) > damager.radius + this.radius - 2) {
            this.collide = !this.collide;
        }
        this.info = ~~(this.healthSystem.health / this.healthSystem.maxHealth * 200);
        if (!this.collide && !(this.info % 2)) {
            this.info -= 1;
        }
    }
}
exports.Door = Door;
