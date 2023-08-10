import {Server} from "../Server";
import {Entity} from "./Entity";
import {Player} from "./Player";
import {DeadBox} from "./DeadBox";
import {BOX} from "../enums/Cosmetics";
import {Inventory} from "../systems/individual/Inventory";
import {EntityType} from "../enums/EntityType";
import {InventoryType} from "../enums/InventoryType";
import {AnimalBoxes} from "../enums/AnimalBoxes";

export class Animal extends Entity {
    public score: number = 0;
    public inventory: Inventory;
    constructor(type: number, server: Server) {
        super(type, server);

        this.inventory = new Inventory(this, 16);

        this.radius = 35;
        this.collide = false;

        this.setupLoot();
    }

    private setupLoot() {
        switch (this.type) {
            case EntityType.WOLF:
                this.inventory.giveItem(InventoryType.MEAT, 2);
                this.inventory.giveItem(InventoryType.FUR_WOLF, 1);
                this.score = 250;
                break;
            case EntityType.SPIDER:
                this.inventory.giveItem(InventoryType.CORD, 2);
                this.score = 150;
                break;
            case EntityType.RABBIT:
                this.inventory.giveItem(InventoryType.MEAT, 2);
                this.inventory.giveItem(InventoryType.FUR, 1);
                this.score = 60;
                break;
            case EntityType.BOAR:
                this.inventory.giveItem(InventoryType.MEAT, 4);
                this.inventory.giveItem(InventoryType.FUR_BOAR, 1);
                this.score = 400;
                break;
            case EntityType.HAWK:
                this.inventory.giveItem(InventoryType.HAWK_FEATHER, 4);
                this.inventory.giveItem(InventoryType.MEAT, 1);
                this.score = 300;
                break;
            case EntityType.CRAB:
                this.inventory.giveItem(InventoryType.CRAB_STICK, 1);
                this.inventory.giveItem(InventoryType.CRAB_LOOT, 1);
                this.score = 200;
                break;
            case EntityType.CRAB_BOSS:
                this.inventory.giveItem(InventoryType.CRAB_STICK, 4);
                this.inventory.giveItem(InventoryType.CRAB_LOOT, 4);
                this.score = 1200;
                break;
            case EntityType.FOX:
                this.inventory.giveItem(InventoryType.MEAT, 2);
                this.inventory.giveItem(InventoryType.FUR_WINTER, 1);
                this.score = 250;
                break;
            case EntityType.BEAR:
                this.inventory.giveItem(InventoryType.MEAT, 3);
                this.inventory.giveItem(InventoryType.FUR_WINTER, 2);
                this.score = 500;
                break;
            case EntityType.PENGUIN:
                this.inventory.giveItem(InventoryType.PENGUIN_FEATHER, 4);
                this.inventory.giveItem(InventoryType.MEAT, 1);
                this.score = 200;
                break;
            case EntityType.DRAGON:
                this.inventory.giveItem(InventoryType.DRAGON_HEART, 1);
                this.inventory.giveItem(InventoryType.MEAT, 5);
                this.score = 1500;
                break;
            case EntityType.BABY_DRAGON:
                this.inventory.giveItem(InventoryType.MEAT, 4);
                this.score = 600;
                break;
            case EntityType.MAMMOTH:
                this.inventory.giveItem(InventoryType.FUR_MAMMOTH, 10);
                this.inventory.giveItem(InventoryType.MEAT, 7);
                this.score = 1500;
                break;
            case EntityType.BABY_MAMMOTH:
                this.inventory.giveItem(InventoryType.FUR_MAMMOTH, 1);
                this.inventory.giveItem(InventoryType.MEAT, 3);
                this.score = 600;
                break;
            case EntityType.FLAME:
                this.inventory.giveItem(InventoryType.FLAME, 1);
                this.score = 2000;
                break;
            case EntityType.LAVA_DRAGON:
                this.inventory.giveItem(InventoryType.LAVA_HEART, 1);
                this.inventory.giveItem(InventoryType.MEAT, 10);
                this.score = 2000;
                break;
            case EntityType.BABY_LAVA:
                this.inventory.giveItem(InventoryType.MEAT, 5);
                this.score = 1000;
                break;
            case EntityType.VULTURE:
                this.inventory.giveItem(InventoryType.VULTURE_FEATHER, 1);
                this.inventory.giveItem(InventoryType.MEAT, 3);
                this.score = 600;
                break;
            case EntityType.SAND_WORM:
                this.inventory.giveItem(InventoryType.SANDWORM_JUICE, 1);
                this.score = 1000;
                break;
            case EntityType.KRAKEN:
                this.inventory.giveItem(InventoryType.KRAKEN_SKIN, 1);
                this.inventory.giveItem(InventoryType.FOODFISH, 5);
                this.score = 2000;
                break;
            case EntityType.PIRANHA:
                this.inventory.giveItem(InventoryType.FOODFISH, 2);
                this.inventory.giveItem(InventoryType.SCALES, 1);
                this.score = 2000;
                break;
            case EntityType.TREASURE_CHEST:
                this.score = 150;
                break;
        }
    }

    public onDead(damager?: Entity) {
        if(damager instanceof Player) {
            damager.stats.score += this.score;

            const box = new DeadBox(this.server, this);
            box.info = AnimalBoxes[this.type];

            box.healthSystem.health = 30;
        }
    }
}