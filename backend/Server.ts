import {Player} from "./entities/Player";
import {Entity} from "./entities/Entity";
import {IdPool} from "./modules/IdPool";
import {WebSocketServer} from "./network/WebSocketServer";
import {Ticker} from "./world/Ticker";
import {Map} from "./world/Map";
import {Leaderboard} from "./components/Leaderboard";
import {Movement} from "./components/Movement";
import * as uWS from "uWebSockets.js";
import {Collision} from "./components/Collision";

export class Server {
    public players: Player[] = [];
    public entities: Entity[] = [];
    public playerPool: IdPool;
    public entityPool: IdPool;
    public wss: WebSocketServer;
    public config: Config;

    public map: Map;
    public leaderboard: Leaderboard;
    public movement: Movement;
    public collision: Collision;

    private ticker: Ticker;

    constructor(config: Config, public path: string, public port: number) {
        this.playerPool = new IdPool(1, 100);
        this.entityPool = new IdPool(101, 60000);
        this.wss = new WebSocketServer(path, port, this);
        this.config = config;
        this.map = new Map(this.config);

        this.leaderboard = new Leaderboard(this);
        this.movement = new Movement(this);
        this.collision = new Collision(this);

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
