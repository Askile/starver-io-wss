import {Entity} from "../Entity";
import {Server} from "../../Server";
import {EntityType} from "../../enums/EntityType";

export class Door extends Entity {
    public durability: number = 0;
    constructor(type: number, server: Server) {
        super(type, server);

        switch (type) {
            case EntityType.WOOD_DOOR:
                this.durability = this.server.config.wood_door_life;
                break;
            case EntityType.STONE_DOOR:
                this.durability = this.server.config.stone_door_life;
                break;
            case EntityType.GOLD_DOOR:
                this.durability = this.server.config.gold_door_life;
                break;
            case EntityType.DIAMOND_DOOR:
                this.durability = this.server.config.diamond_door_life;
                break;
            case EntityType.AMETHYST_DOOR:
                this.durability = this.server.config.amethyst_door_life;
                break;
            case EntityType.REIDITE_DOOR:
                this.durability = this.server.config.reidite_door_life;
                break;
        }

        this.info = 100 * 127;
        this.radius = 45;
    }
}