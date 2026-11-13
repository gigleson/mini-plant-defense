
import { GAME_CONFIG } from "./config.js";
import { gameState } from "./gameState.js";

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        if (!this.ctx) {
            throw new Error("Canvas 2D rendering is not supported.");
        }

        this.cellWidth = GAME_CONFIG.canvasWidth / GAME_CONFIG.columns;
        this.cellHeight = GAME_CONFIG.canvasHeight / GAME_CONFIG.rows;
    }

    drawBoard() {
        const { ctx, cellWidth, cellHeight } = this;

        for (let row = 0; row < GAME_CONFIG.rows; row++) {
            for (let column = 0; column < GAME_CONFIG.columns; column++) {
                ctx.fillStyle = (row + column) % 2 === 0
                    ? "#91cf55"
                    : "#83bd49";

                ctx.fillRect(
                    column * cellWidth,
                    row * cellHeight,
                    cellWidth,
                    cellHeight
                );

                ctx.strokeStyle = "rgba(255,255,255,0.4)";
                ctx.strokeRect(
                    column * cellWidth,
                    row * cellHeight,
                    cellWidth,
                    cellHeight
                );
            }
        }
    }

    drawPlants() {
        const { ctx, cellWidth, cellHeight } = this;

        for (const plant of gameState.plants) {
            const x = plant.column * cellWidth + cellWidth / 2;
            const y = plant.row * cellHeight + cellHeight / 2;

            ctx.font = "38px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(plant.emoji, x, y);

            // Simple health indicator
            const barWidth = 45;
            const healthRatio = plant.health / plant.maxHealth;

            ctx.fillStyle = "#542d1d";
            ctx.fillRect(x - barWidth / 2, y + 27, barWidth, 5);

            ctx.fillStyle = "#37b84a";
            ctx.fillRect(
                x - barWidth / 2,
                y + 27,
                barWidth * healthRatio,
                5
            );
        }
    }

render() {
    this.ctx.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
    );

    this.drawBoard();
    this.drawPlants();
    this.drawZombies();
    this.drawProjectiles();

    if (gameState.status === "paused") {
        this.ctx.fillStyle = "rgba(0,0,0,0.55)";
        this.ctx.fillRect(
            0, 0,
            this.canvas.width,
            this.canvas.height
        );

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 42px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        

        this.ctx.fillText(
            "PAUSED",
            this.canvas.width / 2,
            this.canvas.height / 2
        );
    }
    if (gameState.status === "gameover") {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";

    this.ctx.fillRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
    );

    this.ctx.fillStyle = "#ff4444";
    this.ctx.font = "bold 48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText(
        "GAME OVER",
        this.canvas.width / 2,
        this.canvas.height / 2
    );

    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "20px Arial";

    this.ctx.fillText(
        "Press Reset to try again",
        this.canvas.width / 2,
        this.canvas.height / 2 + 55
    );
}
if (gameState.status === "victory") {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.75)";

    this.ctx.fillRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
    );

    this.ctx.fillStyle = "#ffd700";
    this.ctx.font = "bold 48px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText(
        "YOU WIN!",
        this.canvas.width / 2,
        this.canvas.height / 2
    );

    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "20px Arial";

    this.ctx.fillText(
        "You defended your garden!",
        this.canvas.width / 2,
        this.canvas.height / 2 + 55
    );
}
}

    drawZombies() {
    for (const zombie of gameState.zombies) {
        zombie.render(this.ctx);
    }
}

    getCellFromPointer(event) {
        const rect = this.canvas.getBoundingClientRect();

        const x = (event.clientX - rect.left) *
            (this.canvas.width / rect.width);

        const y = (event.clientY - rect.top) *
            (this.canvas.height / rect.height);

        return {
            row: Math.floor(y / this.cellHeight),
            column: Math.floor(x / this.cellWidth)
        };
    }
    drawProjectiles() {
    for (const pea of gameState.projectiles) {
        pea.render(this.ctx);
    }
}
}
