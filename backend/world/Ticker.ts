import {Server} from "../Server";
import NanoTimer from "nanotimer";
import ServerConfig from "../JSON/ServerConfig.json";
import {EntityPacket} from "../packets/EntityPacket";
import {ActionType} from "../enums/ActionType";

export class Ticker {
    private server: Server;
    constructor(server: Server) {
        this.server = server;

        new NanoTimer().setInterval(
            () => {
                for (const player of this.server.players) {
                    player.attackManager.tick();
                }
            },
            [],
            1 / 5 + "s"
        );
        new NanoTimer().setInterval(
            () => {
                for (const player of this.server.players) {
                    //player.movement.tick();
                }
                this.server.movement.tick();
                this.server.collision.tick();
            },
            [],
            1 / ServerConfig.engine_tps + "s"
        );
        new NanoTimer().setInterval(() => this.entityTick(), [], 1 / ServerConfig.network_tps + "s");
        new NanoTimer().setInterval(() => this.server.leaderboard.tick(), [], 1 / ServerConfig.leaderboard_tps + "s");
    }

    private entityTick() {
        const players = this.server.players;
        for (const player of players) {
            player.interactionManager.setEquipment();
            new EntityPacket(player, false);
        }

        for (const entity of this.server.entities) {
            if (entity.action & ActionType.ATTACK) entity.action -= ActionType.ATTACK;
            if (entity.action & ActionType.HUNGER) entity.action -= ActionType.HUNGER;
            if (entity.action & ActionType.COLD) entity.action -= ActionType.COLD;
            if (entity.action & ActionType.HEAL) entity.action -= ActionType.HEAL;
            if (entity.action & ActionType.HURT) entity.action -= ActionType.HURT;

            entity.old.position = JSON.parse(JSON.stringify(entity.position));
            entity.old.angle = JSON.parse(JSON.stringify(entity.angle));
            entity.old.extra = JSON.parse(JSON.stringify(entity.extra));
            entity.old.info = JSON.parse(JSON.stringify(entity.info));
        }
    }
}
