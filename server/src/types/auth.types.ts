// ─── Request payloads ─────────────────────────────────────────────────────────

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─── Database row shapes ───────────────────────────────────────────────────────

/** Full row as stored in PostgreSQL — password_hash must never leave the service layer */
export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: Date;
}

/** Safe public projection — password_hash stripped before leaving auth layer */
export type PublicUser = Omit<UserRow, "password_hash">;

// ─── Service return types ──────────────────────────────────────────────────────

export interface AuthResult {
  token: string;
  user: PublicUser;
}

// ─── JWT ──────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  sub: string; // user id
  email: string;
  iat?: number;
  exp?: number;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export interface FieldError {
  field: string;
  message: string;
}

// ─── API response envelope ────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  errors: FieldError[];
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

// ─── Domain errors ────────────────────────────────────────────────────────────
// Typed so the controller can catch specific classes and map to HTTP status codes
// without the service knowing anything about Express.

export class EmailConflictError extends Error {
  constructor() {
    super("Email is already registered");
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
  }
}

export class ValidationError extends Error {
  constructor(public readonly errors: FieldError[]) {
    super("Validation failed");
  }
}
