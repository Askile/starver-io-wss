"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Entity_1 = require("./Entity");
const defaultValues_1 = require("../default/defaultValues");
const EntityType_1 = require("../enums/EntityType");
const Inventory_1 = require("./playerComponents/Inventory");
const InteractionManager_1 = require("./playerComponents/InteractionManager");
const Resouces_json_1 = require("../JSON/Resouces.json");
const AttackManager_1 = require("./playerComponents/AttackManager");
const Gauges_1 = require("./playerComponents/Gauges");
const BinaryWriter_1 = require("../modules/BinaryWriter");
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const HealthSystem_1 = require("../systems/HealthSystem");
const DeathReason_1 = require("../enums/DeathReason");
class Player extends Entity_1.Entity {
    client;
    cosmetics;
    data;
    stats;
    camera;
    gauges;
    inventory;
    interactionManager;
    healthSystem;
    attackManager;
    lastBuildingStamp = 0;
    workbench = false;
    fire = false;
    lava = false;
    spike = false;
    water = false;
    buildings = [];
    entities = [];
    isCrafting = false;
    reason = DeathReason_1.DeathReason.UNKNOWN;
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
        this.position = this.server.spawnSystem.getSpawnPoint("FOREST");
        this.gauges = new Gauges_1.Gauges(this);
        this.inventory = new Inventory_1.Inventory(this, 10);
        this.interactionManager = new InteractionManager_1.InteractionManager(this);
        this.attackManager = new AttackManager_1.AttackManager(this);
        this.healthSystem = new HealthSystem_1.HealthSystem(this, 200);
        setTimeout(() => {
            this.server.kitSystem.gainKit(this);
            this.client.sendJSON([7, Resouces_json_1.objects]);
        });
    }
    die() {
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt8(ClientPackets_1.ClientPackets.KILLED);
        writer.writeUInt8(this.reason);
        writer.writeUInt16(this.stats.kills);
        writer.writeUInt32(this.stats.score);
        for (const building of this.buildings)
            building.delete();
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
exports.Player = Player;
