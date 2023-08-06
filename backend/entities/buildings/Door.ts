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

        this.info = 200;
        this.radius = 45;

        this.collide = true;
    }

    public onDamage(damager?: Entity) {
        if(!damager) return;
        if(damager.position.distance(this.position) > damager.radius + this.radius - 2) {
            this.collide =! this.collide;
        }
        this.info = ~~(this.healthSystem.health / this.healthSystem.maxHealth * 200);

        if(!this.collide && !(this.info % 2)) {
            this.info -= 1;
        }

    }
}