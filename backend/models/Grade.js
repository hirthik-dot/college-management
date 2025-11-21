// backend/models/Grade.js
import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  subject_code: { type: String, required: true },
  subject_name: String,
  semester: Number,
  credits: { type: Number, default: 3 },
  grade: String,
  year: Number,
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Grade", gradeSchema);
