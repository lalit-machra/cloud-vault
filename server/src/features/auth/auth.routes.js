import { Router } from "express";
import { signup } from "./auth.controller.js";
import { signupSchema } from "./auth.validation.js";
import { validate } from "../../common/middleware/validate.js";

const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), signup);

export default authRouter;