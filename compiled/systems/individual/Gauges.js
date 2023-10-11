"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gauges = void 0;
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const ActionType_1 = require("../../enums/types/ActionType");
const DeathReason_1 = require("../../enums/DeathReason");
const WorldTime_1 = require("../../enums/WorldTime");
const ItemType_1 = require("../../enums/types/ItemType");
const BiomeType_1 = require("../../enums/types/BiomeType");
class Gauges {
    config;
    player;
    lastUpdateStats = Date.now();
    lastUpdateHealth = Date.now();
    lastUpdateLava = Date.now();
    lastUpdateSpike = Date.now();
    lastUpdateFire = Date.now();
    hunger;
    cold;
    thirst;
    oxygen;
    bandage;
    old;
    constructor(player) {
        this.player = player;
        this.config = player.server.config;
        this.hunger = 100;
        this.cold = 100;
        this.thirst = 100;
        this.oxygen = 100;
        this.bandage = 0;
        this.old = {
            hunger: this.hunger,
            cold: this.cold,
            thirst: this.thirst,
            oxygen: this.oxygen,
            bandage: this.bandage
        };
    }
    updateClientGauges() {
        const writer = new BinaryWriter_1.BinaryWriter(8);
        writer.writeUInt8(ClientPackets_1.ClientPackets.GAUGES);
        writer.writeUInt8(this.player.healthSystem.health / 2);
        writer.writeUInt8(this.hunger);
        writer.writeUInt8(Math.min(100, this.cold));
        writer.writeUInt8(this.thirst);
        writer.writeUInt8(this.oxygen);
        writer.writeUInt8(200 - this.cold);
        writer.writeUInt8(this.bandage);
        this.player.client.sendBinary(writer.toBuffer());
    }
    tick() {
        if (Date.now() - this.lastUpdateHealth >= this.config.delay_gauges * 2) {
            this.lastUpdateHealth = Date.now();
            this.updateHealth();
        }
        if (Date.now() - this.lastUpdateStats >= this.config.delay_gauges) {
            this.lastUpdateStats = Date.now();
            this.updateGauges();
        }
        if (Date.now() - this.lastUpdateFire >= 2000) {
            this.lastUpdateFire = Date.now();
            this.updateFire();
        }
        if (Date.now() - this.lastUpdateLava >= 750) {
            this.lastUpdateLava = Date.now();
            this.updateLava();
        }
        if (Date.now() - this.lastUpdateSpike >= 1000) {
            this.lastUpdateSpike = Date.now();
            this.updateSpike();
        }
    }
    clamp() {
        this.cold = Math.clamp(this.cold, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
        this.hunger = Math.clamp(this.hunger, 0, 100);
        this.thirst = Math.clamp(this.thirst, 0, 100);
        this.oxygen = Math.clamp(this.oxygen, 0, 100);
        this.bandage = Math.clamp(this.bandage, 0, this.config.bandage_stack_limit);
    }
    updateGauges() {
        let helmet = ItemType_1.ItemType[this.player.helmet.id].toLowerCase() ?? false;
        if (helmet === "hand")
            helmet = false;
        if (helmet && helmet.includes("protection")) {
            if (helmet.includes("diamond"))
                helmet = 'warm_protection';
            if (helmet.includes("amethyst"))
                helmet = 'warm_protection2';
            if (helmet.includes("reidite"))
                helmet = 'warm_protection3';
        }
        const cfg = this.config;
        if (this.player.fire && !this.player.onFire) {
            this.cold += this.config.fire_warm;
        }
        else {
            const time = WorldTime_1.WorldTime[this.player.server.timeSystem.time].toLowerCase();
            let biome = BiomeType_1.BiomeType[this.player.biomeIn].toLowerCase() ?? false;
            let configSetting = 0, reduceSetting = 0, increase = false;
            if (biome === 'sea')
                biome = "water";
            else if (biome === 'dragon')
                biome = "winter";
            else if (biome === 'forest' || biome === 'beach')
                biome = false;
            if (biome) {
                if (helmet) {
                    configSetting = cfg[helmet + "_warm_" + biome + "_" + time] ?? 0;
                }
                else {
                    configSetting = cfg["warm_" + biome + "_" + time] ?? 0;
                }
                increase = biome === 'desert' || biome === 'lava';
                reduceSetting = cfg[(increase) ? "increase_" + "cold_" + biome + (biome === 'desert' ? "_" + time : "") : "reduce_" + "cold_" + biome + "_" + time] / (Number(this.player.roof) + 1) ?? 0;
            }
            else {
                if (helmet) {
                    configSetting = cfg[helmet + "_warm_" + time] ?? 0;
                }
                else {
                    configSetting = cfg["warm_" + time] ?? 0;
                }
                increase = false;
                reduceSetting = cfg["reduce_cold_" + time] / (Number(this.player.roof) + 1) ?? 0;
            }
            if (increase) {
                this.cold += reduceSetting;
                this.cold -= configSetting;
            }
            else {
                time === 'night' ? this.cold -= reduceSetting : this.cold -= reduceSetting - configSetting;
                this.cold += configSetting;
            }
        }
        if (this.player.water) {
            this.thirst += this.config.drink_water;
            this.oxygen -= this.player.bridge ? -this.config.heal_oxygen : this.config.reduce_oxygen - (cfg[helmet + "_loss_oxygen"] ?? 0);
        }
        else {
            this.thirst -= this.player.bed ? this.config.reduce_water_bed : this.config.reduce_water;
            this.oxygen += this.config.heal_oxygen;
        }
        this.hunger = Math.clamp(this.hunger - (this.player.bed ? this.config.reduce_food_bed : this.config.reduce_food), 0, 100);
        this.thirst = Math.clamp(this.thirst, 0, 100);
        this.oxygen = Math.clamp(this.oxygen, 0, 100);
        this.cold = Math.clamp(this.cold, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
        if (this.old.cold === 200 && this.cold === 200) {
            this.player.client.sendBinary(this.player.healthSystem.damage(this.config.damage_warm, ActionType_1.ActionType.HURT));
            this.player.reason = DeathReason_1.DeathReason.WARM;
        }
        if (this.old.hunger === 0 && this.hunger === 0) {
            this.player.reason = DeathReason_1.DeathReason.STARVE;
            this.player.healthSystem.damage(this.config.damage_food, ActionType_1.ActionType.HUNGER);
        }
        if (this.old.cold === 0 && this.cold === 0) {
            this.player.reason = DeathReason_1.DeathReason.COLD;
            this.player.healthSystem.damage(this.player.winter ? this.config.damage_cold_winter : this.config.damage_cold, ActionType_1.ActionType.COLD);
        }
        if (this.old.thirst === 0 && this.thirst === 0) {
            this.player.reason = DeathReason_1.DeathReason.WATER;
            this.player.healthSystem.damage(this.config.damage_water, ActionType_1.ActionType.COLD);
        }
        if (this.old.oxygen === 0 && this.oxygen === 0) {
            this.player.reason = DeathReason_1.DeathReason.OXYGEN;
            this.player.healthSystem.damage(this.config.damage_oxygen, ActionType_1.ActionType.COLD);
        }
        if (this.queryUpdate()) {
            this.updateClientGauges();
        }
    }
    updateFire() {
        if (this.player.onFire) {
            this.cold += 20;
            this.cold = Math.clamp(this.cold, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
            this.player.client.sendBinary(this.player.healthSystem.damage(40, ActionType_1.ActionType.HURT, this.player));
            this.updateGauges();
        }
    }
    updateLava() {
        if (this.player.lava && !this.player.bridge) {
            this.cold = Math.clamp(this.cold + 20, 0, 100 + Number(!this.config.disable_warm_gauge) * 100);
            this.player.client.sendBinary(this.player.healthSystem.damage(40, ActionType_1.ActionType.HURT));
            this.updateGauges();
        }
    }
    updateSpike() {
        const spike = this.player.spike;
        if (spike && spike.owner.id !== this.player.id && !spike.owner.totem?.data.includes(this.player.id)) {
            const damage = this.player.server.configSystem.entityDamage[spike.type];
            const opened = spike.info % 2 && spike.isDoor();
            if (opened)
                return;
            this.player.reason = DeathReason_1.DeathReason.SPIKE;
            this.player.client.sendBinary(this.player.healthSystem.damage(damage, ActionType_1.ActionType.HURT));
        }
    }
    updateHealth() {
        const canHeal = this.hunger > 35 &&
            this.cold > 35 &&
            this.cold < 165 &&
            this.thirst > 35 &&
            this.oxygen > 35;
        if (!canHeal)
            return;
        if (this.bandage || this.player.bed || this.player.helmet.id === ItemType_1.ItemType.CROWN_GREEN) {
            this.player.client.sendBinary(this.player.healthSystem.heal(this.player.helmet.id === ItemType_1.ItemType.CROWN_GREEN ? 40 : this.config.bandage_heal));
            if (this.bandage) {
                this.player.client.sendU8([ClientPackets_1.ClientPackets.BANDAGE, this.bandage]);
                this.bandage--;
            }
        }
        else {
            this.player.client.sendBinary(this.player.healthSystem.heal(this.config.heal));
        }
    }
    queryUpdate() {
        const hasUpdate = this.old.hunger !== this.hunger ||
            this.old.cold !== this.cold ||
            this.old.thirst !== this.thirst ||
            this.old.oxygen !== this.oxygen ||
            this.old.bandage !== this.bandage;
        if (hasUpdate) {
            this.old = {
                hunger: this.hunger,
                cold: this.cold,
                thirst: this.thirst,
                oxygen: this.oxygen,
                bandage: this.bandage
            };
        }
        return hasUpdate;
    }
}
exports.Gauges = Gauges;
