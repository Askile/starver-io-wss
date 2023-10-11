"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
var State;
(function (State) {
    State[State["isWater"] = 0] = "isWater";
    State[State["isRiver"] = 1] = "isRiver";
    State[State["isLake"] = 2] = "isLake";
    State[State["isForest"] = 3] = "isForest";
    State[State["isWinter"] = 4] = "isWinter";
    State[State["isLavaBiome"] = 5] = "isLavaBiome";
    State[State["isDesert"] = 6] = "isDesert";
    State[State["isBeach"] = 7] = "isBeach";
    State[State["isIsland"] = 8] = "isIsland";
    State[State["isCave"] = 9] = "isCave";
    State[State["isBridge"] = 10] = "isBridge";
    State[State["isRoof"] = 11] = "isRoof";
    State[State["isTower"] = 12] = "isTower";
    State[State["isBed"] = 13] = "isBed";
    State[State["isLava"] = 14] = "isLava";
    State[State["onFire"] = 15] = "onFire";
})(State || (exports.State = State = {}));