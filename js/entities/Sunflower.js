
// js/entities/Sunflower.js

import { Plant } from "./Plant.js";
import { PLANT_CONFIG } from "../config.js";

export class Sunflower extends Plant {
    #sunlightTimer = 0;

    constructor(row, column) {
        super(
            "sunflower",
            row,
            column,
            PLANT_CONFIG.sunflower
        );

        this.sunlightAmount = 25;
        this.generationInterval = 1;
    }

    update(deltaTime) {
        if (!this.alive) return 0;

        if (!Number.isFinite(deltaTime) || deltaTime < 0) {
            throw new Error("Invalid delta time.");
        }

        this.#sunlightTimer += deltaTime;

        let generatedSunlight = 0;

        while (this.#sunlightTimer >= this.generationInterval) {
            this.#sunlightTimer -= this.generationInterval;
            generatedSunlight += this.sunlightAmount;
        }

        return generatedSunlight;
    }

    generateSunlight() {
        return this.sunlightAmount;
    }
}
