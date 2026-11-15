
const STORAGE_KEY = "miniPlantDefenseLeaderboard";
const MAX_ENTRIES = 5;

// Structure of one leaderboard entry.
export interface LeaderboardEntry {
    name: string;
    score: number;
    date: string;
}

// Structure returned by saveScore().
export interface SaveScoreResult {
    scores: LeaderboardEntry[];
    rank: number | null;
    isNewRecord: boolean;
}

// Validate data loaded from localStorage.
function isLeaderboardEntry(
    entry: unknown
): entry is LeaderboardEntry {
    if (typeof entry !== "object" || entry === null) {
        return false;
    }

    const candidate = entry as Record<string, unknown>;

    return (
        typeof candidate.name === "string" &&
        typeof candidate.score === "number" &&
        Number.isFinite(candidate.score) &&
        candidate.score >= 0 &&
        typeof candidate.date === "string"
    );
}

export class LeaderboardSystem {

    loadScores(): LeaderboardEntry[] {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);

            if (!savedData) return [];

            const scores: unknown = JSON.parse(savedData);

            if (!Array.isArray(scores)) return [];

            return scores
                .filter(isLeaderboardEntry)
                .sort((a, b) => b.score - a.score)
                .slice(0, MAX_ENTRIES);

        } catch (error) {
            console.error(
                "Could not load leaderboard:",
                error
            );

            return [];
        }
    }

    saveScore(
        name: string,
        score: number
    ): SaveScoreResult {

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

        const cleanName =
            name.trim().slice(0, 20) || "Player";

        const scores = this.loadScores();

        // Check the previous highest score.
        const previousBest = scores[0]?.score ?? 0;

        const newEntry: LeaderboardEntry = {
            name: cleanName,
            score,
            date: new Date().toLocaleDateString()
        };

        scores.push(newEntry);

        scores.sort((a, b) => b.score - a.score);

        // Find the player's position.
        const position = scores.indexOf(newEntry);

        const rank =
            position < MAX_ENTRIES
                ? position + 1
                : null;

        const topScores = scores.slice(0, MAX_ENTRIES);

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(topScores)
            );
        } catch (error) {
            console.error(
                "Could not save leaderboard:",
                error
            );
        }

        return {
            scores: topScores,
            rank,
            isNewRecord: score > previousBest
        };
    }

    clearScores(): boolean {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (error) {
            console.error(
                "Could not clear leaderboard:",
                error
            );

            return false;
        }
    }
}
