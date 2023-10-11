// TODO Crafts
import {Player} from "../../entities/Player";
import {ItemType} from "../../enums/types/ItemType";
import NanoTimer from "nanotimer";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {RECIPES} from "../../default/defaultRecipes";
import {Utils} from "../../modules/Utils";

export class CraftSystem {
    public recipes: Recipe[];
    public newRecipes: Recipe[];
    constructor(config: Config) {
        this.recipes = RECIPES;
        this.newRecipes = [];

        if(config.important.recipes) {
            for (let recipe of config.important.recipes as any) {
                recipe = Utils.convertRecipe(recipe);
                this.recipes[recipe.id] = recipe;
                this.newRecipes[recipe.id] = recipe;
            }
        }

        if(config.instant_craft == 1) {
            for (const recipe of this.recipes) {
                if(recipe) recipe.time = 0;
            }
        }
    }

    public handleCraft(player: Player, id: number) {
        if(!this.recipes[id]) return;
        const craft = this.recipes[id];
        const time = player.right.equal(ItemType.BOOK) ? craft.time / 3 : craft.time;

        if(
            craft.w && !player.workbench ||
            craft.f && !player.fire ||
            craft.o && !player.water ||
            craft.e && !player.well
        ) return;

        for (const [id, count] of craft.r) {
            if(!player.inventory.containsItem(id, count))
                return;

            player.inventory.removeItem(id, count);
        }

        player.isCrafting = true;

        player.client.sendU8([ClientPackets.BUILD_OK, id]);
        new NanoTimer().setTimeout(() => {
            if(!player.isCrafting) return;

            player.client.sendU8([ClientPackets.BUILD_STOP, (id === ItemType.BOTTLE_FULL_2 || id === ItemType.BOTTLE_FULL_3) ? ItemType.BOTTLE_FULL : id]);
            player.inventory.giveItem((id === ItemType.BOTTLE_FULL_2 || id === ItemType.BOTTLE_FULL_3) ? ItemType.BOTTLE_FULL : id, 1);
            if(craft.bonus) player.score += craft.bonus;

            player.isCrafting = false;
        }, [], time + "s");
    }

    public handleRecycle(player: Player, id: number){
        if(!this.recipes[id]) return;
        const craft = this.recipes[id];
        const time = player.right.equal(ItemType.BOOK) ? craft.time / 1.5 : craft.time;

        if(
            !player.inventory.containsItem(id, 1) ||
            craft.w && !player.workbench ||
            craft.f && !player.fire ||
            craft.o && !player.water ||
            craft.e && !player.well
        ) return;

        player.isCrafting = true;

        player.client.sendU8([ClientPackets.RECYCLE_OK, id]);
        player.client.sendBinary(player.inventory.removeItem(id, 1));

        new NanoTimer().setTimeout(() => {
            if(!player.isCrafting) return;

            for (const [id, count] of craft.r) {
                if (count === 1) continue;

                player.inventory.giveItem(id, count * 0.8);
            }

            player.client.sendBinary(new Uint8Array([ClientPackets.RECYCLE_STOP, id]));
            player.isCrafting = false;
        }, [], time / 8 + "s");
    }

    public stopCraft(player: Player) {
        player.isCrafting = false;
        player.client.sendU8([ClientPackets.CANCEL_CRAFT]);
    }
}