"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spike = void 0;
const Entity_1 = require("../Entity");
const EntityType_1 = require("../../enums/EntityType");
class Spike extends Entity_1.Entity {
    durability = 0;
    constructor(type, server) {
        super(type, server);
        switch (type) {
            case EntityType_1.EntityType.SPIKE:
                this.durability = this.server.config.wood_spike_life;
                break;
            case EntityType_1.EntityType.STONE_SPIKE:
                this.durability = this.server.config.stone_spike_life;
                break;
            case EntityType_1.EntityType.GOLD_SPIKE:
                this.durability = this.server.config.gold_spike_life;
                break;
            case EntityType_1.EntityType.DIAMOND_SPIKE:
                this.durability = this.server.config.diamond_spike_life;
                break;
            case EntityType_1.EntityType.AMETHYST_SPIKE:
                this.durability = this.server.config.amethyst_spike_life;
                break;
            case EntityType_1.EntityType.REIDITE_SPIKE:
                this.durability = this.server.config.reidite_spike_life;
                break;
        }
        this.info = 100;
        this.radius = 35;
        this.collide = true;
    }
}
exports.Spike = Spike;
