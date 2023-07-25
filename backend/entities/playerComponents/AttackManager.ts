import {InventoryType} from "../../enums/InventoryType";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {BinaryWriter} from "../../modules/BinaryWriter";
import {Player} from "../Player";

export class AttackManager {
    private player: Player;
    private lastAttack: number = 0;
    public isAttack: boolean = false;
    constructor(player: Player) {
        this.player = player;
    }

    public tick() {
        if (this.isAttack && Date.now() - this.lastAttack >= 5e2) {
            this.lastAttack = Date.now();

            const tiles = this.player.server.map.getTiles(this.player.position.x, this.player.position.y, 2);
            const distanceToMove = this.player.right.type === "tool" ? 40 : 20;

            const offsetX = distanceToMove * Math.cos((this.player.angle / 255) * (Math.PI * 2));
            const offsetY = distanceToMove * Math.sin((this.player.angle / 255) * (Math.PI * 2));

            const shake = new BinaryWriter();
            shake.writeUInt16(ClientPackets.HITTEN);
            for (const tile of tiles) {
                if (!InventoryType[tile.resource]) continue;
                const dx = tile.position.x * 100 + 50 - (this.player.position.x + offsetX);
                const dy = tile.position.y * 100 + 50 - (this.player.position.y + offsetY);
                const distance = Math.hypot(dx, dy);
                const totalRadius = tile.radius + (this.player.right.type === "tool" ? 45 : 20);

                if (distance < totalRadius) {
                    let harvest = Math.max(0, this.player.right.harvest + 1 - tile.hard);

                    if (tile.hard === -1) harvest = 1;

                    shake.writeUInt16(...tile.shake(this.player.angle));
                    if (!harvest) {
                        this.player.client.sendBinary(new Uint8Array([ClientPackets.DONT_HARVEST]));
                        continue;
                    }
                    this.player.client.sendBinary(
                        this.player.inventory.giveItem(InventoryType[tile.resource] as any, harvest)
                    );

                    this.player.stats.score += harvest * (tile.hard === -1 ? 1 : tile.hard);
                }
            }

            if (shake.toBuffer().length > 3) this.player.server.broadcast(shake.toBuffer(), true);
        }
    }
}
