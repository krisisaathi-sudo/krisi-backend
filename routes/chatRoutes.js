import express from "express";
import OpenAI from "openai";

const router = express.Router();

// 🔑 OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Debugging: ensure API key loaded
console.log("🔑 Chat Route OpenAI Key:", process.env.OPENAI_API_KEY);

// 🗨️ Chatbot route
router.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // ya "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content: "You are a helpful smart farming advisor for Indian farmers."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: "No reply from OpenAI" });
    }

    res.json({ result: reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }
});

export default router;
