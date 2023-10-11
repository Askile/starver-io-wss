"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Leaderboard = void 0;
const BinaryWriter_1 = require("../modules/BinaryWriter");
const ClientPackets_1 = require("../enums/packets/ClientPackets");
class Leaderboard {
    server;
    constructor(server) {
        this.server = server;
    }
    restore_number(n) {
        if (n >= 1e10)
            n = n / 1e7 + 60000;
        else if (n >= 1e9)
            n = n / 1e6 + 50000;
        else if (n >= 1e8)
            n = n / 1e5 + 40000;
        else if (n >= 1e7)
            n = n / 1e4 + 30000;
        else if (n >= 1e6)
            n = n / 1e3 + 20000;
        else if (n >= 1e4)
            n = n / 1e2 + 10000;
        return n;
    }
    tick() {
        const writer = new BinaryWriter_1.BinaryWriter();
        const leaderboard = this.server.players.sort((a, b) => b.score - a.score).slice(0, 10);
        writer.writeUInt16(ClientPackets_1.ClientPackets.LEADERBOARD);
        for (const player of leaderboard) {
            writer.writeUInt16(player.id);
            writer.writeUInt16(this.restore_number(player.score));
        }
        this.server.broadcast(writer.toBuffer(), true);
    }
}
exports.Leaderboard = Leaderboard;
