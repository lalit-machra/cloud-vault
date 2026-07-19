import prisma from "../../common/lib/prisma.js";
import { hashPassword } from "./auth.utils.js";

export const signupUser = async ({ username, email, password}) => {
    // check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
};