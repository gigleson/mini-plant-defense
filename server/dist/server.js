"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = require("./prisma");
const auth_1 = __importDefault(require("./routes/auth"));
const auth_2 = require("./middleware/auth");
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_1.default);
// GET: Retrieve the top five leaderboard scores.
app.get("/api/leaderboard", async (_req, res) => {
    try {
        const scores = await prisma_1.prisma.leaderboard.findMany({
            orderBy: [
                { score: "desc" },
                { date: "asc" }
            ],
            take: 5
        });
        res.json(scores);
    }
    catch (error) {
        console.error("Could not load scores:", error);
        res.status(500).json({
            message: "Failed to load leaderboard."
        });
    }
});
// POST: Save a new player score.
app.post("/api/leaderboard", auth_2.authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        if (typeof userId !== "number") {
            res.status(401).json({
                message: "Authentication required."
            });
            return;
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            res.status(404).json({
                message: "User account not found."
            });
            return;
        }
        const { score } = req.body;
        if (typeof score !== "number" ||
            !Number.isSafeInteger(score) ||
            score < 0) {
            res.status(400).json({
                message: "Invalid score."
            });
            return;
        }
        const previousBest = await prisma_1.prisma.leaderboard.findFirst({
            orderBy: { score: "desc" }
        });
        const newEntry = await prisma_1.prisma.leaderboard.create({
            data: {
                name: user.username,
                score
            }
        });
        const scores = await prisma_1.prisma.leaderboard.findMany({
            orderBy: [
                { score: "desc" },
                { date: "asc" }
            ],
            take: 5
        });
        const rank = 1 + await prisma_1.prisma.leaderboard.count({
            where: {
                score: { gt: score }
            }
        });
        res.status(201).json({
            entry: newEntry,
            scores,
            rank: rank <= 5 ? rank : null,
            isNewRecord: score > (previousBest?.score ?? 0)
        });
    }
    catch (error) {
        console.error("Could not save score:", error);
        res.status(500).json({
            message: "Failed to save score."
        });
    }
});
// DELETE: Clear all leaderboard scores.
app.delete("/api/leaderboard", async (_req, res) => {
    try {
        await prisma_1.prisma.leaderboard.deleteMany();
        res.json({
            message: "Leaderboard cleared successfully."
        });
    }
    catch (error) {
        console.error("Could not clear scores:", error);
        res.status(500).json({
            message: "Failed to clear leaderboard."
        });
    }
});
// Start server.
app.listen(PORT, () => {
    console.log(`Leaderboard API running at http://localhost:${PORT}`);
});
