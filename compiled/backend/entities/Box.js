"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
const Entity_1 = require("./Entity");
const nanotimer_1 = __importDefault(require("nanotimer"));
class Box extends Entity_1.Entity {
    item;
    count;
    constructor(server, type, data) {
        super(type, server);
        this.position = data.owner.position;
        this.info = data.owner.cosmetics.crate;
        this.item = data.item;
        this.count = data.count;
        this.server.entities.push(this);
        new nanotimer_1.default().setTimeout(() => {
            this.delete();
        }, [], "16s");
    }
}
exports.Box = Box;
