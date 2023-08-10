"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityPacket = void 0;
const BinaryWriter_1 = require("../modules/BinaryWriter");
const Vector_1 = require("../modules/Vector");
const ActionType_1 = require("../enums/ActionType");
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
            this.writeEntityData(writer, entity, position, camera);
        }
        const buffer = writer.toBuffer();
        if (buffer.length > 5) {
            client.sendBinary(buffer);
        }
    }
    // Метод для записи данных сущности в бинарный поток
    writeEntityData(writer, entity, playerPosition, camera) {
        const { position, id, angle, action, type, info, speed, extra } = entity;
        const isInsideCamera = playerPosition.isVectorInsideRectangle(position.subtract(new Vector_1.Vector(-camera.width / 2, -camera.height / 2)), camera.width, camera.height);
        const isInsideCameraExtended = playerPosition.isVectorInsideRectangle(position.subtract(new Vector_1.Vector(-camera.width / 2 - 50, -camera.height / 2 - 50)), camera.width + 100, camera.height + 100);
        if (!this.player.entities[id] || 1 || (isInsideCameraExtended && !isInsideCamera)) {
            writer.writeUInt8(id);
            writer.writeUInt8(angle);
            writer.writeUInt16(isInsideCamera ? action : ActionType_1.ActionType.DELETE);
            writer.writeUInt16(type);
            writer.writeUInt16(position.x);
            writer.writeUInt16(position.y);
            writer.writeUInt16(!type ? 0 : id);
            writer.writeUInt16(info);
            writer.writeUInt16(speed);
            writer.writeUInt16(extra);
            this.player.entities[id] = isInsideCamera ? 1 : 0;
        }
    }
}
exports.EntityPacket = EntityPacket;