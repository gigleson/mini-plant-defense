
import { Entity } from "./Entity.js";
import { GAME_CONFIG } from "../config.js";

export class Zombie extends Entity {
    row: number;
    speed: number;
    damage: number;
    attackTimer: number;
    attackInterval: number;

    constructor(row: number) {
        const cellHeight = GAME_CONFIG.canvasHeight / GAME_CONFIG.rows;

        const width = 50;
        const height = 60;

        const x = GAME_CONFIG.canvasWidth;
        const y = row * cellHeight + (cellHeight - height) / 2;

        super(x, y, width, height, 100);

        this.row = row;
        this.speed = 25;
        this.damage = 10;
        this.attackTimer = 0;
        this.attackInterval = 1;
    }

    update(deltaTime: number): void {
        if (this.isDestroyed) return;

        if (!Number.isFinite(deltaTime) || deltaTime < 0) {
            throw new Error("Invalid delta time.");
        }

        this.x -= this.speed * deltaTime;
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (this.isDestroyed) return;

        // Zombie body
        ctx.fillStyle = "#526b45";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Zombie head
        ctx.fillStyle = "#9aaf78";
        ctx.fillRect(this.x + 8, this.y - 15, 34, 25);

        // Eyes
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x + 15, this.y - 7, 6, 6);
        ctx.fillRect(this.x + 30, this.y - 7, 6, 6);

        // Health bar
        ctx.fillStyle = "#542d1d";
        ctx.fillRect(this.x, this.y - 23, this.width, 5);

        ctx.fillStyle = "#37b84a";
        ctx.fillRect(
            this.x,
            this.y - 23,
            this.width * (this.health / this.maxHealth),
            5
        );
    }
}
