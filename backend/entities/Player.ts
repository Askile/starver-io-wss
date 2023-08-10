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
import {objects} from "../JSON/Resouces.json";
import {Gauges} from "./playerComponents/Gauges";
import {BinaryWriter} from "../modules/BinaryWriter";
import {ClientPackets} from "../enums/packets/ClientPackets";
import {DeathReason} from "../enums/DeathReason";
import {StateManager} from "./playerComponents/StateManager";
import {Inventory} from "../systems/individual/Inventory";
import {DeadBox} from "./DeadBox";

export class Player extends Entity {
    public client: Client;

    public cosmetics: PlayerCosmetics;
    public data: PlayerData;
    public stats: PlayerStats;
    public camera: Camera;

    public gauges: Gauges;
    public inventory: Inventory;
    public stateManager: StateManager;


    public lastBuildingStamp: number = 0;
    public lastWeaponUse: number = 0;
    public lastHelmetUse: number = 0;

    public lavaBiome: boolean = false;
    public island: boolean = false;
    public workbench: boolean = false;
    public fire: boolean = false;
    public onFire: boolean = false;
    public lava: boolean = false;
    public spike: boolean = false;
    public water: boolean = false;
    public well: boolean = false;
    public attack: boolean = false;
    public winter: boolean = false;
    public desert: boolean = false;

    public buildings: any = [];
    public entities: any = [];

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
        this.stateManager = new StateManager(this);


        setTimeout(() => {
            this.server.kitSystem.gainKit(this);

            this.client.sendJSON([7, objects]);

            this.info = this.right.id + this.helmet.id * 128 + (this.inventory.size >= 16 ? 0x4000 : 0);
        });
    }

    public updateInfo() {
        this.info = this.right.id + this.helmet.id * 128 + (this.inventory.size >= 16 ? 0x4000 : 0);
        this.extra = this.pet.id;
    }

    public onDead(damager: Entity) {
        const writer = new BinaryWriter();
        writer.writeUInt8(ClientPackets.KILLED);

        writer.writeUInt8(this.reason);
        writer.writeUInt16(this.stats.kills);
        writer.writeUInt32(this.stats.score);

        if(damager instanceof Player) {
            damager.stats.score += this.stats.score * this.server.config.score_per_kill;
        }

        new DeadBox(this.server, this);

        for (const building of this.buildings) building.delete();

        this.delete();
        this.buildings = [];
        this.server.players = this.server.players.filter(player => player !== this);

        this.gauges.timer.clearInterval();
        this.gauges.healthTimer.clearInterval();

        this.client.sendBinary(writer.toBuffer());
        if (this.client.isActive) {
            this.client.socket.close();
        }
    }
}
