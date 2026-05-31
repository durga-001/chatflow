import pool from "../database/init";
import type { QueryResult } from "pg";

// ─── Row shape returned from PostgreSQL ───────────────────────────────────────
export interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  created_at: Date;
}

// ─── Shape used when inserting a new user ─────────────────────────────────────
export interface CreateUserInput {
  name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Returns the full user row for a given email, or null if not found.
 * Used during login to retrieve the stored password_hash for comparison.
 */
export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const result: QueryResult<UserRow> = await pool.query(
    `SELECT id, name, email, password_hash, avatar_url, created_at
       FROM users
      WHERE email = $1
      LIMIT 1`,
    [email],
  );
  return result.rows[0] ?? null;
}

/**
 * Returns a single user by primary key, or null if not found.
 * password_hash is intentionally excluded — never send it beyond the auth layer.
 */
export async function findUserById(
  id: string,
): Promise<Omit<UserRow, "password_hash"> | null> {
  const result: QueryResult<Omit<UserRow, "password_hash">> = await pool.query(
    `SELECT id, name, email, avatar_url, created_at
       FROM users
      WHERE id = $1
      LIMIT 1`,
    [id],
  );
  return result.rows[0] ?? null;
}

/**
 * Inserts a new user row and returns the created record (without password_hash).
 * The DB generates the UUID and created_at timestamp.
 */
export async function createUser(
  input: CreateUserInput,
): Promise<Omit<UserRow, "password_hash">> {
  const result: QueryResult<Omit<UserRow, "password_hash">> = await pool.query(
    `INSERT INTO users (name, email, password_hash, avatar_url)
          VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, avatar_url, created_at`,
    [input.name, input.email, input.password_hash, input.avatar_url ?? null],
  );
  // INSERT … RETURNING always returns exactly one row
  return result.rows[0];
}

/**
 * Returns true if a user with this email already exists.
 * Cheaper than findUserByEmail when you only need the boolean.
 */
export async function emailExists(email: string): Promise<boolean> {
  const result: QueryResult<{ exists: boolean }> = await pool.query(
    `SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS exists`,
    [email],
  );
  return result.rows[0].exists;
}
