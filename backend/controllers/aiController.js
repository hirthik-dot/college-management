// backend/controllers/aiController.js

import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

// In-memory conversation store
const conversations = {}; // { userId: [ {role, content}, ... ] }

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message required" });

    // Use default userId if not provided
    const userId = req.body.userId || "default_user";

    // Initialize conversation if it doesn't exist
    if (!conversations[userId]) {
      conversations[userId] = [
        {
          role: "system",
          content: `
You are the AI Assistant for the College Management System.
Available pages:
/student/dashboard
/student/assignments
/student/attendance
/student/grades
/student/profile
/student/ai

If user asks to open page, respond: NAVIGATE:/student/<page>
Be friendly.
`
        }
      ];
    }

    // Append user's message
    conversations[userId].push({ role: "user", content: message });

    // Call AI with full conversation history
    const resp = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: conversations[userId]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = resp.data?.choices?.[0]?.message?.content || resp.data?.choices?.[0]?.text || "Sorry, no reply";

    // Save AI response
    conversations[userId].push({ role: "assistant", content: reply });

    res.json({ reply });
  } 
  catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
};
