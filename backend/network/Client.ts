import {WebSocket} from "uWebSockets.js";
import msgpack from "msgpack-lite";
import {Player} from "../entities/Player";
import {Server} from "../Server";
import {Handshake} from "../packets/Handshake";
import NanoTimer from "nanotimer";
import {EntityType} from "../enums/EntityType";
import {Box} from "../entities/Box";
import {ActionType} from "../enums/ActionType";
import {ServerPackets} from "../enums/packets/ServerPackets";

export class Client {
    public socket: WebSocket<any>;
    public packetsQty: number[] = new Array(36).fill(0);
    public packetsSize: number[] = new Array(36).fill(0);

    public isActive: boolean = true;
    public server: Server;
    public player!: Player;

    constructor(socket: WebSocket<any>, server: Server) {
        this.server = server;
        this.socket = socket;

        new NanoTimer().setInterval(
            () => {
                this.packetsQty.fill(0);
            },
            [],
            "1s"
        );
    }

    public onMessage(buffer: ArrayBuffer, isBinary: boolean) {
        if (!isBinary) {
            this.socket.close();
            return;
        }

        try {
            const PACKET_DATA = msgpack.decode(new Uint8Array(buffer));
            const PACKET_TYPE = PACKET_DATA.shift();
            const PACKET = PACKET_DATA[0];

            if (!this.player && typeof PACKET_TYPE !== "string") {
                this.socket.close();
                return;
            } else if (typeof PACKET_TYPE === "string") {
                if (PACKET_DATA.length !== 15) {
                    this.socket.close();
                    return;
                }
                const handshake = new Handshake([PACKET_TYPE, ...PACKET_DATA], this);
                this.player = new Player(this);
                handshake.setupPlayer(this.player);

                this.server.players.push(this.player);
                this.server.entities.push(this.player);

                handshake.response(this.player);
            }

            this.receivePacket(PACKET_TYPE, PACKET, PACKET_DATA);
        } catch (error) {
            // Обработка ошибки
        }
    }

    public receivePacket(PACKET_TYPE: number, PACKET: any, PACKET_DATA: number[]) {
        this.packetsQty[PACKET_TYPE]++;
        this.packetsSize[PACKET_TYPE] += PACKET_DATA.length;

        if (this.packetsQty[0] > 5) {
            this.socket.close();
            return;
        }
        if (this.packetsQty[3] > 10) {
            this.socket.close();
            return;
        }
        if (this.packetsQty[PACKET_TYPE] > 30) {
            this.socket.close();
            return;
        }

        switch (PACKET_TYPE) {
            case ServerPackets.CHAT:
                this.broadcast(JSON.stringify([0, this.player.id, PACKET]));
                break;
            case ServerPackets.MOVEMENT:
                this.player.direction = PACKET;
                break;
            case ServerPackets.ANGLE:
                this.player.angle = Number(PACKET) % 255;
                break;
            case ServerPackets.ATTACK:
                this.player.angle = Number(PACKET) % 255;
                this.player.action |= ActionType.ATTACK;
                this.player.attackManager.isAttack = true;
                break;
            case ServerPackets.INTERACTION:
                this.player.interactionManager.useItem(PACKET);
                break;
            case 6:
                if (this.player.inventory.items.has(PACKET))
                    new Box(this.server, EntityType.CRATE, {
                        owner: this.player,
                        item: PACKET,
                        count: this.player.inventory.items.get(PACKET)
                    });
                this.sendBinary(this.player.inventory.deleteItem(PACKET));
                break;
            case 14:
                this.player.attackManager.isAttack = false;
                break;
            case 28:
                if (this.player.inventory.items.has(PACKET))
                    new Box(this.server, EntityType.CRATE, {
                        owner: this.player,
                        item: PACKET,
                        count: 1
                    });
                this.sendBinary(this.player.inventory.removeItem(PACKET, 1));
                break;
            case 36:
                this.player.commandManager.handleCommand(PACKET);
                break;
        }
    }

    public onClose() {
        this.isActive = false;

        this.player.action = 1;
        new NanoTimer().setTimeout(
            () => {
                this.server.playerPool.deleteId(this.player.id);
                this.server.players = this.server.players.filter((player) => player !== this.player);
                this.server.entities = this.server.entities.filter((player) => player !== this.player);
            },
            [],
            "0.1s"
        );
    }

    public sendJSON(message: any) {
        this.socket.send(JSON.stringify(message));
    }

    public sendBinary(message: Uint8Array | Uint16Array | Uint32Array | undefined) {
        if (this.isActive && message) this.socket.send(message, true);
    }

    public broadcast(message: any) {
        const clients = Array.from(this.server.wss.clients.values());
        for (const client of clients) {
            if (client.socket !== this.socket) client.socket.send(message);
        }
    }
}
