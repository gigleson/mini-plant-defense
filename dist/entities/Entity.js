export class Entity {
    constructor(x, y, width, height, health) {
        this.isDestroyed = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.maxHealth = health;
    }
    takeDamage(amount) {
        if (!Number.isFinite(amount) || amount < 0) {
            throw new Error("Invalid damage amount.");
        }
        if (this.isDestroyed)
            return this.health;
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDestroyed = true;
        }
        return this.health;
    }
    get alive() {
        return !this.isDestroyed;
    }
}
