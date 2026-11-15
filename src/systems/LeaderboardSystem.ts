const API_URL = "http://localhost:3000/api/leaderboard";

export interface LeaderboardEntry {
    id?: number;
    name: string;
    score: number;
    date: string;
}

export interface SaveScoreResult {
    scores: LeaderboardEntry[];
    rank: number | null;
    isNewRecord: boolean;
}

export class LeaderboardSystem {

    // Load leaderboard scores from the database.
    async loadScores(): Promise<LeaderboardEntry[]> {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load leaderboard.");
        }

        return await response.json() as LeaderboardEntry[];
    }

    // Save a new score to the database.
    async saveScore(
        name: string,
        score: number
    ): Promise<SaveScoreResult> {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                score
            })
        });

        if (!response.ok) {
            throw new Error("Failed to save score.");
        }

        const result = await response.json();

        return {
            scores: result.scores as LeaderboardEntry[],
            rank: result.rank as number | null,
            isNewRecord: result.isNewRecord as boolean
        };
    }

    // Clear all leaderboard scores.
    async clearScores(): Promise<boolean> {
        const response = await fetch(API_URL, {
            method: "DELETE"
        });

        return response.ok;
    }
}