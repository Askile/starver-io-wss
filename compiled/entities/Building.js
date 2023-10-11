"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Building = void 0;
const Entity_1 = require("./Entity");
const Player_1 = require("./Player");
const EntityType_1 = require("../enums/types/EntityType");
const ItemType_1 = require("../enums/types/ItemType");
const ActionType_1 = require("../enums/types/ActionType");
const DeathReason_1 = require("../enums/DeathReason");
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const BinaryWriter_1 = require("../modules/BinaryWriter");
const Animal_1 = require("./Animal");
class Building extends Entity_1.Entity {
    data;
    owner;
    timestamps;
    constructor(type, owner, server) {
        super(type, server);
        this.owner = owner;
        this.data = [];
        this.timestamps = new Array(5).fill(Date.now());
    }
    onPlaced() {
        this.realPosition.set(this.position);
        if (this.isSeed()) {
            this.info = 10;
            if (this.owner.helmet.id === ItemType_1.ItemType.PEASANT)
                this.data = 1;
            if (this.owner.helmet.id === ItemType_1.ItemType.WINTER_PEASANT)
                this.data = 2;
        }
        if (this.isVisualHealth())
            this.info = 100;
        if (this.isDoor())
            this.info = 200;
        this.id = this.server.entityPool.createId();
        this.type === EntityType_1.EntityType.TOTEM && (this.data = [this.owner.id], this.owner.totem = this);
        this.type === EntityType_1.EntityType.EMERALD_MACHINE && (this.owner.machine = this);
        [EntityType_1.EntityType.FURNACE, EntityType_1.EntityType.WELL].includes(this.type) && (this.data = [0]);
        if (this.type === EntityType_1.EntityType.CHEST) {
            this.data = [-1, 0];
        }
        if (EntityType_1.EntityType.WINDMILL === this.type || this.isExtractor()) {
            this.data = [0, 0];
        }
        if (EntityType_1.EntityType.BREAD_OVEN === this.type) {
            this.data = [0, 0, 0];
        }
        [EntityType_1.EntityType.TOTEM, EntityType_1.EntityType.CHEST].includes(this.type) && (this.pid = this.owner.id);
    }
    onTick() {
        let now = Date.now();
        if (this.isSeed()) {
            const isPeasant = this.data === 1;
            const isWinterPeasant = this.data === 2;
            const hasBorn = now - this.createdAt >= this.server.configSystem.seedBirth[this.type] * (this.plot ? isPeasant ? 0.6 : 0.8 : isPeasant ? 0.8 : 1) * (isWinterPeasant ? 0.6 : 1);
            const hasGrowth = now - this.timestamps[0] >= this.server.configSystem.seedGrowth[this.type] * (this.plot ? isPeasant ? 0.6 : 0.8 : isPeasant ? 0.8 : 1) * (isWinterPeasant ? 0.6 : 1);
            const hasDrain = now - this.timestamps[1] >= this.server.configSystem.seedDrain[this.type] * (this.plot ? isPeasant ? 1.4 : 1.2 : isPeasant ? 1.2 : 1) * (isWinterPeasant ? 1.4 : 1);
            const needDelete = now - this.createdAt >= this.server.configSystem.seedLife[this.type];
            if (hasDrain && this.info !== 10 && !(this.info & 16)) {
                this.timestamps[1] = now;
                this.info |= 16;
            }
            if (hasGrowth && this.info !== 10 && !(this.info & 16)) {
                this.timestamps[0] = now;
                this.info = Math.min(this.server.configSystem.seedFruitsCount[this.type], this.info + 1);
            }
            if (hasBorn && this.info === 10) {
                this.info = 0;
                this.timestamps[0] = now;
                this.timestamps[1] = now;
            }
            needDelete && this.delete();
        }
        else if (this.isDoor()) {
            this.info = ~~(this.healthSystem.health / this.healthSystem.maxHealth * 200);
            if ((!this.collide && !(this.info % 2)) || (this.collide && this.info % 2))
                this.info -= 1;
        }
        else if (this.isVisualHealth()) {
            this.info = ~~(this.healthSystem.health / this.healthSystem.maxHealth * 100);
        }
        ([EntityType_1.EntityType.FIRE, EntityType_1.EntityType.BIG_FIRE].includes(this.type) && now - this.createdAt > (this.type === EntityType_1.EntityType.BIG_FIRE ? 240000 : 120000)) && this.delete();
        if (this.type === EntityType_1.EntityType.TOTEM && now - this.timestamps[0] >= 3000) {
            this.timestamps[0] = now;
            const positions = new BinaryWriter_1.BinaryWriter();
            positions.writeUInt8(ClientPackets_1.ClientPackets.MINIMAP);
            for (const id of this.data) {
                const player = this.server.findPlayerById(id);
                if (player)
                    positions.writeUInt8(player.position.x / this.server.map.width * 250, player.position.y / this.server.map.height * 250);
            }
            for (const id of this.data) {
                const player = this.server.findPlayerById(id);
                if (player)
                    player.client.sendBinary(positions.toBuffer());
            }
        }
        if (this.type === EntityType_1.EntityType.EMERALD_MACHINE && now - this.timestamps[0] >= 1000) {
            this.timestamps[0] = now;
            this.owner.score += this.desert ? 50 : this.lavaBiome ? 40 : this.winter ? 30 : 20;
        }
        if (this.type === EntityType_1.EntityType.CHEST) {
            this.info = this.info & 0x2000 ? this.data[1] + 0x2000 : this.data[1];
            this.extra = this.data[0] ? this.data[0] + 1 : 0;
        }
        if (this.type == EntityType_1.EntityType.FURNACE) {
            if (now - this.timestamps[0] >= 5000) {
                this.timestamps[0] = now;
                if (this.data[0] <= 0)
                    return;
                this.data[0]--;
            }
            this.info = this.data[0];
        }
        if (this.isExtractor() || this.type == EntityType_1.EntityType.WINDMILL) {
            if (now - this.timestamps[0] >= (this.type == EntityType_1.EntityType.WINDMILL ? 5000 : 10000)) {
                this.timestamps[0] = now;
                if (this.data[0] <= 0 || this.data >= 255)
                    return;
                this.data[0] -= (this.type == EntityType_1.EntityType.WINDMILL ? 1 : 2);
                this.data[0] = Math.max(0, this.data[0]);
                this.data[1] += 1;
            }
            this.info = Math.clamp(this.data[0], 0, 255) + (this.data[1] * 256);
        }
        if (this.type == EntityType_1.EntityType.BREAD_OVEN) {
            if (now - this.timestamps[0] >= 10000) {
                this.timestamps[0] = now;
                this.data[0] -= 1;
                if (this.data[0] <= 0 || this.data[1] <= 0 || this.data[2] >= 31)
                    return;
                this.data[0] = Math.max(0, this.data[0]);
                this.data[1] -= 1;
                this.data[2] += 1;
            }
            this.info = Math.clamp(this.data[0], 0, 31) + (this.data[1] << 5) + (this.data[2] << 10);
        }
    }
    onDamage(damager) {
        if (!damager)
            return;
        const writer = new BinaryWriter_1.BinaryWriter(3);
        writer.writeUInt8(ClientPackets_1.ClientPackets.HITTEN_OTHER);
        writer.writeUInt8(damager.angle);
        writer.writeUInt16(this.id + this.pid * this.server.config.important.max_units);
        const players = this.server.map.getPlayersInDistance(this.position, 2100);
        for (const player of players) {
            player.client.sendBinary(writer.toBuffer());
        }
        if (!(damager instanceof Player_1.Player))
            return;
        if (this.isDoor()) {
            const entity = this.server.map.getEntities(this.position.x, this.position.y, 2).find(entity => !(entity instanceof Building) && !(entity instanceof Animal_1.Animal) && entity.realPosition.distance(this.realPosition) < this.radius + entity.radius - 1);
            if (!entity || (entity && this.collide)) {
                if (this.owner.totem?.data.includes(damager?.id) || this.owner.id === damager.id)
                    this.collide = !this.collide;
            }
        }
        if (this.isSpike()) {
            if (!this.owner.totem?.data.includes(damager?.id) && this.owner.id !== damager.id && this.collide) {
                damager.healthSystem.damage(this.server.configSystem.entityOnHitDamage[this.type], ActionType_1.ActionType.HURT);
            }
        }
        if (this.isSeed()) {
            const isBorn = this.info !== 10;
            if (isBorn && this.info && damager.right.id !== ItemType_1.ItemType.WATERING_CAN_FULL && this.info !== 16) {
                const harvest = damager.right.id === ItemType_1.ItemType.GOLD_PITCHFORK ? 3 : ItemType_1.ItemType.PITCHFORK ? 2 : 1;
                this.info -= 1;
                this.owner.score += 3 * harvest;
                damager.client.sendBinary(damager.inventory.giveItem(this.server.configSystem.seedFruits[this.type], harvest));
            }
            if (damager.right.id === ItemType_1.ItemType.WATERING_CAN_FULL && this.info >= 16) {
                this.info -= 16;
                this.timestamps[1] = Date.now();
            }
        }
    }
    onDead(damager) {
        if (this.type === EntityType_1.EntityType.TOTEM) {
            this.server.totemSystem.broadcastDestroyTeam(this);
        }
        if (damager instanceof Player_1.Player) {
            const id = ItemType_1.ItemType[EntityType_1.EntityType[this.type]];
            const craft = this.server.craftSystem.recipes[id];
            if (!craft || !craft.r)
                return;
            for (const [id, count] of craft.r) {
                if (count === 1)
                    continue;
                damager.client.sendBinary(damager.inventory.giveItem(id, ~~(count / 1.8)));
            }
            if (this.type === EntityType_1.EntityType.EMERALD_MACHINE) {
                this.owner.reason = DeathReason_1.DeathReason.EMERALD;
                this.owner.healthSystem.damage(200, ActionType_1.ActionType.HURT, damager);
            }
            damager.score += 20;
        }
    }
    isVisualHealth() {
        return [
            EntityType_1.EntityType.WOOD_SPIKE, EntityType_1.EntityType.STONE_SPIKE, EntityType_1.EntityType.GOLD_SPIKE, EntityType_1.EntityType.DIAMOND_SPIKE, EntityType_1.EntityType.AMETHYST_SPIKE, EntityType_1.EntityType.REIDITE_SPIKE,
            EntityType_1.EntityType.WOOD_WALL, EntityType_1.EntityType.STONE_WALL, EntityType_1.EntityType.GOLD_WALL, EntityType_1.EntityType.DIAMOND_WALL, EntityType_1.EntityType.AMETHYST_WALL, EntityType_1.EntityType.REIDITE_WALL,
            EntityType_1.EntityType.WOOD_DOOR, EntityType_1.EntityType.STONE_DOOR, EntityType_1.EntityType.GOLD_DOOR, EntityType_1.EntityType.DIAMOND_DOOR, EntityType_1.EntityType.AMETHYST_DOOR, EntityType_1.EntityType.REIDITE_DOOR,
            EntityType_1.EntityType.WOOD_DOOR_SPIKE, EntityType_1.EntityType.STONE_DOOR_SPIKE, EntityType_1.EntityType.GOLD_DOOR_SPIKE, EntityType_1.EntityType.DIAMOND_DOOR_SPIKE, EntityType_1.EntityType.AMETHYST_DOOR_SPIKE, EntityType_1.EntityType.REIDITE_DOOR_SPIKE,
            EntityType_1.EntityType.BRIDGE, EntityType_1.EntityType.ROOF, EntityType_1.EntityType.EMERALD_MACHINE
        ].includes(this.type);
    }
    isDoor() {
        return [
            EntityType_1.EntityType.WOOD_DOOR, EntityType_1.EntityType.STONE_DOOR, EntityType_1.EntityType.GOLD_DOOR, EntityType_1.EntityType.DIAMOND_DOOR, EntityType_1.EntityType.AMETHYST_DOOR, EntityType_1.EntityType.REIDITE_DOOR,
            EntityType_1.EntityType.WOOD_DOOR_SPIKE, EntityType_1.EntityType.STONE_DOOR_SPIKE, EntityType_1.EntityType.GOLD_DOOR_SPIKE, EntityType_1.EntityType.DIAMOND_DOOR_SPIKE, EntityType_1.EntityType.AMETHYST_DOOR_SPIKE, EntityType_1.EntityType.REIDITE_DOOR_SPIKE
        ].includes(this.type);
    }
    isDoorSpike() {
        return [
            EntityType_1.EntityType.WOOD_DOOR_SPIKE, EntityType_1.EntityType.STONE_DOOR_SPIKE, EntityType_1.EntityType.GOLD_DOOR_SPIKE, EntityType_1.EntityType.DIAMOND_DOOR_SPIKE, EntityType_1.EntityType.AMETHYST_DOOR_SPIKE, EntityType_1.EntityType.REIDITE_DOOR_SPIKE
        ].includes(this.type);
    }
    isWall() {
        return [
            EntityType_1.EntityType.WOOD_SPIKE, EntityType_1.EntityType.STONE_SPIKE, EntityType_1.EntityType.GOLD_SPIKE, EntityType_1.EntityType.DIAMOND_SPIKE, EntityType_1.EntityType.AMETHYST_SPIKE, EntityType_1.EntityType.REIDITE_SPIKE,
            EntityType_1.EntityType.WOOD_WALL, EntityType_1.EntityType.STONE_WALL, EntityType_1.EntityType.GOLD_WALL, EntityType_1.EntityType.DIAMOND_WALL, EntityType_1.EntityType.AMETHYST_WALL, EntityType_1.EntityType.REIDITE_WALL
        ].includes(this.type);
    }
    isSpike() {
        return [
            EntityType_1.EntityType.WOOD_SPIKE, EntityType_1.EntityType.STONE_SPIKE, EntityType_1.EntityType.GOLD_SPIKE, EntityType_1.EntityType.DIAMOND_SPIKE, EntityType_1.EntityType.AMETHYST_SPIKE, EntityType_1.EntityType.REIDITE_SPIKE,
            EntityType_1.EntityType.WOOD_DOOR_SPIKE, EntityType_1.EntityType.STONE_DOOR_SPIKE, EntityType_1.EntityType.GOLD_DOOR_SPIKE, EntityType_1.EntityType.DIAMOND_DOOR_SPIKE, EntityType_1.EntityType.AMETHYST_DOOR_SPIKE, EntityType_1.EntityType.REIDITE_DOOR_SPIKE
        ].includes(this.type);
    }
    isExtractor() {
        return [
            EntityType_1.EntityType.STONE_EXTRACTOR, EntityType_1.EntityType.GOLD_EXTRACTOR,
            EntityType_1.EntityType.DIAMOND_EXTRACTOR, EntityType_1.EntityType.AMETHYST_EXTRACTOR, EntityType_1.EntityType.REIDITE_EXTRACTOR
        ].includes(this.type);
    }
    isSeed() {
        return [
            EntityType_1.EntityType.BERRY_SEED, EntityType_1.EntityType.WHEAT_SEED, EntityType_1.EntityType.CARROT_SEED, EntityType_1.EntityType.TOMATO_SEED,
            EntityType_1.EntityType.THORNBUSH_SEED, EntityType_1.EntityType.GARLIC_SEED, EntityType_1.EntityType.WATERMELON_SEED, EntityType_1.EntityType.PUMPKIN_SEED
        ].includes(this.type);
    }
    isGrid() {
        return [
            EntityType_1.EntityType.BRIDGE, EntityType_1.EntityType.ROOF, EntityType_1.EntityType.WOOD_TOWER,
            EntityType_1.EntityType.PLOT, EntityType_1.EntityType.BED
        ].includes(this.type);
    }
    isLight() {
        return [
            EntityType_1.EntityType.WOOD_WALL, EntityType_1.EntityType.WOOD_SPIKE, EntityType_1.EntityType.WOOD_DOOR, EntityType_1.EntityType.WOOD_DOOR_SPIKE,
            EntityType_1.EntityType.WORKBENCH, EntityType_1.EntityType.TOTEM, EntityType_1.EntityType.FIRE, EntityType_1.EntityType.BIG_FIRE, EntityType_1.EntityType.SIGN, EntityType_1.EntityType.PLOT
        ].includes(this.type);
    }
}
exports.Building = Building;
