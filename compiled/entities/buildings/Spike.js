"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spike = void 0;
const Entity_1 = require("../Entity");
const EntityType_1 = require("../../enums/EntityType");
const Player_1 = require("../Player");
const ActionType_1 = require("../../enums/ActionType");
class Spike extends Entity_1.Entity {
    durability = 0;
    damage = 0;
    constructor(type, server) {
        super(type, server);
        switch (type) {
            case EntityType_1.EntityType.SPIKE:
                this.durability = this.server.config.wood_spike_life;
                this.damage = this.server.config.wood_spike_damage;
                break;
            case EntityType_1.EntityType.STONE_SPIKE:
                this.durability = this.server.config.stone_spike_life;
                this.damage = this.server.config.stone_spike_damage;
                break;
            case EntityType_1.EntityType.GOLD_SPIKE:
                this.durability = this.server.config.gold_spike_life;
                this.damage = this.server.config.gold_spike_damage;
                break;
            case EntityType_1.EntityType.DIAMOND_SPIKE:
                this.durability = this.server.config.diamond_spike_life;
                this.damage = this.server.config.diamond_spike_damage;
                break;
            case EntityType_1.EntityType.AMETHYST_SPIKE:
                this.durability = this.server.config.amethyst_spike_life;
                this.damage = this.server.config.amethyst_spike_damage;
                break;
            case EntityType_1.EntityType.REIDITE_SPIKE:
                this.durability = this.server.config.reidite_spike_life;
                this.damage = this.server.config.reidite_spike_damage;
                break;
        }
        this.info = 100;
        this.radius = 35;
        this.collide = true;
    }
    onDamage(damager) {
        if (damager instanceof Player_1.Player) {
            damager.client.sendBinary(damager.healthSystem.damage(this.damage, ActionType_1.ActionType.HURT, damager));
        }
    }
}
exports.Spike = Spike;
