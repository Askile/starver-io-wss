import {Player} from "../Player";
import {Fire} from "../buildings/Fire";
import {Workbench} from "../buildings/Workbench";
import {Well} from "../buildings/Well";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {TileType} from "../../enums/TileType";
import {Client} from "../../network/Client";

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
            if (entity instanceof Fire && dist < 180) {
                isFire = true;
            } else if (entity instanceof Workbench && dist < 180) {
                isWorkbench = true;
            } else if (entity instanceof Well && dist < 180) {
                isWell = true;
            }
        }

        for (const tile of playerChunk.tiles) {
            if(tile.type === "iblk") isIsland = true;
        }

        if(!biomes.length && !isIsland) {
            isWater = true;
        }
        for (const tile of playerChunk.tiles) {
            if(tile.type === TileType.RIVER) {
                isWater = true;
            }
        }

        if(isWorkbench !== this.player.workbench) {
            this.player.client.sendU8([ClientPackets.WORKBENCH, Number(isWorkbench)]);
        }

        if(isFire !== this.player.fire) {
            this.player.client.sendU8([ClientPackets.FIRE, Number(isFire)]);
        }

        if(isWater !== this.player.water) {
            this.player.client.sendU8([ClientPackets.WATER, Number(isWater)])
        }

        if(isWell !== this.player.well) {
            this.player.client.sendU8([ClientPackets.WELL, Number(isWell)]);
        }

        this.player.water = isWater;
        this.player.workbench = isWorkbench;
        this.player.fire = isFire;

    }
}