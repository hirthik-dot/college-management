import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String },
    due: { type: Date, required: true },
    maxMarks: { type: Number, required: true },

    // optional file upload
    fileUrl: { type: String },

    // stats
    submissions: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    graded: { type: Number, default: 0 },

    tag: { type: String, default: "Assignment" }, // Quiz / Project / etc
    status: { type: String, enum: ["Open", "Closed", "Draft"], default: "Open" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  },
  { timestamps: true }
);

export default mongoose.model("Assignment", assignmentSchema);
