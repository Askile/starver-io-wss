import {Player} from "./entities/Player";
import {Entity} from "./entities/Entity";
import {IdPool} from "./modules/IdPool";
import {WebSocketServer} from "./network/WebSocketServer";
import {Ticker} from "./world/Ticker";
import {Map} from "./world/Map";
import {Leaderboard} from "./leaderboard/Leaderboard";
import * as uWS from "uWebSockets.js";
import {CollisionSystem} from "./systems/server/CollisionSystem";
import {MovementSystem} from "./systems/server/MovementSystem";
import {CraftSystem} from "./systems/server/CraftSystem";
import {SpawnSystem} from "./systems/server/SpawnSystem";
import { TimeSystem } from "./systems/server/TimeSystem";
import { KitSystem } from "./systems/server/KitSystem";
import { EventSystem } from "./systems/server/EventSystem";
import { CommandSystem } from "./systems/server/CommandSystem";
import {MapGenerator} from "./world/MapGenerator";
import {BuildingSystem} from "./systems/server/BuildingSystem";
import {CombatSystem} from "./systems/server/CombatSystem";
import {ConfigSystem} from "./systems/server/ConfigSystem";
import {InteractionSystem} from "./systems/individual/InteractionSystem";
import {MobSystem} from "./systems/server/MobSystem";

export class Server {
    public players: Player[] = [];
    public entities: Entity[] = [];
    public playerPool: IdPool;
    public entityPool: IdPool;
    public wss: WebSocketServer;
    public config: Config;

    public mode: number;

    public map: Map;
    public leaderboard: Leaderboard;
    public movement: MovementSystem;
    public collision: CollisionSystem;
    public craftSystem: CraftSystem;
    public spawnSystem: SpawnSystem;
    public timeSystem: TimeSystem;
    public kitSystem: KitSystem;
    public eventSystem: EventSystem;
    public commandSystem: CommandSystem;
    public buildingSystem: BuildingSystem;
    public combatSystem: CombatSystem;
    public configSystem: ConfigSystem;
    public interactionSystem: InteractionSystem;
    public mobSystem: MobSystem;
    public mapGenerator: MapGenerator;

    private ticker: Ticker;

    constructor(config: Config, public path: string, public port: number, mode: number) {
        this.playerPool = new IdPool(1, 100);
        this.entityPool = new IdPool(101, 60000);
        this.config = config;
        this.configSystem = new ConfigSystem(this.config);

        this.wss = new WebSocketServer(path, this);
        this.map = new Map(this);
        this.mapGenerator = new MapGenerator(this, 100);

        this.leaderboard = new Leaderboard(this);
        this.movement = new MovementSystem(this);
        this.collision = new CollisionSystem(this);
        this.timeSystem = new TimeSystem(this);
        this.craftSystem = new CraftSystem(this.config);
        this.kitSystem = new KitSystem(this.config);
        this.spawnSystem = new SpawnSystem(this.map);
        this.eventSystem = new EventSystem(this);
        this.commandSystem = new CommandSystem();
        this.combatSystem = new CombatSystem(this);
        this.buildingSystem = new BuildingSystem(this);
        this.interactionSystem = new InteractionSystem(this);
        this.mobSystem = new MobSystem(this);

        this.mode = mode;

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
