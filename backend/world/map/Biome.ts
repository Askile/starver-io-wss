import {Vector} from "../../modules/Vector";

export class Biome {
    public position: Vector;
    public size: Vector;
    public type: string;
    constructor(type: string, position: Vector, size: Vector) {
        this.type = type;
        this.position = position;
        this.size = size;
    }
}
