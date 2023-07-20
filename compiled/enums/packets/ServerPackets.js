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
})(ServerPackets || (exports.ServerPackets = ServerPackets = {}));
