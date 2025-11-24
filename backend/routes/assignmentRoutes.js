import express from "express";
import { createAssignment, getAssignments } from "../controllers/assignmentController.js";

const router = express.Router();

// Faculty
router.post("/create", createAssignment);

// Students
router.get("/", getAssignments);

export default router;
