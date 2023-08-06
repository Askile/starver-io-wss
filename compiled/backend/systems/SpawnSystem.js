"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnSystem = void 0;
const Vector_1 = require("../modules/Vector");
class SpawnSystem {
    map;
    constructor(map) {
        this.map = map;
    }
    getSpawnPoint(biomeName) {
        const biome = this.getRandomBiome(biomeName);
        if (!biome)
            return new Vector_1.Vector(0, 0);
        let attempt = 1000;
        let position = new Vector_1.Vector(0, 0);
        while (attempt) {
            attempt--;
            position = new Vector_1.Vector(biome.position.x + ~~(Math.random() * biome.size.x), biome.position.y + ~~(Math.random() * biome.size.y));
            const chunks = this.map.getChunks(position.x, position.y, 5);
            for (const chunk of chunks) {
                if (!chunk.tiles.length) {
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
