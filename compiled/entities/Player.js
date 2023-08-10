"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Entity_1 = require("./Entity");
const defaultValues_1 = require("../default/defaultValues");
const EntityType_1 = require("../enums/EntityType");
const Resouces_json_1 = require("../JSON/Resouces.json");
const Gauges_1 = require("./playerComponents/Gauges");
const BinaryWriter_1 = require("../modules/BinaryWriter");
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const DeathReason_1 = require("../enums/DeathReason");
const StateManager_1 = require("./playerComponents/StateManager");
const Inventory_1 = require("../systems/individual/Inventory");
const DeadBox_1 = require("./DeadBox");
class Player extends Entity_1.Entity {
    client;
    cosmetics;
    data;
    stats;
    camera;
    gauges;
    inventory;
    stateManager;
    lastBuildingStamp = 0;
    lastWeaponUse = 0;
    lastHelmetUse = 0;
    lavaBiome = false;
    island = false;
    workbench = false;
    fire = false;
    onFire = false;
    lava = false;
    spike = false;
    water = false;
    well = false;
    attack = false;
    winter = false;
    desert = false;
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
        this.stateManager = new StateManager_1.StateManager(this);
        setTimeout(() => {
            this.server.kitSystem.gainKit(this);
            this.client.sendJSON([7, Resouces_json_1.objects]);
            this.info = this.right.id + this.helmet.id * 128 + (this.inventory.size >= 16 ? 0x4000 : 0);
        });
    }
    updateInfo() {
        this.info = this.right.id + this.helmet.id * 128 + (this.inventory.size >= 16 ? 0x4000 : 0);
        this.extra = this.pet.id;
    }
    onDead(damager) {
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt8(ClientPackets_1.ClientPackets.KILLED);
        writer.writeUInt8(this.reason);
        writer.writeUInt16(this.stats.kills);
        writer.writeUInt32(this.stats.score);
        if (damager instanceof Player) {
            damager.stats.score += this.stats.score * this.server.config.score_per_kill;
        }
        new DeadBox_1.DeadBox(this.server, this);
        for (const building of this.buildings)
            building.delete();
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
exports.Player = Player;
