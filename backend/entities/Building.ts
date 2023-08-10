import {Server} from "../Server";
import {Entity} from "./Entity";
import {Inventory} from "../systems/individual/Inventory";

export class Building extends Entity {
    public inventory: Inventory;
    constructor(type: number, server: Server) {
        super(type, server);

        this.inventory = new Inventory(this, 5);

        this.setup();
    }

    public setup() {

    }
}