import {Entity} from "../Entity";
import {Server} from "../../Server";
import {Vector} from "../../modules/Vector";
import NanoTimer from "nanotimer";
import {EntityType} from "../../enums/EntityType";

export class Fire extends Entity {
    constructor(server: Server, type: number, position: Vector) {
        super(type, server);

        this.position = position;
        this.server.entities.push(this);

        if (this.getAliveTime()) {
            new NanoTimer().setTimeout(() => this.delete(), [], this.getAliveTime() + "s");
        }
    }

    private getAliveTime() {
        if (this.type === EntityType.FIRE) return 120;
        if (this.type === EntityType.BIG_FIRE) return 480;
        return 0;
    }
}
