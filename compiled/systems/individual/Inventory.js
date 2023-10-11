"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const Player_1 = require("../../entities/Player");
const ItemType_1 = require("../../enums/types/ItemType");
class Inventory {
    items;
    entity;
    size;
    constructor(entity, size) {
        this.entity = entity;
        this.items = new Map();
        this.size = size;
    }
    addInventory(inventory, bound = Infinity, double = false) {
        const writer = new BinaryWriter_1.BinaryWriter();
        let isFill = false;
        writer.writeUInt16(ClientPackets_1.ClientPackets.GATHER);
        for (const item of inventory.items) {
            const buffer = this.giveItem(item[0], Math.min(double ? item[1] * 2 : item[1], bound))?.slice(2);
            if (!buffer.length)
                isFill = true;
            writer.writeUInt8(...buffer);
        }
        if (isFill && this.entity instanceof Player_1.Player) {
            this.entity.client.sendU8([ClientPackets_1.ClientPackets.INV_FULL]);
        }
        return writer.toBuffer();
    }
    containsItem(itemID, count = 1) {
        const item = this.items.get(itemID);
        if (!item)
            return false;
        return item >= count;
    }
    giveItem(id, count) {
        if (id === ItemType_1.ItemType.BAG && this.entity instanceof Player_1.Player) {
            this.size = 16;
            this.entity.updateInfo();
            return new Uint8Array([ClientPackets_1.ClientPackets.GET_BAG]);
        }
        else if (this.items.has(id)) {
            const itemQty = this.items.get(id);
            this.items.set(id, itemQty + count);
        }
        else if (this.items.size + 1 <= this.size) {
            this.items.set(id, count);
        }
        else {
            return new Uint8Array([ClientPackets_1.ClientPackets.INV_FULL]);
        }
        this.entity.onReceiveItem(id, count);
        const writer = new BinaryWriter_1.BinaryWriter(3);
        writer.writeUInt16(ClientPackets_1.ClientPackets.GATHER);
        writer.writeUInt16(id);
        writer.writeUInt16(count);
        return writer.toBuffer();
    }
    removeItem(id, count) {
        if (this.items.has(id)) {
            const itemQty = this.items.get(id);
            const newQty = itemQty - count;
            if (newQty <= 0) {
                this.items.delete(id);
                this.unEquipItem(id);
            }
            else {
                this.items.set(id, newQty);
            }
            const writer = new BinaryWriter_1.BinaryWriter();
            if (count <= 255) {
                writer.writeUInt8(ClientPackets_1.ClientPackets.DECREASE_ITEM);
                writer.writeUInt8(id);
                writer.writeUInt8(count);
            }
            else {
                writer.writeUInt8(ClientPackets_1.ClientPackets.DECREASE_ITEM_2);
                writer.writeUInt8(id);
                writer.writeUInt8(count >> 8);
                writer.writeUInt8(count % 256);
            }
            return writer.toBuffer();
        }
    }
    itemCount(id) {
        return this.items.get(id) ?? 0;
    }
    deleteItem(id) {
        if (this.items.has(id)) {
            this.items.delete(id);
            if (this.entity instanceof Player_1.Player)
                this.unEquipItem(id);
            const writer = new BinaryWriter_1.BinaryWriter(2);
            writer.writeUInt8(ClientPackets_1.ClientPackets.DELETE_INV_OK);
            writer.writeUInt8(id);
            return writer.toBuffer();
        }
    }
    cleanInventory() {
        this.items = new Map();
        this.unEquipInventory();
        const writer = new BinaryWriter_1.BinaryWriter(1);
        writer.writeUInt8(ClientPackets_1.ClientPackets.CLEAN_INVENTORY);
        return writer.toBuffer();
    }
    unEquipItem(id) {
        if (!(this.entity instanceof Player_1.Player))
            return;
        if (this.entity.helmet.id === id) {
            this.entity.helmet = this.entity.server.interactionSystem.items[ItemType_1.ItemType.HAND];
        }
        if (this.entity.right.id === id) {
            this.entity.right = this.entity.server.interactionSystem.items[ItemType_1.ItemType.HAND];
        }
        if (this.entity.vehicle.id === id) {
            this.entity.vehicle = this.entity.server.interactionSystem.items[ItemType_1.ItemType.HAND];
        }
        this.entity.updateInfo();
    }
    unEquipInventory() {
        if (!(this.entity instanceof Player_1.Player))
            return;
        this.entity.helmet = this.entity.server.interactionSystem.items[ItemType_1.ItemType.HAND];
        this.entity.right = this.entity.server.interactionSystem.items[ItemType_1.ItemType.HAND];
        this.entity.vehicle = this.entity.server.interactionSystem.items[ItemType_1.ItemType.HAND];
        this.entity.updateInfo();
    }
    serialize() {
        let array = [];
        Array.from(this.items.entries()).forEach(([item, count]) => {
            array[item] = count;
        });
        return array;
    }
    toArray() {
        return Array.from(this.items);
    }
}
exports.Inventory = Inventory;
