// TODO Crafts
import {Server} from "../Server";
import {Player} from "../entities/Player";
import {InventoryType} from "../enums/InventoryType";
import {CraftType} from "../enums/CraftType";
import NanoTimer from "nanotimer";
import {ClientPackets} from "../enums/packets/ClientPackets";
import {getDefaultRecipes} from "../default/defaultRecipes";

export class CraftSystem {
    public recipes: Recipe[];
    public readonly recipesToSend: any[] = [];
    private server: Server;
    constructor(server: Server) {
        this.server = server;
        this.recipes = getDefaultRecipes() as any;

        if(server.config.important.recipes) {
            for (const recipe of server.config.important.recipes) {
                const id = this.findCraftId(recipe.item);
                this.recipes[id] = recipe;
            }
        }

        if(server.config.instant_craft == 1) {
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
        if(!this.server.craftSystem.recipes[id]) return;

        const craft = this.server.craftSystem.recipes[id];

        for (const ingredient of craft.recipe) {
            const ide = InventoryType[ingredient[0].toUpperCase() as any] as any;
            const count = ingredient[1];

            if(!player.inventory.items.has(ide) || player.inventory.items.get(ide) as any < count) {
                break;
            }
        }

        player.client.sendBinary(new Uint8Array([ClientPackets.BUILD_OK, id]));
        player.isCrafting = true;
        new NanoTimer().setTimeout(() => {
            player.isCrafting = false;

            player.client.sendBinary(new Uint8Array([ClientPackets.BUILD_STOP, InventoryType[craft.item.toUpperCase() as any] as any]));
            player.inventory.giveItem(InventoryType[craft.item.toUpperCase() as any] as any, 1);
            if(craft.bonus) player.stats.score += craft.bonus;
        }, [], craft.time + "s");
    }

    private findInventoryId(itemName: string) {
        return InventoryType[itemName.toUpperCase() as "BAG"] as number;
    }

    private findCraftId(itemName: string) {
        return CraftType[itemName.toUpperCase() as "BAG"] as number;
    }
}