"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultPlayerData = exports.getDefaultPlayerCosmetics = exports.getDefaultPet = exports.getDefaultItem = exports.getDefaultHelmet = exports.getDefaultPlayerStats = exports.getDefaultCamera = void 0;
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
function getDefaultHelmet() {
    return {
        type: "helmet",
        id: 0,
        defense: 0
    };
}
exports.getDefaultHelmet = getDefaultHelmet;
function getDefaultItem() {
    return {
        type: "hand",
        id: 7,
        damage: 5
    };
}
exports.getDefaultItem = getDefaultItem;
function getDefaultPet() {
    return {
        type: "pet",
        id: 0,
        speed: 0.23,
        tame_chance: 0.01
    };
}
exports.getDefaultPet = getDefaultPet;
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
        level: 0
    };
}
exports.getDefaultPlayerData = getDefaultPlayerData;
