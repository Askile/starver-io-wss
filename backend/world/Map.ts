import {Vector} from "../modules/Vector";
import {objects} from "../JSON/Resouces.json";
import {Biome} from "./map/Biome";
import {Tile} from "./map/Tile";
import {Entity} from "../entities/Entity";
import {Server} from "../Server";

interface Chunk {
    entities: Entity[];
    tiles: Tile[];
}

export class Map {
    private readonly objects: any[] = [];
    private server: Server;
    public width: number;
    public height: number;

    public grid: Chunk[][] = [];
    public biomes: Biome[] = [];

    constructor(server: Server) {
        this.server = server;
        this.objects = server.config.important.custom_map;
        this.width = server.config.important.map_width * 100;
        this.height = server.config.important.map_height * 100;
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

    /**
     * Initialize chunks to map
     */
    public initCollision() {
        const width = Math.ceil(this.width / 100);
        const height = Math.ceil(this.height / 100);
        for (let y = 0; y < height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < width; x++) {
                this.grid[y][x] = {
                    tiles: [],
                    entities: []
                };
            }
        }

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
                this.grid[y][x].tiles.push(new Tile(new Vector(x, y), object));
            }
        }

    }

    /**
     * Updates the entities in chunks based on the entity positions.
     */
    public updateEntitiesInChunks() {
        this.grid.forEach((chunkRow) => {
            chunkRow.forEach((chunk) => {
                chunk.entities = [];
            });
        });

        // Add entities to their respective chunks
        // Assuming entities is an array of Entity objects
        for (const entity of this.server.entities) {
            const chunkX = Math.floor(entity.position.x / 100);
            const chunkY = Math.floor(entity.position.y / 100);
            this.grid[chunkY][chunkX].entities.push(entity);
        }
    }

    /**
     * Retrieves the chunks of data from a 2D grid based on the provided coordinates and size.
     *
     * @param {number} x - The X-coordinate to start retrieving chunks from.
     * @param {number} y - The Y-coordinate to start retrieving chunks from.
     * @param {number} size - The size of the area to retrieve chunks around the specified coordinates.
     * @returns {Chunk[]} An array containing the chunks of data retrieved from the grid.
     */
    public getChunks(x: number, y: number, size: number): Chunk[] {
        const chunkX = Math.floor(x / 100);
        const chunkY = Math.floor(y / 100);
        const chunks = [];

        for (let offsetY = -size; offsetY <= size; offsetY++) {
            const chunkRow = this.grid[chunkY + offsetY];

            for (let offsetX = -size; offsetX <= size; offsetX++) {
                const chunk = chunkRow && chunkRow[chunkX + offsetX];
                if (chunk) {
                    chunks.push(chunk);
                }
            }
        }
        return chunks;
    }

    private isTileTypeBiome(type: string) {
        const biomeTypes = ["FOREST", "DRAGON", "DESERT", "LAVA", "WINTER"];
        return biomeTypes.includes(type);
    }
}
