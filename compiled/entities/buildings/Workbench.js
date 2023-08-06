"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workbench = void 0;
const Entity_1 = require("../Entity");
class Workbench extends Entity_1.Entity {
    constructor(type, server) {
        super(type, server);
        this.radius = 35;
        this.collide = true;
    }
}
exports.Workbench = Workbench;
