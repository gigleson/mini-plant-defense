const API_URL = "http://localhost:3000/api/leaderboard";
export class LeaderboardSystem {
    // Load leaderboard scores from the database.
    async loadScores() {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to load leaderboard.");
        }
        return await response.json();
    }
    // Save a new score to the database.
    async saveScore(name, score, token) {
        if (!token) {
            throw new Error("Please log in before saving your score.");
        }
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                score
            })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Failed to save score.");
        }
        return {
            scores: result.scores,
            rank: result.rank,
            isNewRecord: result.isNewRecord
        };
    }
    // Clear all leaderboard scores.
    async clearScores() {
        const response = await fetch(API_URL, {
            method: "DELETE"
        });
        return response.ok;
    }
}
