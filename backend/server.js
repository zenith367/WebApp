const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// 🧱 Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://limkos-frontend.onrender.com"], // ✅ change this to your actual frontend Render URL later
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// 🧭 API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/student", require("./routes/student"));
app.use("/api/lecturer", require("./routes/lecturer"));
app.use("/api/prl", require("./routes/prl"));
app.use("/api/pl", require("./routes/pl"));

// ✅ Optional export route
try {
  app.use("/api/export", require("./routes/export"));
} catch {
  console.log("⚠️ No export.js found — skipping that route.");
}

// 🧩 Test DB connection route
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      status: "Backend is working 🚀",
      time: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🚀 Start server
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
