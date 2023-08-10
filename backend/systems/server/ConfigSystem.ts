import {EntityType} from "../../enums/EntityType";

export class ConfigSystem {
    public speed: number[];
    public health: number[];

    public entityRadius: number[];
    public entityCollide: boolean[];
    public entityDamage: number[];

    public config: Config;
    constructor(config: Config) {
        this.config = config;

        this.speed = new Array(100).fill(0);
        this.health = new Array(100).fill(0);
        this.entityDamage = new Array(100).fill(0);
        this.entityRadius = new Array(100).fill(25);
        this.entityCollide = new Array(100).fill(false);

        this.setupDamage();
        this.setupSpeed();
        this.setupCollide();
        this.setupRadius();
        this.setupHealth();
    }

    public setupSpeed() {
        this.speed[EntityType.PLAYERS] = this.config.speed ?? 0.24;
        this.speed[EntityType.WOLF] = this.config.speed_wolf ?? 0.230;
        this.speed[EntityType.SPIDER] = this.config.speed_spider ?? 0.240;
        this.speed[EntityType.FOX] = this.config.speed_fox ?? 0.235;
        this.speed[EntityType.BEAR] = this.config.speed_bear ?? 0.220;
        this.speed[EntityType.DRAGON] = this.config.speed_dragon ?? 0.225;
        this.speed[EntityType.PIRANHA] = this.config.speed_piranha ?? 0.290;
        this.speed[EntityType.KRAKEN] = this.config.speed_kraken ?? 0.240;
        this.speed[EntityType.CRAB] = this.config.speed_crab ?? 0.320;
        this.speed[EntityType.FLAME] = this.config.speed_flame ?? 0.240;
        this.speed[EntityType.LAVA_DRAGON] = this.config.speed_lava_dragon ?? 0.245;
        this.speed[EntityType.BOAR] = this.config.speed_boar ?? 0.300;
        this.speed[EntityType.CRAB_BOSS] = this.config.speed_king_crab ?? 0.240;
        this.speed[EntityType.BABY_DRAGON] = this.config.speed_baby_dragon ?? 0.250;
        this.speed[EntityType.BABY_LAVA] = this.config.speed_baby_lava ?? 0.270;
        this.speed[EntityType.HAWK] = this.config.speed_hawk ?? 0.300;
        this.speed[EntityType.VULTURE] = this.config.speed_vulture ?? 0.250;
        this.speed[EntityType.SAND_WORM] = this.config.speed_sand_worm ?? 0.250;
        this.speed[EntityType.BABY_MAMMOTH] = this.config.speed_baby_mammoth ?? 0.230;
        this.speed[EntityType.MAMMOTH] = this.config.speed_mammoth ?? 0.230;
        this.speed[EntityType.RABBIT] = this.config.speed_rabbit ?? 0.320;
        this.speed[EntityType.PENGUIN] = this.config.speed_penguin ?? 0.320;
    }

    public setupDamage() {

        // Building damage;
        this.entityDamage[EntityType.SPIKE] = this.config.wood_spike_damage ?? 10;
        this.entityDamage[EntityType.STONE_SPIKE] = this.config.stone_spike_damage ?? 20;
        this.entityDamage[EntityType.GOLD_SPIKE] = this.config.stone_spike_damage ?? 30;
        this.entityDamage[EntityType.DIAMOND_SPIKE] = this.config.stone_spike_damage ?? 40;
        this.entityDamage[EntityType.AMETHYST_SPIKE] = this.config.stone_spike_damage ?? 50;
        this.entityDamage[EntityType.REIDITE_SPIKE] = this.config.stone_spike_damage ?? 60;
        this.entityDamage[EntityType.FIRE] = 40;
        this.entityDamage[EntityType.BIG_FIRE] = 40;

        // Seed damage
        this.entityDamage[EntityType.THORNBUSH_MOB] = 40;

        // Forest mobs damage
        this.entityDamage[EntityType.WOLF] = this.config.damage_wolf ?? 40;
        this.entityDamage[EntityType.SPIDER] = this.config.damage_spider ?? 30;
        this.entityDamage[EntityType.BOAR] = this.config.damage_boar ?? 50;
        this.entityDamage[EntityType.HAWK] = this.config.damage_hawk ?? 40;
        this.entityDamage[EntityType.CRAB] = this.config.damage_crab ?? 35;
        this.entityDamage[EntityType.CRAB_BOSS] = this.config.damage_king_crab ?? 80;

        // Winter mobs damage
        this.entityDamage[EntityType.FOX] = this.config.damage_fox ?? 25;
        this.entityDamage[EntityType.BEAR] = this.config.damage_bear ?? 60;
        this.entityDamage[EntityType.MAMMOTH] = this.config.damage_mammoth ?? 70;
        this.entityDamage[EntityType.BABY_MAMMOTH] = this.config.damage_baby_mammoth ?? 50;
        this.entityDamage[EntityType.DRAGON] = this.config.damage_dragon ?? 85;
        this.entityDamage[EntityType.BABY_DRAGON] = this.config.damage_baby_dragon ?? 30;

        // Desert mobs damage
        this.entityDamage[EntityType.VULTURE] = this.config.damage_vulture ?? 45;
        this.entityDamage[EntityType.SAND_WORM] = this.config.damage_sand_worm ?? 60;

        // Lava mobs damage
        this.entityDamage[EntityType.LAVA_DRAGON] = this.config.damage_lava_dragon ?? 90;
        this.entityDamage[EntityType.BABY_LAVA] = this.config.damage_baby_lava ?? 70;
        this.entityDamage[EntityType.FLAME] = this.config.damage_flame ?? 50;

        // Ocean mobs damage
        this.entityDamage[EntityType.KRAKEN] = this.config.damage_kraken ?? 80;
        this.entityDamage[EntityType.PIRANHA] = this.config.damage_piranha ?? 40;
    }

