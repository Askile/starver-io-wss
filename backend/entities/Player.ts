import {Entity} from "./Entity";
import {Client} from "../network/Client";
import {getDefaultCamera, getDefaultHelmet, getDefaultItem, getDefaultPet, getDefaultPlayerCosmetics, getDefaultPlayerData, getDefaultPlayerStats} from "../defaultValues";
import {EntityType} from "../enums/EntityType";
import {Inventory} from "./playerComponents/Inventory";
import {InventoryType} from "../enums/InventoryType";
import {InteractionManager} from "./playerComponents/InteractionManager";
import {CommandManager} from "./playerComponents/CommandManager";
import {objects} from "../JSON/Resouces.json";
import {AttackManager} from "./playerComponents/AttackManager";

export class Player extends Entity {
    public client: Client;
    public cosmetics: PlayerCosmetics;
    public data: PlayerData;
    public stats: PlayerStats;
    public camera: Camera;
    public inventory: Inventory;
    public interactionManager: InteractionManager;
    public attackManager: AttackManager;
    public commandManager: CommandManager;

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
        this.inventory = new Inventory(this, 10);
        this.interactionManager = new InteractionManager(this);
        this.attackManager = new AttackManager(this);
        this.commandManager = new CommandManager(this);

        setTimeout(() => {
            this.client.sendBinary(this.inventory.giveItem(InventoryType.PICK_WOOD, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.PICK, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.PICK_GOLD, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.PICK_DIAMOND, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.PICK_AMETHYST, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.PICK_REIDITE, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.BABY_LAVA, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.LAVA_HELMET, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.LAVA_SWORD, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType.REIDITE_SHIELD, 10));

            this.client.sendJSON([7, objects]);
        });
    }
}
