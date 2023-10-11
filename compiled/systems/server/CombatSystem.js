"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatSystem = void 0;
const Player_1 = require("../../entities/Player");
const BinaryWriter_1 = require("../../modules/BinaryWriter");
const ClientPackets_1 = require("../../enums/packets/ClientPackets");
const ItemType_1 = require("../../enums/types/ItemType");
const ActionType_1 = require("../../enums/types/ActionType");
const DeathReason_1 = require("../../enums/DeathReason");
const Building_1 = require("../../entities/Building");
const Utils_1 = require("../../modules/Utils");
const Animal_1 = require("../../entities/Animal");
const BehaviourType_1 = require("../../enums/types/BehaviourType");
const WorldTime_1 = require("../../enums/WorldTime");
const TileType_1 = require("../../enums/types/TileType");
const Tile_1 = require("../../world/map/Tile");
const Entity_1 = require("../../entities/Entity");
const Bullet_1 = require("../../entities/Bullet");
class CombatSystem {
    server;
    constructor(server) {
        this.server = server;
    }
    tick() {
        for (const player of this.server.players) {
            this.handleAttack(player);
        }
    }
    handleAttack(player) {
        const now = Date.now();
        if (now - player.lastAttack < 500 || !player.attack)
            return;
        player.lastAttack = now;
        player.action |= ActionType_1.ActionType.ATTACK;
        if (player.right.isBow()) {
            const type = Utils_1.Utils.getArrowType(player);
            if (type !== -1) {
                player.client.sendBinary(player.inventory.removeItem(type[1], 1));
                new Bullet_1.Bullet(this.server, player, type[0]);
            }
            return;
        }
        const hitPosition = Utils_1.Utils.getOffsetVector(player.realPosition, player.right.offset, player.angle);
        const damaged = this.server.map.queryCircle(hitPosition, player.right.radius);
        const writer = new BinaryWriter_1.BinaryWriter();
        writer.writeUInt16(ClientPackets_1.ClientPackets.HITTEN);
        let empty = false;
        let dontHarvest = false;
        if (player.right.dig && !player.water) {
            const item = (player.beach || player.island || player.desert) ? ItemType_1.ItemType.SAND : (player.lavaBiome || player.forest) ? ItemType_1.ItemType.GROUND : player.winter ? ItemType_1.ItemType.ICE : 0;
            const reward = Utils_1.Utils.getShovelTreasure(this.server.configSystem.dropChance);
            item && player.client.sendBinary(player.inventory.giveItem(item, player.right.dig));
            reward !== -1 && player.client.sendBinary(player.inventory.giveItem(reward, player.right.dig));
        }
        for (const unit of damaged) {
            if (unit === player)
                continue;
            if (unit instanceof Tile_1.Tile && unit.collide) {
                empty = damaged.length > 1;
                dontHarvest = damaged.length > 1;
                let harvest = Math.max(0, player.right.harvest + 1 - unit.hard) * this.server.config.harvest;
                unit.type === TileType_1.TileType.CACTUS && player.client.sendBinary(player.healthSystem.damage(20, ActionType_1.ActionType.HURT));
                if (unit.hard === -1)
                    harvest = 1;
                unit.angle = player.angle;
                writer.writeUInt16(...unit.shake());
                if (harvest)
                    dontHarvest = false;
                if (unit.count > 0)
                    empty = false;
                unit.dig(player, harvest);
            }
            else if (unit instanceof Entity_1.Entity) {
                if (unit instanceof Building_1.Building) {
                    player.right.id === ItemType_1.ItemType.WRENCH ? unit.healthSystem.heal(player.right.building_damage) : unit.healthSystem.damage(player.right.building_damage, 0, player);
                }
                else {
                    if (unit instanceof Player_1.Player) {
                        const isHood = [ItemType_1.ItemType.HOOD, ItemType_1.ItemType.WINTER_HOOD].includes(player.helmet.id);
                        const peasant = unit.helmet.id === ItemType_1.ItemType.WINTER_PEASANT || (player.helmet.id === ItemType_1.ItemType.HOOD && unit.helmet.id === ItemType_1.ItemType.PEASANT);
                        if (player.right.id === ItemType_1.ItemType.HAND && isHood && !peasant && !player.fire && !unit.fire &&
                            this.server.timeSystem.time === WorldTime_1.WorldTime.NIGHT &&
                            now - player.lastHood > (player.helmet.id === ItemType_1.ItemType.WINTER_HOOD ? 4000 : 8000)) {
                            const items = unit.inventory.toArray().filter(([id, count]) => ![unit.right.id, unit.helmet.id].includes(id));
                            if (items.length > 0) {
                                const [id, c] = Utils_1.Utils.getRandomFromArray(items);
                                const count = Math.min(255, c);
                                player.client.sendBinary(player.inventory.giveItem(id, count));
                                unit.client.sendBinary(unit.inventory.removeItem(id, count));
                                player.ruinQuests();
                                player.lastHood = now;
                            }
                        }
                        unit.reason = DeathReason_1.DeathReason.PLAYER;
                        unit.client.sendBinary(unit.healthSystem.damage(player.right.damage + unit.defense * ((player.totem && player.totem.data.includes(unit.id)) ? .3 : 1), ActionType_1.ActionType.HURT, player));
                        continue;
                    }
                    unit.healthSystem.damage(player.right.damage, ActionType_1.ActionType.HURT, player);
                    if (unit instanceof Animal_1.Animal) {
                        if (unit.behaviour === BehaviourType_1.BehaviourType.NEUTRAL) {
                            unit.info = 1;
                            unit.lastAngry = now;
                        }
                    }
                }
            }
        }
        empty && player.client.sendU8([ClientPackets_1.ClientPackets.EMPTY_RES]);
        dontHarvest && player.client.sendU8([ClientPackets_1.ClientPackets.DONT_HARVEST]);
        if (writer.toBuffer().length > 2)
            this.server.broadcast(writer.toBuffer(), true);
    }
}
exports.CombatSystem = CombatSystem;
