"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSystem = void 0;
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const BinaryWriter_1 = require("../modules/BinaryWriter");
class TimeSystem {
    server;
    CYCLE = 4 * 60 * 1000;
    time;
    clock = Date.now();
    constructor(server) {
        this.server = server;
        this.time = 0;
    }
    tick() {
        if (Date.now() - this.clock > this.CYCLE) {
            this.time = this.time ? 0 : 1;
            this.clock = Date.now();
            this.send();
        }
    }
    getGameTime() {
        return (Date.now() - this.clock) / 2;
    }
    send() {
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt8(ClientPackets_1.ClientPackets.GET_TIME);
        writer.writeUInt8(this.time);
        this.server.broadcast(writer.toBuffer(), true);
    }
}
exports.TimeSystem = TimeSystem;
// writer.writeUInt8(1 или 0);  
