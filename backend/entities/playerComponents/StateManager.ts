import {Player} from "../Player";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {TileType} from "../../enums/TileType";
import {EntityType} from "../../enums/EntityType";

export class StateManager {
    public player: Player;
    constructor(player: Player) {
        this.player = player;
    }
    
    public tick() {
        const entities = this.player.server.map.getEntities(this.player.position.x, this.player.position.y, 2);
        const tiles = this.player.server.map.getTiles(this.player.position.x, this.player.position.y, 6);
        const playerChunk = this.player.server.map.getChunk(this.player.position.x, this.player.position.y);
        const biomes = this.player.server.map.getBiomesAtEntityPosition(this.player);

        let isFire = false;
        let onFire = false;
        let isLava = false;
        let isLavaBiome = false;
        let isIsland = false;
        let isWorkbench = false;
        let isBed = false;
        let isRoof = false;
        let isBridge = false;
        let isWell = false;
        let isWater = false;
        let isWinter = false;
        let isDesert = false;

        for (const entity of entities) {
            const dist = entity.position.distance(this.player.position);
            if (entity.type === EntityType.FIRE && dist < 180) {
                isFire = true;
                if(dist < 50) onFire = true;
            } else if (entity.type === EntityType.WORKBENCH && dist < 180) {
                isWorkbench = true;
            } else if (entity.type === EntityType.WELL && dist < 180) {
                isWell = true;
            }
        }
        for (const tile of tiles) {
            const dist = tile.realPosition.distance(this.player.position);
            if (tile.type === TileType.LAVA && dist < tile.radius) {
                isLava = true;
            }
        }


        for (const tile of playerChunk.tiles) {
            if(tile.type === "iblk") isIsland = true;
            if(tile.type === TileType.RIVER) {
                isWater = true;
            }
        }

        if(!biomes.length && !isIsland) {
            isWater = true;
        }

        if(biomes.length == 1) {
             isDesert = biomes.includes("DESERT");
             isWinter = biomes.includes("WINTER") || biomes.includes("DRAGON");
             isLavaBiome = biomes.includes("LAVA");
        }

        if(isWorkbench !== this.player.workbench) {
            this.player.client.sendU8([ClientPackets.WORKBENCH, Number(isWorkbench)]);
        }

        if(isFire !== this.player.fire || isLava !== this.player.lava) {
            this.player.client.sendU8([ClientPackets.FIRE, Number(isFire)]);
        }

        if(isWater !== this.player.water) {
            this.player.client.sendU8([ClientPackets.WATER, Number(isWater)]);
        }

        if(isWell !== this.player.well) {
            this.player.client.sendU8([ClientPackets.WELL, Number(isWell)]);
        }

        this.player.water = isWater;
        this.player.workbench = isWorkbench;
        this.player.fire = isFire;
        this.player.onFire = onFire;
        this.player.desert = isDesert;
        this.player.winter = isWinter;
        this.player.lavaBiome = isLavaBiome;
        this.player.lava = isLava;

    }
}