// backend/config/database.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "college_portal", // ✅ explicitly use your DB
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🚀 MongoDB connected to college_portal");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
