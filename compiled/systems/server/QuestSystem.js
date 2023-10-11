"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestSystem = void 0;
const QuestType_1 = require("../../enums/QuestType");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
class QuestSystem {
    gainQuest(player, type) {
        console.log(player.quests[type]);
        if (!Number.isInteger(type) || player.quests[type] !== QuestType_1.QuestState.SUCCEED)
            return;
        if (player.inventory.items.size === player.inventory.size)
            return player.client.sendU8([ClientPackets_1.ClientPackets.INV_FULL]);
        if (QuestType_1.QuestReward[type] === -1)
            player.inventory.size += 1;
        else
            player.client.sendBinary(player.inventory.giveItem(QuestType_1.QuestReward[type], 1));
        player.quests[type] = QuestType_1.QuestState.CLAIMED;
        player.score += QuestType_1.QuestScore[type];
        player.client.sendU8([ClientPackets_1.ClientPackets.CLAIMED, type]);
    }
}
exports.QuestSystem = QuestSystem;
