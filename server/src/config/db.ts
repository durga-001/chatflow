import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const testConnection = async () => {
  try {
    const client = await pool.connect();

    console.log("✅ PostgreSQL Connected Successfully");

    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed");
    console.error(error);
  }
};
