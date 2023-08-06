"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wall = void 0;
const Entity_1 = require("../Entity");
const EntityType_1 = require("../../enums/EntityType");
class Wall extends Entity_1.Entity {
    durability = 0;
    constructor(type, server) {
        super(type, server);
        switch (type) {
            case EntityType_1.EntityType.WALL:
                this.durability = this.server.config.wood_wall_life;
                break;
            case EntityType_1.EntityType.STONE_WALL:
                this.durability = this.server.config.stone_wall_life;
                break;
            case EntityType_1.EntityType.GOLD_WALL:
                this.durability = this.server.config.gold_wall_life;
                break;
            case EntityType_1.EntityType.DIAMOND_WALL:
                this.durability = this.server.config.diamond_wall_life;
                break;
            case EntityType_1.EntityType.AMETHYST_WALL:
                this.durability = this.server.config.amethyst_wall_life;
                break;
            case EntityType_1.EntityType.REIDITE_WALL:
                this.durability = this.server.config.reidite_wall_life;
                break;
        }
        this.info = 100;
        this.radius = 45;
    }
}
exports.Wall = Wall;
