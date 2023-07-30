export function getDefaultRecipes() {
    return [{
        item: "fire",
        recipe: [
            ["wood", 25],
            ["stone", 5]
        ],
        fire: 0,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5,
        bonus: 17
    }, {
        item: "big_fire",
        recipe: [
            ["fire", 1],
            ["wood", 35],
            ["stone", 10]
        ],
        fire: 0,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5,
        bonus: 20
    }, {
        item: "furnace",
        recipe: [
            ["wood", 150],
            ["stone", 50],
            ["gold", 15]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "workbench",
        recipe: [
            ["wood", 20],
            ["stone", 10]
        ],
        fire: 0,
        water: 0,
        workbench: 0,
        well: 0,
        time: 6,
        bonus: 19
    }, {
        item: "pick_wood",
        recipe: [
            ["wood", 10]
        ],
        fire: 0,
        water: 0,
        workbench: 0,
        well: 0,
        time: 3,
        bonus: 8
    }, {
        item: "pick",
        recipe: [
            ["pick_wood", 1],
            ["wood", 50],
            ["stone", 15]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 8,
        bonus: 31
    }, {
        item: "pick_gold",
        recipe: [
            ["wood", 40],
            ["gold", 20],
            ["stone", 30],
            ["pick", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 12,
        bonus: 51
    }, {
        item: "pick_diamond",
        recipe: [
            ["diamond", 20],
            ["gold", 50],
            ["stone", 80],
            ["pick_gold", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "pick_amethyst",
        recipe: [
            ["diamond", 40],
            ["gold", 60],
            ["amethyst", 30],
            ["pick_diamond", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "pick_reidite",
        recipe: [
            ["amethyst", 30],
            ["diamond", 40],
            ["reidite", 30],
            ["pick_amethyst", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "hammer",
        recipe: [
            ["wood", 90],
            ["stone", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10,
        bonus: 53
    }, {
        item: "hammer_gold",
        recipe: [
            ["wood", 160],
            ["stone", 120],
            ["gold", 80],
            ["hammer", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 15
    }, {
        item: "hammer_diamond",
        recipe: [
            ["diamond", 80],
            ["stone", 200],
            ["gold", 150],
            ["hammer_gold", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "hammer_amethyst",
        recipe: [
            ["diamond", 160],
            ["amethyst", 60],
            ["gold", 250],
            ["hammer_diamond", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "hammer_reidite",
        recipe: [
            ["amethyst", 160],
            ["reidite", 60],
            ["diamond", 250],
            ["hammer_amethyst", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "super_hammer",
        recipe: [
            ["hammer_reidite", 1],
            ["bottle_full", 1],
            ["kraken_skin", 1],
            ["scales", 10],
            ["amethyst", 20]
        ],
        fire: 1,
        water: 0,
        workbench: 1,
        well: 0,
        time: 120
    }, {
        item: "shovel",
        recipe: [
            ["wood", 30],
            ["stone", 15]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5,
        bonus: 21
    }, {
        item: "shovel_gold",
        recipe: [
            ["shovel", 1],
            ["gold", 20],
            ["stone", 30],
            ["wood", 40]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10,
        bonus: 47
    }, {
        item: "shovel_diamond",
        recipe: [
            ["shovel_gold", 1],
            ["diamond", 20],
            ["gold", 50],
            ["stone", 80]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "shovel_amethyst",
        recipe: [
            ["shovel_diamond", 1],
            ["gold", 60],
            ["amethyst", 30],
            ["diamond", 40]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 40
    }, {
        item: "watering_can",
        recipe: [
            ["wood", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "watering_can_full",
        recipe: [
            ["watering_can", 1]
        ],
        fire: 0,
        water: 1,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "pitchfork",
        recipe: [
            ["wood", 100],
            ["stone", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10,
        bonus: 51
    }, {
        item: "pitchfork2",
        recipe: [
            ["pitchfork", 1],
            ["pitchfork_part", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "book",
        recipe: [
            ["paper", 4],
            ["cord", 4],
            ["fur_wolf", 4]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 15,
        bonus: 430
    }, {
        item: "wood_spear",
        recipe: [
            ["wood", 40]
        ],
        fire: 0,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5,
        bonus: 18
    }, {
        item: "spear",
        recipe: [
            ["wood_spear", 1],
            ["wood", 60],
            ["stone", 10]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10
    }, {
        item: "gold_spear",
        recipe: [
            ["wood", 80],
            ["gold", 30],
            ["stone", 30],
            ["spear", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "diamond_spear",
        recipe: [
            ["wood", 200],
            ["diamond", 40],
            ["gold", 60],
            ["gold_spear", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 30
    }, {
        item: "amethyst_spear",
        recipe: [
            ["amethyst", 40],
            ["diamond", 80],
            ["gold", 90],
            ["diamond_spear", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "reidite_spear",
        recipe: [
            ["reidite", 40],
            ["amethyst", 80],
            ["diamond", 90],
            ["amethyst_spear", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "dragon_spear",
        recipe: [
            ["blue_cord", 20],
            ["dragon_orb", 1],
            ["amethyst", 100],
            ["dragon_heart", 3]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 120
    }, {
        item: "lava_spear",
        recipe: [
            ["dragon_spear", 1],
            ["lava_orb", 1],
            ["reidite", 100],
            ["lava_heart", 2]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 200
    }, {
        item: "crab_spear",
        recipe: [
            ["wood_spear", 1],
            ["crab_loot", 5],
            ["cord", 6]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 30
    }, {
        item: "sword_wood",
        recipe: [
            ["wood", 30]
        ],
        fire: 0,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5,
        bonus: 16
    }, {
        item: "sword",
        recipe: [
            ["wood", 50],
            ["stone", 25],
            ["sword_wood", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10,
        bonus: 38
    }, {
        item: "sword_gold",
        recipe: [
            ["wood", 60],
            ["gold", 40],
            ["stone", 50],
            ["sword", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20,
        bonus: 87
    }, {
        item: "sword_diamond",
        recipe: [
            ["diamond", 40],
            ["gold", 60],
            ["stone", 80],
            ["sword_gold", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 30
    }, {
        item: "sword_amethyst",
        recipe: [
            ["diamond", 60],
            ["gold", 100],
            ["amethyst", 40],
            ["sword_diamond", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "reidite_sword",
        recipe: [
            ["diamond", 100],
            ["amethyst", 80],
            ["reidite", 40],
            ["sword_amethyst", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "seed",
        recipe: [
            ["plant", 3]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5,
        bonus: 11
    }, {
        item: "wheat_seed",
        recipe: [
            ["wild_wheat", 3]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "pumpkin_seed",
        recipe: [
            ["pumpkin", 8]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "garlic_seed",
        recipe: [
            ["garlic", 8]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "thornbush_seed",
        recipe: [
            ["thornbush", 8]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "carrot_seed",
        recipe: [
            ["carrot", 8]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "tomato_seed",
        recipe: [
            ["tomato", 8]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "watermelon_seed",
        recipe: [
            ["watermelon", 16]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "aloe_vera_seed",
        recipe: [
            ["aloe_vera", 16]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "cooked_meat",
        recipe: [
            ["meat", 1]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5,
        bonus: 40
    }, {
        item: "foodfish_cooked",
        recipe: [
            ["foodfish", 1]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 3
    }, {
        item: "bread",
        recipe: [
            ["flour", 3]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 3
    }, {
        item: "cookie",
        recipe: [
            ["flour", 3],
            ["plant", 1]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 3
    }, {
        item: "cake",
        recipe: [
            ["flour", 5],
            ["plant", 2],
            ["ice", 2]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "bandage",
        recipe: [
            ["cord", 2]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5,
        bonus: 110
    }, {
        item: "wall",
        recipe: [
            ["wood", 20]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5,
        bonus: 14
    }, {
        item: "stone_wall",
        recipe: [
            ["wall", 1],
            ["stone", 17]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5,
        bonus: 16
    }, {
        item: "gold_wall",
        recipe: [
            ["stone_wall", 1],
            ["gold", 14]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5,
        bonus: 17
    }, {
        item: "diamond_wall",
        recipe: [
            ["gold_wall", 1],
            ["diamond", 11]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "amethyst_wall",
        recipe: [
            ["diamond_wall", 1],
            ["amethyst", 8]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "reidite_wall",
        recipe: [
            ["amethyst_wall", 1],
            ["reidite", 5]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "wood_door",
        recipe: [
            ["wood", 30]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 8
    }, {
        item: "stone_door",
        recipe: [
            ["wood_door", 1],
            ["stone", 27]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 8
    }, {
        item: "gold_door",
        recipe: [
            ["stone_door", 1],
            ["gold", 24]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 8
    }, {
        item: "diamond_door",
        recipe: [
            ["gold_door", 1],
            ["diamond", 21]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 8
    }, {
        item: "amethyst_door",
        recipe: [
            ["diamond_door", 1],
            ["amethyst", 18]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 8
    }, {
        item: "reidite_door",
        recipe: [
            ["amethyst_door", 1],
            ["reidite", 15]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 8
    }, {
        item: "spike",
        recipe: [
            ["wall", 1],
            ["wood", 40],
            ["stone", 30]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "stone_spike",
        recipe: [
            ["stone_wall", 1],
            ["stone", 70]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "gold_spike",
        recipe: [
            ["gold_wall", 1],
            ["gold", 40],
            ["stone", 30]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "diamond_spike",
        recipe: [
            ["diamond_wall", 1],
            ["diamond", 40],
            ["stone", 30]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "amethyst_spike",
        recipe: [
            ["amethyst_wall", 1],
            ["amethyst", 40],
            ["stone", 30]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "reidite_spike",
        recipe: [
            ["reidite_wall", 1],
            ["reidite", 40],
            ["gold", 30]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "wood_door_spike",
        recipe: [
            ["wood_door", 1],
            ["wood", 80],
            ["stone", 60]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "stone_door_spike",
        recipe: [
            ["stone_door", 1],
            ["stone", 140]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "gold_door_spike",
        recipe: [
            ["gold_door", 1],
            ["gold", 80],
            ["stone", 60]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "diamond_door_spike",
        recipe: [
            ["diamond_door", 1],
            ["diamond", 80],
            ["stone", 60]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "amethyst_door_spike",
        recipe: [
            ["amethyst_door", 1],
            ["amethyst", 80],
            ["stone", 60]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "reidite_door_spike",
        recipe: [
            ["reidite_door", 1],
            ["reidite", 80],
            ["gold", 60]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "chest",
        recipe: [
            ["wood", 25],
            ["gold", 2]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5,
        bonus: 16
    }, {
        item: "explorer_hat",
        recipe: [
            ["paper", 1],
            ["fur", 1],
            ["cord", 2]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "pirate_hat",
        recipe: [
            ["paper", 5],
            ["penguin_feather", 20],
            ["blue_cord", 5],
            ["fur", 5]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 30
    }, {
        item: "pilot_helmet",
        recipe: [
            ["pilot_glasses", 1],
            ["hawk_feather", 8],
            ["vulture_feather", 8],
            ["penguin_feather", 8],
            ["cord", 6]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "earmuffs",
        recipe: [
            ["fur", 1],
            ["cord", 2]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5,
        bonus: 140
    }, {
        item: "coat",
        recipe: [
            ["earmuffs", 1],
            ["fur_wolf", 5],
            ["cord", 4]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 12,
        bonus: 474
    }, {
        item: "cap_scarf",
        recipe: [
            ["coat", 1],
            ["fur_winter", 5],
            ["blue_cord", 4]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 30
    }, {
        item: "fur_hat",
        recipe: [
            ["cap_scarf", 1],
            ["fur_winter", 5],
            ["fur_mammoth", 10],
            ["blue_cord", 4]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 50
    }, {
        item: "wood_helmet",
        recipe: [
            ["wood", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 0,
        well: 0,
        time: 5,
        bonus: 20
    }, {
        item: "stone_helmet",
        recipe: [
            ["stone", 75],
            ["wood", 75],
            ["wood_helmet", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10,
        bonus: 58
    }, {
        item: "gold_helmet",
        recipe: [
            ["stone", 90],
            ["wood", 90],
            ["gold", 90],
            ["stone_helmet", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "diamond_helmet",
        recipe: [
            ["stone", 100],
            ["gold", 100],
            ["diamond", 100],
            ["gold_helmet", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 30
    }, {
        item: "amethyst_helmet",
        recipe: [
            ["amethyst", 80],
            ["gold", 150],
            ["diamond", 120],
            ["diamond_helmet", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "reidite_helmet",
        recipe: [
            ["reidite", 80],
            ["diamond", 150],
            ["amethyst", 120],
            ["amethyst_helmet", 1]
        ],
        fire: 1,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "diving_mask",
        recipe: [
            ["scales", 2],
            ["diamond", 40],
            ["cord", 4]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "super_diving_suit",
        recipe: [
            ["diving_mask", 1],
            ["gold", 80],
            ["kraken_skin", 1],
            ["amethyst", 20]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "diamond_protection",
        recipe: [
            ["flame", 5],
            ["diamond", 50],
            ["blue_cord", 5]
        ],
        fire: 1,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "amethyst_protection",
        recipe: [
            ["diamond_protection", 1],
            ["flame", 10],
            ["amethyst", 50]
        ],
        fire: 1,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "reidite_protection",
        recipe: [
            ["amethyst_protection", 1],
            ["flame", 15],
            ["amethyst", 50],
            ["reidite", 50]
        ],
        fire: 1,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "turban1",
        recipe: [
            ["cord", 4],
            ["fur_boar", 2]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 15
    }, {
        item: "turban2",
        recipe: [
            ["turban1", 1],
            ["cord", 6],
            ["fur_boar", 4],
            ["vulture_feather", 12],
            ["penguin_feather", 4]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 150
    }, {
        item: "bag",
        recipe: [
            ["cord", 6],
            ["fur_wolf", 5]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 15,
        bonus: 580
    }, {
        item: "paper",
        recipe: [
            ["wood", 20]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 3,
        bonus: 10
    }, {
        item: "blue_cord",
        recipe: [
            ["diamond", 1],
            ["cord", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 3
    }, {
        item: "lock",
        recipe: [
            ["gold", 10]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "lockpick",
        recipe: [
            ["gold", 250]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "totem",
        recipe: [
            ["wood", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10
    }, {
        item: "bridge",
        recipe: [
            ["wood", 15]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "roof",
        recipe: [
            ["wood", 30]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "wood_tower",
        recipe: [
            ["wood", 120]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 15
    }, {
        item: "plot",
        recipe: [
            ["wood", 20],
            ["ground", 15]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "bottle_empty",
        recipe: [
            ["sand", 25]
        ],
        fire: 1,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "bottle_full",
        recipe: [
            ["bottle_empty", 1]
        ],
        fire: 0,
        water: 1,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "bottle_full",
        recipe: [
            ["ice", 20],
            ["bottle_empty", 1]
        ],
        fire: 1,
        water: 0,
        workbench: 0,
        well: 0,
        time: 10
    }, {
        item: "bottle_full",
        recipe: [
            ["bottle_empty", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 0,
        well: 1,
        time: 3
    }, {
        item: "windmill",
        recipe: [
            ["wood", 60],
            ["stone", 20],
            ["cord", 2]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10
    }, {
        item: "resurrection",
        recipe: [
            ["diamond", 40],
            ["stone", 45]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "emerald_machine",
        recipe: [
            ["resurrection", 1],
            ["emerald", 40],
            ["sandworm_juice", 1]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 200
    }, {
        item: "extractor_machine_stone",
        recipe: [
            ["wood", 50],
            ["stone", 100]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "extractor_machine_gold",
        recipe: [
            ["stone", 60],
            ["gold", 120]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "extractor_machine_diamond",
        recipe: [
            ["gold", 70],
            ["diamond", 140]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "extractor_machine_amethyst",
        recipe: [
            ["diamond", 80],
            ["amethyst", 160]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "extractor_machine_reidite",
        recipe: [
            ["amethyst", 90],
            ["reidite", 180]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "spanner",
        recipe: [
            ["stone", 70]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10
    }, {
        item: "machete",
        recipe: [
            ["stone", 70],
            ["wood", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10,
        bonus: 51
    }, {
        item: "bread_oven",
        recipe: [
            ["wood", 40],
            ["stone", 40]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10,
        bonus: 40
    }, {
        item: "sandwich",
        recipe: [
            ["bread", 1],
            ["cooked_meat", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 0,
        well: 0,
        time: 3,
        bonus: 6
    }, {
        item: "dragon_helmet",
        recipe: [
            ["blue_cord", 30],
            ["dragon_cube", 1],
            ["amethyst", 150],
            ["dragon_heart", 3]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 120
    }, {
        item: "lava_helmet",
        recipe: [
            ["dragon_helmet", 1],
            ["lava_cube", 1],
            ["reidite", 150],
            ["lava_heart", 2]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 180
    }, {
        item: "crown_crab",
        recipe: [
            ["gold_helmet", 1],
            ["crab_loot", 10],
            ["crab_stick", 10],
            ["cord", 10]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "dragon_sword",
        recipe: [
            ["blue_cord", 20],
            ["dragon_orb", 1],
            ["amethyst", 150],
            ["dragon_heart", 3]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 120
    }, {
        item: "lava_sword",
        recipe: [
            ["dragon_sword", 1],
            ["lava_orb", 1],
            ["reidite", 150],
            ["lava_heart", 2]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 180
    }, {
        item: "wood_bow",
        recipe: [
            ["wood", 100],
            ["cord", 4]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "wood_arrow",
        recipe: [
            ["wood", 30]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "stone_bow",
        recipe: [
            ["stone", 200],
            ["cord", 8],
            ["penguin_feather", 4],
            ["wood_bow", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 25
    }, {
        item: "stone_arrow",
        recipe: [
            ["stone", 20],
            ["hawk_feather", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "gold_bow",
        recipe: [
            ["gold", 200],
            ["cord", 12],
            ["hawk_feather", 4],
            ["penguin_feather", 4],
            ["stone_bow", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 30
    }, {
        item: "gold_arrow",
        recipe: [
            ["gold", 20],
            ["penguin_feather", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10
    }, {
        item: "diamond_bow",
        recipe: [
            ["diamond", 200],
            ["blue_cord", 10],
            ["hawk_feather", 8],
            ["penguin_feather", 8],
            ["gold_bow", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 35
    }, {
        item: "diamond_arrow",
        recipe: [
            ["diamond", 10],
            ["penguin_feather", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10
    }, {
        item: "amethyst_bow",
        recipe: [
            ["amethyst", 200],
            ["blue_cord", 10],
            ["penguin_feather", 8],
            ["vulture_feather", 8],
            ["diamond_bow", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 40
    }, {
        item: "amethyst_arrow",
        recipe: [
            ["amethyst", 10],
            ["vulture_feather", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 15
    }, {
        item: "reidite_bow",
        recipe: [
            ["reidite", 200],
            ["blue_cord", 10],
            ["kraken_skin", 1],
            ["amethyst_bow", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 45
    }, {
        item: "reidite_arrow",
        recipe: [
            ["reidite", 10],
            ["vulture_feather", 1],
            ["flame", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 15
    }, {
        item: "dragon_bow",
        recipe: [
            ["emerald", 200],
            ["blue_cord", 10],
            ["dragon_orb", 1],
            ["reidite_bow", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 50
    }, {
        item: "dragon_arrow",
        recipe: [
            ["emerald", 10],
            ["sandworm_juice", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "wood_shield",
        recipe: [
            ["wood", 100]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 25
    }, {
        item: "stone_shield",
        recipe: [
            ["wood_shield", 1],
            ["stone", 100],
            ["wood", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 40
    }, {
        item: "gold_shield",
        recipe: [
            ["stone_shield", 1],
            ["gold", 50],
            ["stone", 50],
            ["wood", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 50
    }, {
        item: "diamond_shield",
        recipe: [
            ["gold_shield", 1],
            ["diamond", 50],
            ["gold", 50],
            ["stone", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 70
    }, {
        item: "amethyst_shield",
        recipe: [
            ["diamond_shield", 1],
            ["amethyst", 50],
            ["diamond", 50],
            ["gold", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 90
    }, {
        item: "reidite_shield",
        recipe: [
            ["amethyst_shield", 1],
            ["reidite", 50],
            ["amethyst", 50],
            ["diamond", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 120
    }, {
        item: "crown_green",
        recipe: [
            ["gemme_green", 1],
            ["gold", 200]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "crown_orange",
        recipe: [
            ["gemme_orange", 1],
            ["gold", 200]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "crown_blue",
        recipe: [
            ["gemme_blue", 1],
            ["gold", 200],
            ["dragon_heart", 1]
        ],
        fire: 1,
        water: 1,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "hood",
        recipe: [
            ["fur_wolf", 10],
            ["fur", 5],
            ["cord", 6]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10
    }, {
        item: "peasant",
        recipe: [
            ["fur", 3],
            ["cord", 2]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10,
        bonus: 214
    }, {
        item: "winter_hood",
        recipe: [
            ["hood", 1],
            ["special_fur_", 1],
            ["fur_winter", 15],
            ["blue_cord", 5],
            ["penguin_feather", 8]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "winter_peasant",
        recipe: [
            ["peasant", 1],
            ["special_fur", 1],
            ["fur_winter", 10],
            ["blue_cord", 5],
            ["penguin_feather", 8]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 60
    }, {
        item: "bucket_full",
        recipe: [
            ["bucket_empty", 1]
        ],
        fire: 0,
        water: 1,
        workbench: 0,
        well: 0,
        time: 5
    }, {
        item: "bucket_empty",
        recipe: [
            ["wood", 20],
            ["cord", 1]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "well",
        recipe: [
            ["stone", 100],
            ["ground", 30]
        ],
        fire: 1,
        water: 0,
        workbench: 1,
        well: 0,
        time: 10
    }, {
        item: "sign",
        recipe: [
            ["wood", 20]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 5
    }, {
        item: "bed",
        recipe: [
            ["wood", 100],
            ["stone", 50],
            ["fur", 5],
            ["fur_wolf", 5],
            ["cord", 6]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "boat",
        recipe: [
            ["wood", 250],
            ["blue_cord", 10],
            ["fur_winter", 2],
            ["scales", 2]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 50
    }, {
        item: "sled",
        recipe: [
            ["wood", 250],
            ["cord", 10],
            ["fur_winter", 2],
            ["penguin_feather", 8]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 50
    }, {
        item: "saddle",
        recipe: [
            ["cord", 10],
            ["fur_wolf", 6],
            ["fur", 4],
            ["sand", 50]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 20
    }, {
        item: "plane",
        recipe: [
            ["wood", 250],
            ["cord", 10],
            ["paper", 10],
            ["hawk_feather", 8]
        ],
        fire: 0,
        water: 0,
        workbench: 1,
        well: 0,
        time: 50
    }];
}