"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSystem = void 0;
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const WorldTime_1 = require("../../enums/WorldTime");
class TimeSystem {
    CYCLE = 8 * 60 * 1000;
    server;
    time;
    sent = false;
    clock = Date.now();
    constructor(server) {
        this.server = server;
        this.time = 0;
    }
    tick() {
        if (this.getGameTime() > this.CYCLE / 2 && !this.sent) {
            this.time = WorldTime_1.WorldTime.NIGHT;
            this.sent = true;
            this.send();
        }
        if (this.getGameTime() > this.CYCLE) {
            this.time = WorldTime_1.WorldTime.DAY;
            this.sent = false;
            this.clock = Date.now();
            this.send();
        }
    }
    getGameTime() {
        return Date.now() - this.clock;
    }
    send() {
        const writer = new BinaryWriter_1.BinaryWriter(2);
        writer.writeUInt8(ClientPackets_1.ClientPackets.GET_TIME);
        writer.writeUInt8(this.time);
        this.server.broadcast(writer.toBuffer(), true);
    }
}
exports.TimeSystem = TimeSystem;