    public setupRadius() {
        this.entityRadius[EntityType.WALL] = 45;
        this.entityRadius[EntityType.STONE_WALL] = 45;
        this.entityRadius[EntityType.GOLD_WALL] = 45;
        this.entityRadius[EntityType.DIAMOND_WALL] = 45;
        this.entityRadius[EntityType.AMETHYST_WALL] = 45;
        this.entityRadius[EntityType.REIDITE_WALL] = 45;

        this.entityRadius[EntityType.WOOD_DOOR] = 45;
        this.entityRadius[EntityType.STONE_DOOR] = 45;
        this.entityRadius[EntityType.GOLD_DOOR] = 45;
        this.entityRadius[EntityType.DIAMOND_DOOR] = 45;
        this.entityRadius[EntityType.AMETHYST_DOOR] = 45;
        this.entityRadius[EntityType.REIDITE_DOOR] = 45;

        this.entityRadius[EntityType.SPIKE] = 35;
        this.entityRadius[EntityType.STONE_SPIKE] = 35;
        this.entityRadius[EntityType.GOLD_SPIKE] = 35;
        this.entityRadius[EntityType.DIAMOND_SPIKE] = 35;
        this.entityRadius[EntityType.AMETHYST_SPIKE] = 35;
        this.entityRadius[EntityType.REIDITE_SPIKE] = 35;

        this.entityRadius[EntityType.WOOD_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.STONE_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.GOLD_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.DIAMOND_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.AMETHYST_DOOR_SPIKE] = 35;
        this.entityRadius[EntityType.REIDITE_DOOR_SPIKE] = 35;

        this.entityRadius[EntityType.EXTRACTOR_MACHINE_STONE] = 45;
        this.entityRadius[EntityType.EXTRACTOR_MACHINE_GOLD] = 45;
        this.entityRadius[EntityType.EXTRACTOR_MACHINE_DIAMOND] = 45;
        this.entityRadius[EntityType.EXTRACTOR_MACHINE_AMETHYST] = 45;
        this.entityRadius[EntityType.EXTRACTOR_MACHINE_REIDITE] = 45;

        this.entityRadius[EntityType.WORKBENCH] = 35;
        this.entityRadius[EntityType.FURNACE] = 55;
    }

