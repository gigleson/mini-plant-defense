
// js/entities/Entity.js

export class Entity {
    #health;
    #maxHealth;
    #isDestroyed;

    constructor(x, y, width, height, health) {
        if (new.target === Entity) {
            throw new Error("Entity is an abstract class and cannot be instantiated directly.");
        }

        if (health <= 0) {
            throw new Error("Entity health must be greater than zero.");
        }

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.#health = health;
        this.#maxHealth = health;
        this.#isDestroyed = false;
    }

    // Encapsulation: health is private.
    get health() {
        return this.#health;
    }

    get maxHealth() {
        return this.#maxHealth;
    }

    get isDestroyed() {
        return this.#isDestroyed;
    }

    takeDamage(amount) {
        if (typeof amount !== "number" || amount <= 0) {
            throw new Error("Damage must be a positive number.");
        }

        if (this.#isDestroyed) return;

        this.#health = Math.max(0, this.#health - amount);

        if (this.#health === 0) {
            this.#isDestroyed = true;
            this.onDestroy();
        }
    }

    heal(amount) {
        if (typeof amount !== "number" || amount <= 0) {
            throw new Error("Healing must be a positive number.");
        }

        if (this.#isDestroyed) return;

        this.#health = Math.min(
            this.#maxHealth,
            this.#health + amount
        );
    }

    onDestroy() {
        // Subclasses can override this method.
    }

    update(deltaTime) {
        throw new Error("update() must be implemented by a subclass.");
    }

    render(ctx) {
        throw new Error("render() must be implemented by a subclass.");
    }
}
