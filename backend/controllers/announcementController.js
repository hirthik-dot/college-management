import Announcement from "../models/announcementModel.js";
import User from "../models/User.js";

// Create announcement
export const createAnnouncement = async (req, res) => {
  try {
    const data = req.body;

    if (!data.title || !data.body)
      return res.status(400).json({ message: "Title and body are required" });

    const ann = await Announcement.create(data);
    res.status(201).json(ann);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all announcements (faculty or student)
export const getAnnouncements = async (req, res) => {
  try {
    const anns = await Announcement.find().sort({ postedAt: -1 });
    res.json(anns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment view count
export const viewAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const ann = await Announcement.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    res.json(ann);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark read (acknowledge)
export const ackAnnouncement = async (req, res) => {
  try {
    const ann = await Announcement.findByIdAndUpdate(
      req.params.id,
      { $inc: { acks: 1 } },
      { new: true }
    );
    res.json(ann);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Expire an announcement
export const expireAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const ann = await Announcement.findByIdAndUpdate(
      id,
      { status: "Expired" },
      { new: true }
    );
    if (!ann) return res.status(404).json({ message: "Announcement not found" });
    res.json(ann);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Step 3 — Mark announcements as read for a student
export const markAnnouncementsAsRead = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { announcementIds } = req.body;

    const user = await User.findById(userId);
    if (!user.readAnnouncements) user.readAnnouncements = [];

    // Add only new unread IDs
    announcementIds.forEach(id => {
      if (!user.readAnnouncements.includes(id)) {
        user.readAnnouncements.push(id);
      }
    });

    await user.save();

    res.json({ message: "Announcements marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
