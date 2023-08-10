"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
const Vector_1 = require("../../modules/Vector");
const TileType_1 = require("../../enums/TileType");
class Tile {
    type;
    collide = true;
    entity;
    subtype;
    radius;
    limit;
    hard = 0;
    id;
    resource;
    position;
    realPosition;
    count;
    constructor(position, data) {
        this.type = data.type;
        this.id = data.id ?? 0;
        this.radius = data.radius;
        this.resource = data.resource ?? "NONE";
        this.limit = data.limit ?? 0;
        this.count = data.limit ?? 0;
        this.subtype = data.subtype ?? 0;
        this.position = position;
        this.realPosition = position.multiply(100).add(new Vector_1.Vector(50, 50));
        if (!this.radius || this.type === TileType_1.TileType.LAVA) {
            this.collide = false;
        }
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
    shake(angle) {
        return [this.position.x, this.position.y, angle, this.id];
    }
}
exports.Tile = Tile;
