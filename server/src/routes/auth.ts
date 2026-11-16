import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
}

// Signup
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !password
        ) {
            res.status(400).json({
                message: "Username and password are required."
            });
            return;
        }

        const cleanUsername = username.trim();

        if (!/^[a-zA-Z0-9_]{3,20}$/.test(cleanUsername)) {
            res.status(400).json({
                message: "Username must be 3-20 characters."
            });
            return;
        }

        if (password.length < 8 || password.length > 72) {
            res.status(400).json({
                message: "Password must be 8-72 characters."
            });
            return;
        }

        const existingUser = await prisma.user.findUnique({
            where: { username: cleanUsername }
        });

        if (existingUser) {
            res.status(409).json({
                message: "Username already exists."
            });
            return;
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                username: cleanUsername,
                passwordHash
            }
        });

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "Registration successful.",
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        console.error("Signup error:", error);

        res.status(500).json({
            message: "Registration failed."
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            !username.trim() ||
            !password
        ) {
            res.status(400).json({
                message: "Username and password are required."
            });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { username: username.trim() }
        });

        if (!user) {
            res.status(401).json({
                message: "Invalid username or password."
            });
            return;
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            res.status(401).json({
                message: "Invalid username or password."
            });
            return;
        }

        const token = jwt.sign(
            { userId: user.id },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed."
        });
    }
});

export default router;