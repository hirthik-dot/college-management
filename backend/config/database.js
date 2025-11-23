// backend/config/database.js
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async (mongoUri, dbName = "college_portal") => {
  try {
    // Use passed mongoUri, else fallback to env variable
    const uri = mongoUri || process.env.MONGO_URI;

    if (!uri) {
      throw new Error("MONGO_URI is not defined. Please set it in .env or pass it explicitly.");
    }

    await mongoose.connect(uri, {
      dbName,            // ✅ database name
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🚀 MongoDB connected to ${dbName}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err; // let server.js handle the failure
  }
};

export default connectDB;
