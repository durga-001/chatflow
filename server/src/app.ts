import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import authRouter from "./routes/auth.routes";

const app: Application = express();

// ─── Global middleware ─────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    service: "chatflow-backend",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRouter);

export default app;
