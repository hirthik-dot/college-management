// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure this points to the correct model

// Utility function to clean strings from CSV import
const cleanString = (str) => {
  if (!str) return "";
  return str.trim().replace(/^"(.*)"$/, "$1"); // removes extra spaces and quotes
};

// Register User (for new users)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, student_id, branch, year } = req.body;

    // Clean input
    const emailClean = cleanString(email);
    const passwordClean = cleanString(password);

    console.log("Registering user:", { email: emailClean, password: passwordClean });

    // Check if user already exists
    const exists = await User.findOne({ email: emailClean });
    if (exists) {
      console.log("User already exists:", emailClean);
      return res.status(400).json({ msg: "User exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email: emailClean,
      password: passwordClean, // plain-text for CSV users
      role,
      student_id,
      branch,
      year
    });

    console.log("User registered successfully:", user);
    res.json({ msg: "User registered successfully", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Login User (plain-text password check with trimming & quote fix)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailClean = cleanString(email);
    const passwordClean = cleanString(password);

    console.log("Login attempt:", { email: emailClean, password: passwordClean });

    // Find user in the students collection
    const user = await User.findOne({ email: emailClean });
    console.log("Found user in DB:", user);

    if (!user) {
      console.log("Login failed: user not found");
      return res.status(400).json({ msg: "User not found" });
    }

    const dbPassword = cleanString(user.password);

    if (passwordClean !== dbPassword) {
      console.log("Login failed: password mismatch", { frontend: passwordClean, db: dbPassword });
      return res.status(400).json({ msg: "Wrong email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        student_id: user.student_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("Login successful:", { user: user.email });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        student_id: user.student_id
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};
