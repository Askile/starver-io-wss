"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gauges = void 0;
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const ActionType_1 = require("../../enums/ActionType");
const nanotimer_1 = __importDefault(require("nanotimer"));
const DeathReason_1 = require("../../enums/DeathReason");
const WorldTime_1 = require("../../enums/WorldTime");
const MAX_HUNGER = 100;
const MAX_COLD = 100;
const MAX_THIRST = 100;
const HUNGER_DAMAGE = 20;
const COLD_DAMAGE = 20;
const THIRST_DAMAGE = 20;
const OXYGEN_DAMAGE = 20;
class Gauges {
    player;
    timer;
    hunger;
    cold;
    thirst;
    oxygen;
    heat;
    bandage;
    old;
    constructor(player) {
        this.player = player;
        this.hunger = 100;
        this.cold = 100;
        this.thirst = 100;
        this.oxygen = 100;
        this.heat = 100;
        this.bandage = 0;
        this.old = {
            hunger: this.hunger,
            cold: this.cold,
            thirst: this.thirst,
            oxygen: this.oxygen,
            heat: this.heat,
            bandage: this.bandage
        };
        this.timer = new nanotimer_1.default();
        this.timer.setInterval(this.tick.bind(this), [], this.player.server.config.delay_gauges / 1000 + "s");
    }
    queryUpdate() {
        const hasUpdate = this.old.hunger !== this.hunger ||
            this.old.cold !== this.cold ||
            this.old.thirst !== this.thirst ||
            this.old.oxygen !== this.oxygen ||
            this.old.heat !== this.heat ||
            this.old.bandage !== this.bandage;
        if (hasUpdate) {
            // Update the 'old' object with the current values
            this.old = {
                hunger: this.hunger,
                cold: this.cold,
                thirst: this.thirst,
                oxygen: this.oxygen,
                heat: this.heat,
                bandage: this.bandage
            };
        }
        return hasUpdate;
    }
    updateClientGauges() {
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt8(ClientPackets_1.ClientPackets.GAUGES);
        writer.writeUInt8(this.player.healthSystem.health / 2);
        writer.writeUInt8(this.hunger);
        writer.writeUInt8(this.cold);
        writer.writeUInt8(this.thirst);
        writer.writeUInt8(this.oxygen);
        writer.writeUInt8(this.heat);
        writer.writeUInt8(this.bandage);
        this.player.client.sendBinary(writer.toBuffer());
    }
    tick() {
        this.hunger = Math.clamp(this.hunger - this.player.server.config.reduce_food, 0, MAX_HUNGER);
        const chunks = this.player.server.map.getChunks(this.player.position.x, this.player.position.y, 2);
        let isFire = false;
        let isWorkbench = false;
        let isWater = false;
        const biomes = this.player.server.map.getBiomesAtEntityPosition(this.player);
        for (const chunk of chunks) {
            for (const entity of chunk.entities) {
                if (entity.isFire() && entity.position.distance(this.player.position) < 200)
                    isFire = true;
                if (entity.isWorkbench() && entity.position.distance(this.player.position) < 200)
                    isWorkbench = true;
            }
            for (const tile of chunk.tiles) {
                if (tile.type === "r" && tile.position.x === ~~(this.player.position.x / 100) && tile.position.y === ~~(this.player.position.y / 100)) {
                    isWater = true;
                }
            }
        }
        if (!biomes.length) {
            isWater = true;
        }
        this.player.workbench = isWorkbench;
        this.player.fire = isFire;
        this.player.water = isWater;
        if (this.player.fire) {
            this.cold = Math.clamp(this.cold + this.player.server.config.increase_cold_on_fire, 0, MAX_COLD);
        }
        else {
            if (this.player.server.timeSystem.time === WorldTime_1.WorldTime.DAY) {
                this.cold = Math.clamp(this.cold - this.player.server.config.reduce_cold_day, 0, MAX_COLD);
            }
            else {
                this.cold = Math.clamp(this.cold - this.player.server.config.reduce_cold_night, 0, MAX_COLD);
            }
        }
        if (isWater) {
            this.thirst = Math.clamp(this.thirst + this.player.server.config.drink_water, 0, MAX_THIRST);
        }
        else {
            this.thirst = Math.clamp(this.thirst - this.player.server.config.reduce_water, 0, MAX_THIRST);
        }
        if (this.hunger === 0) {
            this.player.reason = DeathReason_1.DeathReason.STARVE;
            this.player.healthSystem.damage(this.player.server.config.damage_food, ActionType_1.ActionType.HUNGER);
        }
        if (this.cold === 0) {
            this.player.reason = DeathReason_1.DeathReason.COLD;
            this.player.healthSystem.damage(this.player.server.config.damage_cold, ActionType_1.ActionType.COLD);
        }
        if (this.thirst === 0) {
            this.player.reason = DeathReason_1.DeathReason.WATER;
            this.player.healthSystem.damage(this.player.server.config.damage_water, ActionType_1.ActionType.HURT);
        }
        if (this.oxygen === 0) {
            this.player.reason = DeathReason_1.DeathReason.OXYGEN;
            this.player.healthSystem.damage(this.player.server.config.damage_oxygen, ActionType_1.ActionType.HURT);
        }
        if (this.oxygen > 35 &&
            this.hunger > 35 &&
            this.cold > 35 &&
            this.thirst > 35 &&
            this.oxygen > 35 &&
            this.heat > 35) {
            this.player.healthSystem.heal(20);
        }
        if (this.player.healthSystem.health === 0) {
            this.player.die();
        }
        if (this.queryUpdate()) {
            this.updateClientGauges();
        }
    }
}
exports.Gauges = Gauges;
