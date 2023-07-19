import { Server } from "../Server";
import { BinaryWriter } from "../modules/BinaryWriter";
import NanoTimer from "nanotimer";
import ServerConfig from "../ServerConfig.json";
import { ClientPackets } from "../enums/packets/ClientPackets";
import { EntityPacket } from "../packets/EntityPacket";
import { Vector } from "../modules/Vector";
import { entitySpeed } from "../entities/components/EntitySpeed";
import { Player } from "../entities/Player";
import { Collision } from "../modules/Collision";
import { ActionType } from "../enums/ActionType";

export class Ticker {
    private server: Server;

    constructor(server: Server) {
        this.server = server;

        new NanoTimer().setInterval(() => {
            this.entityTick();
        }, [], 1 / ServerConfig.network_tps + "s");

        new NanoTimer().setInterval(() => {

            this.movementTick();
        }, [], 1 / ServerConfig.engine_tps + "s");

        new NanoTimer().setInterval(() => {
            this.leaderboardTick();
        }, [], ServerConfig.leaderboard_tps + "s");
    }

    private movementTick() {
        for (const entity of this.server.entities) {
            if (!entity.direction) {
                entity.velocity = new Vector(0, 0);
                if (entity.action & ActionType.WALK) {
                    entity.action -= ActionType.WALK;
                    entity.action |= ActionType.IDLE;
                }
                continue;
            }

            if (entity.action & ActionType.IDLE) {
                entity.action -= ActionType.IDLE;
                entity.action |= ActionType.WALK;
            }

            let angle = Math.atan2(
                entity.direction & 4 ? 1 : entity.direction & 8 ? -1 : 0,
                entity.direction & 2 ? 1 : entity.direction & 1 ? -1 : 0
            );

            entity.velocity.x = entity.speed * Math.cos(angle);
            entity.velocity.y = entity.speed * Math.sin(angle);

            if (entity instanceof Player && !entity.pet.isFly) {
                this.collisionTick();
            } else if (!(entity instanceof Player)) {
                this.collisionTick();
            }

            entity.position = entity.position.add(
                entity.velocity.divide(ServerConfig.engine_tps)
            );

            for (const biome of this.server.map.biomes) {
                const biomePos = biome.position as Vector;
                if (
                    entity.position.isVectorInsideRectangle(
                        biomePos.subtract(biomePos.divide(2)),
                        biome.size.x,
                        biome.size.y
                    ) &&
                    !entity.biomes.includes(biome)
                ) {
                    entity.biomes.push(biome);
                } else {
                    entity.biomes = entity.biomes.filter((b) => b !== biome);
                }
            }

            if (entity instanceof Player) {
                if (entity.pet.id !== 0) {
                    entity.speed = entity.pet.speed * 1000 - (entity.right.type === "weapon" ? 30 : 0);
                } else {
                    entity.speed = entitySpeed[entity.type] - (entity.right.type === "weapon" ? 30 : 0);
                }
            }

            entity.position.x = Math.max(0, Math.min(this.server.map.width, entity.position.x));
            entity.position.y = Math.max(0, Math.min(this.server.map.height, entity.position.y));

        }
    }

    private collisionTick() {
        const { chunks } = this.server.map;

        for (const entity of this.server.entities) {
            const { x, y } = entity.position;
            const chunkX = Math.floor(x / 100);
            const chunkY = Math.floor(y / 100);
            const chunk = [];

            for (let offsetY = -2; offsetY <= 2; offsetY++) {
                const chunkRow = chunks[chunkY + offsetY];

                for (let offsetX = -2; offsetX <= 2; offsetX++) {
                    const row = chunkRow && chunkRow[chunkX + offsetX];
                    if (row) {
                        chunk.push(...row);
                    }
                }
            }

            for (const tile of chunk) {
                const tileX = tile.x * 100 + 50;
                const tileY = tile.y * 100 + 50;
                const dx = tileX - x;
                const dy = tileY - y;
                const distance = Math.hypot(dx, dy);
                const totalRadius = tile.radius + 25;

                if (distance < totalRadius) {
                    const newCoordinates = Collision.getClosestPointOnCircle(
                        {
                            x: entity.position.x,
                            y: entity.position.y,
                            radius: 25,
                        },
                        {
                            x: tileX,
                            y: tileY,
                            radius: tile.radius,
                        }
                    );


                    entity.position.x = tileX + newCoordinates.x;
                    entity.position.y = tileY + newCoordinates.y;
                    entity.isCollide = true;
                }
            }
        }
    }

    private entityTick() {
        const players = this.server.players;
        for (const player of players) {
            new EntityPacket(player, false);
            player.interactionManager.setEquipment();
        }

        const entities = this.server.entities;
        for (const entity of entities) {
            if (entity.isCollide) {
                entity.speed = 100;
                entity.isCollide = false;
            }

            if (entity.action & ActionType.ATTACK) {
                entity.action -= ActionType.ATTACK;
            }


            entity.old.position = entity.position;
            entity.old.angle = entity.angle;
            entity.old.extra = entity.extra;
            entity.old.info = entity.info;
        }
    }

    private leaderboardTick() {
        const writer = new BinaryWriter();
        const leaderboard = this.server.players
            .sort((a, b) => b.stats.score - a.stats.score)
            .slice(0, 10);

        writer.writeUInt16(ClientPackets.LEADERBOARD);

        for (const player of leaderboard) {
            writer.writeUInt16(player.id);
            writer.writeUInt16(player.stats.score);
        }

        const players = this.server.players;
        for (const player of players) {
            player.client.sendBinary(writer.toBuffer());
        }
    }
}