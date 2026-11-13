
// js/systems/PlantSystem.js

import { GAME_CONFIG, PLANT_CONFIG } from "../config.js";
import { gameState } from "../gameState.js";

import { Peashooter } from "../entities/Peashooter.js";
import { Sunflower } from "../entities/Sunflower.js";
import { WallNut } from "../entities/WallNut.js";
import { Pea } from "../entities/Pea.js";
// Factory: maps plant types to their classes.
const PLANT_CLASSES = Object.freeze({
    peashooter: Peashooter,
    sunflower: Sunflower,
    wallnut: WallNut
});

export class PlantSystem {
    selectPlant(type) {
        if (!Object.hasOwn(PLANT_CLASSES, type)) {
            return {
                success: false,
                message: "Invalid plant selected."
            };
        }

        if (gameState.status !== "playing") {
            return {
                success: false,
                message: "Start the game first."
            };
        }

        gameState.selectedPlant = type;

        return {
            success: true,
            message: `${PLANT_CONFIG[type].name} selected.`
        };
    }

    placePlant(row, column) {
        const type = gameState.selectedPlant;

        if (gameState.status !== "playing") {
            return {
                success: false,
                message: "Game is not running."
            };
        }

        if (!type || !Object.hasOwn(PLANT_CLASSES, type)) {
            return {
                success: false,
                message: "Select a plant first."
            };
        }

        const { rows, columns } = GAME_CONFIG;

        if (
            !Number.isInteger(row) ||
            !Number.isInteger(column) ||
            row < 0 || row >= rows ||
            column < 0 || column >= columns
        ) {
            return {
                success: false,
                message: "Invalid lawn cell."
            };
        }

        const occupied = gameState.plants.some(
            plant => plant.row === row && plant.column === column
        );

        if (occupied) {
            return {
                success: false,
                message: "That cell is occupied."
            };
        }

        const plantConfig = PLANT_CONFIG[type];

        if (gameState.sunlight < plantConfig.cost) {
            return {
                success: false,
                message: "Not enough sunlight."
            };
        }

        try {
            const PlantClass = PLANT_CLASSES[type];

            const newPlant = new PlantClass(row, column);

            gameState.plants.push(newPlant);
            gameState.sunlight -= plantConfig.cost;
            gameState.selectedPlant = null;

            return {
                success: true,
                message: `${newPlant.name} planted successfully!`,
                plant: newPlant
            };

        } catch (error) {
            console.error("Plant placement failed:", error);

            return {
                success: false,
                message: "Could not place plant."
            };
        }
    }

    removeDeadPlants() {
        const previousCount = gameState.plants.length;

        gameState.plants = gameState.plants.filter(
            plant => plant.alive
        );

        return previousCount - gameState.plants.length;
    }
    updatePlants(deltaTime) {
    let totalSunlightGenerated = 0;

    for (const plant of gameState.plants) {
        const result = plant.update(deltaTime);

        // Collect sunlight from Sunflowers.
        if (typeof result === "number" && result > 0) {
            totalSunlightGenerated += result;
        }

        // Fire a pea when a Peashooter is ready.
        if (result === true && plant.type === "peashooter") {
            const cellWidth =
                GAME_CONFIG.canvasWidth / GAME_CONFIG.columns;

            const cellHeight =
                GAME_CONFIG.canvasHeight / GAME_CONFIG.rows;

            const x =
                plant.column * cellWidth + cellWidth / 2 + 20;

            const y =
                plant.row * cellHeight + cellHeight / 2;

            const pea = new Pea(x, y, plant.getAttackDamage());

            gameState.projectiles.push(pea);
        }
    }

    gameState.sunlight += totalSunlightGenerated;

    return totalSunlightGenerated;
}
}
