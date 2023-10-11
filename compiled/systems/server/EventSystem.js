"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSystem = void 0;
const ItemType_1 = require("../../enums/types/ItemType");
const EntityType_1 = require("../../enums/types/EntityType");
class EventSystem {
    server;
    timestamp = 0;
    seconds = 0;
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
    }
    initEvents() {
        if (this.events.length > 0)
            for (let event of this.events) {
                if (event.x && event.y) {
                    event.x = event.x * 100 + 50;
                    event.y = event.y * 100 + 50;
                }
                if (event.item) {
                    event.item = ItemType_1.ItemType[event.item.toUpperCase()];
                }
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
    onKill(player) {
        if (!this.killEvents.length)
            return;
        for (const event of this.killEvents) {
            if (event.kill === player.kills) {
            }
        }
    }
    tick() {
        if (Date.now() - this.timestamp >= 1000) {
            this.seconds++;
            if (this.locationInventoryEvents.length) {
                for (const event of this.locationInventoryEvents) {
                    if (!event.commands.length || this.seconds % event.repeat)
                        continue;
                    const players = this.server.map.getEntitiesInDistance(event, [EntityType_1.EntityType.PLAYER], 50);
                    for (const player of players) {
                        if (!player.inventory.containsItem(event.item, event.amount))
                            continue;
                        this.commandsArray(player, event.commands);
                    }
                }
            }
            if (this.timeEvents) {
                for (const event of this.timeEvents) {
                    if (!event.commands.length || this.seconds % event.repeat)
                        continue;
                }
            }
            if (this.inventoryEvents.length) {
                for (const event of this.inventoryEvents) {
                    if (!event.commands.length || this.seconds % event.repeat)
                        continue;
                    for (const player of this.server.players) {
                        if (!player.inventory.containsItem(event.item, event.amount))
                            continue;
                        this.commandsArray(player, event.commands);
                    }
                }
            }
            this.timestamp = Date.now();
        }
    }
    commandsArray(player, commands) {
        for (const command of commands) {
            this.server.commandSystem.handleCommand(player, command);
        }
    }
    onReceiveScore(player) {
        if (!this.scoreEvents.length)
            return;
        for (const event of this.scoreEvents) {
            if (!player.scoreAchievements.includes(event.score) && player.score >= event.score && event.commands) {
                this.commandsArray(player, event.commands);
                player.scoreAchievements.push(event.score);
            }
        }
    }
}
exports.EventSystem = EventSystem;
