"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotemSystem = void 0;
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const EntityType_1 = require("../../enums/types/EntityType");
class TotemSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    joinTeam(player) {
        if (Date.now() - player.lastTotemLeave < 30000)
            return;
        const totem = this.server.map.getNearest(player, [EntityType_1.EntityType.TOTEM], 100);
        if (totem.realPosition.distance(player.realPosition) > 100)
            return;
        if (player.totem)
            return;
        if (totem.info)
            return;
        player.totem = totem;
        totem.data.push(player.id);
        this.broadcastMemberId(totem, player.id);
        player.client.sendU8([ClientPackets_1.ClientPackets.JOIN_NEW_TEAM, ...totem.data]);
    }
    leaveTeam(player) {
        if (!player.totem)
            return;
        this.broadcastExcludeMemberId(player.totem, player.id);
        player.totem.data = player.totem.data.filter((id) => id !== player.id);
        player.totem = null;
    }
    kickTeam(player, id) {
        if (!Number.isInteger(id) || !player.totem || player.id === id || player.totem.owner !== player)
            return;
        this.broadcastExcludeMemberId(player.totem, id);
        player.totem.data = player.totem.data.filter((i) => i !== id);
    }
    lockTeam(player) {
        if (!player.totem || player.totem.owner !== player)
            return;
        player.totem.info = Number(!player.totem.info);
    }
    broadcastMemberId(totem, id) {
        for (const i of totem.data) {
            if (i == id)
                continue;
            const p = this.server.findPlayerById(i);
            p.client.sendU8([ClientPackets_1.ClientPackets.NEW_MEMBER_TEAM, id]);
        }
    }
    broadcastDestroyTeam(totem) {
        for (const i of totem.data) {
            const p = this.server.findPlayerById(i);
            p.totem = null;
            p.lastTotemLeave = Date.now();
            p.client.sendU8([ClientPackets_1.ClientPackets.DESTROY_TEAM]);
        }
    }
    broadcastExcludeMemberId(totem, id) {
        for (const i of totem.data) {
            const p = this.server.findPlayerById(i);
            p.client.sendU8([ClientPackets_1.ClientPackets.EXCLUDE_TEAM, id]);
        }
    }
}
exports.TotemSystem = TotemSystem;
