"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("./prisma");
async function createUser() {
    const username = process.env.INITIAL_USERNAME;
    const password = process.env.INITIAL_PASSWORD;
    if (!username || !password) {
        throw new Error("Username and password are required.");
    }
    if (password.length < 8) {
        throw new Error("Password must contain at least 8 characters.");
    }
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { username }
    });
    if (existingUser) {
        console.log("This username already exists.");
        return;
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    await prisma_1.prisma.user.create({
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
    await prisma_1.prisma.$disconnect();
});
