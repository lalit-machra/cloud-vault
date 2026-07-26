import express from "express";
import indexRouter from "./routes/index.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import { errorHandler } from "./common/middleware/errorHandler.js";
import filesRouter from "./features/files/files.routes.js";

const app = express();

app.use(express.json());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/files', filesRouter);
app.use(errorHandler);

export default app;
