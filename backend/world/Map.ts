import { Vector } from "../modules/Vector";

export class Map {
    private readonly tiles: any[] = [];
    private config: Config;
    public width: number;
    public height: number;
    public chunks: any[][] = [];
    public grid: any[] = [];
    public biomes: Biome[] = [];

    constructor(config: Config) {
        this.config = config;
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
        const { map_height } = this.config.important;
        const numChunks = Math.ceil(map_height);
        this.chunks = Array(numChunks)
            .fill(null)
            .map(() => Array(numChunks).fill([]).map(() => []));

        for (const tile of this.tiles) {
            const [type, subtype, x, y] = tile.slice(1);
            if (this.isTileTypeBiome(type)) continue;

            const chunkX = Math.floor(x);
            const chunkY = Math.floor(y);

            const chunkRow = this.chunks[chunkY][chunkX];

            let radius = 0;
            switch (type) {
                case "t":
                    if ([0, 1].includes(subtype))
                        radius = 102;
                    else if ([2, 3].includes(subtype))
                        radius = 77;
                    else if ([4, 5].includes(subtype))
                        radius = 60;
                    break;
                case "b":
                    if (subtype == 0 || subtype == 1) {
                        radius = 97;
                    } else if (subtype == 2 || subtype == 3) {
                        radius = 80;
                    }
                    break;
                case "s":
                    if (subtype == 0)
                        radius = 102;
                    else if (subtype == 1)
                        radius = 87;
                    else if (subtype == 2)
                        radius = 58;
                break;
                case "g":
                    if (subtype == 0) {
                        radius = 90;
                    } else if (subtype == 1) {
                        radius = 75;
                    } else if (subtype == 2) {
                        radius = 65;
                    }
                break;
                case "p":
                    radius = 77;
                    break;
                case "f":
                    if (subtype == 0) {
                        radius = 140;
                    } else if (subtype == 1) {
                        radius = 115;
                    } else if (subtype == 2) {
                        radius = 95;
                    }
                    break;
                case "d":
                    if (subtype == 0) {
                        radius = 85;
                    } else if (subtype == 1) {
                        radius = 75;
                    } else if (subtype == 2) {
                        radius = 60;
                    }
                    break;
                case "a":
                    if (subtype == 0) {
                        radius = 85;
                    } else if (subtype == 1) {
                        radius = 75;
                    }
                    break;
                case "cs":
                    if (subtype == 0) {
                        radius = 100;
                    } else if (subtype == 1) {
                        radius = 87;
                    } else if (subtype == 2) {
                        radius = 95;
                    } else if (subtype == 3) {
                        radius = 90;
                    }
                    break;
                case "re":
                    if (subtype == 0) {
                        radius = 67;
                    } else if (subtype == 1) {
                        radius = 82;
                    } else if (subtype == 2) {
                        radius = 90;
                    }
                    break;
                case "c":
                    radius = 55;
                    break;
                case "m":
                    if (subtype == 1) {
                        radius = 85;
                    } else if (subtype == 2) {
                        radius = 90;
                    }
                    break;
                case 4:
                case 24:
                case 25:
                case 26:
                case 27:
                case 28:
                case 7:
                case 8:
                case 9:
                case 10:
                case 15:
                case 16:
                case 17:
                case 19:
                case 21:
                case 50:
                case 51:
                case 18:
                case 32:
                case 34:
                case 29:
                case 22:
                    radius = 45;
                    break;
                case 2:
                case 5:
                case 12:
                case 13:
                case 14:
                case 20:
                case 52:
                case 53:
                case 49:
                case 48:
                case 47:
                case 46:
                case 45:
                    radius = 35;
                    break;
                case 11:
                case 0:
                    radius = 25;
            }

            if(radius > 0) {
                chunkRow.push({
                    x,
                    y,
                    radius
                });
                this.grid.push({
                    x,
                    y,
                    radius
                })
            }
        }
    }

    private isTileTypeBiome(type: string) {
        const biomeTypes = ["FOREST", "DRAGON", "DESERT", "LAVA", "WINTER"];
        return biomeTypes.includes(type);
    }
}
