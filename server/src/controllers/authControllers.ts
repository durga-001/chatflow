import type { Request, Response, NextFunction } from "express";
import {
  signup,
  login,
  EmailAlreadyInUseError,
  InvalidCredentialsError,
  type SignupInput,
  type LoginInput,
} from "../services/authService";

// ─── Validation helpers ────────────────────────────────────────────────────────
// Lightweight guards — swap for zod/joi later without changing anything else.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ValidationError {
  field: string;
  message: string;
}

function validateSignup(body: Partial<SignupInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body.name?.trim())
    errors.push({ field: "name", message: "Name is required" });

  if (!body.email?.trim())
    errors.push({ field: "email", message: "Email is required" });
  else if (!EMAIL_RE.test(body.email))
    errors.push({ field: "email", message: "Invalid email address" });

  if (!body.password)
    errors.push({ field: "password", message: "Password is required" });
  else if (body.password.length < 8)
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters",
    });

  return errors;
}

function validateLogin(body: Partial<LoginInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body.email?.trim())
    errors.push({ field: "email", message: "Email is required" });

  if (!body.password)
    errors.push({ field: "password", message: "Password is required" });

  return errors;
}

// ─── Controllers ───────────────────────────────────────────────────────────────

/**
 * POST /api/auth/signup
 * Body: { name, email, password }
 */
export async function signupController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // 1. Validate input
    const errors = validateSignup(req.body as Partial<SignupInput>);
    if (errors.length > 0) {
      res.status(400).json({ success: false, errors });
      return;
    }

    const { name, email, password } = req.body as SignupInput;

    // 2. Delegate to service
    const result = await signup({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    // 3. Respond — 201 Created
    res.status(201).json({
      success: true,
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (err) {
    if (err instanceof EmailAlreadyInUseError) {
      res.status(409).json({
        success: false,
        errors: [{ field: "email", message: err.message }],
      });
      return;
    }
    // Unknown errors bubble to Express error handler
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // 1. Validate input
    const errors = validateLogin(req.body as Partial<LoginInput>);
    if (errors.length > 0) {
      res.status(400).json({ success: false, errors });
      return;
    }

    const { email, password } = req.body as LoginInput;

    // 2. Delegate to service
    const result = await login({ email: email.trim(), password });

    // 3. Respond — 200 OK
    res.status(200).json({
      success: true,
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      // 401, not 404 — never confirm whether an email exists
      res.status(401).json({
        success: false,
        errors: [{ field: "credentials", message: err.message }],
      });
      return;
    }
    next(err);
  }
}
