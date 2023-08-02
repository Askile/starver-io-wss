import {Entity} from "../Entity";
import {Server} from "../../Server";
import NanoTimer from "nanotimer";
import {EntityType} from "../../enums/EntityType";

export class Fire extends Entity {
    constructor(type: number, server: Server) {
        super(type, server);

        this.radius = 0;
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
