// backend/models/Marksheet.js
import mongoose from "mongoose";

const markSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  semester: { type: String, required: true },
  file_name: { type: String, required: true },
  file_path: { type: String, required: true },
  uploaded_at: { type: Date, default: Date.now }
});

export default mongoose.model("Marksheet", markSchema);
