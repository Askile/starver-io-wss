import {InventoryType} from "../enums/InventoryType";

export function getDefaultKit(): any {
    return {
        [InventoryType.FIRE]: 1,
        [InventoryType.PLANT]: 2
    }
}