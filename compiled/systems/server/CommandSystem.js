"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = exports.CommandSystem = void 0;
const Permissions_1 = require("../../enums/Permissions");
const ItemType_1 = require("../../enums/types/ItemType");
const ClientStringPackets_1 = require("../../enums/packets/ClientStringPackets");
const EntityType_1 = require("../../enums/types/EntityType");
const ActionType_1 = require("../../enums/types/ActionType");
const Vector_1 = require("../../modules/Vector");
const Building_1 = require("../../entities/Building");
const Utils_1 = require("../../modules/Utils");
class CommandSystem {
    server;
    commands;
    constructor(server) {
        this.server = server;
        this.commands = [];
        this.initializeCommands();
    }
    initializeCommands() {
        this.commands.push(new Command(["m", "message"], Permissions_1.Permissions.CO_OWNER, this.sendMessage.bind(this)));
        this.commands.push(new Command(["mt", "message-to"], Permissions_1.Permissions.CO_OWNER, this.sendMessageTo.bind(this)));
        this.commands.push(new Command(["heal"], Permissions_1.Permissions.CO_OWNER, this.heal.bind(this)));
    }
    sendMessage(args) {
        this.server.broadcast(JSON.stringify([4, args.join(" ")]), false);
    }
    sendMessageTo(args) {
        const id = Number(args.splice(0, 1)[0]);
        const p = this.server.findPlayerById(Number(id));
        p && p.client.sendJSON([4, args.join(" ")]);
    }
    heal(args) {
        const id = Number(args[0]);
        const p = this.server.findPlayerById(Number(id));
        p && p.client.sendBinary(p.healthSystem.heal(p.healthSystem.maxHealth));
    }
    findSimilarItem(name) {
        const items = Object.values(ItemType_1.ItemType);
        let minDistance = Infinity;
        let mostSimilarItem;
        for (const item of items) {
            if (item && isNaN(Number(item))) {
                const distance = Utils_1.Utils.levenshteinDistance(name, item);
                if (distance < minDistance) {
                    minDistance = distance;
                    mostSimilarItem = item;
                }
            }
        }
        return mostSimilarItem;
    }
    hasPermission(player, permissions) {
        if (Array.isArray(permissions)) {
            for (const perm of permissions) {
                if (player.permission & perm)
                    return true;
            }
        }
        else {
            return player.permission & permissions;
        }
    }
    handleCommand(player, rawCommand, isServer = false) {
        const command = rawCommand.trim();
        const args = command.split(" ");
        const commandType = args.shift().toLowerCase();
        for (let i = 0; i < args.length; i++) {
            if (args[i].toLowerCase() === "$id")
                args[i] = String(player.id);
        }
        for (const cmd of this.commands) {
            if (cmd.ids.includes(commandType)) {
                cmd.callback(args);
            }
        }
        switch (commandType) {
            case "heal":
                if (!this.hasPermission(player, [Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                const id = Number(args[0]);
                break;
            case "clean-inventory-all":
            case "cia": {
                if (!this.hasPermission(player, Permissions_1.Permissions.OWNER) && !isServer)
                    return this.error(player, "permission");
                for (const p of this.server.players) {
                    p.client.sendBinary(p.inventory.cleanInventory());
                }
                this.response(player, `Cleared from ${this.server.players.length} players`, true, "Inventory Clear");
                break;
            }
            case "clean-inventory":
            case "ci": {
                if (!this.hasPermission(player, [Permissions_1.Permissions.CO_OWNER, Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                player.client.sendBinary(player.inventory.cleanInventory());
                this.response(player, `Success`, true, "Inventory Clear");
                break;
            }
            case "ri":
            case "remove-item": {
                if (!this.hasPermission(player, [Permissions_1.Permissions.CO_OWNER, Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                const id = Number(args[0]);
                const c = Number(args[2]) || 1;
                if (isNaN(id))
                    return this.error(player, "number");
                const p = this.server.findPlayerById(id);
                if (!p)
                    return this.error(player, "player");
                const itemName = args[1].toUpperCase();
                const item = Number(ItemType_1.ItemType[itemName]);
                if (isNaN(item)) {
                    const similarItem = this.findSimilarItem(itemName);
                    return similarItem ? this.error(player, "similaritem", similarItem) : this.error(player, "item");
                }
                const count = Math.clamp(c, 0, 65535);
                p.client.sendBinary(p.inventory.removeItem(item, count));
                this.response(player, `${count} ${itemName.toLowerCase()} added to ${p.data.nickname}#${p.id} inventory`, true, "Success");
                break;
            }
            case "teleport":
            case "tp": {
                if (!this.hasPermission(player, [Permissions_1.Permissions.CO_OWNER, Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                if (args.length !== 3)
                    return this.error(player, "args");
                let id = Number(args[0]), x = Number(args[1]), y = Number(args[2]);
                let p = this.server.findPlayerById(id);
                if (isNaN(x) || isNaN(y) || isNaN(id) || !p)
                    return this.error(player, "number");
                p.position.set(new Vector_1.Vector(x * 100, y * 100));
                p.realPosition.set(player.position);
                break;
            }
            case "teleport-to":
            case "tpt": {
                if (!this.hasPermission(player, [Permissions_1.Permissions.CO_OWNER, Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                if (args.length !== 1)
                    return this.error(player, "args");
                const id = Number(args[0]);
                if (isNaN(id))
                    return this.error(player, "number");
                const entity = this.server.findEntityById(id);
                if (entity)
                    player.position.set(entity.realPosition);
                else
                    return this.error(player, "id");
                player.realPosition.set(player.position);
                break;
            }
            case "teleport-to-entity":
            case "tpte": {
                if (!this.hasPermission(player, [Permissions_1.Permissions.CO_OWNER, Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                if (args.length !== 1)
                    return this.error(player, "args");
                const id = args[0].toUpperCase();
                const type = EntityType_1.EntityType[id];
                if (!type)
                    return this.error(player, "type");
                const entity = this.server.entities.find(e => e.type === type);
                if (!entity)
                    return this.error(player, "entity");
                player.position.set(entity.position);
                player.realPosition.set(player.position);
                break;
            }
            case "teleport-all":
            case "tpa": {
                if (!this.hasPermission(player, Permissions_1.Permissions.OWNER) && !isServer)
                    return this.error(player, "permission");
                if (args.length !== 2)
                    return this.error(player, "args");
                let x = Number(args[0]), y = Number(args[1]);
                if (isNaN(x) || isNaN(y))
                    return this.error(player, "number");
                for (const p of this.server.players) {
                    p.position.x = x * 100;
                    p.position.y = y * 100;
                    p.realPosition = p.position.clamp(0, 0, this.server.map.width - 1, this.server.map.height - 1);
                }
                break;
            }
            case "teleport-to-biome":
            case "tptb": {
                if (!this.hasPermission(player, [Permissions_1.Permissions.CO_OWNER, Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                if (args.length !== 1)
                    return this.error(player, "args");
                const biomeName = args[0].toUpperCase();
                if (this.server.map.biomes.filter(biome => biome.type === biomeName).length <= 0)
                    return this.error(player, "biome");
                player.position.set(this.server.spawnSystem.getSpawnPoint(biomeName));
                player.realPosition.set(player.position);
                break;
            }
            case "give":
            case "g": {
                if (!this.hasPermission(player, [Permissions_1.Permissions.CO_OWNER, Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                const id = Number(args[0]);
                const c = Number(args[2]) || 1;
                if (isNaN(id))
                    return this.error(player, "number");
                const p = this.server.findPlayerById(id);
                if (!p)
                    return this.error(player, "player");
                const itemId = Number(args[1]);
                let itemName = args[1].toUpperCase();
                let item = Number(ItemType_1.ItemType[itemName]);
                if (Number.isInteger(itemId) && itemId > 0 && itemId < 236) {
                    itemName = ItemType_1.ItemType[itemId];
                    item = itemId;
                }
                if (isNaN(item)) {
                    const similarItem = this.findSimilarItem(itemName);
                    return similarItem ? this.error(player, "similaritem", similarItem) : this.error(player, "item");
                }
                const count = Math.clamp(c, 0, 65535);
                p.client.sendBinary(p.inventory.giveItem(item, count));
                this.response(player, `${count} ${itemName.toLowerCase()} added to ${p.data.nickname}#${p.id} inventory`, true, "Success");
                break;
            }
            case "fsb":
            case "force-spawn-building": {
                if (!this.hasPermission(player, [Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                if (args.length !== 3)
                    return this.error(player, "args");
                const type = EntityType_1.EntityType[args[0].toUpperCase()];
                const x = Number(args[1]) * 100 + 50;
                const y = Number(args[2]) * 100 + 50;
                if (isNaN(x) || isNaN(y))
                    return this.error(player, "number");
                if (!type || x > this.server.map.width || y > this.server.map.height)
                    return this.error(player, "args");
                const building = new Building_1.Building(type, player, this.server);
                building.position.set(new Vector_1.Vector(x, y));
                building.onPlaced();
                this.server.entities.push(building);
                break;
            }
            case "give-score":
            case "gs": {
                if (!this.hasPermission(player, [Permissions_1.Permissions.CO_OWNER, Permissions_1.Permissions.OWNER]) && !isServer)
                    return this.error(player, "permission");
                const score = Number(args[0]);
                if (isNaN(score))
                    this.error(player, "number");
                player.score += score;
                break;
            }
            case "suicide": return player.healthSystem.damage(200, ActionType_1.ActionType.HURT, player);
        }
    }
    error(player, type, other = "") {
        switch (type) {
            case "id": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "Invalid id!"]);
            case "type": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "Entity with this name is not found!"]);
            case "entity": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "Entity on map is not found!"]);
            case "biome": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "Biome with this name is not found!"]);
            case "player": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "Player with this id not found!"]);
            case "item": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "Item is not found!"]);
            case "similaritem": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "Item is not found!", 0, `Did you mean ${other}?`]);
            case "password": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "Wrong password!"]);
            case "permission": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "You don't have permission!"]);
            case "args": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "Please, provide more arguments!"]);
            case "number": return player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, "", 0, "Arguments needs to be a numbers!"]);
        }
    }
    response(player, status, type, name = "", description = "") {
        player.client.sendJSON([ClientStringPackets_1.ClientStringPackets.COMMAND, name, type, status, description]);
    }
    give(id, itemId, count) {
        const player = this.server.findPlayerById(id);
        if (player) {
            player.client.sendBinary(player.inventory.giveItem(itemId, count));
        }
    }
}
exports.CommandSystem = CommandSystem;
class Command {
    ids;
    permission;
    callback;
    constructor(ids, permission, callback) {
        this.ids = ids;
        this.permission = permission;
        this.callback = callback;
    }
}
exports.Command = Command;
