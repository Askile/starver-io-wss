"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Inventory = void 0;
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const defaultValues_1 = require("../../defaultValues");
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
        if (this.items.size + 1 <= this.size) {
            if (this.items.has(id)) {
                const itemQty = this.items.get(id);
                this.items.set(id, itemQty + count);
            }
            else
                this.items.set(id, count);
        }
        else {
            const writer = new BinaryWriter_1.BinaryWriter();
            writer.writeUInt8(10);
            return writer.toBuffer();
        }
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt16(3);
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
            writer.writeUInt16(62);
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
            writer.writeUInt8(52);
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
        writer.writeUInt8(59);
        return writer.toBuffer();
    }
}
exports.Inventory = Inventory;
