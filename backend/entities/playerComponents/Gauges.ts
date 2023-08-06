import {Player} from "../Player";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {BinaryWriter} from "../../modules/BinaryWriter";
import {ActionType} from "../../enums/ActionType";
import NanoTimer from "nanotimer";
import {DeathReason} from "../../enums/DeathReason";
import {Entity} from "../Entity";
import {EntityType} from "../../enums/EntityType";
import {WorldTime} from "../../enums/WorldTime";

const MAX_HUNGER = 100;
const MAX_COLD = 100;
const MAX_THIRST = 100;

const HUNGER_DAMAGE = 20;
const COLD_DAMAGE = 20;
const THIRST_DAMAGE = 20;
const OXYGEN_DAMAGE = 20;

export class Gauges {
    private player: Player;
    public timer: NanoTimer;

    public hunger!: number;
    public cold!: number;
    public thirst!: number;
    public oxygen!: number;
    public heat!: number;
    public bandage!: number;
    public old: any;

    constructor(player: Player) {
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

        this.timer = new NanoTimer();
        this.timer.setInterval(this.tick.bind(this), [], this.player.server.config.delay_gauges / 1000 + "s");
    }

    private queryUpdate() {
        const hasUpdate =
            this.old.hunger !== this.hunger ||
            this.old.cold !== this.cold ||
            this.old.thirst !== this.thirst ||
            this.old.oxygen !== this.oxygen ||
            this.old.heat !== this.heat ||
            this.old.bandage !== this.bandage;

        if (hasUpdate) {
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

    private updateClientGauges() {
        const writer = new BinaryWriter();
        writer.writeUInt8(ClientPackets.GAUGES);
        writer.writeUInt8(this.player.healthSystem.health / 2);
        writer.writeUInt8(this.hunger);
        writer.writeUInt8(this.cold);
        writer.writeUInt8(this.thirst);
        writer.writeUInt8(this.oxygen);
        writer.writeUInt8(this.heat);
        writer.writeUInt8(this.bandage);

        this.player.client.sendBinary(writer.toBuffer());
    }
    public tick() {

        this.hunger = Math.clamp(this.hunger - this.player.server.config.reduce_food, 0, MAX_HUNGER);

        if(this.player.fire) {
            this.cold = Math.clamp(this.cold + this.player.server.config.increase_cold_on_fire, 0, MAX_COLD);
        } else {
            if(this.player.server.timeSystem.time === WorldTime.DAY) {
                this.cold = Math.clamp(this.cold - this.player.server.config.reduce_cold_day, 0, MAX_COLD);
            } else {
                this.cold = Math.clamp(this.cold - this.player.server.config.reduce_cold_night, 0, MAX_COLD);
            }
        }

        if(this.player.water) {
            this.thirst = Math.clamp(this.thirst + this.player.server.config.drink_water, 0, MAX_THIRST);
            this.oxygen = Math.clamp(this.oxygen - this.player.server.config.reduce_oxygen, 0, 100);
        } else {
            this.thirst = Math.clamp(this.thirst - this.player.server.config.reduce_water, 0, MAX_THIRST);
            this.oxygen = Math.clamp(this.oxygen + this.player.server.config.heal_oxygen, 0, 100);
        }

        if (this.hunger === 0) {
            this.player.reason = DeathReason.STARVE;
            this.player.healthSystem.damage(this.player.server.config.damage_food, ActionType.HUNGER);
        }

        if (this.cold === 0) {
            this.player.reason = DeathReason.COLD;
            this.player.healthSystem.damage(this.player.server.config.damage_cold, ActionType.COLD);
        }

        if (this.thirst === 0) {
            this.player.reason = DeathReason.WATER;
            this.player.healthSystem.damage(this.player.server.config.damage_water, ActionType.HURT);
        }

        if (this.oxygen === 0) {
            this.player.reason = DeathReason.OXYGEN;
            this.player.healthSystem.damage(this.player.server.config.damage_oxygen, ActionType.HURT);
        }

        if (
            this.oxygen > 35 &&
            this.hunger > 35 &&
            this.cold > 35 &&
            this.thirst > 35 &&
            this.oxygen > 35 &&
            this.heat > 35
        ) {
            this.player.client.sendBinary(this.player.healthSystem.heal(40));
        }

        if (this.queryUpdate()) {
            this.updateClientGauges();
        }
    }
}
