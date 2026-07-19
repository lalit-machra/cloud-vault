import { Router } from "express";

const indexRouter = Router();

indexRouter.get("/", (req, res) => {
    res.send("hello my world");
});

export default indexRouter;