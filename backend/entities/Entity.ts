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
    public collide: boolean;

    public healthSystem: HealthSystem;

    public damage: number;
    public direction: number;
    public radius: number;
    public type: number;
    public id: number;
    public pid: number;
    public speed: number;
    public action: number;
    public angle: number;
    public extra: number;
    public info: number;
    constructor(type: number, server: Server) {
        this.server = server;
        this.type = type;
        this.id = server.entityPool.createId();

        this.healthSystem = new HealthSystem(this, this.server.configSystem?.health[type]);
        this.speed = this.server.configSystem.speed[type] ?? 0;
        this.damage = this.server.configSystem.entityDamage[type] ?? 0;
        this.radius = this.server.configSystem.entityRadius[type] ?? 0;
        this.collide = this.server.configSystem.entityCollide[type] ?? 0;

        this.pid = 0;
        this.angle = 0;
        this.action = 0;
        this.info = 0;
        this.extra = 0;

        this.direction = 0;
        this.position = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
    }

    public onDead(damager?: Entity) {}
    public onDamage(damager?: Entity) {}

    public delete() {
        this.server.entityPool.deleteId(this.id);
        this.action = ActionType.DELETE;

        new NanoTimer().setTimeout(() => {
                this.server.entities = this.server.entities.filter((entity) => entity != this);
        }, [], 1 / ServerConfig.network_tps + "s");
    }

}
