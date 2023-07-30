import {Player} from "../Player";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {BinaryWriter} from "../../modules/BinaryWriter";
import {ActionType} from "../../enums/ActionType";
import NanoTimer from "nanotimer";
import {DeathReason} from "../../enums/DeathReason";
import {Entity} from "../Entity";
import {EntityType} from "../../enums/EntityType";

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
        this.timer.setInterval(this.tick.bind(this), [], "0.5s");
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

    private clamp(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
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
        this.hunger = Math.clamp(this.hunger - 3, 0, MAX_HUNGER);

        const chunks = this.player.server.map.getChunks(this.player.position.x, this.player.position.y, 2);
        let isFire = false;
        let isWorkbench = false;
        let isWater = false;

        for (const chunk of chunks) {
            for (const entity of chunk.entities) {
                if(entity.isFire() && entity.position.distance(this.player.position) < 200)
                    isFire = true;
                if(entity.isWorkbench() && entity.position.distance(this.player.position) < 200)
                    isWorkbench = true;
            }
            for (const tile of chunk.tiles) {
                if(tile.type === "r" && tile.position.x === ~~(this.player.position.x / 100) && tile.position.y === ~~(this.player.position.y / 100)) {
                    isWater = true;
                }
            }
        }

        this.player.workbench = isWorkbench;
        this.player.fire = isFire;
        this.player.water = isWater;


        if(this.player.fire) {
            this.cold = Math.clamp(this.cold + 20, 0, MAX_COLD);
        } else {
            this.cold = Math.clamp(this.cold - 3, 0, MAX_COLD);
        }

        if(isWater) {
            this.thirst = Math.clamp(this.thirst + 20, 0, MAX_THIRST);
        } else {
            this.thirst = Math.clamp(this.thirst - 2, 0, MAX_THIRST);
        }

        if (this.oxygen === 0) {
            this.player.reason = DeathReason.OXYGEN;
            this.player.healthSystem.damage(OXYGEN_DAMAGE, ActionType.HURT);
        }
        if (this.hunger === 0) {
            this.player.reason = DeathReason.STARVE;
            this.player.healthSystem.damage(HUNGER_DAMAGE, ActionType.HUNGER);
        }

        if (this.cold === 0) {
            this.player.reason = DeathReason.COLD;
            this.player.healthSystem.damage(COLD_DAMAGE, ActionType.COLD);
        }

        if (this.thirst === 0) {
            this.player.reason = DeathReason.WATER;
            this.player.healthSystem.damage(THIRST_DAMAGE, ActionType.HURT);
        }

        if (this.oxygen === 0) {
            this.player.reason = DeathReason.OXYGEN;
            this.player.healthSystem.damage(OXYGEN_DAMAGE, ActionType.HURT);
        }

        if (
            this.oxygen > 35 &&
            this.hunger > 35 &&
            this.cold > 35 &&
            this.thirst > 35 &&
            this.oxygen > 35 &&
            this.heat > 35
        ) {
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
