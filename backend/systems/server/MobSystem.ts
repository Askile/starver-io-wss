import {Server} from "../../Server";
import {EntityType} from "../../enums/EntityType";
import {Entity} from "../../entities/Entity";
import {Player} from "../../entities/Player";
import {Animal} from "../../entities/Animal";

export class MobSystem {
    public server: Server;

    public wolfs: Animal[] = [];
    public spiders: Animal[] = [];
    public rabbits: Animal[] = [];
    public foxes: Animal[] = [];
    public bears: Animal[] = [];
    public dragons: Animal[] = [];
    public lava_dragons: Animal[] = [];

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
            if(distance <= dist && dist < 180) {
                distance = dist;
                target = unit;
            }
        }

        return target;
    }

    public tick() {

        while (this.wolfs.length < this.server.config.max_wolf) {
            const entity = new Animal(EntityType.WOLF, this.server);
            entity.position = this.server.spawnSystem.getSpawnPoint("FOREST");

            this.server.entities.push(entity);
            this.wolfs.push(entity);
        }

        while (this.spiders.length < this.server.config.max_spider) {
            const entity = new Animal(EntityType.SPIDER, this.server);
            entity.position = this.server.spawnSystem.getSpawnPoint("FOREST");

            this.server.entities.push(entity);
            this.spiders.push(entity);
        }

        while (this.rabbits.length < this.server.config.max_rabbit) {
            const entity = new Animal(EntityType.RABBIT, this.server);
            entity.position = this.server.spawnSystem.getSpawnPoint("FOREST");

            this.server.entities.push(entity);
            this.rabbits.push(entity);
        }

        while (this.foxes.length < this.server.config.max_fox) {
            const entity = new Animal(EntityType.FOX, this.server);
            entity.position = this.server.spawnSystem.getSpawnPoint("WINTER");

            this.server.entities.push(entity);
            this.foxes.push(entity);
        }

        while (this.bears.length < this.server.config.max_bear) {
            const entity = new Animal(EntityType.BEAR, this.server);
            entity.position = this.server.spawnSystem.getSpawnPoint("WINTER");

            this.server.entities.push(entity);
            this.bears.push(entity);
        }

        while (this.dragons.length < this.server.config.max_dragon) {
            const entity = new Animal(EntityType.DRAGON, this.server);
            entity.position = this.server.spawnSystem.getSpawnPoint("DRAGON");

            this.server.entities.push(entity);
            this.dragons.push(entity);
        }

        while (this.lava_dragons.length < this.server.config.max_lava_dragon) {
            const entity = new Animal(EntityType.LAVA_DRAGON, this.server);
            entity.position = this.server.spawnSystem.getSpawnPoint("LAVA");

            this.server.entities.push(entity);
            this.lava_dragons.push(entity);
        }

            // for (const wolf of this.wolfs) {
            //     if(Date.now() - wolf.lastPush <= this.server.config.damage_speed_wolf) continue;
            //     wolf.lastPush = Date.now();
            //     const target = this.getTarget(wolf);
            //     const biome = this.server.map.biomes.find(biome => biome.type === "FOREST") as Biome;
            //
            //     if (target instanceof Player) {
            //         if(wolf.position.distance(target.position) < 100) {
            //             target.helmet.mob_defense = target.helmet.mob_defense || 0;
            //             target.right.mob_defense = target.right.mob_defense || 0;
            //             target.client.sendBinary(target.healthSystem.damage(40 + target.helmet.mob_defense + target.right.mob_defense, ActionType.HURT, wolf));
            //         }
            //
            //         wolf.angle = (((Math.atan2(target.position.y - wolf.position.y, target.position.x - wolf.position.x) + (Math.PI * 2)) % (Math.PI * 2)) * 255) / (Math.PI * 2) - 64;
            //
            //         wolf.position.x = Math.clamp(target.position.x, biome.position.x, biome.position.x + biome.size.x);
            //         wolf.position.y = Math.clamp(target.position.y, biome.position.y, biome.position.y + biome.size.y);
            //     } else {
            //         const newPosition = new Vector(
            //             wolf.position.x + ~~(Math.random() * 280) - 140,
            //             wolf.position.y + ~~(Math.random() * 280) - 140
            //         )
            //
            //         wolf.angle = (((Math.atan2(newPosition.y - wolf.position.y, newPosition.x - wolf.position.x) + (Math.PI * 2)) % (Math.PI * 2)) * 255) / (Math.PI * 2) - 64;
            //
            //         wolf.position.x = Math.clamp(newPosition.x, biome.position.x, biome.position.x + biome.size.x);
            //         wolf.position.y = Math.clamp(newPosition.y, biome.position.y, biome.position.y + biome.size.y);
            //     }
            //     this.lastPushStamp = Date.now();
            // }
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
    }
}