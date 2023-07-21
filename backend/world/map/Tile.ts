import {Vector} from "../../modules/Vector";

export class Tile {
    private type: string;
    public id: number;
    public resource: string;
    public position: Vector;
    private radius: number;
    private limit: number;
    public count: number;

    constructor(position: Vector, data: any) {
        this.type = data.type;
        this.id = data.id ?? 0;
        this.radius = data.radius;
        this.resource = data.resource ?? "NONE";
        this.limit = data.limit ?? 0;
        this.count = data.limit;
        this.position = position;
    }

    public shake(angle: number): number[] {
        return [this.position.x, this.position.y, angle, this.id];
    }
    public addResource() {}
}
