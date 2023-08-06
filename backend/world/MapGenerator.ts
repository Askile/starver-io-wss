import {Server} from "../Server";
import {Vector} from "../modules/Vector";
import {Biome} from "./map/Biome";
import {Tile} from "./map/Tile";
import {objects} from "../JSON/Resouces.json";

export class MapGenerator {
    private server: Server;
    public seed: number;
    public state: number;

    private readonly m = 0x80000000;
    private readonly a= 1103515245;
    private readonly c = 12345;

    constructor(server: Server, seed: number) {
        this.server = server;
        this.seed = seed;

        this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));

        if(!this.server.config.important.custom_map.length) {
            this.server.map.biomes.push(new Biome(
                "FOREST",
                new Vector(200, 200),
                new Vector(15000, 15000)
            ))

            this.addForest(1.5);

        }
    }

    public addForest(size: number) {
        for (let i = 0; i < 6; i++) this.addResources("t", i, Math.floor(80 * size), undefined);
        for (let i = 0; i < 4; i++) this.addResources("b", i, Math.floor(80 * size), undefined);
        for (let i = 0; i < 3; i++) this.addResources("s", i, Math.floor(50 * size), undefined);

        this.addResources("p", 0, Math.floor(28 * size), undefined);

        for (let i = 0; i < 3; i++) this.addResources("g", i, Math.floor(7 * size), undefined);

        for (let i = 0; i < 3; i++) this.addResources("d", i, Math.floor(2 * size), undefined);
        for (let i = 0; i < 3; i++) this.addResources("a", i, Math.floor(size), undefined);
        for (let i = 0; i < 3; i++) this.addResources("m", i, Math.floor(size), undefined);

        this.addResources("a", 0, Math.floor(size), undefined);
    }

    public addResources(type: string, subtype: number, amount: number, subpart: number | undefined) {
        const biome = this.server.map.biomes.find(biome => biome.type === "FOREST") as Biome;

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
            if(l > 50000) break;

            let i = y + Math.floor(this.getRand() * h);
            let j = x + Math.floor(this.getRand() * w);

            const dist = this.server.map.getDistFromBiome(biome, j * 100 + 50, i * 100 + 50)
            if(dist < 400) continue;

            const chunks = this.server.map.getChunks(j * 100 + 50, i * 100 + 50, 1);

            let cont = false
            for (const chunk of chunks) {
                if(chunk.tiles.length)
                    for (const tile of chunk.tiles) {
                        if(tile.position.x !== j && tile.position.y !== i && tile.type === type && tile.subtype === subtype) cont = true
                    }
            }

            if(cont) continue;

            const object = objects.find((object) => object.type === type && object.subtype === subtype);

            if(object) {
                tiles[i][j].tiles.push(new Tile(
                    new Vector(j, i),
                    object
                ));
            }

            k++;

        }

    }

    private getRand() {
        this.state = (this.a * this.state + this.c) % this.m;
        return this.state / this.m;
    }
}