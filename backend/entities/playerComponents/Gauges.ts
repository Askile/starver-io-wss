import {Player} from "../Player";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {BinaryWriter} from "../../modules/BinaryWriter";
import {ActionType} from "../../enums/ActionType";
import NanoTimer from "nanotimer";
import {DeathReason} from "../../enums/DeathReason";
import {WorldTime} from "../../enums/WorldTime";

export class Gauges {
    private player: Player;

    public lastUpdateStats: number = Date.now();
    public lastUpdateHealth: number = Date.now();
    public lastUpdateLava: number = Date.now();
    public lastUpdateFire: number = Date.now();

    public timer: NanoTimer;
    public healthTimer: NanoTimer;

    public hunger!: number;
    public cold!: number;
    public thirst!: number;
    public oxygen!: number;
    public bandage!: number;
    public old: any;

    constructor(player: Player) {
        this.player = player;

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

        this.timer = new NanoTimer();
        this.healthTimer = new NanoTimer();

        this.timer.setInterval(this.tick.bind(this), [], 1 / 100 + "s");
    }

    private updateClientGauges() {
        const writer = new BinaryWriter();
        writer.writeUInt8(ClientPackets.GAUGES);
        writer.writeUInt8(this.player.healthSystem.health / 2);
        writer.writeUInt8(this.hunger);
        writer.writeUInt8(Math.min(100, this.cold));
        writer.writeUInt8(this.thirst);
        writer.writeUInt8(this.oxygen);
        writer.writeUInt8(200 - this.cold);
        writer.writeUInt8(this.bandage);

        this.player.client.sendBinary(writer.toBuffer());
    }

    public tick() {
        if(Date.now() - this.lastUpdateHealth >= this.player.server.config.delay_gauges * 2) {
            this.lastUpdateHealth = Date.now();
            this.updateHealth();
        }

        if(Date.now() - this.lastUpdateStats >= this.player.server.config.delay_gauges) {
            this.lastUpdateStats = Date.now();
            this.updateGauges();
        }

        if(Date.now() - this.lastUpdateLava >= 500) {
            this.lastUpdateLava = Date.now();
            this.updateLava();
        }
    }

    public updateGauges() {

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

        const oldCold= this.cold //TODO: Нормально переделать холод и жар

        this.hunger = Math.clamp(this.hunger - this.player.server.config.reduce_food, 0, 100);

        if(this.player.fire) {
            this.cold = this.cold + this.player.server.config.increase_cold_on_fire;
        } else {
            if(this.player.server.timeSystem.time === WorldTime.DAY) {

                if (this.player.water) this.cold = this.cold - this.player.server.config.reduce_cold_water_day;
                else if(this.player.winter) this.cold = this.cold - this.player.server.config.reduce_cold_winter_day;
                else if(this.player.desert) this.cold = this.cold + this.player.server.config.increase_cold_desert_day;
                else if(this.player.lavaBiome) this.cold = this.cold + this.player.server.config.increase_cold_lava;
                else this.cold = this.cold - this.player.server.config.reduce_cold_day;

            } else {

                if (this.player.water) this.cold = this.cold - this.player.server.config.reduce_cold_water_night;
                else if(this.player.winter) this.cold = this.cold - this.player.server.config.reduce_cold_winter_night;
                else if(this.player.desert) this.cold = this.cold + this.player.server.config.increase_cold_desert_night;
                else if(this.player.lavaBiome) this.cold = this.cold + this.player.server.config.increase_cold_lava;
                else this.cold = this.cold - this.player.server.config.reduce_cold_night;

            }
        }

        if(this.player.water) {
            this.thirst = Math.clamp(this.thirst + this.player.server.config.drink_water, 0, 100);
            this.oxygen = Math.clamp(this.oxygen - this.player.server.config.reduce_oxygen, 0, 100);
        } else {
            this.thirst = Math.clamp(this.thirst - this.player.server.config.reduce_water, 0, 100);
            this.oxygen = Math.clamp(this.oxygen + this.player.server.config.heal_oxygen, 0, 100);
        }

        this.cold = Math.clamp(this.cold, 0, 200);
        if(this.cold === 200 && (this.player.lavaBiome || this.player.desert)) {
            this.player.client.sendBinary(this.player.healthSystem.damage(40, ActionType.HURT));
            this.player.reason = DeathReason.WARM;
        }

        if (this.queryUpdate()) {
            this.updateClientGauges();
        }
    }

    private updateLava() {
        if(this.player.lava) {
            this.cold += 40;
            this.player.healthSystem.damage(40, ActionType.HURT);
            this.updateGauges();
        }
    }

    private updateHealth() {
        const canHeal =
            this.hunger > 35 &&
            this.cold > 35 &&
            this.cold < 165 &&
            this.thirst > 35 &&
            this.oxygen > 35

        if (!canHeal) return;

        if(this.bandage) {
            this.player.client.sendBinary(this.player.healthSystem.heal(40));
            this.player.client.sendU8([ClientPackets.BANDAGE, this.bandage]);
            this.bandage--;
        } else {
            this.player.client.sendBinary(this.player.healthSystem.heal(12));
        }
    }

    private queryUpdate() {
        const hasUpdate =
            this.old.hunger !== this.hunger ||
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
