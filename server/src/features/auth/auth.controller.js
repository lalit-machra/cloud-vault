import { signupUser } from "./auth.service.js";

const signup = async (req, res, next) => {
    try {
        const data = req.body;
        const user = await signupUser(data);
        res.status(201).json({ user });
    } catch(err) {
        next(err);
    } 
}

export { signup };