import {Player} from "../Player";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {BinaryWriter} from "../../modules/BinaryWriter";
import {ActionType} from "../../enums/ActionType";
import NanoTimer from "nanotimer";

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

    get health() {
        return this._health;
    }
    get hunger() {
        return this._hunger;
    }
    get cold() {
        return this._cold;
    }
    get heat() {
        return this._heat;
    }
    get thirst() {
        return this._thirst;
    }
    get oxygen() {
        return this._oxygen;
    }
    get bandage() {
        return this._bandage;
    }
    set health(value: number) {
        this._health = Math.max(0, Math.min(200, value));
    }

    set hunger(value: number) {
        this._hunger = Math.max(0, Math.min(100, value));
    }

    set cold(value: number) {
        this._cold = Math.max(0, Math.min(100, value));
    }

    set thirst(value: number) {
        this._thirst = Math.max(0, Math.min(100, value));
    }

    set oxygen(value: number) {
        this._oxygen = Math.max(0, Math.min(100, value));
    }

    set heat(value: number) {
        this._heat = Math.max(0, Math.min(100, value));
    }

    set bandage(value: number) {
        this._bandage = Math.max(0, Math.min(100, value));
    }
    constructor(player: Player) {
        this.player = player;

        this.health = 200;
        this.hunger = 100;
        this.cold = 100;
        this.thirst = 100;
        this.oxygen = 100;
        this.heat = 0;
        this.bandage = 0;

        this.timer = new NanoTimer();

        this.timer.setInterval(this.tick.bind(this), [], "5s");
    }
    public tick() {
        this.hunger -= 3;
        this.cold -= 3;
        this.thirst -= 2;

        if (!this.hunger) {
            this.health -= 20;
            if (!(this.player.action & ActionType.HUNGER)) this.player.action |= ActionType.HUNGER;
        }

        if (!this.cold) {
            this.health -= 20;
            if (!(this.player.action & ActionType.COLD)) this.player.action |= ActionType.COLD;
        }

        if (!this.thirst) {
            this.health -= 20;
            if (!(this.player.action & ActionType.HURT)) this.player.action |= ActionType.HURT;
        }

        if (!this.health) this.player.die();

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
}
