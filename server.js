const express = require("express");
const cors = require("cors");

// ROUTES
const guestRoutes = require("./routes/guest");
const adminRoutes = require("./routes/admin");
const photoRoutes = require("./routes/photo");
const uploadRoutes = require("./routes/upload");

const app = express();

app.use(cors());
app.use(express.json());

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Wedding Album API Running");
});

// ROUTE MOUNTS (🔥 THIS IS WHAT YOU ARE MISSING)
app.use("/api/guest", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/upload", uploadRoutes);
app.get("/test-photo-route", (req, res) => {
  res.send("photo route exists");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});