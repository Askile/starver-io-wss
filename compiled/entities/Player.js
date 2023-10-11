"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const Entity_1 = require("./Entity");
const defaultValues_1 = require("../default/defaultValues");
const EntityType_1 = require("../enums/types/EntityType");
const Gauges_1 = require("../systems/individual/Gauges");
const BinaryWriter_1 = require("../modules/BinaryWriter");
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const DeathReason_1 = require("../enums/DeathReason");
const Inventory_1 = require("../systems/individual/Inventory");
const Permissions_1 = require("../enums/Permissions");
const ItemType_1 = require("../enums/types/ItemType");
const QuestType_1 = require("../enums/QuestType");
const Crate_1 = require("./Crate");
const ActionType_1 = require("../enums/types/ActionType");
const nanotimer_1 = __importDefault(require("nanotimer"));
const Movement_1 = require("../systems/individual/Movement");
class Player extends Entity_1.Entity {
    client;
    cosmetics;
    data;
    camera;
    gauges;
    movement;
    inventory;
    permission;
    account;
    tokenScore;
    kills = 0;
    time = 0;
    _score = 0;
    scoreAchievements = [];
    lastBuildingStamp = 0;
    lastWeaponUse = 0;
    lastHelmetUse = 0;
    lastTotemLeave = 0;
    lastHood = 0;
    lastStunned = -1;
    lastDamage = new Array(100).fill(-1);
    totem = null;
    machine = null;
    spike = null;
    workbench = false;
    river = false;
    well = false;
    fire = false;
    onFire = false;
    isStunned = false;
    timestamps;
    timestamp = Date.now();
    quests = new Array(13).fill(QuestType_1.QuestState.PROCCESS);
    buildings = [];
    updatePool = [];
    isCrafting = false;
    reason = DeathReason_1.DeathReason.UNKNOWN;
    helmet = this.server.interactionSystem.items[0];
    right = this.server.interactionSystem.items[0];
    vehicle = this.server.interactionSystem.items[0];
    constructor(client, tokenScore) {
        super(EntityType_1.EntityType.PLAYER, client.server);
        this.client = client;
        this.tokenScore = tokenScore;
        this.cosmetics = (0, defaultValues_1.getDefaultPlayerCosmetics)();
        this.data = (0, defaultValues_1.getDefaultPlayerData)();
        this.camera = (0, defaultValues_1.getDefaultCamera)();
        this.position.set(this.server.spawnSystem.getSpawnPoint("FOREST"));
        this.realPosition.set(this.position);
        this.permission = this.server.settings.production ? Permissions_1.Permissions.PLAYER : Permissions_1.Permissions.OWNER;
        this.timestamps = [];
        this.movement = new Movement_1.Movement(this);
        this.gauges = new Gauges_1.Gauges(this);
        this.inventory = new Inventory_1.Inventory(this, 10);
    }
    set score(value) {
        this._score = value;
        this.server.eventSystem.onReceiveScore(this);
    }
    get score() {
        return this._score;
    }
    get defense() {
        return (this.helmet.defense ? this.helmet.defense : 0) + (this.right.defense ? this.right.defense : 0);
    }
    get mobDefense() {
        return (this.helmet.mob_defense ? this.helmet.mob_defense : 0) + (this.right.mob_defense ? this.right.mob_defense : 0);
    }
    checkStun() {
        if (this.isStunned && Date.now() - this.lastStunned > 2000) {
            this.isStunned = false;
            this.lastStunned = Date.now();
        }
    }
    onTick() {
        const lifeTime = Date.now() - this.createdAt;
        this.gauges.tick();
        if (this.river && !this.direction)
            this.direction = 12;
        else if (this.direction === 12)
            this.direction = 0;
        if (Date.now() - this.timestamp >= 480e3) {
            this.time++;
            this.timestamp = Date.now();
            this.score += 500;
            this.client.sendU8([ClientPackets_1.ClientPackets.SURVIVE]);
        }
        if (this.inventory.containsItem(ItemType_1.ItemType.BREAD, 100)) {
            this.winter && this.successQuest(QuestType_1.QuestType.WINTER_PEASANT_FUR);
            this.desert && this.successQuest(QuestType_1.QuestType.GOLDEN_PITCHFORK);
        }
        if (lifeTime > 3 * 480e3) {
            this.failQuests(QuestType_1.QuestType.ORANGE_GEM, QuestType_1.QuestType.DRAGON_CUBE);
        }
        if (this.createdAt - Date.now() > 480e3 && !this.winter) {
            this.failQuests(QuestType_1.QuestType.WINTER_HOOD_FUR);
        }
        if (lifeTime > 4 * 480e3) {
            this.failQuests(QuestType_1.QuestType.WINTER_PEASANT_FUR);
        }
        if (lifeTime > 5 * 480e3) {
            this.failQuests(QuestType_1.QuestType.GREEN_GEM);
        }
        if (lifeTime > 6 * 480e3) {
            this.successQuest(QuestType_1.QuestType.BLUE_GEM);
            this.failQuests(QuestType_1.QuestType.DRAGON_ORB, QuestType_1.QuestType.LAVA_CUBE, QuestType_1.QuestType.PILOT_HAT);
        }
        if (lifeTime > 7 * 480e3) {
            this.failQuests(QuestType_1.QuestType.SLOT_2, QuestType_1.QuestType.GOLDEN_PITCHFORK);
        }
        if (lifeTime > 8 * 480e3) {
            this.failQuests(QuestType_1.QuestType.SLOT_1);
        }
        this.checkStun();
    }
    failQuests(...types) {
        for (const type of types) {
            if (this.quests[type] !== QuestType_1.QuestState.PROCCESS)
                continue;
            this.quests[type] = QuestType_1.QuestState.FAILED;
            this.client.sendU8([ClientPackets_1.ClientPackets.FAIL_QUEST, type]);
        }
    }
    successQuest(...types) {
        for (const type of types) {
            if (this.quests[type] !== QuestType_1.QuestState.PROCCESS)
                continue;
            this.quests[type] = QuestType_1.QuestState.SUCCEED;
            this.client.sendU8([ClientPackets_1.ClientPackets.SUCCEED_QUEST, type]);
        }
    }
    ruinQuests() {
        for (let i = QuestType_1.QuestType.DRAGON_ORB; i < QuestType_1.QuestType.GREEN_GEM + 1; i++) {
            if (this.quests[i] !== QuestType_1.QuestState.PROCCESS)
                continue;
            this.failQuests(i);
        }
        for (let i = QuestType_1.QuestType.WINTER_PEASANT_FUR; i < QuestType_1.QuestType.SLOT_2 + 1; i++) {
            if (this.quests[i] !== QuestType_1.QuestState.PROCCESS)
                continue;
            this.failQuests(i);
        }
    }
    updateInfo() {
        this.info = this.right.id + this.helmet.id * 128 + (this.inventory.size >= 16 ? 0x4000 : 0);
        this.extra = this.vehicle.id;
    }
    updateSpeed() {
        const isWeapon = this.right.isSlowDown();
        const diving_mask = this.helmet.id === ItemType_1.ItemType.DIVING_MASK;
        const super_diving_suit = this.helmet.id === ItemType_1.ItemType.SUPER_DIVING_SUIT;
        this.speed = this.server.configSystem.speed[this.type];
        if (isWeapon) {
            this.speed = this.server.config.speed_weapon;
        }
        if (this.desert) {
            this.speed = isWeapon ? this.server.config.speed_desert_weapon : this.server.config.speed_desert;
        }
        if (this.winter) {
            this.speed = this.server.config.speed_winter;
            if (isWeapon)
                this.speed = this.server.config.speed_winter_weapon;
        }
        if (this.water && !this.bridge) {
            this.speed = this.server.config.speed_water;
            if (diving_mask || super_diving_suit)
                this.speed = 0.18;
            if (isWeapon)
                this.speed = this.server.config.speed_water_weapon;
        }
        if (this.lavaBiome) {
            this.speed = isWeapon ? this.server.config.speed_lava_weapon : this.server.config.speed_lava;
        }
        if (this.attack) {
            this.speed -= this.server.config.speed_attacking;
        }
        if (this.isCollide) {
            this.speed = this.server.config.speed_collide;
            this.isCollide = false;
        }
    }
    onReceiveItem(id, count) {
        if (id === ItemType_1.ItemType.AMETHYST) {
            this.successQuest(QuestType_1.QuestType.DRAGON_CUBE);
        }
        if (id === ItemType_1.ItemType.REIDITE) {
            this.successQuest(QuestType_1.QuestType.LAVA_CUBE);
        }
        if (id === ItemType_1.ItemType.DRAGON_HEART) {
            this.successQuest(QuestType_1.QuestType.DRAGON_ORB);
        }
        if (id === ItemType_1.ItemType.LAVA_HEART) {
            this.successQuest(QuestType_1.QuestType.LAVA_ORB);
        }
        if (id === ItemType_1.ItemType.EMERALD) {
            this.successQuest(QuestType_1.QuestType.PILOT_HAT);
        }
        if (id === ItemType_1.ItemType.SANDWORM_JUICE) {
            this.successQuest(QuestType_1.QuestType.SLOT_1);
        }
    }
    onDamage(damager) {
        this.lastHood = Date.now();
        this.quests[QuestType_1.QuestType.GREEN_GEM] = QuestType_1.QuestState.FAILED;
        this.client.sendU8([ClientPackets_1.ClientPackets.FAIL_QUEST, QuestType_1.QuestType.GREEN_GEM]);
        if (damager instanceof Player) {
            if (damager.quests[QuestType_1.QuestType.BLUE_GEM] !== QuestType_1.QuestState.SUCCEED) {
                damager.quests[QuestType_1.QuestType.BLUE_GEM] = QuestType_1.QuestState.FAILED;
                damager.client.sendU8([ClientPackets_1.ClientPackets.FAIL_QUEST, QuestType_1.QuestType.BLUE_GEM]);
            }
        }
    }
    onDead(damager) {
        if (this.account) {
            this.server.updateAccountData(this);
        }
        if (this.totem) {
            if (this.totem.owner === this) {
                this.server.totemSystem.broadcastDestroyTeam(this.totem);
            }
            else {
                this.totem.data = this.totem.data.filter((id) => id !== this.id);
                this.server.totemSystem.broadcastExcludeMemberId(this.totem, this.id);
            }
        }
        const writer = new BinaryWriter_1.BinaryWriter();
        if (this.tokenScore.session_id === this.data.token_id) {
            this.tokenScore.score += this.score;
            this.tokenScore.session_id = 0;
            this.server.tokenSystem.leaveToken(this.tokenScore);
        }
        writer.writeUInt8(ClientPackets_1.ClientPackets.KILLED);
        writer.writeUInt8(this.reason);
        writer.writeUInt16(this.kills);
        writer.writeUInt32(this.score + this.tokenScore.score);
        this.server.broadcast(new Uint8Array([ClientPackets_1.ClientPackets.KILL_PLAYER, this.id]), true, this.client.socket);
        if (damager instanceof Player) {
            damager.score += this.score * this.server.config.score_per_kill;
        }
        new Crate_1.Crate(this.server, {
            owner: this,
            isDead: true
        });
        this.server.playerPool.deleteId(this.id);
        for (const building of this.buildings)
            building.delete();
        this.action = ActionType_1.ActionType.DELETE;
        new nanotimer_1.default().setTimeout(() => {
            this.server.entities = this.server.entities.filter((entity) => entity != this);
        }, [], 1 / this.server.settings.tps + "s");
        this.buildings = [];
        this.server.players = this.server.players.filter(player => player.id !== this.id);
        this.client.sendBinary(writer.toBuffer());
        new nanotimer_1.default().setTimeout(() => {
            this.client.isActive && this.client.socket.close();
        }, [], "0.01s");
    }
}
exports.Player = Player;
