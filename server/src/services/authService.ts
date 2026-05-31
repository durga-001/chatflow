import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUser,
  emailExists,
  findUserByEmail,
  type UserRow,
} from "../repositories/userRepository";

// ─── Constants ─────────────────────────────────────────────────────────────────
const SALT_ROUNDS = 12; // ~250 ms on a modern CPU — good balance of cost vs UX

// ─── Environment helpers (fail fast at startup if misconfigured) ───────────────
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

// ─── Public types ──────────────────────────────────────────────────────────────
export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Shape returned to the controller after successful auth */
export interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    created_at: Date;
  };
}

// ─── Domain errors ─────────────────────────────────────────────────────────────
// Typed error classes let the controller map them to HTTP status codes
// without coupling the service to Express.

export class EmailAlreadyInUseError extends Error {
  constructor() {
    super("Email is already in use");
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
  }
}

// ─── JWT helpers ───────────────────────────────────────────────────────────────
export interface JwtPayload {
  sub: string; // user id
  email: string;
  iat?: number;
  exp?: number;
}

function signToken(userId: string, email: string): string {
  const secret = requireEnv("JWT_SECRET");
  const expiresIn = (process.env.JWT_EXPIRES_IN ??
    "7d") as jwt.SignOptions["expiresIn"];

  return jwt.sign(
    { sub: userId, email } satisfies Omit<JwtPayload, "iat" | "exp">,
    secret,
    { expiresIn },
  );
}

export function verifyToken(token: string): JwtPayload {
  const secret = requireEnv("JWT_SECRET");
  return jwt.verify(token, secret) as JwtPayload;
}

// ─── Service methods ───────────────────────────────────────────────────────────

/**
 * Creates a new user account.
 *
 * @throws {EmailAlreadyInUseError} if the email is taken.
 */
export async function signup(input: SignupInput): Promise<AuthResult> {
  const { name, email, password } = input;

  // 1. Guard: duplicate email
  const taken = await emailExists(email);
  if (taken) throw new EmailAlreadyInUseError();

  // 2. Hash password — never store plaintext
  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  // 3. Persist
  const user = await createUser({
    name,
    email: email.toLowerCase(),
    password_hash,
  });

  // 4. Issue token
  const token = signToken(user.id, user.email);

  return { token, user };
}

/**
 * Validates credentials and returns a signed JWT on success.
 *
 * @throws {InvalidCredentialsError} if email not found or password wrong.
 */
export async function login(input: LoginInput): Promise<AuthResult> {
  const { email, password } = input;

  // 1. Fetch full row (including password_hash) — only place we do this
  const row: UserRow | null = await findUserByEmail(email.toLowerCase());

  // 2. Always run bcrypt even on miss — prevents timing-based user enumeration
  const hashToCompare =
    row?.password_hash ??
    "$2b$12$invalidhashpadding000000000000000000000000000000000000";
  const match = await bcrypt.compare(password, hashToCompare);

  if (!row || !match) throw new InvalidCredentialsError();

  // 3. Issue token
  const token = signToken(row.id, row.email);

  // 4. Return user without password_hash
  const { password_hash: _omit, ...user } = row;
  return { token, user };
}