    public setupCollide() {
        this.entityCollide[EntityType.WALL] = true;
        this.entityCollide[EntityType.STONE_WALL] = true;
        this.entityCollide[EntityType.GOLD_WALL] = true;
        this.entityCollide[EntityType.DIAMOND_WALL] = true;
        this.entityCollide[EntityType.AMETHYST_WALL] = true;
        this.entityCollide[EntityType.REIDITE_WALL] = true;

        this.entityCollide[EntityType.WOOD_DOOR] = true;
        this.entityCollide[EntityType.STONE_DOOR] = true;
        this.entityCollide[EntityType.GOLD_DOOR] = true;
        this.entityCollide[EntityType.DIAMOND_DOOR] = true;
        this.entityCollide[EntityType.AMETHYST_DOOR] = true;
        this.entityCollide[EntityType.REIDITE_DOOR] = true;

        this.entityCollide[EntityType.SPIKE] = true;
        this.entityCollide[EntityType.STONE_SPIKE] = true;
        this.entityCollide[EntityType.GOLD_SPIKE] = true;
        this.entityCollide[EntityType.DIAMOND_SPIKE] = true;
        this.entityCollide[EntityType.AMETHYST_SPIKE] = true;
        this.entityCollide[EntityType.REIDITE_SPIKE] = true;

        this.entityCollide[EntityType.WOOD_DOOR_SPIKE] = true;
        this.entityCollide[EntityType.STONE_DOOR_SPIKE] = true;
        this.entityCollide[EntityType.GOLD_DOOR_SPIKE] = true;
        this.entityCollide[EntityType.DIAMOND_DOOR_SPIKE] = true;
        this.entityCollide[EntityType.AMETHYST_DOOR_SPIKE] = true;
        this.entityCollide[EntityType.REIDITE_DOOR_SPIKE] = true;

        this.entityCollide[EntityType.EXTRACTOR_MACHINE_STONE] = true;
        this.entityCollide[EntityType.EXTRACTOR_MACHINE_GOLD] = true;
        this.entityCollide[EntityType.EXTRACTOR_MACHINE_DIAMOND] = true;
        this.entityCollide[EntityType.EXTRACTOR_MACHINE_AMETHYST] = true;
        this.entityCollide[EntityType.EXTRACTOR_MACHINE_REIDITE] = true;


        this.entityCollide[EntityType.RESURRECTION] = true;
        this.entityCollide[EntityType.EMERALD_MACHINE] = true;
        this.entityCollide[EntityType.WINDMILL] = true;
        this.entityCollide[EntityType.WELL] = true;
        this.entityCollide[EntityType.BREAD_OVEN] = true;
        this.entityCollide[EntityType.WORKBENCH] = true;
        this.entityCollide[EntityType.CHEST] = true;
        this.entityCollide[EntityType.FURNACE] = true;
    }

