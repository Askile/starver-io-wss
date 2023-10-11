"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultPlayerData = exports.getDefaultPlayerCosmetics = exports.getDefaultPlayerStats = exports.getDefaultCamera = void 0;
function getDefaultCamera() {
    return {
        width: 1920,
        height: 1080
    };
}
exports.getDefaultCamera = getDefaultCamera;
function getDefaultPlayerStats() {
    return {
        kills: 0,
        score: 0,
        time: 0
    };
}
exports.getDefaultPlayerStats = getDefaultPlayerStats;
function getDefaultPlayerCosmetics() {
    return {
        skin: 0,
        accessory: 0,
        book: 0,
        bag: 0,
        crate: 1,
        dead: 0
    };
}
exports.getDefaultPlayerCosmetics = getDefaultPlayerCosmetics;
function getDefaultPlayerData() {
    return {
        nickname: "unnamed",
        token: "",
        token_id: "",
        level: 0
    };
}
exports.getDefaultPlayerData = getDefaultPlayerData;
