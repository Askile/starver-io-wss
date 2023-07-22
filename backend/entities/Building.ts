import {EntityType} from "../enums/EntityType";
import {Server} from "../Server";
import {Fire} from "./buildings/Fire";
import {Player} from "./Player";
import {Vector} from "../modules/Vector";
import {InventoryType} from "../enums/InventoryType";

export class Building {
    private readonly server: Server;
    private player: Player;
    private readonly type: number;
    constructor(owner: Player, type: number, angle: number) {
        this.player = owner;
        this.server = owner.server;

        this.type = EntityType[InventoryType[type] as any] as any;

        this.summon(angle);
    }

    private summon(angle: number) {
        let entity = null;

        if (this.isFire()) {
            entity = new Fire(this.server, this.type, this.getOffsetVector(120, angle));
        }

        if (entity) entity.angle = angle;
    }

    private getOffsetVector(distanceToMove: number, angle: number) {
        return this.player.position.add(
            new Vector(
                distanceToMove * Math.cos((angle / 255) * (Math.PI * 2)),
                distanceToMove * Math.sin((angle / 255) * (Math.PI * 2))
            )
        );
    }

    private isSpike() {
        return [
            EntityType.SPIKE,
            EntityType.STONE_SPIKE,
            EntityType.GOLD_SPIKE,
            EntityType.DIAMOND_SPIKE,
            EntityType.AMETHYST_SPIKE,
            EntityType.REIDITE_SPIKE
        ].includes(this.type);
    }

    private isWall() {
        return [
            EntityType.WALL,
            EntityType.STONE_WALL,
            EntityType.GOLD_WALL,
            EntityType.DIAMOND_WALL,
            EntityType.AMETHYST_WALL,
            EntityType.REIDITE_WALL
        ].includes(this.type);
    }

    private isFire() {
        return [EntityType.FIRE, EntityType.BIG_FIRE, EntityType.FURNACE].includes(this.type);
    }
}
