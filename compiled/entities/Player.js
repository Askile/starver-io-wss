"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Entity_1 = require("./Entity");
const defaultValues_1 = require("../defaultValues");
const EntityType_1 = require("../enums/EntityType");
const Inventory_1 = require("./playerComponents/Inventory");
const InventoryType_1 = require("../enums/InventoryType");
const InteractionManager_1 = require("./playerComponents/InteractionManager");
class Player extends Entity_1.Entity {
    client;
    cosmetics;
    data;
    stats;
    camera;
    inventory;
    interactionManager;
    isAttack = false;
    helmet = (0, defaultValues_1.getDefaultHelmet)();
    right = (0, defaultValues_1.getDefaultItem)();
    pet = (0, defaultValues_1.getDefaultPet)();
    constructor(client) {
        super(EntityType_1.EntityType.PLAYERS, client.server);
        this.client = client;
        this.cosmetics = (0, defaultValues_1.getDefaultPlayerCosmetics)();
        this.data = (0, defaultValues_1.getDefaultPlayerData)();
        this.stats = (0, defaultValues_1.getDefaultPlayerStats)();
        this.camera = (0, defaultValues_1.getDefaultCamera)();
        this.inventory = new Inventory_1.Inventory(this, 10);
        this.interactionManager = new InteractionManager_1.InteractionManager(this);
        setTimeout(() => {
            this.client.sendBinary(this.inventory.giveItem(InventoryType_1.InventoryType.PICK_WOOD, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType_1.InventoryType.PICK, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType_1.InventoryType.PICK_GOLD, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType_1.InventoryType.PICK_DIAMOND, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType_1.InventoryType.PICK_AMETHYST, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType_1.InventoryType.PICK_REIDITE, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType_1.InventoryType.BABY_LAVA, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType_1.InventoryType.LAVA_HELMET, 1));
            this.client.sendBinary(this.inventory.giveItem(InventoryType_1.InventoryType.LAVA_SWORD, 1));
        });
    }
}
exports.Player = Player;