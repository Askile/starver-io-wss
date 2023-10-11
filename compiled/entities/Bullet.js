"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bullet = void 0;
const Entity_1 = require("./Entity");
const EntityType_1 = require("../enums/types/EntityType");
const Player_1 = require("./Player");
const Vector_1 = require("../modules/Vector");
const Utils_1 = require("../modules/Utils");
const ActionType_1 = require("../enums/types/ActionType");
const Animal_1 = require("./Animal");
const Building_1 = require("./Building");
const Tile_1 = require("../world/map/Tile");
var ArrowData;
(function (ArrowData) {
    ArrowData[ArrowData["SPEED"] = 0] = "SPEED";
    ArrowData[ArrowData["DISTANCE"] = 1] = "DISTANCE";
    ArrowData[ArrowData["DAMAGE"] = 2] = "DAMAGE";
    ArrowData[ArrowData["ENTITY_DAMAGE"] = 3] = "ENTITY_DAMAGE";
})(ArrowData || (ArrowData = {}));
class Bullet extends Entity_1.Entity {
    owner;
    pos;
    distance;
    data;
    constructor(server, owner, type) {
        super(EntityType_1.EntityType.SPELL, server);
        const { position, angle } = owner;
        this.data = this.getArrowData(type);
        this.distance = 0;
        this.speed = this.data[ArrowData.SPEED];
        this.pos = new Vector_1.Vector(0, 0);
        this.pos.set(owner.position);
        this.position.set(Utils_1.Utils.getOffsetVector(position, this.data[ArrowData.DISTANCE], owner.angle));
        this.realPosition.set(owner.position);
        this.info = position.x - (position.x & 0xf) + type;
        this.extra = position.y - (position.y & 1);
        this.id = this.server.entityPool.createId();
        this.owner = owner;
        this.angle = angle - 63.75;
        this.server.entities.push(this);
    }
    getArrowData(type) {
        const { config } = this.server;
        switch (type) {
            case 2: return [config.spell_speed_wood_arrow, config.spell_dist_wood_arrow, config.spell_damage_wood_arrow, config.spell_damage_pve_wood_arrow];
            case 3: return [config.spell_speed_stone_arrow, config.spell_dist_stone_arrow, config.spell_damage_stone_arrow, config.spell_damage_pve_stone_arrow];
            case 4: return [config.spell_speed_gold_arrow, config.spell_dist_gold_arrow, config.spell_damage_gold_arrow, config.spell_damage_pve_gold_arrow];
            case 5: return [config.spell_speed_diamond_arrow, config.spell_dist_diamond_arrow, config.spell_damage_diamond_arrow, config.spell_damage_pve_diamond_arrow];
            case 6: return [config.spell_speed_amethyst_arrow, config.spell_dist_amethyst_arrow, config.spell_damage_amethyst_arrow, config.spell_damage_pve_amethyst_arrow];
            case 7: return [config.spell_speed_reidite_arrow, config.spell_dist_reidite_arrow, config.spell_damage_reidite_arrow, config.spell_damage_pve_reidite_arrow];
            case 8: return [config.spell_speed_dragon_arrow, config.spell_dist_dragon_arrow, config.spell_damage_dragon_arrow, config.spell_damage_pve_dragon_arrow];
        }
        return [0, 0, 0, 0];
    }
    onTick() {
        if (this.distance >= this.data[ArrowData.DISTANCE]) {
            return this.delete();
        }
        this.distance += this.data[ArrowData.SPEED] * 1000 / this.server.settings.tps;
        this.realPosition.set(Utils_1.Utils.getOffsetVector(this.pos, this.distance, this.angle + 63.75));
        const colliders = this.server.collision.getColliders(this, 1, 1);
        if (colliders.length > 0) {
            for (const collider of colliders) {
                if (collider === this.owner)
                    continue;
                if (collider instanceof Tile_1.Tile) {
                    return this.delete();
                }
                else if (collider instanceof Player_1.Player || collider instanceof Building_1.Building) {
                    collider.healthSystem.damage(this.data[ArrowData.DAMAGE], ActionType_1.ActionType.HURT, this);
                    return this.delete();
                }
                else if (collider instanceof Animal_1.Animal) {
                    collider.healthSystem.damage(this.data[ArrowData.ENTITY_DAMAGE], ActionType_1.ActionType.HURT, this);
                    return this.delete();
                }
            }
        }
    }
}
exports.Bullet = Bullet;
