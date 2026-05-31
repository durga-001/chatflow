import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { QueryResult } from "pg";
import pool from "../database/init";
import {
  EmailConflictError,
  InvalidCredentialsError,
  ValidationError,
  type AuthResult,
  type JwtPayload,
  type LoginPayload,
  type PublicUser,
  type SignupPayload,
  type UserRow,
} from "../types/auth.types";

// ─── Constants ─────────────────────────────────────────────────────────────────

/** 12 rounds ≈ 250 ms on a modern CPU — strong enough, not user-hostile */
const SALT_ROUNDS = 12;

/**
 * Dummy hash used during timing-safe login (see login() below).
 * Pre-computed so it doesn't add meaningful latency on each request.
 */
const DUMMY_HASH =
  "$2b$12$invalidhashpadding.00000000000000000000000000000000000000";

// ─── Environment guard ─────────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val)
    throw new Error(`[auth] Missing required environment variable: ${key}`);
  return val;
}

// ─── Input validation ──────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSignup(input: SignupPayload): void {
  const errors = [];

  if (!input.name?.trim())
    errors.push({ field: "name", message: "Name is required" });

  if (!input.email?.trim())
    errors.push({ field: "email", message: "Email is required" });
  else if (!EMAIL_RE.test(input.email))
    errors.push({ field: "email", message: "Invalid email address" });

  if (!input.password)
    errors.push({ field: "password", message: "Password is required" });
  else if (input.password.length < 8)
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters",
    });

  if (errors.length > 0) throw new ValidationError(errors);
}

function validateLogin(input: LoginPayload): void {
  const errors = [];

  if (!input.email?.trim())
    errors.push({ field: "email", message: "Email is required" });

  if (!input.password)
    errors.push({ field: "password", message: "Password is required" });

  if (errors.length > 0) throw new ValidationError(errors);
}

// ─── JWT helpers ───────────────────────────────────────────────────────────────

function signToken(userId: string, email: string): string {
  const secret = requireEnv("JWT_SECRET");
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "7d") as jwt.SignOptions["expiresIn"];

  const payload: Omit<JwtPayload, "iat" | "exp"> = { sub: userId, email };
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  const secret = requireEnv("JWT_SECRET");
  return jwt.verify(token, secret) as JwtPayload;
}

// ─── Database helpers ──────────────────────────────────────────────────────────

async function findByEmail(email: string): Promise<UserRow | null> {
  const result: QueryResult<UserRow> = await pool.query(
    `SELECT id, name, email, password_hash, avatar_url, created_at
       FROM users
      WHERE email = $1
      LIMIT 1`,
    [email],
  );
  return result.rows[0] ?? null;
}

async function emailTaken(email: string): Promise<boolean> {
  const result: QueryResult<{ exists: boolean }> = await pool.query(
    `SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS exists`,
    [email],
  );
  return result.rows[0].exists;
}

async function insertUser(
  name: string,
  email: string,
  password_hash: string,
): Promise<PublicUser> {
  const result: QueryResult<PublicUser> = await pool.query(
    `INSERT INTO users (name, email, password_hash)
          VALUES ($1, $2, $3)
       RETURNING id, name, email, avatar_url, created_at`,
    [name, email, password_hash],
  );
  return result.rows[0];
}

// ─── Public service methods ────────────────────────────────────────────────────

/**
 * Registers a new user and returns a signed JWT alongside the public profile.
 *
 * @throws {ValidationError}    on malformed input
 * @throws {EmailConflictError} if the email is already registered
 */
export async function signup(input: SignupPayload): Promise<AuthResult> {
  // 1. Validate — throws ValidationError on failure
  validateSignup(input);

  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  // 2. Duplicate check
  if (await emailTaken(email)) throw new EmailConflictError();

  // 3. Hash — bcrypt includes its own random salt
  const password_hash = await bcrypt.hash(input.password, SALT_ROUNDS);

  // 4. Persist
  const user = await insertUser(name, email, password_hash);

  // 5. Issue token
  const token = signToken(user.id, user.email);

  return { token, user };
}

/**
 * Validates credentials and returns a signed JWT alongside the public profile.
 *
 * @throws {ValidationError}        on malformed input
 * @throws {InvalidCredentialsError} on email not found or wrong password
 */
export async function login(input: LoginPayload): Promise<AuthResult> {
  // 1. Validate — throws ValidationError on failure
  validateLogin(input);

  const email = input.email.trim().toLowerCase();

  // 2. Fetch row (includes password_hash — only usage)
  const row = await findByEmail(email);

  // 3. Always run bcrypt even when the user doesn't exist.
  //    Without this a timing attack can enumerate valid emails:
  //    missing user → ~0 ms, wrong password → ~250 ms.
  const hashToCompare = row?.password_hash ?? DUMMY_HASH;
  const match = await bcrypt.compare(input.password, hashToCompare);

  if (!row || !match) throw new InvalidCredentialsError();

  // 4. Issue token
  const token = signToken(row.id, row.email);

  // 5. Strip password_hash before returning
  const { password_hash: _stripped, ...user } = row;
  return { token, user };
}
