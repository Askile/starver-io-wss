"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingSystem = void 0;
const Vector_1 = require("../../modules/Vector");
const EntityType_1 = require("../../enums/EntityType");
const InventoryType_1 = require("../../enums/InventoryType");
const Fire_1 = require("../../entities/buildings/Fire");
const Workbench_1 = require("../../entities/buildings/Workbench");
const Wall_1 = require("../../entities/buildings/Wall");
const Spike_1 = require("../../entities/buildings/Spike");
const Door_1 = require("../../entities/buildings/Door");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const Bridge_1 = require("../../entities/buildings/Bridge");
const TileType_1 = require("../../enums/TileType");
class BuildingSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    request(player, data) {
        if (data.length < 3 || Date.now() - player.lastBuildingStamp <= 1000)
            return;
        for (let i = 0; i < data.length; i++) {
            if (!Number.isInteger(data[i]))
                return;
        }
        const id = data[0];
        const type = EntityType_1.EntityType[InventoryType_1.InventoryType[id]];
        const angle = data[1];
        const isGrid = data[2];
        if ((isGrid !== 0 && isGrid !== 1) || angle < 0 || angle > 255 || !type)
            return;
        let entity = null;
        if (this.isFire(type)) {
            entity = new Fire_1.Fire(type, this.server);
        }
        else if (this.isWorkbench(type)) {
            entity = new Workbench_1.Workbench(type, this.server);
        }
        else if (this.isWall(type)) {
            entity = new Wall_1.Wall(type, this.server);
        }
        else if (this.isSpike(type)) {
            entity = new Spike_1.Spike(type, this.server);
        }
        else if (this.isDoor(type)) {
            entity = new Door_1.Door(type, this.server);
        }
        else if (this.isBridge(type)) {
            entity = new Bridge_1.Bridge(type, this.server);
        }
        entity.angle = angle;
        entity.position = this.getOffsetVector(player.position, 120, angle);
        if (isGrid || this.isBridge(type)) {
            entity.angle = 0;
            entity.position.x = Math.floor(entity.position.x / 100) * 100 + 50;
            entity.position.y = Math.floor(entity.position.y / 100) * 100 + 50;
        }
        const tiles = this.server.map.getTiles(entity.position.x, entity.position.y, 3);
        const entities = this.server.map.getEntities(entity.position.x, entity.position.y, 3);
        for (const tile of tiles) {
            const distance = tile.realPosition.distance(entity.position);
            if (!this.isBridge(entity.type) && tile.type === TileType_1.TileType.RIVER && tile.position.x === ~~(entity.position.x / 100) && tile.position.y === ~~(entity.position.y / 100))
                return;
            if (!this.isBridge(entity.type) && distance < tile.radius + 35)
                return;
        }
        for (const unit of entities) {
            if (unit.position.distance(entity.position) < unit.radius + entity.radius)
                return;
        }
        if (!this.server.map.getBiomesAtEntityPosition(entity).length)
            return;
        player.lastBuildingStamp = Date.now();
        player.inventory.removeItem(id, 1);
        player.client.sendU8([ClientPackets_1.ClientPackets.ACCEPT_BUILD, id]);
        player.buildings.push(entity);
        this.server.entities.push(entity);
    }
    getOffsetVector(v, distanceToMove, angle) {
        return v.add(new Vector_1.Vector(distanceToMove * Math.cos((angle / 255) * (Math.PI * 2)), distanceToMove * Math.sin((angle / 255) * (Math.PI * 2))));
    }
    isSpike(type) {
        return [
            EntityType_1.EntityType.SPIKE,
            EntityType_1.EntityType.STONE_SPIKE,
            EntityType_1.EntityType.GOLD_SPIKE,
            EntityType_1.EntityType.DIAMOND_SPIKE,
            EntityType_1.EntityType.AMETHYST_SPIKE,
            EntityType_1.EntityType.REIDITE_SPIKE
        ].includes(type);
    }
    isWall(type) {
        return [
            EntityType_1.EntityType.WALL,
            EntityType_1.EntityType.STONE_WALL,
            EntityType_1.EntityType.GOLD_WALL,
            EntityType_1.EntityType.DIAMOND_WALL,
            EntityType_1.EntityType.AMETHYST_WALL,
            EntityType_1.EntityType.REIDITE_WALL
        ].includes(type);
    }
    isDoor(type) {
        return [
            EntityType_1.EntityType.WOOD_DOOR,
            EntityType_1.EntityType.STONE_DOOR,
            EntityType_1.EntityType.GOLD_DOOR,
            EntityType_1.EntityType.DIAMOND_DOOR,
            EntityType_1.EntityType.AMETHYST_DOOR,
            EntityType_1.EntityType.REIDITE_DOOR
        ].includes(type);
    }
    isFire(type) {
        return [EntityType_1.EntityType.FIRE, EntityType_1.EntityType.BIG_FIRE, EntityType_1.EntityType.FURNACE].includes(type);
    }
    isWorkbench(type) {
        return [EntityType_1.EntityType.WORKBENCH].includes(type);
    }
    isBridge(type) {
        return [EntityType_1.EntityType.BRIDGE].includes(type);
    }
}
exports.BuildingSystem = BuildingSystem;
