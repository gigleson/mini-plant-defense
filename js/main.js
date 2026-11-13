import { PLANT_CONFIG } from "./config.js";
import { gameState, resetGameState } from "./gameState.js";
import { Game } from "./game.js";
import { PlantSystem } from "./systems/PlantSystem.js";
import { ZombieSystem } from "./systems/ZombieSystem.js";
import { ProjectileSystem } from "./systems/ProjectileSystem.js";
import { LeaderboardSystem } from "./systems/LeaderboardSystem.js";

const canvas = document.getElementById("game-canvas");
const sunDisplay = document.getElementById("sun-count");
const waveDisplay = document.getElementById("wave-count");
const scoreDisplay = document.getElementById("score-count");
const message = document.getElementById("game-message");
const playerNameInput = document.getElementById("player-name");
const leaderboardList = document.getElementById("leaderboard-list");

const leaderboardSystem = new LeaderboardSystem();

let scoreSaved = false;

const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");

const plantCards = document.querySelectorAll(".plant-card");

const game = new Game(canvas);
const plantSystem = new PlantSystem();
const zombieSystem = new ZombieSystem();
const projectileSystem = new ProjectileSystem();


// Update visible game information.
const updateInterface = () => {
    sunDisplay.textContent = gameState.sunlight;
    waveDisplay.textContent = gameState.currentWave;
    scoreDisplay.textContent = gameState.score;

    startButton.disabled = gameState.status !== "menu";
    // pauseButton.disabled = gameState.status === "menu";
    pauseButton.disabled =
    gameState.status !== "playing" &&
    gameState.status !== "paused";

    pauseButton.textContent =
        gameState.status === "paused" ? "Resume" : "Pause";

    plantCards.forEach(card => {
        const type = card.dataset.plant;
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
const showMessage = text => {
    message.textContent = text;
};

// Start the game.
function startGame() {
    scoreSaved = false;
    if (gameState.status !== "menu") return;

    gameState.status = "playing";

    showMessage("Game started! Choose a plant and defend your garden.");
    updateInterface();
}

// Pause or resume the game.
function togglePause() {
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
function resetGame() {
    scoreSaved = false;
    resetGameState();

    showMessage("Game reset. Press Start Game to begin.");
    updateInterface();
}

// Handle plant card selection.
plantCards.forEach(card => {
    card.addEventListener("click", () => {
        const result = plantSystem.selectPlant(card.dataset.plant);

        showMessage(result.message);
        updateInterface();
    });
});

// Handle lawn clicks.
canvas.addEventListener("click", event => {
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

let lastTime = null;

function gameLoop(timestamp) {
    // Calculate elapsed time in seconds.
    const deltaTime = lastTime === null
        ? 0
        : (timestamp - lastTime) / 1000;

    lastTime = timestamp;

    // Update plants only while the game is running.
  if (gameState.status === "playing") {
    const generatedSunlight =
        plantSystem.updatePlants(deltaTime);

    zombieSystem.update(deltaTime);

const defeatedCount = projectileSystem.update(deltaTime);

   
if (
    gameState.status === "gameover" ||
    gameState.status === "victory"
) {
    if (!scoreSaved) {
        const result = leaderboardSystem.saveScore(
            playerNameInput.value,
            gameState.score
        );

        scoreSaved = true;

        updateLeaderboard();

        const outcome =
            gameState.status === "victory"
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

} else if (generatedSunlight > 0 || defeatedCount > 0) {
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

function updateLeaderboard() {
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

