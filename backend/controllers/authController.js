// controllers/authController.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Hash and create
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("✅ Registered user:", user);
    return res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).json({ error: "Server error during registration" });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("👉 Login attempt:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findByEmail(email);
    console.log("👉 User from DB:", user ? { id: user.id, email: user.email } : null);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Use String(password) to avoid type issues
    const valid = await bcrypt.compare(String(password), user.password);
    console.log("👉 Password valid?", valid);

    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user.id, user.role);
    console.log("✅ Login success for:", user.email);

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during login" });
  }
};
