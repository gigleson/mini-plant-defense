
import { gameState } from "../gameState.js";
import { GAME_CONFIG } from "../config.js";

export class ProjectileSystem {
    update(deltaTime: number): number {
        let defeatedCount = 0;

        // Move every active pea.
        for (const pea of gameState.projectiles) {
            pea.update(deltaTime);

            // Check collisions against zombies.
            for (const zombie of gameState.zombies) {
                if (zombie.isDestroyed) continue;

                const hit =
                    pea.x + pea.radius >= zombie.x &&
                    pea.x - pea.radius <= zombie.x + zombie.width &&
                    pea.y + pea.radius >= zombie.y &&
                    pea.y - pea.radius <= zombie.y + zombie.height;

                if (hit) {
                    zombie.takeDamage(pea.damage);
                    pea.active = false;

                    // Award points only when the zombie is defeated.
                    if (zombie.isDestroyed) {
                        gameState.score += 10;
                        defeatedCount++;
                    }

                    break;
                }
            }

            // Remove peas that leave the screen.
            if (pea.x - pea.radius > GAME_CONFIG.canvasWidth) {
                pea.active = false;
            }
        }

        // Remove inactive peas and destroyed zombies.
        gameState.projectiles = gameState.projectiles.filter(
            pea => pea.active
        );

        gameState.zombies = gameState.zombies.filter(
            zombie => !zombie.isDestroyed
        );

        return defeatedCount;
    }
}
