import fs from "fs";
import path from "path";
import { Pool } from "pg";

// ─── Connection pool ───────────────────────────────────────────────────────────
// A single pool is created here and reused across the application.
// DATABASE_URL format: postgres://user:password@host:port/dbname
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Sensible defaults — tune via env vars as traffic grows
  max: parseInt(process.env.PG_POOL_MAX ?? "10", 10),
  idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT ?? "30000", 10),
  connectionTimeoutMillis: parseInt(process.env.PG_CONN_TIMEOUT ?? "5000", 10),
});

// ─── Schema initialisation ────────────────────────────────────────────────────
/**
 * Reads schema.sql from disk and executes it against the connected database.
 * All CREATE statements are idempotent (IF NOT EXISTS), so this is safe to
 * call on every server start.
 */
export async function initDatabase(): Promise<void> {
  const schemaPath = path.resolve(__dirname, "schema.sql");

  let sql: string;
  try {
    sql = fs.readFileSync(schemaPath, "utf-8");
  } catch (err) {
    throw new Error(
      `[db] Could not read schema.sql at ${schemaPath}: ${String(err)}`,
    );
  }

  const client = await pool.connect();
  try {
    console.log("[db] Running schema initialisation…");
    await client.query(sql);
    console.log("[db] Schema ready ✓");
  } catch (err) {
    // Surface the full Postgres error so misconfigured schemas are easy to debug
    throw new Error(`[db] Schema initialisation failed: ${String(err)}`);
  } finally {
    // Always release the client back to the pool, even on error
    client.release();
  }
}

// ─── Health check helper ───────────────────────────────────────────────────────
/**
 * Sends a lightweight query to verify the pool can reach the database.
 * Used by GET /api/health once Postgres is wired into the health route.
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

// ─── Graceful shutdown helper ──────────────────────────────────────────────────
/**
 * Drains the connection pool.
 * Call this inside the SIGTERM / SIGINT handler in src/index.ts:
 *   await closeDatabasePool();
 */
export async function closeDatabasePool(): Promise<void> {
  await pool.end();
  console.log("[db] Connection pool closed");
}

export default pool;
