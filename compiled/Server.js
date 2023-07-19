"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const IdPool_1 = require("./modules/IdPool");
const WebSocketServer_1 = require("./network/WebSocketServer");
const Ticker_1 = require("./world/Ticker");
const Map_1 = require("./world/Map");
class Server {
    players = [];
    entities = [];
    playerPool;
    entityPool;
    wss;
    config;
    map;
    ticker;
    constructor(config, path) {
        this.playerPool = new IdPool_1.IdPool(1, 100);
        this.entityPool = new IdPool_1.IdPool(101, 10000);
        this.wss = new WebSocketServer_1.WebSocketServer(path, this);
        this.config = config;
        this.map = new Map_1.Map(this.config);
        this.ticker = new Ticker_1.Ticker(this);
    }
}
exports.Server = Server;
