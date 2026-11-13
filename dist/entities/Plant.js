import { Entity } from "./Entity.js";
export class Plant extends Entity {
    constructor(type, row, column, config) {
        if (!config || !Number.isFinite(config.health) || config.health <= 0) {
            throw new Error("Invalid plant configuration.");
        }
        // Entity receives grid coordinates and default dimensions.
        super(column, row, 1, 1, config.health);
        this.type = type;
        this.name = config.name ?? type;
        this.emoji = config.emoji ?? "🌱";
        this.cost = config.cost ?? 0;
        this.row = row;
        this.column = column;
    }
    takeDamage(amount) {
        super.takeDamage(amount);
        return this.health;
    }
    getPosition() {
        return {
            row: this.row,
            column: this.column
        };
    }
    render(ctx) {
        // Your existing RenderingSystem renders plants.
    }
}
