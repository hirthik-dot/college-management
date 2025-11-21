// backend/routes/adminRoutes.js
import express from "express";
import { adminLogin, adminStats } from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", authenticateToken, adminStats);

export default router;
