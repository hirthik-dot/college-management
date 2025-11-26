// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Announcement from "../models/announcementModel.js";

// Clean input strings
const cleanString = (str) => {
  if (!str) return "";
  return str.trim().replace(/^"(.*)"$/, "$1");
};

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, student_id, branch, year } = req.body;

    if (!name || !email || !password) 
      return res.status(400).json({ msg: "Name, email, and password are required" });

    const emailClean = cleanString(email);
    const passwordClean = cleanString(password);

    const exists = await User.findOne({ email: emailClean });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const user = await User.create({
      name,
      email: emailClean,
      password: passwordClean,
      role: role || "student",
      student_id,
      branch,
      year,
      readAnnouncements: [] // track read announcements
    });

    res.status(201).json({ msg: "User registered successfully", user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: err.message });
  }
};

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ msg: "Email and password required" });

    const emailClean = cleanString(email);
    const passwordClean = cleanString(password);

    const user = await User.findOne({ email: emailClean });
    if (!user) return res.status(400).json({ msg: "User not found" });

    if (passwordClean !== cleanString(user.password)) 
      return res.status(400).json({ msg: "Wrong email or password" });

    // Unread announcements
    const allAnnouncements = await Announcement.find({});
    const read = user.readAnnouncements || [];
    const unreadCount = allAnnouncements.filter(a => !read.includes(a._id)).length;

    // JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, student_id: user.student_id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        student_id: user.student_id,
        unreadCount
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
};
