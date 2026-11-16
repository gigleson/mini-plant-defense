


import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./prisma";
import authRoutes from "./routes/auth";
import { authenticateToken } from "./middleware/auth";

const app = express();



const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
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
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const userId = req.userId;

            if (typeof userId !== "number") {
                res.status(401).json({
                    message: "Authentication required."
                });
                return;
            }

            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (!user) {
                res.status(404).json({
                    message: "User account not found."
                });
                return;
            }

            const { score } = req.body;

            if (
                typeof score !== "number" ||
                !Number.isSafeInteger(score) ||
                score < 0
            ) {
                res.status(400).json({
                    message: "Invalid score."
                });
                return;
            }

            const previousBest =
                await prisma.leaderboard.findFirst({
                    orderBy: { score: "desc" }
                });

            const newEntry =
                await prisma.leaderboard.create({
                    data: {
                        name: user.username,
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
