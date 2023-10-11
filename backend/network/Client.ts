import {WebSocket} from "uWebSockets.js";
import msgpack from "msgpack-lite";
import {Player} from "../entities/Player";
import {Server} from "../Server";
import {Handshake} from "../packets/Handshake";
import NanoTimer from "nanotimer";
import {Crate} from "../entities/Crate";
import {ServerPackets} from "../enums/packets/ServerPackets";
import {ClientPackets} from "../enums/packets/ClientPackets";
import {ClientStringPackets} from "../enums/packets/ClientStringPackets";
import {Logger} from "../modules/Logger";

const logger = new Logger("./logs", {
    console: true,
    file: false
})
export class Client {
    public socket: WebSocket<any>;
    public packetsQty: number[] = new Array(36).fill(0);

    public isActive: boolean = true;
    public server: Server;
    public player!: Player;

    constructor(socket: WebSocket<any>, server: Server) {
        this.server = server;
        this.socket = socket;

        new NanoTimer().setInterval(() => {
            this.packetsQty.fill(0);
        },[], "1s");
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
                if (PACKET_DATA.length !== 14) {
                    this.socket.close();
                    return;
                }

                logger.info([PACKET_TYPE, ...PACKET_DATA]);
                if(this.server.players.length >= 99) {
                    return this.sendBinary(new Uint8Array([ClientPackets.FULL]))
                }
                const handshake = new Handshake([PACKET_TYPE, ...PACKET_DATA], this);
                const player = this.server.findPlayerByToken(handshake.token as any, handshake.token_id as any);
                if (player) {
                    player.client.sendU8([ClientPackets.STEAL_TOKEN]);
                    if(player.client.isActive) player.client.socket.close();

                    player.client = this;
                    player.updatePool = new Array(1000).fill(0);
                    this.player = player;

                    handshake.restoreResponse(player);
                } else {

                    const tokenScore = this.server.tokenSystem.getToken(handshake.token as any) || this.server.tokenSystem.createToken(handshake.token as any);
                    if (tokenScore) this.server.tokenSystem.joinToken(tokenScore, handshake.token_id as any);

                    this.player = new Player(this, tokenScore);

                    handshake.setupPlayer(this.player);

                    this.server.players.push(this.player);
                    this.server.entities.push(this.player);

                    handshake.response(this.player);
                }

                handshake.broadcastCosmetics(this.player);

            }

