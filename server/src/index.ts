import app from "./app";
import { testConnection } from "./config/db";

const PORT: number = parseInt(process.env.PORT ?? "5000", 10);
const NODE_ENV: string = process.env.NODE_ENV ?? "development";

const startServer = async () => {
  await testConnection();

  const server = app.listen(PORT, () => {
    console.log(`[server] ChatFlow backend running`);
    console.log(`[server] Environment : ${NODE_ENV}`);
    console.log(`[server] Port        : ${PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`\n[server] ${signal} received — shutting down gracefully`);

    server.close(() => {
      console.log("[server] HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
};

startServer();
