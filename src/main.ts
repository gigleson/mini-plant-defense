
import { PLANT_CONFIG } from "./config.js";
import type { PlantType } from "./config.js";

import { gameState, resetGameState } from "./gameState.js";
import type { GameStatus } from "./gameState.js";

import { Game } from "./game.js";
import { PlantSystem } from "./systems/PlantSystem.js";
import { ZombieSystem } from "./systems/ZombieSystem.js";
import { ProjectileSystem } from "./systems/ProjectileSystem.js";
import { LeaderboardSystem } from "./systems/LeaderboardSystem.js";
import { AuthSystem } from "./systems/AuthSystem.js";

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
    const loginUsername =
    getRequiredElement<HTMLInputElement>("login-username");

const loginPassword =
    getRequiredElement<HTMLInputElement>("login-password");

const registerUsername =
    getRequiredElement<HTMLInputElement>("register-username");

const registerPassword =
    getRequiredElement<HTMLInputElement>("register-password");

const loginButton =
    getRequiredElement<HTMLButtonElement>("login-btn");

const registerButton =
    getRequiredElement<HTMLButtonElement>("register-btn");

const authMessage =
    getRequiredElement<HTMLElement>("auth-message");
const logoutButton = getRequiredElement<HTMLButtonElement>("logout-btn");

// Game systems.
const leaderboardSystem = new LeaderboardSystem();
const authUser = getRequiredElement<HTMLElement>("auth-user");
const authSystem = new AuthSystem();
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
async function updateLeaderboard(): Promise<void> {
    const scores = await leaderboardSystem.loadScores();

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
if (!authSystem.getToken()) {
    showMessage("Please log in or sign up before playing.");
    return;
}
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
loginButton.addEventListener("click", async () => {
    try {
        const result = await authSystem.login(
            loginUsername.value,
            loginPassword.value
        );

        authMessage.textContent =
            `Welcome back, ${result.user.username}!`;
        authUser.textContent = `Logged in as ${result.user.username}`;

        loginPassword.value = "";

    } catch (error) {
        authMessage.textContent =
            error instanceof Error
                ? error.message
                : "Login failed.";
    }
});
registerButton.addEventListener("click", async () => {
    try {
        const result = await authSystem.register(
            registerUsername.value,
            registerPassword.value
        );

        authMessage.textContent =
            `Account created! Welcome, ${result.user.username}!`;
authUser.textContent = `Logged in as ${result.user.username}`;
        registerPassword.value = "";

    } catch (error) {
        authMessage.textContent =
            error instanceof Error
                ? error.message
                : "Registration failed.";
    }
});
logoutButton.addEventListener("click", () => {
    authSystem.logout();
    authMessage.textContent = "You have been logged out.";
});

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
    scoreSaved = true;
    void saveCompletedGame(currentStatus);
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
async function saveCompletedGame(
    status: GameStatus
): Promise<void> {
    try {
       const result = await leaderboardSystem.saveScore(
    '',
    gameState.score,
    authSystem.getToken()
);

        await updateLeaderboard();

        const outcome =
            status === "victory"
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

    } catch (error) {
        console.error("Failed to save score:", error);
        showMessage("Could not save your score. Please try again.");
    }
}

// Initial setup.
void updateLeaderboard();
updateInterface();

requestAnimationFrame(gameLoop);
