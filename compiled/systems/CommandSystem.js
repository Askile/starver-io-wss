"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandSystem = void 0;
class CommandSystem {
    constructor() {
    }
    handleCommand(rawCommand) {
        const command = rawCommand.trim();
        const args = command.split(" ");
        const commandType = args.shift();
    }
}
exports.CommandSystem = CommandSystem;
