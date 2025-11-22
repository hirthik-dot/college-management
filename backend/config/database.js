// backend/config/database.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (mongoUri, dbName = "college_portal") => {
  try {
    await mongoose.connect(mongoUri, {
      dbName,  // ✅ use DB passed from server.js
    });

    console.log(`🚀 MongoDB connected to ${dbName}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err; // ❗ let server.js handle the failure
  }
};

export default connectDB;
