"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const msgpack_lite_1 = __importDefault(require("msgpack-lite"));
const Player_1 = require("../entities/Player");
const Handshake_1 = require("../packets/Handshake");
const nanotimer_1 = __importDefault(require("nanotimer"));
const Crate_1 = require("../entities/Crate");
const ServerPackets_1 = require("../enums/packets/ServerPackets");
const ClientPackets_1 = require("../enums/packets/ClientPackets");
class Client {
    socket;
    packetsQty = new Array(36).fill(0);
    packetsSize = new Array(36).fill(0);
    isActive = true;
    server;
    player;
    constructor(socket, server) {
        this.server = server;
        this.socket = socket;
        new nanotimer_1.default().setInterval(() => {
            this.packetsQty.fill(0);
        }, [], "1s");
    }
    onMessage(buffer, isBinary) {
        if (!isBinary) {
            this.socket.close();
            return;
        }
        try {
            const PACKET_DATA = msgpack_lite_1.default.decode(new Uint8Array(buffer));
            const PACKET_TYPE = PACKET_DATA.shift();
            const PACKET = PACKET_DATA[0];
            if (!this.player && typeof PACKET_TYPE !== "string") {
                this.socket.close();
                return;
            }
            else if (typeof PACKET_TYPE === "string") {
                if (PACKET_DATA.length !== 15) {
                    this.socket.close();
                    return;
                }
                const handshake = new Handshake_1.Handshake([PACKET_TYPE, ...PACKET_DATA], this);
                const player = this.server.players.find(player => player.data.token === handshake.token);
                if (player) {
                    if (player.client.isActive) {
                        player.client.sendBinary(new Uint8Array([ClientPackets_1.ClientPackets.STEAL_TOKEN]));
                        if (player.client.isActive)
                            player.client.socket.close();
                    }
                    this.player = player;
                    player.client = this;
                    handshake.response(this.player, true);
                    return;
                }
                if (this.server.players.length >= 99) {
                    return this.sendBinary(new Uint8Array([ClientPackets_1.ClientPackets.FULL]));
                }
                this.player = new Player_1.Player(this);
                handshake.setupPlayer(this.player);
                this.server.players.push(this.player);
                this.server.entities.push(this.player);
                handshake.response(this.player);
                handshake.broadcastCosmetics(this.player);
            }
            this.receivePacket(PACKET_TYPE, PACKET, PACKET_DATA);
        }
        catch (error) { }
    }
    receivePacket(PACKET_TYPE, PACKET, PACKET_DATA) {
        this.packetsQty[PACKET_TYPE]++;
        this.packetsSize[PACKET_TYPE] += PACKET_DATA.length;
        // if (this.packetsQty[0] > 5) return this.socket.close();
        // if (this.packetsQty[3] > 10) return this.socket.close();
        // if (this.packetsQty[PACKET_TYPE] > 30) return this.socket.close();
        if (this.player.isCrafting && [
            ServerPackets_1.ServerPackets.ATTACK, ServerPackets_1.ServerPackets.INTERACTION,
            ServerPackets_1.ServerPackets.CRAFT, ServerPackets_1.ServerPackets.RECYCLE_START,
            ServerPackets_1.ServerPackets.DROP_ONE_ITEM, ServerPackets_1.ServerPackets.DROP_ITEM,
            ServerPackets_1.ServerPackets.GIVE_ITEM, ServerPackets_1.ServerPackets.TAKE_ITEM,
            ServerPackets_1.ServerPackets.LOCK_CHEST, ServerPackets_1.ServerPackets.BUILD
        ].includes(PACKET_TYPE))
            return;
        switch (PACKET_TYPE) {
            case ServerPackets_1.ServerPackets.CHAT:
                this.server.broadcast(JSON.stringify([0, this.player.id, PACKET]), false, this.socket);
                break;
            case ServerPackets_1.ServerPackets.MOVEMENT:
                this.player.direction = PACKET;
                break;
            case ServerPackets_1.ServerPackets.ANGLE:
                this.player.angle = Number(PACKET) % 255;
                break;
            case ServerPackets_1.ServerPackets.ATTACK:
                this.player.attack = true;
                this.player.angle = Number(PACKET) % 255;
                this.server.combatSystem.handleAttack(this.player);
                break;
            case ServerPackets_1.ServerPackets.INTERACTION:
                this.server.interactionSystem.request(this.player, PACKET);
                break;
            case ServerPackets_1.ServerPackets.DROP_ONE_ITEM:
                if (this.player.inventory.items.has(PACKET))
                    new Crate_1.Crate(this.server, {
                        owner: this.player,
                        item: PACKET,
                        count: this.player.inventory.items.get(PACKET)
                    });
                this.sendBinary(this.player.inventory.deleteItem(PACKET));
                break;
            case ServerPackets_1.ServerPackets.CRAFT:
                this.server.craftSystem.handleCraft(this.player, PACKET);
                break;
            case ServerPackets_1.ServerPackets.GIVE_ITEM:
                this.server.storageSystem.giveChestItem(this.player, PACKET_DATA);
                break;
            case ServerPackets_1.ServerPackets.TAKE_ITEM:
                this.server.storageSystem.takeChestItem(this.player, PACKET_DATA);
                break;
            case ServerPackets_1.ServerPackets.RECYCLE_START:
                this.server.craftSystem.handleRecycle(this.player, PACKET);
                break;
            case ServerPackets_1.ServerPackets.BUILD:
                this.server.buildingSystem.request(this.player, PACKET_DATA);
                break;
            case ServerPackets_1.ServerPackets.STOP_ATTACK:
                this.player.attack = false;
                break;
            case ServerPackets_1.ServerPackets.LOCK_CHEST:
                this.server.storageSystem.lockChest(this.player, PACKET);
                break;
            case ServerPackets_1.ServerPackets.DROP_ITEM:
                if (this.player.inventory.items.has(PACKET))
                    new Crate_1.Crate(this.server, {
                        owner: this.player,
                        item: PACKET,
                        count: 1
                    });
                this.sendBinary(this.player.inventory.removeItem(PACKET, 1));
                break;
            case ServerPackets_1.ServerPackets.CANCEL_CRAFT:
                this.server.craftSystem.stopCraft(this.player);
                break;
            case ServerPackets_1.ServerPackets.CONSOLE:
                break;
        }
    }
    onClose() {
        this.isActive = false;
    }
    sendJSON(message) {
        if (this.isActive && message)
            this.socket.send(JSON.stringify(message));
    }
    sendU8(message) {
        if (this.isActive && message)
            this.socket.send(new Uint8Array(message), true);
    }
    sendU16(message) {
        if (this.isActive && message)
            this.socket.send(new Uint16Array(message), true);
    }
    sendU32(message) {
        if (this.isActive && message)
            this.socket.send(new Uint32Array(message), true);
    }
    sendBinary(message) {
        if (this.isActive && message)
            this.socket.send(message, true);
    }
}
exports.Client = Client;
