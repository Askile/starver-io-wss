import {Player} from "./entities/Player";
import {Entity} from "./entities/Entity";
import {IdPool} from "./modules/IdPool";
import {WebSocketServer} from "./network/WebSocketServer";
import {Ticker} from "./world/Ticker";
import {Map} from "./world/Map";
import {Leaderboard} from "./leaderboard/Leaderboard";
import * as uWS from "uWebSockets.js";
import {CollisionSystem} from "./systems/CollisionSystem";
import {MovementSystem} from "./systems/MovementSystem";
import {CraftSystem} from "./systems/CraftSystem";
import {SpawnSystem} from "./systems/SpawnSystem";

export class Server {
    public players: Player[] = [];
    public entities: Entity[] = [];
    public playerPool: IdPool;
    public entityPool: IdPool;
    public wss: WebSocketServer;
    public config: Config;

    public map: Map;
    public leaderboard: Leaderboard;
    public movement: MovementSystem;
    public collision: CollisionSystem;
    public craftSystem: CraftSystem;
    public spawnSystem: SpawnSystem;

    private ticker: Ticker;

    constructor(config: Config, public path: string) {
        this.playerPool = new IdPool(1, 100);
        this.entityPool = new IdPool(101, 60000);
        this.config = config;
        this.wss = new WebSocketServer(path, this);
        this.map = new Map(this);

        this.leaderboard = new Leaderboard(this);
        this.movement = new MovementSystem(this);
        this.collision = new CollisionSystem(this);
        this.craftSystem = new CraftSystem(this);
        this.spawnSystem = new SpawnSystem(this.map);

        this.ticker = new Ticker(this);
    }

    public broadcast(message: any, isBinary: boolean = false, selfSocket: uWS.WebSocket<any> | undefined = undefined) {
        if (!message) return;
        const clients = Array.from(this.wss.clients.values());
        for (const client of clients) {
            if (selfSocket && client.socket === selfSocket) continue;
            client.socket.send(message, isBinary);
        }
    }
}
