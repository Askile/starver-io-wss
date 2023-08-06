import {Entity} from "../Entity";
import {Server} from "../../Server";

export class Bridge extends Entity {
    public durability: number = 100;
    constructor(type: number, server: Server) {
        super(type, server);

        this.info = 100;
    }
}