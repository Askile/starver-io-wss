"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handshake = void 0;
const defaultValues_1 = require("../defaultValues");
const ClientStringPackets_1 = require("../enums/packets/ClientStringPackets");
const GameMode_1 = require("../enums/GameMode");
const MAX_VALUES = {
    SKIN: 174,
    ACCESSORY: 94,
    CRATE: 71,
    BAG: 69,
    BOOK: 44
};
class Handshake {
    request;
    client;
    config;
    nickname;
    camera = (0, defaultValues_1.getDefaultCamera)();
    version;
    token;
    reconnect;
    skin;
    accessory;
    bag;
    server;
    book;
    crate;
    dead;
    userId;
    userToken;
    password;
    constructor(request, client) {
        this.server = client.server;
        this.config = client.server.config;
        this.request = request;
        this.client = client;
        this.nickname = request[0];
        this.camera.width = request[1];
        this.camera.height = request[2];
        this.version = request[3];
        this.token = request[4];
        this.reconnect = request[5];
        this.skin = request[6];
        this.accessory = request[7];
        this.bag = request[8];
        this.book = request[9];
        this.crate = request[10];
        this.dead = request[11];
        this.userId = request[12];
        this.userToken = request[13];
        this.password = request[14];
    }
    testValid() {
        const typesToCheck = [
            { type: "string", indices: [0, 4] },
            { type: "number", indices: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11] }
        ];
        for (const { type, indices } of typesToCheck) {
            for (const index of indices) {
                const requestValue = this.request[index];
                const requestType = typeof requestValue;
                if (requestType !== type)
                    return false;
            }
        }
        return true;
    }
    setupPlayer(player) {
        if (!this.testValid())
            return;
        player.id = this.server.playerPool.createId();
        player.data.nickname = this.nickname.slice(0, 16);
        player.camera.width = Math.max((0, defaultValues_1.getDefaultCamera)().width, Math.min(3840, this.camera.width));
        player.camera.height = Math.max((0, defaultValues_1.getDefaultCamera)().height, Math.min(2160, this.camera.height));
        player.cosmetics.skin = Math.max(0, Math.min(MAX_VALUES.SKIN, this.skin));
        player.cosmetics.accessory = Math.max(0, Math.min(MAX_VALUES.ACCESSORY, this.accessory));
        player.cosmetics.bag = Math.max(0, Math.min(MAX_VALUES.BAG, this.bag));
        player.cosmetics.book = Math.max(0, Math.min(MAX_VALUES.BOOK, this.book));
        player.cosmetics.crate = Math.max(0, Math.min(MAX_VALUES.CRATE, this.crate));
        player.cosmetics.dead = Math.max(0, Math.min(MAX_VALUES.CRATE, this.dead));
    }
    response(player) {
        const players = this.server.players.map(({ id, data, cosmetics, stats }) => {
            return [id, data.nickname, data.level, stats.score, cosmetics.skin, cosmetics.accessory, cosmetics.book, cosmetics.bag];
        });
        this.client.sendJSON([
            ClientStringPackets_1.ClientStringPackets.HANDSHAKE,
            GameMode_1.GameMode.NORMAL,
            0,
            player.position.x,
            players,
            0,
            0,
            this.config.important.max_units,
            [],
            player.id,
            player.position.y,
            100,
            "token fucking",
            0,
            [],
            0,
            0,
            [],
            0,
            22009,
            this.config.important.map_width,
            this.config.important.map_height,
            6,
            this.config.important.custom_map,
            "Welcome",
            0,
            0,
            0
        ]);
        this.client.broadcast(JSON.stringify([
            2,
            player.id,
            player.data.nickname,
            player.data.level,
            player.cosmetics.skin,
            player.cosmetics.accessory,
            player.cosmetics.bag,
            player.cosmetics.book
        ]));
    }
}
exports.Handshake = Handshake;
