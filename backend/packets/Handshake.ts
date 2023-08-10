import {getDefaultCamera} from "../default/defaultValues";
import {Client} from "../network/Client";
import {ClientStringPackets} from "../enums/packets/ClientStringPackets";
import {Player} from "../entities/Player";
import {Server} from "../Server";
import {InventoryType} from "../enums/InventoryType";
import {ClientPackets} from "../enums/packets/ClientPackets";

const MAX_VALUES = {
    SKIN: 174,
    ACCESSORY: 94,
    CRATE: 71,
    BAG: 69,
    BOOK: 44
};

export class Handshake {
    private readonly request: any;
    private readonly client: Client;
    private readonly config: Config;

    private nickname: string;
    private camera: Camera = getDefaultCamera();
    private version: number;
    public token: string | number;
    private reconnect: 0 | 1;
    private readonly skin: number;
    private readonly accessory: number;
    private readonly bag: number;
    private readonly server: Server;
    private readonly book: number;
    private readonly crate: number;
    private readonly dead: number;
    private userId: string | 0;
    private userToken: string | 0;
    private password: string | 0;
    constructor(request: any, client: Client) {
        this.server = client.server;
        this.config = client.server.config;
        this.request = request;
        this.client = client;

        this.nickname = request[0];
        this.camera.width = request[1];
        this.camera.height = request[2];
        this.version = request[3];
        this.token = request[4];
        this.reconnect = request[5];
        this.skin = request[6];
        this.accessory = request[7];
        this.bag = request[8];
        this.book = request[9];
        this.crate = request[10];
        this.dead = request[11];
        this.userId = request[12];
        this.userToken = request[13];
        this.password = request[14];
    }

    public testValid(): boolean {
        const typesToCheck = [
            {type: "string", indices: [0, 4]},
            {type: "number", indices: [1, 2, 3, 5, 6, 7, 8, 9, 10, 11]}
        ];

        for (const {type, indices} of typesToCheck) {
            for (const index of indices) {
                const requestValue = this.request[index];
                const requestType = typeof requestValue;

                if (requestType !== type) return false;
            }
        }

        return true;
    }
    public setupPlayer(player: Player) {
        if (!this.testValid()) return;
        player.id = this.server.playerPool.createId();
        player.data.nickname = this.nickname.slice(0, 16) || "Player";
        player.data.token = this.token as string;
        player.camera.width = Math.max(getDefaultCamera().width, Math.min(3840, this.camera.width));
        player.camera.height = Math.max(getDefaultCamera().height, Math.min(2160, this.camera.height));
        player.cosmetics.skin = Math.max(0, Math.min(MAX_VALUES.SKIN, this.skin));
        player.cosmetics.accessory = Math.max(0, Math.min(MAX_VALUES.ACCESSORY, this.accessory));
        player.cosmetics.bag = Math.max(0, Math.min(MAX_VALUES.BAG, this.bag));
        player.cosmetics.book = Math.max(0, Math.min(MAX_VALUES.BOOK, this.book));
        player.cosmetics.crate = Math.max(0, Math.min(MAX_VALUES.CRATE, this.crate));
        player.cosmetics.dead = Math.max(0, Math.min(MAX_VALUES.CRATE, this.dead));
    }

    public response(player: Player, isRestore: boolean = false) {
        const players = this.server.players.map(({id, data, cosmetics, stats}) => {
            return [id, data.nickname, data.level, stats.score, cosmetics.skin, cosmetics.accessory, cosmetics.book, cosmetics.bag];
        });
        const inventory = new Array(255).fill(null);
        const items = Array.from(player.inventory.items.keys()) as any;
        const counts = Array.from(player.inventory.items.values()) as any;
        for (let i = 0; i < player.inventory.items.size; i++) {
            inventory[items[i]] = counts[i];
        }

        if(isRestore) {
            this.token = 0;
        }

        this.client.sendJSON([
            ClientStringPackets.HANDSHAKE,
            this.server.mode,
            player.stats.time,
            player.position.x,
            players,
            this.server.timeSystem.time,
            0, // TODO: GHOST
            this.config.important.max_units,
            [], // TODO: TEAM
            player.id,
            player.position.y,
            100, // TODO: max players
            this.token,
            0, // TODO: Player score for kits
            isRestore ? inventory: [],
            this.server.timeSystem.getGameTime(),
            0, // TODO: Quests born
            [], // TODO: Quests
            0,
            this.server.mapGenerator.seed,
            this.config.important.map_width,
            this.config.important.map_height,
            this.config.important.islands,
            //this.server.map.getCustomMap(),
            this.config.important.custom_map,
            "",
            this.server.config.important.recipes ? this.server.craftSystem.recipesToSend : 0,
            0,  // TODO: Sandstorm
            0   // TODO: Blizzard
        ]);

        if(1) {
            player.client.sendU8([ClientPackets.GET_BAG]);
        }

    }

    public broadcastCosmetics(player: Player) {
        this.server.broadcast(JSON.stringify([2, player.id, player.data.nickname, player.data.level, player.cosmetics.skin, player.cosmetics.accessory, player.cosmetics.bag, player.cosmetics.book]));
    }
}
