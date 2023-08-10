"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crate = void 0;
var Crate;
(function (Crate) {
    Crate[Crate["WOODEN_DEAD_BOX"] = 0] = "WOODEN_DEAD_BOX";
    Crate[Crate["HIDDEN_ITEM"] = 1] = "HIDDEN_ITEM";
    Crate[Crate["WOODEN_BOX_1"] = 2] = "WOODEN_BOX_1";
    Crate[Crate["WOODEN_BOX_2"] = 3] = "WOODEN_BOX_2";
    Crate[Crate["WOODEN_BOX_3"] = 4] = "WOODEN_BOX_3";
    Crate[Crate["BROKEN_WOODEN_BOX"] = 5] = "BROKEN_WOODEN_BOX";
    Crate[Crate["WOODEN_BOX"] = 6] = "WOODEN_BOX";
    Crate[Crate["WOODEN_BATTLE_BOX"] = 7] = "WOODEN_BATTLE_BOX";
    Crate[Crate["WOODEN_BOX_WITH_A_CROSS"] = 8] = "WOODEN_BOX_WITH_A_CROSS";
    Crate[Crate["WOODEN_BOX_WITH_BUBBLES"] = 9] = "WOODEN_BOX_WITH_BUBBLES";
    Crate[Crate["WOODEN_BOX_WITH_EYES"] = 10] = "WOODEN_BOX_WITH_EYES";
    Crate[Crate["DARK_WOODEN_BOX"] = 11] = "DARK_WOODEN_BOX";
    Crate[Crate["NOOB_BOX"] = 12] = "NOOB_BOX";
    Crate[Crate["WOODEN_AND_STONE_BOX"] = 13] = "WOODEN_AND_STONE_BOX";
    Crate[Crate["STAR_BOX_1"] = 14] = "STAR_BOX_1";
    Crate[Crate["STAR_BOX_2"] = 15] = "STAR_BOX_2";
    Crate[Crate["FLOWER_BOX"] = 16] = "FLOWER_BOX";
    Crate[Crate["BLUE_BOX"] = 17] = "BLUE_BOX";
    Crate[Crate["BEEHIVE"] = 18] = "BEEHIVE";
    Crate[Crate["WOODEN_AND_GOLDEN_BOX"] = 19] = "WOODEN_AND_GOLDEN_BOX";
    Crate[Crate["GRAVESTONE"] = 20] = "GRAVESTONE";
    Crate[Crate["SKY_BOX"] = 21] = "SKY_BOX";
    Crate[Crate["GOLDEN_BOX"] = 22] = "GOLDEN_BOX";
    Crate[Crate["WATER_CRATE"] = 23] = "WATER_CRATE";
    Crate[Crate["GLASS_CRATE"] = 24] = "GLASS_CRATE";
    Crate[Crate["WOODEN_AND_DIAMOND_BOX"] = 25] = "WOODEN_AND_DIAMOND_BOX";
    Crate[Crate["DONT_HIT_ME"] = 26] = "DONT_HIT_ME";
    Crate[Crate["UNDERWATER_BOX"] = 27] = "UNDERWATER_BOX";
    Crate[Crate["ITEMS_PILE"] = 28] = "ITEMS_PILE";
    Crate[Crate["CAKE_BOX"] = 29] = "CAKE_BOX";
    Crate[Crate["CHRISTMAS_CAKE_BOX"] = 30] = "CHRISTMAS_CAKE_BOX";
    Crate[Crate["CRAB_BOX"] = 31] = "CRAB_BOX";
    Crate[Crate["FISHING_BOX"] = 32] = "FISHING_BOX";
    Crate[Crate["LET_ME_OUT_OF_HERE"] = 33] = "LET_ME_OUT_OF_HERE";
    Crate[Crate["WOODEN_AND_AMETHYST_BOX"] = 34] = "WOODEN_AND_AMETHYST_BOX";
    Crate[Crate["AQUARIUM"] = 35] = "AQUARIUM";
    Crate[Crate["GIFT_BOX"] = 36] = "GIFT_BOX";
    Crate[Crate["OPEN_WATERMELON_BOX"] = 37] = "OPEN_WATERMELON_BOX";
    Crate[Crate["WATERMELON_BOX"] = 38] = "WATERMELON_BOX";
    Crate[Crate["THORNBUSH_BOX"] = 39] = "THORNBUSH_BOX";
    Crate[Crate["RABBIT_IN_THE_BOX"] = 40] = "RABBIT_IN_THE_BOX";
    Crate[Crate["GARLIC_PLOT"] = 41] = "GARLIC_PLOT";
    Crate[Crate["PUMPKIN_PLOT"] = 42] = "PUMPKIN_PLOT";
    Crate[Crate["AUTUMN_BOX"] = 43] = "AUTUMN_BOX";
    Crate[Crate["WINTER_BOX"] = 44] = "WINTER_BOX";
    Crate[Crate["METAL_AND_REIDITE_BOX"] = 45] = "METAL_AND_REIDITE_BOX";
    Crate[Crate["KRAKEN_BOX"] = 46] = "KRAKEN_BOX";
    Crate[Crate["LAVA_BOX"] = 47] = "LAVA_BOX";
    Crate[Crate["LAVA_BOX_2"] = 48] = "LAVA_BOX_2";
    Crate[Crate["BOX_OF_THE_RABBIT"] = 49] = "BOX_OF_THE_RABBIT";
    Crate[Crate["BOX_OF_THE_WOLF"] = 50] = "BOX_OF_THE_WOLF";
    Crate[Crate["BOX_OF_THE_SPIDER"] = 51] = "BOX_OF_THE_SPIDER";
    Crate[Crate["BOX_OF_THE_HAWK"] = 52] = "BOX_OF_THE_HAWK";
    Crate[Crate["BOX_OF_THE_BEAR"] = 53] = "BOX_OF_THE_BEAR";
    Crate[Crate["BOX_OF_THE_FOX"] = 54] = "BOX_OF_THE_FOX";
    Crate[Crate["BOX_OF_THE_BABY_MAMMOTH"] = 55] = "BOX_OF_THE_BABY_MAMMOTH";
    Crate[Crate["BOX_OF_THE_MAMMOTH"] = 56] = "BOX_OF_THE_MAMMOTH";
    Crate[Crate["BOX_OF_THE_SANDWORM"] = 57] = "BOX_OF_THE_SANDWORM";
    Crate[Crate["BOX_OF_THE_VULTURE"] = 58] = "BOX_OF_THE_VULTURE";
    Crate[Crate["BOX_OF_THE_KRAKEN"] = 59] = "BOX_OF_THE_KRAKEN";
    Crate[Crate["BOX_OF_THE_PIRANHA"] = 60] = "BOX_OF_THE_PIRANHA";
    Crate[Crate["BOX_OF_THE_BABY_DRAGON"] = 61] = "BOX_OF_THE_BABY_DRAGON";
    Crate[Crate["BOX_OF_THE_BABY_LAVA"] = 62] = "BOX_OF_THE_BABY_LAVA";
    Crate[Crate["BOX_OF_THE_DRAGON"] = 63] = "BOX_OF_THE_DRAGON";
    Crate[Crate["BOX_OF_THE_PENGUIN"] = 64] = "BOX_OF_THE_PENGUIN";
    Crate[Crate["BOX_OF_THE_LAVA_DRAGON"] = 65] = "BOX_OF_THE_LAVA_DRAGON";
    Crate[Crate["BOX_OF_THE_BOAR"] = 66] = "BOX_OF_THE_BOAR";
    Crate[Crate["BOX_OF_THE_FIRE_MOB"] = 67] = "BOX_OF_THE_FIRE_MOB";
    Crate[Crate["BOX_OF_THE_CRAB"] = 68] = "BOX_OF_THE_CRAB";
    Crate[Crate["BOX_OF_THE_KING_CRAB"] = 69] = "BOX_OF_THE_KING_CRAB";
    Crate[Crate["CRYSTAL_SKY_BOX"] = 70] = "CRYSTAL_SKY_BOX";
    Crate[Crate["DRAGON_BOX"] = 71] = "DRAGON_BOX";
})(Crate || (exports.Crate = Crate = {}));