"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpawnSystem = void 0;
const Vector_1 = require("../../modules/Vector");
class SpawnSystem {
    map;
    constructor(map) {
        this.map = map;
    }
    getSpawnPoint(biomeName) {
        const biome = this.getRandomBiome(biomeName);
        if (!biome)
            return new Vector_1.Vector(0, 0);
        let attempt = 10000;
        let position = new Vector_1.Vector(0, 0);
        while (attempt) {
            attempt--;
            position = new Vector_1.Vector(biome.position.x + ~~(Math.random() * biome.size.x), biome.position.y + ~~(Math.random() * biome.size.y));
            const tiles = this.map.getTiles(position.x, position.y, 1);
            if (tiles.length === 0) {
                attempt = 0;
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
