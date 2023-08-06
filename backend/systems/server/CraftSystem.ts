// TODO Crafts
import {Player} from "../../entities/Player";
import {InventoryType} from "../../enums/InventoryType";
import {CraftType} from "../../enums/CraftType";
import NanoTimer from "nanotimer";
import {ClientPackets} from "../../enums/packets/ClientPackets";
import {getDefaultRecipes} from "../../default/defaultRecipes";

export class CraftSystem {
    public recipes: Recipe[];
    public readonly recipesToSend: any[] = [];
    constructor(config: Config) {
        this.recipes = getDefaultRecipes() as any;
        
        if(config.important.recipes) {
            for (const recipe of config.important.recipes) {
                const id = this.findCraftId(recipe.item);
                this.recipes[id] = recipe;
            }
        }

        if(config.instant_craft == 1) {
            for (const recipe of this.recipes) {
                recipe.time = 0;
            }
        }

        this.recipesToSend = this.recipes.map(recipe => {
            return {
                item: this.findCraftId(recipe.item),
                recipe: recipe.recipe.map(r => [this.findInventoryId(r[0].toUpperCase()), r[1]]),
                fire: recipe.fire,
                water: recipe.water,
                workbench: recipe.workbench,
                well: recipe.well,
                time: recipe.time
            }
        });

    }

    public handleCraft(player: Player, id: number) {
        if(!this.recipes[id]) return;

        const craft = this.recipes[id];
        let time = craft.time;

        if(craft.workbench && !player.workbench) return;
        if(craft.fire && !player.fire) return;
        if(craft.water && !player.water) return;
        if(craft.well && !player.well) return;

        for (const ingredient of craft.recipe) {
            const ide = InventoryType[ingredient[0].toUpperCase() as any] as any;
            const count = ingredient[1];

            if(!player.inventory.items.has(ide) || player.inventory.items.get(ide) as any < count) {
                break;
            }

            player.inventory.removeItem(ide, count);
        }

        if(player.right.id === InventoryType.BOOK) {
            time /= 3;
        }

        player.client.sendU8([ClientPackets.BUILD_OK, id]);
        player.isCrafting = true;
        new NanoTimer().setTimeout(() => {
            if(!player.isCrafting) return;

            player.client.sendU8([ClientPackets.BUILD_STOP, InventoryType[craft.item.toUpperCase() as any] as any]);
            player.inventory.giveItem(InventoryType[craft.item.toUpperCase() as any] as any, 1);
            if(craft.bonus) player.stats.score += craft.bonus;

            player.isCrafting = false;
        }, [], time + "s");
    }

    public handleRecycle(player: Player, id: number){
        const craftId = CraftType[InventoryType[id as any] as any] as any;
        if(!this.recipes[craftId]) return;

        const craft = this.recipes[craftId];
        let time = craft.time;

        if(!player.inventory.items.has(id)) return;
        if(craft.workbench && !player.workbench) return;
        if(craft.fire && !player.fire) return;
        if(craft.water && !player.water) return;
        if(craft.well && !player.well) return;

        if(player.right.id === InventoryType.BOOK) {
            time /= 1.5;
        }

        player.client.sendU8([ClientPackets.RECYCLE_OK, craftId]);
        player.client.sendBinary(player.inventory.removeItem(id, 1));
        player.isCrafting = true;

        new NanoTimer().setTimeout(() => {
            if(!player.isCrafting) return;
            player.client.sendBinary(new Uint8Array([ClientPackets.RECYCLE_STOP, craftId]));
            for (const ingredient of craft.recipe) {
                const id = InventoryType[ingredient[0].toUpperCase() as any] as any;
                const count = ingredient[1];

                player.inventory.giveItem(id, count * 0.8);
            }

            player.isCrafting = false;
        }, [], time / 8 + "s");
    }

    public stopCraft(player: Player) {
        player.isCrafting = false;
        player.client.sendU8([ClientPackets.CANCEL_CRAFT]);
    }

    private findInventoryId(itemName: string) {
        return InventoryType[itemName.toUpperCase() as "BAG"] as number;
    }

    private findCraftId(itemName: string) {
        return CraftType[itemName.toUpperCase() as "BAG"] as number;
    }
}