import { PLANT_CONFIG } from "../config.js";
import { Plant } from "./Plant.js";
export class WallNut extends Plant {
    constructor(row, column) {
        super("wallnut", row, column, PLANT_CONFIG.wallnut);
        this.defenseType = "blocker";
    }
    update(deltaTime) {
        if (!this.alive)
            return;
        if (!Number.isFinite(deltaTime) || deltaTime < 0) {
            throw new Error("Invalid delta time.");
        }
        // Wall-nut does not perform any active action.
    }
    takeDamage(amount) {
        return super.takeDamage(amount);
    }
    getDefenseStatus() {
        return {
            health: this.health,
            maxHealth: this.maxHealth,
            alive: this.alive,
            defenseType: this.defenseType
        };
    }
}
