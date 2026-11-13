
export abstract class Entity {
    x: number;
    y: number;
    width: number;
    height: number;

    health: number;
    maxHealth: number;

    isDestroyed: boolean = false;

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        health: number
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.health = health;
        this.maxHealth = health;
    }

    takeDamage(amount: number): number {
        if (!Number.isFinite(amount) || amount < 0) {
            throw new Error("Invalid damage amount.");
        }

        if (this.isDestroyed) return this.health;

        this.health -= amount;

        if (this.health <= 0) {
            this.health = 0;
            this.isDestroyed = true;
        }

        return this.health;
    }

    get alive(): boolean {
        return !this.isDestroyed;
    }
}
