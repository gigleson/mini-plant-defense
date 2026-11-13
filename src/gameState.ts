
import { GAME_CONFIG } from "./config.js";
import type { PlantType } from "./config.js";

import type { Plant } from "./entities/Plant.js";
import type { Zombie } from "./entities/Zombie.js";

// Allowed game states.
export type GameStatus =
    | "menu"
    | "playing"
    | "paused"
    | "gameover"
    | "victory";

// Defines the structure of the complete game state.
interface GameState {
    status: GameStatus;
    sunlight: number;
    currentWave: number;
    selectedPlant: PlantType | null;
    plants: Plant[];
    zombies: Zombie[];
    projectiles: any[]; // Temporary until we convert the projectile class.
    score: number;
    totalZombiesSpawned: number;
    waveActive: boolean;
}

export const gameState: GameState = {
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

export function resetGameState(): void {
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
