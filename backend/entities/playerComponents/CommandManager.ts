import {Player} from "../Player";
import {Vector} from "../../modules/Vector";
import {entitySpeed} from "../EntitySpeed";

export class CommandManager {
    public player: Player;
    constructor(player: Player) {
        this.player = player;
    }

    private teleportTo(v: Vector) {
        this.player.position = v.multiply(100);

        this.player.position.x = Math.max(0, Math.min(this.player.client.server.map.width - 1, this.player.position.x));
        this.player.position.y = Math.max(
            0,
            Math.min(this.player.client.server.map.height - 1, this.player.position.y)
        );
    }

    public handleCommand(rawCommand: string) {
        const command = rawCommand.trim();
        const args = command.split(" ");
        const commandType = args.shift() as string;
        ["teleport", "tp"].includes(commandType) && this.teleportTo(new Vector(Number(args[0]), Number(args[1])));
        if (["teleport-all", "tpa"].includes(commandType)) {
            const v = new Vector(Number(args[0]), Number(args[1]));
            for (const player of this.player.server.players) player.commandManager.teleportTo(v);
        }
        ["g", "give"].includes(commandType) &&
            this.player.client.sendBinary(this.player.inventory.giveItem(Number(args[0]), Number(args[1])));
        ["s", "speed"].includes(commandType) && (entitySpeed[0] = Number(args[0]));
        ["ci", "clean-inventory"].includes(commandType) &&
            this.player.client.sendBinary(this.player.inventory.cleanInventory());
    }
}
