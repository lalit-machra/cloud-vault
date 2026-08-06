import prisma from "../../common/lib/prisma.js";
import { hashPassword, checkPassword } from "./auth.utils.js";

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

export const loginUser = async ({ email, password}) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 400;
        throw error;
    }

    const passwordMatch = await checkPassword(password, user.password);
    if (!passwordMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 400;
        throw error;
    }

    const { password: _, ...userWithoutPassword} = user;
    return userWithoutPassword;
}

export const getUser = async ({ userId }) => {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            username: true,
            email: true
        }
    });

    if (!user) throw new Error("User not found");

    return user;
}