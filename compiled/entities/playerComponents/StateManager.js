"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
const Fire_1 = require("../buildings/Fire");
const Workbench_1 = require("../buildings/Workbench");
const Well_1 = require("../buildings/Well");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const TileType_1 = require("../../enums/TileType");
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
        let isLava = false;
        let isIsland = false;
        let isWorkbench = false;
        let isBed = false;
        let isRoof = false;
        let isBridge = false;
        let isWell = false;
        let isWater = false;
        for (const entity of entities) {
            const dist = entity.position.distance(this.player.position);
            if (entity instanceof Fire_1.Fire && dist < 180) {
                isFire = true;
            }
            else if (entity instanceof Workbench_1.Workbench && dist < 180) {
                isWorkbench = true;
            }
            else if (entity instanceof Well_1.Well && dist < 180) {
                isWell = true;
            }
        }
        for (const tile of playerChunk.tiles) {
            if (tile.type === "iblk")
                isIsland = true;
        }
        if (!biomes.length && !isIsland) {
            isWater = true;
        }
        for (const tile of playerChunk.tiles) {
            if (tile.type === TileType_1.TileType.RIVER) {
                isWater = true;
            }
        }
        if (isWorkbench !== this.player.workbench) {
            this.player.client.sendU8([ClientPackets_1.ClientPackets.WORKBENCH, Number(isWorkbench)]);
        }
        if (isFire !== this.player.fire) {
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
    }
}
exports.StateManager = StateManager;
