import {Vector} from "../modules/Vector";
import {objects} from "../JSON/Resouces.json";
import {Biome} from "./map/Biome";
import {Tile} from "./map/Tile";

export class Map {
    private readonly objects: any[] = [];
    public width: number;
    public height: number;

    public grid: any[][][] = [];
    public entitiesGrid: any[][][] = [];
    public biomes: Biome[] = [];

    constructor(config: Config) {
        this.objects = config.important.custom_map;
        this.width = config.important.map_width * 100;
        this.height = config.important.map_height * 100;
        this.initCollision();
        this.initBiomes();
    }

    public initBiomes() {
        for (const tile of this.objects) {
            const [type, x, y, sx, sy] = tile.slice(1, 6);
            if (!this.isTileTypeBiome(type)) continue;
            this.biomes.push(new Biome(type, new Vector(x * 100, y * 100), new Vector(sx * 100, sy * 100)));
        }
    }

    public updateEntities() {
        const numChunks = Math.ceil(this.height / 100);
        this.entitiesGrid = Array(numChunks)
            .fill(null)
            .map(() =>
                Array(numChunks)
                    .fill([])
                    .map(() => [])
            );
    }

    /**
     * Initialize chunks to map
     */
    public initCollision() {
        const numChunks = Math.ceil(this.height / 100);
        this.grid = Array(numChunks)
            .fill(null)
            .map(() =>
                Array(numChunks)
                    .fill([])
                    .map(() => [])
            );

        for (const tile of this.objects) {
            let [type, subtype, x, y] = tile.slice(1);

            if (tile.length == 5) {
                y = x;
                x = subtype;
                subtype = 0;
            }

            if (this.isTileTypeBiome(type)) continue;

            const object = objects.find((object) => object.type == type && object.subtype == subtype);

            if (object) {
                this.grid[Math.floor(y)][Math.floor(x)].push(new Tile(new Vector(x, y), object));
            }
        }
    }

    /**
     * Retrieves chunks of data from a 2D grid based on the provided coordinates and size.
     *
     * @param {number} x - The X-coordinate to start retrieving chunks from.
     * @param {number} y - The Y-coordinate to start retrieving chunks from.
     * @param {number} size - The size of the area to retrieve chunks around the specified coordinates.
     * @returns {Array<any>} An array containing the chunks of data retrieved from the grid.
     */
    public getTiles(x: number, y: number, size: number) {
        const chunkX = Math.floor(x / 100);
        const chunkY = Math.floor(y / 100);
        const tiles = [];

        for (let offsetY = -size; offsetY <= size; offsetY++) {
            const chunkRow = this.grid[chunkY + offsetY];

            for (let offsetX = -size; offsetX <= size; offsetX++) {
                const row = chunkRow && chunkRow[chunkX + offsetX];
                if (row) {
                    tiles.push(...row);
                }
            }
        }
        return tiles;
    }

    /**
     * Retrieves chunks of data from a 2D grid based on the provided coordinates and size.
     *
     * @param {number} x - The X-coordinate to start retrieving chunks from.
     * @param {number} y - The Y-coordinate to start retrieving chunks from.
     * @param {number} size - The size of the area to retrieve chunks around the specified coordinates.
     * @returns {Array<any>} An array containing the chunks of data retrieved from the grid.
     */
    public getEntities(x: number, y: number, size: number) {
        const entities = [];

        for (let offsetY = -size; offsetY <= size; offsetY++) {
            const chunkRow = this.entitiesGrid[Math.floor(y / 100) + offsetY];

            for (let offsetX = -size; offsetX <= size; offsetX++) {
                const row = chunkRow && chunkRow[Math.floor(x / 100) + offsetX];
                if (row) {
                    entities.push(...row);
                }
            }
        }
        return entities;
    }

    private isTileTypeBiome(type: string) {
        const biomeTypes = ["FOREST", "DRAGON", "DESERT", "LAVA", "WINTER"];
        return biomeTypes.includes(type);
    }
}
