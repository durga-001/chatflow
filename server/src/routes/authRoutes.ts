import { Router } from "express";
import {
  signupController,
  loginController,
} from "../controllers/authController";

const router = Router();

/**
 * Auth routes — mounted at /api/auth in app.ts
 *
 * POST /api/auth/signup   → create account, return JWT
 * POST /api/auth/login    → validate credentials, return JWT
 */

router.post("/signup", signupController);
router.post("/login", loginController);

export default router;
