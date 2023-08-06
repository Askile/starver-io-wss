import {Entity} from "./Entity";
import {Server} from "../Server";
import {Player} from "./Player";
import {InventoryType} from "../enums/InventoryType";
import {DeadBox} from "./DeadBox";
import {Inventory} from "../systems/individual/Inventory";

export class Wolf extends Entity{
    public lastPush: number = 0;
    public pushTime: number = 1000;
    public inventory: Inventory;
    constructor(type: number, server: Server) {
        super(type, server);

        this.inventory = new Inventory(this, 3);

        this.inventory.giveItem(InventoryType.FUR_WOLF, 1);
        this.inventory.giveItem(InventoryType.MEAT, 2);

        this.radius = 35;
        this.collide = false;
    }

    public onDead(damager?: Entity) {
        if(damager instanceof Player) {
            damager.stats.score += 250;

            this.server.mobSystem.wolfs = this.server.mobSystem.wolfs.filter(wolf => wolf !== this);

            const box = new DeadBox(this.server, this);
            box.info = 50;

            box.healthSystem.health = 30;
        }
    }
}