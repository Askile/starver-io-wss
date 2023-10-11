"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapGenerator = void 0;
const Vector_1 = require("../modules/Vector");
const Biome_1 = require("./map/Biome");
const Tile_1 = require("./map/Tile");
const Resouces_json_1 = require("../JSON/Resouces.json");
class MapGenerator {
    server;
    seed;
    state;
    m = 0x80000000;
    a = 1103515245;
    c = 12345;
    constructor(server, seed) {
        this.server = server;
        this.seed = seed;
        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
        if (!this.server.map.tiles.length) {
            this.server.map.biomes.push(new Biome_1.Biome("FOREST", new Vector_1.Vector(200, 200), new Vector_1.Vector(15000, 15000)));
            this.addForest(1.5);
        }
    }
    addForest(size) {
        for (let i = 0; i < 6; i++)
            this.addResources("t", i, Math.floor(80 * size), undefined);
        for (let i = 0; i < 4; i++)
            this.addResources("b", i, Math.floor(80 * size), undefined);
        for (let i = 0; i < 3; i++)
            this.addResources("s", i, Math.floor(50 * size), undefined);
        this.addResources("p", 0, Math.floor(28 * size), undefined);
        for (let i = 0; i < 3; i++)
            this.addResources("g", i, Math.floor(7 * size), undefined);
        for (let i = 0; i < 3; i++)
            this.addResources("d", i, Math.floor(2 * size), undefined);
        for (let i = 0; i < 3; i++)
            this.addResources("a", i, Math.floor(size), undefined);
        for (let i = 0; i < 3; i++)
            this.addResources("m", i, Math.floor(size), undefined);
        this.addResources("a", 0, Math.floor(size), undefined);
    }
    addResources(type, subtype, amount, subpart) {
        const biome = this.server.map.biomes.find(biome => biome.type === "FOREST");
        let x = Math.floor(biome.position.x / 100);
        let y = Math.floor(biome.position.y / 100);
        let w = Math.floor(biome.size.x / 100);
        let h = Math.floor(biome.size.y / 100);
        if (subpart !== undefined) {
            subpart = 1 - subpart;
            x += Math.floor((w * subpart) / 2);
            y += Math.floor((h * subpart) / 2);
            w -= Math.floor(w * subpart);
            h -= Math.floor(h * subpart);
        }
        const tiles = this.server.map.grid;
        for (let k = 0, l = 0; k < amount; l++) {
            if (l > 50000)
                break;
            let i = y + Math.floor(this.getRand() * h);
            let j = x + Math.floor(this.getRand() * w);
            const dist = this.server.map.getDistFromBiome(biome, j * 100 + 50, i * 100 + 50);
            if (dist < 400)
                continue;
            const chunks = this.server.map.getChunks(j * 100 + 50, i * 100 + 50, 1);
            let cont = false;
            for (const chunk of chunks) {
                if (chunk.tiles.length)
                    for (const tile of chunk.tiles) {
                        if (tile.position.x !== j && tile.position.y !== i && tile.type === type && tile.subtype === subtype)
                            cont = true;
                    }
            }
            if (cont)
                continue;
            const object = Resouces_json_1.objects.find((object) => object.type === type && object.subtype === subtype);
            if (object) {
                tiles[i][j].tiles.push(new Tile_1.Tile(new Vector_1.Vector(j, i), 0, object));
            }
            k++;
        }
    }
    getRand() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state / this.m;
    }
}
exports.MapGenerator = MapGenerator;
