"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Door = void 0;
const Entity_1 = require("../Entity");
const EntityType_1 = require("../../enums/EntityType");
class Door extends Entity_1.Entity {
    durability = 0;
    constructor(type, server) {
        super(type, server);
        switch (type) {
            case EntityType_1.EntityType.WOOD_DOOR:
                this.durability = this.server.config.wood_door_life;
                break;
            case EntityType_1.EntityType.STONE_DOOR:
                this.durability = this.server.config.stone_door_life;
                break;
            case EntityType_1.EntityType.GOLD_DOOR:
                this.durability = this.server.config.gold_door_life;
                break;
            case EntityType_1.EntityType.DIAMOND_DOOR:
                this.durability = this.server.config.diamond_door_life;
                break;
            case EntityType_1.EntityType.AMETHYST_DOOR:
                this.durability = this.server.config.amethyst_door_life;
                break;
            case EntityType_1.EntityType.REIDITE_DOOR:
                this.durability = this.server.config.reidite_door_life;
                break;
        }
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
