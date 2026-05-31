import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import authRoutes from "./routes/authRoutes";
const app: Application = express();

app.use("/api/auth", authRoutes);

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

// ─── Future mounts (uncomment as you add each layer) ──────────────────────────
// app.use('/api/auth',     authRoutes);
// app.use('/api/users',    userRoutes);
// app.use('/api/messages', messageRoutes);
// app.use('/api/rooms',    roomRoutes);

export default app;
