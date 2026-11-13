
export const GAME_CONFIG = Object.freeze({
    rows: 5,
    columns: 9,
    canvasWidth: 900,
    canvasHeight: 500,
    startingSunlight: 150
} as const);

// Defines the allowed plant configuration structures.
type PeashooterConfig = {
    name: string;
    emoji: string;
    cost: number;
    health: number;
    type: "attacker";
    damage: number;
    attackInterval: number;
};

type SunflowerConfig = {
    name: string;
    emoji: string;
    cost: number;
    health: number;
    type: "producer";
    sunlightAmount: number;
    generationInterval: number;
};

type WallNutConfig = {
    name: string;
    emoji: string;
    cost: number;
    health: number;
    type: "defender";
};

export const PLANT_CONFIG = Object.freeze({
    peashooter: {
        name: "Peashooter",
        emoji: "🌱",
        cost: 100,
        health: 100,
        type: "attacker",
        damage: 20,
        attackInterval: 1.5
    },

    sunflower: {
        name: "Sunflower",
        emoji: "🌻",
        cost: 50,
        health: 100,
        type: "producer",
        sunlightAmount: 25,
        generationInterval: 8
    },

    wallnut: {
        name: "Wall-nut",
        emoji: "🥔",
        cost: 50,
        health: 600,
        type: "defender"
    }
} as const satisfies {
    peashooter: PeashooterConfig;
    sunflower: SunflowerConfig;
    wallnut: WallNutConfig;
});

// Automatically derives the allowed plant names.
export type PlantType = keyof typeof PLANT_CONFIG;

export const WAVE_CONFIG = Object.freeze({
    totalWaves: 5,
    zombiesPerWave: 5,
    spawnInterval: 2,
    difficultyIncrease: 1.5
} as const);
