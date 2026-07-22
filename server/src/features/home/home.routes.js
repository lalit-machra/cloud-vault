import { authenticateToken } from "../../common/utils/jwt.js";
import { Router } from "express";

export const homeRouter = Router();

homeRouter.get("/", authenticateToken, (req, res, next) => {
    const userId = req.user.userId;
    console.log("Welcome userId: ", userId);
    res.status(200).json({ userId });
});