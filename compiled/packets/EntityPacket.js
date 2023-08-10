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
    writeEntityData(writer, entity, playerPosition, camera) {
        let { position, id, angle, action, type, info, speed, extra } = entity;
        const isInsideCamera = playerPosition.isVectorInsideRectangle(position.subtract(new Vector_1.Vector(-camera.width / 2, -camera.height / 2)), camera.width, camera.height);
        const isInsideCameraExtended = playerPosition.isVectorInsideRectangle(position.subtract(new Vector_1.Vector(-camera.width / 2 - 50, -camera.height / 2 - 50)), camera.width + 100, camera.height + 100);
        const ENTITY = this.player.entities[id];
        if (isInsideCameraExtended && (!ENTITY || (ENTITY &&
            ENTITY.position.x !== entity.position.x ||
            ENTITY.position.y !== entity.position.y ||
            ENTITY.info !== entity.info ||
            ENTITY.action !== entity.action ||
            ENTITY.angle !== entity.angle ||
            ENTITY.extra !== entity.extra))) {
            writer.writeUInt8(type ? 0 : id);
            writer.writeUInt8(angle);
            writer.writeUInt16((isInsideCameraExtended && !isInsideCamera) ? ActionType_1.ActionType.DELETE : action);
            writer.writeUInt16(type);
            writer.writeUInt16(position.x);
            writer.writeUInt16(position.y);
            writer.writeUInt16(!type ? 0 : id);
            writer.writeUInt16(info);
            writer.writeUInt16(speed * 1000);
            writer.writeUInt16(extra);
            this.player.entities[id] = {};
            this.player.entities[id].position = Object.assign({}, entity.position);
            this.player.entities[id].angle = entity.angle;
            this.player.entities[id].extra = entity.extra;
            this.player.entities[id].action = entity.action;
            this.player.entities[id].info = entity.info;
        }
        if ((isInsideCameraExtended && !isInsideCamera)) {
            this.player.entities[id] = false;
        }
    }
}
exports.EntityPacket = EntityPacket;
