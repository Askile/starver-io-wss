"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Vector_1 = require("../modules/Vector");
const EntitySpeed_1 = require("./components/EntitySpeed");
const ServerConfig_json_1 = __importDefault(require("../JSON/ServerConfig.json"));
const nanotimer_1 = __importDefault(require("nanotimer"));
const EntityType_1 = require("../enums/EntityType");
class Entity {
    position;
    newPosition;
    velocity;
    direction;
    server;
    old;
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
        this.id = server.entityPool.createId();
        this.speed = EntitySpeed_1.entitySpeed[type] ?? 0;
        this.radius = 25;
        this.angle = 0;
        this.action = 0;
        this.info = 0;
        this.extra = 0;
        this.position = new Vector_1.Vector(0, 0);
        this.newPosition = new Vector_1.Vector(0, 0);
        this.velocity = new Vector_1.Vector(0, 0);
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
    queryUpdate() {
        return (this.old.position.x != this.position.x ||
            this.old.position.y != this.position.y ||
            this.old.angle != this.angle ||
            this.old.action != this.action ||
            this.old.info != this.info ||
            this.old.extra != this.extra ||
            this.old.speed != this.speed);
    }
    delete() {
        this.server.entityPool.deleteId(this.id);
        this.action = 1;
        new nanotimer_1.default().setTimeout(() => {
            this.server.entities = this.server.entities.filter((entity) => entity != this);
        }, [], 1 / ServerConfig_json_1.default.network_tps + "s");
    }
    isFire() {
        return [EntityType_1.EntityType.FIRE, EntityType_1.EntityType.BIG_FIRE, EntityType_1.EntityType.FURNACE].includes(this.type);
    }
    isWorkbench() {
        return [EntityType_1.EntityType.WORKBENCH].includes(this.type);
    }
}
exports.Entity = Entity;
