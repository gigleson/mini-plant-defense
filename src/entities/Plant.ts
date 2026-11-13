
import { Entity } from "./Entity.js";
import type { PlantType } from "../config.js";

// Derive the configuration type directly from config.ts.
type PlantConfig = (typeof import("../config.js").PLANT_CONFIG)[PlantType];

export abstract class Plant extends Entity {
    type: PlantType;
    name: string;
    emoji: string;
    cost: number;

    row: number;
    column: number;
   

    constructor(
        type: PlantType,
        row: number,
        column: number,
        config: PlantConfig
    ) {
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

    takeDamage(amount: number): number {
        super.takeDamage(amount);
        return this.health;
    }

    getPosition(): { row: number; column: number } {
        return {
            row: this.row,
            column: this.column
        };
    }
 abstract update(deltaTime: number): boolean | number | void;
   
    render(ctx: CanvasRenderingContext2D): void {
        // Your existing RenderingSystem renders plants.
    }
}
