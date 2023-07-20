import {Server} from "../Server";
import {BinaryWriter} from "../modules/BinaryWriter";
import NanoTimer from "nanotimer";
import ServerConfig from "../JSON/ServerConfig.json";
import {ClientPackets} from "../enums/packets/ClientPackets";
import {EntityPacket} from "../packets/EntityPacket";
import {Vector} from "../modules/Vector";
import {entitySpeed} from "../entities/components/EntitySpeed";
import {Player} from "../entities/Player";
import {ActionType} from "../enums/ActionType";

export class Ticker {
    private server: Server;
    constructor(server: Server) {
        this.server = server;

        // prettier-ignore
        new NanoTimer().setInterval(() => {
                this.entityTick();
        },[],1 / ServerConfig.network_tps + "s");

        // prettier-ignore
        new NanoTimer().setInterval(() => {
                this.movementTick();
        },[],1 / ServerConfig.engine_tps + "s");

        // prettier-ignore
        new NanoTimer().setInterval(() => {
                this.leaderboardTick();
        },[],1 / ServerConfig.leaderboard_tps + "s");
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

            entity.old.position = entity.position;

            if (entity.action & ActionType.IDLE) {
                entity.action -= ActionType.IDLE;
                entity.action |= ActionType.WALK;
            }

            let angle = Math.atan2(entity.direction & 4 ? 1 : entity.direction & 8 ? -1 : 0, entity.direction & 2 ? 1 : entity.direction & 1 ? -1 : 0);

            entity.position = entity.position.add(entity.velocity.divide(ServerConfig.engine_tps));

            if (entity instanceof Player) {
                if (entity.pet.id) entity.speed = entity.pet.speed * 1000 - (entity.right.type === "weapon" ? 30 : 0);
                else entity.speed = entitySpeed[entity.type] - (entity.right.type === "weapon" ? 30 : 0);
            }

            entity.position.x = Math.max(0, Math.min(this.server.map.width - 1, entity.position.x));
            entity.position.y = Math.max(0, Math.min(this.server.map.height - 1, entity.position.y));

            entity.velocity.x = entity.speed * Math.cos(angle);
            entity.velocity.y = entity.speed * Math.sin(angle);
        }
    }

    private entityTick() {
        const players = this.server.players;
        for (const player of players) {
            new EntityPacket(player, false);
            player.interactionManager.setEquipment();
            player.attackManager.hit();
        }

        const entities = this.server.entities;
        for (const entity of entities) {
            if (entity.action & ActionType.ATTACK) entity.action -= ActionType.ATTACK;

            entity.old.angle = entity.angle;
            entity.old.extra = entity.extra;
            entity.old.info = entity.info;
        }
    }

    private leaderboardTick() {
        const writer = new BinaryWriter();
        const leaderboard = this.server.players.sort((a, b) => b.stats.score - a.stats.score).slice(0, 10);

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
