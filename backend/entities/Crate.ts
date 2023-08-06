import {Entity} from "./Entity";
import {Server} from "../Server";
import NanoTimer from "nanotimer";
import {Inventory} from "../systems/individual/Inventory";
import {Player} from "./Player";
import {EntityType} from "../enums/EntityType";

export class Crate extends Entity {
    public inventory: Inventory;
    constructor(server: Server, data: any) {
        super(EntityType.CRATE, server);

        this.position = data.owner.position;
        this.angle = data.owner.angle;
        this.info = data.owner.cosmetics.crate ?? 10;
        this.inventory = new Inventory(this, 16);
        this.inventory.giveItem(data.item, data.count);

        this.radius = 25;
        this.server.entities.push(this);

        new NanoTimer().setTimeout(() => {
                this.delete();
        },[],"16s");
    }

    public onDead(damager: Entity) {
        if(damager instanceof Player) {
            damager.client.sendBinary(damager.inventory.addInventory(this.inventory));
        }
    }
}