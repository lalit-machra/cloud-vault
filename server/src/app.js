import express from "express";
import indexRouter from "./features/index/index.routes.js";

const app = express();

app.use('/', indexRouter);

export default app;
