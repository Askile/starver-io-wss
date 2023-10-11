"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobSystem = void 0;
const EntityType_1 = require("../../enums/types/EntityType");
const Animal_1 = require("../../entities/Animal");
const BiomeType_1 = require("../../enums/types/BiomeType");
const TileType_1 = require("../../enums/types/TileType");
class MobSystem {
    server;
    hasForestBiome;
    hasWinterBiome;
    hasDragonCave;
    hasLavaBiome;
    hasDesertBiome;
    hasIslandBiome;
    animalCounter = new Array(100).fill(0);
    constructor(server) {
        this.server = server;
        const biomes = server.map.biomes.map(biome => biome.type);
        this.hasForestBiome = biomes.includes(BiomeType_1.BiomeType.FOREST);
        this.hasWinterBiome = biomes.includes(BiomeType_1.BiomeType.WINTER);
        this.hasLavaBiome = biomes.includes(BiomeType_1.BiomeType.LAVA);
        this.hasDragonCave = biomes.includes(BiomeType_1.BiomeType.DRAGON);
        this.hasDesertBiome = biomes.includes(BiomeType_1.BiomeType.DESERT);
        this.hasIslandBiome = server.map.tiles.findIndex(tile => tile.type === TileType_1.TileType.SAND) !== -1;
    }
    tick() {
        if (this.hasForestBiome) {
            while (this.animalCounter[EntityType_1.EntityType.WOLF] < this.server.config.max_wolf) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.WOLF, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.SPIDER] < this.server.config.max_spider) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.SPIDER, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.RABBIT] < this.server.config.max_rabbit) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.RABBIT, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.BOAR] < this.server.config.max_boar) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.BOAR, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.HAWK] < this.server.config.max_hawk) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.HAWK, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.WHEAT_MOB] < this.server.config.max_wheat) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.WHEAT_MOB, this.server);
                entity.position = this.server.spawnSystem.getSpawnPoint("FOREST");
                entity.realPosition.set(entity.position);
                this.server.entities.push(entity);
            }
        }
        while (this.animalCounter[EntityType_1.EntityType.PIRANHA] < this.server.config.max_piranha) {
            const entity = new Animal_1.Animal(EntityType_1.EntityType.PIRANHA, this.server);
            this.server.entities.push(entity);
        }
        while (this.animalCounter[EntityType_1.EntityType.KRAKEN] < this.server.config.max_kraken) {
            const entity = new Animal_1.Animal(EntityType_1.EntityType.KRAKEN, this.server);
            this.server.entities.push(entity);
        }
        if (this.hasWinterBiome) {
            while (this.animalCounter[EntityType_1.EntityType.FOX] < this.server.config.max_fox) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.FOX, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.BEAR] < this.server.config.max_bear) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.BEAR, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.PENGUIN] < this.server.config.max_penguin) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.PENGUIN, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.BABY_MAMMOTH] < this.server.config.max_baby_mammoth) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.BABY_MAMMOTH, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.MAMMOTH] < this.server.config.max_mammoth) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.MAMMOTH, this.server);
                this.server.entities.push(entity);
            }
        }
        if (this.hasDragonCave) {
            while (this.animalCounter[EntityType_1.EntityType.DRAGON] < this.server.config.max_dragon) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.DRAGON, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.BABY_DRAGON] < this.server.config.max_baby_dragon) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.BABY_DRAGON, this.server);
                this.server.entities.push(entity);
            }
        }
        if (this.hasDesertBiome) {
            while (this.animalCounter[EntityType_1.EntityType.SAND_WORM] < this.server.config.max_sand_worm) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.SAND_WORM, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.VULTURE] < this.server.config.max_vulture) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.VULTURE, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.ALOE_VERA_MOB] < 100) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.ALOE_VERA_MOB, this.server);
                this.server.entities.push(entity);
            }
        }
        if (this.hasLavaBiome) {
            while (this.animalCounter[EntityType_1.EntityType.LAVA_DRAGON] < this.server.config.max_lava_dragon) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.LAVA_DRAGON, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.BABY_LAVA] < this.server.config.max_baby_lava) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.BABY_LAVA, this.server);
                this.server.entities.push(entity);
            }
            while (this.animalCounter[EntityType_1.EntityType.FLAME] < this.server.config.max_flame) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.FLAME, this.server);
                this.server.entities.push(entity);
            }
        }
        if (this.hasIslandBiome) {
            while (this.animalCounter[EntityType_1.EntityType.TREASURE_CHEST] < this.server.config.max_treasure) {
                const entity = new Animal_1.Animal(EntityType_1.EntityType.TREASURE_CHEST, this.server);
                entity.position = this.server.spawnSystem.getSpawnPoint("ISLAND");
                entity.realPosition.set(entity.position);
                this.server.entities.push(entity);
            }
        }
    }
}
exports.MobSystem = MobSystem;
