

import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

async function createUser(): Promise<void> {
    const username = process.env.INITIAL_USERNAME;
    const password = process.env.INITIAL_PASSWORD;

    if (!username || !password) {
        throw new Error("Username and password are required.");
    }

    if (password.length < 8) {
        throw new Error("Password must contain at least 8 characters.");
    }

    const existingUser = await prisma.user.findUnique({
        where: { username }
    });

    if (existingUser) {
        console.log("This username already exists.");
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
        data: {
            username,
            passwordHash
        }
    });

    console.log(`User "${username}" created successfully.`);
}

createUser()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });