// backend/routes/studentRoutes.js
import express from "express";
import { getProfile } from "../controllers/profileController.js";
import { getArrears } from "../controllers/arrearsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/profile", authenticateToken, getProfile);
router.get("/arrears", authenticateToken, getArrears);

export default router;
