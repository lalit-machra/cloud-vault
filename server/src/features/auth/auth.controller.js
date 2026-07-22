import { signupUser, loginUser } from "./auth.service.js";
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