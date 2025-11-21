// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs-extra";
import path from "path";

dotenv.config();

import connectDB from "./config/database.js";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import marksheetRoutes from "./routes/marksheetRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Ensure uploads folder exists
fs.ensureDirSync(path.join(process.cwd(), "uploads/marksheets"));

// Connect to MongoDB
connectDB(process.env.MONGO_URI, "college_portal") // correct DB name
  .then(() => console.log("✅ Connected to MongoDB: college_portal"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api", authRoutes);        // /api/register  /api/login
app.use("/api", studentRoutes);     // /api/profile  /api/arrears
app.use("/api/admin", adminRoutes); // /api/admin/login  /api/admin/stats
app.use("/api", marksheetRoutes);   // /api/upload-marksheet  /api/marksheets
app.use("/api/ai", aiRoutes); // /api/ai/chat
app.use("/api", facultyRoutes);  // /api/faculty/login
      

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
