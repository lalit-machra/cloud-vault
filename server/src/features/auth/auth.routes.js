import { Router } from "express";
import { signupController, loginController, getUserController } from "./auth.controller.js";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { validate } from "../../common/middleware/validate.js";
import { authenticateToken } from "../../common/utils/jwt.js";

const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), signupController);
authRouter.post("/login", validate(loginSchema), loginController);
authRouter.get("/me", authenticateToken, getUserController);

export default authRouter;