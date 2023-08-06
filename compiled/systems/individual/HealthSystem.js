"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthSystem = void 0;
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const ActionType_1 = require("../../enums/ActionType");
class HealthSystem {
    entity;
    health;
    maxHealth;
    oldHealth;
    constructor(entity, maxHealth) {
        this.entity = entity;
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.oldHealth = maxHealth;
    }
    /**
     * Deals damage to the game object and updates its health.
     * @param {number} amount - The amount of damage to be dealt.
     * @param {number} action - The type of Damage(Need for animations)
     * @param {Entity} damager - The entity who has damaged the entity
     * @returns {Buffer} - The buffer with data about the current health to be sent to the client.
     */
    damage(amount, action, damager) {
        this.health = Math.max(0, this.health - Math.max(amount, 0));
        if (!(this.entity.action & action))
            this.entity.action |= action;
        this.entity.onDamage(damager);
        if (this.health <= 0) {
            this.entity.onDead(damager);
            this.entity.delete();
        }
        if (this.oldHealth === this.health)
            return this.getHealthBuffer();
        this.oldHealth = this.health;
        return this.getHealthBuffer();
    }
    /**
     * Heals the game object and updates its health.
     * @param {number} amount - The amount of health to be restored.
     * @returns {Buffer} - The buffer with data about the current health to be sent to the client.
     */
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount / 2);
        if (this.oldHealth === this.health)
            return undefined;
        if (!(this.entity.action & ActionType_1.ActionType.HEAL))
            this.entity.action |= ActionType_1.ActionType.HEAL;
        this.oldHealth = this.health;
        return this.getHealthBuffer();
    }
    /**
     * Gets the buffer with data about the current health to be sent to the client.
     * @returns {Buffer} - The buffer with data about the current health.
     */
    getHealthBuffer() {
        const writer = new BinaryWriter_1.BinaryWriter(2);
        writer.writeUInt8(ClientPackets_1.ClientPackets.GAUGES_LIFE);
        writer.writeUInt8(this.health / 2);
        return writer.toBuffer();
    }
}
exports.HealthSystem = HealthSystem;
