// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    student_id: { type: String, unique: true, sparse: true }, // optional for admins
    admin_id: { type: String, unique: true, sparse: true },

    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: { type: String, enum: ["student", "admin", "faculty"], default: "student" },

    branch: String,
    year: Number,

    // 👇 NEW FIELD: Track which announcements student has opened
    readAnnouncements: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Announcement" }
    ]
  },
  { timestamps: true }
);

// Third argument forces Mongoose to use the 'students' collection
export default mongoose.model("User", userSchema, "students");
