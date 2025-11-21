import express from "express";
import { facultyLogin } from "../controllers/facultyController.js";

const router = express.Router();

// POST: Faculty Login
router.post("/faculty/login", facultyLogin);

export default router;
