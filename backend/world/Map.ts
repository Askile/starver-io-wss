import {Vector} from "../modules/Vector";
import {objects} from "../JSON/Resouces.json";

export class Map {
    private readonly tiles: any[] = [];
    public width: number;
    public height: number;

    public chunks: any[][] = [];
    public biomes: Biome[] = [];

    constructor(config: Config) {
        this.tiles = config.important.custom_map;
        this.width = config.important.map_width * 100;
        this.height = config.important.map_height * 100;
        this.initCollision();
        this.initBiomes();
    }

    public initBiomes() {
        for (const tile of this.tiles) {
            const [type, x, y, sx, sy] = tile.slice(1, 6);
            if (!this.isTileTypeBiome(type)) continue;
            this.biomes.push({
                type,
                position: new Vector(x * 100, y * 100),
                size: new Vector(sx * 100, sy * 100)
            } as any);
        }
    }

    public initCollision() {
        const numChunks = Math.ceil(this.width);
        this.chunks = Array(numChunks)
            .fill(null)
            .map(() =>
                Array(numChunks)
                    .fill([])
                    .map(() => [])
            );

        for (const tile of this.tiles) {
            const [type, subtype, x, y] = tile.slice(1);
            if (this.isTileTypeBiome(type)) continue;

            const chunkX = Math.floor(x);
            const chunkY = Math.floor(y);

            const chunkRow = this.chunks[chunkY][chunkX];

            const object = objects.find((object) => object.type == type && object.subtype == subtype);

            if (object)
                chunkRow.push({
                    type,
                    subtype,
                    id: object.id,
                    radius: object.radius,
                    x,
                    y
                });
        }
    }

    private isTileTypeBiome(type: string) {
        const biomeTypes = ["FOREST", "DRAGON", "DESERT", "LAVA", "WINTER"];
        return biomeTypes.includes(type);
    }
}
