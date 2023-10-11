"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollisionSystem = void 0;
const Player_1 = require("../../entities/Player");
const TileType_1 = require("../../enums/types/TileType");
const EntityType_1 = require("../../enums/types/EntityType");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const Building_1 = require("../../entities/Building");
const BiomeType_1 = require("../../enums/types/BiomeType");
class CollisionSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    getClosestPointOnCircle(entity, obstacle, stop, multiply = 1) {
        const dist = entity.position.subtract(obstacle.realPosition);
        const dist_ = entity.realPosition.subtract(obstacle.realPosition);
        const overlap = entity.radius + obstacle.radius;
        let response = obstacle.realPosition.clone();
        if (overlap > 0) {
            let angle = Math.atan2(dist.y, dist.x);
            const angle_ = Math.atan2(dist_.y, dist_.x);
            const diff = angle_ - angle;
            if (angle_ < angle || diff > 5)
                angle = angle_ + 0.2;
            if (angle_ > angle || diff < -5)
                angle = angle_ - 0.2;
            if (stop || !diff) {
                angle = angle_;
            }
            response.x += overlap * Math.cos(angle) * multiply;
            response.y += overlap * Math.sin(angle) * multiply;
        }
        return response;
    }
    getAnimalPath(entity, position, obstacle, stop) {
        const dist = position.subtract(obstacle.realPosition);
        const dist_ = entity.realPosition.subtract(obstacle.realPosition);
        const overlap = 25 + obstacle.radius;
        let response = obstacle.realPosition.clone();
        if (overlap > 0) {
            let angle = Math.atan2(dist.y, dist.x);
            const angle_ = Math.atan2(dist_.y, dist_.x);
            const diff = angle_ - angle;
            if (angle_ < angle || diff > 5)
                angle = angle_ + 0.2;
            if (angle_ > angle || diff < -5)
                angle = angle_ - 0.2;
            if (stop || !diff) {
                angle = angle_;
            }
            response.x += overlap * Math.cos(angle);
            response.y += overlap * Math.sin(angle);
        }
        return response;
    }
    getColliders(entity, radius, size = 1) {
        const { x, y } = entity.realPosition;
        const entities = this.server.map.getEntities(x, y, size);
        const tiles = this.server.map.getTiles(x, y, size);
        const response = [];
        for (const obstacle of entities) {
            const dist = entity.realPosition.distance(obstacle.realPosition);
            if (dist >= radius + obstacle.radius || obstacle === entity)
                continue;
            response.push(obstacle);
        }
        for (const obstacle of tiles) {
            const dist = entity.realPosition.distance(obstacle.realPosition);
            if (obstacle.type === TileType_1.TileType.SAND)
                continue;
            if (!obstacle.collide || dist >= radius + obstacle.radius)
                continue;
            response.push(obstacle);
        }
        return response;
    }
    getObstacles(position, radius, size = 3) {
        const entities = this.server.map.getEntities(position.x, position.y, size);
        const tiles = this.server.map.getTiles(position.x, position.y, size);
        const response = [];
        for (const obstacle of entities) {
            const dist = position.distance(obstacle.realPosition);
            if (!obstacle.collide || dist >= radius + obstacle.radius || obstacle.position === position)
                continue;
            response.push(obstacle);
        }
        for (const obstacle of tiles) {
            const dist = position.distance(obstacle.realPosition);
            if (obstacle.type === TileType_1.TileType.SAND)
                continue;
            if (!obstacle.collide || dist >= radius + obstacle.radius)
                continue;
            response.push(obstacle);
        }
        return response;
    }
    update(entity) {
        const obstacles = this.getObstacles(entity.position, entity.radius);
        if (!obstacles.length)
            return;
        for (const obstacle of obstacles) {
            if (obstacle.realPosition.distance(entity.position) > entity.radius + obstacle.radius)
                continue;
            entity.isCollide = true;
            const obst = this.getObstacles(entity.realPosition, entity.radius + 12);
            if (obst.length >= 2) {
                const obst0 = obst[0];
                const obst1 = obst[1];
                const distance = Math.abs(obst0.realPosition.distance(obst1.realPosition) - obst0.radius - obst1.radius);
                if (distance > 40)
                    entity.position.set(this.getClosestPointOnCircle(entity, obstacle, false));
                else
                    entity.position.set(this.getClosestPointOnCircle(entity, obstacle, true));
            }
            else {
                entity.position.set(this.getClosestPointOnCircle(entity, obstacle, false));
            }
        }
    }
    updateAnimal(animal, position) {
        const obstacles = this.getObstacles(position, 40);
        if (!obstacles.length)
            return position;
        for (const obstacle of obstacles) {
            if (obstacle.realPosition.distance(position) > 25 + obstacle.radius)
                continue;
            return this.getAnimalPath(animal, position, obstacle, true);
        }
    }
    updateState(entity) {
        const thisChunk = entity.server.map.getChunk(entity.position.x, entity.position.y);
        const biomes = entity.server.map.getBiomesAtEntityPosition(entity.position);
        if (!thisChunk)
            return;
        let isLavaBiome = false;
        let isWater = false;
        let isLake = false;
        let isWinter = false;
        let isForest = false;
        let isDesert = false;
        let isBeach = false;
        let isCave = false;
        let isIsland = false;
        let isBridge = false;
        let isRoof = false;
        let isTower = false;
        let isFireon = false;
        let isBed = false;
        let isPlot = false;
        let isSeed = false;
        let isLava = false;
        let isRiver = false;
        let biomeIn = BiomeType_1.BiomeType.FOREST;
        for (const tile of thisChunk.tiles) {
            if (tile.type === TileType_1.TileType.SAND)
                isIsland = true;
            if (tile.type === TileType_1.TileType.RIVER) {
                isLake = true;
                isWater = true;
                if (tile.meta)
                    isRiver = true;
            }
        }
        for (const entity of thisChunk.entities) {
            if (entity.type === EntityType_1.EntityType.BRIDGE)
                isBridge = true;
            if (entity.type === EntityType_1.EntityType.ROOF)
                isRoof = true;
            if (entity.type === EntityType_1.EntityType.WOOD_TOWER)
                isTower = true;
            if (entity.type === EntityType_1.EntityType.BED)
                isBed = true;
            if (entity.type === EntityType_1.EntityType.PLOT)
                isPlot = true;
            if (entity.type === EntityType_1.EntityType.FIRE)
                isFireon = true;
            if (entity instanceof Building_1.Building && entity.isSeed())
                isSeed = true;
        }
        if (biomes.length >= 1) {
            isDesert = biomes.includes("DESERT");
            isWinter = biomes.includes("WINTER") || biomes.includes("DRAGON");
            isLavaBiome = biomes.includes("LAVA");
            isBeach = biomes.includes("BEACH");
            isForest = biomes.includes("FOREST");
            isCave = biomes.includes("DRAGON");
            isWater = isWater || biomes.includes("SEA") && !isIsland;
        }
        else {
            isWater = true;
        }
        if (isDesert)
            biomeIn = BiomeType_1.BiomeType.DESERT;
        if (isWinter)
            biomeIn = BiomeType_1.BiomeType.WINTER;
        if (isLavaBiome)
            biomeIn = BiomeType_1.BiomeType.LAVA;
        if (isBeach)
            biomeIn = BiomeType_1.BiomeType.BEACH;
        if (isForest)
            biomeIn = BiomeType_1.BiomeType.FOREST;
        if (isCave)
            biomeIn = BiomeType_1.BiomeType.DRAGON;
        if (isWater)
            biomeIn = BiomeType_1.BiomeType.SEA;
        if (entity instanceof Player_1.Player) {
            const entities = this.server.map.getEntities(entity.realPosition.x, entity.realPosition.y, 3);
            const tiles = this.server.map.getTiles(entity.realPosition.x, entity.realPosition.y, 3);
            let isFire = false;
            let onFire = false;
            let spike = null;
            let isWorkbench = false;
            let isWell = false;
            for (const unit of entities) {
                const dist = entity.realPosition.distance(unit.realPosition);
                if (unit.type === EntityType_1.EntityType.WORKBENCH && dist < 180) {
                    isWorkbench = true;
                }
                else if (dist < 180 && (unit.type === EntityType_1.EntityType.FIRE || unit.type === EntityType_1.EntityType.BIG_FIRE || (unit.type === EntityType_1.EntityType.FURNACE && unit.info))) {
                    isFire = true;
                    onFire = dist < 50;
                }
                else if (unit.type === EntityType_1.EntityType.WELL && dist < 180) {
                    isWell = true;
                }
                else if (unit instanceof Building_1.Building && unit.isSpike() && dist < 100) {
                    spike = unit;
                }
            }
            for (const tile of tiles) {
                const dist = entity.realPosition.distance(tile.realPosition);
                if (tile.type === TileType_1.TileType.LAVA && dist < tile.radius) {
                    isLava = true;
                }
            }
            if (onFire !== entity.onFire) {
                entity.gauges.lastUpdateFire = Date.now();
            }
            // if(spike !== entity.spike) {
            //     entity.lastSpikeHurt = Date.now();
            // }
            if (isWorkbench !== entity.workbench) {
                entity.client.sendU8([ClientPackets_1.ClientPackets.WORKBENCH, Number(isWorkbench)]);
            }
            if (isFire !== entity.fire || isLava !== entity.lava) {
                entity.client.sendU8([ClientPackets_1.ClientPackets.FIRE, Number(isFire)]);
            }
            if (isWater !== entity.water) {
                entity.client.sendU8([ClientPackets_1.ClientPackets.WATER, Number(isWater)]);
            }
            if (isWell !== entity.well) {
                entity.client.sendU8([ClientPackets_1.ClientPackets.WELL, Number(isWell)]);
            }
            entity.fire = isFire;
            entity.lava = isLava;
            entity.onFire = onFire;
            entity.spike = spike;
            entity.workbench = isWorkbench;
            entity.well = isWell;
            entity.river = isRiver;
        }
        entity.water = isWater;
        entity.desert = isDesert;
        entity.winter = isWinter;
        entity.lavaBiome = isLavaBiome;
        entity.beach = isBeach;
        entity.forest = isForest;
        entity.island = isIsland;
        entity.lake = isLake;
        entity.biomeIn = biomeIn;
        entity.bridge = isBridge;
        entity.roof = isRoof;
        entity.tower = isTower;
        entity.plot = isPlot;
        entity.infire = isFireon;
        entity.bed = isBed;
        entity.seed = isSeed;
    }
}
exports.CollisionSystem = CollisionSystem;
