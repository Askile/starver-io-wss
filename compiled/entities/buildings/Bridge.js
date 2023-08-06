"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bridge = void 0;
const Entity_1 = require("../Entity");
class Bridge extends Entity_1.Entity {
    durability = 100;
    constructor(type, server) {
        super(type, server);
        this.info = 100;
    }
}
exports.Bridge = Bridge;
