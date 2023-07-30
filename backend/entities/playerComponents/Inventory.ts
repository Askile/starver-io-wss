import {BinaryWriter} from "../../modules/BinaryWriter";
import {InventoryType} from "../../enums/InventoryType";
import {Player} from "../Player";
import {getDefaultHelmet, getDefaultItem, getDefaultPet} from "../../default/defaultValues";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {ServerPackets} from "../../enums/packets/ServerPackets";

export class Inventory {
    public items: Map<number, number>;
    public size: number;
    private player: Player;
    constructor(player: Player, size: number) {
        this.items = new Map();
        this.player = player;
        this.size = size;
    }

    public giveItem(id: number, count: number): Buffer | undefined {
        if (this.items.has(id)) {
            const itemQty = this.items.get(id) as number;
            this.items.set(id, itemQty + count);
        } else if (this.items.size + 1 <= this.size) {
            this.items.set(id, count);
        } else {
            const writer = new BinaryWriter();
            writer.writeUInt8(ClientPackets.INV_FULL);

            return writer.toBuffer();
        }

        const writer = new BinaryWriter();
        writer.writeUInt16(3);
        writer.writeUInt16(id);
        writer.writeUInt16(count);

        return writer.toBuffer();
    }

    public removeItem(id: number, count: number) {
        if (this.items.has(id)) {
            const itemQty = this.items.get(id) as number;
            const newQty = itemQty - count;
            if (newQty <= 0) {
                this.items.delete(id);
                this.unEquipItem(id);
            } else {
                this.items.set(id, newQty);
            }
            const writer = new BinaryWriter();
            writer.writeUInt16(ClientPackets.DELETE_SINGLE_INV);
            writer.writeUInt16(id);
            writer.writeUInt16(count);
            return writer.toBuffer();
        }
    }

    public deleteItem(id: number) {
        if (this.items.has(id)) {
            this.items.delete(id);

            this.unEquipItem(id);
            const writer = new BinaryWriter();
            writer.writeUInt8(ClientPackets.DELETE_INV_OK);
            writer.writeUInt8(id);
            return writer.toBuffer();
        }
    }

    private unEquipItem(id: number) {
        if (this.player.helmet.id == id) {
            this.player.helmet = getDefaultHelmet();
        }
        if (this.player.pet.id == id) {
            this.player.pet = getDefaultPet();
        }
        if (this.player.right.id == id) {
            this.player.right = getDefaultItem();
        }
    }

    private unEquipInventory() {
        this.player.helmet = getDefaultHelmet();
        this.player.pet = getDefaultPet();
        this.player.right = getDefaultItem();
    }

    public cleanInventory() {
        this.items = new Map();

        this.unEquipInventory();
        const writer = new BinaryWriter();
        writer.writeUInt8(ClientPackets.CLEAN_INVENTORY);
        return writer.toBuffer();
    }
}
