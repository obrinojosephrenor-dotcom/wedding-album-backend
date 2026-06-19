import express        from "express";
import cors           from "cors";
import helmet         from "helmet";
import morgan         from "morgan";
import dotenv         from "dotenv";
import guestRoutes    from "./routes/guests.js";
import photoRoutes    from "./routes/photos.js";
import adminRoutes    from "./routes/admin.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 4000;

// Security
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin:      [process.env.FRONTEND_URL, "http://localhost:5173"],
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(generalLimiter);

// Routes
app.use("/api/guests", guestRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/admin",  adminRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// 404
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`🌸 Server running on port ${PORT}`));