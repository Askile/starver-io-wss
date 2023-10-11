"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateSystem = void 0;
const TileType_1 = require("../../enums/types/TileType");
const EntityType_1 = require("../../enums/types/EntityType");
const State_1 = require("../../enums/State");
class StateSystem {
    entity;
    states;
    constructor(entity) {
        this.entity = entity;
        this.states = new Array(16);
    }
    update() {
        let [isWater, isRiver, isLake, isForest, isWinter, isLavaBiome, isDesert, isBeach, isIsland, isCave, isBridge, isRoof, isTower, isBed, isLava, onFire] = this.states;
        const thisChunk = this.entity.server.map.getChunk(this.entity.position.x, this.entity.position.y);
        const biomes = this.entity.server.map.getBiomesAtEntityPosition(this.entity.position);
        if (biomes.length >= 1) {
            this.states[State_1.State.isDesert] = biomes.includes("DESERT");
            this.states[State_1.State.isWinter] = biomes.includes("WINTER") || biomes.includes("DRAGON");
            this.states[State_1.State.isLavaBiome] = biomes.includes("LAVA");
            this.states[State_1.State.isBeach] = biomes.includes("BEACH");
            this.states[State_1.State.isForest] = biomes.includes("FOREST");
            this.states[State_1.State.isCave] = biomes.includes("DRAGON");
            this.states[State_1.State.isWater] = isWater || biomes.includes("SEA") && !isIsland;
        }
        else
            this.states[State_1.State.isWater] = true;
        if (!thisChunk)
            return;
        for (const tile of thisChunk.tiles) {
            if (tile.type === TileType_1.TileType.SAND)
                this.states[State_1.State.isIsland] = true;
            if (tile.type === TileType_1.TileType.RIVER) {
                this.states[State_1.State.isLake] = true;
                this.states[State_1.State.isWater] = true;
                if (tile.meta)
                    this.states[State_1.State.isWater] = true;
            }
        }
        for (const entity of thisChunk.entities) {
            this.states[State_1.State.isBridge] = entity.type === EntityType_1.EntityType.BRIDGE;
            this.states[State_1.State.isRoof] = entity.type === EntityType_1.EntityType.ROOF;
            this.states[State_1.State.isTower] = entity.type === EntityType_1.EntityType.WOOD_TOWER;
            this.states[State_1.State.isBed] = entity.type === EntityType_1.EntityType.BED;
            this.states[State_1.State.onFire] = entity.type === EntityType_1.EntityType.FIRE;
        }
    }
}
exports.StateSystem = StateSystem;
