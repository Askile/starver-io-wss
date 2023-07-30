import {Map} from "../world/Map";
import {Biome} from "../world/map/Biome";
import {Vector} from "../modules/Vector";

export class SpawnSystem {
    private map: Map;
    constructor(map: Map) {
        this.map = map;
    }

    public getSpawnPoint(biomeName: string) {
        const biome = this.getRandomBiome(biomeName);
        let attempt = 1000;
        let position = new Vector(0, 0);
        while (attempt) {
            attempt--;

            position = new Vector(
                biome.position.x + ~~(Math.random() * biome.size.x),
                biome.position.y + ~~(Math.random() * biome.size.y)
            )

            const chunks = this.map.getChunks(position.x, position.y, 3);
            for (const chunk of chunks) {
                if(!chunk.tiles.length) {
                    attempt = 0;
                }
            }
        }
        return position;
    }

    private getRandomBiome(biomeName: string): Biome {
        const biomes = this.map.biomes.filter(biome => biome.type === biomeName);
        return biomes[~~(Math.random() * biomes.length)];
    }
}