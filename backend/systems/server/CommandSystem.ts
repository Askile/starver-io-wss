export class CommandSystem {
    constructor() {

    }

    public handleCommand(rawCommand: string) {
        const command = rawCommand.trim();
        const args = command.split(" ");
        const commandType = args.shift() as string;
    }
}