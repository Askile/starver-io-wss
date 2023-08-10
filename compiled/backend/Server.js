"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const IdPool_1 = require("./modules/IdPool");
const WebSocketServer_1 = require("./network/WebSocketServer");
const Ticker_1 = require("./world/Ticker");
const Map_1 = require("./world/Map");
const Leaderboard_1 = require("./leaderboard/Leaderboard");
const CollisionSystem_1 = require("./systems/CollisionSystem");
const MovementSystem_1 = require("./systems/MovementSystem");
const CraftSystem_1 = require("./systems/CraftSystem");
const SpawnSystem_1 = require("./systems/SpawnSystem");
const TimeSystem_1 = require("./systems/TimeSystem");
const KitSystem_1 = require("./systems/KitSystem");
const EventSystem_1 = require("./systems/EventSystem");
const CommandSystem_1 = require("./systems/CommandSystem");
const MapGenerator_1 = require("./world/MapGenerator");
const BuildingSystem_1 = require("./systems/BuildingSystem");
class Server {
    path;
    port;
    players = [];
    entities = [];
    playerPool;
    entityPool;
    wss;
    config;
    mode;
    map;
    leaderboard;
    movement;
    collision;
    craftSystem;
    spawnSystem;
    timeSystem;
    kitSystem;
    eventSystem;
    commandSystem;
    buildingSystem;
    mapGenerator;
    ticker;
    constructor(config, path, port, mode) {
        this.path = path;
        this.port = port;
        this.playerPool = new IdPool_1.IdPool(1, 100);
        this.entityPool = new IdPool_1.IdPool(101, 60000);
        this.config = config;
        this.wss = new WebSocketServer_1.WebSocketServer(path, this);
        this.map = new Map_1.Map(this);
        this.mapGenerator = new MapGenerator_1.MapGenerator(this, 100);
        this.leaderboard = new Leaderboard_1.Leaderboard(this);
        this.movement = new MovementSystem_1.MovementSystem(this);
        this.collision = new CollisionSystem_1.CollisionSystem(this);
        this.timeSystem = new TimeSystem_1.TimeSystem(this);
        this.craftSystem = new CraftSystem_1.CraftSystem(this.config);
        this.kitSystem = new KitSystem_1.KitSystem(this.config);
        this.spawnSystem = new SpawnSystem_1.SpawnSystem(this.map);
        this.eventSystem = new EventSystem_1.EventSystem(this);
        this.commandSystem = new CommandSystem_1.CommandSystem();
        this.buildingSystem = new BuildingSystem_1.BuildingSystem(this);
        this.mode = mode;
        this.ticker = new Ticker_1.Ticker(this);
    }
    broadcast(message, isBinary = false, selfSocket = undefined) {
        if (!message)
            return;
        const clients = Array.from(this.wss.clients.values());
        for (const client of clients) {
            if (selfSocket && client.socket === selfSocket)
                continue;
            client.socket.send(message, isBinary);
        }
    }
}
exports.Server = Server;