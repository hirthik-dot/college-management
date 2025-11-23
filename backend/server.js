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

// Start server ONLY after DB connects
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Routes
    app.use("/api", authRoutes);
    app.use("/api", studentRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api", marksheetRoutes);
    app.use("/api/ai", aiRoutes);
    app.use("/api", facultyRoutes);

    // Render uses its own PORT
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 API server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

startServer();
