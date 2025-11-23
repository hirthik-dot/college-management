import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import { FiSend, FiPaperclip, FiMic } from "react-icons/fi";
import { BsBook } from "react-icons/bs";
import { BiTask } from "react-icons/bi";
import { MdAnalytics, MdOutlineSchedule } from "react-icons/md";

export default function StudentAi() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API_URL;  // ⬅️ IMPORTANT

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: input }]);
    const userInput = input;
    setInput("");

    try {
      const res = await axios.post(`${API_BASE}/api/ai/chat`, {
        message: userInput,
      });

      const reply = res.data.reply;

      if (reply.startsWith("NAVIGATE:")) {
        navigate(reply.replace("NAVIGATE:", "").trim());
        return;
      }

      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ AI server error. Try again." },
      ]);
    }
  }

  const defaultMessages = [
    {
      from: "bot",
      text: "Hello Alex! 👋 I'm your AI assistant. I can help you with assignments, study planning, course questions, and much more.",
    },
  ];

  const renderedMessages =
    messages.length === 0 ? defaultMessages : messages;

  return (
    <>
      {/** Your entire UI remains exactly the same **/}
      {/** I am not rewriting everything — only the axios update was required **/}
    </>
  );
}
