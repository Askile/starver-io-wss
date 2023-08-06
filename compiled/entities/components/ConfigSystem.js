"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigSystem = void 0;
const EntityType_1 = require("../../enums/EntityType");
class ConfigSystem {
    speed;
    config;
    health;
    constructor(config) {
        this.config = config;
        this.speed = [];
        this.health = [];
        this.setupSpeed();
        this.setupHealth();
    }
    setupSpeed() {
        this.speed[EntityType_1.EntityType.PLAYERS] = this.config.speed ?? 240;
        this.speed[EntityType_1.EntityType.FIRE] = 0;
        this.speed[EntityType_1.EntityType.WORKBENCH] = 0;
        this.speed[EntityType_1.EntityType.SEED] = 0;
        this.speed[EntityType_1.EntityType.WALL] = 0;
        this.speed[EntityType_1.EntityType.SPIKE] = 0;
        this.speed[EntityType_1.EntityType.BIG_FIRE] = 0;
        this.speed[EntityType_1.EntityType.STONE_WALL] = 0;
        this.speed[EntityType_1.EntityType.GOLD_WALL] = 0;
        this.speed[EntityType_1.EntityType.DIAMOND_WALL] = 0;
        this.speed[EntityType_1.EntityType.WOOD_DOOR] = 0;
        this.speed[EntityType_1.EntityType.CHEST] = 0;
        this.speed[EntityType_1.EntityType.STONE_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.GOLD_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.DIAMOND_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.STONE_DOOR] = 0;
        this.speed[EntityType_1.EntityType.GOLD_DOOR] = 0;
        this.speed[EntityType_1.EntityType.DIAMOND_DOOR] = 0;
        this.speed[EntityType_1.EntityType.FURNACE] = 0;
        this.speed[EntityType_1.EntityType.AMETHYST_WALL] = 0;
        this.speed[EntityType_1.EntityType.AMETHYST_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.AMETHYST_DOOR] = 0;
        this.speed[EntityType_1.EntityType.RESURRECTION] = 0;
        this.speed[EntityType_1.EntityType.EMERALD_MACHINE] = 0;
        this.speed[EntityType_1.EntityType.EXTRACTOR_MACHINE_STONE] = 0;
        this.speed[EntityType_1.EntityType.EXTRACTOR_MACHINE_GOLD] = 0;
        this.speed[EntityType_1.EntityType.EXTRACTOR_MACHINE_DIAMOND] = 0;
        this.speed[EntityType_1.EntityType.EXTRACTOR_MACHINE_AMETHYST] = 0;
        this.speed[EntityType_1.EntityType.EXTRACTOR_MACHINE_REIDITE] = 0;
        this.speed[EntityType_1.EntityType.TOTEM] = 0;
        this.speed[EntityType_1.EntityType.BRIDGE] = 0;
        this.speed[EntityType_1.EntityType.WHEAT_SEED] = 0;
        this.speed[EntityType_1.EntityType.WINDMILL] = 0;
        this.speed[EntityType_1.EntityType.PLOT] = 0;
        this.speed[EntityType_1.EntityType.BREAD_OVEN] = 0;
        this.speed[EntityType_1.EntityType.WELL] = 0;
        this.speed[EntityType_1.EntityType.SIGN] = 0;
        this.speed[EntityType_1.EntityType.PUMPKIN_SEED] = 0;
        this.speed[EntityType_1.EntityType.ROOF] = 0;
        this.speed[EntityType_1.EntityType.GARLIC_SEED] = 0;
        this.speed[EntityType_1.EntityType.THORNBUSH_SEED] = 0;
        this.speed[EntityType_1.EntityType.BED] = 0;
        this.speed[EntityType_1.EntityType.GARLAND] = 0;
        this.speed[EntityType_1.EntityType.TOMATO_SEED] = 0;
        this.speed[EntityType_1.EntityType.CARROT_SEED] = 0;
        this.speed[EntityType_1.EntityType.WOOD_DOOR_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.STONE_DOOR_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.GOLD_DOOR_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.DIAMOND_DOOR_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.AMETHYST_DOOR_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.REIDITE_WALL] = 0;
        this.speed[EntityType_1.EntityType.REIDITE_DOOR] = 0;
        this.speed[EntityType_1.EntityType.REIDITE_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.REIDITE_DOOR_SPIKE] = 0;
        this.speed[EntityType_1.EntityType.WATERMELON_SEED] = 0;
        this.speed[EntityType_1.EntityType.ALOE_VERA_SEED] = 0;
        this.speed[EntityType_1.EntityType.WOOD_TOWER] = 0;
        this.speed[EntityType_1.EntityType.WOLF] = this.config.speed_wolf ?? 230;
        this.speed[EntityType_1.EntityType.SPIDER] = this.config.speed_spider ?? 240;
        this.speed[EntityType_1.EntityType.FOX] = this.config.speed_fox ?? 235;
        this.speed[EntityType_1.EntityType.BEAR] = this.config.speed_bear ?? 220;
        this.speed[EntityType_1.EntityType.DRAGON] = this.config.speed_dragon ?? 225;
        this.speed[EntityType_1.EntityType.PIRANHA] = this.config.speed_piranha ?? 290;
        this.speed[EntityType_1.EntityType.KRAKEN] = this.config.speed_kraken ?? 240;
        this.speed[EntityType_1.EntityType.CRAB] = this.config.speed_crab ?? 320;
        this.speed[EntityType_1.EntityType.FLAME] = this.config.speed_flame ?? 240;
        this.speed[EntityType_1.EntityType.LAVA_DRAGON] = this.config.speed_lava_dragon ?? 245;
        this.speed[EntityType_1.EntityType.BOAR] = this.config.speed_boar ?? 300;
        this.speed[EntityType_1.EntityType.CRAB_BOSS] = this.config.speed_king_crab ?? 240;
        this.speed[EntityType_1.EntityType.BABY_DRAGON] = this.config.speed_baby_dragon ?? 250;
        this.speed[EntityType_1.EntityType.BABY_LAVA] = this.config.speed_baby_lava ?? 270;
        this.speed[EntityType_1.EntityType.HAWK] = this.config.speed_hawk ?? 300;
        this.speed[EntityType_1.EntityType.VULTURE] = this.config.speed_vulture ?? 250;
        this.speed[EntityType_1.EntityType.SAND_WORM] = this.config.speed_sand_worm ?? 250;
        this.speed[EntityType_1.EntityType.BABY_MAMMOTH] = this.config.speed_baby_mammoth ?? 230;
        this.speed[EntityType_1.EntityType.MAMMOTH] = this.config.speed_mammoth ?? 230;
        this.speed[EntityType_1.EntityType.WHEAT_MOB] = 0;
        this.speed[EntityType_1.EntityType.RABBIT] = this.config.speed_rabbit ?? 320;
        this.speed[EntityType_1.EntityType.TREASURE_CHEST] = 0;
        this.speed[EntityType_1.EntityType.DEAD_BOX] = 0;
        this.speed[EntityType_1.EntityType.PUMPKIN_MOB] = 0;
        this.speed[EntityType_1.EntityType.GARLIC_MOB] = 0;
        this.speed[EntityType_1.EntityType.THORNBUSH_MOB] = 0;
        this.speed[EntityType_1.EntityType.CRATE] = 0;
        this.speed[EntityType_1.EntityType.GIFT] = 0;
        this.speed[EntityType_1.EntityType.PENGUIN] = this.config.speed_penguin ?? 320;
        this.speed[EntityType_1.EntityType.ALOE_VERA_MOB] = 0;
        this.speed[EntityType_1.EntityType.FIREFLY] = 0;
        this.speed[EntityType_1.EntityType.SPELL] = 0;
        this.speed[EntityType_1.EntityType.FRUIT] = 0;
    }
    setupHealth() {
        this.health[EntityType_1.EntityType.PLAYERS] = 200;
        this.health[EntityType_1.EntityType.FIRE] = 150;
        this.health[EntityType_1.EntityType.WORKBENCH] = 300;
        this.health[EntityType_1.EntityType.SEED] = 700;
        this.health[EntityType_1.EntityType.WALL] = this.config.wood_wall_life ?? 1000;
        this.health[EntityType_1.EntityType.SPIKE] = this.config.wood_spike_life ?? 150;
        this.health[EntityType_1.EntityType.BIG_FIRE] = 400;
        this.health[EntityType_1.EntityType.STONE_WALL] = this.config.stone_wall_life ?? 1500;
        this.health[EntityType_1.EntityType.GOLD_WALL] = this.config.gold_wall_life ?? 2000;
        this.health[EntityType_1.EntityType.DIAMOND_WALL] = this.config.diamond_wall_life ?? 2500;
        this.health[EntityType_1.EntityType.WOOD_DOOR] = this.config.wood_door_life ?? 1000;
        this.health[EntityType_1.EntityType.CHEST] = 500;
        this.health[EntityType_1.EntityType.STONE_SPIKE] = this.config.stone_spike_life ?? 300;
        this.health[EntityType_1.EntityType.GOLD_SPIKE] = this.config.gold_spike_life ?? 600;
        this.health[EntityType_1.EntityType.DIAMOND_SPIKE] = this.config.diamond_spike_life ?? 1200;
        this.health[EntityType_1.EntityType.STONE_DOOR] = this.config.stone_door_life ?? 1500;
        this.health[EntityType_1.EntityType.GOLD_DOOR] = this.config.gold_door_life ?? 2000;
        this.health[EntityType_1.EntityType.DIAMOND_DOOR] = this.config.diamond_door_life ?? 2500;
        this.health[EntityType_1.EntityType.FURNACE] = 1000;
        this.health[EntityType_1.EntityType.AMETHYST_WALL] = this.config.amethyst_wall_life ?? 3500;
        this.health[EntityType_1.EntityType.AMETHYST_SPIKE] = this.config.amethyst_spike_life ?? 2400;
        this.health[EntityType_1.EntityType.AMETHYST_DOOR] = this.config.amethyst_door_life ?? 3500;
        this.health[EntityType_1.EntityType.RESURRECTION] = 200;
        this.health[EntityType_1.EntityType.EMERALD_MACHINE] = 1000;
        this.health[EntityType_1.EntityType.EXTRACTOR_MACHINE_STONE] = 2000;
        this.health[EntityType_1.EntityType.EXTRACTOR_MACHINE_GOLD] = 2000;
        this.health[EntityType_1.EntityType.EXTRACTOR_MACHINE_DIAMOND] = 2000;
        this.health[EntityType_1.EntityType.EXTRACTOR_MACHINE_AMETHYST] = 2000;
        this.health[EntityType_1.EntityType.EXTRACTOR_MACHINE_REIDITE] = 2000;
        this.health[EntityType_1.EntityType.TOTEM] = 300;
        this.health[EntityType_1.EntityType.BRIDGE] = 1000;
        this.health[EntityType_1.EntityType.WHEAT_SEED] = 700;
        this.health[EntityType_1.EntityType.WINDMILL] = 2000;
        this.health[EntityType_1.EntityType.PLOT] = 2000;
        this.health[EntityType_1.EntityType.BREAD_OVEN] = 2000;
        this.health[EntityType_1.EntityType.WELL] = 1000;
        this.health[EntityType_1.EntityType.SIGN] = 200;
        this.health[EntityType_1.EntityType.PUMPKIN_SEED] = 700;
        this.health[EntityType_1.EntityType.ROOF] = 2000;
        this.health[EntityType_1.EntityType.GARLIC_SEED] = 700;
        this.health[EntityType_1.EntityType.THORNBUSH_SEED] = 700;
        this.health[EntityType_1.EntityType.BED] = 400;
        this.health[EntityType_1.EntityType.GARLAND] = 0;
        this.health[EntityType_1.EntityType.TOMATO_SEED] = 700;
        this.health[EntityType_1.EntityType.CARROT_SEED] = 700;
        this.health[EntityType_1.EntityType.WOOD_DOOR_SPIKE] = this.config.wood_spike_door_life ?? 100;
        this.health[EntityType_1.EntityType.STONE_DOOR_SPIKE] = this.config.stone_spike_door_life ?? 200;
        this.health[EntityType_1.EntityType.GOLD_DOOR_SPIKE] = this.config.gold_spike_door_life ?? 400;
        this.health[EntityType_1.EntityType.DIAMOND_DOOR_SPIKE] = this.config.diamond_spike_door_life ?? 800;
        this.health[EntityType_1.EntityType.AMETHYST_DOOR_SPIKE] = this.config.amethyst_spike_door_life ?? 1600;
        this.health[EntityType_1.EntityType.REIDITE_WALL] = this.config.reidite_wall_life ?? 4000;
        this.health[EntityType_1.EntityType.REIDITE_DOOR] = this.config.reidite_wall_life ?? 4000;
        this.health[EntityType_1.EntityType.REIDITE_SPIKE] = this.config.reidite_spike_life ?? 3000;
        this.health[EntityType_1.EntityType.REIDITE_DOOR_SPIKE] = this.config.reidite_spike_door_life ?? 2000;
        this.health[EntityType_1.EntityType.WATERMELON_SEED] = 400;
        this.health[EntityType_1.EntityType.ALOE_VERA_SEED] = 400;
        this.health[EntityType_1.EntityType.WOOD_TOWER] = 2000;
        this.health[EntityType_1.EntityType.WOLF] = this.config.speed_wolf ?? 230;
        this.health[EntityType_1.EntityType.SPIDER] = this.config.speed_spider ?? 240;
        this.health[EntityType_1.EntityType.FOX] = this.config.speed_fox ?? 235;
        this.health[EntityType_1.EntityType.BEAR] = this.config.speed_bear ?? 220;
        this.health[EntityType_1.EntityType.DRAGON] = this.config.speed_dragon ?? 225;
        this.health[EntityType_1.EntityType.PIRANHA] = this.config.speed_piranha ?? 290;
        this.health[EntityType_1.EntityType.KRAKEN] = this.config.speed_kraken ?? 240;
        this.health[EntityType_1.EntityType.CRAB] = this.config.speed_crab ?? 320;
        this.health[EntityType_1.EntityType.FLAME] = this.config.speed_flame ?? 240;
        this.health[EntityType_1.EntityType.LAVA_DRAGON] = this.config.speed_lava_dragon ?? 245;
        this.health[EntityType_1.EntityType.BOAR] = this.config.speed_boar ?? 300;
        this.health[EntityType_1.EntityType.CRAB_BOSS] = this.config.speed_king_crab ?? 240;
        this.health[EntityType_1.EntityType.BABY_DRAGON] = this.config.speed_baby_dragon ?? 250;
        this.health[EntityType_1.EntityType.BABY_LAVA] = this.config.speed_baby_lava ?? 270;
        this.health[EntityType_1.EntityType.HAWK] = this.config.speed_hawk ?? 300;
        this.health[EntityType_1.EntityType.VULTURE] = this.config.speed_vulture ?? 250;
        this.health[EntityType_1.EntityType.SAND_WORM] = this.config.speed_sand_worm ?? 250;
        this.health[EntityType_1.EntityType.BABY_MAMMOTH] = this.config.speed_baby_mammoth ?? 230;
        this.health[EntityType_1.EntityType.MAMMOTH] = this.config.speed_mammoth ?? 230;
        this.health[EntityType_1.EntityType.WHEAT_MOB] = 0;
        this.health[EntityType_1.EntityType.RABBIT] = this.config.speed_rabbit ?? 320;
        this.health[EntityType_1.EntityType.TREASURE_CHEST] = this.config.treasure_life ?? 300;
        this.health[EntityType_1.EntityType.DEAD_BOX] = 300;
        this.health[EntityType_1.EntityType.PUMPKIN_MOB] = 0;
        this.health[EntityType_1.EntityType.GARLIC_MOB] = 0;
        this.health[EntityType_1.EntityType.THORNBUSH_MOB] = 0;
        this.health[EntityType_1.EntityType.CRATE] = 30;
        this.health[EntityType_1.EntityType.GIFT] = 30;
        this.health[EntityType_1.EntityType.PENGUIN] = this.config.speed_penguin ?? 320;
        this.health[EntityType_1.EntityType.ALOE_VERA_MOB] = 0;
        this.health[EntityType_1.EntityType.FIREFLY] = 0;
        this.health[EntityType_1.EntityType.SPELL] = 0;
        this.health[EntityType_1.EntityType.FRUIT] = 0;
    }
}
exports.ConfigSystem = ConfigSystem;
