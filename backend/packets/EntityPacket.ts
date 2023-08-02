import {Player} from "../entities/Player";
import {Server} from "../Server";
import {BinaryWriter} from "../modules/BinaryWriter";
import {Vector} from "../modules/Vector";
import {ActionType} from "../enums/ActionType";
import {Entity} from "../entities/Entity";

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
            this.writeEntityData(writer, entity, position, camera);
        }

        const buffer = writer.toBuffer();
        if (buffer.length > 5) {
            client.sendBinary(buffer);
        }
    }

    // Метод для записи данных сущности в бинарный поток
    private writeEntityData(writer: BinaryWriter, entity: Entity, playerPosition: Vector, camera: Camera) {
        const {position , id, angle, action, type, info, speed, extra} = entity;
        const isInsideCamera = playerPosition.isVectorInsideRectangle(
            position.subtract(new Vector(-camera.width / 2, -camera.height / 2)),
            camera.width,
            camera.height
        );
        const isInsideCameraExtended = playerPosition.isVectorInsideRectangle(
            position.subtract(new Vector(-camera.width / 2 - 50, -camera.height / 2 - 50)),
            camera.width + 100,
            camera.height + 100
        );

        if (!this.player.entities[id] || 1 || (isInsideCameraExtended && !isInsideCamera)) {
            writer.writeUInt8(id);
            writer.writeUInt8(angle);
            writer.writeUInt16(isInsideCamera ? action : ActionType.DELETE);
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
