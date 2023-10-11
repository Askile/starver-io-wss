"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnSystem = void 0;
const Vector_1 = require("../../modules/Vector");
const TileType_1 = require("../../enums/types/TileType");
class SpawnSystem {
    map;
    constructor(map) {
        this.map = map;
    }
    getSpawnPoint(biomeName) {
        const biome = this.getRandomBiome(biomeName);
        if (!biome && biomeName !== "ISLAND")
            return new Vector_1.Vector(0, 0);
        let attempt = 10000;
        let position = Vector_1.Vector.zero();
        if (biomeName === "ISLAND") {
            while (attempt) {
                attempt--;
                position.x = Math.random_clamp(10000, this.map.width - 1);
                position.y = Math.random_clamp(5000, this.map.height - 1);
                let chunk = this.map.getChunk(position.x, position.y);
                if (!chunk || !chunk.tiles)
                    continue;
                const tile = chunk.tiles.find(tile => tile.type === TileType_1.TileType.SAND);
                if (tile) {
                    attempt = 0;
                }
            }
        }
        else {
            while (attempt) {
                attempt--;
                position.x = Math.random_clamp(biome.position.x, biome.position.x + biome.size.x);
                position.y = Math.random_clamp(biome.position.y, biome.position.y + biome.size.y);
                const tiles = this.map.getTiles(position.x, position.y, 2);
                const entities = this.map.getEntities(position.x, position.y, 2);
                if (tiles.length === 0 && entities.length === 0) {
                    attempt = 0;
                }
            }
        }
        return position;
    }
    getRandomBiome(biomeName) {
        const biomes = this.map.biomes.filter(biome => biome.type === biomeName);
        return biomes[~~(Math.random() * biomes.length)];
    }
}
exports.SpawnSystem = SpawnSystem;
