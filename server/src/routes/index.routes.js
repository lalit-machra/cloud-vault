import { Router } from "express";
import { authenticateToken } from "../common/utils/jwt.js";

const indexRouter = Router();

indexRouter.get("/", authenticateToken, (req, res) => {
    res.send("hello my world");
});

export default indexRouter;