            this.receivePacket(PACKET_TYPE, PACKET, PACKET_DATA);
        } catch (error) {}
    }

    public receivePacket(PACKET_TYPE: number, PACKET: any, PACKET_DATA: any) {
        this.packetsQty[PACKET_TYPE]++;

        if (!Number.isInteger(PACKET_TYPE) && PACKET_TYPE > 40 || PACKET_TYPE < 0) return;
        if (this.packetsQty[0] > 5) return this.socket.close();
        if (this.packetsQty[3] > 10) return this.socket.close();
        if (this.packetsQty[PACKET_TYPE] > 30) return this.socket.close();

        if(this.player.isCrafting && [
                ServerPackets.ATTACK, ServerPackets.INTERACTION,
                ServerPackets.CRAFT, ServerPackets.RECYCLE_START,
                ServerPackets.DROP_ONE_ITEM, ServerPackets.DROP_ITEM,
                ServerPackets.GIVE_ITEM, ServerPackets.TAKE_ITEM,
                ServerPackets.LOCK_CHEST, ServerPackets.BUILD
        ].includes(PACKET_TYPE)) return;

        switch (PACKET_TYPE) {
            case ServerPackets.CHAT:
                this.server.broadcast(JSON.stringify([ClientStringPackets.CHAT, this.player.id, PACKET]), false, this.socket);
                break;
            case ServerPackets.MOVEMENT:
                this.player.direction = PACKET;
                break;
            case ServerPackets.ANGLE:
                this.player.angle = Number(PACKET) % 255;
                break;
            case ServerPackets.ATTACK:
                this.player.attack = true;
                this.player.angle = Number(PACKET) % 255;
                this.server.combatSystem.handleAttack(this.player);
                break;
            case ServerPackets.INTERACTION:
                this.server.interactionSystem.request(this.player, PACKET);
                break;
            case ServerPackets.DROP_ONE_ITEM:
                if (this.player.inventory.items.has(PACKET))
                    new Crate(this.server, {
                        owner: this.player,
                        item: PACKET,
                        count: this.player.inventory.items.get(PACKET)
                    });
                this.sendBinary(this.player.inventory.deleteItem(PACKET));
                break;
            case ServerPackets.CRAFT:
                this.server.craftSystem.handleCraft(this.player, PACKET);
                break;
            case ServerPackets.UNLOCK_CHEST:
                this.server.storageSystem.unlockChest(this.player);
                break;
            case ServerPackets.LOCK_CHEST:
                this.server.storageSystem.lockChest(this.player);
                break;
            case ServerPackets.GIVE_ITEM:
                this.server.storageSystem.giveChestItem(this.player, PACKET_DATA);
                break;
            case ServerPackets.TAKE_ITEM:
                this.server.storageSystem.takeChestItem(this.player);
                break;
            case ServerPackets.RECYCLE_START:
                this.server.craftSystem.handleRecycle(this.player, PACKET);
                break;
            case ServerPackets.BUILD:
                this.server.buildingSystem.request(this.player, PACKET_DATA);
                break;
            case ServerPackets.STOP_ATTACK:
                this.player.attack = false;
                break;
            case ServerPackets.CHOOSE_KIT:
                this.server.kitSystem.buy(this.player, PACKET);
                break;
            case ServerPackets.CLAIM_QUEST_REWARD:
                this.server.questSystem.gainQuest(this.player, PACKET);
                break;
            case ServerPackets.DROP_ITEM:
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
            case ServerPackets.JOIN_TEAM:
                this.server.totemSystem.joinTeam(this.player);
                break;
            case ServerPackets.LEAVE_TEAM:
                this.server.totemSystem.leaveTeam(this.player);
                break;
            case ServerPackets.KICK_TEAM:
                this.server.totemSystem.kickTeam(this.player, PACKET);
                break;
            case ServerPackets.LOCK_TEAM:
                this.server.totemSystem.lockTeam(this.player);
                break;
            case ServerPackets.MARKET:
                this.server.marketSystem.buy(this.player, PACKET_DATA);
                break;
            case ServerPackets.CONSOLE:
                this.server.commandSystem.handleCommand(this.player, PACKET);
                break;
            case ServerPackets.GIVE_WELL:
                this.server.storageSystem.giveWell(this.player);
                break;
            case ServerPackets.TAKE_BREAD_OVEN:
                this.server.storageSystem.takeBread(this.player);
                break;
            case ServerPackets.GIVE_FLOUR_OVEN:
                this.server.storageSystem.giveFlourOven(this.player, PACKET);
                break;
            case ServerPackets.GIVE_WOOD_OVEN:
                this.server.storageSystem.giveWoodOven(this.player, PACKET);
                break;
            case ServerPackets.GIVE_FURNACE:
                this.server.storageSystem.giveFurnace(this.player, PACKET);
                break;
            case ServerPackets.TAKE_FLOUR:
                this.server.storageSystem.takeFlour(this.player);
                break;
            case ServerPackets.GIVE_WHEAT:
                this.server.storageSystem.giveWheat(this.player, PACKET);
                break;
            case ServerPackets.TAKE_EXTRACTOR:
                this.server.storageSystem.takeResourceExtractor(this.player);
                break;
            case ServerPackets.GIVE_WOOD_EXTRACTOR:
                this.server.storageSystem.giveWoodExtractor(this.player, PACKET);
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
