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
const EntityType_1 = require("../enums/EntityType");
const Box_1 = require("../entities/Box");
const ActionType_1 = require("../enums/ActionType");
const ServerPackets_1 = require("../enums/packets/ServerPackets");
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
                this.player = new Player_1.Player(this);
                handshake.setupPlayer(this.player);
                this.server.players.push(this.player);
                this.server.entities.push(this.player);
                handshake.response(this.player);
            }
            this.receivePacket(PACKET_TYPE, PACKET, PACKET_DATA);
        }
        catch (error) {
            // Обработка ошибки
        }
    }
    receivePacket(PACKET_TYPE, PACKET, PACKET_DATA) {
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
            case ServerPackets_1.ServerPackets.CHAT:
                this.broadcast(JSON.stringify([0, this.player.id, PACKET]));
                break;
            case ServerPackets_1.ServerPackets.MOVEMENT:
                this.player.direction = PACKET;
                break;
            case ServerPackets_1.ServerPackets.ANGLE:
                this.player.angle = Number(PACKET) % 255;
                break;
            case ServerPackets_1.ServerPackets.ATTACK:
                this.player.angle = Number(PACKET) % 255;
                this.player.action |= ActionType_1.ActionType.ATTACK;
                this.player.attackManager.isAttack = true;
                break;
            case ServerPackets_1.ServerPackets.INTERACTION:
                this.player.interactionManager.useItem(PACKET);
                break;
            case 6:
                if (this.player.inventory.items.has(PACKET))
                    new Box_1.Box(this.server, EntityType_1.EntityType.CRATE, {
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
                    new Box_1.Box(this.server, EntityType_1.EntityType.CRATE, {
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
    onClose() {
        this.isActive = false;
        this.player.action = 1;
        new nanotimer_1.default().setTimeout(() => {
            this.server.playerPool.deleteId(this.player.id);
            this.server.players = this.server.players.filter((player) => player !== this.player);
            this.server.entities = this.server.entities.filter((player) => player !== this.player);
        }, [], "0.1s");
    }
    sendJSON(message) {
        this.socket.send(JSON.stringify(message));
    }
    sendBinary(message) {
        if (this.isActive && message)
            this.socket.send(message, true);
    }
    broadcast(message) {
        const clients = Array.from(this.server.wss.clients.values());
        for (const client of clients) {
            if (client.socket !== this.socket)
                client.socket.send(message);
        }
    }
}
exports.Client = Client;
