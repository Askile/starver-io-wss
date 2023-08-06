"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
const Entity_1 = require("./Entity");
class Building extends Entity_1.Entity {
    constructor(type, server) {
        super(type, server);
    }
}
exports.Building = Building;
