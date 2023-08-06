import {Entity} from "./Entity";
import {Server} from "../Server";

export class Fruit extends Entity {
    constructor(type: number, server: Server) {
        super(type, server);

        this.server.entities.push(this);
    }
}