import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  name: String,
  url: String,
});

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  category: { type: String, default: "General" },
  pinned: { type: Boolean, default: false },

  scheduledAt: { type: Date, default: null },
  postedAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },

  targets: { type: [String], default: ["All Students"] },
  attachments: [attachmentSchema],

  views: { type: Number, default: 0 },
  acks: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["Active", "Scheduled", "Expired"],
    default: "Active",
  }
});

const Announcement = mongoose.model("Announcement", announcementSchema);
export default Announcement;
