import Faculty from "../models/Faculty.js";
import jwt from "jsonwebtoken";

export const facultyLogin = async (req, res) => {
  console.log("🔥 Login API Called");
  console.log("📩 Request Body:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({ error: "Email & password required" });
    }

    console.log("🔍 Searching DB for:", email);

    const faculty = await Faculty.findOne({ email });

    console.log("🗂 Faculty Found:", faculty);

    if (!faculty) {
      console.log("❌ Faculty not found in DB");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    console.log("🔑 Comparing passwords:");
    console.log("➡ Entered Password:", password);
    console.log("➡ Stored Password:", faculty.password);

    if (faculty.password !== password) {
      console.log("❌ Password mismatch!");
      return res.status(400).json({ error: "Invalid email or password" });
    }

    console.log("✅ Password correct, generating token...");

    const token = jwt.sign(
      { id: faculty._id, role: "faculty" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("🎉 Login Successful! Token created.");

    return res.json({
      message: "Login success",
      token,
      faculty: {
        name: faculty.name,
        email: faculty.email
      }
    });

  } catch (error) {
    console.log("🔥 ERROR in facultyLogin:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
