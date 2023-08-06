"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSystem = void 0;
const nanotimer_1 = __importDefault(require("nanotimer"));
class EventSystem {
    server;
    locationInventoryEvents = [];
    inventoryEvents = [];
    locationEvents = [];
    killEvents = [];
    timeEvents = [];
    scoreEvents = [];
    events;
    constructor(server) {
        this.server = server;
        this.events = server.config.important.events;
        this.initEvents();
        this.setupEvents();
    }
    initEvents() {
        if (this.events.length > 0)
            for (const event of this.events) {
                switch (event.type) {
                    case "inventory":
                        this.inventoryEvents.push(event);
                        break;
                    case "location":
                        this.locationEvents.push(event);
                        break;
                    case "score":
                        this.scoreEvents.push(event);
                        break;
                    case "kill":
                        this.killEvents.push(event);
                        break;
                    case "locationInventory":
                        this.locationInventoryEvents.push(event);
                        break;
                    case "time":
                        this.timeEvents.push(event);
                        break;
                    default:
                        break;
                }
            }
    }
    setupEvents() {
        for (const event of this.scoreEvents) {
            new nanotimer_1.default().setInterval(() => {
                for (const player of this.server.players) {
                    if (player.stats.score > event.score) {
                    }
                }
            }, [], event.repeat + "s");
        }
    }
}
exports.EventSystem = EventSystem;
