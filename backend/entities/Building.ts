import {Server} from "../Server";
import {Entity} from "./Entity";

export class Building extends Entity {
    constructor(type: number, server: Server) {
        super(type, server);


    }
}