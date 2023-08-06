"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Biome = void 0;
class Biome {
    position;
    size;
    type;
    constructor(type, position, size) {
        this.type = type;
        this.position = position;
        this.size = size;
    }
}
exports.Biome = Biome;
