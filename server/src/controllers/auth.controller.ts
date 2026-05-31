import type { Request, Response, NextFunction } from "express";
import { signup, login } from "../services/auth.service";
import {
  EmailConflictError,
  InvalidCredentialsError,
  ValidationError,
  type ApiResponse,
  type AuthResult,
  type LoginPayload,
  type SignupPayload,
} from "../types/auth.types";

// ─── POST /api/auth/signup ─────────────────────────────────────────────────────

/**
 * Accepts { name, email, password }, creates an account, returns JWT + user.
 *
 * 201 — account created
 * 400 — validation failed
 * 409 — email already registered
 * 500 — unexpected (passed to Express error handler via next)
 */
export async function signupController(
  req: Request<unknown, ApiResponse<AuthResult>, SignupPayload>,
  res: Response<ApiResponse<AuthResult>>,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await signup(req.body);

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ success: false, errors: err.errors });
      return;
    }
    if (err instanceof EmailConflictError) {
      res.status(409).json({
        success: false,
        errors: [{ field: "email", message: err.message }],
      });
      return;
    }
    next(err); // 500 — let the global error handler deal with it
  }
}

// ─── POST /api/auth/login ──────────────────────────────────────────────────────

/**
 * Accepts { email, password }, validates credentials, returns JWT + user.
 *
 * 200 — authenticated
 * 400 — validation failed (missing fields)
 * 401 — wrong email or password
 * 500 — unexpected (passed to Express error handler via next)
 */
export async function loginController(
  req: Request<unknown, ApiResponse<AuthResult>, LoginPayload>,
  res: Response<ApiResponse<AuthResult>>,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await login(req.body);

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ success: false, errors: err.errors });
      return;
    }
    if (err instanceof InvalidCredentialsError) {
      // 401, never 404 — confirming whether an email exists is a security leak
      res.status(401).json({
        success: false,
        errors: [{ field: "credentials", message: err.message }],
      });
      return;
    }
    next(err);
  }
}
