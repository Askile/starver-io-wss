"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const InventoryType_1 = require("../../enums/InventoryType");
const defaultValues_1 = require("../../default/defaultValues");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
class Inventory {
    items;
    size;
    player;
    constructor(player, size) {
        this.items = new Map();
        this.player = player;
        this.size = size;
    }
    giveItem(id, count) {
        if (this.items.has(id)) {
            const itemQty = this.items.get(id);
            this.items.set(id, itemQty + count);
        }
        else if (this.items.size + 1 <= this.size) {
            if (id === InventoryType_1.InventoryType.BAG) {
                this.size = 16;
                this.items.set(id, count);
                return new Uint8Array([ClientPackets_1.ClientPackets.GET_BAG]);
            }
            else
                this.items.set(id, count);
        }
        else {
            const writer = new BinaryWriter_1.BinaryWriter();
            writer.writeUInt8(ClientPackets_1.ClientPackets.INV_FULL);
            return writer.toBuffer();
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
            const writer = new BinaryWriter_1.BinaryWriter();
            writer.writeUInt8(ClientPackets_1.ClientPackets.DELETE_INV_OK);
            writer.writeUInt8(id);
            return writer.toBuffer();
        }
    }
    unEquipItem(id) {
        if (this.player.helmet.id == id) {
            this.player.helmet = (0, defaultValues_1.getDefaultHelmet)();
        }
        if (this.player.pet.id == id) {
            this.player.pet = (0, defaultValues_1.getDefaultPet)();
        }
        if (this.player.right.id == id) {
            this.player.right = (0, defaultValues_1.getDefaultItem)();
        }
    }
    unEquipInventory() {
        this.player.helmet = (0, defaultValues_1.getDefaultHelmet)();
        this.player.pet = (0, defaultValues_1.getDefaultPet)();
        this.player.right = (0, defaultValues_1.getDefaultItem)();
    }
    cleanInventory() {
        this.items = new Map();
        this.unEquipInventory();
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt8(ClientPackets_1.ClientPackets.CLEAN_INVENTORY);
        return writer.toBuffer();
    }
}
exports.Inventory = Inventory;