    public setupHealth() {
        this.health[EntityType.PLAYERS] = 200;
        this.health[EntityType.FIRE] = 150;
        this.health[EntityType.WORKBENCH] = 300;
        this.health[EntityType.SEED] = 700;
        this.health[EntityType.WALL] = this.config.wood_wall_life ?? 1000;
        this.health[EntityType.SPIKE] = this.config.wood_spike_life ?? 150;
        this.health[EntityType.BIG_FIRE] = 400;
        this.health[EntityType.STONE_WALL] = this.config.stone_wall_life ?? 1500;
        this.health[EntityType.GOLD_WALL] = this.config.gold_wall_life ?? 2000;
        this.health[EntityType.DIAMOND_WALL] = this.config.diamond_wall_life ?? 2500;
        this.health[EntityType.WOOD_DOOR] = this.config.wood_door_life ?? 1000;
        this.health[EntityType.CHEST] = 500;
        this.health[EntityType.STONE_SPIKE] = this.config.stone_spike_life ?? 300
        this.health[EntityType.GOLD_SPIKE] = this.config.gold_spike_life ?? 600;
        this.health[EntityType.DIAMOND_SPIKE] = this.config.diamond_spike_life ?? 1200;
        this.health[EntityType.STONE_DOOR] = this.config.stone_door_life ?? 1500;
        this.health[EntityType.GOLD_DOOR] = this.config.gold_door_life ?? 2000;
        this.health[EntityType.DIAMOND_DOOR] = this.config.diamond_door_life ?? 2500;
        this.health[EntityType.FURNACE] = 1000;
        this.health[EntityType.AMETHYST_WALL] = this.config.amethyst_wall_life ?? 3500;
        this.health[EntityType.AMETHYST_SPIKE] = this.config.amethyst_spike_life ?? 2400;
        this.health[EntityType.AMETHYST_DOOR] = this.config.amethyst_door_life ?? 3500;
        this.health[EntityType.RESURRECTION] = 200;
        this.health[EntityType.EMERALD_MACHINE] = 1000;
        this.health[EntityType.EXTRACTOR_MACHINE_STONE] = 2000;
        this.health[EntityType.EXTRACTOR_MACHINE_GOLD] = 2000;
        this.health[EntityType.EXTRACTOR_MACHINE_DIAMOND] = 2000;
        this.health[EntityType.EXTRACTOR_MACHINE_AMETHYST] = 2000;
        this.health[EntityType.EXTRACTOR_MACHINE_REIDITE] = 2000;
        this.health[EntityType.TOTEM] = 300;
        this.health[EntityType.BRIDGE] = 1000;
        this.health[EntityType.WHEAT_SEED] = 700;
        this.health[EntityType.WINDMILL] = 2000;
        this.health[EntityType.PLOT] = 2000;
        this.health[EntityType.BREAD_OVEN] = 2000;
        this.health[EntityType.WELL] = 1000;
        this.health[EntityType.SIGN] = 200;
        this.health[EntityType.PUMPKIN_SEED] = 700;
        this.health[EntityType.ROOF] = 2000;
        this.health[EntityType.GARLIC_SEED] = 700;
        this.health[EntityType.THORNBUSH_SEED] = 700;
        this.health[EntityType.BED] = 400;
        this.health[EntityType.TOMATO_SEED] = 700;
        this.health[EntityType.CARROT_SEED] = 700;
        this.health[EntityType.WOOD_DOOR_SPIKE] = this.config.wood_spike_door_life ?? 100;
        this.health[EntityType.STONE_DOOR_SPIKE] = this.config.stone_spike_door_life ?? 200;
        this.health[EntityType.GOLD_DOOR_SPIKE] = this.config.gold_spike_door_life ?? 400;
        this.health[EntityType.DIAMOND_DOOR_SPIKE] = this.config.diamond_spike_door_life ?? 800;
        this.health[EntityType.AMETHYST_DOOR_SPIKE] = this.config.amethyst_spike_door_life ?? 1600;
        this.health[EntityType.REIDITE_WALL] = this.config.reidite_wall_life ?? 4000;
        this.health[EntityType.REIDITE_DOOR] = this.config.reidite_wall_life ?? 4000;
        this.health[EntityType.REIDITE_SPIKE] = this.config.reidite_spike_life ?? 3000;
        this.health[EntityType.REIDITE_DOOR_SPIKE] = this.config.reidite_spike_door_life ?? 2000;
        this.health[EntityType.WATERMELON_SEED] = 400;
        this.health[EntityType.ALOE_VERA_SEED] = 400;
        this.health[EntityType.WOOD_TOWER] = 2000;
        this.health[EntityType.WOLF] = this.config.wolf_life ?? 230;
        this.health[EntityType.SPIDER] = this.config.spider_life ?? 240;
        this.health[EntityType.FOX] = this.config.fox_life ?? 235;
        this.health[EntityType.BEAR] = this.config.bear_life ?? 220;
        this.health[EntityType.DRAGON] = this.config.dragon_life ?? 225;
        this.health[EntityType.PIRANHA] = this.config.piranha_life ?? 290;
        this.health[EntityType.KRAKEN] = this.config.kraken_life ?? 240;
        this.health[EntityType.CRAB] = this.config.crab_life ?? 320;
        this.health[EntityType.FLAME] = this.config.flame_life ?? 240;
        this.health[EntityType.LAVA_DRAGON] = this.config.lava_dragon_life ?? 245;
        this.health[EntityType.BOAR] = this.config.boar_life ?? 300;
        this.health[EntityType.CRAB_BOSS] = this.config.king_crab_life ?? 240;
        this.health[EntityType.BABY_DRAGON] = this.config.baby_dragon_life ?? 250;
        this.health[EntityType.BABY_LAVA] = this.config.baby_lava_life ?? 270;
        this.health[EntityType.HAWK] = this.config.hawk_life ?? 300;
        this.health[EntityType.VULTURE] = this.config.vulture_life ?? 250;
        this.health[EntityType.SAND_WORM] = this.config.sand_worm_life ?? 250;
        this.health[EntityType.BABY_MAMMOTH] = this.config.baby_mammoth_life ?? 230;
        this.health[EntityType.MAMMOTH] = this.config.mammoth_life ?? 230;
        this.health[EntityType.RABBIT] = this.config.rabbit_life ?? 320;
        this.health[EntityType.TREASURE_CHEST] = this.config.treasure_life ?? 300;
        this.health[EntityType.DEAD_BOX] = 300;
        this.health[EntityType.CRATE] = 30;
        this.health[EntityType.GIFT] = 30;
        this.health[EntityType.PENGUIN] = this.config.penguin_life ?? 320;
    }
}