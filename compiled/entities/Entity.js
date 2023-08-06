"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Vector_1 = require("../modules/Vector");
const ServerConfig_json_1 = __importDefault(require("../JSON/ServerConfig.json"));
const nanotimer_1 = __importDefault(require("nanotimer"));
const HealthSystem_1 = require("../systems/individual/HealthSystem");
const ActionType_1 = require("../enums/ActionType");
class Entity {
    position;
    velocity;
    server;
    lastAttack = 0;
    collide = false;
    healthSystem;
    direction;
    radius;
    type;
    id;
    speed;
    action;
    angle;
    extra;
    info;
    constructor(type, server) {
        this.server = server;
        this.type = type;
        this.healthSystem = new HealthSystem_1.HealthSystem(this, this.server.configSystem?.health[type]);
        this.id = server.entityPool.createId();
        this.speed = this.server.configSystem.speed[type] * 1000 ?? 0;
        this.radius = 0;
        this.angle = 0;
        this.action = 0;
        this.info = 0;
        this.extra = 0;
        this.position = new Vector_1.Vector(0, 0);
        this.velocity = new Vector_1.Vector(0, 0);
        this.direction = 0;
    }
    onDead(damager) { }
    onTick() { }
    onDamage(damager) { }
    delete() {
        this.server.entityPool.deleteId(this.id);
        this.action = ActionType_1.ActionType.DELETE;
        new nanotimer_1.default().setTimeout(() => {
            this.server.entities = this.server.entities.filter((entity) => entity != this);
        }, [], 1 / ServerConfig_json_1.default.network_tps + "s");
    }
}
exports.Entity = Entity;
