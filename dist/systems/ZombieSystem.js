var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ZombieSystem_spawnTimer;
import { GAME_CONFIG, WAVE_CONFIG } from "../config.js";
import { gameState } from "../gameState.js";
import { Zombie } from "../entities/Zombie.js";
export class ZombieSystem {
    constructor() {
        _ZombieSystem_spawnTimer.set(this, 0);
    }
    update(deltaTime) {
        if (!Number.isFinite(deltaTime) || deltaTime < 0) {
            throw new Error("Invalid delta time.");
        }
        // Start the next wave when the previous one is finished.
        if (!gameState.waveActive &&
            gameState.zombies.length === 0 &&
            gameState.currentWave < WAVE_CONFIG.totalWaves) {
            this.startNextWave();
        }
        if (!gameState.waveActive)
            return;
        // Spawn zombies at the configured interval.
        __classPrivateFieldSet(this, _ZombieSystem_spawnTimer, __classPrivateFieldGet(this, _ZombieSystem_spawnTimer, "f") + deltaTime, "f");
        const spawnInterval = Math.max(1, WAVE_CONFIG.spawnInterval /
            (1 + (gameState.currentWave - 1) * 0.25));
        if (__classPrivateFieldGet(this, _ZombieSystem_spawnTimer, "f") >= spawnInterval &&
            gameState.totalZombiesSpawned <
                this.getZombieCountForWave()) {
            __classPrivateFieldSet(this, _ZombieSystem_spawnTimer, 0, "f");
            this.spawnZombie();
            gameState.totalZombiesSpawned++;
        }
        const cellWidth = GAME_CONFIG.canvasWidth / GAME_CONFIG.columns;
        // Move zombies or let them attack plants.
        for (const zombie of gameState.zombies) {
            const targetPlant = gameState.plants.find(plant => {
                if (!plant.alive || plant.row !== zombie.row) {
                    return false;
                }
                const plantLeft = plant.column * cellWidth;
                const plantRight = plantLeft + cellWidth;
                return (zombie.x < plantRight &&
                    zombie.x + zombie.width > plantLeft);
            });
            if (targetPlant) {
                zombie.attackTimer += deltaTime;
                while (zombie.attackTimer >= zombie.attackInterval &&
                    targetPlant.alive) {
                    zombie.attackTimer -= zombie.attackInterval;
                    targetPlant.takeDamage(zombie.damage);
                }
            }
            else {
                zombie.attackTimer = 0;
                zombie.update(deltaTime);
            }
            if (zombie.x <= 0) {
                gameState.status = "gameover";
                break;
            }
        }
        // Remove destroyed plants.
        gameState.plants = gameState.plants.filter(plant => plant.alive);
        // Check whether the wave is complete.
        const allZombiesSpawned = gameState.totalZombiesSpawned >=
            this.getZombieCountForWave();
        if (allZombiesSpawned &&
            gameState.zombies.length === 0) {
            if (gameState.currentWave >= WAVE_CONFIG.totalWaves) {
                gameState.status = "victory";
            }
            else {
                gameState.waveActive = false;
            }
        }
    }
    startNextWave() {
        gameState.currentWave++;
        gameState.totalZombiesSpawned = 0;
        gameState.waveActive = true;
        __classPrivateFieldSet(this, _ZombieSystem_spawnTimer, 0, "f");
    }
    getZombieCountForWave() {
        return Math.ceil(WAVE_CONFIG.zombiesPerWave *
            Math.pow(WAVE_CONFIG.difficultyIncrease, gameState.currentWave - 1));
    }
    spawnZombie() {
        const randomRow = Math.floor(Math.random() * GAME_CONFIG.rows);
        const zombie = new Zombie(randomRow);
        gameState.zombies.push(zombie);
        return zombie;
    }
}
_ZombieSystem_spawnTimer = new WeakMap();
