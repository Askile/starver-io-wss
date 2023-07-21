import {Player} from "../Player";

export class Gauges {
    private player: Player;

    public health: number;
    public hunger: number;
    public cold: number;
    public thirst: number;
    public heat: number;
    public bandage: number;
    constructor(player: Player) {
        this.player = player;

        this.health = 200;
        this.hunger = 100;
        this.cold = 100;
        this.thirst = 100;
        this.heat = 0;
        this.bandage = 0;
    }
    public tick() {
        this.hunger -= 3;
        this.cold -= 3;
        this.thirst -= 2;
    }
}
