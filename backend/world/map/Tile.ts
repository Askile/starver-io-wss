import {Vector} from "../../modules/Vector";

export class Tile {
    public type: string;
    public subtype: number;
    public radius: number;
    public limit: number;
    public hard: number = 0;
    public id: number;
    public resource: string;
    public position: Vector;
    public realPosition: Vector;
    public count: number;

    constructor(position: Vector, data: any) {
        this.type = data.type;
        this.id = data.id ?? 0;
        this.radius = data.radius;
        this.resource = data.resource ?? "NONE";
        this.limit = data.limit ?? 0;
        this.count = data.limit ?? 0;
        this.subtype = data.subtype ?? 0;
        this.position = position;
        this.realPosition = position.multiply(100).add(new Vector(50, 50));

        switch (this.resource) {
            case "WOOD":
                this.hard = 1;
                break;
            case "STONE":
                this.hard = 2;
                break;
            case "GOLD":
                this.hard = 3;
                break;
            case "DIAMOND":
                this.hard = 4;
                break;
            case "AMETHYST":
                this.hard = 5;
                break;
            case "REIDITE":
                this.hard = 6;
                break;
            case "PLANT":
            case "CACTUS":
                this.hard = -1;
                break;
        }
    }

    public shake(angle: number): number[] {
        return [this.position.x, this.position.y, angle, this.id];
    }

}
