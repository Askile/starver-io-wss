// TODO
import {Server} from "../../Server";
import {Player} from "../../entities/Player";
import {BinaryWriter} from "../../modules/BinaryWriter";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {InventoryType} from "../../enums/InventoryType";
import {Vector} from "../../modules/Vector";
import {ActionType} from "../../enums/ActionType";
import {Crate} from "../../entities/Crate";
import {DeathReason} from "../../enums/DeathReason";
import {Wall} from "../../entities/buildings/Wall";
import {Entity} from "../../entities/Entity";
import {Spike} from "../../entities/buildings/Spike";
import {Fire} from "../../entities/buildings/Fire";
import {Bridge} from "../../entities/buildings/Bridge";
import {Door} from "../../entities/buildings/Door";
import {Workbench} from "../../entities/buildings/Workbench";

export class CombatSystem {
    private server: Server;
    constructor(server: Server) {
        this.server = server;
    }

    public tick() {
        for (const player of this.server.players) {
            this.handleAttack(player);
        }
    }

    public handleAttack(player: Player) {
        if(Date.now() - player.lastAttack > 500 && player.attack) {
            player.lastAttack = Date.now();

            const chunks = this.server.map.getChunks(player.position.x, player.position.y, 3);
            const radius = ["tool", "hammer"].includes(player.right.type)  ? 45 : player.right.type === "weapon" ? 45 : 20;
            const offset = ["tool", "hammer"].includes(player.right.type) ? 50 : player.right.type === "weapon" ? 65 : 20;

            const offsetX = offset * Math.cos((player.angle / 255) * (Math.PI * 2));
            const offsetY = offset * Math.sin((player.angle / 255) * (Math.PI * 2));

            const shake = new BinaryWriter();
            shake.writeUInt16(ClientPackets.HITTEN);

            for (const chunk of chunks) {
                for (const tile of chunk.tiles) {
                    const distance = tile.realPosition.distance(player.position.add(new Vector(offsetX, offsetY)));
                    const totalRadius = tile.radius + radius;

                    if (distance < totalRadius) {
                        let harvest = Math.max(0, player.right.harvest + 1 - tile.hard);

                        if (tile.hard === -1) harvest = 1;

                        shake.writeUInt16(...tile.shake(player.angle));
                        if (!harvest) {
                            player.client.sendU8([ClientPackets.DONT_HARVEST]);
                            continue;
                        }
                        if(tile.count <= 0) {
                            player.client.sendU8([ClientPackets.EMPTY_RES]);
                            continue;
                        }

                        player.client.sendBinary(
                            player.inventory.giveItem(InventoryType[tile.resource as any] as any, harvest)
                        );

                        tile.count = Math.clamp(tile.count - harvest, 0, tile.limit);

                        if(tile.entity) tile.entity.info = tile.count;

                        player.stats.score += harvest * (tile.hard === -1 ? 1 : tile.hard);
                    }
                }
                for (const entity of chunk.entities) {
                    if(entity === player) continue;

                    const distance = entity.position.distance(player.position.add(new Vector(offsetX, offsetY)));
                    const totalRadius = entity.radius + radius;
                    if (distance < totalRadius) {
                        if(entity instanceof Player) {
                            entity.reason = DeathReason.PLAYER;
                            entity.client.sendBinary(entity.healthSystem.damage(player.right.damage + entity.helmet.defense + (entity.right.defense ? entity.right.defense : 0), ActionType.HURT, player));
                            return;
                        }

                        if(this.isBuilding(entity)) {
                            if(player.right.type === "hammer") {
                                entity.healthSystem.damage(player.right.building_damage, ActionType.HURT, player);
                            } else {
                                entity.healthSystem.damage(~~(player.right.damage / 4), ActionType.HURT, player);
                            }

                            const writer = new BinaryWriter();

                            writer.writeUInt16(ClientPackets.HITTEN_OTHER);
                            writer.writeUInt16(entity.id);
                            writer.writeUInt8(entity.id);
                            writer.writeUInt8(player.angle);

                            player.client.sendBinary(writer.toBuffer());

                            // entity.info = entity.healthSystem.health / entity.healthSystem.maxHealth * 100;

                            return;
                        }

                        entity.healthSystem.damage(player.right.damage, ActionType.HURT, player);
                    }
                }
            }

            if (shake.toBuffer().length > 3) {
                this.server.broadcast(shake.toBuffer(), true);
            }
        }
    }

    public isBuilding(entity: Entity) {
        return entity instanceof Wall || entity instanceof Spike || entity instanceof Fire || entity instanceof Bridge || entity instanceof Door || entity instanceof Workbench;
    }
}