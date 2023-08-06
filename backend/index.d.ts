declare interface LoggerOptions {
    console: boolean;
    file: boolean;
}
declare interface Math {
    clamp: (variable: number, min: number, max: number) => number;
}

declare interface Camera {
    width: number;
    height: number;
}

declare interface PlayerStats {
    kills: number;
    score: number;
    time: number;
}

declare interface PlayerCosmetics {
    skin: number;
    accessory: number;
    book: number;
    bag: number;
    crate: number;
    dead: number;
}

declare interface PlayerData {
    nickname: string;
    token: string;
    level: number;
}
declare interface Config {
    port: number;
    important: Important;
    password: number;
    harvest: number;
    resource_delay: number;
    resource_delay_min: number;
    spawn_location: number;
    disable_attack: number;
    disable_mob_safety: number;
    disable_pvp: number;
    disable_kit: number;
    disable_shop: number;
    disable_recycling: number;
    disable_craft: number;
    disable_craft_score: number;
    disable_gather_score: number;
    disable_gather_building: number;
    disable_resource: number;
    disable_quest: number;
    disable_recipe: number;
    disable_clock: number;
    disable_drop: number;
    disable_drop_crate: number;
    disable_crate: number;
    disable_warm_gauge: number;
    disable_nickname: number;
    default_nickname: number;
    disable_chat: number;
    instant_craft: number;
    weapon_delay: number;
    build_delay: number;
    helmet_delay: number;
    team_mode: number;
    damage_water: number;
    drink_water: number;
    damage_oxygen: number;
    damage_food: number;
    damage_cold: number;
    damage_cold_winter: number;
    damage_warm: number;
    damage_blizzard: number;
    damage_sand: number;
    damage_sand_turban1: number;
    damage_sand_turban2: number;
    heal: number;
    damage_raw_food: number;
    delay_gauges: number;
    reduce_oxygen: number;
    heal_oxygen: number;
    reduce_water: number;
    reduce_more_water: number;
    reduce_water_bed: number;
    reduce_food: number;
    reduce_food_bed: number;
    reduce_cold_day: number;
    reduce_cold_night: number;
    reduce_cold_water_day: number;
    reduce_cold_water_night: number;
    reduce_cold_winter_day: number;
    reduce_cold_winter_night: number;
    increase_cold_desert_day: number;
    increase_cold_desert_night: number;
    increase_cold_lava: number;
    increase_cold_on_fire: number;
    fire_warm: number;
    fire_hot: number;
    default_score: number;
    score_per_day: number;
    score_per_grind: number;
    score_per_kill: number;
    bandage_heal_effect: number;
    bandage_stack_limit: number;
    bandage_heal: number;
    bed_heal: number;
    crown_green_heal: number;
    speed: number;
    speed_weapon: number;
    speed_water: number;
    speed_water_weapon: number;
    speed_winter: number;
    speed_winter_weapon: number;
    speed_desert: number;
    speed_desert_weapon: number;
    speed_lava: number;
    speed_lava_weapon: number;
    speed_diving: number;
    speed_diving_weapon: number;
    speed_collide: number;
    speed_attacking: number;
    speed_attacking_mount: number;
    speed_mount_king_crab: number;
    speed_mount_king_crab_water: number;
    speed_mount_king_crab_winter: number;
    speed_mount_king_crab_lava: number;
    speed_mount_king_crab_desert: number;
    speed_mount_boar: number;
    speed_mount_boar_water: number;
    speed_mount_boar_winter: number;
    speed_mount_boar_lava: number;
    speed_mount_boar_desert: number;
    speed_mount_baby_mammoth: number;
    speed_mount_baby_mammoth_water: number;
    speed_mount_baby_mammoth_winter: number;
    speed_mount_baby_mammoth_lava: number;
    speed_mount_baby_mammoth_desert: number;
    speed_mount_baby_dragon: number;
    speed_mount_baby_dragon_water: number;
    speed_mount_baby_dragon_winter: number;
    speed_mount_baby_dragon_lava: number;
    speed_mount_baby_dragon_desert: number;
    speed_mount_baby_lava: number;
    speed_mount_baby_lava_water: number;
    speed_mount_baby_lava_winter: number;
    speed_mount_baby_lava_lava: number;
    speed_mount_baby_lava_desert: number;
    speed_mount_hawk: number;
    speed_mount_hawk_water: number;
    speed_mount_hawk_winter: number;
    speed_mount_hawk_lava: number;
    speed_mount_hawk_desert: number;
    speed_mount_plane: number;
    speed_mount_plane_water: number;
    speed_mount_plane_winter: number;
    speed_mount_plane_lava: number;
    speed_mount_plane_desert: number;
    speed_boat: number;
    speed_sled: number;
    speed_vehicle_min: number;
    speed_vehicle_slow_down: number;
    treasure_life: number;
    max_treasure: number;
    wheat_life: number;
    max_wheat: number;
    rabbit_life: number;
    speed_rabbit: number;
    max_rabbit: number;
    spider_life: number;
    speed_spider: number;
    max_spider: number;
    damage_spider: number;
    damage_speed_spider: number;
    spider_web_delay: number;
    wolf_life: number;
    speed_wolf: number;
    max_wolf: number;
    damage_wolf: number;
    damage_speed_wolf: number;
    baby_mammoth_life: number;
    speed_baby_mammoth: number;
    max_baby_mammoth: number;
    damage_baby_mammoth: number;
    damage_speed_baby_mammoth: number;
    tame_baby_mammoth: number;
    mammoth_life: number;
    speed_mammoth: number;
    max_mammoth: number;
    damage_mammoth: number;
    damage_speed_mammoth: number;
    boar_life: number;
    speed_boar: number;
    max_boar: number;
    damage_boar: number;
    damage_speed_boar: number;
    tame_boar: number;
    penguin_life: number;
    speed_penguin: number;
    max_penguin: number;
    fox_life: number;
    speed_fox: number;
    max_fox: number;
    damage_fox: number;
    damage_speed_fox: number;
    bear_life: number;
    speed_bear: number;
    max_bear: number;
    damage_bear: number;
    damage_speed_bear: number;
    vulture_life: number;
    speed_vulture: number;
    max_vulture: number;
    damage_vulture: number;
    damage_speed_vulture: number;
    sand_worm_life: number;
    speed_sand_worm: number;
    max_sand_worm: number;
    damage_sand_worm: number;
    damage_speed_sand_worm: number;
    hawk_life: number;
    speed_hawk: number;
    max_hawk: number;
    damage_hawk: number;
    damage_speed_hawk: number;
    tame_hawk: number;
    dragon_life: number;
    speed_dragon: number;
    max_dragon: number;
    damage_dragon: number;
    damage_speed_dragon: number;
    baby_dragon_life: number;
    speed_baby_dragon: number;
    max_baby_dragon: number;
    damage_baby_dragon: number;
    damage_speed_baby_dragon: number;
    tame_baby_dragon: number;
    baby_lava_life: number;
    speed_baby_lava: number;
    max_baby_lava: number;
    damage_baby_lava: number;
    damage_speed_baby_lava: number;
    tame_baby_lava: number;
    crab_life: number;
    speed_crab: number;
    max_crab: number;
    damage_crab: number;
    damage_speed_crab: number;
    king_crab_life: number;
    speed_king_crab: number;
    max_king_crab: number;
    damage_king_crab: number;
    damage_speed_king_crab: number;
    tame_king_crab: number;
    piranha_life: number;
    speed_piranha: number;
    max_piranha: number;
    damage_piranha: number;
    damage_speed_piranha: number;
    kraken_life: number;
    speed_kraken: number;
    max_kraken: number;
    damage_kraken: number;
    damage_speed_kraken: number;
    flame_life: number;
    speed_flame: number;
    max_flame: number;
    damage_flame: number;
    damage_speed_flame: number;
    lava_dragon_life: number;
    speed_lava_dragon: number;
    max_lava_dragon: number;
    damage_lava_dragon: number;
    damage_speed_lava_dragon: number;
    wood_spike_damage: number;
    stone_spike_damage: number;
    gold_spike_damage: number;
    diamond_spike_damage: number;
    amethyst_spike_damage: number;
    reidite_spike_damage: number;
    wood_spike_door_damage: number;
    stone_spike_door_damage: number;
    gold_spike_door_damage: number;
    diamond_spike_door_damage: number;
    amethyst_spike_door_damage: number;
    reidite_spike_door_damage: number;
    workbench_life: number;
    plot_life: number;
    wood_wall_life: number;
    stone_wall_life: number;
    gold_wall_life: number;
    diamond_wall_life: number;
    amethyst_wall_life: number;
    reidite_wall_life: number;
    wood_door_life: number;
    stone_door_life: number;
    gold_door_life: number;
    diamond_door_life: number;
    amethyst_door_life: number;
    reidite_door_life: number;
    wood_spike_life: number;
    stone_spike_life: number;
    gold_spike_life: number;
    diamond_spike_life: number;
    amethyst_spike_life: number;
    reidite_spike_life: number;
    wood_spike_door_life: number;
    stone_spike_door_life: number;
    gold_spike_door_life: number;
    diamond_spike_door_life: number;
    amethyst_spike_door_life: number;
    reidite_spike_door_life: number;
    stone_hammer_building_damage: number;
    gold_hammer_building_damage: number;
    diamond_hammer_building_damage: number;
    amethyst_hammer_building_damage: number;
    reidite_hammer_building_damage: number;
    super_hammer_building_damage: number;
    stone_hammer_damage: number;
    gold_hammer_damage: number;
    diamond_hammer_damage: number;
    amethyst_hammer_damage: number;
    reidite_hammer_damage: number;
    super_hammer_damage: number;
    wrench: number;
    hand_damage: number;
    wood_sword_damage: number;
    stone_sword_damage: number;
    gold_sword_damage: number;
    diamond_sword_damage: number;
    amethyst_sword_damage: number;
    reidite_sword_damage: number;
    pirate_sword_damage: number;
    dragon_sword_damage: number;
    lava_sword_damage: number;
    wood_spear_damage: number;
    stone_spear_damage: number;
    gold_spear_damage: number;
    diamond_spear_damage: number;
    amethyst_spear_damage: number;
    reidite_spear_damage: number;
    crab_spear_damage: number;
    dragon_spear_damage: number;
    lava_spear_damage: number;
    spell_damage_wood_arrow: number;
    spell_damage_pve_wood_arrow: number;
    spell_speed_wood_arrow: number;
    spell_dist_wood_arrow: number;
    spell_damage_stone_arrow: number;
    spell_damage_pve_stone_arrow: number;
    spell_speed_stone_arrow: number;
    spell_dist_stone_arrow: number;
    spell_damage_gold_arrow: number;
    spell_damage_pve_gold_arrow: number;
    spell_speed_gold_arrow: number;
    spell_dist_gold_arrow: number;
    spell_damage_diamond_arrow: number;
    spell_damage_pve_diamond_arrow: number;
    spell_speed_diamond_arrow: number;
    spell_dist_diamond_arrow: number;
    spell_damage_amethyst_arrow: number;
    spell_damage_pve_amethyst_arrow: number;
    spell_speed_amethyst_arrow: number;
    spell_dist_amethyst_arrow: number;
    spell_damage_reidite_arrow: number;
    spell_damage_pve_reidite_arrow: number;
    spell_speed_reidite_arrow: number;
    spell_dist_reidite_arrow: number;
    spell_damage_dragon_arrow: number;
    spell_damage_pve_dragon_arrow: number;
    spell_speed_dragon_arrow: number;
    spell_dist_dragon_arrow: number;
    wood_shield_defense: number;
    stone_shield_defense: number;
    gold_shield_defense: number;
    diamond_shield_defense: number;
    amethyst_shield_defense: number;
    reidite_shield_defense: number;
    wood_shield_defense_monster: number;
    stone_shield_defense_monster: number;
    gold_shield_defense_monster: number;
    diamond_shield_defense_monster: number;
    amethyst_shield_defense_monster: number;
    reidite_shield_defense_monster: number;
    wood_shield_defense_spell: number;
    stone_shield_defense_spell: number;
    gold_shield_defense_spell: number;
    diamond_shield_defense_spell: number;
    amethyst_shield_defense_spell: number;
    reidite_shield_defense_spell: number;
    wood_helmet_defense: number;
    stone_helmet_defense: number;
    gold_helmet_defense: number;
    diamond_helmet_defense: number;
    amethyst_helmet_defense: number;
    reidite_helmet_defense: number;
    crab_helmet_defense: number;
    dragon_helmet_defense: number;
    lava_helmet_defense: number;
    earmuff_defense: number;
    coat_defense: number;
    scarf_defense: number;
    fur_hat_defense: number;
    orange_crown_defense: number;
    blue_crown_defense: number;
    green_crown_defense: number;
    diving_mask_defense: number;
    super_diving_suit_defense: number;
    warm_protection_defense: number;
    warm_protection2_defense: number;
    warm_protection3_defense: number;
    explorer_hat_defense: number;
    pirate_hat_defense: number;
    hood_defense: number;
    winter_hood_defense: number;
    peasant_defense: number;
    winter_peasant_defense: number;
    wood_helmet_mob_defense: number;
    stone_helmet_mob_defense: number;
    gold_helmet_mob_defense: number;
    diamond_helmet_mob_defense: number;
    amethyst_helmet_mob_defense: number;
    reidite_helmet_mob_defense: number;
    dragon_helmet_mob_defense: number;
    lava_helmet_mob_defense: number;
    crab_helmet_mob_defense: number;
    earmuff_mob_defense: number;
    coat_mob_defense: number;
    scarf_mob_defense: number;
    fur_hat_mob_defense: number;
    orange_crown_mob_defense: number;
    blue_crown_mob_defense: number;
    green_crown_mob_defense: number;
    diving_mask_mob_defense: number;
    super_diving_suit_mob_defense: number;
    warm_protection_mob_defense: number;
    warm_protection2_mob_defense: number;
    warm_protection3_mob_defense: number;
    explorer_hat_mob_defense: number;
    pirate_hat_mob_defense: number;
    hood_mob_defense: number;
    winter_hood_mob_defense: number;
    peasant_mob_defense: number;
    winter_peasant_mob_defense: number;
    wood_helmet_blizzard: number;
    stone_helmet_blizzard: number;
    gold_helmet_blizzard: number;
    diamond_helmet_blizzard: number;
    amethyst_helmet_blizzard: number;
    reidite_helmet_blizzard: number;
    dragon_helmet_blizzard: number;
    lava_helmet_blizzard: number;
    crab_helmet_blizzard: number;
    earmuff_blizzard: number;
    coat_blizzard: number;
    scarf_blizzard: number;
    fur_hat_blizzard: number;
    orange_crown_blizzard: number;
    blue_crown_blizzard: number;
    green_crown_blizzard: number;
    diving_mask_blizzard: number;
    super_diving_suit_blizzard: number;
    warm_protection_blizzard: number;
    warm_protection2_blizzard: number;
    warm_protection3_blizzard: number;
    explorer_hat_blizzard: number;
    pirate_hat_blizzard: number;
    hood_blizzard: number;
    winter_hood_blizzard: number;
    peasant_blizzard: number;
    winter_peasant_blizzard: number;
    wood_helmet_loss_oxygen: number;
    stone_helmet_loss_oxygen: number;
    gold_helmet_loss_oxygen: number;
    diamond_helmet_loss_oxygen: number;
    amethyst_helmet_loss_oxygen: number;
    reidite_helmet_loss_oxygen: number;
    dragon_helmet_loss_oxygen: number;
    lava_helmet_loss_oxygen: number;
    crab_helmet_loss_oxygen: number;
    earmuff_loss_oxygen: number;
    coat_loss_oxygen: number;
    scarf_loss_oxygen: number;
    fur_hat_loss_oxygen: number;
    orange_crown_loss_oxygen: number;
    blue_crown_loss_oxygen: number;
    green_crown_loss_oxygen: number;
    diving_mask_loss_oxygen: number;
    super_diving_suit_loss_oxygen: number;
    warm_protection_loss_oxygen: number;
    warm_protection2_loss_oxygen: number;
    warm_protection3_loss_oxygen: number;
    explorer_hat_loss_oxygen: number;
    pirate_hat_loss_oxygen: number;
    hood_loss_oxygen: number;
    winter_hood_loss_oxygen: number;
    peasant_loss_oxygen: number;
    winter_peasant_loss_oxygen: number;
    wood_helmet_warm_day: number;
    stone_helmet_warm_day: number;
    gold_helmet_warm_day: number;
    diamond_helmet_warm_day: number;
    amethyst_helmet_warm_day: number;
    reidite_helmet_warm_day: number;
    dragon_helmet_warm_day: number;
    lava_helmet_warm_day: number;
    crab_helmet_warm_day: number;
    earmuff_warm_day: number;
    coat_warm_day: number;
    scarf_warm_day: number;
    fur_hat_warm_day: number;
    orange_crown_warm_day: number;
    blue_crown_warm_day: number;
    green_crown_warm_day: number;
    diving_mask_warm_day: number;
    super_diving_suit_warm_day: number;
    warm_protection_warm_day: number;
    warm_protection2_warm_day: number;
    warm_protection3_warm_day: number;
    explorer_hat_warm_day: number;
    pirate_hat_warm_day: number;
    hood_warm_day: number;
    winter_hood_warm_day: number;
    peasant_warm_day: number;
    winter_peasant_warm_day: number;
    wood_helmet_warm_night: number;
    stone_helmet_warm_night: number;
    gold_helmet_warm_night: number;
    diamond_helmet_warm_night: number;
    amethyst_helmet_warm_night: number;
    reidite_helmet_warm_night: number;
    dragon_helmet_warm_night: number;
    lava_helmet_warm_night: number;
    crab_helmet_warm_night: number;
    earmuff_warm_night: number;
    coat_warm_night: number;
    scarf_warm_night: number;
    fur_hat_warm_night: number;
    orange_crown_warm_night: number;
    blue_crown_warm_night: number;
    green_crown_warm_night: number;
    diving_mask_warm_night: number;
    super_diving_suit_warm_night: number;
    warm_protection_warm_night: number;
    warm_protection2_warm_night: number;
    warm_protection3_warm_night: number;
    explorer_hat_warm_night: number;
    pirate_hat_warm_night: number;
    hood_warm_night: number;
    winter_hood_warm_night: number;
    peasant_warm_night: number;
    winter_peasant_warm_night: number;
    wood_helmet_warm_water_day: number;
    stone_helmet_warm_water_day: number;
    gold_helmet_warm_water_day: number;
    diamond_helmet_warm_water_day: number;
    amethyst_helmet_warm_water_day: number;
    reidite_helmet_warm_water_day: number;
    dragon_helmet_warm_water_day: number;
    lava_helmet_warm_water_day: number;
    crab_helmet_warm_water_day: number;
    earmuff_warm_water_day: number;
    coat_warm_water_day: number;
    scarf_warm_water_day: number;
    fur_hat_warm_water_day: number;
    orange_crown_warm_water_day: number;
    blue_crown_warm_water_day: number;
    green_crown_warm_water_day: number;
    diving_mask_warm_water_day: number;
    super_diving_suit_warm_water_day: number;
    warm_protection_warm_water_day: number;
    warm_protection2_warm_water_day: number;
    warm_protection3_warm_water_day: number;
    explorer_hat_warm_water_day: number;
    pirate_hat_warm_water_day: number;
    hood_warm_water_day: number;
    winter_hood_warm_water_day: number;
    peasant_warm_water_day: number;
    winter_peasant_warm_water_day: number;
    wood_helmet_warm_water_night: number;
    stone_helmet_warm_water_night: number;
    gold_helmet_warm_water_night: number;
    diamond_helmet_warm_water_night: number;
    amethyst_helmet_warm_water_night: number;
    reidite_helmet_warm_water_night: number;
    dragon_helmet_warm_water_night: number;
    lava_helmet_warm_water_night: number;
    crab_helmet_warm_water_night: number;
    earmuff_warm_water_night: number;
    coat_warm_water_night: number;
    scarf_warm_water_night: number;
    fur_hat_warm_water_night: number;
    orange_crown_warm_water_night: number;
    blue_crown_warm_water_night: number;
    green_crown_warm_water_night: number;
    diving_mask_warm_water_night: number;
    super_diving_suit_warm_water_night: number;
    warm_protection_warm_water_night: number;
    warm_protection2_warm_water_night: number;
    warm_protection3_warm_water_night: number;
    explorer_hat_warm_water_night: number;
    pirate_hat_warm_water_night: number;
    hood_warm_water_night: number;
    winter_hood_warm_water_night: number;
    peasant_warm_water_night: number;
    winter_peasant_warm_water_night: number;
    wood_helmet_warm_winter_day: number;
    stone_helmet_warm_winter_day: number;
    gold_helmet_warm_winter_day: number;
    diamond_helmet_warm_winter_day: number;
    amethyst_helmet_warm_winter_day: number;
    reidite_helmet_warm_winter_day: number;
    dragon_helmet_warm_winter_day: number;
    lava_helmet_warm_winter_day: number;
    crab_helmet_warm_winter_day: number;
    earmuff_warm_winter_day: number;
    coat_warm_winter_day: number;
    scarf_warm_winter_day: number;
    fur_hat_warm_winter_day: number;
    orange_crown_warm_winter_day: number;
    blue_crown_warm_winter_day: number;
    green_crown_warm_winter_day: number;
    diving_mask_warm_winter_day: number;
    super_diving_suit_warm_winter_day: number;
    warm_protection_warm_winter_day: number;
    warm_protection2_warm_winter_day: number;
    warm_protection3_warm_winter_day: number;
    explorer_hat_warm_winter_day: number;
    pirate_hat_warm_winter_day: number;
    hood_warm_winter_day: number;
    winter_hood_warm_winter_day: number;
    peasant_warm_winter_day: number;
    winter_peasant_warm_winter_day: number;
    wood_helmet_warm_winter_night: number;
    stone_helmet_warm_winter_night: number;
    gold_helmet_warm_winter_night: number;
    diamond_helmet_warm_winter_night: number;
    amethyst_helmet_warm_winter_night: number;
    reidite_helmet_warm_winter_night: number;
    dragon_helmet_warm_winter_night: number;
    lava_helmet_warm_winter_night: number;
    crab_helmet_warm_winter_night: number;
    earmuff_warm_winter_night: number;
    coat_warm_winter_night: number;
    scarf_warm_winter_night: number;
    fur_hat_warm_winter_night: number;
    orange_crown_warm_winter_night: number;
    blue_crown_warm_winter_night: number;
    green_crown_warm_winter_night: number;
    diving_mask_warm_winter_night: number;
    super_diving_suit_warm_winter_night: number;
    warm_protection_warm_winter_night: number;
    warm_protection2_warm_winter_night: number;
    warm_protection3_warm_winter_night: number;
    explorer_hat_warm_winter_night: number;
    pirate_hat_warm_winter_night: number;
    hood_warm_winter_night: number;
    winter_hood_warm_winter_night: number;
    peasant_warm_winter_night: number;
    winter_peasant_warm_winter_night: number;
    wood_helmet_warm_lava_day: number;
    stone_helmet_warm_lava_day: number;
    gold_helmet_warm_lava_day: number;
    diamond_helmet_warm_lava_day: number;
    amethyst_helmet_warm_lava_day: number;
    reidite_helmet_warm_lava_day: number;
    dragon_helmet_warm_lava_day: number;
    lava_helmet_warm_lava_day: number;
    crab_helmet_warm_lava_day: number;
    earmuff_warm_lava_day: number;
    coat_warm_lava_day: number;
    scarf_warm_lava_day: number;
    fur_hat_warm_lava_day: number;
    orange_crown_warm_lava_day: number;
    blue_crown_warm_lava_day: number;
    green_crown_warm_lava_day: number;
    diving_mask_warm_lava_day: number;
    super_diving_suit_warm_lava_day: number;
    warm_protection_warm_lava_day: number;
    warm_protection2_warm_lava_day: number;
    warm_protection3_warm_lava_day: number;
    explorer_hat_warm_lava_day: number;
    pirate_hat_warm_lava_day: number;
    hood_warm_lava_day: number;
    winter_hood_warm_lava_day: number;
    peasant_warm_lava_day: number;
    winter_peasant_warm_lava_day: number;
    wood_helmet_warm_lava_night: number;
    stone_helmet_warm_lava_night: number;
    gold_helmet_warm_lava_night: number;
    diamond_helmet_warm_lava_night: number;
    amethyst_helmet_warm_lava_night: number;
    reidite_helmet_warm_lava_night: number;
    dragon_helmet_warm_lava_night: number;
    lava_helmet_warm_lava_night: number;
    crab_helmet_warm_lava_night: number;
    earmuff_warm_lava_night: number;
    coat_warm_lava_night: number;
    scarf_warm_lava_night: number;
    fur_hat_warm_lava_night: number;
    orange_crown_warm_lava_night: number;
    blue_crown_warm_lava_night: number;
    green_crown_warm_lava_night: number;
    diving_mask_warm_lava_night: number;
    super_diving_suit_warm_lava_night: number;
    warm_protection_warm_lava_night: number;
    warm_protection2_warm_lava_night: number;
    warm_protection3_warm_lava_night: number;
    explorer_hat_warm_lava_night: number;
    pirate_hat_warm_lava_night: number;
    hood_warm_lava_night: number;
    winter_hood_warm_lava_night: number;
    peasant_warm_lava_night: number;
    winter_peasant_warm_lava_night: number;
    tame_luck: number;
    born_berry: number;
    grown_berry: number;
    water_berry: number;
    time_life_berry: number;
    born_wheat: number;
    grown_wheat: number;
    water_wheat: number;
    time_life_wheat: number;
    born_pumpkin: number;
    grown_pumpkin: number;
    water_pumpkin: number;
    time_life_pumpkin: number;
    born_garlic: number;
    grown_garlic: number;
    water_garlic: number;
    time_life_garlic: number;
    born_carrot: number;
    grown_carrot: number;
    water_carrot: number;
    time_life_carrot: number;
    born_tomato: number;
    grown_tomato: number;
    water_tomato: number;
    time_life_tomato: number;
    born_watermelon: number;
    grown_watermelon: number;
    water_watermelon: number;
    time_life_watermelon: number;
    born_thornbush: number;
    grown_thornbush: number;
    water_thornbush: number;
    time_life_thornbush: number;
    dig_luck: number;
    stone_shovel_dig: number;
    gold_shovel_dig: number;
    diamond_shovel_dig: number;
    amethyst_shovel_dig: number;
    ghost_delay: number;
}

declare interface Important {
    max_units: number;
    max_building: number;
    map_width: number;
    map_height: number;
    custom_map: any[][];
    islands: number;
    recipes: Recipe[];
    starter_kit: [string, number][];
    events: Event[];
}

declare interface Recipe {
    item: string;
    recipe: [string, number][];
    water: number;
    workbench: number;
    fire: number;
    well: number;
    time: number;
    bonus: number;
}

declare interface Event {
    // @ts-ignore
    type: string;
    score?: number;
    repeat: number;
    commands: string[];
    item?: string;
    amount?: number;
    x?: number;
    y?: number;
}
