// backend/controllers/marksheetController.js
import Marksheet from "../models/Marksheet.js";
import fs from "fs-extra";
import path from "path";

export const uploadMarksheet = async (req, res) => {
  try {
    const { semester } = req.body;
    const { student_id } = req.user;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file_path = req.file.path;
    const file_name = req.file.filename;
    await Marksheet.create({ student_id, semester, file_name, file_path });
    res.json({ success: true, message: "Marksheet uploaded successfully", file: file_name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const listMarksheets = async (req, res) => {
  try {
    const { student_id } = req.user;
    const marksheets = await Marksheet.find({ student_id }).sort({ semester: 1 });
    res.json({ marksheets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
