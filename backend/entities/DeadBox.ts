import NanoTimer from "nanotimer";
import {Entity} from "./Entity";
import {Server} from "../Server";
import {EntityType} from "../enums/EntityType";
import {Player} from "./Player";
import {Inventory} from "../systems/individual/Inventory";

export class DeadBox extends Entity{
    public inventory: Inventory;
    constructor(server: Server, owner: Entity) {
        super(EntityType.DEAD_BOX, server);

        this.position = owner.position;
        this.angle = owner.angle;
        this.inventory = new Inventory(this, 16);
        this.radius = 25;

        if("inventory" in owner) {
            this.inventory.addInventory(owner.inventory as Inventory);
        }

        if(owner instanceof Player) {
            this.info = owner.cosmetics.dead;
        }

        this.server.entities.push(this);

        new NanoTimer().setTimeout(() => {
            this.delete();
        },[],"480s");
    }

    public onDead(damager: Entity) {
        if(damager instanceof Player) {

            damager.client.sendBinary(damager.inventory.addInventory(this.inventory));
        }
    }
}