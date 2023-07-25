import {Player} from "../Player";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {BinaryWriter} from "../../modules/BinaryWriter";
import {ActionType} from "../../enums/ActionType";
import NanoTimer from "nanotimer";
import {DeathReason} from "../../enums/DeathReason";
import {Vector} from "../../modules/Vector";
import {EntityType} from "../../enums/EntityType";

const MAX_HEALTH = 200;
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

    private _health!: number;
    private _hunger!: number;
    private _cold!: number;
    private _thirst!: number;
    private _oxygen!: number;
    private _heat!: number;
    private _bandage!: number;
    private old: any;

    constructor(player: Player) {
        this.player = player;

        this.health = 200;
        this.hunger = 100;
        this.cold = 100;
        this.thirst = 100;
        this.oxygen = 100;
        this.heat = 100;
        this.bandage = 0;

        this.old = {
            health: this.health,
            hunger: this.hunger,
            cold: this.cold,
            thirst: this.thirst,
            oxygen: this.oxygen,
            heat: this.heat,
            bandage: this.bandage
        };

        this.timer = new NanoTimer();
        this.timer.setInterval(this.tick.bind(this), [], "5s");
    }

    private queryUpdate() {
        const hasUpdate =
            this.old.health !== this.health ||
            this.old.hunger !== this.hunger ||
            this.old.cold !== this.cold ||
            this.old.thirst !== this.thirst ||
            this.old.oxygen !== this.oxygen ||
            this.old.heat !== this.heat ||
            this.old.bandage !== this.bandage;

        if (hasUpdate) {
            // Update the 'old' object with the current values
            this.old = {
                health: this.health,
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

    private clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    private updateClientGauges() {
        const writer = new BinaryWriter();
        writer.writeUInt8(ClientPackets.GAUGES);
        writer.writeUInt8(this.health / 2);
        writer.writeUInt8(this.hunger);
        writer.writeUInt8(this.cold);
        writer.writeUInt8(this.thirst);
        writer.writeUInt8(this.oxygen);
        writer.writeUInt8(this.heat);
        writer.writeUInt8(this.bandage);

        this.player.client.sendBinary(writer.toBuffer());
    }

    private handleGaugeDamage(damage: number, actionType: ActionType) {
        this.health -= damage;
        if (!(this.player.action & actionType) && this.old.health !== this.health) {
            this.player.action |= actionType;
        }
    }
    public tick() {
        this.hunger -= 3;
        this.cold -= 3;
        this.thirst -= 2;

        if (this.oxygen === 0) {
            this.player.reason = DeathReason.OXYGEN;
            this.handleGaugeDamage(OXYGEN_DAMAGE, ActionType.HURT);
        }
        if (this.hunger === 0) {
            this.player.reason = DeathReason.STARVE;
            this.handleGaugeDamage(HUNGER_DAMAGE, ActionType.HUNGER);
        }

        if (this.cold === 0) {
            this.player.reason = DeathReason.COLD;
            this.handleGaugeDamage(COLD_DAMAGE, ActionType.COLD);
        }

        if (this.thirst === 0) {
            this.player.reason = DeathReason.WATER;
            this.handleGaugeDamage(THIRST_DAMAGE, ActionType.HURT);
        }

        if (this.oxygen === 0) {
            this.player.reason = DeathReason.OXYGEN;
            this.handleGaugeDamage(OXYGEN_DAMAGE, ActionType.HURT);
        }

        if (
            this.oxygen > 35 &&
            this.hunger > 35 &&
            this.cold > 35 &&
            this.thirst > 35 &&
            this.oxygen > 35 &&
            this.heat > 35
        ) {
            this.handleGaugeDamage(-20, ActionType.HEAL);
        }

        if (this.health === 0) {
            this.player.die();
        }

        if (this.queryUpdate()) {
            this.updateClientGauges();
        }
    }

    get health() {
        return this._health;
    }
    set health(value: number) {
        this._health = this.clamp(value, 0, MAX_HEALTH);
    }

    get hunger() {
        return this._hunger;
    }
    set hunger(value: number) {
        this._hunger = this.clamp(value, 0, MAX_HUNGER);
    }

    get cold() {
        return this._cold;
    }
    set cold(value: number) {
        this._cold = this.clamp(value, 0, MAX_COLD);
    }

    get thirst() {
        return this._thirst;
    }
    set thirst(value: number) {
        this._thirst = this.clamp(value, 0, MAX_THIRST);
    }

    get oxygen() {
        return this._oxygen;
    }
    set oxygen(value: number) {
        this._oxygen = this.clamp(value, 0, MAX_THIRST);
    }

    get heat() {
        return this._heat;
    }
    set heat(value: number) {
        this._heat = this.clamp(value, 0, 100);
    }

    get bandage() {
        return this._bandage;
    }
    set bandage(value: number) {
        this._bandage = this.clamp(value, 0, 100);
    }
}
