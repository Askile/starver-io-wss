"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
const Entity_1 = require("./Entity");
const Player_1 = require("./Player");
const Inventory_1 = require("../systems/individual/Inventory");
const EntityType_1 = require("../enums/types/EntityType");
const ItemType_1 = require("../enums/types/ItemType");
const AnimalBoxes_1 = require("../enums/AnimalBoxes");
const BehaviourType_1 = require("../enums/types/BehaviourType");
const Utils_1 = require("../modules/Utils");
const BiomeType_1 = require("../enums/types/BiomeType");
const Crate_1 = require("./Crate");
const QuestType_1 = require("../enums/QuestType");
const ActionType_1 = require("../enums/types/ActionType");
const BinaryWriter_1 = require("../modules/BinaryWriter");
const ClientPackets_1 = require("../enums/packets/ClientPackets");
const DeathReason_1 = require("../enums/DeathReason");
const Movement_1 = require("../systems/individual/Movement");
class Animal extends Entity_1.Entity {
    score;
    spawnBiome;
    movement;
    inventory;
    behaviour;
    lastAngry = -1;
    lastMove = -1;
    lastSpiderStun = -1;
    lastCollision = -1;
    nextMove = -1;
    lastUpdate = -1;
    target;
    constructor(type, server) {
        super(type, server);
        this.inventory = new Inventory_1.Inventory(this, 16);
        this.id = this.server.entityPool.createId();
        this.score = 0;
        this.collide = false;
        this.target = null;
        this.spawnBiome = BiomeType_1.BiomeType.FOREST;
        this.behaviour = BehaviourType_1.BehaviourType.NONE;
        this.server.mobSystem.animalCounter[this.type]++;
        this.movement = new Movement_1.Movement(this);
        this.setupLoot();
    }
    onDamage(damager) {
        if (damager instanceof Player_1.Player) {
            if (damager.quests[QuestType_1.QuestType.BLUE_GEM] === QuestType_1.QuestState.PROCCESS && this.behaviour === BehaviourType_1.BehaviourType.PEACEFUL) {
                damager.failQuests(QuestType_1.QuestType.BLUE_GEM);
            }
        }
    }
    onTick() {
        if (this.behaviour === BehaviourType_1.BehaviourType.NONE)
            return;
        const now = Date.now();
        switch (this.type) {
            case EntityType_1.EntityType.SAND_WORM:
            case EntityType_1.EntityType.LAVA_DRAGON:
            case EntityType_1.EntityType.MAMMOTH:
            case EntityType_1.EntityType.DRAGON:
            case EntityType_1.EntityType.KRAKEN: {
                if (now - this.lastUpdate > 1000) {
                    this.lastUpdate = now;
                    const buildings = Utils_1.Utils.getBuildings(this.server.map.getEntities(this.position.x, this.position.y, 3));
                    const shakeBuildings = new BinaryWriter_1.BinaryWriter();
                    shakeBuildings.writeUInt16(ClientPackets_1.ClientPackets.HITTEN_OTHER);
                    for (const building of buildings) {
                        if (building.position.distance(this.realPosition) > this.server.configSystem.entityRadius[this.type] + 50)
                            continue;
                        building.healthSystem.damage(this.server.configSystem.entityDamage[this.type], 0);
                        shakeBuildings.writeUInt16(building.id + building.pid * 1000);
                        shakeBuildings.writeUInt16(this.angle);
                    }
                    if (shakeBuildings.toBuffer().length > 2) {
                        this.server.broadcast(shakeBuildings.toBuffer(), true);
                    }
                }
            }
        }
        this.updateSpeed();
        this.target = Utils_1.Utils.getTarget(this, this.server.players, this.speed * 1000);
        if ((this.behaviour === BehaviourType_1.BehaviourType.AGGRESSIVE || this.info === 1) && this.target) {
            const inTarget = Utils_1.Utils.distanceSqrt(this.realPosition, this.target.realPosition) < this.radius + this.target.radius;
            if (this.target.isStunned)
                this.lastSpiderStun = now;
            if (Utils_1.Utils.distanceSqrt(this.realPosition, this.target.realPosition) < (this.radius + 44) + this.target.radius) {
                (this.type === EntityType_1.EntityType.SPIDER && !this.target.isStunned && now - this.lastSpiderStun > 2800 && Math.random() > .02) && this.spiderStun();
            }
            else {
                this.lastSpiderStun = now;
            }
            if (inTarget) {
                if (this.type === EntityType_1.EntityType.SAND_WORM)
                    this.info = 1;
                if (this.target.lastDamage[this.type] === -1)
                    this.target.lastDamage[this.type] = +new Date();
                now - this.target.lastDamage[this.type] > 1000 && this.onAttack();
            }
            else {
                if (this.type === EntityType_1.EntityType.SAND_WORM)
                    this.info = 0;
                this.target.lastDamage[this.type] = Date.now();
            }
        }
        this.server.collision.updateState(this);
        this.updateMovement();
    }
    updateSpeed() {
        this.speed = this.water && this.spawnBiome !== BiomeType_1.BiomeType.SEA ? this.server.config.speed_water : this.server.config.speed;
    }
    spiderStun() {
        if (this.target) {
            this.target.action |= ActionType_1.ActionType.WEB;
            this.target.isStunned = true;
            this.target.lastStunned = Date.now();
            this.lastSpiderStun = Date.now();
        }
    }
    onAttack() {
        if (this.type === EntityType_1.EntityType.SAND_WORM && this.info === 0)
            return;
        if (this.target) {
            let damage = this.server.configSystem.entityDamage[this.type] + this.target.mobDefense;
            this.target.reason = DeathReason_1.DeathReason[EntityType_1.EntityType[this.type]];
            this.target.client.sendBinary(this.target.healthSystem.damage(damage, ActionType_1.ActionType.HURT));
            this.target.lastDamage[this.type] = Date.now();
        }
    }
    updateMovement() {
        const now = Date.now();
        if ((this.behaviour === BehaviourType_1.BehaviourType.NEUTRAL && this.info === 1) && now - this.lastAngry > 20000)
            this.info = 0;
        if (now - this.lastMove < this.nextMove)
            return;
        if (this.target instanceof Player_1.Player) {
            if (this.behaviour === BehaviourType_1.BehaviourType.PEACEFUL) {
                const offset = this.target.realPosition.subtract(this.realPosition);
                const moveDirection = offset.normalize().multiply(this.speed * 1000 / 2);
                this.lastMove = now;
                this.nextMove = Math.clamp(this.realPosition.distance(this.target.realPosition) * 7, 500, 1000);
                const position = this.realPosition.subtract(moveDirection);
                const angle = this.realPosition.angle(position);
                let collisionPosition = this.server.collision.updateAnimal(this, position);
                if (collisionPosition === position)
                    this.position.set(collisionPosition);
                this.angle = ((angle) * 255) / Math.PI2 + 63.75;
            }
            else if (this.behaviour === BehaviourType_1.BehaviourType.AGGRESSIVE || this.info == 1) {
                const offset = this.realPosition.subtract(this.target.realPosition);
                const moveDirection = offset.normalize().multiply(this.realPosition.distance(this.target.realPosition));
                this.lastMove = now;
                this.nextMove = Math.clamp(this.realPosition.distance(this.target.realPosition) * (1.4 / this.speed), 500, 1200);
                let position = this.realPosition.subtract(moveDirection);
                const angle = this.realPosition.angle(position);
                //this.position.set(position);
                let collisionPosition = this.server.collision.updateAnimal(this, position);
                if (collisionPosition !== position) {
                    let attempt = 10;
                    let finded = false;
                    while (attempt) {
                        attempt -= 1;
                        const offset = this.target.realPosition.subtract(this.realPosition);
                        const moveDirection = offset.normalize().multiply(this.speed * 1000 / 2);
                        this.lastMove = now;
                        this.nextMove = Math.clamp(this.realPosition.distance(this.target.realPosition) * 7, 500, 1000);
                        const position = this.realPosition.subtract(moveDirection);
                        const angle = this.realPosition.angle(position);
                        this.position.set(position);
                        this.angle = ((angle) * 255) / Math.PI2 + 63.75;
                        const offset_ = position.subtract(this.target.realPosition);
                        const moveDirection_ = offset_.normalize().multiply(position.distance(this.target.realPosition));
                        const position_ = position.subtract(moveDirection_);
                        const angle_ = Math.random_clamp(0, 255);
                        this.lastMove = now;
                        this.nextMove = 680;
                        collisionPosition = this.server.collision.updateAnimal(this, position_);
                        if (collisionPosition === position_) {
                            attempt = 0;
                            finded = true;
                        }
                        this.lastCollision = now;
                    }
                    if (attempt <= 0 && finded)
                        this.position.set(collisionPosition);
                }
                else {
                    this.position.set(collisionPosition);
                    this.angle = ((angle) * 255) / Math.PI2 + 63.75;
                }
            }
            else if (this.behaviour === BehaviourType_1.BehaviourType.NEUTRAL && this.info == 0) {
                let angle = Math.random() * Math.PI2;
                angle = ((angle) * 255) / Math.PI2;
                const distanceToMove = Math.random_clamp(50, this.speed * 600);
                const position = Utils_1.Utils.getOffsetVector(this.realPosition, distanceToMove, angle);
                this.lastMove = now;
                this.nextMove = distanceToMove * 10;
                let collisionPosition = this.server.collision.updateAnimal(this, position);
                if (collisionPosition)
                    this.position.set(collisionPosition);
                this.angle = angle - 63.75;
            }
        }
        else {
            let angle = Math.random() * Math.PI2;
            angle = ((angle) * 255) / Math.PI2;
            const distanceToMove = Math.random_clamp(50, this.speed * 600);
            const position = Utils_1.Utils.getOffsetVector(this.realPosition, distanceToMove, angle);
            this.lastMove = now;
            this.nextMove = distanceToMove * 10;
            let collisionPosition = this.server.collision.updateAnimal(this, position);
            if (collisionPosition === position)
                this.position.set(collisionPosition);
            this.angle = angle - 63.75;
            if (this.info == 1)
                this.lastAngry = now;
        }
        this.position.set(this.position.clamp(0, 0, this.server.map.width - 1, this.server.map.height - 1));
        if (this.spawnBiome !== this.biomeIn) {
            const biomes = this.server.map.biomes.filter(biome => biome.type === this.spawnBiome);
            for (const biome of biomes) {
                if ((this.type === EntityType_1.EntityType.DRAGON || this.type === EntityType_1.EntityType.LAVA_DRAGON) && this.target)
                    continue;
                if (this.spawnBiome === BiomeType_1.BiomeType.WINTER && this.biomeIn === BiomeType_1.BiomeType.DRAGON)
                    continue;
                if (this.water && this.lake)
                    continue;
                const position = this.position.clamp(biome.position.x, biome.position.y, biome.endPosition.x - 1, biome.endPosition.y - 1);
                const angle = this.position.angle(position);
                if (this.type === EntityType_1.EntityType.DRAGON || this.type === EntityType_1.EntityType.LAVA_DRAGON) {
                    this.lastMove = now;
                    this.nextMove = this.position.distance(position) * 5;
                }
                let collisionPosition = this.server.collision.updateAnimal(this, position);
                collisionPosition && this.position.set(collisionPosition);
                this.angle = ((angle) * 255) / Math.PI2 + 63.75;
            }
            this.target = null;
        }
    }
    setupLoot() {
        switch (this.type) {
            case EntityType_1.EntityType.WOLF:
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 2);
                this.inventory.giveItem(ItemType_1.ItemType.WOLF_FUR, 1);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.score = 250;
                break;
            case EntityType_1.EntityType.SPIDER:
                this.inventory.giveItem(ItemType_1.ItemType.CORD, 2);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.score = 150;
                break;
            case EntityType_1.EntityType.RABBIT:
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 2);
                this.inventory.giveItem(ItemType_1.ItemType.RABBIT_FUR, 1);
                this.behaviour = BehaviourType_1.BehaviourType.PEACEFUL;
                this.score = 60;
                break;
            case EntityType_1.EntityType.BOAR:
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 4);
                this.inventory.giveItem(ItemType_1.ItemType.BOAR_FUR, 1);
                this.behaviour = BehaviourType_1.BehaviourType.NEUTRAL;
                this.score = 400;
                break;
            case EntityType_1.EntityType.HAWK:
                this.inventory.giveItem(ItemType_1.ItemType.HAWK_FEATHER, 4);
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 1);
                this.behaviour = BehaviourType_1.BehaviourType.NEUTRAL;
                this.score = 300;
                break;
            case EntityType_1.EntityType.CRAB:
                this.inventory.giveItem(ItemType_1.ItemType.CRAB_STICK, 1);
                this.inventory.giveItem(ItemType_1.ItemType.CRAB_LOOT, 1);
                this.behaviour = BehaviourType_1.BehaviourType.NEUTRAL;
                this.score = 200;
                break;
            case EntityType_1.EntityType.CRAB_BOSS:
                this.inventory.giveItem(ItemType_1.ItemType.CRAB_STICK, 4);
                this.inventory.giveItem(ItemType_1.ItemType.CRAB_LOOT, 4);
                this.behaviour = BehaviourType_1.BehaviourType.NEUTRAL;
                this.score = 1200;
                break;
            case EntityType_1.EntityType.FOX:
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 2);
                this.inventory.giveItem(ItemType_1.ItemType.WINTER_FUR, 1);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.WINTER;
                this.score = 250;
                break;
            case EntityType_1.EntityType.BEAR:
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 3);
                this.inventory.giveItem(ItemType_1.ItemType.WINTER_FUR, 2);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.WINTER;
                this.score = 500;
                break;
            case EntityType_1.EntityType.PENGUIN:
                this.inventory.giveItem(ItemType_1.ItemType.PENGUIN_FEATHER, 4);
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 1);
                this.behaviour = BehaviourType_1.BehaviourType.PEACEFUL;
                this.spawnBiome = BiomeType_1.BiomeType.WINTER;
                this.score = 200;
                break;
            case EntityType_1.EntityType.DRAGON:
                this.inventory.giveItem(ItemType_1.ItemType.DRAGON_HEART, 1);
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 5);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.DRAGON;
                this.score = 1500;
                break;
            case EntityType_1.EntityType.BABY_DRAGON:
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 4);
                this.behaviour = BehaviourType_1.BehaviourType.NEUTRAL;
                this.spawnBiome = BiomeType_1.BiomeType.DRAGON;
                this.score = 600;
                break;
            case EntityType_1.EntityType.MAMMOTH:
                this.inventory.giveItem(ItemType_1.ItemType.MAMMOTH_FUR, 10);
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 7);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.WINTER;
                this.score = 1500;
                break;
            case EntityType_1.EntityType.BABY_MAMMOTH:
                this.inventory.giveItem(ItemType_1.ItemType.MAMMOTH_FUR, 1);
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 3);
                this.behaviour = BehaviourType_1.BehaviourType.NEUTRAL;
                this.spawnBiome = BiomeType_1.BiomeType.WINTER;
                this.score = 600;
                break;
            case EntityType_1.EntityType.FLAME:
                this.inventory.giveItem(ItemType_1.ItemType.FLAME, 1);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.LAVA;
                this.score = 2000;
                break;
            case EntityType_1.EntityType.LAVA_DRAGON:
                this.inventory.giveItem(ItemType_1.ItemType.LAVA_HEART, 1);
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 10);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.LAVA;
                this.score = 2000;
                break;
            case EntityType_1.EntityType.BABY_LAVA:
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 5);
                this.behaviour = BehaviourType_1.BehaviourType.NEUTRAL;
                this.spawnBiome = BiomeType_1.BiomeType.LAVA;
                this.score = 1000;
                break;
            case EntityType_1.EntityType.VULTURE:
                this.inventory.giveItem(ItemType_1.ItemType.VULTURE_FEATHER, 1);
                this.inventory.giveItem(ItemType_1.ItemType.MEAT, 3);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.DESERT;
                this.score = 600;
                break;
            case EntityType_1.EntityType.SAND_WORM:
                this.inventory.giveItem(ItemType_1.ItemType.SANDWORM_JUICE, 1);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.DESERT;
                this.score = 1000;
                break;
            case EntityType_1.EntityType.KRAKEN:
                this.inventory.giveItem(ItemType_1.ItemType.KRAKEN_FUR, 1);
                this.inventory.giveItem(ItemType_1.ItemType.FISH, 5);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.SEA;
                this.score = 2000;
                break;
            case EntityType_1.EntityType.PIRANHA:
                this.inventory.giveItem(ItemType_1.ItemType.FISH, 2);
                this.inventory.giveItem(ItemType_1.ItemType.PIRANHA_SCALES, 1);
                this.behaviour = BehaviourType_1.BehaviourType.AGGRESSIVE;
                this.spawnBiome = BiomeType_1.BiomeType.SEA;
                this.score = 600;
                break;
            case EntityType_1.EntityType.ALOE_VERA_MOB:
                this.inventory.giveItem(ItemType_1.ItemType.ALOE_VERA, 1);
                this.collide = true;
                this.spawnBiome = BiomeType_1.BiomeType.DESERT;
                this.score = 100;
                break;
            case EntityType_1.EntityType.TREASURE_CHEST:
                this.score = 150;
                this.inventory.giveItem(Utils_1.Utils.getTreasure(this.server.configSystem.treasureDropChance), 1);
                break;
            case EntityType_1.EntityType.WHEAT_MOB:
                this.score = 52;
                this.inventory.giveItem(ItemType_1.ItemType.WHEAT_SEED, 1);
                break;
        }
        this.position.set(this.server.spawnSystem.getSpawnPoint(this.spawnBiome));
        this.realPosition.set(this.position);
        const neutral = this.behaviour == BehaviourType_1.BehaviourType.NEUTRAL || this.behaviour == BehaviourType_1.BehaviourType.PEACEFUL;
        this.info = neutral ? 0 : 1;
        if (this.type == EntityType_1.EntityType.SAND_WORM)
            this.info = 0;
    }
    onDead(damager) {
        this.server.mobSystem.animalCounter[this.type]--;
        if (damager instanceof Player_1.Player) {
            damager.score += this.score;
            if (this.type === EntityType_1.EntityType.TREASURE_CHEST) {
                damager.client.sendBinary(damager.inventory.addInventory(this.inventory));
                damager.ruinQuests();
            }
            else if ([EntityType_1.EntityType.WHEAT_MOB, EntityType_1.EntityType.ALOE_VERA_MOB].includes(this.type)) {
                damager.client.sendBinary(damager.inventory.addInventory(this.inventory));
            }
            else {
                const box = new Crate_1.Crate(this.server, {
                    owner: this,
                    isDead: true
                });
                box.info = AnimalBoxes_1.AnimalBoxes[this.type];
                box.healthSystem.health = 30;
            }
        }
    }
}
exports.Animal = Animal;
