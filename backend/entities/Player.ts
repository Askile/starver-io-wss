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
import {InteractionManager} from "./playerComponents/InteractionManager";
import {objects} from "../JSON/Resouces.json";
import {AttackManager} from "./playerComponents/AttackManager";
import {Gauges} from "./playerComponents/Gauges";
import {BinaryWriter} from "../modules/BinaryWriter";
import {ClientPackets} from "../enums/packets/ClientPackets";
import {HealthSystem} from "../systems/HealthSystem";
import {DeathReason} from "../enums/DeathReason";

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

    public lastBuildingStamp: number = 0;

    public workbench: boolean = false;
    public fire: boolean = false;
    public lava: boolean = false;
    public spike: boolean = false;
    public water: boolean = false;

    public buildings: any = [];
    public entities: number[] = [];
    public isCrafting: boolean = false;
    public reason: number = DeathReason.UNKNOWN;
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

        setTimeout(() => {
            this.server.kitSystem.gainKit(this);

            this.client.sendJSON([7, objects]);
        });
    }

    public die() {
        const writer = new BinaryWriter();
        writer.writeUInt8(ClientPackets.KILLED);
        writer.writeUInt8(this.reason);
        writer.writeUInt16(this.stats.kills);
        writer.writeUInt32(this.stats.score);


        for (const building of this.buildings) building.delete();
        this.delete();
        this.buildings = [];
        this.server.players = this.server.players.filter(player => player !== this);
        this.gauges.timer.clearInterval();
        this.client.sendBinary(writer.toBuffer());
        if (this.client.isActive) {
            this.client.socket.close();
        }
    }
}
