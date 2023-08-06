import {Entity} from "./Entity";
import {Server} from "../Server";
import {Player} from "./Player";
import {InventoryType} from "../enums/InventoryType";
import {DeadBox} from "./DeadBox";

export class Spider extends Entity{
    constructor(type: number, server: Server) {
        super(type, server);

        this.radius = 35;
        this.collide = false;
    }

    public onDead(damager?: Entity) {
        if(damager instanceof Player) {
            damager.stats.score += 150;

            this.server.mobSystem.spiders = this.server.mobSystem.spiders.filter(spider => spider !== this);

            const box = new DeadBox(this.server, this);
            box.info = 50;

            box.healthSystem.health = 30;
        }
    }
}