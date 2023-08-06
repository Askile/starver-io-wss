import {Vector} from "../modules/Vector";
import {objects} from "../JSON/Resouces.json";
import {Biome} from "./map/Biome";
import {Tile} from "./map/Tile";
import {Entity} from "../entities/Entity";
import {Server} from "../Server";
import NanoTimer from "nanotimer";
import {TileType} from "../enums/TileType";
import {EntityType} from "../enums/EntityType";
import {Fruit} from "../entities/Fruit";

interface Chunk {
    entities: Entity[];
    tiles: Tile[];
}

export class Map {
    private readonly objects: any[] = [];
    private readonly server: Server;
    public width: number;
    public height: number;

    public tiles: Tile[] = [];
    public grid: Chunk[][] = [];
    public biomes: Biome[] = [];

    private resourcesTimeStamp: number = 0;
    constructor(server: Server) {
        this.server = server;
        this.objects = server.config.important.custom_map;
        this.width = server.config.important.map_width * 100;
        this.height = server.config.important.map_height * 100;
        this.initCollision();
        this.initBiomes();

        new NanoTimer().setInterval(() => {
            if(Date.now() - this.resourcesTimeStamp < this.server.config.resource_delay - ((this.server.config.resource_delay - this.server.config.resource_delay_min) * (this.server.players.length / this.server.playerPool.maxId))) return;
            this.resourcesTimeStamp = Date.now();
            for (const tile of this.tiles) {
                tile.count = Math.clamp(tile.count + Math.ceil(tile.limit * 0.06667), 0, tile.limit);
                if(tile.entity)
                    tile.entity.info = tile.count;
            }
        }, [], "1s");
    }

    public initBiomes() {
        for (const tile of this.objects) {
            const [type, x, y, sx, sy] = tile.slice(1, 6);
            if (!this.isTileTypeBiome(type)) continue;
            this.biomes.push(new Biome(type, new Vector(x * 100 + 30, y * 100 + 250), new Vector(sx * 100, sy * 100 - 200)));
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
            if(tile[1] !== "isl") continue;
            let [type, subtype, x, y] = tile.slice(1);

            for (let k = 0; k < 4; k++) {
                for (let l = 0; l < 3; l++) {
                    this.objects.push([0, "iblk", 0, x - k, y - l, 0]);
                    this.objects.push([0, "iblk", 0, x - k, y + l, 0]);
                    this.objects.push([0, "iblk", 0, x + k, y + l, 0]);
                    this.objects.push([0, "iblk", 0, x + k, y - l, 0]);
                }
            }

            if(subtype === 0) {
                for (let k = 0; k < 2; k++) {
                    this.objects.push([0, "iblk", 0, x - 4, y - k,  0]);
                    this.objects.push([0, "iblk", 0, x - 4, y + k, 0]);
                    this.objects.push([0, "iblk", 0, x + 4, y - k, 0]);
                    this.objects.push([0, "iblk", 0, x + 4, y + k, 0]);
                }

                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, "iblk", 0, x + k, y - 3, 0]);
                    this.objects.push([0, "iblk", 0, x + k, y + 3, 0]);
                    this.objects.push([0, "iblk", 0, x - k, y - 3, 0]);
                    this.objects.push([0, "iblk", 0, x - k, y + 3, 0]);
                }

