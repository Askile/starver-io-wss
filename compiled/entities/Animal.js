"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animal = void 0;
const Entity_1 = require("./Entity");
const Player_1 = require("./Player");
const DeadBox_1 = require("./DeadBox");
const Inventory_1 = require("../systems/individual/Inventory");
const EntityType_1 = require("../enums/EntityType");
const InventoryType_1 = require("../enums/InventoryType");
const AnimalBoxes_1 = require("../enums/AnimalBoxes");
class Animal extends Entity_1.Entity {
    score = 0;
    inventory;
    constructor(type, server) {
        super(type, server);
        this.inventory = new Inventory_1.Inventory(this, 16);
        this.radius = 35;
        this.collide = false;
        this.setupLoot();
    }
    setupLoot() {
        switch (this.type) {
            case EntityType_1.EntityType.WOLF:
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 2);
                this.inventory.giveItem(InventoryType_1.InventoryType.FUR_WOLF, 1);
                this.score = 250;
                break;
            case EntityType_1.EntityType.SPIDER:
                this.inventory.giveItem(InventoryType_1.InventoryType.CORD, 2);
                this.score = 150;
                break;
            case EntityType_1.EntityType.RABBIT:
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 2);
                this.inventory.giveItem(InventoryType_1.InventoryType.FUR, 1);
                this.score = 60;
                break;
            case EntityType_1.EntityType.BOAR:
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 4);
                this.inventory.giveItem(InventoryType_1.InventoryType.FUR_BOAR, 1);
                this.score = 400;
                break;
            case EntityType_1.EntityType.HAWK:
                this.inventory.giveItem(InventoryType_1.InventoryType.HAWK_FEATHER, 4);
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 1);
                this.score = 300;
                break;
            case EntityType_1.EntityType.CRAB:
                this.inventory.giveItem(InventoryType_1.InventoryType.CRAB_STICK, 1);
                this.inventory.giveItem(InventoryType_1.InventoryType.CRAB_LOOT, 1);
                this.score = 200;
                break;
            case EntityType_1.EntityType.CRAB_BOSS:
                this.inventory.giveItem(InventoryType_1.InventoryType.CRAB_STICK, 4);
                this.inventory.giveItem(InventoryType_1.InventoryType.CRAB_LOOT, 4);
                this.score = 1200;
                break;
            case EntityType_1.EntityType.FOX:
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 2);
                this.inventory.giveItem(InventoryType_1.InventoryType.FUR_WINTER, 1);
                this.score = 250;
                break;
            case EntityType_1.EntityType.BEAR:
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 3);
                this.inventory.giveItem(InventoryType_1.InventoryType.FUR_WINTER, 2);
                this.score = 500;
                break;
            case EntityType_1.EntityType.PENGUIN:
                this.inventory.giveItem(InventoryType_1.InventoryType.PENGUIN_FEATHER, 4);
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 1);
                this.score = 200;
                break;
            case EntityType_1.EntityType.DRAGON:
                this.inventory.giveItem(InventoryType_1.InventoryType.DRAGON_HEART, 1);
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 5);
                this.score = 1500;
                break;
            case EntityType_1.EntityType.BABY_DRAGON:
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 4);
                this.score = 600;
                break;
            case EntityType_1.EntityType.MAMMOTH:
                this.inventory.giveItem(InventoryType_1.InventoryType.FUR_MAMMOTH, 10);
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 7);
                this.score = 1500;
                break;
            case EntityType_1.EntityType.BABY_MAMMOTH:
                this.inventory.giveItem(InventoryType_1.InventoryType.FUR_MAMMOTH, 1);
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 3);
                this.score = 600;
                break;
            case EntityType_1.EntityType.FLAME:
                this.inventory.giveItem(InventoryType_1.InventoryType.FLAME, 1);
                this.score = 2000;
                break;
            case EntityType_1.EntityType.LAVA_DRAGON:
                this.inventory.giveItem(InventoryType_1.InventoryType.LAVA_HEART, 1);
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 10);
                this.score = 2000;
                break;
            case EntityType_1.EntityType.BABY_LAVA:
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 5);
                this.score = 1000;
                break;
            case EntityType_1.EntityType.VULTURE:
                this.inventory.giveItem(InventoryType_1.InventoryType.VULTURE_FEATHER, 1);
                this.inventory.giveItem(InventoryType_1.InventoryType.MEAT, 3);
                this.score = 600;
                break;
            case EntityType_1.EntityType.SAND_WORM:
                this.inventory.giveItem(InventoryType_1.InventoryType.SANDWORM_JUICE, 1);
                this.score = 1000;
                break;
            case EntityType_1.EntityType.KRAKEN:
                this.inventory.giveItem(InventoryType_1.InventoryType.KRAKEN_SKIN, 1);
                this.inventory.giveItem(InventoryType_1.InventoryType.FOODFISH, 5);
                this.score = 2000;
                break;
            case EntityType_1.EntityType.PIRANHA:
                this.inventory.giveItem(InventoryType_1.InventoryType.FOODFISH, 2);
                this.inventory.giveItem(InventoryType_1.InventoryType.SCALES, 1);
                this.score = 2000;
                break;
            case EntityType_1.EntityType.TREASURE_CHEST:
                this.score = 150;
                break;
        }
    }
    onDead(damager) {
        if (damager instanceof Player_1.Player) {
            damager.stats.score += this.score;
            const box = new DeadBox_1.DeadBox(this.server, this);
            box.info = AnimalBoxes_1.AnimalBoxes[this.type];
            box.healthSystem.health = 30;
        }
    }
}
exports.Animal = Animal;
