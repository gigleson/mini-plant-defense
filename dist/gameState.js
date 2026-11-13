import { GAME_CONFIG } from "./config.js";
export const gameState = {
    status: "menu",
    sunlight: GAME_CONFIG.startingSunlight,
    currentWave: 0,
    selectedPlant: null,
    plants: [],
    zombies: [],
    projectiles: [],
    score: 0,
    totalZombiesSpawned: 0,
    waveActive: false
};
export function resetGameState() {
    gameState.status = "menu";
    gameState.sunlight = GAME_CONFIG.startingSunlight;
    gameState.currentWave = 0;
    gameState.selectedPlant = null;
    gameState.plants = [];
    gameState.zombies = [];
    gameState.score = 0;
    gameState.projectiles = [];
    gameState.totalZombiesSpawned = 0;
    gameState.waveActive = false;
}
