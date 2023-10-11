"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Vector_1 = require("../modules/Vector");
const HealthSystem_1 = require("../systems/individual/HealthSystem");
const ActionType_1 = require("../enums/types/ActionType");
const BiomeType_1 = require("../enums/types/BiomeType");
const EntityPacket_1 = require("../packets/EntityPacket");
class Entity {
    realPosition;
    position;
    velocity;
    server;
    lastAttack = 0;
    collide;
    isCollide = false;
    createdAt = Date.now();
    lavaBiome = false;
    island = false;
    bridge = false;
    roof = false;
    lava = false;
    water = false;
    attack = false;
    winter = false;
    desert = false;
    beach = false;
    lake = false;
    biomeIn = BiomeType_1.BiomeType.FOREST;
    forest = false;
    bed = false;
    tower = false;
    infire = false;
    plot = false;
    seed = false;
    healthSystem;
    damage;
    direction;
    radius;
    type;
    id;
    pid;
    speed;
    action;
    angle;
    extra;
    info;
    constructor(type, server) {
        this.server = server;
        this.type = type;
        this.id = 0;
        this.healthSystem = new HealthSystem_1.HealthSystem(this, this.server.configSystem?.health[type]);
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
        this.realPosition = new Vector_1.Vector(0, 0);
        this.position = new Vector_1.Vector(0, 0);
        this.velocity = new Vector_1.Vector(0, 0);
    }
    onDead(damager) { }
    onDamage(damager) { }
    onTick() { }
    onReceiveItem(id, count) { }
    lastTick() {
        this.position = this.position.clamp(0, 0, this.server.map.width - 1, this.server.map.height - 1);
        if (this.action & ActionType_1.ActionType.WEB)
            this.action &= ~ActionType_1.ActionType.WEB;
        if (this.action & ActionType_1.ActionType.HEAL)
            this.action &= ~ActionType_1.ActionType.HEAL;
        if (this.action & ActionType_1.ActionType.ATTACK)
            this.action &= ~ActionType_1.ActionType.ATTACK;
        if (this.action & ActionType_1.ActionType.HUNGER)
            this.action &= ~ActionType_1.ActionType.HUNGER;
        if (this.action & ActionType_1.ActionType.COLD)
            this.action &= ~ActionType_1.ActionType.COLD;
        if (this.action & ActionType_1.ActionType.HURT)
            this.action &= ~ActionType_1.ActionType.HURT;
    }
    updateSpeed() {
        this.speed = this.server.configSystem.speed[this.type];
    }
    delete() {
        this.server.entityPool.deleteId(this.id);
        this.action = ActionType_1.ActionType.DELETE;
        const players = this.server.map.getPlayersInDistance(this.realPosition, 2200);
        for (const player of players) {
            new EntityPacket_1.EntityPacket(player);
        }
        this.server.entities = this.server.entities.filter((entity) => entity != this);
    }
}
exports.Entity = Entity;
