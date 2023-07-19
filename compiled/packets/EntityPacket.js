"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityPacket = void 0;
const BinaryWriter_1 = require("../modules/BinaryWriter");
const Vector_1 = require("../modules/Vector");
class EntityPacket {
    player;
    server;
    constructor(player, hard_refresh) {
        this.player = player;
        this.server = player.client.server;
        this.send(hard_refresh);
    }
    send(hard_refresh) {
        const { position, camera, client } = this.player;
        const { entities } = this.server;
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt16(Number(hard_refresh));
        for (const entity of entities) {
            const { position: entityPosition, id, angle, action, type, info, speed, extra } = entity;
            const isInsideCamera = position.isVectorInsideRectangle(entityPosition.subtract(new Vector_1.Vector(-camera.width / 2, -camera.height / 2)), camera.width, camera.height);
            if (entity.queryUpdate()) {
                const isInsideCameraExtended = position.isVectorInsideRectangle(entityPosition.subtract(new Vector_1.Vector(-camera.width / 2 - 100, -camera.height / 2 - 100)), camera.width + 200, camera.height + 200);
                if (isInsideCamera) {
                    writer.writeUInt8(id);
                    writer.writeUInt8(angle);
                    writer.writeUInt16(action);
                    writer.writeUInt16(type);
                    writer.writeUInt16(entityPosition.x);
                    writer.writeUInt16(entityPosition.y);
                    writer.writeUInt16(0);
                    writer.writeUInt16(info);
                    writer.writeUInt16(speed);
                    writer.writeUInt16(extra);
                }
                else if (isInsideCameraExtended) {
                    writer.writeUInt8(id);
                    writer.writeUInt8(angle);
                    writer.writeUInt16(1);
                    writer.writeUInt16(type);
                    writer.writeUInt16(entityPosition.x);
                    writer.writeUInt16(entityPosition.y);
                    writer.writeUInt16(0);
                    writer.writeUInt16(info);
                    writer.writeUInt16(speed);
                    writer.writeUInt16(extra);
                }
            }
        }
        const buffer = writer.toBuffer();
        if (buffer.length > 5) {
            client.sendBinary(buffer);
        }
    }
}
exports.EntityPacket = EntityPacket;