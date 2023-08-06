"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fruit = void 0;
const Entity_1 = require("./Entity");
class Fruit extends Entity_1.Entity {
    constructor(type, server) {
        super(type, server);
        this.server.entities.push(this);
    }
}
exports.Fruit = Fruit;
