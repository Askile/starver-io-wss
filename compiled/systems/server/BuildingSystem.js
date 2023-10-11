"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingSystem = void 0;
const EntityType_1 = require("../../enums/types/EntityType");
const ItemType_1 = require("../../enums/types/ItemType");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const Building_1 = require("../../entities/Building");
const Utils_1 = require("../../modules/Utils");
const TileType_1 = require("../../enums/types/TileType");
class BuildingSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    request(player, data) {
        if (data.length < 3 || Date.now() - player.lastBuildingStamp <= this.server.config.build_delay)
            return;
        for (let i = 0; i < data.length; i++) {
            if (!Number.isInteger(data[i]))
                return;
        }
        const id = data[0];
        const type = EntityType_1.EntityType[ItemType_1.ItemType[id]];
        const angle = data[1];
        const isGrid = data[2];
        if ((isGrid !== 0 && isGrid !== 1) || angle < 0 || angle > 255 || !type || !player.inventory.containsItem(id, 1))
            return;
        if (player.totem?.data.length > 0 && type === EntityType_1.EntityType.TOTEM)
            return;
        if (player.machine && type === EntityType_1.EntityType.EMERALD_MACHINE)
            return;
        let building = new Building_1.Building(type, player, this.server);
        building.angle = angle;
        building.position = Utils_1.Utils.getOffsetVector(player.realPosition, 120, angle);
        this.server.collision.updateState(building);
        if (isGrid || building.isGrid() || (building.isSeed() && building.plot)) {
            building.angle = 0;
            building.position.x = Math.floor(building.position.x / 100) * 100 + 50;
            building.position.y = Math.floor(building.position.y / 100) * 100 + 50;
        }
        const entities = this.server.map.getEntities(building.position.x, building.position.y, 3);
        const tiles = this.server.map.getTiles(building.position.x, building.position.y, 3);
        if (!building.isGrid() && building.water && !building.bridge && !building.island)
            return;
        if (building.isSeed() && !building.plot && (building.water || building.winter || building.lavaBiome || building.desert))
            return;
        if (building.roof && building.type === EntityType_1.EntityType.ROOF)
            return;
        if (building.bridge && building.type === EntityType_1.EntityType.BRIDGE)
            return;
        if (building.tower && building.type === EntityType_1.EntityType.WOOD_TOWER)
            return;
        if (building.bed && building.type === EntityType_1.EntityType.BED)
            return;
        if (building.plot && building.type === EntityType_1.EntityType.PLOT)
            return;
        if (building.isSeed() && (building.plot && building.seed) || (building.bridge && building.seed))
            return;
        if (building.type === EntityType_1.EntityType.EMERALD_MACHINE && !building.island && building.water)
            return;
        if (!building.isGrid() && !(building.isSeed() && building.plot) || [EntityType_1.EntityType.BED, EntityType_1.EntityType.PLOT].includes(building.type)) {
            for (const entity of entities) {
                const dist = entity.position.distance(building.position);
                if ((building.bridge && !building.infire) && !entity.collide && entity.type !== EntityType_1.EntityType.PLOT)
                    continue;
                if (dist < entity.radius + 45)
                    return;
            }
            for (const tile of tiles) {
                const dist = tile.realPosition.distance(building.position);
                if (tile.type === TileType_1.TileType.SAND)
                    continue;
                if (building.bridge && !tile.collide)
                    continue;
                if (dist < tile.radius + building.radius)
                    return;
            }
        }
        player.lastBuildingStamp = Date.now();
        player.inventory.removeItem(id, 1);
        player.client.sendU8([ClientPackets_1.ClientPackets.ACCEPT_BUILD, id]);
        player.buildings.push(building);
        building.onPlaced();
        this.server.entities.push(building);
    }
}
exports.BuildingSystem = BuildingSystem;