                this.objects.push([0, "iblk", 0, x - 2, y - 4, 0]);
                this.objects.push([0, "iblk", 0, x - 3, y - 3, 0]);
                this.objects.push([0, "iblk", 0, x + 2, y + 4, 0]);
                this.objects.push([0, "iblk", 0, x + 3, y + 3, 0]);
            }
            else if (subtype === 1) {
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, "iblk", 0, x - 4, y - k, 0]);
                    this.objects.push([0, "iblk", 0, x - 4, y + k, 0]);
                    this.objects.push([0, "iblk", 0, x + 4, y - k, 0]);
                    this.objects.push([0, "iblk", 0, x + 4, y + k, 0]);
                }
                for (let k = 0; k < 4; k++) {
                    this.objects.push([0, "iblk", 0, x + k, y - 3, 0]);
                    this.objects.push([0, "iblk", 0, x + k, y + 3, 0]);
                    this.objects.push([0, "iblk", 0, x - k, y - 3, 0]);
                    this.objects.push([0, "iblk", 0, x - k, y + 3, 0]);
                }
            }
            else if (subtype === 2) {
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, "iblk", 0, x - 4, y - k, 0]);
                    this.objects.push([0, "iblk", 0, x - 4, y + k, 0]);
                    this.objects.push([0, "iblk", 0, x + 4, y - k, 0]);
                    this.objects.push([0, "iblk", 0, x + 4, y + k, 0]);
                }
                for (let k = 0; k < 3; k++) {
                    this.objects.push([0, "iblk", 0, x + k, y - 3, 0]);
                    this.objects.push([0, "iblk", 0, x + k, y + 3, 0]);
                    this.objects.push([0, "iblk", 0, x - k, y - 3, 0]);
                    this.objects.push([0, "iblk", 0, x - k, y + 3, 0]);
                }
            }

        }

        for (let tile of this.objects) {
            const type = tile[1];
            let subtype = 0;
            let x;
            let y;

            if(tile.length <= 5) {
                x = tile[2];
                y = tile[3];
            } else {
                subtype = tile[2];
                x = tile[3];
                y = tile[4];
            }

            if (this.isTileTypeBiome(type)) continue;

            const object = objects.find((object) => object.type == type && object.subtype == subtype);

            if (object) {
                const tile = new Tile(new Vector(x, y), object);
                this.grid[y][x].tiles.push(tile);

                if(tile.type === TileType.BERRY) {
                    const fruit = new Fruit(EntityType.FRUIT, this.server);
                    tile.entity = fruit;
                    fruit.position = tile.realPosition;
                }

                this.tiles.push(tile);
            }
        }

    }

    public updateEntitiesInChunks() {
        this.grid.forEach((chunkRow) => {
            chunkRow.forEach((chunk) => {
                chunk.entities = [];
            });
        });

        try {
            for (const entity of this.server.entities) {
                const chunkX = Math.floor(entity.position.x / 100);
                const chunkY = Math.floor(entity.position.y / 100);
                this.grid[chunkY][chunkX].entities.push(entity);
            }
        } catch {}
    }

    public getChunk(x: number, y: number): Chunk{
        const chunkX = Math.floor(x / 100);
        const chunkY = Math.floor(y / 100);

        return this.grid[chunkY][chunkX];
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

    public getTiles(x: number, y: number, size: number): Tile[] {
        const chunkX = Math.floor(x / 100);
        const chunkY = Math.floor(y / 100);
        const tiles = [];

        for (let offsetY = -size; offsetY <= size; offsetY++) {
            const chunkRow = this.grid[chunkY + offsetY];

            for (let offsetX = -size; offsetX <= size; offsetX++) {
                const chunk = chunkRow && chunkRow[chunkX + offsetX];
                if (chunk) {
                    tiles.push(...chunk.tiles);
                }
            }
        }

        return tiles;
    }

    public getEntities(x: number, y: number, size: number): Entity[] {
        const chunkX = Math.floor(x / 100);
        const chunkY = Math.floor(y / 100);
        const entities = [];

        for (let offsetY = -size; offsetY <= size; offsetY++) {
            const chunkRow = this.grid[chunkY + offsetY];

            for (let offsetX = -size; offsetX <= size; offsetX++) {
                const chunk = chunkRow && chunkRow[chunkX + offsetX];
                if (chunk) {
                    entities.push(...chunk.entities);
                }
            }
        }

        return entities;
    }


    public getDistFromBiome(biome: Biome, x: number, y: number) {
        let x1 = biome.position.x + 30;
        let y1 = biome.position.y + 250;
        let x2 = biome.position.x + biome.size.x + 80;
        let y2 = biome.position.y + biome.size.y - 200;

        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) return Math.min(x - x1, x2 - x, y - y1, y2 - y);

        let dist = -1000000;
        if (x - x1 < 0) dist = Math.max(dist, x - x1);
        else if (x2 - x < 0) dist = Math.max(dist, x2 - x);

        let distY = -1000000;
        if (y < y1 || y > y2) {
            if (y - y1 < 0) distY = Math.max(distY, y - y1);
            else distY = Math.max(distY, y2 - y);

            if (dist !== -1000000 && distY !== -1000000) dist = Math.min(dist, distY);
            else dist = distY;
        }

        return dist;
    }

    /**
     * Returns the biomes at the entity's current position.
     *
     * @param {Entity} entity - The entity for which to retrieve biomes.
     * @returns {Biome[]} An array containing the biomes at the entity's current position.
     */
    public getBiomesAtEntityPosition(entity: Entity): string[] {

        const biomes: string[] = [];
        for (const biome of this.biomes) {
            if (biome.position.isVectorInsideRectangle(entity.position, biome.size.x + 25, biome.size.y + 25)) {
                biomes.push(biome.type);
            }
        }

        return biomes;
    }

    private isTileTypeBiome(type: string) {
        const biomeTypes = ["FOREST", "DRAGON", "DESERT", "LAVA", "WINTER"];
        return biomeTypes.includes(type);
    }
}
