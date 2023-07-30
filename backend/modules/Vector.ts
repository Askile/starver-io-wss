export class Vector {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    public distance(v: Vector) {
        return Math.hypot(this.x - v.x , this.y - v.y);
    }

    public isVectorInsideRectangle(v: Vector, rectangleWidth: number, rectangleHeight: number): boolean {
        const minX = this.x;
        const maxX = this.x + rectangleWidth;
        const minY = this.y;
        const maxY = this.y + rectangleHeight;

        return (
            v.x >= minX &&
            v.x <= maxX &&
            v.y >= minY &&
            v.y <= maxY
        );
    }

    public add(v: Vector) {
        return new Vector(this.x + v.x, this.y + v.y);
    }
    public subtract(v: Vector) {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    public divide(divisor: number) {
        return new Vector(this.x / divisor, this.y / divisor);
    }
    public multiply(scalar: number) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    public equal(v: Vector) {
        return this.x === v.x && this.y === v.y;
    }
}