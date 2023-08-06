"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPackets = void 0;
var ServerPackets;
(function (ServerPackets) {
    ServerPackets[ServerPackets["CHAT"] = 0] = "CHAT";
    ServerPackets[ServerPackets["CAMERA"] = 1] = "CAMERA";
    ServerPackets[ServerPackets["MOVEMENT"] = 2] = "MOVEMENT";
    ServerPackets[ServerPackets["ANGLE"] = 3] = "ANGLE";
    ServerPackets[ServerPackets["ATTACK"] = 4] = "ATTACK";
    ServerPackets[ServerPackets["INTERACTION"] = 5] = "INTERACTION";
    ServerPackets[ServerPackets["DROP_ONE_ITEM"] = 6] = "DROP_ONE_ITEM";
    ServerPackets[ServerPackets["CRAFT"] = 7] = "CRAFT";
    ServerPackets[ServerPackets["BUILD"] = 10] = "BUILD";
    ServerPackets[ServerPackets["STOP_ATTACK"] = 14] = "STOP_ATTACK";
    ServerPackets[ServerPackets["DROP_ITEM"] = 28] = "DROP_ITEM";
    ServerPackets[ServerPackets["MARKET"] = 32] = "MARKET";
    ServerPackets[ServerPackets["CONSOLE"] = 36] = "CONSOLE";
})(ServerPackets || (exports.ServerPackets = ServerPackets = {}));
