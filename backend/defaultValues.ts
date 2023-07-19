export function getDefaultCamera(): Camera {
    return {
        width: 1920,
        height: 1080
    };
}

export function getDefaultPlayerStats(): PlayerStats {
    return {
        kills: 0,
        score: 0,
        time: 0
    };
}

export function getDefaultHelmet(): any {
    return {
        type: "helmet",
        id: 0,
        defense: 0
    }
}


export function getDefaultItem(): any {
    return {
        type: "hand",
        id: 7,
        damage: 5
    }
}

export function getDefaultPet(): any {
    return {
        type: "pet",
        id: 0,
        speed: 0.23,
        tame_chance: 0.01
    }
}

export function getDefaultPlayerCosmetics(): PlayerCosmetics {
    return {
        skin: 0,
        accessory: 0,
        book: 0,
        bag: 0,
        crate: 1,
        dead: 0
    };
}

export function getDefaultPlayerData(): PlayerData {
    return {
        nickname: "unnamed",
        token: "",
        level: 0
    };
}