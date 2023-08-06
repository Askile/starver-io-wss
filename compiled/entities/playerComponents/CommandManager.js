"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const Vector_1 = require("../../modules/Vector");
const EntitySpeed_1 = require("../components/EntitySpeed");
class CommandManager {
    player;
    constructor(player) {
        this.player = player;
    }
    teleportTo(v) {
        this.player.position = v.multiply(100);
        this.player.position.x = Math.max(0, Math.min(this.player.client.server.map.width - 1, this.player.position.x));
        this.player.position.y = Math.max(0, Math.min(this.player.client.server.map.height - 1, this.player.position.y));
    }
    handleCommand(rawCommand) {
        const command = rawCommand.trim();
        const args = command.split(" ");
        const commandType = args.shift();
        ["teleport", "tp"].includes(commandType) && this.teleportTo(new Vector_1.Vector(Number(args[0]), Number(args[1])));
        if (["teleport-all", "tpa"].includes(commandType)) {
            const v = new Vector_1.Vector(Number(args[0]), Number(args[1]));
            for (const player of this.player.server.players)
                player.commandManager.teleportTo(v);
        }
        ["g", "give"].includes(commandType) && this.player.client.sendBinary(this.player.inventory.giveItem(Number(args[0]), Number(args[1])));
        ["s", "speed"].includes(commandType) && (EntitySpeed_1.entitySpeed[0] = Number(args[0]));
        ["ci", "clean-inventory"].includes(commandType) && this.player.client.sendBinary(this.player.inventory.cleanInventory());
    }
}
exports.CommandManager = CommandManager;
