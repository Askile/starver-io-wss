import {Entity} from "../Entity";
import {Server} from "../../Server";

export class Well extends Entity {
    constructor(type: number, server: Server) {
        super(type, server);
    }
}