import { Router } from "express";
import { signupController, loginController } from "./auth.controller.js";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { validate } from "../../common/middleware/validate.js";

const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), signupController);
authRouter.post("/login", validate(loginSchema), loginController);

export default authRouter;