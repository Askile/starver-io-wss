"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityUpdate = void 0;
const BinaryWriter_1 = require("../modules/BinaryWriter");
const Vector_1 = require("../modules/Vector");
class EntityUpdate {
    player;
    server;
    constructor(player, server) {
        this.player = player;
        this.server = server;
    }
    sendUpdate(hard_refresh) {
        const entities = this.server.entities.filter(entity => {
            return this.player.position.isVectorInsideRectangle(entity.position.subtract(new Vector_1.Vector(-this.player.camera.width / 2, -this.player.camera.height / 2)), this.player.camera.width, this.player.camera.height);
        });
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt16(Number(hard_refresh));
        for (const entity of this.server.entities) {
            if (entity.queryUpdate()) {
                writer.writeUInt8(entity.id);
                writer.writeUInt8(entity.angle);
                writer.writeUInt16(entity.action);
                writer.writeUInt16(entity.type);
                writer.writeUInt16(entity.position.x);
                writer.writeUInt16(entity.position.y);
                writer.writeUInt16(0);
                writer.writeUInt16(entity.info);
                writer.writeUInt16(entity.speed);
                writer.writeUInt16(entity.extra);
            }
        }
        writer.toBuffer().length > 5 && this.player.client.sendBinary(writer.toBuffer());
    }
    ;
}
exports.EntityUpdate = EntityUpdate;
