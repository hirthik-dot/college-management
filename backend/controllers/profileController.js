// backend/controllers/profileController.js
import User from "../models/User.js";
import Grade from "../models/Grade.js";

export const getProfile = async (req, res) => {
  try {
    const { email, student_id } = req.user;
    const profile = await User.findOne({ email }).lean();
    if (!profile) return res.status(404).json({ error: "User not found" });

    const arrearsCount = await Grade.countDocuments({ student_id, grade: { $in: ["F", "RA"] } });
    profile.has_arrears = arrearsCount > 0;
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
