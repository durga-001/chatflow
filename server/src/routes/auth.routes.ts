import { Router } from "express";
import {
  signupController,
  loginController,
} from "../controllers/auth.controller";

/**
 * Auth routes — mount in app.ts:
 *   app.use('/api/auth', authRouter);
 *
 * POST /api/auth/signup  →  create account, return JWT
 * POST /api/auth/login   →  validate credentials, return JWT
 */
const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);

export default authRouter;
