import express from "express";
import indexRouter from "./routes/index.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import { errorHandler } from "./common/middleware/errorHandler.js";

const app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use(errorHandler);

export default app;
