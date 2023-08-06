import {Server} from "../../Server";
import {Wolf} from "../../entities/Wolf";
import {EntityType} from "../../enums/EntityType";
import {Entity} from "../../entities/Entity";
import {Player} from "../../entities/Player";
import {ActionType} from "../../enums/ActionType";
import {Vector} from "../../modules/Vector";
import {Spider} from "../../entities/Spider";
import {Biome} from "../../world/map/Biome";

export class MobSystem {
    public server: Server;
    public wolfs: Wolf[] = [];
    public spiders: Spider[] = [];
    public lastPushStamp: number = 0;
    constructor(server: Server) {
        this.server = server;
    }

    private getTarget(entity: Entity): Entity | undefined {
        const entities = this.server.map.getEntities(entity.position.x, entity.position.y, 3);
        if(entities.length === 0) return;
        let target = undefined;
        let distance = 0;

        for (const unit of entities) {
            if(!(unit instanceof Player)) continue;

            const dist = unit.position.distance(entity.position);
            if(dist < 180) {
                distance = dist;
                target = unit;
            }
        }

        return target;
    }

    public tick() {

        while (this.wolfs.length < 60) {
            const entity = new Wolf(EntityType.WOLF, this.server);
            entity.position = this.server.spawnSystem.getSpawnPoint("FOREST");

            this.server.entities.push(entity);
            this.wolfs.push(entity);
        }

        // while (this.spiders.length < 100) {
        //     const entity = new Spider(EntityType.SPIDER, this.server);
        //     entity.position = this.server.spawnSystem.getSpawnPoint("FOREST");
        //
        //     this.server.entities.push(entity);
        //     this.spiders.push(entity);
        // }


            for (const wolf of this.wolfs) {
                if(Date.now() - wolf.lastPush <= this.server.config.damage_speed_wolf) continue;
                wolf.lastPush = Date.now();
                const target = this.getTarget(wolf);
                const biome = this.server.map.biomes.find(biome => biome.type === "FOREST") as Biome;

                if (target instanceof Player) {
                    if(wolf.position.distance(target.position) < 100) {
                        target.client.sendBinary(target.healthSystem.damage(40, ActionType.HURT, wolf));
                    }
                    wolf.angle = (((Math.atan2(target.position.y - wolf.position.y, target.position.x - wolf.position.x) + (Math.PI * 2)) % (Math.PI * 2)) * 255) / (Math.PI * 2) - 64;

                    wolf.position.x = Math.clamp(target.position.x, biome.position.x, biome.position.x + biome.size.x);
                    wolf.position.y = Math.clamp(target.position.y, biome.position.y, biome.position.y + biome.size.y);
                } else {
                    const newPosition = new Vector(
                        wolf.position.x + ~~(Math.random() * 280) - 140,
                        wolf.position.y + ~~(Math.random() * 280) - 140
                    )

                    wolf.angle = (((Math.atan2(newPosition.y - wolf.position.y, newPosition.x - wolf.position.x) + (Math.PI * 2)) % (Math.PI * 2)) * 255) / (Math.PI * 2) - 64;

                    wolf.position.x = Math.clamp(newPosition.x, biome.position.x, biome.position.x + biome.size.x);
                    wolf.position.y = Math.clamp(newPosition.y, biome.position.y, biome.position.y + biome.size.y);
                }
            // for (const spider of this.spiders) {
            //     const target = this.getTarget(spider);
            //
            //     if (target instanceof Player) {
            //         if(spider.position.distance(target.position) < 50) {
            //             target.client.sendBinary(target.healthSystem.damage(40, ActionType.HURT, spider));
            //         }
            //         spider.angle = (((Math.atan2(target.position.y - spider.position.y, target.position.x - spider.position.x) + (Math.PI * 2)) % (Math.PI * 2)) * 255) / (Math.PI * 2) - 64;
            //
            //         spider.position.x = target.position.x;
            //         spider.position.y = target.position.y;
            //     } else {
            //         const newPosition = new Vector(
            //             spider.position.x + ~~(Math.random() * 300) - 150,
            //             spider.position.y + ~~(Math.random() * 300) - 150
            //         )
            //
            //         spider.angle = (((Math.atan2(newPosition.y - spider.position.y, newPosition.x - spider.position.x) + (Math.PI * 2)) % (Math.PI * 2)) * 255) / (Math.PI * 2) - 64;
            //
            //         spider.position.x = newPosition.x;
            //         spider.position.y = newPosition.y;
            //     }
            //
            // }
            this.lastPushStamp = Date.now();
        }
    }
}