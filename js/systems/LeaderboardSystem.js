
const STORAGE_KEY = "miniPlantDefenseLeaderboard";
const MAX_ENTRIES = 5;

export class LeaderboardSystem {
    loadScores() {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);

            if (!savedData) return [];

            const scores = JSON.parse(savedData);

            if (!Array.isArray(scores)) return [];

            return scores
                .filter(entry =>
                    typeof entry.name === "string" &&
                    typeof entry.score === "number" &&
                    Number.isFinite(entry.score) &&
                    entry.score >= 0
                )
                .sort((a, b) => b.score - a.score)
                .slice(0, MAX_ENTRIES);

        } catch (error) {
            console.error("Could not load leaderboard:", error);
            return [];
        }
    }

   
saveScore(name, score) {
    if (
        typeof name !== "string" ||
        !Number.isFinite(score) ||
        score < 0
    ) {
        return {
            scores: this.loadScores(),
            rank: null,
            isNewRecord: false
        };
    }

    const cleanName = name.trim().slice(0, 20) || "Player";

    const scores = this.loadScores();

    // Check the previous highest score.
    const previousBest = scores[0]?.score ?? 0;

    const newEntry = {
        name: cleanName,
        score,
        date: new Date().toLocaleDateString()
    };

    scores.push(newEntry);

    scores.sort((a, b) => b.score - a.score);

    // Find the player's position.
    const position = scores.indexOf(newEntry);
    const rank = position < MAX_ENTRIES ? position + 1 : null;

    const topScores = scores.slice(0, MAX_ENTRIES);

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(topScores)
        );
    } catch (error) {
        console.error("Could not save leaderboard:", error);
    }

    return {
        scores: topScores,
        rank,
        isNewRecord: score > previousBest
    };
}

    clearScores() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error("Could not clear leaderboard:", error);
            return false;
        }
    }
}
