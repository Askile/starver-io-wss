import {Entity} from "../../entities/Entity";
import {BinaryWriter} from "../../modules/BinaryWriter";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {getDefaultHelmet, getDefaultItem, getDefaultPet} from "../../default/defaultValues";
import {Player} from "../../entities/Player";
import {InventoryType} from "../../enums/InventoryType";

export class Inventory {
    public items: Map<number, number>;
    public entity: Entity;
    public size: number;
    constructor(entity: Entity, size: number) {
        this.entity = entity;
        this.items = new Map();
        this.size = size;
    }

    public addInventory(inventory: Inventory) {
        const writer = new BinaryWriter();

        writer.writeUInt16(ClientPackets.GATHER);

        for (const item of inventory.items) {
            const buffer = this.giveItem(item[0], item[1])?.slice(2) as Buffer;
            console.log(...buffer);
            writer.writeUInt8(...buffer);
        }

        return writer.toBuffer();
    }

    public giveItem(id: number, count: number): Uint8Array | Buffer | undefined {
        if (this.items.has(id)) {
            const itemQty = this.items.get(id) as number;
            this.items.set(id, itemQty + count);
        } else if (this.items.size + 1 <= this.size) {
            if(id === InventoryType.BAG) {
                this.size = 16;
                return new Uint8Array([ClientPackets.GET_BAG]);
            } else this.items.set(id, count);
        } else {
            return new Uint8Array([ClientPackets.INV_FULL]);
        }

        const writer = new BinaryWriter(3);
        writer.writeUInt16(ClientPackets.GATHER);
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

            const writer = new BinaryWriter(2);

            writer.writeUInt8(ClientPackets.DELETE_INV_OK);
            writer.writeUInt8(id);

            return writer.toBuffer();
        }
    }

    public cleanInventory() {
        this.items = new Map();

        this.unEquipInventory();

        const writer = new BinaryWriter(1);
        writer.writeUInt8(ClientPackets.CLEAN_INVENTORY);

        return writer.toBuffer();
    }

    private unEquipItem(id: number) {
        if(!(this.entity instanceof Player)) return;
        if (this.entity.helmet.id == id) {
            this.entity.helmet = getDefaultHelmet();
        }
        if (this.entity.pet.id == id) {
            this.entity.pet = getDefaultPet();
        }
        if (this.entity.right.id == id) {
            this.entity.right = getDefaultItem();
        }

        this.entity.updateInfo();
    }

    private unEquipInventory() {
        if(!(this.entity instanceof Player)) return;
        this.entity.helmet = getDefaultHelmet();
        this.entity.pet = getDefaultPet();
        this.entity.right = getDefaultItem();

        this.entity.updateInfo();
    }
}