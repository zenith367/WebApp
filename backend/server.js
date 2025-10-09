const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/student", require("./routes/student"));
app.use("/api/lecturer", require("./routes/lecturer"));
app.use("/api/prl", require("./routes/prl"));
app.use("/api/pl", require("./routes/pl"));
app.use("/api/export", require("./routes/export"));


// Test DB connection
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ status: "Backend is working 🚀", time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
