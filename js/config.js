
export const GAME_CONFIG = Object.freeze({
    rows: 5,
    columns: 9,
    canvasWidth: 900,
    canvasHeight: 500,
    startingSunlight: 150
});

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
});

export const WAVE_CONFIG = Object.freeze({
    totalWaves: 5,

    zombiesPerWave: 5,

    spawnInterval: 2,

    difficultyIncrease: 1.5
});