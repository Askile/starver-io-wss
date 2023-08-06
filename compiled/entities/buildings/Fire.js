"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fire = void 0;
const Entity_1 = require("../Entity");
const nanotimer_1 = __importDefault(require("nanotimer"));
const EntityType_1 = require("../../enums/EntityType");
class Fire extends Entity_1.Entity {
    constructor(type, server) {
        super(type, server);
        this.radius = 25;
        if (this.getAliveTime()) {
            new nanotimer_1.default().setTimeout(() => this.delete(), [], this.getAliveTime() + "s");
        }
    }
    getAliveTime() {
        if (this.type === EntityType_1.EntityType.FIRE)
            return 120;
        if (this.type === EntityType_1.EntityType.BIG_FIRE)
            return 480;
        return 0;
    }
}
exports.Fire = Fire;
