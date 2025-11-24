import Assignment from "../models/assignmentModel.js";

// Faculty creates assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, subject, description, due, maxMarks, createdBy } = req.body;

    if (!title || !subject || !due || !maxMarks)
      return res.status(400).json({ message: "All required fields must be filled" });

    const assignment = await Assignment.create({
      title,
      subject,
      description,
      due,
      maxMarks,
      createdBy,
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Students fetch all assignments
export const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
