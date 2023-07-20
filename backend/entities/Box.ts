import {Entity} from "./Entity";
import {Server} from "../Server";
import NanoTimer from "nanotimer";
import ServerConfig from "../JSON/ServerConfig.json";

export class Box extends Entity {
    private item: number;
    private count: number;
    constructor(server: Server, type: number, data: any) {
        super(type, server);

        this.position = data.owner.position;
        this.info = data.owner.cosmetics.crate;
        this.item = data.item;
        this.count = data.count;

        this.id = this.server.entityPool.createId();
        this.server.entities.push(this);

        new NanoTimer().setTimeout(
            () => {
                this.delete();
            },
            [],
            "16s"
        );
    }
}
