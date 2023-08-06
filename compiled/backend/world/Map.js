"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
const Vector_1 = require("../modules/Vector");
const Resouces_json_1 = require("../JSON/Resouces.json");
const Biome_1 = require("./map/Biome");
const Tile_1 = require("./map/Tile");
class Map {
    objects = [];
    server;
    width;
    height;
    grid = [];
    biomes = [];
    constructor(server) {
        this.server = server;
        this.objects = server.config.important.custom_map;
        this.width = server.config.important.map_width * 100;
        this.height = server.config.important.map_height * 100;
        this.initCollision();
        this.initBiomes();
    }
    initBiomes() {
        for (const tile of this.objects) {
            const [type, x, y, sx, sy] = tile.slice(1, 6);
            if (!this.isTileTypeBiome(type))
                continue;
            this.biomes.push(new Biome_1.Biome(type, new Vector_1.Vector(x * 100 + 30, y * 100 + 250), new Vector_1.Vector(sx * 100, sy * 100 - 200)));
        }
    }
    /**
     * Initialize chunks to map
     */
    initCollision() {
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
            if (this.isTileTypeBiome(type))
                continue;
            const object = Resouces_json_1.objects.find((object) => object.type == type && object.subtype == subtype);
            if (object) {
                this.grid[y][x].tiles.push(new Tile_1.Tile(new Vector_1.Vector(x, y), object));
            }
        }
    }
    updateEntitiesInChunks() {
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
        }
        catch { }
    }
    /**
     * Retrieves the chunks of data from a 2D grid based on the provided coordinates and size.
     *
     * @param {number} x - The X-coordinate to start retrieving chunks from.
     * @param {number} y - The Y-coordinate to start retrieving chunks from.
     * @param {number} size - The size of the area to retrieve chunks around the specified coordinates.
     * @returns {Chunk[]} An array containing the chunks of data retrieved from the grid.
     */
    getChunks(x, y, size) {
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
    getDistFromBiome(biome, x, y) {
        let x1 = biome.position.x + 30;
        let y1 = biome.position.y + 250;
        let x2 = biome.position.x + biome.size.x + 80;
        let y2 = biome.position.y + biome.size.y - 200;
        if (x >= x1 && x <= x2 && y >= y1 && y <= y2)
            return Math.min(x - x1, x2 - x, y - y1, y2 - y);
        let dist = -1000000;
        if (x - x1 < 0)
            dist = Math.max(dist, x - x1);
        else if (x2 - x < 0)
            dist = Math.max(dist, x2 - x);
        let distY = -1000000;
        if (y < y1 || y > y2) {
            if (y - y1 < 0)
                distY = Math.max(distY, y - y1);
            else
                distY = Math.max(distY, y2 - y);
            if (dist !== -1000000 && distY !== -1000000)
                dist = Math.min(dist, distY);
            else
                dist = distY;
        }
        return dist;
    }
    getCustomMap() {
        const custom_map = [];
        for (const chunks of this.grid) {
            for (const chunk of chunks) {
                if (!chunk.tiles.length)
                    continue;
                for (const tile of chunk.tiles) {
                    custom_map.push([1, tile.type, tile.subtype, tile.position.x, tile.position.y]);
                }
            }
        }
        return custom_map;
    }
    /**
     * Returns the biomes at the entity's current position.
     *
     * @param {Entity} entity - The entity for which to retrieve biomes.
     * @returns {Biome[]} An array containing the biomes at the entity's current position.
     */
    getBiomesAtEntityPosition(entity) {
        const biomes = [];
        for (const biome of this.biomes) {
            if (biome.position.isVectorInsideRectangle(entity.position, biome.size.x + 25, biome.size.y + 25)) {
                biomes.push(biome.type);
            }
        }
        return biomes;
    }
    isTileTypeBiome(type) {
        const biomeTypes = ["FOREST", "DRAGON", "DESERT", "LAVA", "WINTER"];
        return biomeTypes.includes(type);
    }
}
exports.Map = Map;
