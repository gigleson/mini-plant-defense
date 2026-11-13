
import { PLANT_CONFIG } from "./config.js";
import type { PlantType } from "./config.js";

import { gameState, resetGameState } from "./gameState.js";
import type { GameStatus } from "./gameState.js";

import { Game } from "./game.js";
import { PlantSystem } from "./systems/PlantSystem.js";
import { ZombieSystem } from "./systems/ZombieSystem.js";
import { ProjectileSystem } from "./systems/ProjectileSystem.js";
import { LeaderboardSystem } from "./systems/LeaderboardSystem.js";

// Safely retrieve HTML elements.
function getRequiredElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`HTML element not found: ${id}`);
    }

    return element as T;
}

// Check whether a string is a valid plant type.
function isPlantType(type: string | undefined): type is PlantType {
    return (
        type !== undefined &&
        Object.prototype.hasOwnProperty.call(PLANT_CONFIG, type)
    );
}

// HTML elements.
const canvas = getRequiredElement<HTMLCanvasElement>("game-canvas");
const sunDisplay = getRequiredElement<HTMLElement>("sun-count");
const waveDisplay = getRequiredElement<HTMLElement>("wave-count");
const scoreDisplay = getRequiredElement<HTMLElement>("score-count");
const message = getRequiredElement<HTMLElement>("game-message");

const playerNameInput =
    getRequiredElement<HTMLInputElement>("player-name");

const leaderboardList =
    getRequiredElement<HTMLElement>("leaderboard-list");

const startButton =
    getRequiredElement<HTMLButtonElement>("start-btn");

const pauseButton =
    getRequiredElement<HTMLButtonElement>("pause-btn");

const resetButton =
    getRequiredElement<HTMLButtonElement>("reset-btn");

const plantCards =
    document.querySelectorAll<HTMLButtonElement>(".plant-card");

// Game systems.
const leaderboardSystem = new LeaderboardSystem();
const game = new Game(canvas);
const plantSystem = new PlantSystem();
const zombieSystem = new ZombieSystem();
const projectileSystem = new ProjectileSystem();

let scoreSaved = false;

// Update visible game information.
const updateInterface = (): void => {
    sunDisplay.textContent = String(gameState.sunlight);
    waveDisplay.textContent = String(gameState.currentWave);
    scoreDisplay.textContent = String(gameState.score);

    startButton.disabled = gameState.status !== "menu";

    pauseButton.disabled =
        gameState.status !== "playing" &&
        gameState.status !== "paused";

    pauseButton.textContent =
        gameState.status === "paused" ? "Resume" : "Pause";

    plantCards.forEach(card => {
        const type = card.dataset.plant;

        if (!isPlantType(type)) {
            card.disabled = true;
            card.classList.remove("selected");
            return;
        }

        const plant = PLANT_CONFIG[type];

        card.disabled =
            gameState.status !== "playing" ||
            gameState.sunlight < plant.cost;

        card.classList.toggle(
            "selected",
            gameState.selectedPlant === type
        );
    });

    game.render();
};

// Display a message to the player.
const showMessage = (text: string): void => {
    message.textContent = text;
};

// Update the leaderboard display.
function updateLeaderboard(): void {
    const scores = leaderboardSystem.loadScores();

    leaderboardList.innerHTML = "";

    if (scores.length === 0) {
        const item = document.createElement("li");

        item.textContent = "No scores yet!";
        item.className = "empty-leaderboard";

        leaderboardList.appendChild(item);
        return;
    }

    scores.forEach((entry, index) => {
        const item = document.createElement("li");

        item.textContent =
            `${entry.name} — ${entry.score} points`;

        if (index === 0) {
            item.textContent = `🥇 ${item.textContent}`;
        } else if (index === 1) {
            item.textContent = `🥈 ${item.textContent}`;
        } else if (index === 2) {
            item.textContent = `🥉 ${item.textContent}`;
        }

        leaderboardList.appendChild(item);
    });
}

// Start the game.
function startGame(): void {
    scoreSaved = false;

    if (gameState.status !== "menu") return;

    gameState.status = "playing";

    showMessage(
        "Game started! Choose a plant and defend your garden."
    );

    updateInterface();
}

// Pause or resume the game.
function togglePause(): void {
    if (gameState.status === "playing") {
        gameState.status = "paused";
        showMessage("Game paused.");
    } else if (gameState.status === "paused") {
        gameState.status = "playing";
        showMessage("Game resumed.");
    } else {
        return;
    }

    updateInterface();
}

// Reset the game.
function resetGame(): void {
    scoreSaved = false;

    resetGameState();

    showMessage("Game reset. Press Start Game to begin.");

    updateInterface();
}

// Handle plant card selection.
plantCards.forEach(card => {
    card.addEventListener("click", () => {
        const type = card.dataset.plant;

        if (!isPlantType(type)) {
            showMessage("Invalid plant selection.");
            return;
        }

        const result = plantSystem.selectPlant(type);

        showMessage(result.message);
        updateInterface();
    });
});

// Handle lawn clicks.
canvas.addEventListener("click", (event: MouseEvent) => {
    if (gameState.status !== "playing") return;

    const { row, column } = game.getCellFromPointer(event);

    const result = plantSystem.placePlant(row, column);

    showMessage(result.message);
    updateInterface();
});

// Register buttons.
startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", togglePause);
resetButton.addEventListener("click", resetGame);

// ---------------------------------
// GAME LOOP
// ---------------------------------

let lastTime: number | null = null;

function gameLoop(timestamp: number): void {
    // Calculate elapsed time in seconds.
    const deltaTime = lastTime === null
        ? 0
        : (timestamp - lastTime) / 1000;

    lastTime = timestamp;

    // Update systems only while the game is running.
    if (gameState.status === "playing") {
        const generatedSunlight =
            plantSystem.updatePlants(deltaTime);

        zombieSystem.update(deltaTime);

        const defeatedCount =
            projectileSystem.update(deltaTime);

        // Check whether the game has ended.
        const currentStatus = gameState.status as GameStatus;

        if (
            currentStatus === "gameover" ||
            currentStatus === "victory"
        ) {
            if (!scoreSaved) {
                const result = leaderboardSystem.saveScore(
                    playerNameInput.value,
                    gameState.score
                );

                scoreSaved = true;

                updateLeaderboard();

                const outcome =
                    currentStatus === "victory"
                        ? "Victory! You defended your garden!"
                        : "Game Over! Your garden has been overrun.";

                let scoreMessage = "";

                if (result.isNewRecord) {
                    scoreMessage =
                        ` 🏆 NEW HIGH SCORE! ${gameState.score} points!`;
                } else if (result.rank !== null) {
                    scoreMessage =
                        ` You achieved rank #${result.rank}!`;
                } else {
                    scoreMessage =
                        ` Final score: ${gameState.score}.`;
                }

                showMessage(outcome + scoreMessage);
            }

            updateInterface();

        } else if (
            generatedSunlight > 0 ||
            defeatedCount > 0
        ) {
            updateInterface();
        }
    }

    // Draw the game.
    game.render();

    // Schedule the next frame.
    requestAnimationFrame(gameLoop);
}

// Initial setup.
updateLeaderboard();
updateInterface();

requestAnimationFrame(gameLoop);
