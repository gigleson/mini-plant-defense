
// js/entities/Peashooter.js

import { Plant } from "./Plant.js";
import { PLANT_CONFIG } from "../config.js";

export class Peashooter extends Plant {
    #attackTimer = 0;

    constructor(row, column) {
        super(
            "peashooter",
            row,
            column,
            PLANT_CONFIG.peashooter
        );

        this.damage = 20;
        this.attackInterval = 1.5; // Seconds between attacks
    }

    update(deltaTime) {
        if (!this.alive) return false;

        if (!Number.isFinite(deltaTime) || deltaTime < 0) {
            throw new Error("Invalid delta time.");
        }

        this.#attackTimer += deltaTime;

        if (this.#attackTimer >= this.attackInterval) {
            this.#attackTimer -= this.attackInterval;
            return true;
        }

        return false;
    }

    getAttackDamage() {
        return this.damage;
    }
}
