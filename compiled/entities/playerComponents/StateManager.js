"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const TileType_1 = require("../../enums/TileType");
const EntityType_1 = require("../../enums/EntityType");
class StateManager {
    player;
    constructor(player) {
        this.player = player;
    }
    tick() {
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
            if (entity.type === EntityType_1.EntityType.FIRE && dist < 180) {
                isFire = true;
                if (dist < 50)
                    onFire = true;
            }
            else if (entity.type === EntityType_1.EntityType.WORKBENCH && dist < 180) {
                isWorkbench = true;
            }
            else if (entity.type === EntityType_1.EntityType.WELL && dist < 180) {
                isWell = true;
            }
        }
        for (const tile of tiles) {
            const dist = tile.realPosition.distance(this.player.position);
            if (tile.type === TileType_1.TileType.LAVA && dist < tile.radius) {
                isLava = true;
            }
        }
        for (const tile of playerChunk.tiles) {
            if (tile.type === "iblk")
                isIsland = true;
            if (tile.type === TileType_1.TileType.RIVER) {
                isWater = true;
            }
        }
        if (!biomes.length && !isIsland) {
            isWater = true;
        }
        if (biomes.length == 1) {
            isDesert = biomes.includes("DESERT");
            isWinter = biomes.includes("WINTER") || biomes.includes("DRAGON");
            isLavaBiome = biomes.includes("LAVA");
        }
        if (isWorkbench !== this.player.workbench) {
            this.player.client.sendU8([ClientPackets_1.ClientPackets.WORKBENCH, Number(isWorkbench)]);
        }
        if (isFire !== this.player.fire || isLava !== this.player.lava) {
            this.player.client.sendU8([ClientPackets_1.ClientPackets.FIRE, Number(isFire)]);
        }
        if (isWater !== this.player.water) {
            this.player.client.sendU8([ClientPackets_1.ClientPackets.WATER, Number(isWater)]);
        }
        if (isWell !== this.player.well) {
            this.player.client.sendU8([ClientPackets_1.ClientPackets.WELL, Number(isWell)]);
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
exports.StateManager = StateManager;
