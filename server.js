const express = require("express");
const cors = require("cors");
require("dotenv").config();

const guestRoutes = require("./routes/guest");
const adminRoutes = require("./routes/admin");
const photoRoutes = require("./routes/photo");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Wedding Album API Running");
});

app.get("/test-photo-route", (req, res) => {
  res.send("photo route exists");
});

app.use("/api/guest", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/upload", uploadRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});