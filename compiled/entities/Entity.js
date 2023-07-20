"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const Vector_1 = require("../modules/Vector");
const EntitySpeed_1 = require("./components/EntitySpeed");
const EntityBiome_1 = require("./components/EntityBiome");
const ServerConfig_json_1 = __importDefault(require("../JSON/ServerConfig.json"));
const nanotimer_1 = __importDefault(require("nanotimer"));
class Entity {
    position;
    velocity;
    direction;
    server;
    old;
    biomes;
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
        this.id = 0;
        this.speed = EntitySpeed_1.entitySpeed[type] ?? 0;
        this.angle = 0;
        this.action = 0;
        this.info = 0;
        this.extra = 0;
        this.position = this.getSpawn();
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
        this.biomes = [];
    }
    getSpawn() {
        let biomes = this.server.map.biomes.filter((biome) => biome.type === EntityBiome_1.entityBiome[this.type]);
        if (!biomes.length)
            return new Vector_1.Vector(0, 0);
        let iteration = 0;
        let maxIteration = 10000;
        let position;
        while (iteration < maxIteration) {
            iteration++;
            const biome = biomes[~~(Math.random() * biomes.length)];
            position = new Vector_1.Vector(biome.position.x + ~~(Math.random() * biome.size.x), biome.position.y + ~~(Math.random() * biome.size.y));
            const chunkX = Math.floor(position.x / 100);
            const chunkY = Math.floor(position.y / 100);
            if (!this.server.map.chunks[chunkY][chunkX]) {
                iteration = maxIteration;
            }
        }
        return position;
    }
    queryUpdate() {
        return this.old.position.x !== this.position.x || this.old.position.y !== this.position.y || this.old.angle !== this.angle || this.old.action !== this.action || this.old.info !== this.info || this.old.extra !== this.extra || this.old.speed !== this.speed;
    }
    delete() {
        this.server.entityPool.deleteId(this.id);
        this.action = 1;
        new nanotimer_1.default().setTimeout(() => {
            this.server.entities = this.server.entities.filter((entity) => entity != this);
        }, [], 1 / ServerConfig_json_1.default.network_tps + "s");
    }
}
exports.Entity = Entity;
