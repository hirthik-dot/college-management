// backend/controllers/arrearsController.js
import Grade from "../models/Grade.js";

export const getArrears = async (req, res) => {
  try {
    const { student_id } = req.user;
    // adapt as needed if you kept a separate arrears collection
    const arrears = await Grade.find({ student_id, grade: { $in: ["F", "RA"] } }).select("subject_code subject_name semester credits");
    res.json({ arrears });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
