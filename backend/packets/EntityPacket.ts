import {Player} from "../entities/Player";
import {Server} from "../Server";
import {BinaryWriter} from "../modules/BinaryWriter";
import {Vector} from "../modules/Vector";
import {ActionType} from "../enums/ActionType";

export class EntityPacket {
    private readonly player: Player;
    private readonly server: Server;

    constructor(player: Player, hard_refresh: boolean) {
        this.player = player;
        this.server = player.client.server;

        this.send(hard_refresh);
    }

    public send(hard_refresh: boolean) {
        const {position, camera, client} = this.player;
        const {entities} = this.server;
        const writer = new BinaryWriter();

        writer.writeUInt16(Number(hard_refresh));
        for (const entity of entities) {
            const {position: entityPosition, id, angle, action, type, info, speed, extra} = entity;
            const isInsideCamera = position.isVectorInsideRectangle(entityPosition.subtract(new Vector(-camera.width / 2, -camera.height / 2)), camera.width, camera.height);
            const isInsideCameraExtended = position.isVectorInsideRectangle(entityPosition.subtract(new Vector(-camera.width / 2 - 50, -camera.height / 2 - 50)), camera.width + 100, camera.height + 100);

            if (!this.player.entities[entity.id] || entity.queryUpdate() || (isInsideCameraExtended && !isInsideCamera)) {
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
                    this.player.entities[entity.id] = 1;
                } else if (isInsideCameraExtended) {
                    writer.writeUInt8(id);
                    writer.writeUInt8(angle);
                    writer.writeUInt16(ActionType.DELETE);
                    writer.writeUInt16(type);
                    writer.writeUInt16(entityPosition.x);
                    writer.writeUInt16(entityPosition.y);
                    writer.writeUInt16(0);
                    writer.writeUInt16(info);
                    writer.writeUInt16(speed);
                    writer.writeUInt16(extra);
                    this.player.entities[entity.id] = 0;
                }
            }
        }

        const buffer = writer.toBuffer();
        if (buffer.length > 5) {
            client.sendBinary(buffer);
        }
    }
}
