import express from "express";
import { 
  createAnnouncement,
  getAnnouncements,
  viewAnnouncement,
  ackAnnouncement,
  markAnnouncementsAsRead,
  expireAnnouncement
} from "../controllers/announcementController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Announcement CRUD
router.post("/", authMiddleware, createAnnouncement); // only faculty can create
router.get("/", authMiddleware, getAnnouncements);   // students/faculty can view

router.patch("/:id/view", authMiddleware, viewAnnouncement);
router.patch("/:id/ack", authMiddleware, ackAnnouncement);
router.patch("/:id/expire", authMiddleware, expireAnnouncement); // ✅ single route

// Mark announcements as read
router.post("/mark-read", authMiddleware, markAnnouncementsAsRead);

export default router;
