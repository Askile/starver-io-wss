import {Entity} from "../Entity";
import {Server} from "../../Server";
import {EntityType} from "../../enums/EntityType";

export class Spike extends Entity {
    public durability: number = 0;
    constructor(type: number, server: Server) {
        super(type, server);

        switch (type) {
            case EntityType.SPIKE:
                this.durability = this.server.config.wood_spike_life;
                break;
            case EntityType.STONE_SPIKE:
                this.durability = this.server.config.stone_spike_life;
                break;
            case EntityType.GOLD_SPIKE:
                this.durability = this.server.config.gold_spike_life;
                break;
            case EntityType.DIAMOND_SPIKE:
                this.durability = this.server.config.diamond_spike_life;
                break;
            case EntityType.AMETHYST_SPIKE:
                this.durability = this.server.config.amethyst_spike_life;
                break;
            case EntityType.REIDITE_SPIKE:
                this.durability = this.server.config.reidite_spike_life;
                break;
        }

        this.info = 100;
        this.radius = 35;

        this.collide = true;

    }
}