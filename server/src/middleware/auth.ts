import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
}

// Add userId to Express Request.
declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
        res.status(401).json({
            message: "Authentication required."
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload;

        if (typeof decoded.userId !== "number") {
            res.status(403).json({
                message: "Invalid token."
            });
            return;
        }

        req.userId = decoded.userId;
        next();

    } catch {
        res.status(403).json({
            message: "Invalid or expired token."
        });
    }
}