import {getDefaultCamera} from "../default/defaultValues";
import {Client} from "../network/Client";
import {ClientStringPackets} from "../enums/packets/ClientStringPackets";
import {Player} from "../entities/Player";
import {Server} from "../Server";
import {ClientPackets} from "../enums/packets/ClientPackets";
import {Utils} from "../modules/Utils";
import {ItemType} from "../enums/types/ItemType";
import {GameMode} from "../enums/GameMode";

const MAX_VALUES = {
    SKIN: 175,
    ACCESSORY: 95,
    CRATE: 72,
    BAG: 70,
    BOOK: 45
};

export class Handshake {
    private readonly request: any;
    private readonly client: Client;
    private readonly config: Config;

    private nickname: string;
    private camera: Camera = getDefaultCamera();
    private version: number;
    public token: string | number;
    public token_id: string | number;
    private reconnect: 0 | 1;
    private readonly skin: number;
    private readonly accessory: number;
    private readonly bag: number;
    private readonly server: Server;
    private readonly book: number;
    private readonly crate: number;
    private readonly dead: number;
    private readonly login: string | 0;
    private readonly password: string | 0;
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
        this.token_id = request[5];
        this.reconnect = request[6];
        this.skin = request[7];
        this.accessory = request[8];
        this.bag = request[9];
        this.book = request[10];
        this.crate = request[11];
        this.dead = request[12];
        this.login = request[13];
        this.password = request[14];
    }

    public testValid(): boolean {
        const typesToCheck = [
            {type: "string", indices: [0, 4, 5]},
            {type: "number", indices: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12]}
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

    public async getAccount(login: string, password: string) {
        const response = await fetch(this.server.url + "login", {
            body: JSON.stringify({login, password}),
            headers: {
                "Content-type": "application/json"
            },
            method: "POST"
        });

        try {
            return await response.json();
        } catch {}

        return false;
    }

    public setupPlayer(player: Player) {
        if (!this.testValid()) return;

        player.id = this.server.playerPool.createId();
        player.data.nickname = this.nickname.slice(0, 16) || `unnamed#${Math.floor(Math.random() * 1000)}`;
        player.data.token = this.token as string;
        player.data.token_id = this.token_id as string;
        player.camera.width = Math.max(getDefaultCamera().width, Math.max(3840, this.camera.width));
        player.camera.height = Math.max(getDefaultCamera().height, Math.max(2160, this.camera.height));
        player.cosmetics.skin = Math.max(0, Math.min(MAX_VALUES.SKIN, this.skin));
        player.cosmetics.accessory = Math.max(0, Math.min(MAX_VALUES.ACCESSORY, this.accessory));
        player.cosmetics.bag = Math.max(0, Math.min(MAX_VALUES.BAG, this.bag));
        player.cosmetics.book = Math.max(0, Math.min(MAX_VALUES.BOOK, this.book));
        player.cosmetics.crate = Math.max(0, Math.min(MAX_VALUES.CRATE, this.crate));
        player.cosmetics.dead = Math.max(0, Math.min(MAX_VALUES.CRATE, this.dead));

    }

    public restoreResponse(player: Player) {
        const players = this.server.players.map(({id, data, score, cosmetics}) => {
            return [id, data.nickname, data.level, score, cosmetics.skin, cosmetics.accessory, cosmetics.book, cosmetics.bag];
        });

        this.client.sendJSON([
            ClientStringPackets.HANDSHAKE,
            this.server.mode,
            player.time,
            player.position.x,
            players,
            this.server.timeSystem.time,
            0, // TODO: GHOST
            this.config.important.max_units,
            player.totem?.data ? player.totem.data : [], // TODO: TEAM
            player.id,
            player.position.y,
            100, // TODO: max players
            0,
            player.tokenScore.score, // TODO: Player score for kits
            player.inventory.serialize(),
            this.server.timeSystem.getGameTime(),
            Date.now() - player.createdAt, // TODO: Quests born
            player.quests, // TODO: Quests
            0,
            this.config.important.map_width,
            this.config.important.map_height,
            this.config.important.islands,
            this.config.important.custom_map.length ? this.config.important.custom_map : 0,
            "",
            this.server.craftSystem.newRecipes,
            0,  // TODO: Sandstorm
            0   // TODO: Blizzard
        ]);

        if(player.inventory.size > 12) {
            player.client.sendU8([ClientPackets.GET_BAG]);
        }

        if(this.config.disable_clock)
            this.client.sendU8([ClientPackets.HIDE_CLOCK]);
        if(this.config.disable_kit)
            this.client.sendU8([ClientPackets.HIDE_SHOP_KIT]);
        if(this.config.disable_quest)
            this.client.sendU8([ClientPackets.HIDE_QUEST]);
        if(this.config.disable_shop)
            this.client.sendU8([ClientPackets.HIDE_MARKET]);
    }

    public response(player: Player) {
        const players = this.server.players.map(({id, data, cosmetics, score}) => {
            return [id, data.nickname, data.level, score, cosmetics.skin, cosmetics.accessory, cosmetics.book, cosmetics.bag];
        });

        const token_id = this.token_id ? this.token_id : Utils.generateRandomString(12);
        const tokenData = this.server.tokenSystem.getToken(player.data.token_id);

        this.client.sendJSON([
            ClientStringPackets.HANDSHAKE,
            this.server.mode,
            player.time,
            player.position.x,
            players,
            this.server.timeSystem.time,
            0, // TODO: GHOST
            this.config.important.max_units,
            player.totem ? player.totem.data : [], // TODO: TEAM
            player.id,
            player.position.y,
            100, // TODO: max players
            token_id,
            tokenData ? tokenData.score : 0, // TODO: Player score for kits
            [],
            this.server.timeSystem.getGameTime(),
            0, // TODO: Quests born
            [], // TODO: Quests
            0,//this.server.mapGenerator.seed,
            this.config.important.map_width,
            this.config.important.map_height,
            this.config.important.islands,
            this.config.important.custom_map.length ? this.config.important.custom_map : 0,
            "#fff000 Welcome to Arena_Of_Clans \\n#FF005A Owner:Darius \\n#888fff Rules dont block spawn  \\n#888fff Dont block shop \\n#DC00FF Max 4 bots   \\n#B200FF Score Rewards:  \\n#115805 2M - Warm Protect2 - (17 def)  \\n#dd0000 3M - Pirate Sword - (40 dmg) \\n#F6FF33 5M - Warm Protect3 - (20 def) \\n#3FFF33 10M - Peasant - (24 def) \\n#33E9FF 15M - hood - (28 def) \\n#33ACFF 20M - Winter peasant - (32 def) \\n#937676 25M - Winter hood - (37 def) \\n#919CAA 30m - Wood Helmet - (45 def) \\n#4633FF 40M - Wood sword - (65 dmg), Wood_Spear ( 54 dmg) \\n#3AF30C 50M - Stone helmet -(50 def) \\n#0CF0F3 55M - Stone sword - (72 dmg), Stone spear - (61 dmg) \\n#F300FF 65M - Gold helmet - (60 def) \\n#F3F310 75M - Gold sword - (83 dmg), Gold spear - (70 dmg) \\n#FF3333 80M - Pilot Hat \\n#ff9900 90M - Wood Shield - (13 def) \\n#FF3333 100M - Baby Dragon \\n#00a510 120M - Pirate Hat - (65 def) \\n#00c7ff 85M - Dragon Bow - (80 dmg) \\n#ffd263 140M Gold Hammer - (70 dmg) \\n#00c7ff 150M - Angel Crown \\n#6458ff 175M Diamond Helmet - (67 def) \\n#6458ff 190M - Diamond Sword - (88 dmg), Diamond Spear - (76 dmg) \\n#ff7f00 250M - Crown Orange - (70 def), Crab Spear - (88dmg) \\n#fd2e2e CRAFT PAPER FOR SCORE (10k)",
            this.server.craftSystem.newRecipes,
            0,  // TODO: Sandstorm
            0   // TODO: Blizzard
        ]);

        if(player.inventory.size > 10) {
            player.client.sendU8([ClientPackets.GET_BAG]);
        }

        if(this.config.disable_clock)
            this.client.sendU8([ClientPackets.HIDE_CLOCK]);
        if(this.config.disable_kit)
            this.client.sendU8([ClientPackets.HIDE_SHOP_KIT]);
        if(this.config.disable_quest)
            this.client.sendU8([ClientPackets.HIDE_QUEST]);
        if(this.config.disable_shop)
            this.client.sendU8([ClientPackets.HIDE_MARKET]);
            this.server.kitSystem.gainKit(player);

    }

    public async broadcastCosmetics(player: Player) {
        if(this.login && this.password) {
            const account = await this.getAccount(this.login, this.password);

            if(account) {
                player.account = account;
                player.data.level = 1 + Math.floor(Math.sqrt(account.seasons[0].score / 20000));

                if(account.kit) {
                    player.client.sendBinary(player.inventory.giveItem(ItemType.BOOK, 1));
                    player.client.sendBinary(player.inventory.giveItem(ItemType.BAG, 1));
                }

                this.server.broadcast(Utils.serializeAccountToBuffer(player), true, player.client.socket);
            }
        } else {
            this.server.broadcast(Utils.serializeCosmeticsToJSON(player), false, player.client.socket);

        }

        player.updateInfo();
    }
}
