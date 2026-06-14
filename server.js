import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import guestRoutes from "./routes/guest.js";
import adminRoutes from "./routes/admin.js";
import photoRoutes from "./routes/photo.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Wedding Album API Running V2");
});

app.get("/test-photo-route", (req, res) => {
  res.send("photo route exists");
});

app.use("/api/guest", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/upload", uploadRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});