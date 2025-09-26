import express from "express";
import bcrypt from "bcryptjs";
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  console.log("Register request body:", req.body);

  try {
    const { name, mobile, email, aadhaar, address, permanentAddress, state, city, password } = req.body;

    // Basic validation (optional, aap customize kar sakte hain)
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user instance
    const user = new User({
      name,
      mobile,
      email,
      aadhaar,
      address,
      permanentAddress,
      state,
      city,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);

    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(400).json({ error: "Invalid data" });
  }
});


// Login
router.post("/login", async (req, res) => {
  console.log("Login request body:", req.body);  // <--- Ye add karo

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found for email:", email);  // <--- Ye add karo
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("Password mismatch for email:", email);  // <--- Ye add karo
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: { id: user._id, email: user.email }
  });
});

export default router;
