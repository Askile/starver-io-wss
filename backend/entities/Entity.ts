import {Vector} from "../modules/Vector";
import {entitySpeed} from "./components/EntitySpeed";
import {entityBiome} from "./components/EntityBiome";
import {Server} from "../Server";
import ServerConfig from "../ServerConfig.json";
import NanoTimer from "nanotimer";
export class Entity {
    public position: Vector;
    public velocity: Vector;
    public direction: number;
    public server: Server;

    public old: any;
    public isCollide: boolean;
    public biomes: Biome[];

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

        this.id = 0;
        this.speed = entitySpeed[type] ?? 0;
        this.angle = 0;
        this.action = 0;
        this.info = 0;
        this.extra = 0;

        this.position = this.getSpawn();
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
        }

        this.isCollide = false;
        this.biomes = [];
    }

    public getSpawn() {
        let biomes = this.server.map.biomes.filter(biome => biome.type === entityBiome[this.type]);
        if(!biomes.length) return new Vector(0, 0);
        let iteration = 0;
        let maxIteration = 10000;
        let position;
        while (iteration < maxIteration) {
            iteration++;

            const biome = biomes[~~(Math.random() * biomes.length)];

            position = new Vector(
                (biome.position.x + ~~(Math.random() * biome.size.x)),
                (biome.position.y + ~~(Math.random() * biome.size.y))
            )

            const chunkX = Math.floor(position.x / 100);
            const chunkY = Math.floor(position.y / 100);
            if(!this.server.map.chunks[chunkY][chunkX]) {
                iteration = maxIteration;
            }
        }

        return position as Vector;
    }

    public queryUpdate() {
        return this.old.position.x !== this.position.x ||
               this.old.position.y !== this.position.y ||
               this.old.angle !== this.angle           ||
               this.old.action !== this.action         ||
               this.old.info !== this.info             ||
               this.old.extra !== this.extra           ||
               this.old.speed !== this.speed
    }

    public delete() {
        this.server.entityPool.deleteId(this.id);
        this.action = 1;
        new NanoTimer().setTimeout(() => {
            this.server.entities = this.server.entities.filter(entity => entity != this);
        }, [], 1 / ServerConfig.network_tps + "s");
    }
}