import {Vector} from "../modules/Vector";
import {entitySpeed} from "./components/EntitySpeed";
import {Server} from "../Server";
import ServerConfig from "../JSON/ServerConfig.json";
import NanoTimer from "nanotimer";
import {EntityType} from "../enums/EntityType";
export class Entity {
    public position: Vector;
    public newPosition: Vector;
    public velocity: Vector;
    public direction: number;
    public server: Server;

    public old: any;

    public radius: number;
    public type: number;
    public id: number;
    public speed: number;
    public action: number;
    public angle: number;
    public extra: number;
    public info: number;
    constructor(type: number, server: Server) {
        this.server = server;
        this.type = type;

        this.id = server.entityPool.createId();
        this.speed = entitySpeed[type] ?? 0;
        this.radius = 25;
        this.angle = 0;
        this.action = 0;
        this.info = 0;
        this.extra = 0;

        this.position = new Vector(0, 0);
        this.newPosition = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.direction = 0;

        this.old = {
            position: this.position,
            angle: this.angle,
            info: this.info,
            action: this.action,
            speed: this.speed,
            extra: this.extra,
            type: this.type
        };
    }

    public queryUpdate() {
        return (
            this.old.position.x != this.position.x ||
            this.old.position.y != this.position.y ||
            this.old.angle != this.angle ||
            this.old.action != this.action ||
            this.old.info != this.info ||
            this.old.extra != this.extra ||
            this.old.speed != this.speed
        );
    }

    public delete() {
        this.server.entityPool.deleteId(this.id);
        this.action = 1;

        new NanoTimer().setTimeout(
            () => {
                this.server.entities = this.server.entities.filter((entity) => entity != this);
        }, [], 1 / ServerConfig.network_tps + "s");
    }

    public isFire() {
        return [EntityType.FIRE, EntityType.BIG_FIRE, EntityType.FURNACE].includes(this.type);
    }

    public isWorkbench() {
        return [EntityType.WORKBENCH].includes(this.type);
    }


}
