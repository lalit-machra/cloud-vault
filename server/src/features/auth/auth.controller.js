import { signupUser, loginUser, getUser } from "./auth.service.js";
import { getToken } from "../../common/utils/jwt.js";

export const signupController = async (req, res, next) => {
    try {
        const data = req.body;
        const user = await signupUser(data);
        res.status(201).json({ user });
    } catch(err) {
        next(err);
    } 
}

export const loginController = async (req, res, next) => {
    try {
        const data = req.body;
        const user = await loginUser(data);
        const token = getToken({ userId: user.id });
        const result = { user, token };
        res.status(200).json(result);
    } catch(err) {
        next(err);
    }
}

export const getUserController = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await getUser({ userId });
        res.status(200).json(user);
    } catch(err) {
        next(err);
    }
}