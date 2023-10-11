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
const CraftSystem_1 = require("./systems/server/CraftSystem");
const SpawnSystem_1 = require("./systems/server/SpawnSystem");
const TimeSystem_1 = require("./systems/server/TimeSystem");
const KitSystem_1 = require("./systems/server/KitSystem");
const EventSystem_1 = require("./systems/server/EventSystem");
const CommandSystem_1 = require("./systems/server/CommandSystem");
const BuildingSystem_1 = require("./systems/server/BuildingSystem");
const CombatSystem_1 = require("./systems/server/CombatSystem");
const ConfigSystem_1 = require("./systems/server/ConfigSystem");
const InteractionSystem_1 = require("./systems/individual/InteractionSystem");
const MobSystem_1 = require("./systems/server/MobSystem");
const Cfg_json_1 = __importDefault(require("./JSON/Cfg.json"));
const ServerConfig_json_1 = __importDefault(require("./JSON/ServerConfig.json"));
const GameMode_1 = require("./enums/GameMode");
const StorageSystem_1 = require("./systems/server/StorageSystem");
const QuestSystem_1 = require("./systems/server/QuestSystem");
const MarketSystem_1 = require("./systems/server/MarketSystem");
const TokenSystem_1 = require("./systems/server/TokenSystem");
const TotemSystem_1 = require("./systems/server/TotemSystem");
const Logger_1 = require("./modules/Logger");
Math.clamp = (variable, min, max) => {
    return Math.max(min, Math.min(variable, max));
};
Math.random_clamp = (min, max) => {
    return Math.floor(min + Math.random() * (max + 1 - min));
};
Math.PI2 = Math.PI * 2;
class Server {
    players;
    entities;
    playerPool;
    entityPool;
    wss;
    config;
    settings;
    url;
    mode;
    port;
    map;
    logger;
    leaderboard;
    collision;
    craftSystem;
    spawnSystem;
    timeSystem;
    kitSystem;
    eventSystem;
    storageSystem;
    commandSystem;
    combatSystem;
    configSystem;
    mobSystem;
    questSystem;
    marketSystem;
    tokenSystem;
    totemSystem;
    buildingSystem;
    interactionSystem;
    ticker;
    constructor(mode) {
        this.playerPool = new IdPool_1.IdPool(1, 100);
        this.entityPool = new IdPool_1.IdPool(101, 65500);
        this.config = Cfg_json_1.default;
        this.settings = ServerConfig_json_1.default;
        this.configSystem = new ConfigSystem_1.ConfigSystem(this.config);
        this.entities = [];
        this.players = [];
        this.url = `http${this.settings.production ? "s" : ""}://${this.settings.url}/`;
        this.mode = mode;
        this.port = this.settings.production ? 80 : 443;
        this.wss = new WebSocketServer_1.WebSocketServer(this);
        this.map = new Map_1.Map(this);
        this.logger = new Logger_1.Logger("../logs", {
            console: true,
            file: true
        });
        this.leaderboard = new Leaderboard_1.Leaderboard(this);
        this.collision = new CollisionSystem_1.CollisionSystem(this);
        this.timeSystem = new TimeSystem_1.TimeSystem(this);
        this.craftSystem = new CraftSystem_1.CraftSystem(this.config);
        this.kitSystem = new KitSystem_1.KitSystem(this.config);
        this.eventSystem = new EventSystem_1.EventSystem(this);
        this.combatSystem = new CombatSystem_1.CombatSystem(this);
        this.interactionSystem = new InteractionSystem_1.InteractionSystem(this);
        this.mobSystem = new MobSystem_1.MobSystem(this);
        this.storageSystem = new StorageSystem_1.StorageSystem(this);
        this.commandSystem = new CommandSystem_1.CommandSystem(this);
        this.questSystem = new QuestSystem_1.QuestSystem();
        this.marketSystem = new MarketSystem_1.MarketSystem();
        this.tokenSystem = new TokenSystem_1.TokenSystem(this);
        this.totemSystem = new TotemSystem_1.TotemSystem(this);
        this.spawnSystem = new SpawnSystem_1.SpawnSystem(this.map);
        this.buildingSystem = new BuildingSystem_1.BuildingSystem(this);
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
    findPlayerByToken(token, token_id) {
        return this.players.find(player => player.data.token === token && player.data.token_id === token_id);
    }
    findPlayerById(id) {
        return this.players.find(player => player.id === id);
    }
    findEntityById(id) {
        return this.entities.find(entity => entity.id === id);
    }
    async updatePlayerCount() {
        const response = await fetch(this.url + "updatePlayerCount");
    }
    async updateAccountData(player) {
        await fetch(this.url + "updateAccountData", {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                l: player.account.name,
                p: this.settings.master_password,
                s: player.score,
                k: player.kills,
                t: player.time
            })
        });
    }
}
exports.Server = Server;
new Server(GameMode_1.GameMode.normal);
