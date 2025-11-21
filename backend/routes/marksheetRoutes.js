// backend/routes/marksheetRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { uploadMarksheet, listMarksheets } from "../controllers/marksheetController.js";
import { authenticateToken } from "../middleware/auth.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/marksheets/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/upload-marksheet", authenticateToken, upload.single("marksheet"), uploadMarksheet);
router.get("/marksheets", authenticateToken, listMarksheets);

export default router;
