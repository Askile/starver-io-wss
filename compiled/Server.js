"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const IdPool_1 = require("./modules/IdPool");
const WebSocketServer_1 = require("./network/WebSocketServer");
const Ticker_1 = require("./world/Ticker");
const Map_1 = require("./world/Map");
const Leaderboard_1 = require("./leaderboard/Leaderboard");
const CollisionSystem_1 = require("./systems/server/CollisionSystem");
const MovementSystem_1 = require("./systems/server/MovementSystem");
const CraftSystem_1 = require("./systems/server/CraftSystem");
const SpawnSystem_1 = require("./systems/server/SpawnSystem");
const TimeSystem_1 = require("./systems/server/TimeSystem");
const KitSystem_1 = require("./systems/server/KitSystem");
const EventSystem_1 = require("./systems/server/EventSystem");
const MapGenerator_1 = require("./world/MapGenerator");
const BuildingSystem_1 = require("./systems/server/BuildingSystem");
const CombatSystem_1 = require("./systems/server/CombatSystem");
const ConfigSystem_1 = require("./systems/server/ConfigSystem");
const InteractionSystem_1 = require("./systems/individual/InteractionSystem");
const MobSystem_1 = require("./systems/server/MobSystem");
const Cfg_json_1 = __importDefault(require("./JSON/Cfg.json"));
const GameMode_1 = require("./enums/GameMode");
const StorageSystem_1 = require("./systems/server/StorageSystem");
Math.clamp = (variable, min, max) => {
    return Math.max(min, Math.min(variable, max));
};
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
    storageSystem;
    buildingSystem;
    combatSystem;
    configSystem;
    interactionSystem;
    mobSystem;
    mapGenerator;
    ticker;
    constructor(path, port, mode) {
        this.path = path;
        this.port = port;
        this.playerPool = new IdPool_1.IdPool(1, 100);
        this.entityPool = new IdPool_1.IdPool(101, 60000);
        this.config = Cfg_json_1.default;
        this.configSystem = new ConfigSystem_1.ConfigSystem(this.config);
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
        this.combatSystem = new CombatSystem_1.CombatSystem(this);
        this.buildingSystem = new BuildingSystem_1.BuildingSystem(this);
        this.interactionSystem = new InteractionSystem_1.InteractionSystem(this);
        this.mobSystem = new MobSystem_1.MobSystem(this);
        this.storageSystem = new StorageSystem_1.StorageSystem(this);
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
    findEntityById(id) {
        return this.entities.find(entity => entity.id === id);
    }
}
exports.Server = Server;
new Server("Europe-1", 80, GameMode_1.GameMode.normal);
