import {Entity} from "../Entity";
import {Server} from "../../Server";
import {EntityType} from "../../enums/EntityType";

export class Wall extends Entity {
    public durability: number = 0;
    constructor(type: number, server: Server) {
        super(type, server);

        switch (type) {
            case EntityType.WALL:
                this.durability = this.server.config.wood_wall_life;
            break;
            case EntityType.STONE_WALL:
                this.durability = this.server.config.stone_wall_life;
            break;
            case EntityType.GOLD_WALL:
                this.durability = this.server.config.gold_wall_life;
            break;
            case EntityType.DIAMOND_WALL:
                this.durability = this.server.config.diamond_wall_life;
            break;
            case EntityType.AMETHYST_WALL:
                this.durability = this.server.config.amethyst_wall_life;
            break;
            case EntityType.REIDITE_WALL:
                this.durability = this.server.config.reidite_wall_life;
            break;
        }

        this.info = 100;
        this.radius = 45;

        this.collide = true;
    }
}