import {Entity} from "./Entity";
import {Client} from "../network/Client";
import {
    getDefaultCamera,
    getDefaultHelmet,
    getDefaultItem,
    getDefaultPet,
    getDefaultPlayerCosmetics,
    getDefaultPlayerData,
    getDefaultPlayerStats
} from "../default/defaultValues";
import {EntityType} from "../enums/EntityType";
import {Inventory} from "./playerComponents/Inventory";
import {InventoryType} from "../enums/InventoryType";
import {InteractionManager} from "./playerComponents/InteractionManager";
import {CommandManager} from "./playerComponents/CommandManager";
import {objects} from "../JSON/Resouces.json";
import {AttackManager} from "./playerComponents/AttackManager";
import {Movement} from "./playerComponents/Movement";
import {Gauges} from "./playerComponents/Gauges";
import {BinaryWriter} from "../modules/BinaryWriter";
import {ClientPackets} from "../enums/packets/ClientPackets";
import {HealthSystem} from "../systems/HealthSystem";

export class Player extends Entity {
    public client: Client;

    public cosmetics: PlayerCosmetics;
    public data: PlayerData;
    public stats: PlayerStats;
    public camera: Camera;

    public gauges: Gauges;
    public inventory: Inventory;
    public interactionManager: InteractionManager;
    public healthSystem: HealthSystem;
    public attackManager: AttackManager;
    public commandManager: CommandManager;
    public movement: Movement;

    public workbench: boolean = false;
    public fire: boolean = false;
    public lava: boolean = false;
    public spike: boolean = false;
    public water: boolean = false;

    public isCrafting: boolean = false;
    public reason: number = 0;
    public entities: number[] = [];
    public helmet: any = getDefaultHelmet();
    public right: any = getDefaultItem();
    public pet: any = getDefaultPet();

    constructor(client: Client) {
        super(EntityType.PLAYERS, client.server);

        this.client = client;

        this.cosmetics = getDefaultPlayerCosmetics();
        this.data = getDefaultPlayerData();
        this.stats = getDefaultPlayerStats();
        this.camera = getDefaultCamera();

        this.position = this.server.spawnSystem.getSpawnPoint("FOREST");

        this.gauges = new Gauges(this);
        this.inventory = new Inventory(this, 10);
        this.interactionManager = new InteractionManager(this);
        this.attackManager = new AttackManager(this);
        this.healthSystem = new HealthSystem(this,200);
        this.commandManager = new CommandManager(this);
        this.movement = new Movement(this);

        setTimeout(() => {
            this.client.sendBinary(this.inventory.giveItem(InventoryType.FIRE, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.PLANT, 3));

            this.client.sendJSON([7, objects]);
        });
    }

    public die() {
        const writer = new BinaryWriter();
        writer.writeUInt8(ClientPackets.KILLED);
        writer.writeUInt8(this.reason);
        writer.writeUInt16(this.stats.kills);
        writer.writeUInt32(this.stats.score);

        this.gauges.timer.clearInterval();
        this.client.sendBinary(writer.toBuffer());
        if (this.client.isActive) {
            this.client.socket.close();
        }
    }
}
