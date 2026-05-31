import dotenv from "dotenv";

dotenv.config();

console.log("ENV TEST:", process.env.DATABASE_URL);

import app from "./app";
import { initDatabase, closeDatabasePool } from "./database/init";

const PORT: number = parseInt(process.env.PORT ?? "4000", 10);
const NODE_ENV: string = process.env.NODE_ENV ?? "development";

async function startServer() {
  try {
    // Connect & initialize PostgreSQL schema
    console.log("DATABASE_URL =", process.env.DATABASE_URL);
    await initDatabase();

    const server = app.listen(PORT, () => {
      console.log(`[server] ChatFlow backend running`);
      console.log(`[server] Environment : ${NODE_ENV}`);
      console.log(`[server] Port        : ${PORT}`);
      console.log(`[server] Health      : http://localhost:${PORT}/api/health`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n[server] ${signal} received — shutting down gracefully`);

      server.close(async () => {
        console.log("[server] HTTP server closed");

        await closeDatabasePool();

        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("[server] Startup failed:", error);
    process.exit(1);
  }
}

startServer();
