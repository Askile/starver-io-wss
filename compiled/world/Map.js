"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
const Vector_1 = require("../modules/Vector");
const Resouces_json_1 = require("../JSON/Resouces.json");
class Map {
    tiles = [];
    width;
    height;
    chunks = [];
    biomes = [];
    constructor(config) {
        this.tiles = config.important.custom_map;
        this.width = config.important.map_width * 100;
        this.height = config.important.map_height * 100;
        this.initCollision();
        this.initBiomes();
    }
    initBiomes() {
        for (const tile of this.tiles) {
            const [type, x, y, sx, sy] = tile.slice(1, 6);
            if (!this.isTileTypeBiome(type))
                continue;
            this.biomes.push({
                type,
                position: new Vector_1.Vector(x * 100, y * 100),
                size: new Vector_1.Vector(sx * 100, sy * 100)
            });
        }
    }
    initCollision() {
        const numChunks = Math.ceil(this.width);
        this.chunks = Array(numChunks)
            .fill(null)
            .map(() => Array(numChunks)
            .fill([])
            .map(() => []));
        for (const tile of this.tiles) {
            const [type, subtype, x, y] = tile.slice(1);
            if (this.isTileTypeBiome(type))
                continue;
            const chunkX = Math.floor(x);
            const chunkY = Math.floor(y);
            const chunkRow = this.chunks[chunkY][chunkX];
            const object = Resouces_json_1.objects.find((object) => object.type == type && object.subtype == subtype);
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
    isTileTypeBiome(type) {
        const biomeTypes = ["FOREST", "DRAGON", "DESERT", "LAVA", "WINTER"];
        return biomeTypes.includes(type);
    }
}
exports.Map = Map;
