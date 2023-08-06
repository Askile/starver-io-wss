"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const defaultValues_1 = require("../../default/defaultValues");
const Player_1 = require("../../entities/Player");
const InventoryType_1 = require("../../enums/InventoryType");
class Inventory {
    items;
    entity;
    size;
    constructor(entity, size) {
        this.entity = entity;
        this.items = new Map();
        this.size = size;
    }
    addInventory(inventory) {
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt16(ClientPackets_1.ClientPackets.GATHER);
        for (const item of inventory.items) {
            const buffer = this.giveItem(item[0], item[1])?.slice(2);
            console.log(...buffer);
            writer.writeUInt8(...buffer);
        }
        return writer.toBuffer();
    }
    giveItem(id, count) {
        if (this.items.has(id)) {
            const itemQty = this.items.get(id);
            this.items.set(id, itemQty + count);
        }
        else if (this.items.size + 1 <= this.size) {
            if (id === InventoryType_1.InventoryType.BAG) {
                this.size = 16;
                return new Uint8Array([ClientPackets_1.ClientPackets.GET_BAG]);
            }
            else
                this.items.set(id, count);
        }
        else {
            return new Uint8Array([ClientPackets_1.ClientPackets.INV_FULL]);
        }
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
            writer.writeUInt16(ClientPackets_1.ClientPackets.DELETE_SINGLE_INV);
            writer.writeUInt16(id);
            writer.writeUInt16(count);
            return writer.toBuffer();
        }
    }
    deleteItem(id) {
        if (this.items.has(id)) {
            this.items.delete(id);
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
        if (this.entity.helmet.id == id) {
            this.entity.helmet = (0, defaultValues_1.getDefaultHelmet)();
        }
        if (this.entity.pet.id == id) {
            this.entity.pet = (0, defaultValues_1.getDefaultPet)();
        }
        if (this.entity.right.id == id) {
            this.entity.right = (0, defaultValues_1.getDefaultItem)();
        }
        this.entity.updateInfo();
    }
    unEquipInventory() {
        if (!(this.entity instanceof Player_1.Player))
            return;
        this.entity.helmet = (0, defaultValues_1.getDefaultHelmet)();
        this.entity.pet = (0, defaultValues_1.getDefaultPet)();
        this.entity.right = (0, defaultValues_1.getDefaultItem)();
        this.entity.updateInfo();
    }
}
exports.Inventory = Inventory;
