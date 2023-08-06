import {Server} from "../../Server";
import { Vector } from "../../modules/Vector";
import {EntityType} from "../../enums/EntityType";
import {Player} from "../../entities/Player";
import {InventoryType} from "../../enums/InventoryType";
import {Fire} from "../../entities/buildings/Fire";
import {Workbench} from "../../entities/buildings/Workbench";
import {Wall} from "../../entities/buildings/Wall";
import {Spike} from "../../entities/buildings/Spike";
import {Door} from "../../entities/buildings/Door";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {Bridge} from "../../entities/buildings/Bridge";
import {TileType} from "../../enums/TileType";

export class BuildingSystem {
    private readonly server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    public request(player: Player, data: number[]) {
        if(data.length < 3 || Date.now() - player.lastBuildingStamp <= 1000) return;

        for (let i = 0; i < data.length; i++) {
            if(!Number.isInteger(data[i])) return;
        }

        const id = data[0];
        const type = EntityType[InventoryType[id] as any] as any;
        const angle = data[1];
        const isGrid = data[2];

        if((isGrid !== 0 && isGrid !== 1) || angle < 0 || angle > 255 || !type) return;

        let entity = null as any;
        if(this.isFire(type)) {
            entity = new Fire(type, this.server);
        } else if (this.isWorkbench(type)) {
            entity = new Workbench(type, this.server);
        } else if (this.isWall(type)) {
            entity = new Wall(type, this.server);
        } else if (this.isSpike(type)) {
            entity = new Spike(type, this.server);
        } else if (this.isDoor(type)) {
            entity = new Door(type, this.server);
        } else if (this.isBridge(type)){
            entity = new Bridge(type, this.server);
        }

        entity.angle = angle;
        entity.position = this.getOffsetVector(player.position, 120, angle);

        if(isGrid || this.isBridge(type)) {
            entity.angle = 0;

            entity.position.x = Math.floor(entity.position.x / 100) * 100 + 50;
            entity.position.y = Math.floor(entity.position.y / 100) * 100 + 50;
        }

        const tiles = this.server.map.getTiles(entity.position.x, entity.position.y, 3);
        const entities = this.server.map.getEntities(entity.position.x, entity.position.y, 3);

        for (const tile of tiles) {
            const distance = tile.realPosition.distance(entity.position);
            if(!this.isBridge(entity.type) && tile.type === TileType.RIVER && tile.position.x === ~~(entity.position.x / 100) && tile.position.y === ~~(entity.position.y / 100))
                return;
            if(!this.isBridge(entity.type) && distance < tile.radius + 35)
                return;
        }

        for (const unit of entities) {
            if(unit.position.distance(entity.position) < unit.radius + entity.radius) return;
        }

        if(!this.server.map.getBiomesAtEntityPosition(entity).length) return;

        player.lastBuildingStamp = Date.now();
        player.inventory.removeItem(id, 1);
        player.client.sendU8([ClientPackets.ACCEPT_BUILD, id]);
        player.buildings.push(entity);
        this.server.entities.push(entity);

    }

    private getOffsetVector(v: Vector, distanceToMove: number, angle: number) {
        return v.add(
            new Vector(
                distanceToMove * Math.cos((angle / 255) * (Math.PI * 2)),
                distanceToMove * Math.sin((angle / 255) * (Math.PI * 2))
            )
        );
    }

    private isSpike(type: number) {
        return [
            EntityType.SPIKE,
            EntityType.STONE_SPIKE,
            EntityType.GOLD_SPIKE,
            EntityType.DIAMOND_SPIKE,
            EntityType.AMETHYST_SPIKE,
            EntityType.REIDITE_SPIKE
        ].includes(type);
    }

    private isWall(type: number) {
        return [
            EntityType.WALL,
            EntityType.STONE_WALL,
            EntityType.GOLD_WALL,
            EntityType.DIAMOND_WALL,
            EntityType.AMETHYST_WALL,
            EntityType.REIDITE_WALL
        ].includes(type);
    }

    private isDoor(type: number) {
        return [
            EntityType.WOOD_DOOR,
            EntityType.STONE_DOOR,
            EntityType.GOLD_DOOR,
            EntityType.DIAMOND_DOOR,
            EntityType.AMETHYST_DOOR,
            EntityType.REIDITE_DOOR
        ].includes(type);
    }

    private isFire(type: number) {
        return [EntityType.FIRE, EntityType.BIG_FIRE, EntityType.FURNACE].includes(type);
    }

    private isWorkbench(type: number) {
        return [EntityType.WORKBENCH].includes(type);
    }

    private isBridge(type: number) {
        return [EntityType.BRIDGE].includes(type);
    }
}