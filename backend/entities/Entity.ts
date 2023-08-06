import {Vector} from "../modules/Vector";
import {Server} from "../Server";
import ServerConfig from "../JSON/ServerConfig.json";
import NanoTimer from "nanotimer";
import {HealthSystem} from "../systems/individual/HealthSystem";
import {ActionType} from "../enums/ActionType";

export class Entity {
    public position: Vector;
    public velocity: Vector;
    public server: Server;

    public lastAttack: number = 0;
    public collide: boolean = false;

    public healthSystem: HealthSystem;
    
    public direction: number;
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

        this.healthSystem = new HealthSystem(this, this.server.configSystem?.health[type]);
        this.id = server.entityPool.createId();
        this.speed = this.server.configSystem.speed[type] * 1000 ?? 0;
        this.radius = 0;
        this.angle = 0;
        this.action = 0;
        this.info = 0;
        this.extra = 0;

        this.position = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.direction = 0;
    }

    public onDead(damager?: Entity) {}
    public onTick() {}
    public onDamage(damager?: Entity) {}

    public delete() {
        this.server.entityPool.deleteId(this.id);
        this.action = ActionType.DELETE;

        new NanoTimer().setTimeout(() => {
                this.server.entities = this.server.entities.filter((entity) => entity != this);
        }, [], 1 / ServerConfig.network_tps + "s");
    }

}
