import {Player} from "./entities/Player";
import {Entity} from "./entities/Entity";
import {IdPool} from "./modules/IdPool";
import {WebSocketServer} from "./network/WebSocketServer";
import {Ticker} from "./world/Ticker";
import {Map} from "./world/Map";

export class Server {
    public players: Player[] = [];
    public entities: Entity[] = [];
    public playerPool: IdPool;
    public entityPool: IdPool;
    public wss: WebSocketServer;
    public config: Config;
    public map: Map;

    private ticker: Ticker;

    constructor(config: Config, path: string) {
        this.playerPool = new IdPool(1, 100);
        this.entityPool = new IdPool(101, 10000);
        this.wss = new WebSocketServer(path, this);
        this.config = config;
        this.map = new Map(this.config);

        this.ticker = new Ticker(this);
    }



}