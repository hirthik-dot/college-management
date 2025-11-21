// backend/models/ArrearQuestion.js
import mongoose from "mongoose";

const schema = new mongoose.Schema({
  subject_code: { type: String, required: true },
  question_text: String,
  year: Number,
  difficulty: String
}, { timestamps: true });

export default mongoose.model("ArrearQuestion", schema);
