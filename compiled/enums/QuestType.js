"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestState = exports.QuestScore = exports.QuestReward = exports.QuestType = void 0;
const ItemType_1 = require("./types/ItemType");
var QuestType;
(function (QuestType) {
    QuestType[QuestType["DRAGON_ORB"] = 0] = "DRAGON_ORB";
    QuestType[QuestType["DRAGON_CUBE"] = 1] = "DRAGON_CUBE";
    QuestType[QuestType["GREEN_GEM"] = 2] = "GREEN_GEM";
    QuestType[QuestType["ORANGE_GEM"] = 3] = "ORANGE_GEM";
    QuestType[QuestType["BLUE_GEM"] = 4] = "BLUE_GEM";
    QuestType[QuestType["WINTER_PEASANT_FUR"] = 5] = "WINTER_PEASANT_FUR";
    QuestType[QuestType["WINTER_HOOD_FUR"] = 6] = "WINTER_HOOD_FUR";
    QuestType[QuestType["LAVA_ORB"] = 7] = "LAVA_ORB";
    QuestType[QuestType["LAVA_CUBE"] = 8] = "LAVA_CUBE";
    QuestType[QuestType["GOLDEN_PITCHFORK"] = 9] = "GOLDEN_PITCHFORK";
    QuestType[QuestType["PILOT_HAT"] = 10] = "PILOT_HAT";
    QuestType[QuestType["SLOT_1"] = 11] = "SLOT_1";
    QuestType[QuestType["SLOT_2"] = 12] = "SLOT_2";
})(QuestType || (exports.QuestType = QuestType = {}));
exports.QuestReward = [];
exports.QuestReward[QuestType.DRAGON_ORB] = ItemType_1.ItemType.DRAGON_ORB;
exports.QuestReward[QuestType.DRAGON_CUBE] = ItemType_1.ItemType.DRAGON_CUBE;
exports.QuestReward[QuestType.GREEN_GEM] = ItemType_1.ItemType.GEM_GREEN;
exports.QuestReward[QuestType.ORANGE_GEM] = ItemType_1.ItemType.GEM_ORANGE;
exports.QuestReward[QuestType.BLUE_GEM] = ItemType_1.ItemType.GEM_BLUE;
exports.QuestReward[QuestType.WINTER_HOOD_FUR] = ItemType_1.ItemType.WINTER_HOOD_FUR;
exports.QuestReward[QuestType.WINTER_PEASANT_FUR] = ItemType_1.ItemType.WINTER_HOOD_FUR;
exports.QuestReward[QuestType.LAVA_ORB] = ItemType_1.ItemType.LAVA_ORB;
exports.QuestReward[QuestType.LAVA_CUBE] = ItemType_1.ItemType.LAVA_CUBE;
exports.QuestReward[QuestType.GOLDEN_PITCHFORK] = ItemType_1.ItemType.PITCHFORK_PART;
exports.QuestReward[QuestType.PILOT_HAT] = ItemType_1.ItemType.PILOT_GLASSES;
exports.QuestReward[QuestType.SLOT_1] = -1;
exports.QuestReward[QuestType.SLOT_2] = -1;
exports.QuestScore = [];
exports.QuestScore[QuestType.DRAGON_ORB] = 7500;
exports.QuestScore[QuestType.DRAGON_CUBE] = 7500;
exports.QuestScore[QuestType.GREEN_GEM] = 7500;
exports.QuestScore[QuestType.ORANGE_GEM] = 3000;
exports.QuestScore[QuestType.BLUE_GEM] = 7500;
exports.QuestScore[QuestType.WINTER_HOOD_FUR] = 5000;
exports.QuestScore[QuestType.WINTER_PEASANT_FUR] = 7500;
exports.QuestScore[QuestType.LAVA_ORB] = 10000;
exports.QuestScore[QuestType.LAVA_CUBE] = 7500;
exports.QuestScore[QuestType.GOLDEN_PITCHFORK] = 7500;
exports.QuestScore[QuestType.PILOT_HAT] = 5000;
exports.QuestScore[QuestType.SLOT_1] = 10000;
exports.QuestScore[QuestType.SLOT_2] = 10000;
var QuestState;
(function (QuestState) {
    QuestState[QuestState["FAILED"] = 0] = "FAILED";
    QuestState[QuestState["PROCCESS"] = 1] = "PROCCESS";
    QuestState[QuestState["SUCCEED"] = 2] = "SUCCEED";
    QuestState[QuestState["CLAIMED"] = 3] = "CLAIMED";
})(QuestState || (exports.QuestState = QuestState = {}));
