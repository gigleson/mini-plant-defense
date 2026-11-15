
import "dotenv/config";

import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const PORT = 3000;

app.use(cors());
app.use(express.json());

// GET: Retrieve the top five leaderboard scores.
app.get(
    "/api/leaderboard",
    async (_req: Request, res: Response) => {
        try {
            const scores = await prisma.leaderboard.findMany({
                orderBy: [
                    { score: "desc" },
                    { date: "asc" }
                ],
                take: 5
            });

            res.json(scores);
        } catch (error) {
            console.error("Could not load scores:", error);

            res.status(500).json({
                message: "Failed to load leaderboard."
            });
        }
    }
);

// POST: Save a new player score.
app.post(
    "/api/leaderboard",
    async (req: Request, res: Response) => {
        try {
            const { name, score } = req.body;

            if (
                typeof name !== "string" ||
                typeof score !== "number" ||
                !Number.isSafeInteger(score) ||
                score < 0
            ) {
                res.status(400).json({
                    message: "Invalid player name or score."
                });
                return;
            }

            const cleanName =
                name.trim().slice(0, 20) || "Player";

            const previousBest =
                await prisma.leaderboard.findFirst({
                    orderBy: { score: "desc" }
                });

            const newEntry =
                await prisma.leaderboard.create({
                    data: {
                        name: cleanName,
                        score
                    }
                });

            const scores =
                await prisma.leaderboard.findMany({
                    orderBy: [
                        { score: "desc" },
                        { date: "asc" }
                    ],
                    take: 5
                });

            const rank =
                1 + await prisma.leaderboard.count({
                    where: {
                        score: { gt: score }
                    }
                });

            res.status(201).json({
                entry: newEntry,
                scores,
                rank: rank <= 5 ? rank : null,
                isNewRecord:
                    score > (previousBest?.score ?? 0)
            });

        } catch (error) {
            console.error("Could not save score:", error);

            res.status(500).json({
                message: "Failed to save score."
            });
        }
    }
);

// DELETE: Clear all leaderboard scores.
app.delete(
    "/api/leaderboard",
    async (_req: Request, res: Response) => {
        try {
            await prisma.leaderboard.deleteMany();

            res.json({
                message: "Leaderboard cleared successfully."
            });
        } catch (error) {
            console.error("Could not clear scores:", error);

            res.status(500).json({
                message: "Failed to clear leaderboard."
            });
        }
    }
);

// Start server.
app.listen(PORT, () => {
    console.log(
        `Leaderboard API running at http://localhost:${PORT}`
    );
});
