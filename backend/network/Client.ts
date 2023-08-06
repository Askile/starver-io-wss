import {WebSocket} from "uWebSockets.js";
import msgpack from "msgpack-lite";
import {Player} from "../entities/Player";
import {Server} from "../Server";
import {Handshake} from "../packets/Handshake";
import NanoTimer from "nanotimer";
import {EntityType} from "../enums/EntityType";
import {Crate} from "../entities/Crate";
import {ActionType} from "../enums/ActionType";
import {ServerPackets} from "../enums/packets/ServerPackets";
import {ClientPackets} from "../enums/packets/ClientPackets";

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
                const player = this.server.players.find(player => player.data.token === handshake.token);

                if(player) {
                    if(player.client.isActive) {
                        player.client.sendBinary(new Uint8Array([ClientPackets.STEAL_TOKEN]));
                        if(player.client.isActive) player.client.socket.close();
                    }
                    this.player = player;
                    player.client = this;
                    handshake.response(this.player, true);
                    return;
                }
                if(this.server.players.length >= 99) {
                    return this.sendBinary(new Uint8Array([ClientPackets.FULL]))
                }

                this.player = new Player(this);

                handshake.setupPlayer(this.player);

                this.server.players.push(this.player);
                this.server.entities.push(this.player);

                handshake.response(this.player);
                handshake.broadcastCosmetics(this.player);

            }

            this.receivePacket(PACKET_TYPE, PACKET, PACKET_DATA);
        } catch (error) {}
    }

    public receivePacket(PACKET_TYPE: number, PACKET: any, PACKET_DATA: number[]) {
        this.packetsQty[PACKET_TYPE]++;
        this.packetsSize[PACKET_TYPE] += PACKET_DATA.length;

        // if (this.packetsQty[0] > 5) return this.socket.close();
        // if (this.packetsQty[3] > 10) return this.socket.close();
        // if (this.packetsQty[PACKET_TYPE] > 30) return this.socket.close();

        switch (PACKET_TYPE) {
            case ServerPackets.CHAT:
                this.server.broadcast(JSON.stringify([0, this.player.id, PACKET]), false, this.socket);
                break;
            case ServerPackets.MOVEMENT:
                this.player.direction = PACKET;
                break;
            case ServerPackets.ANGLE:
                this.player.angle = Number(PACKET) % 255;
                break;
            case ServerPackets.ATTACK:
                if(this.player.isCrafting) break;
                this.player.attack = true;
                this.player.angle = Number(PACKET) % 255;
                this.player.action |= ActionType.ATTACK;
                this.server.combatSystem.handleAttack(this.player);
                break;
            case ServerPackets.INTERACTION:
                if(this.player.isCrafting) break;
                this.server.interactionSystem.request(this.player, PACKET);
                break;
            case ServerPackets.DROP_ONE_ITEM:
                if(this.player.isCrafting) break;
                if (this.player.inventory.items.has(PACKET))
                    new Crate(this.server, {
                        owner: this.player,
                        item: PACKET,
                        count: this.player.inventory.items.get(PACKET)
                    });
                this.sendBinary(this.player.inventory.deleteItem(PACKET));
                break;
            case ServerPackets.CRAFT:
                if(this.player.isCrafting) break;
                this.server.craftSystem.handleCraft(this.player, PACKET);
                break;
            case ServerPackets.RECYCLE_START:
                if(this.player.isCrafting) break;
                this.server.craftSystem.handleRecycle(this.player, PACKET);
                break;
            case ServerPackets.BUILD:
                if(this.player.isCrafting) break;
                this.server.buildingSystem.request(this.player, PACKET_DATA);
                break;
            case ServerPackets.STOP_ATTACK:
                this.player.attack = false;
                break;
            case ServerPackets.DROP_ITEM:
                if(this.player.isCrafting) break;
                if (this.player.inventory.items.has(PACKET))
                    new Crate(this.server, {
                        owner: this.player,
                        item: PACKET,
                        count: 1
                    });
                this.sendBinary(this.player.inventory.removeItem(PACKET, 1));
                break;
            case ServerPackets.CANCEL_CRAFT:
                this.server.craftSystem.stopCraft(this.player);
                break;
            case ServerPackets.CONSOLE:
                break;
        }
    }

    public onClose() {
        this.isActive = false;
    }

    public sendJSON(message: any) {
        if (this.isActive && message) this.socket.send(JSON.stringify(message));
    }

    public sendU8(message: any){
        if (this.isActive && message) this.socket.send(new Uint8Array(message), true);
    }

    public sendU16(message: any){
        if (this.isActive && message) this.socket.send(new Uint16Array(message), true);
    }

    public sendU32(message: any){
        if (this.isActive && message) this.socket.send(new Uint32Array(message), true);
    }

    public sendBinary(message: Uint8Array | Uint16Array | Uint32Array | undefined) {
        if (this.isActive && message) this.socket.send(message, true);
    }
}
